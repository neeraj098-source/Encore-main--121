import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// const prisma = new PrismaClient();

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const secret = searchParams.get('secret');
        const envSecret = process.env.ADMIN_SECRET || 'encore_admin_2026'; // Fallback for testing

        // Simple security check
        if (secret !== envSecret) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                cart: {
                    include: {
                        items: true
                    }
                },
                orders: {
                    include: {
                        items: true
                    }
                }
            } // Include related data
        });

        return NextResponse.json({ users }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { secret, userId, password, ...updates } = body;
        const envSecret = process.env.ADMIN_SECRET || 'encore_admin_2026';

        if (secret !== envSecret) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data: any = { ...updates };

        // Handle Password Reset
        if (password && password.trim() !== "") {
            console.log("Admin: Resetting password for user", userId);
            const hashedPassword = await bcrypt.hash(password, 10);
            data.password = hashedPassword;
            console.log("Admin: Password hashed successfully");
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: data
        });

        return NextResponse.json({ success: true, user: updatedUser });
    } catch (error) {
        console.error("Update Error:", error);
        return NextResponse.json({ error: 'Update Failed' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const secret = searchParams.get('secret');
        const userId = searchParams.get('userId');
        const envSecret = process.env.ADMIN_SECRET || 'encore_admin_2026';

        if (secret !== envSecret) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!userId) {
            return NextResponse.json({ error: 'UserId Required' }, { status: 400 });
        }

        // Manual Cascade Delete
        await prisma.cart.deleteMany({ where: { userId } });
        await prisma.order.deleteMany({ where: { userId } });

        await prisma.user.delete({
            where: { id: userId }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete Error:", error);
        return NextResponse.json({ error: 'Delete Failed' }, { status: 500 });
    }
}
