'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Filter, FileText, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-display/data-table';
import { StatusBadge } from '@/components/data-display/status-badge';
import { claims } from '@/mock/claims';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Card } from '@/components/ui/card';

const STATS = [
    { label: 'Open Claims', value: claims.filter(c => ['intimated', 'registered', 'under_review', 'assessed'].includes(c.status)).length, icon: AlertCircle, color: 'text-warning-600', bg: 'bg-warning-50' },
    { label: 'Settled This Month', value: claims.filter(c => c.status === 'settled').length, icon: CheckCircle2, color: 'text-success-600', bg: 'bg-success-50' },
    { label: 'Avg. Settlement Time', value: '12 Days', icon: Clock, color: 'text-primary-600', bg: 'bg-primary-50' },
    { label: 'Total Incurred', value: formatCurrency(claims.reduce((sum, c) => sum + (c.settledAmount || c.claimAmount || 0), 0)), icon: FileText, color: 'text-surface-600', bg: 'bg-surface-50' },
];

export default function ClaimsPage() {
    const router = useRouter();
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const filteredClaims = statusFilter === 'all'
        ? claims
        : claims.filter(c => c.status === statusFilter);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Claims Management</h1>
                    <p className="text-sm text-surface-500 mt-1">Track and process insurance claims.</p>
                </div>
                <Button
                    variant="primary"
                    leftIcon={<Plus size={16} />}
                    onClick={() => router.push('/dashboard/claims/new')}
                >
                    Report New Claim
                </Button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {STATS.map((stat, i) => (
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
                    { key: 'incidentDate', label: 'Incident Date', sortable: true, render: (c) => formatDate(c.incidentDate) },
                    { key: 'clientName', label: 'Claimant', sortable: true },
                    { key: 'status', label: 'Status', sortable: true, render: (c) => <StatusBadge status={c.status} /> },
                    { key: 'claimAmount', label: 'Est. Amount', sortable: true, render: (c) => formatCurrency(c.claimAmount) },
                ]}
                searchKeys={['claimNumber', 'policyNumber', 'clientName']}
                onRowClick={(row) => router.push(`/dashboard/claims/${row.id}`)}
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
                                <option value="intimated">Intimated</option>
                                <option value="registered">Registered</option>
                                <option value="under_review">Under Review</option>
                                <option value="approved">Approved</option>
                                <option value="settled">Settled</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>
                }
            />
        </div>
    );
}
