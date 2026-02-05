import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        let { name, email, phone, college, year, accommodation, password, gender, referralCode } = body;

        // Normalize email
        email = email ? email.toLowerCase() : email;

        // Basic validation
        if (!name || !email) {
            return NextResponse.json({ error: 'Name and Email are required' }, { status: 400 });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
        }

        // Validate password
        if (!password || password.length < 6) {
            return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
        }

        const { newUser, referrerId } = await prisma.$transaction(async (tx) => {
            // Check if user exists (inside tx lock)
            const existingUser = await tx.user.findUnique({
                where: { email },
            });

            if (existingUser) {
                // Throwing error to abort transaction
                throw new Error('User already exists');
            }

            // Handle Referral
            let refId = null;
            if (referralCode) {
                const referrer = await tx.user.findUnique({
                    where: { referralCode: referralCode }
                });

                if (referrer) {
                    await tx.user.update({
                        where: { id: referrer.id },
                        data: {
                            caCoins: { increment: 50 },
                            coinHistory: {
                                create: {
                                    amount: 50,
                                    reason: `Referral Bonus: User Registration`
                                }
                            }
                        }
                    });
                    refId = referralCode;
                }
            }

            // Hash Password
            let hashedPassword = null;
            if (password) {
                hashedPassword = await bcrypt.hash(password.trim(), 10);
            }

            // Generate Unique 6-Digit ID
            let newId = '';
            let isUniqueId = false;
            while (!isUniqueId) {
                newId = Math.floor(100000 + Math.random() * 900000).toString();
                const existingId = await tx.user.findUnique({ where: { id: newId } });
                if (!existingId) isUniqueId = true;
            }

            // Generate Verification Token
            const emailVerificationToken = crypto.randomBytes(32).toString('hex');

            // Generate Referral Code for User (6-digit)
            // MERGED FROM MAIN branch logic
            let newReferralCode = '';
            let isUniqueCode = false;
            while (!isUniqueCode) {
                newReferralCode = Math.floor(100000 + Math.random() * 900000).toString();
                const existingCode = await tx.user.findUnique({ where: { referralCode: newReferralCode } });
                if (!existingCode) isUniqueCode = true;
            }

            // Create new user
            const createdUser = await tx.user.create({
                data: {
                    id: newId,
                    name,
                    email,
                    password: hashedPassword,
                    gender,
                    phone,
                    college,
                    year,
                    accommodation,
                    // Payment fields defaults
                    paymentId: null,
                    paymentScreenshot: null,
                    totalPaid: 0,
                    paymentVerified: false,

                    // Verification (New Feature)
                    emailVerified: false,
                    emailVerificationToken,

                    // Referral (Existing Feature)
                    referredBy: refId,
                    referralCode: newReferralCode
                },
            });

            return { newUser: createdUser, referrerId: refId };
        });

        // Send Verification Email
        if (newUser.emailVerificationToken) {
            await sendVerificationEmail(newUser.email, newUser.emailVerificationToken);
        }

        return NextResponse.json({
            message: 'Registration successful. Please check your email to verify your account.',
            user: newUser,
            exists: false
        }, { status: 201 });

    } catch (error) {
        console.error('Registration Error Details:', error);
        
        // Better error handling
        const errorMessage = (error as Error).message;
        
        if (errorMessage.includes('already exists')) {
            return NextResponse.json({ 
                error: 'This email is already registered. Please login instead.',
                details: errorMessage 
            }, { status: 409 });
        }

        return NextResponse.json({ 
            error: 'Registration failed',
            details: errorMessage 
        }, { status: 500 });
    }
}
