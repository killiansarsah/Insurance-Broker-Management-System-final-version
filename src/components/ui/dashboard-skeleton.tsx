import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in mb-12">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48 mt-2" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-24 rounded-full" />
            <Skeleton className="h-9 w-24 rounded-full" />
          </div>
        </div>
        
        {/* Filters Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <Skeleton className="h-9 w-32 rounded-full" />
          <div className="inline-flex items-center gap-1 p-1 rounded-full">
            <Skeleton className="h-9 w-20 rounded-full" />
            <Skeleton className="h-9 w-20 rounded-full" />
            <Skeleton className="h-9 w-20 rounded-full" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-9 w-32 rounded-full" />
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-xl border border-surface-200 p-6">
            <div className="flex items-start justify-between">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <Skeleton className="h-6 w-12 rounded-full" />
            </div>
            <div className="mt-3 space-y-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-xl border border-surface-200 overflow-hidden">
            <div className="p-6 pb-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3 w-48 mt-1" />
            </div>
            <div className="px-4 pb-4">
              <Skeleton className="h-[260px] w-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-xl border border-surface-200 p-4 text-center">
            <Skeleton className="w-10 h-10 rounded-full mx-auto" />
            <Skeleton className="h-4 w-20 mx-auto mt-2" />
          </div>
        ))}
      </div>

      {/* Two Column Cards Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-xl border border-surface-200 overflow-hidden">
            <div className="p-6 pb-4">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3 w-56 mt-1" />
            </div>
            <div className="px-6 pb-6 space-y-3">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
