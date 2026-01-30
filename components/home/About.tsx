"use client";


import Image from 'next/image';

export default function About() {
    return (<section className="relative py-24 px-4 bg-black overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-900/10 to-transparent pointer-events-none" />

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">

            {/* Image Content */}
            <div className="w-full md:w-1/2 relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 relative">
                    <Image
                        src="/images/rumi.png"
                        alt="Roomi Darwaza"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
                {/* Floating Tag */}
                <div className="absolute -bottom-6 -right-6 bg-gold text-black px-8 py-4 rounded-lg shadow-xl hidden md:block">
                    <span className="font-cinzel font-bold text-xl">Est. Legacy</span>
                </div>
            </div>

            {/* Text Content */}
            <div className="w-full md:w-1/2 space-y-6">
                <h2 className="text-gold font-cinzel text-4xl md:text-5xl">About Encore 26</h2>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                    <p className="font-marcellus text-gray-300 leading-relaxed text-lg">
                        Embark on a legacy as the Institute of Engineering and Technology, Lucknow, proudly unfolds the annual saga of Encore. With a storied history spanning many years, this iconic event has evolved into a beacon of excellence and innovation.
                        <br /><br />
                        Encore has had the honor of hosting renowned personalities, including the melodious Jubin Nautiyal and the vivacious Neha Kakkar, whose captivating performances added an unforgettable dimension to the narrative.
                        <br /><br />
                        Join us for a time-honored celebration where tradition gracefully intertwines with modernity, and where the echoes of the past resonate with the promise of an even grander future.
                    </p>
                </div>
            </div>
        </div>
    </section>
    );
}
