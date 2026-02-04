// Database types for Supabase tables
// These match the schema in supabase/schema.sql

export type Profile = {
    id: string
    name: string
    email: string
    gender: string | null
    phone: string | null
    college: string | null
    year: string | null
    accommodation: string | null
    payment_id: string | null
    payment_screenshot: string | null
    total_paid: number
    payment_verified: boolean
    profile_completed: boolean
    role: 'USER' | 'CA' | 'ADMIN'
    referral_code: string | null
    referred_by: string | null
    ca_coins: number
    task_insta: boolean
    task_linkedin: boolean
    task_x: boolean
    task_facebook: boolean
    task_cart: boolean
    task_cart5: boolean
    task_cart10: boolean
    created_at: string
}

export type Cart = {
    id: string
    user_id: string
    created_at: string
    updated_at: string
}

export type CartItem = {
    id: string
    cart_id: string
    event_slug: string
    event_name: string
    price: number
    created_at: string
}

export type Order = {
    id: string
    user_id: string
    total_amount: number
    status: 'PENDING' | 'PAID' | 'FAILED'
    payment_id: string | null
    payment_screenshot: string | null
    pass_type: 'basic' | 'premium' | null
    security_deposit: number
    created_at: string
    updated_at: string
}

export type OrderItem = {
    id: string
    order_id: string
    event_slug: string
    event_name: string
    price: number
}

export type CoinHistory = {
    id: string
    user_id: string
    amount: number
    reason: string
    created_at: string
}

export type Team = {
    id: string
    name: string
    code: string
    event_slug: string
    leader_id: string
    created_at: string
    updated_at: string
}

export type TeamMember = {
    id: string
    team_id: string
    user_id: string
    joined_at: string
}

// Database schema type for Supabase client
export type Database = {
    public: {
        Tables: {
            profiles: {
                Row: Profile
                Insert: Partial<Profile> & { id: string; email: string; name: string }
                Update: Partial<Profile>
            }
            carts: {
                Row: Cart
                Insert: Partial<Cart> & { user_id: string }
                Update: Partial<Cart>
            }
            cart_items: {
                Row: CartItem
                Insert: Omit<CartItem, 'id' | 'created_at'>
                Update: Partial<CartItem>
            }
            orders: {
                Row: Order
                Insert: Omit<Order, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Order>
            }
            order_items: {
                Row: OrderItem
                Insert: Omit<OrderItem, 'id'>
                Update: Partial<OrderItem>
            }
            coin_history: {
                Row: CoinHistory
                Insert: Omit<CoinHistory, 'id' | 'created_at'>
                Update: Partial<CoinHistory>
            }
            teams: {
                Row: Team
                Insert: Omit<Team, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Team>
            }
            team_members: {
                Row: TeamMember
                Insert: Omit<TeamMember, 'id' | 'joined_at'>
                Update: Partial<TeamMember>
            }
        }
    }
}
