'use client';

import { cn } from '@/lib/utils';

interface SeparatorProps {
    orientation?: 'horizontal' | 'vertical';
    className?: string;
}

export function Separator({ orientation = 'horizontal', className }: SeparatorProps) {
    return (
        <div
            role="separator"
            className={cn(
                'shrink-0 bg-surface-200 dark:bg-slate-700',
                orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
                className
            )}
        />
    );
}
