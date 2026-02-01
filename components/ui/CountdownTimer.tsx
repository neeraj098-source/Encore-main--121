"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export default function CountdownTimer({ targetDate }: { targetDate: string }) {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
        const calculateTimeLeft = () => {
            const difference = +new Date(targetDate) - +new Date();
            let newTimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

            if (difference > 0) {
                newTimeLeft = {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                };
            }
            return newTimeLeft;
        };

        // Initial calculation
        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    // Prevent hydration mismatch by returning empty or basic structure until mounted
    if (!hasMounted) return <div className="h-16" />;

    const TimeUnit = ({ value, label }: { value: number; label: string }) => (
        <div className="flex flex-col items-center mx-2 md:mx-4">
            <div className="text-3xl md:text-5xl font-cinzel font-bold text-[#D4AF37] drop-shadow-[0_0_10px_rgba(212,175,55,0.4)] tabular-nums">
                {value.toString().padStart(2, '0')}
            </div>
            <div className="text-[10px] md:text-xs font-marcellus text-gray-400 uppercase tracking-widest mt-1">
                {label}
            </div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-row items-center justify-center mb-6 py-2 px-6 rounded-lg bg-black/30 backdrop-blur-sm border border-[#D4AF37]/20 relative overflow-hidden"
        >
            {/* Subtle glow effect behind */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/5 to-transparent pointer-events-none" />

            <TimeUnit value={timeLeft.days} label="Days" />
            <div className="text-[#D4AF37]/50 text-2xl md:text-4xl font-thin pb-4">:</div>
            <TimeUnit value={timeLeft.hours} label="Hours" />
            <div className="text-[#D4AF37]/50 text-2xl md:text-4xl font-thin pb-4">:</div>
            <TimeUnit value={timeLeft.minutes} label="Mins" />
            <div className="text-[#D4AF37]/50 text-2xl md:text-4xl font-thin pb-4 md:block hidden">:</div>
            <TimeUnit value={timeLeft.seconds} label="Secs" />
        </motion.div>
    );
}
