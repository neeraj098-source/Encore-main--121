"use client";

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CornerCurtains() {
    const pathname = usePathname();
    const [isCurtainDown, setIsCurtainDown] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            const triggerSection = document.getElementById('pure-energy-trigger');
            if (triggerSection) {
                const rect = triggerSection.getBoundingClientRect();
                const triggerPoint = window.innerHeight * 0.3; // Top 30% of viewport

                // If section is below the trigger point, curtains should be DOWN (true)
                // If section moves UP past the trigger point, curtains roll UP (false)
                const shouldBeDown = rect.top > triggerPoint;

                // Only update state if it changes to avoid re-renders
                setIsCurtainDown(shouldBeDown);
            }
        };

        // Initial check
        handleScroll();

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Only show on Home Page
    if (pathname !== '/') return null;

    return (
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[1] overflow-hidden">
            {/* Left Corner Curtain */}
            <motion.div
                initial={{ y: 0 }}
                animate={{ y: isCurtainDown ? 0 : '-100%' }}
                transition={{ duration: 1.4, ease: "easeInOut" }}
                className="absolute top-0 left-0 w-[22vh] h-[22vh] md:w-[32vh] md:h-[32vh] xl:w-[40vh] xl:h-[40vh]"
            >
                <Image
                    src="/images/curtain_corner_right.png"
                    alt="Corner Curtain Left"
                    fill
                    className="object-contain object-top-left drop-shadow-[5px_5px_15px_rgba(0,0,0,0.5)]"
                    priority
                />
            </motion.div>

            {/* Right Corner Curtain */}
            <motion.div
                initial={{ y: 0 }}
                animate={{ y: isCurtainDown ? 0 : '-100%' }}
                transition={{ duration: 1.4, ease: "easeInOut" }}
                className="absolute top-0 right-0 w-[22vh] h-[22vh] md:w-[32vh] md:h-[32vh] xl:w-[40vh] xl:h-[40vh]"
            >
                <Image
                    src="/images/curtain_corner_left.png"
                    alt="Corner Curtain Right"
                    fill
                    className="object-contain object-top-right drop-shadow-[-5px_5px_15px_rgba(0,0,0,0.5)]"
                    priority
                />
            </motion.div>
        </div>
    );
}
