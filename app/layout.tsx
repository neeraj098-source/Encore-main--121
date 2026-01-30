import type { Metadata } from "next";
import { Cinzel, Marcellus } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import RoyalFooter from "@/components/layout/RoyalFooter";
import Loader from "@/components/ui/Loader";
import CornerCurtains from "@/components/ui/CornerCurtains";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const marcellus = Marcellus({
  variable: "--font-marcellus",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Encore 26",
  description: "The Annual Cultural Fest of IET Lucknow",
  icons: {
    icon: "/images/iet_logo_new.png",
    shortcut: "/images/iet_logo_new.png",
    apple: "/images/iet_logo_new.png",
  },
  openGraph: {
    title: "Encore 26",
    description: "The Annual Cultural Fest of IET Lucknow",
    siteName: "Encore 26",
    images: [
      {
        url: "/images/iet_logo_new.png",
        width: 800,
        height: 800,
        alt: "IET Lucknow Logo",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${cinzel.variable} ${marcellus.variable} antialiased bg-black min-h-screen text-white overflow-x-hidden selection:bg-gold/30`}
      >
        {/* Cinematic Background Layer System */}
        <div className="fixed inset-0 z-[-1]">
          {/* Layer 1: Deep Charcoal Gradient Base */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] via-black to-black" />

          {/* Layer 2: Mughal Manuscript Texture (Low Opacity) */}
          <div
            className="absolute inset-0 opacity-[0.15] bg-cover bg-center mix-blend-overlay"
            style={{ backgroundImage: 'url("/images/backgrounds/royal-texture.png")' }}
          />

          {/* Layer 3: Floating Golden Dust Particles */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute inset-0 bg-[url('/images/texture-noise.png')] opacity-20 animate-pulse" />
            {/* We can re-use the Particles component here if imported, or keep it simple with CSS for now since Particles is a client component and this is Layout */}
          </div>

          {/* Layer 4: Soft Vignette & Warm Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gold/5 blur-[100px] rounded-full pointer-events-none" />
        </div>

        <Loader />
        <CornerCurtains />
        <Navbar />
        <main className="relative z-10">
          {children}
        </main>
        <RoyalFooter />
      </body>
    </html>
  );
}
