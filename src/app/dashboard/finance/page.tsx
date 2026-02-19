'use client';

import { useState } from 'react';
import {
    DollarSign,
    CheckCircle2,
    Clock,
    AlertTriangle,
    Download,
    Plus,
    FileText,
    CreditCard,
    PieChart,
    BarChart3,
    ArrowRight,
    TrendingUp,
    Receipt,
} from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/data-display/status-badge';
import { invoices, receipts, financeSummary } from '@/mock/finance';
import { commissionSummary } from '@/mock/commissions';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import Link from 'next/link';

const MODULE_CARDS = [
    {
        label: 'Invoices',
        desc: 'Manage premium invoices',
        href: '/dashboard/finance/invoices',
        icon: FileText,
        color: 'text-primary-600',
        bg: 'bg-primary-50',
        border: 'border-primary-100',
    },
    {
        label: 'Payments',
        desc: 'Track all payment receipts',
        href: '/dashboard/finance/payments',
        icon: CreditCard,
        color: 'text-success-600',
        bg: 'bg-success-50',
        border: 'border-success-100',
    },
    {
        label: 'Commissions',
        desc: 'Broker earnings & payouts',
        href: '/dashboard/finance/commissions',
        icon: PieChart,
        color: 'text-amber-600',
        bg: 'bg-amber-50',
        border: 'border-amber-100',
    },
    {
        label: 'Reports',
        desc: 'Financial analytics & trends',
        href: '/dashboard/finance/reports',
        icon: BarChart3,
        color: 'text-violet-600',
        bg: 'bg-violet-50',
        border: 'border-violet-100',
    },
];

const KPI_STATS = [
    {
        label: 'Total Revenue',
        value: formatCurrency(financeSummary.totalRevenue),
        icon: TrendingUp,
        color: 'text-primary-600',
        bg: 'bg-primary-50',
    },
    {
        label: 'Collected',
        value: formatCurrency(financeSummary.collected),
        icon: CheckCircle2,
        color: 'text-success-600',
        bg: 'bg-success-50',
    },
    {
        label: 'Outstanding',
        value: formatCurrency(financeSummary.outstanding),
        icon: Clock,
        color: 'text-warning-600',
        bg: 'bg-warning-50',
    },
    {
        label: 'Overdue',
        value: formatCurrency(financeSummary.overdue),
        icon: AlertTriangle,
        color: 'text-danger-600',
        bg: 'bg-danger-50',
    },
    {
        label: 'Commissions Earned',
        value: formatCurrency(commissionSummary.totalEarned),
        icon: DollarSign,
        color: 'text-amber-600',
        bg: 'bg-amber-50',
    },
];

const STATUS_LABEL: Record<string, string> = {
    paid: 'Paid',
    outstanding: 'Outstanding',
    overdue: 'Overdue',
    partial: 'Partial',
    cancelled: 'Cancelled',
};

export default function FinanceOverviewPage() {
    const recentInvoices = invoices.slice(-5).reverse();
    const recentPayments = receipts.slice(-5).reverse();
    const overdueInvoices = invoices.filter(i => i.status === 'overdue');

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Finance</h1>
                    <p className="text-sm text-surface-500 mt-1">Premium collection, commissions & financial reporting.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" leftIcon={<Download size={16} />}>Export</Button>
                    <Button variant="primary" leftIcon={<Plus size={16} />} onClick={() => window.location.href = '/dashboard/finance/invoices'}>New Invoice</Button>
                </div>
            </div>

            {/* Overdue Alert */}
            {overdueInvoices.length > 0 && (
                <div className="bg-danger-50 border border-danger-200 rounded-[var(--radius-lg)] p-4 flex items-center gap-3">
                    <AlertTriangle className="text-danger-600 shrink-0" size={18} />
                    <div className="flex-1">
                        <p className="text-sm font-bold text-danger-800">{overdueInvoices.length} overdue invoice{overdueInvoices.length > 1 ? 's' : ''} require attention</p>
                        <p className="text-xs text-danger-700 mt-0.5">Total overdue: {formatCurrency(financeSummary.overdue)}</p>
                    </div>
                    <Link href="/dashboard/finance/invoices?status=overdue">
                        <Button variant="outline" size="sm" className="text-danger-700 border-danger-200 hover:bg-danger-100">View Overdue</Button>
                    </Link>
                </div>
            )}

            {/* KPI Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {KPI_STATS.map((stat, i) => (
                    <Card key={i} padding="none" className="p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
                        <div className={cn('p-2.5 rounded-full shrink-0', stat.bg, stat.color)}>
                            <stat.icon size={18} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-bold text-surface-500 uppercase tracking-wider truncate">{stat.label}</p>
                            <p className="text-base font-bold text-surface-900 mt-0.5 tabular-nums">{stat.value}</p>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Module Quick-Access */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {MODULE_CARDS.map((mod) => (
                    <Link key={mod.label} href={mod.href}>
                        <div className={cn(
                            'p-5 rounded-[var(--radius-lg)] border bg-white hover:shadow-md transition-all group cursor-pointer',
                            mod.border
                        )}>
                            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', mod.bg, mod.color)}>
                                <mod.icon size={20} />
                            </div>
                            <p className="font-bold text-surface-900 text-sm">{mod.label}</p>
                            <p className="text-xs text-surface-500 mt-0.5">{mod.desc}</p>
                            <div className={cn('flex items-center gap-1 mt-3 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity', mod.color)}>
                                Go to {mod.label} <ArrowRight size={12} />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Two-column: Recent Invoices + Recent Payments */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Invoices */}
                <Card padding="lg">
                    <div className="flex items-center justify-between mb-4">
                        <CardHeader title="Recent Invoices" />
                        <Link href="/dashboard/finance/invoices" className="text-xs text-primary-600 font-semibold hover:underline flex items-center gap-1">
                            View all <ArrowRight size={12} />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {recentInvoices.map((inv) => (
                            <div key={inv.id} className="flex items-center justify-between py-2.5 border-b border-surface-100 last:border-0">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-mono font-bold text-primary-600">{inv.invoiceNumber}</span>
                                        <StatusBadge status={inv.status} />
                                    </div>
                                    <p className="text-xs text-surface-500 mt-0.5">{inv.clientName}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-surface-900 tabular-nums">{formatCurrency(inv.amount)}</p>
                                    <p className="text-[10px] text-surface-400">Due {formatDate(inv.dateDue)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Recent Payments */}
                <Card padding="lg">
                    <div className="flex items-center justify-between mb-4">
                        <CardHeader title="Recent Payments" />
                        <Link href="/dashboard/finance/payments" className="text-xs text-primary-600 font-semibold hover:underline flex items-center gap-1">
                            View all <ArrowRight size={12} />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {recentPayments.map((rec) => (
                            <div key={rec.id} className="flex items-center justify-between py-2.5 border-b border-surface-100 last:border-0">
                                <div>
                                    <span className="text-xs font-mono font-bold text-success-600">{rec.receiptNumber}</span>
                                    <p className="text-xs text-surface-500 mt-0.5">{rec.clientName}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-surface-900 tabular-nums">+{formatCurrency(rec.amount)}</p>
                                    <p className="text-[10px] text-surface-400">{formatDate(rec.dateReceived)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
