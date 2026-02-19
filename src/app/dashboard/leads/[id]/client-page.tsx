'use client';

import { useParams, useRouter } from 'next/navigation';
import {
    Phone,
    Mail,
    Building2,
    Calendar,
    Clock,
    User,
    CheckCircle2,
    DollarSign,
} from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/data-display/status-badge';
import { getLeadById, LEAD_STAGES } from '@/mock/leads';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { BackButton } from '@/components/ui/back-button';




export default function LeadDetailPage() {
    const params = useParams();
    const router = useRouter();
    const lead = getLeadById(params.id as string);

    if (!lead) {
        return (
            <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
                <p className="text-surface-500 text-lg">Lead not found.</p>
                <Button variant="outline" className="mt-4" onClick={() => router.push('/dashboard/leads')}>
                    Back to Leads
                </Button>
            </div>
        );
    }

    const currentStageIdx = LEAD_STAGES.findIndex(s => s.key === lead.status);

    return (
        <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3">
                <BackButton href="/dashboard/leads" />
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-surface-900 tracking-tight">{lead.companyName || lead.contactName}</h1>
                        <StatusBadge status={lead.status} />
                        <StatusBadge status={lead.priority} showDot={false} />
                    </div>
                    <p className="text-sm text-surface-500 mt-1">Lead #{lead.leadNumber} • Created {formatDate(lead.createdAt)}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Log Activity</Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            const params = new URLSearchParams({
                                sourceLeadId: lead.id,
                                firstName: lead.contactName.split(' ')[0],
                                lastName: lead.contactName.split(' ').slice(1).join(' '),
                                phone: lead.phone || '',
                                email: lead.email || '',
                                companyName: lead.companyName || '',
                                type: lead.companyName ? 'corporate' : 'individual'
                            });
                            router.push(`/dashboard/clients/new?${params.toString()}`);
                        }}
                    >
                        Convert Lead
                    </Button>
                </div>
            </div>

            {/* Pipeline Progress */}
            <div className="bg-white border border-surface-200 rounded-[var(--radius-lg)] p-4 overflow-x-auto">
                <div className="flex items-center justify-between min-w-[700px] relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-surface-100 -z-10" />
                    {LEAD_STAGES.map((s, idx) => {
                        const isCompleted = idx <= currentStageIdx;
                        const isCurrent = idx === currentStageIdx;
                        return (
                            <div key={s.key} className="flex flex-col items-center gap-2 bg-white px-2">
                                <div className={cn(
                                    'w-3 h-3 rounded-full border-2 transition-all',
                                    isCompleted ? 'bg-primary-500 border-primary-500' : 'bg-white border-surface-300',
                                    isCurrent && 'ring-4 ring-primary-100'
                                )} />
                                <span className={cn(
                                    'text-[10px] font-semibold uppercase tracking-wider',
                                    isCompleted ? 'text-surface-900' : 'text-surface-400'
                                )}>{s.label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    <Card padding="lg">
                        <CardHeader title="Contact Information" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <InfoItem icon={<User size={16} />} label="Contact Name" value={lead.contactName} />
                            {lead.companyName && <InfoItem icon={<Building2 size={16} />} label="Company" value={lead.companyName} />}
                            <InfoItem icon={<Phone size={16} />} label="Phone" value={lead.phone} />
                            <InfoItem icon={<Mail size={16} />} label="Email" value={lead.email || '—'} />
                        </div>
                    </Card>

                    <Card padding="lg">
                        <CardHeader title="Opportunity Details" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <InfoItem icon={<DollarSign size={16} />} label="Est. Premium" value={formatCurrency(lead.estimatedPremium || 0)} />
                            <InfoItem icon={<DollarSign size={16} />} label="Est. Commission" value={formatCurrency(lead.estimatedCommission || 0)} />
                            <div className="col-span-1 md:col-span-2">
                                <p className="text-xs text-surface-400 uppercase tracking-wider font-semibold mb-2">Product Interest</p>
                                <div className="flex flex-wrap gap-2">
                                    {lead.productInterest?.map((p) => (
                                        <Badge key={p} variant="outline" className="capitalize">{p.replace(/_/g, ' ')}</Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {lead.notes && (
                        <Card padding="lg">
                            <CardHeader title="Notes" />
                            <div className="mt-4 bg-surface-50 p-4 rounded-[var(--radius-md)] border border-surface-200 text-sm text-surface-700 italic">
                                &quot;{lead.notes}&quot;
                            </div>
                        </Card>
                    )}
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    <Card padding="lg">
                        <CardHeader title="Lead Scoring" />
                        <div className="mt-4 text-center">
                            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-8 border-surface-100 relative">
                                <span className={cn(
                                    "absolute inset-0 rounded-full border-8 border-transparent border-t-primary-500 border-r-primary-500 rotate-45",
                                    lead.score < 50 && "border-t-warning-500 border-r-transparent",
                                    lead.score > 75 && "border-t-success-500 border-r-success-500 border-b-success-500"
                                )} />
                                <span className="text-3xl font-bold text-surface-900">{lead.score}</span>
                            </div>
                            <p className="text-sm font-medium text-surface-500 mt-2">
                                Probability of Conversion
                            </p>
                        </div>
                    </Card>

                    <Card padding="lg">
                        <CardHeader title="Next Steps" />
                        <div className="mt-4 space-y-4">
                            {lead.nextFollowUpDate ? (
                                <div className="flex items-start gap-3 bg-primary-50 p-3 rounded-[var(--radius-md)] border border-primary-100">
                                    <Clock className="text-primary-600 mt-0.5" size={16} />
                                    <div>
                                        <p className="text-sm font-bold text-primary-900">Follow Up Due</p>
                                        <p className="text-xs text-primary-700 mt-0.5">{formatDate(lead.nextFollowUpDate)}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 text-surface-500 text-sm">
                                    <CheckCircle2 size={16} /> No pending tasks
                                </div>
                            )}
                            <Button className="w-full" variant="outline" size="sm">Schedule Meeting</Button>
                            <Button className="w-full" variant="outline" size="sm">Send Email</Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | undefined }) {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-0.5 text-surface-400">{icon}</div>
            <div>
                <p className="text-xs text-surface-400 uppercase tracking-wider font-semibold">{label}</p>
                <p className="text-sm font-medium text-surface-900 mt-0.5">{value || '—'}</p>
            </div>
        </div>
    );
}
