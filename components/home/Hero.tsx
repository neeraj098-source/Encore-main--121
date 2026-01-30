"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';


export default function Hero() {
    const [isLoggedIn] = useState(() => {
        if (typeof window !== 'undefined') {
            return !!localStorage.getItem('encore_user');
        }
        return false;
    });
    // Dynamic animation delays
    const [delays] = useState(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (typeof window !== 'undefined' && (window as any).hasShownIntro) {
            return { text: 0.3, gate: 0.6 };
        }
        return { text: 2, gate: 2.6 };
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const leftGateVariant: any = {
        hidden: { x: '40%', opacity: 0 }, // Starts from center (shifted right)
        visible: {
            x: '0%',
            opacity: 1,
            transition: {
                duration: 1.2, // Slower, more majestic opening
                ease: "easeOut", // starts fast, slows down
                delay: delays.gate
            }
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rightGateVariant: any = {
        hidden: { x: '-40%', opacity: 0 }, // Starts from center (shifted left)
        visible: {
            x: '0%',
            opacity: 1,
            transition: {
                duration: 1.2,
                ease: "easeOut",
                delay: delays.gate
            }
        }
    };

    return (
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
            {/* Global Background is visible, no local bg-black */}

            {/* --- Decorative Architectural Images (Rumi Darwaza Halves) --- */}

            {/* Left Half - Bottom Left - Enhanced Size/Position */}
            <motion.div
                variants={leftGateVariant}
                initial="hidden"
                animate="visible"
                className="absolute bottom-0 left-0 w-[45vw] h-[40vh] md:w-[35vw] md:h-[75vh] z-[1] pointer-events-none opacity-90 mix-blend-lighten"
                style={{
                    maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%), linear-gradient(to top, black 80%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%), linear-gradient(to top, black 80%, transparent 100%)',
                    maskComposite: 'intersect',
                    WebkitMaskComposite: 'source-in'
                }}
            >
                <div className="relative w-full h-full">
                    <Image
                        src="/images/roomi_gate_left_new.png"
                        alt="Roomi Left"
                        fill
                        className="object-contain object-bottom md:object-left-bottom drop-shadow-[0_0_35px_rgba(212,175,55,0.25)] filter brightness-110"
                        priority
                    />
                </div>
            </motion.div>

            {/* Right Half - Bottom Right - Enhanced Size/Position */}
            <motion.div
                variants={rightGateVariant}
                initial="hidden"
                animate="visible"
                className="absolute bottom-0 right-0 w-[45vw] h-[40vh] md:w-[35vw] md:h-[75vh] z-[1] pointer-events-none opacity-90 mix-blend-lighten"
                style={{
                    maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%), linear-gradient(to top, black 80%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%), linear-gradient(to top, black 80%, transparent 100%)',
                    maskComposite: 'intersect',
                    WebkitMaskComposite: 'source-in'
                }}
            >
                <div className="relative w-full h-full">
                    <Image
                        src="/images/roomi_gate_right_new.png"
                        alt="Roomi Right"
                        fill
                        className="object-contain object-bottom md:object-right-bottom drop-shadow-[0_0_35px_rgba(212,175,55,0.25)] filter brightness-110"
                        priority
                    />
                </div>
            </motion.div>

            {/* --- Main Content (High Z-Index) --- */}
            <div
                className="relative z-20 text-center px-4 max-w-6xl mx-auto flex flex-col items-center justify-center"
            >
                {/* Text Vignette - subtle blending layer */}
                <div className="absolute inset-0 bg-radial-gradient from-black/0 via-black/0 to-black/40 blur-3xl -z-10 scale-150" />

                <p className="text-[#D4AF37] font-marcellus text-sm md:text-xl tracking-[0.4em] mb-8 uppercase drop-shadow-md">
                    The Annual Cultural Fest of IET Lucknow
                </p>

                <h1 className="text-7xl md:text-[9rem] font-cinzel text-transparent bg-clip-text bg-gradient-to-b from-[#ffecb3] via-[#ffffff] to-[#d4af37] mb-6 tracking-tight relative filter drop-shadow-[0_2px_10px_rgba(212,175,55,0.3)]">
                    ENCORE
                    <span className="absolute -top-4 -right-4 md:-top-8 md:-right-12 text-3xl md:text-5xl text-[#FFD700] font-script rotate-12 drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]">26</span>
                </h1>


                <h2 className="text-2xl md:text-4xl font-cinzel text-gray-300 tracking-[0.3em] mb-12 md:mb-16 border-t border-b border-[#D4AF37]/30 py-4 max-w-3xl mx-auto">
                    NAWABI ELEGANCE
                </h2>

                <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
                    <Link href={isLoggedIn ? "/dashboard" : "/login"}>
                        <Button size="lg" className="w-56 h-14 text-xl bg-[#D4AF37] text-black border border-[#D4AF37] hover:bg-[#FFD700] hover:scale-105 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300 font-cinzel font-bold">
                            {isLoggedIn ? "Dashboard" : "Register Now"}
                        </Button>
                    </Link>
                    <Link href="/events">
                        <Button variant="outline" size="lg" className="w-56 h-14 text-xl border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all duration-300 font-cinzel">
                            Explore Events
                        </Button>
                    </Link>
                </div>
            </div>
        </section >
    );
}
