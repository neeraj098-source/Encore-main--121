"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Loader() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading time
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 1, ease: "easeInOut" } }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden"
                >
                    {/* Left Curtain */}
                    <motion.div
                        initial={{ x: 0 }}
                        exit={{ x: "-100%", transition: { duration: 1.5, ease: [0.76, 0, 0.24, 1] } }}
                        className="absolute left-0 top-0 h-full w-1/2 bg-black z-10 flex items-center justify-end border-r border-gold/20"
                    >
                        <div className="absolute right-0 top-0 h-full w-[2px] bg-gradient-to-b from-transparent via-gold to-transparent opacity-50" />
                    </motion.div>

                    {/* Right Curtain */}
                    <motion.div
                        initial={{ x: 0 }}
                        exit={{ x: "100%", transition: { duration: 1.5, ease: [0.76, 0, 0.24, 1] } }}
                        className="absolute right-0 top-0 h-full w-1/2 bg-black z-10 flex items-center justify-start border-l border-gold/20"
                    >
                        <div className="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-transparent via-gold to-transparent opacity-50" />
                    </motion.div>

                    {/* Center Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.5 }}
                        className="relative z-20 flex flex-col items-center"
                    >
                        <div className="relative w-32 h-32 mb-6">
                            <Image src="/images/iet_logo_new.png" alt="Loader Logo" fill className="object-contain" />
                        </div>
                        <h1 className="text-4xl font-cinzel text-gold font-bold tracking-[0.2em] mb-2 text-center">ENCORE</h1>
                        <p className="text-gray-400 font-marcellus text-sm tracking-widest uppercase">Nawabi Elegance</p>

                        {/* Progress Bar */}
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: 200 }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                            className="h-[1px] bg-gold mt-8"
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
