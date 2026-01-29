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
        <section ref={containerRef} className="relative pt-4 pb-24 bg-black overflow-hidden">
            {/* Background Vibe */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <Image
                    src="/images/crowd.png"
                    alt="Crowd background"
                    fill
                    className="object-cover grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
            </div>

            <div className="relative z-10 mb-16 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <h2 className="text-4xl md:text-7xl font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-gold via-white to-gold mb-4 drop-shadow-sm">
                        PURE ENERGY
                    </h2>
                    <p className="font-marcellus text-gray-400 text-lg md:text-xl tracking-widest uppercase">
                        Relive the Legacy
                    </p>
                </motion.div>
            </div>

            {/* Marquee Rows */}
            <div className="space-y-8 flex flex-col items-center rotate-[-2deg] scale-110">
                {/* Row 1 */}
                <motion.div style={{ x: x1 }} className="flex gap-4 whitespace-nowrap">
                    {[...galleryImages, ...galleryImages].map((src, i) => (
                        <div key={`row1-${i}`} className="relative w-[300px] h-[200px] md:w-[500px] md:h-[300px] flex-shrink-0 rounded-lg overflow-hidden border border-white/10 group">
                            <Image
                                src={src}
                                alt="Event moment"
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    ))}
                </motion.div>

                {/* Row 2 */}
                <motion.div style={{ x: x2 }} className="flex gap-4 whitespace-nowrap">
                    {[...legacyImages, ...legacyImages].reverse().map((src, i) => (
                        <div key={`row2-${i}`} className="relative w-[300px] h-[200px] md:w-[500px] md:h-[300px] flex-shrink-0 rounded-lg overflow-hidden border border-white/10 group">
                            <Image
                                src={src}
                                alt="Event moment"
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
