"use client";

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

const galleryImages = [
    '/images/jubin.jpg',
    '/images/flashback/1.jpg',
    '/images/flashback/2.jpg',
    '/images/flashback/3.jpg',
    '/images/flashback/4.jpg',
    '/images/i1.jpg',
];

const legacyImages = [
    '/images/legacy/1.jpg',
    '/images/legacy/2.jpg',
    '/images/legacy/3.jpg',
    '/images/legacy/4.png',
];

export default function Flashback() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const x1 = useTransform(scrollYProgress, [0, 1], [0, -1000]);
    const x2 = useTransform(scrollYProgress, [0, 1], [-1000, 0]);

    return (
        <section ref={containerRef} id="pure-energy-trigger" className="relative pt-4 pb-24 overflow-hidden">
            {/* Global background visible */}

            {/* Background Vibe - Enhanced blending */}
            <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay">
                <Image
                    src="/images/home/party_crowd.png"
                    alt="Crowd background"
                    fill
                    className="object-cover"
                />
            </div>
            {/* Cinematic Top Fade - Seamless Transition */}
            <div
                className="absolute top-0 left-0 right-0 h-[20vh] z-20 pointer-events-none"
                style={{
                    background: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 45%, rgba(0,0,0,0) 100%)'
                }}
            />

            <div className="relative z-30 mb-20 px-4 pointer-events-none">
                <div className="text-center">
                    <div className="inline-block relative">
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[1px] h-20 bg-gradient-to-b from-transparent to-[#D4AF37] opacity-60" />
                        <span className="text-[#D4AF37] font-marcellus text-sm tracking-[0.5em] uppercase block mb-6 drop-shadow-md">Relive the Legacy</span>
                        <h2 className="text-6xl md:text-8xl font-cinzel text-transparent bg-clip-text bg-gradient-to-b from-[#fff] via-[#ffe0b2] to-[#d4af37] filter drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)]">
                            PURE ENERGY
                        </h2>
                    </div>
                </div>
            </div>

            {/* Marquee Rows */}
            <div className="space-y-12 flex flex-col items-center rotate-[-2deg] scale-110">
                {/* Row 1 */}
                <motion.div style={{ x: x1 }} className="flex gap-6 whitespace-nowrap">
                    {[...galleryImages, ...galleryImages].map((src, i) => (
                        <div key={`row1-${i}`} className="relative w-[350px] h-[220px] md:w-[500px] md:h-[300px] flex-shrink-0 rounded-xl overflow-hidden border border-[#D4AF37]/20 group bg-black/50">
                            <Image
                                src={src}
                                alt="Event moment"
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                            />
                            <div className="absolute inset-0 bg-[#FFD700]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay" />
                        </div>
                    ))}
                </motion.div>

                {/* Row 2 */}
                <motion.div style={{ x: x2 }} className="flex gap-6 whitespace-nowrap">
                    {[...legacyImages, ...legacyImages].reverse().map((src, i) => (
                        <div key={`row2-${i}`} className="relative w-[350px] h-[220px] md:w-[500px] md:h-[300px] flex-shrink-0 rounded-xl overflow-hidden border border-[#D4AF37]/20 group bg-black/50">
                            <Image
                                src={src}
                                alt="Event moment"
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                            />
                            <div className="absolute inset-0 bg-[#D4AF37]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay" />
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
