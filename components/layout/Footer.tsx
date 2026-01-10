import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-black border-t border-white/10 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4">

                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Brand Column */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12">
                                <Image src="/images/iet_logo.png" alt="IET Logo" fill className="object-contain rounded-full" />
                            </div>
                            <span className="text-2xl font-cinzel text-gold font-bold">ENCORE</span>
                        </div>
                        <p className="text-gray-400 font-marcellus text-sm leading-relaxed">
                            The Annual Cultural Fest of IET Lucknow. A celebration of art, culture, and nawabi elegance.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://www.instagram.com/encore.iet/" className="text-gray-400 hover:text-gold transition-colors">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-gold transition-colors">
                                <Facebook size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-cinzel font-bold mb-6">Quick Links</h4>
                        <ul className="space-y-4">
                            <li><Link href="/" className="text-gray-400 hover:text-gold transition-colors">Home</Link></li>
                            <li><Link href="/events" className="text-gray-400 hover:text-gold transition-colors">Events</Link></li>
                            <li><Link href="/sponsorship" className="text-gray-400 hover:text-gold transition-colors">Sponsorship</Link></li>
                            <li><Link href="/ca-portal" className="text-gray-400 hover:text-gold transition-colors">CA Portal</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-white font-cinzel font-bold mb-6">Legal</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-gray-400 hover:text-gold transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-gold transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-gold transition-colors">Code of Conduct</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-cinzel font-bold mb-6">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-gray-400">
                                <MapPin size={18} className="text-gold shrink-0 mt-1" />
                                <span>IET Lucknow, Sitapur Road, Lucknow, UP</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400">
                                <Phone size={18} className="text-gold shrink-0" />
                                <span>+91 9175408641</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400">
                                <Mail size={18} className="text-gold shrink-0" />
                                <span>contact@encore-iet.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 font-marcellus">
                    <p>© 2026 Encore IET Lucknow. All rights reserved.</p>
                    <p>Designed & Developed with <span className="text-gold">♥</span> by Web Team</p>
                </div>
            </div>
        </footer>
    );
}
