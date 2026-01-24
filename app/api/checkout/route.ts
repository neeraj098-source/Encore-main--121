
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get User and Cart
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            cart: {
                include: { items: true },
            },
        },
    });

    if (!user || !user.cart || user.cart.items.length === 0) {
        return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const { passType, paymentId, paymentScreenshot } = await req.json().catch(() => ({ passType: null }));

    const cartItems = user.cart.items;
    let totalAmount = cartItems.reduce((sum, item) => sum + item.price, 0);

    // Add Pass Price (Only if not already paid)
    let passPrice = 0;
    if (user.totalPaid === 0) {
        if (passType === 'basic') passPrice = 399;
        if (passType === 'accommodation') passPrice = 999;
    }
    totalAmount += passPrice;

    // Validate Payment Proof for Paid Orders
    if (totalAmount > 0 && (!paymentId || !paymentScreenshot)) {
        return NextResponse.json({ error: "Payment proof missing" }, { status: 400 });
    }

    // Create Order
    const order = await prisma.order.create({
        data: {
            userId: user.id,
            totalAmount: totalAmount,
            status: "PENDING",
            passType: passType,
            paymentId: paymentId,
            paymentScreenshot: paymentScreenshot,
            items: {
                create: cartItems.map((item) => ({
                    eventSlug: item.eventSlug,
                    eventName: item.eventName,
                    price: item.price,
                })),
            },
        },
    });

    // Clear Cart
    await prisma.cartItem.deleteMany({
        where: { cartId: user.cart.id },
    });

    return NextResponse.json({ success: true, orderId: order.id });
}
