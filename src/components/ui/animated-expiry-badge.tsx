'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedExpiryBadgeProps {
    expiryDate: string;
    daysToExpiry: number;
    isExpiringSoon: boolean;
}

export function AnimatedExpiryBadge({ expiryDate, daysToExpiry, isExpiringSoon }: AnimatedExpiryBadgeProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const targetDate = new Date(expiryDate).getTime();

        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference > 0) {
                setTimeLeft({
                    d: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    h: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    m: Math.floor((difference / 1000 / 60) % 60),
                    s: Math.floor((difference / 1000) % 60),
                });
            } else {
                setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
            }
        };

        calculateTimeLeft(); // initial call
        const timerId = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timerId);
    }, [expiryDate]);

    // Safety fallback before mount to prevent hydration mismatch on timestamp
    if (!mounted) {
        return (
            <div className={cn(
                'px-4 py-2.5 rounded-2xl border flex items-center gap-3 shadow-sm transition-all',
                isExpiringSoon ? 'bg-[#4a0404] border-[#7f1d1d] shadow-red-900/20' : 'bg-[#1e293b] border-[#334155] shadow-slate-900/20'
            )}>
                <Clock size={22} strokeWidth={2.5} className={isExpiringSoon ? 'text-red-400' : 'text-slate-400'} />
                <div className="flex flex-col justify-center gap-0.5">
                    <p className={cn("text-[10px] font-bold uppercase tracking-wider leading-none", isExpiringSoon ? "text-red-300" : "text-slate-300")}>
                        Expires In
                    </p>
                    <p className="text-[17px] leading-none flex items-baseline gap-1">
                        <span className={cn("font-black tracking-tight", isExpiringSoon ? "text-white" : "text-white")}>{daysToExpiry}</span>
                        <span className={cn("font-bold text-[15px]", isExpiringSoon ? "text-red-200" : "text-blue-200")}>days</span>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <motion.div 
            className={cn(
                'px-4 py-2.5 rounded-2xl border flex items-center gap-3 shadow-sm transition-all cursor-pointer relative overflow-hidden group',
                isExpiringSoon ? 'bg-[#4a0404] border-[#7f1d1d] shadow-red-900/30' : 'bg-[#1e293b] border-[#334155] shadow-slate-900/30 hover:border-[#475569]'
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            {/* Subtle sweeping light effect on hover */}
            <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 opacity-0 group-hover:opacity-100"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />

            <motion.div 
                animate={{ 
                    rotate: isHovered ? [0, -10, 10, -10, 10, 0] : 0,
                    scale: isHovered ? [1, 1.1, 1] : 1
                }}
                transition={{ duration: 0.5 }}
                className="relative z-10"
            >
                <Clock size={22} strokeWidth={2.5} className={isExpiringSoon ? 'text-red-400' : 'text-slate-400 group-hover:text-blue-400 transition-colors'} />
            </motion.div>

            <div className="flex flex-col justify-center gap-0.5 min-w-[80px] relative z-10">
                <p className={cn(
                    "text-[10px] font-bold uppercase tracking-wider leading-none transition-colors",
                    isExpiringSoon ? "text-red-300" : "text-slate-300 group-hover:text-slate-200"
                )}>
                    {isHovered ? 'Live Countdown' : 'Expires In'}
                </p>

                <div className="h-[17px] relative w-full overflow-hidden flex items-end">
                    <AnimatePresence mode="wait">
                        {!isHovered ? (
                            <motion.p 
                                key="static"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="text-[17px] leading-none flex items-baseline gap-1 tracking-tight"
                            >
                                <span className={cn("font-black", "text-white")}>{daysToExpiry}</span>
                                <span className={cn("font-bold text-[15px]", isExpiringSoon ? "text-red-200" : "text-blue-200")}>days</span>
                            </motion.p>
                        ) : (
                            <motion.div 
                                key="live"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-baseline gap-1"
                            >
                                {timeLeft && (
                                    <>
                                        <div className="flex items-baseline gap-0.5"><span className="text-[15px] font-black text-white tabular-nums">{timeLeft.d}</span><span className="text-[11px] font-bold text-slate-400">d</span></div>
                                        <span className="text-[10px] text-slate-500 font-black">:</span>
                                        <div className="flex items-baseline gap-0.5"><span className="text-[15px] font-black text-white tabular-nums">{timeLeft.h.toString().padStart(2, '0')}</span><span className="text-[11px] font-bold text-slate-400">h</span></div>
                                        <span className="text-[10px] text-slate-500 font-black">:</span>
                                        <div className="flex items-baseline gap-0.5"><span className="text-[15px] font-black text-white tabular-nums">{timeLeft.m.toString().padStart(2, '0')}</span><span className="text-[11px] font-bold text-slate-400">m</span></div>
                                        <span className="text-[10px] text-slate-500 font-black">:</span>
                                        <div className="flex items-baseline gap-0.5"><span className="text-[15px] font-black text-blue-300 tabular-nums">{timeLeft.s.toString().padStart(2, '0')}</span><span className="text-[11px] font-bold text-blue-500/50">s</span></div>
                                    </>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}
