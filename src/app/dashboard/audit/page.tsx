'use client';

import { useState, useMemo } from 'react';
import {
    Activity,
    Search,
    Download,
    Filter,
    User,
    Shield,
    FileText,
    DollarSign,
    Clock,
    ChevronDown,
    Eye,
    Lock,
    Unlock,
    Trash2,
    Edit,
    Plus,
    LogIn,
    LogOut,
    RefreshCw,
    AlertTriangle,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn, formatDate } from '@/lib/utils';
import { toast } from 'sonner';

type AuditAction =
    | 'login' | 'logout'
    | 'create' | 'update' | 'delete' | 'view'
    | 'approve' | 'reject'
    | 'export' | 'import'
    | 'permission_change' | 'password_change'
    | 'payment_processed' | 'report_generated';

type AuditModule =
    | 'auth' | 'clients' | 'policies' | 'claims'
    | 'leads' | 'finance' | 'settings' | 'users'
    | 'documents' | 'reports' | 'compliance';

interface AuditEntry {
    id: string;
    timestamp: string;
    userId: string;
    userName: string;
    userRole: string;
    action: AuditAction;
    module: AuditModule;
    description: string;
    resourceId?: string;
    resourceLabel?: string;
    ipAddress: string;
    userAgent?: string;
    severity: 'info' | 'warning' | 'critical';
    metadata?: Record<string, unknown>;
}

