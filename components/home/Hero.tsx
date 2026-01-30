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

            <div className="relative z-20 flex flex-col items-center justify-center min-h-[90vh] text-center px-4 w-full">

                {/* Architectural Frame - Centered Arch */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
                >
                    <div className="relative w-full h-full max-w-5xl aspect-[4/3] md:aspect-video opacity-80">
                        <Image
                            src="/images/mughal-arch.png"
                            alt="Mughal Arch Frame"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </motion.div>

                {/* Main Content inside the Arch */}
                <div className="relative z-10 pt-20 md:pt-32">
                    <motion.p
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="text-gold font-marcellus text-xs md:text-sm tracking-[0.4em] mb-4 uppercase"
                    >
                        The Annual Cultural Fest of IET Lucknow
                    </motion.p>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className="text-7xl md:text-9xl font-cinzel text-white mb-2 tracking-tight relative drop-shadow-2xl"
                    >
                        ENCORE
                        <span className="absolute -top-2 -right-4 md:-top-4 md:-right-8 text-2xl md:text-4xl text-gold font-marcellus rotate-12">26</span>
                    </motion.h1>

                    <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 1 }}
                        className="text-2xl md:text-4xl font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-gold to-amber-200 tracking-[0.3em] mb-12 shadow-gold/20"
                    >
                        NAWABI ELEGANCE
                    </motion.h2>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5, duration: 0.8 }}
                        className="flex flex-col md:flex-row gap-4 justify-center items-center"
                    >
                        <Link href="/events">
                            <Button size="lg" className="w-56 h-14 text-lg bg-gold text-black border-gold hover:bg-white hover:text-black hover:border-white transition-all duration-300 font-cinzel font-bold tracking-widest uppercase">
                                Explore Events
                            </Button>
                        </Link>

                        <Link href="/#highlights">
                            <Button variant="outline" size="lg" className="w-56 h-14 text-lg border-white/30 text-white hover:bg-white/10 hover:border-gold hover:text-gold transition-all duration-300 font-cinzel tracking-widest uppercase">
                                Past Highlights
                            </Button>
                        </Link>

                        <Link href={isLoggedIn ? "/dashboard" : "/login"}>
                            <Button variant="outline" size="lg" className="w-56 h-14 text-lg border-white/30 text-white hover:bg-white/10 hover:border-gold hover:text-gold transition-all duration-300 font-cinzel tracking-widest uppercase">
                                {isLoggedIn ? "Dashboard" : "Register Now"}
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section >
    );
}
