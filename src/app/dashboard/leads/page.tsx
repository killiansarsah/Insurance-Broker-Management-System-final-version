'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    LayoutGrid,
    List,
    Plus,
    Filter,
    X,
    MoreHorizontal,
    Clock,
    DollarSign,
    User,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data-display/data-table';
import { StatusBadge } from '@/components/data-display/status-badge';
import { mockLeads, LEAD_STAGES } from '@/mock/leads';
import { formatCurrency, formatDate, cn, getInitials } from '@/lib/utils';
import type { Lead, LeadStatus, LeadPriority } from '@/types';
import Link from 'next/link';

export default function LeadsPage() {
    const router = useRouter();
    const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
    const [showFilters, setShowFilters] = useState(false);
    const [filterPriority, setFilterPriority] = useState<LeadPriority | ''>('');

    const filteredLeads = mockLeads.filter((l) => {
        if (filterPriority && l.priority !== filterPriority) return false;
        return true;
    });

    const hasFilters = filterPriority;

    return (
        <div className="space-y-6 animate-fade-in h-[calc(100vh-140px)] flex flex-col">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
                <div>
                    <h1 className="text-3xl font-bold text-surface-900 tracking-tight">Leads</h1>
                    <p className="text-sm text-surface-500 mt-1">Manage sales pipeline and potential clients.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-surface-100 p-1 rounded-[var(--radius-md)]">
                        <button
                            onClick={() => setViewMode('kanban')}
                            className={cn(
                                'p-2 rounded-[var(--radius-sm)] transition-all',
                                viewMode === 'kanban' ? 'bg-white shadow-sm text-primary-600' : 'text-surface-500 hover:text-surface-700'
                            )}
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn(
                                'p-2 rounded-[var(--radius-sm)] transition-all',
                                viewMode === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-surface-500 hover:text-surface-700'
                            )}
                        >
                            <List size={18} />
                        </button>
                    </div>
                    <Link href="/dashboard/leads/new">
                        <Button variant="primary" leftIcon={<Plus size={16} />}>New Lead</Button>
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 shrinks-0">
                <Button variant={showFilters ? 'primary' : 'outline'} size="sm" leftIcon={<Filter size={14} />}
                    onClick={() => setShowFilters(!showFilters)}>
                    Filters
                </Button>
                {hasFilters && (
                    <button onClick={() => setFilterPriority('')}
                        className="inline-flex items-center gap-1 text-xs text-danger-600 font-medium hover:text-danger-700 cursor-pointer">
                        <X size={12} /> Clear all
                    </button>
                )}
            </div>

            {showFilters && (
                <Card padding="md" className="shrink-0 animate-fade-in">
                    <div className="max-w-xs">
                        <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Priority</label>
                        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value as LeadPriority | '')}
                            className="w-full px-3 py-2 text-sm bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500">
                            <option value="">All</option>
                            <option value="hot">Hot</option>
                            <option value="warm">Warm</option>
                            <option value="cold">Cold</option>
                        </select>
                    </div>
                </Card>
            )}

            {/* Content View */}
            {viewMode === 'kanban' ? (
                <div className="flex-1 overflow-x-auto pb-4">
                    <div className="flex gap-4 min-w-max h-full">
                        {LEAD_STAGES.map((stage) => {
                            const stageLeads = filteredLeads.filter((l) => l.status === stage.key);
                            return (
                                <div key={stage.key} className="w-80 flex flex-col h-full">
                                    <div className="flex items-center justify-between mb-3 px-1">
                                        <div className="flex items-center gap-2">
                                            <span className={cn('w-2.5 h-2.5 rounded-full', stage.color.split(' ')[0].replace('bg-', 'bg-'))} />
                                            <h3 className="font-semibold text-surface-700 text-sm">{stage.label}</h3>
                                            <Badge variant="outline" className="px-1.5 py-0 min-w-[20px] justify-center text-[10px]">
                                                {stageLeads.length}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex-1 bg-surface-50/50 rounded-[var(--radius-lg)] p-2 space-y-3 overflow-y-auto border border-surface-100">
                                        {stageLeads.map((lead) => (
                                            <LeadCard key={lead.id} lead={lead} onClick={() => router.push(`/dashboard/leads/${lead.id}`)} />
                                        ))}
                                        {stageLeads.length === 0 && (
                                            <div className="h-24 flex items-center justify-center text-surface-400 text-xs italic border-2 border-dashed border-surface-200 rounded-[var(--radius-md)]">
                                                No leads
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <DataTable<Lead>
                    data={filteredLeads}
                    columns={[
                        { key: 'leadNumber', label: 'Lead #', render: (l) => <span className="font-mono text-xs text-surface-500">{l.leadNumber}</span> },
                        { key: 'contactName', label: 'Name', sortable: true, render: (l) => <span className="font-semibold text-surface-900">{l.contactName}</span> },
                        { key: 'companyName', label: 'Company', render: (l) => l.companyName || '—' },
                        { key: 'status', label: 'Status', sortable: true, render: (l) => <StatusBadge status={l.status} /> },
                        { key: 'priority', label: 'Priority', sortable: true, render: (l) => <StatusBadge status={l.priority} showDot={false} /> },
                        { key: 'score', label: 'Score', sortable: true, render: (l) => <Badge variant={l.score > 70 ? 'success' : l.score > 40 ? 'warning' : 'outline'}>{l.score}</Badge> },
                        { key: 'estimatedPremium', label: 'Est. Premium', sortable: true, render: (l) => formatCurrency(l.estimatedPremium || 0) },
                        { key: 'estimatedCommission', label: 'Est. Commission', sortable: true, render: (l) => formatCurrency(l.estimatedCommission || 0) },
                    ]}
                    searchPlaceholder="Search leads..."
                    searchKeys={['contactName', 'companyName', 'email', 'phone']}
                    onRowClick={(row) => router.push(`/dashboard/leads/${row.id}`)}
                />
            )}
        </div>
    );
}

function LeadCard({ lead, onClick }: { lead: Lead; onClick: () => void }) {
    return (
        <div
            onClick={onClick}
            className="group bg-white p-3 rounded-[var(--radius-md)] border border-surface-200 shadow-sm hover:shadow-md hover:border-primary-300 cursor-pointer transition-all relative"
        >
            <div className="flex justify-between items-start mb-2">
                <StatusBadge status={lead.priority} showDot={false} className="py-0.5 px-1.5 text-[10px]" />
                <button className="text-surface-400 hover:text-surface-600">
                    <MoreHorizontal size={14} />
                </button>
            </div>

            <h4 className="font-bold text-surface-900 text-sm line-clamp-1">{lead.companyName || lead.contactName}</h4>
            {lead.companyName && <p className="text-xs text-surface-500 truncate">{lead.contactName}</p>}

            <div className="mt-3 flex items-center justify-between text-xs text-surface-500">
                <div className="flex items-center gap-1">
                    <DollarSign size={12} />
                    <span>{formatCurrency(lead.estimatedPremium || 0, 'GHS').replace('GHS', '')}</span>
                </div>
                {lead.score > 0 && (
                    <Badge variant={lead.score > 75 ? 'success' : lead.score > 40 ? 'warning' : 'outline'} size="sm" className="px-1 py-0 h-5">
                        {lead.score}
                    </Badge>
                )}
            </div>

            <div className="mt-3 pt-3 border-t border-surface-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-surface-100 text-surface-600 flex items-center justify-center text-[9px] font-bold">
                        {lead.assignedBrokerName ? getInitials(lead.assignedBrokerName) : <User size={10} />}
                    </div>
                    <span className="text-[10px] text-surface-500 truncate max-w-[80px]">{lead.assignedBrokerName || 'Unassigned'}</span>
                </div>
                {lead.nextFollowUpDate && (
                    <div className={cn(
                        "flex items-center gap-1 text-[10px] font-medium",
                        new Date(lead.nextFollowUpDate) < new Date() ? "text-danger-600" : "text-surface-400"
                    )}>
                        <Clock size={10} />
                        <span>{formatDate(lead.nextFollowUpDate, 'relative')}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
