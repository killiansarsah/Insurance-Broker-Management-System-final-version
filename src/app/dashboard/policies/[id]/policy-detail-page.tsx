'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
    Car,
    Home,
    Ship,
    Heart,
    Users,
    ClipboardList,
    History,
    Eye,
    Pencil,
    Ban,
    DollarSign,
    CreditCard,
    BarChart3,
    ShieldCheck,
    Stethoscope,
    Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/data-display/status-badge';
import { formatCurrency, cn, formatDate } from '@/lib/utils';
import { BackButton } from '@/components/ui/back-button';
import type { Policy } from '@/types';
import { mockPolicies } from '@/mock/policies';
import { claims as mockClaims } from '@/mock/claims';
import { carriers } from '@/mock/carriers';
import { toast } from 'sonner';

const TABS = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'policy-info', label: 'Policy Info', icon: FileText },
    { id: 'premium', label: 'Premium & Payments', icon: Wallet },
    { id: 'documents', label: 'Documents', icon: FileCheck },
    { id: 'claims', label: 'Claims History', icon: ClipboardList },
    { id: 'endorsements', label: 'Endorsements', icon: ShieldCheck },
    { id: 'timeline', label: 'Timeline', icon: History },
] as const;

type TabId = typeof TABS[number]['id'];

// Ghana tax calculation (updated rates)
function calculateGhanaTaxes(premiumAmount: number) {
    // Working backwards from total: total = base * (1 + 0.15 + 0.025 + 0.025) = base * 1.20
    const base = Math.round(premiumAmount / 1.20);
    const nhil = Math.round(base * 0.025);
    const getFund = Math.round(base * 0.025);
    const vat = Math.round(base * 0.15);
    return { base, vat, nhil, getFund, total: premiumAmount };
}

