'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    AlertTriangle,
    ChevronRight,
    MoveUp,
    Shield,
    MessageSquare,
    Clock,
    User,
    Search,
    Download,
    FileText,
    Phone,
    CheckCircle2,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { claims } from '@/mock/claims';
import { MOCK_COMPLAINTS } from '@/mock/documents-complaints';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'sonner';

type EscalationType = 'claim' | 'complaint';

interface EscalatedItem {
    id: string;
    refNumber: string;
    type: EscalationType;
    level: number; // 1=manager, 2=compliance, 3=NIC
    clientName: string;
    subject: string;
    amount?: number;
    daysPending: number;
    isBreached: boolean;
    assignedTo?: string;
    escalatedAt: string;
    linkedId: string;
}

const LEVEL_LABELS: Record<number, string> = {
    1: 'Manager',
    2: 'Compliance',
    3: 'NIC Regulator',
};

const LEVEL_COLORS: Record<number, string> = {
    1: 'bg-warning-50 text-warning-700 border-warning-200',
    2: 'bg-orange-50 text-orange-700 border-orange-200',
    3: 'bg-danger-50 text-danger-700 border-danger-200',
};

// Build a unified escalations list from claims + complaints
const ESCALATED_ITEMS: EscalatedItem[] = [
    // Claims overdue become escalated
    ...claims.filter(c => c.isOverdue).map(c => ({
        id: `esc-c-${c.id}`,
        refNumber: c.claimNumber,
        type: 'claim' as const,
        level: 1,
        clientName: c.clientName,
        subject: c.incidentDescription,
        amount: c.claimAmount,
        daysPending: Math.floor((Date.now() - new Date(c.registrationDate ?? c.createdAt).getTime()) / 86400000),
        isBreached: true,
        assignedTo: 'Kofi Asante',
        escalatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        linkedId: c.id,
    })),
    // Complaints with escalationLevel > 0
    ...MOCK_COMPLAINTS.filter(c => c.escalationLevel > 0).map(c => ({
        id: `esc-cmp-${c.id}`,
        refNumber: c.complaintNumber,
        type: 'complaint' as const,
        level: c.escalationLevel,
        clientName: c.complainantName,
        subject: c.subject,
        daysPending: Math.floor((Date.now() - new Date(c.createdAt).getTime()) / 86400000),
        isBreached: c.isBreached,
        assignedTo: 'Abena Nyarko',
        escalatedAt: c.createdAt,
        linkedId: c.id,
    })),
    // Add a few manual mock escalations for demo
    {
        id: 'esc-man-001',
        refNumber: 'CLM-2025-0003',
        type: 'claim',
        level: 2,
        clientName: 'Ghana Shippers\' Authority',
        subject: 'Major collision claim — assessor dispute on valuation',
        amount: 75555,
        daysPending: 14,
        isBreached: true,
        assignedTo: 'Dr. Ernest Osei',
        escalatedAt: new Date(Date.now() - 86400000 * 14).toISOString(),
        linkedId: 'CLM-2025-0003',
    },
    {
        id: 'esc-man-002',
        refNumber: 'CMP-2026-003',
        type: 'complaint',
        level: 1,
        clientName: 'DM Pharmaceuticals',
        subject: 'Delayed policy renewal processing',
        daysPending: 5,
        isBreached: false,
        assignedTo: 'Esi Donkor',
        escalatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        linkedId: 'cmp-3',
    },
    {
        id: 'esc-man-003',
        refNumber: 'CLM-2026-0007',
        type: 'claim',
        level: 3,
        clientName: 'Radiance Petroleum',
        subject: 'Third-party liability claim — legal proceedings initiated',
        amount: 210000,
        daysPending: 31,
        isBreached: true,
        assignedTo: 'Dr. Ernest Osei',
        escalatedAt: new Date(Date.now() - 86400000 * 31).toISOString(),
        linkedId: 'CLM-2026-0007',
    },
];

function EscalationBadge({ level }: { level: number }) {
    return (
        <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border', LEVEL_COLORS[level] ?? 'bg-surface-100')}>
            <MoveUp size={10} />
            L{level} — {LEVEL_LABELS[level] ?? 'Unknown'}
        </span>
    );
}

