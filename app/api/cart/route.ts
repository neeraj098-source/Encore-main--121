import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { eventsData } from "@/lib/data"

export async function GET() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's cart with items
    const { data: cart } = await supabase
        .from('carts')
        .select(`
            *,
            cart_items (*)
        `)
        .eq('user_id', user.id)
        .single()

    return NextResponse.json(cart || { items: [] })
}

export async function POST(req: NextRequest) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { eventSlug } = await req.json()
    const event = eventsData.find((e) => e.slug === eventSlug)

    if (!event) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Get or create cart
    let { data: cart } = await supabase
        .from('carts')
        .select('*')
        .eq('user_id', user.id)
        .single()

    if (!cart) {
        const { data: newCart, error: cartError } = await supabase
            .from('carts')
            .insert({ user_id: user.id })
            .select()
            .single()

        if (cartError) {
            return NextResponse.json({ error: "Failed to create cart" }, { status: 500 })
        }
        cart = newCart
    }

    // Check if item already exists
    const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('cart_id', cart.id)
        .eq('event_slug', eventSlug)
        .single()

    if (existingItem) {
        return NextResponse.json({ message: "Item already in cart" }, { status: 409 })
    }

    // Add to cart
    const { data: newItem, error: itemError } = await supabase
        .from('cart_items')
        .insert({
            cart_id: cart.id,
            event_slug: event.slug,
            event_name: event.title,
            price: event.price || 0,
        })
        .select()
        .single()

    if (itemError) {
        return NextResponse.json({ error: "Failed to add item" }, { status: 500 })
    }

    return NextResponse.json(newItem)
}

export async function DELETE(req: NextRequest) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const cartItemId = searchParams.get("id")

    if (!cartItemId) {
        return NextResponse.json({ error: "Cart Item ID required" }, { status: 400 })
    }

    // Get user's cart
    const { data: cart } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', user.id)
        .single()

    if (!cart) {
        return NextResponse.json({ error: "Cart not found" }, { status: 404 })
    }

    // Delete item (only if it belongs to user's cart)
    await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId)
        .eq('cart_id', cart.id)

    return NextResponse.json({ success: true })
}
