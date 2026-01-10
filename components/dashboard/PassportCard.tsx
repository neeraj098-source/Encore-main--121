"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import { QrCode, Sparkles } from 'lucide-react';

interface User {
    name: string;
    id: string;
    coins: number;
    email: string;
}

export default function PassportCard({ user }: { user: User }) {
    return (
        <motion.div
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 50, damping: 10 }}
            className="relative w-full max-w-sm aspect-[1.6/1] rounded-2xl overflow-hidden shadow-2xl group perspective-1000"
        >
            {/* Card Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black border border-gold/30 rounded-2xl">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-900/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full p-6 flex flex-col justify-between">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 relative">
                            <Image src="/images/iet_logo.png" alt="Logo" fill className="object-contain rounded-full" />
                        </div>
                        <div>
                            <h3 className="text-gold font-cinzel font-bold text-sm tracking-widest">ENCORE 26</h3>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Official Passport</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1 text-gold">
                            <Sparkles size={14} />
                            <span className="font-bold font-cinzel">{user.coins}</span>
                        </div>
                        <span className="text-[10px] text-gray-500">Nawabi Coins</span>
                    </div>
                </div>

                {/* Middle (Name) */}
                <div className="mt-4">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Holder Name</p>
                    <h2 className="text-2xl font-marcellus text-white tracking-wide truncate">{user.name}</h2>
                </div>

                {/* Footer (ID & QR) */}
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Unique ID</p>
                        <p className="font-mono text-gold text-sm">{user.id}</p>
                    </div>
                    {/* Simulated QR Code */}
                    <div className="bg-white p-2 rounded-lg">
                        <QrCode className="text-black w-8 h-8" />
                    </div>
                </div>
            </div>

            {/* Shine Effect on Hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </motion.div>
    );
}
