"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { scrollY } = useScroll();

    useEffect(() => {
        // Check initial login status
        const checkLogin = () => {
            if (typeof window !== 'undefined') {
                const user = localStorage.getItem('encore_user');
                setIsLoggedIn(!!user);
            }
        };

        checkLogin();

        // Listen for storage events to update UI across tabs or after login
        window.addEventListener('storage', checkLogin);
        // Custom event for same-tab updates
        window.addEventListener('user-login', checkLogin);

        return () => {
            window.removeEventListener('storage', checkLogin);
            window.removeEventListener('user-login', checkLogin);
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
        { name: 'CA Portal', href: '/ca-portal' },
        { name: 'Sponsorship', href: '/sponsorship' },
    ];

    return (
        <motion.nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/90 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
                }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">

                    {/* Logo Left */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/">
                            <div className="relative h-12 w-12 md:h-16 md:w-16 rounded-full overflow-hidden border border-white/20">
                                <Image
                                    src="/images/iet_logo.png"
                                    alt="IET Logo"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center space-x-8">
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
                        </div>
                    </div>

                    {/* Right/Login + Logo */}
                    <div className="hidden md:flex items-center space-x-6">
                        {isLoggedIn ? (
                            <Link href="/dashboard">
                                <Button variant="primary" size="sm">Profile</Button>
                            </Link>
                        ) : (
                            <Link href="/login">
                                <Button variant="primary" size="sm">Login</Button>
                            </Link>
                        )}
                        <div className="relative h-12 w-12 md:h-16 md:w-16">
                            <Image
                                src="/images/issacc_logo.png"
                                alt="ISSACC Logo"
                                fill
                                className="object-contain"
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
                        <div className="pt-4">
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
