'use client';

import { motion } from 'framer-motion';
import { Pin, Highlighter, Maximize2, MousePointer2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeskToolbarProps {
    activeTool: 'pointer' | 'pin' | 'marker' | 'zoom';
    onToolChange: (tool: 'pointer' | 'pin' | 'marker' | 'zoom') => void;
}

export function DeskToolbar({ activeTool, onToolChange }: DeskToolbarProps) {
    const tools = [
        { id: 'pointer', icon: <MousePointer2 size={18} />, label: 'Arrange' },
        { id: 'pin', icon: <Pin size={18} />, label: 'Pin Notes' },
        { id: 'marker', icon: <Highlighter size={18} />, label: 'Highlight' },
        { id: 'zoom', icon: <Maximize2 size={18} />, label: 'Magnify' },
    ] as const;

    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="fixed left-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 p-3 bg-black/40 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-3xl"
        >
            {tools.map((tool) => (
                <button
                    key={tool.id}
                    onClick={() => onToolChange(tool.id)}
                    className={cn(
                        "relative w-12 h-12 flex items-center justify-center rounded-xl transition-all group",
                        activeTool === tool.id
                            ? "bg-primary-600 text-white shadow-lg shadow-primary-500/20"
                            : "text-white/40 hover:text-white/70 hover:bg-white/5"
                    )}
                    title={tool.label}
                >
                    {tool.icon}
                    {activeTool === tool.id && (
                        <motion.div
                            layoutId="active-tool-glow"
                            className="absolute inset-0 rounded-xl bg-primary-500/20 blur-md -z-10"
                        />
                    )}

                    {/* Tooltip */}
                    <div className="absolute left-16 px-3 py-1.5 bg-surface-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-xl border border-white/5">
                        {tool.label}
                    </div>
                </button>
            ))}
        </motion.div>
    );
}
