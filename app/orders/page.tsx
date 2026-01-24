
"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// Types
interface OrderItem {
    id: string;
    eventName: string;
    eventSlug?: string;
    price: number;
}

interface Order {
    id: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    items: OrderItem[];
}

function OrdersContent() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const success = searchParams.get('success');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch("/api/orders");
            if (res.ok) {
                const data = await res.json();
                setOrders(data.orders || []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="min-h-screen pt-32 text-center text-gold">Loading Orders...</div>;

    return (
        <div className="min-h-screen bg-neutral-900 pt-24 pb-12 px-4">
            <div className="max-w-5xl mx-auto">

                <div className="flex justify-between items-end mb-8 border-b border-gray-800 pb-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-cinzel text-gold">Your Orders</h1>
                        <p className="text-gray-400">Track your event registrations and purchases</p>
                    </div>
                    {success && (
                        <div className="bg-green-600/20 border border-green-600/50 text-green-400 px-4 py-2 rounded-lg flex items-center gap-2">
                            <CheckCircle size={20} /> Order Placed Successfully!
                        </div>
                    )}
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-lg">
                        <h2 className="text-2xl font-marcellus text-white mb-2">No orders yet</h2>
                        <Link href="/events">
                            <Button>Browse Events</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                                {/* Order Header */}
                                <div className="bg-white/5 p-4 flex flex-wrap gap-4 justify-between items-center text-sm text-gray-400">
                                    <div className="flex gap-8">
                                        <div>
                                            <p className="uppercase text-xs font-bold mb-1">Order Placed</p>
                                            <p className="text-gray-200">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="uppercase text-xs font-bold mb-1">Total</p>
                                            <p className="text-gold font-bold">₹{order.totalAmount}</p>
                                        </div>
                                        <div>
                                            <p className="uppercase text-xs font-bold mb-1">Order ID</p>
                                            <p className="text-gray-200">#{order.id.slice(-8)}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'PAID' ? 'bg-green-500/20 text-green-400' :
                                            order.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-4 space-y-4">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex gap-4 items-center">
                                            <div className="w-16 h-16 bg-gray-800 rounded relative overflow-hidden">
                                                {/* Dynamic Event Image */}
                                                <Image
                                                    src={`/images/event/${[
                                                        "darpan", "reel-making", "treasure-hunt", "marketing-mania", "picture-story", "dance-battle",
                                                        "debate", "open-stage", "solo-singing", "band-war", "graffiti", "face-painting", "monoact",
                                                        "tshirt-painting", "case-study", "live-sketching", "pageant", "relay-rangoli", "nukkad",
                                                        "rap-battle", "mimicry", "solo-dance", "short-film", "auction", "mun", "twist-a-tale",
                                                        "group-dance", "jam"
                                                    ].indexOf(item.eventSlug ?? "") + 1}.jpg`}
                                                    alt={item.eventName}
                                                    fill
                                                    className="object-cover opacity-80"
                                                    onError={(e) => (e.target as HTMLImageElement).src = '/images/logo.png'}
                                                />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-marcellus text-white">{item.eventName}</h3>
                                                <button className="text-gold text-sm hover:underline">View Event Details</button>
                                            </div>
                                            <div className="ml-auto font-bold text-gray-300">
                                                ₹{item.price}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function OrdersPage() {
    return (
        <Suspense fallback={<div className="min-h-screen pt-32 text-center text-gold">Loading...</div>}>
            <OrdersContent />
        </Suspense>
    );
}

