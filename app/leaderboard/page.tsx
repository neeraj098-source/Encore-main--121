
"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function LeaderboardPage() {
    const [leaders, setLeaders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaders = async () => {
            try {
                const res = await fetch('/api/public/leaderboard');
                if (res.ok) {
                    const data = await res.json();
                    setLeaders(data);
                }
            } catch (error) {
                console.error("Failed to fetch leaderboard", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaders();
        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchLeaders, 30000);
        return () => clearInterval(interval);
    }, []);

    const getRankIcon = (rank: number) => {
        if (rank === 0) return <Trophy className="w-8 h-8 text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />;
        if (rank === 1) return <Medal className="w-8 h-8 text-gray-400 drop-shadow-[0_0_10px_rgba(156,163,175,0.5)]" />;
        if (rank === 2) return <Award className="w-8 h-8 text-amber-700 drop-shadow-[0_0_10px_rgba(180,83,9,0.5)]" />;
        return <span className="font-cinzel text-xl text-gold/50">#{rank + 1}</span>;
    };

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-gold/10 to-transparent pointer-events-none" />
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-900/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-40 -left-20 w-72 h-72 bg-gold/5 rounded-full blur-[80px] pointer-events-none" />

            <div className="max-w-5xl mx-auto px-4 py-20 relative z-10">
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs uppercase tracking-widest"
                    >
                        <Sparkles size={14} />
                        <span>Ambassador's Battleground</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-5xl md:text-7xl font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-200 to-gold drop-shadow-sm"
                    >
                        Hall of Fame
                    </motion.h1>
                    <p className="text-gray-400 font-marcellus max-w-lg mx-auto">
                        Celebrating the champions leading the Encore revolution. Compete, refer, and rise to the top.
                    </p>
                </div>

                {/* Leaderboard List */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                >
                    {loading ? (
                        <div className="p-20 text-center text-gold/50 font-cinzel animate-pulse">
                            Loading Champions...
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-4 p-6 bg-black/40 text-xs uppercase tracking-widest text-gray-500 font-medium">
                                <div className="col-span-2 md:col-span-1 text-center">Rank</div>
                                <div className="col-span-6 md:col-span-5">Ambassador</div>
                                <div className="hidden md:block col-span-4">College</div>
                                <div className="col-span-4 md:col-span-2 text-right">Referrals</div>
                            </div>

                            {/* Rows */}
                            {leaders.map((leader, index) => (
                                <motion.div
                                    key={leader.referralCode}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`grid grid-cols-12 gap-4 p-6 items-center transition-colors hover:bg-white/5 ${index < 3 ? 'bg-gold/5' : ''}`}
                                >
                                    {/* Rank */}
                                    <div className="col-span-2 md:col-span-1 flex justify-center">
                                        {getRankIcon(index)}
                                    </div>

                                    {/* Name & Code */}
                                    <div className="col-span-6 md:col-span-5">
                                        <h3 className={`font-cinzel text-lg ${index < 3 ? 'text-gold' : 'text-white'}`}>
                                            {leader.name}
                                        </h3>
                                        <span className="text-xs text-gray-500 font-mono bg-white/5 px-2 py-0.5 rounded border border-white/5">
                                            {leader.referralCode}
                                        </span>
                                    </div>

                                    {/* College */}
                                    <div className="hidden md:block col-span-4 text-sm text-gray-400 truncate">
                                        {leader.college}
                                    </div>

                                    {/* Score */}
                                    <div className="col-span-4 md:col-span-2 text-right">
                                        <div className="inline-block relative">
                                            <span className="text-2xl font-bold font-cinzel text-white">{leader.referrals}</span>
                                            {index === 0 && (
                                                <motion.div
                                                    className="absolute -top-1 -right-3 text-gold"
                                                    animate={{ rotate: [0, 20, 0] }}
                                                    transition={{ repeat: Infinity, duration: 2 }}
                                                >
                                                    👑
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {leaders.length === 0 && (
                                <div className="p-12 text-center text-gray-500">
                                    No champions yet. Be the first to rise!
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>

                <div className="mt-12 text-center">
                    <Link href="/login">
                        <Button className="px-8 py-4 bg-gold text-black font-cinzel text-lg rounded-full hover:bg-white hover:scale-105 transition-all shadow-lg shadow-gold/20">
                            Join the Battle
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
