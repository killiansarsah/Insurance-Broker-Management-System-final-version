'use client';

import { motion, AnimatePresence } from 'framer-motion';

import { cn } from '@/lib/utils';

interface RecycleBinProps {
    isOver: boolean;
    isEmpty?: boolean;
    onClick?: () => void;
    isGasping?: boolean;
    justSwallowed?: boolean;
}

export function RecycleBin({ isOver, isEmpty = true, onClick, isGasping = false, justSwallowed = false }: RecycleBinProps) {

    return (
        <div
            onClick={onClick}
            className={cn(
                "relative group flex flex-col items-center cursor-pointer",
                "transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                isOver ? "scale-[1.45] -translate-y-5" : "hover:scale-105"
            )}
        >
            {/* Glossy Halo Effect */}
            <motion.div
                animate={{
                    opacity: isOver ? 0.5 : isGasping ? 0.25 : 0.1,
                    scale: isOver ? [1, 1.2, 1.15] : isGasping ? 1.1 : 1,
                }}
                transition={{ type: "tween", duration: 0.35, ease: "easeOut" }}
                className={cn(
                    "absolute -inset-14 rounded-full blur-[60px] transition-colors duration-500",
                    isOver ? "bg-primary-400" : isGasping ? "bg-accent-300" : "bg-surface-200"
                )}
            />

            {/* Burst particles on swallow */}
            <AnimatePresence>
                {justSwallowed && (
                    <>
                        {[...Array(6)].map((_, i) => {
                            const angle = (i / 6) * Math.PI * 2;
                            return (
                                <motion.div
                                    key={`particle-${i}`}
                                    initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                                    animate={{
                                        opacity: 0,
                                        scale: 0,
                                        x: Math.cos(angle) * 40,
                                        y: Math.sin(angle) * 40 - 10,
                                    }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                    className="absolute top-4 left-1/2 w-2 h-2 rounded-full bg-primary-400/60 z-50"
                                />
                            );
                        })}
                    </>
                )}
            </AnimatePresence>

            {/* Recycle Bin Container */}
            <div className="relative flex flex-col items-center">
                {/* Lid - Bouncy Spring */}
                <motion.div
                    animate={{
                        rotateX: isOver ? -35 : isGasping ? -12 : 0,
                        rotateZ: isOver ? -50 : isGasping ? -8 : 0,
                        y: isOver ? -24 : isGasping ? -6 : 0,
                        x: isOver ? -12 : isGasping ? -3 : 0,
                        scale: isOver ? 1.15 : 1,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 18,
                        bounce: 0.4,
                    }}
                    className="relative z-30 perspective-[1000px]"
                >
                    <div className={cn(
                        "w-14 h-2 rounded-full border border-white/40 shadow-sm transition-colors duration-500",
                        isOver ? "bg-white/50 shadow-primary-400/30 shadow-lg" : isGasping ? "bg-white/30" : "bg-white/20"
                    )} style={{ backdropFilter: 'blur(8px)' }} />
                    <div className="absolute left-1/2 -top-1.5 -translate-x-1/2 w-5 h-2.5 bg-white/40 rounded-t-sm border-t border-x border-white/50" />
                </motion.div>

                {/* Bin Body - Frosted Glass */}
                <motion.div
                    animate={{
                        scale: isOver ? 1.45 : isGasping ? 1.15 : 1,
                        y: isOver ? 10 : isGasping ? -3 : 0,
                        rotateZ: 0,
                    }}
                    transition={{
                        scale: { type: "spring", stiffness: 500, damping: 15 },
                        rotateZ: { type: "tween", duration: 0.3 },
                        y: { type: "spring", stiffness: 400, damping: 20 },
                    }}
                    className={cn(
                        "relative w-14 h-18 mt-1 rounded-b-xl overflow-hidden",
                        "border border-white/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]",
                        "transition-all duration-500",
                        isOver && "border-primary-300/50"
                    )}
                    style={{
                        background: isOver ? 'rgba(255, 255, 255, 0.3)' : isGasping ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                    }}
                >
                    {/* Inner Glossy Highlight */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent" />

                    {/* Windows 11 Ribbing */}
                    <div className="absolute inset-0 flex justify-around px-2 opacity-20">
                        {[1, 2, 3].map(i => <div key={i} className="w-[1px] h-full bg-white" />)}
                    </div>

                    {/* Paper Scraps */}
                    <AnimatePresence>
                        {!isEmpty && (
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="absolute inset-x-2 bottom-1 top-6 z-10"
                            >
                                <div className="absolute bottom-1 left-0 w-5 h-5 bg-white/80 rotate-[15deg] rounded-sm shadow-sm" />
                                <div className="absolute bottom-2 right-0 w-4 h-6 bg-[#fef9c3]/80 -rotate-[12deg] rounded-sm shadow-sm" />
                                <div className="absolute bottom-4 left-2 w-6 h-4 bg-[#fee2e2]/80 rotate-[45deg] rounded-sm shadow-sm" />
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-white/60 rotate-[5deg] rounded-sm" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Fill Level Indicator */}
                    <motion.div
                        animate={{
                            height: isOver ? "85%" : isEmpty ? "0%" : "30%",
                            backgroundColor: isOver
                                ? "rgba(59, 130, 246, 0.2)"
                                : justSwallowed
                                    ? "rgba(34, 197, 94, 0.15)"
                                    : "rgba(255, 255, 255, 0.05)"
                        }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="absolute bottom-0 left-0 w-full z-0"
                    />
                </motion.div>
            </div>

            {/* Label */}
            <div className="mt-5 flex flex-col items-center">
                <motion.span
                    animate={{
                        scale: justSwallowed ? 1.1 : 1,
                        color: justSwallowed ? "rgb(34, 197, 94)" : undefined,
                    }}
                    className={cn(
                        "text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500",
                        isOver ? "text-primary-600 scale-105" : isGasping ? "text-accent-600" : !isEmpty ? "text-surface-600 font-bold" : "text-surface-400"
                    )}
                >
                    {justSwallowed ? "Swallowed!" : isOver ? "Release to Finish" : isGasping ? "Getting close..." : !isEmpty ? "Files Inside" : "Empty Bin"}
                </motion.span>
                <p className="text-[9px] text-surface-400 font-bold uppercase tracking-tighter mt-1 opacity-40">
                    {isOver ? "Dropping into glass..." : !isEmpty ? "Historical records stored" : "Throw tasks here"}
                </p>
            </div>
        </div>
    );
}
