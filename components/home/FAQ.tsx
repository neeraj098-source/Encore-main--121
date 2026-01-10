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
        <section className="py-24 px-4 bg-black relative">
            {/* Bg graphic matching the original site */}
            <div className="absolute inset-0 bg-[url('/images/faqmob.svg')] bg-cover bg-center opacity-20 pointer-events-none" />

            <div className="max-w-3xl mx-auto relative z-10">
                <h2 className="text-4xl md:text-5xl font-cinzel text-gold text-center mb-16">Encore FAQ</h2>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-gray-900/80 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden"
                        >
                            <button
                                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                                className="w-full flex justify-between items-center p-6 text-left hover:bg-white/5 transition-colors"
                            >
                                <span className={`font-cinzel text-lg ${activeIndex === index ? 'text-gold' : 'text-white'}`}>
                                    {faq.question}
                                </span>
                                <ChevronDown
                                    className={`text-gold transition-transform duration-300 ${activeIndex === index ? 'rotate-180' : ''}`}
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
                                        <div className="p-6 pt-0 text-gray-400 font-marcellus leading-relaxed">
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
