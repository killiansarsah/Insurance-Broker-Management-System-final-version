'use client';

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, Filter, FileText, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-display/data-table';
import { StatusBadge } from '@/components/data-display/status-badge';
import { CustomSelect } from '@/components/ui/select-custom';
import { claims } from '@/mock/claims';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Card } from '@/components/ui/card';

export default function ClaimsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const typeParam = searchParams.get('type') as 'motor' | 'non-motor' | null;
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // 1. Base Filter (Motor vs Non-Motor)
    const baseData = useMemo(() => {
        if (!typeParam) return claims;
        return claims.filter((c) => {
            if (typeParam === 'motor') return c.insuranceType === 'motor';
            if (typeParam === 'non-motor') return c.insuranceType !== 'motor';
            return true;
        });
    }, [typeParam]);

    // 2. Status Filter
    const filteredClaims = useMemo(() => {
        return statusFilter === 'all'
            ? baseData
            : baseData.filter((c) => c.status === statusFilter);
    }, [baseData, statusFilter]);

    // 3. Dynamic Stats based on Base Data (Context)
    const stats = [
        { label: 'Open Claims', value: baseData.filter(c => ['intimated', 'registered', 'under_review', 'assessed'].includes(c.status)).length, icon: AlertCircle, color: 'text-warning-600', bg: 'bg-warning-50' },
        { label: 'Settled This Month', value: baseData.filter(c => c.status === 'settled').length, icon: CheckCircle2, color: 'text-success-600', bg: 'bg-success-50' },
        { label: 'Avg. Settlement Time', value: '12 Days', icon: Clock, color: 'text-primary-600', bg: 'bg-primary-50' },
        { label: 'Total Incurred', value: formatCurrency(baseData.reduce((sum, c) => sum + (c.settledAmount || c.claimAmount || 0), 0)), icon: FileText, color: 'text-surface-600', bg: 'bg-surface-50' },
    ];

    const getTitle = () => {
        if (typeParam === 'motor') return 'Motor Claims';
        if (typeParam === 'non-motor') return 'Non-Motor Claims';
        return 'All Claims';
    };

    return (
        <div className="space-y-6 animate-fade-in">
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
                    {/* View All Button (visible when filtered) */}
                    {typeParam && (
                        <Button variant="ghost" onClick={() => router.push('/dashboard/claims')}>
                            View All
                        </Button>
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

            {/* List */}
            <DataTable
                data={filteredClaims}
                columns={[
                    { key: 'claimNumber', label: 'Claim #', sortable: true, render: (c) => <span className="font-mono font-medium">{c.claimNumber}</span> },
                    { key: 'policyNumber', label: 'Policy #', sortable: true },
                    { key: 'insuranceType', label: 'Type', sortable: true, render: (c) => <span className="capitalize">{c.insuranceType.replace('_', ' ')}</span> },
                    { key: 'incidentDate', label: 'Incident Date', sortable: true, render: (c) => formatDate(c.incidentDate) },
                    { key: 'clientName', label: 'Claimant', sortable: true },
                    { key: 'status', label: 'Status', sortable: true, render: (c) => <StatusBadge status={c.status} /> },
                    { key: 'claimAmount', label: 'Est. Amount', sortable: true, render: (c) => formatCurrency(c.claimAmount) },
                ]}
                searchKeys={['claimNumber', 'policyNumber', 'clientName']}
                onRowClick={(row) => router.push(`/dashboard/claims/${row.id}`)}
                headerActions={
                    <div className="flex items-center gap-2">
                        <CustomSelect
                            label="Status"
                            options={[
                                { label: 'All Statuses', value: 'all' },
                                { label: 'Intimated', value: 'intimated' },
                                { label: 'Registered', value: 'registered' },
                                { label: 'Under Review', value: 'under_review' },
                                { label: 'Approved', value: 'approved' },
                                { label: 'Settled', value: 'settled' },
                                { label: 'Rejected', value: 'rejected' },
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
