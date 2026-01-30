"use client";

import { Calendar, Users, Trophy, Music } from 'lucide-react';

export default function FestHighlights() {
    const stats = [
        { icon: Calendar, label: "Events", value: "30+" },
        { icon: Users, label: "Footfall", value: "10K+" },
        { icon: Trophy, label: "Prize Pool", value: "₹2L+" },
        { icon: Music, label: "Artists", value: "5+" },
    ];

    return (
        <section className="relative py-24 border-t border-b border-[#D4AF37]/20 overflow-hidden">
            {/* Background Effects - Removed bg-black to show global texture */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#D4AF37]/10 to-transparent pointer-events-none" />

            {/* Ornamental Dividers */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center text-center group"
                        >
                            <div className="mb-6 relative">
                                <div className="absolute inset-0 bg-[#FFD700]/30 blur-2xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700" />
                                <stat.icon className="w-12 h-12 text-[#D4AF37] relative z-10 drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
                            </div>
                            <h3 className="text-5xl md:text-6xl font-cinzel text-transparent bg-clip-text bg-gradient-to-b from-white to-[#e0e0e0] font-bold mb-3 tracking-tight group-hover:text-[#FFD700] transition-colors duration-500 drop-shadow-sm">{stat.value}</h3>
                            <p className="text-sm md:text-base font-marcellus text-[#D4AF37] uppercase tracking-[0.25em] border-t border-[#D4AF37]/30 pt-2">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
