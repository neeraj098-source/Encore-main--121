"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import Particles from '@/components/ui/Particles';

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

    // Removed useEffect for delays/auth as they are now lazy initialized

    // Animation Variants
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const textVariant: any = {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeInOut",
                delay: delays.text // Wait for curtains (Loader) to start opening (2.5s)
            }
        }
    };

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
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
            {/* Pure Black Background - Video Removed */}

            {/* --- Decorative Architectural Images (Rumi Darwaza Halves) --- */}

            {/* Left Half - Bottom Left */}
            <motion.div
                variants={leftGateVariant}
                initial="hidden"
                animate="visible"
                className="absolute bottom-0 left-0 w-[50vw] h-[35vh] md:w-[35vw] md:h-[65vh] z-10 pointer-events-none"
            >
                <div className="relative w-full h-full">
                    <Image
                        src="/images/roomi_right.png"
                        alt="Roomi Left"
                        fill
                        className="object-contain object-bottom md:object-left-bottom"
                        priority
                    />
                </div>
            </motion.div>

            {/* Right Half - Bottom Right */}
            <motion.div
                variants={rightGateVariant}
                initial="hidden"
                animate="visible"
                className="absolute bottom-0 right-0 w-[50vw] h-[35vh] md:w-[35vw] md:h-[65vh] z-10 pointer-events-none"
            >
                <div className="relative w-full h-full">
                    <Image
                        src="/images/roomi_left.png"
                        alt="Roomi Right"
                        fill
                        className="object-contain object-bottom md:object-right-bottom"
                        priority
                    />
                </div>
            </motion.div>


            {/* --- Main Content (High Z-Index) --- */}
            <motion.div
                className="relative z-20 text-center px-4 max-w-5xl mx-auto"
                variants={textVariant}
                initial="hidden"
                animate="visible"
            >
                <p className="text-gold font-marcellus text-sm md:text-lg tracking-[0.3em] mb-6 uppercase">
                    The Annual Cultural Fest of IET Lucknow
                </p>

                <h1 className="text-6xl md:text-9xl font-cinzel text-white mb-4 tracking-tight relative">
                    ENCORE
                    <span className="absolute -top-4 -right-6 md:-top-8 md:-right-12 text-2xl md:text-4xl text-gold font-script rotate-12">26</span>
                </h1>


                <h2 className="text-xl md:text-3xl font-cinzel text-gray-400 tracking-[0.2em] mb-8 md:mb-12">
                    NAWABI ELEGANCE
                </h2>

                <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                    <Link href={isLoggedIn ? "/dashboard" : "/login"}>
                        <Button size="lg" className="w-48 text-lg bg-gold text-black border-gold hover:bg-gold/90 transition-all duration-300">
                            {isLoggedIn ? "Dashboard" : "Register Now"}
                        </Button>
                    </Link>
                    <Link href="/events">
                        <Button variant="outline" size="lg" className="w-48 text-lg border-white/20 text-white hover:bg-white/10 transition-all duration-300">
                            Explore Events
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </section >
    );
}
