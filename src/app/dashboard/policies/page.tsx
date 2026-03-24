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
    Upload,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-display/data-table';
import { StatusBadge } from '@/components/data-display/status-badge';
import { CustomSelect } from '@/components/ui/select-custom';
import { usePolicies } from '@/hooks/api';
import { formatCurrency, formatDate, cn, safeCsvCell } from '@/lib/utils';
import type { Policy, PolicyStatus, InsuranceType } from '@/types';
import Link from 'next/link';
import { toast } from 'sonner';

const INSURANCE_TYPES: { label: string; value: InsuranceType }[] = [
    { label: 'Motor', value: 'MOTOR' },
    { label: 'Fire', value: 'FIRE' },
    { label: 'Marine', value: 'MARINE' },
    { label: 'Life', value: 'LIFE' },
    { label: 'Health', value: 'HEALTH' },
    { label: 'Liability', value: 'LIABILITY' },
    { label: 'Engineering', value: 'ENGINEERING' },
    { label: 'Bonds', value: 'BONDS' },
    { label: 'Travel', value: 'TRAVEL' },
    { label: 'Agriculture', value: 'AGRICULTURE' },
    { label: 'Oil & Gas', value: 'OIL_GAS' },
    { label: 'Aviation', value: 'AVIATION' },
    { label: 'Professional Indemnity', value: 'PROFESSIONAL_INDEMNITY' },
    { label: 'Other', value: 'OTHER' },
];

