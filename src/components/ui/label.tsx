'use client';

import { cn } from '@/lib/utils';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    children: React.ReactNode;
    className?: string;
}

export function Label({ children, className, ...props }: LabelProps) {
    return (
        <label
            className={cn(
                'text-sm font-medium text-surface-700 dark:text-slate-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                className
            )}
            {...props}
        >
            {children}
        </label>
    );
}
