import { NextResponse } from 'next/server'
import { createClient } from "@/lib/supabase/server"
import { eventsData } from '@/lib/data'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { userId, teamCode } = body

        if (!userId || !teamCode) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const supabase = await createClient()

        // Find Team with members count
        const { data: team, error: teamError } = await supabase
            .from('teams')
            .select(`
                *,
                team_members (user_id)
            `)
            .eq('code', teamCode)
            .single()

        if (teamError || !team) {
            return NextResponse.json({ error: 'Invalid Team Code' }, { status: 404 })
        }

        // Check Event Constraints
        const event = eventsData.find(e => e.slug === team.event_slug)
        if (!event) {
            return NextResponse.json({ error: 'Event data not found' }, { status: 500 })
        }

        const maxMembers = event.maxSize || 5

        if (team.team_members && team.team_members.length >= maxMembers) {
            return NextResponse.json({ error: 'Team is full!' }, { status: 400 })
        }

        // Check if user is already in a team for this event (as leader)
        const { data: existingAsLeader } = await supabase
            .from('teams')
            .select('id')
            .eq('event_slug', team.event_slug)
            .eq('leader_id', userId)
            .single()

        if (existingAsLeader) {
            return NextResponse.json({ error: 'You are already in a team for this event' }, { status: 400 })
        }

        // Check if already a member
        const { data: existingMember } = await supabase
            .from('team_members')
            .select('id, teams!inner(event_slug)')
            .eq('user_id', userId)
            .eq('teams.event_slug', team.event_slug)
            .single()

        if (existingMember) {
            return NextResponse.json({ error: 'You are already in a team for this event' }, { status: 400 })
        }

        // Add User to team
        const { error: joinError } = await supabase
            .from('team_members')
            .insert({
                team_id: team.id,
                user_id: userId
            })

        if (joinError) {
            console.error("Join error:", joinError)
            return NextResponse.json({ error: 'Failed to join team' }, { status: 500 })
        }

        return NextResponse.json({ success: true, teamName: team.name }, { status: 200 })

    } catch (error) {
        console.error("Join Team Error", error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
