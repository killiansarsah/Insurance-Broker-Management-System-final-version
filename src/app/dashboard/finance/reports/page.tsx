'use client';

import { useState, useMemo } from 'react';
import {
    BarChart3,
    TrendingUp,
    Download,
    AlertTriangle,
    CheckCircle2,
    ArrowUpRight,
    PieChart,
    CalendarRange,
} from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BackButton } from '@/components/ui/back-button';
import { useFinanceDashboard, useInvoices, useCommissions } from '@/hooks/api/use-finance';
import { formatCurrency, cn } from '@/lib/utils';
import Link from 'next/link';

// Helper: parse 'January 2025' → Date
function parseMonth(label: string): Date {
    const parts = label.split(' ');
    const year = parseInt(parts[1], 10);
    const monthIdx = ['January','February','March','April','May','June','July','August','September','October','November','December'].indexOf(parts[0]);
    return new Date(year, monthIdx, 1);
}

// Helper: format Date to 'YYYY-MM' for input[type=month]
function toMonthInput(label: string): string {
    const d = parseMonth(label);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function fromMonthInput(val: string): Date {
    const [y, m] = val.split('-').map(Number);
    return new Date(y, m - 1, 1);
}

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const SHORT_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function FinanceReportsPage() {
    const { data: dashboardData } = useFinanceDashboard();
    const dashboard = dashboardData as any;
    const { data: invoicesData } = useInvoices();
    const allInvoices: any[] = ((invoicesData as any)?.items ?? (invoicesData as any)?.data ?? (Array.isArray(invoicesData) ? invoicesData : []));
    const { data: commissionsData } = useCommissions();
    const allCommissions: any[] = ((commissionsData as any)?.items ?? (commissionsData as any)?.data ?? (Array.isArray(commissionsData) ? commissionsData : []));

    // Build monthlyRevenue from invoices
    const monthlyRevenue = useMemo(() => {
        const map: Record<string, { premiumCollected: number; commissionsEarned: number }> = {};
        allInvoices.forEach((inv: any) => {
            const d = new Date(inv.createdAt || inv.dateIssued || inv.dateDue);
            const key = `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
            if (!map[key]) map[key] = { premiumCollected: 0, commissionsEarned: 0 };
            map[key].premiumCollected += (inv.amount || 0);
        });
        allCommissions.forEach((c: any) => {
            const d = new Date(c.datePolicyIssued || c.createdAt);
            const key = `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
            if (!map[key]) map[key] = { premiumCollected: 0, commissionsEarned: 0 };
            map[key].commissionsEarned += (c.commissionAmount || 0);
        });
        return Object.entries(map)
            .map(([month, data]) => ({ month, shortMonth: SHORT_MONTHS[MONTH_NAMES.indexOf(month.split(' ')[0])], ...data }))
            .sort((a, b) => parseMonth(a.month).getTime() - parseMonth(b.month).getTime());
    }, [allInvoices, allCommissions]);

    // Build aging buckets from outstanding invoices
    const agingBuckets = useMemo(() => {
        const now = Date.now();
        const buckets = [
            { days: '0-30', label: '0–30 Days', color: 'bg-success-500', amount: 0, count: 0 },
            { days: '31-60', label: '31–60 Days', color: 'bg-amber-500', amount: 0, count: 0 },
            { days: '61-90', label: '61–90 Days', color: 'bg-orange-500', amount: 0, count: 0 },
            { days: '90+', label: '90+ Days', color: 'bg-danger-500', amount: 0, count: 0 },
        ];
        allInvoices.filter((i: any) => i.status === 'OUTSTANDING' || i.status === 'OVERDUE').forEach((inv: any) => {
            const daysPast = Math.floor((now - new Date(inv.dateDue).getTime()) / 86400000);
            const idx = daysPast <= 30 ? 0 : daysPast <= 60 ? 1 : daysPast <= 90 ? 2 : 3;
            buckets[idx].amount += (inv.amount || 0) - (inv.amountPaid || 0);
            buckets[idx].count += 1;
        });
        return buckets;
    }, [allInvoices]);

    // Top clients by premium
    const topClients = useMemo(() => {
        const map: Record<string, { clientId: string; clientName: string; totalPremium: number; policyCount: number }> = {};
        allInvoices.forEach((inv: any) => {
            const id = inv.clientId || 'unknown';
            if (!map[id]) map[id] = { clientId: id, clientName: inv.clientName || 'Unknown', totalPremium: 0, policyCount: 0 };
            map[id].totalPremium += (inv.amount || 0);
            map[id].policyCount += 1;
        });
        return Object.values(map).sort((a, b) => b.totalPremium - a.totalPremium).slice(0, 10);
    }, [allInvoices]);

    // Product breakdown from commissions
    const productBreakdown = useMemo(() => {
        const colors = ['bg-primary-500', 'bg-amber-500', 'bg-success-500', 'bg-violet-500', 'bg-rose-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-orange-500'];
        const map: Record<string, { product: string; premium: number; commission: number; count: number }> = {};
        allCommissions.forEach((c: any) => {
            const prod = c.productType || 'Other';
            if (!map[prod]) map[prod] = { product: prod, premium: 0, commission: 0, count: 0 };
            map[prod].premium += (c.premiumAmount || 0);
            map[prod].commission += (c.commissionAmount || 0);
            map[prod].count += 1;
        });
        return Object.values(map).sort((a, b) => b.premium - a.premium).map((p, i) => ({ ...p, color: colors[i % colors.length] }));
    }, [allCommissions]);

    const totalAging = agingBuckets.reduce((s, b) => s + b.amount, 0);
    const totalProductPremium = productBreakdown.reduce((s, p) => s + p.premium, 0);
    const totalPremium = allInvoices.reduce((s: number, i: any) => s + (i.amount || 0), 0);
    const totalPaid = allInvoices.filter((i: any) => i.status === 'PAID').reduce((s: number, i: any) => s + (i.amount || 0), 0);
    const collectionRate = totalPremium > 0 ? Math.round((totalPaid / totalPremium) * 100) : 0;
    const reportSummary = { collectionRate, avgDaysToCollect: dashboard?.avgDaysToCollect ?? 28, totalOutstanding: totalAging };

    const allMonths = monthlyRevenue.map(m => m.month);
    const earliestMonth = allMonths.length > 0 ? allMonths[0] : '';
    const latestMonth = allMonths.length > 0 ? allMonths[allMonths.length - 1] : '';

    const defaultFrom = allMonths.length >= 6 ? toMonthInput(allMonths[allMonths.length - 6]) : (earliestMonth ? toMonthInput(earliestMonth) : '');
    const defaultTo = latestMonth ? toMonthInput(latestMonth) : '';

    const [fromMonth, setFromMonth] = useState(defaultFrom);
    const [toMonth, setToMonth] = useState(defaultTo);

    // Filter monthly revenue by selected range
    const filteredRevenue = useMemo(() => {
        if (!fromMonth && !toMonth) return monthlyRevenue;
        const from = fromMonth ? fromMonthInput(fromMonth) : new Date(0);
        const to = toMonth ? fromMonthInput(toMonth) : new Date(9999, 11);
        return monthlyRevenue.filter(m => {
            const d = parseMonth(m.month);
            return d >= from && d <= to;
        });
    }, [fromMonth, toMonth]);

    const filteredMaxRevenue = Math.max(...filteredRevenue.map(m => m.premiumCollected), 1);
    const filteredMaxCommission = Math.max(...filteredRevenue.map(m => m.commissionsEarned), 1);

    // Recompute summary KPIs based on filtered range
    const filteredSummary = useMemo(() => {
        const totalPrem = filteredRevenue.reduce((s, m) => s + m.premiumCollected, 0);
        const totalComm = filteredRevenue.reduce((s, m) => s + m.commissionsEarned, 0);
        const peak = filteredRevenue.length > 0
            ? filteredRevenue.reduce((best, m) => m.premiumCollected > best.premiumCollected ? m : best).month
            : 'N/A';
        return {
            totalPremiumYTD: +totalPrem.toFixed(2),
            totalCommissionYTD: +totalComm.toFixed(2),
            collectionRate: reportSummary.collectionRate,
            avgDaysToCollect: reportSummary.avgDaysToCollect,
            totalOutstanding: reportSummary.totalOutstanding,
            peakMonth: peak,
        };
    }, [filteredRevenue]);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <BackButton href="/dashboard/finance" />
                    <div>
                        <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Financial Reports</h1>
                        <p className="text-sm text-surface-500 mt-1">Revenue trends, collection rates, and portfolio analytics.</p>
                    </div>
                </div>
                <Button variant="outline" leftIcon={<Download size={16} />} onClick={() => {
                    const data = {
                        summary: reportSummary,
                        monthlyRevenue: filteredRevenue,
                        agingBuckets,
                        topClients,
                        productBreakdown,
                    };
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a'); a.href = url; a.download = 'finance-report.json'; a.click();
                    URL.revokeObjectURL(url);
                }}>Export Report</Button>
            </div>

            {/* Date Range Picker */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-surface-500">
                    <CalendarRange size={16} className="text-surface-400" />
                    <span className="font-semibold">Period:</span>
                </div>
                <input
                    type="month"
                    value={fromMonth}
                    onChange={(e) => setFromMonth(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-surface-200 text-sm font-medium text-surface-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none bg-white dark:bg-slate-800"
                />
                <span className="text-surface-400 text-sm">to</span>
                <input
                    type="month"
                    value={toMonth}
                    onChange={(e) => setToMonth(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-surface-200 text-sm font-medium text-surface-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none bg-white dark:bg-slate-800"
                />
                {(fromMonth !== defaultFrom || toMonth !== defaultTo) && (
                    <button
                        onClick={() => { setFromMonth(defaultFrom); setToMonth(defaultTo); }}
                        className="text-xs font-semibold text-primary-600 hover:text-primary-800 transition-colors cursor-pointer"
                    >
                        Reset
                    </button>
                )}
            </div>

            {/* Summary Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                    { label: 'Premium YTD', value: formatCurrency(filteredSummary.totalPremiumYTD), color: 'text-primary-600', bg: 'bg-primary-50' },
                    { label: 'Commission YTD', value: formatCurrency(filteredSummary.totalCommissionYTD), color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Collection Rate', value: `${filteredSummary.collectionRate}%`, color: 'text-success-600', bg: 'bg-success-50' },
                    { label: 'Avg Days to Collect', value: `${filteredSummary.avgDaysToCollect} days`, color: 'text-violet-600', bg: 'bg-violet-50' },
                    { label: 'Outstanding', value: formatCurrency(filteredSummary.totalOutstanding), color: 'text-warning-600', bg: 'bg-warning-50' },
                    { label: 'Peak Month', value: filteredSummary.peakMonth, color: 'text-surface-600', bg: 'bg-surface-50' },
                ].map((stat, i) => (
                    <Card key={i} padding="none" className={cn('p-4 hover:shadow-md transition-shadow', stat.bg)}>
                        <p className="text-[10px] font-bold text-surface-500 uppercase tracking-wider">{stat.label}</p>
                        <p className={cn('text-base font-bold mt-1', stat.color)}>{stat.value}</p>
                    </Card>
                ))}
            </div>

            {/* Revenue Bar Chart */}
            <Card padding="lg">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <BarChart3 size={18} className="text-surface-400" />
                        <CardHeader title={`Monthly Revenue — ${filteredRevenue.length} Months`} />
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-primary-500 inline-block" /> Premium</span>
                        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-amber-400 inline-block" /> Commission</span>
                    </div>
                </div>
                <div className="flex items-end gap-1.5 h-48 overflow-x-auto pb-2">
                    {filteredRevenue.map((m) => {
                        const revPct = Math.round((m.premiumCollected / filteredMaxRevenue) * 100);
                        const comPct = Math.round((m.commissionsEarned / filteredMaxRevenue) * 100);
                        return (
                            <div key={m.month} className="flex flex-col items-center gap-1 min-w-[36px] flex-1 group">
                                <div className="w-full flex items-end gap-0.5 h-40 relative">
                                    {/* Revenue bar */}
                                    <div
                                        className="flex-1 bg-primary-500 rounded-t-sm opacity-80 group-hover:opacity-100 transition-all duration-500"
                                        style={{ height: `${revPct}%` }}
                                        title={`Premium: ${formatCurrency(m.premiumCollected)}`}
                                    />
                                    {/* Commission bar */}
                                    <div
                                        className="flex-1 bg-amber-400 rounded-t-sm opacity-80 group-hover:opacity-100 transition-all duration-500"
                                        style={{ height: `${comPct}%` }}
                                        title={`Commission: ${formatCurrency(m.commissionsEarned)}`}
                                    />
                                    {/* Tooltip on hover */}
                                    <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-surface-900 text-white text-[10px] rounded-lg px-2 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-lg">
                                        <p className="font-bold">{m.month}</p>
                                        <p className="text-primary-300">{formatCurrency(m.premiumCollected)}</p>
                                        <p className="text-amber-300">{formatCurrency(m.commissionsEarned)} comm.</p>
                                    </div>
                                </div>
                                <span className="text-[10px] text-surface-400 font-medium">{m.shortMonth}</span>
                            </div>
                        );
                    })}
                </div>
            </Card>

            {/* Two column: Aging + Top Clients */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Outstanding Aging Analysis */}
                <Card padding="lg">
                    <div className="flex items-center gap-2 mb-5">
                        <AlertTriangle size={16} className="text-warning-500" />
                        <CardHeader title="Outstanding Aging Analysis" />
                    </div>
                    <div className="space-y-4">
                        {agingBuckets.map((bucket) => {
                            const pct = Math.round((bucket.amount / totalAging) * 100);
                            return (
                                <div key={bucket.days}>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div>
                                            <span className="text-sm font-semibold text-surface-800">{bucket.label}</span>
                                            <span className="ml-2 text-xs text-surface-400">{bucket.count} invoices</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm font-bold tabular-nums">{formatCurrency(bucket.amount)}</span>
                                            <span className="ml-2 text-xs text-surface-400">{pct}%</span>
                                        </div>
                                    </div>
                                    <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
                                        <div
                                            className={cn('h-full rounded-full transition-all duration-700', bucket.color)}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                        <div className="mt-4 pt-4 border-t border-surface-100 flex justify-between text-sm">
                            <span className="text-surface-500 font-medium">Total Outstanding</span>
                            <span className="font-bold text-surface-900 tabular-nums">{formatCurrency(totalAging)}</span>
                        </div>
                    </div>
                </Card>

                {/* Top Clients by Premium */}
                <Card padding="lg">
                    <div className="flex items-center gap-2 mb-5">
                        <TrendingUp size={16} className="text-primary-500" />
                        <CardHeader title="Top Clients by Premium" />
                    </div>
                    <div className="space-y-3">
                        {topClients.map((client, i) => (
                            <Link
                                key={client.clientId}
                                href={`/dashboard/clients/${client.clientId}`}
                                className="flex items-center gap-4 p-3 rounded-[var(--radius-md)] hover:bg-surface-50 transition-colors group block"
                            >
                                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center shrink-0 text-sm font-bold">
                                    {i + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-surface-900 group-hover:text-primary-600 transition-colors truncate">
                                        {client.clientName}
                                    </p>
                                    <p className="text-xs text-surface-400">{client.policyCount} polic{client.policyCount !== 1 ? 'ies' : 'y'}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-sm font-bold text-surface-900 tabular-nums">{formatCurrency(client.totalPremium)}</p>
                                    <ArrowUpRight size={14} className="ml-auto text-surface-300 group-hover:text-primary-500 transition-colors" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Product Premium Breakdown */}
            <Card padding="lg">
                <div className="flex items-center gap-2 mb-5">
                    <PieChart size={16} className="text-surface-400" />
                    <CardHeader title="Premium by Insurance Type" />
                </div>
                <div className="space-y-3">
                    {productBreakdown.map((product) => {
                        const pct = Math.round((product.premium / totalProductPremium) * 100);
                        return (
                            <div key={product.product} className="flex items-center gap-4">
                                <div className={cn('w-3 h-3 rounded-sm shrink-0', product.color)} />
                                <div className="w-48 shrink-0">
                                    <p className="text-sm font-medium text-surface-800 truncate">{product.product}</p>
                                    <p className="text-xs text-surface-400">{product.count} polic{product.count !== 1 ? 'ies' : 'y'}</p>
                                </div>
                                <div className="flex-1 h-2 bg-surface-100 rounded-full overflow-hidden">
                                    <div
                                        className={cn('h-full rounded-full transition-all duration-700', product.color)}
                                        style={{ width: `${Math.max(pct, 1)}%` }}
                                    />
                                </div>
                                <div className="w-28 text-right shrink-0">
                                    <p className="text-sm font-bold tabular-nums">{formatCurrency(product.premium)}</p>
                                    <p className="text-xs text-success-600">{formatCurrency(product.commission)} comm.</p>
                                </div>
                                <div className="w-10 text-right shrink-0 text-xs text-surface-400 font-medium">{pct}%</div>
                            </div>
                        );
                    })}
                </div>
            </Card>

            {/* Collection Rate Indicator */}
            <Card padding="lg">
                <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 size={16} className="text-success-500" />
                    <CardHeader title="Collection Rate" />
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex-1 h-4 bg-surface-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-success-400 to-success-600 rounded-full transition-all duration-1000"
                            style={{ width: `${reportSummary.collectionRate}%` }}
                        />
                    </div>
                    <div className="shrink-0 text-right">
                        <span className="text-2xl font-bold text-success-600">{reportSummary.collectionRate}%</span>
                        <p className="text-xs text-surface-400 mt-0.5">Avg. {reportSummary.avgDaysToCollect} days to collect</p>
                    </div>
                </div>
                <p className="text-xs text-surface-400 mt-3">Target: ≥90% collection rate. Industry benchmark for Ghanaian insurance brokers is 75–85%.</p>
            </Card>
        </div>
    );
}
