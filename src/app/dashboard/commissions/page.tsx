'use client';

import { useState } from 'react';
import {
    DollarSign,
    CheckCircle2,
    Clock,
    AlertTriangle,
    Filter,
    Download,
    TrendingUp,
    ArrowDownRight,
} from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-display/data-table';
import { StatusBadge } from '@/components/data-display/status-badge';
import { commissions, commissionSummary } from '@/mock/commissions';
import { formatCurrency, formatDate, cn } from '@/lib/utils';

const STATS = [
    {
        label: 'Total Earned',
        value: formatCurrency(commissionSummary.totalEarned),
        icon: TrendingUp,
        color: 'text-success-600',
        bg: 'bg-success-50',
    },
    {
        label: 'Paid Out',
        value: formatCurrency(commissionSummary.totalPaid),
        icon: CheckCircle2,
        color: 'text-primary-600',
        bg: 'bg-primary-50',
    },
    {
        label: 'Pending Payment',
        value: formatCurrency(commissionSummary.totalPending),
        icon: Clock,
        color: 'text-warning-600',
        bg: 'bg-warning-50',
    },
    {
        label: 'Clawback',
        value: formatCurrency(commissionSummary.totalClawback),
        icon: ArrowDownRight,
        color: 'text-danger-600',
        bg: 'bg-danger-50',
    },
];

export default function CommissionsPage() {
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const filtered = statusFilter === 'all'
        ? commissions
        : commissions.filter(c => c.status === statusFilter);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Commissions</h1>
                    <p className="text-sm text-surface-500 mt-1">Track broker earnings, payouts, and clawbacks.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" leftIcon={<Download size={16} />}>Export Statement</Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {STATS.map((stat, i) => (
                    <Card key={i} padding="none" className="p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className={cn('p-3 rounded-full', stat.bg, stat.color)}>
                            <stat.icon size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider">{stat.label}</p>
                            <p className="text-xl font-bold text-surface-900 mt-0.5">{stat.value}</p>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Commission Ledger */}
            <DataTable
                data={filtered}
                columns={[
                    {
                        key: 'policyNumber',
                        label: 'Policy #',
                        sortable: true,
                        render: (c) => <span className="font-mono font-medium text-primary-600">{c.policyNumber}</span>
                    },
                    { key: 'clientName', label: 'Client', sortable: true },
                    { key: 'productType', label: 'Product', sortable: true },
                    { key: 'brokerName', label: 'Broker', sortable: true },
                    {
                        key: 'commissionRate',
                        label: 'Rate',
                        sortable: true,
                        render: (c) => <span className="font-medium">{c.commissionRate}%</span>
                    },
                    {
                        key: 'premiumAmount',
                        label: 'Premium',
                        sortable: true,
                        render: (c) => formatCurrency(c.premiumAmount)
                    },
                    {
                        key: 'commissionAmount',
                        label: 'Commission',
                        sortable: true,
                        render: (c) => <span className="font-bold text-surface-900">{formatCurrency(c.commissionAmount)}</span>
                    },
                    {
                        key: 'status',
                        label: 'Status',
                        sortable: true,
                        render: (c) => <StatusBadge status={c.status} />
                    },
                    {
                        key: 'datePolicyIssued',
                        label: 'Issued',
                        sortable: true,
                        render: (c) => formatDate(c.datePolicyIssued)
                    },
                ]}
                searchKeys={['policyNumber', 'clientName', 'brokerName', 'productType']}
                headerActions={
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Filter size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-surface-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="pl-8 pr-3 py-2 text-xs font-medium bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 appearance-none cursor-pointer"
                            >
                                <option value="all">All Statuses</option>
                                <option value="earned">Earned</option>
                                <option value="paid">Paid</option>
                                <option value="pending">Pending</option>
                                <option value="clawback">Clawback</option>
                            </select>
                        </div>
                    </div>
                }
            />
        </div>
    );
}
