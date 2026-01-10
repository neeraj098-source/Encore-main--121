"use client";

import { motion } from 'framer-motion';

const stats = [
    { label: "Footfall", value: "20k+" },
    { label: "Events", value: "25+" },
    { label: "Performers", value: "100+" },
    { label: "Workshops", value: "10+" },
];

export default function Stats() {
    return (
        <section className="py-20 bg-white/5 border-y border-white/10">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                            className="space-y-2"
                        >
                            <h3 className="text-4xl md:text-6xl font-cinzel text-gold font-bold">
                                {stat.value}
                            </h3>
                            <p className="text-gray-400 font-marcellus text-lg uppercase tracking-widest">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
