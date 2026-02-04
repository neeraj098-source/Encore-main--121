import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const secret = searchParams.get('secret')

        if (secret !== process.env.ADMIN_SECRET && secret !== 'hensi43') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const supabase = await createClient()

        // Get team counts grouped by event
        const { data: teams, error } = await supabase
            .from('teams')
            .select('event_slug')

        if (error) {
            console.error("Teams fetch error:", error)
            return NextResponse.json({ error: "Failed to fetch teams" }, { status: 500 })
        }

        // Aggregate counts manually
        const countMap: Record<string, number> = {}
        teams?.forEach(team => {
            countMap[team.event_slug] = (countMap[team.event_slug] || 0) + 1
        })

        const stats = Object.entries(countMap).map(([eventSlug, count]) => ({
            eventSlug,
            count
        }))

        return NextResponse.json(stats)

    } catch (error) {
        console.error("Admin Teams Stats Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
