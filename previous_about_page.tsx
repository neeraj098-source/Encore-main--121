"use client";

import { motion } from 'framer-motion';

import { User, Award, Users } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-black pt-20">
            {/* Hero Section */}
            <section className="relative py-20 px-4">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black pointer-events-none" />
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

            {/* Leadership Section */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-cinzel text-white text-center mb-16 relative">
                        <span className="relative z-10 bg-black px-8">Organising Team</span>
                        <div className="absolute top-1/2 left-0 w-full h-px bg-white/10 -z-0" />
                    </h2>

                    <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                        {/* Director Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors text-center group"
                        >
                            <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-2 border-gold/50 mb-6 relative bg-white/5">
                                <div className="absolute inset-0 flex items-center justify-center text-white/20">
                                    <User size={64} />
                                </div>
                                {/* <Image src="/path/to/director.jpg" alt="Director" fill className="object-cover" /> */}
                            </div>
                            <h3 className="text-2xl font-cinzel text-gold mb-2">Dr. Vineet Kansal</h3>
                            <p className="text-purple-400 font-medium tracking-wider text-sm mb-4 uppercase">Director, IET Lucknow</p>
                            <p className="text-gray-400 font-marcellus text-sm leading-relaxed">
                                Guiding the institute towards excellence with visionary leadership and unwavering dedication to student development.
                            </p>
                        </motion.div>

                        {/* ISSAC Chairman Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors text-center group"
                        >
                            <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-2 border-gold/50 mb-6 relative bg-white/5">
                                <div className="absolute inset-0 flex items-center justify-center text-white/20">
                                    <Award size={64} />
                                </div>
                                {/* <Image src="/path/to/chairman.jpg" alt="Chairman" fill className="object-cover" /> */}
                            </div>
                            <h3 className="text-2xl font-cinzel text-gold mb-2">Dr. SATYENDRA SINGH</h3>
                            <p className="text-purple-400 font-medium tracking-wider text-sm mb-4 uppercase">Chairman, ISSACC</p>
                            <p className="text-gray-400 font-marcellus text-sm leading-relaxed">
                                Orchestrating the cultural vibrancy of the campus and fostering an environment of creativity and expression.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 px-4 pb-32">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-cinzel text-white text-center mb-16 relative">
                        <span className="relative z-10 bg-black px-8">Workers of the Fest</span>
                        <div className="absolute top-1/2 left-0 w-full h-px bg-white/10 -z-0" />
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                            <motion.div
                                key={item}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: item * 0.1 }}
                                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-gold/30 transition-all group"
                            >
                                <div className="w-24 h-24 mx-auto rounded-full bg-white/10 mb-4 flex items-center justify-center text-white/30 group-hover:text-gold transition-colors">
                                    <Users size={32} />
                                </div>
                                <h3 className="text-lg font-cinzel text-white text-center mb-1">Team Member {item}</h3>
                                <p className="text-gray-500 text-xs text-center uppercase tracking-wider">Designation</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
