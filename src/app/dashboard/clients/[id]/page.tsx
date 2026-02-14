'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    ShieldCheck,
    AlertTriangle,
    FileText,
    Users,
    Activity,
    Building2,
    Calendar,
    CreditCard,
    ExternalLink,
} from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/data-display/status-badge';
import { getClientById, getClientDisplayName } from '@/mock/clients';
import { getPoliciesByClientId } from '@/mock/policies';
import { formatCurrency, formatDate, formatPhone, getInitials, cn } from '@/lib/utils';
import type { Policy } from '@/types';
import Link from 'next/link';

const TABS = ['Overview', 'Policies', 'Claims', 'Documents', 'Activity'];

export default function ClientProfilePage() {
    const params = useParams();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('Overview');

    const client = getClientById(params.id as string);

    if (!client) {
        return (
            <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
                <p className="text-surface-500 text-lg">Client not found.</p>
                <Button variant="outline" className="mt-4" onClick={() => router.push('/dashboard/clients')}>
                    Back to Clients
                </Button>
            </div>
        );
    }

    const clientPolicies = getPoliciesByClientId(client.id);
    const name = getClientDisplayName(client);
    const initials = getInitials(name);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Back + Header */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => router.push('/dashboard/clients')}
                    className="p-2 rounded-[var(--radius-md)] text-surface-500 hover:bg-surface-100 cursor-pointer transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-surface-900 tracking-tight">{name}</h1>
                    <p className="text-sm text-surface-500">{client.clientNumber}</p>
                </div>
            </div>

            {/* Summary Card */}
            <Card padding="lg">
                <div className="flex flex-col sm:flex-row gap-6">
                    {/* Avatar */}
                    <div className={cn(
                        'w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold shrink-0',
                        client.type === 'corporate'
                            ? 'bg-primary-100 text-primary-700'
                            : 'bg-accent-50 text-accent-700'
                    )}>
                        {client.type === 'corporate' ? <Building2 size={32} /> : initials}
                    </div>

                    {/* Info Grid */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <InfoItem icon={<Users size={14} />} label="Type" value={client.type === 'corporate' ? 'Corporate' : 'Individual'} />
                        <InfoItem icon={<ShieldCheck size={14} />} label="Status">
                            <StatusBadge status={client.status} />
                        </InfoItem>
                        <InfoItem icon={<ShieldCheck size={14} />} label="KYC">
                            <div className="flex items-center gap-1.5">
                                <StatusBadge status={client.kycStatus} />
                                {client.isPep && <Badge variant="danger" size="sm">PEP</Badge>}
                            </div>
                        </InfoItem>
                        <InfoItem icon={<AlertTriangle size={14} />} label="AML Risk">
                            <StatusBadge status={client.amlRiskLevel} />
                        </InfoItem>
                        <InfoItem icon={<Phone size={14} />} label="Phone" value={formatPhone(client.phone)} />
                        <InfoItem icon={<Mail size={14} />} label="Email" value={client.email || '—'} />
                        <InfoItem icon={<MapPin size={14} />} label="Location" value={`${client.city || ''}, ${client.region || ''}`.replace(/^, |, $/g, '') || '—'} />
                        <InfoItem icon={<Calendar size={14} />} label="Joined" value={formatDate(client.createdAt, 'long')} />
                        <InfoItem icon={<CreditCard size={14} />} label="Digital Address" value={client.digitalAddress || '—'} />
                    </div>

                    {/* Stats */}
                    <div className="flex sm:flex-col gap-4 shrink-0">
                        <StatBox label="Active Policies" value={client.activePolicies} color="text-primary-600" />
                        <StatBox label="Total Premium" value={formatCurrency(client.totalPremium)} color="text-success-600" />
                        <StatBox label="Total Policies" value={client.totalPolicies} color="text-surface-600" />
                    </div>
                </div>
            </Card>

            {/* Tabs */}
            <div className="border-b border-surface-200">
                <nav className="flex gap-0 -mb-px">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                'px-5 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap',
                                activeTab === tab
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300'
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="animate-fade-in">
                {activeTab === 'Overview' && <OverviewTab client={client} />}
                {activeTab === 'Policies' && <PoliciesTab policies={clientPolicies} />}
                {activeTab === 'Claims' && <EmptyTab icon={<AlertTriangle />} text="No claims associated with this client." />}
                {activeTab === 'Documents' && <EmptyTab icon={<FileText />} text="No documents uploaded yet." />}
                {activeTab === 'Activity' && <EmptyTab icon={<Activity />} text="Activity log will be available when connected to backend." />}
            </div>
        </div>
    );
}

