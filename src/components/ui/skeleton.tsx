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
        <div className="bg-white dark:bg-slate-900 rounded-[var(--radius-lg)] border border-surface-200 dark:border-slate-700 p-6 space-y-4">
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
        <div className="bg-white dark:bg-slate-900 rounded-[var(--radius-lg)] border border-surface-200 dark:border-slate-700 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-4 p-4 border-b border-surface-200 dark:border-slate-700 bg-surface-50 dark:bg-slate-800">
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

export function SkeletonStatCards({ count = 4 }: { count?: number }) {
    return (
        <div className={cn('grid gap-4', count === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4')}>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 rounded-xl border border-surface-200 p-6 flex items-center gap-4">
                    <Skeleton className="w-12 h-12 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-3 w-1/2" />
                        <Skeleton className="h-6 w-1/3" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function SkeletonListPage() {
    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-7 w-40" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-9 w-28 rounded-lg" />
            </div>
            {/* Stat cards */}
            <SkeletonStatCards count={4} />
            {/* Filter bar */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-surface-200 p-4">
                <div className="flex gap-3">
                    <Skeleton className="h-9 flex-1 max-w-xs rounded-lg" />
                    <Skeleton className="h-9 w-32 rounded-lg" />
                    <Skeleton className="h-9 w-32 rounded-lg" />
                </div>
            </div>
            {/* Table */}
            <SkeletonTable rows={8} />
        </div>
    );
}

export function SkeletonDetailPage({ tabs = 4 }: { tabs?: number }) {
    return (
        <div className="space-y-6">
            {/* Back + header */}
            <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Skeleton className="w-16 h-16 rounded-full shrink-0" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-52" />
                        <Skeleton className="h-4 w-36" />
                        <div className="flex gap-2 mt-1">
                            <Skeleton className="h-5 w-16 rounded-full" />
                            <Skeleton className="h-5 w-20 rounded-full" />
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-9 w-24 rounded-lg" />
                    <Skeleton className="h-9 w-24 rounded-lg" />
                </div>
            </div>
            {/* Stat cards */}
            <SkeletonStatCards count={4} />
            {/* Tabs */}
            <div className="flex gap-1 border-b border-surface-200 pb-0">
                {Array.from({ length: tabs }).map((_, i) => (
                    <Skeleton key={i} className="h-9 w-24 rounded-t-lg" />
                ))}
            </div>
            {/* Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-4">
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
                <div className="space-y-4">
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            </div>
        </div>
    );
}

export function SkeletonCarrierDetail() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
            {/* Hero */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-surface-200 p-6">
                <div className="flex items-center gap-5">
                    <Skeleton className="w-20 h-20 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-3">
                        <Skeleton className="h-7 w-72" />
                        <Skeleton className="h-4 w-44" />
                        <div className="flex gap-3">
                            <Skeleton className="h-8 w-24 rounded-lg" />
                            <Skeleton className="h-8 w-24 rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>
            <SkeletonStatCards count={4} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-4">
                    <SkeletonCard />
                    <SkeletonTable rows={6} />
                </div>
                <div className="space-y-4">
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            </div>
        </div>
    );
}
