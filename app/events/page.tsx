"use client";

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { eventsData } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';

export default function EventsPage() {
    return (
        <main className="min-h-screen bg-black pt-24 px-4 pb-12">
            <div className="max-w-7xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-cinzel text-gold mb-12 text-center"
                >
                    Events & Competitions
                </motion.h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {eventsData.map((event, index) => (
                        <Link href={`/events/${event.slug || '#'}`} key={index}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-gray-900 rounded-2xl overflow-hidden border border-white/10 hover:border-gold/50 transition-colors group cursor-pointer"
                            >
                                <div className="h-48 bg-gray-800 relative overflow-hidden">
                                    <Image
                                        src={event.image}
                                        alt={event.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                                </div>
                                <div className="p-6">
                                    <span className="text-xs text-gold uppercase tracking-widest">{event.category}</span>
                                    <h3 className="text-2xl font-cinzel text-white mt-2 mb-1">{event.title}</h3>
                                    <Button size="sm" variant="outline" className="w-full mt-4">View Details</Button>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
