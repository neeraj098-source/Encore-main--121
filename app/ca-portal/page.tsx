"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';


export default function CAPortal() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', college: '' });
    const [loading, setLoading] = useState(false);

    const handleAction = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // For Login, we just check if user exists and is CA (Simplified logic for now)
        // In real app, we'd have password auth. Here we trust email for demo/hackathon context or use generic login.

        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/ca/register';
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                const data = await res.json();
                if (isLogin && data.user.role !== 'CA') {
                    alert('You are not registered as a Campus Ambassador');
                    setLoading(false);
                    return;
                }
                localStorage.setItem('encore_user', JSON.stringify(data.user));
                // If registered, show success or redirect
                if (!isLogin && data.code) {
                    alert(`Registration Successful! Your Referral Code is: ${data.code}`);
                }
                router.push('/dashboard');
            } else {
                const err = await res.json();
                alert(err.message || err.error || 'Action failed');
            }
        } catch {
            alert('Connection Error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
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
                    <h1 className="text-3xl font-cinzel text-gold mb-2">{isLogin ? 'CA Login' : 'CA Registration'}</h1>
                    <p className="text-gray-400 font-marcellus text-sm">{isLogin ? 'Access your Ambassador Dashboard' : 'Join the Elite Envoys of Encore'}</p>
                </div>

                <form onSubmit={handleAction} className="space-y-4">
                    {!isLogin && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-marcellus text-gray-300">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-black/40 border border-white/20 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold"
                                    placeholder="Your Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-marcellus text-gray-300">College / Institute</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-black/40 border border-white/20 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold"
                                    placeholder="Institute Name"
                                    value={formData.college}
                                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-marcellus text-gray-300">Phone Number</label>
                                <input
                                    type="tel"
                                    className="w-full bg-black/40 border border-white/20 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold"
                                    placeholder="+91 XXXXX XXXXX"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </>
                    )}
                    <div className="space-y-2">
                        <label className="text-sm font-marcellus text-gray-300">Email (Official)</label>
                        <input
                            type="email"
                            required
                            className="w-full bg-black/40 border border-white/20 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold"
                            placeholder="email@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <Button type="submit" className="w-full py-6 text-lg" disabled={loading}>
                        {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register as CA')}
                    </Button>
                </form>

                <p className="text-xs text-center text-gray-500 mt-6 cursor-pointer hover:text-gold transition-colors" onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? "Not a Campus Ambassador? Apply Now." : "Already have an account? Login."}
                </p>
            </motion.div>
        </main>
    );
}