export default function EscalationsPage() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState<EscalationType | 'all'>('all');
    const [levelFilter, setLevelFilter] = useState<number | 'all'>('all');

    const filtered = ESCALATED_ITEMS.filter(item => {
        const matchSearch = search === '' ||
            item.clientName.toLowerCase().includes(search.toLowerCase()) ||
            item.refNumber.toLowerCase().includes(search.toLowerCase()) ||
            item.subject.toLowerCase().includes(search.toLowerCase());
        const matchType = typeFilter === 'all' || item.type === typeFilter;
        const matchLevel = levelFilter === 'all' || item.level === levelFilter;
        return matchSearch && matchType && matchLevel;
    });

    const breached = ESCALATED_ITEMS.filter(i => i.isBreached).length;
    const level3 = ESCALATED_ITEMS.filter(i => i.level === 3).length;
    const totalClaims = ESCALATED_ITEMS.filter(i => i.type === 'claim').reduce((s, i) => s + (i.amount ?? 0), 0);

    function handleEscalateUp(item: EscalatedItem) {
        toast.success(`Escalated to Level ${Math.min(item.level + 1, 3)}`, {
            description: `${item.refNumber} has been escalated to ${LEVEL_LABELS[Math.min(item.level + 1, 3)]}.`,
        });
    }

    function handleResolve(item: EscalatedItem) {
        toast.success('Marked as Resolved', {
            description: `${item.refNumber} has been resolved and removed from escalations.`,
        });
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Escalations</h1>
                    <p className="text-sm text-surface-500 mt-1">Overdue claims and complaints requiring elevated attention.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" leftIcon={<Download size={16} />} onClick={() => toast.success('Report exported')}>Export</Button>
                    <Button variant="primary" leftIcon={<Phone size={16} />} onClick={() => toast.info('Contacting clients…', { description: 'Batch notification sent to all escalated clients.' })}>
                        Notify All
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card padding="md" className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-warning-50 text-warning-600"><AlertTriangle size={20} /></div>
                    <div>
                        <p className="text-xs font-semibold text-surface-500 uppercase">Total Escalated</p>
                        <p className="text-2xl font-bold text-surface-900">{ESCALATED_ITEMS.length}</p>
                    </div>
                </Card>
                <Card padding="md" className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-danger-50 text-danger-600"><Clock size={20} /></div>
                    <div>
                        <p className="text-xs font-semibold text-surface-500 uppercase">SLA Breached</p>
                        <p className="text-2xl font-bold text-danger-700">{breached}</p>
                    </div>
                </Card>
                <Card padding="md" className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-danger-100 text-danger-700"><Shield size={20} /></div>
                    <div>
                        <p className="text-xs font-semibold text-surface-500 uppercase">At NIC Level</p>
                        <p className="text-2xl font-bold text-surface-900">{level3}</p>
                    </div>
                </Card>
                <Card padding="md" className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-primary-50 text-primary-600"><FileText size={20} /></div>
                    <div>
                        <p className="text-xs font-semibold text-surface-500 uppercase">Claims Exposure</p>
                        <p className="text-xl font-bold text-surface-900">{formatCurrency(totalClaims)}</p>
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
                            placeholder="Search escalations…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm border border-surface-200 rounded-lg bg-surface-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                    <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as typeof typeFilter)} className="px-3 py-2 text-sm border border-surface-200 rounded-lg bg-surface-50 focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <option value="all">All Types</option>
                        <option value="claim">Claims</option>
                        <option value="complaint">Complaints</option>
                    </select>
                    <select value={levelFilter === 'all' ? 'all' : String(levelFilter)} onChange={e => setLevelFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))} className="px-3 py-2 text-sm border border-surface-200 rounded-lg bg-surface-50 focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <option value="all">All Levels</option>
                        <option value="1">Level 1 — Manager</option>
                        <option value="2">Level 2 — Compliance</option>
                        <option value="3">Level 3 — NIC</option>
                    </select>
                </div>
            </Card>

            {/* List */}
            <div className="space-y-3">
                {filtered.length === 0 ? (
                    <div className="text-center py-16 text-surface-400">
                        <CheckCircle2 size={40} className="mx-auto mb-3 text-success-400" />
                        <p className="font-semibold text-surface-600">No escalations!</p>
                        <p className="text-sm">All cases are within normal processing times.</p>
                    </div>
                ) : filtered.map(item => (
                    <Card key={item.id} padding="none" className={cn('overflow-hidden', item.isBreached && 'border-danger-200')}>
                        <div className="p-4 flex flex-col sm:flex-row sm:items-start gap-4">
                            <div className={cn('shrink-0 p-2.5 rounded-lg', item.type === 'claim' ? 'bg-orange-50 text-orange-600' : 'bg-purple-50 text-purple-600')}>
                                {item.type === 'claim' ? <FileText size={18} /> : <MessageSquare size={18} />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <span className="text-xs font-medium text-surface-500">{item.refNumber}</span>
                                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold capitalize', item.type === 'claim' ? 'bg-orange-50 text-orange-700' : 'bg-purple-50 text-purple-700')}>{item.type}</span>
                                    <EscalationBadge level={item.level} />
                                    {item.isBreached && <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-danger-50 text-danger-700">SLA BREACHED</span>}
                                </div>
                                <h3 className="font-semibold text-surface-900 text-sm">{item.subject}</h3>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-surface-500">
                                    <span className="flex items-center gap-1"><User size={11} />{item.clientName}</span>
                                    <span className="flex items-center gap-1"><Clock size={11} />{item.daysPending} days pending</span>
                                    <span className="flex items-center gap-1"><User size={11} />Handler: {item.assignedTo}</span>
                                </div>
                                {item.amount && <p className="mt-1 text-sm font-semibold text-surface-800">{formatCurrency(item.amount)}</p>}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <Button size="sm" variant="outline" onClick={() => {
                                    if (item.type === 'claim') router.push(`/dashboard/claims/${item.linkedId}`);
                                    else router.push(`/dashboard/complaints/${item.linkedId}`);
                                }}>
                                    View <ChevronRight size={12} className="ml-1" />
                                </Button>
                                {item.level < 3 && (
                                    <Button size="sm" variant="outline" className="text-warning-600 border-warning-200 hover:bg-warning-50" onClick={() => handleEscalateUp(item)}>
                                        <MoveUp size={14} className="mr-1" /> Escalate
                                    </Button>
                                )}
                                <Button size="sm" variant="primary" onClick={() => handleResolve(item)}>
                                    <CheckCircle2 size={14} className="mr-1" /> Resolve
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
