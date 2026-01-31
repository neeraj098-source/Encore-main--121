"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

export default function Loader() {
    const [isLoading, setIsLoading] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const playVideo = async () => {
            if (videoRef.current) {
                videoRef.current.playbackRate = 2;
                try {
                    await videoRef.current.play();
                } catch (err) {
                    console.log("Autoplay prevented:", err);
                    // Force dismiss if autoplay literally fails (rare if muted)
                    handleVideoEnded();
                }
            }
        };
        playVideo();
    }, []);

    useEffect(() => {
        // Fallback: If video fails or takes too long, force dismiss after 8 seconds
        const timer = setTimeout(() => {
            setIsLoading(false);
            if (typeof window !== 'undefined') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (window as any).hasShownIntro = true;
            }
        }, 8000);
        return () => clearTimeout(timer);
    }, []);

    const handleVideoEnded = () => {
        setIsLoading(false);
        if (typeof window !== 'undefined') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).hasShownIntro = true;
        }
    };

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeOut" } }}
                    className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
                >
                    <video
                        ref={videoRef}
                        src="/curtain_opener.mp4"
                        autoPlay
                        muted
                        playsInline
                        webkit-playsinline="true"
                        controls={false}
                        className="w-full h-full object-cover"
                        onEnded={handleVideoEnded}
                        onTimeUpdate={() => {
                            if (videoRef.current && videoRef.current.currentTime >= 2.5) {
                                handleVideoEnded();
                            }
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
