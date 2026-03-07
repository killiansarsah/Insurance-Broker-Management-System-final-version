'use client';

import { useState } from 'react';
import {
    CheckCircle2,
    XCircle,
    Clock,
    AlertTriangle,
    Search,
    Download,
    Filter,
    FileText,
    Shield,
    DollarSign,
    User,
    ChevronRight,
} from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/data-display/status-badge';
import { mockPolicies } from '@/hooks/api';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type ApprovalType = 'policy' | 'endorsement' | 'claim_settlement' | 'cancellation' | 'refund';
type ApprovalStatus = 'pending' | 'approved' | 'rejected';
type Priority = 'low' | 'medium' | 'high' | 'urgent';

interface ApprovalItem {
    id: string;
    refNumber: string;
    type: ApprovalType;
    status: ApprovalStatus;
    priority: Priority;
    subject: string;
    clientName: string;
    amount?: number;
    requestedBy: string;
    requestedAt: string;
    dueDate: string;
    isOverdue: boolean;
    notes?: string;
    linkedId?: string;
}

const MOCK_APPROVALS: ApprovalItem[] = [
    {
        id: 'apr-001',
        refNumber: 'APR-2026-001',
        type: 'policy',
        status: 'pending',
        priority: 'high',
        subject: 'New Motor Policy Issuance — Radiance Petroleum Fleet',
        clientName: 'Radiance Petroleum',
        amount: 185000,
        requestedBy: 'Esi Donkor',
        requestedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        dueDate: new Date(Date.now() + 86400000 * 1).toISOString(),
        isOverdue: false,
        notes: 'Fleet of 14 commercial vehicles. Premium above threshold requires manager sign-off.',
        linkedId: 'pol-001',
    },
    {
        id: 'apr-002',
        refNumber: 'APR-2026-002',
        type: 'claim_settlement',
        status: 'pending',
        priority: 'urgent',
        subject: 'Major Claim Settlement — CLM-2025-0003',
        clientName: 'Ghana Shippers\' Authority',
        amount: 75555,
        requestedBy: 'Kofi Asante',
        requestedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        dueDate: new Date(Date.now() - 86400000 * 1).toISOString(),
        isOverdue: true,
        notes: 'Settlement amount exceeds GHS 50,000 threshold. Awaiting management approval.',
    },
    {
        id: 'apr-003',
        refNumber: 'APR-2026-003',
        type: 'endorsement',
        status: 'pending',
        priority: 'medium',
        subject: 'Policy Endorsement — Additional Vehicle',
        clientName: 'DM Pharmaceuticals',
        amount: 4200,
        requestedBy: 'Abena Nyarko',
        requestedAt: new Date(Date.now() - 86400000 * 0.5).toISOString(),
        dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
        isOverdue: false,
        notes: 'Adding 1 Toyota HiLux to existing fleet policy.',
    },
    {
        id: 'apr-004',
        refNumber: 'APR-2026-004',
        type: 'cancellation',
        status: 'pending',
        priority: 'medium',
        subject: 'Policy Cancellation Request — Client Request',
        clientName: 'Samuel Adjei',
        amount: 3500,
        requestedBy: 'Esi Donkor',
        requestedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
        isOverdue: false,
        notes: 'Client sold vehicle. Requesting mid-term cancellation & pro-rata refund.',
    },
    {
        id: 'apr-005',
        refNumber: 'APR-2026-005',
        type: 'refund',
        status: 'pending',
        priority: 'low',
        subject: 'Premium Refund — Overpayment',
        clientName: 'CAPP Global Limited',
        amount: 1250,
        requestedBy: 'Kofi Asante',
        requestedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
        dueDate: new Date(Date.now() + 86400000 * 4).toISOString(),
        isOverdue: false,
        notes: 'Double payment detected. GHS 1,250 refund to be processed.',
    },
    {
        id: 'apr-006',
        refNumber: 'APR-2026-006',
        type: 'policy',
        status: 'approved',
        priority: 'high',
        subject: 'New Fire Policy — Agroterrum Ghana Warehouse',
        clientName: 'Agroterrum Ghana LTD',
        amount: 36185,
        requestedBy: 'Kofi Asante',
        requestedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        dueDate: new Date(Date.now() - 86400000 * 2).toISOString(),
        isOverdue: false,
    },
    {
        id: 'apr-007',
        refNumber: 'APR-2026-007',
        type: 'claim_settlement',
        status: 'rejected',
        priority: 'medium',
        subject: 'Claim Settlement — Disputed Amount',
        clientName: 'Radiance Petroleum',
        amount: 22000,
        requestedBy: 'Abena Nyarko',
        requestedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        dueDate: new Date(Date.now() - 86400000 * 5).toISOString(),
        isOverdue: false,
        notes: 'Rejected: Assessment report not attached. Please resubmit with surveyor report.',
    },
];

