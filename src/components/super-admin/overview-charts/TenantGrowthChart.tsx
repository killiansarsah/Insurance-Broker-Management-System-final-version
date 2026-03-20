'use client';

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useLiveMetric } from '@/hooks/super-admin/useLiveMetric';
import { SkeletonLoader } from '@/components/super-admin/SkeletonLoader';

interface ChartData {
  data: {
    tenantGrowth: { month: string; total: number; active: number }[];
    monthlyRevenue: { month: string; revenue: number }[];
    mrrByPlan: { plan: string; mrr: number; count: number }[];
  };
}

export function TenantGrowthChart() {
  const { data: chartsResponse, loading } = useLiveMetric<ChartData>('/platform-admin/overview/charts', 60_000);
  const chartData = chartsResponse?.data?.tenantGrowth ?? [];

  return (
    <div 
      className="p-5 flex flex-col sa-card-hover"
      style={{
        backgroundColor: 'var(--sa-bg-card)',
        border: '1px solid var(--sa-border)',
        borderRadius: 'var(--sa-radius-md)',
        height: 380,
        boxShadow: 'var(--sa-shadow-card)'
      }}
    >
      <h3 className="text-sm font-bold font-serif text-[var(--sa-text-primary)] mb-1">Tenant Acquisition Velocity</h3>
      <p className="text-xs text-[var(--sa-text-muted)] mb-6">Total vs Active tenants trailing 12 months</p>
      
      <div className="flex-1 w-full min-h-0">
        {loading ? (
          <SkeletonLoader className="w-full h-full rounded-md" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--sa-border)" opacity={0.5} />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--sa-text-muted)', fontSize: 11, fontFamily: 'monospace' }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--sa-text-muted)', fontSize: 11, fontFamily: 'monospace' }} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--sa-bg-card-alt)', 
                  border: '1px solid var(--sa-border-focus)',
                  borderRadius: '8px',
                  color: 'var(--sa-text-primary)',
                  fontSize: 12,
                  fontFamily: 'monospace',
                  boxShadow: 'var(--sa-shadow-hover)'
                }}
                itemStyle={{ color: 'var(--sa-text-primary)' }}
              />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} iconType="circle" />
              <Line 
                type="monotone" 
                dataKey="total" 
                name="Total Provisioned"
                stroke="#0ea5e9"
                strokeWidth={2}
                dot={{ r: 3, fill: '#0ea5e9', strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 0, fill: '#bae6fd' }}
                animationDuration={1500}
              />
              <Line 
                type="monotone" 
                dataKey="active" 
                name="Active / Paying"
                stroke="#10b981"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: '#10b981', strokeWidth: 0, stroke: '#6ee7b7' }}
                animationDuration={1500}
                animationBegin={300}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
