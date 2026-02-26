'use client';

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    FileText,
    Plus,
    TrendingUp,
    Clock,
    AlertCircle,
    X,
    Download,
    Eye,
    Pencil,
    RotateCcw,
    Ban,
    CalendarDays,
    ShieldAlert,
    Activity,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-display/data-table';
import { StatusBadge } from '@/components/data-display/status-badge';
import { CustomSelect } from '@/components/ui/select-custom';
import { mockPolicies } from '@/mock/policies';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import type { Policy, PolicyStatus, InsuranceType } from '@/types';
import Link from 'next/link';
import { toast } from 'sonner';

const INSURANCE_TYPES: { label: string; value: InsuranceType }[] = [
    { label: 'Motor', value: 'motor' },
    { label: 'Fire', value: 'fire' },
    { label: 'Marine', value: 'marine' },
    { label: 'Life', value: 'life' },
    { label: 'Health', value: 'health' },
    { label: 'Liability', value: 'liability' },
    { label: 'Engineering', value: 'engineering' },
    { label: 'Bonds', value: 'bonds' },
    { label: 'Travel', value: 'travel' },
    { label: 'Agriculture', value: 'agriculture' },
    { label: 'Oil & Gas', value: 'oil_gas' },
    { label: 'Aviation', value: 'aviation' },
    { label: 'Professional Indemnity', value: 'professional_indemnity' },
    { label: 'Other', value: 'other' },
];

const BROKERS = Array.from(new Set(mockPolicies.map(p => p.brokerName))).sort().map(b => ({ label: b, value: b }));

