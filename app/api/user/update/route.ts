import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, ...updates } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Wrapp in transaction for atomicity
        const updatedUser = await prisma.$transaction(async (tx) => {

            // 1. Handle Profile Completion Bonus Atomically
            if (updates.profileCompleted) {
                const bonusResult = await tx.user.updateMany({
                    where: {
                        email,
                        profileCompleted: false // Only if currently false
                    },
                    data: {
                        profileCompleted: true, // Set to true
                        caCoins: { increment: 50 } // Award coins
                    }
                });

                if (bonusResult.count > 0) {
                    // Bonus was awarded, log history
                    await tx.coinHistory.create({
                        data: {
                            user: { connect: { email } },
                            amount: 50,
                            reason: "Profile Completion Bonus"
                        }
                    });
                }
            }

            // 2. Prepare generic updates
            // Whitelist allowed fields to prevent arbitrary updates (e.g., role, coins)
            const allowedFields = ['college', 'year', 'phone', 'profileCompleted'];
            const filteredUpdates: Record<string, string | boolean> = {};

            for (const key of allowedFields) {
                if (key in updates) {
                    filteredUpdates[key] = updates[key];
                }
            }

            // 3. Apply updates (including profileCompleted if it was passed, 
            // which is fine to re-set to true, or set other fields like phone/college)
            // This also explicitly verifies the user exists (throws if not found).
            return await tx.user.update({
                where: { email },
                data: filteredUpdates
            });
        });

        return NextResponse.json({
            success: true,
            user: updatedUser,
            message: "Profile Updated Successfully"
        }, { status: 200 });

    } catch (error) {
        console.error("Update Error", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
