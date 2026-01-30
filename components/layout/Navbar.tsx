"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Menu, X, ShoppingCart, User } from 'lucide-react';
import CartDrawer from '@/components/cart/CartDrawer';

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCurtainDown, setIsCurtainDown] = useState(true);
    const pathname = usePathname();

    // Functional State Only (No Visual/Scroll State)
    const updateCartCount = async () => {
        try {
            const res = await fetch('/api/cart');
            if (res.ok) {
                const data = await res.json();
                setCartCount(data.items?.length || 0);
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        const checkLogin = () => {
            if (typeof window !== 'undefined') {
                const user = localStorage.getItem('encore_user');
                setIsLoggedIn(!!user);
                if (user) updateCartCount();
            }
        };

        checkLogin();
        window.addEventListener('storage', checkLogin);
        window.addEventListener('user-login', checkLogin);
        window.addEventListener('cart-updated', updateCartCount);

        return () => {
            window.removeEventListener('storage', checkLogin);
            window.removeEventListener('user-login', checkLogin);
            window.removeEventListener('cart-updated', updateCartCount);
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsCurtainDown(window.scrollY < 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (pathname?.startsWith('/admin')) return null;

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Events', href: '/events' },
        { name: 'Sponsors', href: '/sponsorship' },
        { name: 'About', href: '/about' },
    ];

    return (
        <>
            {/* ROYAL FLOATING NAVBAR */}
            <motion.header
                className="fixed top-6 left-1/2 z-50 w-[95%] max-w-5xl"
                initial={{ x: "-50%", y: 0 }}
                animate={{
                    x: "-50%",
                    y: isCurtainDown ? 0 : -150
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
            >
                <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

                {/* Main Container - Floating Pill */}
                <div className="relative w-full bg-[#050505] border border-[#D4AF37]/20 shadow-[0_0_20px_rgba(0,0,0,0.9)] px-6 py-3 rounded-full">

                    {/* Inner Gold Frame Border */}
                    <div className="absolute inset-1 rounded-full border border-[#D4AF37]/10 pointer-events-none" />

                    <div className="flex items-center justify-between relative z-10 w-full">

                        {/* LEFT: Navigation Links */}
                        <div className="flex items-center gap-8 pl-4">
                            {/* Mobile Menu Button */}
                            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-[#D4AF37]">
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>

                            {/* Desktop Links - All on Left */}
                            <nav className="hidden md:flex items-center gap-8">
                                <Link href="/" className="text-[#E8E1CF] hover:text-[#D4AF37] font-cinzel tracking-wider text-sm transition-colors uppercase">Home</Link>
                                <Link href="/events" className="text-[#E8E1CF] hover:text-[#D4AF37] font-cinzel tracking-wider text-sm transition-colors uppercase">Events</Link>
                                <Link href="/sponsorship" className="text-[#E8E1CF] hover:text-[#D4AF37] font-cinzel tracking-wider text-sm transition-colors uppercase">Sponsors</Link>
                                <Link href="/about" className="text-[#E8E1CF] hover:text-[#D4AF37] font-cinzel tracking-wider text-sm transition-colors uppercase">About</Link>
                            </nav>
                        </div>

                        {/* RIGHT: Actions + Logo */}
                        <div className="flex items-center gap-6 pr-4">

                            {/* Actions (CA, Cart, User) */}
                            <div className="flex items-center gap-5 text-[#D4AF37]">
                                <Link href="/ca-portal" className="hidden md:block text-xs font-marcellus tracking-widest hover:text-white transition-colors border-b border-transparent hover:border-[#D4AF37]">
                                    CA PORTAL
                                </Link>
                                <button onClick={() => setIsCartOpen(true)} className="relative hover:text-white transition-colors">
                                    <ShoppingCart size={18} />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_5px_red]" />
                                    )}
                                </button>
                                <Link href={isLoggedIn ? "/dashboard" : "/login"} className="hover:text-white transition-colors">
                                    <User size={18} />
                                </Link>
                            </div>

                            <div className="h-8 w-[1px] bg-[#D4AF37]/30 hidden md:block" />

                            {/* Logo */}
                            <Link href="/" className="group block relative">
                                <div className="relative w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
                                    {/* Gold Glow behind logo */}
                                    <div className="absolute inset-0 bg-[#D4AF37]/20 blur-[15px] rounded-full opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
                                    <Image
                                        src="/images/iet_logo_new.png"
                                        alt="Encore Logo"
                                        width={64}
                                        height={64}
                                        className="object-contain drop-shadow-[0_2px_10px_rgba(212,175,55,0.5)] z-10 group-hover:scale-105 transition-transform duration-300"
                                        priority
                                    />
                                </div>
                            </Link>
                        </div>

                    </div>
                </div>
            </motion.header>

            {/* FULLSCREEN ROYAL MOBILE MENU */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[49] bg-black/95 backdrop-blur-xl flex flex-col justify-center items-center">
                    {/* Decorative Background */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none"
                        style={{
                            backgroundImage: 'radial-gradient(circle at center, #D4AF37 1px, transparent 1px)',
                            backgroundSize: '30px 30px'
                        }}
                    />

                    <nav className="flex flex-col items-center gap-8 relative z-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-3xl font-cinzel text-[#E8E1CF] hover:text-[#D4AF37] transition-colors drop-shadow-md"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="w-12 h-[1px] bg-[#D4AF37]/50 my-4" />
                        <Link
                            href="/ca-portal"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-[#D4AF37] font-marcellus tracking-[0.2em] border border-[#D4AF37]/50 px-8 py-3 rounded-full hover:bg-[#D4AF37] hover:text-black transition-all uppercase"
                        >
                            CA Portal
                        </Link>
                    </nav>
                </div>
            )}
        </>
    );
}

