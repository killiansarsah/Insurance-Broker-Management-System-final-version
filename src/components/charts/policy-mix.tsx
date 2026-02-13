'use client';

import {
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from 'recharts';

const data = [
    { name: 'Motor', value: 45, color: '#1976D2' },
    { name: 'Fire', value: 25, color: '#388E3C' },
    { name: 'Health', value: 15, color: '#F57C00' },
    { name: 'Marine', value: 10, color: '#D32F2F' },
    { name: 'Other', value: 5, color: '#64748b' },
];

export function PolicyMix() {
    return (
        <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        animationDuration={1500}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                        ))}
                    </Pie>
                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-white p-2 px-3 rounded-lg shadow-lg border border-surface-200">
                                        <p className="text-sm font-bold" style={{ color: payload[0].payload.color }}>
                                            {payload[0].name}: {payload[0].value}%
                                        </p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        formatter={(value) => (
                            <span className="text-xs font-medium text-surface-600">{value}</span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
