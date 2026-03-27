'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SelectOption {
    label: string | number;
    value: string | number;
}

interface CustomSelectProps {
    label?: string;
    options: (string | number | SelectOption)[];
    value: string | number | null;
    onChange: (value: string | number | null) => void;
    placeholder?: string;
    className?: string;
    clearable?: boolean;
    icon?: React.ReactNode;
    position?: 'top' | 'bottom';
    align?: 'left' | 'right';
}

export function CustomSelect({
    label,
    options,
    value,
    onChange,
    placeholder = 'Select...',
    className,
    clearable = false,
    icon,
    position = 'bottom',
    align = 'left',
}: CustomSelectProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Normalize options to SelectOption[]
    const normalizedOptions: SelectOption[] = options.map((opt) => {
        if (typeof opt === 'object') return opt;
        return { label: opt, value: opt };
    });

    const selectedOption = normalizedOptions.find((opt) => opt.value === value);

    // Close on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    return (
        <div className={cn('relative inline-block', className)} ref={ref}>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className={cn(
                    'inline-flex items-center justify-between gap-1.5 px-4 py-2.5 text-xs font-medium border rounded-[var(--radius-md)] transition-all cursor-pointer shadow-sm',
                    className?.includes('w-full') ? 'w-full' : '',
                    value !== null && value !== undefined && value !== ''
                        ? 'text-surface-900 dark:text-slate-200 bg-white dark:bg-slate-800 border-primary-200 dark:border-slate-700'
                        : 'text-surface-400 dark:text-slate-500 bg-surface-50 dark:bg-slate-900 border-surface-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 hover:text-surface-600 dark:hover:text-slate-300 hover:border-surface-300 dark:hover:border-slate-700'
                )}
            >
                <div className="flex items-center gap-2 truncate">
                    {icon && <span className="shrink-0 opacity-60">{icon}</span>}
                    {selectedOption ? (
                        <>
                            <span className="truncate">{selectedOption.label}</span>
                        {clearable && (
                            <X
                                size={10}
                                className="text-surface-400 hover:text-danger-500 shrink-0 ml-0.5"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onChange(null);
                                    setOpen(false);
                                }}
                            />
                        )}
                        </>
                    ) : (
                        <span>{label || placeholder}</span>
                    )}
                </div>
                <ChevronDown
                    size={16}
                    className={cn('text-surface-400 dark:text-slate-500 transition-transform duration-300 ml-2 shrink-0', open && 'rotate-180')}
                />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: position === 'top' ? -10 : 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: position === 'top' ? -10 : 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className={cn(
                            'absolute min-w-[140px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-surface-200/50 dark:border-slate-700/50 rounded-2xl shadow-2xl z-[100] overflow-hidden',
                            position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2',
                            align === 'right' ? 'right-0' : 'left-0'
                        )}
                    >
                        <div className="py-1 max-h-[300px] overflow-y-auto scrollbar-hide min-h-[40px]">
                            {normalizedOptions.length === 0 ? (
                                <div className="px-4 py-3 text-[11px] font-bold text-surface-400 dark:text-slate-500 italic uppercase tracking-wider text-center">
                                    No options found
                                </div>
                            ) : (
                                normalizedOptions.map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => {
                                            onChange(opt.value);
                                            setOpen(false);
                                        }}
                                        className={cn(
                                            'flex items-center justify-between w-full px-4 py-2.5 text-[11px] font-bold text-left transition-colors cursor-pointer uppercase tracking-tight',
                                            'hover:bg-primary-50/50 dark:hover:bg-slate-800/80',
                                            value === opt.value
                                                ? 'text-primary-600 dark:text-primary-400 bg-primary-50/80 dark:bg-primary-900/30 shadow-inner'
                                                : 'text-surface-600 dark:text-slate-400'
                                        )}
                                    >
                                        <span>{opt.label}</span>
                                        {value === opt.value && <Check size={12} className="text-primary-500" />}
                                    </button>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