function exportToCsv(policies: any[]) {
    const headers = ['Policy #', 'Client', 'Type', 'Coverage', 'Status', 'Insurer', 'Premium (GHS)', 'Sum Insured (GHS)', 'Inception', 'Expiry', 'Broker', 'Commission Rate', 'Commission Amt', 'Payment Status'];
    const rows = policies.map(p => [
        p.policyNumber, p.clientName, p.insuranceType, p.coverageType || '', p.status,
        p.insurerName, Number(p.premiumAmount || 0).toFixed(2), Number(p.sumInsured || 0).toFixed(2),
        (p.inceptionDate as string), p.expiryDate, p.brokerName,
        `${p.commissionRate || 0}%`, Number(p.commissionAmount || 0).toFixed(2), p.paymentStatus,
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => safeCsvCell(c)).join(',')).join('\n');
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
    const typeParam = searchParams.get('type') as 'MOTOR' | 'non-motor' | null;
    const { data: policiesData, isLoading } = usePolicies({ limit: 5000 });
    const policies: any[] = (policiesData as any)?.items ?? (policiesData as any)?.data ?? (Array.isArray(policiesData) ? policiesData : []);
    
    const BROKERS = useMemo(() => 
        Array.from(new Set(policies.map((p: any) => p.brokerName).filter(Boolean))).sort().map(b => ({ label: String(b), value: String(b) })),
        [policies]
    );

    const [filterStatus, setFilterStatus] = useState<PolicyStatus | ''>('');
    const [filterType, setFilterType] = useState<InsuranceType | ''>('');
    const [filterBroker, setFilterBroker] = useState('');
    const [filterDateFrom, setFilterDateFrom] = useState('');
    const [filterDateTo, setFilterDateTo] = useState('');

    // base filtering on 'type' query param
    const baseData = useMemo(() => policies.filter((p) => {
        if (!typeParam) return true;
        if (typeParam === 'MOTOR') return p.insuranceType === 'MOTOR';
        if (typeParam === 'non-motor') return p.insuranceType !== 'MOTOR';
        return true;
    }), [policies, typeParam]);

    const filtered = useMemo(() => baseData.filter((p) => {
        if (filterStatus && p.status !== filterStatus) return false;
        if (filterType && p.insuranceType !== filterType) return false;
        if (filterBroker && p.brokerName !== filterBroker) return false;
        if (filterDateFrom && (p.inceptionDate as string) < filterDateFrom) return false;
        if (filterDateTo && (p.inceptionDate as string) > filterDateTo) return false;
        return true;
    }), [baseData, filterStatus, filterType, filterBroker, filterDateFrom, filterDateTo]);

    // KPI Calculations
    const activePolicies = baseData.filter((p) => p.status === 'ACTIVE');
    const totalPremium = baseData.reduce((s, p) => s + Number(p.premiumAmount || 0), 0);
    const expiringSoon = baseData.filter((p) => ((p.daysToExpiry as number) ?? 999) <= 30 && p.status === 'ACTIVE');
    const pendingDraft = baseData.filter((p) => p.status === 'PENDING' || p.status === 'DRAFT');
    const lapsedPolicies = baseData.filter((p) => p.status === 'LAPSED');
    const now = new Date();
    const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const monthEnd = new Date(nextMonth.getTime() - 86_400_000).toISOString().split('T')[0];
    const newThisMonth = baseData.filter((p) => (p.inceptionDate as string) >= monthStart && (p.inceptionDate as string) <= monthEnd);

    const kpis = [
        {
            label: `Active ${typeParam ? (typeParam === 'MOTOR' ? 'Motor' : 'Non-Motor') : ''} Policies`,
            value: activePolicies.length,
            icon: <FileText size={22} strokeWidth={2.5} />,
            color: 'text-primary-600 bg-primary-50 ring-primary-100',
            borderColor: 'bg-primary-500',
        },
        {
            label: 'Total Premium',
            value: formatCurrency(totalPremium),
            icon: <TrendingUp size={22} strokeWidth={2.5} />,
            color: 'text-success-600 bg-success-50 ring-success-100',
            borderColor: 'bg-success-500',
        },
        {
            label: 'Expiring ≤30d',
            value: expiringSoon.length,
            icon: <Clock size={22} strokeWidth={2.5} />,
            color: 'text-accent-600 bg-accent-50 ring-accent-100',
            borderColor: 'bg-accent-500',
        },
        {
            label: 'Pending / Draft',
            value: pendingDraft.length,
            icon: <AlertCircle size={22} strokeWidth={2.5} />,
            color: 'text-warning-600 bg-warning-50 ring-warning-100',
            borderColor: 'bg-warning-500',
        },
        {
            label: 'Lapsed',
            value: lapsedPolicies.length,
            icon: <ShieldAlert size={22} strokeWidth={2.5} />,
            color: 'text-danger-600 bg-danger-50 ring-danger-100',
            borderColor: 'bg-danger-500',
        },
        {
            label: 'New This Month',
            value: newThisMonth.length,
            icon: <Activity size={22} strokeWidth={2.5} />,
            color: 'text-info-600 bg-info-50 ring-info-100',
            borderColor: 'bg-info-500',
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
                    {row.paymentStatus === 'OVERDUE' && (
                        <span className="ml-1 text-[10px] font-semibold text-danger-600 bg-danger-50 px-1 py-0.5 rounded">OVERDUE</span>
                    )}
                    {row.paymentStatus === 'PARTIAL' && (
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
                    {row.status === 'ACTIVE' && row.daysToExpiry !== undefined && row.daysToExpiry <= 60 && (
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
                    {row.status === 'ACTIVE' && (
                        <button
                            className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-500 hover:text-success-600 transition-colors cursor-pointer"
                            title="Renew"
                            onClick={() => toast.info(`Renewal workflow for ${row.policyNumber} — navigate to detail page for full renewal.`)}
                        >
                            <RotateCcw size={15} />
                        </button>
                    )}
                    {(row.status === 'ACTIVE' || row.status === 'PENDING') && (
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
        if (typeParam === 'MOTOR') return 'Motor Policies';
        if (typeParam === 'non-motor') return 'Non-Motor Policies';
        return 'All Policies';
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-sm text-surface-500">Loading policies...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-surface-900 tracking-tight">{getPageTitle()}</h1>
                    <p className="text-sm text-surface-500 mt-1">
                        Manage {typeParam ? (typeParam === 'MOTOR' ? 'MOTOR' : 'non-motor') : 'insurance'} policies and renewals.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {typeParam && (
                        <Link href="/dashboard/policies">
                            <Button variant="outline" size="sm" className="bg-white hover:bg-surface-50 text-surface-700 shadow-sm font-semibold rounded-full px-4 hover:-translate-y-0.5 transition-all duration-300">
                                View All
                            </Button>
                        </Link>
                    )}
                    <Link href="/dashboard/policies/new">
                        <Button 
                            variant="primary" 
                            className="shadow-md shadow-primary-500/20 hover:shadow-lg hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all duration-300 font-bold group rounded-full px-5"
                            leftIcon={<Plus size={16} className="transition-transform group-hover:rotate-90" />}
                        >
                            New Policy
                        </Button>
                    </Link>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4">
                {kpis.map((kpi) => (
                    <Card key={kpi.label} padding="none" className="relative overflow-hidden group bg-white border-surface-200/60 hover:border-surface-300 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="p-5 flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div className={cn(
                                    'w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3 shadow-sm ring-1 ring-inset',
                                    kpi.color
                                )}>
                                    {kpi.icon}
                                </div>
                                <div className="h-8 w-8 rounded-full bg-surface-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-0 translate-x-2">
                                    <TrendingUp size={14} className="text-surface-400" />
                                </div>
                            </div>
                            <div className="min-w-0">
                                <p className="text-2xl font-black text-surface-900 truncate tracking-tight mb-0.5" title={String(kpi.value)}>{kpi.value}</p>
                                <p className="text-[10px] font-bold text-surface-500 uppercase tracking-widest truncate" title={kpi.label}>{kpi.label}</p>
                            </div>
                        </div>
                        {/* Premium Gradient Overlay on hover */}
                        <div className={cn(
                            "absolute inset-0 opacity-0 group-hover:opacity-[0.03] pointer-events-none transition-opacity duration-500",
                            kpi.borderColor
                        )} />
                        {/* Vibrant decorative bar at the bottom */}
                        <div className={cn(
                            "absolute bottom-0 left-0 w-full h-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left",
                            kpi.borderColor
                        )} />
                    </Card>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
                <CustomSelect
                    label="Status"
                    options={[
                        { label: 'Active', value: 'ACTIVE' },
                        { label: 'Pending', value: 'PENDING' },
                        { label: 'Draft', value: 'DRAFT' },
                        { label: 'Expired', value: 'EXPIRED' },
                        { label: 'Cancelled', value: 'CANCELLED' },
                        { label: 'Lapsed', value: 'LAPSED' },
                        { label: 'Suspended', value: 'SUSPENDED' },
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
                        className="text-xs border border-surface-200 rounded-lg px-2 py-1.5 bg-surface-50 text-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                        title="Inception from"
                    />
                    <span className="text-surface-400 text-xs">to</span>
                    <input
                        type="date"
                        value={filterDateTo}
                        onChange={(e) => setFilterDateTo(e.target.value)}
                        className="text-xs border border-surface-200 rounded-lg px-2 py-1.5 bg-surface-50 text-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
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
            <DataTable<any>
                data={filtered}
                columns={columns}
                searchPlaceholder="Search by policy number, client, insurer, coverage…"
                searchKeys={['policyNumber', 'clientName', 'insurerName', 'insuranceType', 'coverageType', 'status', 'premiumAmount', 'brokerName']}
                onRowClick={(row) => router.push(`/dashboard/policies/${row.id}`)}
                emptyMessage={
                    typeParam
                        ? `No ${typeParam === 'MOTOR' ? 'MOTOR' : 'non-motor'} policies found.`
                        : 'No policies found.'
                }
                exportable={true}
                onExport={() => exportToCsv(filtered)}
                headerActions={
                    <Link 
                        href="/dashboard/integrations#bulk-import"
                        className="group relative inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-primary-700 dark:text-primary-400 bg-primary-50/50 dark:bg-primary-900/10 border border-primary-200/50 dark:border-primary-800/30 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_6px_16px_-4px_rgba(14,165,233,0.3)] dark:hover:shadow-[0_6px_16px_-4px_rgba(14,165,233,0.15)] hover:-translate-y-0.5 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:border-primary-300/60 dark:hover:border-primary-700/50 whitespace-nowrap"
                    >
                        {/* Subtle primary glow overlay */}
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-tr from-primary-400/0 via-primary-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        
                        {/* Bouncing Upload Icon */}
                        <div className="relative overflow-hidden flex items-center justify-center w-[15px] h-[15px] z-10 p-0.5 mt-0.5 text-primary-600 dark:text-primary-500 transition-colors duration-300">
                             <Upload 
                                 size={15} 
                                 className="absolute transition-transform duration-500 ease-[cubic-bezier(0.8,0,0.2,1)] group-hover:-translate-y-full group-hover:opacity-0" 
                             />
                             <Upload 
                                 size={15} 
                                 className="absolute translate-y-full opacity-0 transition-all duration-500 ease-[cubic-bezier(0.8,0,0.2,1)] group-hover:translate-y-0 group-hover:opacity-100 group-active:scale-95" 
                             />
                        </div>
                        <span className="relative z-10 tracking-wide">Import</span>
                    </Link>
                }
            />
        </div>
    );
}
