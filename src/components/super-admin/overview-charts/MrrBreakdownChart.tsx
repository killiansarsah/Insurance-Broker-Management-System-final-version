'use client';

import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

const mockData = [
  { name: 'Enterprise', value: 45000, color: '#f43f5e' }, // Rose/Coral
  { name: 'Professional', value: 28500, color: '#0ea5e9' }, // Cyan/Blue
  { name: 'Starter', value: 11000, color: '#f59e0b' }, // Amber/Gold
];

export function MrrBreakdownChart() {
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
      <h3 className="text-sm font-bold font-serif text-[var(--sa-text-primary)] mb-1">MRR Distribution</h3>
      <p className="text-xs text-[var(--sa-text-muted)] mb-6">Revenue breakdown by subscription tier (GHS)</p>
      
      <div className="flex-1 w-full min-h-0 flex items-center justify-center relative">
        <div className="absolute inset-0 flex items-center justify-center text-center pointer-events-none mt-[-20px]">
          <div>
            <div className="font-mono text-xl font-bold text-[var(--sa-text-primary)]">₵84.5k</div>
            <div className="text-[10px] uppercase font-bold text-[var(--sa-text-muted)] tracking-widest mt-1">Total</div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <Pie
              data={mockData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={105}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
              animationDuration={1500}
              animationBegin={400}
            >
              {mockData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
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
              formatter={(value: number | undefined) => `₵${((value || 0) / 1000).toFixed(1)}k`}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              wrapperStyle={{ fontSize: 12, fontFamily: 'monospace' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
