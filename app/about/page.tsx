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
            <section className="py-10 px-4 mb-24">
                <div className="max-w-7xl mx-auto">
                    <div className="relative text-center mb-16">
                        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
                        <h2 className="relative z-10 inline-block bg-black px-6 text-3xl md:text-5xl font-cinzel text-[#D4AF37] uppercase tracking-widest drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)]">
                            Organizers
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                        {organizers.map((member, index) => (
                            <motion.div
                                key={member.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`w-full max-w-sm bg-white/5 border border-white/10 rounded-2xl p-6 text-center group hover:border-gold/30 transition-all relative overflow-hidden ${member.isHighlight ? 'bg-gradient-to-b from-gold/5 to-transparent' : ''
                                    }`}
                            >
                                <div className={`w-40 h-40 mx-auto rounded-full mb-6 relative overflow-hidden border-2 transition-transform duration-500 group-hover:scale-105 ${member.isHighlight ? 'border-gold shadow-[0_0_15px_rgba(255,215,0,0.2)]' : 'border-white/20'}`}>
                                    {member.image ? (
                                        <Image
                                            src={member.image}
                                            alt={member.name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-white/5 text-white/20 group-hover:text-gold/50 transition-colors">
                                            <Users size={48} />
                                        </div>
                                    )}
                                </div>

                                <h3 className={`text-xl font-cinzel mb-2 ${member.isHighlight ? 'text-white' : 'text-gray-200'}`}>
                                    {member.name}
                                </h3>
                                <p className={`font-marcellus text-sm tracking-widest uppercase mb-6 ${member.isHighlight ? 'text-gold' : 'text-gray-500'}`}>
                                    {member.role}
                                </p>

                                {/* Social Links Overlay */}
                                <div className="flex justify-center gap-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                    {member.socials?.instagram && (
                                        <Link
                                            href={member.socials.instagram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-400 hover:text-gold transition-colors"
                                        >
                                            <Instagram size={20} />
                                        </Link>
                                    )}
                                    {member.socials?.linkedin && (
                                        <Link
                                            href={member.socials.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-400 hover:text-gold transition-colors"
                                        >
                                            <Linkedin size={20} />
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
                        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
                        <h2 className="relative z-10 inline-block bg-black px-6 text-3xl md:text-5xl font-cinzel text-[#D4AF37] uppercase tracking-widest drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)]">
                            Faculties
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Director */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-colors"
                        >
                            <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-2 border-gold/50 mb-6 relative bg-white/5">
                                <Image
                                    src="/images/team/dr_vineet_kansal.jpg"
                                    alt="Dr. Vineet Kansal"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <h3 className="text-2xl font-cinzel text-gold mb-2">Dr. Vineet Kansal</h3>
                            <p className="text-purple-400 font-medium tracking-wider text-sm mb-4 uppercase">Director, IET Lucknow</p>
                            <p className="text-gray-400 font-marcellus text-sm leading-relaxed">
                                Guiding the institute towards excellence with visionary leadership.
                            </p>
                        </motion.div>

                        {/* ISSACC Chairman */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-colors"
                        >
                            <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-2 border-gold/50 mb-6 relative bg-white/5">
                                <Image
                                    src="/images/team/dr_satyendra_singh.png"
                                    alt="Dr. Satyendra Singh"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <h3 className="text-2xl font-cinzel text-gold mb-2">Dr. Satyendra Singh</h3>
                            <p className="text-purple-400 font-medium tracking-wider text-sm mb-4 uppercase">Chairman, ISSACC</p>
                            <p className="text-gray-400 font-marcellus text-sm leading-relaxed">
                                Orchestrating the cultural vibrancy of the campus and fostering creativity.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
