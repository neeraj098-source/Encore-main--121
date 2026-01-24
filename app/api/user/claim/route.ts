import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const { email, task } = await request.json();

        if (!email || !task) {
            return NextResponse.json({ error: 'Missing Data' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return NextResponse.json({ error: 'User Not Found' }, { status: 404 });
        }

        // Check if already claimed
        // @ts-ignore
        if (user[task]) {
            return NextResponse.json({ error: 'Reward already claimed!' }, { status: 400 });
        }

        const validTasks = ['taskInsta', 'taskLinkedIn', 'taskX', 'taskFacebook', 'taskCart', 'taskCart5', 'taskCart10'];
        if (!validTasks.includes(task)) {
            return NextResponse.json({ error: 'Invalid Task' }, { status: 400 });
        }

        // Special Verification for Cart Quest
        if (task.startsWith('taskCart')) {
            const userWithCart = await prisma.user.findUnique({
                where: { email },
                include: { cart: { include: { items: true } } }
            });

            const cartCount = userWithCart?.cart?.items.length || 0;
            let required = 3;
            if (task === 'taskCart5') required = 5;
            if (task === 'taskCart10') required = 10;

            if (cartCount < required) {
                return NextResponse.json({ error: `You need ${required - cartCount} more events in cart!` }, { status: 400 });
            }
        }

        // Award Coins
        let REWARD_AMOUNT = 50;
        if (task === 'taskCart5') REWARD_AMOUNT = 100;
        if (task === 'taskCart10') REWARD_AMOUNT = 150;

        await prisma.user.update({
            where: { email },
            data: {
                [task]: true,
                caCoins: { increment: REWARD_AMOUNT }
            }
        });

        return NextResponse.json({
            success: true,
            coins: user.caCoins + REWARD_AMOUNT,
            message: `You earned ${REWARD_AMOUNT} coins!`
        }, { status: 200 });

    } catch (error) {
        console.error("Claim Error", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
