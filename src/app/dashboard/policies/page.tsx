'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    FileText,
    Plus,
    TrendingUp,
    Clock,
    AlertCircle,
    X,
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

const activePolicies = mockPolicies.filter((p) => p.status === 'active');
const totalPremium = mockPolicies.reduce((s, p) => s + p.premiumAmount, 0);
const expiringSoon = mockPolicies.filter((p) => (p.daysToExpiry ?? 999) <= 30 && p.status === 'active');

const kpis = [
    { label: 'Active Policies', value: activePolicies.length, icon: <FileText size={20} />, color: 'text-primary-500 bg-primary-50' },
    { label: 'Total Premium', value: formatCurrency(totalPremium), icon: <TrendingUp size={20} />, color: 'text-success-500 bg-success-50' },
    { label: 'Expiring ≤30d', value: expiringSoon.length, icon: <Clock size={20} />, color: 'text-accent-500 bg-accent-50' },
    { label: 'Pending / Draft', value: mockPolicies.filter((p) => p.status === 'pending' || p.status === 'draft').length, icon: <AlertCircle size={20} />, color: 'text-danger-500 bg-danger-50' },
];

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
    { label: 'Professional Indemnity', value: 'professional_indemnity' },
];

export default function PoliciesPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const typeParam = searchParams.get('type') as 'motor' | 'non-motor' | null;

    const [showFilters, setShowFilters] = useState(false);
    const [filterStatus, setFilterStatus] = useState<PolicyStatus | ''>('');
    const [filterType, setFilterType] = useState<InsuranceType | ''>('');

    // base filtering on 'type' query param
    const baseData = mockPolicies.filter((p) => {
        if (!typeParam) return true;
        if (typeParam === 'motor') return p.insuranceType === 'motor';
        if (typeParam === 'non-motor') return p.insuranceType !== 'motor';
        return true;
    });

    const filtered = baseData.filter((p) => {
        if (filterStatus && p.status !== filterStatus) return false;
        if (filterType && p.insuranceType !== filterType) return false;
        return true;
    });

    // KPI Calculations based on filtered view
    const activePolicies = baseData.filter((p) => p.status === 'active');
    const totalPremium = baseData.reduce((s, p) => s + p.premiumAmount, 0);
    const expiringSoon = baseData.filter((p) => (p.daysToExpiry ?? 999) <= 30 && p.status === 'active');
    const pendingDraft = baseData.filter((p) => p.status === 'pending' || p.status === 'draft');

    const kpis = [
        {
            label: `Active ${typeParam ? (typeParam === 'motor' ? 'Motor' : 'Non-Motor') : ''} Policies`,
            value: activePolicies.length,
            icon: <FileText size={20} />,
            color: 'text-primary-500 bg-primary-50'
        },
        {
            label: 'Total Premium',
            value: formatCurrency(totalPremium),
            icon: <TrendingUp size={20} />,
            color: 'text-success-500 bg-success-50'
        },
        {
            label: 'Expiring ≤30d',
            value: expiringSoon.length,
            icon: <Clock size={20} />,
            color: 'text-accent-500 bg-accent-50'
        },
        {
            label: 'Pending / Draft',
            value: pendingDraft.length,
            icon: <AlertCircle size={20} />,
            color: 'text-danger-500 bg-danger-50'
        },
    ];

    const hasFilters = filterStatus || filterType;

    // ... columns definition (omitted for brevity, same as before) ...
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
                <span className="text-sm text-surface-600 capitalize">{row.insuranceType.replace(/_/g, ' ')}</span>
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
                <span className="text-sm font-semibold text-surface-700">{formatCurrency(row.premiumAmount)}</span>
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
                <span className="text-xs text-surface-500">
                    {formatDate(row.inceptionDate)} → {formatDate(row.expiryDate)}
                </span>
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
                    <Link href="/dashboard/policies/new">
                        <Button variant="primary" leftIcon={<Plus size={16} />}>New Policy</Button>
                    </Link>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
                    onChange={(v) => setFilterStatus(v as PolicyStatus | '')}
                    clearable
                />
                {!typeParam && (
                    <CustomSelect
                        label="Type"
                        options={INSURANCE_TYPES.map(t => ({ label: t.label, value: t.value }))}
                        value={filterType}
                        onChange={(v) => setFilterType(v as InsuranceType | '')}
                        clearable
                    />
                )}
                {hasFilters && (
                    <button
                        onClick={() => { setFilterStatus(''); setFilterType(''); }}
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
                searchPlaceholder="Search by policy number, client, insurer…"
                searchKeys={['policyNumber', 'clientName', 'insurerName', 'insuranceType']}
                onRowClick={(row) => router.push(`/dashboard/policies/${row.id}`)}
                emptyMessage={
                    typeParam
                        ? `No ${typeParam === 'motor' ? 'motor' : 'non-motor'} policies found.`
                        : "No policies found."
                }
            />
        </div>
    );
}
