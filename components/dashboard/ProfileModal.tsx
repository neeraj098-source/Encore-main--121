"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { X, Building, Phone, GraduationCap } from 'lucide-react';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
    onUpdate: (updatedUser: any) => void;
}

export default function ProfileModal({ isOpen, onClose, user, onUpdate }: ProfileModalProps) {
    const [formData, setFormData] = useState({
        college: user.college || '',
        year: user.year || '',
        phone: user.phone || ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedUser = { ...user, ...formData, profileCompleted: true };
        localStorage.setItem('encore_user', JSON.stringify(updatedUser));
        onUpdate(updatedUser);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-zinc-900 border border-gold/20 rounded-2xl p-6 z-50 shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-cinzel text-gold">Complete Profile</h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-marcellus text-gray-300">College / Institute</label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gold/50 h-4 w-4" />
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-gold transition-colors"
                                        placeholder="Institute of Engineering & Technology"
                                        value={formData.college}
                                        onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-marcellus text-gray-300">Year of Study</label>
                                <div className="relative">
                                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-gold/50 h-4 w-4" />
                                    <select
                                        required
                                        className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-gold transition-colors appearance-none"
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                    >
                                        <option value="" disabled>Select Year</option>
                                        <option value="1">1st Year</option>
                                        <option value="2">2nd Year</option>
                                        <option value="3">3rd Year</option>
                                        <option value="4">4th Year</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-marcellus text-gray-300">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gold/50 h-4 w-4" />
                                    <input
                                        type="tel"
                                        required
                                        pattern="[0-9]{10}"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-gold transition-colors"
                                        placeholder="9876543210"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full mt-4">
                                Save & Earn 50 Coins
                            </Button>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
