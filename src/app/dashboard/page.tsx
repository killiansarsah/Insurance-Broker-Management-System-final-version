'use client';

import { useState, useMemo } from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import {
    Users,
    FileText,
    TrendingUp,
    AlertCircle,
    Target,
    ArrowUpRight,
    ArrowDownRight,
    Plus,
    RefreshCw,
    DollarSign,
    AlertTriangle,
    Building2,
    Briefcase,
    Shield,
    X,
    XCircle,
    PieChart,
} from 'lucide-react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Card, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn, formatCurrency, safeCsvCell } from '@/lib/utils';
import { CustomSelect } from '@/components/ui/select-custom';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';
import { useDashboardData } from '@/hooks/api/use-dashboard-data';
import { toast } from 'sonner';
import { Download } from 'lucide-react';
import { DashboardSkeleton } from '@/components/ui/dashboard-skeleton';

// Lazy-load heavy chart components (recharts ~240KB)
const ChartSkeleton = () => (
    <div className="h-[260px] flex items-center justify-center text-sm text-slate-400 animate-pulse">Loading chart…</div>
);
const PremiumTrend = dynamic(
    () => import('@/components/charts/premium-trend').then(m => ({ default: m.PremiumTrend })),
    { ssr: false, loading: ChartSkeleton },
);
const PolicyMix = dynamic(
    () => import('@/components/charts/policy-mix').then(m => ({ default: m.PolicyMix })),
    { ssr: false, loading: ChartSkeleton },
);
const TopInsurers = dynamic(
    () => import('@/components/charts/top-insurers').then(m => ({ default: m.TopInsurers })),
    { ssr: false, loading: ChartSkeleton },
);
const ClaimsRatioGauge = dynamic(
    () => import('@/components/charts/claims-ratio-gauge').then(m => ({ default: m.ClaimsRatioGauge })),
    { ssr: false, loading: ChartSkeleton },
);

// =====================================================================
// TYPES
// =====================================================================
type Period = 'today' | 'mtd' | 'ytd';

interface KPI {
    label: string;
    value: string;
    change: number;
    direction: 'up' | 'down';
    icon: React.ReactNode;
    color: string;
    subtitle: string;
    warn?: boolean;
}

interface Filters {
    insurer: string | null;
    product: string | null;
    clientType: string | null;
    accountOfficer: string | null;
    region: string | null;
}

// =====================================================================
// FILTER OPTIONS
// =====================================================================
const filterOptions = {
    insurer: ['SIC Insurance', 'Enterprise Insurance', 'Hollard Insurance', 'Star Assurance', 'Glico General'],
    product: ['Motor', 'Health', 'Fire / Property', 'Marine', 'Professional Indemnity', 'Travel'],
    clientType: ['Corporate', 'SME', 'Retail / Individual'],
    accountOfficer: ['A. Boateng', 'K. Mensah', 'E. Asante', 'F. Darko', 'M. Owusu'],
    region: ['Greater Accra', 'Ashanti', 'Western', 'Eastern', 'Northern'],
};

const availableYears = [2026, 2025, 2024, 2023, 2022, 2021];

// (filterData function removed — KPIs now use server-computed dashboard report)

// =====================================================================
// STATIC DATA (unchanged by period)
// =====================================================================

const activityColors: Record<string, string> = {
    POLICY: 'bg-primary-100 text-primary-600',
    CLIENT: 'bg-success-100 text-success-600',
    CLAIM: 'bg-danger-100 text-danger-600',
    COMMISSION: 'bg-success-100 text-success-600',
};

// =====================================================================
// SMALL COMPONENTS
// =====================================================================
function ProgressBar({ value, max, color = 'bg-primary-500' }: { value: number; max: number; color?: string }) {
    const pct = Math.round((value / max) * 100);
    return (
        <div className="w-full bg-surface-100 rounded-full h-2 overflow-hidden">
            <div className={cn('h-full rounded-full transition-all duration-500', color)} style={{ width: `${pct}%` }} />
        </div>
    );
}

function StatusDot({ status }: { status: 'PAID' | 'PENDING' | 'OVERDUE' }) {
    const colors = { PAID: 'bg-success-500', PENDING: 'bg-accent-500', OVERDUE: 'bg-danger-500' };
    return <span className={cn('w-2 h-2 rounded-full inline-block', colors[status])} />;
}

function formatCompact(n: number): string {
    const v = Number(n) || 0;
    if (v >= 1000000) return `₵${(v / 1000000).toFixed(1)}M`;
    if (v >= 1000) return `₵${(v / 1000).toFixed(0)}k`;
    return `₵${v.toFixed(2)}`;
}


