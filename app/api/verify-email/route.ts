import { NextResponse } from 'next/server'

// Note: Supabase handles email verification automatically.
// This route is kept for backwards compatibility but may not be needed.
// Users click the verification link from Supabase Auth, which goes to /api/auth/callback

export async function POST(request: Request) {
    try {
        const { token } = await request.json()

        if (!token) {
            return NextResponse.json({ error: 'Token is required' }, { status: 400 })
        }

        // With Supabase Auth, email verification is handled automatically
        // via the confirmation link sent by Supabase.
        // This endpoint is deprecated but kept for any legacy integrations.

        return NextResponse.json({
            message: 'Email verification is now handled automatically by Supabase Auth',
            info: 'Please use the verification link sent to your email.'
        })
    } catch (error) {
        console.error("Verification Error:", error)
        return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
    }
}

export async function GET(request: Request) {
    // Handle GET requests for email verification links
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    const type = searchParams.get('type')

    // Redirect to the auth callback which handles the token exchange
    if (token && type === 'email') {
        return NextResponse.redirect(
            new URL(`/api/auth/callback?code=${token}`, request.url)
        )
    }

    return NextResponse.json({
        message: 'Email verification is handled via Supabase Auth callback'
    })
}
