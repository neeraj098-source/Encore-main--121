"use client";

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { eventsData } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import CartDrawer from '@/components/cart/CartDrawer';

export default function EventsPage() {
    const [isCartOpen, setIsCartOpen] = useState(false);

    const handleQuickAdd = async (e: React.MouseEvent, event: any) => {
        e.preventDefault(); // Prevent Link navigation
        try {
            const res = await fetch("/api/cart", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventId: event.id, // Assuming data has ID, or use logic to match
                    eventName: event.title,
                    price: event.price || 150, // Fallback price
                    eventSlug: event.slug
                })
            });
            if (res.ok) {
                // Trigger cart update
                window.dispatchEvent(new Event("cart-updated"));
                setIsCartOpen(true);
            }
        } catch (error) {
            console.error("Quick Add Error", error);
        }
    };

    return (
        <main className="min-h-screen bg-black pt-24 px-4 pb-12">
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            <div className="max-w-7xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-cinzel text-gold mb-12 text-center"
                >
                    Events & Competitions
                </motion.h1>

                <div className="space-y-16">
                    {[
                        {
                            title: "Dance Club",
                            events: eventsData.filter(e => ["Dance", "Solo Dance", "Group Dance"].includes(e.category))
                        },
                        {
                            title: "Music Club",
                            events: eventsData.filter(e => ["Solo Singing", "Band War", "Rap Battle"].includes(e.category))
                        },
                        {
                            title: "Dramatics Club",
                            events: eventsData.filter(e => ["Nukkad", "Monoact", "Open Stage", "Mimicry", "JAM"].includes(e.category))
                        },
                        {
                            title: "Fine Arts Club",
                            events: eventsData.filter(e => ["Art", "Face Painting", "Live Sketching", "Relay Rangoli", "Picture Story"].includes(e.category))
                        },
                        {
                            title: "Photography & Film Club",
                            events: eventsData.filter(e => ["Photography", "Videography", "Short Film"].includes(e.category))
                        },
                        {
                            title: "Literary Club",
                            events: eventsData.filter(e => ["Debate", "Twist a Tale"].includes(e.category))
                        },
                        {
                            title: "Business & Management",
                            events: eventsData.filter(e => ["Business", "Case Study", "Auction", "MUN"].includes(e.category))
                        },
                        {
                            title: "Special Events",
                            events: eventsData.filter(e => ["Fun", "Pageant"].includes(e.category))
                        }
                    ].map((section, idx) => (
                        section.events.length > 0 && (
                            <div key={idx} className="relative">
                                <h2 className="text-3xl font-cinzel text-white mb-8 border-l-4 border-gold pl-4">
                                    {section.title}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {section.events.map((event, index) => (
                                        <Link href={`/events/${event.slug || '#'}`} key={index}>
                                            <motion.div
                                                initial={{ opacity: 0, y: 30 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                                className="group relative bg-gray-900 rounded-xl overflow-hidden border border-white/10 hover:border-gold/60 transition-all duration-300 h-full flex flex-col"
                                            >
                                                {/* Image Container - Portrait Aspect Ratio */}
                                                <div className="relative aspect-[4/5] w-full overflow-hidden">
                                                    <Image
                                                        src={event.image}
                                                        alt={event.title}
                                                        fill
                                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                    {/* Gradient Overlay */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />

                                                    {/* Category Badge */}
                                                    <div className="absolute top-4 left-4">
                                                        <span className="px-3 py-1 bg-gold/90 text-black text-xs font-bold uppercase tracking-wider rounded-sm">
                                                            {event.category}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Quick Add Button - Appears on Hover */}
                                                <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                                                    <button
                                                        onClick={(e) => handleQuickAdd(e, event)}
                                                        className="bg-gold text-black p-2 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all"
                                                        title="Quick Add to Cart"
                                                    >
                                                        <ShoppingCart size={20} />
                                                    </button>
                                                </div>


                                                {/* Content Details */}
                                                <div className="absolute bottom-0 left-0 w-full p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                                    <h3 className="text-2xl font-cinzel text-white mb-2 drop-shadow-md group-hover:text-gold transition-colors">
                                                        {event.title}
                                                    </h3>
                                                    <p className="text-gray-300 text-sm line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                                        {event.description}
                                                    </p>
                                                    <div className="h-0.5 w-12 bg-gold group-hover:w-full transition-all duration-500 ease-out" />
                                                </div>
                                            </motion.div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )
                    ))}
                </div>
            </div>
        </main >
    );
}
