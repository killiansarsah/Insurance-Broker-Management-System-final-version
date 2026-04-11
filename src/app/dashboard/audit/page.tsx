'use client';

import { useState } from 'react';
import {
    Activity,
    Search,
    Download,
    User,
    Shield,
    FileText,
    DollarSign,
    Clock,
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
import { useAuditLog } from '@/hooks/api/use-audit';

type AuditAction =
    | 'LOGIN' | 'LOGOUT'
    | 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW'
    | 'APPROVE' | 'REJECT'
    | 'EXPORT' | 'IMPORT'
    | 'PERMISSION_CHANGE' | 'PASSWORD_CHANGE'
    | 'PAYMENT_PROCESSED' | 'REPORT_GENERATED';

interface AuditEntry {
    id: string;
    createdAt: string;
    userId: string;
    action: string;
    entity: string;
    entityId?: string;
    ipAddress: string;
    userAgent?: string;
    user?: { id: string; firstName: string; lastName: string; email: string; role?: string };
}

const ACTION_ICONS: Record<string, React.ReactNode> = {
    LOGIN: <LogIn size={14} />,
    LOGOUT: <LogOut size={14} />,
    CREATE: <Plus size={14} />,
    UPDATE: <Edit size={14} />,
    DELETE: <Trash2 size={14} />,
    VIEW: <Eye size={14} />,
    APPROVE: <Shield size={14} />,
    REJECT: <AlertTriangle size={14} />,
    EXPORT: <Download size={14} />,
    IMPORT: <RefreshCw size={14} />,
    PERMISSION_CHANGE: <Lock size={14} />,
    PASSWORD_CHANGE: <Unlock size={14} />,
    PAYMENT_PROCESSED: <DollarSign size={14} />,
    REPORT_GENERATED: <FileText size={14} />,
    'login.success': <LogIn size={14} />,
    'login.failed': <AlertTriangle size={14} />,
    'password.reset': <Unlock size={14} />,
};

const ACTION_STYLES: Record<string, string> = {
    LOGIN: 'bg-success-50 text-success-700',
    LOGOUT: 'bg-surface-100 text-surface-600',
    CREATE: 'bg-primary-50 text-primary-700',
    UPDATE: 'bg-blue-50 text-blue-700',
    DELETE: 'bg-danger-50 text-danger-700',
    APPROVE: 'bg-success-50 text-success-700',
    REJECT: 'bg-danger-50 text-danger-700',
    EXPORT: 'bg-purple-50 text-purple-700',
    IMPORT: 'bg-blue-50 text-blue-700',
    PERMISSION_CHANGE: 'bg-warning-50 text-warning-700',
    PASSWORD_CHANGE: 'bg-warning-50 text-warning-700',
    PAYMENT_PROCESSED: 'bg-teal-50 text-teal-700',
    REPORT_GENERATED: 'bg-indigo-50 text-indigo-700',
    VIEW: 'bg-surface-100 text-surface-500',
    'login.success': 'bg-success-50 text-success-700',
    'login.failed': 'bg-danger-50 text-danger-700',
    'password.reset': 'bg-warning-50 text-warning-700',
};

const MODULE_LABELS: Record<string, string> = {
    AUTH: 'Authentication',
    CLIENTS: 'Clients',
    POLICIES: 'Policies',
    CLAIMS: 'Claims',
    LEADS: 'Leads',
    FINANCE: 'Finance',
    SETTINGS: 'Settings',
    USERS: 'Users',
    DOCUMENTS: 'Documents',
    REPORTS: 'Reports',
    COMPLIANCE: 'Compliance',
};

import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function AuditPage() {
    const [search, setSearch] = useState('');
    const [actionFilter, setActionFilter] = useState('');
    const [entityFilter, setEntityFilter] = useState('');
    const [hidePlatformActions, setHidePlatformActions] = useState(true);
    const [page, setPage] = useState(1);

    const { data: auditData, isLoading } = useAuditLog({
        page,
        limit: 50,
        ...(search && { search }),
        ...(actionFilter && { action: actionFilter }),
        ...(entityFilter && { entity: entityFilter }),
        hidePlatformActions,
    });

    const response = auditData as { items?: AuditEntry[]; meta?: { total: number; page: number; totalPages: number } } | undefined;
    const entries = response?.items ?? [];
    const meta = response?.meta;

    const deleteCount = entries.filter(e => e.action === 'DELETE').length;
    const uniqueUsers = new Set(entries.map(e => e.userId)).size;

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
                        <p className="text-xl font-bold">{meta?.total ?? 0}</p>
                    </div>
                </Card>
                <Card padding="md" className="flex items-center gap-3">
                    <div className="p-2.5 rounded-full bg-warning-50 text-warning-600"><AlertTriangle size={18} /></div>
                    <div>
                        <p className="text-xs text-surface-500 font-semibold uppercase">Deletions</p>
                        <p className="text-xl font-bold">{deleteCount}</p>
                    </div>
                </Card>
                <Card padding="md" className="flex items-center gap-3">
                    <div className="p-2.5 rounded-full bg-danger-50 text-danger-600"><Shield size={18} /></div>
                    <div>
                        <p className="text-xs text-surface-500 font-semibold uppercase">Page</p>
                        <p className="text-xl font-bold">{meta?.page ?? 1} / {meta?.totalPages ?? 1}</p>
                    </div>
                </Card>
                <Card padding="md" className="flex items-center gap-3">
                    <div className="p-2.5 rounded-full bg-primary-50 text-primary-600"><User size={18} /></div>
                    <div>
                        <p className="text-xs text-surface-500 font-semibold uppercase">Active Users</p>
                        <p className="text-xl font-bold">{uniqueUsers}</p>
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
                            onChange={e => { setSearch(e.target.value); setPage(1); }}
                            className="w-full pl-9 pr-3 py-2 text-sm border border-surface-200 rounded-lg bg-surface-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>
                    <select
                        value={actionFilter}
                        onChange={e => { setActionFilter(e.target.value); setPage(1); }}
                        className="px-3 py-2 text-sm border border-surface-200 rounded-lg bg-surface-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="">All Actions</option>
                        <option value="CREATE">Create</option>
                        <option value="UPDATE">Update</option>
                        <option value="DELETE">Delete</option>
                        <option value="LOGIN">Login</option>
                        <option value="LOGOUT">Logout</option>
                    </select>
                    <select
                        value={entityFilter}
                        onChange={e => { setEntityFilter(e.target.value); setPage(1); }}
                        className="px-3 py-2 text-sm border border-surface-200 rounded-lg bg-surface-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="">All Entities</option>
                        {Object.keys(MODULE_LABELS).map(m => (
                            <option key={m} value={m}>{MODULE_LABELS[m]}</option>
                        ))}
                    </select>

                    <div className="flex items-center gap-2 px-4 py-2 border border-surface-200 rounded-lg bg-surface-50 ml-auto">
                        <Switch
                            id="hide-platform"
                            checked={hidePlatformActions}
                            onCheckedChange={setHidePlatformActions}
                        />
                        <Label htmlFor="hide-platform" className="text-xs font-bold uppercase tracking-wider text-surface-600 cursor-pointer">
                            Hide Platform Actions
                        </Label>
                    </div>
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
                                <th className="text-left font-semibold text-surface-600 px-4 py-3 text-xs uppercase">Entity</th>
                                <th className="text-left font-semibold text-surface-600 px-4 py-3 text-xs uppercase">Entity ID</th>
                                <th className="text-left font-semibold text-surface-600 px-4 py-3 text-xs uppercase">IP</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-surface-400">
                                        <RefreshCw size={24} className="mx-auto mb-2 animate-spin" />
                                        <p>Loading audit log…</p>
                                    </td>
                                </tr>
                            ) : entries.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-surface-400">
                                        <Activity size={32} className="mx-auto mb-2" />
                                        <p>No audit events match your filters.</p>
                                    </td>
                                </tr>
                            ) : entries.map(entry => {
                                const userName = entry.user ? `${entry.user.firstName ?? ''} ${entry.user.lastName ?? ''}`.trim() : 'System';
                                return (
                                <tr
                                    key={entry.id}
                                    className="hover:bg-surface-50 transition-colors"
                                >
                                    <td className="px-4 py-3 whitespace-nowrap text-xs text-surface-500 font-mono">
                                        {new Date(entry.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="size-7 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold shrink-0">
                                                {userName.split(' ').map(w => w[0]).slice(0, 2).join('')}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium text-surface-800 text-xs">{userName}</p>
                                                    {entry.user?.role === 'PLATFORM_SUPER_ADMIN' && (
                                                        <span className="px-1.5 py-0.5 rounded bg-surface-900 text-[10px] font-bold text-white uppercase tracking-tighter">Platform Admin</span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-surface-400">{entry.user?.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold capitalize', ACTION_STYLES[entry.action] ?? 'bg-surface-100 text-surface-600')}>
                                            {ACTION_ICONS[entry.action]}
                                            {entry.action.replace(/[_.]/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-surface-600">{MODULE_LABELS[entry.entity] ?? entry.entity}</td>
                                    <td className="px-4 py-3 text-xs text-surface-500 font-mono max-w-[200px] truncate">{entry.entityId ?? '—'}</td>
                                    <td className="px-4 py-3 text-xs text-surface-500 font-mono">{entry.ipAddress ?? '—'}</td>
                                </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
                    <span className="text-sm text-surface-500">Page {meta.page} of {meta.totalPages}</span>
                    <Button variant="outline" size="sm" disabled={page >= meta.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
                </div>
            )}

            <p className="text-xs text-surface-400 text-center">Showing {entries.length} of {meta?.total ?? 0} events · Audit logs are retained for 7 years per regulatory requirements.</p>
        </div>
    );
}
