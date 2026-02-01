"use client";

import Image from 'next/image';

export default function SignatureNights() {
    const nights = [
        {
            title: "Revealing Soon",
            subtitle: "Stay Tuned",
            image: null, // Mystery
            color: "from-gray-900 to-black",
            delay: 0
        },
        {
            title: "Revealing Soon",
            subtitle: "Stay Tuned",
            image: null, // Mystery
            color: "from-gray-900 to-black",
            delay: 0.2
        },
        {
            title: "AJAY HOODA",
            subtitle: "Live in Concert",
            image: "/images/guests/ajay_huda.png",
            // customBackground: "radial-gradient(circle at center, #785a28 0%, #3e2808 60%, #000000 100%)", // Rich gold/brown radial
            customBackground: "radial-gradient(circle at 50% 30%, #6d4c41 0%, #3e2723 40%, #000000 100%)", // Warm sexy dark tone
            delay: 0.4
        }
    ];

    return (
        <section className="relative py-32 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-24 relative">
                    <h2 className="text-5xl md:text-7xl font-cinzel text-[#D4AF37] mb-6 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">SIGNATURE NIGHTS</h2>
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="h-[1px] w-12 bg-[#D4AF37]" />
                        <p className="text-gray-300 font-marcellus tracking-[0.3em] text-lg uppercase">Experience The Magic</p>
                        <div className="h-[1px] w-12 bg-[#D4AF37]" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {nights.map((night, index) => (
                        <div
                            key={index}
                            className="group relative h-[600px] w-full overflow-hidden rounded-t-[10rem] border border-[#D4AF37]/30 bg-black/20 backdrop-blur-sm"
                        >
                            {/* Background Logic */}
                            {night.image ? (
                                <>
                                    {/* Custom Background for Guest */}
                                    <div
                                        className="absolute inset-0 z-0"
                                        style={{ background: night.customBackground || 'black' }}
                                    />

                                    {/* Gradient Pulse Effect for "Sexy" vibe */}
                                    <div className="absolute inset-0 bg-gold/10 opacity-0 group-hover:opacity-20 transition-opacity duration-1000 z-0 mix-blend-overlay" />

                                    <Image
                                        src={night.image}
                                        alt={night.title}
                                        fill
                                        className="object-cover object-top transition-transform duration-700 group-hover:scale-105 z-10"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                    />
                                    {/* Bottom gradient fade for text legibility */}
                                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black via-black/60 to-transparent z-20" />
                                </>
                            ) : (
                                /* Mystery Card Background */
                                <div className={`absolute inset-0 bg-gradient-to-b ${night.color} flex items-center justify-center opacity-60`}>
                                    <span className="text-6xl text-[#D4AF37]/20 font-cinzel">?</span>
                                </div>
                            )}

                            {/* Ornamental Arch Border */}
                            <div className="absolute inset-0 border-[1px] border-[#D4AF37]/20 rounded-t-[10rem] m-2 pointer-events-none group-hover:border-[#D4AF37]/60 transition-colors duration-500 z-30" />

                            <div className="absolute bottom-0 left-0 w-full p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 text-center z-30">
                                <h3 className="text-4xl font-cinzel text-white mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wide">
                                    {night.title}
                                </h3>
                                <p className="text-[#FFD700] font-marcellus text-sm tracking-[0.2em] uppercase border-t border-[#FFD700]/30 pt-3 inline-block px-4">
                                    {night.subtitle}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
