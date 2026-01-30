"use client";

import { motion, useScroll } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

export default function TimelineTeaser() {
    const containerRef = useRef<HTMLDivElement>(null);
    const firstNodeRef = useRef<HTMLHTMLDivElement>(null);
    const lastNodeRef = useRef<HTMLHTMLDivElement>(null);
    const [lineStyle, setLineStyle] = useState({ top: 0, height: 0 });

    // Measure positions to align the line exactly center-to-center
    useEffect(() => {
        const updatePosition = () => {
            if (containerRef.current && firstNodeRef.current && lastNodeRef.current) {
                const containerRect = containerRef.current.getBoundingClientRect();
                const firstRect = firstNodeRef.current.getBoundingClientRect();
                const lastRect = lastNodeRef.current.getBoundingClientRect();

                const top = firstRect.top - containerRect.top + (firstRect.height / 2);
                const bottom = lastRect.top - containerRect.top + (lastRect.height / 2);
                const height = bottom - top;

                setLineStyle({ top, height });
            }
        };

        updatePosition();
        window.addEventListener('resize', updatePosition);
        return () => window.removeEventListener('resize', updatePosition);
    }, []);

    // Scroll progress for the drawing animation
    // We target the container but adjust offsets to match the line's visual start
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 60%", "end 40%"] // Starts drawing when top of container is at 60% viewport height
    });

    const events = [
        {
            day: "DAY 01",
            title: "The Grand Awakening",
            date: "FEBRUARY 20",
            description: "Inauguration • Prelims • Literature",
            align: "left"
        },
        {
            day: "DAY 02",
            title: "Rhythm of Royalty",
            date: "FEBRUARY 21",
            description: "Dance • Drama • Fine Arts",
            align: "right"
        },
        {
            day: "DAY 03",
            title: "The Final Crescendo",
            date: "FEBRUARY 22",
            description: "Grand Finale • Celebrity Night",
            align: "left"
        },
    ];

    return (
        <section className="relative bg-[#0a0a0a] min-h-screen py-32 overflow-hidden flex flex-col items-center justify-center">

            {/* Background Texture & Elements */}
            <div className="absolute inset-0 opacity-20 pointer-events-none"
                style={{ backgroundImage: 'url("/images/texture-noise.png")' }}></div>

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.03)_0%,transparent_70%)] pointer-events-none" />

            {/* Floating Dust Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-gold rounded-full opacity-20"
                        animate={{
                            y: [-20, -100],
                            x: Math.random() * 100 - 50,
                            opacity: [0, 0.5, 0]
                        }}
                        transition={{
                            duration: 5 + Math.random() * 5,
                            repeat: Infinity,
                            ease: "linear",
                            delay: Math.random() * 5
                        }}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`
                        }}
                    />
                ))}
            </div>

            {/* Section Header */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="text-center mb-20 md:mb-32 relative z-10"
            >
                <div className="inline-block relative">
                    <span className="text-gold font-marcellus text-sm tracking-[0.5em] uppercase block mb-4">The Journey Begins</span>
                    <h2 className="text-5xl md:text-7xl font-cinzel text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-100 to-amber-900 filter drop-shadow-lg">
                        ROYAL CHRONICLE
                    </h2>
                </div>
            </motion.div>

            {/* Timeline Container */}
            <div ref={containerRef} className="relative w-full max-w-6xl mx-auto px-6 md:px-12 flex flex-col gap-24 md:gap-32">

                {/* Central Line - Positioned precisely via JS */}
                <div
                    className="absolute left-4 md:left-1/2 w-[2px] bg-white/5 -translate-x-1/2 md:translate-x-0"
                    style={{ top: lineStyle.top, height: lineStyle.height }}
                >
                    <motion.div
                        className="w-full bg-gradient-to-b from-gold via-yellow-200 to-gold shadow-[0_0_15px_#FFD700] origin-top"
                        style={{ scaleY: scrollYProgress }}
                    />
                </div>

                {events.map((event, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: index * 0.2 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className={`relative flex flex-col md:flex-row items-center w-full ${event.align === 'right' ? 'md:flex-row-reverse' : ''}`}
                    >
                        {/* Content Side */}
                        <div className={`w-full md:w-5/12 pl-12 md:pl-0 ${event.align === 'right' ? 'md:pl-16 text-left' : 'md:pr-16 md:text-right'}`}>
                            <div className="relative">
                                {/* Large Day Number */}
                                <h3 className={`text-6xl md:text-8xl font-cinzel text-white/5 md:text-white/5 absolute -top-10 md:-top-16 ${event.align === 'right' ? 'left-0' : 'right-0 md:right-0 left-0 md:left-auto'} select-none z-0`}>
                                    {event.day}
                                </h3>

                                <div className="relative z-10">
                                    <h4 className="text-gold font-marcellus text-lg tracking-[0.2em] mb-2">{event.date}</h4>
                                    <h3 className="text-3xl md:text-5xl font-cinzel text-white mb-4 leading-tight">{event.title}</h3>
                                    <p className="text-gray-400 font-marcellus text-lg md:text-xl tracking-wide border-l-2 md:border-l-0 md:border-r-0 border-gold/30 pl-4 md:pl-0">
                                        {event.description}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Central Node */}
                        <div
                            ref={index === 0 ? firstNodeRef : index === events.length - 1 ? lastNodeRef : null}
                            className="absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 md:w-12 md:h-12 flex items-center justify-center z-20"
                        >
                            <div className="w-3 h-3 md:w-4 md:h-4 bg-gold rounded-full shadow-[0_0_15px_#FFD700] animate-pulse" />
                            <div className="absolute inset-0 border border-gold/40 rounded-full scale-110" />
                            <div className="absolute inset-0 border border-gold/20 rounded-full scale-150 animate-ping-slow" />
                        </div>
                        <div className="w-full md:w-5/12 hidden md:block" />
                    </motion.div>
                ))}
            </div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
        </section>
    );
}
