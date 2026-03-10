'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
    Download,
    Calendar,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Activity,
    FileText,
    AlertCircle,
    Shield
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDashboardReport } from '@/hooks/api/use-reports';
import { formatCurrency, cn } from '@/lib/utils';
import { toast } from 'sonner';
import { generateReportPdf } from '@/lib/generate-report-pdf';

const ReportsCharts = dynamic(
    () => import('@/components/charts/reports-charts').then(m => ({ default: m.ReportsCharts })),
    { ssr: false, loading: () => <div className="grid gap-6"><div className="h-[340px] bg-surface-100 rounded-xl animate-pulse" /><div className="h-[300px] bg-surface-100 rounded-xl animate-pulse" /></div> }
);

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
    const { data: dashboardData } = useDashboardReport();
    const overview = (dashboardData as Record<string, unknown> | undefined)?.overview as Record<string, unknown> | undefined;

    const totalPremium = (overview?.totalPremium as number) ?? 0;
    const claimsRatio = (overview?.claimsRatio as number) ?? 0;
    const policyCount = (overview?.activePolicies as number) ?? 0;
    const totalClaims = (overview?.totalClaims as number) ?? 0;

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
                    <Button variant="primary" leftIcon={<Download size={16} />} onClick={() => {
                        generateReportPdf('Reports & Analytics Summary', [
                            { title: 'Key Metrics', rows: [
                                { label: 'Total Premium', value: formatCurrency(totalPremium) },
                                { label: 'Loss Ratio', value: `${claimsRatio}%` },
                                { label: 'Active Policies', value: String(policyCount) },
                                { label: 'Total Claims', value: String(totalClaims) },
                            ]},
                        ]);
                        toast.success('PDF Generated', { description: 'Print dialog opened — save as PDF.' });
                    }}>Export Report</Button>
                </div>
            </div>

            {/* KPI Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Total Premium"
                    value={formatCurrency(totalPremium)}
                    trend="+12.5%"
                    trendUp={true}
                    icon={DollarSign}
                    color="bg-primary-500"
                />
                <StatCard
                    label="Loss Ratio"
                    value={`${claimsRatio}%`}
                    trend="-2.1%"
                    trendUp={true}
                    icon={Activity}
                    color="bg-purple-500"
                />
                <StatCard
                    label="Active Policies"
                    value={policyCount}
                    trend="+5.4%"
                    trendUp={true}
                    icon={FileText}
                    color="bg-blue-500"
                />
                <StatCard
                    label="Claims Incurred"
                    value={formatCurrency(totalClaims)}
                    trend="+8.2%"
                    trendUp={false}
                    icon={AlertCircle}
                    color="bg-danger-500"
                />
            </div>

            {/* NIC Regulatory Filing */}
            <Link href="/dashboard/reports/nic-quarterly" className="block">
                <Card padding="md" className="flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-primary-500">
                    <div className="p-3 rounded-full bg-primary-50 text-primary-600"><Shield size={20} /></div>
                    <div className="flex-1">
                        <p className="text-sm font-bold text-surface-900">NIC Quarterly Return</p>
                        <p className="text-xs text-surface-500">View and export regulatory filing data for the National Insurance Commission.</p>
                    </div>
                    <span className="text-xs font-semibold text-primary-600 uppercase">View &rarr;</span>
                </Card>
            </Link>

            <ReportsCharts />
        </div>
    );
}

// Icons are imported at the top
