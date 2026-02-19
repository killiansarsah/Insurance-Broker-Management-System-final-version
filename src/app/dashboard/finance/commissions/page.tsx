'use client';

import { useState } from 'react';
import {
    TrendingUp,
    CheckCircle2,
    Clock,
    ArrowDownRight,
    Download,
    Users,
} from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-display/data-table';
import { StatusBadge } from '@/components/data-display/status-badge';
import { BackButton } from '@/components/ui/back-button';
import { commissions, commissionSummary, commissionsByBroker } from '@/mock/commissions';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { CustomSelect } from '@/components/ui/select-custom';
import Link from 'next/link';

const KPIS = [
    { label: 'Total Earned', value: formatCurrency(commissionSummary.totalEarned), icon: TrendingUp, color: 'text-success-600', bg: 'bg-success-50' },
    { label: 'Paid Out', value: formatCurrency(commissionSummary.totalPaid), icon: CheckCircle2, color: 'text-primary-600', bg: 'bg-primary-50' },
    { label: 'Pending Payment', value: formatCurrency(commissionSummary.totalPending), icon: Clock, color: 'text-warning-600', bg: 'bg-warning-50' },
    { label: 'Clawback', value: formatCurrency(commissionSummary.totalClawback), icon: ArrowDownRight, color: 'text-danger-600', bg: 'bg-danger-50' },
];

const brokerList = Object.values(commissionsByBroker).sort((a, b) => b.total - a.total);
const maxBrokerTotal = Math.max(...brokerList.map(b => b.total));

const BROKER_OPTIONS = [
    { label: 'All Brokers', value: 'all' },
    ...brokerList.map(b => ({ label: b.broker, value: b.broker })),
];

export default function CommissionsPage() {
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [brokerFilter, setBrokerFilter] = useState<string>('all');

    const filtered = commissions
        .filter(c => statusFilter === 'all' || c.status === statusFilter)
        .filter(c => brokerFilter === 'all' || c.brokerName === brokerFilter);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <BackButton href="/dashboard/finance" />
                    <div>
                        <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Commissions</h1>
                        <p className="text-sm text-surface-500 mt-1">Broker earnings, payouts, and clawbacks.</p>
                    </div>
                </div>
                <Button variant="outline" leftIcon={<Download size={16} />}>Export Statement</Button>
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {KPIS.map((kpi, i) => (
                    <Card key={i} padding="none" className="p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className={cn('p-3 rounded-full shrink-0', kpi.bg, kpi.color)}>
                            <kpi.icon size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider">{kpi.label}</p>
                            <p className="text-xl font-bold text-surface-900 mt-0.5 tabular-nums">{kpi.value}</p>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Broker Leaderboard */}
            <Card padding="lg">
                <div className="flex items-center gap-2 mb-4">
                    <Users size={16} className="text-surface-400" />
                    <CardHeader title="Broker Performance" />
                </div>
                <div className="space-y-3">
                    {brokerList.map((broker, i) => {
                        const pct = Math.round((broker.total / maxBrokerTotal) * 100);
                        return (
                            <div key={broker.broker} className="flex items-center gap-4">
                                <div className="w-6 text-center text-xs font-bold text-surface-400">#{i + 1}</div>
                                <div className="w-32 shrink-0">
                                    <p className="text-sm font-semibold text-surface-900 truncate">{broker.broker}</p>
                                    <p className="text-xs text-surface-400">{broker.count} policies</p>
                                </div>
                                <div className="flex-1 h-2 bg-surface-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-700"
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                                <div className="w-24 text-right shrink-0">
                                    <p className="text-sm font-bold text-surface-900 tabular-nums">{formatCurrency(broker.total)}</p>
                                    <p className="text-xs text-success-600">{formatCurrency(broker.paid)} paid</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>

            {/* Commission Ledger */}
            <DataTable
                data={filtered}
                columns={[
                    {
                        key: 'policyNumber',
                        label: 'Policy #',
                        sortable: true,
                        render: (c) => (
                            <Link
                                href={`/dashboard/policies/${c.policyId}`}
                                className="font-mono font-bold text-xs text-primary-600 hover:underline underline-offset-2"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {c.policyNumber}
                            </Link>
                        ),
                    },
                    {
                        key: 'clientName',
                        label: 'Client',
                        sortable: true,
                        render: (c) => (
                            <Link
                                href={`/dashboard/clients/${c.clientId}`}
                                className="text-sm font-medium text-surface-900 hover:text-primary-600 hover:underline underline-offset-2"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {c.clientName}
                            </Link>
                        ),
                    },
                    { key: 'productType', label: 'Product', sortable: true, render: (c) => <span className="text-xs text-surface-600">{c.productType}</span> },
                    { key: 'brokerName', label: 'Broker', sortable: true, render: (c) => <span className="text-sm font-medium">{c.brokerName}</span> },
                    {
                        key: 'commissionRate',
                        label: 'Rate',
                        sortable: true,
                        render: (c) => <span className="text-sm font-semibold text-surface-700">{c.commissionRate}%</span>,
                    },
                    {
                        key: 'premiumAmount',
                        label: 'Premium',
                        sortable: true,
                        render: (c) => <span className="text-sm tabular-nums text-surface-600">{formatCurrency(c.premiumAmount)}</span>,
                    },
                    {
                        key: 'commissionAmount',
                        label: 'Commission',
                        sortable: true,
                        render: (c) => <span className="font-bold text-sm tabular-nums text-surface-900">{formatCurrency(c.commissionAmount)}</span>,
                    },
                    {
                        key: 'status',
                        label: 'Status',
                        sortable: true,
                        render: (c) => <StatusBadge status={c.status} />,
                    },
                    {
                        key: 'datePolicyIssued',
                        label: 'Issued',
                        sortable: true,
                        render: (c) => <span className="text-xs text-surface-500">{formatDate(c.datePolicyIssued)}</span>,
                    },
                ]}
                searchKeys={['policyNumber', 'clientName', 'brokerName', 'productType']}
                headerActions={
                    <div className="flex items-center gap-2">
                        <CustomSelect
                            label="Broker"
                            options={BROKER_OPTIONS}
                            value={brokerFilter}
                            onChange={(v) => setBrokerFilter(v as string)}
                        />
                        <CustomSelect
                            label="Status"
                            options={[
                                { label: 'All Statuses', value: 'all' },
                                { label: 'Earned', value: 'earned' },
                                { label: 'Paid', value: 'paid' },
                                { label: 'Pending', value: 'pending' },
                                { label: 'Clawback', value: 'clawback' },
                            ]}
                            value={statusFilter}
                            onChange={(v) => setStatusFilter(v as string)}
                        />
                    </div>
                }
            />
        </div>
    );
}
