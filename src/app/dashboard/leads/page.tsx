'use client';

import { useState, useEffect, useRef } from 'react';
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
    ArrowRight,
    Search,
    ChevronDown,
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data-display/data-table';
import { StatusBadge } from '@/components/data-display/status-badge';
import { CustomSelect } from '@/components/ui/select-custom';
import { mockLeads, LEAD_STAGES } from '@/mock/leads';
import { formatCurrency, formatDate, cn, getInitials } from '@/lib/utils';
import type { Lead, LeadStatus, LeadPriority } from '@/types';
import Link from 'next/link';

// --- Kanban Column IDs ---
const COLUMN_IDS = LEAD_STAGES.map(s => s.key);

export default function LeadsPage() {
    const router = useRouter();
    const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
    const [leads, setLeads] = useState<Lead[]>(mockLeads);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPriority, setFilterPriority] = useState<LeadPriority | ''>('');
    const [searchWidth, setSearchWidth] = useState(160);
    const mirrorRef = useRef<HTMLSpanElement>(null);

    // --- Auto-grow search width ---
    useEffect(() => {
        if (mirrorRef.current) {
            const measured = mirrorRef.current.offsetWidth;
            // 40px left padding (icon) + 16px right padding + 4px buffer
            setSearchWidth(Math.max(160, Math.min(measured + 60, 420)));
        }
    }, [searchTerm]);

    // --- Filter Logic ---
    const filteredLeads = leads.filter((l) => {
        const matchesSearch =
            l.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (l.companyName?.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesPriority = filterPriority ? l.priority === filterPriority : true;
        return matchesSearch && matchesPriority;
    });

    // --- Drag and Drop Handler ---
    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const newLeads = Array.from(leads);
        const leadIndex = newLeads.findIndex(l => l.id === draggableId);
        if (leadIndex !== -1) {
            newLeads[leadIndex] = {
                ...newLeads[leadIndex],
                status: destination.droppableId as LeadStatus,
                updatedAt: new Date().toISOString()
            };
            setLeads(newLeads);
        }
    };

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col space-y-6 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 shrink-0">
                <div>
                    <h1 className="text-3xl font-bold text-surface-900 tracking-tight">
                        Leads
                    </h1>
                    <p className="text-sm text-surface-500 mt-1">
                        Manage your sales pipeline and potential clients.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    {/* View Switcher */}
                    <div className="flex items-center bg-surface-100 p-1 rounded-xl border border-surface-200">
                        <button
                            onClick={() => setViewMode('kanban')}
                            className={cn(
                                'p-2 rounded-lg transition-all',
                                viewMode === 'kanban' ? 'bg-background shadow-sm text-primary-600' : 'text-surface-500 hover:text-surface-700'
                            )}
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn(
                                'p-2 rounded-lg transition-all',
                                viewMode === 'list' ? 'bg-background shadow-sm text-primary-600' : 'text-surface-500 hover:text-surface-700'
                            )}
                        >
                            <List size={18} />
                        </button>
                    </div>

                    <Link href="/dashboard/leads/new">
                        <Button
                            variant="primary"
                            className="rounded-xl px-5 font-bold"
                            leftIcon={<Plus size={18} />}
                        >
                            New Lead
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-3 shrink-0">
                {/* Auto-grow Search */}
                <div
                    className="relative shrink-0"
                    style={{ width: searchWidth, transition: 'width 0.2s ease' }}
                >
                    {/* Hidden mirror span to measure text width */}
                    <span
                        ref={mirrorRef}
                        aria-hidden="true"
                        className="absolute invisible whitespace-pre text-sm pointer-events-none"
                        style={{ font: 'inherit' }}
                    >
                        {searchTerm || ''}
                    </span>
                    <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-surface-400">
                        <Search size={16} />
                    </span>
                    <input
                        type="text"
                        placeholder="Search leads..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 transition-all shadow-sm"
                    />
                </div>

                {/* Cancel */}
                {(searchTerm || filterPriority) && (
                    <button
                        onClick={() => { setSearchTerm(''); setFilterPriority(''); }}
                        className="p-2 text-danger-500 hover:bg-danger-50 rounded-lg transition-colors shrink-0"
                    >
                        <X size={18} />
                    </button>
                )}

                {/* Filters */}
                <div className="flex items-center gap-2 shrink-0">
                    <CustomSelect
                        label="Priority"
                        options={['hot', 'warm', 'cold']}
                        value={filterPriority}
                        onChange={(v) => setFilterPriority(v as LeadPriority | '')}
                        clearable
                    />
                </div>
            </div>

            {/* Content View */}
            <div className="flex-1 min-h-0 relative">
                {viewMode === 'kanban' ? (
                    <DragDropContext onDragEnd={onDragEnd}>
                        <div className="absolute inset-0 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-surface-200 hover:scrollbar-thumb-surface-300">
                            <div className="flex gap-5 h-full min-w-max">
                                {LEAD_STAGES.map((stage) => (
                                    <KanbanColumn
                                        key={stage.key}
                                        stage={stage}
                                        leads={filteredLeads.filter(l => l.status === stage.key)}
                                    />
                                ))}
                            </div>
                        </div>
                    </DragDropContext>
                ) : (
                    <div className="bg-background rounded-2xl border border-surface-200 shadow-sm overflow-hidden h-full">
                        <DataTable<Lead>
                            data={filteredLeads}
                            columns={[
                                { key: 'leadNumber', label: 'ID', render: (l) => <span className="text-xs font-medium text-surface-500">{l.leadNumber}</span> },
                                {
                                    key: 'contactName', label: 'Lead Name', sortable: true, render: (l) => (
                                        <div className="flex flex-col">
                                            <span className="font-bold text-surface-900">{l.contactName}</span>
                                            {l.companyName && <span className="text-xs text-surface-400">{l.companyName}</span>}
                                        </div>
                                    )
                                },
                                { key: 'status', label: 'Status', sortable: true, render: (l) => <StatusBadge status={l.status} /> },
                                { key: 'priority', label: 'Priority', sortable: true, render: (l) => <StatusBadge status={l.priority} showDot={false} /> },
                                {
                                    key: 'score', label: 'Strength', sortable: true, render: (l) => (
                                        <div className="flex items-center gap-2">
                                            <div className="w-12 h-1.5 bg-surface-100 rounded-full overflow-hidden">
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full transition-all duration-1000",
                                                        l.score > 70 ? "bg-success-500" :
                                                            l.score > 40 ? "bg-warning-500" : "bg-primary-400"
                                                    )}
                                                    style={{ width: `${l.score}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-semibold text-surface-500">{l.score}%</span>
                                        </div>
                                    )
                                },
                                {
                                    key: 'estimatedPremium', label: 'Premium', sortable: true, render: (l) => (
                                        <span className="font-bold text-surface-900">
                                            {formatCurrency(l.estimatedPremium || 0, 'GHS')}
                                        </span>
                                    )
                                },
                            ]}
                            searchPlaceholder="Search leads..."
                            searchKeys={['contactName', 'companyName', 'email', 'phone']}
                            onRowClick={(row) => router.push(`/dashboard/leads/${row.id}`)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

// --- Sub-Components ---

function KanbanColumn({ stage, leads }: { stage: any, leads: Lead[] }) {
    return (
        <div className="w-72 flex flex-col h-full select-none">
            {/* Column Header */}
            <div className="flex items-center justify-between mb-3 px-2">
                <div className="flex items-center gap-2">
                    <div className={cn('w-2 h-2 rounded-full', stage.color.split(' ')[0].replace('bg-', 'bg-'))} />
                    <h4 className="text-sm font-bold text-surface-700 capitalize">
                        {stage.label}
                    </h4>
                </div>
                <div className="px-2 py-0.5 rounded-full bg-surface-100 text-[10px] font-bold text-surface-500">
                    {leads.length}
                </div>
            </div>

            {/* Droppable Area */}
            <Droppable droppableId={stage.key}>
                {(provided, snapshot) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={cn(
                            "grow bg-surface-50/50 rounded-2xl p-2 space-y-3 overflow-y-auto border border-dashed transition-all duration-300 scrollbar-hide",
                            snapshot.isDraggingOver ? "bg-primary-50/50 border-primary-300 ring-2 ring-primary-500/5 shadow-inner" : "border-surface-200"
                        )}
                    >
                        {leads.map((lead, index) => (
                            <DraggableLeadCard key={lead.id} lead={lead} index={index} />
                        ))}
                        {provided.placeholder}

                        {leads.length === 0 && !snapshot.isDraggingOver && (
                            <div className="h-24 flex items-center justify-center text-surface-400 border border-dashed border-surface-200 rounded-xl opacity-50 px-4 text-center">
                                <span className="text-[10px] font-medium uppercase tracking-tight">Drag a lead here</span>
                            </div>
                        )}
                    </div>
                )}
            </Droppable>
        </div>
    );
}

function DraggableLeadCard({ lead, index }: { lead: Lead; index: number }) {
    const router = useRouter();

    return (
        <Draggable draggableId={lead.id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => router.push(`/dashboard/leads/${lead.id}`)}
                    className={cn(
                        "group relative bg-background border rounded-xl p-3.5 transition-all duration-200 cursor-pointer overflow-hidden",
                        snapshot.isDragging ?
                            "shadow-2xl border-primary-400 scale-[1.02] z-50 ring-2 ring-primary-500/20" :
                            "border-surface-200 shadow-sm hover:shadow-md hover:border-surface-300"
                    )}
                >
                    <div className="space-y-3">
                        {/* Priority Area */}
                        <div className="flex justify-between items-start">
                            <StatusBadge status={lead.priority} showDot={false} className="py-0.5 px-1.5 text-[10px]" />
                            <div className="text-[10px] font-medium text-surface-400">
                                {lead.leadNumber}
                            </div>
                        </div>

                        {/* Title Section */}
                        <div className="space-y-0.5">
                            <h4 className="text-sm font-bold text-surface-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
                                {lead.companyName || lead.contactName}
                            </h4>
                            {lead.companyName && (
                                <p className="text-xs text-surface-500 truncate">
                                    {lead.contactName}
                                </p>
                            )}
                        </div>

                        {/* Financial Metrics */}
                        <div className="pt-3 border-t border-surface-100 flex items-center justify-between">
                            <div className="space-y-0.5">
                                <p className="text-[9px] font-bold text-surface-400 uppercase tracking-tight">Est. Premium</p>
                                <div className="text-sm font-bold text-surface-900">
                                    {formatCurrency(lead.estimatedPremium || 0, 'GHS')}
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-0.5">
                                <p className="text-[9px] font-bold text-surface-400 uppercase tracking-tight">Strength</p>
                                <div className={cn(
                                    "px-1.5 py-0.5 rounded text-[10px] font-bold border",
                                    lead.score > 75 ? "bg-success-50 text-success-700 border-success-100" :
                                        lead.score > 40 ? "bg-warning-50 text-warning-700 border-warning-100" :
                                            "bg-surface-50 text-surface-500 border-surface-100"
                                )}>
                                    {lead.score}%
                                </div>
                            </div>
                        </div>

                        {/* Assignee & Meta */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                <div className="w-5 h-5 rounded-lg bg-surface-100 border border-surface-200 flex items-center justify-center text-[9px] font-bold text-surface-600">
                                    {lead.assignedBrokerName ? getInitials(lead.assignedBrokerName) : 'UA'}
                                </div>
                                <span className="text-[10px] font-medium text-surface-500">
                                    {lead.assignedBrokerName?.split(' ')[0] || 'Unassigned'}
                                </span>
                            </div>

                            {lead.nextFollowUpDate && (
                                <div className={cn(
                                    "flex items-center gap-1 text-[10px] font-bold",
                                    new Date(lead.nextFollowUpDate) < new Date() ? "text-danger-600" : "text-surface-400"
                                )}>
                                    <Clock size={10} />
                                    <span>{formatDate(lead.nextFollowUpDate, 'relative')}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
}


