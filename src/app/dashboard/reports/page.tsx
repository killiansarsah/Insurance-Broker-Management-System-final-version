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
import {
    Download,
    Calendar,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Activity,
    FileText,
    AlertCircle
} from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { monthlyData, portfolioMix, kpistats } from '@/mock/reports';
import { formatCurrency, cn } from '@/lib/utils';
import { toast } from 'sonner';

const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#6b7280'];

interface StatCardProps {
    label: string;
    value: string | number;
    trend: string;
    trendUp: boolean;
    icon: React.ElementType; // Better than any
    color: string;
}

function StatCard({ label, value, trend, trendUp, icon: Icon, color }: StatCardProps) {
    return (
        <Card padding="none" className="p-5 flex items-start justify-between hover:shadow-md transition-shadow">
            <div>
                <p className="text-sm font-semibold text-surface-500 uppercase tracking-wider">{label}</p>
                <h3 className="text-2xl font-bold text-surface-900 mt-1">{value}</h3>
                <div className="flex items-center gap-1 mt-2">
                    <span className={cn(
                        "text-xs font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-1",
                        trendUp ? "bg-success-50 text-success-700" : "bg-danger-50 text-danger-700"
                    )}>
                        {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {trend}
                    </span>
                    <span className="text-xs text-surface-400">vs last month</span>
                </div>
            </div>
            <div className={cn("p-3 rounded-xl", color)}>
                <Icon size={24} className="text-white" />
            </div>
        </Card>
    );
}

export default function ReportsPage() {
    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Reports & Analytics</h1>
                    <p className="text-sm text-surface-500 mt-1">Operational insights and performance metrics.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" leftIcon={<Calendar size={16} />} onClick={() => toast.info('Date Filter', { description: 'Showing reports for the current fiscal year.' })}>This Year</Button>
                    <Button variant="primary" leftIcon={<Download size={16} />} onClick={() => toast.success('Export Started', { description: 'Your analytics report is being generated and will download shortly.' })}>Export Report</Button>
                </div>
            </div>

            {/* KPI Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Total Premium"
                    value={formatCurrency(kpistats.totalPremium)}
                    trend="+12.5%"
                    trendUp={true}
                    icon={DollarSign}
                    color="bg-primary-500"
                />
                <StatCard
                    label="Loss Ratio"
                    value={`${kpistats.claimsRatio}%`}
                    trend="-2.1%"
                    trendUp={true}
                    icon={Activity}
                    color="bg-purple-500"
                />
                <StatCard
                    label="Active Policies"
                    value={kpistats.policyCount}
                    trend="+5.4%"
                    trendUp={true}
                    icon={FileText}
                    color="bg-blue-500"
                />
                <StatCard
                    label="Claims Incurred"
                    value={formatCurrency(kpistats.totalClaims)}
                    trend="+8.2%"
                    trendUp={false}
                    icon={AlertCircle}
                    color="bg-danger-500"
                />
            </div>

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
        </div>
    );
}

// Icons are imported at the top
