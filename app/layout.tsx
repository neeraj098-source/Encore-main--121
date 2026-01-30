import type { Metadata } from "next";
import { Cinzel, Marcellus } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import RoyalFooter from "@/components/layout/RoyalFooter";
import Loader from "@/components/ui/Loader";
import Particles from "@/components/ui/Particles";
import CinematicBackground from "@/components/ui/CinematicBackground";
import CinematicLightingOverlay from "@/components/ui/CinematicLightingOverlay";
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
        <CinematicBackground />
        <CinematicLightingOverlay />
        <CornerCurtains />

        {/* Previous background elements removed in favor of the unified component */}

        <Loader />
        <Navbar />
        <main className="relative pt-24">
          {children}
        </main>
        <RoyalFooter />
      </body>
    </html>
  );
}
