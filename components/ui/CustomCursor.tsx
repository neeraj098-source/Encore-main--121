"use client";

import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function CustomCursor() {
    // Independent mouse position
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    // Smooth springs for the ring (laggy feel)
    const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
    const ringX = useSpring(mouseX, springConfig);
    const ringY = useSpring(mouseY, springConfig);

    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseDown = () => setIsVisible(true);

        // Hover detection logic
        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isClickable =
                target.tagName.toLowerCase() === 'a' ||
                target.tagName.toLowerCase() === 'button' ||
                target.closest('a') ||
                target.closest('button') ||
                target.getAttribute('role') === 'button';

            if (isClickable) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        if (window.matchMedia("(pointer: fine)").matches) {
            window.addEventListener('mousemove', moveCursor);
            window.addEventListener('mousedown', handleMouseDown);
            window.addEventListener('mouseover', handleMouseOver);
        }

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, [mouseX, mouseY, isVisible]);

    return (
        <>
            {/* Main Dot - Follows mouse exactly (no lag) */}
            <motion.div
                className="fixed top-0 left-0 w-3 h-3 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
                style={{
                    x: mouseX,
                    y: mouseY,
                    opacity: isVisible ? 1 : 0,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
            />

            {/* Interaction Ring - Smooth lag */}
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9998] mix-blend-difference border border-white hidden md:block"
                style={{
                    x: ringX,
                    y: ringY,
                    opacity: isVisible ? 1 : 0,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={{
                    scale: isHovering ? 2.5 : 1,
                    backgroundColor: isHovering ? "rgba(255, 255, 255, 0.1)" : "transparent",
                    borderColor: isHovering ? "transparent" : "white",
                }}
                transition={{
                    scale: { duration: 0.2 },
                    backgroundColor: { duration: 0.2 }
                }}
            />
        </>
    );
}
