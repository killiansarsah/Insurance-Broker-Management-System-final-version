'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    FileText,
    Calendar,
    Clock,
    User,
    Shield,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Download,
    Search,
    Phone,
    MessageSquare,
    ClipboardList,
    UserCheck,
    CheckCircle
} from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/data-display/status-badge';
import { MOCK_COMPLAINTS } from '@/mock/documents-complaints';
import { formatDate, cn } from '@/lib/utils';
import { Complaint } from '@/types';

function InfoItem({ icon, label, value, className }: { icon: React.ReactNode; label: string; value: React.ReactNode; className?: string }) {
    return (
        <div className={cn("flex items-start gap-3", className)}>
            <div className="mt-0.5 text-surface-400">{icon}</div>
            <div>
                <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider">{label}</p>
                <div className="text-sm font-medium text-surface-900 mt-1">{value}</div>
            </div>
        </div>
    );
}

function TimelineStep({ date, title, desc, icon, active, warning, isLast }: { date?: string; title: string; desc: string; icon: React.ReactNode; active?: boolean; warning?: boolean; isLast?: boolean }) {
    return (
        <div className="relative pl-8 pb-8 last:pb-0">
            {!isLast && (
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

// Generate static params for static export
export async function generateStaticParams() {
    return MOCK_COMPLAINTS.map((c) => ({
        id: c.id,
    }));
}

export default function ComplaintDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const complaint = MOCK_COMPLAINTS.find((c) => c.id === id) || MOCK_COMPLAINTS[0];

    if (!complaint) return <div>Complaint not found</div>;

    const currentStep = complaint.status === 'resolved' ? 5 : 3; // Mocking current step based on status

    const steps = [
        { title: 'Registration', desc: 'Complaint logged and ID generated', icon: <ClipboardList size={14} />, active: true },
        { title: 'Assignment', desc: 'Assigned to relevant department', icon: <UserCheck size={14} />, active: true },
        { title: 'Investigation', desc: 'Facts gathering and stakeholder consultation', icon: <Search size={14} />, active: true },
        { title: 'Resolution', desc: 'Decision reached and communicated', icon: <CheckCircle size={14} />, active: complaint.status === 'resolved' },
        { title: 'Closure', desc: 'Final documentation and case closed', icon: <CheckCircle2 size={14} />, active: complaint.status === 'resolved', isLast: true },
    ];

    return (
        <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[var(--radius-lg)] shadow-sm border border-surface-200">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/dashboard/complaints')}
                        className="p-2 rounded-[var(--radius-md)] text-surface-500 hover:bg-surface-100 cursor-pointer transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-surface-900 tracking-tight">{complaint.complaintNumber}</h1>
                            <StatusBadge status={complaint.status} />
                        </div>
                        <p className="text-sm text-surface-500 mt-1">Logged on {formatDate(complaint.createdAt)}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" leftIcon={<Download size={16} />}>Export Report</Button>
                    <Button variant="primary">Investigate Case</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Complaint Overview */}
                    <Card padding="lg">
                        <CardHeader title="Complaint Details" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <InfoItem icon={<FileText size={16} />} label="Subject" value={complaint.subject} className="col-span-2" />
                            <InfoItem icon={<AlertTriangle size={16} />} label="Priority" value={<StatusBadge status={complaint.priority} showDot={false} />} />
                            <InfoItem icon={<Shield size={16} />} label="Escalation" value={complaint.escalationLevel === 0 ? 'Broker Level' : complaint.escalationLevel === 1 ? 'Compliance Officer' : 'NIC Referral'} />
                            <div className="col-span-2 space-y-2">
                                <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Description</p>
                                <div className="p-4 bg-surface-50 rounded-[var(--radius-md)] text-sm text-surface-700 leading-relaxed">
                                    {complaint.description}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Complainant Info */}
                    <Card padding="lg">
                        <CardHeader title="Complainant Information" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <InfoItem icon={<User size={16} />} label="Full Name" value={complaint.complainantName} />
                            <InfoItem icon={<Phone size={16} />} label="Phone Number" value={complaint.complainantPhone} />
                        </div>
                    </Card>

                    {/* Resolution (if resolved) */}
                    {complaint.resolution && (
                        <Card padding="lg" className="bg-success-50/30 border-success-100">
                            <CardHeader title="Resolution Decision" />
                            <div className="mt-4 space-y-3">
                                <div className="flex items-center gap-2 text-success-700">
                                    <CheckCircle2 size={18} />
                                    <span className="text-sm font-bold">Case Resolved on {complaint.resolvedAt ? formatDate(complaint.resolvedAt) : 'N/A'}</span>
                                </div>
                                <div className="p-4 bg-white/60 border border-success-200 rounded-[var(--radius-md)] text-sm text-surface-700 leading-relaxed shadow-sm">
                                    {complaint.resolution}
                                </div>
                            </div>
                        </Card>
                    )}
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* SLA Status */}
                    <Card padding="lg" className={cn(
                        complaint.isBreached ? "border-danger-200 bg-danger-50/10" : "border-surface-200"
                    )}>
                        <CardHeader title="SLA Compliance" />
                        <div className="mt-4 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-semibold text-surface-500 uppercase">Deadline</span>
                                <span className={cn(
                                    "text-sm font-bold",
                                    complaint.isBreached ? "text-danger-600" : "text-surface-900"
                                )}>
                                    {formatDate(complaint.slaDeadline)}
                                </span>
                            </div>
                            {complaint.isBreached ? (
                                <div className="flex items-center gap-2 p-3 bg-danger-50 text-danger-700 rounded-[var(--radius-md)]">
                                    <XCircle size={16} />
                                    <span className="text-[10px] font-bold uppercase tracking-tight">SLA Breached</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 p-3 bg-success-50 text-success-700 rounded-[var(--radius-md)]">
                                    <Clock size={16} />
                                    <span className="text-[10px] font-bold uppercase tracking-tight">On Track (NIC compliant)</span>
                                </div>
                            )}
                            <p className="text-[10px] text-surface-500 italic leading-snug">
                                * NIC requires resolution within 30 days of acknowledgment.
                            </p>
                        </div>
                    </Card>

                    {/* Workflow timeline */}
                    <Card padding="lg">
                        <CardHeader title="Investigation Progress" />
                        <div className="mt-6">
                            {steps.map((step, i) => (
                                <TimelineStep key={i} {...step} />
                            ))}
                        </div>
                    </Card>

                    {/* Actions */}
                    <div className="space-y-2">
                        <Button variant="outline" className="w-full" leftIcon={<MessageSquare size={16} />}>
                            Message Complainant
                        </Button>
                        <Button variant="outline" className="w-full" leftIcon={<Search size={16} />}>
                            Add Internal Note
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
