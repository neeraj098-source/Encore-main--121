"use client";

import React from 'react';
import Navbar from './Navbar';
import { usePathname } from 'next/navigation';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isHome = pathname === '/';

    return (
        <>
            <Navbar />
            <main className={`relative ${isHome ? '' : 'pt-24'}`}>
                {children}
            </main>
        </>
    );
}
