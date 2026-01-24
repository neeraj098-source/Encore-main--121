"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ShoppingCart, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

interface CartItem {
    id: string;
    eventName: string;
    eventSlug: string;
    price: number;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Listen for global cart updates
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await fetch("/api/cart");
                if (res.ok) {
                    const data = await res.json();
                    setCartItems(data.items || []);
                }
            } catch (error) {
                console.error("Failed to fetch cart", error);
            }
        };

        if (isOpen) {
            fetchCart();
        }

        const handleCartUpdate = () => {
            fetchCart();
        };

        window.addEventListener("cart-updated", handleCartUpdate);
        return () => window.removeEventListener("cart-updated", handleCartUpdate);
    }, [isOpen]);

    const removeFromCart = async (itemId: string) => {
        try {
            const res = await fetch(`/api/cart?id=${itemId}`, { method: "DELETE" });
            if (res.ok) {
                setCartItems((prev) => prev.filter((item) => item.id !== itemId));
                window.dispatchEvent(new Event("cart-updated"));
            }
        } catch (error) {
            console.error("Failed to remove item", error);
        }
    };

    const total = cartItems.reduce((sum, item) => sum + item.price, 0);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0a0a0a] border-l border-white/10 z-[101] flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/10 flex justify-between items-center text-white">
                            <h2 className="text-xl font-cinzel text-gold flex items-center gap-2">
                                <ShoppingCart size={20} /> Your Cart
                            </h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {cartItems.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                                    <ShoppingCart size={48} className="mb-4 opacity-30" />
                                    <p className="text-lg font-marcellus">Your cart is empty</p>
                                    <p className="text-sm">Add some events to get started!</p>
                                </div>
                            ) : (
                                <AnimatePresence initial={false}>
                                    {cartItems.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="group flex gap-4 bg-white/5 p-3 rounded-lg border border-white/5 hover:border-gold/30 transition-colors"
                                        >
                                            <div className="w-16 h-16 relative bg-gray-900 rounded-md overflow-hidden shrink-0">
                                                <Image
                                                    src={`/images/event/${[
                                                        "darpan", "reel-making", "treasure-hunt", "marketing-mania", "picture-story", "dance-battle",
                                                        "debate", "open-stage", "solo-singing", "band-war", "graffiti", "face-painting", "monoact",
                                                        "tshirt-painting", "case-study", "live-sketching", "pageant", "relay-rangoli", "nukkad",
                                                        "rap-battle", "mimicry", "solo-dance", "short-film", "auction", "mun", "twist-a-tale",
                                                        "group-dance", "jam"
                                                    ].indexOf(item.eventSlug) + 1}.jpg`}
                                                    alt={item.eventName}
                                                    fill
                                                    className="object-cover"
                                                    onError={(e) => (e.target as HTMLImageElement).src = '/images/logo.png'}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-white font-medium text-sm line-clamp-1">{item.eventName}</h4>
                                                <p className="text-gold text-sm font-bold mt-1">₹{item.price}</p>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-gray-500 hover:text-red-500 transition-colors p-2"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>

                        {/* Footer */}
                        {cartItems.length > 0 && (
                            <div className="p-6 border-t border-white/10 bg-[#0d0d0d] space-y-4">
                                <div className="flex justify-between items-center text-white">
                                    <span className="text-gray-400">Subtotal</span>
                                    <span className="text-xl font-bold text-gold">₹{total}</span>
                                </div>
                                <Button
                                    onClick={() => {
                                        onClose();
                                        router.push("/checkout");
                                    }}
                                    className="w-full bg-gold text-black hover:bg-yellow-600 font-bold h-12 flex items-center justify-center gap-2"
                                >
                                    Proceed to Checkout <ArrowRight size={18} />
                                </Button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