function OverviewTab({ client }: { client: ReturnType<typeof getClientById> }) {
    if (!client) return null;
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card padding="lg">
                <CardHeader title="Personal Details" />
                <div className="grid grid-cols-2 gap-4 mt-4">
                    {client.type === 'individual' ? (
                        <>
                            <DetailField label="First Name" value={client.firstName} />
                            <DetailField label="Last Name" value={client.lastName} />
                            <DetailField label="Other Names" value={client.otherNames} />
                            <DetailField label="Date of Birth" value={client.dateOfBirth ? formatDate(client.dateOfBirth) : undefined} />
                            <DetailField label="Gender" value={client.gender} />
                            <DetailField label="Nationality" value={client.nationality} />
                            <DetailField label="Ghana Card" value={client.ghanaCardNumber} />
                        </>
                    ) : (
                        <>
                            <DetailField label="Company Name" value={client.companyName} />
                            <DetailField label="Registration #" value={client.registrationNumber} />
                            <DetailField label="TIN" value={client.tin} />
                            <DetailField label="Industry" value={client.industry} />
                            <DetailField label="Incorporated" value={client.dateOfIncorporation ? formatDate(client.dateOfIncorporation) : undefined} />
                        </>
                    )}
                </div>
            </Card>

            <Card padding="lg">
                <CardHeader title="Contact & Address" />
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <DetailField label="Phone" value={formatPhone(client.phone)} />
                    <DetailField label="Alt. Phone" value={client.alternatePhone ? formatPhone(client.alternatePhone) : undefined} />
                    <DetailField label="Email" value={client.email} />
                    <DetailField label="Digital Address" value={client.digitalAddress} />
                    <DetailField label="Postal Address" value={client.postalAddress} />
                    <DetailField label="Region" value={client.region} />
                    <DetailField label="City" value={client.city} />
                </div>
            </Card>

            <Card padding="lg">
                <CardHeader title="KYC / AML Compliance" />
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                        <p className="text-xs text-surface-400 uppercase tracking-wider font-semibold">KYC Status</p>
                        <div className="mt-1"><StatusBadge status={client.kycStatus} /></div>
                    </div>
                    <div>
                        <p className="text-xs text-surface-400 uppercase tracking-wider font-semibold">AML Risk Level</p>
                        <div className="mt-1"><StatusBadge status={client.amlRiskLevel} /></div>
                    </div>
                    <div>
                        <p className="text-xs text-surface-400 uppercase tracking-wider font-semibold">PEP</p>
                        <p className="text-sm font-medium text-surface-800 mt-0.5">{client.isPep ? 'Yes ⚠️' : 'No'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-surface-400 uppercase tracking-wider font-semibold">EDD Required</p>
                        <p className="text-sm font-medium text-surface-800 mt-0.5">{client.eddRequired ? 'Yes' : 'No'}</p>
                    </div>
                    {client.kycVerifiedAt && (
                        <DetailField label="Verified At" value={formatDate(client.kycVerifiedAt, 'long')} />
                    )}
                </div>
            </Card>

            <Card padding="lg">
                <CardHeader title="Assigned Broker" />
                <div className="flex items-center gap-4 mt-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
                        {client.assignedBrokerName ? getInitials(client.assignedBrokerName) : '—'}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-surface-900">{client.assignedBrokerName || 'Unassigned'}</p>
                        <p className="text-xs text-surface-500">{client.assignedBrokerId || ''}</p>
                    </div>
                </div>
            </Card>
        </div>
    );
}

function PoliciesTab({ policies }: { policies: Policy[] }) {
    if (policies.length === 0) {
        return <EmptyTab icon={<FileText />} text="No policies linked to this client." />;
    }

    return (
        <div className="space-y-3">
            {policies.map((pol) => (
                <Card key={pol.id} padding="md" hover className="group">
                    <Link href={`/dashboard/policies/${pol.id}`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                                    <FileText size={18} />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-surface-900 group-hover:text-primary-600 transition-colors">
                                        {pol.policyNumber}
                                    </p>
                                    <p className="text-xs text-surface-500 mt-0.5">
                                        {pol.insuranceType.replace(/_/g, ' ')} • {pol.insurerName}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-surface-900">{formatCurrency(pol.premiumAmount)}</p>
                                    <p className="text-xs text-surface-400 mt-0.5">{formatDate(pol.inceptionDate)} → {formatDate(pol.expiryDate)}</p>
                                </div>
                                <StatusBadge status={pol.status} />
                                <ExternalLink size={14} className="text-surface-300 group-hover:text-primary-500 transition-colors" />
                            </div>
                        </div>
                    </Link>
                </Card>
            ))}
        </div>
    );
}

function EmptyTab({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <Card padding="lg" className="text-center py-16">
            <div className="w-12 h-12 rounded-xl bg-surface-100 text-surface-400 flex items-center justify-center mx-auto mb-4">
                {icon}
            </div>
            <p className="text-sm text-surface-500">{text}</p>
        </Card>
    );
}

function InfoItem({
    icon,
    label,
    value,
    children,
}: {
    icon: React.ReactNode;
    label: string;
    value?: string;
    children?: React.ReactNode;
}) {
    return (
        <div className="flex items-start gap-2">
            <span className="text-surface-400 mt-0.5">{icon}</span>
            <div>
                <p className="text-[10px] text-surface-400 uppercase tracking-wider font-semibold">{label}</p>
                {children || <p className="text-sm font-medium text-surface-800">{value || '—'}</p>}
            </div>
        </div>
    );
}

function StatBox({ label, value, color }: { label: string; value: string | number; color: string }) {
    return (
        <div className="text-center bg-surface-50 rounded-[var(--radius-md)] p-3 min-w-[100px]">
            <p className={cn('text-xl font-bold', color)}>{value}</p>
            <p className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold mt-0.5">{label}</p>
        </div>
    );
}

function DetailField({ label, value }: { label: string; value?: string }) {
    return (
        <div>
            <p className="text-xs text-surface-400 uppercase tracking-wider font-semibold">{label}</p>
            <p className="text-sm font-medium text-surface-800 mt-0.5 capitalize">{value || '—'}</p>
        </div>
    );
}
