'use client';

import { useParams, useRouter } from 'next/navigation';
import {
    Calendar,
    Shield,
    DollarSign,
    FileText,
    AlertCircle,
    Download,
    Eye,
    Building2,
    User,
    Clock,
    MessageSquare,
    RotateCcw,
    Ban,
} from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/data-display/status-badge';
import { getPolicyById, mockPolicies } from '@/mock/policies';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import Link from 'next/link';
import { PaymentProcessModal } from '@/components/ui/payment-process-modal';
import { useState } from 'react';
import { BackButton } from '@/components/ui/back-button';



export default function PolicyDetailPage() {
    const params = useParams();
    const router = useRouter();
    const policy = getPolicyById(params.id as string);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    if (!policy) {
        return (
            <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
                <p className="text-surface-500 text-lg">Policy not found.</p>
                <Button variant="outline" className="mt-4" onClick={() => router.push('/dashboard/policies')}>
                    Back to Policies
                </Button>
            </div>
        );
    }

    const isExpiringSoon = (policy.daysToExpiry || 999) < 30;

    return (
        <>
            <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <BackButton href="/dashboard/policies" />
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-surface-900 tracking-tight">{policy.policyNumber}</h1>
                                <StatusBadge status={policy.status} />
                            </div>
                            <p className="text-sm text-surface-500 mt-1">
                                {policy.insuranceType.replace(/_/g, ' ').toUpperCase()} • {policy.insurerName}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            leftIcon={<MessageSquare size={16} />}
                            className="text-primary-600 border-primary-100 hover:bg-primary-50"
                            onClick={() => router.push(`/dashboard/chat?linkedId=${policy.id}&linkedType=policy`)}
                        >
                            Discuss with Team
                        </Button>
                        <Button
                            variant="primary"
                            leftIcon={<DollarSign size={16} />}
                            onClick={() => setIsPaymentModalOpen(true)}
                        >
                            Pay Premium
                        </Button>
                        <Button variant="outline" leftIcon={<Download size={16} />}>Schedule</Button>
                        <Button variant="outline" leftIcon={<Download size={16} />}>Certificate</Button>
                    </div>
                </div>

                {isExpiringSoon && policy.status === 'active' && (
                    <div className="bg-amber-50 border border-amber-200 rounded-[var(--radius-md)] p-4 flex items-start gap-3">
                        <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                        <div>
                            <p className="text-sm font-bold text-amber-800">Policy Expiring Soon</p>
                            <p className="text-xs text-amber-900/80 mt-1">
                                This policy expires in <span className="font-mono font-bold">{policy.daysToExpiry}</span> days.
                                Please initiate renewal process.
                            </p>
                        </div>
                        <Button size="sm" className="ml-auto bg-amber-600 hover:bg-amber-700 text-white border-transparent">
                            Renew Now
                        </Button>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card padding="lg">
                            <CardHeader title="Coverage Details" />
                            <div className="space-y-4 mt-4">
                                <div className="bg-surface-50 p-4 rounded-[var(--radius-md)] border border-surface-200">
                                    <p className="text-sm text-surface-700 leading-relaxed font-mono">
                                        {policy.coverageDetails}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                                    <DetailRow label="Inception Date" value={formatDate(policy.inceptionDate)} />
                                    <DetailRow label="Expiry Date" value={formatDate(policy.expiryDate)} />
                                    <DetailRow label="Sum Insured" value={formatCurrency(policy.sumInsured, policy.currency)} />
                                    <DetailRow label="Premium" value={formatCurrency(policy.premiumAmount, policy.currency)} />
                                </div>
                            </div>
                        </Card>

                        <Card padding="lg">
                            <CardHeader title="Client & Insurer" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                                        <User size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-surface-500 font-semibold uppercase">Client</p>
                                        <Link href={`/dashboard/clients/${policy.clientId}`} className="block group">
                                            <p className="font-bold text-surface-900 group-hover:text-primary-600 transition-colors">
                                                {policy.clientName}
                                            </p>
                                            <p className="text-xs text-surface-400 flex items-center gap-1 mt-0.5">
                                                View Profile <Eye size={10} />
                                            </p>
                                        </Link>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-surface-100 text-surface-600 flex items-center justify-center shrink-0">
                                        <Building2 size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-surface-500 font-semibold uppercase">Insurer</p>
                                        <p className="font-bold text-surface-900">{policy.insurerName}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {policy.endorsements && policy.endorsements.length > 0 && (
                            <Card padding="lg">
                                <CardHeader title="Endorsements & Extensions" />
                                <ul className="mt-4 list-disc list-inside space-y-1 text-sm text-surface-700">
                                    {policy.endorsements.map((end, i) => (
                                        <li key={i}>{end}</li>
                                    ))}
                                </ul>
                            </Card>
                        )}
                    </div>

                    {/* Right Column: Financials & Timeline */}
                    <div className="space-y-6">
                        <Card padding="lg">
                            <CardHeader title="Financials" />
                            <div className="mt-4 space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-surface-100">
                                    <span className="text-sm text-surface-500">Premium</span>
                                    <span className="font-bold text-surface-900">{formatCurrency(policy.premiumAmount, policy.currency)}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-surface-100">
                                    <span className="text-sm text-surface-500">Commission ({policy.commissionRate}%)</span>
                                    <span className="font-bold text-success-600">{formatCurrency(policy.commissionAmount, policy.currency)}</span>
                                </div>
                            </div>
                        </Card>

                        <Card padding="lg">
                            <CardHeader title="Renewal & Lifecycle" />
                            <div className="mt-4 space-y-3">
                                {policy.status === 'active' && (
                                    <>
                                        <Button
                                            variant="outline"
                                            className="w-full text-success-700 border-success-200 hover:bg-success-50"
                                            leftIcon={<RotateCcw size={16} />}
                                        >
                                            Initiate Renewal
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full text-danger-700 border-danger-200 hover:bg-danger-50"
                                            leftIcon={<Ban size={16} />}
                                        >
                                            Cancel Policy
                                        </Button>
                                    </>
                                )}
                                {policy.status === 'expired' && (
                                    <Button
                                        variant="primary"
                                        className="w-full bg-primary-600 shadow-lg shadow-primary-500/20"
                                        leftIcon={<RotateCcw size={16} />}
                                    >
                                        Re-activate / Renew
                                    </Button>
                                )}
                                <p className="text-[10px] text-surface-500 px-1 italic">
                                    {policy.status === 'active'
                                        ? "Renewal notice will be autogenerated 45 days before expiry."
                                        : "This policy is no longer active. Use renewal to create a new term."}
                                </p>
                            </div>
                        </Card>

                        <Card padding="lg">
                            <CardHeader title="Timeline" />
                            <div className="mt-6 relative pl-4 border-l-2 border-surface-200 ml-2 space-y-8">
                                <TimelineItem
                                    date={policy.issueDate}
                                    title="Policy Issued"
                                    desc="Policy created and schedule generated."
                                    icon={<FileText size={12} />}
                                    active
                                />
                                <TimelineItem
                                    date={policy.expiryDate}
                                    title="Checks Expiry"
                                    desc={`Policy expires in ${policy.daysToExpiry} days.`}
                                    icon={<Clock size={12} />}
                                    warning={isExpiringSoon}
                                />
                                <TimelineItem
                                    title="Renewal Due"
                                    desc="Expected renewable date."
                                    icon={<Calendar size={12} />}
                                    last
                                />
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            <PaymentProcessModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                policy={policy}
            />
        </>
    );
}

function DetailRow({ label, value }: { label: string, value: string }) {
    return (
        <div>
            <p className="text-xs text-surface-400 uppercase tracking-wider font-semibold">{label}</p>
            <p className="text-sm font-medium text-surface-900 mt-1">{value || '—'}</p>
        </div>
    );
}

interface TimelineItemProps {
    date?: string;
    title: string;
    desc: string;
    icon: React.ReactNode;
    active?: boolean;
    warning?: boolean;
    last?: boolean;
}

function TimelineItem({ date, title, desc, icon, active, warning, last }: TimelineItemProps) {
    return (
        <div className="relative">
            <div className={cn(
                "absolute -left-[21px] top-0.5 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center z-10",
                warning ? "bg-amber-100 text-amber-600" : active ? "bg-primary-100 text-primary-600" : "bg-surface-100 text-surface-400"
            )}>
                {icon}
            </div>
            <div>
                <p className={cn("text-xs font-bold uppercase tracking-wider", warning ? "text-amber-600" : "text-surface-500")}>
                    {date ? formatDate(date) : "Future"}
                </p>
                <p className="text-sm font-bold text-surface-900 mt-0.5">{title}</p>
                <p className="text-xs text-surface-500 mt-1">{desc}</p>
            </div>
        </div>
    );
}
