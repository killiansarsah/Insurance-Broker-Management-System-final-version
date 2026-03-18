'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
    FileText,
    Calendar,
    MapPin,
    DollarSign,
    CheckCircle2,
    AlertCircle,
    Download,
    Search,
    ClipboardList,
    UserCheck,
    Clock,
    MessageSquare,
    Phone,
    Mail,
    Plus,
} from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/data-display/status-badge';
import { useClaim, useClaimFollowUps, useAddClaimFollowUp } from '@/hooks/api';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { Claim } from '@/types';
import { BackButton } from '@/components/ui/back-button';
import { toast } from 'sonner';
import { generateReportPdf } from '@/lib/generate-report-pdf';

const ClaimStatusModal = dynamic(
    () => import('@/components/claims/claim-status-modal').then(m => ({ default: m.ClaimStatusModal })),
    { ssr: false }
);

function InfoItem({ icon, label, value, className }: { icon: React.ReactNode; label: string; value: React.ReactNode; className?: string }) {
    return (
        <div className={cn("flex items-start gap-3", className)}>
            <div className="mt-0.5 text-surface-400">{icon}</div>
            <div>
                <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider">{label}</p>
                <div className="text-sm font-medium text-surface-900 mt-0.5">{value}</div>
            </div>
        </div>
    );
}

