import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
    try {
        const supabase = await createClient()

        // Fetch all CAs with their referral codes
        const { data: cas, error: casError } = await supabase
            .from('profiles')
            .select('id, name, email, college, referral_code')
            .eq('role', 'CA')
            .not('referral_code', 'is', null)

        if (casError) {
            console.error("CA fetch error:", casError)
            return NextResponse.json({ error: "Failed to fetch CAs" }, { status: 500 })
        }

        // Build leaderboard with referral counts
        const leaderboard = await Promise.all(
            (cas || []).map(async (ca) => {
                const { count } = await supabase
                    .from('profiles')
                    .select('*', { count: 'exact', head: true })
                    .eq('referred_by', ca.referral_code)

                return {
                    id: ca.id,
                    name: ca.name,
                    email: ca.email,
                    college: ca.college,
                    referralCode: ca.referral_code,
                    referrals: count || 0
                }
            })
        )

        // Sort by Referrals (Descending)
        leaderboard.sort((a, b) => b.referrals - a.referrals)

        return NextResponse.json(leaderboard)
    } catch (error) {
        console.error("Leaderboard Error:", error)
        return NextResponse.json(
            { error: "Failed to fetch leaderboard" },
            { status: 500 }
        )
    }
}
