import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
    try {
        const { email, task } = await request.json()

        if (!email || !task) {
            return NextResponse.json({ error: 'Missing Data' }, { status: 400 })
        }

        const supabase = await createClient()

        // Get user profile
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', email.toLowerCase())
            .single()

        if (profileError || !profile) {
            return NextResponse.json({ error: 'User Not Found' }, { status: 404 })
        }

        // Map task names to snake_case
        const taskFieldMap: Record<string, string> = {
            'taskInsta': 'task_insta',
            'taskLinkedIn': 'task_linkedin',
            'taskX': 'task_x',
            'taskFacebook': 'task_facebook',
            'taskCart': 'task_cart',
            'taskCart5': 'task_cart5',
            'taskCart10': 'task_cart10'
        }

        const taskField = taskFieldMap[task] || task

        // Check if task already completed
        if (profile[taskField as keyof typeof profile]) {
            return NextResponse.json({ error: 'Reward already claimed!' }, { status: 400 })
        }

        // Cart Verification for cart tasks
        if (task.startsWith('taskCart')) {
            const { data: cart } = await supabase
                .from('carts')
                .select(`
                    *,
                    cart_items (id)
                `)
                .eq('user_id', profile.id)
                .single()

            const cartCount = cart?.cart_items?.length || 0
            let required = 3
            if (task === 'taskCart5') required = 5
            if (task === 'taskCart10') required = 10

            if (cartCount < required) {
                return NextResponse.json({
                    error: `You need ${required - cartCount} more events in cart!`
                }, { status: 400 })
            }
        }

        // Award Coins
        let reward = 50
        if (task === 'taskCart5') reward = 100
        if (task === 'taskCart10') reward = 150

        // Update profile
        const { error: updateError } = await supabase
            .from('profiles')
            .update({
                [taskField]: true,
                ca_coins: profile.ca_coins + reward
            })
            .eq('id', profile.id)

        if (updateError) {
            console.error("Update error:", updateError)
            return NextResponse.json({ error: 'Failed to claim reward' }, { status: 500 })
        }

        // Create History
        await supabase
            .from('coin_history')
            .insert({
                user_id: profile.id,
                amount: reward,
                reason: `Completed Task: ${task}`
            })

        return NextResponse.json({
            success: true,
            coins: profile.ca_coins + reward,
            message: `You earned ${reward} coins!`
        }, { status: 200 })

    } catch (error) {
        console.error("Claim Error", error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
