'use client';

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    ArrowUpRight,
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
    Plus,
    MapPin
} from 'lucide-react';
import { getClientById, getClientDisplayName } from '@/mock/clients';
import { getPoliciesByClientId } from '@/mock/policies';
import { invoices, receipts } from '@/mock/finance';
import { commissions } from '@/mock/commissions';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { BackButton } from '@/components/ui/back-button';
import { StatusBadge } from '@/components/data-display/status-badge';
import Link from 'next/link';

export default function ClientProfilePage() {
    const params = useParams();
    const router = useRouter();
    const client = getClientById(params.id as string);

    if (!client) {
        return (
            <div className="flex flex-col items-center justify-center py-24 animate-fade-in text-center px-6">
                <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mb-6 text-surface-400">
                    <Users size={32} />
                </div>
                <h2 className="text-xl font-black text-surface-900 uppercase tracking-tighter mb-2">Anchor Not Found</h2>
                <p className="text-surface-500 text-sm max-w-[280px] mb-8">The client record you are looking for has been moved or does not exist in the current flux.</p>
                <button
                    onClick={() => router.push('/dashboard/clients')}
                    className="px-8 py-3 bg-surface-900 text-white rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-primary-600 transition-all active:scale-95 shadow-xl"
                >
                    Return to Fleet
                </button>
            </div>
        );
    }

    const clientPolicies = getPoliciesByClientId(client.id);
    const clientInvoices = invoices.filter(inv => inv.clientId === client.id);
    const clientReceipts = receipts.filter(rec => rec.clientId === client.id);
    const clientCommissions = commissions.filter(c => c.clientId === client.id);

    // Computed financial figures from real mock data
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

    const name = getClientDisplayName(client);

    return (
        <div className="max-w-[1400px] mx-auto space-y-6 pb-20 p-4 lg:p-6 animate-fade-in relative">
            {/* Background Decorative Blur */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-primary-500/5 blur-[120px] rounded-full" />
                <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-accent-500/5 blur-[100px] rounded-full" />
            </div>

            {/* --- Executive Header Pillar --- */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col lg:flex-row lg:items-center gap-6 bg-white/60 backdrop-blur-xl p-6 lg:p-8 rounded-[var(--radius-3xl)] border border-surface-200/50 shadow-xl relative overflow-hidden ring-1 ring-white/20"
            >
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                <BackButton href="/dashboard/clients" />

                <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div>
                        <div className="flex items-center flex-wrap gap-3 mb-2">
                            <h1 className="text-3xl font-black text-surface-900 tracking-tighter uppercase leading-none">{name}</h1>
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-200/50 shadow-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest leading-none">Status: Active</span>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-bold text-surface-500 uppercase tracking-tight">
                            <span className="flex items-center gap-1.5"><Building2 size={13} className="text-primary-500" /> {client.type === 'corporate' ? 'Corporate Entity' : 'Individual'}</span>
                            <span className="flex items-center gap-1.5"><MapPinIcon size={13} className="text-primary-500" /> {client.region || 'Greater Accra'}</span>
                            <span className="flex items-center gap-1.5"><Users size={13} className="text-primary-500" /> Account: A. Boateng</span>
                            <span className="flex items-center gap-1.5"><Calendar size={13} className="text-primary-500" /> Partner Since: 2021</span>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <StatusPill label="KYC Status" value="Complete" icon={<CheckCircle2 size={14} />} color="text-emerald-600" />
                        <StatusPill label="NIC Compliance" value="Verified OK" icon={<ShieldCheck size={14} />} color="text-emerald-600" />
                    </div>
                </div>
            </motion.div>

            {/* --- Insight Grid Row 1: Financials & Alerts --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Financial Summary */}
                <GlassCard title="Financial Summary" icon={<DollarSign size={16} />}>
                    <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                        <MetricItem
                            label="Total Premium (Invoiced)"
                            value={totalPremiumYTD > 0 ? formatCurrency(totalPremiumYTD) : '—'}
                            sub={`${clientInvoices.length} invoice${clientInvoices.length !== 1 ? 's' : ''} on record`}
                        />
                        <MetricItem
                            label="Outstanding Premium"
                            value={outstandingPremium > 0 ? formatCurrency(outstandingPremium) : '₵0'}
                            color={hasOverdue ? 'text-danger-500' : 'text-surface-900'}
                            sub={hasOverdue ? 'OVERDUE INVOICE(S)' : 'All invoices current'}
                        />
                        <MetricItem
                            label="Commission Earned"
                            value={commissionEarned > 0 ? formatCurrency(commissionEarned) : '—'}
                            sub={`${clientCommissions.filter(c => c.status === 'paid').length} paid commisssion(s)`}
                        />
                        <MetricItem
                            label="Commission Pending"
                            value={commissionPending > 0 ? formatCurrency(commissionPending) : '₵0'}
                            sub="Awaiting settlement"
                        />
                    </div>
                    <div className="mt-8 pt-6 border-t border-surface-200/40 flex justify-between items-center">
                        <div>
                            <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest block mb-1">Financial Health Status</span>
                            <div className={cn(
                                'px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 shadow-sm',
                                hasOverdue
                                    ? 'bg-amber-50 text-amber-600 border-amber-200/50'
                                    : 'bg-emerald-50 text-emerald-600 border-emerald-200/50'
                            )}>
                                {hasOverdue ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />}
                                {hasOverdue ? 'Overdue Premium — Attention Required' : 'Payments Up To Date'}
                            </div>
                        </div>
                        <Link
                            href="/dashboard/finance/invoices"
                            className="text-[10px] font-black text-primary-600 uppercase tracking-[2px] hover:bg-primary-50 p-2 rounded-lg transition-colors"
                        >
                            View Invoices
                        </Link>
                    </div>
                </GlassCard>

                {/* Key Dates & Alerts */}
                <GlassCard title="Emergency Intelligence" icon={<Clock size={16} />}>
                    <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                        <MetricItem
                            label="Next Policy Expiry"
                            value={expiringSoonPolicies.length > 0 ? `${expiringSoonPolicies[0].daysToExpiry} Days` : 'None Soon'}
                            sub={expiringSoonPolicies.length > 0 ? `EXPIRES: ${formatDate(expiringSoonPolicies[0].expiryDate)}` : 'All policies current'}
                        />
                        <MetricItem
                            label={`Policies Expiring (30d)`}
                            value={String(expiringSoonPolicies.length).padStart(2, '0')}
                            color={expiringSoonPolicies.length > 0 ? 'text-amber-500' : 'text-surface-900'}
                            sub={expiringSoonPolicies.length > 0 ? 'RENEWAL PIPELINE ACTIVE' : 'No renewals due'}
                        />
                        <MetricItem
                            label="Total Policies Held"
                            value={String(clientPolicies.length).padStart(2, '0')}
                            sub={`${clientPolicies.filter(p => p.status === 'active').length} Active`}
                        />
                        <MetricItem label="Total Receipts" value={String(clientReceipts.length).padStart(2, '0')} sub="Payments received" />
                    </div>
                    <div className="mt-8 pt-6 border-t border-surface-200/40">
                        <div className="flex items-center justify-between text-[11px] font-black text-surface-500 uppercase tracking-widest mb-3">
                            <span>Relationship Retention Probability</span>
                            <span className="text-emerald-600">82% High</span>
                        </div>
                        <div className="h-2 bg-surface-100 rounded-full overflow-hidden shadow-inner p-[1px]">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '82%' }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                            />
                        </div>
                    </div>
                </GlassCard>
            </div>

            <section className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-[13px] font-black text-surface-900 uppercase tracking-[3px] flex items-center gap-3">
                        <FileText size={16} className="text-primary-500" /> Policies Held
                    </h3>
                    <div className="flex gap-2">
                        <Link
                            href="/dashboard/finance/invoices"
                            className="text-[10px] font-black text-surface-400 uppercase tracking-widest hover:text-primary-600 px-3 py-1.5 rounded-lg border border-transparent hover:border-surface-200 bg-white/40 transition-all"
                        >
                            View Invoices
                        </Link>
                        <Link
                            href="/dashboard/policies"
                            className="text-[10px] font-black text-primary-600 uppercase tracking-widest bg-primary-50 px-3 py-1.5 rounded-lg border border-primary-100 hover:bg-primary-100 transition-all"
                        >
                            View All Records
                        </Link>
                    </div>
                </div>
                <div className="bg-white/60 backdrop-blur-xl rounded-[var(--radius-2xl)] border border-surface-200/50 overflow-hidden shadow-xl ring-1 ring-white/20">
                    {clientPolicies.length === 0 ? (
                        <div className="px-6 py-12 text-center text-surface-400">
                            <FileText size={32} className="mx-auto mb-3 opacity-40" />
                            <p className="text-sm">No policies found for this client.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse table-fixed lg:table-auto">
                            <thead>
                                <tr className="bg-surface-50/50 border-b border-surface-200/30">
                                    <th className="px-6 py-5 text-[10px] font-black text-surface-400 uppercase tracking-widest w-[150px]">Policy #</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-surface-400 uppercase tracking-widest">Insurance Product</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-surface-400 uppercase tracking-widest">Insurer</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-surface-400 uppercase tracking-widest">Gross Premium</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-surface-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-surface-400 uppercase tracking-widest text-center">Expires In</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-200/30">
                                {clientPolicies.map((pol) => (
                                    <tr key={pol.id} onClick={() => router.push(`/dashboard/policies/${pol.id}`)} className="hover:bg-primary-500/[0.02] transition-colors group cursor-pointer">
                                        <td className="px-6 py-5 text-[11px] font-black text-primary-600 tracking-tight">{pol.policyNumber}</td>
                                        <td className="px-6 py-5">
                                            <div className="text-[12px] font-black text-surface-900 uppercase">{pol.insuranceType?.replace(/_/g, ' ')}</div>
                                            <div className="text-[9px] font-bold text-surface-400 uppercase tracking-tighter">{pol.insurerName}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-surface-100 flex items-center justify-center text-[8px] font-black">{pol.insurerName?.[0]}</div>
                                                <span className="text-[11px] font-bold text-surface-600 uppercase tracking-tight">{pol.insurerName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-[12px] font-black text-surface-900">{formatCurrency(pol.premiumAmount)}</td>
                                        <td className="px-6 py-5"><StatusBadge status={pol.status} /></td>
                                        <td className="px-6 py-5 text-center">
                                            {pol.daysToExpiry !== undefined ? (
                                                <span className={cn(
                                                    'text-[11px] font-black uppercase',
                                                    pol.daysToExpiry < 30 ? 'text-danger-500' : pol.daysToExpiry < 60 ? 'text-amber-500' : 'text-surface-600'
                                                )}>{pol.daysToExpiry} days</span>
                                            ) : <span className="text-surface-400 text-xs">—</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </section >

            {/* --- Broker Intelligence row: Renewals & Claims History --- */}
            < div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4" >
                {/* Renewals & Retention */}
                < GlassCard title="Renewals & Retention" icon={< Activity size={16} />}>
                    <div className="space-y-4">
                        <RenewalItem label="Motor Fleet Renewal" target="P-10231" status="Quoted" expiry="18 Days" prev="Won (SIC)" progress={65} />
                        <RenewalItem label="Fire & Allied Asset" target="P-10244" status="Analyzing" expiry="34 Days" prev="Won (Enterprise)" progress={20} />
                        <button className="w-full py-3 bg-surface-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[3px] shadow-xl hover:scale-[1.02] transition-transform active:scale-95 mt-2">
                            Initiate Bulk Review
                        </button>
                    </div>
                </GlassCard >

                {/* Claims History (Broker View) */}
                < GlassCard title="Claims History (Live Feed)" icon={< Activity size={16} />}>
                    <div className="space-y-4">
                        <div className="p-5 rounded-2xl bg-gradient-to-br from-primary-500/[0.03] to-surface-500/[0.01] border border-primary-200/20 shadow-inner relative overflow-hidden group">
                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div>
                                    <span className="text-[11px] font-black text-surface-900 uppercase block">Ref Code: CL-88412</span>
                                    <span className="text-[10px] font-bold text-surface-400 uppercase">Policy Link: P-10231 (Motor)</span>
                                </div>
                                <span className="text-[9px] font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100 uppercase tracking-widest shadow-sm">Pending with Insurer</span>
                            </div>
                            <div className="grid grid-cols-3 gap-6 relative z-10 border-t border-surface-200/30 pt-4">
                                <div className="flex flex-col"><span className="text-[8px] font-black text-surface-400 uppercase tracking-widest mb-1">Insurer</span><span className="text-[11px] font-black uppercase text-surface-700">SIC Insurance</span></div>
                                <div className="flex flex-col"><span className="text-[8px] font-black text-surface-400 uppercase tracking-widest mb-1">Claim Amount</span><span className="text-[12px] font-black text-primary-600 tracking-tight">₵75,500</span></div>
                                <div className="flex flex-col"><span className="text-[8px] font-black text-surface-400 uppercase tracking-widest mb-1">Days Open</span><span className="text-[11px] font-black uppercase text-surface-900 animate-pulse">26 Days</span></div>
                            </div>
                            <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowUpRight size={14} className="text-surface-300" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-2">
                            <div className="p-3 bg-surface-50/50 rounded-xl border border-surface-200/30 text-center">
                                <div className="text-[14px] font-black text-surface-900">14%</div>
                                <div className="text-[8px] font-black text-surface-400 uppercase tracking-widest">Active Loss Ratio</div>
                            </div>
                            <div className="p-3 bg-surface-50/50 rounded-xl border border-surface-200/30 text-center">
                                <div className="text-[14px] font-black text-surface-900">03</div>
                                <div className="text-[8px] font-black text-surface-400 uppercase tracking-widest">Past 12m Claims</div>
                            </div>
                        </div>
                    </div>
                </GlassCard >
            </div >

            {/* --- Documents & Timeline row --- */}
            < div className="grid grid-cols-1 lg:grid-cols-2 gap-6" >
                {/* Documents & Compliance */}
                < GlassCard title="Documents & Compliance Checklist" icon={< ShieldCheck size={16} />}>
                    <div className="space-y-1">
                        <ChecklistItem label="Proposal Form (Digital)" type="Mandatory" status="uploaded" date="10 Jan 2025" />
                        <ChecklistItem label="Master Policy Schedule" type="Mandatory" status="uploaded" date="12 Jan 2025" />
                        <ChecklistItem label="Temporary Cover Note" type="Mandatory" status="issued" date="14 Jan 2025" />
                        <ChecklistItem label="Motor Fleet Certificate" type="Mandatory" status="pending" isAlert />
                        <ChecklistItem label="KYC Document Suite" type="NIC Required" status="complete" date="05 Feb 2025" />
                    </div>
                </GlassCard >

                {/* Communication & Activity Timeline */}
                < GlassCard title="Communication & Activity Feed" icon={< MessageSquare size={16} />}>
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <TimelineItem date="12 Mar" category="Call logged" text="Renewal discussion with CFO regarding Motor Fleet expansion" owner="A. Boateng" />
                            <TimelineItem date="08 Mar" category="Email sent" text="Sent finalized Renewal quotation for SIC Fire policy" src="Outbound" />
                            <TimelineItem date="02 Mar" category="Claim alert" text="Follow-up with SIC regarding claim CL-88412 assessment" />
                            <TimelineItem date="18 Feb" category="Payment" text="Premium payment reminder sent for Q1 installments" isLate />
                        </div>
                        <button className="w-full py-3 bg-white border border-surface-200/50 text-surface-500 rounded-xl text-[10px] font-black uppercase tracking-[3px] hover:bg-surface-50 hover:text-surface-900 transition-all shadow-sm">
                            View Extensive History
                        </button>
                    </div>
                </GlassCard >
            </div >

            {/* --- Tasks & Follow-ups Column (Vertical Pillar) --- */}
            < section className="pt-4" >
                <div className="flex items-center justify-between mb-4 px-2">
                    <h3 className="text-[13px] font-black text-surface-900 uppercase tracking-[3px] flex items-center gap-3">
                        <Bell size={16} className="text-danger-500" /> Pending Tasks & Follow-ups
                    </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <TaskCard label="Issue Motor Certificate" status="CRITICAL" due="Today" owner="Ops Dept" highlight="danger" />
                    <TaskCard label="Premium Debt Recovery (₵180k)" status="URGENT" due="3 Days" owner="Finance" highlight="amber" />
                    <TaskCard label="Renewal Confirmation" status="NORMAL" due="7 Days" owner="AO" />
                </div>
            </section >

            {/* --- Client Health Indicator HUD / Floating Anchor --- */}
            < motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.005 }}
                className="bg-surface-900 rounded-[var(--radius-3xl)] p-8 shadow-2xl text-white relative overflow-hidden border border-white/10 ring-8 ring-surface-900/5 mt-12"
            >
                <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-10">
                    <div className="flex items-center gap-8">
                        <div className="relative shrink-0">
                            <div className="w-20 h-20 rounded-full bg-amber-500 flex items-center justify-center shadow-xl ring-[12px] ring-amber-500/10 animate-pulse">
                                <AlertTriangle size={36} className="text-white" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-danger-500 rounded-full border-4 border-surface-900 flex items-center justify-center text-[10px] font-black">!</div>
                        </div>
                        <div>
                            <div className="flex items-center gap-4 mb-3">
                                <span className="text-xs font-black uppercase tracking-[5px] text-amber-400 leading-none">Intelligence Engine</span>
                                <div className="h-1px flex-1 bg-white/20 min-w-[50px]" />
                                <span className="px-4 py-1 bg-amber-500 text-white rounded-full text-[11px] font-black uppercase tracking-[3px] shadow-lg ring-4 ring-amber-500/20">Client At Risk</span>
                            </div>
                            <h4 className="text-3xl font-black uppercase tracking-tighter mb-4 leading-none">O/S Prem + Expiring Motor Units</h4>
                            <p className="text-[12px] font-bold text-white/60 uppercase tracking-widest leading-relaxed max-w-[600px]">
                                <span className="text-amber-400">ANALYSIS:</span> Significant risk detected due to outstanding premiums (₵180k), upcoming Motor policy expiry in 18 days, and a missing compliance certificate.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 lg:self-center shrink-0">
                        <button className="px-10 py-5 bg-white text-surface-900 rounded-full font-black text-[11px] uppercase tracking-[4px] hover:bg-primary-50 transition-all shadow-2xl hover:-translate-y-1 active:scale-95">
                            Escalate Renewal & Payment
                        </button>
                        <button className="px-10 py-5 bg-surface-800 text-white rounded-full font-black text-[11px] uppercase tracking-[4px] border border-white/10 hover:bg-white/5 transition-all active:scale-95">
                            Ignore Warning
                        </button>
                    </div>
                </div>

                {/* Visual Flair */}
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-primary-500/10 rounded-full blur-[80px] pointer-events-none" />
            </motion.div >
        </div >
    );
}

// --- Subcomponents & Utilities ---

function GlassCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/60 backdrop-blur-xl p-6 lg:p-8 rounded-[var(--radius-3xl)] border border-surface-200/50 shadow-xl relative overflow-hidden flex flex-col h-full ring-1 ring-white/20"
        >
            <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-500 border border-primary-500/20">
                    {icon}
                </div>
                <h3 className="text-[13px] font-black text-surface-900 uppercase tracking-[3px] leading-none">{title}</h3>
                <div className="flex-1 h-px bg-surface-200/30 ml-2" />
            </div>
            <div className="flex-1">{children}</div>
        </motion.div>
    );
}

function StatusPill({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
    return (
        <div className="bg-white/80 px-5 py-3 rounded-2xl border border-surface-200/50 flex flex-col items-center justify-center shadow-lg ring-1 ring-white/20 min-w-[120px]">
            <span className="text-[9px] font-black text-surface-400 uppercase tracking-widest mb-1.5 leading-none">{label}</span>
            <div className={cn("flex items-center gap-2 font-black uppercase text-[12px] leading-none", color)}>
                {icon}
                {value}
            </div>
        </div>
    );
}

function MetricItem({ label, value, sub, color = "text-surface-900" }: { label: string; value: string; sub?: string; color?: string }) {
    return (
        <div className="flex flex-col">
            <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest mb-2 leading-none">{label}</p>
            <p className={cn("text-3xl font-black tracking-tighter leading-none mb-2", color)}>{value}</p>
            {sub && <p className="text-[10px] font-bold text-surface-400 uppercase tracking-tight">{sub}</p>}
        </div>
    );
}

function RenewalItem({ label, target, status, expiry, prev, progress }: { label: string; target: string; status: string; expiry: string; prev: string; progress: number }) {
    return (
        <div className="p-4 rounded-2xl hover:bg-white/40 border border-transparent hover:border-surface-200/40 transition-all cursor-pointer group">
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                    <div className="text-[12px] font-black text-surface-900 uppercase mb-1 tracking-tight group-hover:text-primary-600 transition-colors">{label} <span className="opacity-40">{target}</span></div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest">History: {prev}</span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-[11px] font-black text-surface-900 uppercase leading-none mb-1">{status}</div>
                    <div className="text-[10px] font-black text-danger-500 uppercase tracking-tighter">{expiry} EXPR</div>
                </div>
            </div>
            <div className="h-1 w-full bg-surface-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500" style={{ width: `${progress}%` }} />
            </div>
        </div>
    );
}

function ChecklistItem({ label, type, status, date, isAlert }: { label: string; type: string; status: string; date?: string; isAlert?: boolean }) {
    const isDone = status === 'uploaded' || status === 'complete' || status === 'issued';
    return (
        <div className="flex items-center justify-between py-4 border-b border-surface-200/30 last:border-0 group px-2">
            <div className="flex items-center gap-4">
                <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all shadow-sm",
                    isDone ? "bg-emerald-500 border-emerald-500 text-white" : "border-surface-300 group-hover:border-primary-500 bg-white"
                )}>
                    {isDone ? <Check size={12} strokeWidth={4} /> : <div className="w-2 h-2 rounded-full bg-surface-300 group-hover:bg-primary-500" />}
                </div>
                <div>
                    <span className={cn("text-[12px] font-black uppercase tracking-tight block leading-none mb-1", isAlert ? "text-danger-500 animate-pulse" : "text-surface-900")}>{label}</span>
                    <span className="text-[9px] font-black text-surface-400 uppercase tracking-widest leading-none">{type}</span>
                </div>
            </div>
            {date && (
                <div className="text-right">
                    <span className="text-[10px] font-black text-surface-900 uppercase block leading-none mb-1">{date}</span>
                    <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest leading-none">UPLOADED</span>
                </div>
            )}
            {isAlert && (
                <span className="px-3 py-1 bg-danger-50 text-danger-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-danger-100 shadow-sm">Required</span>
            )}
        </div>
    );
}

function TaskCard({ label, status, due, owner, highlight }: { label: string; status: string; due: string; owner: string; highlight?: 'danger' | 'amber' }) {
    return (
        <div className={cn(
            "p-5 rounded-[var(--radius-2xl)] bg-white/60 backdrop-blur-xl border border-surface-200/50 shadow-lg ring-1 ring-white/20 group hover:-translate-y-1 hover:shadow-2xl transition-all cursor-pointer",
            highlight === 'danger' && "border-l-4 border-l-danger-500",
            highlight === 'amber' && "border-l-4 border-l-amber-500"
        )}>
            <div className="flex items-center justify-between mb-4">
                <span className={cn(
                    "text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm border",
                    highlight === 'danger' ? "bg-danger-50 text-danger-600 border-danger-100" :
                        highlight === 'amber' ? "bg-amber-50 text-amber-600 border-amber-100" :
                            "bg-surface-50 text-surface-500 border-surface-100"
                )}>{status}</span>
                <span className="w-8 h-8 rounded-lg bg-surface-50 flex items-center justify-center text-surface-300 group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors">
                    <Plus size={16} />
                </span>
            </div>
            <h4 className="text-[13px] font-black text-surface-900 uppercase tracking-tight mb-4 leading-tight group-hover:text-primary-600 transition-colors">{label}</h4>
            <div className="flex items-center justify-between border-t border-surface-100 pt-4">
                <div className="flex flex-col">
                    <span className="text-[8px] font-black text-surface-400 uppercase tracking-widest mb-1">Due Date</span>
                    <span className={cn("text-[11px] font-black uppercase leading-none", highlight === 'danger' ? "text-danger-500" : "text-surface-900")}>{due}</span>
                </div>
                <div className="text-right">
                    <span className="text-[8px] font-black text-surface-400 uppercase tracking-widest mb-1 leading-none">Assigned To</span>
                    <span className="text-[11px] font-black uppercase leading-none text-surface-500">{owner}</span>
                </div>
            </div>
        </div>
    );
}

function TimelineItem({ date, category, text, owner, src, isLate }: { date: string; category: string; text: string; owner?: string; src?: string; isLate?: boolean }) {
    return (
        <div className="flex gap-5 relative group">
            <div className="absolute top-8 left-3.5 bottom-0 w-px bg-surface-200/50 group-last:hidden" />
            <div className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-sm border-2 z-10 transition-all group-hover:scale-110",
                isLate ? "bg-danger-50 border-danger-500 text-danger-500" : "bg-white border-primary-500/20 text-primary-500"
            )}>
                <div className={cn("w-1.5 h-1.5 rounded-full", isLate ? "bg-danger-500" : "bg-primary-500")} />
            </div>
            <div className="flex-1 pb-6">
                <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-surface-900 uppercase tracking-tight">{category}</span>
                        <span className="w-1 h-1 bg-surface-300 rounded-full" />
                        <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest">{date}</span>
                    </div>
                    {src && <span className="text-[9px] font-black text-surface-400 uppercase tracking-widest">{src}</span>}
                </div>
                <p className="text-[12px] font-bold text-surface-600 leading-snug mb-1 tracking-tight">{text}</p>
                {owner && <span className="text-[9px] font-black text-surface-400 uppercase tracking-widest italic">Action by: {owner}</span>}
            </div>
        </div>
    );
}

// Missing icon component
function MapPinIcon({ size, className }: { size?: number, className?: string }) {
    return <MapPin size={size} className={className} />
}