export default function PolicyDetailClient({ policyId }: { policyId: string }) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabId>('overview');
    const [showEndorsementModal, setShowEndorsementModal] = useState(false);
    const [showRenewalModal, setShowRenewalModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    const policy = useMemo(() => mockPolicies.find(p => p.id === policyId), [policyId]);
    const policyClaims = useMemo(() => mockClaims.filter(c => c.policyId === policyId), [policyId]);
    const carrier = useMemo(() => policy ? carriers.find(c => c.id === policy.insurerId || c.shortName === policy.insurerName) : null, [policy]);

    if (!policy) {
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

    const isExpiringSoon = policy.status === 'active' && (policy.daysToExpiry ?? 999) <= 30;
    const taxes = calculateGhanaTaxes(policy.premiumAmount);

    // ─── Overview Tab ────────────────────────────────────────────────────────
    const renderOverview = () => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left — KPI Cards */}
            <div className="lg:col-span-2 space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card padding="md" className="text-center">
                        <p className="text-2xl font-bold text-surface-900">{formatCurrency(policy.premiumAmount)}</p>
                        <p className="text-xs text-surface-500 mt-1">Premium</p>
                    </Card>
                    <Card padding="md" className="text-center">
                        <p className="text-2xl font-bold text-surface-900">{policy.daysToExpiry ?? '—'}</p>
                        <p className="text-xs text-surface-500 mt-1">Days to Expiry</p>
                    </Card>
                    <Card padding="md" className="text-center">
                        <p className="text-2xl font-bold text-surface-900">{policyClaims.length}</p>
                        <p className="text-xs text-surface-500 mt-1">Claims</p>
                    </Card>
                    <Card padding="md" className="text-center">
                        <p className="text-2xl font-bold text-success-600">{formatCurrency(policy.commissionAmount)}</p>
                        <p className="text-xs text-surface-500 mt-1">Commission</p>
                    </Card>
                </div>

                {/* Policy Summary Card */}
                <Card className="p-6">
                    <h3 className="font-semibold text-surface-900 mb-4 flex items-center gap-2">
                        <Shield size={18} className="text-primary-500" /> Policy Summary
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-surface-500">Insurance Type</p>
                            <p className="font-medium text-surface-900 capitalize">{policy.insuranceType.replace(/_/g, ' ')}</p>
                        </div>
                        <div>
                            <p className="text-xs text-surface-500">Coverage Type</p>
                            <p className="font-medium text-surface-900">{policy.coverageType || '—'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-surface-500">NIC Class</p>
                            <p className="font-medium text-surface-900">{policy.nicClassOfBusiness || '—'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-surface-500">Policy Type</p>
                            <p className="font-medium text-surface-900 capitalize">{policy.policyType}</p>
                        </div>
                        <div>
                            <p className="text-xs text-surface-500">Sum Insured</p>
                            <p className="text-xl font-bold text-surface-900">{formatCurrency(policy.sumInsured)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-surface-500">Insurer</p>
                            <p className="font-medium text-surface-900">{policy.insurerName}</p>
                        </div>
                        <div>
                            <p className="text-xs text-surface-500">Inception</p>
                            <p className="font-medium text-surface-900">{formatDate(policy.inceptionDate)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-surface-500">Expiry</p>
                            <p className="font-medium text-surface-900">{formatDate(policy.expiryDate)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-surface-500">Premium Frequency</p>
                            <p className="font-medium text-surface-900 capitalize">{policy.premiumFrequency.replace(/_/g, ' ')}</p>
                        </div>
                        <div>
                            <p className="text-xs text-surface-500">Payment Status</p>
                            <StatusBadge status={policy.paymentStatus} />
                        </div>
                        {policy.isRenewal && (
                            <div className="col-span-2 p-3 bg-primary-50 rounded-lg border border-primary-100">
                                <p className="text-xs text-primary-600 font-semibold">RENEWAL — Previous Policy: {policy.previousPolicyId}</p>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Exclusions */}
                {policy.exclusions && policy.exclusions.length > 0 && (
                    <Card className="p-6">
                        <h3 className="font-semibold text-surface-900 mb-4 flex items-center gap-2">
                            <AlertTriangle size={18} className="text-warning-500" /> Exclusions
                        </h3>
                        <ul className="space-y-2">
                            {policy.exclusions.map((ex, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-surface-600">
                                    <span className="text-danger-400 mt-0.5">✕</span>
                                    {ex}
                                </li>
                            ))}
                        </ul>
                    </Card>
                )}
            </div>

            {/* Right — Sidebar */}
            <div className="space-y-6">
                {/* Client */}
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
                            <p className="text-xs text-surface-500">ID: {policy.clientId}</p>
                        </div>
                    </div>
                    <Link href={`/dashboard/clients/${policy.clientId}`}>
                        <Button variant="outline" size="sm" className="w-full">View Profile</Button>
                    </Link>
                </Card>

                {/* Insurer */}
                <Card className="p-5">
                    <h3 className="text-xs font-bold text-surface-500 uppercase tracking-widest mb-4">Insurer</h3>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-surface-100 flex items-center justify-center overflow-hidden">
                            {carrier?.logoUrl ? (
                                <img src={carrier.logoUrl} alt={carrier.name} className="w-full h-full object-contain p-1" />
                            ) : (
                                <Building2 size={20} className="text-surface-500" />
                            )}
                        </div>
                        <div>
                            <p className="font-semibold text-surface-900">{policy.insurerName}</p>
                            <p className="text-xs text-surface-500">{policy.nicClassOfBusiness} Dept</p>
                        </div>
                    </div>
                    {carrier && (
                        <Link href={`/dashboard/carriers/${carrier.slug}`}>
                            <Button variant="outline" size="sm" className="w-full text-xs">View Carrier</Button>
                        </Link>
                    )}
                </Card>

                {/* Broker */}
                <Card className="p-5">
                    <h3 className="text-xs font-bold text-surface-500 uppercase tracking-widest mb-4">Broker</h3>
                    <p className="font-semibold text-surface-900">{policy.brokerName}</p>
                    <p className="text-xs text-surface-500 mt-1">ID: {policy.brokerId}</p>
                </Card>

                {/* Commission */}
                <Card className="p-5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-accent-500" />
                    <h3 className="text-xs font-bold text-surface-500 uppercase tracking-widest mb-4 pl-2">Commission</h3>
                    <div className="space-y-2 pl-2">
                        <div className="flex justify-between">
                            <span className="text-sm text-surface-600">Rate</span>
                            <span className="font-semibold text-surface-900">{policy.commissionRate}%</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-surface-600">Amount</span>
                            <span className="font-semibold text-success-600">{formatCurrency(policy.commissionAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-surface-600">Status</span>
                            <StatusBadge status={policy.commissionStatus} />
                        </div>
                    </div>
                </Card>

                {/* Key Dates */}
                <Card className="p-5">
                    <h3 className="text-xs font-bold text-surface-500 uppercase tracking-widest mb-4">Key Dates</h3>
                    <div className="space-y-4 relative pl-3 border-l border-surface-200 ml-1">
                        <div className="relative">
                            <div className="absolute -left-[17px] top-1.5 w-2 h-2 rounded-full bg-success-500 ring-2 ring-white" />
                            <p className="text-xs text-surface-500">Inception</p>
                            <p className="text-sm font-medium text-surface-900">{formatDate(policy.inceptionDate)}</p>
                        </div>
                        <div className="relative">
                            <div className={cn("absolute -left-[17px] top-1.5 w-2 h-2 rounded-full ring-2 ring-white", isExpiringSoon ? 'bg-danger-500' : 'bg-primary-500')} />
                            <p className="text-xs text-surface-500">Expiry</p>
                            <p className="text-sm font-medium text-surface-900">{formatDate(policy.expiryDate)}</p>
                        </div>
                        {policy.nextPremiumDueDate && (
                            <div className="relative">
                                <div className="absolute -left-[17px] top-1.5 w-2 h-2 rounded-full bg-warning-500 ring-2 ring-white" />
                                <p className="text-xs text-surface-500">Next Premium Due</p>
                                <p className="text-sm font-medium text-surface-900">{formatDate(policy.nextPremiumDueDate)}</p>
                            </div>
                        )}
                        {policy.cancellationDate && (
                            <div className="relative">
                                <div className="absolute -left-[17px] top-1.5 w-2 h-2 rounded-full bg-danger-500 ring-2 ring-white" />
                                <p className="text-xs text-surface-500">Cancelled</p>
                                <p className="text-sm font-medium text-danger-600">{formatDate(policy.cancellationDate)}</p>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );

    // ─── Policy Info Tab ─────────────────────────────────────────────────────
    const renderPolicyInfo = () => (
        <div className="space-y-6">
            {/* Core Policy Details */}
            <Card className="p-0 overflow-hidden">
                <div className="bg-surface-50/50 border-b border-surface-100 px-6 py-4">
                    <h3 className="font-semibold text-surface-900 flex items-center gap-2">
                        <FileText size={18} className="text-primary-500" /> Core Policy Details
                    </h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
                    {[
                        ['Policy Number', policy.policyNumber],
                        ['Insurance Type', policy.insuranceType.replace(/_/g, ' ')],
                        ['Coverage Type', policy.coverageType || '—'],
                        ['Policy Type', policy.policyType],
                        ['NIC Class of Business', policy.nicClassOfBusiness || '—'],
                        ['Product', policy.productName || '—'],
                        ['Client', policy.clientName],
                        ['Insurer', policy.insurerName],
                        ['Broker', policy.brokerName],
                        ['Sum Insured', formatCurrency(policy.sumInsured)],
                        ['Premium', formatCurrency(policy.premiumAmount)],
                        ['Premium Frequency', policy.premiumFrequency.replace(/_/g, ' ')],
                        ['Payment Status', policy.paymentStatus],
                        ['Commission Rate', `${policy.commissionRate}%`],
                        ['Commission Amount', formatCurrency(policy.commissionAmount)],
                        ['Commission Status', policy.commissionStatus],
                        ['Inception', formatDate(policy.inceptionDate)],
                        ['Expiry', formatDate(policy.expiryDate)],
                        ['Issue Date', policy.issueDate ? formatDate(policy.issueDate) : '—'],
                        ['Renewal', policy.isRenewal ? `Yes (from ${policy.previousPolicyId})` : 'No'],
                        ['Status', policy.status],
                    ].map(([label, value]) => (
                        <div key={label as string}>
                            <p className="text-xs font-medium text-surface-500 uppercase tracking-wider mb-1">{label}</p>
                            <p className="text-sm font-medium text-surface-900 capitalize">{value}</p>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Motor Vehicle Details */}
            {policy.vehicleDetails && (
                <Card className="p-0 overflow-hidden">
                    <div className="bg-blue-50/50 border-b border-blue-100 px-6 py-4">
                        <h3 className="font-semibold text-surface-900 flex items-center gap-2">
                            <Car size={18} className="text-blue-500" /> Vehicle Details
                        </h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
                        {[
                            ['Registration', policy.vehicleDetails.registrationNumber],
                            ['Chassis No.', policy.vehicleDetails.chassisNumber || '—'],
                            ['Engine No.', policy.vehicleDetails.engineNumber || '—'],
                            ['Make', policy.vehicleDetails.make],
                            ['Model', policy.vehicleDetails.model],
                            ['Year', String(policy.vehicleDetails.year)],
                            ['Body Type', policy.vehicleDetails.bodyType || '—'],
                            ['Color', policy.vehicleDetails.color || '—'],
                            ['Engine Capacity', policy.vehicleDetails.engineCapacity || '—'],
                            ['Seating', policy.vehicleDetails.seatingCapacity ? String(policy.vehicleDetails.seatingCapacity) : '—'],
                            ['Usage', policy.vehicleDetails.usageType],
                            ['Estimated Value', formatCurrency(policy.vehicleDetails.estimatedValue)],
                        ].map(([label, value]) => (
                            <div key={label as string}>
                                <p className="text-xs font-medium text-surface-500 uppercase tracking-wider mb-1">{label}</p>
                                <p className="text-sm font-medium text-surface-900 capitalize">{value}</p>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* Property Details */}
            {policy.propertyDetails && (
                <Card className="p-0 overflow-hidden">
                    <div className="bg-orange-50/50 border-b border-orange-100 px-6 py-4">
                        <h3 className="font-semibold text-surface-900 flex items-center gap-2">
                            <Home size={18} className="text-orange-500" /> Property Details
                        </h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                        {[
                            ['Address', policy.propertyDetails.propertyAddress],
                            ['Property Type', policy.propertyDetails.propertyType],
                            ['Construction', policy.propertyDetails.constructionType || '—'],
                            ['Year Built', policy.propertyDetails.yearBuilt ? String(policy.propertyDetails.yearBuilt) : '—'],
                            ['Occupancy', policy.propertyDetails.occupancy || '—'],
                        ].map(([label, value]) => (
                            <div key={label as string}>
                                <p className="text-xs font-medium text-surface-500 uppercase tracking-wider mb-1">{label}</p>
                                <p className="text-sm font-medium text-surface-900 capitalize">{value}</p>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* Marine Details */}
            {policy.marineDetails && (
                <Card className="p-0 overflow-hidden">
                    <div className="bg-cyan-50/50 border-b border-cyan-100 px-6 py-4">
                        <h3 className="font-semibold text-surface-900 flex items-center gap-2">
                            <Ship size={18} className="text-cyan-500" /> Marine Details
                        </h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                        {[
                            ['Vessel', policy.marineDetails.vesselName || '—'],
                            ['Voyage From', policy.marineDetails.voyageFrom || '—'],
                            ['Voyage To', policy.marineDetails.voyageTo || '—'],
                            ['Cargo', policy.marineDetails.cargoDescription || '—'],
                            ['Cargo Value', policy.marineDetails.cargoValue ? formatCurrency(policy.marineDetails.cargoValue) : '—'],
                        ].map(([label, value]) => (
                            <div key={label as string}>
                                <p className="text-xs font-medium text-surface-500 uppercase tracking-wider mb-1">{label}</p>
                                <p className="text-sm font-medium text-surface-900">{value}</p>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* Life Policy Beneficiaries */}
            {policy.beneficiaries && policy.beneficiaries.length > 0 && (
                <Card className="p-0 overflow-hidden">
                    <div className="bg-violet-50/50 border-b border-violet-100 px-6 py-4">
                        <h3 className="font-semibold text-surface-900 flex items-center gap-2">
                            <Users size={18} className="text-violet-500" /> Beneficiaries
                        </h3>
                    </div>
                    <div className="p-6">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-xs text-surface-500 uppercase border-b border-surface-100">
                                    <th className="text-left pb-3">Name</th>
                                    <th className="text-left pb-3">Relationship</th>
                                    <th className="text-right pb-3">Allocation</th>
                                </tr>
                            </thead>
                            <tbody>
                                {policy.beneficiaries.map((b, i) => (
                                    <tr key={i} className="border-b border-surface-50 last:border-0">
                                        <td className="py-3 font-medium text-surface-900">{b.name}</td>
                                        <td className="py-3 text-surface-600">{b.relationship}</td>
                                        <td className="py-3 text-right font-semibold text-primary-600">{b.percentage}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {/* Riders */}
            {policy.riders && policy.riders.length > 0 && (
                <Card className="p-6">
                    <h3 className="font-semibold text-surface-900 mb-4 flex items-center gap-2">
                        <Stethoscope size={18} className="text-emerald-500" /> Riders / Add-ons
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {policy.riders.map((rider, i) => (
                            <span key={i} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-lg border border-emerald-100">
                                {rider}
                            </span>
                        ))}
                    </div>
                </Card>
            )}

            {/* Cancellation Details */}
            {policy.status === 'cancelled' && (
                <Card className="p-6 border-danger-200 bg-danger-50/30">
                    <h3 className="font-semibold text-danger-700 mb-4 flex items-center gap-2">
                        <Ban size={18} /> Cancellation Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-xs text-danger-500">Cancelled On</p>
                            <p className="font-medium text-danger-700">{policy.cancellationDate ? formatDate(policy.cancellationDate) : '—'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-danger-500">Reason</p>
                            <p className="font-medium text-danger-700 capitalize">{policy.cancellationReason?.replace(/_/g, ' ') || '—'}</p>
                        </div>
                        <div className="md:col-span-1">
                            <p className="text-xs text-danger-500">Notes</p>
                            <p className="font-medium text-danger-700">{policy.cancellationNotes || '—'}</p>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );

    // ─── Premium & Payments Tab ──────────────────────────────────────────────
    const renderPremium = () => (
        <div className="space-y-6">
            {/* Ghana Tax Breakdown */}
            <Card className="p-0 overflow-hidden">
                <div className="bg-surface-50/50 border-b border-surface-100 px-6 py-4">
                    <h3 className="font-semibold text-surface-900 flex items-center gap-2">
                        <DollarSign size={18} className="text-success-500" /> Ghana Premium Breakdown
                    </h3>
                </div>
                <div className="p-6">
                    <div className="space-y-3" style={{ maxWidth: '28rem' }}>
                        <div className="flex justify-between items-center text-surface-700">
                            <span>Base Premium</span>
                            <span className="font-semibold tabular-nums">{formatCurrency(taxes.base)}</span>
                        </div>
                        <div className="flex justify-between items-center text-surface-500 text-sm">
                            <span>VAT (15%)</span>
                            <span className="tabular-nums">{formatCurrency(taxes.vat)}</span>
                        </div>
                        <div className="flex justify-between items-center text-surface-500 text-sm">
                            <span>NHIL (2.5%)</span>
                            <span className="tabular-nums">{formatCurrency(taxes.nhil)}</span>
                        </div>
                        <div className="flex justify-between items-center text-surface-500 text-sm">
                            <span>GETFund (2.5%)</span>
                            <span className="tabular-nums">{formatCurrency(taxes.getFund)}</span>
                        </div>
                        <div className="pt-3 border-t border-surface-200 flex justify-between items-center">
                            <span className="font-bold text-surface-900">Total Premium</span>
                            <span className="text-xl font-bold text-primary-600 tabular-nums">{formatCurrency(taxes.total)}</span>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Payment Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card padding="md" className="text-center">
                    <p className="text-xs text-surface-500 mb-1">Payment Status</p>
                    <StatusBadge status={policy.paymentStatus} />
                </Card>
                <Card padding="md" className="text-center">
                    <p className="text-xs text-surface-500 mb-1">Frequency</p>
                    <p className="font-semibold text-surface-900 capitalize">{policy.premiumFrequency.replace(/_/g, ' ')}</p>
                </Card>
                <Card padding="md" className="text-center">
                    <p className="text-xs text-surface-500 mb-1">Outstanding</p>
                    <p className={cn('font-bold text-lg', (policy.outstandingBalance ?? 0) > 0 ? 'text-danger-600' : 'text-success-600')}>
                        {formatCurrency(policy.outstandingBalance ?? 0)}
                    </p>
                </Card>
            </div>

            {/* Next Premium Due */}
            {policy.nextPremiumDueDate && (
                <Card className="p-4 bg-warning-50/50 border-warning-200">
                    <div className="flex items-center gap-3">
                        <Calendar size={20} className="text-warning-500" />
                        <div>
                            <p className="text-sm font-semibold text-warning-700">Next Premium Due</p>
                            <p className="text-lg font-bold text-warning-800">{formatDate(policy.nextPremiumDueDate)}</p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Installment Schedule */}
            {policy.installments && policy.installments.length > 0 && (
                <Card className="p-0 overflow-hidden">
                    <div className="bg-surface-50/50 border-b border-surface-100 px-6 py-4">
                        <h3 className="font-semibold text-surface-900 flex items-center gap-2">
                            <CreditCard size={18} className="text-primary-500" /> Payment Schedule
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-xs text-surface-500 uppercase border-b border-surface-100 bg-surface-50/50">
                                    <th className="text-left px-6 py-3">#</th>
                                    <th className="text-left px-6 py-3">Due Date</th>
                                    <th className="text-right px-6 py-3">Amount</th>
                                    <th className="text-center px-6 py-3">Status</th>
                                    <th className="text-left px-6 py-3">Paid Date</th>
                                    <th className="text-left px-6 py-3">Reference</th>
                                </tr>
                            </thead>
                            <tbody>
                                {policy.installments.map((inst, i) => (
                                    <tr key={inst.id} className="border-b border-surface-50 last:border-0 hover:bg-surface-50/50">
                                        <td className="px-6 py-3 font-medium text-surface-600">{i + 1}</td>
                                        <td className="px-6 py-3 text-surface-900">{formatDate(inst.dueDate)}</td>
                                        <td className="px-6 py-3 text-right font-semibold text-surface-900 tabular-nums">
                                            {formatCurrency(inst.amount)}
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            <StatusBadge status={inst.status} />
                                        </td>
                                        <td className="px-6 py-3 text-surface-600">
                                            {inst.paidDate ? formatDate(inst.paidDate) : '—'}
                                        </td>
                                        <td className="px-6 py-3 text-surface-500 font-mono text-xs">
                                            {inst.reference || '—'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}
        </div>
    );

    // ─── Documents Tab ───────────────────────────────────────────────────────
    const renderDocuments = () => (
        <Card className="p-0 overflow-hidden">
            <div className="bg-surface-50/50 border-b border-surface-100 px-6 py-4 flex justify-between items-center">
                <h3 className="font-semibold text-surface-900 flex items-center gap-2">
                    <FileCheck size={18} className="text-accent-500" /> Policy Documents
                </h3>
                <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<UploadCloud size={14} />}
                    onClick={() => toast.info('Document upload modal would open here')}
                >
                    Upload
                </Button>
            </div>
            {policy.documents && policy.documents.length > 0 ? (
                <div className="p-2">
                    {policy.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 hover:bg-surface-50 rounded-lg group transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-surface-100 flex items-center justify-center text-surface-500 group-hover:bg-white group-hover:shadow-sm transition-all">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-surface-900 group-hover:text-primary-600 transition-colors">{doc.name}</p>
                                    <p className="text-xs text-surface-500">
                                        <span className="capitalize">{doc.type.replace(/_/g, ' ')}</span> · {formatDate(doc.uploadedAt.split('T')[0])}
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity px-2"
                                onClick={() => toast.info(`Download ${doc.name}`)}
                            >
                                <Download size={16} />
                            </Button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-12 text-center text-surface-400">
                    <FileText size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No documents uploaded yet</p>
                </div>
            )}
        </Card>
    );

    // ─── Claims History Tab ──────────────────────────────────────────────────
    const renderClaims = () => (
        <Card className="p-0 overflow-hidden">
            <div className="bg-surface-50/50 border-b border-surface-100 px-6 py-4">
                <h3 className="font-semibold text-surface-900 flex items-center gap-2">
                    <ClipboardList size={18} className="text-primary-500" /> Claims for this Policy
                </h3>
            </div>
            {policyClaims.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-xs text-surface-500 uppercase border-b border-surface-100 bg-surface-50/50">
                                <th className="text-left px-6 py-3">Claim #</th>
                                <th className="text-left px-6 py-3">Incident Date</th>
                                <th className="text-left px-6 py-3">Description</th>
                                <th className="text-right px-6 py-3">Claim Amt</th>
                                <th className="text-right px-6 py-3">Settled Amt</th>
                                <th className="text-center px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {policyClaims.map((claim) => (
                                <tr
                                    key={claim.id}
                                    className="border-b border-surface-50 last:border-0 hover:bg-surface-50 cursor-pointer"
                                    onClick={() => router.push(`/dashboard/claims/${claim.id}`)}
                                >
                                    <td className="px-6 py-3 font-mono text-xs text-primary-600">{claim.claimNumber}</td>
                                    <td className="px-6 py-3 text-surface-700">{formatDate(claim.incidentDate)}</td>
                                    <td className="px-6 py-3 text-surface-600 truncate" style={{ maxWidth: '16rem' }}>
                                        {claim.incidentDescription}
                                    </td>
                                    <td className="px-6 py-3 text-right font-semibold text-surface-900 tabular-nums">
                                        {formatCurrency(claim.claimAmount)}
                                    </td>
                                    <td className="px-6 py-3 text-right text-surface-600 tabular-nums">
                                        {claim.settledAmount ? formatCurrency(claim.settledAmount) : '—'}
                                    </td>
                                    <td className="px-6 py-3 text-center">
                                        <StatusBadge status={claim.status} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="p-12 text-center text-surface-400">
                    <CheckCircle2 size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No claims filed for this policy</p>
                </div>
            )}
        </Card>
    );

    // ─── Endorsements Tab ────────────────────────────────────────────────────
    const renderEndorsements = () => (
        <Card className="p-0 overflow-hidden">
            <div className="bg-surface-50/50 border-b border-surface-100 px-6 py-4 flex justify-between items-center">
                <h3 className="font-semibold text-surface-900 flex items-center gap-2">
                    <ShieldCheck size={18} className="text-primary-500" /> Endorsements
                </h3>
                <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<Plus size={14} />}
                    onClick={() => setShowEndorsementModal(true)}
                    disabled={policy.status !== 'active'}
                >
                    Add Endorsement
                </Button>
            </div>
            {policy.endorsements && policy.endorsements.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-xs text-surface-500 uppercase border-b border-surface-100 bg-surface-50/50">
                                <th className="text-left px-6 py-3">Endorsement #</th>
                                <th className="text-left px-6 py-3">Type</th>
                                <th className="text-left px-6 py-3">Effective Date</th>
                                <th className="text-left px-6 py-3">Description</th>
                                <th className="text-right px-6 py-3">Premium Adj.</th>
                                <th className="text-center px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {policy.endorsements.map((end) => (
                                <tr key={end.id} className="border-b border-surface-50 last:border-0 hover:bg-surface-50">
                                    <td className="px-6 py-3 font-mono text-xs text-surface-700">{end.endorsementNumber}</td>
                                    <td className="px-6 py-3 capitalize text-surface-700">{end.type}</td>
                                    <td className="px-6 py-3 text-surface-600">{formatDate(end.effectiveDate)}</td>
                                    <td className="px-6 py-3 text-surface-600">{end.description}</td>
                                    <td className={cn('px-6 py-3 text-right font-semibold tabular-nums', end.premiumAdjustment >= 0 ? 'text-success-600' : 'text-danger-600')}>
                                        {end.premiumAdjustment >= 0 ? '+' : ''}{formatCurrency(end.premiumAdjustment)}
                                    </td>
                                    <td className="px-6 py-3 text-center">
                                        <StatusBadge status={end.status} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="p-12 text-center text-surface-400">
                    <ShieldCheck size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No endorsements for this policy</p>
                </div>
            )}
        </Card>
    );

    // ─── Timeline Tab ────────────────────────────────────────────────────────
    const renderTimeline = () => (
        <Card className="p-6">
            <h3 className="font-semibold text-surface-900 mb-6 flex items-center gap-2">
                <History size={18} className="text-surface-400" /> Policy Lifecycle
            </h3>
            {policy.timeline && policy.timeline.length > 0 ? (
                <div className="relative pl-4 space-y-8 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-200">
                    {policy.timeline.map((event) => (
                        <div key={event.id} className="relative flex items-start gap-4">
                            <div className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm shrink-0 bg-primary-50 text-primary-500">
                                <Activity size={16} />
                            </div>
                            <div className="pt-1">
                                <p className="text-sm font-semibold text-surface-900">{event.event}</p>
                                <p className="text-xs text-surface-500 mt-0.5">{event.description}</p>
                                <p className="text-xs text-surface-400 mt-1">
                                    {formatDate(event.date)}
                                    {event.performedBy && <span className="ml-2">· by {event.performedBy}</span>}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-surface-400 py-8">
                    <History size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No timeline events recorded</p>
                </div>
            )}
        </Card>
    );

    // ─── Endorsement Modal ───────────────────────────────────────────────────
    const renderEndorsementModal = () => {
        if (!showEndorsementModal) return null;
        return (
            <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
                <div className="bg-background rounded-2xl shadow-xl w-full p-6 animate-slide-up" style={{ maxWidth: '32rem' }}>
                    <h2 className="text-lg font-bold text-surface-900 mb-4">Add Endorsement</h2>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        toast.success('Endorsement submitted for approval');
                        setShowEndorsementModal(false);
                    }} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-surface-700 block mb-1">Endorsement Type</label>
                            <select className="w-full border border-surface-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30">
                                <option value="addition">Addition</option>
                                <option value="deletion">Deletion</option>
                                <option value="alteration">Alteration</option>
                                <option value="extension">Extension</option>
                                <option value="cancellation">Cancellation</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-surface-700 block mb-1">Effective Date</label>
                            <input type="date" className="w-full border border-surface-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30" required />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-surface-700 block mb-1">Description</label>
                            <textarea rows={3} className="w-full border border-surface-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30" required placeholder="Describe the endorsement..." />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-surface-700 block mb-1">Premium Adjustment (GHS)</label>
                            <input type="number" step="0.01" className="w-full border border-surface-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30" placeholder="0.00" />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button type="button" variant="outline" className="flex-1" onClick={() => setShowEndorsementModal(false)}>Cancel</Button>
                            <Button type="submit" variant="primary" className="flex-1">Submit Endorsement</Button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    // ─── Renewal Modal ───────────────────────────────────────────────────────
    const renderRenewalModal = () => {
        if (!showRenewalModal) return null;
        const newInception = policy.expiryDate;
        const newExpiry = (() => {
            const d = new Date(policy.expiryDate);
            d.setFullYear(d.getFullYear() + 1);
            return d.toISOString().split('T')[0];
        })();
        return (
            <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
                <div className="bg-background rounded-2xl shadow-xl w-full p-6 animate-slide-up" style={{ maxWidth: '32rem' }}>
                    <h2 className="text-lg font-bold text-surface-900 mb-4">Renew Policy</h2>
                    <div className="space-y-4">
                        <div className="p-4 bg-surface-50 rounded-lg space-y-2">
                            <p className="text-xs text-surface-500">Current Policy</p>
                            <p className="font-mono text-sm font-semibold">{policy.policyNumber}</p>
                            <p className="text-xs text-surface-500">{formatDate(policy.inceptionDate)} → {formatDate(policy.expiryDate)}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-surface-700 block mb-1">New Inception</label>
                                <input type="date" defaultValue={newInception} className="w-full border border-surface-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-surface-700 block mb-1">New Expiry</label>
                                <input type="date" defaultValue={newExpiry} className="w-full border border-surface-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30" />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-surface-700 block mb-1">New Premium (GHS)</label>
                            <input type="number" defaultValue={policy.premiumAmount} step="0.01" className="w-full border border-surface-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30" />
                        </div>
                        <div className="p-3 bg-primary-50 rounded-lg border border-primary-100">
                            <p className="text-xs text-primary-600">Tax breakdown will be auto-calculated: VAT 15%, NHIL 2.5%, GETFund 2.5%</p>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button type="button" variant="outline" className="flex-1" onClick={() => setShowRenewalModal(false)}>Cancel</Button>
                            <Button
                                variant="primary"
                                className="flex-1"
                                onClick={() => {
                                    toast.success(`Policy ${policy.policyNumber} renewed successfully`);
                                    setShowRenewalModal(false);
                                }}
                            >
                                Confirm Renewal
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // ─── Cancel Modal ────────────────────────────────────────────────────────
    const renderCancelModal = () => {
        if (!showCancelModal) return null;
        return (
            <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
                <div className="bg-background rounded-2xl shadow-xl w-full p-6 animate-slide-up" style={{ maxWidth: '32rem' }}>
                    <h2 className="text-lg font-bold text-danger-600 mb-4 flex items-center gap-2">
                        <Ban size={20} /> Cancel Policy
                    </h2>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        toast.success(`Policy ${policy.policyNumber} cancellation submitted`);
                        setShowCancelModal(false);
                    }} className="space-y-4">
                        <div className="p-4 bg-danger-50/50 rounded-lg border border-danger-100">
                            <p className="text-sm text-danger-700">
                                You are about to cancel policy <strong>{policy.policyNumber}</strong> for <strong>{policy.clientName}</strong>.
                                This action will notify the insurer and update the policy status.
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-surface-700 block mb-1">Cancellation Reason</label>
                            <select className="w-full border border-surface-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30" required>
                                <option value="">Select reason...</option>
                                <option value="non_payment">Non-payment of premium</option>
                                <option value="client_request">Client request</option>
                                <option value="insurer_request">Insurer request</option>
                                <option value="fraud">Fraud / Misrepresentation</option>
                                <option value="replaced">Replaced by another policy</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-surface-700 block mb-1">Effective Date</label>
                            <input type="date" className="w-full border border-surface-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30" required />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-surface-700 block mb-1">Notes</label>
                            <textarea rows={3} className="w-full border border-surface-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30" placeholder="Additional notes..." />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-surface-700 block mb-1">Estimated Refund (GHS)</label>
                            <input type="number" step="0.01" className="w-full border border-surface-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30" placeholder="0.00" />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button type="button" variant="outline" className="flex-1" onClick={() => setShowCancelModal(false)}>Go Back</Button>
                            <Button type="submit" variant="danger" className="flex-1">Confirm Cancellation</Button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    // ─── Tab Content Map ─────────────────────────────────────────────────────
    const tabContent: Record<TabId, () => React.ReactNode> = {
        'overview': renderOverview,
        'policy-info': renderPolicyInfo,
        'premium': renderPremium,
        'documents': renderDocuments,
        'claims': renderClaims,
        'endorsements': renderEndorsements,
        'timeline': renderTimeline,
    };

    return (
        <div className="w-full space-y-6 pb-20 animate-fade-in" style={{ maxWidth: '80rem', margin: '0 auto' }}>
            {/* Back Button */}
            <BackButton href="/dashboard/policies" className="mb-4" />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-surface-900">{policy.policyNumber}</h1>
                        <StatusBadge status={policy.status} />
                        {policy.isRenewal && (
                            <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded-full">RENEWAL</span>
                        )}
                    </div>
                    <p className="text-surface-500 flex items-center gap-2">
                        <Shield size={16} className="text-surface-400" />
                        {policy.nicClassOfBusiness || policy.insuranceType.replace(/_/g, ' ')} · {policy.coverageType || 'General'}
                    </p>
                </div>

                {/* Expiry Countdown */}
                {policy.status === 'active' && (
                    <div className={cn(
                        'px-4 py-3 rounded-xl border flex items-center gap-3',
                        isExpiringSoon
                            ? 'bg-danger-50 border-danger-100 text-danger-700'
                            : 'bg-surface-50 border-surface-200 text-surface-600'
                    )}>
                        <Clock size={20} className={isExpiringSoon ? 'text-danger-500' : 'text-surface-400'} />
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Expires In</p>
                            <p className="text-lg font-bold tabular-nums leading-none">{policy.daysToExpiry ?? 0} days</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Action Bar */}
            <div className="sticky top-[64px] z-30 bg-background/80 backdrop-blur-md border border-surface-200 shadow-sm rounded-xl p-2 flex flex-wrap items-center gap-2 overflow-x-auto">
                <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<Repeat size={16} />}
                    onClick={() => setShowRenewalModal(true)}
                    disabled={policy.status !== 'active' && policy.status !== 'expired'}
                >
                    Renew
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<ShieldCheck size={16} />}
                    onClick={() => setShowEndorsementModal(true)}
                    disabled={policy.status !== 'active'}
                >
                    Endorsement
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<ClipboardList size={16} />}
                    onClick={() => toast.info('Navigate to Claims → New Claim to file a claim for this policy')}
                >
                    Claim
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Ban size={16} />}
                    onClick={() => setShowCancelModal(true)}
                    disabled={policy.status !== 'active' && policy.status !== 'pending'}
                    className={policy.status === 'active' || policy.status === 'pending' ? 'hover:border-danger-300 hover:text-danger-600' : ''}
                >
                    Cancel
                </Button>
                <div className="w-px h-6 bg-surface-200 mx-1" />
                <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Download size={16} />}
                    onClick={() => toast.info('Policy schedule download (mock)')}
                >
                    Schedule
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Mail size={16} />}
                    onClick={() => toast.info('Renewal reminder email sent (mock)')}
                >
                    Reminder
                </Button>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-surface-200 overflow-x-auto">
                <nav className="flex gap-1 -mb-px">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    'flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer',
                                    isActive
                                        ? 'border-primary-500 text-primary-600'
                                        : 'border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300'
                                )}
                            >
                                <Icon size={16} />
                                {tab.label}
                                {tab.id === 'endorsements' && policy.endorsements && policy.endorsements.length > 0 && (
                                    <span className="ml-1 text-[10px] bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded-full font-bold">
                                        {policy.endorsements.length}
                                    </span>
                                )}
                                {tab.id === 'claims' && policyClaims.length > 0 && (
                                    <span className="ml-1 text-[10px] bg-warning-100 text-warning-700 px-1.5 py-0.5 rounded-full font-bold">
                                        {policyClaims.length}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="animate-fade-in">
                {tabContent[activeTab]()}
            </div>

            {/* Modals */}
            {renderEndorsementModal()}
            {renderRenewalModal()}
            {renderCancelModal()}
        </div>
    );
}