const TYPE_LABELS: Record<ApprovalType, string> = {
    policy: 'New Policy',
    endorsement: 'Endorsement',
    claim_settlement: 'Claim Settlement',
    cancellation: 'Cancellation',
    refund: 'Refund',
};

const TYPE_COLORS: Record<ApprovalType, string> = {
    policy: 'bg-primary-50 text-primary-700',
    endorsement: 'bg-blue-50 text-blue-700',
    claim_settlement: 'bg-orange-50 text-orange-700',
    cancellation: 'bg-warning-50 text-warning-700',
    refund: 'bg-purple-50 text-purple-700',
};

const PRIORITY_COLORS: Record<Priority, string> = {
    low: 'bg-surface-100 text-surface-600',
    medium: 'bg-blue-50 text-blue-700',
    high: 'bg-warning-50 text-warning-700',
    urgent: 'bg-danger-50 text-danger-700',
};

function ApprovalCard({ item, onApprove, onReject }: { item: ApprovalItem; onApprove: (id: string) => void; onReject: (id: string) => void }) {
    const router = useRouter();

    return (
        <Card padding="none" className={cn('overflow-hidden transition-shadow hover:shadow-md', item.isOverdue && item.status === 'pending' && 'border-danger-200')}>
            <div className="p-4 flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Left: icon */}
                <div className={cn('shrink-0 p-2.5 rounded-lg', TYPE_COLORS[item.type])}>
                    {item.type === 'policy' ? <FileText size={18} /> :
                        item.type === 'claim_settlement' ? <DollarSign size={18} /> :
                            item.type === 'endorsement' ? <Shield size={18} /> :
                                item.type === 'cancellation' ? <XCircle size={18} /> :
                                    <DollarSign size={18} />}
                </div>

                {/* Middle: info */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-surface-500">{item.refNumber}</span>
                        <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold', TYPE_COLORS[item.type])}>{TYPE_LABELS[item.type]}</span>
                        <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold', PRIORITY_COLORS[item.priority])}>{item.priority.toUpperCase()}</span>
                        {item.isOverdue && <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-danger-50 text-danger-700 flex items-center gap-1"><AlertTriangle size={10} /> OVERDUE</span>}
                    </div>
                    <h3 className="font-semibold text-surface-900 text-sm leading-snug">{item.subject}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-surface-500">
                        <span className="flex items-center gap-1"><User size={11} />{item.clientName}</span>
                        <span className="flex items-center gap-1"><Clock size={11} />By {item.requestedBy} · {formatDate(item.requestedAt)}</span>
                        <span className={cn('flex items-center gap-1', item.isOverdue ? 'text-danger-600 font-medium' : '')}>
                            <Clock size={11} />Due {formatDate(item.dueDate)}
                        </span>
                    </div>
                    {item.amount && (
                        <p className="mt-1 text-sm font-semibold text-surface-800">{formatCurrency(item.amount)}</p>
                    )}
                    {item.notes && (
                        <p className="mt-2 text-xs text-surface-500 italic border-l-2 border-surface-200 pl-2">{item.notes}</p>
                    )}
                </div>

                {/* Right: status / actions */}
                <div className="flex items-center gap-2 shrink-0">
                    {item.status === 'pending' ? (
                        <>
                            <Button size="sm" variant="outline" className="text-danger-600 border-danger-200 hover:bg-danger-50" onClick={() => onReject(item.id)}>
                                <XCircle size={14} className="mr-1" /> Reject
                            </Button>
                            <Button size="sm" variant="primary" onClick={() => onApprove(item.id)}>
                                <CheckCircle2 size={14} className="mr-1" /> Approve
                            </Button>
                        </>
                    ) : item.status === 'approved' ? (
                        <span className="flex items-center gap-1 text-xs font-semibold text-success-600 bg-success-50 px-3 py-1.5 rounded-full">
                            <CheckCircle2 size={14} /> Approved
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 text-xs font-semibold text-danger-600 bg-danger-50 px-3 py-1.5 rounded-full">
                            <XCircle size={14} /> Rejected
                        </span>
                    )}
                </div>
            </div>
        </Card>
    );
}

export default function ApprovalsPage() {
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState<ApprovalType | 'all'>('all');
    const [statusFilter, setStatusFilter] = useState<ApprovalStatus | 'all'>('pending');
    const [items, setItems] = useState<ApprovalItem[]>(MOCK_APPROVALS);

    const filtered = items.filter(item => {
        const matchSearch = search === '' ||
            item.subject.toLowerCase().includes(search.toLowerCase()) ||
            item.clientName.toLowerCase().includes(search.toLowerCase()) ||
            item.refNumber.toLowerCase().includes(search.toLowerCase());
        const matchType = typeFilter === 'all' || item.type === typeFilter;
        const matchStatus = statusFilter === 'all' || item.status === statusFilter;
        return matchSearch && matchType && matchStatus;
    });

    const pending = items.filter(i => i.status === 'pending');
    const overdue = items.filter(i => i.isOverdue && i.status === 'pending');

    function handleApprove(id: string) {
        setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'approved' as const, isOverdue: false } : i));
        toast.success('Approved', { description: 'The request has been approved successfully.' });
    }

    function handleReject(id: string) {
        setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'rejected' as const } : i));
        toast.error('Rejected', { description: 'The request has been rejected.' });
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Approvals</h1>
                    <p className="text-sm text-surface-500 mt-1">Review and action pending approval requests.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" leftIcon={<Download size={16} />} onClick={() => toast.success('Export ready')}>Export</Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card padding="md" className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-warning-50 text-warning-600"><Clock size={20} /></div>
                    <div>
                        <p className="text-xs font-semibold text-surface-500 uppercase">Pending</p>
                        <p className="text-2xl font-bold text-surface-900">{pending.length}</p>
                    </div>
                </Card>
                <Card padding="md" className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-danger-50 text-danger-600"><AlertTriangle size={20} /></div>
                    <div>
                        <p className="text-xs font-semibold text-surface-500 uppercase">Overdue</p>
                        <p className="text-2xl font-bold text-danger-700">{overdue.length}</p>
                    </div>
                </Card>
                <Card padding="md" className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-primary-50 text-primary-600"><DollarSign size={20} /></div>
                    <div>
                        <p className="text-xs font-semibold text-surface-500 uppercase">Pending Value</p>
                        <p className="text-2xl font-bold text-surface-900">{formatCurrency(pending.reduce((sum, i) => sum + (i.amount ?? 0), 0))}</p>
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
                            placeholder="Search approvals…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm border border-surface-200 rounded-lg bg-surface-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value as ApprovalStatus | 'all')}
                        className="px-3 py-2 text-sm border border-surface-200 rounded-lg bg-surface-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>

                    <select
                        value={typeFilter}
                        onChange={e => setTypeFilter(e.target.value as ApprovalType | 'all')}
                        className="px-3 py-2 text-sm border border-surface-200 rounded-lg bg-surface-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="all">All Types</option>
                        <option value="policy">New Policy</option>
                        <option value="endorsement">Endorsement</option>
                        <option value="claim_settlement">Claim Settlement</option>
                        <option value="cancellation">Cancellation</option>
                        <option value="refund">Refund</option>
                    </select>
                </div>
            </Card>

            {/* List */}
            <div className="space-y-3">
                {filtered.length === 0 ? (
                    <div className="text-center py-16 text-surface-400">
                        <CheckCircle2 size={40} className="mx-auto mb-3 text-success-400" />
                        <p className="font-semibold text-surface-600">All clear!</p>
                        <p className="text-sm">No approval requests match your filters.</p>
                    </div>
                ) : (
                    filtered.map(item => (
                        <ApprovalCard key={item.id} item={item} onApprove={handleApprove} onReject={handleReject} />
                    ))
                )}
            </div>
        </div>
    );
}
