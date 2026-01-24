
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic'; // Ensure real-time data

export async function GET() {
    try {
        // 1. Fetch all CAs
        const cas = await prisma.user.findMany({
            where: {
                role: 'CA',
                referralCode: { not: null }
            },
            select: {
                name: true,
                college: true,
                referralCode: true,
            }
        });

        // 2. Aggregate Referral Counts
        const leaderboard = await Promise.all(
            cas.map(async (ca) => {
                const count = await prisma.user.count({
                    where: {
                        referredBy: ca.referralCode as string
                    }
                });
                return {
                    name: ca.name,
                    college: ca.college,
                    referralCode: ca.referralCode,
                    referrals: count
                };
            })
        );

        // 3. Sort by Referrals (Descending)
        leaderboard.sort((a, b) => b.referrals - a.referrals);

        return NextResponse.json(leaderboard);
    } catch (error) {
        console.error("Public Leaderboard Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch leaderboard" },
            { status: 500 }
        );
    }
}
