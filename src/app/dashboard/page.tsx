'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Calendar } from 'lucide-react';
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
    ChevronDown,
    Shield,
    X,
    Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn, formatCurrency } from '@/lib/utils';
import { CustomSelect } from '@/components/ui/select-custom';
import Link from 'next/link';

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

// =====================================================================
// DATA BY PERIOD
// =====================================================================
function getKpiData(period: Period): KPI[] {
    const data: Record<Period, KPI[]> = {
        today: [
            { label: 'Premium Placed', value: '₵ 284k', change: 3.2, direction: 'up', icon: <DollarSign size={20} />, color: 'text-primary-600 bg-primary-50', subtitle: 'GWP Today' },
            { label: 'Commission Recv.', value: '₵ 42k', change: 0, direction: 'up', icon: <TrendingUp size={20} />, color: 'text-accent-600 bg-accent-50', subtitle: '₵18k pending', warn: false },
            { label: 'Active Clients', value: '842', change: 3, direction: 'up', icon: <Users size={20} />, color: 'text-success-600 bg-success-50', subtitle: '+3 new today' },
            { label: 'Active Policies', value: '2,316', change: 5, direction: 'up', icon: <FileText size={20} />, color: 'text-primary-600 bg-primary-50', subtitle: '+5 issued today' },
            { label: 'Expiring (7d)', value: '12', change: 0, direction: 'down', icon: <AlertCircle size={20} />, color: 'text-danger-600 bg-danger-50', subtitle: '3 urgent (≤2 days)', warn: true },
        ],
        mtd: [
            { label: 'Premium Placed', value: '₵ 12.4M', change: 6.1, direction: 'up', icon: <DollarSign size={20} />, color: 'text-primary-600 bg-primary-50', subtitle: 'GWP Month-to-Date' },
            { label: 'Commission Recv.', value: '₵ 1.8M', change: 0, direction: 'up', icon: <TrendingUp size={20} />, color: 'text-accent-600 bg-accent-50', subtitle: '⚠ ₵320k overdue', warn: true },
            { label: 'Active Clients', value: '842', change: 12, direction: 'up', icon: <Users size={20} />, color: 'text-success-600 bg-success-50', subtitle: 'Corporate + SME + Retail' },
            { label: 'Active Policies', value: '2,316', change: 28, direction: 'up', icon: <FileText size={20} />, color: 'text-primary-600 bg-primary-50', subtitle: 'Avg 2.7 per client' },
            { label: 'Policies Expiring', value: '96', change: 0, direction: 'down', icon: <AlertCircle size={20} />, color: 'text-danger-600 bg-danger-50', subtitle: '30d: 96 | 60d: 211', warn: true },
        ],
        ytd: [
            { label: 'Premium Placed', value: '₵ 89.2M', change: 14.8, direction: 'up', icon: <DollarSign size={20} />, color: 'text-primary-600 bg-primary-50', subtitle: 'GWP Year-to-Date' },
            { label: 'Commission Recv.', value: '₵ 12.6M', change: 11.2, direction: 'up', icon: <TrendingUp size={20} />, color: 'text-accent-600 bg-accent-50', subtitle: '⚠ ₵1.4M outstanding', warn: true },
            { label: 'Clients Acquired', value: '127', change: 22, direction: 'up', icon: <Users size={20} />, color: 'text-success-600 bg-success-50', subtitle: 'Net new YTD' },
            { label: 'Policies Issued', value: '1,845', change: 18.3, direction: 'up', icon: <FileText size={20} />, color: 'text-primary-600 bg-primary-50', subtitle: '₵48.3k avg premium' },
            { label: 'Claims Settled', value: '412', change: 8.7, direction: 'up', icon: <AlertCircle size={20} />, color: 'text-danger-600 bg-danger-50', subtitle: 'Avg 22d settlement' },
        ],
    };
    return data[period];
}

