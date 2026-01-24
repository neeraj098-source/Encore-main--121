
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // 1. Fetch all CAs
        const cas = await prisma.user.findMany({
            where: {
                role: 'CA',
                referralCode: { not: null } // Ensure they have a code
            },
            select: {
                id: true,
                name: true,
                email: true,
                referralCode: true,
                college: true
            }
        });

        // 2. Aggregate Referral Counts
        // Use Promise.all to fetch counts in parallel
        const leaderboard = await Promise.all(
            cas.map(async (ca) => {
                const count = await prisma.user.count({
                    where: {
                        referredBy: ca.referralCode
                    }
                });
                return {
                    ...ca,
                    referrals: count
                };
            })
        );

        // 3. Sort by Referrals (Descending)
        leaderboard.sort((a, b) => b.referrals - a.referrals);

        return NextResponse.json(leaderboard);
    } catch (error) {
        console.error("Leaderboard Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch leaderboard" },
            { status: 500 }
        );
    }
}
