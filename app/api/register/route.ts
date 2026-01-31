import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, phone, college, year, accommodation, paymentId, password, gender, referralCode } = body;

        // Basic validation
        if (!name || !email) {
            return NextResponse.json({ error: 'Name and Email are required' }, { status: 400 });
        }

        const { newUser, referrerId } = await prisma.$transaction(async (tx) => {
            // Check if user exists (inside tx lock)
            const existingUser = await tx.user.findUnique({
                where: { email },
            });

            if (existingUser) {
                // Throwing error to abort transaction
                throw new Error('User already exists');
            }

            // Handle Referral
            let refId = null;
            if (referralCode) {
                const referrer = await tx.user.findUnique({
                    where: { referralCode: referralCode }
                });

                if (referrer) {
                    await tx.user.update({
                        where: { id: referrer.id },
                        data: {
                            caCoins: { increment: 50 },
                            coinHistory: {
                                create: {
                                    amount: 50,
                                    reason: `Referral Bonus: User Registration`
                                }
                            }
                        }
                    });
                    refId = referralCode;
                }
            }

            // Hash Password
            let hashedPassword = null;
            if (password) {
                hashedPassword = await bcrypt.hash(password.trim(), 10);
            }

            // Generate Unique 6-Digit ID
            let newId = '';
            let isUniqueId = false;
            while (!isUniqueId) {
                newId = Math.floor(100000 + Math.random() * 900000).toString();
                const existingId = await tx.user.findUnique({ where: { id: newId } });
                if (!existingId) isUniqueId = true;
            }

            // Create new user
            const createdUser = await tx.user.create({
                data: {
                    id: newId,
                    name,
                    email,
                    password: hashedPassword,
                    gender,
                    phone,
                    college,
                    year,
                    accommodation,
                    paymentId,
                    paymentScreenshot: body.paymentScreenshot,
                    totalPaid: body.totalPaid || (accommodation === 'yes' ? 999 : 399),
                    paymentVerified: false,
                    referredBy: refId
                },
            });

            return { newUser: createdUser, referrerId: refId };
        });

        return NextResponse.json({
            message: 'Registration successful',
            user: newUser,
            exists: false
        }, { status: 201 });

    } catch (error) {
        console.error('Registration Error Details:', error); // Changed log message
        return NextResponse.json({ error: 'Internal Server Error', details: (error as Error).message }, { status: 500 });
    }
}