const AUDIT_LOG: AuditEntry[] = [
    {
        id: 'aud-001',
        timestamp: new Date(Date.now() - 3600000 * 0.2).toISOString(),
        userId: 'usr-003',
        userName: 'Esi Donkor',
        userRole: 'Senior Broker',
        action: 'create',
        module: 'policies',
        description: 'Created new motor policy for Radiance Petroleum',
        resourceId: 'pol-001',
        resourceLabel: 'GG-DSDM-1002-20-003928',
        ipAddress: '192.168.1.42',
        severity: 'info',
    },
    {
        id: 'aud-002',
        timestamp: new Date(Date.now() - 3600000 * 0.8).toISOString(),
        userId: 'usr-004',
        userName: 'Kofi Asante',
        userRole: 'Broker',
        action: 'approve',
        module: 'claims',
        description: 'Approved claim settlement for CLM-2025-0004',
        resourceId: 'CLM-2025-0004',
        resourceLabel: 'CLM-2025-0004',
        ipAddress: '10.0.0.15',
        severity: 'info',
    },
    {
        id: 'aud-003',
        timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
        userId: 'usr-002',
        userName: 'Dr. Ernest Osei',
        userRole: 'Tenant Admin',
        action: 'permission_change',
        module: 'users',
        description: 'Updated role permissions for Abena Nyarko — promoted to Senior Broker',
        resourceId: 'usr-005',
        resourceLabel: 'Abena Nyarko',
        ipAddress: '10.0.0.1',
        severity: 'warning',
    },
    {
        id: 'aud-004',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        userId: 'usr-003',
        userName: 'Esi Donkor',
        userRole: 'Senior Broker',
        action: 'export',
        module: 'reports',
        description: 'Exported Q4 commission report (PDF)',
        ipAddress: '192.168.1.42',
        severity: 'info',
    },
    {
        id: 'aud-005',
        timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
        userId: 'usr-005',
        userName: 'Abena Nyarko',
        userRole: 'Broker',
        action: 'update',
        module: 'clients',
        description: 'Updated KYC status for Ghana Shippers\' Authority — set to Verified',
        resourceId: 'cli-001',
        resourceLabel: 'CLT-2025-0001',
        ipAddress: '172.16.0.88',
        severity: 'info',
    },
    {
        id: 'aud-006',
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
        userId: 'usr-001',
        userName: 'System Administrator',
        userRole: 'Platform Super Admin',
        action: 'delete',
        module: 'documents',
        description: 'Deleted expired document: Ghana_Card_2022_Expired.pdf',
        resourceLabel: 'Ghana_Card_2022_Expired.pdf',
        ipAddress: '127.0.0.1',
        severity: 'warning',
    },
    {
        id: 'aud-007',
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
        userId: 'usr-003',
        userName: 'Esi Donkor',
        userRole: 'Senior Broker',
        action: 'payment_processed',
        module: 'finance',
        description: 'Processed premium payment of GHS 36,185 for Agroterrum Ghana LTD',
        resourceLabel: 'PAY-2026-001122',
        ipAddress: '192.168.1.42',
        severity: 'info',
    },
    {
        id: 'aud-008',
        timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
        userId: 'usr-004',
        userName: 'Kofi Asante',
        userRole: 'Broker',
        action: 'login',
        module: 'auth',
        description: 'User logged in successfully',
        ipAddress: '10.0.0.15',
        severity: 'info',
    },
    {
        id: 'aud-009',
        timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
        userId: 'usr-002',
        userName: 'Dr. Ernest Osei',
        userRole: 'Tenant Admin',
        action: 'import',
        module: 'clients',
        description: 'Imported 12 new clients via CSV data onboarding',
        ipAddress: '10.0.0.1',
        severity: 'info',
    },
    {
        id: 'aud-010',
        timestamp: new Date(Date.now() - 3600000 * 10).toISOString(),
        userId: 'usr-005',
        userName: 'Abena Nyarko',
        userRole: 'Broker',
        action: 'reject',
        module: 'claims',
        description: 'Rejected claim CLM-2026-0011 — insufficient documentation',
        resourceLabel: 'CLM-2026-0011',
        ipAddress: '172.16.0.88',
        severity: 'warning',
    },
    {
        id: 'aud-011',
        timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
        userId: 'usr-001',
        userName: 'System Administrator',
        userRole: 'Platform Super Admin',
        action: 'password_change',
        module: 'auth',
        description: 'Forced password reset for usr-006 — security policy update',
        ipAddress: '127.0.0.1',
        severity: 'critical',
    },
    {
        id: 'aud-012',
        timestamp: new Date(Date.now() - 86400000 * 1.5).toISOString(),
        userId: 'usr-003',
        userName: 'Esi Donkor',
        userRole: 'Senior Broker',
        action: 'view',
        module: 'finance',
        description: 'Viewed commission statements for January 2026',
        ipAddress: '192.168.1.42',
        severity: 'info',
    },
    {
        id: 'aud-013',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        userId: 'usr-004',
        userName: 'Kofi Asante',
        userRole: 'Broker',
        action: 'create',
        module: 'leads',
        description: 'Created new lead — Adjei Transport Services (fleet motor)',
        resourceId: 'lead-001',
        resourceLabel: 'LD-2026-0001',
        ipAddress: '10.0.0.15',
        severity: 'info',
    },
    {
        id: 'aud-014',
        timestamp: new Date(Date.now() - 86400000 * 2.5).toISOString(),
        userId: 'usr-002',
        userName: 'Dr. Ernest Osei',
        userRole: 'Tenant Admin',
        action: 'report_generated',
        module: 'reports',
        description: 'Generated NIC Quarterly Returns Report — Q4 2025',
        ipAddress: '10.0.0.1',
        severity: 'info',
    },
    {
        id: 'aud-015',
        timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
        userId: 'usr-001',
        userName: 'System Administrator',
        userRole: 'Platform Super Admin',
        action: 'logout',
        module: 'auth',
        description: 'Session timeout — auto logout after 8 hours inactivity',
        ipAddress: '127.0.0.1',
        severity: 'info',
    },
];

const ACTION_ICONS: Partial<Record<AuditAction, React.ReactNode>> = {
    login: <LogIn size={14} />,
    logout: <LogOut size={14} />,
    create: <Plus size={14} />,
    update: <Edit size={14} />,
    delete: <Trash2 size={14} />,
    view: <Eye size={14} />,
    approve: <Shield size={14} />,
    reject: <AlertTriangle size={14} />,
    export: <Download size={14} />,
    import: <RefreshCw size={14} />,
    permission_change: <Lock size={14} />,
    password_change: <Unlock size={14} />,
    payment_processed: <DollarSign size={14} />,
    report_generated: <FileText size={14} />,
};