function getCommissionData(period: Period) {
    const data: Record<Period, { expected: number; paid: number; outstanding: number; overdue60: number; byInsurer: { name: string; amount: number; status: 'paid' | 'pending' | 'overdue' }[] }> = {
        today: {
            expected: 42000, paid: 24000, outstanding: 18000, overdue60: 8000,
            byInsurer: [
                { name: 'SIC Insurance', amount: 12000, status: 'paid' },
                { name: 'Enterprise', amount: 8000, status: 'pending' },
                { name: 'Hollard', amount: 4000, status: 'paid' },
            ],
        },
        mtd: {
            expected: 540000, paid: 220000, outstanding: 320000, overdue60: 180000,
            byInsurer: [
                { name: 'SIC Insurance', amount: 120000, status: 'paid' },
                { name: 'Enterprise', amount: 95000, status: 'overdue' },
                { name: 'Hollard', amount: 68000, status: 'pending' },
                { name: 'Star Assurance', amount: 37000, status: 'paid' },
            ],
        },
        ytd: {
            expected: 4200000, paid: 2800000, outstanding: 1400000, overdue60: 620000,
            byInsurer: [
                { name: 'SIC Insurance', amount: 980000, status: 'paid' },
                { name: 'Enterprise', amount: 720000, status: 'overdue' },
                { name: 'Hollard', amount: 540000, status: 'pending' },
                { name: 'Star Assurance', amount: 360000, status: 'paid' },
                { name: 'Glico General', amount: 200000, status: 'pending' },
            ],
        },
    };
    return data[period];
}

function getRenewalsData(period: Period) {
    const data: Record<Period, { product: string; count: number; premium: number; urgency: 'danger' | 'warning' | 'default' }[]> = {
        today: [
            { product: 'Motor', count: 4, premium: 62000, urgency: 'danger' },
            { product: 'Health', count: 2, premium: 85000, urgency: 'warning' },
        ],
        mtd: [
            { product: 'Motor', count: 54, premium: 890000, urgency: 'danger' },
            { product: 'Health', count: 29, premium: 1240000, urgency: 'warning' },
            { product: 'Fire / Property', count: 13, premium: 3200000, urgency: 'default' },
        ],
        ytd: [
            { product: 'Motor', count: 312, premium: 5800000, urgency: 'danger' },
            { product: 'Health', count: 198, premium: 8400000, urgency: 'warning' },
            { product: 'Fire / Property', count: 87, premium: 18200000, urgency: 'default' },
            { product: 'Marine', count: 24, premium: 4600000, urgency: 'default' },
        ],
    };
    return data[period];
}

function getClaimsData(period: Period) {
    const data: Record<Period, { lodged: number; pendingInsurer: number; settled: number; avgSettlement: number; escalated: number }> = {
        today: { lodged: 5, pendingInsurer: 49, settled: 2, avgSettlement: 24, escalated: 1 },
        mtd: { lodged: 132, pendingInsurer: 49, settled: 67, avgSettlement: 24, escalated: 11 },
        ytd: { lodged: 847, pendingInsurer: 112, settled: 412, avgSettlement: 22, escalated: 43 },
    };
    return data[period];
}

function getSalesData(period: Period) {
    const data: Record<Period, { quotesIssued: number; newBizPremium: number; conversionRate: number; topOfficer: string; pipelineValue: number }> = {
        today: { quotesIssued: 14, newBizPremium: 284000, conversionRate: 36, topOfficer: 'A. Boateng', pipelineValue: 890000 },
        mtd: { quotesIssued: 296, newBizPremium: 2800000, conversionRate: 31, topOfficer: 'A. Boateng', pipelineValue: 5900000 },
        ytd: { quotesIssued: 2140, newBizPremium: 42000000, conversionRate: 33, topOfficer: 'K. Mensah', pipelineValue: 18400000 },
    };
    return data[period];
}

function getOperationsData(period: Period) {
    const data: Record<Period, { openTasks: number; premiumPending: number; coverNotesPending: number; certsPending: number; overdueFollowups: number }> = {
        today: { openTasks: 24, premiumPending: 8, coverNotesPending: 3, certsPending: 5, overdueFollowups: 7 },
        mtd: { openTasks: 187, premiumPending: 46, coverNotesPending: 18, certsPending: 27, overdueFollowups: 33 },
        ytd: { openTasks: 187, premiumPending: 46, coverNotesPending: 18, certsPending: 27, overdueFollowups: 33 },
    };
    return data[period];
}

