"use client";

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { eventsData } from '@/lib/data';
import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { useState } from 'react';
import { ArrowLeft, Clock, MapPin, Calendar, CheckCircle } from 'lucide-react';

export default function EventDetailClient() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug;

    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        type: "success" | "error" | "info" | "warning";
        actionLabel?: string;
        onAction?: () => void;
    }>({
        isOpen: false,
        title: "",
        message: "",
        type: "info"
    });

    const event = eventsData.find(e => e.slug === slug);

    if (!event) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
                <h1 className="text-4xl font-cinzel text-gold mb-4">Event Not Found</h1>
                <Button onClick={() => router.push('/events')}>Back to Events</Button>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-black text-white">

            {/* Banner */}
            <div className="relative h-[60vh] w-full">
                <Image src="/images/s5.svg" alt="Banner" fill className="object-cover opacity-50" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                <div className="absolute bottom-10 left-0 w-full px-6 md:px-12 max-w-7xl mx-auto">
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/events')}
                        className="mb-6 pl-0 hover:pl-2 transition-all text-gray-400 hover:text-white"
                    >
                        <ArrowLeft className="mr-2" size={20} /> Back to Events
                    </Button>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-cinzel text-gold mb-2"
                    >
                        {event.title}
                    </motion.h1>
                    <p className="text-xl text-gray-300 font-marcellus max-w-2xl">{event.description}</p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">

                {/* Left: Info & Rules */}
                <div className="md:col-span-2 space-y-12">

                    {/* Rules Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-8"
                    >
                        <h2 className="text-3xl font-cinzel text-gold mb-6 border-b border-white/10 pb-4">Rulebook</h2>
                        {event.rules && event.rules.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {event.rules.map((rule, idx) => (
                                    <div key={idx} className="flex gap-3 items-start bg-black/40 p-4 rounded-lg">
                                        <CheckCircle className="text-gold shrink-0 mt-1" size={16} />
                                        <p className="text-gray-300 text-sm leading-relaxed">{rule}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">Rules coming soon...</p>
                        )}
                    </motion.div>

                    {/* Description/Quote */}
                    <div className="bg-gradient-to-r from-gold/10 to-transparent p-6 rounded-l-2xl border-l-4 border-gold">
                        <p className="font-marcellus text-lg italic text-gray-200">
                            "Enthusiastic Shutterbugs, it's your turn to grasp your camera and make your eyes act like a shutter and your mind like a lens."
                        </p>
                    </div>
                </div>

                {/* Right: Actions & Details Card */}
                <div className="space-y-6 md:-mt-32 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-24"
                    >
                        <div className="aspect-[3/4] relative rounded-lg overflow-hidden mb-6 border border-white/20">
                            <Image src={event.image} alt={event.title} fill className="object-cover" />
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="flex items-center gap-3 text-gray-300">
                                <Calendar className="text-gold" size={20} />
                                <span>Feb 19-21, 2025</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <Clock className="text-gold" size={20} />
                                <span>10:00 AM Onwards</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <MapPin className="text-gold" size={20} />
                                <span>IET Lucknow Campus</span>
                            </div>
                        </div>


                        <div className="flex items-center justify-between text-gray-300 lg:text-lg mb-2">
                            <span>Registration Fee:</span>
                            <span className="text-gold font-bold text-2xl">₹{event.price || 150}</span>
                        </div>

                        <Button
                            className="w-full py-4 text-lg font-bold mb-3"
                            onClick={async () => {
                                const btn = document.getElementById('add-to-cart-btn');
                                if (btn) btn.innerText = "Adding...";
                                try {
                                    const res = await fetch('/api/cart', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ eventSlug: event.slug })
                                    });
                                    if (res.ok) {
                                        window.dispatchEvent(new Event('cart-updated'));
                                        if (btn) btn.innerText = "Added to Cart!";
                                        setTimeout(() => { if (btn) btn.innerText = "Add to Cart"; }, 2000);
                                    } else {
                                        if (res.status === 409) {
                                            if (btn) btn.innerText = "Already in Cart";
                                            setModalState({
                                                isOpen: true,
                                                title: "Duplicate Item",
                                                message: "This event is already in your cart.",
                                                type: "warning"
                                            });
                                        } else if (res.status === 401) {
                                            if (btn) btn.innerText = "Login Required";
                                            setModalState({
                                                isOpen: true,
                                                title: "Login Required",
                                                message: "You must be logged in to add events to your cart.",
                                                type: "error",
                                                actionLabel: "Login Now",
                                                onAction: () => router.push('/login')
                                            });
                                        } else {
                                            if (btn) btn.innerText = "Failed (" + res.status + ")";
                                            const data = await res.json();
                                            console.error(data);
                                            setModalState({
                                                isOpen: true,
                                                title: "Error",
                                                message: "Failed to add item: " + (data.error || "Unknown error"),
                                                type: "error"
                                            });
                                        }
                                    }
                                } catch (e) {
                                    console.error(e);
                                    if (btn) btn.innerText = "Error";
                                }
                            }}
                            id="add-to-cart-btn"
                        >
                            Add to Cart
                        </Button>
                        <p className="text-xs text-center text-gray-500">
                            Instant confirmation • Secure checkout
                        </p>
                    </motion.div>
                </div>

            </div>



            <Modal
                isOpen={modalState.isOpen}
                onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
                title={modalState.title}
                message={modalState.message}
                type={modalState.type}
                actionLabel={modalState.actionLabel}
                onAction={modalState.onAction}
            />

        </main >
    );
}

