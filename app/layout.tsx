import type { Metadata } from "next";
import { Cinzel, Marcellus } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Loader from "@/components/ui/Loader";
import CustomCursor from "@/components/ui/CustomCursor";
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
  title: "Encore 26 | Nawabi Elegance",
  description: "The Annual Cultural Fest of IET Lucknow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth cursor-none">
      <body
        className={`${cinzel.variable} ${marcellus.variable} antialiased bg-black text-white overflow-x-hidden`}
      >
        <Loader />
        <CustomCursor />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
