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
import { policies } from '@/mock/policies';
import { mockClients as clients } from '@/mock/clients';
import { claims } from '@/mock/claims';
import { invoices } from '@/mock/finance';
import { mockLeads } from '@/mock/leads';
import { PremiumTrend } from '@/components/charts/premium-trend';
import { PolicyMix } from '@/components/charts/policy-mix';
import { TopInsurers } from '@/components/charts/top-insurers';

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
// =====================================================================
// FILTERING HELPER
// =====================================================================
function filterData<T extends { insurerName?: string; insuranceType?: string; clientId?: string; brokerName?: string; createdAt?: string }>(
    data: T[],
    filters: Filters,
    period: Period
): T[] {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstOfYear = new Date(now.getFullYear(), 0, 1);

    return data.filter(item => {
        // Period Filter
        if (item.createdAt) {
            const itemDate = new Date(item.createdAt);
            if (period === 'today' && itemDate < today) return false;
            if (period === 'mtd' && itemDate < firstOfMonth) return false;
            if (period === 'ytd' && itemDate < firstOfYear) return false;
        }

        // Insurer Filter (Case-insensitive fuzzy match for mock data inconsistency)
        if (filters.insurer) {
            const insurerLower = filters.insurer.toLowerCase();
            const itemInsurer = (item.insurerName || '').toLowerCase();
            if (!itemInsurer.includes(insurerLower.split(' ')[0])) return false;
        }

        // Product Filter
        if (filters.product) {
            const productLower = filters.product.toLowerCase().replace(/ \/ .*/, '');
            const itemType = (item.insuranceType || '').toLowerCase();
            if (!itemType.includes(productLower)) return false;
        }

        // Client Type Filter
        if (filters.clientType) {
            const client = clients.find(c => c.id === item.clientId);
            if (client && client.type.toLowerCase() !== filters.clientType.toLowerCase()) return false;
        }

        // Account Officer Filter
        if (filters.accountOfficer && item.brokerName !== filters.accountOfficer) return false;

        // Region Filter (Mock: determined by client region)
        if (filters.region) {
            const client = clients.find(c => c.id === item.clientId);
            // In mock data, we'll assume region mismatch if client not found or doesn't have it
            // For now, let's just bypass regions or assume some clients have regions
        }

        return true;
    });
}

// =====================================================================
// STATIC DATA (unchanged by period)
// =====================================================================
const clientSegments = (() => {
    const total = clients.length || 1;
    const corp = clients.filter(c => c.type === 'corporate').length;
    const ind = clients.filter(c => c.type === 'individual').length;
    return [
        { label: 'Corporate', pct: Math.round((corp / total) * 100), color: 'bg-primary-500' },
        { label: 'Retail / Individual', pct: Math.round((ind / total) * 100), color: 'bg-success-500' },
    ];
})();

const insurerDistribution = (() => {
    const counts: Record<string, number> = {};
    policies.forEach(p => { counts[p.insurerName] = (counts[p.insurerName] || 0) + 1; });
    const total = policies.length || 1;
    const colors = ['bg-primary-500', 'bg-accent-500', 'bg-success-500', 'bg-danger-400', 'bg-surface-300'];
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const top4 = sorted.slice(0, 4).map(([name, count], i) => ({
        name, pct: Math.round((count / total) * 100), color: colors[i]
    }));
    const otherPct = sorted.slice(4).reduce((s, [, c]) => s + c, 0);
    if (otherPct > 0) top4.push({ name: 'Others', pct: Math.round((otherPct / total) * 100), color: colors[4] });
    return top4;
})();

const insurerPerformance = (() => {
    const insurers = Array.from(new Set(policies.map(p => p.insurerName))).slice(0, 4);
    return insurers.map((name, i) => ({
        name: name.length > 18 ? name.slice(0, 18) + '…' : name,
        avgDays: +(1.5 + (i * 0.7)).toFixed(1),
        trend: (i % 2 === 0 ? 'down' : 'up') as 'down' | 'up',
    }));
})();

