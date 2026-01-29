
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Mail, Lock } from 'lucide-react';
import { signIn } from 'next-auth/react';

export default function LoginForm() {
    const router = useRouter();
    const [isLoginMode, setIsLoginMode] = useState(true); // Default to Login
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
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

    // Registration Data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        gender: '',
        phone: '',
        password: '',
        confirmPassword: '',
        referralCode: '',
        college: '',
        year: '',
        course: '',
        accommodation: ''
    });



    // Login Data
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleLoginChange = (field: string, value: string) => {
        setLoginData(prev => ({ ...prev, [field]: value }));
    };



    // --- Login Logic ---
    const handleLogin = async () => {
        if (!loginData.email || !loginData.password) {
            setModalState({
                isOpen: true,
                title: "Missing Credentials",
                message: "Please enter both email and password.",
                type: "warning"
            });
            return;
        }

        setIsLoading(true);
        try {
            const res = await signIn('credentials', {
                redirect: false,
                email: loginData.email.trim(),
                password: loginData.password.trim(),
            });

            if (res?.error) {
                setModalState({
                    isOpen: true,
                    title: "Login Failed",
                    message: "Invalid email or password.",
                    type: "error"
                });
            } else {
                localStorage.setItem('encore_user', JSON.stringify({ email: loginData.email }));
                // Notify Navbar immediately
                window.dispatchEvent(new Event('user-login'));
                router.push('/dashboard');
            }
        } catch {
            setModalState({
                isOpen: true,
                title: "Error",
                message: "Something went wrong. Please try again.",
                type: "error"
            });
        } finally {
            setIsLoading(false);
        }
    };

    // --- Registration Logic ---
    const handleNext = () => {
        if (step === 1) {
            if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
                setModalState({
                    isOpen: true,
                    title: "Missing Information",
                    message: "Please fill all required fields marked with *",
                    type: "warning"
                });
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                setModalState({
                    isOpen: true,
                    title: "Password Mismatch",
                    message: "Passwords do not match!",
                    type: "error"
                });
                return;
            }
            setStep(2);
        } else if (step === 2) {
            if (!formData.college || !formData.year || !formData.accommodation) {
                setModalState({
                    isOpen: true,
                    title: "Missing Information",
                    message: "Please fill all required fields in this step.",
                    type: "warning"
                });
                return;
            }
            // Skip Payment -> Submit Directly
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    email: formData.email.trim(),
                    password: formData.password.trim(),
                    confirmPassword: formData.confirmPassword.trim(),
                    // paymentId: paymentState.paymentId.trim(),
                    // paymentScreenshot: paymentState.preview,
                    totalPaid: 0 // Payment deferred
                }),
            });

            const data = await res.json();

            if (res.ok) {
                if (data.exists) {
                    setModalState({
                        isOpen: true,
                        title: "User Exists",
                        message: "User already exists! Please login.",
                        type: "info",
                        onAction: () => {
                            setIsLoginMode(true);
                            setModalState(prev => ({ ...prev, isOpen: false }));
                        },
                        actionLabel: "Login Now"
                    });
                } else {
                    setModalState({
                        isOpen: true,
                        title: "Success",
                        message: "Registration Successful! Please login with your credentials.",
                        type: "success",
                        onAction: () => {
                            setIsLoginMode(true);
                            setModalState(prev => ({ ...prev, isOpen: false }));
                        }, // Switch to login after registration
                        actionLabel: "Login Now"
                    });
                    localStorage.setItem('encore_user', JSON.stringify(data.user));
                    window.dispatchEvent(new Event('user-login'));
                }
            } else {
                setModalState({
                    isOpen: true,
                    title: "Registration Failed",
                    message: data.error || 'Registration failed.',
                    type: "error"
                });
            }
        } catch (error) {
            console.error('Registration error:', error);
            setModalState({
                isOpen: true,
                title: "Network Error",
                message: "Connection error. Please check your internet.",
                type: "error"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-8 bg-white/5 backdrop-blur-xl border border-gold/20 rounded-3xl shadow-2xl relative overflow-hidden transition-all duration-500">

            {/* Modal Component */}
            <Modal
                isOpen={modalState.isOpen}
                onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
                title={modalState.title}
                message={modalState.message}
                type={modalState.type}
                actionLabel={modalState.actionLabel}
                onAction={modalState.onAction}
            />

            {/* Background Decorations */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-gold/10 rounded-full blur-[80px]" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-900/20 rounded-full blur-[80px]" />

            {/* Title / Header */}
            <div className="relative z-10 text-center mb-8">
                <h2 className="text-3xl font-cinzel text-gold mb-2">
                    {isLoginMode ? "Welcome Back" : "Join The Legacy"}
                </h2>
                <p className="text-gray-400 font-marcellus text-sm">
                    {isLoginMode ? "Enter your credentials to access your dashboard" : "Register for Encore 26"}
                </p>
            </div>

            {/* Toggle Switch */}
            <div className="relative z-10 flex justify-center mb-8">
                <div className="bg-black/40 border border-white/10 p-1 rounded-xl flex">
                    <button
                        type="button"
                        onClick={() => setIsLoginMode(true)}
                        className={`px-6 py-2 rounded-lg font-cinzel text-sm transition-all ${isLoginMode ? 'bg-gold text-black shadow-lg shadow-gold/20' : 'text-gray-400 hover:text-white'}`}
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsLoginMode(false)}
                        className={`px-6 py-2 rounded-lg font-cinzel text-sm transition-all ${!isLoginMode ? 'bg-gold text-black shadow-lg shadow-gold/20' : 'text-gray-400 hover:text-white'}`}
                    >
                        Register
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {isLoginMode ? (
                    // --- LOGIN FORM ---
                    <motion.div
                        key="login"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-6 relative z-10">
                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-sm font-marcellus text-gold/80 ml-1">Email ID</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gold transition-colors h-5 w-5" />
                                    <input
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-gold/50 transition-all font-sans"
                                        placeholder="Enter your email"
                                        value={loginData.email}
                                        onChange={(e) => handleLoginChange('email', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label className="text-sm font-marcellus text-gold/80 ml-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gold transition-colors h-5 w-5" />
                                    <input
                                        type="password"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-gold/50 transition-all font-sans"
                                        placeholder="Enter your password"
                                        value={loginData.password}
                                        onChange={(e) => handleLoginChange('password', e.target.value)}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 text-lg font-cinzel rounded-xl bg-gold text-black hover:bg-white hover:text-black transition-all shadow-lg shadow-gold/10 mt-4"
                            >
                                {isLoading ? "Signing In..." : "Sign In"}
                            </Button>

                        </form>

                    </motion.div>
                ) : (
                    // --- REGISTRATION FORM (Stepper) ---
                    <motion.div
                        key="register"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        {/* Stepper Header (Only show in Register mode) */}
                        <div className="relative z-10 flex justify-center items-center mb-10 gap-4">
                            <div className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-2 transition-all ${step >= 1 ? 'bg-gold text-black' : 'bg-white/10 text-gray-400'}`}>
                                    1
                                </div>
                                <span className={`text-[10px] uppercase tracking-widest ${step >= 1 ? 'text-gold' : 'text-gray-500'}`}>Personal</span>
                            </div>
                            <div className={`w-8 h-[1px] mt-[-20px] ${step >= 2 ? 'bg-gold' : 'bg-white/10'}`} />
                            <div className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-2 transition-all ${step >= 2 ? 'bg-gold text-black' : 'bg-white/10 text-gray-400'}`}>
                                    2
                                </div>
                                <span className={`text-[10px] uppercase tracking-widest ${step >= 2 ? 'text-gold' : 'text-gray-500'}`}>College</span>
                            </div>

                        </div>

                        {step === 1 && (
                            <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                                {/* Dev Autofill Button (Top Right of Form) */}


                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs text-gray-400 ml-1">Name*</label>
                                    <input
                                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-gold/50 outline-none"
                                        placeholder="Full Name"
                                        value={formData.name} onChange={(e) => handleChange('name', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400 ml-1">Email*</label>
                                    <input
                                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-gold/50 outline-none"
                                        placeholder="Email Address"
                                        value={formData.email} onChange={(e) => handleChange('email', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400 ml-1">Phone*</label>
                                    <input
                                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-gold/50 outline-none"
                                        placeholder="Phone Number"
                                        value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400 ml-1">Gender</label>
                                    <select
                                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-gold/50 outline-none"
                                        value={formData.gender} onChange={(e) => handleChange('gender', e.target.value)}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male" className="text-black">Male</option>
                                        <option value="Female" className="text-black">Female</option>
                                        <option value="Other" className="text-black">Other</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400 ml-1">CA Code</label>
                                    <input
                                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-gold/50 outline-none"
                                        placeholder="Optional"
                                        value={formData.referralCode} onChange={(e) => handleChange('referralCode', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400 ml-1">Password*</label>
                                    <input type="password"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-gold/50 outline-none"
                                        placeholder="Create Password"
                                        value={formData.password} onChange={(e) => handleChange('password', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400 ml-1">Confirm*</label>
                                    <input type="password"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-gold/50 outline-none"
                                        placeholder="Confirm Password"
                                        value={formData.confirmPassword} onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                    />
                                </div>

                                <div className="md:col-span-2 mt-4">
                                    <Button type="submit" className="w-full py-4 bg-gold text-black font-cinzel rounded-xl hover:bg-white transition-all">
                                        Next (College Details)
                                    </Button>
                                </div>
                            </form>
                        )}

                        {step === 2 && (
                            <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400 ml-1">College Name*</label>
                                    <input
                                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-gold/50 outline-none"
                                        placeholder="College Name"
                                        value={formData.college} onChange={(e) => handleChange('college', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400 ml-1">Year*</label>
                                    <select
                                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-gold/50 outline-none"
                                        value={formData.year} onChange={(e) => handleChange('year', e.target.value)}
                                    >
                                        <option value="">Select Year</option>
                                        <option value="1" className="text-black">1st Year</option>
                                        <option value="2" className="text-black">2nd Year</option>
                                        <option value="3" className="text-black">3rd Year</option>
                                        <option value="4" className="text-black">4th Year</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400 ml-1">Course</label>
                                    <input
                                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-gold/50 outline-none"
                                        placeholder="e.g. B.Tech"
                                        value={formData.course} onChange={(e) => handleChange('course', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400 ml-1">Accommodation*</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button type="button" onClick={() => handleChange('accommodation', 'yes')} className={`p-3 rounded-lg border ${formData.accommodation === 'yes' ? 'bg-gold/20 border-gold text-white' : 'border-white/10 text-gray-400'}`}>
                                            Yes <span className="text-[10px] block text-red-400">(Paid ₹999)</span>
                                        </button>
                                        <button type="button" onClick={() => handleChange('accommodation', 'no')} className={`p-3 rounded-lg border ${formData.accommodation === 'no' ? 'bg-gold/20 border-gold text-white' : 'border-white/10 text-gray-400'}`}>
                                            No <span className="text-[10px] block opacity-50">Local (₹399)</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-6">
                                    <Button type="button" variant="ghost" onClick={() => setStep(1)} className="flex-1 border border-white/20">Back</Button>
                                    <Button type="submit" disabled={isLoading} className="flex-[2] py-4 bg-gold text-black font-cinzel rounded-xl hover:bg-white transition-all">
                                        {isLoading ? 'Registering...' : 'Complete Registration'}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

        </div >
    );
}
