'use client';

import { useState, useMemo } from 'react';
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
    Eye,
    Edit,
    MessageSquare,
    Download,
    Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data-display/data-table';
import { StatusBadge } from '@/components/data-display/status-badge';
import { CustomSelect } from '@/components/ui/select-custom';
import { useClients, useClientMetrics } from '@/hooks/api';
import { useUsers } from '@/hooks/api/use-users';
import { formatCurrency, formatPhone, formatDate, cn, getClientDisplayName } from '@/lib/utils';
import { toast } from 'sonner';
import type { Client, ClientStatus, KycStatus, AmlRiskLevel, ClientType } from '@/types';
import Link from 'next/link';
import { ClientExportModal } from '@/components/features/clients/client-export-modal';
import { AppLoader } from '@/components/ui/AppLoader';

export default function ClientsPage() {
    const router = useRouter();

    // Server-side pagination state
    const [ssPage, setSsPage] = useState(1);
    const [ssPageSize, setSsPageSize] = useState(10);
    const [ssSearch, setSsSearch] = useState('');
    const { data: clientsData, isLoading } = useClients({
        page: ssPage,
        limit: ssPageSize,
        ...(ssSearch && { search: ssSearch }),
    });
    const { data: metricsData, isLoading: metricsLoading } = useClientMetrics();

    const clients: any[] = (clientsData as any)?.items ?? (clientsData as any)?.data ?? (Array.isArray(clientsData) ? clientsData : []);
    const meta = (clientsData as any)?.meta;
    
    const totalClients = metricsData?.total ?? 0;
    const kycVerified = metricsData?.kycVerified ?? 0;
    const highRisk = metricsData?.highRisk ?? 0;
    const newThisMonth = metricsData?.newThisMonth ?? 0;
    const { data: usersData } = useUsers();
    const allUsers: any[] = (usersData as any)?.items ?? (usersData as any)?.data ?? (Array.isArray(usersData) ? usersData : []);

    const BROKER_OPTIONS = useMemo(() => {
        return allUsers
            .map((u: any) => ({ 
                label: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email, 
                value: String(u.id) 
            }))
            .sort((a, b) => a.label.localeCompare(b.label));
    }, [allUsers]);
    const [showFilters, setShowFilters] = useState(false);
    const [filterStatus, setFilterStatus] = useState<ClientStatus | ''>('');
    const [filterKyc, setFilterKyc] = useState<KycStatus | ''>('');
    const [filterRisk, setFilterRisk] = useState<AmlRiskLevel | ''>('');
    const [filterType, setFilterType] = useState<ClientType | ''>('');
    const [filterBroker, setFilterBroker] = useState('');
    const [filterDateFrom, setFilterDateFrom] = useState('');
    const [filterDateTo, setFilterDateTo] = useState('');
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    const filteredClients = clients.filter((c) => {
        if (filterStatus && c.status !== filterStatus) return false;
        if (filterKyc && c.kycStatus !== filterKyc) return false;
        if (filterRisk && c.amlRiskLevel !== filterRisk) return false;
        if (filterType && c.type !== filterType) return false;
        if (filterBroker && c.assignedBrokerId !== filterBroker) return false;
        if (filterDateFrom) {
            const from = new Date(filterDateFrom);
            if (new Date(c.createdAt as string) < from) return false;
        }
        if (filterDateTo) {
            const to = new Date(filterDateTo);
            to.setHours(23, 59, 59);
            if (new Date(c.createdAt as string) > to) return false;
        }
        return true;
    });

    const activeFilterCount = [filterStatus, filterKyc, filterRisk, filterType, filterBroker, filterDateFrom, filterDateTo].filter(Boolean).length;

    const activeFiltersParams = {
        status: filterStatus || undefined,
        kycStatus: filterKyc || undefined,
        amlRiskLevel: filterRisk || undefined,
        type: filterType || undefined,
        search: undefined
    };

    function handleExport() {
        setIsExportModalOpen(true);
    }

    const kpis = totalClients > 0 ? [
    {
        label: 'Total Clients',
        value: totalClients,
        description: `${clients.filter(c => c.status === 'ACTIVE').length} active`,
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
    ] : [];

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
                            row.type === 'CORPORATE'
                                ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white'
                                : 'bg-gradient-to-br from-accent-400 to-accent-500 text-white'
                        )}>
                            {row.type === 'CORPORATE' ? <Building2 size={16} /> : getClientDisplayName(row).charAt(0)}
                        </div>
                        <div className={cn(
                            'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white',
                            row.status === 'ACTIVE' ? 'bg-success-400' : row.status === 'SUSPENDED' ? 'bg-accent-400' : 'bg-surface-300'
                        )} />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-surface-900 leading-tight truncate">{getClientDisplayName(row)}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[11px] text-surface-400">
                                {row.type === 'CORPORATE' ? '🏢 Corporate' : '👤 Individual'}
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
            key: 'PHONE',
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
        {
            key: 'actions',
            label: 'Actions',
            render: (row: Client) => (
                <div className="flex items-center gap-1 relative" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => router.push(`/dashboard/clients/${row.id}`)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-surface-400 hover:bg-primary-50 hover:text-primary-600 transition-colors cursor-pointer"
                        title="View"
                    >
                        <Eye size={14} />
                    </button>
                    <button
                        onClick={() => router.push(`/dashboard/clients/${row.id}/edit`)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-surface-400 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                        title="Edit"
                    >
                        <Edit size={14} />
                    </button>
                    <button
                        onClick={() => router.push('/dashboard/chat')}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-surface-400 hover:bg-primary-50 hover:text-primary-600 transition-colors cursor-pointer"
                        title="Message"
                    >
                        <MessageSquare size={14} />
                    </button>
                </div>
            ),
        },
    ];

    if (isLoading) {
        return <AppLoader message="Loading clients..." isLoading={true} />;
    }

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
                <div className="flex items-center gap-2">
                    <Link href="/dashboard/clients/new">
                        <Button 
                            variant="primary" 
                            className="shadow-md shadow-primary-500/20 hover:shadow-lg hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all duration-300 font-bold rounded-full px-5"
                            leftIcon={<Plus size={16} className="transition-transform group-hover:rotate-90" />} 
                            rightIcon={<ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />}
                        >
                            New Client
                        </Button>
                    </Link>
                </div>
            </div>

            {/* KPI Cards — Re-enhanced */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {kpis.map((kpi, idx) => (
                    <div
                        key={kpi.label}
                        className="relative bg-background rounded-2xl border border-surface-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden group transition-all duration-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] hover:-translate-y-1.5"
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
                        <span className="ml-1.5 inline-flex items-center justify-center min-w-5 h-5 text-[10px] font-bold bg-white dark:bg-slate-800 text-primary-600 rounded-full shadow-sm">
                            {activeFilterCount}
                        </span>
                    )}
                </Button>

                {/* Quick-filter pills */}
                {!showFilters && (
                    <div className="flex items-center gap-2 animate-fade-in">
                        {([
                            { value: 'ACTIVE' as ClientStatus, dot: 'bg-success-400', label: 'Active' },
                            { value: 'INACTIVE' as ClientStatus, dot: 'bg-surface-400', label: 'Inactive' },
                            { value: 'SUSPENDED' as ClientStatus, dot: 'bg-accent-400', label: 'Suspended' },
                        ]).map((item) => (
                            <button
                                key={item.value}
                                onClick={() => setFilterStatus(filterStatus === item.value ? '' : item.value)}
                                className={cn(
                                    'inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all duration-200 cursor-pointer',
                                    filterStatus === item.value
                                        ? 'bg-primary-500 text-white border-primary-500 shadow-md shadow-primary-500/20'
                                        : 'bg-background text-surface-600 border-surface-200 hover:border-primary-200 hover:bg-primary-50/50 hover:text-primary-600'
                                )}
                            >
                                <span className={cn(
                                    'w-2 h-2 rounded-full shrink-0',
                                    filterStatus === item.value ? 'bg-white dark:bg-slate-800' : item.dot
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
                            setFilterBroker('');
                            setFilterDateFrom('');
                            setFilterDateTo('');
                        }}
                        className="inline-flex items-center gap-1 text-xs text-danger-600 font-semibold hover:text-danger-700 cursor-pointer transition-colors"
                    >
                        <X size={12} /> Clear all
                    </button>
                )}
            </div>

            {showFilters && (
                <div className="bg-background rounded-2xl border border-surface-200/60 shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 animate-fade-in">
                    <div className="flex items-center justify-between mb-5">
                        <p className="text-xs font-bold text-surface-900 uppercase tracking-widest">Advanced Filters</p>
                        {activeFilterCount > 0 && (
                            <button
                                onClick={() => {
                                    setFilterStatus('');
                                    setFilterKyc('');
                                    setFilterRisk('');
                                    setFilterType('');
                                    setFilterBroker('');
                                    setFilterDateFrom('');
                                    setFilterDateTo('');
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
                                { label: '✅ Active', value: 'ACTIVE' },
                                { label: '⏸️ Inactive', value: 'INACTIVE' },
                                { label: '⚠️ Suspended', value: 'SUSPENDED' },
                                { label: '🚫 Blacklisted', value: 'BLACKLISTED' },
                            ]}
                            value={filterStatus}
                            onChange={(v) => setFilterStatus(v as ClientStatus | '')}
                            clearable
                        />
                        <CustomSelect
                            label="KYC Status"
                            options={[
                                { label: '⏳ Pending', value: 'PENDING' },
                                { label: '✅ Verified', value: 'VERIFIED' },
                                { label: '❌ Rejected', value: 'REJECTED' },
                                { label: '⌛ Expired', value: 'EXPIRED' },
                            ]}
                            value={filterKyc}
                            onChange={(v) => setFilterKyc(v as KycStatus | '')}
                            clearable
                        />
                        <CustomSelect
                            label="AML Risk"
                            options={[
                                { label: '🟢 Low', value: 'LOW' },
                                { label: '🟡 Medium', value: 'MEDIUM' },
                                { label: '🔴 High', value: 'HIGH' },
                                { label: '💀 Critical', value: 'CRITICAL' },
                            ]}
                            value={filterRisk}
                            onChange={(v) => setFilterRisk(v as AmlRiskLevel | '')}
                            clearable
                        />
                        <CustomSelect
                            label="Client Type"
                            options={[
                                { label: '👤 Individual', value: 'INDIVIDUAL' },
                                { label: '🏢 Corporate', value: 'CORPORATE' },
                            ]}
                            value={filterType}
                            onChange={(v) => setFilterType(v as ClientType | '')}
                            clearable
                        />
                        <CustomSelect
                            label="Broker"
                            options={BROKER_OPTIONS}
                            value={filterBroker}
                            onChange={(v) => setFilterBroker(String(v || ''))}
                            clearable
                        />
                    </div>
                    <div className="flex flex-wrap items-end gap-3 mt-4 pt-4 border-t border-surface-100">
                        <div>
                            <label className="block text-[10px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Registration Date From</label>
                            <input
                                type="date"
                                value={filterDateFrom}
                                onChange={(e) => setFilterDateFrom(e.target.value)}
                                className="px-3 py-2 text-sm bg-surface-50 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Registration Date To</label>
                            <input
                                type="date"
                                value={filterDateTo}
                                onChange={(e) => setFilterDateTo(e.target.value)}
                                className="px-3 py-2 text-sm bg-surface-50 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                            />
                        </div>
                    </div>
                </div>
            )}

            <DataTable<any>
                data={filteredClients}
                columns={columns}
                searchPlaceholder="Search by name, client number, phone, email..."
                searchKeys={['firstName', 'lastName', 'companyName', 'clientNumber', 'PHONE', 'EMAIL', 'status', 'kycStatus', 'amlRiskLevel', 'type', 'assignedBrokerName']}
                onRowClick={(row) => router.push(`/dashboard/clients/${row.id}`)}
                emptyMessage="No clients match the current filters."
                onExport={handleExport}
                serverSide
                totalCount={meta?.total ?? 0}
                currentPage={ssPage}
                onPageChange={setSsPage}
                onSearchChange={setSsSearch}
                onPageSizeChange={setSsPageSize}
                loading={isLoading}
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

            <ClientExportModal 
                isOpen={isExportModalOpen}
                setIsOpen={setIsExportModalOpen}
                activeFilters={activeFiltersParams}
                totalClients={totalClients}
                filteredCount={filteredClients.length}
            />
        </div>
    );
}
