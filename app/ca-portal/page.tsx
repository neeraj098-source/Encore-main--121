"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { User, Lock, Users } from 'lucide-react';

export default function CAPortal() {
    const router = useRouter();
    const [formData, setFormData] = useState({ name: '', referral: '', password: '' });

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock CA Login
        const caUser = {
            name: formData.name,
            role: 'Campus Ambassador',
            referralCode: formData.referral,
            coins: 500,
            id: `CA-${Math.floor(Math.random() * 1000)}`
        };
        localStorage.setItem('encore_user', JSON.stringify(caUser));
        router.push('/dashboard');
    };

    return (
        <main className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl relative z-10"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-cinzel text-gold mb-2">CA Portal</h1>
                    <p className="text-gray-400 font-marcellus text-sm">Join the Elite Envoys of Encore</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">

                    <div className="space-y-2">
                        <label className="text-sm font-marcellus text-gray-300">Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gold h-5 w-5" />
                            <input
                                type="text"
                                required
                                className="w-full bg-black/40 border border-white/20 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-gold transition-colors"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-marcellus text-gray-300">Referral Code</label>
                        <div className="relative">
                            <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gold h-5 w-5" />
                            <input
                                type="text"
                                required
                                className="w-full bg-black/40 border border-white/20 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-gold transition-colors"
                                placeholder="Enter Code"
                                value={formData.referral}
                                onChange={(e) => setFormData({ ...formData, referral: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-marcellus text-gray-300">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gold h-5 w-5" />
                            <input
                                type="password"
                                required
                                className="w-full bg-black/40 border border-white/20 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-gold transition-colors"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full py-6 text-lg">
                        Access Portal
                    </Button>
                </form>
            </motion.div>
        </main>
    );
}
