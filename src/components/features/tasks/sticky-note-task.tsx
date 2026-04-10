'use client';

import { motion, useMotionValue } from 'framer-motion';
import { useState } from 'react';
import { Clock, Trash2, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Task {
    id: string;
    title: string;
    priority: 'HOT' | 'WARM' | 'COLD';
    status: 'PENDING' | 'UNDER_REVIEW' | 'REGISTERED';
    due: string;
    type: string;
    description: string;
    link: string;
    isCompleted?: boolean;
}

interface StickyNoteTaskProps {
    task: Task;
    onDragEnd?: (taskId: string, point: { x: number; y: number }) => void;
    onDrag?: (point: { x: number; y: number }, taskId: string) => void;
    isCrumpled?: boolean;
    isSelected?: boolean;
    onToggleSelection?: (taskId: string) => void;
    onDelete?: (taskId: string) => void;
}

export function StickyNoteTask({
    task,
    onDragEnd,
    onDrag,
    isCrumpled = false,
    isSelected = false,
    onToggleSelection,
    onDelete
}: StickyNoteTaskProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [baseRotation] = useState(() => Math.random() * 6 - 3);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const priorityColors = {
        HOT: 'bg-danger-50 dark:bg-danger-500/20 border-danger-100 dark:border-danger-500/30 text-danger-900 dark:text-danger-200 shadow-danger-500/10',
        WARM: 'bg-accent-50 dark:bg-accent-500/20 border-accent-100 dark:border-accent-500/30 text-accent-900 dark:text-accent-200 shadow-accent-500/10',
        COLD: 'bg-primary-50 dark:bg-primary-500/20 border-primary-100 dark:border-primary-500/30 text-primary-900 dark:text-primary-200 shadow-primary-500/10',
    };

    const stickyColors = {
        HOT: 'bg-[#fee2e2] dark:bg-red-950/80 border border-transparent dark:border-red-900/50',
        WARM: 'bg-[#fef9c3] dark:bg-yellow-950/80 border border-transparent dark:border-yellow-900/50',
        COLD: 'bg-[#dcfce7] dark:bg-green-950/80 border border-transparent dark:border-green-900/50',
    };

    return (
        <motion.div
            drag
            dragMomentum={false}
            dragElastic={0}
            dragSnapToOrigin={false}
            style={{ x, y }}
            onDragStart={() => {
                setIsDragging(true);
            }}
            onDrag={(_event, info) => {
                onDrag?.(info.point, task.id);
            }}
            onDragEnd={(_event, info) => {
                setIsDragging(false);
                onDragEnd?.(task.id, info.point);
                // Only reset position if not deleted (will be handled by parent)
                setTimeout(() => {
                    if (!isCrumpled) {
                        x.set(0);
                        y.set(0);
                    }
                }, 100);
            }}
            initial={{ scale: 0.9, rotate: baseRotation, x: 0, y: 0 }}
            animate={{
                opacity: isCrumpled ? 0 : 1,
                scale: isCrumpled ? 0 : 1,
                rotate: isCrumpled ? 360 : isDragging ? 0 : baseRotation,
                borderRadius: isCrumpled ? "100%" : "2px",
                filter: isCrumpled ? "blur(4px)" : "blur(0px)",
                boxShadow: isCrumpled
                    ? "0 0px 0px rgba(0,0,0,0)"
                    : isDragging
                        ? "0 25px 50px rgba(0,0,0,0.25), 0 10px 20px rgba(0,0,0,0.15)"
                        : "5px 5px 15px rgba(0,0,0,0.08)"
            }}
            whileHover={{
                scale: isCrumpled ? 0.4 : isDragging ? 1.15 : 1.03,
                boxShadow: isCrumpled
                    ? "0 10px 25px rgba(0,0,0,0.2)"
                    : "8px 8px 25px rgba(0,0,0,0.14)",
                y: isCrumpled ? 0 : isDragging ? 0 : -3
            }}
            whileDrag={{
                scale: 1.15,
                zIndex: 1000,
                cursor: 'grabbing',
                rotate: typeof baseRotation === 'number' ? baseRotation + 5 : 5,
            }}
            transition={{
                scale: { 
                    type: "spring", 
                    stiffness: isCrumpled ? 150 : 350, 
                    damping: isCrumpled ? 15 : 25 
                },
                rotate: { duration: 0.3, ease: "easeOut" },
                opacity: { duration: 0.3 },
                layout: { 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 25 
                },
                x: { type: "spring", stiffness: 300, damping: 30 },
                y: { type: "spring", stiffness: 300, damping: 30 }
            }}
            layout
            layoutId={`sticky-${task.id}`}
            className={cn(
                "relative w-full aspect-square max-w-[200px] cursor-grab active:cursor-grabbing select-none group",
                stickyColors[task.priority],
                "shadow-[inset_0_0_40px_rgba(0,0,0,0.02)]",
                isSelected && "ring-2 ring-primary-500 ring-offset-4 ring-offset-surface-50",
                isDragging && "z-50"
            )}
        >
            {/* Tape Effect */}
            {!isCrumpled && (
                <div className={cn(
                    "absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-4 bg-white/30 dark:bg-white/10 backdrop-blur-md border border-white/20 dark:border-white/5 shadow-sm z-30 transition-all",
                    isSelected && "bg-primary-500/40 border-primary-500/50"
                )} />
            )}

            {/* Drag handle indicator */}
            <div className={cn(
                "absolute top-2 right-2 text-black/10 dark:text-white/10 transition-all duration-200",
                "group-hover:text-black/25 dark:group-hover:text-white/25",
                isDragging && "text-black/40 dark:text-white/40"
            )}>
                <GripVertical size={14} />
            </div>

            <div className="p-5 flex flex-col justify-between h-full relative z-10">
                <div className="space-y-2">
                    <div className="flex items-start justify-between">
                        <span className={cn(
                            "text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border",
                            priorityColors[task.priority]
                        )}>
                            {task.priority === 'HOT' ? 'Urgent' : task.priority}
                        </span>
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete?.(task.id); }}
                            className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors text-black/40 dark:text-white/40 opacity-0 group-hover:opacity-100"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>

                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
                        {task.title}
                    </h4>

                    <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                        {task.description}
                    </p>
                </div>

                <div className="pt-3 border-t border-black/5 dark:border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[9px] font-bold text-black/40 dark:text-white/40 uppercase">
                        <Clock size={10} />
                        {task.due}
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggleSelection?.(task.id); }}
                        className={cn(
                            "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest transition-all",
                            isSelected ? "bg-primary-600 text-white" : "bg-black/5 dark:bg-white/10 text-black/40 dark:text-white/40 hover:bg-black/10 dark:hover:bg-white/20"
                        )}
                    >
                        {isSelected ? '✓' : 'Mark'}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
