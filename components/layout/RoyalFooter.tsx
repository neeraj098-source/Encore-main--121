"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Youtube, Mail, MapPin, Phone, Facebook, Twitter, Linkedin } from 'lucide-react';


export default function RoyalFooter() {
    return (
        <footer className="relative bg-black text-white pt-20 pb-10 border-t border-gold/20 overflow-hidden">
            {/* Royal Pattern Overlay */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #FFD700 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/">
                            <div className="relative w-20 h-20 mb-6">
                                <Image
                                    src="/images/iet_logo_new.png"
                                    alt="IET Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </Link>
                        <h2 className="text-2xl font-cinzel text-gold mb-4">ENCORE 26</h2>
                        <p className="text-gray-400 text-sm font-marcellus leading-relaxed">
                            Celebrating the Nawabi Elegance. The annual cultural festival of IET Lucknow.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-cinzel text-gold mb-6 relative inline-block">
                            Quick Links
                            <span className="absolute -bottom-2 left-0 w-1/2 h-[1px] bg-gold/50" />
                        </h3>
                        <ul className="space-y-3 font-marcellus text-sm text-gray-400">
                            <li><Link href="/events" className="hover:text-gold transition-colors">Events</Link></li>
                            <li><Link href="/sponsorship" className="hover:text-gold transition-colors">Sponsors</Link></li>
                            <li><Link href="/about" className="hover:text-gold transition-colors">Our Team</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-cinzel text-gold mb-6 relative inline-block">
                            Contact Us
                            <span className="absolute -bottom-2 left-0 w-1/2 h-[1px] bg-gold/50" />
                        </h3>
                        <ul className="space-y-4 font-marcellus text-sm text-gray-400">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-gold shrink-0 mt-1" />
                                <span>IET Lucknow,<br />Sitapur Road, Lucknow</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-gold shrink-0" />
                                <a href="mailto:encore@ietlucknow.ac.in" className="hover:text-white transition-colors">encore@ietlucknow.ac.in</a>
                            </li>

                        </ul>
                    </div>

                    {/* Socials & Newsletter */}
                    <div>
                        <h3 className="text-lg font-cinzel text-gold mb-6 relative inline-block">
                            Connect with Us
                            <span className="absolute -bottom-2 left-0 w-1/2 h-[1px] bg-gold/50" />
                        </h3>
                        <div className="flex space-x-4 mb-8">
                            <a href="#" className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-all duration-300">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-all duration-300">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-all duration-300">
                                <Youtube size={18} />
                            </a>
                            <a href="https://www.linkedin.com/school/ietlucknow/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-all duration-300">
                                <Linkedin size={18} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center text-xs font-marcellus text-gray-600">
                    <p>&copy; 2026 Encore IET Lucknow. All rights reserved.</p>
                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                        <Link href="/privacy" className="hover:text-gray-400">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-gray-400">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
