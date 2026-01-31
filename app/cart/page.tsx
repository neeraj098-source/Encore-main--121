
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ShoppingCart, ArrowRight } from "lucide-react";

interface CartItem {
    id: string;
    eventName: string;
    eventSlug: string;
    price: number;
}

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const res = await fetch("/api/cart");
            if (res.ok) {
                const data = await res.json();
                setCartItems(data.items || []);
            }
        } catch (error) {
            console.error("Failed to fetch cart", error);
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = async (itemId: string) => {
        try {
            const res = await fetch(`/api/cart?id=${itemId}`, { method: "DELETE" });
            if (res.ok) {
                setCartItems((prev) => prev.filter((item) => item.id !== itemId));
                // Trigger a custom event to update navbar count
                window.dispatchEvent(new Event("cart-updated"));
            }
        } catch (error) {
            console.error("Failed to remove item", error);
        }
    };

    const total = cartItems.reduce((sum, item) => sum + item.price, 0);

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex justify-center items-center text-gold">
                Loading Cart...
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-cinzel text-gold mb-8 text-center">
                Your Cart
            </h1>

            {cartItems.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm">
                    <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-marcellus text-white mb-2">
                        Your cart is empty
                    </h2>
                    <p className="text-gray-400 mb-6">
                        Looks like you haven&apos;t added any events yet.
                    </p>
                    <button
                        onClick={() => router.push("/events")}
                        className="px-6 py-2 bg-gradient-to-r from-gold to-amber-600 text-black font-semibold rounded-full hover:scale-105 transition-transform"
                    >
                        Browse Events
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        <AnimatePresence>
                            {cartItems.map((item) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4"
                                >
                                    <div className="flex items-center gap-4 w-full sm:w-auto">
                                        <div className="w-16 h-16 relative rounded-md overflow-hidden bg-gray-800">
                                            <Image
                                                src={`/images/event/${[
                                                    "darpan", "reel-making", "treasure-hunt", "marketing-mania", "picture-story", "dance-battle",
                                                    "debate", "open-stage", "solo-singing", "band-war", "graffiti", "face-painting", "monoact",
                                                    "tshirt-painting", "case-study", "live-sketching", "pageant", "relay-rangoli", "nukkad",
                                                    "rap-battle", "mimicry", "solo-dance", "short-film", "auction", "mun", "twist-a-tale",
                                                    "group-dance", "jam"
                                                ].indexOf(item.eventSlug) + 1
                                                    }.jpg`} // Quick hack for image mapping based on slug order provided in data.ts or just a placeholder
                                                alt={item.eventName}
                                                fill
                                                className="object-cover"
                                                // Fallback image if mapping fails
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = "/images/logo.png"
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-marcellus text-white">
                                                {item.eventName}
                                            </h3>
                                            <p className="text-gold font-bold">₹{item.price}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Checkout Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/5 border border-white/10 rounded-lg p-6 sticky top-24">
                            <h2 className="text-2xl font-cinzel text-white mb-6">Summary</h2>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotal ({cartItems.length} items)</span>
                                    <span>₹{total}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Platform Fee</span>
                                    <span>₹0</span>
                                </div>
                                <div className="h-px bg-white/10 my-2" />
                                <div className="flex justify-between text-xl font-bold text-gold">
                                    <span>Total</span>
                                    <span>₹{total}</span>
                                </div>
                            </div>

                            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg mb-2">
                                <p className="text-yellow-500 text-xs text-center font-bold">
                                    PAYMENT TEMPORARILY DISABLED
                                </p>
                            </div>
                            <button
                                disabled
                                className="w-full py-3 bg-gray-700 text-gray-400 font-bold rounded-lg flex items-center justify-center gap-2 cursor-not-allowed opacity-50"
                            >
                                Payments Coming Soon
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
