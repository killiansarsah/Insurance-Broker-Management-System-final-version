'use client';

import { motion, useMotionValue } from 'framer-motion';
import { useState } from 'react';
import { Clock, Trash2, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Task {
    id: string;
    title: string;
    priority: 'hot' | 'warm' | 'cold';
    status: 'pending' | 'under_review' | 'registered';
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
        hot: 'bg-danger-50 border-danger-100 text-danger-900 shadow-danger-500/10',
        warm: 'bg-accent-50 border-accent-100 text-accent-900 shadow-accent-500/10',
        cold: 'bg-primary-50 border-primary-100 text-primary-900 shadow-primary-500/10',
    };

    const stickyColors = {
        hot: 'bg-[#fee2e2]',
        warm: 'bg-[#fef9c3]',
        cold: 'bg-[#dcfce7]',
    };

    return (
        <motion.div
            drag
            dragMomentum={false}
            dragElastic={0}
            dragSnapToOrigin
            style={{ x, y }}
            onDragStart={() => setIsDragging(true)}
            onDrag={(_event, info) => {
                onDrag?.(info.point, task.id);
            }}
            onDragEnd={(_event, info) => {
                setIsDragging(false);
                onDragEnd?.(task.id, info.point);
            }}
            initial={{ opacity: 0, scale: 0.9, rotate: baseRotation }}
            animate={{
                opacity: task.isCompleted ? 0 : 1,
                scale: isCrumpled ? 0.4 : 1,
                rotate: isCrumpled ? [0, 90, 180, 270, 360] : isDragging ? 0 : baseRotation,
                borderRadius: isCrumpled ? "100%" : "2px",
                boxShadow: isCrumpled
                    ? "0 10px 25px rgba(0,0,0,0.2), inset 0 0 10px rgba(0,0,0,0.1)"
                    : isDragging
                        ? "0 25px 50px rgba(0,0,0,0.25), 0 10px 20px rgba(0,0,0,0.15)"
                        : "5px 5px 15px rgba(0,0,0,0.08)"
            }}
            whileHover={{
                scale: isCrumpled ? 0.4 : 1.03,
                boxShadow: isCrumpled
                    ? "0 10px 25px rgba(0,0,0,0.2)"
                    : "8px 8px 25px rgba(0,0,0,0.14)",
                y: isCrumpled ? 0 : -3
            }}
            whileDrag={{
                scale: 1.08,
                zIndex: 100,
                cursor: 'grabbing',
                rotate: 0,
            }}
            transition={{
                type: "spring",
                stiffness: isCrumpled ? 200 : 400,
                damping: isCrumpled ? 15 : 30,
                rotate: { repeat: isCrumpled ? Infinity : 0, duration: 0.5 }
            }}
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
                    "absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-4 bg-white/30 backdrop-blur-md border border-white/20 shadow-sm z-30 transition-all",
                    isSelected && "bg-primary-500/40 border-primary-500/50"
                )} />
            )}

            {/* Drag handle indicator */}
            <div className={cn(
                "absolute top-2 right-2 text-black/10 transition-all duration-200",
                "group-hover:text-black/25",
                isDragging && "text-black/40"
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
                            {task.priority === 'hot' ? 'Urgent' : task.priority}
                        </span>
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete?.(task.id); }}
                            className="p-1 hover:bg-black/5 rounded-md transition-colors text-black/40 opacity-0 group-hover:opacity-100"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>

                    <h4 className="text-sm font-bold text-black/80 leading-tight">
                        {task.title}
                    </h4>

                    <p className="text-[11px] text-black/50 line-clamp-3 leading-relaxed">
                        {task.description}
                    </p>
                </div>

                <div className="pt-3 border-t border-black/5 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[9px] font-bold text-black/40 uppercase">
                        <Clock size={10} />
                        {task.due}
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggleSelection?.(task.id); }}
                        className={cn(
                            "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest transition-all",
                            isSelected ? "bg-primary-600 text-white" : "bg-black/5 text-black/30 hover:bg-black/10"
                        )}
                    >
                        {isSelected ? '✓' : 'Mark'}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
