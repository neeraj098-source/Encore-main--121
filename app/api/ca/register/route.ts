import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, phone, college } = body;

        // Basic validation
        if (!name || !email) {
            return NextResponse.json({ error: 'Name and Email are required' }, { status: 400 });
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        // Generate Referral Code (Random 5-digit number)
        const code = Math.floor(10000 + Math.random() * 90000).toString();

        // Generate Unique 6-Digit ID
        let newId = '';
        let isUniqueId = false;
        while (!isUniqueId) {
            newId = Math.floor(100000 + Math.random() * 900000).toString();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const existingId = await prisma.user.findUnique({ where: { id: newId } });
            if (!existingId) isUniqueId = true;
        }

        // Create CA User
        const newCA = await prisma.user.create({
            data: {
                id: newId,
                name,
                email,
                phone,
                college,
                role: 'CA',
                referralCode: code,
                caCoins: 0
            },
        });

        return NextResponse.json({
            message: 'CA Registration successful',
            user: newCA,
            code: code
        }, { status: 201 });

    } catch (error) {
        console.error('CA Registration Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