const SEVERITY_STYLES = {
    info: 'bg-surface-100 text-surface-600',
    warning: 'bg-warning-50 text-warning-700',
    critical: 'bg-danger-50 text-danger-700',
};

const ACTION_STYLES: Partial<Record<AuditAction, string>> = {
    login: 'bg-success-50 text-success-700',
    logout: 'bg-surface-100 text-surface-600',
    create: 'bg-primary-50 text-primary-700',
    update: 'bg-blue-50 text-blue-700',
    delete: 'bg-danger-50 text-danger-700',
    approve: 'bg-success-50 text-success-700',
    reject: 'bg-danger-50 text-danger-700',
    export: 'bg-purple-50 text-purple-700',
    import: 'bg-blue-50 text-blue-700',
    permission_change: 'bg-warning-50 text-warning-700',
    password_change: 'bg-warning-50 text-warning-700',
    payment_processed: 'bg-teal-50 text-teal-700',
    report_generated: 'bg-indigo-50 text-indigo-700',
    view: 'bg-surface-100 text-surface-500',
};

const MODULE_LABELS: Record<AuditModule, string> = {
    auth: 'Authentication',
    clients: 'Clients',
    policies: 'Policies',
    claims: 'Claims',
    leads: 'Leads',
    finance: 'Finance',
    settings: 'Settings',
    users: 'Users',
    documents: 'Documents',
    reports: 'Reports',
    compliance: 'Compliance',
};

