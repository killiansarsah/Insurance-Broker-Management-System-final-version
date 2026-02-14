'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Users,
    Plus,
    ShieldCheck,
    AlertTriangle,
    UserPlus,
    Building2,
    Filter,
    X,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data-display/data-table';
import { StatusBadge } from '@/components/data-display/status-badge';
import { mockClients, getClientDisplayName } from '@/mock/clients';
import { formatCurrency, formatPhone, cn } from '@/lib/utils';
import type { Client, ClientStatus, KycStatus, AmlRiskLevel, ClientType } from '@/types';
import Link from 'next/link';

const kpis = [
    {
        label: 'Total Clients',
        value: mockClients.length,
        icon: <Users size={20} />,
        color: 'text-primary-500 bg-primary-50',
    },
    {
        label: 'KYC Verified',
        value: mockClients.filter((c) => c.kycStatus === 'verified').length,
        icon: <ShieldCheck size={20} />,
        color: 'text-success-500 bg-success-50',
    },
    {
        label: 'High Risk',
        value: mockClients.filter((c) => c.amlRiskLevel === 'high' || c.amlRiskLevel === 'critical').length,
        icon: <AlertTriangle size={20} />,
        color: 'text-danger-500 bg-danger-50',
    },
    {
        label: 'New This Month',
        value: mockClients.filter((c) => {
            const d = new Date(c.createdAt);
            const now = new Date();
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }).length,
        icon: <UserPlus size={20} />,
        color: 'text-accent-500 bg-accent-50',
    },
];

export default function ClientsPage() {
    const router = useRouter();
    const [showFilters, setShowFilters] = useState(false);
    const [filterStatus, setFilterStatus] = useState<ClientStatus | ''>('');
    const [filterKyc, setFilterKyc] = useState<KycStatus | ''>('');
    const [filterRisk, setFilterRisk] = useState<AmlRiskLevel | ''>('');
    const [filterType, setFilterType] = useState<ClientType | ''>('');

    const filteredClients = mockClients.filter((c) => {
        if (filterStatus && c.status !== filterStatus) return false;
        if (filterKyc && c.kycStatus !== filterKyc) return false;
        if (filterRisk && c.amlRiskLevel !== filterRisk) return false;
        if (filterType && c.type !== filterType) return false;
        return true;
    });

    const hasFilters = filterStatus || filterKyc || filterRisk || filterType;

    const columns = [
        {
            key: 'clientNumber',
            label: 'Client #',
            sortable: true,
            render: (row: Client) => (
                <span className="text-xs font-mono text-surface-500">{row.clientNumber}</span>
            ),
        },
        {
            key: 'firstName',
            label: 'Name',
            sortable: true,
            render: (row: Client) => (
                <div className="flex items-center gap-3">
                    <div className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                        row.type === 'corporate' ? 'bg-primary-100 text-primary-700' : 'bg-accent-50 text-accent-700'
                    )}>
                        {row.type === 'corporate' ? <Building2 size={14} /> : getClientDisplayName(row).charAt(0)}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-surface-900">{getClientDisplayName(row)}</p>
                        <p className="text-xs text-surface-400">{row.type === 'corporate' ? 'Corporate' : 'Individual'}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (row: Client) => <StatusBadge status={row.status} />,
        },
        {
            key: 'kycStatus',
            label: 'KYC',
            sortable: true,
            render: (row: Client) => (
                <div className="flex items-center gap-2">
                    <StatusBadge status={row.kycStatus} showDot={false} />
                    {row.isPep && (
                        <Badge variant="danger" size="sm">PEP</Badge>
                    )}
                </div>
            ),
        },
        {
            key: 'amlRiskLevel',
            label: 'Risk',
            sortable: true,
            render: (row: Client) => <StatusBadge status={row.amlRiskLevel} />,
        },
        {
            key: 'phone',
            label: 'Phone',
            render: (row: Client) => (
                <span className="text-sm text-surface-600">{formatPhone(row.phone)}</span>
            ),
        },
        {
            key: 'activePolicies',
            label: 'Policies',
            sortable: true,
            render: (row: Client) => (
                <span className="text-sm font-semibold text-surface-700">
                    {row.activePolicies} <span className="text-surface-400 font-normal">/ {row.totalPolicies}</span>
                </span>
            ),
        },
        {
            key: 'totalPremium',
            label: 'Premium',
            sortable: true,
            render: (row: Client) => (
                <span className="text-sm font-semibold text-surface-700">
                    {formatCurrency(row.totalPremium)}
                </span>
            ),
        },
        {
            key: 'assignedBrokerName',
            label: 'Broker',
            sortable: true,
            render: (row: Client) => (
                <span className="text-sm text-surface-600">{row.assignedBrokerName || '—'}</span>
            ),
        },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-surface-900 tracking-tight">Clients</h1>
                    <p className="text-sm text-surface-500 mt-1">
                        Manage individual and corporate client records.
                    </p>
                </div>
                <Link href="/dashboard/clients/new">
                    <Button variant="primary" leftIcon={<Plus size={16} />}>
                        New Client
                    </Button>
                </Link>
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
            <div className="flex items-center gap-2">
                <Button
                    variant={showFilters ? 'primary' : 'outline'}
                    size="sm"
                    leftIcon={<Filter size={14} />}
                    onClick={() => setShowFilters(!showFilters)}
                >
                    Filters
                </Button>
                {hasFilters && (
                    <button
                        onClick={() => {
                            setFilterStatus('');
                            setFilterKyc('');
                            setFilterRisk('');
                            setFilterType('');
                        }}
                        className="inline-flex items-center gap-1 text-xs text-danger-600 font-medium hover:text-danger-700 cursor-pointer"
                    >
                        <X size={12} /> Clear all
                    </button>
                )}
            </div>

            {showFilters && (
                <Card padding="md" className="animate-fade-in">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Status</label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value as ClientStatus | '')}
                                className="w-full px-3 py-2 text-sm bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                            >
                                <option value="">All</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="suspended">Suspended</option>
                                <option value="blacklisted">Blacklisted</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1.5">KYC Status</label>
                            <select
                                value={filterKyc}
                                onChange={(e) => setFilterKyc(e.target.value as KycStatus | '')}
                                className="w-full px-3 py-2 text-sm bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                            >
                                <option value="">All</option>
                                <option value="pending">Pending</option>
                                <option value="verified">Verified</option>
                                <option value="rejected">Rejected</option>
                                <option value="expired">Expired</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1.5">AML Risk</label>
                            <select
                                value={filterRisk}
                                onChange={(e) => setFilterRisk(e.target.value as AmlRiskLevel | '')}
                                className="w-full px-3 py-2 text-sm bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                            >
                                <option value="">All</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Type</label>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value as ClientType | '')}
                                className="w-full px-3 py-2 text-sm bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                            >
                                <option value="">All</option>
                                <option value="individual">Individual</option>
                                <option value="corporate">Corporate</option>
                            </select>
                        </div>
                    </div>
                </Card>
            )}

            {/* Data Table */}
            <DataTable<Client>
                data={filteredClients}
                columns={columns}
                searchPlaceholder="Search by name, client number, phone, email…"
                searchKeys={['firstName', 'lastName', 'companyName', 'clientNumber', 'phone', 'email']}
                onRowClick={(row) => router.push(`/dashboard/clients/${row.id}`)}
            />
        </div>
    );
}
