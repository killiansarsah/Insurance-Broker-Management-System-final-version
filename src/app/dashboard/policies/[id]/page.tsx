
import Link from 'next/link';
import {
    ChevronLeft,
    Shield,
    FileText,
    Calendar,
    Download,
    Mail,
    Phone,
    Building2,
    Wallet,
    AlertTriangle,
    CheckCircle2,
    Clock,
    FileCheck,
    Truck,
    Repeat,
    Plus,
    UploadCloud,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/data-display/status-badge';
import { formatCurrency, cn, formatDate } from '@/lib/utils';
import { BackButton } from '@/components/ui/back-button';
import type { Policy, PolicyStatus } from '@/types';
import { mockPolicies } from '@/mock/policies';
import { invoices } from '@/mock/finance';
import { commissions } from '@/mock/commissions';
import { carriers } from '@/mock/carriers';

// Only for static export build
export function generateStaticParams() {
    return mockPolicies.map((policy) => ({
        id: policy.id,
    }));
}


// Template Data for Rich UI Features (Timeline, Documents) - merged with real data
const policyTemplate = {
    // Extended fields default
    underwriter: 'Enterprise Motor Dept',
    nicClass: 'Motor Comprehensive - Private',
    documents: [
        { name: 'Policy Schedule.pdf', date: '05 Jan 2025', size: '1.2 MB' },
        { name: 'Proposal Form.pdf', date: '02 Jan 2025', size: '850 KB' },
        { name: 'Cover Note.pdf', date: '02 Jan 2025', size: '420 KB' },
        { name: 'Endorsement_01.pdf', date: '10 Feb 2025', size: '150 KB' },
    ],
    timeline: [
        { title: 'Renewal Reminder Sent', date: '01 Mar 2025', icon: Mail, color: 'text-primary-500 bg-primary-50' },
        { title: 'Endorsement Added', date: '10 Feb 2025', icon: FileCheck, color: 'text-accent-500 bg-accent-50' },
        { title: 'Policy Issued', date: '05 Jan 2025', icon: CheckCircle2, color: 'text-success-500 bg-success-50' },
        { title: 'Premium Paid', date: '04 Jan 2025', icon: Wallet, color: 'text-surface-500 bg-surface-100' },
        { title: 'Policy Created', date: '02 Jan 2025', icon: Plus, color: 'text-surface-400 bg-surface-50' },
    ],
    commissionReceived: 500,
    commissionStatus: 'partially_paid',
};


export default async function PolicyDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Fetch policy by ID from mock data
    const rawPolicy = mockPolicies.find(p => p.id === id);

    // If policy not found (e.g. invalid ID), show generic not found or fallback
    if (!rawPolicy) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <AlertTriangle size={48} className="text-surface-400" />
                <h2 className="text-xl font-bold text-surface-900">Policy not found</h2>
                <Link href="/dashboard/policies">
                    <Button variant="primary">Return to Policies</Button>
                </Link>
            </div>
        );
    }

    // Merge raw data with template for UI richness
    const policy = {
        ...policyTemplate,
        ...rawPolicy,
        timeline: policyTemplate.timeline.map(t => ({ ...t })),
    };

    // Fetch real finance data for this policy
    const policyInvoices = invoices.filter(inv => inv.policyId === rawPolicy.id);
    const policyCommission = commissions.find(c => c.policyId === rawPolicy.id);
    const commissionReceived = policyCommission?.status === 'paid' ? policyCommission.commissionAmount :
        policyCommission?.status === 'earned' ? policyCommission.commissionAmount * 0.6 : // partial example
            policyTemplate.commissionReceived;
    const commissionTotal = policyCommission?.commissionAmount ?? rawPolicy.commissionAmount;

    // Calculate Premium Breakdown (Mock logic for standard Ghana taxes)
    const basePremium = Math.round(policy.premiumAmount / 1.175); // Reverse calc roughly
    const nhil = Math.round(basePremium * 0.025);
    const getFund = Math.round(basePremium * 0.025);
    const vat = Math.round((basePremium + nhil + getFund) * 0.125); // VAT on gross? Simplified here

    // Use actual amounts if possible, fallback to formula
    const breakdown = {
        base: basePremium,
        vat: vat,
        nhil: nhil,
        getfund: getFund,
        total: policy.premiumAmount,
    };

    const isExpiringSoon = (policy.daysToExpiry || 0) < 30;

    return (
        <div className="w-full space-y-6 pb-20 animate-fade-in" style={{ maxWidth: '80rem', margin: '0 auto' }}>
            {/* Breadcrumb / Back */}
            <div>
                <BackButton href="/dashboard/policies" className="mb-4" />

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-surface-900">{policy.policyNumber}</h1>
                            <StatusBadge status={policy.status} />
                        </div>
                        <p className="text-surface-500 flex items-center gap-2">
                            <Truck size={16} className="text-surface-400" />
                            {policy.nicClass}
                        </p>
                    </div>

                    {/* Expiry Countdown */}
                    <div className={cn(
                        "px-4 py-3 rounded-xl border flex items-center gap-3",
                        isExpiringSoon
                            ? "bg-danger-50 border-danger-100 text-danger-700"
                            : "bg-surface-50 border-surface-200 text-surface-600"
                    )}>
                        <Clock size={20} className={isExpiringSoon ? "text-danger-500" : "text-surface-400"} />
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Expires In</p>
                            <p className="text-lg font-bold tabular-nums leading-none">
                                {policy.daysToExpiry} days
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Bar (Sticky) */}
            <div className="sticky top-[64px] z-30 bg-white/80 backdrop-blur-md border border-surface-200 shadow-sm rounded-xl p-2 flex flex-wrap items-center gap-2 overflow-x-auto">
                <Button variant="primary" size="sm" leftIcon={<Repeat size={16} />}>Renew Policy</Button>
                <Button variant="outline" size="sm" leftIcon={<FileCheck size={16} />}>Add Endorsement</Button>
                <Button variant="outline" size="sm" leftIcon={<AlertTriangle size={16} />}>Initiate Claim</Button>
                <div className="w-px h-6 bg-surface-200 mx-1" /> {/* Divider */}
                <Button variant="ghost" size="sm" leftIcon={<Download size={16} />}>Schedule</Button>
                <Button variant="ghost" size="sm" leftIcon={<Mail size={16} />}>Reminder</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* --- Left Column (Primary Content) --- */}
                <div className="lg:col-span-2 space-y-6">

                    {/* A. Policy Information */}
                    <Card className="p-0 overflow-hidden">
                        <div className="bg-surface-50/50 border-b border-surface-100 px-6 py-4">
                            <h3 className="font-semibold text-surface-900 flex items-center gap-2">
                                <FileText size={18} className="text-primary-500" />
                                Policy Information
                            </h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                            <div>
                                <label className="text-xs font-medium text-surface-500 uppercase tracking-wider block mb-1">Policy Type</label>
                                <p className="text-surface-900 font-medium capitalize">{policy.insuranceType.replace(/_/g, ' ')}</p>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-surface-500 uppercase tracking-wider block mb-1">Insurer</label>
                                <p className="text-surface-900 font-medium">{policy.insurerName}</p>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-surface-500 uppercase tracking-wider block mb-1">Underwriter</label>
                                <p className="text-surface-900 font-medium">{policy.underwriter}</p>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-surface-500 uppercase tracking-wider block mb-1">Broker Ref</label>
                                <p className="text-surface-900 font-medium tabular-nums">BRK-{policy.id.split('-')[1]}</p>
                            </div>
                            <div className="md:col-span-2 pt-4 border-t border-surface-100">
                                <label className="text-xs font-medium text-surface-500 uppercase tracking-wider block mb-1">Sum Insured</label>
                                <p className="text-2xl font-bold text-surface-900 tabular-nums">{formatCurrency(policy.sumInsured)}</p>
                            </div>
                        </div>
                    </Card>

                    {/* B. Coverage & Premium Breakdown */}
                    <Card className="p-0 overflow-hidden">
                        <div className="bg-surface-50/50 border-b border-surface-100 px-6 py-4">
                            <h3 className="font-semibold text-surface-900 flex items-center gap-2">
                                <Wallet size={18} className="text-success-500" />
                                Premium Breakdown
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-surface-600">
                                    <span>Base Premium</span>
                                    <span className="font-medium">{formatCurrency(breakdown.base)}</span>
                                </div>
                                <div className="flex justify-between items-center text-surface-500 text-sm">
                                    <span>VAT (12.5%)</span>
                                    <span>{formatCurrency(breakdown.vat)}</span>
                                </div>
                                <div className="flex justify-between items-center text-surface-500 text-sm">
                                    <span>NHIL (2.5%)</span>
                                    <span>{formatCurrency(breakdown.nhil)}</span>
                                </div>
                                <div className="flex justify-between items-center text-surface-500 text-sm">
                                    <span>GETFund (2.5%)</span>
                                    <span>{formatCurrency(breakdown.getfund)}</span>
                                </div>
                                <div className="pt-3 border-t border-surface-200 mt-3 flex justify-between items-center">
                                    <span className="font-bold text-surface-900">Total Premium</span>
                                    <span className="text-xl font-bold text-primary-600">{formatCurrency(breakdown.total)}</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* C. Documents */}
                    <Card className="p-0 overflow-hidden">
                        <div className="bg-surface-50/50 border-b border-surface-100 px-6 py-4 flex justify-between items-center">
                            <h3 className="font-semibold text-surface-900 flex items-center gap-2">
                                <FileCheck size={18} className="text-accent-500" />
                                Documents
                            </h3>
                            <Button variant="ghost" size="sm" className="h-8 text-primary-600" leftIcon={<UploadCloud size={14} />}>Upload</Button>
                        </div>
                        <div className="p-2">
                            {policy.documents?.map((doc, i) => (
                                <div key={i} className="flex items-center justify-between p-3 hover:bg-surface-50 rounded-lg group transition-colors cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-surface-100 flex items-center justify-center text-surface-500 group-hover:bg-white group-hover:shadow-sm transition-all">
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-surface-900 group-hover:text-primary-600 transition-colors">{doc.name}</p>
                                            <p className="text-xs text-surface-500">{doc.date} · {doc.size}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity px-2">
                                        <Download size={16} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* D. Activity Timeline */}
                    <Card className="p-6">
                        <h3 className="font-semibold text-surface-900 mb-6 flex items-center gap-2">
                            <Clock size={18} className="text-surface-400" />
                            Activity Timeline
                        </h3>
                        <div className="relative pl-4 space-y-8 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-200">
                            {policy.timeline?.map((event, i) => (
                                <div key={i} className="relative flex items-start gap-4">
                                    <div className={cn(
                                        "relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm shrink-0",
                                        event.color
                                    )}>
                                        <event.icon size={16} />
                                    </div>
                                    <div className="pt-1.5">
                                        <p className="text-sm font-semibold text-surface-900">{event.title}</p>
                                        <p className="text-xs text-surface-500 mt-0.5">{event.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                </div>

                {/* --- Right Column (Sidebar) --- */}
                <div className="space-y-6">

                    {/* A. Client Summary */}
                    <Card className="p-5">
                        <h3 className="text-xs font-bold text-surface-500 uppercase tracking-widest mb-4">Client</h3>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary-700 font-bold text-lg">
                                {policy.clientName.charAt(0)}
                            </div>
                            <div>
                                <Link href={`/dashboard/clients/${policy.clientId}`} className="text-base font-bold text-surface-900 hover:text-primary-600 transition-colors">
                                    {policy.clientName}
                                </Link>
                                <p className="text-xs text-surface-500">Individual Details</p>
                            </div>
                        </div>
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-surface-600">
                                <Phone size={14} /> 024 555 0192
                            </div>
                            <div className="flex items-center gap-2 text-sm text-surface-600">
                                <Mail size={14} /> kwame.m@email.com
                            </div>
                        </div>
                        <Link href={`/dashboard/clients/${policy.clientId}`}>
                            <Button variant="outline" size="sm" className="w-full">View Profile</Button>
                        </Link>
                    </Card>

                    {/* B. Insurer Info */}
                    <Card className="p-5">
                        <h3 className="text-xs font-bold text-surface-500 uppercase tracking-widest mb-4">Insurer</h3>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-surface-100 flex items-center justify-center text-surface-900 overflow-hidden">
                                {(() => {
                                    // Try to find the carrier in our new module
                                    const carrier = carriers.find(c => c.name === policy.insurerName || c.shortName === policy.insurerName);
                                    if (carrier?.logoUrl) {
                                        return <img src={carrier.logoUrl} alt={carrier.name} className="w-full h-full object-contain p-1" />;
                                    }
                                    return <Building2 size={20} />;
                                })()}
                            </div>
                            <div>
                                <p className="font-semibold text-surface-900">{policy.insurerName}</p>
                                <p className="text-xs text-surface-500">Motor Dept</p>
                            </div>
                        </div>
                        {(() => {
                            const carrier = carriers.find(c => c.name === policy.insurerName || c.shortName === policy.insurerName);
                            if (carrier) {
                                return (
                                    <Link href={`/dashboard/carriers/${carrier.slug}`}>
                                        <Button variant="outline" size="sm" className="w-full text-xs h-8">View Carrier Profile</Button>
                                    </Link>
                                );
                            }
                            return <Button variant="ghost" size="sm" className="w-full text-xs h-8">Contact Support</Button>;
                        })()}
                    </Card>

                    {/* C. Commission Summary */}
                    <Card className="p-5 overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-1 h-full bg-accent-500" />
                        <h3 className="text-xs font-bold text-surface-500 uppercase tracking-widest mb-4 pl-2">Commission</h3>

                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-surface-600">Received</span>
                            <span className="text-sm font-bold text-success-600">{formatCurrency(commissionReceived)}</span>
                        </div>
                        <div className="w-full h-2 bg-surface-100 rounded-full overflow-hidden mb-1">
                            <div
                                className="h-full bg-success-500"
                                style={{ width: `${commissionTotal > 0 ? Math.min(100, (commissionReceived / commissionTotal) * 100) : 0}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-[11px] text-surface-400 mb-4">
                            <span>{commissionTotal > 0 ? Math.round((commissionReceived / commissionTotal) * 100) : 0}% paid</span>
                            <span>of {formatCurrency(commissionTotal)}</span>
                        </div>

                        <div className="p-2 bg-accent-50 rounded-lg border border-accent-100">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-medium text-accent-700">Outstanding</span>
                                <span className="text-sm font-bold text-accent-700">
                                    {formatCurrency(Math.max(0, commissionTotal - commissionReceived))}
                                </span>
                            </div>
                        </div>
                        <Link href="/dashboard/finance/commissions" className="block mt-3">
                            <Button variant="ghost" size="sm" className="w-full text-xs h-8 text-accent-600">View All Commissions</Button>
                        </Link>
                    </Card>

                    {/* C2. Invoices for this Policy */}
                    {policyInvoices.length > 0 && (
                        <Card className="p-5 overflow-hidden">
                            <h3 className="text-xs font-bold text-surface-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <FileText size={13} className="text-primary-500" /> Invoices
                            </h3>
                            <div className="space-y-2">
                                {policyInvoices.map(inv => (
                                    <Link key={inv.id} href="/dashboard/finance/invoices">
                                        <div className="flex items-center justify-between py-2 border-b border-surface-100 last:border-0 hover:bg-surface-50 rounded -mx-1 px-1 transition-colors">
                                            <div>
                                                <p className="text-[11px] font-bold text-primary-600 font-mono">{inv.invoiceNumber}</p>
                                                <p className="text-[10px] text-surface-400 capitalize">{inv.status}</p>
                                            </div>
                                            <p className="text-xs font-bold text-surface-900 tabular-nums">{formatCurrency(inv.amount)}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            <Link href="/dashboard/finance/invoices" className="block mt-2">
                                <Button variant="ghost" size="sm" className="w-full text-xs h-7 text-primary-600">View Finance</Button>
                            </Link>
                        </Card>
                    )}

                    {/* D. Key Dates */}
                    <Card className="p-5">
                        <h3 className="text-xs font-bold text-surface-500 uppercase tracking-widest mb-4">Key Dates</h3>
                        <div className="space-y-4 relative pl-3 border-l border-surface-200 ml-1">
                            <div className="relative">
                                <div className="absolute -left-[17px] top-1.5 w-2 h-2 rounded-full bg-surface-300 ring-2 ring-white" />
                                <p className="text-xs text-surface-500">Start Date</p>
                                <p className="text-sm font-medium text-surface-900">{formatDate(policy.inceptionDate)}</p>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-[17px] top-1.5 w-2 h-2 rounded-full bg-primary-500 ring-2 ring-white" />
                                <p className="text-xs text-surface-500">Expiry Date</p>
                                <p className="text-sm font-medium text-surface-900">{formatDate(policy.expiryDate)}</p>
                            </div>
                        </div>
                    </Card>

                </div>
            </div>
        </div>
    );
}
