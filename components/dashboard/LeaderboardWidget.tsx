"use client";

import { useEffect, useState } from 'react';
import { Trophy, Medal, Award } from 'lucide-react';

interface Leader {
    name: string;
    referralCode: string;
    referrals: number;
    college?: string;
}

export default function LeaderboardWidget() {
    const [leaders, setLeaders] = useState<Leader[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaders = async () => {
            try {
                const res = await fetch('/api/public/leaderboard');
                if (res.ok) {
                    const data = await res.json();
                    setLeaders(data); // Show ALL, not just top 5
                }
            } catch (error) {
                console.error("Failed to fetch leaderboard", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaders();
    }, []);

    const getRankIcon = (rank: number) => {
        // Since list is duplicated, normalize rank
        const actualRank = rank % leaders.length;

        if (actualRank === 0) return <Trophy className="w-5 h-5 text-yellow-500" />;
        if (actualRank === 1) return <Medal className="w-5 h-5 text-gray-400" />;
        if (actualRank === 2) return <Award className="w-5 h-5 text-amber-700" />;
        return <span className="font-mono text-gray-500 text-sm">#{actualRank + 1}</span>;
    };

    if (loading) return <div className="h-48 bg-white/5 animate-pulse rounded-2xl"></div>;

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative group h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-4 z-10 relative bg-[#0a0a0a] pb-2 border-b border-white/5 shrink-0">
                <h3 className="text-xl font-cinzel text-white flex items-center gap-2">
                    <Trophy size={20} className="text-gold" />
                    CA Leaderboard
                </h3>
                <span className="text-xs text-gold bg-gold/10 px-2 py-1 rounded border border-gold/20">Live</span>
            </div>

            {/* Scrollable List */}
            <div className="overflow-y-auto pr-2 custom-scrollbar flex-1">
                <div className="space-y-3">
                    {leaders.map((leader, index) => (
                        <div
                            key={leader.referralCode}
                            className={`flex items-center gap-4 p-3 rounded-lg border transition-colors ${index === 0 ? 'bg-gold/10 border-gold/30' : 'bg-black/20 border-white/5'
                                }`}
                        >
                            <div className="w-8 flex justify-center shrink-0">
                                {getRankIcon(index)}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-white font-medium truncate text-sm">{leader.name}</p>
                                <p className="text-xs text-gray-500 truncate">{leader.college || 'N/A'}</p>
                            </div>

                            <div className="text-right shrink-0">
                                <span className="text-gold font-bold text-sm">{leader.referrals}</span>
                                <span className="text-[10px] text-gray-500 block uppercase">Refs</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {leaders.length === 0 && (
                <p className="text-center text-gray-500 text-sm py-4">No data available yet.</p>
            )}
        </div>
    );
}
