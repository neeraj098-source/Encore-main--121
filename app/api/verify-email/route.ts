import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { token } = await request.json();

        if (!token) {
            return NextResponse.json({ error: 'Token is required' }, { status: 400 });
        }

        const user = await prisma.user.findFirst({
            where: {
                emailVerificationToken: token,
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: true,
                emailVerificationToken: null, // Consume the token
            },
        });

        return NextResponse.json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error("Verification Error:", error);
        return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
    }
}
