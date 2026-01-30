"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
    { question: "What is Encore?", answer: "Encore is the annual cultural fest of IET Lucknow, featuring music, dance, drama, and more." },
    { question: "When is the fest happening?", answer: "The fest will take place from February 19th to February 21st, 2025, at the IET Lucknow campus." },
    { question: "How can I participate in events?", answer: "Students can register online through the official Encore website or visit the registration desk on campus." },
    { question: "Are there any registration fees?", answer: "Some events have free entry, while others may have a nominal registration fee. Details are available on this website." },
    { question: "Will there be food stalls at the venue?", answer: "Yes! Various food stalls will be available offering delicious snacks and beverages throughout the fest." },
];

export default function FAQ() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
        <section className="py-24 px-4 relative overflow-hidden">
            {/* Global background visible */}

            {/* Bg graphic matching the original site */}
            <div className="absolute inset-0 bg-[url('/images/faqmob.svg')] bg-cover bg-center opacity-10 pointer-events-none mix-blend-overlay" />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                <h2 className="text-4xl md:text-6xl font-cinzel text-[#D4AF37] text-center mb-20 drop-shadow-md">Encore FAQ</h2>

                <div className="space-y-6">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`bg-black/40 backdrop-blur-md border rounded-xl overflow-hidden transition-all duration-300 ${activeIndex === index ? 'border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.1)]' : 'border-[#D4AF37]/20 hover:border-[#D4AF37]/50'}`}
                        >
                            <button
                                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                                className="w-full flex justify-between items-center p-6 text-left transition-colors group"
                            >
                                <span className={`font-cinzel text-lg md:text-xl transition-colors duration-300 ${activeIndex === index ? 'text-[#D4AF37]' : 'text-[#e0e0e0] group-hover:text-[#D4AF37]'}`}>
                                    {faq.question}
                                </span>
                                <ChevronDown
                                    className={`text-[#D4AF37] transition-transform duration-300 ${activeIndex === index ? 'rotate-180' : 'opacity-70 group-hover:opacity-100'}`}
                                />
                            </button>
                            <AnimatePresence>
                                {activeIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-6 pt-0 text-gray-300 font-marcellus leading-relaxed border-t border-[#D4AF37]/10">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
