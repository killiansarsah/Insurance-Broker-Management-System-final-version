'use client';

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Plus, FileText, AlertCircle, CheckCircle2, Clock,
    X, Eye, Calendar, AlertTriangle, ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-display/data-table';
import { StatusBadge } from '@/components/data-display/status-badge';
import { CustomSelect } from '@/components/ui/select-custom';
import { useClaims } from '@/hooks/api';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { AppLoader } from '@/components/ui/AppLoader';

const CLAIM_STATUSES = [
    { label: 'All', value: 'all' },
    { label: 'Intimated', value: 'INTIMATED' },
    { label: 'Registered', value: 'REGISTERED' },
    { label: 'Under Review', value: 'UNDER_REVIEW' },
    { label: 'Assessed', value: 'ASSESSED' },
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Settled', value: 'SETTLED' },
    { label: 'Closed', value: 'CLOSED' },
    { label: 'Rejected', value: 'REJECTED' },
];

const INSURANCE_TYPES = [
    { label: 'Motor', value: 'MOTOR' },
    { label: 'Fire', value: 'FIRE' },
    { label: 'Marine', value: 'MARINE' },
    { label: 'Health', value: 'HEALTH' },
    { label: 'Life', value: 'LIFE' },
    { label: 'Travel', value: 'TRAVEL' },
    { label: 'Engineering', value: 'ENGINEERING' },
    { label: 'Liability', value: 'LIABILITY' },
    { label: 'Other', value: 'OTHER' },
];

function NicDeadlineCell({ deadline, met }: { deadline?: string; met?: boolean }) {
    if (!deadline) return <span className="text-surface-400 text-xs">—</span>;
    const today = new Date();
    const d = new Date(deadline);
    const isPast = d < today;
    const daysLeft = Math.ceil((d.getTime() - today.getTime()) / 86_400_000);
    const isNear = !isPast && daysLeft <= 2;

    return (
        <div className="flex flex-col gap-0.5">
            <span className={cn(
                'text-[11px] font-semibold',
                isPast ? 'text-danger-600' : isNear ? 'text-warning-600' : 'text-surface-600'
            )}>
                {formatDate(deadline)}
            </span>
            {isPast ? (
                <span className={cn('text-[10px] font-bold animate-pulse', 'text-danger-500')}>
                    BREACHED
                </span>
            ) : (
                <span className={cn('text-[10px]', isNear ? 'text-warning-500 font-bold' : 'text-surface-400')}>
                    {daysLeft}d left
                </span>
            )}
        </div>
    );
}

