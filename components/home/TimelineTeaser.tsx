"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function TimelineTeaser() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
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
        <section ref={containerRef} className="relative bg-[#0a0a0a] min-h-screen py-32 overflow-hidden flex flex-col items-center justify-center">

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
            <div className="relative w-full max-w-6xl mx-auto px-6 md:px-12 flex flex-col gap-24 md:gap-32">

                {/* Central Line */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-white/5 -translate-x-1/2 md:translate-x-0">
                    <motion.div
                        className="w-full bg-gradient-to-b from-transparent via-gold to-transparent box-shadow-[0_0_15px_#FFD700]"
                        style={{ height: scrollYProgress.get() * 100 + "%", maxHeight: '100%' }} // Simple height animation based on scroll might need adjustment, using transform scaleY is cleaner but height works for gradient fill simulation if container is fixed
                    />
                    {/* Better scroll progress line */}
                    <motion.div
                        className="absolute top-0 left-0 w-full bg-gold origin-top shadow-[0_0_10px_#FFD700]"
                        style={{ scaleY: scrollYProgress, height: '100%' }}
                    />
                </div>

                {events.map((event, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: index * 0.2 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className={`relative flex flex-col md:flex-row items-start md:items-center w-full ${event.align === 'right' ? 'md:flex-row-reverse' : ''}`}
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
                        <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 md:w-12 md:h-12 flex items-center justify-center z-20 mt-2 md:mt-0">
                            <div className="w-3 h-3 md:w-4 md:h-4 bg-gold rounded-full shadow-[0_0_15px_#FFD700] animate-pulse" />
                            <div className="absolute inset-0 border border-gold/40 rounded-full scale-110" />
                            <div className="absolute inset-0 border border-gold/20 rounded-full scale-150 animate-ping-slow" />
                        </div>

                        {/* Empty Space for alignment */}
                        <div className="w-full md:w-5/12 hidden md:block" />
                    </motion.div>
                ))}
            </div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
        </section>
    );
}
