import type { Metadata } from "next";
import { Cinzel, Marcellus } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import RoyalFooter from "@/components/layout/RoyalFooter";
import Loader from "@/components/ui/Loader";
import CornerCurtains from "@/components/ui/CornerCurtains";
import Particles from "@/components/ui/Particles";
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
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-black to-black" />

          {/* Layer 2: Mughal Manuscript Texture (Low Opacity) */}
          <div
            className="absolute inset-0 opacity-[0.15] bg-cover bg-center mix-blend-overlay"
            style={{ backgroundImage: 'url("/images/backgrounds/royal-texture.png")' }}
          />

          {/* Layer 3: Floating Golden Dust Particles (Canvas) */}
          <div className="absolute inset-0 opacity-60">
            <Particles
              className="absolute inset-0"
              quantity={40}
              staticity={20}
              ease={50}
              refresh={false}
              color="#FFD700"
            />
          </div>

          {/* Layer 4: Soft Vignette & Warm Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
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