export default function ClaimsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const typeParam = searchParams.get('type') as 'MOTOR' | 'non-motor' | null;

    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [overdueOnly, setOverdueOnly] = useState(false);
    const [typeFilter, setTypeFilter] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    const { data: claimsData, isLoading } = useClaims();
    const claims: any[] = (claimsData as any)?.items ?? (claimsData as any)?.data ?? (Array.isArray(claimsData) ? claimsData : []);

    // Motor/Non-Motor URL param
    const baseData = useMemo(() => {
        if (!typeParam) return claims;
        return claims.filter((c) => {
            if (typeParam === 'MOTOR') return c.insuranceType === 'MOTOR';
            if (typeParam === 'non-motor') return c.insuranceType !== 'MOTOR';
            return true;
        });
    }, [claims, typeParam]);

    // NIC deadline computations
    const today = new Date();
    const breached5day = useMemo(() =>
        baseData.filter(c => c.acknowledgmentDeadline && new Date(c.acknowledgmentDeadline) < today && !c.acknowledgmentDate && c.status === 'INTIMATED'),
        [baseData]
    );
    const breached30day = useMemo(() =>
        baseData.filter(c => c.processingDeadline && new Date(c.processingDeadline) < today && !['SETTLED', 'CLOSED', 'REJECTED'].includes(c.status)),
        [baseData]
    );

    // Status counts for tabs
    const statusCounts = useMemo(() => {
        const counts: Record<string, number> = { all: baseData.length };
        CLAIM_STATUSES.slice(1).forEach(s => {
            counts[s.value] = baseData.filter(c => c.status === s.value).length;
        });
        counts['OVERDUE'] = baseData.filter(c => c.isOverdue).length;
        return counts;
    }, [baseData]);

    // Final filtered data
    const filteredClaims = useMemo(() => {
        return baseData.filter((c) => {
            if (statusFilter !== 'all' && c.status !== statusFilter) return false;
            if (overdueOnly && !c.isOverdue) return false;
            if (typeFilter && c.insuranceType !== typeFilter) return false;
            if (dateFrom && (c.incidentDate as string) < dateFrom) return false;
            if (dateTo && (c.incidentDate as string) > dateTo) return false;
            return true;
        });
    }, [baseData, statusFilter, overdueOnly, typeFilter, dateFrom, dateTo]);

    // Stats
    const now = new Date();
    const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const monthEnd = new Date(nextMonth.getTime() - 86_400_000).toISOString().split('T')[0];
    const settledThisMonth = baseData.filter(c => c.status === 'SETTLED' && c.settlementDate && c.settlementDate.slice(0, 10) >= monthStart && c.settlementDate.slice(0, 10) <= monthEnd);
    const settledClaims = baseData.filter(c => c.settlementDate && c.intimationDate);
    const avgDays = settledClaims.length > 0
        ? Math.round(settledClaims.reduce((sum, c) => {
            const start = new Date(c.intimationDate!).getTime();
            const end = new Date(c.settlementDate!).getTime();
            return sum + (end - start) / 86_400_000;
        }, 0) / settledClaims.length)
        : 0;

    const getTitle = () => {
        if (typeParam === 'MOTOR') return 'Motor Claims';
        if (typeParam === 'non-motor') return 'Non-Motor Claims';
        return 'All Claims';
    };

    const stats = [
        { label: 'Open Claims', value: baseData.filter(c => ['INTIMATED', 'REGISTERED', 'UNDER_REVIEW', 'ASSESSED'].includes(c.status)).length, icon: AlertCircle, color: 'text-warning-600', bg: 'bg-warning-50' },
        { label: 'Settled This Month', value: settledThisMonth.length, icon: CheckCircle2, color: 'text-success-600', bg: 'bg-success-50' },
        { label: 'Avg. Settlement Time', value: `${avgDays}d`, icon: Clock, color: 'text-primary-600', bg: 'bg-primary-50' },
        { label: 'Total Incurred', value: formatCurrency(baseData.reduce((sum, c) => sum + (c.settledAmount || c.claimAmount || 0), 0)), icon: FileText, color: 'text-surface-600', bg: 'bg-surface-50' },
    ];

    const hasFilters = overdueOnly || typeFilter || dateFrom || dateTo || statusFilter !== 'all';

    if (isLoading) {
        return <AppLoader message="Loading claims..." isLoading={true} />;
    }

    return (
        <div className="space-y-5 animate-fade-in">
            {/* NIC Overdue Alert Banner */}
            {(breached5day.length > 0 || breached30day.length > 0) && (
                <div className="flex items-start gap-3 bg-danger-50 border border-danger-200 rounded-xl px-4 py-3">
                    <AlertTriangle size={18} className="text-danger-600 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-danger-900">NIC Compliance Violation</p>
                        <div className="mt-1 flex flex-wrap gap-4">
                            {breached5day.length > 0 && (
                                <button
                                    onClick={() => { setStatusFilter('INTIMATED'); setOverdueOnly(true); }}
                                    className="text-xs text-danger-700 underline hover:text-danger-900 font-medium cursor-pointer"
                                >
                                    {breached5day.length} claim{breached5day.length > 1 ? 's' : ''} breached the 5-day acknowledgement rule
                                </button>
                            )}
                            {breached30day.length > 0 && (
                                <button
                                    onClick={() => setOverdueOnly(true)}
                                    className="text-xs text-danger-700 underline hover:text-danger-900 font-medium cursor-pointer"
                                >
                                    {breached30day.length} claim{breached30day.length > 1 ? 's' : ''} breached the 30-day settlement rule
                                </button>
                            )}
                        </div>
                    </div>
                    <a href="/dashboard/claims/nic-monitor" className="text-xs text-danger-700 font-bold flex items-center gap-1 hover:text-danger-900 whitespace-nowrap shrink-0">
                        View Monitor <ChevronRight size={12} />
                    </a>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-surface-900 tracking-tight">{getTitle()}</h1>
                    <p className="text-sm text-surface-500 mt-1">
                        {typeParam
                            ? `Manage and track your ${typeParam.replace('-', ' ')} insurance claims.`
                            : 'Track and process all insurance claims.'}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {typeParam && (
                        <Button variant="ghost" onClick={() => router.push('/dashboard/claims')}>View All</Button>
                    )}
                    <Button
                        variant="primary"
                        leftIcon={<Plus size={16} />}
                        onClick={() => router.push('/dashboard/claims/new')}
                    >
                        Report New Claim
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <Card key={i} padding="none" className="p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className={`p-3 rounded-full ${stat.bg} ${stat.color}`}>
                            <stat.icon size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider">{stat.label}</p>
                            <p className="text-xl font-bold text-surface-900 mt-0.5">{stat.value}</p>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Status Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
                {CLAIM_STATUSES.map((s) => {
                    const count = statusCounts[s.value] ?? 0;
                    const isActive = statusFilter === s.value && !overdueOnly;
                    return (
                        <button
                            key={s.value}
                            onClick={() => { setStatusFilter(s.value); setOverdueOnly(false); }}
                            className={cn(
                                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer',
                                isActive
                                    ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                                    : 'bg-white text-surface-600 border-surface-200 hover:border-primary-300 hover:text-primary-600'
                            )}
                        >
                            {s.label}
                            <span className={cn(
                                'inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold',
                                isActive ? 'bg-white/20 text-white' : 'bg-surface-100 text-surface-500'
                            )}>
                                {count}
                            </span>
                        </button>
                    );
                })}

                {/* Overdue tab */}
                <button
                    onClick={() => { setOverdueOnly(v => !v); if (!overdueOnly) setStatusFilter('all'); }}
                    className={cn(
                        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer',
                        overdueOnly
                            ? 'bg-danger-600 text-white border-danger-600 shadow-sm'
                            : 'bg-white text-danger-600 border-danger-200 hover:border-danger-300'
                    )}
                >
                    <AlertTriangle size={11} />
                    Overdue
                    <span className={cn(
                        'inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold',
                        overdueOnly ? 'bg-white/20 text-white' : 'bg-danger-50 text-danger-500'
                    )}>
                        {statusCounts['OVERDUE'] ?? 0}
                    </span>
                </button>
            </div>

            {/* Secondary Filters Row */}
            <div className="flex flex-wrap items-center gap-2">
                <CustomSelect
                    label="Insurance Type"
                    options={INSURANCE_TYPES}
                    value={typeFilter}
                    onChange={(v) => setTypeFilter(String(v || ''))}
                    clearable
                />
                <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-surface-400" />
                    <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="text-xs border border-surface-200 rounded-lg px-2 py-1.5 bg-surface-50 text-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                        title="Incident date from"
                    />
                    <span className="text-surface-400 text-xs">to</span>
                    <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="text-xs border border-surface-200 rounded-lg px-2 py-1.5 bg-surface-50 text-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                        title="Incident date to"
                    />
                </div>
                {hasFilters && (
                    <button
                        onClick={() => { setStatusFilter('all'); setOverdueOnly(false); setTypeFilter(''); setDateFrom(''); setDateTo(''); }}
                        className="inline-flex items-center gap-1 text-xs text-danger-600 font-medium hover:text-danger-700 cursor-pointer"
                    >
                        <X size={12} /> Clear all
                    </button>
                )}
            </div>

            {/* Claims Table */}
            <DataTable
                data={filteredClaims}
                columns={[
                    {
                        key: 'claimNumber',
                        label: 'Claim #',
                        sortable: true,
                        render: (c) => (
                            <span className="text-[11px] font-mono text-surface-500 bg-surface-100/80 border border-surface-200/50 px-2.5 py-1 rounded-md tracking-wide">
                                {c.claimNumber}
                            </span>
                        )
                    },
                    {
                        key: 'clientName',
                        label: 'Client',
                        sortable: true,
                        render: (c) => (
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                                    {(c.clientName as string || 'C').charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm font-medium text-surface-800">{c.clientName}</span>
                            </div>
                        )
                    },
                    {
                        key: 'policyNumber',
                        label: 'Policy #',
                        sortable: true,
                        render: (c) => (
                            <span className="text-[11px] font-mono text-surface-400 bg-surface-50/50 border border-surface-200/30 px-2.5 py-1 rounded-md tracking-wide">
                                {c.policyNumber}
                            </span>
                        )
                    },
                    {
                        key: 'insuranceType' as any,
                        label: 'Peril / Type',
                        sortable: true,
                        render: (c) => (
                            <div>
                                <p className="text-xs font-semibold text-surface-700">{(c as any).perilType || '—'}</p>
                                <p className="text-[10px] text-surface-400 capitalize">{(c.insuranceType as string || '').replace(/_/g, ' ')}</p>
                            </div>
                        )
                    },
                    {
                        key: 'incidentDate',
                        label: 'Incident Date',
                        sortable: true,
                        render: (c) => <span className="text-xs text-surface-600">{formatDate(c.incidentDate as string)}</span>
                    },
                    {
                        key: 'claimAmount',
                        label: 'Claimed',
                        sortable: true,
                        render: (c) => <span className="text-sm font-semibold text-surface-700">{formatCurrency(c.claimAmount as number)}</span>
                    },
                    {
                        key: 'assessedAmount' as any,
                        label: 'Approved',
                        sortable: true,
                        render: (c) => (
                            <span className={cn('text-sm font-semibold', (c as any).assessedAmount ? 'text-success-600' : 'text-surface-300')}>
                                {(c as any).assessedAmount ? formatCurrency((c as any).assessedAmount) : '—'}
                            </span>
                        )
                    },
                    {
                        key: 'status',
                        label: 'Status',
                        sortable: true,
                        render: (c) => (
                            <div className="flex items-center gap-1.5">
                                <StatusBadge status={c.status as any} />
                                {c.isOverdue && (
                                    <span title="NIC deadline breached" className="flex">
                                        <AlertTriangle size={12} className="text-danger-500" />
                                    </span>
                                )}
                            </div>
                        )
                    },
                    {
                        key: 'acknowledgmentDeadline' as any,
                        label: '5-Day Deadline',
                        render: (c) => <NicDeadlineCell deadline={(c as any).acknowledgmentDeadline} met={!!(c as any).acknowledgmentDate} />
                    },
                    {
                        key: 'processingDeadline' as any,
                        label: '30-Day Deadline',
                        render: (c) => <NicDeadlineCell deadline={(c as any).processingDeadline} />
                    },
                    {
                        key: 'createdAt' as any,
                        label: 'Filed',
                        sortable: true,
                        render: (c) => <span className="text-xs text-surface-500">{formatDate((c as any).createdAt)}</span>
                    },
                    {
                        key: 'id' as any,
                        label: 'Actions',
                        render: (c) => (
                            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                <button
                                    className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-500 hover:text-primary-600 transition-colors cursor-pointer"
                                    title="View Claim"
                                    onClick={() => router.push(`/dashboard/claims/${(c as any).id}`)}
                                >
                                    <Eye size={14} />
                                </button>
                            </div>
                        )
                    },
                ]}
                searchKeys={['claimNumber', 'policyNumber', 'clientName', 'insuranceType', 'status', 'incidentDate', 'claimAmount']}
                onRowClick={(row) => router.push(`/dashboard/claims/${row.id}`)}
                emptyMessage="No claims match the current filters."
            />
        </div>
    );
}
