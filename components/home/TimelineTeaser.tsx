"use client";

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

export default function TimelineTeaser() {
    const events = [
        {
            day: "DAY 01",
            title: "The Grand Awakening",
            date: "FEBRUARY 19",
            description: "Inauguration • Prelims • Literature",
            align: "left"
        },
        {
            day: "DAY 02",
            title: "Rhythm of Royalty",
            date: "FEBRUARY 20",
            description: "Dance • Drama • Fine Arts",
            align: "right"
        },
        {
            day: "DAY 03",
            title: "The Final Crescendo",
            date: "FEBRUARY 21",
            description: "Grand Finale • Celebrity Night",
            align: "left"
        },
    ];

    const containerRef = useRef<HTMLDivElement>(null);
    const firstCircleRef = useRef<HTMLDivElement>(null);
    const lastCircleRef = useRef<HTMLDivElement>(null);
    const [lineStyle, setLineStyle] = useState({ top: 0, height: 0 });

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 65%", "end 50%"]
    });

    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        const updateLine = () => {
            if (containerRef.current && firstCircleRef.current && lastCircleRef.current) {
                const containerRect = containerRef.current.getBoundingClientRect();
                const firstRect = firstCircleRef.current.getBoundingClientRect();
                const lastRect = lastCircleRef.current.getBoundingClientRect();

                // Calculate relative positions from top of container
                const top = firstRect.top - containerRect.top + (firstRect.height / 2);
                const bottom = lastRect.top - containerRect.top + (lastRect.height / 2);
                const height = bottom - top;

                setLineStyle({ top, height });
            }
        };

        // Initial calculation
        updateLine();

        // Recalculate on resize
        window.addEventListener('resize', updateLine);
        // Slightly delayed calculation to ensure layout is settled
        const timer = setTimeout(updateLine, 100);

        return () => {
            window.removeEventListener('resize', updateLine);
            clearTimeout(timer);
        };
    }, []);

    return (
        <section className="relative min-h-screen py-32 overflow-hidden flex flex-col items-center justify-center">

            {/* Background Texture & Elements */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />

            {/* Section Header */}
            <div className="text-center mb-20 md:mb-32 relative z-10">
                <div className="inline-block relative">
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[1px] h-20 bg-gradient-to-b from-transparent to-[#D4AF37] opacity-60" />
                    <span className="text-[#D4AF37] font-marcellus text-sm tracking-[0.5em] uppercase block mb-6 drop-shadow-md">The Journey Begins</span>
                    <h2 className="text-6xl md:text-8xl font-cinzel text-transparent bg-clip-text bg-gradient-to-b from-[#fff] via-[#ffe0b2] to-[#d4af37] filter drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)]">
                        ROYAL CHRONICLE
                    </h2>
                </div>
            </div>

            {/* Timeline Container */}
            <div ref={containerRef} className="relative w-full max-w-6xl mx-auto px-6 md:px-12 flex flex-col gap-24 md:gap-32">

                {/* Base Line (Faint Background) - strictly between circles */}
                <div
                    className="absolute left-4 md:left-1/2 w-[1px] bg-[#D4AF37]/10 -translate-x-1/2 md:translate-x-0"
                    style={{
                        top: lineStyle.top,
                        height: lineStyle.height
                    }}
                />

                {/* Animated Line (Bright Gold) */}
                <motion.div
                    className="absolute left-4 md:left-1/2 w-[2px] bg-gradient-to-b from-[#FFD700] via-[#FDB931] to-[#FFD700] -translate-x-1/2 md:translate-x-0 origin-top shadow-[0_0_15px_rgba(255,215,0,0.6)] z-10"
                    style={{
                        top: lineStyle.top,
                        height: lineStyle.height,
                        scaleY: scaleY
                    }}
                />

                {events.map((event, index) => (
                    <div
                        key={index}
                        className={`relative flex flex-col md:flex-row items-center w-full ${event.align === 'right' ? 'md:flex-row-reverse' : ''}`}
                    >
                        {/* Content Side */}
                        <div className={`w-full md:w-5/12 pl-12 md:pl-0 ${event.align === 'right' ? 'md:pl-16 text-left' : 'md:pr-16 md:text-right'}`}>
                            <div className="relative group">
                                {/* Large Day Number */}
                                <h3 className={`text-7xl md:text-9xl font-cinzel text-[#ffffff]/[0.03] absolute -top-12 md:-top-20 ${event.align === 'right' ? 'left-0' : 'right-0 md:right-0 left-0 md:left-auto'} select-none z-0 transition-colors duration-700 group-hover:text-[#D4AF37]/10`}>
                                    {event.day}
                                </h3>

                                <div className="relative z-10 border-l-2 md:border-l-0 md:border-none pl-6 md:pl-0 border-[#D4AF37]/50">
                                    <h4 className="text-[#FFD700] font-marcellus text-xl tracking-[0.2em] mb-3 drop-shadow-sm">{event.date}</h4>
                                    <h3 className="text-4xl md:text-6xl font-cinzel text-white mb-4 leading-tight drop-shadow-lg">{event.title}</h3>
                                    <p className="text-gray-300 font-marcellus text-xl md:text-2xl tracking-wide opacity-80">
                                        {event.description}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Central Node - Static */}
                        <div
                            ref={index === 0 ? firstCircleRef : index === events.length - 1 ? lastCircleRef : null}
                            className="absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 md:w-16 md:h-16 flex items-center justify-center z-20"
                        >
                            <div className="w-3 h-3 md:w-5 md:h-5 bg-[#FFD700] rounded-full shadow-[0_0_20px_#FFD700] relative z-10" />
                            <div className="absolute inset-0 border border-[#D4AF37]/40 rounded-full scale-110" />
                        </div>
                        <div className="w-full md:w-5/12 hidden md:block" />
                    </div>
                ))}
            </div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black to-transparent pointer-events-none" />
        </section>
    );
}
