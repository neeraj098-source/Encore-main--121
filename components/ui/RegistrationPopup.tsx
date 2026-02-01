"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function RegistrationPopup() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Show popup shortly after hydration
        const timer = setTimeout(() => {
            // Check if we've already shown it this session if desired
            // const hasShown = sessionStorage.getItem("registrationPopupShown");
            // if (!hasShown) {
            setIsOpen(true);
            // sessionStorage.setItem("registrationPopupShown", "true");
            // }
        }, 1000); // 1 second delay for dramatic effect

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 overflow-hidden">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Popup Card */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 50 }}
                        transition={{ type: "spring", duration: 0.8, bounce: 0.3 }}
                        className="relative w-full max-w-md p-1"
                    >
                        {/* Gold Border Container */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37] via-[#FFE5B4] to-[#D4AF37] opacity-80 rounded-2xl blur-sm" />
                        <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37] via-[#AA8C2C] to-[#D4AF37] rounded-2xl" />

                        {/* Inner Content */}
                        <div className="relative bg-[#0a0a0a] rounded-[14px] p-8 md:p-10 text-center overflow-hidden border border-[#D4AF37]/30 shadow-2xl shadow-nawabi-gold/20">

                            {/* Decorative Background Elements */}
                            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                                <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-nawabi-gold/20 via-transparent to-transparent animate-spin-slow" />
                            </div>

                            {/* Corner Ornaments */}
                            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#D4AF37] rounded-tl-lg" />
                            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-[#D4AF37] rounded-tr-lg" />
                            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-[#D4AF37] rounded-bl-lg" />
                            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#D4AF37] rounded-br-lg" />



                            {/* Content */}
                            <div className="relative z-10 font-cinzel">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <p className="text-[#D4AF37] text-sm md:text-base tracking-[0.2em] uppercase mb-4 font-marcellus">
                                        The Gates Are Closing
                                    </p>
                                </motion.div>

                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.5, type: "spring" }}
                                    className="mb-6 relative"
                                >
                                    <h2 className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-[#F9E29C] via-[#D4AF37] to-[#AA8C2C] drop-shadow-[0_2px_10px_rgba(212,175,55,0.5)]">
                                        7
                                    </h2>
                                    <p className="text-2xl md:text-3xl text-white mt-[-10px] tracking-widest font-bold drop-shadow-md">
                                        DAYS
                                    </p>
                                    <p className="text-sm text-[#D4AF37]/80 mt-1 uppercase tracking-widest">
                                        League Of Legacy
                                    </p>
                                </motion.div>

                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.8 }}
                                    className="text-gray-300 font-marcellus text-sm md:text-base mb-8 max-w-[80%] mx-auto leading-relaxed"
                                >
                                    Registration for the royal court ends soon. Secure your presence.
                                </motion.p>

                                <motion.button
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ delay: 1 }}
                                    onClick={handleClose}
                                    className="group relative px-8 py-3 bg-[#D4AF37] text-black font-bold uppercase tracking-wider rounded-sm overflow-hidden"
                                >
                                    <span className="relative z-10">Proceed</span>
                                    <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
