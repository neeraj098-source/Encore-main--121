"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CheckCircle, CreditCard, MapPin, ShieldCheck, ShoppingBag, ChevronDown, ChevronRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { motion, AnimatePresence } from "framer-motion";

export default function CheckoutPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    const [paymentMethod, setPaymentMethod] = useState("upi");
    const [placingOrder, setPlacingOrder] = useState(false);

    // Steps State
    const [activeStep, setActiveStep] = useState(1);

    // Payment Verification State
    const [utr, setUtr] = useState("");
    const [screenshot, setScreenshot] = useState<string | null>(null);

    // Modal State
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        type: "success" | "error" | "warning";
    }>({
        isOpen: false,
        title: "",
        message: "",
        type: "error"
    });

    const [selectedPass, setSelectedPass] = useState<'basic' | 'accommodation'>('basic');

    // Simulation of user fetching
    useEffect(() => {
        fetchData();
        const storedUser = localStorage.getItem('encore_user');
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    const fetchData = async () => {
        try {
            const cartRes = await fetch("/api/cart");
            if (cartRes.ok) {
                const data = await cartRes.json();
                setCartItems(data.items || []);
            }

            const userRes = await fetch("/api/user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: JSON.parse(localStorage.getItem("encore_user") || "{}").email })
            });
            if (userRes.ok) {
                const userData = await userRes.json();
                setUser(userData.user);
            }

            setLoading(false);
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setScreenshot(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const placeOrder = async () => {
        setPlacingOrder(true);
        try {
            if (!utr || !screenshot) {
                setModalState({
                    isOpen: true,
                    title: "Missing Information",
                    message: "Please enter Transaction ID and upload Payment Screenshot.",
                    type: "warning"
                });
                setPlacingOrder(false);
                return;
            }

            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    passType: selectedPass,
                    paymentId: utr,
                    paymentScreenshot: screenshot
                })
            });

            if (res.ok) {
                const data = await res.json();
                router.push(`/orders?success=true&orderId=${data.orderId}`);
            } else {
                setModalState({
                    isOpen: true,
                    title: "Order Failed",
                    message: "Failed to place order. Please try again.",
                    type: "error"
                });
            }
        } catch (e) {
            console.error(e);
            setModalState({
                isOpen: true,
                title: "Error",
                message: "Something went wrong.",
                type: "error"
            });
        } finally {
            setPlacingOrder(false);
        }
    };

    const passPrice = (user?.totalPaid > 0) ? 0 : (selectedPass === 'basic' ? 399 : 999);
    const itemsTotal = cartItems.reduce((sum, item) => sum + item.price, 0);
    const finalTotal = itemsTotal + passPrice;

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050505] pt-28 pb-12 px-4 font-sans text-gray-200 bg-[url('/images/noise.png')]">
            <Modal
                isOpen={modalState.isOpen}
                onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
                title={modalState.title}
                message={modalState.message}
                type={modalState.type}
            />
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-10">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-cinzel text-white mb-2">Secure Checkout</h1>
                        <p className="text-gray-400">Complete your purchase to secure your spot.</p>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex items-center gap-4 mt-6 md:mt-0">
                        <div className={`flex items-center gap-2 ${activeStep >= 1 ? 'text-gold' : 'text-gray-600'}`}>
                            <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs ${activeStep >= 1 ? 'border-gold bg-gold text-black' : 'border-current'}`}>1</span>
                            <span className="text-sm font-bold tracking-wider uppercase">Details</span>
                        </div>
                        <div className="w-12 h-px bg-white/10" />
                        <div className={`flex items-center gap-2 ${activeStep >= 2 ? 'text-gold' : 'text-gray-600'}`}>
                            <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs ${activeStep >= 2 ? 'border-gold bg-gold text-black' : 'border-current'}`}>2</span>
                            <span className="text-sm font-bold tracking-wider uppercase">Pass</span>
                        </div>
                        <div className="w-12 h-px bg-white/10" />
                        <div className={`flex items-center gap-2 ${activeStep >= 3 ? 'text-gold' : 'text-gray-600'}`}>
                            <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs ${activeStep >= 3 ? 'border-gold bg-gold text-black' : 'border-current'}`}>3</span>
                            <span className="text-sm font-bold tracking-wider uppercase">Pay</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Flow */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Section 1: User Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-xl font-marcellus text-white">Participant Profile</h2>
                                    <p className="text-sm text-gray-500">Tickets will be issued to this registered account.</p>
                                </div>
                                <div className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20 flex items-center gap-1">
                                    <CheckCircle size={12} /> Verified
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                                    <span className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Name</span>
                                    <span className="text-white font-medium">{user?.name}</span>
                                </div>
                                <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                                    <span className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Email</span>
                                    <span className="text-white font-medium">{user?.email}</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Section 2: Pass Selection */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md"
                        >
                            <h2 className="text-xl font-marcellus text-white mb-6">Select Entry Pass</h2>

                            {user?.totalPaid > 0 ? (
                                <div className="p-4 border border-green-500/30 bg-green-900/10 rounded-xl flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                                        <CheckCircle size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-green-400">Pass Already Active</h3>
                                        <p className="text-sm text-gray-400">You have already purchased a Fest Pass. Proceed to buy event tickets.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label className={`relative cursor-pointer group`}>
                                        <input
                                            type="radio"
                                            name="pass"
                                            value="basic"
                                            checked={selectedPass === 'basic'}
                                            onChange={() => setSelectedPass('basic')}
                                            className="peer sr-only"
                                        />
                                        <div className="h-full p-5 rounded-xl border transition-all duration-300 peer-checked:border-gold peer-checked:bg-gold/10 border-white/10 bg-black/20 hover:border-white/30">
                                            <div className="flex justify-between items-start mb-3">
                                                <span className="px-2 py-1 bg-white/10 rounded text-[10px] font-bold uppercase tracking-widest text-gray-300">Basic</span>
                                                {selectedPass === 'basic' && <CheckCircle className="text-gold" size={18} />}
                                            </div>
                                            <h3 className="text-xl font-cinzel text-white mb-1">Fest Pass</h3>
                                            <div className="text-2xl font-bold text-gold mb-4">₹399</div>
                                            <ul className="space-y-2 text-xs text-gray-400">
                                                <li className="flex gap-2"><span className="text-gold">✓</span> Access to all 3 Days</li>
                                                <li className="flex gap-2"><span className="text-gold">✓</span> Concert Entry</li>
                                                <li className="flex gap-2 opacity-50"><span className="text-gray-600">✕</span> Accommodation</li>
                                            </ul>
                                        </div>
                                    </label>

                                    <label className={`relative cursor-pointer group`}>
                                        <input
                                            type="radio"
                                            name="pass"
                                            value="accommodation"
                                            checked={selectedPass === 'accommodation'}
                                            onChange={() => setSelectedPass('accommodation')}
                                            className="peer sr-only"
                                        />
                                        <div className="h-full p-5 rounded-xl border transition-all duration-300 peer-checked:border-purple-500 peer-checked:bg-purple-500/10 border-white/10 bg-black/20 hover:border-white/30">
                                            <div className="flex justify-between items-start mb-3">
                                                <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-[10px] font-bold uppercase tracking-widest">Premium</span>
                                                {selectedPass === 'accommodation' && <CheckCircle className="text-purple-400" size={18} />}
                                            </div>
                                            <h3 className="text-xl font-cinzel text-white mb-1">All Access + Stay</h3>
                                            <div className="text-2xl font-bold text-purple-400 mb-4">₹999</div>
                                            <ul className="space-y-2 text-xs text-gray-400">
                                                <li className="flex gap-2"><span className="text-purple-400">✓</span> Access to all 3 Days</li>
                                                <li className="flex gap-2"><span className="text-purple-400">✓</span> Concert Entry</li>
                                                <li className="flex gap-2"><span className="text-purple-400">✓</span> 3-Day Accommodation</li>
                                                <li className="flex gap-2"><span className="text-purple-400">✓</span> Meals Included</li>
                                            </ul>
                                        </div>
                                    </label>
                                </div>
                            )}
                        </motion.div>

                        {/* Section 3: Event Tickets */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md"
                        >
                            <h2 className="text-xl font-marcellus text-white mb-6">Event Tickets</h2>
                            {cartItems.length > 0 ? (
                                <div className="space-y-3">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4 bg-black/20 p-3 rounded-lg border border-white/5">
                                            <div className="w-12 h-12 relative bg-gray-800 rounded overflow-hidden shrink-0">
                                                <Image
                                                    src={`/images/event/${[
                                                        "darpan", "reel-making", "treasure-hunt", "marketing-mania", "picture-story", "dance-battle",
                                                        "debate", "open-stage", "solo-singing", "band-war", "graffiti", "face-painting", "monoact",
                                                        "tshirt-painting", "case-study", "live-sketching", "pageant", "relay-rangoli", "nukkad",
                                                        "rap-battle", "mimicry", "solo-dance", "short-film", "auction", "mun", "twist-a-tale",
                                                        "group-dance", "jam"
                                                    ].indexOf(item.eventSlug) + 1}.jpg`}
                                                    alt={item.eventName}
                                                    fill
                                                    className="object-cover"
                                                    onError={(e) => (e.target as HTMLImageElement).src = '/images/logo.png'}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-white text-sm">{item.eventName}</h4>
                                                <p className="text-xs text-gray-500">Individual Entry</p>
                                            </div>
                                            <span className="font-mono text-gold font-bold">₹{item.price}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm italic">No additional event tickets selected.</p>
                            )}
                        </motion.div>

                        {/* Section 4: Payment Method */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md"
                        >
                            <h2 className="text-xl font-marcellus text-white mb-6">Payment Method</h2>
                            <div className="grid grid-cols-1 gap-6">
                                {/* UPI QR Code */}
                                <div className="flex flex-col items-center p-6 bg-white rounded-xl border border-gold/50 shadow-[0_0_15px_rgba(255,215,0,0.1)]">
                                    <h3 className="text-black font-bold mb-4">Scan to Pay</h3>
                                    <div className="w-48 h-48 bg-gray-200 relative mb-4">
                                        <Image
                                            src="/images/qr.png"
                                            alt="UPI QR Code"
                                            fill
                                            className="object-contain"
                                            unoptimized
                                        />
                                    </div>
                                    <p className="text-black text-xs font-mono">UPI ID: encore@upi</p>
                                </div>

                                {/* Verification Inputs */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs uppercase text-gold mb-1 tracking-wider">Transaction ID / UTR <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            placeholder="Enter 12-digit UTR Number"
                                            className="w-full bg-black/50 border border-white/20 rounded p-3 text-white focus:border-gold outline-none"
                                            value={utr}
                                            onChange={(e) => setUtr(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs uppercase text-gold mb-1 tracking-wider">Payment Screenshot <span className="text-red-500">*</span></label>
                                        <div className="relative border-2 border-dashed border-white/20 rounded-lg p-6 hover:border-gold/50 transition-colors text-center cursor-pointer group">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileUpload}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            {screenshot ? (
                                                <div className="relative h-32 w-full">
                                                    <Image src={screenshot} alt="Preview" fill className="object-contain" />
                                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <span className="text-white text-xs">Click to Change</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-gray-400">
                                                    <p className="text-sm mb-1">Click to Upload Proof</p>
                                                    <p className="text-[10px] uppercase tracking-widest text-gray-600">JPG, PNG allowed</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                    </div>

                    {/* Right Column: Order Summary (Sticky) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28 space-y-6">
                            <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

                                <h3 className="text-lg font-cinzel text-white mb-6 border-b border-white/10 pb-4">Order Summary</h3>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Fest Pass</span>
                                        <span className="text-white font-medium">₹{passPrice}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Event Tickets</span>
                                        <span className="text-white font-medium">₹{itemsTotal}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-green-400">
                                        <span>Platform Fee</span>
                                        <span>FREE</span>
                                    </div>
                                </div>

                                <div className="border-t border-dashed border-white/20 pt-4 mb-6">
                                    <div className="flex justify-between items-end">
                                        <span className="text-gray-400 text-sm">Total Payable</span>
                                        <span className="text-3xl font-mono font-bold text-gold">₹{finalTotal}</span>
                                    </div>
                                </div>

                                <Button
                                    onClick={placeOrder}
                                    disabled={placingOrder}
                                    className="w-full h-12 text-lg font-bold bg-gradient-to-r from-gold to-amber-600 text-black shadow-lg shadow-gold/20 hover:shadow-gold/40 hover:scale-[1.02] transition-all"
                                >
                                    {placingOrder ? "Processing..." : `Pay ₹${finalTotal}`}
                                    {!placingOrder && <ChevronRight size={20} />}
                                </Button>

                                <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-gray-600 uppercase tracking-widest">
                                    <ShieldCheck size={12} /> SSL Secure Payment
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
