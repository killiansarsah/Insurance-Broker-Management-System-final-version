'use client';

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';

export function ApiVolumeChart() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    apiClient.get<{ apiVolume?: any[] }>('/platform-admin/overview/charts')
      .then((res) => {
        if (res.apiVolume) {
          setData(res.apiVolume);
        }
      })
      .catch(console.error);
  }, []);

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
      <h3 className="text-sm font-bold font-serif text-[var(--sa-text-primary)] mb-1">Infrastructure Load</h3>
      <p className="text-xs text-[var(--sa-text-muted)] mb-6">API request volume past 7 days (Success vs Failed)</p>
      
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--sa-border)" opacity={0.5} />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--sa-text-muted)', fontSize: 11, fontFamily: 'monospace' }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--sa-text-muted)', fontSize: 11, fontFamily: 'monospace' }} 
              tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
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
              formatter={(value: number | undefined) => (value || 0).toLocaleString()}
            />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} iconType="circle" />
            <Area 
              type="monotone" 
              dataKey="success" 
              name="200 OK"
              stroke="#0ea5e9" 
              fillOpacity={1} 
              fill="url(#colorSuccess)" 
              animationDuration={1500}
            />
            <Area 
              type="step" 
              dataKey="failed" 
              name="4xx/5xx Errors"
              stroke="#f43f5e" 
              fillOpacity={1} 
              fill="url(#colorFailed)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
