import { NextResponse } from 'next/server'
import { createAdminClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const secret = searchParams.get('secret')
        const envSecret = process.env.ADMIN_SECRET || 'hensi43'

        if (secret !== envSecret) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const supabase = await createAdminClient()

        // Get all users with related data
        const { data: users, error } = await supabase
            .from('profiles')
            .select(`
                *,
                carts (
                    *,
                    cart_items (*)
                ),
                orders (
                    *,
                    order_items (*)
                ),
                coin_history (*)
            `)
            .order('created_at', { ascending: false })

        if (error) {
            console.error("Fetch error:", error)
            return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
        }

        return NextResponse.json({ users }, { status: 200 })

    } catch {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json()
        const { secret, userId, ...updates } = body
        const envSecret = process.env.ADMIN_SECRET || 'hensi43'

        if (secret !== envSecret) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const supabase = await createAdminClient()

        // Whitelist allowed fields for Admin Update (snake_case)
        const allowedFields = [
            'name', 'email', 'phone', 'college', 'year', 'accommodation',
            'role', 'payment_verified', 'profile_completed', 'referral_code'
        ]

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = {}

        for (const key of allowedFields) {
            // Handle both camelCase and snake_case input
            const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
            if (key in updates) {
                data[key] = updates[key]
            } else if (camelKey in updates) {
                data[key] = updates[camelKey]
            }
        }

        const { data: updatedUser, error } = await supabase
            .from('profiles')
            .update(data)
            .eq('id', userId)
            .select()
            .single()

        if (error) {
            console.error("Update Error:", error)
            return NextResponse.json({ error: 'Update Failed' }, { status: 500 })
        }

        return NextResponse.json({ success: true, user: updatedUser })
    } catch (error) {
        console.error("Update Error:", error)
        return NextResponse.json({ error: 'Update Failed' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const secret = searchParams.get('secret')
        const userId = searchParams.get('userId')
        const envSecret = process.env.ADMIN_SECRET || 'hensi43'

        if (secret !== envSecret) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        if (!userId) {
            return NextResponse.json({ error: 'UserId Required' }, { status: 400 })
        }

        const supabase = await createAdminClient()

        // Delete user from auth (this will cascade to profiles due to FK)
        const { error } = await supabase.auth.admin.deleteUser(userId)

        if (error) {
            console.error("Delete Error:", error)
            return NextResponse.json({ error: 'Delete Failed' }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Delete Error:", error)
        return NextResponse.json({ error: 'Delete Failed' }, { status: 500 })
    }
}
