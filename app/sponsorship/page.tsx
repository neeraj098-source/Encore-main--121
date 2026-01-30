"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';

const sponsors = [
    { id: 1, role: "Cafe Partner", image: "/images/sponsor/1.jpg" },
    { id: 2, role: "Building Partner", image: "/images/sponsor/2.jpg" },
    { id: 3, role: "Travel Partner", image: "/images/sponsor/3.jpg" },
    { id: 4, role: "Radio Partner", image: "/images/sponsor/4.jpg" },
    { id: 5, role: "Moments Partner", image: "/images/sponsor/5.jpg" },
    { id: 6, role: "Food Partner", image: "/images/sponsor/6.jpg" },
    { id: 7, role: "Banking Partner", image: "/images/sponsor/7.jpg" },
    { id: 8, role: "Hospitality Partner", image: "/images/sponsor/8.jpg" },
    { id: 9, role: "Fashion Partner", image: "/images/sponsor/9.jpg" },
    { id: 10, role: "Live Streaming Partner", image: "/images/sponsor/10.jpg" },
    { id: 11, role: "Digital Media Partner", image: "/images/sponsor/11.jpg" },
    { id: 12, role: "Experience Partner", image: "/images/sponsor/12.jpg" },
];

export default function SponsorshipPage() {
    return (
        <main className="min-h-screen bg-black pt-36 px-4 pb-12">
            <div className="max-w-7xl mx-auto text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-cinzel text-gold mb-4"
                >
                    Our Past Sponsors
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-400 font-marcellus mb-16 max-w-2xl mx-auto"
                >
                    We are proud to be supported by these amazing partners who help make Encore a reality.
                </motion.p>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {sponsors.map((sponsor, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05, duration: 0.5 }}
                            viewport={{ once: true }}
                            className="flex flex-col items-center group relative p-4 bg-white/5 rounded-xl border border-white/10 hover:border-gold/30 transition-colors"
                        >
                            {/* Image Container with Cropping */}
                            <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-lg bg-white/10 flex items-center justify-center">
                                <div className="relative w-[150%] h-[150%] flex items-center justify-center">
                                    <Image
                                        src={sponsor.image}
                                        alt={sponsor.role}
                                        fill
                                        className="object-contain object-center scale-150"
                                    />
                                </div>
                            </div>

                            {/* Role Label */}
                            <h3 className="text-gold font-cinzel text-center text-sm md:text-lg tracking-wider uppercase">
                                {sponsor.role}
                            </h3>

                        </motion.div>
                    ))}
                </div>
            </div>
        </main>
    );
}
