"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';
import { Lock, Mail } from 'lucide-react';

export default function CAPortal() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const supabase = createClient();
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email: formData.email.toLowerCase().trim(),
                password: formData.password,
            });

            if (authError) {
                setError('Invalid Credentials');
            } else if (data.user) {
                // Check if user is a CA
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', data.user.id)
                    .single();

                if (profile?.role !== 'CA' && profile?.role !== 'ADMIN') {
                    setError('Access denied. CA accounts only.');
                    await supabase.auth.signOut();
                } else {
                    router.push('/dashboard');
                }
            }
        } catch (err) {
            console.error(err);
            setError('Login failed');
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
                    <h1 className="text-3xl font-cinzel text-gold mb-2">CA Login</h1>
                    <p className="text-gray-400 font-marcellus text-sm">Access your Ambassador Dashboard</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-marcellus text-gray-300">Email (Official)</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                            <input
                                type="email"
                                required
                                className="w-full bg-black/40 border border-white/20 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-gold"
                                placeholder="email@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-marcellus text-gray-300">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                            <input
                                type="password"
                                required
                                className="w-full bg-black/40 border border-white/20 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-gold"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full py-6 text-lg bg-gold text-black hover:bg-white transition-all" disabled={loading}>
                        {loading ? 'Authenticating...' : 'Login'}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500 mb-2">
                        Restricted Access. Registration is Closed.
                    </p>
                    <p className="text-xs text-gray-400">
                        Want to become a Campus Ambassador? <br />
                        <a href="mailto:encore@ietlucknow.ac.in" className="text-gold hover:underline">Contact the Team</a>
                    </p>
                </div>
            </motion.div>
        </main>
    );
}
