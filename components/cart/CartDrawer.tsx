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
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-[#050505] border-l border-white/5 z-[101] flex flex-col shadow-2xl font-cinzel"
                    >
                        {/* Header */}
                        <div className="px-8 py-6 flex justify-between items-center text-white bg-[#050505]">
                            <h2 className="text-xl text-[#D4AF37] flex items-center gap-3 uppercase tracking-wider">
                                <ShoppingCart size={22} className="text-[#D4AF37]" /> Your Cart
                            </h2>
                            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 bg-[#050505] scrollbar-hide">
                            {cartItems.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                                    <ShoppingCart size={48} className="mb-4 opacity-20" />
                                    <p className="text-lg text-gray-400">Your cart is empty</p>
                                    <p className="text-sm font-sans mt-2">Add some events to get started!</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {cartItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className="group flex gap-4 bg-[#1a1a1a] p-4 rounded-xl border border-white/5 items-center hover:border-[#D4AF37]/30 transition-all"
                                        >
                                            <div className="w-14 h-14 relative bg-gray-900 rounded-md overflow-hidden shrink-0 border border-white/10">
                                                <Image
                                                    src={(function () {
                                                        const slugs = [
                                                            "darpan", "reel-making", "treasure-hunt", "marketing-mania", "picture-story", "dance-battle",
                                                            "debate", "open-stage", "solo-singing", "band-war", "graffiti", "face-painting", "monoact",
                                                            "tshirt-painting", "case-study", "live-sketching", "pageant", "relay-rangoli", "nukkad",
                                                            "rap-battle", "mimicry", "solo-dance", "short-film", "auction", "mun", "twist-a-tale",
                                                            "group-dance", "jam"
                                                        ];
                                                        const index = slugs.indexOf(item.eventSlug);
                                                        if (index === -1) return "/images/logo.png";
                                                        return `/images/event/${index + 1}.jpg`;
                                                    })()}
                                                    alt={item.eventName}
                                                    fill
                                                    className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                                    onError={(e) => (e.target as HTMLImageElement).src = '/images/logo.png'}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-white font-marcellus text-sm uppercase tracking-wide truncate">{item.eventName}</h4>
                                                <p className="text-[#D4AF37] text-sm font-bold mt-1 font-sans">₹{item.price}</p>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-gray-600 hover:text-red-500 transition-colors p-2"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {cartItems.length > 0 && (
                            <div className="p-8 bg-[#050505]">
                                <div className="flex justify-between items-end text-white mb-6">
                                    <span className="text-gray-400 text-sm font-marcellus uppercase tracking-widest">Subtotal</span>
                                    <span className="text-2xl font-bold text-[#D4AF37] font-sans">₹{total}</span>
                                </div>

                                <div className="space-y-3">
                                    <div className="bg-[#2a2510] border border-[#D4AF37]/20 rounded-lg py-3 px-4 text-center">
                                        <p className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest">
                                            Payment Temporarily Disabled
                                        </p>
                                    </div>

                                    <Button
                                        disabled
                                        className="w-full bg-[#2a2a2a] text-gray-400 font-cinzel text-sm uppercase tracking-widest h-14 rounded-full flex items-center justify-center gap-2 cursor-not-allowed border border-white/5 hover:bg-[#2a2a2a]"
                                    >
                                        Payments Coming Soon <ArrowRight size={16} />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
