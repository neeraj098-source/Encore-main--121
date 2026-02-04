import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user profile and cart
    const { data: profile } = await supabase
        .from('profiles')
        .select('total_paid')
        .eq('id', user.id)
        .single()

    const { data: cart } = await supabase
        .from('carts')
        .select(`
            *,
            cart_items (*)
        `)
        .eq('user_id', user.id)
        .single()

    if (!cart || !cart.cart_items || cart.cart_items.length === 0) {
        return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    const { passType, paymentId, paymentScreenshot } = await req.json().catch(() => ({ passType: null }))

    const cartItems = cart.cart_items
    let totalAmount = cartItems.reduce((sum: number, item: { price: number }) => sum + item.price, 0)

    // Add Pass Price (Only if not already paid)
    let passPrice = 0
    let securityDeposit = 0
    if (!profile?.total_paid || profile.total_paid === 0) {
        if (passType === 'basic') passPrice = 399
        if (passType === 'accommodation') passPrice = 999

        if (passPrice > 0) {
            securityDeposit = 200
        }
    }
    totalAmount += passPrice + securityDeposit

    // Validate Payment Proof for Paid Orders
    if (totalAmount > 0 && (!paymentId || !paymentScreenshot)) {
        return NextResponse.json({ error: "Payment proof missing" }, { status: 400 })
    }

    // Create Order
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            user_id: user.id,
            total_amount: totalAmount,
            status: 'PENDING',
            pass_type: passType,
            payment_id: paymentId,
            payment_screenshot: paymentScreenshot,
            security_deposit: securityDeposit,
        })
        .select()
        .single()

    if (orderError) {
        console.error('Order creation error:', orderError)
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    // Create Order Items
    const orderItems = cartItems.map((item: { event_slug: string; event_name: string; price: number }) => ({
        order_id: order.id,
        event_slug: item.event_slug,
        event_name: item.event_name,
        price: item.price,
    }))

    await supabase
        .from('order_items')
        .insert(orderItems)

    // Clear Cart
    await supabase
        .from('cart_items')
        .delete()
        .eq('cart_id', cart.id)

    return NextResponse.json({ success: true, orderId: order.id })
}
