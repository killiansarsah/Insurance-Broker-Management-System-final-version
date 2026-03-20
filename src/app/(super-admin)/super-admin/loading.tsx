import { SkeletonLoader } from '@/components/super-admin/SkeletonLoader';

/**
 * Super Admin Full Page Loader.
 * Uses the custom skeleton elements from the Command Centre design system.
 */
export default function SuperAdminLoading() {
  return (
    <div className="flex flex-col gap-6">
      <SkeletonLoader variant="text" width="40%" height={36} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SkeletonLoader variant="card" />
        <SkeletonLoader variant="card" />
        <SkeletonLoader variant="card" />
        <SkeletonLoader variant="card" />
      </div>

      <div className="mt-8">
        <SkeletonLoader variant="table-row" />
        <SkeletonLoader variant="table-row" />
        <SkeletonLoader variant="table-row" />
        <SkeletonLoader variant="table-row" />
        <SkeletonLoader variant="table-row" />
      </div>
    </div>
  );
}
