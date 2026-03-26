'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
    FileText, Calendar, MapPin, DollarSign, CheckCircle2, AlertCircle,
    Download, Search, ClipboardList, Clock, MessageSquare, Phone, Mail,
    Plus, Copy, ChevronRight, Car, Flame, Anchor, Heart, Plane,
    Users, Shield, History, AlertTriangle,
} from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/data-display/status-badge';
import { AppLoader } from '@/components/ui/AppLoader';
import { useClaim, useClaimFollowUps, useAddClaimFollowUp, useClaimDocuments, useAddClaimDocument } from '@/hooks/api';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { Claim } from '@/types';
import { BackButton } from '@/components/ui/back-button';
import { toast } from 'sonner';
import { generateReportPdf } from '@/lib/generate-report-pdf';

const ClaimStatusModal = dynamic(
    () => import('@/components/claims/claim-status-modal').then(m => ({ default: m.ClaimStatusModal })),
    { ssr: false }
);

const UploadDocumentModal = dynamic(
    () => import('@/components/documents/upload-document-modal').then(m => ({ default: m.UploadDocumentModal })),
    { ssr: false }
);

// ─── Types ───────────────────────────────────────────────────────────────────
type TabId = 'overview' | 'assessment' | 'documents' | 'followup' | 'settlement' | 'thirdparty' | 'communications' | 'nic' | 'history';

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <FileText size={14} /> },
    { id: 'assessment', label: 'Assessment', icon: <Search size={14} /> },
    { id: 'documents', label: 'Documents', icon: <ClipboardList size={14} /> },
    { id: 'followup', label: 'Follow-Up Log', icon: <MessageSquare size={14} /> },
    { id: 'settlement', label: 'Settlement', icon: <DollarSign size={14} /> },
    { id: 'thirdparty', label: 'Third Party', icon: <Users size={14} /> },
    { id: 'communications', label: 'Communications', icon: <Mail size={14} /> },
    { id: 'nic', label: 'NIC Compliance', icon: <Shield size={14} /> },
    { id: 'history', label: 'History', icon: <History size={14} /> },
];

// ─── Progress Steps ───────────────────────────────────────────────────────────
const CLAIM_STAGES = ['INTIMATED', 'REGISTERED', 'UNDER_REVIEW', 'ASSESSED', 'APPROVED', 'SETTLED', 'CLOSED'];
const STAGE_LABELS: Record<string, string> = {
    INTIMATED: 'Intimated',
    REGISTERED: 'Registered',
    UNDER_REVIEW: 'Under Review',
    ASSESSED: 'Assessed',
    APPROVED: 'Approved',
    SETTLED: 'Settled',
    CLOSED: 'Closed',
};

function getStageIndex(status: string) {
    const idx = CLAIM_STAGES.indexOf(status);
    return idx === -1 ? 0 : idx;
}

// ─── NIC Countdown ────────────────────────────────────────────────────────────
function NicCountdown({ label, deadline, completedDate }: { label: string; deadline?: string; completedDate?: string }) {
    if (!deadline) return null;
    const today = new Date();
    const d = new Date(deadline);
    const isPast = d < today;
    const daysLeft = Math.ceil((d.getTime() - today.getTime()) / 86_400_000);
    const isDone = !!completedDate;

    return (
        <div className={cn(
            'flex flex-col items-center px-3 py-2 rounded-lg border text-center min-w-[96px]',
            isDone ? 'border-success-200 bg-success-50' :
            isPast ? 'border-danger-300 bg-danger-50 animate-pulse' :
            daysLeft <= 2 ? 'border-warning-300 bg-warning-50' :
            'border-surface-200 bg-surface-50'
        )}>
            <span className="text-[10px] font-bold uppercase tracking-wider text-surface-500">{label}</span>
            {isDone ? (
                <span className="text-xs font-bold text-success-600 mt-0.5 flex items-center gap-0.5"><CheckCircle2 size={11} /> MET</span>
            ) : isPast ? (
                <span className="text-xs font-bold text-danger-600 mt-0.5">BREACHED</span>
            ) : (
                <span className={cn('text-lg font-black mt-0.5', daysLeft <= 2 ? 'text-warning-600' : 'text-surface-800')}>
                    {daysLeft}d
                </span>
            )}
            <span className="text-[10px] text-surface-400 mt-0.5">{formatDate(deadline)}</span>
        </div>
    );
}

