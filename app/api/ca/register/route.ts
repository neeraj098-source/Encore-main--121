import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, phone, college } = body

        // Basic validation
        if (!name || !email) {
            return NextResponse.json({ error: 'Name and Email are required' }, { status: 400 })
        }

        const supabase = await createAdminClient()

        // Check if user exists
        const { data: existingUser } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', email.toLowerCase())
            .single()

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 })
        }

        // Generate Referral Code
        const code = Math.floor(10000 + Math.random() * 90000).toString()

        // Generate Temporary Password
        const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString()
        const tempPassword = `Encore@${randomSuffix}`

        // Create user via Supabase Auth (admin API)
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: email.toLowerCase(),
            password: tempPassword,
            email_confirm: true, // Auto-verify email for admin-created accounts
            user_metadata: {
                name,
                phone,
                college,
                role: 'CA'
            }
        })

        if (authError) {
            console.error('Auth Error:', authError)
            return NextResponse.json({ error: 'Failed to create CA' }, { status: 500 })
        }

        // Update profile with CA-specific data
        const { error: profileError } = await supabase
            .from('profiles')
            .update({
                name,
                phone,
                college,
                role: 'CA',
                referral_code: code,
                ca_coins: 0
            })
            .eq('id', authData.user.id)

        if (profileError) {
            console.error('Profile Error:', profileError)
        }

        return NextResponse.json({
            message: 'CA Registration successful',
            user: {
                id: authData.user.id,
                name,
                email,
                phone,
                college,
                role: 'CA',
                referralCode: code
            },
            code: code,
            password: tempPassword // Return Plain Text Password for Admin to see ONCE
        }, { status: 201 })

    } catch (error) {
        console.error('CA Registration Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
