'use client';

import { Building2 } from 'lucide-react';
import { useLiveMetric } from '@/hooks/super-admin/useLiveMetric';
import { SkeletonLoader } from '@/components/super-admin/SkeletonLoader';

interface TopTenantData {
  data: {
    rank: number;
    name: string;
    policyCount: number;
    percentOfTotal: number;
  }[];
}

export function TopTenantsTable() {
  const { data: response, loading } = useLiveMetric<TopTenantData>('/platform-admin/overview/top-tenants', 60_000);
  const tenants = response?.data ?? [];

  return (
    <div 
      className="p-5 flex flex-col sa-card-hover"
      style={{
        backgroundColor: 'var(--sa-bg-card)',
        border: '1px solid var(--sa-border)',
        borderRadius: 'var(--sa-radius-md)',
        height: '100%',
        minHeight: 380,
        boxShadow: 'var(--sa-shadow-card)',
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-bold font-serif text-[var(--sa-text-primary)] mb-1">Top Performing Tenants</h3>
          <p className="text-xs text-[var(--sa-text-muted)]">By active policy volume</p>
        </div>
        <Building2 size={24} className="text-[#1D9E75] opacity-20" />
      </div>

      <div className="flex-1 overflow-x-auto text-sm">
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <SkeletonLoader key={i} className="w-full h-10 rounded" />
            ))}
          </div>
        ) : tenants.length === 0 ? (
          <div className="flex items-center justify-center h-full text-[var(--sa-text-muted)] text-sm">
            No tenant data available yet.
          </div>
        ) : (
          <table className="w-full text-left font-sans">
            <thead>
              <tr className="border-b border-[var(--sa-border)] text-[var(--sa-text-muted)] text-[10px] uppercase font-bold tracking-widest">
                <th className="pb-3 pr-4 font-bold">Tenant Name</th>
                <th className="pb-3 px-4 font-bold text-right">Policies</th>
                <th className="pb-3 pl-4 font-bold text-right">Share</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((t, idx) => (
                <tr 
                  key={idx} 
                  className="border-b border-[var(--sa-border)] hover:bg-[var(--sa-bg-card-alt)] transition-colors sa-reveal"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <td className="py-3 pr-4 whitespace-nowrap">
                    <div className="font-semibold text-[var(--sa-text-primary)]">{t.name}</div>
                    <div className="w-full bg-[var(--sa-border)] h-1.5 mt-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#1D9E75] h-full transition-all duration-700" 
                        style={{ width: `${Math.min(t.percentOfTotal, 100)}%` }}
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-right text-[var(--sa-text-primary)]">
                    {t.policyCount.toLocaleString()}
                  </td>
                  <td className="py-3 pl-4 font-mono text-right text-[#0f6e56]">
                    {t.percentOfTotal}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
