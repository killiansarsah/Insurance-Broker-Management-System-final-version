'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck,
    AlertTriangle,
    FileText,
    Users,
    Activity,
    Building2,
    Calendar,
    DollarSign,
    Clock,
    CheckCircle2,
    MessageSquare,
    Bell,
    Check,
    MapPin,
    Phone,
    Mail,
    Globe,
    CreditCard,
    Heart,
    Edit,
    Shield,
    Download,
    Upload,
    Eye,
    Hash,
    Landmark,
    User,
    ChevronDown,
} from 'lucide-react';
import { getClientById, getClientDisplayName } from '@/mock/clients';
import { getPoliciesByClientId } from '@/mock/policies';
import { invoices, receipts } from '@/mock/finance';
import { commissions } from '@/mock/commissions';
import { claims } from '@/mock/claims';
import { MOCK_DOCUMENTS } from '@/mock/documents-complaints';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { BackButton } from '@/components/ui/back-button';
import { StatusBadge } from '@/components/data-display/status-badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Link from 'next/link';

type TabId = 'overview' | 'personal' | 'policies' | 'claims' | 'documents' | 'communication' | 'beneficiaries';

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Activity size={15} /> },
    { id: 'personal', label: 'Personal Info', icon: <User size={15} /> },
    { id: 'policies', label: 'Policies', icon: <FileText size={15} /> },
    { id: 'claims', label: 'Claims', icon: <Shield size={15} /> },
    { id: 'documents', label: 'Documents', icon: <Download size={15} /> },
    { id: 'communication', label: 'Communication', icon: <MessageSquare size={15} /> },
    { id: 'beneficiaries', label: 'Beneficiaries', icon: <Heart size={15} /> },
];

