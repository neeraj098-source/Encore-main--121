"use client";


import Image from 'next/image';

export default function SponsorsPreview() {
    // Placeholder logos - replace with actual sponsor logos
    const sponsors = [
        "Sponsor 1", "Sponsor 2", "Sponsor 3", "Sponsor 4", "Sponsor 5", "Sponsor 6"
    ];

    return (
        <section className="relative py-24 overflow-hidden border-t border-[#D4AF37]/20">
            {/* Global background visible */}

            <div className="max-w-7xl mx-auto px-4 text-center mb-16">
                <h2 className="text-4xl font-cinzel text-[#e0e0e0] tracking-wide relative inline-block">
                    OUR PARTNERS
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-[#D4AF37]" />
                </h2>
            </div>

            <div className="relative w-full py-12 bg-[#D4AF37]/5 backdrop-blur-sm border-t border-b border-[#D4AF37]/10">
                <div className="flex flex-wrap justify-center gap-8 px-4">
                    {sponsors.map((sponsor, index) => (
                        <div key={index} className="inline-flex items-center justify-center relative w-48 h-24 opacity-60 hover:opacity-100 transition-all duration-300 cursor-pointer group">
                            <div className="absolute inset-0 bg-[#D4AF37]/0 group-hover:bg-[#D4AF37]/10 rounded-lg transition-colors duration-300" />
                            {/* Placeholder for Sponsor Logo */}
                            <div className="w-full h-full flex items-center justify-center border border-[#D4AF37]/20 rounded-lg text-sm text-[#D4AF37] font-marcellus hover:border-[#D4AF37] hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all">
                                {sponsor}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
