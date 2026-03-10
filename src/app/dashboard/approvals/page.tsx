'use client';

import { useState, useMemo } from 'react';
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
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useApprovals, useApproveRequest, useRejectRequest } from '@/hooks/api/use-approvals';

type ApprovalType = 'POLICY' | 'ENDORSEMENT' | 'CLAIM_SETTLEMENT' | 'CANCELLATION' | 'REFUND';
type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

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

const TYPE_LABELS: Record<ApprovalType, string> = {
    POLICY: 'New Policy',
    ENDORSEMENT: 'Endorsement',
    CLAIM_SETTLEMENT: 'Claim Settlement',
    CANCELLATION: 'Cancellation',
    REFUND: 'Refund',
};

const TYPE_COLORS: Record<ApprovalType, string> = {
    POLICY: 'bg-primary-50 text-primary-700',
    ENDORSEMENT: 'bg-blue-50 text-blue-700',
    CLAIM_SETTLEMENT: 'bg-orange-50 text-orange-700',
    CANCELLATION: 'bg-warning-50 text-warning-700',
    REFUND: 'bg-purple-50 text-purple-700',
};

const PRIORITY_COLORS: Record<Priority, string> = {
    LOW: 'bg-surface-100 text-surface-600',
    MEDIUM: 'bg-blue-50 text-blue-700',
    HIGH: 'bg-warning-50 text-warning-700',
    URGENT: 'bg-danger-50 text-danger-700',
};

function ApprovalCard({ item, onApprove, onReject }: { item: ApprovalItem; onApprove: (id: string) => void; onReject: (id: string) => void }) {
    const router = useRouter();

    return (
        <Card padding="none" className={cn('overflow-hidden transition-shadow hover:shadow-md', item.isOverdue && item.status === 'PENDING' && 'border-danger-200')}>
            <div className="p-4 flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Left: icon */}
                <div className={cn('shrink-0 p-2.5 rounded-lg', TYPE_COLORS[item.type])}>
                    {item.type === 'POLICY' ? <FileText size={18} /> :
                        item.type === 'CLAIM_SETTLEMENT' ? <DollarSign size={18} /> :
                            item.type === 'ENDORSEMENT' ? <Shield size={18} /> :
                                item.type === 'CANCELLATION' ? <XCircle size={18} /> :
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
                    {item.status === 'PENDING' ? (
                        <>
                            <Button size="sm" variant="outline" className="text-danger-600 border-danger-200 hover:bg-danger-50" onClick={() => onReject(item.id)}>
                                <XCircle size={14} className="mr-1" /> Reject
                            </Button>
                            <Button size="sm" variant="primary" onClick={() => onApprove(item.id)}>
                                <CheckCircle2 size={14} className="mr-1" /> Approve
                            </Button>
                        </>
                    ) : item.status === 'APPROVED' ? (
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
    const [statusFilter, setStatusFilter] = useState<ApprovalStatus | 'all'>('PENDING');
    const { data: approvalsData } = useApprovals();
    const approveMutation = useApproveRequest();
    const rejectMutation = useRejectRequest();

    const items: ApprovalItem[] = useMemo(() => {
        const raw = (approvalsData as any)?.data || [];
        return raw.map((a: any) => ({
            id: a.id,
            refNumber: a.approvalNumber || a.id.slice(0, 8),
            type: (a.type ?? 'POLICY') as ApprovalType,
            status: (a.status ?? 'PENDING') as ApprovalStatus,
            priority: (a.priority ?? 'MEDIUM') as Priority,
            subject: a.description || a.title || 'Approval Request',
            clientName: a.clientName || '',
            amount: a.amount ? Number(a.amount) : undefined,
            requestedBy: a.requestedBy?.firstName ? `${a.requestedBy.firstName} ${a.requestedBy.lastName}` : a.requestedByName || '',
            requestedAt: a.createdAt,
            dueDate: a.dueDate || a.createdAt,
            isOverdue: a.isOverdue ?? false,
            notes: a.notes || a.comment,
            linkedId: a.entityId,
        }));
    }, [approvalsData]);

    const filtered = items.filter(item => {
        const matchSearch = search === '' ||
            item.subject.toLowerCase().includes(search.toLowerCase()) ||
            item.clientName.toLowerCase().includes(search.toLowerCase()) ||
            item.refNumber.toLowerCase().includes(search.toLowerCase());
        const matchType = typeFilter === 'all' || item.type === typeFilter;
        const matchStatus = statusFilter === 'all' || item.status === statusFilter;
        return matchSearch && matchType && matchStatus;
    });

    const pending = items.filter(i => i.status === 'PENDING');
    const overdue = items.filter(i => i.isOverdue && i.status === 'PENDING');

    function handleApprove(id: string) {
        approveMutation.mutate({ id }, {
            onSuccess: () => toast.success('Approved', { description: 'The request has been approved successfully.' }),
        });
    }

    function handleReject(id: string) {
        rejectMutation.mutate({ id, reason: 'Rejected by reviewer' }, {
            onSuccess: () => toast.error('Rejected', { description: 'The request has been rejected.' }),
        });
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
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                    </select>

                    <select
                        value={typeFilter}
                        onChange={e => setTypeFilter(e.target.value as ApprovalType | 'all')}
                        className="px-3 py-2 text-sm border border-surface-200 rounded-lg bg-surface-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="all">All Types</option>
                        <option value="POLICY">New Policy</option>
                        <option value="ENDORSEMENT">Endorsement</option>
                        <option value="CLAIM_SETTLEMENT">Claim Settlement</option>
                        <option value="CANCELLATION">Cancellation</option>
                        <option value="REFUND">Refund</option>
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