function exportToCsv(policies: Policy[]) {
    const headers = ['Policy #', 'Client', 'Type', 'Coverage', 'Status', 'Insurer', 'Premium (GHS)', 'Sum Insured (GHS)', 'Inception', 'Expiry', 'Broker', 'Commission Rate', 'Commission Amt', 'Payment Status'];
    const rows = policies.map(p => [
        p.policyNumber, p.clientName, p.insuranceType, p.coverageType || '', p.status,
        p.insurerName, p.premiumAmount.toFixed(2), p.sumInsured.toFixed(2),
        p.inceptionDate, p.expiryDate, p.brokerName,
        `${p.commissionRate}%`, p.commissionAmount.toFixed(2), p.paymentStatus,
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `policies-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${policies.length} policies to CSV`);
}

export default function PoliciesPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const typeParam = searchParams.get('type') as 'motor' | 'non-motor' | null;

    const [filterStatus, setFilterStatus] = useState<PolicyStatus | ''>('');
    const [filterType, setFilterType] = useState<InsuranceType | ''>('');
    const [filterBroker, setFilterBroker] = useState('');
    const [filterDateFrom, setFilterDateFrom] = useState('');
    const [filterDateTo, setFilterDateTo] = useState('');

    // base filtering on 'type' query param
    const baseData = useMemo(() => mockPolicies.filter((p) => {
        if (!typeParam) return true;
        if (typeParam === 'motor') return p.insuranceType === 'motor';
        if (typeParam === 'non-motor') return p.insuranceType !== 'motor';
        return true;
    }), [typeParam]);

    const filtered = useMemo(() => baseData.filter((p) => {
        if (filterStatus && p.status !== filterStatus) return false;
        if (filterType && p.insuranceType !== filterType) return false;
        if (filterBroker && p.brokerName !== filterBroker) return false;
        if (filterDateFrom && p.inceptionDate < filterDateFrom) return false;
        if (filterDateTo && p.inceptionDate > filterDateTo) return false;
        return true;
    }), [baseData, filterStatus, filterType, filterBroker, filterDateFrom, filterDateTo]);

    // KPI Calculations
    const activePolicies = baseData.filter((p) => p.status === 'active');
    const totalPremium = baseData.reduce((s, p) => s + p.premiumAmount, 0);
    const expiringSoon = baseData.filter((p) => (p.daysToExpiry ?? 999) <= 30 && p.status === 'active');
    const pendingDraft = baseData.filter((p) => p.status === 'pending' || p.status === 'draft');
    const lapsedPolicies = baseData.filter((p) => p.status === 'lapsed');
    const newThisMonth = baseData.filter((p) => p.inceptionDate >= '2026-02-01' && p.inceptionDate <= '2026-02-28');

    const kpis = [
        {
            label: `Active ${typeParam ? (typeParam === 'motor' ? 'Motor' : 'Non-Motor') : ''} Policies`,
            value: activePolicies.length,
            icon: <FileText size={20} />,
            color: 'text-primary-500 bg-primary-50',
        },
        {
            label: 'Total Premium',
            value: formatCurrency(totalPremium),
            icon: <TrendingUp size={20} />,
            color: 'text-success-500 bg-success-50',
        },
        {
            label: 'Expiring ≤30d',
            value: expiringSoon.length,
            icon: <Clock size={20} />,
            color: 'text-accent-500 bg-accent-50',
        },
        {
            label: 'Pending / Draft',
            value: pendingDraft.length,
            icon: <AlertCircle size={20} />,
            color: 'text-warning-500 bg-warning-50',
        },
        {
            label: 'Lapsed',
            value: lapsedPolicies.length,
            icon: <ShieldAlert size={20} />,
            color: 'text-danger-500 bg-danger-50',
        },
        {
            label: 'New This Month',
            value: newThisMonth.length,
            icon: <Activity size={20} />,
            color: 'text-info-500 bg-info-50',
        },
    ];

    const hasFilters = filterStatus || filterType || filterBroker || filterDateFrom || filterDateTo;

    const columns = [
        {
            key: 'policyNumber',
            label: 'Policy #',
            sortable: true,
            render: (row: Policy) => (
                <span className="text-xs font-mono text-surface-500">{row.policyNumber}</span>
            ),
        },
        {
            key: 'clientName',
            label: 'Client',
            sortable: true,
            render: (row: Policy) => (
                <p className="text-sm font-semibold text-surface-900">{row.clientName}</p>
            ),
        },
        {
            key: 'insuranceType',
            label: 'Type',
            sortable: true,
            render: (row: Policy) => (
                <div>
                    <span className="text-sm text-surface-700 capitalize">{row.insuranceType.replace(/_/g, ' ')}</span>
                    {row.coverageType && (
                        <p className="text-[11px] text-surface-400">{row.coverageType}</p>
                    )}
                </div>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (row: Policy) => (
                <div className="flex items-center gap-2">
                    <StatusBadge status={row.status} />
                    {row.isRenewal && (
                        <span className="text-[10px] font-semibold text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded-full">RENEWAL</span>
                    )}
                </div>
            ),
        },
        {
            key: 'insurerName',
            label: 'Insurer',
            sortable: true,
            render: (row: Policy) => (
                <span className="text-sm text-surface-600">{row.insurerName}</span>
            ),
        },
        {
            key: 'premiumAmount',
            label: 'Premium',
            sortable: true,
            render: (row: Policy) => (
                <div>
                    <span className="text-sm font-semibold text-surface-700">{formatCurrency(row.premiumAmount)}</span>
                    {row.paymentStatus === 'overdue' && (
                        <span className="ml-1 text-[10px] font-semibold text-danger-600 bg-danger-50 px-1 py-0.5 rounded">OVERDUE</span>
                    )}
                    {row.paymentStatus === 'partial' && (
                        <span className="ml-1 text-[10px] font-semibold text-warning-600 bg-warning-50 px-1 py-0.5 rounded">PARTIAL</span>
                    )}
                </div>
            ),
        },
        {
            key: 'sumInsured',
            label: 'Sum Insured',
            sortable: true,
            render: (row: Policy) => (
                <span className="text-sm text-surface-600">{formatCurrency(row.sumInsured)}</span>
            ),
        },
        {
            key: 'inceptionDate',
            label: 'Period',
            render: (row: Policy) => (
                <div>
                    <span className="text-xs text-surface-500">
                        {formatDate(row.inceptionDate)} → {formatDate(row.expiryDate)}
                    </span>
                    {row.status === 'active' && row.daysToExpiry !== undefined && row.daysToExpiry <= 60 && (
                        <p className={cn('text-[10px] font-semibold', row.daysToExpiry <= 30 ? 'text-danger-600' : 'text-warning-600')}>
                            {row.daysToExpiry}d remaining
                        </p>
                    )}
                </div>
            ),
        },
        {
            key: 'brokerName',
            label: 'Broker',
            sortable: true,
            render: (row: Policy) => (
                <span className="text-sm text-surface-600">{row.brokerName}</span>
            ),
        },
        {
            key: 'actions' as keyof Policy,
            label: 'Actions',
            render: (row: Policy) => (
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                        className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-500 hover:text-primary-600 transition-colors cursor-pointer"
                        title="View"
                        onClick={() => router.push(`/dashboard/policies/${row.id}`)}
                    >
                        <Eye size={15} />
                    </button>
                    {row.status === 'active' && (
                        <button
                            className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-500 hover:text-success-600 transition-colors cursor-pointer"
                            title="Renew"
                            onClick={() => toast.info(`Renewal workflow for ${row.policyNumber} — navigate to detail page for full renewal.`)}
                        >
                            <RotateCcw size={15} />
                        </button>
                    )}
                    {(row.status === 'active' || row.status === 'pending') && (
                        <button
                            className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-500 hover:text-danger-600 transition-colors cursor-pointer"
                            title="Cancel"
                            onClick={() => toast.info(`Cancel workflow for ${row.policyNumber} — navigate to detail page for full cancellation.`)}
                        >
                            <Ban size={15} />
                        </button>
                    )}
                </div>
            ),
        },
    ];

    const getPageTitle = () => {
        if (typeParam === 'motor') return 'Motor Policies';
        if (typeParam === 'non-motor') return 'Non-Motor Policies';
        return 'All Policies';
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-surface-900 tracking-tight">{getPageTitle()}</h1>
                    <p className="text-sm text-surface-500 mt-1">
                        Manage {typeParam ? (typeParam === 'motor' ? 'motor' : 'non-motor') : 'insurance'} policies and renewals.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {typeParam && (
                        <Link href="/dashboard/policies">
                            <Button variant="outline" size="sm">View All</Button>
                        </Link>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Download size={14} />}
                        onClick={() => exportToCsv(filtered)}
                    >
                        Export CSV
                    </Button>
                    <Link href="/dashboard/policies/new">
                        <Button variant="primary" leftIcon={<Plus size={16} />}>New Policy</Button>
                    </Link>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {kpis.map((kpi) => (
                    <Card key={kpi.label} padding="md" className="relative overflow-hidden group">
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                'w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300',
                                kpi.color
                            )}>
                                {kpi.icon}
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-surface-900">{kpi.value}</p>
                                <p className="text-xs font-medium text-surface-500 uppercase tracking-wider">{kpi.label}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
                <CustomSelect
                    label="Status"
                    options={[
                        { label: 'Active', value: 'active' },
                        { label: 'Pending', value: 'pending' },
                        { label: 'Draft', value: 'draft' },
                        { label: 'Expired', value: 'expired' },
                        { label: 'Cancelled', value: 'cancelled' },
                        { label: 'Lapsed', value: 'lapsed' },
                        { label: 'Suspended', value: 'suspended' },
                    ]}
                    value={filterStatus}
                    onChange={(v) => setFilterStatus(String(v || '') as PolicyStatus | '')}
                    clearable
                />
                {!typeParam && (
                    <CustomSelect
                        label="Type"
                        options={INSURANCE_TYPES.map(t => ({ label: t.label, value: t.value }))}
                        value={filterType}
                        onChange={(v) => setFilterType(String(v || '') as InsuranceType | '')}
                        clearable
                    />
                )}
                <CustomSelect
                    label="Broker"
                    options={BROKERS}
                    value={filterBroker}
                    onChange={(v) => setFilterBroker(String(v || ''))}
                    clearable
                />
                <div className="flex items-center gap-1.5">
                    <CalendarDays size={14} className="text-surface-400" />
                    <input
                        type="date"
                        value={filterDateFrom}
                        onChange={(e) => setFilterDateFrom(e.target.value)}
                        className="text-xs border border-surface-200 rounded-lg px-2 py-1.5 bg-white text-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                        title="Inception from"
                    />
                    <span className="text-surface-400 text-xs">to</span>
                    <input
                        type="date"
                        value={filterDateTo}
                        onChange={(e) => setFilterDateTo(e.target.value)}
                        className="text-xs border border-surface-200 rounded-lg px-2 py-1.5 bg-white text-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                        title="Inception to"
                    />
                </div>
                {hasFilters && (
                    <button
                        onClick={() => { setFilterStatus(''); setFilterType(''); setFilterBroker(''); setFilterDateFrom(''); setFilterDateTo(''); }}
                        className="inline-flex items-center gap-1 text-xs text-danger-600 font-medium hover:text-danger-700 cursor-pointer"
                    >
                        <X size={12} /> Clear all
                    </button>
                )}
            </div>

            {/* Data Table */}
            <DataTable<Policy>
                data={filtered}
                columns={columns}
                searchPlaceholder="Search by policy number, client, insurer, coverage…"
                searchKeys={['policyNumber', 'clientName', 'insurerName', 'insuranceType', 'coverageType']}
                onRowClick={(row) => router.push(`/dashboard/policies/${row.id}`)}
                emptyMessage={
                    typeParam
                        ? `No ${typeParam === 'motor' ? 'motor' : 'non-motor'} policies found.`
                        : 'No policies found.'
                }
            />
        </div>
    );
}