export default function ClaimDetailPage({ id }: { id: string }) {
    const router = useRouter();

    const { data: claimData, isLoading } = useClaim(id);
    const [claimOverrides, setClaimOverrides] = useState<Partial<Claim>>({});
    const claim = claimData ? { ...(claimData as unknown as Claim), ...claimOverrides } : null;

    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [showFollowUpForm, setShowFollowUpForm] = useState(false);
    const [followUpData, setFollowUpData] = useState({ method: 'PHONE', note: '', contactName: '', nextAction: '' });

    const followUpsQuery = useClaimFollowUps(id);
    const addFollowUp = useAddClaimFollowUp();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-24 animate-fade-in">
                <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            </div>
        );
    }
    if (!claim) return <div>Claim not found</div>;

    const handleUpdateClaim = (updates: Partial<Claim>) => {
        setClaimOverrides(prev => ({ ...prev, ...updates }));
    };

    const timeline = [
        { date: claim.intimationDate, title: 'Claim Intimated', desc: 'First Notice of Loss (FNOL) recorded', icon: <AlertCircle size={14} />, active: true },
        { date: claim.registrationDate, title: 'Claim Registered', desc: 'Claim registered in IBMS with ID', icon: <FileText size={14} />, active: !!claim.registrationDate },
        { date: claim.registrationDate, title: 'Investigation Started', desc: 'Loss adjuster assigned, documents requested', icon: <ClipboardList size={14} />, active: ['UNDER_REVIEW','ASSESSED','APPROVED','SETTLED','CLOSED'].includes(claim.status) },
        { date: claim.assessmentDate, title: 'Assessment', desc: 'Damage assessment and loss adjustment', icon: <Search size={14} />, active: !!claim.assessmentDate },
        { date: claim.approvalDate, title: 'Decision', desc: 'Internal review and decision reached', icon: <CheckCircle2 size={14} />, active: !!claim.approvalDate },
        { date: claim.settlementDate, title: 'Settlement', desc: 'Payment processed to claimant account', icon: <DollarSign size={14} />, active: !!claim.settlementDate, last: true },
    ];

    // NIC acknowledgment compliance — use backend-calculated business-day deadline
    const deadlineDate = claim.acknowledgmentDeadline
        ? new Date(claim.acknowledgmentDeadline as string)
        : new Date(new Date(claim.intimationDate).getTime() + 86400000 * 5);
    const isAcknowledged = claim.status !== 'INTIMATED' || !!claim.registrationDate;

    return (
        <div className="space-y-6 animate-fade-in w-full pb-12 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-background p-6 rounded-[var(--radius-lg)] shadow-sm border border-surface-200">
                <div className="flex items-center gap-4">
                    <BackButton href="/dashboard/claims" />
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-surface-900 tracking-tight">{claim.claimNumber}</h1>
                            <StatusBadge status={claim.status} />
                        </div>
                        <p className="text-sm text-surface-500 mt-1">Reported on {formatDate(claim.intimationDate)}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" leftIcon={<Download size={16} />} onClick={() => {
                        generateReportPdf(`Claim Report — ${claim.claimNumber}`, [
                            { title: 'Claim Details', rows: [
                                { label: 'Claim Number', value: claim.claimNumber },
                                { label: 'Status', value: claim.status },
                                { label: 'Insurance Type', value: claim.insuranceType },
                                { label: 'Incident Date', value: formatDate(claim.incidentDate) },
                                { label: 'Claim Amount', value: formatCurrency(claim.claimAmount) },
                                { label: 'Settled Amount', value: claim.settledAmount ? formatCurrency(claim.settledAmount) : '—' },
                            ]},
                        ]);
                        toast.success('PDF Generated', { description: 'Print dialog opened — save as PDF.' });
                    }}>Export PDF</Button>
                    <Button
                        variant="primary"
                        onClick={() => setIsStatusModalOpen(true)}
                    >
                        Update Status
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Compliance Alert */}
                    {!isAcknowledged && (
                        <div className="bg-warning-50 border border-warning-200 p-4 rounded-[var(--radius-md)] flex items-start gap-3">
                            <AlertCircle className="text-warning-600 mt-0.5" size={18} />
                            <div>
                                <h4 className="text-sm font-bold text-warning-900">NIC Acknowledgment Required</h4>
                                <p className="text-xs text-warning-700 mt-0.5">
                                    Acknowledgment must be sent within 5 working days. Deadline: {formatDate(deadlineDate.toISOString())}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Incident Details */}
                    <Card padding="lg">
                        <CardHeader title="Incident Details" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <InfoItem icon={<Calendar size={16} />} label="Incident Date" value={formatDate(claim.incidentDate)} />
                            <InfoItem icon={<MapPin size={16} />} label="Location" value={claim.incidentLocation || 'Not specified'} />
                            <InfoItem icon={<FileText size={16} />} label="Description" value={claim.incidentDescription} className="col-span-1 md:col-span-2" />
                        </div>
                    </Card>

                    {/* Financials */}
                    <Card padding="lg">
                        <CardHeader title="Financial Summary" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                            <InfoItem icon={<DollarSign size={16} />} label="Estimated" value={formatCurrency(claim.claimAmount || 0)} />
                            <InfoItem icon={<DollarSign size={16} />} label="Assessed" value={
                                <span className={claim.assessedAmount ? 'text-success-600' : 'text-surface-400'}>
                                    {claim.assessedAmount ? formatCurrency(claim.assessedAmount) : '—'}
                                </span>
                            } />
                            <InfoItem icon={<DollarSign size={16} />} label="Settled" value={
                                <span className={claim.settledAmount ? 'text-success-600' : 'text-surface-400'}>
                                    {claim.settledAmount ? formatCurrency(claim.settledAmount) : '—'}
                                </span>
                            } />
                        </div>
                    </Card>

                    {/* Chase Log / Follow-Ups */}
                    <Card padding="lg">
                        <div className="flex items-center justify-between">
                            <CardHeader title="Chase Log" />
                            <Button
                                variant="outline"
                                size="sm"
                                leftIcon={<Plus size={14} />}
                                onClick={() => setShowFollowUpForm(v => !v)}
                            >
                                {showFollowUpForm ? 'Cancel' : 'Add Follow-Up'}
                            </Button>
                        </div>

                        {showFollowUpForm && (
                            <form
                                className="mt-4 space-y-3 p-4 bg-surface-50 rounded-[var(--radius-md)] border border-surface-200"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (followUpData.note.length < 5) {
                                        toast.error('Note must be at least 5 characters');
                                        return;
                                    }
                                    addFollowUp.mutate(
                                        { claimId: id, data: followUpData },
                                        {
                                            onSuccess: () => {
                                                toast.success('Follow-up recorded');
                                                setFollowUpData({ method: 'PHONE', note: '', contactName: '', nextAction: '' });
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
                                            className="mt-1 w-full rounded-[var(--radius-md)] border border-surface-300 px-3 py-2 text-sm bg-white"
                                            value={followUpData.method}
                                            onChange={e => setFollowUpData(d => ({ ...d, method: e.target.value }))}
                                        >
                                            <option value="PHONE">Phone</option>
                                            <option value="EMAIL">Email</option>
                                            <option value="IN_PERSON">In Person</option>
                                            <option value="LETTER">Letter</option>
                                            <option value="OTHER">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-surface-500 uppercase">Contact Name</label>
                                        <input
                                            className="mt-1 w-full rounded-[var(--radius-md)] border border-surface-300 px-3 py-2 text-sm"
                                            placeholder="Person contacted"
                                            value={followUpData.contactName}
                                            onChange={e => setFollowUpData(d => ({ ...d, contactName: e.target.value }))}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-surface-500 uppercase">Note</label>
                                    <textarea
                                        className="mt-1 w-full rounded-[var(--radius-md)] border border-surface-300 px-3 py-2 text-sm"
                                        rows={2}
                                        placeholder="Details of the follow-up..."
                                        value={followUpData.note}
                                        onChange={e => setFollowUpData(d => ({ ...d, note: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-surface-500 uppercase">Next Action</label>
                                    <input
                                        className="mt-1 w-full rounded-[var(--radius-md)] border border-surface-300 px-3 py-2 text-sm"
                                        placeholder="What to do next"
                                        value={followUpData.nextAction}
                                        onChange={e => setFollowUpData(d => ({ ...d, nextAction: e.target.value }))}
                                    />
                                </div>
                                <Button type="submit" variant="primary" size="sm" isLoading={addFollowUp.isPending}>
                                    Save Follow-Up
                                </Button>
                            </form>
                        )}

                        <div className="mt-4 space-y-3">
                            {followUpsQuery.isLoading && <p className="text-sm text-surface-400">Loading...</p>}
                            {(() => {
                                const fups = followUpsQuery.data as Record<string, unknown>[] | undefined;
                                if (!fups || !Array.isArray(fups)) return null;
                                if (fups.length === 0) return <p className="text-sm text-surface-400 text-center py-4">No follow-ups recorded yet</p>;
                                return fups.map((fu) => (
                                    <div key={fu.id as string} className="flex items-start gap-3 p-3 bg-surface-50 rounded-[var(--radius-md)] border border-surface-100">
                                        <div className="mt-0.5">
                                            {fu.method === 'PHONE' && <Phone size={14} className="text-primary-500" />}
                                            {fu.method === 'EMAIL' && <Mail size={14} className="text-primary-500" />}
                                            {!['PHONE', 'EMAIL'].includes(fu.method as string) && <MessageSquare size={14} className="text-primary-500" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-surface-700 uppercase">{(fu.method as string).replace('_', ' ')}</span>
                                                <span className="text-[10px] text-surface-400">{formatDate(fu.createdAt as string)}</span>
                                            </div>
                                            {fu.contactName ? <p className="text-xs text-surface-500 mt-0.5">Contact: {fu.contactName as string}</p> : null}
                                            <p className="text-sm text-surface-800 mt-1">{fu.note as string}</p>
                                            {fu.nextAction ? (
                                                <p className="text-xs text-primary-600 mt-1 font-medium">Next: {fu.nextAction as string}</p>
                                            ) : null}
                                        </div>
                                    </div>
                                ));
                            })()}
                        </div>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* NIC Compliance Tracker */}
                    <Card padding="lg">
                        <CardHeader title="NIC Compliance" />
                        <div className="space-y-4 mt-4">
                            <div className="flex justify-between items-center py-2 border-b border-surface-100">
                                <span className="text-xs text-surface-500 font-semibold uppercase tracking-wider">Ack. Deadline</span>
                                <span className="text-xs font-bold text-surface-900">{formatDate(deadlineDate.toISOString())}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-xs text-surface-500 font-semibold uppercase tracking-wider">Status</span>
                                {isAcknowledged ? (
                                    <div className="flex items-center gap-1 text-success-600 font-bold text-xs">
                                        <CheckCircle2 size={14} />
                                        COMPLIANT
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1 text-warning-600 font-bold text-xs animate-pulse">
                                        <Clock size={14} />
                                        PENDING
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>

                    {/* Policy Snapshot */}
                    <Card padding="lg">
                        <CardHeader title="Policy Information" />
                        <div className="space-y-4 mt-4">
                            <div className="flex justify-between items-center py-2 border-b border-surface-100">
                                <span className="text-sm text-surface-500">Policy #</span>
                                <span className="text-sm font-semibold text-primary-600 underline cursor-pointer" onClick={() => router.push(`/dashboard/policies/${claim.policyId}`)}>
                                    {(claim as any).policy?.policyNumber || claim.policyNumber || '—'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-surface-100">
                                <span className="text-sm text-surface-500">Client</span>
                                <span className="text-sm font-medium text-surface-900">
                                    {(claim as any).client
                                        ? ((claim as any).client.companyName || `${(claim as any).client.firstName ?? ''} ${(claim as any).client.lastName ?? ''}`.trim())
                                        : (claim.clientName || '—')}
                                </span>
                            </div>
                        </div>
                    </Card>

                    {/* Actions */}
                    <div className="space-y-2">
                        <Button
                            variant="primary"
                            className="w-full bg-primary-600 shadow-md shadow-primary-500/20"
                            leftIcon={<MessageSquare size={16} />}
                            onClick={() => router.push(`/dashboard/chat?linkedId=${claim.id}&linkedType=claim`)}
                        >
                            Discuss with Team
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full"
                            leftIcon={<MessageSquare size={16} />}
                            onClick={async () => {
                                try {
                                    await addFollowUp.mutateAsync({
                                        claimId: id,
                                        data: {
                                            method: 'EMAIL',
                                            note: `Email reminder sent to claimant regarding claim ${claim.claimNumber}`,
                                            contactName: (claimData as any)?.client
                                                ? ((claimData as any).client.companyName || `${(claimData as any).client.firstName} ${(claimData as any).client.lastName}`)
                                                : claim.clientName,
                                            nextAction: 'Await claimant response',
                                        },
                                    });
                                    toast.success('Claimant Notified', {
                                        description: `Follow-up recorded and email reminder logged for ${claim.claimNumber}.`,
                                    });
                                } catch {
                                    toast.error('Failed to log claimant message');
                                }
                            }}
                        >
                            Message Claimant
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full"
                            leftIcon={<MessageSquare size={16} />}
                            onClick={() => setShowFollowUpForm(v => !v)}
                        >
                            Add Internal Note
                        </Button>
                    </div>

                    {/* Timeline */}
                    <Card padding="lg">
                        <CardHeader title="Claim Timeline" />
                        <div className="mt-4">
                            {timeline.map((item, i) => (
                                <TimelineStep key={i} {...item} />
                            ))}
                        </div>
                    </Card>
                </div>
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
        </div>
    );
}

function TimelineStep({ date, title, desc, icon, active, warning, last }: { date?: string; title: string; desc: string; icon: React.ReactNode; active?: boolean; warning?: boolean; last?: boolean }) {
    return (
        <div className="relative pl-8 pb-8 last:pb-0">
            {!last && (
                <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-surface-200" />
            )}
            <div className={cn(
                "absolute left-0 top-0 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white z-10",
                active
                    ? (warning ? "bg-warning-500 text-white" : "bg-primary-500 text-white")
                    : "bg-surface-100 text-surface-400"
            )}>
                {icon}
            </div>
            <div>
                <p className="text-[10px] text-surface-500 font-bold uppercase tracking-tight mb-0.5">{date ? formatDate(date) : 'Pending'}</p>
                <h4 className="text-sm font-bold text-surface-900 leading-tight">{title}</h4>
                <p className="text-xs text-surface-500 mt-1 leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}
