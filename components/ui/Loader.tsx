"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Loader() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Adjust time to sync with zoom animation
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2200);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    key="loader-container"
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden"
                    exit={{ opacity: 0, transition: { duration: 0.5 } }}
                >
                    <motion.div
                        className="relative w-[100vw] h-[100vh] flex items-center justify-center"
                        initial={{ scale: 1, opacity: 1 }}
                        animate={{
                            scale: [1, 1.5, 40],
                            opacity: [1, 1, 0]
                        }}
                        transition={{
                            duration: 2.5,
                            times: [0, 0.4, 1],
                            ease: [0.7, 0, 0.3, 1]
                        }}
                    >
                        {/* The Roomi Gate Image */}
                        <div className="relative w-full h-full max-w-4xl max-h-[80vh] aspect-square">
                            <Image
                                src="/images/roomi_gate_symmetric.png"
                                alt="Enter Encore"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