export default function AuditPage() {
    const [search, setSearch] = useState('');
    const [moduleFilter, setModuleFilter] = useState<AuditModule | 'all'>('all');
    const [severityFilter, setSeverityFilter] = useState<'info' | 'warning' | 'critical' | 'all'>('all');
    const [userFilter, setUserFilter] = useState('all');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const users = useMemo(() => {
        const set = new Set(AUDIT_LOG.map(e => e.userName));
        return Array.from(set);
    }, []);

    const filtered = AUDIT_LOG.filter(entry => {
        const matchSearch = search === '' ||
            entry.description.toLowerCase().includes(search.toLowerCase()) ||
            entry.userName.toLowerCase().includes(search.toLowerCase()) ||
            entry.action.toLowerCase().includes(search.toLowerCase()) ||
            (entry.resourceLabel ?? '').toLowerCase().includes(search.toLowerCase());
        const matchModule = moduleFilter === 'all' || entry.module === moduleFilter;
        const matchSeverity = severityFilter === 'all' || entry.severity === severityFilter;
        const matchUser = userFilter === 'all' || entry.userName === userFilter;
        return matchSearch && matchModule && matchSeverity && matchUser;
    });

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Audit Trail</h1>
                    <p className="text-sm text-surface-500 mt-1">Full log of system activity, user actions, and security events.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" leftIcon={<Download size={16} />} onClick={() => toast.success('Audit log exported')}>Export Log</Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card padding="md" className="flex items-center gap-3">
                    <div className="p-2.5 rounded-full bg-surface-100 text-surface-600"><Activity size={18} /></div>
                    <div>
                        <p className="text-xs text-surface-500 font-semibold uppercase">Total Events</p>
                        <p className="text-xl font-bold">{AUDIT_LOG.length}</p>
                    </div>
                </Card>
                <Card padding="md" className="flex items-center gap-3">
                    <div className="p-2.5 rounded-full bg-warning-50 text-warning-600"><AlertTriangle size={18} /></div>
                    <div>
                        <p className="text-xs text-surface-500 font-semibold uppercase">Warnings</p>
                        <p className="text-xl font-bold">{AUDIT_LOG.filter(e => e.severity === 'warning').length}</p>
                    </div>
                </Card>
                <Card padding="md" className="flex items-center gap-3">
                    <div className="p-2.5 rounded-full bg-danger-50 text-danger-600"><Shield size={18} /></div>
                    <div>
                        <p className="text-xs text-surface-500 font-semibold uppercase">Critical</p>
                        <p className="text-xl font-bold text-danger-700">{AUDIT_LOG.filter(e => e.severity === 'critical').length}</p>
                    </div>
                </Card>
                <Card padding="md" className="flex items-center gap-3">
                    <div className="p-2.5 rounded-full bg-primary-50 text-primary-600"><User size={18} /></div>
                    <div>
                        <p className="text-xs text-surface-500 font-semibold uppercase">Active Users</p>
                        <p className="text-xl font-bold">{users.length}</p>
                    </div>
                </Card>
            </div>

            {/* Filters */}
            <Card padding="md">
                <div className="flex flex-wrap gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                        <input
                            type="text"
                            placeholder="Search events…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm border border-surface-200 rounded-lg bg-surface-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>
                    <select
                        value={moduleFilter}
                        onChange={e => setModuleFilter(e.target.value as AuditModule | 'all')}
                        className="px-3 py-2 text-sm border border-surface-200 rounded-lg bg-surface-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="all">All Modules</option>
                        {(Object.keys(MODULE_LABELS) as AuditModule[]).map(m => (
                            <option key={m} value={m}>{MODULE_LABELS[m]}</option>
                        ))}
                    </select>
                    <select
                        value={severityFilter}
                        onChange={e => setSeverityFilter(e.target.value as typeof severityFilter)}
                        className="px-3 py-2 text-sm border border-surface-200 rounded-lg bg-surface-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="all">All Severities</option>
                        <option value="info">Info</option>
                        <option value="warning">Warning</option>
                        <option value="critical">Critical</option>
                    </select>
                    <select
                        value={userFilter}
                        onChange={e => setUserFilter(e.target.value)}
                        className="px-3 py-2 text-sm border border-surface-200 rounded-lg bg-surface-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="all">All Users</option>
                        {users.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                </div>
            </Card>

            {/* Table */}
            <Card padding="none" className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-surface-50 border-b border-surface-200">
                            <tr>
                                <th className="text-left font-semibold text-surface-600 px-4 py-3 text-xs uppercase">Timestamp</th>
                                <th className="text-left font-semibold text-surface-600 px-4 py-3 text-xs uppercase">User</th>
                                <th className="text-left font-semibold text-surface-600 px-4 py-3 text-xs uppercase">Action</th>
                                <th className="text-left font-semibold text-surface-600 px-4 py-3 text-xs uppercase">Module</th>
                                <th className="text-left font-semibold text-surface-600 px-4 py-3 text-xs uppercase">Description</th>
                                <th className="text-left font-semibold text-surface-600 px-4 py-3 text-xs uppercase">Severity</th>
                                <th className="text-left font-semibold text-surface-600 px-4 py-3 text-xs uppercase">IP</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-100">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-12 text-surface-400">
                                        <Activity size={32} className="mx-auto mb-2" />
                                        <p>No audit events match your filters.</p>
                                    </td>
                                </tr>
                            ) : filtered.map(entry => (
                                <tr
                                    key={entry.id}
                                    className="hover:bg-surface-50 transition-colors cursor-pointer"
                                    onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                                >
                                    <td className="px-4 py-3 whitespace-nowrap text-xs text-surface-500 font-mono">
                                        {new Date(entry.timestamp).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="size-7 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold shrink-0">
                                                {entry.userName.split(' ').map(w => w[0]).slice(0, 2).join('')}
                                            </div>
                                            <div>
                                                <p className="font-medium text-surface-800 text-xs">{entry.userName}</p>
                                                <p className="text-xs text-surface-400">{entry.userRole}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold', ACTION_STYLES[entry.action] ?? 'bg-surface-100 text-surface-600')}>
                                            {ACTION_ICONS[entry.action]}
                                            {entry.action.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-surface-600">{MODULE_LABELS[entry.module]}</td>
                                    <td className="px-4 py-3 text-xs text-surface-700 max-w-xs">
                                        <p className="truncate">{entry.description}</p>
                                        {entry.resourceLabel && (
                                            <p className="text-surface-400 font-mono mt-0.5">{entry.resourceLabel}</p>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold capitalize', SEVERITY_STYLES[entry.severity])}>
                                            {entry.severity}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-surface-500 font-mono">{entry.ipAddress}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <p className="text-xs text-surface-400 text-center">Showing {filtered.length} of {AUDIT_LOG.length} events · Audit logs are retained for 7 years per regulatory requirements.</p>
        </div>
    );
}
