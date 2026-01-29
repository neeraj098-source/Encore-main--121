
"use client";

import { useState, useEffect, ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Trash2, Edit2, X, Users as UsersIcon } from 'lucide-react';
import { eventsData } from '@/lib/data';

interface OrderItem {
    eventName: string;
}

interface Order {
    id: string;
    createdAt: string;
    status: string;
    totalAmount: number;
    items: OrderItem[];
}

interface CoinEntry {
    id: string;
    reason: string;
    createdAt: string;
    amount: number;
}

interface AdminUser {
    id: string;
    name: string;
    email: string;
    phone: string;
    college: string;
    year: string;
    accommodation: string;
    paymentId?: string;
    paymentVerified: boolean;
    totalPaid?: number;
    orders: Order[];
    caCoins?: number;
    coinHistory: CoinEntry[];
    paymentScreenshot?: string;
    referralCode?: string;
    referrals?: number;
}

interface LeaderboardEntry {
    id: string;
    name: string;
    college: string;
    referralCode: string;
    referrals: number;
}

export default function AdminPanel() {
    const [secret, setSecret] = useState('');
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]); // Leaderboard Data
    const [teamStats, setTeamStats] = useState<{ eventSlug: string; count: number }[]>([]); // Team Stats
    const [searchQuery, setSearchQuery] = useState('');

    // Global Modal State (Success/Error messages)
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        title: string;
        message: string | ReactNode;
        type: "success" | "error" | "info" | "warning";
        onAction?: () => void;
        actionLabel?: string;
    }>({
        isOpen: false,
        title: "",
        message: "",
        type: "info"
    });

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
    const [editForm, setEditForm] = useState({
        name: '',
        email: '',
        phone: '',
        college: '',
        year: '',
        accommodation: '',
        password: '' // New Password (Optional)
    });

    // Verify Modal State
    const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
    const [verifyingUser, setVerifyingUser] = useState<AdminUser | null>(null);

    const fetchUsers = async () => {
        try {
            const res = await fetch(`/api/admin/users?secret=${secret}`);
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users);
            }
        } catch (error) {
            console.error("Auto-refresh failed", error);
        }
    };

    const fetchLeaderboard = async () => {
        try {
            const res = await fetch('/api/admin/leaderboard');
            if (res.ok) {
                const data = await res.json();
                setLeaderboard(data);
            }
        } catch (error) {
            console.error("Leaderboard fetch failed", error);
        }
    };

    const fetchTeamStats = async () => {
        try {
            const res = await fetch(`/api/admin/teams?secret=${secret}`);
            if (res.ok) {
                const data = await res.json();
                setTeamStats(data);
            }
        } catch (error) {
            console.error("Team stats fetch failed", error);
        }
    };

    // Auto-Login Effect
    useEffect(() => {
        const storedSecret = localStorage.getItem('admin_secret');
        if (storedSecret && !isAuthenticated) {
            setSecret(storedSecret);
            // Verify stored secret
            fetch(`/api/admin/users?secret=${storedSecret}`)
                .then(res => {
                    if (res.ok) {
                        res.json().then(data => {
                            setUsers(data.users);
                            fetchLeaderboard(); // Fetch Leaderboard on Auto-Login
                            fetchTeamStats();
                            setIsAuthenticated(true);
                        });
                    }
                });
        }
    }, [isAuthenticated]);

    // Auto-Refresh Effect


    const handleLogin = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/users?secret=${secret}`);
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users);
                fetchLeaderboard(); // Fetch Leaderboard on Login
                fetchTeamStats();
                setIsAuthenticated(true);
                localStorage.setItem('admin_secret', secret);
            } else {
                setModalState({ isOpen: true, title: "Access Denied", message: "Invalid Admin Secret", type: "error" });
            }
        } catch {
            setModalState({ isOpen: true, title: "Error", message: "Error connecting to server", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const [viewingScreenshot, setViewingScreenshot] = useState<string | null>(null);

    // --- Actions ---

    const openVerifyModal = (user: AdminUser) => {
        setVerifyingUser(user);
        setIsVerifyModalOpen(true);
    };

    const handleVerifyUser = async (userId: string) => {
        try {
            const res = await fetch('/api/admin/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    secret,
                    userId,
                    paymentVerified: true
                })
            });

            if (res.ok) {
                setModalState({ isOpen: true, title: "Verified", message: "User payment verified successfully!", type: "success" });
                setIsVerifyModalOpen(false); // Close verify modal
                fetchUsers();
            } else {
                setModalState({ isOpen: true, title: "Error", message: "Failed to verify user", type: "error" });
            }
        } catch {
            setModalState({ isOpen: true, title: "Error", message: "Network error", type: "error" });
        }
    };

    const openEditModal = (user: AdminUser) => {
        setEditingUser(user);
        setEditForm({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            college: user.college || '',
            year: user.year || '',
            accommodation: user.accommodation || '',
            password: ''
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateUser = async () => {
        if (!editingUser) return;
        try {
            const res = await fetch('/api/admin/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    secret,
                    userId: editingUser.id,
                    ...editForm
                })
            });

            if (res.ok) {
                setModalState({ isOpen: true, title: "Success", message: "User Updated Successfully!", type: "success" });
                setIsEditModalOpen(false);
                fetchUsers(); // Refresh
            } else {
                setModalState({ isOpen: true, title: "Error", message: "Failed to update user", type: "error" });
            }
        } catch (error) {
            console.error("Update failed", error);
            setModalState({ isOpen: true, title: "Error", message: "Network error", type: "error" });
        }
    };

    const confirmDeleteUser = (userId: string) => {
        setModalState({
            isOpen: true,
            title: "Confirm Deletion",
            message: "Are you sure you want to DELETE this user? This action cannot be undone.",
            type: "warning",
            actionLabel: "Yes, Delete",
            onAction: () => handleDeleteUser(userId)
        });
    };

    const handleDeleteUser = async (userId: string) => {
        try {
            const res = await fetch(`/api/admin/users?secret=${secret}&userId=${userId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setModalState({ isOpen: true, title: "Deleted", message: "User deleted successfully", type: "info" });
                fetchUsers();
            } else {
                setModalState({ isOpen: true, title: "Error", message: "Failed to delete user", type: "error" });
            }
        } catch {
            setModalState({ isOpen: true, title: "Error", message: "Network error", type: "error" });
        }
    };


    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <Modal
                    isOpen={modalState.isOpen}
                    onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
                    title={modalState.title}
                    message={modalState.message}
                    type={modalState.type}
                    actionLabel={modalState.actionLabel}
                    onAction={modalState.onAction}
                />
                <div className="bg-white/10 p-8 rounded-xl border border-white/20 w-full max-w-md">
                    <h1 className="text-2xl font-cinzel text-gold mb-6 text-center">Admin Access</h1>
                    <input
                        type="password"
                        placeholder="Enter Admin Secret"
                        className="w-full bg-black/50 border border-white/20 rounded-lg p-3 text-white mb-4"
                        value={secret}
                        onChange={(e) => setSecret(e.target.value)}
                    />
                    <Button onClick={handleLogin} className="w-full" disabled={loading}>
                        {loading ? 'Verifying...' : 'Access Panel'}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <Modal
                isOpen={modalState.isOpen}
                onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
                title={modalState.title}
                message={modalState.message}
                type={modalState.type}
                actionLabel={modalState.actionLabel}
                onAction={modalState.onAction}
            />

            {/* VERIFY / DETAILS MODAL */}
            {isVerifyModalOpen && verifyingUser && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#111] border border-gold/40 rounded-xl w-full max-w-2xl shadow-2xl relative flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center">
                            <h2 className="text-2xl font-cinzel text-gold">Payment Details</h2>
                            <button onClick={() => setIsVerifyModalOpen(false)} className="text-gray-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-6">
                            {/* User Header */}
                            <div className="flex justify-between items-center bg-white/5 p-6 rounded-lg border border-white/10">
                                <div>
                                    <h3 className="text-2xl font-cinzel text-white uppercase mb-1">{verifyingUser.name}</h3>
                                    <p className="text-sm text-gray-400 font-mono mb-2">{verifyingUser.email}</p>
                                    <p className="text-xs text-gray-500 uppercase tracking-widest">{verifyingUser.college}</p>
                                    <p className="text-xs text-gray-500">{verifyingUser.phone}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Total Verified</p>
                                    <p className="text-4xl font-mono text-gold mb-1">
                                        ₹{
                                            (verifyingUser.paymentVerified ? (verifyingUser.totalPaid || (verifyingUser.accommodation === 'yes' ? 999 : 399)) : 0) +
                                            (verifyingUser.orders?.reduce((sum: number, order) => order.status === 'PAID' ? sum + order.totalAmount : sum, 0) || 0)
                                        }
                                    </p>

                                    {/* Show Pending if any */}
                                    {((!verifyingUser.paymentVerified ? (verifyingUser.totalPaid || (verifyingUser.accommodation === 'yes' ? 999 : 399)) : 0) +
                                        (verifyingUser.orders?.reduce((sum: number, order) => order.status !== 'PAID' ? sum + order.totalAmount : sum, 0) || 0)) > 0 && (
                                            <p className="text-xs text-red-400 font-mono mb-2">
                                                + ₹{((!verifyingUser.paymentVerified ? (verifyingUser.totalPaid || (verifyingUser.accommodation === 'yes' ? 999 : 399)) : 0) +
                                                    (verifyingUser.orders?.reduce((sum: number, order) => order.status !== 'PAID' ? sum + order.totalAmount : sum, 0) || 0))} Pending
                                            </p>
                                        )}

                                    {verifyingUser.paymentVerified ? (
                                        <span className="text-xs text-green-400 bg-green-900/20 border border-green-500/30 px-3 py-1 rounded uppercase tracking-widest font-bold">Verified</span>
                                    ) : (
                                        <span className="text-xs text-red-400 bg-red-900/20 border border-red-500/30 px-3 py-1 rounded uppercase tracking-widest font-bold">Pending Verification</span>
                                    )}
                                </div>
                            </div>

                            {/* 1. Fest Pass Details */}
                            <div className="bg-[#151515] p-5 rounded-lg border border-white/10 relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-1 h-full bg-gold" />
                                <h4 className="text-gold font-cinzel text-sm mb-4 uppercase tracking-wider">Fest Pass</h4>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-xl text-white font-cinzel mb-1">{verifyingUser.accommodation === 'yes' ? 'Accommodation Pass' : 'Basic Pass'}</p>
                                        <p className="text-xs text-gray-500 uppercase tracking-widest">{verifyingUser.accommodation === 'yes' ? 'Includes 3-Day Stay + Entry' : 'Entry Only'}</p>
                                    </div>
                                    <span className="text-2xl font-mono text-white">₹{verifyingUser.accommodation === 'yes' ? 999 : 399}</span>
                                </div>
                            </div>

                            {/* 2. Order History */}
                            <div className="bg-[#151515] p-5 rounded-lg border border-white/10 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
                                <h4 className="text-purple-400 font-cinzel text-sm mb-4 uppercase tracking-wider">Order History</h4>

                                {(!verifyingUser.orders || verifyingUser.orders.length === 0) ? (
                                    <p className="text-gray-500 text-sm italic">No additional event orders.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {verifyingUser.orders.map((order) => (
                                            <div key={order.id} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0 last:pb-0">
                                                <div>
                                                    <p className="text-gray-400 text-xs mb-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                    <div className="flex flex-col">
                                                        {order.items.map((item, i) => (
                                                            <span key={i} className="text-white text-sm font-marcellus">{item.eventName}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className={order.status === 'PAID' ? 'text-green-500 text-xs font-bold mb-1' : 'text-yellow-500 text-xs font-bold mb-1'}>
                                                        {order.status}
                                                    </p>
                                                    <p className="text-lg font-mono text-white">₹{order.totalAmount}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center">
                                    <span className="text-gray-400 text-xs uppercase">Total Orders Value</span>
                                    <span className="text-xl font-mono text-white">
                                        ₹{verifyingUser.orders?.reduce((sum: number, o) => o.status === 'PAID' ? sum + o.totalAmount : sum, 0) || 0}
                                    </span>
                                </div>
                            </div>

                            {/* 3. Nawabi Coins History */}
                            <div className="bg-[#151515] p-5 rounded-lg border border-white/10 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-gold" />
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-gold font-cinzel text-sm uppercase tracking-wider">Nawabi Coins</h4>
                                    <span className="text-2xl font-mono text-gold font-bold">{verifyingUser.caCoins || 0}🪙</span>
                                </div>

                                {(!verifyingUser.coinHistory || verifyingUser.coinHistory.length === 0) ? (
                                    <p className="text-gray-500 text-sm italic">No coin history found.</p>
                                ) : (
                                    <div className="space-y-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                        {verifyingUser.coinHistory.map((entry) => (
                                            <div key={entry.id} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0 last:pb-0">
                                                <div>
                                                    <p className="text-white text-sm font-marcellus">{entry.reason}</p>
                                                    <p className="text-gray-500 text-[10px]">{new Date(entry.createdAt).toLocaleDateString()} {new Date(entry.createdAt).toLocaleTimeString()}</p>
                                                </div>
                                                <span className={`font-mono text-sm ${entry.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                    {entry.amount > 0 ? '+' : ''}{entry.amount}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Payment Screenshot */}
                            {verifyingUser.paymentScreenshot && (
                                <div className="bg-[#151515] p-5 rounded-lg border border-white/10 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-blue-400 font-cinzel text-sm uppercase tracking-wider">Payment Proof</h4>
                                        <button
                                            onClick={() => setViewingScreenshot(verifyingUser.paymentScreenshot || null)}
                                            className="text-xs text-blue-400 hover:text-white underline"
                                        >
                                            View Fullscreen
                                        </button>
                                    </div>
                                    <div className="relative h-48 w-full rounded-lg overflow-hidden border border-white/10 cursor-pointer" onClick={() => setViewingScreenshot(verifyingUser.paymentScreenshot || null)}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={verifyingUser.paymentScreenshot}
                                            alt="Proof"
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-[#111]">
                            <Button variant="outline" onClick={() => setIsVerifyModalOpen(false)}>Close</Button>
                            {!verifyingUser.paymentVerified && (
                                <Button onClick={() => handleVerifyUser(verifyingUser.id)} className="bg-green-600 text-white hover:bg-green-700 font-bold px-8">
                                    VERIFY USER
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* SCREENSHOT PREVIEW MODAL */}
            {viewingScreenshot && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={() => setViewingScreenshot(null)}>
                    <div className="max-w-3xl w-full max-h-[90vh] relative">
                        <button onClick={() => setViewingScreenshot(null)} className="absolute -top-10 right-0 text-white hover:text-gold transition-colors">
                            <X size={32} />
                        </button>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={viewingScreenshot} alt="Payment Proof" className="w-full h-full object-contain rounded-lg border border-white/20" />
                    </div>
                </div>
            )}

            {/* EDIT MODAL */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#111] border border-gold/40 rounded-xl p-6 w-full max-w-lg shadow-2xl relative">
                        <button onClick={() => setIsEditModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                            <X size={24} />
                        </button>
                        <h2 className="text-2xl font-cinzel text-gold mb-6">Edit User</h2>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="text-xs text-gray-500">Name</label>
                                <input
                                    className="w-full bg-black/50 border border-white/10 rounded p-2 text-white"
                                    value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">Email</label>
                                <input
                                    className="w-full bg-black/50 border border-white/10 rounded p-2 text-white"
                                    value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">College</label>
                                <input
                                    className="w-full bg-black/50 border border-white/10 rounded p-2 text-white"
                                    value={editForm.college} onChange={e => setEditForm({ ...editForm, college: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">Accommodation</label>
                                <select
                                    className="w-full bg-black/50 border border-white/10 rounded p-2 text-white"
                                    value={editForm.accommodation} onChange={e => setEditForm({ ...editForm, accommodation: e.target.value })}
                                >
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </div>
                        </div>

                        <div className="border-t border-white/10 pt-4 mt-4">
                            <label className="text-sm font-bold text-gold mb-2 block">Reset Password</label>
                            <input
                                type="text"
                                className="w-full bg-red-900/10 border border-red-500/30 rounded p-2 text-white"
                                placeholder="Enter NEW Password"
                                value={editForm.password} onChange={e => setEditForm({ ...editForm, password: e.target.value })}
                            />
                            <p className="text-xs text-gray-500 mt-1">Leave blank to keep current password.</p>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                            <Button onClick={handleUpdateUser}>Save Changes</Button>
                        </div>

                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-cinzel text-gold">Encore 26 Admin</h1>
                        <span className="text-xs text-green-400 font-mono bg-green-900/30 px-2 py-1 rounded border border-green-500/30">LIVE</span>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative w-full md:w-64">
                            <input
                                type="text"
                                placeholder="Search by ID, Name, Email..."
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-sm text-white focus:border-gold outline-none transition-colors"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button variant="ghost" onClick={() => { setIsAuthenticated(false); localStorage.removeItem('admin_secret'); }}>Logout</Button>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden mb-8">
                    <div className="max-h-[60vh] overflow-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/10 text-gold font-cinzel sticky top-0 backdrop-blur-md">
                                <tr>
                                    <th className="p-4">User</th>
                                    <th className="p-4">Contact</th>
                                    <th className="p-4">Reference</th>
                                    <th className="p-4">Paid</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {users.filter(user => {
                                    const query = searchQuery.toLowerCase();
                                    return (
                                        (user.name?.toLowerCase() || '').includes(query) ||
                                        (user.email?.toLowerCase() || '').includes(query) ||
                                        (user.id?.toLowerCase() || '').includes(query) ||
                                        (user.paymentId?.toLowerCase() || '').includes(query)
                                    );
                                }).map((user) => {


                                    // Registration Fee Logic
                                    const registrationFee = user.totalPaid || (user.accommodation === 'yes' ? 999 : 399);

                                    return (
                                        <tr key={user.id} className="hover:bg-white/5">
                                            <td className="p-4">
                                                <div className="font-medium text-white">{user.name}</div>
                                                <div className="text-xs text-gray-500 font-mono mt-1">{user.id}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="text-sm text-gray-300">{user.email}</div>
                                                <div className="text-xs text-gray-500">{user.phone || 'N/A'}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="text-sm text-gray-400">{user.college || '-'}</div>
                                                {user.paymentId && <div className="text-[10px] text-gray-600 mt-1 font-mono">PID: {user.paymentId}</div>}
                                            </td>

                                            {/* Payment & Verification Status */}
                                            <td className="p-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-gold font-mono text-sm">₹{registrationFee}</span>
                                                    {user.paymentVerified ? (
                                                        <span className="text-xs text-green-400 bg-green-900/20 px-2 py-0.5 rounded w-fit">Verified</span>
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-red-400 bg-red-900/20 px-2 py-0.5 rounded">Pending</span>
                                                            <button
                                                                onClick={() => openVerifyModal(user)}
                                                                className="text-[10px] bg-green-600/20 text-green-400 border border-green-600/50 px-2 rounded hover:bg-green-600/30 transition-colors"
                                                            >
                                                                Verify
                                                            </button>
                                                        </div>
                                                    )}
                                                    {/* Always Show Details Button */}
                                                    <button
                                                        onClick={() => openVerifyModal(user)}
                                                        className="text-[10px] text-gray-400 underline hover:text-white w-fit mt-1"
                                                    >
                                                        Details
                                                    </button>

                                                    {user.paymentScreenshot && (
                                                        <button
                                                            onClick={() => setViewingScreenshot(user.paymentScreenshot || null)}
                                                            className="text-[10px] text-blue-400 underline decoration-blue-400/30 hover:text-blue-300 w-fit"
                                                        >
                                                            View Screenshot
                                                        </button>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="p-4 flex gap-2">
                                                <button
                                                    onClick={() => openEditModal(user)}
                                                    className="p-2 bg-blue-500/10 text-blue-400 rounded hover:bg-blue-500/20"
                                                    title="Edit User"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => confirmDeleteUser(user.id)}
                                                    className="p-2 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20"
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Team Statistics Section */}
                <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden mb-8">
                    <h2 className="text-2xl font-cinzel text-gold p-6 border-b border-white/10 flex items-center gap-2">
                        <UsersIcon className="text-gold" /> Team Registrations
                    </h2>
                    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {eventsData.filter(e => e.isTeam).map(event => {
                            const stat = teamStats.find(s => s.eventSlug === event.slug);
                            const count = stat ? stat.count : 0;

                            return (
                                <div key={event.slug} className={`p-4 rounded-lg border ${count > 0 ? 'bg-gold/10 border-gold/40' : 'bg-white/5 border-white/10'} flex justify-between items-center`}>
                                    <div>
                                        <h3 className="font-cinzel text-white text-sm">{event.title}</h3>
                                        <p className="text-xs text-gray-500">{event.category}</p>
                                    </div>
                                    <span className={`text-2xl font-mono font-bold ${count > 0 ? 'text-gold' : 'text-gray-600'}`}>
                                        {count}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Leaderboard Section */}
                <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden mb-12">
                    <h2 className="text-2xl font-cinzel text-gold p-6 border-b border-white/10">🏆 CA Leaderboard</h2>
                    <div className="max-h-[50vh] overflow-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/10 text-gold font-cinzel sticky top-0 backdrop-blur-md">
                                <tr>
                                    <th className="p-4">Rank</th>
                                    <th className="p-4">CA Name</th>
                                    <th className="p-4">College</th>
                                    <th className="p-4">Code</th>
                                    <th className="p-4 text-right">Referrals</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {leaderboard.map((ca, index) => (
                                    <tr key={ca.id} className="hover:bg-white/5">
                                        <td className="p-4 font-mono text-gold">#{index + 1}</td>
                                        <td className="p-4 font-medium">{ca.name}</td>
                                        <td className="p-4 text-gray-400 text-sm">{ca.college}</td>
                                        <td className="p-4 font-mono text-xs">{ca.referralCode}</td>
                                        <td className="p-4 text-right font-bold text-gold text-lg">{ca.referrals}</td>
                                    </tr>
                                ))}
                                {leaderboard.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-500">No data available yet</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* CA Section */}
                <div className="bg-gold/5 border border-gold/20 p-8 rounded-xl mb-12">
                    <h2 className="text-2xl font-cinzel text-gold mb-6">Onboard Campus Ambassador</h2>
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            const form = e.target as HTMLFormElement;
                            const formData = new FormData(form);
                            const payload = Object.fromEntries(formData) as { name: string; email: string; phone: string; college: string };
                            try {
                                const res = await fetch('/api/ca/register', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(payload)
                                });
                                const data = await res.json();
                                if (res.ok) {
                                    setModalState({
                                        isOpen: true,
                                        title: "Success",
                                        message: (
                                            <div className="text-center">
                                                <p>CA Generated Successfully!</p>
                                                <div className="my-6 p-4 bg-white/5 border border-gold/30 rounded-xl relative overflow-hidden group">
                                                    <div className="absolute inset-0 bg-gold/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                                    <span className="relative text-gray-400 text-xs uppercase tracking-widest block mb-1">Referral Code</span>
                                                    <strong className="relative text-gold text-4xl font-cinzel tracking-widest drop-shadow-md">{data.code}</strong>
                                                </div>

                                                <a
                                                    href={`https://wa.me/${payload.phone}?text=${encodeURIComponent(`Hello ${payload.name}, Congratulations on being selected as a Campus Ambassador for Encore 26! 🌟\n\nYour Referral Code is: *${data.code}*\n\nShare this code to earn rewards! 🚀`)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-full font-bold hover:bg-[#128C7E] transition-colors mt-2"
                                                >
                                                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.248-.57-.397m-5.475 7.355c-2.43 0-4.814-.582-6.91-1.68l-.497-.263-5.118 1.341 1.366-4.99-.323-.513C.115 13.58 0 11.233 0 8.796 0 3.947 3.946 0 8.795 0c2.35 0 4.561.916 6.223 2.577 1.662 1.661 2.578 3.87 2.578 6.22 0 4.85-3.947 8.794-8.796 8.794" /></svg>
                                                    Send on WhatsApp
                                                </a>
                                            </div>
                                        ),
                                        type: "success"
                                    });
                                    form.reset();
                                } else {
                                    setModalState({ isOpen: true, title: "Error", message: data.error || 'Failed', type: "error" });
                                }
                            } catch {
                                setModalState({ isOpen: true, title: "Error", message: "Unexpected error occurred", type: "error" });
                            }
                        }}
                        className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end"
                    >
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Name</label>
                            <input name="name" required className="w-full bg-black/50 border border-white/20 rounded p-2 text-white" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Email</label>
                            <input name="email" type="email" required className="w-full bg-black/50 border border-white/20 rounded p-2 text-white" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Phone</label>
                            <input name="phone" required placeholder="91XXXXXXXXXX" className="w-full bg-black/50 border border-white/20 rounded p-2 text-white" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">College</label>
                            <input name="college" required className="w-full bg-black/50 border border-white/20 rounded p-2 text-white" />
                        </div>
                        <Button type="submit" variant="outline" className="border-gold text-gold hover:bg-gold hover:text-black">
                            Generate Code
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
