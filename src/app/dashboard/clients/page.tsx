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
    TrendingUp,
    TrendingDown,
    ArrowRight,
    Mail,
    RotateCcw,
    Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data-display/data-table';
import { StatusBadge } from '@/components/data-display/status-badge';
import { CustomSelect } from '@/components/ui/select-custom';
import { mockClients, getClientDisplayName } from '@/mock/clients';
import { formatCurrency, formatPhone, cn } from '@/lib/utils';
import type { Client, ClientStatus, KycStatus, AmlRiskLevel, ClientType } from '@/types';
import Link from 'next/link';

const totalClients = mockClients.length;
const kycVerified = mockClients.filter((c) => c.kycStatus === 'verified').length;
const highRisk = mockClients.filter((c) => c.amlRiskLevel === 'high' || c.amlRiskLevel === 'critical').length;
const newThisMonth = mockClients.filter((c) => {
    const d = new Date(c.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}).length;

const kpis = [
    {
        label: 'Total Clients',
        value: totalClients,
        description: `${mockClients.filter(c => c.status === 'active').length} active`,
        icon: <Users size={22} strokeWidth={1.8} />,
        trend: '+12%',
        trendUp: true,
        accent: 'from-[#1976d2] to-[#42a5f5]',
        iconBg: 'bg-gradient-to-br from-primary-500 to-primary-400',
        decorBg: 'bg-primary-500/5',
        barColor: 'bg-gradient-to-r from-primary-400 to-primary-600',
        barPercent: 100,
    },
    {
        label: 'KYC Verified',
        value: kycVerified,
        description: `of ${totalClients} clients`,
        icon: <ShieldCheck size={22} strokeWidth={1.8} />,
        trend: `${Math.round((kycVerified / totalClients) * 100)}%`,
        trendUp: true,
        accent: 'from-[#388e3c] to-[#66bb6a]',
        iconBg: 'bg-gradient-to-br from-success-500 to-success-400',
        decorBg: 'bg-success-500/5',
        barColor: 'bg-gradient-to-r from-success-400 to-success-600',
        barPercent: Math.round((kycVerified / totalClients) * 100),
    },
    {
        label: 'High Risk',
        value: highRisk,
        description: 'require attention',
        icon: <AlertTriangle size={22} strokeWidth={1.8} />,
        trend: `${Math.round((highRisk / totalClients) * 100)}%`,
        trendUp: false,
        accent: 'from-[#d32f2f] to-[#ef5350]',
        iconBg: 'bg-gradient-to-br from-danger-500 to-danger-400',
        decorBg: 'bg-danger-500/5',
        barColor: 'bg-gradient-to-r from-danger-400 to-danger-600',
        barPercent: Math.round((highRisk / totalClients) * 100),
    },
    {
        label: 'New This Month',
        value: newThisMonth,
        description: `since ${new Date().toLocaleString('en', { month: 'short' })} 1`,
        icon: <UserPlus size={22} strokeWidth={1.8} />,
        trend: 'Current',
        trendUp: true,
        accent: 'from-[#f57c00] to-[#ffa726]',
        iconBg: 'bg-gradient-to-br from-accent-500 to-accent-400',
        decorBg: 'bg-accent-500/5',
        barColor: 'bg-gradient-to-r from-accent-400 to-accent-600',
        barPercent: Math.round((newThisMonth / totalClients) * 100) || 5,
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

    const activeFilterCount = [filterStatus, filterKyc, filterRisk, filterType].filter(Boolean).length;

    const columns = [
        {
            key: 'clientNumber',
            label: 'Client #',
            sortable: true,
            render: (row: Client) => (
                <span className="text-[11px] font-mono text-surface-500 bg-surface-100/80 border border-surface-200/50 px-2.5 py-1 rounded-md tracking-wide">{row.clientNumber}</span>
            ),
        },
        {
            key: 'firstName',
            label: 'Name',
            sortable: true,
            render: (row: Client) => (
                <div className="flex items-center gap-3 group/name">
                    <div className="relative">
                        <div className={cn(
                            'w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 shadow-sm ring-2 ring-white transition-transform duration-200 group-hover/name:scale-105',
                            row.type === 'corporate'
                                ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white'
                                : 'bg-gradient-to-br from-accent-400 to-accent-500 text-white'
                        )}>
                            {row.type === 'corporate' ? <Building2 size={16} /> : getClientDisplayName(row).charAt(0)}
                        </div>
                        <div className={cn(
                            'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white',
                            row.status === 'active' ? 'bg-success-400' : row.status === 'suspended' ? 'bg-accent-400' : 'bg-surface-300'
                        )} />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-surface-900 leading-tight truncate">{getClientDisplayName(row)}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[11px] text-surface-400">
                                {row.type === 'corporate' ? '🏢 Corporate' : '👤 Individual'}
                            </span>
                            {row.email && (
                                <span className="text-[10px] text-surface-300 hidden group-hover/name:inline-flex items-center gap-0.5 transition-opacity">
                                    <Mail size={9} /> {row.email}
                                </span>
                            )}
                        </div>
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
                    {row.eddRequired && (
                        <span className="text-[10px] font-semibold text-accent-600 bg-accent-50 px-1.5 py-0.5 rounded">EDD</span>
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
                <span className="text-sm text-surface-600 tabular-nums">{formatPhone(row.phone)}</span>
            ),
        },
        {
            key: 'activePolicies',
            label: 'Policies',
            sortable: true,
            render: (row: Client) => {
                const pct = row.totalPolicies > 0 ? Math.round((row.activePolicies / row.totalPolicies) * 100) : 0;
                return (
                    <div className="flex items-center gap-3">
                        <div className="min-w-[44px]">
                            <span className="text-sm font-bold text-surface-800">{row.activePolicies}</span>
                            <span className="text-surface-400 text-xs font-normal"> / {row.totalPolicies}</span>
                        </div>
                        <div className="flex-1 min-w-[48px]">
                            <div className="w-full h-2 bg-surface-100 rounded-full overflow-hidden">
                                <div
                                    className={cn(
                                        'h-full rounded-full transition-all duration-700 ease-out',
                                        pct >= 80 ? 'bg-gradient-to-r from-success-400 to-success-500' :
                                            pct >= 50 ? 'bg-gradient-to-r from-primary-400 to-primary-500' :
                                                'bg-gradient-to-r from-accent-400 to-accent-500'
                                    )}
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                            <p className="text-[10px] text-surface-400 mt-0.5">{pct}% active</p>
                        </div>
                    </div>
                );
            },
        },
        {
            key: 'totalPremium',
            label: 'Premium',
            sortable: true,
            render: (row: Client) => (
                <div className="flex items-center gap-1.5">
                    {row.totalPremium >= 1000000 && <Sparkles size={12} className="text-success-400" />}
                    <span className={cn(
                        'text-sm font-bold tabular-nums',
                        row.totalPremium >= 1000000 ? 'text-success-600' :
                            row.totalPremium >= 100000 ? 'text-surface-800' :
                                'text-surface-600'
                    )}>
                        {formatCurrency(row.totalPremium)}
                    </span>
                </div>
            ),
        },
        {
            key: 'assignedBrokerName',
            label: 'Broker',
            sortable: true,
            render: (row: Client) => (
                <div className="flex items-center gap-2">
                    {row.assignedBrokerName ? (
                        <>
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-surface-200 to-surface-300 flex items-center justify-center text-[10px] font-bold text-surface-700 ring-1 ring-surface-100">
                                {row.assignedBrokerName.charAt(0)}
                            </div>
                            <span className="text-sm text-surface-600 font-medium">{row.assignedBrokerName}</span>
                        </>
                    ) : (
                        <span className="text-xs text-surface-300 italic bg-surface-50 px-2 py-1 rounded">Not assigned</span>
                    )}
                </div>
            ),
        },
    ];

    const selectClasses = 'w-full px-3 py-2.5 text-sm bg-white border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all cursor-pointer hover:border-surface-300 appearance-none';

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md">
                            <Users size={20} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-surface-900 tracking-tight leading-none">Client Management</h1>
                            <p className="text-sm text-surface-500 mt-1">
                                {totalClients} total · {kycVerified} verified · {highRisk} requiring attention
                            </p>
                        </div>
                    </div>
                </div>
                <Link href="/dashboard/clients/new">
                    <Button variant="primary" leftIcon={<Plus size={16} />} rightIcon={<ArrowRight size={14} />}>
                        New Client
                    </Button>
                </Link>
            </div>

            {/* KPI Cards — Re-enhanced */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {kpis.map((kpi, idx) => (
                    <div
                        key={kpi.label}
                        className="relative bg-white rounded-2xl border border-surface-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden group transition-all duration-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] hover:-translate-y-1.5"
                        style={{ animationDelay: `${idx * 80}ms` }}
                    >
                        {/* Gradient accent bar */}
                        <div className={cn('h-1 bg-gradient-to-r', kpi.accent)} />

                        {/* Decorative background circle */}
                        <div className={cn(
                            'absolute -right-6 -bottom-6 w-28 h-28 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500',
                            kpi.decorBg
                        )} />

                        <div className="relative p-5">
                            <div className="flex items-start justify-between mb-4">
                                <div className={cn(
                                    'w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:rotate-3',
                                    kpi.iconBg
                                )}>
                                    {kpi.icon}
                                </div>
                                <div className={cn(
                                    'flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border',
                                    kpi.trendUp
                                        ? 'bg-success-50 text-success-600 border-success-100'
                                        : 'bg-danger-50 text-danger-600 border-danger-100'
                                )}>
                                    {kpi.trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                    {kpi.trend}
                                </div>
                            </div>

                            <p className="text-3xl font-extrabold text-surface-900 tracking-tight leading-none">{kpi.value}</p>
                            <p className="text-xs font-semibold text-surface-400 uppercase tracking-widest mt-1.5">{kpi.label}</p>
                            <p className="text-[11px] text-surface-400 mt-0.5">{kpi.description}</p>

                            {/* Progress bar */}
                            <div className="mt-4 w-full h-1.5 bg-surface-100 rounded-full overflow-hidden">
                                <div
                                    className={cn('h-full rounded-full transition-all duration-1000 ease-out', kpi.barColor)}
                                    style={{ width: `${kpi.barPercent}%` }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Enhanced Filter Bar */}
            <div className="flex flex-wrap items-center gap-3">
                <Button
                    variant={showFilters ? 'primary' : 'outline'}
                    size="sm"
                    leftIcon={<Filter size={14} />}
                    onClick={() => setShowFilters(!showFilters)}
                >
                    Filters
                    {activeFilterCount > 0 && (
                        <span className="ml-1.5 inline-flex items-center justify-center min-w-5 h-5 text-[10px] font-bold bg-white text-primary-600 rounded-full shadow-sm">
                            {activeFilterCount}
                        </span>
                    )}
                </Button>

                {/* Quick-filter pills */}
                {!showFilters && (
                    <div className="flex items-center gap-2 animate-fade-in">
                        {([
                            { value: 'active' as ClientStatus, dot: 'bg-success-400', label: 'Active' },
                            { value: 'inactive' as ClientStatus, dot: 'bg-surface-400', label: 'Inactive' },
                            { value: 'suspended' as ClientStatus, dot: 'bg-accent-400', label: 'Suspended' },
                        ]).map((item) => (
                            <button
                                key={item.value}
                                onClick={() => setFilterStatus(filterStatus === item.value ? '' : item.value)}
                                className={cn(
                                    'inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all duration-200 cursor-pointer',
                                    filterStatus === item.value
                                        ? 'bg-primary-500 text-white border-primary-500 shadow-md shadow-primary-500/20'
                                        : 'bg-white text-surface-600 border-surface-200 hover:border-primary-200 hover:bg-primary-50/50 hover:text-primary-600'
                                )}
                            >
                                <span className={cn(
                                    'w-2 h-2 rounded-full shrink-0',
                                    filterStatus === item.value ? 'bg-white' : item.dot
                                )} />
                                {item.label}
                            </button>
                        ))}
                    </div>
                )}

                {activeFilterCount > 0 && (
                    <button
                        onClick={() => {
                            setFilterStatus('');
                            setFilterKyc('');
                            setFilterRisk('');
                            setFilterType('');
                        }}
                        className="inline-flex items-center gap-1 text-xs text-danger-600 font-semibold hover:text-danger-700 cursor-pointer transition-colors"
                    >
                        <X size={12} /> Clear all
                    </button>
                )}
            </div>

            {showFilters && (
                <div className="bg-white rounded-2xl border border-surface-200/60 shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 animate-fade-in">
                    <div className="flex items-center justify-between mb-5">
                        <p className="text-xs font-bold text-surface-900 uppercase tracking-widest">Advanced Filters</p>
                        {activeFilterCount > 0 && (
                            <button
                                onClick={() => {
                                    setFilterStatus('');
                                    setFilterKyc('');
                                    setFilterRisk('');
                                    setFilterType('');
                                }}
                                className="inline-flex items-center gap-1.5 text-xs text-primary-500 hover:text-primary-700 font-medium cursor-pointer transition-colors"
                            >
                                <RotateCcw size={12} /> Reset all
                            </button>
                        )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <CustomSelect
                            label="Status"
                            options={[
                                { label: '✅ Active', value: 'active' },
                                { label: '⏸️ Inactive', value: 'inactive' },
                                { label: '⚠️ Suspended', value: 'suspended' },
                                { label: '🚫 Blacklisted', value: 'blacklisted' },
                            ]}
                            value={filterStatus}
                            onChange={(v) => setFilterStatus(v as ClientStatus | '')}
                            clearable
                        />
                        <CustomSelect
                            label="KYC Status"
                            options={[
                                { label: '⏳ Pending', value: 'pending' },
                                { label: '✅ Verified', value: 'verified' },
                                { label: '❌ Rejected', value: 'rejected' },
                                { label: '⌛ Expired', value: 'expired' },
                            ]}
                            value={filterKyc}
                            onChange={(v) => setFilterKyc(v as KycStatus | '')}
                            clearable
                        />
                        <CustomSelect
                            label="AML Risk"
                            options={[
                                { label: '🟢 Low', value: 'low' },
                                { label: '🟡 Medium', value: 'medium' },
                                { label: '🔴 High', value: 'high' },
                                { label: '💀 Critical', value: 'critical' },
                            ]}
                            value={filterRisk}
                            onChange={(v) => setFilterRisk(v as AmlRiskLevel | '')}
                            clearable
                        />
                        <CustomSelect
                            label="Client Type"
                            options={[
                                { label: '👤 Individual', value: 'individual' },
                                { label: '🏢 Corporate', value: 'corporate' },
                            ]}
                            value={filterType}
                            onChange={(v) => setFilterType(v as ClientType | '')}
                            clearable
                        />
                    </div>
                </div>
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
