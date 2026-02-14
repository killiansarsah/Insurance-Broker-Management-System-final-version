'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    FileText,
    Calendar,
    MapPin,
    DollarSign,
    Shield,
    CheckCircle2,
    XCircle,
    User,
    AlertCircle,
    Download,
    Search,
    ClipboardList,
    UserCheck,
    Clock,
    MessageSquare
} from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/data-display/status-badge';
import { claims } from '@/mock/claims';
import { formatCurrency, formatDate, cn } from '@/lib/utils'; // Keep formatDate here if it works, or replace with inline logic
import { Claim } from '@/types';

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

function TimelineItem({ date, title, desc, icon, active, warning, last }: { date?: string; title: string; desc: string; icon: React.ReactNode; active?: boolean; warning?: boolean; last?: boolean }) {
    return (
        <div className="relative pl-8 pb-8 last:pb-0">
            {!last && (
                <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-surface-200" />
            )}
            <div className={cn(
                "absolute left-0 top-0 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white",
                active
                    ? (warning ? "bg-warning-500 text-white" : "bg-primary-500 text-white")
                    : "bg-surface-100 text-surface-400"
            )}>
                {icon}
            </div>
            <div>
                <p className="text-xs text-surface-500 font-medium mb-0.5">{date ? formatDate(date) : 'Pending'}</p>
                <h4 className="text-sm font-bold text-surface-900">{title}</h4>
                <p className="text-xs text-surface-500 mt-1">{desc}</p>
            </div>
        </div>
    );
}

export default function ClaimDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const claim = claims.find((c) => c.id === id) || claims[0]; // Fallback for dev

    if (!claim) return <div>Claim not found</div>;

    const timeline = [
        { date: claim.intimationDate, title: 'Claim Intimated', desc: 'First Notice of Loss (FNOL) recorded', icon: <AlertCircle size={14} />, active: true },
        { date: claim.registrationDate, title: 'Claim Registered', desc: 'Claim registered in IBMS with ID', icon: <FileText size={14} />, active: !!claim.registrationDate },
        { date: claim.registrationDate, title: 'Document Submission', desc: 'Required evidence submitted by claimant', icon: <ClipboardList size={14} />, active: !!claim.registrationDate },
        { date: claim.registrationDate, title: 'Verification', desc: 'Documents verified for authenticity', icon: <UserCheck size={14} />, active: !!claim.registrationDate },
        { date: claim.assessmentDate, title: 'Assessment', desc: 'Damage assessment and adjustment', icon: <Search size={14} />, active: !!claim.assessmentDate },
        { date: claim.approvalDate, title: 'Decision', desc: 'Internal review and decision reached', icon: <CheckCircle2 size={14} />, active: !!claim.approvalDate },
        { date: claim.settlementDate, title: 'Settlement', desc: 'Payment processed to claimant account', icon: <DollarSign size={14} />, active: !!claim.settlementDate, last: true },
    ];

    // Calculate acknowledgment compliance (5 working days per NIC)
    const intimationDate = new Date(claim.intimationDate);
    const deadlineDate = new Date(intimationDate.getTime() + 86400000 * 5);
    const isAcknowledged = !!claim.registrationDate;

    return (
        <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[var(--radius-lg)] shadow-sm border border-surface-200">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/dashboard/claims')}
                        className="p-2 rounded-[var(--radius-md)] text-surface-500 hover:bg-surface-100 cursor-pointer transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-surface-900 tracking-tight">{claim.claimNumber}</h1>
                            <StatusBadge status={claim.status} />
                        </div>
                        <p className="text-sm text-surface-500 mt-1">Reported on {formatDate(claim.intimationDate)}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" leftIcon={<Download size={16} />}>Export PDF</Button>
                    <Button variant="primary">Update Status</Button>
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
                                    {claim.policyNumber}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-surface-100">
                                <span className="text-sm text-surface-500">Client</span>
                                <span className="text-sm font-medium text-surface-900">{claim.clientName}</span>
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
                        <Button variant="outline" className="w-full" leftIcon={<MessageSquare size={16} />}>
                            Message Complainant
                        </Button>
                        <Button variant="outline" className="w-full" leftIcon={<Search size={16} />}>
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
