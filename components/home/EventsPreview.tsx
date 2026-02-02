"use client";

import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function EventsPreview() {
    const categories = [
        {
            name: "Dance",
            description: "Rhythm of Royalty",
            image: "/images/categories/dance.png",
            link: "/events#dance"
        },
        {
            name: "Music",
            description: "Melodies of the Court",
            image: "/images/categories/music.png",
            link: "/events#music"
        },
        {
            name: "Dramatics",
            description: "Tales of Tradition",
            image: "/images/categories/drama.png",
            link: "/events#dramatics"
        },
        {
            name: "Literary",
            description: "Words of Wisdom",
            image: "/images/categories/literary.png",
            link: "/events#literary"
        }
    ];

    return (
        <section className="relative py-24 px-4 text-white overflow-hidden">
            {/* Decorative Background Pattern - Mughal Jaali Effect */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, #D4AF37 1px, transparent 0)',
                    backgroundSize: '24px 24px'
                }}>
            </div>

            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#D4AF37]/5 to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-[#D4AF37]/20 pb-6">
                    <div>
                        <h2 className="text-4xl md:text-6xl font-cinzel text-white mb-2 tracking-tight">EXPLORE CATEGORIES</h2>
                        <div className="h-1 w-32 bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {categories.map((cat, index) => (
                        <Link href={cat.link} key={index}>
                            <div
                                className={`relative h-96 rounded-t-3xl border border-[#D4AF37]/20 overflow-hidden group cursor-pointer hover:border-[#D4AF37] transition-colors duration-500 bg-black/40 backdrop-blur-sm`}
                            >
                                {/* Image Container - Clipped to Inner Line */}
                                <div className="absolute inset-3 rounded-t-2xl overflow-hidden">
                                    <Image
                                        src={cat.image}
                                        alt={cat.name}
                                        fill
                                        className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60 group-hover:opacity-100 transform-gpu will-change-transform"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 transition-opacity duration-300" />
                                </div>

                                {/* Inner Border Frame */}
                                <div className="absolute inset-3 border border-[#D4AF37]/10 rounded-t-2xl pointer-events-none group-hover:border-[#D4AF37]/40 transition-colors duration-500" />

                                <div className="absolute inset-0 p-8 flex flex-col justify-end z-20">
                                    <h3 className="text-3xl font-cinzel text-white mb-1 group-hover:text-[#FFD700] transition-colors translate-y-2 group-hover:translate-y-0 duration-500 drop-shadow-md">{cat.name}</h3>

                                    {/* Separator Line - Hardware Accelerated Scale */}
                                    <div className="h-[1px] w-full bg-[#FFD700] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out mb-2 opacity-50" />

                                    <p className="text-[#e0e0e0] text-sm font-marcellus mb-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 tracking-wide delay-75">{cat.description}</p>

                                    <div className="absolute top-4 right-4 w-12 h-12 rounded-full border border-[#D4AF37]/30 flex items-center justify-center bg-black/50 backdrop-blur-md group-hover:bg-[#D4AF37] group-hover:text-black transition-all duration-300">
                                        <ArrowRight size={20} />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
