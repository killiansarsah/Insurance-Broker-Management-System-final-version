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

const mockData = [
  { month: 'Jan', total: 65, active: 58 },
  { month: 'Feb', total: 78, active: 68 },
  { month: 'Mar', total: 85, active: 79 },
  { month: 'Apr', total: 95, active: 88 },
  { month: 'May', total: 104, active: 94 },
  { month: 'Jun', total: 112, active: 102 },
  { month: 'Jul', total: 120, active: 110 },
  { month: 'Aug', total: 132, active: 118 },
  { month: 'Sep', total: 135, active: 124 },
  { month: 'Oct', total: 138, active: 130 },
  { month: 'Nov', total: 140, active: 135 },
  { month: 'Dec', total: 142, active: 138 },
];

export function TenantGrowthChart() {
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
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
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
              stroke="#0ea5e9" /* Vivid Cyan */
              strokeWidth={2}
              dot={{ r: 3, fill: '#0ea5e9', strokeWidth: 0 }}
              activeDot={{ r: 6, strokeWidth: 0, fill: '#bae6fd' }}
              animationDuration={1500}
            />
            <Line 
              type="monotone" 
              dataKey="active" 
              name="Active / Paying"
              stroke="#10b981" /* Emerald */
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: '#10b981', strokeWidth: 0, stroke: '#6ee7b7' }}
              animationDuration={1500}
              animationBegin={300}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
