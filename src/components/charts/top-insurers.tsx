'use client';

import {
    Bar,
    BarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
    Cell,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface InsurerData {
    name: string;
    premium: number;
}

const COLORS = ['#1976D2', '#388E3C', '#F57C00', '#D32F2F', '#7B1FA2'];

export function TopInsurers({ data }: { data?: InsurerData[] }) {
    const chartData = data || [
        { name: 'SIC Insurance', premium: 2450000 },
        { name: 'Enterprise Ins.', premium: 1890000 },
        { name: 'Hollard Ins.', premium: 1520000 },
        { name: 'Star Assurance', premium: 1180000 },
        { name: 'Glico General', premium: 850000 },
    ];

    return (
        <div className="h-[300px] min-h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        horizontal={false}
                        stroke="#e2e8f0"
                    />
                    <XAxis
                        type="number"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 11 }}
                        tickFormatter={(value) => `₵${value / 1000000}M`}
                    />
                    <YAxis
                        type="category"
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 11 }}
                        width={110}
                    />
                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-white p-3 rounded-lg shadow-lg border border-surface-200">
                                        <p className="text-xs font-medium text-surface-500 mb-1">
                                            {payload[0].payload.name}
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
                    <Bar
                        dataKey="premium"
                        radius={[0, 6, 6, 0]}
                        animationDuration={1500}
                        barSize={24}
                    >
                        {chartData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.85} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
