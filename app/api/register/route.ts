import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        let { name, email, phone, college, year, accommodation, password, gender, referralCode } = body

        // Normalize email
        email = email ? email.toLowerCase().trim() : email

        // Basic validation
        if (!name || !email) {
            return NextResponse.json({ error: 'Name and Email are required' }, { status: 400 })
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
        }

        // Validate password
        if (!password || password.length < 6) {
            return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 })
        }

        const supabase = await createClient()

        // Sign up with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    gender,
                    phone,
                    college,
                    year,
                    accommodation,
                    referralCode
                }
            }
        })

        if (authError) {
            console.error('Supabase Auth Error:', authError)

            if (authError.message.includes('already registered')) {
                return NextResponse.json({
                    error: 'This email is already registered. Please login instead.',
                }, { status: 409 })
            }

            return NextResponse.json({
                error: 'Registration failed',
                details: authError.message
            }, { status: 500 })
        }

        if (!authData.user) {
            return NextResponse.json({
                error: 'Registration failed - no user created'
            }, { status: 500 })
        }

        // Generate unique referral code
        const generateReferralCode = () => Math.floor(100000 + Math.random() * 900000).toString()
        let newReferralCode = generateReferralCode()

        // Ensure referral code is unique
        let { data: existingCode } = await supabase
            .from('profiles')
            .select('referral_code')
            .eq('referral_code', newReferralCode)
            .single()

        while (existingCode) {
            newReferralCode = generateReferralCode()
            const result = await supabase
                .from('profiles')
                .select('referral_code')
                .eq('referral_code', newReferralCode)
                .single()
            existingCode = result.data
        }

        // Update the profile with additional data
        const { error: profileError } = await supabase
            .from('profiles')
            .update({
                name,
                gender,
                phone,
                college,
                year,
                accommodation,
                referral_code: newReferralCode,
                referred_by: referralCode || null
            })
            .eq('id', authData.user.id)

        if (profileError) {
            console.error('Profile Update Error:', profileError)
            // Profile was created by trigger, this is just additional data
        }

        // Handle referral bonus if valid referral code provided
        if (referralCode) {
            const { data: referrer } = await supabase
                .from('profiles')
                .select('id, ca_coins')
                .eq('referral_code', referralCode)
                .single()

            if (referrer) {
                // Add 50 coins to referrer
                await supabase
                    .from('profiles')
                    .update({ ca_coins: referrer.ca_coins + 50 })
                    .eq('id', referrer.id)

                // Add to coin history
                await supabase
                    .from('coin_history')
                    .insert({
                        user_id: referrer.id,
                        amount: 50,
                        reason: 'Referral Bonus: User Registration'
                    })
            }
        }

        return NextResponse.json({
            message: 'Registration successful. Please check your email to verify your account.',
            user: {
                id: authData.user.id,
                email: authData.user.email,
                name
            },
            exists: false
        }, { status: 201 })

    } catch (error) {
        console.error('Registration Error Details:', error)

        const errorMessage = (error as Error).message

        return NextResponse.json({
            error: 'Registration failed',
            details: errorMessage
        }, { status: 500 })
    }
}