const recentActivity = (() => {
    const items: { id: string; action: string; detail: string; time: string; type: string }[] = [];
    const recentPolicies = [...policies].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 2);
    const recentClaims = [...claims].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 1);
    const recentClients = [...clients].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 1);
    recentPolicies.forEach((p, i) => items.push({
        id: `ra-p${i}`, action: 'Policy updated', detail: `${p.policyNumber} — ${p.coverageDetails || p.insuranceType} for ${p.clientName}`, time: 'Recently', type: 'policy'
    }));
    recentClaims.forEach((c, i) => items.push({
        id: `ra-c${i}`, action: 'Claim registered', detail: `${c.claimNumber} — ${c.incidentDescription || 'Claim'} by ${c.clientName}`, time: 'Recently', type: 'claim'
    }));
    recentClients.forEach((cl, i) => items.push({
        id: `ra-cl${i}`, action: 'Client updated', detail: `${cl.companyName || (cl.firstName + ' ' + cl.lastName)} — ${cl.type} client`, time: 'Recently', type: 'client'
    }));
    return items.slice(0, 4);
})();

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

    // Period labels
    const periodLabels: Record<Period, string> = {
        today: 'Today',
        mtd: 'Month-to-Date',
        ytd: 'Year-to-Date',
    };

    // =====================================================================
    // CORE CALCULATION LOGIC
    // =====================================================================
    const filteredPolicies = useMemo(() => filterData(policies, filters, period), [filters, period]);
    const filteredClients = useMemo(() => clients.filter(c => {
        if (filters.clientType && c.type.toLowerCase() !== filters.clientType.toLowerCase()) return false;
        // ... more client specific filters
        return true;
    }), [filters]);
    const filteredClaims = useMemo(() => filterData(claims, filters, period), [filters, period]);

    const kpiData = useMemo(() => {
        const premium = filteredPolicies.reduce((sum, p) => sum + p.premiumAmount, 0);
        const commission = filteredPolicies.reduce((sum, p) => sum + (p.commissionAmount || 0), 0);
        const policyCount = filteredPolicies.length;
        const clientCount = filteredClients.length;
        const expiringCount = filteredPolicies.filter(p => {
            const days = Math.ceil((new Date(p.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            return days > 0 && days <= 7;
        }).length;

        return [
            { label: 'Premium Placed', value: formatCompact(premium), change: 3.2, direction: 'up' as const, icon: <DollarSign size={20} />, color: 'text-primary-600 bg-primary-50', subtitle: `GWP ${periodLabels[period]}` },
            { label: 'Commission Recv.', value: formatCompact(commission), change: 2.1, direction: 'up' as const, icon: <TrendingUp size={20} />, color: 'text-accent-600 bg-accent-50', subtitle: `${formatCompact(commission * 0.15)} pending`, warn: false },
            { label: 'Active Clients', value: clientCount.toString(), change: 3, direction: 'up' as const, icon: <Users size={20} />, color: 'text-success-600 bg-success-50', subtitle: 'Target: 1,000' },
            { label: 'Active Policies', value: policyCount.toString(), change: 5, direction: 'up' as const, icon: <FileText size={20} />, color: 'text-primary-600 bg-primary-50', subtitle: `${(policyCount / (clientCount || 1)).toFixed(1)} per client` },
            { label: 'Expiring (7d)', value: expiringCount.toString(), change: 0, direction: 'down' as const, icon: <AlertCircle size={20} />, color: 'text-danger-600 bg-danger-50', subtitle: `${expiringCount > 5 ? 'High volume' : 'Manageable'}`, warn: expiringCount > 0 },
            { label: 'Leads Pipeline', value: mockLeads.filter(l => l.status !== 'converted' && l.status !== 'lost').length.toString(), change: 8, direction: 'up' as const, icon: <Target size={20} />, color: 'text-accent-600 bg-accent-50', subtitle: `${formatCompact(mockLeads.reduce((s, l) => s + (l.estimatedPremium || 0), 0))} est. premium` },
        ];
    }, [filteredPolicies, filteredClients, period]);

    const commissionData = useMemo(() => {
        const expected = filteredPolicies.reduce((sum, p) => sum + (p.commissionAmount || 0), 0);
        const byInsurer = Array.from(new Set(filteredPolicies.map(p => p.insurerName))).map((name, idx) => ({
            name: name || 'Unknown',
            amount: filteredPolicies.filter(p => p.insurerName === name).reduce((sum, p) => sum + (p.commissionAmount || 0), 0),
            status: (['paid', 'pending', 'overdue'][idx % 3]) as 'paid' | 'pending' | 'overdue'
        })).slice(0, 5);

        return { expected, paid: expected * 0.6, outstanding: expected * 0.4, overdue60: expected * 0.1, byInsurer };
    }, [filteredPolicies]);

    const renewalsData = useMemo(() => {
        const byProduct = Array.from(new Set(filteredPolicies.map(p => p.insuranceType))).map(type => ({
            product: type || 'Unknown',
            count: filteredPolicies.filter(p => p.insuranceType === type).length,
            premium: filteredPolicies.filter(p => p.insuranceType === type).reduce((sum, p) => sum + p.premiumAmount, 0),
            urgency: 'default' as const
        }));
        return byProduct;
    }, [filteredPolicies]);

    const claimsData = useMemo(() => {
        const lodged = filteredClaims.length;
        const settled = filteredClaims.filter(c => c.status === 'settled').length;
        const totalAmount = filteredClaims.reduce((sum, c) => sum + (c.claimAmount || 0), 0);
        return { lodged, pendingInsurer: lodged - settled, settled, avgSettlement: 22, escalated: Math.floor(lodged * 0.1) };
    }, [filteredClaims]);

    const salesData = useMemo(() => {
        return { quotesIssued: filteredPolicies.length * 3, newBizPremium: filteredPolicies.reduce((sum, p) => sum + p.premiumAmount, 0), conversionRate: 33, topOfficer: 'K. Mensah', pipelineValue: 18400000 };
    }, [filteredPolicies]);

    const operationsData = useMemo(() => {
        const openClaims = claims.filter(c => c.status !== 'settled' && c.status !== 'rejected').length;
        const premiumPending = invoices.filter(i => i.status === 'outstanding' || i.status === 'partial').length;
        const overdueInvoices = invoices.filter(i => i.status === 'overdue').length;
        return { openTasks: openClaims + premiumPending, premiumPending, coverNotesPending: Math.max(1, Math.floor(filteredPolicies.filter(p => p.status === 'pending').length)), certsPending: Math.max(1, Math.floor(filteredPolicies.filter(p => p.status === 'draft').length)), overdueFollowups: overdueInvoices };
    }, [filteredPolicies]);

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
                    <div className="inline-flex items-center bg-white/40 backdrop-blur-2xl p-1 rounded-full border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]">
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
                                        className="absolute inset-0 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)] rounded-full z-[-1] border border-surface-100"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
