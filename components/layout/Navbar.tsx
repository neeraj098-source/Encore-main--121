"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Menu, X, ShoppingCart } from 'lucide-react';
import CartDrawer from '@/components/cart/CartDrawer';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { scrollY } = useScroll();

    const [cartCount, setCartCount] = useState(0);
    const [isCartOpen, setIsCartOpen] = useState(false);

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
        // Check initial login status
        const checkLogin = () => {
            if (typeof window !== 'undefined') {
                const user = localStorage.getItem('encore_user');
                setIsLoggedIn(!!user);
                if (user) updateCartCount();
            }
        };

        checkLogin();

        // Listen for storage events to update UI across tabs or after login
        window.addEventListener('storage', checkLogin);
        // Custom event for same-tab updates
        window.addEventListener('user-login', checkLogin);
        window.addEventListener('cart-updated', updateCartCount);

        return () => {
            window.removeEventListener('storage', checkLogin);
            window.removeEventListener('user-login', checkLogin);
            window.removeEventListener('cart-updated', updateCartCount);
        };
    }, []);

    useMotionValueEvent(scrollY, "change", (latest) => {
        if (latest > 50) {
            setIsScrolled(true);
        } else {
            setIsScrolled(false);
        }
    });

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Events', href: '/events' },
        { name: 'About', href: '/about' },
        { name: 'Sponsors', href: '/sponsorship' },
    ];

    const pathname = usePathname();

    if (pathname?.startsWith('/admin')) return null;

    return (
        <motion.nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/90 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
                }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
                <div className="flex justify-between items-center h-20">

                    {/* Logo Left */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/">
                            <div className="relative h-12 w-12 md:h-16 md:w-16 rounded-full overflow-hidden border border-white/20">
                                <Image
                                    src="/images/iet_logo_new.png"
                                    alt="IET Logo"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center absolute left-1/2 transform -translate-x-1/2">
                        <div className="flex items-center space-x-6 bg-black/40 px-6 py-2 rounded-full border border-white/5 backdrop-blur-sm">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-gray-300 hover:text-gold transition-colors font-marcellus text-sm tracking-wider uppercase"
                                >
                                    {link.name}
                                </Link>
                            ))}


                            {/* CA Portal - Desktop */}
                            <Link
                                href="/ca-portal"
                                className="hidden lg:block relative group overflow-hidden rounded-full p-[1px] mr-2"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-gold via-purple-500 to-gold opacity-50 group-hover:opacity-100 transition-opacity duration-300 animate-gradient-xy"></span>
                                <span className="relative block px-4 py-1.5 bg-black rounded-full text-xs font-marcellus text-gold group-hover:text-white transition-colors tracking-wide">
                                    CA Portal
                                </span>
                            </Link>

                            {/* Separator */}
                            <div className="h-4 w-px bg-white/20 mx-2"></div>

                            {/* Cart */}
                            <button onClick={() => setIsCartOpen(true)} className="relative group">
                                <div className="p-2 text-white hover:text-gold transition-colors">
                                    <ShoppingCart size={20} />
                                    {cartCount > 0 && (
                                        <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                            {cartCount}
                                        </span>
                                    )}
                                </div>
                            </button>

                            {/* Profile/Login */}
                            {isLoggedIn ? (
                                <Link href="/dashboard">
                                    <Button variant="primary" size="sm" className="bg-gold text-black hover:bg-gold/90 text-xs px-4 py-1 h-8">Profile</Button>
                                </Link>
                            ) : (
                                <Link href="/login">
                                    <Button variant="primary" size="sm" className="bg-gold text-black hover:bg-gold/90 text-xs px-4 py-1 h-8">Login</Button>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Right/Login + Logo */}
                    <div className="hidden md:flex items-center space-x-6">
                        <div className="relative h-12 w-32 md:h-16 md:w-48">
                            <Image
                                src="/images/issacc_new.png"
                                alt="ISSACC Arts & Cultural"
                                fill
                                className="object-contain mix-blend-screen"
                            />
                        </div>
                    </div>

                    {/* Mobile hamburger */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-white hover:text-gold"
                        >
                            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="md:hidden bg-black border-t border-white/10"
                >
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="block px-3 py-3 text-base font-medium text-white hover:text-gold hover:bg-white/5 rounded-md"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="pt-4 border-t border-white/10 mt-2">
                            <Link
                                href="/ca-portal"
                                className="block w-full text-center px-3 py-2 text-sm font-marcellus text-gold hover:text-white border border-gold/30 rounded-full mb-3"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                CA Portal
                            </Link>

                            {isLoggedIn ? (
                                <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button variant="primary" className="w-full">Profile</Button>
                                </Link>
                            ) : (
                                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button variant="primary" className="w-full">Login</Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.nav>
    );
}
