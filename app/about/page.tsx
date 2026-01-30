"use client";

import { motion } from 'framer-motion';
import { User, Award, Users, Instagram, Linkedin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
    // Organizers Data
    // We need 7 posts. 
    // 1. General Secretary: Ujjwal Pathak
    // 2. Media & Production Head
    // 3-7. Placeholders
    const organizers = [
        {
            id: 1,
            name: "Ujjwal Pathak",
            role: "General Secretary",
            image: "/images/team/ujjwal_pathak.jpg",
            isHighlight: true,
            socials: {
                instagram: "https://www.instagram.com/the.ujjwal__?igsh=b3JzMXZtOGw3dDBr",
                linkedin: "https://www.linkedin.com/in/ujjwalpathak16?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
            }
        },
        {
            id: 2,
            name: "Pratham Sahani",
            role: "Media Head",
            image: "/images/team/media_head.jpg",
            isHighlight: true,
            socials: {
                instagram: "https://www.instagram.com/_.arpit_22?igsh=ejNkM2FyNnlqMXFz&utm_source=qr"
            }
        },
        // 5 Placeholders
        {
            id: 3,
            name: "Hensi Baghel",
            role: "Tech Head",
            image: "/images/team/hensi_baghel.jpg",
            isHighlight: true,
            socials: {
                instagram: "https://www.instagram.com/hensi_baghel?igsh=MXFkYTRsdHdkNWJ4aw%3D%3D&utm_source=qr",
                linkedin: "https://www.linkedin.com/in/hensi43"
            }
        },
        {
            id: 4,
            name: "Aryan Sinha",
            role: "PR Head",
            image: "/images/team/aryan_sinha.jpg",
            isHighlight: true,
            socials: {
                instagram: "https://www.instagram.com/aryan.sinha._?igsh=MTczejV5M2lkc3p6bA==",
                linkedin: "https://linkedin.com"
            }
        },
        {
            id: 5,
            name: "Arpit Sinha",
            role: "Operations Head",
            image: "/images/team/arpit_sinha.jpg",
            isHighlight: true,
            socials: {
                instagram: "https://www.instagram.com/_.arpit_22?igsh=ejNkM2FyNnlqMXFz&utm_source=qr",
                linkedin: "https://linkedin.com"
            }
        },
        {
            id: 6,
            name: "Anurag Mishra",
            role: "Logistics & Security Head",
            image: "/images/team/anurag_mishra.jpg",
            isHighlight: true,
            socials: {
                instagram: "https://www.instagram.com/anuragmishra_240?igsh=MTY3aGcyd2JrcDdjcg==",
                linkedin: "https://www.linkedin.com/in/anurag-mishra-825848259?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
            }
        },
    ];

    return (
        <div className="min-h-screen bg-black pt-20 pb-20">
            {/* 1. Hero Section */}
            <section className="relative py-20 px-4 mb-12">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none" />
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-cinzel text-gold mb-6"
                    >
                        About Us
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-400 font-marcellus max-w-2xl mx-auto"
                    >
                        The pillars behind the legacy of Encore.
                    </motion.p>
                </div>
            </section>

            {/* 2. Organizers Team Section */}
            <section className="py-10 px-4 mb-24 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="relative text-center mb-20">
                        {/* Decorative side lines */}
                        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
                        <h2 className="relative z-10 inline-block bg-black px-12 text-4xl md:text-6xl font-cinzel text-[#D4AF37] uppercase tracking-[0.2em] drop-shadow-[0_2px_15px_rgba(212,175,55,0.3)]">
                            Organizers
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
                        {organizers.map((member, index) => (
                            <motion.div
                                key={member.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.6 }}
                                className="w-full max-w-sm bg-[#050505] border border-[#D4AF37]/30 rounded-xl p-8 text-center group relative overflow-hidden shadow-[0_0_25px_rgba(0,0,0,0.8)] hover:shadow-[0_0_35px_rgba(212,175,55,0.15)] hover:border-[#D4AF37]/60 transition-all duration-500"
                            >
                                {/* Royal Corner Accents (CSS based) */}
                                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#D4AF37]/40 rounded-tl-md group-hover:border-[#D4AF37] transition-colors" />
                                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#D4AF37]/40 rounded-tr-md group-hover:border-[#D4AF37] transition-colors" />
                                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#D4AF37]/40 rounded-bl-md group-hover:border-[#D4AF37] transition-colors" />
                                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#D4AF37]/40 rounded-br-md group-hover:border-[#D4AF37] transition-colors" />

                                <div className="w-44 h-44 mx-auto rounded-full mb-6 relative overflow-visible">
                                    {/* Double Ring Frame Effect */}
                                    <div className="absolute inset-[-6px] rounded-full border border-[#D4AF37]/20 group-hover:border-[#D4AF37]/40 group-hover:scale-105 transition-all duration-500" />
                                    <div className="absolute inset-0 rounded-full border-2 border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.3)] overflow-hidden">
                                        {member.image ? (
                                            <Image
                                                src={member.image}
                                                alt={member.name}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 text-[#D4AF37]/40">
                                                <Users size={48} />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-cinzel text-[#E8E1CF] mb-3 group-hover:text-[#D4AF37] transition-colors duration-300">
                                    {member.name}
                                </h3>

                                <div className="inline-block relative mb-8">
                                    <p className="font-marcellus text-[#D4AF37] text-xs tracking-[0.25em] uppercase pb-2 border-b border-[#D4AF37]/30">
                                        {member.role}
                                    </p>
                                    <div className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-[#D4AF37]" />
                                </div>

                                {/* Social Links Overlay */}
                                <div className="flex justify-center gap-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-75">
                                    {member.socials?.instagram && (
                                        <Link
                                            href={member.socials.instagram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#D4AF37]/70 hover:text-[#D4AF37] hover:scale-110 transition-all"
                                        >
                                            <Instagram size={22} />
                                        </Link>
                                    )}
                                    {member.socials?.linkedin && (
                                        <Link
                                            href={member.socials.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#D4AF37]/70 hover:text-[#D4AF37] hover:scale-110 transition-all"
                                        >
                                            <Linkedin size={22} />
                                        </Link>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Faculties Section (Bottom) */}
            <section className="py-16 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="relative text-center mb-16">
                        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
                        <h2 className="relative z-10 inline-block bg-black px-8 text-3xl md:text-4xl font-cinzel text-[#D4AF37]/80 uppercase tracking-widest">
                            Faculties
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Director */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-[#080808] border border-white/5 rounded-2xl p-8 text-center group hover:bg-[#0c0c0c] hover:border-[#D4AF37]/20 transition-all duration-500"
                        >
                            <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border border-[#D4AF37]/30 mb-6 relative shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:border-[#D4AF37]/60 transition-colors">
                                <Image
                                    src="/images/team/dr_vineet_kansal.jpg"
                                    alt="Dr. Vineet Kansal"
                                    fill
                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                />
                            </div>
                            <h3 className="text-2xl font-cinzel text-[#E8E1CF] mb-2 group-hover:text-[#D4AF37] transition-colors">Dr. Vineet Kansal</h3>
                            <p className="text-[#D4AF37]/80 font-marcellus text-sm tracking-[0.15em] mb-4 uppercase">Director, IET Lucknow</p>
                            <p className="text-gray-500 font-marcellus text-sm leading-relaxed max-w-sm mx-auto">
                                Guiding the institute towards excellence with visionary leadership.
                            </p>
                        </motion.div>

                        {/* ISSACC Chairman */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-[#080808] border border-white/5 rounded-2xl p-8 text-center group hover:bg-[#0c0c0c] hover:border-[#D4AF37]/20 transition-all duration-500"
                        >
                            <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border border-[#D4AF37]/30 mb-6 relative shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:border-[#D4AF37]/60 transition-colors">
                                <Image
                                    src="/images/team/dr_satyendra_singh.png"
                                    alt="Dr. Satyendra Singh"
                                    fill
                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                />
                            </div>
                            <h3 className="text-2xl font-cinzel text-[#E8E1CF] mb-2 group-hover:text-[#D4AF37] transition-colors">Dr. Satyendra Singh</h3>
                            <p className="text-[#D4AF37]/80 font-marcellus text-sm tracking-[0.15em] mb-4 uppercase">Chairman, ISSACC</p>
                            <p className="text-gray-500 font-marcellus text-sm leading-relaxed max-w-sm mx-auto">
                                Orchestrating the cultural vibrancy of the campus and fostering creativity.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
