"use client";

import { motion } from "framer-motion";

export default function CinematicLightingOverlay() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 2.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[5] pointer-events-none mix-blend-screen"
        >
            {/* 1. Central Golden Halo - Reunites the Gates */}
            <div
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,215,0,0.15)_0%,_transparent_70%)]"
                style={{ filter: "blur(60px)" }}
            />

            {/* 2. Top-Down Stage Light - Vertical Emphasis */}
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[60vh] bg-[conic-gradient(from_180deg_at_50%_0%,_rgba(212,175,55,0.1)_0deg,_transparent_60deg,_transparent_300deg,_rgba(212,175,55,0.1)_360deg)] opacity-60"
                style={{ filter: "blur(40px)" }}
            />

            {/* 3. Subtle Warm Ambient Fill - Prevents 'Black Hole' effect between sections */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/5 via-transparent to-[#D4AF37]/5 mix-blend-overlay" />

            {/* 4. Film Grain Texture - CSS Only */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`
                }}
            />

            {/* 5. Floating Gold Particles - CSS Based (No Canvas) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-[#FFD700] opacity-0 animate-float-particle"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            width: `${Math.random() * 3 + 1}px`, // 1-4px size
                            height: `${Math.random() * 3 + 1}px`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${Math.random() * 10 + 10}s`, // 10-20s duration
                            boxShadow: `0 0 ${Math.random() * 4 + 2}px #FFD700` // Glow
                        }}
                    />
                ))}
            </div>
        </motion.div>
    );
}
