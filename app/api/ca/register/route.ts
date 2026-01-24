import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

        // Create CA User
        const newCA = await prisma.user.create({
            data: {
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
