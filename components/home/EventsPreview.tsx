"use client";

import { motion } from 'framer-motion';
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
            link: "/events?cat=dance"
        },
        {
            name: "Music",
            description: "Melodies of the Court",
            image: "/images/categories/music.png",
            link: "/events?cat=music"
        },
        {
            name: "Dramatics",
            description: "Tales of Tradition",
            image: "/images/categories/drama.png",
            link: "/events?cat=dramatics"
        },
        {
            name: "Literary",
            description: "Words of Wisdom",
            image: "/images/categories/literary.png",
            link: "/events?cat=literary"
        }
    ];

    return (
        <section className="bg-black py-20 relative px-4 text-white">
            {/* Decorative Background Pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,215,0,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-4xl font-cinzel text-white mb-2">EXPLORE CATEGORIES</h2>
                        <div className="h-1 w-24 bg-gold rounded-full" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((cat, index) => (
                        <Link href={cat.link} key={index}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className={`relative h-80 rounded-xl overflow-hidden group cursor-pointer border border-white/10 hover:border-gold/50 transition-colors`}
                            >
                                <Image
                                    src={cat.image}
                                    alt={cat.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                    <h3 className="text-2xl font-cinzel text-white mb-1 group-hover:text-gold transition-colors translate-y-2 group-hover:translate-y-0 duration-300">{cat.name}</h3>
                                    <p className="text-gray-300 text-sm font-marcellus mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">{cat.description}</p>

                                    <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center bg-black/30 backdrop-blur-sm group-hover:bg-gold group-hover:border-gold group-hover:text-black transition-all duration-300">
                                        <ArrowRight size={16} />
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
