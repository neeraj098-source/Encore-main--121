"use client";

import Image from 'next/image';

export default function SignatureNights() {
    const nights = [
        {
            title: "MUSHAIRA",
            subtitle: "A Night of Poetry",
            image: "/images/event/poetry.png", // Using the generated image
            delay: 0
        },
        {
            title: "BOLLYWOOD NIGHT",
            subtitle: "Star Performance",
            image: "/images/event/10.jpg", // Placeholder - check existing images
            delay: 0.2
        },
        {
            title: "EDM NIGHT",
            subtitle: "Electrifying Beats",
            image: "/images/event/28.jpg",
            delay: 0.4
        }
    ];

    return (
        <section className="relative py-32 overflow-hidden">
            {/* Global Background visible */}

            <div className="max-w-7xl mx-auto px-4">
                <div
                    className="text-center mb-24 relative"
                >
                    <div className="absolute left-1/2 -translate-x-1/2 -top-12 opacity-30">
                        {/* Optional ornamental icon or flourishing could go here */}
                    </div>
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
                            className="group relative h-[500px] w-full overflow-hidden rounded-t-[10rem] border border-[#D4AF37]/30 bg-black/20 backdrop-blur-sm"
                        >
                            <Image
                                src={night.image}
                                alt={night.title}
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />

                            {/* Ornamental Arch Border */}
                            <div className="absolute inset-0 border-[1px] border-[#D4AF37]/20 rounded-t-[10rem] m-2 pointer-events-none group-hover:border-[#D4AF37]/60 transition-colors duration-500" />

                            <div className="absolute bottom-0 left-0 w-full p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 text-center">
                                <h3 className="text-3xl font-cinzel text-white mb-3 drop-shadow-md">{night.title}</h3>
                                <p className="text-[#FFD700] font-marcellus text-sm tracking-[0.2em] transform translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100 uppercase border-t border-[#FFD700]/30 pt-3 inline-block px-4">
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
