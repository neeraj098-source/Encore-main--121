"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { User, Mail, ArrowRight } from 'lucide-react';

export default function LoginForm() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ name: '', email: '' });

    const handleNext = () => {
        if (step === 1 && formData.name) {
            setStep(2);
        } else if (step === 2 && formData.email) {
            // Simulate Login
            const user = {
                name: formData.name,
                email: formData.email,
                id: `ENC-26-${Math.floor(Math.random() * 10000)}`,
                coins: 100, // Bonus for joining
            };
            localStorage.setItem('encore_user', JSON.stringify(user));
            router.push('/dashboard');
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-cinzel text-gold mb-2">Join the Royalty</h2>
                <p className="text-gray-400 font-marcellus text-sm">Step into the world of Encore 26</p>
            </div>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-6"
                    >
                        <div className="space-y-2">
                            <label className="text-sm font-marcellus text-gray-300">What shall we call you?</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gold h-5 w-5" />
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    className="w-full bg-black/40 border border-white/20 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-gold transition-colors"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                                    autoFocus
                                />
                            </div>
                        </div>
                        <Button
                            onClick={handleNext}
                            className="w-full"
                            disabled={!formData.name}
                        >
                            Next <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>

                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/10" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-black/50 px-2 text-gray-400 backdrop-blur-sm">Or continue with</span>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                // Simulate Google Login
                                const user = {
                                    name: "Google User",
                                    email: "google@user.com",
                                    id: `ENC-26-G-${Math.floor(Math.random() * 10000)}`,
                                    coins: 100,
                                    profileCompleted: false
                                };
                                localStorage.setItem('encore_user', JSON.stringify(user));
                                window.dispatchEvent(new Event('user-login'));
                                router.push('/dashboard');
                            }}
                            className="w-full bg-white text-black hover:bg-gray-100 font-medium py-3 rounded-xl flex items-center justify-center transition-colors"
                        >
                            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Sign in with Google
                        </button>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-6"
                    >
                        <div className="space-y-2">
                            <label className="text-sm font-marcellus text-gray-300">Where shall we send your royal decree?</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gold h-5 w-5" />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full bg-black/40 border border-white/20 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-gold transition-colors"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Button variant="ghost" onClick={() => setStep(1)} className="flex-1">Back</Button>
                            <Button onClick={handleNext} className="flex-1" disabled={!formData.email}>
                                Claim Pass
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
