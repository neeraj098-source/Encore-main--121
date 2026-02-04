import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, ...updates } = body

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 })
        }

        const supabase = await createClient()

        // Get user by email
        const { data: profile, error: fetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', email.toLowerCase())
            .single()

        if (fetchError || !profile) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Handle Profile Completion Bonus
        if (updates.profileCompleted && !profile.profile_completed) {
            // Add 50 coins for profile completion
            await supabase
                .from('profiles')
                .update({
                    profile_completed: true,
                    ca_coins: profile.ca_coins + 50
                })
                .eq('id', profile.id)

            // Log coin history
            await supabase
                .from('coin_history')
                .insert({
                    user_id: profile.id,
                    amount: 50,
                    reason: 'Profile Completion Bonus'
                })
        }

        // Whitelist allowed fields
        const allowedFields = ['college', 'year', 'phone', 'profile_completed', 'gender', 'accommodation']
        const filteredUpdates: Record<string, string | boolean> = {}

        for (const key of allowedFields) {
            // Handle camelCase to snake_case conversion
            const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase()
            if (key in updates) {
                filteredUpdates[snakeKey] = updates[key]
            } else if (snakeKey in updates) {
                filteredUpdates[snakeKey] = updates[snakeKey]
            }
        }

        // Apply updates
        const { data: updatedUser, error: updateError } = await supabase
            .from('profiles')
            .update(filteredUpdates)
            .eq('email', email.toLowerCase())
            .select()
            .single()

        if (updateError) {
            console.error('Update Error:', updateError)
            return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            user: updatedUser,
            message: "Profile Updated Successfully"
        }, { status: 200 })

    } catch (error) {
        console.error("Update Error", error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
