"use client";

import { motion } from 'framer-motion';
import { Calendar, Users, Trophy, Music } from 'lucide-react';

export default function FestHighlights() {
    const stats = [
        { icon: Calendar, label: "Events", value: "30+" },
        { icon: Users, label: "Footfall", value: "10K+" },
        { icon: Trophy, label: "Prize Pool", value: "₹2L+" },
        { icon: Music, label: "Artists", value: "5+" },
    ];

    return (
        <section className="bg-[#EBE5CE] py-20 relative border-b border-gold/20 overflow-hidden text-black">
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/40 to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1, duration: 0.5, type: 'spring' }}
                            viewport={{ once: true }}
                            className="flex flex-col items-center text-center group"
                        >
                            <div className="mb-6 p-4 rounded-full bg-black/5 border border-black/10 group-hover:bg-gold/20 group-hover:border-gold/50 transition-all duration-300 transform group-hover:scale-110">
                                <stat.icon className="w-10 h-10 text-black group-hover:text-black transition-colors" />
                            </div>
                            <h3 className="text-5xl md:text-6xl font-cinzel font-bold mb-2 text-black drop-shadow-sm">{stat.value}</h3>
                            <p className="text-lg md:text-xl font-marcellus text-gray-800 uppercase tracking-[0.2em] font-bold">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
