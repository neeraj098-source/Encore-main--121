"use client";

export default function CinematicBackground() {
    return (
        <div className="fixed inset-0 z-[-50] overflow-hidden pointer-events-none">
            {/* Layer 1: Base Atmosphere (Deep Cinematic Gradients) */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#0a0a0a] to-[#020202]" />

            {/* Layer 2: Texture/Noise (Subtle Grain) */}
            <div
                className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Layer 3: Static Sheen (replaced particles) */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)]" />

            {/* Extra Cinematic Sheen (Top Down Light) */}
            <div className="absolute top-0 left-0 right-0 h-[50vh] bg-gradient-to-b from-[#D4AF37]/5 to-transparent pointer-events-none" />
        </div>
    );
}
