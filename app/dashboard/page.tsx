"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import PassportCard from '@/components/dashboard/PassportCard';
import ProfileModal from '@/components/dashboard/ProfileModal';
import { Calendar, MapPin, Trophy, LogOut } from 'lucide-react';

interface User {
    name: string;
    email: string;
    id: string;
    coins: number;
    college?: string;
    year?: string;
    phone?: string;
    profileCompleted?: boolean;
}

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    useEffect(() => {
        // Client-side only check
        if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('encore_user');
            if (!storedUser) {
                router.push('/login');
            } else {
                setUser(JSON.parse(storedUser));
            }
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('encore_user');
        router.push('/');
    };

    const handleProfileUpdate = (updatedUser: User) => {
        setUser(updatedUser);
    };

    if (!user) return <div className="min-h-screen bg-black flex items-center justify-center text-gold">Loading...</div>;

    const progress = user.profileCompleted ? 100 : 40;

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
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400">Profile Completion</span>
                                    <span className="text-gold">{progress}%</span>
                                </div>
                                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gold transition-all duration-1000 ease-out"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                {!user.profileCompleted ? (
                                    <>
                                        <p className="text-xs text-gray-500 mt-2">Complete your profile to earn 50 Nawabi Coins.</p>
                                        <Button size="sm" variant="outline" className="w-full mt-2" onClick={() => setIsProfileModalOpen(true)}>Complete Profile</Button>
                                    </>
                                ) : (
                                    <p className="text-xs text-green-500 mt-2">Profile Completed. You are ready for the fest!</p>
                                )}
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

                        {/* Dashboard Widgets */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div
                                onClick={() => alert("Schedule to be announced soon!")}
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
                                onClick={() => alert("Map integration coming soon!")}
                                className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-gold/30 transition-colors cursor-pointer group"
                            >
                                <MapPin className="text-gold mb-3 group-hover:scale-10 transition-transform" size={24} />
                                <h4 className="text-lg font-cinzel text-white">Map</h4>
                                <p className="text-sm text-gray-400">Navigate the campus</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                user={user}
                onUpdate={handleProfileUpdate}
            />
        </main>
    );
}
