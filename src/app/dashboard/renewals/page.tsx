'use client';

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Clock,
    AlertTriangle,
    XCircle,
    Users,
    Filter,
    CheckCircle2,
    TrendingUp,
    CalendarDays,
    ArrowDownRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-display/data-table';
import { StatusBadge } from '@/components/data-display/status-badge';
import { Card } from '@/components/ui/card';
import { CustomSelect } from '@/components/ui/select-custom';
import { formatCurrency, formatDate } from '@/lib/utils';
import { mockPolicies } from '@/mock/policies';

// Additional filter types for this page
type RenewalStatus = 'upcoming' | 'overdue' | 'processed' | 'lost' | 'all';

export default function RenewalsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get filter from URL or default to 'all'
    const statusParam = (searchParams.get('status') as RenewalStatus) || 'all';

    // Client-side filter state
    const [localFilter, setLocalFilter] = useState<RenewalStatus>(statusParam);

    // Sync local state if URL changes
    useMemo(() => {
        setLocalFilter(statusParam);
    }, [statusParam]);

    // --- Filter Logic ---
    const filteredPolicies = useMemo(() => {
        return mockPolicies.filter((policy) => {
            const daysToExpiry = policy.daysToExpiry || 0;
            const isActive = policy.status === 'active';

            if (localFilter === 'upcoming') return daysToExpiry >= 0 && daysToExpiry <= 90 && isActive; // Up to 3 months per UI
            if (localFilter === 'overdue') return daysToExpiry < 30 && daysToExpiry >= 0 && isActive; // "Due For Renewal" - Within 1 month
            if (localFilter === 'lost') return policy.status === 'cancelled' || policy.status === 'lapsed';
            if (localFilter === 'processed') return policy.isRenewal && isActive && daysToExpiry > 90;
            return true;
        });
    }, [localFilter]);

    // --- KPIs Logic ---
    const kpis = useMemo(() => {
        // Mock data logic to simulate the screenshot stats
        const upcomingCount = mockPolicies.filter(p => (p.daysToExpiry || 0) >= 0 && (p.daysToExpiry || 0) <= 90 && p.status === 'active').length;
        const dueCount = mockPolicies.filter(p => (p.daysToExpiry || 0) >= 0 && (p.daysToExpiry || 0) <= 30 && p.status === 'active').length;
        const lostCount = mockPolicies.filter(p => ['cancelled', 'lapsed'].includes(p.status)).length;
        const renewedCount = mockPolicies.filter(p => p.isRenewal).length;

        return [
            {
                label: 'Upcoming',
                value: upcomingCount,
                icon: Clock,
                color: 'text-blue-600',
                bg: 'bg-blue-50',
                period: 'Up to 3 months',
                subText: `${upcomingCount} policy`
            },
            {
                label: 'Due For Renewal',
                value: dueCount,
                icon: AlertTriangle,
                color: 'text-warning-600',
                bg: 'bg-warning-50',
                period: 'Within 1 month',
                subText: `${dueCount} policy`
            },
            {
                label: 'Policies Lost',
                value: lostCount,
                icon: XCircle,
                color: 'text-danger-600',
                bg: 'bg-danger-50',
                period: 'Year to Date',
                subText: `${lostCount} policy`
            },
            {
                label: 'Policies Renewed',
                value: renewedCount,
                icon: Users,
                color: 'text-success-600',
                bg: 'bg-success-50',
                period: 'Year to Date',
                subText: `${renewedCount} policy`
            },
        ];
    }, []);

    const handleFilterChange = (val: RenewalStatus) => {
        setLocalFilter(val);
        router.push(`/dashboard/renewals?status=${val}`);
    };

    return (
        <div className="space-y-6 animate-fade-in p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-warning-500 rounded-full"></div>
                        <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Renewals</h1>
                    </div>
                    <p className="text-sm text-surface-500 mt-1 ml-3.5">View a list of all renewals and associated details.</p>
                </div>
                <Button variant="outline" rightIcon={<Filter size={16} />}>
                    Filters
                </Button>
            </div>

            {/* KPI Cards - Top Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((stat, i) => (
                    <Card key={i} padding="none" className="p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`p-2.5 rounded-full ${stat.bg} ${stat.color}`}>
                                    <stat.icon size={22} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-surface-500">{stat.label}</p>
                                    <p className="text-2xl font-bold text-surface-900">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-surface-500 border-t border-surface-100 pt-3 mt-1">
                            <span>Period:</span>
                            <span className="font-semibold text-surface-700">{stat.period}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-surface-500">
                            <span>Policies:</span>
                            <span className={`font-semibold ${stat.color}`}>{stat.subText}</span>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Secondary Stats Row */}
            <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center">
                {/* Date Picker Mock */}
                <div className="flex items-center gap-3 min-w-fit">
                    <Button variant="outline" className="h-10 px-4 rounded-full border-surface-200 bg-white shadow-sm gap-2">
                        <CalendarDays size={16} className="text-surface-500" />
                        <span className="text-sm font-medium text-surface-700">Feb 2026</span>
                    </Button>
                    <span className="text-xs font-medium text-surface-400 uppercase tracking-wide">
                        FEBRUARY 2026 | Dezag Brokers • Phoenix Insurance
                    </span>
                </div>

                {/* Stats Bar */}
                <Card padding="none" className="flex-1 w-full p-2 flex flex-col sm:flex-row items-center justify-between gap-4 divide-y sm:divide-y-0 sm:divide-x divide-surface-100 bg-white/80 backdrop-blur-sm">
                    <div className="flex items-center gap-3 px-4 py-2 w-full sm:w-auto">
                        <div className="p-2 rounded-full bg-success-50 text-success-600"><CheckCircle2 size={18} /></div>
                        <div>
                            <p className="text-[10px] uppercase font-semibold text-surface-500">Renewal Rate</p>
                            <p className="text-lg font-bold text-surface-900">0%</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-2 w-full sm:w-auto">
                        <div className="p-2 rounded-full bg-danger-50 text-danger-600"><XCircle size={18} /></div>
                        <div>
                            <p className="text-[10px] uppercase font-semibold text-surface-500">Amount Lost</p>
                            <p className="text-lg font-bold text-danger-600">GHS 0.00</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-2 w-full sm:w-auto">
                        <div className="p-2 rounded-full bg-success-50 text-success-600"><TrendingUp size={18} /></div>
                        <div>
                            <p className="text-[10px] uppercase font-semibold text-surface-500">Amount Collected</p>
                            <p className="text-lg font-bold text-success-600">GHS 0.00</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-2 w-full sm:w-auto">
                        <div className="p-2 rounded-full bg-blue-50 text-blue-600"><CalendarDays size={18} /></div>
                        <div>
                            <p className="text-[10px] uppercase font-semibold text-surface-500">Amount Due</p>
                            <p className="text-lg font-bold text-warning-600">GHS 0.00</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-2 w-full sm:w-auto">
                        <div className="p-2 rounded-full bg-purple-50 text-purple-600"><ArrowDownRight size={18} /></div>
                        <div>
                            <p className="text-[10px] uppercase font-semibold text-surface-500">Policies Lost / Renewed</p>
                            <p className="text-lg font-bold text-surface-900">0 / 0</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Data Table */}
            <DataTable
                data={filteredPolicies}
                columns={[
                    { key: 'policyNumber', label: 'POLICY NUMBER', sortable: true, render: (p) => <span className="font-mono font-medium text-surface-700">{p.policyNumber}</span> },
                    { key: 'insuranceType', label: 'POLICY TYPE', sortable: true, render: (p) => <span className="capitalize text-xs font-semibold px-2 py-0.5 rounded-full bg-surface-100 text-surface-600">{p.insuranceType.replace('_', ' ')}</span> },
                    { key: 'premiumAmount', label: 'PREMIUM', sortable: true, render: (p) => <span className="font-medium">{formatCurrency(p.premiumAmount)}</span> },
                    { key: 'clientName', label: 'CUSTOMER NAME', sortable: true, render: (p) => <span className="font-medium text-primary-600">{p.clientName}</span> },
                    { key: 'id', label: 'CUSTOMER PHONE', sortable: true, render: () => <span className="text-surface-500 text-xs">024 456 7890</span> }, // Mock phone
                    { key: 'insurerName', label: 'INSURER COMPANY', sortable: true },
                    {
                        key: 'daysToExpiry',
                        label: 'DAYS TO EXPIRY',
                        sortable: true,
                        render: (p) => {
                            const days = p.daysToExpiry || 0;
                            const isOverdue = days < 0;
                            return (
                                <span className={`font-bold ${isOverdue ? 'text-danger-600' : days <= 30 ? 'text-warning-600' : 'text-surface-600'}`}>
                                    {days} days
                                </span>
                            );
                        }
                    },
                    { key: 'expiryDate', label: 'EXPIRY DATE', sortable: true, render: (p) => <span className="text-surface-500 text-xs">{formatDate(p.expiryDate)}</span> },
                ]}
                searchKeys={['policyNumber', 'clientName', 'insurerName']}
                onRowClick={(row) => router.push(`/dashboard/policies/${row.id}`)}
                headerActions={
                    <div className="flex items-center gap-2">
                        <CustomSelect
                            label="View"
                            options={[
                                { label: 'All Items', value: 'all' },
                                { label: 'Upcoming', value: 'upcoming' },
                                { label: 'Due / Overdue', value: 'overdue' },
                                { label: 'Lost', value: 'lost' },
                                { label: 'Renewed', value: 'processed' },
                            ]}
                            value={localFilter}
                            onChange={(v) => handleFilterChange(v as RenewalStatus)}
                        />
                    </div>
                }
            />
        </div>
    );
}
