import { NextResponse } from 'next/server'
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email } = body

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 })
        }

        const supabase = await createClient()

        // Get user profile
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', email.toLowerCase())
            .single()

        if (profileError || !profile) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Get teams where user is a member
        const { data: teamMembers, error: teamsError } = await supabase
            .from('team_members')
            .select(`
                team_id,
                teams (
                    *,
                    team_members (
                        user_id,
                        profiles (id, name, email)
                    )
                )
            `)
            .eq('user_id', profile.id)

        if (teamsError) {
            console.error("Teams fetch error:", teamsError)
            return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 })
        }

        // Extract teams from the response
        const teams = teamMembers?.map(tm => tm.teams) || []

        return NextResponse.json({ teams }, { status: 200 })

    } catch (error) {
        console.error("Fetch Teams Error", error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
