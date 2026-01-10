"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 100]);

    // Parallax logic for Roomi layer - REMOVED
    // const rumiY = useTransform(scrollY, [0, 500], [100, 0]);

    return (
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
            {/* Background Video */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="object-cover w-full h-full opacity-50 pointer-events-none"
                >
                    <source src="/video/bg.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </div>

            {/* Roomi Darwaza Split Animation Layer (Z-10: Behind Text, Above Video) */}
            <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none flex items-end justify-center pb-0 md:pb-0">
                {/* Left Half */}
                <motion.div
                    initial={{ x: '-100%', opacity: 0 }}
                    animate={{ x: '0%', opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                    className="relative w-1/2 h-full md:h-[90%] flex justify-end mt-auto"
                >
                    <div className="relative w-full h-full">
                        <Image
                            src="/images/roomi_gate_symmetric.png"
                            alt="Roomi Left"
                            fill
                            className="object-contain object-left-bottom"
                            style={{ objectPosition: 'left bottom' }}
                        />
                    </div>
                </motion.div>

                {/* Right Half */}
                <motion.div
                    initial={{ x: '100%', opacity: 0 }}
                    animate={{ x: '0%', opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                    className="relative w-1/2 h-full md:h-[90%] flex justify-start mt-auto"
                >
                    <div className="relative w-full h-full">
                        <Image
                            src="/images/roomi_gate_symmetric.png"
                            alt="Roomi Right"
                            fill
                            className="object-contain object-right-bottom"
                            style={{ objectPosition: 'right bottom' }}
                        />
                    </div>
                </motion.div>
            </div>

            {/* Content High Z-Index */}
            <div className="relative z-20 text-center px-4 max-w-5xl mx-auto mt-20 md:mt-0">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <p className="text-gold font-marcellus text-lg md:text-xl tracking-[0.2em] mb-4 uppercase">
                        The Annual Cultural Fest of IET Lucknow
                    </p>
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-cinzel text-white mb-6 tracking-tight relative drop-shadow-lg">
                        ENCORE
                        <span className="absolute -top-6 -right-8 md:-top-10 md:-right-10 text-2xl md:text-4xl text-gold/80 rotate-12 font-script">26</span>
                    </h1>
                    <h2 className="text-2xl md:text-4xl font-cinzel text-gray-300 tracking-widest mb-10">
                        NAWABI ELEGANCE
                    </h2>

                    <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                        <Link href="/events">
                            <Button size="lg" className="w-48 text-lg hover:scale-105 transition-transform bg-gold text-black border-gold">
                                Register Now
                            </Button>
                        </Link>
                        <Link href="/events">
                            <Button variant="outline" size="lg" className="w-48 text-lg hover:scale-105 transition-transform backdrop-blur-sm bg-black/30">
                                Explore Events
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-30"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
            >
                <div className="w-[1px] h-24 bg-gradient-to-b from-gold to-transparent" />
            </motion.div>
        </section>
    );
}
