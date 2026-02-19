'use client';

import {
    BarChart3,
    TrendingUp,
    Download,
    AlertTriangle,
    CheckCircle2,
    ArrowUpRight,
    PieChart,
} from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BackButton } from '@/components/ui/back-button';
import {
    monthlyRevenue,
    agingBuckets,
    topClients,
    productBreakdown,
    reportSummary,
} from '@/mock/finance-reports';
import { formatCurrency, cn } from '@/lib/utils';
import Link from 'next/link';

const maxRevenue = Math.max(...monthlyRevenue.map(m => m.premiumCollected));
const maxCommission = Math.max(...monthlyRevenue.map(m => m.commissionsEarned));
const totalAging = agingBuckets.reduce((s, b) => s + b.amount, 0);
const totalProductPremium = productBreakdown.reduce((s, p) => s + p.premium, 0);

export default function FinanceReportsPage() {
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
                <Button variant="outline" leftIcon={<Download size={16} />}>Export Report</Button>
            </div>

            {/* Summary Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                    { label: 'Premium YTD', value: formatCurrency(reportSummary.totalPremiumYTD), color: 'text-primary-600', bg: 'bg-primary-50' },
                    { label: 'Commission YTD', value: formatCurrency(reportSummary.totalCommissionYTD), color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Collection Rate', value: `${reportSummary.collectionRate}%`, color: 'text-success-600', bg: 'bg-success-50' },
                    { label: 'Avg Days to Collect', value: `${reportSummary.avgDaysToCollect} days`, color: 'text-violet-600', bg: 'bg-violet-50' },
                    { label: 'Outstanding', value: formatCurrency(reportSummary.totalOutstanding), color: 'text-warning-600', bg: 'bg-warning-50' },
                    { label: 'Peak Month', value: 'Feb 2025', color: 'text-surface-600', bg: 'bg-surface-50' },
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
                        <CardHeader title="Monthly Revenue — Last 12 Months" />
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-primary-500 inline-block" /> Premium</span>
                        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-amber-400 inline-block" /> Commission</span>
                    </div>
                </div>
                <div className="flex items-end gap-1.5 h-48 overflow-x-auto pb-2">
                    {monthlyRevenue.map((m) => {
                        const revPct = Math.round((m.premiumCollected / maxRevenue) * 100);
                        const comPct = Math.round((m.commissionsEarned / maxRevenue) * 100);
                        return (
                            <div key={m.shortMonth} className="flex flex-col items-center gap-1 min-w-[36px] flex-1 group">
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
