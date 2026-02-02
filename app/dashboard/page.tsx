"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import PassportCard from '@/components/dashboard/PassportCard';
import ProfileModal from '@/components/dashboard/ProfileModal';
import Modal from '@/components/ui/Modal';
import TeamManager from '@/components/dashboard/TeamManager';
import LeaderboardWidget from '@/components/dashboard/LeaderboardWidget';
import { LogOut, Calendar, Trophy, MapPin, Ticket } from 'lucide-react';

interface User {
    name: string;
    email: string;
    id: string;
    coins: number;
    college?: string;
    year?: string;
    phone?: string;
    profileCompleted?: boolean;
    role?: string;
    referralCode?: string;
    taskInsta?: boolean;
    taskLinkedIn?: boolean;
    taskX?: boolean;
    taskFacebook?: boolean;
    taskCart?: boolean;
    taskCart5?: boolean;
    taskCart10?: boolean;
}

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    // Global Modal State
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        type: "success" | "error" | "info" | "warning";
        onAction?: () => void;
        actionLabel?: string;
    }>({
        isOpen: false,
        title: "",
        message: "",
        type: "info"
    });

    useEffect(() => {
        const fetchUser = async () => {
            const storedUser = localStorage.getItem('encore_user');
            if (!storedUser) {
                router.push('/login');
                return;
            }

            try {
                const { email } = JSON.parse(storedUser);
                const res = await fetch('/api/user', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }),
                });

                if (res.ok) {
                    const data = await res.json();
                    // Map caCoins to coins for frontend compatibility
                    setUser({ ...data.user, coins: data.user.caCoins || 0 });
                } else {
                    // Invalid session
                    localStorage.removeItem('encore_user');
                    router.push('/login');
                }
            } catch (error) {
                console.error("Failed to fetch user:", error);
            }
        };

        fetchUser();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('encore_user');
        router.push('/');
    };

    const handleClaim = async (task: string) => {
        if (!user) return;

        // Open link first (mocking the action)
        if (task === 'taskInsta') window.open('https://www.instagram.com/encore.iet?igsh=djgwcXEwOTluYm44', '_blank');
        if (task === 'taskLinkedIn') window.open('https://linkedin.com/company/iet-encore', '_blank');
        if (task === 'taskX') window.open('https://youtube.com/@encore_iet?si=G0KNFpQSFo7CkRqc', '_blank'); // Mapped to YouTube
        if (task === 'taskFacebook') window.open('https://www.facebook.com/people/Encore-Cultural-Fest-of-IET-Lucknow/61586614022230/?rdid=OCHbTbSIvEOrbszq&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1L4xyzBFke%2F%3Fref%3D1', '_blank');

        // Delay to simulate "checking" - Use Modal for Confirmation
        setTimeout(() => {
            setModalState({
                isOpen: true,
                title: "Verify Task",
                message: "Did you complete the task to follow/connect with us?",
                type: "warning",
                actionLabel: "Yes, Claim Rewards",
                onAction: () => processClaim(task)
            });
        }, 1000);
    };

    const handleCartClaim = async (tier: 'taskCart' | 'taskCart5' | 'taskCart10') => {
        processClaim(tier);
    };

    const processClaim = async (task: string) => {
        setModalState(prev => ({ ...prev, isOpen: false })); // Close confirm modal

        try {
            const res = await fetch('/api/user/claim', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user!.email, task })
            });

            if (res.ok) {
                const data = await res.json();
                setModalState({ isOpen: true, title: "Success", message: data.message, type: "success" });
                // Update user state locally
                setUser(prev => prev ? ({ ...prev, [task]: true, coins: data.coins }) : null);
            } else {
                const err = await res.json();
                setModalState({ isOpen: true, title: "Error", message: err.error || "Claim failed", type: "error" });
            }
        } catch {
            setModalState({ isOpen: true, title: "Error", message: "Failed to connect to server", type: "error" });
        }
    };

    const handleProfileUpdate = (updatedUser: User) => {
        setUser(updatedUser);
    };

    if (!user) return <div className="min-h-screen bg-black flex items-center justify-center text-gold">Loading...</div>;



    return (
        <main className="min-h-screen bg-black pt-24 px-4 pb-12">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row gap-8 items-start">

                    {/* Left Column: Passport & Stats */}
                    <div className="w-full md:w-1/3 space-y-8">
                        <PassportCard user={user} />

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h3 className="text-gold font-cinzel mb-4">Your Quest</h3>
                            <div className="space-y-4">
                                {/* Referral Code Section (For All Users) */}
                                <div className="bg-gold/10 border border-gold/30 rounded-lg p-4 mb-4">
                                    <h4 className="text-gold font-cinzel text-sm mb-1">Referral Program</h4>
                                    <p className="text-xs text-gray-400 mb-2">Share your code to earn rewards</p>
                                    <div className="flex items-center gap-2 bg-black/40 p-2 rounded border border-gold/20">
                                        <code className="text-gold font-mono font-bold flex-1">{user.referralCode || 'Generate Code'}</code>
                                        <button
                                            onClick={() => navigator.clipboard.writeText(user.referralCode || '')}
                                            className="text-xs text-gray-400 hover:text-white px-2"
                                            title="Copy Code"
                                        >
                                            Copy
                                        </button>
                                        <a
                                            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                                                `Hey! Register for Encore 26 using my referral code *${user.referralCode}* to get exclusive benefits! 🚀\n\nRegister here: https://encore26.com`
                                            )}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-[#25D366] hover:text-[#128C7E] border-l border-white/10 pl-2"
                                            title="Share on WhatsApp"
                                        >
                                            WhatsApp
                                        </a>
                                    </div>
                                </div>

                                {/* Cart Quest */}
                                <div className="p-3 border border-white/10 rounded-lg bg-black/40">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="text-white text-sm font-medium">Shopaholic</p>
                                            <p className="text-xs text-gray-400">Add 3 events to your cart</p>
                                        </div>
                                        <span className="text-xs text-gold">+50 Coins</span>
                                    </div>
                                    {user.taskCart ? (
                                        <p className="text-xs text-green-500 font-bold">Completed</p>
                                    ) : (
                                        <div className="flex gap-2 mt-2">
                                            <Button size="sm" variant="outline" className="text-xs h-7 py-0" onClick={() => router.push('/events')}>Browse</Button>
                                            <Button size="sm" className="text-xs h-7 py-0 bg-gold text-black hover:bg-yellow-600" onClick={() => handleCartClaim('taskCart')}>Claim</Button>
                                        </div>
                                    )}
                                </div>

                                {/* Cart Quest - Tier 2 */}
                                <div className="p-3 border border-white/10 rounded-lg bg-black/40">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="text-white text-sm font-medium">Event Enthusiast</p>
                                            <p className="text-xs text-gray-400">Add 5 events to your cart</p>
                                        </div>
                                        <span className="text-xs text-gold">+100 Coins</span>
                                    </div>
                                    {user.taskCart5 ? (
                                        <p className="text-xs text-green-500 font-bold">Completed</p>
                                    ) : (
                                        <div className="flex gap-2 mt-2">
                                            <Button size="sm" className="text-xs h-7 py-0 bg-gold text-black hover:bg-yellow-600" onClick={() => handleCartClaim('taskCart5')}>Claim</Button>
                                        </div>
                                    )}
                                </div>

                                {/* Cart Quest - Tier 3 */}
                                <div className="p-3 border border-white/10 rounded-lg bg-black/40">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="text-white text-sm font-medium">Ultimate Fan</p>
                                            <p className="text-xs text-gray-400">Add 10 events to your cart</p>
                                        </div>
                                        <span className="text-xs text-gold">+150 Coins</span>
                                    </div>
                                    {user.taskCart10 ? (
                                        <p className="text-xs text-green-500 font-bold">Completed</p>
                                    ) : (
                                        <div className="flex gap-2 mt-2">
                                            <Button size="sm" className="text-xs h-7 py-0 bg-gold text-black hover:bg-yellow-600" onClick={() => handleCartClaim('taskCart10')}>Claim</Button>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h3 className="text-gold font-cinzel mb-4">Quick Actions</h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleLogout}
                                className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/10"
                            >
                                <LogOut size={16} className="mr-2" /> Logout
                            </Button>
                        </div>
                    </div>

                    {/* Right Column: Events & Updates */}
                    <div className="w-full md:w-2/3 space-y-6">
                        <div className="mb-6">
                            <h1 className="text-3xl font-cinzel text-white">Welcome, {user.name.split(' ')[0]}</h1>
                            <p className="text-gray-400 font-marcellus">Here is what is happening at Encore 26</p>
                        </div>

                        {/* Team Manager Widget */}
                        <TeamManager userEmail={user.email} userId={user.id} />

                        {/* Nawabi Coins Info Card */}
                        <div className="bg-gradient-to-r from-purple-900/40 to-black p-6 rounded-2xl border border-purple-500/30 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
                                <div>
                                    <h3 className="text-xl font-cinzel text-purple-200 mb-2">💎 Win Exciting Prizes!</h3>
                                    <p className="text-sm text-gray-300 max-w-lg mb-1">
                                        Top Nawabi Coin earners usually win <strong>Headphones, Smartwatches, and Exclusive Merch</strong>!
                                    </p>
                                    <p className="text-xs text-purple-400">
                                        Max possible coins: ~5000 (Referrals + Quests). Climb the leaderboard!
                                    </p>
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
                                    onClick={() => setModalState({
                                        isOpen: true,
                                        title: "Nawabi Coins System",
                                        message: "Earn coins by referring friends (50 coins) and completing social quests (50-150 coins). Determine your rank on the leaderboard to win grand prizes!",
                                        type: "info"
                                    })}
                                >
                                    How it works?
                                </Button>
                            </div>
                        </div>

                        {/* Social Quests */}
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                            <h3 className="text-xl font-cinzel text-white mb-4">Social Quests</h3>
                            <p className="text-xs text-gray-400 mb-4">Promote Encore to earn Nawabi Coins and win prizes!</p>
                            <div className="space-y-3">
                                <RewardItem
                                    title="Follow us on Instagram"
                                    coins={50}
                                    isClaimed={!!user.taskInsta}
                                    onClaim={() => handleClaim('taskInsta')}
                                    link="https://www.instagram.com/encore.iet?igsh=djgwcXEwOTluYm44"
                                />
                                <RewardItem
                                    title="Connect on LinkedIn"
                                    coins={50}
                                    isClaimed={!!user.taskLinkedIn}
                                    onClaim={() => handleClaim('taskLinkedIn')}
                                    link="https://linkedin.com/company/iet-encore"
                                />
                                <RewardItem
                                    title="Subscribe on YouTube"
                                    coins={50}
                                    isClaimed={!!user.taskX} // Reusing taskX field to avoid DB schema change for now, technically "taskX" now maps to YouTube
                                    onClaim={() => handleClaim('taskX')}
                                    link="https://youtube.com/@encore_iet?si=G0KNFpQSFo7CkRqc"
                                />
                                <RewardItem
                                    title="Follow on Facebook"
                                    coins={50}
                                    isClaimed={!!user.taskFacebook}
                                    onClaim={() => handleClaim('taskFacebook')}
                                    link="https://www.facebook.com/people/Encore-Cultural-Fest-of-IET-Lucknow/61586614022230/?rdid=OCHbTbSIvEOrbszq&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1L4xyzBFke%2F%3Fref%3D1"
                                />
                            </div>
                        </div>

                        {/* Dashboard Widgets */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div
                                onClick={() => setModalState({ isOpen: true, title: "Stay Tuned", message: "The official schedule will be announced soon!", type: "info" })}
                                className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-gold/30 transition-colors cursor-pointer group"
                            >
                                <Calendar className="text-gold mb-3 group-hover:scale-110 transition-transform" size={24} />
                                <h4 className="text-lg font-cinzel text-white">Schedule</h4>
                                <p className="text-sm text-gray-400">View the 3-day lineup</p>
                            </div>

                            <Link href="/events" className="block">
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-gold/30 transition-colors cursor-pointer group h-full">
                                    <Trophy className="text-gold mb-3 group-hover:scale-110 transition-transform" size={24} />
                                    <h4 className="text-lg font-cinzel text-white">Competitions</h4>
                                    <p className="text-sm text-gray-400">Register for events</p>
                                </div>
                            </Link>

                            <div
                                onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=Institute+of+Engineering+and+Technology+Lucknow', '_blank')}
                                className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-gold/30 transition-colors cursor-pointer group"
                            >
                                <MapPin className="text-gold mb-3 group-hover:scale-110 transition-transform" size={24} />
                                <h4 className="text-lg font-cinzel text-white">Map</h4>
                                <p className="text-sm text-gray-400">Navigate to IET Lucknow</p>
                            </div>

                            <Link href="/orders" className="block">
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-gold/30 transition-colors cursor-pointer group h-full">
                                    <Ticket className="text-gold mb-3 group-hover:scale-110 transition-transform" size={24} />
                                    <h4 className="text-lg font-cinzel text-white">Your Orders</h4>
                                    <p className="text-sm text-gray-400">Track your purchases</p>
                                </div>
                            </Link>

                        </div>

                        {/* CA Leaderboard (Only for CAs) */}
                        {user.role === 'CA' && user.referralCode && (
                            <LeaderboardWidget />
                        )}

                    </div>
                </div>
            </div>

            <Modal
                isOpen={modalState.isOpen}
                onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
                title={modalState.title}
                message={modalState.message}
                type={modalState.type}
                actionLabel={modalState.actionLabel}
                onAction={modalState.onAction}
            />

            <ProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                user={user}
                onUpdate={handleProfileUpdate}
            />
        </main >
    );
}

interface RewardItemProps {
    title: string;
    coins: number;
    isClaimed: boolean;
    onClaim: () => void;
    link?: string;
}

function RewardItem({ title, coins, isClaimed, onClaim }: RewardItemProps) {
    return (
        <div className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-white/10">
            <div>
                <p className="text-white text-sm font-medium">{title}</p>
                <p className="text-xs text-gold">+{coins} Coins</p>
            </div>
            <Button
                size="sm"
                variant={isClaimed ? "ghost" : "outline"}
                className={isClaimed ? "text-green-500" : "border-gold text-gold hover:bg-gold hover:text-black"}
                onClick={!isClaimed ? onClaim : undefined}
                disabled={isClaimed}
            >
                {isClaimed ? "Claimed" : "Claim"}
            </Button>
        </div>
    );
}
