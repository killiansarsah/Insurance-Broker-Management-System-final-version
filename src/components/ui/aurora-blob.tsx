'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function AuroraBlob({ color, size, x, y, index }: { color: string, size: string, x: number, y: number, index: number }) {
    // Deterministic duration to satisfy purity requirements
    const duration = 12 + (index * 2.5);
    const delay = index * 2;

    return (
        <motion.div
            initial={{ x, y, opacity: 0 }}
            animate={{
                x: [x - 60, x + 60, x - 60],
                y: [y - 60, y + 60, y - 60],
                opacity: [0.2, 0.4, 0.2],
                scale: [1, 1.15, 1],
            }}
            transition={{
                duration,
                repeat: Infinity,
                delay,
                ease: "easeInOut"
            }}
            className={cn("absolute rounded-full blur-[120px]", color, size)}
        />
    );
}
