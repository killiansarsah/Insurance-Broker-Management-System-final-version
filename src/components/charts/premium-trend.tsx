'use client';

import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

const data = [
    { month: 'Sep', premium: 850000 },
    { month: 'Oct', premium: 920000 },
    { month: 'Nov', premium: 880000 },
    { month: 'Dec', premium: 1150000 },
    { month: 'Jan', premium: 1050000 },
    { month: 'Feb', premium: 1245000 },
];

export function PremiumTrend() {
    return (
        <div className="h-[300px] min-h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorPremium" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#1976D2" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#1976D2" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#e2e8f0"
                    />
                    <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        tickFormatter={(value) => `₵${value / 1000}k`}
                    />
                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-white p-3 rounded-lg shadow-lg border border-surface-200">
                                        <p className="text-xs font-medium text-surface-500 mb-1">
                                            {payload[0].payload.month} 2026
                                        </p>
                                        <p className="text-sm font-bold text-primary-600">
                                            {formatCurrency(payload[0].value as number)}
                                        </p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="premium"
                        stroke="#1976D2"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorPremium)"
                        animationDuration={1500}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
