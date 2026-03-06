'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line
} from 'recharts';
import { Card, CardHeader } from '@/components/ui/card';
import { monthlyData, portfolioMix } from '@/hooks/api';

export function ReportsCharts() {
    return (
        <>
            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Premium Trend */}
                <Card padding="lg" className="lg:col-span-2">
                    <CardHeader title="Premium Written vs Claims Incurred" />
                    <div className="h-[300px] min-h-[300px] mt-4 w-full">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                            <BarChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(value) => `${value / 1000}k`} />
                                <Tooltip
                                    cursor={{ fill: '#f3f4f6' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend />
                                <Bar dataKey="premium" name="Premium" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                                <Bar dataKey="claims" name="Claims" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Portfolio Mix */}
                <Card padding="lg">
                    <CardHeader title="Portfolio Mix" />
                    <div className="h-[300px] min-h-[300px] mt-4 w-full relative">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                            <PieChart>
                                <Pie
                                    data={portfolioMix}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {portfolioMix.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                            <div className="text-center">
                                <p className="text-xs text-surface-500">Total</p>
                                <p className="text-xl font-bold text-surface-900">100%</p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                <Card padding="lg">
                    <CardHeader title="Monthly Sales Trends" />
                    <div className="h-[250px] min-h-[250px] mt-4 w-full">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                            <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                <Tooltip />
                                <Line type="monotone" dataKey="sales" name="Policies Sold" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </>
    );
}