// ─── Stage-Aware Action Button ────────────────────────────────────────────────
function StageAction({ status, onUpdate }: { status: string; onUpdate: () => void }) {
    const config: Record<string, { label: string; color: string }> = {
        INTIMATED: { label: 'Register Claim →', color: 'primary' },
        REGISTERED: { label: 'Start Investigation →', color: 'primary' },
        UNDER_REVIEW: { label: 'Submit Assessment →', color: 'primary' },
        ASSESSED: { label: 'Make Decision', color: 'primary' },
        APPROVED: { label: 'Process Settlement →', color: 'success' },
        SETTLED: { label: 'Close Claim →', color: 'primary' },
        CLOSED: { label: 'Reopen Claim', color: 'ghost' },
        REJECTED: { label: 'Reopen Claim', color: 'ghost' },
    };
    const c = config[status] || { label: 'Update Status', color: 'primary' };
    return (
        <Button variant={c.color as any} onClick={onUpdate} className="whitespace-nowrap">
            {c.label}
        </Button>
    );
}

// ─── Info Row helper ──────────────────────────────────────────────────────────
function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex justify-between items-start py-2.5 border-b border-surface-100 last:border-0 gap-4">
            <span className="text-xs font-semibold text-surface-500 uppercase tracking-wider shrink-0">{label}</span>
            <span className="text-sm font-medium text-surface-800 text-right">{value || '—'}</span>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ClaimDetailPage({ id }: { id: string }) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabId>('overview');
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [showFollowUpForm, setShowFollowUpForm] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [followUpData, setFollowUpData] = useState({
        method: 'PHONE',
        note: '',
        contactName: '',
        nextAction: '',
        contactedAt: new Date().toISOString().slice(0, 16),
        followUpDate: '',
    });
    const [claimOverrides, setClaimOverrides] = useState<Partial<Claim>>({});

    const { data: claimData, isLoading } = useClaim(id);
    const claim = claimData ? { ...(claimData as unknown as Claim), ...claimOverrides } : null;

    const followUpsQuery = useClaimFollowUps(id);
    const documentsQuery = useClaimDocuments(id);
    const addFollowUp = useAddClaimFollowUp();
    const addDocumentMutation = useAddClaimDocument();

    if (isLoading) return <AppLoader message="Loading claim details..." isLoading={true} />;
    if (!claim) return <div>Claim not found</div>;

    const handleUpdateClaim = (updates: Partial<Claim>) => {
        setClaimOverrides(prev => ({ ...prev, ...updates }));
    };

    const stageIdx = getStageIndex(claim.status);

    // NIC deadlines
    const today = new Date();
    const ack5Deadline = (claim as any).acknowledgmentDeadline;
    const proc30Deadline = (claim as any).processingDeadline;
    const ack5Breached = ack5Deadline && new Date(ack5Deadline) < today && !claim.acknowledgmentDate;
    const proc30Breached = proc30Deadline && new Date(proc30Deadline) < today && !['SETTLED', 'CLOSED'].includes(claim.status);

    const ackDays = ack5Deadline ? Math.ceil((new Date(ack5Deadline).getTime() - today.getTime()) / 86_400_000) : null;
    const procDays = proc30Deadline ? Math.ceil((new Date(proc30Deadline).getTime() - today.getTime()) / 86_400_000) : null;

    return (
        <div className="space-y-5 animate-fade-in w-full pb-12 max-w-6xl mx-auto">

            {/* Header Card */}
            <div className="bg-background rounded-2xl shadow-sm border border-surface-200 p-5 space-y-4">
                {/* Row 1 — Back + Claim number + status + actions */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <BackButton href="/dashboard/claims" />
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xl font-mono font-bold text-surface-900 bg-surface-100/50 border border-surface-200/50 border-dashed px-3 py-1 rounded-lg tracking-wider">
                                    {claim.claimNumber}
                                </span>
                                <button
                                    onClick={() => { navigator.clipboard.writeText(claim.claimNumber); toast.success('Copied!'); }}
                                    className="p-1.5 rounded-md hover:bg-surface-100 text-surface-400 hover:text-surface-600 transition-colors cursor-pointer"
                                    title="Copy claim number"
                                >
                                    <Copy size={14} />
                                </button>
                                <StatusBadge status={claim.status} />
                            </div>
                            <p className="text-sm text-surface-500 mt-1.5">
                                Reported on {formatDate(claim.intimationDate)} by{' '}
                                <button
                                    className="text-primary-600 hover:underline font-medium cursor-pointer"
                                    onClick={() => router.push(`/dashboard/clients/${claim.clientId}`)}
                                >
                                    {claim.clientName}
                                </button>
                                {' · '}
                                <button
                                    className="text-primary-600 hover:underline font-medium cursor-pointer"
                                    onClick={() => router.push(`/dashboard/policies/${claim.policyId}`)}
                                >
                                    {claim.policyNumber}
                                </button>
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                        <Button variant="outline" size="sm" leftIcon={<Download size={14} />} onClick={() => {
                            generateReportPdf(`Claim Report — ${claim.claimNumber}`, [
                                { title: 'Claim Details', rows: [
                                    { label: 'Claim Number', value: claim.claimNumber },
                                    { label: 'Status', value: claim.status },
                                    { label: 'Insurance Type', value: claim.insuranceType },
                                    { label: 'Incident Date', value: formatDate(claim.incidentDate) },
                                    { label: 'Claim Amount', value: formatCurrency(claim.claimAmount) },
                                ]},
                            ]);
                            toast.success('PDF generated');
                        }}>Export PDF</Button>
                        <StageAction status={claim.status} onUpdate={() => setIsStatusModalOpen(true)} />
                    </div>
                </div>

                {/* Row 2 — 7-Step Progress Bar */}
                <div className="flex items-center gap-0">
                    {CLAIM_STAGES.map((stage, i) => {
                        const isDone = i < stageIdx;
                        const isActive = i === stageIdx;
                        const isFuture = i > stageIdx;
                        const isRejected = claim.status === 'REJECTED';
                        return (
                            <div key={stage} className="flex items-center flex-1 min-w-0">
                                <div className="flex flex-col items-center flex-1 min-w-0">
                                    <div className={cn(
                                        'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all',
                                        isActive && isRejected ? 'bg-danger-500 text-white ring-4 ring-danger-100' :
                                        isActive ? 'bg-primary-500 text-white ring-4 ring-primary-100' :
                                        isDone ? 'bg-primary-400 text-white' :
                                        'bg-surface-200 text-surface-400'
                                    )}>
                                        {isDone ? <CheckCircle2 size={12} /> : i + 1}
                                    </div>
                                    <span className={cn(
                                        'text-[9px] font-semibold mt-1 text-center leading-tight truncate w-full px-0.5',
                                        isActive ? 'text-primary-600' : isDone ? 'text-surface-500' : 'text-surface-300'
                                    )}>
                                        {STAGE_LABELS[stage]}
                                    </span>
                                </div>
                                {i < CLAIM_STAGES.length - 1 && (
                                    <div className={cn(
                                        'h-0.5 flex-1 mx-1 rounded-full transition-all',
                                        isDone ? 'bg-primary-400' : 'bg-surface-200'
                                    )} />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Row 3 — NIC Countdown Timers */}
                <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs font-semibold text-surface-500 uppercase tracking-wide">NIC Deadlines:</span>
                    <NicCountdown label="5-Day Rule" deadline={ack5Deadline} completedDate={claim.acknowledgmentDate} />
                    <NicCountdown label="30-Day Rule" deadline={proc30Deadline} completedDate={claim.settlementDate} />
                    {(ack5Breached || proc30Breached) && (
                        <div className="flex items-center gap-1 text-xs text-danger-600 font-bold">
                            <AlertTriangle size={13} />
                            NIC compliance violation — action required
                        </div>
                    )}
                </div>
            </div>

            {/* Tab Bar */}
            <div className="flex overflow-x-auto gap-1 bg-surface-50 rounded-xl p-1 border border-surface-200 scrollbar-hide">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            'flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer',
                            activeTab === tab.id
                                ? 'bg-white text-primary-600 shadow-sm border border-surface-200'
                                : 'text-surface-500 hover:text-surface-700 hover:bg-white/50'
                        )}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div>
                {/* OVERVIEW */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        <div className="lg:col-span-2 space-y-5">
                            <Card padding="lg">
                                <CardHeader title="Incident Details" />
                                <div className="mt-4 space-y-0">
                                    <InfoRow label="Incident Date" value={formatDate(claim.incidentDate)} />
                                    <InfoRow label="Location" value={claim.incidentLocation} />
                                    <InfoRow label="Peril Type" value={(claim as any).perilType} />
                                    <InfoRow label="Police Report #" value={(claim as any).policeReportNumber} />
                                    <InfoRow label="Description" value={claim.incidentDescription} />
                                </div>
                            </Card>
                            <Card padding="lg">
                                <CardHeader title="Financial Summary" />
                                <div className="grid grid-cols-3 gap-4 mt-4">
                                    {[
                                        { label: 'Claimed Amount', value: formatCurrency(claim.claimAmount || 0), color: 'text-surface-800' },
                                        { label: 'Assessed Amount', value: claim.assessedAmount ? formatCurrency(claim.assessedAmount) : '—', color: 'text-primary-600' },
                                        { label: 'Settled Amount', value: claim.settledAmount ? formatCurrency(claim.settledAmount) : '—', color: 'text-success-600' },
                                    ].map(item => (
                                        <div key={item.label} className="p-4 bg-surface-50 rounded-xl border border-surface-100 text-center">
                                            <p className="text-[10px] font-bold text-surface-500 uppercase tracking-wider">{item.label}</p>
                                            <p className={cn('text-xl font-black mt-1', item.color)}>{item.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                        <div className="space-y-5">
                            <Card padding="lg">
                                <CardHeader title="People" />
                                <div className="mt-4 space-y-0">
                                    <InfoRow label="Client" value={
                                        <button className="text-primary-600 hover:underline cursor-pointer" onClick={() => router.push(`/dashboard/clients/${claim.clientId}`)}>
                                            {claim.clientName}
                                        </button>
                                    } />
                                    <InfoRow label="Policy" value={
                                        <button className="text-[11px] font-mono text-primary-600 hover:underline cursor-pointer" onClick={() => router.push(`/dashboard/policies/${claim.policyId}`)}>
                                            {claim.policyNumber}
                                        </button>
                                    } />
                                    <InfoRow label="Insurance Type" value={(claim.insuranceType || '').replace(/_/g, ' ')} />
                                    <InfoRow label="Assigned To" value={(claim as any).assignedBrokerName} />
                                </div>
                            </Card>
                            <Card padding="lg">
                                <CardHeader title="Key Dates" />
                                <div className="mt-4 space-y-0">
                                    <InfoRow label="Intimated" value={formatDate(claim.intimationDate)} />
                                    <InfoRow label="Registered" value={claim.registrationDate ? formatDate(claim.registrationDate) : '—'} />
                                    <InfoRow label="Assessed" value={claim.assessmentDate ? formatDate(claim.assessmentDate) : '—'} />
                                    <InfoRow label="Approved" value={claim.approvalDate ? formatDate(claim.approvalDate) : '—'} />
                                    <InfoRow label="Settled" value={claim.settlementDate ? formatDate(claim.settlementDate) : '—'} />
                                    <InfoRow label="Closed" value={(claim as any).closedDate ? formatDate((claim as any).closedDate) : '—'} />
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {/* ASSESSMENT */}
                {activeTab === 'assessment' && (
                    <Card padding="lg">
                        <CardHeader title="Assessment Details" />
                        <div className="mt-4 space-y-0">
                            <InfoRow label="Assessor / Adjuster" value={(claim as any).assessorName} />
                            <InfoRow label="Site Visit Date" value={(claim as any).siteVisitDate ? formatDate((claim as any).siteVisitDate) : '—'} />
                            <InfoRow label="Damage Description" value={(claim as any).damageDescription} />
                            <InfoRow label="Repair Estimate" value={(claim as any).repairEstimate ? formatCurrency((claim as any).repairEstimate) : '—'} />
                            <InfoRow label="Recommended Settlement" value={(claim as any).recommendedSettlement ? formatCurrency((claim as any).recommendedSettlement) : '—'} />
                        </div>
                        {(claim as any).assessorNotes && (
                            <div className="mt-4 p-4 bg-surface-50 rounded-xl border border-surface-100">
                                <p className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-2">Assessor Notes</p>
                                <p className="text-sm text-surface-700 leading-relaxed">{(claim as any).assessorNotes}</p>
                            </div>
                        )}
                        {!(claim as any).assessorName && (
                            <p className="text-sm text-surface-400 text-center py-8">No assessment information yet. This section will be populated once an assessor is assigned.</p>
                        )}
                    </Card>
                )}

                {/* DOCUMENTS */}
                {activeTab === 'documents' && (
                    <Card padding="lg">
                        <div className="flex items-center justify-between mb-4">
                            <CardHeader title="Evidence & Documents" />
                            <Button variant="outline" size="sm" leftIcon={<Plus size={14} />} onClick={() => setShowUploadModal(true)}>
                                Upload Document
                            </Button>
                        </div>
                        <div className="mb-4 p-3 bg-primary-50 rounded-lg border border-primary-100 text-xs text-primary-700">
                            <strong>NIC 7-Year Retention Policy:</strong> Documents less than 7 years old cannot be permanently deleted. They will be archived instead.
                        </div>
                        <div className="space-y-2">
                            {documentsQuery.isLoading && <p className="text-sm text-surface-400">Loading documents...</p>}
                            {(() => {
                                const response: any = documentsQuery.data;
                                const docs = response?.items ?? response?.data?.data ?? response?.data ?? (Array.isArray(response) ? response : []);
                                if (!docs || !Array.isArray(docs)) return null;
                                if (docs.length === 0) return <p className="text-sm text-surface-400 text-center py-8">No documents attached yet.</p>;
                                return docs.map((doc: any) => {
                                    const uploadedAt = new Date(doc.uploadedAt as string);
                                    const yearsOld = (today.getTime() - uploadedAt.getTime()) / (1000 * 60 * 60 * 24 * 365);
                                    const canDelete = yearsOld >= 7;
                                    return (
                                        <div key={doc.id as string} className="flex items-center justify-between p-3 bg-surface-50 rounded-xl border border-surface-200">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-primary-100 text-primary-600 rounded-lg"><FileText size={16} /></div>
                                                <div>
                                                    <h4 className="text-sm font-semibold text-surface-900">{doc.name as string}</h4>
                                                    <p className="text-xs text-surface-500 uppercase font-medium">{doc.type as string} · {formatDate(doc.uploadedAt as string)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {!canDelete && (
                                                    <span className="text-[10px] font-bold text-warning-600 bg-warning-50 border border-warning-200 px-2 py-0.5 rounded-full">
                                                        NIC Retained
                                                    </span>
                                                )}
                                                <a href={doc.url as string} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-600 hover:text-primary-800 font-medium">
                                                    Download
                                                </a>
                                            </div>
                                        </div>
                                    );
                                });
                            })()}
                        </div>
                    </Card>
                )}

                {/* FOLLOW-UP LOG */}
                {activeTab === 'followup' && (
                    <Card padding="lg">
                        <div className="flex items-center justify-between mb-4">
                            <CardHeader title="Chase Log" />
                            <Button variant="outline" size="sm" leftIcon={<Plus size={14} />} onClick={() => setShowFollowUpForm(v => !v)}>
                                {showFollowUpForm ? 'Cancel' : 'Add Follow-Up'}
                            </Button>
                        </div>

                        {showFollowUpForm && (
                            <form
                                className="mb-5 space-y-3 p-4 bg-surface-50 rounded-xl border border-surface-200"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (followUpData.note.length < 5) { toast.error('Note must be at least 5 characters'); return; }
                                    addFollowUp.mutate(
                                        { claimId: id, data: followUpData },
                                        {
                                            onSuccess: () => {
                                                toast.success('Follow-up recorded');
                                                setFollowUpData({ method: 'PHONE', note: '', contactName: '', nextAction: '', contactedAt: new Date().toISOString().slice(0, 16), followUpDate: '' });
                                                setShowFollowUpForm(false);
                                            },
                                            onError: () => toast.error('Failed to record follow-up'),
                                        }
                                    );
                                }}
                            >
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs font-semibold text-surface-500 uppercase">Method</label>
                                        <select
                                            className="mt-1 w-full rounded-lg border border-surface-300 dark:border-slate-700 px-3 py-2 text-sm bg-white dark:bg-slate-900 dark:text-white"
                                            value={followUpData.method}
                                            onChange={e => setFollowUpData(d => ({ ...d, method: e.target.value }))}
                                        >
                                            <option value="PHONE">Phone Call</option>
                                            <option value="EMAIL">Email</option>
                                            <option value="WHATSAPP">WhatsApp</option>
                                            <option value="IN_PERSON">In-Person Visit</option>
                                            <option value="SITE_VISIT">Site Visit</option>
                                            <option value="VIDEO_CALL">Video Call</option>
                                            <option value="LETTER">Letter</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-surface-500 uppercase">Contact Name</label>
                                        <input
                                            className="mt-1 w-full rounded-lg border border-surface-300 dark:border-slate-700 px-3 py-2 text-sm dark:bg-slate-900 dark:text-white"
                                            placeholder="Person contacted"
                                            value={followUpData.contactName}
                                            onChange={e => setFollowUpData(d => ({ ...d, contactName: e.target.value }))}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-surface-500 uppercase">Date & Time</label>
                                        <input
                                            type="datetime-local"
                                            className="mt-1 w-full rounded-lg border border-surface-300 dark:border-slate-700 px-3 py-2 text-sm dark:bg-slate-900 dark:text-white"
                                            value={followUpData.contactedAt}
                                            onChange={e => setFollowUpData(d => ({ ...d, contactedAt: e.target.value }))}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-surface-500 uppercase">Follow-Up Date</label>
                                        <input
                                            type="date"
                                            className="mt-1 w-full rounded-lg border border-surface-300 dark:border-slate-700 px-3 py-2 text-sm dark:bg-slate-900 dark:text-white"
                                            value={followUpData.followUpDate}
                                            onChange={e => setFollowUpData(d => ({ ...d, followUpDate: e.target.value }))}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-surface-500 uppercase">Notes</label>
                                    <textarea
                                        className="mt-1 w-full rounded-lg border border-surface-300 dark:border-slate-700 px-3 py-2 text-sm dark:bg-slate-900 dark:text-white"
                                        rows={3}
                                        placeholder="What was discussed, agreed, or shared..."
                                        value={followUpData.note}
                                        onChange={e => setFollowUpData(d => ({ ...d, note: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-surface-500 uppercase">Next Action</label>
                                    <input
                                        className="mt-1 w-full rounded-lg border border-surface-300 dark:border-slate-700 px-3 py-2 text-sm dark:bg-slate-900 dark:text-white"
                                        placeholder="What happens next?"
                                        value={followUpData.nextAction}
                                        onChange={e => setFollowUpData(d => ({ ...d, nextAction: e.target.value }))}
                                    />
                                </div>
                                <Button type="submit" variant="primary" size="sm" isLoading={addFollowUp.isPending}>
                                    Save Follow-Up
                                </Button>
                            </form>
                        )}

                        <div className="space-y-3">
                            {followUpsQuery.isLoading && <p className="text-sm text-surface-400">Loading...</p>}
                            {(() => {
                                const fups = followUpsQuery.data as any[];
                                if (!fups || !Array.isArray(fups)) return null;
                                if (fups.length === 0) return <p className="text-sm text-surface-400 text-center py-6">No follow-ups recorded yet.</p>;
                                return fups.map((fu) => (
                                    <div key={fu.id as string} className="flex items-start gap-3 p-4 bg-surface-50 rounded-xl border border-surface-100">
                                        <div className="mt-0.5">
                                            {fu.method === 'PHONE' && <Phone size={14} className="text-primary-500" />}
                                            {fu.method === 'EMAIL' && <Mail size={14} className="text-primary-500" />}
                                            {fu.method === 'WHATSAPP' && <MessageSquare size={14} className="text-success-500" />}
                                            {!['PHONE', 'EMAIL', 'WHATSAPP'].includes(fu.method as string) && <MessageSquare size={14} className="text-primary-500" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-xs font-bold text-surface-700 uppercase">{(fu.method as string).replace('_', ' ')}</span>
                                                <span className="text-[10px] text-surface-400">{formatDate(fu.contactedAt as string || fu.createdAt as string)}</span>
                                            </div>
                                            {fu.contactName && <p className="text-xs text-surface-500 mt-0.5">Contact: {fu.contactName as string}</p>}
                                            <p className="text-sm text-surface-800 mt-1">{fu.note as string}</p>
                                            {fu.nextAction && <p className="text-xs text-primary-600 mt-1 font-medium">Next: {fu.nextAction as string}</p>}
                                            {fu.followUpDate && <p className="text-xs text-warning-600 mt-0.5 font-medium">Follow-up by: {formatDate(fu.followUpDate as string)}</p>}
                                            {fu.loggedByName && <p className="text-[10px] text-surface-400 mt-1">Logged by {fu.loggedByName as string}</p>}
                                        </div>
                                    </div>
                                ));
                            })()}
                        </div>
                    </Card>
                )}

                {/* SETTLEMENT */}
                {activeTab === 'settlement' && (
                    <Card padding="lg">
                        <CardHeader title="Settlement Details" />
                        <div className="mt-4 space-y-0">
                            <InfoRow label="Settlement Amount" value={(claim as any).settledAmount ? formatCurrency((claim as any).settledAmount) : '—'} />
                            <InfoRow label="Deductible Applied" value={(claim as any).deductibleAmount ? formatCurrency((claim as any).deductibleAmount) : '—'} />
                            <InfoRow label="Net Payout" value={
                                (claim as any).settledAmount && (claim as any).deductibleAmount
                                    ? formatCurrency(((claim as any).settledAmount || 0) - ((claim as any).deductibleAmount || 0))
                                    : '—'
                            } />
                            <InfoRow label="Payment Method" value={(claim as any).paymentMethod} />
                            <InfoRow label="Payment Reference" value={(claim as any).paymentReference} />
                            <InfoRow label="Payment Date" value={(claim as any).paymentDate ? formatDate((claim as any).paymentDate) : '—'} />
                        </div>
                        {!claim.settlementDate && (
                            <p className="text-sm text-surface-400 text-center py-4">No settlement recorded yet.</p>
                        )}
                    </Card>
                )}

                {/* THIRD PARTY */}
                {activeTab === 'thirdparty' && (
                    <Card padding="lg">
                        <CardHeader title="Third Party Details" />
                        <div className="mt-4 space-y-0">
                            <InfoRow label="Third Party Name" value={(claim as any).thirdPartyName} />
                            <InfoRow label="Phone" value={(claim as any).thirdPartyPhone} />
                            <InfoRow label="Vehicle Registration" value={(claim as any).thirdPartyVehicleReg} />
                            <InfoRow label="Their Insurer" value={(claim as any).thirdPartyInsurer} />
                            <InfoRow label="Their Claim Ref" value={(claim as any).thirdPartyClaimRef} />
                        </div>
                        {!(claim as any).thirdPartyName && (
                            <p className="text-sm text-surface-400 text-center py-8">No third-party details recorded for this claim.</p>
                        )}
                    </Card>
                )}

                {/* COMMUNICATIONS */}
                {activeTab === 'communications' && (
                    <Card padding="lg">
                        <CardHeader title="Client Communications" />
                        <p className="text-xs text-surface-500 mt-1 mb-4">Automated emails sent to the client about this claim.</p>
                        <div className="space-y-3">
                            {[
                                { label: 'Claim Acknowledgement', date: claim.registrationDate, sent: !!claim.registrationDate },
                                { label: 'Assessment Notification', date: claim.assessmentDate, sent: !!claim.assessmentDate },
                                { label: 'Decision Letter (Approval/Rejection)', date: claim.approvalDate, sent: !!claim.approvalDate },
                                { label: 'Settlement Confirmation', date: claim.settlementDate, sent: !!claim.settlementDate },
                            ].map(item => (
                                <div key={item.label} className="flex items-center justify-between p-3 bg-surface-50 rounded-xl border border-surface-100">
                                    <div className="flex items-center gap-3">
                                        <Mail size={16} className={item.sent ? 'text-primary-500' : 'text-surface-300'} />
                                        <span className="text-sm font-medium text-surface-700">{item.label}</span>
                                    </div>
                                    {item.sent ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-surface-500">{formatDate(item.date!)}</span>
                                            <span className="text-[10px] font-bold text-success-600 bg-success-50 border border-success-200 px-2 py-0.5 rounded-full">SENT</span>
                                        </div>
                                    ) : (
                                        <span className="text-[10px] font-bold text-surface-400 bg-surface-100 px-2 py-0.5 rounded-full">PENDING</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {/* NIC COMPLIANCE */}
                {activeTab === 'nic' && (
                    <div className="space-y-4">
                        <Card padding="lg">
                            <CardHeader title="NIC Compliance Status" />
                            <p className="text-xs text-surface-500 mt-1 mb-4">National Insurance Commission Act 1061 — Claims Handling Requirements</p>

                            {/* 5-Day Rule */}
                            <div className={cn('p-4 rounded-xl border-2 mb-4', ack5Breached ? 'border-danger-300 bg-danger-50' : claim.acknowledgmentDate ? 'border-success-300 bg-success-50' : 'border-warning-200 bg-warning-50')}>
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-bold text-surface-800">5-Day Acknowledgement Rule</p>
                                        <p className="text-xs text-surface-500 mt-0.5">Claim must be formally acknowledged within 5 business days of intimation.</p>
                                        <p className="text-xs text-surface-500">NIC Act 1061 — Section on Claims Handling</p>
                                    </div>
                                    <span className={cn('text-xs font-bold px-3 py-1 rounded-full shrink-0', ack5Breached ? 'bg-danger-100 text-danger-700' : claim.acknowledgmentDate ? 'bg-success-100 text-success-700' : 'bg-warning-100 text-warning-700')}>
                                        {ack5Breached ? 'BREACHED' : claim.acknowledgmentDate ? 'MET' : 'PENDING'}
                                    </span>
                                </div>
                                <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                                    <div><span className="text-surface-500">Deadline: </span><span className="font-semibold">{ack5Deadline ? formatDate(ack5Deadline) : '—'}</span></div>
                                    <div><span className="text-surface-500">Acknowledged: </span><span className="font-semibold">{claim.acknowledgmentDate ? formatDate(claim.acknowledgmentDate) : 'Not yet'}</span></div>
                                    {ack5Breached && ackDays !== null && (
                                        <div className="col-span-2 text-danger-700 font-bold">Breached by {Math.abs(ackDays)} day(s) — must be reported in NIC Quarterly Return</div>
                                    )}
                                </div>
                            </div>

                            {/* 30-Day Rule */}
                            <div className={cn('p-4 rounded-xl border-2', proc30Breached ? 'border-danger-300 bg-danger-50' : claim.settlementDate ? 'border-success-300 bg-success-50' : 'border-warning-200 bg-warning-50')}>
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-bold text-surface-800">30-Day Settlement Rule</p>
                                        <p className="text-xs text-surface-500 mt-0.5">Claim must be fully settled within 30 calendar days of intimation.</p>
                                        <p className="text-xs text-surface-500">NIC Act 1061 — Strict Enforcement</p>
                                    </div>
                                    <span className={cn('text-xs font-bold px-3 py-1 rounded-full shrink-0', proc30Breached ? 'bg-danger-100 text-danger-700' : claim.settlementDate ? 'bg-success-100 text-success-700' : 'bg-warning-100 text-warning-700')}>
                                        {proc30Breached ? 'BREACHED' : claim.settlementDate ? 'MET' : `${procDays !== null ? procDays + 'd' : '?'} remaining`}
                                    </span>
                                </div>
                                <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                                    <div><span className="text-surface-500">Deadline: </span><span className="font-semibold">{proc30Deadline ? formatDate(proc30Deadline) : '—'}</span></div>
                                    <div><span className="text-surface-500">Settled: </span><span className="font-semibold">{claim.settlementDate ? formatDate(claim.settlementDate) : 'Not yet'}</span></div>
                                    {proc30Breached && procDays !== null && (
                                        <div className="col-span-2 text-danger-700 font-bold">Breached by {Math.abs(procDays)} day(s) — may result in NIC investigation</div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {/* HISTORY */}
                {activeTab === 'history' && (
                    <Card padding="lg">
                        <CardHeader title="Claim Timeline & Audit Trail" />
                        <div className="mt-4 space-y-0">
                            {[
                                { date: claim.intimationDate, title: 'Claim Intimated', desc: 'First Notice of Loss (FNOL) recorded', active: true },
                                { date: claim.registrationDate, title: 'Claim Registered', desc: 'Claim formally registered and acknowledged', active: !!claim.registrationDate },
                                { date: claim.registrationDate, title: 'Investigation Started', desc: 'Loss adjuster assigned, documents requested', active: ['UNDER_REVIEW','ASSESSED','APPROVED','SETTLED','CLOSED'].includes(claim.status) },
                                { date: claim.assessmentDate, title: 'Assessment Completed', desc: 'Damage assessment and loss adjustment', active: !!claim.assessmentDate },
                                { date: claim.approvalDate, title: 'Decision Made', desc: claim.status === 'REJECTED' ? 'Claim rejected' : 'Claim approved', active: !!claim.approvalDate },
                                { date: claim.settlementDate, title: 'Settlement Processed', desc: 'Payment made to claimant', active: !!claim.settlementDate },
                                { date: (claim as any).closedDate, title: 'Claim Closed', desc: 'Claim file closed and archived', active: !!(claim as any).closedDate },
                            ].map((item, i) => (
                                <div key={i} className="relative pl-8 pb-6 last:pb-0">
                                    {i < 6 && <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-surface-200" />}
                                    <div className={cn(
                                        'absolute left-0 top-0 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-background z-10 text-[10px]',
                                        item.active ? 'bg-primary-500 text-white' : 'bg-surface-100 text-surface-400'
                                    )}>
                                        {item.active ? <CheckCircle2 size={12} /> : i + 1}
                                    </div>
                                    <p className="text-[10px] text-surface-500 font-bold uppercase tracking-tight">{item.date ? formatDate(item.date) : 'Pending'}</p>
                                    <h4 className={cn('text-sm font-bold', item.active ? 'text-surface-900' : 'text-surface-400')}>{item.title}</h4>
                                    <p className="text-xs text-surface-500 mt-0.5">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}
            </div>

            {/* Modals */}
            {isStatusModalOpen && (
                <ClaimStatusModal
                    isOpen={isStatusModalOpen}
                    onClose={() => setIsStatusModalOpen(false)}
                    claim={claim}
                    onUpdate={handleUpdateClaim}
                />
            )}
            {showUploadModal && (
                <UploadDocumentModal
                    isOpen={showUploadModal}
                    onClose={() => setShowUploadModal(false)}
                    defaultCategory="claims"
                    onUploadComplete={(docs) => {
                        docs.forEach((doc: any) => {
                            addDocumentMutation.mutate({
                                claimId: id,
                                data: {
                                    name: doc.name,
                                    type: doc.type === 'claims' ? 'PHOTOGRAPH' : doc.type === 'financial' ? 'REPAIR_ESTIMATE' : 'CORRESPONDENCE',
                                    url: doc.url || 'https://example.com/dummy-url.pdf',
                                }
                            });
                        });
                        setShowUploadModal(false);
                    }}
                />
            )}
        </div>
    );
}
