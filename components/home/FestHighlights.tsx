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
        <section className="bg-black py-12 relative border-b border-gold/10 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                            className="flex flex-col items-center text-center group"
                        >
                            <div className="mb-4 relative">
                                <div className="absolute inset-0 bg-gold/20 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-500" />
                                <stat.icon className="w-8 h-8 text-gold relative z-10" />
                            </div>
                            <h3 className="text-4xl md:text-5xl font-cinzel text-white font-bold mb-2 tracking-tight group-hover:text-gold transition-colors duration-300">{stat.value}</h3>
                            <p className="text-sm font-marcellus text-gray-400 uppercase tracking-[0.2em]">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
