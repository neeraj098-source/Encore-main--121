import { NextResponse } from 'next/server'
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { userId, eventSlug, teamName } = body

        if (!userId || !eventSlug || !teamName) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const supabase = await createClient()

        // Check if user is already in a team for this event (either as leader or member)
        const { data: existingAsLeader } = await supabase
            .from('teams')
            .select('id')
            .eq('event_slug', eventSlug)
            .eq('leader_id', userId)
            .single()

        if (existingAsLeader) {
            return NextResponse.json({ error: 'You are already in a team for this event' }, { status: 400 })
        }

        const { data: existingAsMember } = await supabase
            .from('team_members')
            .select('team_id, teams!inner(event_slug)')
            .eq('user_id', userId)
            .eq('teams.event_slug', eventSlug)
            .single()

        if (existingAsMember) {
            return NextResponse.json({ error: 'You are already in a team for this event' }, { status: 400 })
        }

        // Generate unique 6-char code
        let code = ''
        let isUnique = false
        while (!isUnique) {
            code = Math.floor(10000 + Math.random() * 90000).toString()
            const { data: check } = await supabase
                .from('teams')
                .select('code')
                .eq('code', code)
                .single()
            if (!check) isUnique = true
        }

        // Create team
        const { data: newTeam, error: teamError } = await supabase
            .from('teams')
            .insert({
                name: teamName,
                code: code,
                event_slug: eventSlug,
                leader_id: userId,
            })
            .select()
            .single()

        if (teamError) {
            console.error("Team creation error:", teamError)
            return NextResponse.json({ error: 'Failed to create team' }, { status: 500 })
        }

        // Add leader as member
        await supabase
            .from('team_members')
            .insert({
                team_id: newTeam.id,
                user_id: userId
            })

        return NextResponse.json({ success: true, team: newTeam }, { status: 201 })

    } catch (error) {
        console.error("Create Team Error", error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