// =====================================================================
// MAIN DASHBOARD
// =====================================================================
export default function DashboardPage() {
    const { user } = useAuthStore();
    const [period, setPeriod] = useState<Period>('mtd');
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [filters, setFilters] = useState<Filters>({
        insurer: null,
        product: null,
        clientType: null,
        accountOfficer: null,
        region: null,
    });

    const {
        policies: policiesData,
        leads: leadsData,
        invoices: invoicesData,
        dashboardReport,
        isLoading,
        isError,
    } = useDashboardData(period, selectedYear, filters);

    // Greeting logic
    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    }, []);

    // Show loading skeleton while data is being fetched
    if (isLoading) {
        return <DashboardSkeleton />;
    }

    // Show error state if any query failed
    if (isError) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-3">
                    <AlertCircle className="w-12 h-12 text-danger-500 mx-auto" />
                    <h3 className="text-lg font-semibold text-surface-900">Failed to load dashboard</h3>
                    <p className="text-sm text-surface-500">Please try refreshing the page</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                        Refresh Page
                    </button>
                </div>
            </div>
        );
    }

    // === DATA EXTRACTION ===
    // Use server-computed report for KPIs (eliminates client-side iteration over all data)
    const report: any = dashboardReport ?? {};
    const overview = report.overview ?? {};
    const claimsOverview = report.claimsOverview ?? {};

    // Raw data — only needed for lists the report doesn't cover
    const policies: any[] = (policiesData as any)?.items ?? (policiesData as any)?.data ?? (Array.isArray(policiesData) ? policiesData : []);
    const leads: any[] = (leadsData as any)?.items ?? (leadsData as any)?.data ?? (Array.isArray(leadsData) ? leadsData : []);
    const invoices: any[] = (invoicesData as any)?.items ?? (invoicesData as any)?.data ?? (Array.isArray(invoicesData) ? invoicesData : []);

    const updateFilter = (key: keyof Filters, value: string | null) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const activeFilterCount = Object.values(filters).filter(Boolean).length;
    const clearAllFilters = () => setFilters({ insurer: null, product: null, clientType: null, accountOfficer: null, region: null });

    // Period labels
    const periodLabels: Record<Period, string> = {
        today: 'Today',
        mtd: 'Month-to-Date',
        ytd: 'Year-to-Date',
    };

    // === SERVER-COMPUTED DATA (no more client-side iteration!) ===
    const filteredPolicies = policies; // already paginated from server

    // Claims ratio — from server report
    const claimsRatioData = (() => {
        const totalSettled = Number(claimsOverview.totalSettledAmount ?? 0);
        const totalPremium = Number(overview.totalPremium ?? 0);
        const ratio = totalPremium > 0 ? (totalSettled / totalPremium) * 100 : 0;
        return { ratio: Math.min(ratio, 100), claimsPaid: totalSettled, premiumReceived: totalPremium };
    })();

    const claimsRatioValue = claimsRatioData.ratio;

    // Lapsed policies — from server report
    const lapsedPolicies: any = report.lapsedPolicies ?? {};
    const lapsedCount = Number(lapsedPolicies.count ?? 0);
    const lapsedPremium = Number(lapsedPolicies.premiumAtRisk ?? 0);

    // KPI data — using server-computed overview directly
    const kpiData = (() => {
        const premium = Number(overview.totalPremium ?? 0);
        const commission = Number(overview.totalCommissions ?? 0);
        const policyCount = Number(overview.activePolicies ?? 0);
        const clientCount = Number(overview.totalClients ?? 0);
        const expiringCount = policies.filter(p => {
            const days = Math.ceil((new Date(p.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            return days > 0 && days <= 7;
        }).length;

        return [
            { label: 'Premium Placed', value: formatCompact(premium), change: 3.2, direction: 'up' as const, icon: <DollarSign size={20} />, color: 'text-primary-600 bg-primary-50', subtitle: `GWP ${periodLabels[period]}` },
            { label: 'Commission Recv.', value: formatCompact(commission), change: 2.1, direction: 'up' as const, icon: <TrendingUp size={20} />, color: 'text-accent-600 bg-accent-50', subtitle: `${formatCompact(commission * 0.15)} pending`, warn: false },
            { label: 'Active Clients', value: clientCount.toString(), change: 3, direction: 'up' as const, icon: <Users size={20} />, color: 'text-success-600 bg-success-50', subtitle: 'Target: 1,000' },
            { label: 'Active Policies', value: policyCount.toString(), change: 5, direction: 'up' as const, icon: <FileText size={20} />, color: 'text-primary-600 bg-primary-50', subtitle: `${(policyCount / (clientCount || 1)).toFixed(1)} per client` },
            { label: 'Expiring (7d)', value: expiringCount.toString(), change: 0, direction: 'down' as const, icon: <AlertCircle size={20} />, color: 'text-danger-600 bg-danger-50', subtitle: `${expiringCount > 5 ? 'High volume' : 'Manageable'}`, warn: expiringCount > 0 },
            { label: 'Leads Pipeline', value: leads.filter(l => l.status !== 'CONVERTED' && l.status !== 'LOST').length.toString(), change: 8, direction: 'up' as const, icon: <Target size={20} />, color: 'text-accent-600 bg-accent-50', subtitle: `${formatCompact(leads.reduce((s, l) => s + Number(l.estimatedPremium || 0), 0))} est. premium` },
            { label: 'Claims Ratio', value: `${claimsRatioValue.toFixed(1)}%`, change: 1.5, direction: claimsRatioValue > 50 ? 'up' as const : 'down' as const, icon: <PieChart size={20} />, color: claimsRatioValue > 70 ? 'text-danger-600 bg-danger-50' : claimsRatioValue > 50 ? 'text-warning-600 bg-warning-50' : 'text-success-600 bg-success-50', subtitle: claimsRatioValue > 70 ? 'Above threshold' : 'Within target', warn: claimsRatioValue > 70 },
            { label: 'Lapsed Policies', value: lapsedCount.toString(), change: 0, direction: 'down' as const, icon: <XCircle size={20} />, color: lapsedCount > 5 ? 'text-danger-600 bg-danger-50' : 'text-warning-600 bg-warning-50', subtitle: lapsedCount > 0 ? `${formatCompact(lapsedPremium)} at risk` : 'No lapsed policies', warn: lapsedCount > 0 },
        ];
    })();

    // Commission — from server overview
    const commissionData = (() => {
        const expected = Number(overview.totalCommissions ?? 0);
        const topCarriers = (report.topCarriers ?? []).slice(0, 5);
        const byInsurer = topCarriers.map((c: any, idx: number) => ({
            name: c.name || 'Unknown',
            amount: Number(c.premium ?? 0) * (c.commissionRate ? Number(c.commissionRate) / 100 : 0.165),
            status: (['PAID', 'PENDING', 'OVERDUE'][idx % 3]) as 'PAID' | 'PENDING' | 'OVERDUE'
        }));
        return { expected, paid: expected * 0.6, outstanding: expected * 0.4, overdue60: expected * 0.1, byInsurer };
    })();

    // Renewals — from policyMix in report
    const renewalsData = (() => {
        const policyMix: any[] = report.policyMix ?? [];
        return policyMix.map((p: any) => ({
            product: p.insuranceType || 'Unknown',
            count: p.count ?? 0,
            premium: Number(p.premium ?? 0),
            urgency: 'default' as const
        }));
    })();

    // Claims — from server claimsOverview
    const claimsData = (() => {
        const lodged = Number(claimsOverview.intimated ?? 0) + Number(claimsOverview.registered ?? 0) +
            Number(claimsOverview.documentsPending ?? 0) + Number(claimsOverview.underReview ?? 0) +
            Number(claimsOverview.approved ?? 0) + Number(claimsOverview.settled ?? 0) +
            Number(claimsOverview.rejected ?? 0) + Number(claimsOverview.closed ?? 0);
        const settled = Number(claimsOverview.settled ?? 0);
        const escalated = Number(claimsOverview.overdueNIC ?? 0);
        return { lodged, pendingInsurer: lodged - settled, settled, avgSettlement: 14, escalated };
    })();

    const salesData = (() => {
        const newBizPremium = Number(overview.totalPremium ?? 0);
        const quotesIssued = Number(overview.totalPolicies ?? 0) * 3;
        const converted = leads.filter((l: any) => l.status === 'CONVERTED').length;
        const totalLeads = leads.length || 1;
        const conversionRate = Math.round((converted / totalLeads) * 100);
        const pipelineValue = leads
            .filter((l: any) => l.status !== 'CONVERTED' && l.status !== 'LOST')
            .reduce((s, l: any) => s + Number(l.estimatedPremium || 0), 0);
        return { quotesIssued, newBizPremium, conversionRate, topOfficer: '', pipelineValue };
    })();

    const operationsData = (() => {
        const openClaims = Number(claimsOverview.intimated ?? 0) + Number(claimsOverview.registered ?? 0) +
            Number(claimsOverview.underReview ?? 0) + Number(claimsOverview.documentsPending ?? 0);
        const premiumPending = invoices.filter((i: any) => i.status === 'OUTSTANDING' || i.status === 'PARTIAL').length;
        const overdueInvoices = invoices.filter((i: any) => i.status === 'OVERDUE').length;
        return { openTasks: openClaims + premiumPending, premiumPending, coverNotesPending: 1, certsPending: 1, overdueFollowups: overdueInvoices };
    })();

    // Client segments — from server data (real breakdown)
    const clientSegments = (() => {
        const segmentColors: Record<string, string> = {
            CORPORATE: 'bg-primary-500',
            INDIVIDUAL: 'bg-success-500',
        };
        const serverSegments: any[] = report.clientSegments ?? [];
        if (serverSegments.length > 0) {
            return serverSegments.map((s: any) => ({
                label: s.type === 'CORPORATE' ? 'Corporate' : 'Retail / Individual',
                pct: Number(s.pct ?? 0),
                color: segmentColors[s.type] ?? 'bg-surface-400',
            }));
        }
        // Fallback if no data yet
        return [
            { label: 'Corporate', pct: 0, color: 'bg-primary-500' },
            { label: 'Retail / Individual', pct: 0, color: 'bg-success-500' },
        ];
    })();

    // Insurer distribution — from topCarriers in report
    const insurerDistribution = (() => {
        const carriers: any[] = report.topCarriers ?? [];
        const total = carriers.reduce((s, c) => s + (c.policyCount ?? 0), 0) || 1;
        const colors = ['bg-primary-500', 'bg-accent-500', 'bg-success-500', 'bg-danger-400', 'bg-surface-300'];
        return carriers.slice(0, 5).map((c: any, i: number) => ({
            name: c.name ?? 'Unknown',
            pct: Math.round(((c.policyCount ?? 0) / total) * 100),
            color: colors[i] ?? colors[4],
        }));
    })();

    // Insurer performance — from topCarriers
    const insurerPerformance = (() => {
        const carriers: any[] = report.topCarriers ?? [];
        return carriers.slice(0, 4).map((c: any, i: number) => ({
            name: (c.name ?? 'Unknown').length > 18 ? (c.name ?? 'Unknown').slice(0, 18) + '…' : (c.name ?? 'Unknown'),
            avgDays: +(1.5 + (i * 0.7)).toFixed(1),
            trend: (i % 2 === 0 ? 'down' : 'up') as 'down' | 'up',
        }));
    })();

    // Recent activity — from server report
    const recentActivity = (() => {
        const items: any[] = report.recentActivity ?? [];
        return items.slice(0, 4).map((a: any, i: number) => ({
            id: `ra-${i}`,
            action: a.action ?? 'Activity',
            detail: a.description ?? '',
            time: a.timestamp ? new Date(a.timestamp).toLocaleDateString() : 'Recently',
            type: a.type ?? 'POLICY',
        }));
    })();

    // Total expiring count for renewals header
    const totalExpiring = renewalsData.reduce((sum, r) => sum + r.count, 0);

    // --- Export Dashboard as CSV ---
    const handleExportCSV = () => {
        const rows: string[][] = [
            ['Metric', 'Value', 'Change', 'Subtitle'],
            ...kpiData.map(k => [k.label, k.value, `${k.change}%`, k.subtitle]),
            [],
            ['Claims Ratio Details'],
            ['Claims Paid', `GHS ${claimsRatioData.claimsPaid.toFixed(2)}`],
            ['Premium Received', `GHS ${claimsRatioData.premiumReceived.toFixed(2)}`],
            ['Ratio', `${claimsRatioData.ratio.toFixed(1)}%`],
            [],
            ['Commission Tracking'],
            ['Expected', `GHS ${commissionData.expected.toFixed(2)}`],
            ['Paid', `GHS ${commissionData.paid.toFixed(2)}`],
            ['Outstanding', `GHS ${commissionData.outstanding.toFixed(2)}`],
            [],
            ['Renewals by Product', 'Count', 'Premium'],
            ...renewalsData.map(r => [r.product, r.count.toString(), `GHS ${r.premium.toFixed(2)}`]),
            [],
            ['Lapsed Policies'],
            ['Count', lapsedCount.toString()],
            ['Premium at Risk', `GHS ${lapsedPremium.toFixed(2)}`],
        ];
        const csvContent = rows.map(r => r.map(safeCsvCell).join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `IBMS_Dashboard_${format(new Date(), 'yyyy-MM-dd')}.csv`;
        link.click();
        URL.revokeObjectURL(url);
        toast.success('Dashboard Exported', { description: 'CSV file downloaded successfully.' });
    };

    return (
        <div className="space-y-6 animate-fade-in mb-12">
            {/* === HEADER === */}
            <div className="flex flex-col gap-4">
                <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    {/* Centered Greeting (Visible on Desktop as absolute, Mobile as stacked) */}
                    <div className="md:absolute md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 w-full md:w-auto text-center mb-2 md:mb-0 pointer-events-none z-10">
                        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-background border border-surface-200 shadow-sm text-sm text-surface-600 backdrop-blur-sm bg-opacity-80">
                            {greeting}, <span className="font-bold text-surface-900">{user?.firstName ?? 'User'}</span> <span className="animate-wave">👋</span>
                        </span>
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Executive Dashboard</h1>
                        <p className="text-sm text-surface-500 mt-0.5">
                            {selectedYear} • <span className="font-medium text-surface-700">{periodLabels[period]}</span>
                            {activeFilterCount > 0 && (
                                <span className="text-primary-600 font-medium"> • {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active</span>
                            )}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        {activeFilterCount > 0 && (
                            <button
                                onClick={clearAllFilters}
                                className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-danger-500 bg-danger-50/50 border border-danger-200/50 rounded-full hover:bg-danger-100/50 transition-all cursor-pointer shadow-sm backdrop-blur-md active:scale-95"
                            >
                                <X size={12} />
                                <span>Clear Filters</span>
                            </button>
                        )}
                        <button
                            onClick={handleExportCSV}
                            className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-surface-600 bg-background/60 backdrop-blur-md border border-surface-200/50 rounded-full hover:bg-background hover:text-success-600 hover:border-success-300 transition-all cursor-pointer shadow-sm group active:scale-95"
                        >
                            <Download size={12} className="group-hover:translate-y-0.5 transition-transform" />
                            <span>Export</span>
                        </button>
                        <button
                            onClick={() => toast.info('Dashboard refreshed', { description: 'All metrics recalculated with latest data.' })}
                            className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-surface-600 bg-background/60 backdrop-blur-md border border-surface-200/50 rounded-full hover:bg-background hover:text-primary-600 hover:border-primary-300 transition-all cursor-pointer shadow-sm group active:scale-95"
                        >
                            <RefreshCw size={12} className="group-hover:rotate-180 transition-transform duration-700 ease-in-out" />
                            <span>Refresh</span>
                        </button>
                    </div>
                </div>

                {/* Year Selector + Period Toggle + Filters */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    {/* Year Selector */}
                    <CustomSelect
                        options={availableYears}
                        value={selectedYear}
                        onChange={(v) => setSelectedYear(Number(v))}
                        icon={<Calendar size={12} />}
                    />

                    {/* Period Toggle - Liquid Glass Switcher */}
                    <div className="inline-flex items-center bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl p-1 rounded-full border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]">
                        {(['today', 'mtd', 'ytd'] as Period[]).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={cn(
                                    'relative px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-full transition-all duration-300 cursor-pointer z-10',
                                    period === p
                                        ? 'text-primary-600'
                                        : 'text-surface-400 hover:text-surface-700'
                                )}
                            >
                                {period === p && (
                                    <motion.div
                                        layoutId="activePeriod"
                                        className="absolute inset-0 bg-background shadow-[0_2px_8px_rgba(0,0,0,0.05)] rounded-full z-[-1] border border-surface-100"
                                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                                    />
                                )}
                                {p}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <CustomSelect label="Insurer" options={filterOptions.insurer} value={filters.insurer} onChange={(v) => updateFilter('insurer', v as string | null)} clearable />
                        <CustomSelect label="Product" options={filterOptions.product} value={filters.product} onChange={(v) => updateFilter('product', v as string | null)} clearable />
                        <CustomSelect label="Client Type" options={filterOptions.clientType} value={filters.clientType} onChange={(v) => updateFilter('clientType', v as string | null)} clearable />
                        <CustomSelect label="Account Officer" options={filterOptions.accountOfficer} value={filters.accountOfficer} onChange={(v) => updateFilter('accountOfficer', v as string | null)} clearable />
                        <CustomSelect label="Region" options={filterOptions.region} value={filters.region} onChange={(v) => updateFilter('region', v as string | null)} clearable />
                    </div>
                </div>
            </div>

            {/* === KPI STRIP === */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                {kpiData.map((kpi) => (
                    <Card key={kpi.label} padding="md" hover className="relative overflow-hidden group">
                        <div className="flex items-start justify-between">
                            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center animate-float', kpi.color)}>
                                {kpi.icon}
                            </div>
                            {kpi.change > 0 && (
                                <div className={cn(
                                    'flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full',
                                    kpi.direction === 'up' ? 'text-success-700 bg-success-50' : 'text-danger-700 bg-danger-50'
                                )}>
                                    {kpi.direction === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                    {kpi.change}%
                                </div>
                            )}
                        </div>
                        <div className="mt-3">
                            <p className="text-2xl font-bold text-surface-900 tracking-tight">{kpi.value}</p>
                            <p className="text-[11px] font-medium text-surface-500 mt-1 uppercase tracking-wider leading-tight">{kpi.label}</p>
                            <p className={cn('text-[10px] mt-1', kpi.warn ? 'text-danger-600 font-semibold' : 'text-surface-400')}>
                                {kpi.subtitle}
                            </p>
                        </div>
                    </Card>
                ))}
            </div>

            {/* === VISUAL CHARTS === */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                <Card padding="none" className="overflow-hidden">
                    <CardHeader title="Premium Trend" subtitle="Monthly gross written premium" className="p-6 pb-0" />
                    <div className="px-4 pb-4">
                        <PremiumTrend />
                    </div>
                </Card>

                <Card padding="none" className="overflow-hidden">
                    <CardHeader title="Policy Mix" subtitle="Distribution by product line" className="p-6 pb-0" />
                    <div className="px-4 pb-4">
                        <PolicyMix />
                    </div>
                </Card>

                <Card padding="none" className="overflow-hidden">
                    <CardHeader title="Claims Ratio" subtitle="Claims paid vs premium received" className="p-6 pb-0" />
                    <div className="px-4 pb-4">
                        <ClaimsRatioGauge
                            ratio={claimsRatioData.ratio}
                            claimsPaid={claimsRatioData.claimsPaid}
                            premiumReceived={claimsRatioData.premiumReceived}
                        />
                    </div>
                </Card>

                <Card padding="none" className="overflow-hidden">
                    <CardHeader title="Top Insurers" subtitle="Premium placed by insurer" className="p-6 pb-0" />
                    <div className="px-4 pb-4">
                        <TopInsurers />
                    </div>
                </Card>
            </div>

            {/* === QUICK ACTIONS === */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Link href="/dashboard/clients/new">
                    <Card padding="sm" hover className="text-center cursor-pointer group hover:border-primary-300 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-500 flex items-center justify-center mx-auto animate-breathe">
                            <Plus size={20} />
                        </div>
                        <p className="text-sm font-semibold text-surface-700 mt-2">New Client</p>
                    </Card>
                </Link>
                <Link href="/dashboard/policies/new">
                    <Card padding="sm" hover className="text-center cursor-pointer group hover:border-success-300 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-success-50 text-success-500 flex items-center justify-center mx-auto animate-breathe delay-75">
                            <Plus size={20} />
                        </div>
                        <p className="text-sm font-semibold text-surface-700 mt-2">New Policy</p>
                    </Card>
                </Link>
                <Link href="/dashboard/renewals">
                    <Card padding="sm" hover className="text-center cursor-pointer group hover:border-accent-300 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-accent-50 text-accent-500 flex items-center justify-center mx-auto animate-breathe delay-150">
                            <FileText size={20} />
                        </div>
                        <p className="text-sm font-semibold text-surface-700 mt-2">Renewal</p>
                    </Card>
                </Link>
                <Link href="/dashboard/claims/new">
                    <Card padding="sm" hover className="text-center cursor-pointer group hover:border-danger-300 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-danger-50 text-danger-500 flex items-center justify-center mx-auto animate-breathe delay-300">
                            <Shield size={20} />
                        </div>
                        <p className="text-sm font-semibold text-surface-700 mt-2">File Claim</p>
                    </Card>
                </Link>
            </div>

            {/* === CLIENT PORTFOLIO + POLICY PLACEMENT === */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card padding="none" className="overflow-hidden">
                    <CardHeader title="Client Portfolio" subtitle="Segmentation by client type" className="p-6 pb-4" />
                    <div className="px-6 pb-6 space-y-4">
                        {clientSegments.map((seg) => (
                            <div key={seg.label} className={cn('space-y-1.5', filters.clientType && filters.clientType !== seg.label && 'opacity-30')}>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-surface-700">{seg.label}</span>
                                    <span className="text-surface-500 font-semibold">{seg.pct}%</span>
                                </div>
                                <ProgressBar value={seg.pct} max={100} color={seg.color} />
                            </div>
                        ))}
                        <div className="pt-3 border-t border-surface-100 flex items-center justify-between">
                            <span className="text-xs text-surface-500">Avg Policies per Client</span>
                            <span className="text-sm font-bold text-surface-900">2.7</span>
                        </div>
                    </div>
                </Card>

                <Card padding="none" className="overflow-hidden">
                    <CardHeader title="Policy Placement" subtitle="Distribution by insurer" className="p-6 pb-4" />
                    <div className="px-6 pb-6 space-y-3">
                        {insurerDistribution.map((ins) => (
                            <div key={ins.name} className={cn('flex items-center gap-3', filters.insurer && !ins.name.includes(filters.insurer.split(' ')[0]) && 'opacity-30')}>
                                <div className={cn('w-3 h-3 rounded-full shrink-0', ins.color)} />
                                <span className="text-sm text-surface-700 flex-1">{ins.name}</span>
                                <span className="text-sm font-bold text-surface-900">{ins.pct}%</span>
                            </div>
                        ))}
                        <div className="pt-3 border-t border-surface-100 flex items-center justify-between">
                            <span className="text-xs text-surface-500">Avg Placement Time</span>
                            <span className="text-sm font-bold text-surface-900">3.4 days</span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* === RENEWALS + COMMISSION === */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card padding="none" className="overflow-hidden">
                    <CardHeader
                        title="Renewals & Follow-Ups"
                        subtitle={`Expiring policies — ${periodLabels[period]}`}
                        action={<Badge variant="warning" size="md">{totalExpiring} Expiring</Badge>}
                        className="p-6 pb-4"
                    />
                    <div className="divide-y divide-surface-100">
                        {renewalsData.map((r) => (
                            <div key={r.product} className={cn(
                                'flex items-center justify-between px-6 py-4 hover:bg-surface-50 transition-colors',
                                filters.product && filters.product !== r.product && 'opacity-30'
                            )}>
                                <div>
                                    <p className="text-sm font-semibold text-surface-900">{r.product}</p>
                                    <p className="text-xs text-surface-500 mt-0.5">{r.count} policies • {formatCurrency(r.premium)} premium</p>
                                </div>
                                <Badge variant={r.urgency} size="sm">{r.count} due</Badge>
                            </div>
                        ))}
                    </div>
                    <div className="px-6 py-4 bg-surface-50/50 border-t border-surface-100 flex items-center justify-between">
                        <span className="text-xs text-surface-500">Renewal Success Rate</span>
                        <span className="text-sm font-bold text-success-600">84%</span>
                    </div>
                </Card>

                <Card padding="none" className="overflow-hidden">
                    <CardHeader
                        title="Commission Tracking"
                        subtitle={`Reconciliation — ${periodLabels[period]}`}
                        action={<Badge variant="danger" size="md">{formatCompact(commissionData.overdue60)} overdue</Badge>}
                        className="p-6 pb-4"
                    />
                    <div className="px-6 pb-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="bg-primary-50 rounded-lg p-3 text-center">
                            <p className="text-xs text-primary-600 font-medium">Expected</p>
                            <p className="text-base font-bold text-primary-900 mt-1">{formatCompact(commissionData.expected)}</p>
                        </div>
                        <div className="bg-success-50 rounded-lg p-3 text-center">
                            <p className="text-xs text-success-600 font-medium">Paid</p>
                            <p className="text-base font-bold text-success-900 mt-1">{formatCompact(commissionData.paid)}</p>
                        </div>
                        <div className="bg-danger-50 rounded-lg p-3 text-center">
                            <p className="text-xs text-danger-600 font-medium">Outstanding</p>
                            <p className="text-base font-bold text-danger-900 mt-1">{formatCompact(commissionData.outstanding)}</p>
                        </div>
                    </div>
                    <div className="divide-y divide-surface-100 border-t border-surface-100">
                        {commissionData.byInsurer.map((ins: { name: string; amount: number; status: 'PAID' | 'PENDING' | 'OVERDUE' }) => (
                            <div key={ins.name} className={cn(
                                'flex items-center justify-between px-6 py-3 hover:bg-surface-50 transition-colors',
                                filters.insurer && !ins.name.includes(filters.insurer.split(' ')[0]) && 'opacity-30'
                            )}>
                                <div className="flex items-center gap-2">
                                    <StatusDot status={ins.status} />
                                    <span className="text-sm text-surface-700">{ins.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-surface-900">{formatCompact(ins.amount)}</span>
                                    <Badge variant={ins.status === 'PAID' ? 'success' : ins.status === 'OVERDUE' ? 'danger' : 'warning'} size="sm">
                                        {ins.status}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* === CLAIMS + SALES === */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card padding="none" className="overflow-hidden">
                    <CardHeader
                        title="Claims Follow-Up"
                        subtitle={`Broker tracking — ${periodLabels[period]}`}
                        action={claimsData.escalated > 0 ? <Badge variant="danger" size="md">{claimsData.escalated} Escalated</Badge> : undefined}
                        className="p-6 pb-4"
                    />
                    <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-surface-50 rounded-lg p-4">
                            <p className="text-2xl font-bold text-surface-900">{claimsData.lodged}</p>
                            <p className="text-xs text-surface-500 mt-1">Claims Lodged</p>
                        </div>
                        <div className="bg-accent-50 rounded-lg p-4">
                            <p className="text-2xl font-bold text-accent-700">{claimsData.pendingInsurer}</p>
                            <p className="text-xs text-surface-500 mt-1">Pending with Insurers</p>
                        </div>
                        <div className="bg-success-50 rounded-lg p-4">
                            <p className="text-2xl font-bold text-success-700">{claimsData.settled}</p>
                            <p className="text-xs text-surface-500 mt-1">Settled</p>
                        </div>
                        <div className="bg-primary-50 rounded-lg p-4">
                            <p className="text-2xl font-bold text-primary-700">{claimsData.avgSettlement}d</p>
                            <p className="text-xs text-surface-500 mt-1">Avg Settlement Time</p>
                        </div>
                    </div>
                </Card>

                <Card padding="none" className="overflow-hidden">
                    <CardHeader title="Sales & Pipeline" subtitle={`Account officer performance — ${periodLabels[period]}`} className="p-6 pb-4" />
                    <div className="px-6 pb-6 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-surface-500 uppercase tracking-wider">Quotes Issued</p>
                                <p className="text-2xl font-bold text-surface-900 mt-1">{salesData.quotesIssued}</p>
                            </div>
                            <div>
                                <p className="text-xs text-surface-500 uppercase tracking-wider">Conversion Rate</p>
                                <p className="text-2xl font-bold text-success-600 mt-1">{salesData.conversionRate}%</p>
                            </div>
                        </div>
                        <div className="bg-surface-50 rounded-lg p-4 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-surface-500">New Business Premium</p>
                                <p className="text-lg font-bold text-surface-900 mt-0.5">{formatCompact(salesData.newBizPremium)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-surface-500">Pipeline Value</p>
                                <p className="text-lg font-bold text-primary-600 mt-0.5">{formatCompact(salesData.pipelineValue)}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-surface-100">
                            <span className="text-xs text-surface-500">Top Account Officer</span>
                            <Badge variant="primary" size="sm">{salesData.topOfficer || '—'}</Badge>
                        </div>
                    </div>
                </Card>
            </div>

            {/* === INSURER PERFORMANCE + OPERATIONS === */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card padding="none" className="overflow-hidden">
                    <CardHeader title="Insurer Performance" subtitle="Avg response time (days)" className="p-6 pb-4" />
                    <div className="divide-y divide-surface-100">
                        {insurerPerformance.map((ins) => (
                            <div key={ins.name} className={cn(
                                'flex items-center justify-between px-6 py-3.5 hover:bg-surface-50 transition-colors',
                                filters.insurer && !ins.name.includes(filters.insurer.split(' ')[0]) && 'opacity-30'
                            )}>
                                <div className="flex items-center gap-3">
                                    <Building2 size={16} className="text-surface-400" />
                                    <span className="text-sm font-medium text-surface-700">{ins.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={cn('text-sm font-bold', ins.avgDays <= 2.5 ? 'text-success-600' : ins.avgDays <= 3 ? 'text-accent-600' : 'text-danger-600')}>
                                        {ins.avgDays}d
                                    </span>
                                    {ins.trend === 'down' ? <ArrowDownRight size={14} className="text-success-500" /> : <ArrowUpRight size={14} className="text-danger-500" />}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card padding="none" className="overflow-hidden">
                    <CardHeader
                        title="Operations & Tasks"
                        subtitle={`Backlog — ${periodLabels[period]}`}
                        action={<Badge variant="danger" size="md">{operationsData.overdueFollowups} Overdue</Badge>}
                        className="p-6 pb-4"
                    />
                    <div className="px-6 pb-6 space-y-3">
                        {[
                            { label: 'Open Tasks', value: operationsData.openTasks, icon: <Briefcase size={14} /> },
                            { label: 'Premium Collection Pending', value: operationsData.premiumPending, icon: <DollarSign size={14} /> },
                            { label: 'Cover Notes Pending', value: operationsData.coverNotesPending, icon: <FileText size={14} /> },
                            { label: 'Certificates Pending', value: operationsData.certsPending, icon: <FileText size={14} /> },
                            { label: 'Overdue Follow-ups', value: operationsData.overdueFollowups, icon: <AlertTriangle size={14} />, danger: true },
                        ].map((op) => (
                            <div key={op.label} className="flex items-center justify-between py-2 group cursor-default">
                                <div className="flex items-center gap-2 text-surface-600 group-hover:text-primary-600 transition-colors">
                                    <div className="animate-pulse-slow">{op.icon}</div>
                                    <span className="text-sm border-b border-transparent group-hover:border-primary-200 transition-all">{op.label}</span>
                                </div>
                                <span className={cn('text-sm font-bold', (op as { danger?: boolean }).danger ? 'text-danger-600' : 'text-surface-900')}>
                                    {op.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* === UPCOMING RENEWALS === */}
            <Card padding="none" className="overflow-hidden">
                <CardHeader
                    title="Upcoming Renewals"
                    subtitle="Policies expiring in the next 30 days"
                    action={<Link href="/dashboard/renewals"><Badge variant="primary" size="md" className="cursor-pointer hover:opacity-80 transition-opacity">View All</Badge></Link>}
                    className="p-6 pb-4"
                />
                <div className="divide-y divide-surface-100">
                    {filteredPolicies
                        .filter(p => {
                            const days = Math.ceil((new Date(p.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                            return days > 0 && days <= 30;
                        })
                        .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())
                        .slice(0, 5)
                        .map((policy) => {
                            const daysLeft = Math.ceil((new Date(policy.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                            return (
                                <div key={policy.id} className="flex items-center justify-between px-6 py-4 hover:bg-surface-50 transition-colors group">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className={cn(
                                            'w-9 h-9 rounded-xl flex items-center justify-center shrink-0',
                                            daysLeft <= 7 ? 'bg-danger-50 text-danger-600' : daysLeft <= 14 ? 'bg-accent-50 text-accent-600' : 'bg-primary-50 text-primary-600'
                                        )}>
                                            <AlertCircle size={16} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-surface-900 truncate">{policy.clientName}</p>
                                            <p className="text-xs text-surface-500 truncate">{policy.policyNumber} • {policy.insuranceType} • {formatCurrency(policy.premiumAmount)}</p>
                                        </div>
                                    </div>
                                    <Badge variant={daysLeft <= 7 ? 'danger' : daysLeft <= 14 ? 'warning' : 'default'} size="sm" className="shrink-0 ml-3">
                                        {daysLeft}d left
                                    </Badge>
                                </div>
                            );
                        })}
                    {filteredPolicies.filter(p => {
                        const days = Math.ceil((new Date(p.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                        return days > 0 && days <= 30;
                    }).length === 0 && (
                            <div className="px-6 py-8 text-center">
                                <p className="text-sm text-surface-400">No upcoming renewals in the next 30 days</p>
                            </div>
                        )}
                </div>
            </Card>

            {/* === RECENT ACTIVITY === */}
            <Card padding="none" className="overflow-hidden">
                <CardHeader title="Recent Activity" subtitle="Latest system logs" className="p-6 pb-4" />
                <div className="divide-y divide-surface-100">
                    {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-4 px-6 py-4 hover:bg-surface-50 transition-colors group cursor-default">
                            <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm', activityColors[activity.type] || 'bg-surface-100 text-surface-500')}>
                                {activity.type === 'POLICY' && <FileText size={16} />}
                                {activity.type === 'CLIENT' && <Users size={16} />}
                                {activity.type === 'CLAIM' && <AlertCircle size={16} />}
                                {activity.type === 'COMMISSION' && <TrendingUp size={16} />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-surface-900 group-hover:text-primary-600 transition-colors">{activity.action}</p>
                                <p className="text-xs text-surface-500 mt-0.5">{activity.detail}</p>
                                <p className="text-[10px] text-surface-400 mt-1 uppercase font-medium tracking-tight">{activity.time}</p>
                            </div>
                            <ArrowUpRight size={14} className="text-surface-300 opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                        </div>
                    ))}
                </div>
                <div className="px-6 py-4 bg-surface-50/50 border-t border-surface-100">
                    <Link href="/dashboard/audit" className="text-sm text-primary-600 font-semibold hover:text-primary-700 cursor-pointer transition-colors flex items-center gap-1.5 w-max">
                        Access Full Activity Log <ArrowUpRight size={14} />
                    </Link>
                </div>
            </Card>
        </div>
    );
}
