'use client';

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Calendar,
    Clock,
    AlertTriangle,
    CheckCircle2,
    FileText,
    Filter,
    RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-display/data-table';
import { StatusBadge } from '@/components/data-display/status-badge';
import { Card } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/utils';
import { mockPolicies } from '@/mock/policies';
import type { Policy } from '@/types';

// Additional filter types for this page
type RenewalStatus = 'upcoming' | 'overdue' | 'processed' | 'all';

export default function RenewalsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get filter from URL or default to 'all'
    const statusParam = (searchParams.get('status') as RenewalStatus) || 'all';

    // Client-side filter state (can adjust locally)
    const [localFilter, setLocalFilter] = useState<RenewalStatus>(statusParam);

    // Sync local state if URL changes (optional, but good for deep linking)
    useMemo(() => {
        setLocalFilter(statusParam);
    }, [statusParam]);

    // --- Filter Logic ---
    const filteredPolicies = useMemo(() => {
        const today = new Date();
        return mockPolicies.filter((policy) => {
            const expiryDate = new Date(policy.expiryDate);
            const daysToExpiry = policy.daysToExpiry || 0;

            if (localFilter === 'upcoming') {
                // Expiring in next 30 days
                return daysToExpiry >= 0 && daysToExpiry <= 30 && policy.status === 'active';
            }
            if (localFilter === 'overdue') {
                // Expired but not yet renewed/cancelled (assuming 'expired' or lapsed status)
                // For mock data widely, let's use daysToExpiry < 0
                return daysToExpiry < 0 && !['cancelled', 'suspended'].includes(policy.status);
            }
            if (localFilter === 'processed') {
                // Recently renewed
                return policy.isRenewal && policy.status === 'active' && daysToExpiry > 30;
            }
            // 'all' - Show everything relevant to renewals (active, expired)
            return ['active', 'expired', 'pending'].includes(policy.status);
        });
    }, [localFilter]);

    // --- KPIs ---
    const kpis = useMemo(() => {
        const upcomingCount = mockPolicies.filter(p => (p.daysToExpiry || 0) >= 0 && (p.daysToExpiry || 0) <= 30 && p.status === 'active').length;
        const overdueCount = mockPolicies.filter(p => (p.daysToExpiry || 0) < 0 && !['cancelled', 'suspended'].includes(p.status)).length;
        const renewalPremium = filteredPolicies.reduce((sum, p) => sum + p.premiumAmount, 0);

        return [
            { label: 'Upcoming (30 Days)', value: upcomingCount, icon: Clock, color: 'text-warning-600', bg: 'bg-warning-50' },
            { label: 'Overdue Renewals', value: overdueCount, icon: AlertTriangle, color: 'text-danger-600', bg: 'bg-danger-50' },
            { label: 'Renewal Premium (Visible)', value: formatCurrency(renewalPremium), icon: FileText, color: 'text-primary-600', bg: 'bg-primary-50' },
            { label: 'Retention Rate', value: '92%', icon: RefreshCw, color: 'text-success-600', bg: 'bg-success-50' }, // Mock stat
        ];
    }, [filteredPolicies]);

    const handleFilterChange = (val: RenewalStatus) => {
        setLocalFilter(val);
        router.push(`/dashboard/renewals?status=${val}`);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Renewals Management</h1>
                    <p className="text-sm text-surface-500 mt-1">Track expiring policies and manage renewals.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" leftIcon={<Calendar size={16} />}>
                        Renewal Calendar
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((stat, i) => (
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
                data={filteredPolicies}
                columns={[
                    { key: 'policyNumber', label: 'Policy #', sortable: true, render: (p) => <span className="font-mono font-medium">{p.policyNumber}</span> },
                    { key: 'clientName', label: 'Client', sortable: true },
                    { key: 'insuranceType', label: 'Type', sortable: true, render: (p) => <span className="capitalize">{p.insuranceType.replace('_', ' ')}</span> },
                    { key: 'expiryDate', label: 'Expiry Date', sortable: true, render: (p) => formatDate(p.expiryDate) },
                    {
                        key: 'daysToExpiry',
                        label: 'Days Left',
                        sortable: true,
                        render: (p) => {
                            const days = p.daysToExpiry || 0;
                            const isOverdue = days < 0;
                            const isUrgent = days <= 30 && !isOverdue;
                            return (
                                <span className={`font-bold ${isOverdue ? 'text-danger-600' : isUrgent ? 'text-warning-600' : 'text-surface-600'}`}>
                                    {isOverdue ? `${Math.abs(days)} days overdue` : `${days} days`}
                                </span>
                            );
                        }
                    },
                    { key: 'premiumAmount', label: 'Premium', sortable: true, render: (p) => formatCurrency(p.premiumAmount) },
                    {
                        key: 'status',
                        label: 'Status',
                        sortable: true,
                        render: (p) => <StatusBadge status={p.status} />
                    },
                ]}
                searchKeys={['policyNumber', 'clientName']}
                onRowClick={(row) => router.push(`/dashboard/policies/${row.id}`)}
                headerActions={
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Filter size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-surface-400" />
                            <select
                                value={localFilter}
                                onChange={(e) => handleFilterChange(e.target.value as RenewalStatus)}
                                className="pl-8 pr-3 py-2 text-xs font-medium bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 appearance-none cursor-pointer"
                            >
                                <option value="all">All Renewals</option>
                                <option value="upcoming">Upcoming (30 Days)</option>
                                <option value="overdue">Overdue</option>
                                <option value="processed">Processed</option>
                            </select>
                        </div>
                    </div>
                }
            />
        </div>
    );
}
