import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { email, task } = await request.json();

        if (!email || !task) {
            return NextResponse.json({ error: 'Missing Data' }, { status: 400 });
        }

        const result = await prisma.$transaction(async (tx) => {
            // Cart Verification inside transaction
            if (task.startsWith('taskCart')) {
                const userWithCart = await tx.user.findUnique({
                    where: { email },
                    include: { cart: { include: { items: true } } }
                });

                if (!userWithCart) throw new Error('User Not Found');

                const cartCount = userWithCart.cart?.items.length || 0;
                let required = 3;
                if (task === 'taskCart5') required = 5;
                if (task === 'taskCart10') required = 10;

                if (cartCount < required) {
                    throw new Error(`You need ${required - cartCount} more events in cart!`);
                }
            }

            // Award Coins
            let reward = 50;
            if (task === 'taskCart5') reward = 100;
            if (task === 'taskCart10') reward = 150;

            // Atomic Update: Only update if the task is currently false
            const updateResult = await tx.user.updateMany({
                where: {
                    email,
                    [task]: false // ATOMIC GUARD
                },
                data: {
                    [task]: true,
                    caCoins: { increment: reward },
                }
            });

            if (updateResult.count === 0) {
                // Check if user exists to give better error
                const userExists = await tx.user.findUnique({ where: { email } });
                if (!userExists) throw new Error('User Not Found');

                // If user exists, it means task was already true
                throw new Error('Reward already claimed!');
            }

            // Create History (Since updateMany doesn't support nested writes)
            await tx.coinHistory.create({
                data: {
                    user: { connect: { email } },
                    amount: reward,
                    reason: `Completed Task: ${task}`
                }
            });

            // Fetch final balance to return
            const finalUser = await tx.user.findUnique({ where: { email } });

            return { coins: finalUser?.caCoins || 0, reward };
        });

        return NextResponse.json({
            success: true,
            coins: result.coins,
            message: `You earned ${result.reward} coins!`
        }, { status: 200 });

    } catch (error) {
        console.error("Claim Error", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
