'use client';

import { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import {
    Clock,
    AlertTriangle,
    XCircle,
    CheckCircle2,
    TrendingUp,
    CalendarDays,
    Phone,
    Mail,
    Bell,
    AlertCircle,
    Eye,
    BarChart3,
    Shield,
    Send,
    X,
    MessageSquare,
    User,
    FileText,
    Zap,
    History,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-display/data-table';
import { Card } from '@/components/ui/card';
import { CustomSelect } from '@/components/ui/select-custom';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
    mockRenewals,
    renewalSummary,
    URGENCY_CONFIG,
    WORKFLOW_STATUS_CONFIG,
    LOST_REASON_LABEL,
    type Renewal,
    type RenewalWorkflowStatus,
    type UrgencyLevel,
} from '@/mock/renewals';

// ─── Pipeline Tab Types ───
type PipelineTab = 'all' | 'overdue' | '0-30' | '31-60' | '61-90' | 'renewed' | 'lost';

// ─── Urgency Badge Component ───
function UrgencyBadge({ level }: { level: UrgencyLevel }) {
    const config = URGENCY_CONFIG[level];
    return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-bold rounded-full border ${config.bg} ${config.color} ${config.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
            {config.label}
        </span>
    );
}

// ─── Workflow Status Badge ───
function WorkflowBadge({ status }: { status: RenewalWorkflowStatus }) {
    const config = WORKFLOW_STATUS_CONFIG[status];
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full ${config.bg} ${config.color}`}>
            {config.label}
        </span>
    );
}

// ─── Renewal Detail Modal ───
function RenewalDetailModal({ renewal, onClose }: { renewal: Renewal; onClose: () => void }) {
    const premiumChange = renewal.proposedPremium - renewal.currentPremium;
    const premiumChangePct = ((premiumChange / renewal.currentPremium) * 100).toFixed(1);
    const isIncrease = premiumChange > 0;
    const expectedCommission = renewal.proposedPremium * (renewal.commissionRate / 100);

    // ESC key to close + body scroll lock
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKey);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    return createPortal(
        <div className="fixed inset-0 z-[350] flex items-center justify-center p-4" onClick={onClose}>
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            {/* Centered modal panel */}
            <div
                className="relative w-full max-w-3xl max-h-[90vh] bg-background rounded-2xl shadow-2xl overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 bg-background border-b border-surface-200 px-6 py-4 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-warning-50">
                                <Shield size={20} className="text-warning-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-surface-900">Renewal Details</h2>
                                <p className="text-sm text-surface-500 font-mono">{renewal.policyNumber}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-surface-100 text-surface-500 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                        <UrgencyBadge level={renewal.urgencyLevel} />
                        <WorkflowBadge status={renewal.renewalStatus} />
                        {renewal.daysToExpiry < 0 && (
                            <span className="text-xs font-bold text-danger-600 bg-danger-50 px-2 py-0.5 rounded-full border border-danger-200">
                                {Math.abs(renewal.daysToExpiry)} days overdue
                            </span>
                        )}
                    </div>
                </div>

                <div className="px-6 py-5 space-y-6">
                    {/* Client & Policy Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <InfoCard label="Client" value={renewal.clientName} icon={<User size={16} />} />
                        <InfoCard label="Insurer" value={renewal.insurerName} icon={<Shield size={16} />} />
                        <InfoCard label="Coverage" value={renewal.coverageType || renewal.insuranceType} icon={<FileText size={16} />} />
                        <InfoCard label="Policy Type" value={renewal.policyType === 'life' ? 'Life' : 'Non-Life'} icon={<BarChart3 size={16} />} />
                        <InfoCard label="Expiry Date" value={formatDate(renewal.expiryDate)} icon={<CalendarDays size={16} />} />
                        <InfoCard label="Days to Expiry" value={renewal.daysToExpiry < 0 ? `${Math.abs(renewal.daysToExpiry)} overdue` : `${renewal.daysToExpiry} days`} icon={<Clock size={16} />} />
                    </div>

                    {/* Premium Comparison */}
                    <Card padding="none" className="p-4">
                        <h3 className="text-sm font-semibold text-surface-700 mb-3 flex items-center gap-2">
                            <TrendingUp size={16} className="text-primary-600" />
                            Premium Analysis
                        </h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-3 bg-surface-50 rounded-lg">
                                <p className="text-[10px] uppercase font-semibold text-surface-500">Current Premium</p>
                                <p className="text-lg font-bold text-surface-900">{formatCurrency(renewal.currentPremium)}</p>
                            </div>
                            <div className="text-center p-3 bg-surface-50 rounded-lg">
                                <p className="text-[10px] uppercase font-semibold text-surface-500">Proposed Premium</p>
                                <p className="text-lg font-bold text-primary-600">{formatCurrency(renewal.proposedPremium)}</p>
                            </div>
                            <div className="text-center p-3 bg-surface-50 rounded-lg">
                                <p className="text-[10px] uppercase font-semibold text-surface-500">Change</p>
                                <p className={`text-lg font-bold ${isIncrease ? 'text-danger-600' : 'text-success-600'}`}>
                                    {isIncrease ? '+' : ''}{premiumChangePct}%
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-3">
                            <div className="text-center p-3 bg-surface-50 rounded-lg">
                                <p className="text-[10px] uppercase font-semibold text-surface-500">Sum Insured</p>
                                <p className="text-sm font-bold text-surface-800">{formatCurrency(renewal.sumInsured)}</p>
                            </div>
                            <div className="text-center p-3 bg-surface-50 rounded-lg">
                                <p className="text-[10px] uppercase font-semibold text-surface-500">Commission Rate</p>
                                <p className="text-sm font-bold text-surface-800">{renewal.commissionRate}%</p>
                            </div>
                            <div className="text-center p-3 bg-surface-50 rounded-lg">
                                <p className="text-[10px] uppercase font-semibold text-surface-500">Expected Commission</p>
                                <p className="text-sm font-bold text-success-700">{formatCurrency(expectedCommission)}</p>
                            </div>
                        </div>
                    </Card>

                    {/* Contact Details */}
                    <Card padding="none" className="p-4">
                        <h3 className="text-sm font-semibold text-surface-700 mb-3 flex items-center gap-2">
                            <Phone size={16} className="text-primary-600" />
                            Contact Information
                        </h3>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-surface-500">Phone</span>
                                <a href={`tel:${renewal.clientPhone}`} className="text-primary-600 font-medium hover:underline">{renewal.clientPhone}</a>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-surface-500">Email</span>
                                <a href={`mailto:${renewal.clientEmail}`} className="text-primary-600 font-medium hover:underline">{renewal.clientEmail}</a>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-surface-500">Assigned Agent</span>
                                <span className="font-medium text-surface-800">{renewal.assignedAgent}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-surface-500">Contact Attempts</span>
                                <span className="font-bold text-surface-800">{renewal.contactAttempts}</span>
                            </div>
                            {renewal.lastContactDate && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-surface-500">Last Contact</span>
                                    <span className="text-surface-700">{formatDate(renewal.lastContactDate)}</span>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Lost Reason (if applicable) */}
                    {renewal.renewalStatus === 'lost' && renewal.lostReason && (
                        <Card padding="none" className="p-4 border-danger-200 bg-danger-50/50">
                            <h3 className="text-sm font-semibold text-danger-700 mb-2 flex items-center gap-2">
                                <XCircle size={16} />
                                Loss Details
                            </h3>
                            <p className="text-sm text-danger-700 font-medium">{LOST_REASON_LABEL[renewal.lostReason]}</p>
                            {renewal.lostNotes && (
                                <p className="text-sm text-danger-600 mt-1">{renewal.lostNotes}</p>
                            )}
                        </Card>
                    )}

                    {/* Reminder Schedule */}
                    <Card padding="none" className="p-4">
                        <h3 className="text-sm font-semibold text-surface-700 mb-3 flex items-center gap-2">
                            <Bell size={16} className="text-primary-600" />
                            Reminder Schedule
                        </h3>
                        <div className="space-y-2">
                            {renewal.reminders.map((rem) => (
                                <div key={rem.id} className="flex items-center justify-between py-2 px-3 bg-surface-50 rounded-lg text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${rem.status === 'sent' ? 'bg-success-500' : rem.status === 'scheduled' ? 'bg-blue-500' : 'bg-surface-400'}`} />
                                        <span className="font-medium text-surface-700 capitalize">{rem.type.replace(/_/g, ' ')}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-surface-500">
                                        <span className="capitalize text-xs bg-surface-100 px-2 py-0.5 rounded">{rem.channel}</span>
                                        <span className="text-xs">{formatDate(rem.scheduledDate)}</span>
                                        <span className={`text-xs font-semibold ${rem.status === 'sent' ? 'text-success-600' : rem.status === 'scheduled' ? 'text-blue-600' : 'text-surface-400'}`}>
                                            {rem.status === 'sent' ? '✓ Sent' : rem.status === 'scheduled' ? 'Scheduled' : rem.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Activity / Notes Timeline */}
                    {renewal.notes.length > 0 && (
                        <Card padding="none" className="p-4">
                            <h3 className="text-sm font-semibold text-surface-700 mb-3 flex items-center gap-2">
                                <History size={16} className="text-primary-600" />
                                Activity Timeline
                            </h3>
                            <div className="relative space-y-0">
                                {renewal.notes.map((note, idx) => (
                                    <div key={note.id} className="relative flex gap-3 pb-4 last:pb-0">
                                        {/* Timeline line */}
                                        {idx < renewal.notes.length - 1 && (
                                            <div className="absolute left-[11px] top-6 w-0.5 h-[calc(100%-12px)] bg-surface-200" />
                                        )}
                                        {/* Dot */}
                                        <div className={`mt-1 w-[22px] h-[22px] rounded-full flex items-center justify-center flex-shrink-0 ${
                                            note.type === 'contact' ? 'bg-blue-100 text-blue-600' :
                                            note.type === 'escalation' ? 'bg-danger-100 text-danger-600' :
                                            note.type === 'system' ? 'bg-surface-100 text-surface-500' :
                                            'bg-primary-100 text-primary-600'
                                        }`}>
                                            {note.type === 'contact' ? <Phone size={11} /> :
                                             note.type === 'escalation' ? <AlertCircle size={11} /> :
                                             note.type === 'system' ? <Zap size={11} /> :
                                             <MessageSquare size={11} />}
                                        </div>
                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 text-xs">
                                                <span className="font-semibold text-surface-800">{note.author}</span>
                                                <span className="text-surface-400">•</span>
                                                <span className="text-surface-500">{formatDate(note.date)}</span>
                                            </div>
                                            <p className="text-sm text-surface-600 mt-0.5">{note.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    {/* Action Buttons */}
                    {renewal.renewalStatus !== 'renewed' && renewal.renewalStatus !== 'lost' && (
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-surface-200">
                            <Button
                                variant="primary"
                                leftIcon={<Phone size={16} />}
                                onClick={() => toast.info('Calling Client', { description: `Initiating call to ${renewal.clientName} at ${renewal.clientPhone}` })}
                            >
                                Contact Client
                            </Button>
                            <Button
                                variant="outline"
                                leftIcon={<Send size={16} />}
                                onClick={() => toast.success('Reminder Sent', { description: `Renewal reminder sent to ${renewal.clientEmail}` })}
                            >
                                Send Reminder
                            </Button>
                            <Button
                                variant="outline"
                                leftIcon={<Mail size={16} />}
                                onClick={() => toast.info('Email Client', { description: `Opening email draft for ${renewal.clientEmail}` })}
                            >
                                Email Quote
                            </Button>
                            <Button
                                variant="primary"
                                className="bg-success-600 hover:bg-success-700 ml-auto"
                                leftIcon={<CheckCircle2 size={16} />}
                                onClick={() => toast.success('Renewal Processed', { description: `Renewal for ${renewal.policyNumber} has been initiated.` })}
                            >
                                Process Renewal
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}

// ─── InfoCard Helper ───
function InfoCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
    return (
        <div className="flex items-start gap-2.5 p-3 bg-surface-50 rounded-lg">
            <div className="text-surface-400 mt-0.5">{icon}</div>
            <div>
                <p className="text-[10px] uppercase font-semibold text-surface-500">{label}</p>
                <p className="text-sm font-medium text-surface-800 capitalize">{value}</p>
            </div>
        </div>
    );
}

// ─── Main Page ───
export default function RenewalsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Pipeline tab
    const tabParam = (searchParams.get('tab') as PipelineTab) || 'all';
    const [activeTab, setActiveTab] = useState<PipelineTab>(tabParam);
    const [workflowFilter, setWorkflowFilter] = useState<RenewalWorkflowStatus | 'all'>('all');
    const [agentFilter, setAgentFilter] = useState<string>('all');
    const [selectedRenewal, setSelectedRenewal] = useState<Renewal | null>(null);

    useEffect(() => {
        setActiveTab(tabParam);
    }, [tabParam]);

    // Unique agents list
    const agents = useMemo(() => {
        const set = new Set(mockRenewals.map(r => r.assignedAgent));
        return Array.from(set).sort();
    }, []);

    // Pipeline tabs configuration
    const pipelineTabs: { id: PipelineTab; label: string; count: number; color: string; amount?: number }[] = useMemo(() => [
        { id: 'all', label: 'All', count: renewalSummary.total, color: 'text-surface-700' },
        { id: 'overdue', label: 'Overdue', count: renewalSummary.overdue, color: 'text-danger-600', amount: renewalSummary.overdueAmount },
        { id: '0-30', label: '0–30 Days', count: renewalSummary.next30, color: 'text-warning-600', amount: renewalSummary.next30Amount },
        { id: '31-60', label: '31–60 Days', count: renewalSummary.next60, color: 'text-amber-600', amount: renewalSummary.next60Amount },
        { id: '61-90', label: '61–90 Days', count: renewalSummary.next90, color: 'text-blue-600', amount: renewalSummary.next90Amount },
        { id: 'renewed', label: 'Renewed', count: renewalSummary.renewedCount, color: 'text-success-600' },
        { id: 'lost', label: 'Lost', count: renewalSummary.lostCount, color: 'text-danger-600' },
    ], []);

    // Filtered data
    const filteredRenewals = useMemo(() => {
        let data = [...mockRenewals];

        // Pipeline filter
        switch (activeTab) {
            case 'overdue':
                data = data.filter(r => r.daysToExpiry < 0 && r.renewalStatus !== 'renewed' && r.renewalStatus !== 'lost');
                break;
            case '0-30':
                data = data.filter(r => r.daysToExpiry >= 0 && r.daysToExpiry <= 30 && r.renewalStatus !== 'renewed' && r.renewalStatus !== 'lost');
                break;
            case '31-60':
                data = data.filter(r => r.daysToExpiry > 30 && r.daysToExpiry <= 60 && r.renewalStatus !== 'renewed' && r.renewalStatus !== 'lost');
                break;
            case '61-90':
                data = data.filter(r => r.daysToExpiry > 60 && r.daysToExpiry <= 90 && r.renewalStatus !== 'renewed' && r.renewalStatus !== 'lost');
                break;
            case 'renewed':
                data = data.filter(r => r.renewalStatus === 'renewed');
                break;
            case 'lost':
                data = data.filter(r => r.renewalStatus === 'lost');
                break;
        }

        // Workflow status filter
        if (workflowFilter !== 'all') {
            data = data.filter(r => r.renewalStatus === workflowFilter);
        }

        // Agent filter
        if (agentFilter !== 'all') {
            data = data.filter(r => r.assignedAgent === agentFilter);
        }

        // Sort: most urgent first (lowest daysToExpiry)
        data.sort((a, b) => a.daysToExpiry - b.daysToExpiry);

        return data;
    }, [activeTab, workflowFilter, agentFilter]);

    const handleTabChange = (tab: PipelineTab) => {
        setActiveTab(tab);
        router.push(`/dashboard/renewals?tab=${tab}`, { scroll: false });
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-warning-500 rounded-full" />
                        <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Renewals Pipeline</h1>
                    </div>
                    <p className="text-sm text-surface-500 mt-1 ml-3.5">
                        Track and manage policy renewals across all stages.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="primary"
                        leftIcon={<Send size={16} />}
                        onClick={() => toast.success('Notifications Sent', { description: 'Bulk renewal reminders dispatched via Email & SMS.' })}
                    >
                        Notify All
                    </Button>
                </div>
            </div>

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Premium at Risk */}
                <Card padding="none" className="p-4 flex flex-col gap-2 border-l-4 border-l-warning-500">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-full bg-warning-50 text-warning-600">
                            <AlertTriangle size={18} />
                        </div>
                        <p className="text-xs font-semibold text-surface-500 uppercase">Premium at Risk</p>
                    </div>
                    <p className="text-xl font-bold text-surface-900">{formatCurrency(renewalSummary.totalPremiumAtRisk)}</p>
                    <p className="text-xs text-surface-500">{renewalSummary.active} active renewals</p>
                </Card>

                {/* Renewal Rate */}
                <Card padding="none" className="p-4 flex flex-col gap-2 border-l-4 border-l-success-500">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-full bg-success-50 text-success-600">
                            <CheckCircle2 size={18} />
                        </div>
                        <p className="text-xs font-semibold text-surface-500 uppercase">Renewal Rate</p>
                    </div>
                    <p className="text-xl font-bold text-success-600">{renewalSummary.renewalRate.toFixed(1)}%</p>
                    <p className="text-xs text-surface-500">{renewalSummary.renewedCount} renewed / {renewalSummary.lostCount} lost</p>
                </Card>

                {/* Renewed Premium */}
                <Card padding="none" className="p-4 flex flex-col gap-2 border-l-4 border-l-primary-500">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-full bg-primary-50 text-primary-600">
                            <TrendingUp size={18} />
                        </div>
                        <p className="text-xs font-semibold text-surface-500 uppercase">Collected</p>
                    </div>
                    <p className="text-xl font-bold text-surface-900">{formatCurrency(renewalSummary.renewedPremium)}</p>
                    <p className="text-xs text-surface-500">{renewalSummary.renewedCount} policies renewed</p>
                </Card>

                {/* Lost Premium */}
                <Card padding="none" className="p-4 flex flex-col gap-2 border-l-4 border-l-danger-500">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-full bg-danger-50 text-danger-600">
                            <XCircle size={18} />
                        </div>
                        <p className="text-xs font-semibold text-surface-500 uppercase">Lost Premium</p>
                    </div>
                    <p className="text-xl font-bold text-danger-600">{formatCurrency(renewalSummary.lostPremium)}</p>
                    <p className="text-xs text-surface-500">{renewalSummary.lostCount} policies lost</p>
                </Card>

                {/* Critical Count */}
                <Card padding="none" className="p-4 flex flex-col gap-2 border-l-4 border-l-danger-500">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-full bg-danger-50 text-danger-600">
                            <AlertCircle size={18} />
                        </div>
                        <p className="text-xs font-semibold text-surface-500 uppercase">Needs Attention</p>
                    </div>
                    <p className="text-xl font-bold text-danger-600">{renewalSummary.critical + renewalSummary.urgent}</p>
                    <p className="text-xs text-surface-500">{renewalSummary.critical} critical, {renewalSummary.urgent} urgent</p>
                </Card>
            </div>

            {/* Pipeline Tabs */}
            <Card padding="none" className="p-1">
                <div className="flex flex-wrap gap-1">
                    {pipelineTabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                activeTab === tab.id
                                    ? 'bg-primary-600 text-white shadow-sm'
                                    : 'text-surface-600 hover:bg-surface-50'
                            }`}
                        >
                            <span>{tab.label}</span>
                            <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold rounded-full ${
                                activeTab === tab.id
                                    ? 'bg-white/20 text-white'
                                    : `bg-surface-100 ${tab.color}`
                            }`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>
            </Card>

            {/* Urgency Summary Badges (when showing "all" or active tabs) */}
            {!['renewed', 'lost'].includes(activeTab) && (
                <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-semibold text-surface-500 uppercase tracking-wide">Urgency:</span>
                    {renewalSummary.critical > 0 && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-danger-50 border border-danger-200">
                            <span className="w-2 h-2 rounded-full bg-danger-500 animate-pulse" />
                            <span className="text-xs font-bold text-danger-700">{renewalSummary.critical} Critical</span>
                        </div>
                    )}
                    {renewalSummary.urgent > 0 && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-warning-50 border border-warning-200">
                            <span className="w-2 h-2 rounded-full bg-warning-500" />
                            <span className="text-xs font-bold text-warning-700">{renewalSummary.urgent} Urgent</span>
                        </div>
                    )}
                    {renewalSummary.important > 0 && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200">
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                            <span className="text-xs font-bold text-amber-700">{renewalSummary.important} Important</span>
                        </div>
                    )}
                    {renewalSummary.upcoming > 0 && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200">
                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                            <span className="text-xs font-bold text-blue-700">{renewalSummary.upcoming} Upcoming</span>
                        </div>
                    )}
                </div>
            )}

            {/* Data Table */}
            <DataTable
                data={filteredRenewals}
                columns={[
                    {
                        key: 'policyNumber',
                        label: 'Policy',
                        sortable: true,
                        render: (r) => (
                            <div>
                                <p className="font-mono font-medium text-surface-800 text-xs">{r.policyNumber}</p>
                                <p className="text-[11px] text-surface-500 capitalize">{r.insuranceType} • {r.coverageType || r.policyType}</p>
                            </div>
                        ),
                    },
                    {
                        key: 'clientName',
                        label: 'Client',
                        sortable: true,
                        render: (r) => (
                            <div>
                                <p className="font-medium text-surface-800 text-sm">{r.clientName}</p>
                                <p className="text-[11px] text-surface-500">{r.clientPhone}</p>
                            </div>
                        ),
                    },
                    {
                        key: 'insurerName',
                        label: 'Insurer',
                        sortable: true,
                        render: (r) => <span className="text-sm text-surface-700">{r.insurerName}</span>,
                    },
                    {
                        key: 'currentPremium',
                        label: 'Premium',
                        sortable: true,
                        render: (r) => (
                            <div>
                                <p className="font-medium text-surface-800">{formatCurrency(r.currentPremium)}</p>
                                {r.proposedPremium !== r.currentPremium && (
                                    <p className="text-[11px] text-primary-600">→ {formatCurrency(r.proposedPremium)}</p>
                                )}
                            </div>
                        ),
                    },
                    {
                        key: 'daysToExpiry',
                        label: 'Expiry',
                        sortable: true,
                        render: (r) => {
                            const d = r.daysToExpiry;
                            return (
                                <div>
                                    <span className={`font-bold text-sm ${d < 0 ? 'text-danger-600' : d <= 7 ? 'text-danger-600' : d <= 30 ? 'text-warning-600' : d <= 60 ? 'text-amber-600' : 'text-surface-600'}`}>
                                        {d < 0 ? `${Math.abs(d)}d overdue` : `${d} days`}
                                    </span>
                                    <p className="text-[11px] text-surface-500">{formatDate(r.expiryDate)}</p>
                                </div>
                            );
                        },
                    },
                    {
                        key: 'urgencyLevel',
                        label: 'Urgency',
                        sortable: true,
                        render: (r) => <UrgencyBadge level={r.urgencyLevel} />,
                    },
                    {
                        key: 'renewalStatus',
                        label: 'Status',
                        sortable: true,
                        render: (r) => <WorkflowBadge status={r.renewalStatus} />,
                    },
                    {
                        key: 'assignedAgent',
                        label: 'Agent',
                        sortable: true,
                        render: (r) => (
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-[10px] font-bold">
                                    {r.assignedAgent.split(' ').map(n => n[0]).join('')}
                                </div>
                                <span className="text-sm text-surface-700">{r.assignedAgent}</span>
                            </div>
                        ),
                    },
                    {
                        key: 'contactAttempts',
                        label: 'Contacts',
                        sortable: true,
                        render: (r) => (
                            <div className="text-center">
                                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                                    r.contactAttempts === 0 ? 'bg-surface-100 text-surface-500' :
                                    r.contactAttempts >= 3 ? 'bg-success-100 text-success-700' :
                                    'bg-blue-100 text-blue-700'
                                }`}>
                                    {r.contactAttempts}
                                </span>
                            </div>
                        ),
                    },
                    {
                        key: 'id',
                        label: '',
                        render: (r) => (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedRenewal(r);
                                }}
                                className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-primary-600 transition-colors"
                            >
                                <Eye size={16} />
                            </button>
                        ),
                    },
                ]}
                searchKeys={['policyNumber', 'clientName', 'insurerName', 'assignedAgent']}
                onRowClick={(row) => setSelectedRenewal(row)}
                headerActions={
                    <div className="flex items-center gap-2">
                        <CustomSelect
                            label="Status"
                            options={[
                                { label: 'All Statuses', value: 'all' },
                                { label: 'Pending', value: 'pending' },
                                { label: 'Contacted', value: 'contacted' },
                                { label: 'Quoted', value: 'quoted' },
                                { label: 'Renewed', value: 'renewed' },
                                { label: 'Lost', value: 'lost' },
                            ]}
                            value={workflowFilter}
                            onChange={(v) => setWorkflowFilter(v as RenewalWorkflowStatus | 'all')}
                        />
                        <CustomSelect
                            label="Agent"
                            options={[
                                { label: 'All Agents', value: 'all' },
                                ...agents.map(a => ({ label: a, value: a })),
                            ]}
                            value={agentFilter}
                            onChange={(v) => setAgentFilter(v as string)}
                        />
                    </div>
                }
            />

            {/* Detail Modal */}
            {selectedRenewal && (
                <RenewalDetailModal
                    renewal={selectedRenewal}
                    onClose={() => setSelectedRenewal(null)}
                />
            )}
        </div>
    );
}
