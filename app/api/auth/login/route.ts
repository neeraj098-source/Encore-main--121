import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json()

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
        }

        const supabase = await createClient()

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.toLowerCase().trim(),
            password
        })

        if (error) {
            console.error('Login Error:', error)

            if (error.message.includes('Invalid login credentials')) {
                return NextResponse.json({
                    error: 'Invalid email or password'
                }, { status: 401 })
            }

            if (error.message.includes('Email not confirmed')) {
                return NextResponse.json({
                    error: 'Please verify your email before logging in'
                }, { status: 401 })
            }

            return NextResponse.json({
                error: 'Login failed',
                details: error.message
            }, { status: 500 })
        }

        // Fetch user profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single()

        return NextResponse.json({
            message: 'Login successful',
            user: {
                id: data.user.id,
                email: data.user.email,
                ...profile
            },
            session: data.session
        }, { status: 200 })

    } catch (error) {
        console.error('Login Error:', error)
        return NextResponse.json({
            error: 'Login failed',
            details: (error as Error).message
        }, { status: 500 })
    }
}