// =====================================================================
// STATIC DATA (unchanged by period)
// =====================================================================
const clientSegments = [
    { label: 'Corporate', pct: 31, color: 'bg-primary-500' },
    { label: 'SME', pct: 44, color: 'bg-accent-500' },
    { label: 'Retail / Individual', pct: 25, color: 'bg-success-500' },
];

const insurerDistribution = [
    { name: 'SIC Insurance', pct: 28, color: 'bg-primary-500' },
    { name: 'Enterprise Insurance', pct: 22, color: 'bg-accent-500' },
    { name: 'Hollard Insurance', pct: 18, color: 'bg-success-500' },
    { name: 'Star Assurance', pct: 15, color: 'bg-danger-400' },
    { name: 'Others', pct: 17, color: 'bg-surface-300' },
];

const insurerPerformance = [
    { name: 'SIC Insurance', avgDays: 2.1, trend: 'down' as const },
    { name: 'Enterprise', avgDays: 2.8, trend: 'up' as const },
    { name: 'Hollard', avgDays: 3.5, trend: 'up' as const },
    { name: 'Star Assurance', avgDays: 1.9, trend: 'down' as const },
];

const recentActivity = [
    { id: '1', action: 'New policy created', detail: 'POL-2024-0847 — Motor Comprehensive for Kwame Mensah', time: '15 minutes ago', type: 'policy' },
    { id: '2', action: 'Client KYC verified', detail: 'Ama Serwaa — Individual client verified', time: '1 hour ago', type: 'client' },
    { id: '3', action: 'Claim registered', detail: 'CLM-2024-0156 — Fire claim by Asante Holdings Ltd', time: '2 hours ago', type: 'claim' },
    { id: '4', action: 'Commission received', detail: '₵12,450 commission from Enterprise Insurance (Motor)', time: '5 hours ago', type: 'commission' },
];

