'use client';

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const mockData = [
  { month: 'Jan', revenue: 72000 },
  { month: 'Feb', revenue: 74500 },
  { month: 'Mar', revenue: 78000 },
  { month: 'Apr', revenue: 81000 },
  { month: 'May', revenue: 79500 },
  { month: 'Jun', revenue: 84000 },
  { month: 'Jul', revenue: 88500 },
  { month: 'Aug', revenue: 92000 },
  { month: 'Sep', revenue: 95500 },
  { month: 'Oct', revenue: 99000 },
  { month: 'Nov', revenue: 104000 },
  { month: 'Dec', revenue: 110500 },
];

export function RevenueTrendChart() {
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
      <h3 className="text-sm font-bold font-serif text-[var(--sa-text-primary)] mb-1">Fiscal Momentum</h3>
      <p className="text-xs text-[var(--sa-text-muted)] mb-6">Total monthly MRR (GHS) aggregated past 12 months</p>
      
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }} barSize={32}>
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
              tickFormatter={(value) => `₵${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              cursor={{ fill: 'var(--sa-border)', opacity: 0.2 }}
              contentStyle={{ 
                backgroundColor: 'var(--sa-bg-card-alt)', 
                border: '1px solid var(--sa-border-focus)',
                borderRadius: '8px',
                color: 'var(--sa-text-primary)',
                fontSize: 12,
                fontFamily: 'monospace',
                boxShadow: 'var(--sa-shadow-hover)'
              }}
              formatter={(value: number | undefined) => [`₵${(value || 0).toLocaleString()}`, 'Revenue']}
            />
            <Bar 
              dataKey="revenue" 
              radius={[6, 6, 0, 0]}
              animationDuration={1200}
              animationBegin={200}
            >
              {mockData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index === mockData.length - 1 ? '#f59e0b' : '#fbbf24'} 
                  opacity={index === mockData.length - 1 ? 1 : 0.7}
                  style={{ transition: 'all 0.3s ease' }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
