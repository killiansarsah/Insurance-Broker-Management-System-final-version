'use client';

import { useState, useRef, useEffect, createContext, useContext } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

const SelectContext = createContext<{
    value: string;
    onValueChange: (v: string) => void;
    open: boolean;
    setOpen: (o: boolean) => void;
}>({ value: '', onValueChange: () => {}, open: false, setOpen: () => {} });

interface SelectProps {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    children: React.ReactNode;
}

export function Select({ value, defaultValue = '', onValueChange, children }: SelectProps) {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [open, setOpen] = useState(false);
    const currentValue = value ?? internalValue;
    const handleChange = (v: string) => {
        (onValueChange ?? setInternalValue)(v);
        setOpen(false);
    };

    return (
        <SelectContext.Provider value={{ value: currentValue, onValueChange: handleChange, open, setOpen }}>
            <div className="relative inline-block w-full">{children}</div>
        </SelectContext.Provider>
    );
}

interface SelectTriggerProps {
    children: React.ReactNode;
    className?: string;
}

export function SelectTrigger({ children, className }: SelectTriggerProps) {
    const { open, setOpen } = useContext(SelectContext);
    return (
        <button
            type="button"
            onClick={() => setOpen(!open)}
            className={cn(
                'flex h-10 w-full items-center justify-between rounded-lg border border-surface-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm',
                'ring-offset-white placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-50',
                className
            )}
        >
            {children}
            <ChevronDown size={16} className="ml-2 opacity-50" />
        </button>
    );
}

interface SelectValueProps {
    placeholder?: string;
}

export function SelectValue({ placeholder }: SelectValueProps) {
    const { value } = useContext(SelectContext);
    return <span className={cn(!value && 'text-surface-500')}>{value || placeholder}</span>;
}

interface SelectContentProps {
    children: React.ReactNode;
    className?: string;
}

export function SelectContent({ children, className }: SelectContentProps) {
    const { open, setOpen } = useContext(SelectContext);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        if (open) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open, setOpen]);

    if (!open) return null;

    return (
        <div
            ref={ref}
            className={cn(
                'absolute z-50 mt-1 w-full rounded-lg border border-surface-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg py-1 max-h-60 overflow-auto',
                className
            )}
        >
            {children}
        </div>
    );
}

interface SelectItemProps {
    value: string;
    children: React.ReactNode;
    className?: string;
}

export function SelectItem({ value, children, className }: SelectItemProps) {
    const ctx = useContext(SelectContext);
    return (
        <div
            role="option"
            aria-selected={ctx.value === value}
            onClick={() => ctx.onValueChange(value)}
            className={cn(
                'relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-3 text-sm outline-none',
                'hover:bg-surface-100 dark:hover:bg-slate-800',
                ctx.value === value && 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300',
                className
            )}
        >
            {children}
        </div>
    );
}
