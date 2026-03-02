'use client';

import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

interface ClaimsRatioGaugeProps {
    ratio: number; // 0-100
    claimsPaid: number;
    premiumReceived: number;
}

export function ClaimsRatioGauge({ ratio, claimsPaid, premiumReceived }: ClaimsRatioGaugeProps) {
    const data = [{ name: 'Claims Ratio', value: ratio, fill: ratio > 70 ? '#D32F2F' : ratio > 50 ? '#F57C00' : '#388E3C' }];
    const healthLabel = ratio > 70 ? 'High Risk' : ratio > 50 ? 'Moderate' : 'Healthy';
    const healthColor = ratio > 70 ? 'text-danger-600' : ratio > 50 ? 'text-warning-600' : 'text-success-600';

    return (
        <div className="flex flex-col items-center justify-center h-[300px] min-h-[300px] w-full mt-4 relative">
            <ResponsiveContainer width="100%" height={210} debounce={50}>
                <RadialBarChart
                    cx="50%"
                    cy="55%"
                    innerRadius="70%"
                    outerRadius="100%"
                    startAngle={180}
                    endAngle={0}
                    barSize={18}
                    data={data}
                >
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar
                        dataKey="value"
                        cornerRadius={12}
                        background={{ fill: '#f1f5f9' }}
                        animationDuration={1500}
                    />
                </RadialBarChart>
            </ResponsiveContainer>

            {/* Center Label */}
            <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="text-3xl font-black text-surface-900 tracking-tight">{ratio.toFixed(1)}%</p>
                <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${healthColor}`}>{healthLabel}</p>
            </div>

            {/* Bottom Legend */}
            <div className="flex items-center justify-center gap-6 -mt-8">
                <div className="text-center">
                    <p className="text-[10px] text-surface-400 font-bold uppercase tracking-wider">Claims Paid</p>
                    <p className="text-sm font-bold text-surface-900">₵{(claimsPaid / 1000).toFixed(0)}k</p>
                </div>
                <div className="w-px h-8 bg-surface-200" />
                <div className="text-center">
                    <p className="text-[10px] text-surface-400 font-bold uppercase tracking-wider">Premium Recv.</p>
                    <p className="text-sm font-bold text-surface-900">₵{(premiumReceived / 1000).toFixed(0)}k</p>
                </div>
            </div>
        </div>
    );
}