const activityColors: Record<string, string> = {
    policy: 'bg-primary-100 text-primary-600',
    client: 'bg-success-100 text-success-600',
    claim: 'bg-danger-100 text-danger-600',
    commission: 'bg-success-100 text-success-600',
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

function StatusDot({ status }: { status: 'paid' | 'pending' | 'overdue' }) {
    const colors = { paid: 'bg-success-500', pending: 'bg-accent-500', overdue: 'bg-danger-500' };
    return <span className={cn('w-2 h-2 rounded-full inline-block', colors[status])} />;
}

function formatCompact(n: number): string {
    if (n >= 1000000) return `₵${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `₵${(n / 1000).toFixed(0)}k`;
    return `₵${n}`;
}


// =====================================================================
// MAIN DASHBOARD
// =====================================================================
export default function DashboardPage() {
    const [period, setPeriod] = useState<Period>('mtd');
    const [selectedYear, setSelectedYear] = useState<number>(2026);
    const [filters, setFilters] = useState<Filters>({
        insurer: null,
        product: null,
        clientType: null,
        accountOfficer: null,
        region: null,
    });

    // Greeting logic
    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    }, []);

    const updateFilter = (key: keyof Filters, value: string | null) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const activeFilterCount = Object.values(filters).filter(Boolean).length;
    const clearAllFilters = () => setFilters({ insurer: null, product: null, clientType: null, accountOfficer: null, region: null });

    // Get period-specific data
    const kpiData = getKpiData(period);
    const commissionData = getCommissionData(period);
    const renewalsData = getRenewalsData(period);
    const claimsData = getClaimsData(period);
    const salesData = getSalesData(period);
    const operationsData = getOperationsData(period);

    // Period labels
    const periodLabels: Record<Period, string> = {
        today: 'Today',
        mtd: 'Month-to-Date',
        ytd: 'Year-to-Date',
    };

    // Total expiring count for renewals header
    const totalExpiring = renewalsData.reduce((sum, r) => sum + r.count, 0);

    return (
        <div className="space-y-6 animate-fade-in mb-12">
            {/* === HEADER === */}
            <div className="flex flex-col gap-4">
                <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    {/* Centered Greeting (Visible on Desktop as absolute, Mobile as stacked) */}
                    <div className="md:absolute md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 w-full md:w-auto text-center mb-2 md:mb-0 pointer-events-none z-10">
                        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-surface-200 shadow-sm text-sm text-surface-600 backdrop-blur-sm bg-opacity-80">
                            {greeting}, <span className="font-bold text-surface-900">Kwame</span> <span className="animate-wave">👋</span>
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
                    <div className="flex items-center gap-2">
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
                            className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-surface-600 bg-white/60 backdrop-blur-md border border-surface-200/50 rounded-full hover:bg-white hover:text-primary-600 hover:border-primary-300 transition-all cursor-pointer shadow-sm group active:scale-95"
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
                    <div className="inline-flex items-center bg-white/60 backdrop-blur-xl p-0.5 rounded-full border border-surface-200/50 shadow-sm">
                        {(['today', 'mtd', 'ytd'] as Period[]).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={cn(
                                    'relative px-5 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full transition-all duration-200 cursor-pointer z-10',
                                    period === p
                                        ? 'text-primary-600'
                                        : 'text-surface-400 hover:text-surface-600'
                                )}
                            >
                                {period === p && (
                                    <motion.div
                                        layoutId="activePeriod"
                                        className="absolute inset-0 bg-white rounded-full shadow-sm z-[-1] border border-surface-100"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                {p}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <CustomSelect label="Insurer" options={filterOptions.insurer} value={filters.insurer} onChange={(v) => updateFilter('insurer', v)} clearable />
                        <CustomSelect label="Product" options={filterOptions.product} value={filters.product} onChange={(v) => updateFilter('product', v)} clearable />
                        <CustomSelect label="Client Type" options={filterOptions.clientType} value={filters.clientType} onChange={(v) => updateFilter('clientType', v)} clearable />
                        <CustomSelect label="Account Officer" options={filterOptions.accountOfficer} value={filters.accountOfficer} onChange={(v) => updateFilter('accountOfficer', v)} clearable />
                        <CustomSelect label="Region" options={filterOptions.region} value={filters.region} onChange={(v) => updateFilter('region', v)} clearable />
                    </div>
                </div>
            </div>

            {/* === KPI STRIP === */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
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
                <Link href="/dashboard/quotes/new">
                    <Card padding="sm" hover className="text-center cursor-pointer group hover:border-accent-300 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-accent-50 text-accent-500 flex items-center justify-center mx-auto animate-breathe delay-150">
                            <FileText size={20} />
                        </div>
                        <p className="text-sm font-semibold text-surface-700 mt-2">New Quote</p>
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
                    <div className="px-6 pb-4 grid grid-cols-3 gap-3">
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
                        {commissionData.byInsurer.map((ins) => (
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
                                    <Badge variant={ins.status === 'paid' ? 'success' : ins.status === 'overdue' ? 'danger' : 'warning'} size="sm">
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
                    <div className="px-6 pb-6 grid grid-cols-2 gap-4">
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
                        <div className="grid grid-cols-2 gap-4">
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
                            <Badge variant="primary" size="sm">{salesData.topOfficer}</Badge>
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

            {/* === RECENT ACTIVITY === */}
            <Card padding="none" className="overflow-hidden">
                <CardHeader title="Recent Activity" subtitle="Latest system logs" className="p-6 pb-4" />
                <div className="divide-y divide-surface-100">
                    {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-4 px-6 py-4 hover:bg-surface-50 transition-colors group cursor-default">
                            <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm', activityColors[activity.type] || 'bg-surface-100 text-surface-500')}>
                                {activity.type === 'policy' && <FileText size={16} />}
                                {activity.type === 'client' && <Users size={16} />}
                                {activity.type === 'claim' && <AlertCircle size={16} />}
                                {activity.type === 'commission' && <TrendingUp size={16} />}
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
                    <button className="text-sm text-primary-600 font-semibold hover:text-primary-700 cursor-pointer transition-colors flex items-center gap-1.5">
                        Access Full Activity Log <ArrowUpRight size={14} />
                    </button>
                </div>
            </Card>
        </div>
    );
}
