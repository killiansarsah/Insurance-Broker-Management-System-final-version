'use client';

import { useState, createContext, useContext } from 'react';
import { cn } from '@/lib/utils';

const TabsContext = createContext<{ value: string; onValueChange: (v: string) => void }>({ value: '', onValueChange: () => {} });

interface TabsProps {
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    children: React.ReactNode;
    className?: string;
}

export function Tabs({ defaultValue = '', value, onValueChange, children, className }: TabsProps) {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const currentValue = value ?? internalValue;
    const handleChange = onValueChange ?? setInternalValue;

    return (
        <TabsContext.Provider value={{ value: currentValue, onValueChange: handleChange }}>
            <div className={cn('w-full', className)}>{children}</div>
        </TabsContext.Provider>
    );
}

interface TabsListProps {
    children: React.ReactNode;
    className?: string;
}

export function TabsList({ children, className }: TabsListProps) {
    return (
        <div
            role="tablist"
            className={cn(
                'inline-flex h-10 items-center justify-center rounded-lg bg-surface-100 dark:bg-slate-800 p-1 text-surface-500',
                className
            )}
        >
            {children}
        </div>
    );
}

interface TabsTriggerProps {
    value: string;
    children: React.ReactNode;
    className?: string;
}

export function TabsTrigger({ value, children, className }: TabsTriggerProps) {
    const ctx = useContext(TabsContext);
    const isActive = ctx.value === value;

    return (
        <button
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => ctx.onValueChange(value)}
            className={cn(
                'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-white transition-all',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                'disabled:pointer-events-none disabled:opacity-50',
                isActive
                    ? 'bg-white dark:bg-slate-900 text-surface-900 dark:text-white shadow-sm'
                    : 'text-surface-500 dark:text-slate-400 hover:text-surface-900 dark:hover:text-white',
                className
            )}
        >
            {children}
        </button>
    );
}

interface TabsContentProps {
    value: string;
    children: React.ReactNode;
    className?: string;
}

export function TabsContent({ value, children, className }: TabsContentProps) {
    const ctx = useContext(TabsContext);
    if (ctx.value !== value) return null;

    return (
        <div role="tabpanel" className={cn('mt-2 ring-offset-white focus-visible:outline-none', className)}>
            {children}
        </div>
    );
}
