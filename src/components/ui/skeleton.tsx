import { cn } from '@/lib/utils';

interface SkeletonProps {
    className?: string;
    lines?: number;
}

export function Skeleton({ className }: SkeletonProps) {
    return <div className={cn('skeleton h-4 w-full', className)} />;
}

export function SkeletonCard() {
    return (
        <div className="bg-white rounded-[var(--radius-lg)] border border-surface-200 p-6 space-y-4">
            <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
                </div>
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
            <Skeleton className="h-3 w-2/3" />
        </div>
    );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
    return (
        <div className="bg-white rounded-[var(--radius-lg)] border border-surface-200 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-4 p-4 border-b border-surface-200 bg-surface-50">
                <Skeleton className="h-4 w-1/6" />
                <Skeleton className="h-4 w-1/5" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/6" />
                <Skeleton className="h-4 w-1/8" />
            </div>
            {/* Rows */}
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border-b border-surface-100">
                    <Skeleton className="h-4 w-1/6" />
                    <Skeleton className="h-4 w-1/5" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/6" />
                    <Skeleton className="h-4 w-1/8" />
                </div>
            ))}
        </div>
    );
}