export default function ClientProfilePage() {
    const params = useParams();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabId>('overview');
    const [showStatusMenu, setShowStatusMenu] = useState(false);
    const [showKycMenu, setShowKycMenu] = useState(false);
    const [clientStatusLocal, setClientStatusLocal] = useState('');
    const [kycStatusLocal, setKycStatusLocal] = useState('');
    const statusMenuRef = useRef<HTMLDivElement>(null);
    const kycMenuRef = useRef<HTMLDivElement>(null);
    const client = getClientById(params.id as string);

    // Close dropdowns on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (statusMenuRef.current && !statusMenuRef.current.contains(e.target as Node)) setShowStatusMenu(false);
            if (kycMenuRef.current && !kycMenuRef.current.contains(e.target as Node)) setShowKycMenu(false);
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    // Initialize local state once client loads
    useEffect(() => {
        if (client) {
            setClientStatusLocal(client.status);
            setKycStatusLocal(client.kycStatus);
        }
    }, [client]);

    if (!client) {
        return (
            <div className="flex flex-col items-center justify-center py-24 animate-fade-in text-center px-6">
                <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mb-6 text-surface-400">
                    <Users size={32} />
                </div>
                <h2 className="text-xl font-bold text-surface-900 mb-2">Client Not Found</h2>
                <p className="text-surface-500 text-sm max-w-[280px] mb-8">The client record you are looking for does not exist or has been removed.</p>
                <Button variant="primary" onClick={() => router.push('/dashboard/clients')}>
                    Back to Clients
                </Button>
            </div>
        );
    }

    const clientPolicies = getPoliciesByClientId(client.id);
    const clientInvoices = invoices.filter(inv => inv.clientId === client.id);
    const clientReceipts = receipts.filter(rec => rec.clientId === client.id);
    const clientCommissions = commissions.filter(c => c.clientId === client.id);
    const clientClaims = claims.filter(c => c.clientId === client.id);
    const clientDocuments = MOCK_DOCUMENTS.filter(d => d.clientId === client.id);

    // Computed financials
    const totalPremiumYTD = clientInvoices.reduce((s, inv) => s + inv.amount, 0);
    const outstandingPremium = clientInvoices
        .filter(inv => inv.status === 'outstanding' || inv.status === 'overdue' || inv.status === 'partial')
        .reduce((s, inv) => s + (inv.amount - inv.amountPaid), 0);
    const commissionEarned = clientCommissions
        .filter(c => c.status === 'earned' || c.status === 'paid')
        .reduce((s, c) => s + c.commissionAmount, 0);
    const commissionPending = clientCommissions
        .filter(c => c.status === 'pending')
        .reduce((s, c) => s + c.commissionAmount, 0);
    const hasOverdue = clientInvoices.some(inv => inv.status === 'overdue');
    const expiringSoonPolicies = clientPolicies.filter(p => (p.daysToExpiry || 999) < 30);
    const activePoliciesCount = clientPolicies.filter(p => p.status === 'active').length;
    const claimsPending = clientClaims.filter(c => c.status !== 'closed' && c.status !== 'settled' && c.status !== 'rejected').length;
    const totalClaimsAmount = clientClaims.reduce((s, c) => s + c.claimAmount, 0);

    const name = getClientDisplayName(client);
    const partnerSince = new Date(client.createdAt).getFullYear();

    const statusColors: Record<string, string> = {
        active: 'bg-emerald-50 text-emerald-600 border-emerald-200/50',
        inactive: 'bg-surface-50 text-surface-500 border-surface-200/50',
        suspended: 'bg-amber-50 text-amber-600 border-amber-200/50',
        blacklisted: 'bg-danger-50 text-danger-600 border-danger-200/50',
    };

    return (
        <div className="space-y-6 pb-20 p-4 lg:p-6 animate-fade-in" style={{ maxWidth: '1400px', margin: '0 auto' }}>
            {/* Executive Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                    "flex flex-col lg:flex-row lg:items-center gap-6 bg-white/60 backdrop-blur-xl p-6 lg:p-8 rounded-2xl border border-surface-200/50 shadow-xl relative",
                    (showStatusMenu || showKycMenu) && "z-[100]"
                )}
            >
                <BackButton href="/dashboard/clients" />

                <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className={cn(
                            'w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg shrink-0',
                            client.type === 'corporate'
                                ? 'bg-gradient-to-br from-primary-500 to-primary-600'
                                : 'bg-gradient-to-br from-accent-400 to-accent-500'
                        )}>
                            {client.type === 'corporate' ? <Building2 size={28} /> : name.charAt(0)}
                        </div>
                        <div>
                            <div className="flex items-center flex-wrap gap-3 mb-1.5">
                                <h1 className="text-2xl font-bold text-surface-900 leading-tight">{name}</h1>
                                <div className={cn(
                                    'flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-semibold capitalize',
                                    statusColors[clientStatusLocal || client.status] || statusColors.active
                                )}>
                                    <div className={cn(
                                        'w-1.5 h-1.5 rounded-full',
                                        (clientStatusLocal || client.status) === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-current'
                                    )} />
                                    {clientStatusLocal || client.status}
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-surface-500">
                                <span className="flex items-center gap-1.5"><Hash size={12} className="text-primary-500" /> {client.clientNumber}</span>
                                <span className="flex items-center gap-1.5">
                                    {client.type === 'corporate' ? <Building2 size={12} className="text-primary-500" /> : <User size={12} className="text-primary-500" />}
                                    {client.type === 'corporate' ? 'Corporate' : 'Individual'}
                                </span>
                                {client.region && <span className="flex items-center gap-1.5"><MapPin size={12} className="text-primary-500" /> {client.region}</span>}
                                <span className="flex items-center gap-1.5"><Calendar size={12} className="text-primary-500" /> Partner Since {partnerSince}</span>
                                {client.assignedBrokerName && <span className="flex items-center gap-1.5"><Users size={12} className="text-primary-500" /> {client.assignedBrokerName}</span>}
                            </div>
                            {/* Contact quick-info */}
                            <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-surface-500 mt-1">
                                <span className="flex items-center gap-1.5"><Phone size={12} /> {client.phone}</span>
                                {client.email && <span className="flex items-center gap-1.5"><Mail size={12} /> {client.email}</span>}
                                {client.digitalAddress && <span className="flex items-center gap-1.5"><Globe size={12} /> {client.digitalAddress}</span>}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 shrink-0">
                        {/* Interactive KYC & Risk + Status Management */}
                        <div className="flex gap-2">
                            {/* KYC Status Dropdown */}
                            <div ref={kycMenuRef} className="relative">
                                <button
                                    onClick={() => { setShowKycMenu(!showKycMenu); setShowStatusMenu(false); }}
                                    className="flex items-center gap-1 cursor-pointer"
                                >
                                    <StatusPill label="KYC" value={kycStatusLocal || client.kycStatus} status={(kycStatusLocal || client.kycStatus) === 'verified' ? 'success' : (kycStatusLocal || client.kycStatus) === 'pending' ? 'warning' : 'danger'} />
                                    <ChevronDown size={12} className="text-surface-400" />
                                </button>
                                {showKycMenu && (
                                    <div className="absolute right-0 top-full mt-1 w-48 bg-background border border-surface-200 rounded-xl shadow-xl z-50 py-1 animate-fade-in">
                                        <p className="px-3 py-1.5 text-[10px] font-bold text-surface-400 uppercase tracking-wider">Change KYC Status</p>
                                        {(['pending', 'verified', 'rejected', 'expired'] as const).map(s => (
                                            <button
                                                key={s}
                                                onClick={() => {
                                                    setKycStatusLocal(s);
                                                    setShowKycMenu(false);
                                                    toast.success(`KYC status updated to "${s}" (mock)`, { description: `Client: ${name}` });
                                                }}
                                                className={cn(
                                                    'w-full px-3 py-2 text-left text-sm hover:bg-surface-50 flex items-center gap-2 capitalize transition-colors',
                                                    (kycStatusLocal || client.kycStatus) === s && 'bg-primary-50 text-primary-700 font-semibold'
                                                )}
                                            >
                                                <div className={cn(
                                                    'w-2 h-2 rounded-full',
                                                    s === 'verified' ? 'bg-emerald-500' : s === 'pending' ? 'bg-amber-500' : s === 'expired' ? 'bg-surface-400' : 'bg-danger-500'
                                                )} />
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <StatusPill label="Risk" value={client.amlRiskLevel} status={client.amlRiskLevel === 'low' ? 'success' : client.amlRiskLevel === 'medium' ? 'warning' : 'danger'} />
                        </div>

                        {/* Client Status Dropdown */}
                        <div ref={statusMenuRef} className="relative">
                            <button
                                onClick={() => { setShowStatusMenu(!showStatusMenu); setShowKycMenu(false); }}
                                className={cn(
                                    'w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl border text-xs font-semibold capitalize transition-all cursor-pointer hover:shadow-sm',
                                    statusColors[clientStatusLocal || client.status] || statusColors.active
                                )}
                            >
                                <div className="flex items-center gap-1.5">
                                    <div className={cn(
                                        'w-1.5 h-1.5 rounded-full',
                                        (clientStatusLocal || client.status) === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-current'
                                    )} />
                                    {clientStatusLocal || client.status}
                                </div>
                                <ChevronDown size={12} />
                            </button>
                            {showStatusMenu && (
                                <div className="absolute right-0 top-full mt-1 w-52 bg-background border border-surface-200 rounded-xl shadow-xl z-50 py-1 animate-fade-in">
                                    <p className="px-3 py-1.5 text-[10px] font-bold text-surface-400 uppercase tracking-wider">Change Client Status</p>
                                    {([
                                        { value: 'active', label: 'Active', desc: 'Client is operational', color: 'bg-emerald-500' },
                                        { value: 'inactive', label: 'Inactive', desc: 'Temporarily deactivated', color: 'bg-surface-400' },
                                        { value: 'suspended', label: 'Suspended', desc: 'Under review or frozen', color: 'bg-amber-500' },
                                        { value: 'blacklisted', label: 'Blacklisted', desc: 'Permanently blocked', color: 'bg-danger-500' },
                                    ]).map(s => (
                                        <button
                                            key={s.value}
                                            onClick={() => {
                                                setClientStatusLocal(s.value);
                                                setShowStatusMenu(false);
                                                toast.success(`Client status updated to "${s.label}" (mock)`, { description: `Client: ${name}` });
                                            }}
                                            className={cn(
                                                'w-full px-3 py-2.5 text-left hover:bg-surface-50 flex items-start gap-2.5 transition-colors',
                                                (clientStatusLocal || client.status) === s.value && 'bg-primary-50'
                                            )}
                                        >
                                            <div className={cn('w-2 h-2 rounded-full mt-1.5 shrink-0', s.color)} />
                                            <div>
                                                <p className={cn('text-sm font-semibold', (clientStatusLocal || client.status) === s.value ? 'text-primary-700' : 'text-surface-800')}>{s.label}</p>
                                                <p className="text-[10px] text-surface-400">{s.desc}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <Link href={`/dashboard/clients/${client.id}/edit`}>
                                <Button variant="outline" size="sm" leftIcon={<Edit size={14} />}>Edit</Button>
                            </Link>
                            <Link href="/dashboard/chat">
                                <Button variant="outline" size="sm" leftIcon={<MessageSquare size={14} />}>Message</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Tab Navigation */}
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-surface-200/50 shadow-sm overflow-hidden">
                <div className="flex overflow-x-auto scrollbar-hide border-b border-surface-200/50">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                'flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all shrink-0',
                                activeTab === tab.id
                                    ? 'border-primary-500 text-primary-600 bg-primary-50/30'
                                    : 'border-transparent text-surface-500 hover:text-surface-700 hover:bg-surface-50/50'
                            )}
                        >
                            {tab.icon}
                            {tab.label}
                            {tab.id === 'claims' && claimsPending > 0 && (
                                <span className="ml-1 w-5 h-5 rounded-full bg-danger-500 text-white text-[10px] font-bold flex items-center justify-center">{claimsPending}</span>
                            )}
                            {tab.id === 'policies' && (
                                <span className="ml-1 text-[11px] text-surface-400">({clientPolicies.length})</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'overview' && (
                        <OverviewTab
                            client={client}
                            totalPremiumYTD={totalPremiumYTD}
                            outstandingPremium={outstandingPremium}
                            commissionEarned={commissionEarned}
                            commissionPending={commissionPending}
                            hasOverdue={hasOverdue}
                            expiringSoonPolicies={expiringSoonPolicies}
                            clientPolicies={clientPolicies}
                            clientInvoices={clientInvoices}
                            clientReceipts={clientReceipts}
                            clientClaims={clientClaims}
                            activePoliciesCount={activePoliciesCount}
                            claimsPending={claimsPending}
                            totalClaimsAmount={totalClaimsAmount}
                        />
                    )}
                    {activeTab === 'personal' && <PersonalInfoTab client={client} />}
                    {activeTab === 'policies' && <PoliciesTab policies={clientPolicies} router={router} />}
                    {activeTab === 'claims' && <ClaimsTab claims={clientClaims} router={router} />}
                    {activeTab === 'documents' && <DocumentsTab documents={clientDocuments} />}
                    {activeTab === 'communication' && <CommunicationTab client={client} />}
                    {activeTab === 'beneficiaries' && <BeneficiariesTab client={client} />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

// ===========================================================
// Overview Tab
// ===========================================================
function OverviewTab({
    client, totalPremiumYTD, outstandingPremium, commissionEarned, commissionPending,
    hasOverdue, expiringSoonPolicies, clientPolicies, clientInvoices, clientReceipts,
    clientClaims, activePoliciesCount, claimsPending, totalClaimsAmount,
}: any) {
    return (
        <div className="space-y-6">
            {/* KPI Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <KpiCard label="Total Premium" value={totalPremiumYTD > 0 ? formatCurrency(totalPremiumYTD) : '—'} sub={`${clientInvoices.length} invoices`} icon={<DollarSign size={18} />} accent="primary" />
                <KpiCard label="Outstanding" value={outstandingPremium > 0 ? formatCurrency(outstandingPremium) : '₵0'} sub={hasOverdue ? 'Has overdue' : 'All current'} icon={<Clock size={18} />} accent={hasOverdue ? 'danger' : 'success'} />
                <KpiCard label="Active Policies" value={String(activePoliciesCount)} sub={`of ${clientPolicies.length} total`} icon={<FileText size={18} />} accent="primary" />
                <KpiCard label="Commission" value={commissionEarned > 0 ? formatCurrency(commissionEarned) : '—'} sub={commissionPending > 0 ? `${formatCurrency(commissionPending)} pending` : 'Settled'} icon={<CreditCard size={18} />} accent="success" />
                <KpiCard label="Open Claims" value={String(claimsPending)} sub={`₵${Math.round(totalClaimsAmount).toLocaleString()} total`} icon={<Shield size={18} />} accent={claimsPending > 0 ? 'warning' : 'success'} />
                <KpiCard label="Expiring Soon" value={String(expiringSoonPolicies.length)} sub="Next 30 days" icon={<Bell size={18} />} accent={expiringSoonPolicies.length > 0 ? 'danger' : 'success'} />
            </div>

            {/* Financial & Alerts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GlassCard title="Financial Summary" icon={<DollarSign size={16} />}>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                        <MetricItem label="Total Premium (Invoiced)" value={totalPremiumYTD > 0 ? formatCurrency(totalPremiumYTD) : '—'} sub={`${clientInvoices.length} invoices`} />
                        <MetricItem label="Outstanding Premium" value={outstandingPremium > 0 ? formatCurrency(outstandingPremium) : '₵0'} color={hasOverdue ? 'text-danger-500' : ''} sub={hasOverdue ? 'Overdue invoices exist' : 'All current'} />
                        <MetricItem label="Commission Earned" value={commissionEarned > 0 ? formatCurrency(commissionEarned) : '—'} sub="Earned + paid" />
                        <MetricItem label="Commission Pending" value={commissionPending > 0 ? formatCurrency(commissionPending) : '₵0'} sub="Awaiting settlement" />
                    </div>
                    <div className="mt-6 pt-4 border-t border-surface-200/40 flex items-center justify-between">
                        <div className={cn(
                            'px-3 py-1.5 rounded-full border text-[11px] font-semibold inline-flex items-center gap-1.5',
                            hasOverdue ? 'bg-amber-50 text-amber-600 border-amber-200/50' : 'bg-emerald-50 text-emerald-600 border-emerald-200/50'
                        )}>
                            {hasOverdue ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />}
                            {hasOverdue ? 'Overdue Premium — Attention Required' : 'Payments Up To Date'}
                        </div>
                        <Link href="/dashboard/finance" className="text-xs text-primary-600 font-medium hover:underline">View Invoices →</Link>
                    </div>
                </GlassCard>

                <GlassCard title="Key Dates & Alerts" icon={<Clock size={16} />}>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                        <MetricItem
                            label="Next Policy Expiry"
                            value={expiringSoonPolicies.length > 0 ? `${expiringSoonPolicies[0].daysToExpiry} Days` : 'None Soon'}
                            sub={expiringSoonPolicies.length > 0 ? `Expires: ${formatDate(expiringSoonPolicies[0].expiryDate)}` : 'All policies current'}
                        />
                        <MetricItem label="Expiring (30d)" value={String(expiringSoonPolicies.length)} color={expiringSoonPolicies.length > 0 ? 'text-amber-500' : ''} sub={expiringSoonPolicies.length > 0 ? 'Renewal pipeline active' : 'No renewals due'} />
                        <MetricItem label="Total Policies" value={String(clientPolicies.length)} sub={`${activePoliciesCount} active`} />
                        <MetricItem label="Payments Received" value={String(clientReceipts.length)} sub="Total receipts" />
                    </div>
                    {/* Retention probability — calculated from data */}
                    <div className="mt-6 pt-4 border-t border-surface-200/40">
                        <div className="flex items-center justify-between text-xs text-surface-500 mb-2">
                            <span>Relationship Retention</span>
                            <span className="text-emerald-600 font-semibold">{client.status === 'active' ? `${Math.min(95, 50 + clientPolicies.length * 3 + clientReceipts.length * 2)}%` : '—'}</span>
                        </div>
                        <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(95, 50 + clientPolicies.length * 3 + clientReceipts.length * 2)}%` }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
                            />
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Recent Claims & Renewals Row */}
            {(clientClaims.length > 0 || expiringSoonPolicies.length > 0) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {clientClaims.length > 0 && (
                        <GlassCard title="Recent Claims" icon={<Shield size={16} />}>
                            <div className="space-y-3">
                                {clientClaims.slice(0, 3).map((claim: any) => (
                                    <div key={claim.id} className="p-4 rounded-xl bg-surface-50/50 border border-surface-200/30 hover:bg-white/50 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <span className="text-sm font-semibold text-surface-900">{claim.claimNumber}</span>
                                                <span className="text-xs text-surface-400 ml-2 capitalize">{claim.insuranceType}</span>
                                            </div>
                                            <StatusBadge status={claim.status} />
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-surface-500">
                                            <span>Amount: <strong className="text-surface-800">{formatCurrency(claim.claimAmount)}</strong></span>
                                            <span>Filed: {formatDate(claim.intimationDate)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    )}
                    {expiringSoonPolicies.length > 0 && (
                        <GlassCard title="Upcoming Renewals" icon={<Activity size={16} />}>
                            <div className="space-y-3">
                                {expiringSoonPolicies.slice(0, 3).map((pol: any) => (
                                    <div key={pol.id} className="p-4 rounded-xl bg-surface-50/50 border border-surface-200/30 hover:bg-white/50 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <span className="text-sm font-semibold text-surface-900">{pol.policyNumber}</span>
                                                <span className="text-xs text-surface-400 ml-2 capitalize">{pol.insuranceType?.replace(/_/g, ' ')}</span>
                                            </div>
                                            <span className={cn(
                                                'text-xs font-semibold px-2.5 py-1 rounded-full',
                                                (pol.daysToExpiry || 0) < 14 ? 'bg-danger-50 text-danger-600' : 'bg-amber-50 text-amber-600'
                                            )}>
                                                {pol.daysToExpiry} days
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-surface-500">
                                            <span>Insurer: {pol.insurerName}</span>
                                            <span>Premium: <strong className="text-surface-800">{formatCurrency(pol.premiumAmount)}</strong></span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    )}
                </div>
            )}
        </div>
    );
}

// ===========================================================
// Personal Info Tab
// ===========================================================
function PersonalInfoTab({ client }: { client: any }) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <GlassCard title={client.type === 'corporate' ? 'Company Information' : 'Personal Information'} icon={client.type === 'corporate' ? <Building2 size={16} /> : <User size={16} />}>
                    <div className="space-y-4">
                        {client.type === 'individual' ? (
                            <>
                                <InfoRow label="Full Name" value={getClientDisplayName(client)} />
                                {client.otherNames && <InfoRow label="Other Names" value={client.otherNames} />}
                                <InfoRow label="Date of Birth" value={client.dateOfBirth ? formatDate(client.dateOfBirth) : '—'} />
                                <InfoRow label="Gender" value={client.gender ? client.gender.charAt(0).toUpperCase() + client.gender.slice(1) : '—'} />
                                <InfoRow label="Nationality" value={client.nationality || '—'} />
                                <InfoRow label="Marital Status" value={client.maritalStatus ? client.maritalStatus.charAt(0).toUpperCase() + client.maritalStatus.slice(1) : '—'} />
                                <InfoRow label="Ghana Card #" value={client.ghanaCardNumber || '—'} mono />
                                <InfoRow label="Occupation" value={client.occupation || '—'} />
                                {client.employerName && <InfoRow label="Employer" value={client.employerName} />}
                                {client.employerAddress && <InfoRow label="Employer Address" value={client.employerAddress} />}
                            </>
                        ) : (
                            <>
                                <InfoRow label="Company Name" value={client.companyName || '—'} />
                                <InfoRow label="Registration #" value={client.registrationNumber || '—'} mono />
                                <InfoRow label="TIN" value={client.tin || '—'} mono />
                                <InfoRow label="Industry" value={client.industry || '—'} />
                                <InfoRow label="Date of Incorporation" value={client.dateOfIncorporation ? formatDate(client.dateOfIncorporation) : '—'} />
                                {client.contactPerson && <InfoRow label="Contact Person" value={client.contactPerson} />}
                                {client.contactPersonPhone && <InfoRow label="Contact Person Phone" value={client.contactPersonPhone} />}
                            </>
                        )}
                    </div>
                </GlassCard>

                {/* Contact Information */}
                <GlassCard title="Contact Information" icon={<Phone size={16} />}>
                    <div className="space-y-4">
                        <InfoRow label="Primary Phone" value={client.phone} />
                        {client.alternatePhone && <InfoRow label="Alternate Phone" value={client.alternatePhone} />}
                        <InfoRow label="Email" value={client.email || '—'} />
                        <InfoRow label="Digital Address" value={client.digitalAddress || '—'} mono />
                        {client.postalAddress && <InfoRow label="Postal Address" value={client.postalAddress} />}
                        <InfoRow label="Region" value={client.region || '—'} />
                        <InfoRow label="City" value={client.city || '—'} />
                        {client.preferredCommunication && <InfoRow label="Preferred Communication" value={client.preferredCommunication.charAt(0).toUpperCase() + client.preferredCommunication.slice(1)} />}
                    </div>
                </GlassCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* KYC/AML */}
                <GlassCard title="KYC / AML Compliance" icon={<ShieldCheck size={16} />}>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-2.5 border-b border-surface-100">
                            <span className="text-sm text-surface-500">KYC Status</span>
                            <StatusBadge status={client.kycStatus} />
                        </div>
                        {client.kycVerifiedAt && <InfoRow label="KYC Verified At" value={formatDate(client.kycVerifiedAt)} />}
                        <div className="flex items-center justify-between py-2.5 border-b border-surface-100">
                            <span className="text-sm text-surface-500">AML Risk Level</span>
                            <StatusBadge status={client.amlRiskLevel} />
                        </div>
                        <div className="flex items-center justify-between py-2.5 border-b border-surface-100">
                            <span className="text-sm text-surface-500">Politically Exposed Person</span>
                            <span className={cn('text-sm font-semibold', client.isPep ? 'text-danger-600' : 'text-surface-600')}>{client.isPep ? 'Yes — PEP' : 'No'}</span>
                        </div>
                        <div className="flex items-center justify-between py-2.5 border-b border-surface-100">
                            <span className="text-sm text-surface-500">Enhanced Due Diligence</span>
                            <span className={cn('text-sm font-semibold', client.eddRequired ? 'text-amber-600' : 'text-surface-600')}>{client.eddRequired ? 'Required' : 'Not Required'}</span>
                        </div>
                        {client.sourceOfFunds && <InfoRow label="Source of Funds" value={client.sourceOfFunds} />}
                        {client.purposeOfRelationship && <InfoRow label="Purpose of Relationship" value={client.purposeOfRelationship} />}
                        {client.expectedTransactionVolume && <InfoRow label="Expected Volume" value={client.expectedTransactionVolume} />}
                    </div>
                </GlassCard>

                {/* Banking & Next of Kin */}
                <div className="space-y-6">
                    <GlassCard title="Banking Details" icon={<Landmark size={16} />}>
                        {client.bankDetails ? (
                            <div className="space-y-4">
                                <InfoRow label="Bank" value={client.bankDetails.bankName} />
                                <InfoRow label="Account Name" value={client.bankDetails.accountName} />
                                <InfoRow label="Account Number" value={client.bankDetails.accountNumber} mono />
                                <InfoRow label="Branch" value={client.bankDetails.branch} />
                            </div>
                        ) : (
                            <p className="text-sm text-surface-400 py-4">No banking details on file.</p>
                        )}
                    </GlassCard>

                    <GlassCard title="Next of Kin" icon={<Heart size={16} />}>
                        {client.nextOfKin ? (
                            <div className="space-y-4">
                                <InfoRow label="Full Name" value={client.nextOfKin.fullName} />
                                <InfoRow label="Relationship" value={client.nextOfKin.relationship} />
                                <InfoRow label="Phone" value={client.nextOfKin.phone} />
                                {client.nextOfKin.address && <InfoRow label="Address" value={client.nextOfKin.address} />}
                            </div>
                        ) : (
                            <p className="text-sm text-surface-400 py-4">No next of kin recorded.</p>
                        )}
                    </GlassCard>
                </div>
            </div>

            {/* Metadata */}
            <GlassCard title="Record Metadata" icon={<Clock size={16} />}>
                <div className="flex flex-wrap gap-x-10 gap-y-3">
                    <InfoRow label="Client Number" value={client.clientNumber} mono inline />
                    <InfoRow label="Assigned Broker" value={client.assignedBrokerName || 'Not assigned'} inline />
                    <InfoRow label="Created" value={formatDate(client.createdAt)} inline />
                    <InfoRow label="Last Updated" value={formatDate(client.updatedAt)} inline />
                </div>
            </GlassCard>
        </div>
    );
}

// ===========================================================
// Policies Tab
// ===========================================================
function PoliciesTab({ policies, router }: { policies: any[]; router: any }) {
    return (
        <GlassCard title={`Policies (${policies.length})`} icon={<FileText size={16} />}>
            {policies.length === 0 ? (
                <div className="text-center py-12 text-surface-400">
                    <FileText size={32} className="mx-auto mb-3 opacity-40" />
                    <p className="text-sm">No policies associated with this client.</p>
                    <Link href="/dashboard/policies/new" className="text-primary-600 text-sm font-medium hover:underline mt-2 inline-block">+ Create Policy</Link>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-surface-200/50">
                                <th className="px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Policy #</th>
                                <th className="px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Type</th>
                                <th className="px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Insurer</th>
                                <th className="px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Premium</th>
                                <th className="px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider text-center">Expires In</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-100">
                            {policies.map((pol) => (
                                <tr key={pol.id} onClick={() => router.push(`/dashboard/policies/${pol.id}`)} className="hover:bg-primary-50/30 transition-colors cursor-pointer">
                                    <td className="px-4 py-3.5 text-sm font-medium text-primary-600">{pol.policyNumber}</td>
                                    <td className="px-4 py-3.5 text-sm text-surface-700 capitalize">{pol.insuranceType?.replace(/_/g, ' ')}</td>
                                    <td className="px-4 py-3.5 text-sm text-surface-600">{pol.insurerName}</td>
                                    <td className="px-4 py-3.5 text-sm font-semibold text-surface-800">{formatCurrency(pol.premiumAmount)}</td>
                                    <td className="px-4 py-3.5"><StatusBadge status={pol.status} /></td>
                                    <td className="px-4 py-3.5 text-center">
                                        {pol.daysToExpiry !== undefined ? (
                                            <span className={cn(
                                                'text-xs font-semibold',
                                                pol.daysToExpiry < 30 ? 'text-danger-500' : pol.daysToExpiry < 60 ? 'text-amber-500' : 'text-surface-600'
                                            )}>{pol.daysToExpiry} days</span>
                                        ) : <span className="text-surface-400 text-xs">—</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </GlassCard>
    );
}

// ===========================================================
// Claims Tab
// ===========================================================
function ClaimsTab({ claims: clientClaims, router }: { claims: any[]; router: any }) {
    const totalAmount = clientClaims.reduce((s: number, c: any) => s + c.claimAmount, 0);
    const settled = clientClaims.filter((c: any) => c.status === 'settled' || c.status === 'closed');
    const settledAmount = settled.reduce((s: number, c: any) => s + (c.settledAmount || c.claimAmount), 0);
    const pending = clientClaims.filter((c: any) => c.status !== 'closed' && c.status !== 'settled' && c.status !== 'rejected');
    const lossRatio = totalAmount > 0 ? Math.round((settledAmount / totalAmount) * 100) : 0;

    return (
        <div className="space-y-6">
            {clientClaims.length > 0 && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard label="Total Claims" value={String(clientClaims.length)} sub="All time" icon={<Shield size={18} />} accent="primary" />
                    <KpiCard label="Total Claimed" value={formatCurrency(totalAmount)} sub={`${settled.length} settled`} icon={<DollarSign size={18} />} accent="primary" />
                    <KpiCard label="Pending" value={String(pending.length)} sub="Open claims" icon={<Clock size={18} />} accent={pending.length > 0 ? 'warning' : 'success'} />
                    <KpiCard label="Loss Ratio" value={`${lossRatio}%`} sub="Settled vs claimed" icon={<Activity size={18} />} accent={lossRatio > 70 ? 'danger' : 'success'} />
                </div>
            )}

            <GlassCard title={`Claims History (${clientClaims.length})`} icon={<Shield size={16} />}>
                {clientClaims.length === 0 ? (
                    <div className="text-center py-12 text-surface-400">
                        <Shield size={32} className="mx-auto mb-3 opacity-40" />
                        <p className="text-sm">No claims history for this client.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-surface-200/50">
                                    <th className="px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Claim #</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Type</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Policy #</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Incident Date</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Overdue</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-100">
                                {clientClaims.map((claim: any) => (
                                    <tr key={claim.id} onClick={() => router.push(`/dashboard/claims/${claim.id}`)} className="hover:bg-primary-50/30 transition-colors cursor-pointer">
                                        <td className="px-4 py-3.5 text-sm font-medium text-primary-600">{claim.claimNumber}</td>
                                        <td className="px-4 py-3.5 text-sm text-surface-700 capitalize">{claim.insuranceType}</td>
                                        <td className="px-4 py-3.5 text-sm text-surface-600 font-mono text-xs">{claim.policyNumber}</td>
                                        <td className="px-4 py-3.5 text-sm font-semibold text-surface-800">{formatCurrency(claim.claimAmount)}</td>
                                        <td className="px-4 py-3.5 text-sm text-surface-600">{formatDate(claim.incidentDate)}</td>
                                        <td className="px-4 py-3.5"><StatusBadge status={claim.status} /></td>
                                        <td className="px-4 py-3.5">
                                            {claim.isOverdue ? (
                                                <span className="text-xs font-semibold text-danger-600 bg-danger-50 px-2 py-0.5 rounded-full">Overdue</span>
                                            ) : (
                                                <span className="text-xs text-surface-400">No</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </GlassCard>
        </div>
    );
}

// ===========================================================
// Documents Tab
// ===========================================================
function DocumentsTab({ documents }: { documents: any[] }) {
    const docs = documents.length > 0 ? documents : [];

    const categoryLabels: Record<string, string> = {
        kyc: 'KYC Document', policy: 'Policy Document', claim: 'Claim Document',
        compliance: 'Compliance', internal: 'Internal', report: 'Report', client: 'Client Document',
    };

    const categoryColors: Record<string, string> = {
        kyc: 'bg-primary-50 text-primary-600', policy: 'bg-emerald-50 text-emerald-600',
        claim: 'bg-amber-50 text-amber-600', compliance: 'bg-purple-50 text-purple-600',
        client: 'bg-accent-50 text-accent-600',
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <p className="text-sm text-surface-500">{docs.length} document(s) on file</p>
                <Button variant="outline" size="sm" leftIcon={<Upload size={14} />} onClick={() => { const inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx'; inp.onchange = () => { if (inp.files?.[0]) toast.success(`"${inp.files[0].name}" uploaded (mock)`, { description: 'Document will be attached to client profile.' }); }; inp.click(); }}>Upload Document</Button>
            </div>

            <GlassCard title="Documents Repository" icon={<FileText size={16} />}>
                {docs.length === 0 ? (
                    <div className="text-center py-12 text-surface-400">
                        <FileText size={32} className="mx-auto mb-3 opacity-40" />
                        <p className="text-sm">No documents uploaded for this client.</p>
                        <p className="text-xs text-surface-300 mt-1">Upload client documents using the button above.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {docs.map((doc: any) => (
                            <div key={doc.id} className="flex items-center justify-between p-4 rounded-xl bg-surface-50/50 border border-surface-200/30 hover:bg-white/60 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                                        <FileText size={18} className="text-primary-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-surface-900">{doc.name}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', categoryColors[doc.category] || 'bg-surface-100 text-surface-500')}>
                                                {categoryLabels[doc.category] || doc.category}
                                            </span>
                                            <span className="text-[10px] text-surface-400">{(doc.sizeBytes / 1024 / 1024).toFixed(1)} MB</span>
                                            <span className="text-[10px] text-surface-400">v{doc.version}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="w-8 h-8 rounded-lg bg-surface-100 flex items-center justify-center hover:bg-primary-50 text-surface-500 hover:text-primary-600 transition-colors">
                                        <Eye size={14} />
                                    </button>
                                    <button className="w-8 h-8 rounded-lg bg-surface-100 flex items-center justify-center hover:bg-primary-50 text-surface-500 hover:text-primary-600 transition-colors">
                                        <Download size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </GlassCard>

            {/* Compliance Checklist */}
            <GlassCard title="Compliance Checklist" icon={<ShieldCheck size={16} />}>
                <div className="space-y-1">
                    <ChecklistItem label="Ghana Card / Certificate of Incorporation" required status={docs.some((d: any) => d.category === 'kyc') ? 'complete' : 'pending'} />
                    <ChecklistItem label="Passport Photo" required status="pending" />
                    <ChecklistItem label="Proof of Address" required status="pending" />
                    <ChecklistItem label="Source of Funds Declaration" required={false} status="pending" />
                    <ChecklistItem label="Board Resolution (Corporate)" required={false} status="pending" />
                </div>
            </GlassCard>
        </div>
    );
}

// ===========================================================
// Communication Tab
// ===========================================================
function CommunicationTab({ client }: { client: any }) {
    const commsLog = [
        { id: 1, date: '2025-01-12', type: 'Call', direction: 'Outbound', summary: 'Discussed Motor Fleet renewal options and premium payment schedule', by: client.assignedBrokerName || 'Broker' },
        { id: 2, date: '2025-01-08', type: 'Email', direction: 'Outbound', summary: 'Sent renewal quotation for upcoming Fire & Allied policy', by: client.assignedBrokerName || 'Broker' },
        { id: 3, date: '2024-12-20', type: 'SMS', direction: 'Outbound', summary: 'Premium payment reminder for Q4 installment', by: 'System' },
        { id: 4, date: '2024-12-15', type: 'Call', direction: 'Inbound', summary: 'Client called regarding claim status update on motor accident', by: client.assignedBrokerName || 'Broker' },
        { id: 5, date: '2024-11-28', type: 'Email', direction: 'Outbound', summary: 'Sent updated policy schedule after endorsement', by: client.assignedBrokerName || 'Broker' },
        { id: 6, date: '2024-11-10', type: 'Meeting', direction: 'In-person', summary: 'Annual review meeting — discussed portfolio expansion, new property coverage', by: client.assignedBrokerName || 'Broker' },
    ];

    const typeColors: Record<string, string> = {
        Call: 'bg-primary-50 text-primary-600 border-primary-200/50',
        Email: 'bg-emerald-50 text-emerald-600 border-emerald-200/50',
        SMS: 'bg-amber-50 text-amber-600 border-amber-200/50',
        Meeting: 'bg-purple-50 text-purple-600 border-purple-200/50',
    };

    const typeIcons: Record<string, React.ReactNode> = {
        Call: <Phone size={14} />, Email: <Mail size={14} />,
        SMS: <MessageSquare size={14} />, Meeting: <Users size={14} />,
    };

    return (
        <GlassCard title="Communication Log" icon={<MessageSquare size={16} />}>
            <div className="space-y-0 relative">
                {commsLog.map((item, idx) => (
                    <div key={item.id} className="flex gap-4 relative pb-6 last:pb-0">
                        {idx < commsLog.length - 1 && (
                            <div className="absolute top-10 left-[17px] bottom-0 w-px bg-surface-200/60" />
                        )}
                        <div className={cn(
                            'w-9 h-9 rounded-full flex items-center justify-center shrink-0 border',
                            typeColors[item.type] || 'bg-surface-50 text-surface-500 border-surface-200'
                        )}>
                            {typeIcons[item.type] || <MessageSquare size={14} />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-surface-900">{item.type}</span>
                                    <span className="text-[11px] text-surface-400 px-2 py-0.5 bg-surface-50 rounded-full">{item.direction}</span>
                                </div>
                                <span className="text-xs text-surface-400">{formatDate(item.date)}</span>
                            </div>
                            <p className="text-sm text-surface-600 leading-relaxed">{item.summary}</p>
                            <span className="text-[11px] text-surface-400 mt-1 block">By: {item.by}</span>
                        </div>
                    </div>
                ))}
            </div>
        </GlassCard>
    );
}

// ===========================================================
// Beneficiaries Tab
// ===========================================================
function BeneficiariesTab({ client }: { client: any }) {
    const beneficiaries = client.beneficiaries || [];

    return (
        <div className="space-y-6">
            <GlassCard title={`Beneficiaries (${beneficiaries.length})`} icon={<Heart size={16} />}>
                {beneficiaries.length === 0 ? (
                    <div className="text-center py-12 text-surface-400">
                        <Heart size={32} className="mx-auto mb-3 opacity-40" />
                        <p className="text-sm">No beneficiaries recorded for this client.</p>
                        <p className="text-xs text-surface-300 mt-1">Beneficiary details can be added when editing the client profile.</p>
                    </div>
                ) : (
                    <>
                        {/* Allocation overview bar */}
                        <div className="mb-6">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-xs text-surface-500 font-medium">Allocation</span>
                                <div className="flex-1 h-3 bg-surface-100 rounded-full overflow-hidden flex">
                                    {beneficiaries.map((b: any, i: number) => {
                                        const colors = ['bg-primary-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500', 'bg-pink-500'];
                                        return <div key={i} className={cn('h-full', colors[i % colors.length])} style={{ width: `${b.percentage}%` }} />;
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {beneficiaries.map((b: any, idx: number) => (
                                <div key={idx} className="p-4 rounded-xl bg-surface-50/50 border border-surface-200/30">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center text-white text-sm font-bold">
                                                {b.fullName?.charAt(0) || '?'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-surface-900">{b.fullName}</p>
                                                <p className="text-xs text-surface-400">{b.relationship}</p>
                                            </div>
                                        </div>
                                        <span className="text-lg font-bold text-primary-600">{b.percentage}%</span>
                                    </div>
                                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-surface-500">
                                        {b.dateOfBirth && <span>DOB: {formatDate(b.dateOfBirth)}</span>}
                                        {b.phone && <span>Phone: {b.phone}</span>}
                                        {b.ghanaCardNumber && <span>Ghana Card: {b.ghanaCardNumber}</span>}
                                        {b.guardianName && <span>Guardian: {b.guardianName}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </GlassCard>
        </div>
    );
}

// ===========================================================
// Shared Sub-Components
// ===========================================================

function GlassCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/60 backdrop-blur-xl p-6 rounded-2xl border border-surface-200/50 shadow-lg relative overflow-hidden flex flex-col h-full"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-500">
                    {icon}
                </div>
                <h3 className="text-sm font-bold text-surface-900 tracking-tight">{title}</h3>
                <div className="flex-1 h-px bg-surface-200/30 ml-2" />
            </div>
            <div className="flex-1">{children}</div>
        </motion.div>
    );
}

function StatusPill({ label, value, status }: { label: string; value: string; status: 'success' | 'warning' | 'danger' }) {
    const colors = {
        success: 'bg-emerald-50 text-emerald-600 border-emerald-200/50',
        warning: 'bg-amber-50 text-amber-600 border-amber-200/50',
        danger: 'bg-danger-50 text-danger-600 border-danger-200/50',
    };
    return (
        <div className={cn('px-3 py-2 rounded-xl border text-center min-w-[80px]', colors[status])}>
            <span className="text-[9px] font-semibold uppercase tracking-wider block mb-0.5 opacity-70">{label}</span>
            <span className="text-xs font-bold capitalize">{value}</span>
        </div>
    );
}

function MetricItem({ label, value, sub, color = '' }: { label: string; value: string; sub?: string; color?: string }) {
    return (
        <div className="flex flex-col">
            <p className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider mb-1">{label}</p>
            <p className={cn('text-2xl font-bold tracking-tight leading-none mb-1', color || 'text-surface-900')}>{value}</p>
            {sub && <p className="text-[11px] text-surface-400">{sub}</p>}
        </div>
    );
}

function KpiCard({ label, value, sub, icon, accent }: { label: string; value: string; sub: string; icon: React.ReactNode; accent: string }) {
    const accentColors: Record<string, string> = {
        primary: 'from-primary-500 to-primary-600',
        success: 'from-emerald-500 to-emerald-600',
        warning: 'from-amber-500 to-amber-600',
        danger: 'from-danger-500 to-danger-600',
    };
    return (
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-surface-200/50 shadow-sm p-4 relative overflow-hidden">
            <div className={cn('absolute top-0 left-0 right-0 h-1 bg-gradient-to-r', accentColors[accent] || accentColors.primary)} />
            <div className="flex items-center justify-between mb-3">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-white bg-gradient-to-br shadow-md', accentColors[accent] || accentColors.primary)}>
                    {icon}
                </div>
            </div>
            <p className="text-xl font-bold text-surface-900 leading-none mb-1">{value}</p>
            <p className="text-xs font-medium text-surface-500">{label}</p>
            <p className="text-[10px] text-surface-400 mt-0.5">{sub}</p>
        </div>
    );
}

function InfoRow({ label, value, mono, inline }: { label: string; value: string; mono?: boolean; inline?: boolean }) {
    if (inline) {
        return (
            <div className="flex items-center gap-2">
                <span className="text-xs text-surface-400">{label}:</span>
                <span className={cn('text-sm font-medium text-surface-800', mono && 'font-mono text-xs')}>{value}</span>
            </div>
        );
    }
    return (
        <div className="flex items-center justify-between py-2.5 border-b border-surface-100 last:border-0">
            <span className="text-sm text-surface-500">{label}</span>
            <span className={cn('text-sm font-medium text-surface-800 text-right', mono && 'font-mono text-xs')}>{value}</span>
        </div>
    );
}

function ChecklistItem({ label, required, status }: { label: string; required: boolean; status: 'complete' | 'pending' }) {
    return (
        <div className="flex items-center justify-between py-3 border-b border-surface-100 last:border-0">
            <div className="flex items-center gap-3">
                <div className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center border-2',
                    status === 'complete' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-surface-300 bg-background'
                )}>
                    {status === 'complete' ? <Check size={12} strokeWidth={3} /> : <div className="w-2 h-2 rounded-full bg-surface-300" />}
                </div>
                <div>
                    <span className="text-sm text-surface-900">{label}</span>
                    {required && <span className="text-[10px] text-danger-500 ml-1">*</span>}
                </div>
            </div>
            <span className={cn(
                'text-[10px] font-semibold px-2.5 py-1 rounded-full',
                status === 'complete' ? 'bg-emerald-50 text-emerald-600' : 'bg-surface-50 text-surface-400'
            )}>
                {status === 'complete' ? 'Uploaded' : 'Pending'}
            </span>
        </div>
    );
}
