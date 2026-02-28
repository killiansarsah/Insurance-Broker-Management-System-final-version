'use client';

import { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    FileText,
    CheckCircle2,
    Clock,
    AlertTriangle,
    HandCoins,
    Wallet,
    Eye,
    Phone,
    Mail,
    Send,
    X,
    User,
    Shield,
    BarChart3,
    TrendingUp,
    CalendarDays,
    DollarSign,
    Building2,
    CreditCard,
    History,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-display/data-table';
import { CustomSelect } from '@/components/ui/select-custom';
import { formatCurrency, formatDate } from '@/lib/utils';
import { NewPFAModal } from '@/components/features/premium-financing/new-application-modal';
import {
    mockPFApplications,
    pfSummary,
    PF_STATUS_CONFIG,
    FINANCIERS,
    type PFApplication,
    type PFStatus,
} from '@/mock/premium-financing';

import { motion, AnimatePresence } from 'framer-motion';

// ─── Pipeline Tab Types ───
type PipelineTab = 'all' | 'pending' | 'active' | 'completed' | 'defaulted' | 'cancelled';

// ─── Status Badge (PF-specific) ───
function PFStatusBadge({ status }: { status: PFStatus }) {
    const config = PF_STATUS_CONFIG[status];
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-bold rounded-full ${config.bg} ${config.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
            {config.label}
        </span>
    );
}

// ─── Overdue Badge ───
function OverdueBadge({ days }: { days: number }) {
    if (days <= 0) return null;
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-danger-50 text-danger-700 border border-danger-200">
            <AlertTriangle size={10} />
            {days}d overdue
        </span>
    );
}

// ─── Detail Modal ───
function PFDetailModal({ app, onClose }: { app: PFApplication; onClose: () => void }) {
    const progressPct = app.numberOfInstallments > 0
        ? Math.round((app.installmentsPaid / app.numberOfInstallments) * 100)
        : 0;

    // ESC key + body scroll lock
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKey);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    return createPortal(
        <div className="fixed inset-0 z-[350] flex items-center justify-center p-4" onClick={onClose}>
            {/* Overlay */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 backdrop-blur-md"
            />

            {/* Panel */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className="relative w-full max-w-3xl max-h-[90vh] pf-modal-glass rounded-[1.75rem] shadow-2xl overflow-y-auto custom-scrollbar-subtle"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Gradient Header */}
                <div className="sticky top-0 z-10 pf-modal-header px-7 py-5 rounded-t-[1.75rem]">
                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 rounded-xl bg-white/10 ring-4 ring-white/5">
                                <Wallet size={22} className="text-white icon-glow" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white tracking-tight">Financing Details</h2>
                                <p className="text-sm text-white/50 font-mono">{app.applicationNumber}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <div className="flex items-center gap-2 mt-3.5 relative z-10">
                        <PFStatusBadge status={app.status} />
                        {app.daysOverdue > 0 && <OverdueBadge days={app.daysOverdue} />}
                    </div>
                </div>

                <div className="px-7 py-6 space-y-5">
                    {/* Client & Policy */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="grid grid-cols-2 gap-3"
                    >
                        <InfoCard label="Client" value={app.clientName} icon={<User size={16} />} accent="primary" />
                        <InfoCard label="Client Type" value={app.clientType === 'corporate' ? 'Corporate' : 'Individual'} icon={<Building2 size={16} />} accent="blue" />
                        <InfoCard label="Policy" value={app.policyNumber} icon={<FileText size={16} />} accent="primary" />
                        <InfoCard label="Insurer" value={app.insurerName} icon={<Shield size={16} />} accent="success" />
                        <InfoCard label="Coverage" value={app.coverageType} icon={<BarChart3 size={16} />} accent="amber" />
                        <InfoCard label="Insurance Type" value={app.insuranceType.replace(/_/g, ' ')} icon={<Shield size={16} />} accent="primary" />
                    </motion.div>

                    {/* Financing Breakdown */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="pf-section-card p-5"
                    >
                        <h3 className="text-sm font-bold text-surface-800 mb-4 flex items-center gap-2.5">
                            <div className="p-1.5 rounded-lg bg-primary-50">
                                <DollarSign size={14} className="text-primary-600" />
                            </div>
                            Financing Breakdown
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="pf-stat-cell">
                                <p className="text-[10px] uppercase font-bold text-surface-400 tracking-wider mb-1">Total Premium</p>
                                <p className="text-lg font-black text-surface-900 tracking-tight">{formatCurrency(app.totalPremium)}</p>
                            </div>
                            <div className="pf-stat-cell !border-success-200/50">
                                <p className="text-[10px] uppercase font-bold text-surface-400 tracking-wider mb-1">Down ({app.downPaymentPct}%)</p>
                                <p className="text-lg font-black text-success-600 tracking-tight">{formatCurrency(app.downPayment)}</p>
                            </div>
                            <div className="pf-stat-cell !border-primary-200/50">
                                <p className="text-[10px] uppercase font-bold text-surface-400 tracking-wider mb-1">Financed</p>
                                <p className="text-lg font-black text-primary-600 tracking-tight">{formatCurrency(app.financedAmount)}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3 mt-3">
                            <div className="pf-stat-cell">
                                <p className="text-[10px] uppercase font-bold text-surface-400 tracking-wider mb-1">Interest Rate</p>
                                <p className="text-sm font-bold text-surface-800">{app.interestRateMonthly}% <span className="text-surface-400">/mo</span></p>
                            </div>
                            <div className="pf-stat-cell">
                                <p className="text-[10px] uppercase font-bold text-surface-400 tracking-wider mb-1">Total Interest</p>
                                <p className="text-sm font-bold text-amber-600">{formatCurrency(app.totalInterest)}</p>
                            </div>
                            <div className="pf-stat-cell">
                                <p className="text-[10px] uppercase font-bold text-surface-400 tracking-wider mb-1">Total Repayment</p>
                                <p className="text-sm font-bold text-surface-900">{formatCurrency(app.totalRepayment)}</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Repayment Progress */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="pf-section-card p-5"
                    >
                        <h3 className="text-sm font-bold text-surface-800 mb-4 flex items-center gap-2.5">
                            <div className="p-1.5 rounded-lg bg-primary-50">
                                <TrendingUp size={14} className="text-primary-600" />
                            </div>
                            Repayment Progress
                        </h3>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex-1 h-3.5 bg-surface-100 rounded-full overflow-hidden shadow-inner">
                                <div
                                    className={`h-full rounded-full pf-progress-bar relative overflow-hidden ${app.daysOverdue > 0 ? 'bg-danger-500' : app.status === 'completed' ? 'bg-success-500' : 'bg-primary-500'}`}
                                    style={{ width: `${progressPct}%` }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]" />
                                </div>
                            </div>
                            <span className="text-sm font-black text-surface-800 bg-surface-50 px-2.5 py-1 rounded-lg min-w-[3.5rem] text-center">{progressPct}%</span>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                            <div className="pf-stat-cell">
                                <p className="text-[10px] uppercase font-bold text-surface-400 tracking-wider mb-1">Paid</p>
                                <p className="text-sm font-black text-success-700">{app.installmentsPaid}<span className="text-surface-400 font-medium">/{app.numberOfInstallments}</span></p>
                            </div>
                            <div className="pf-stat-cell">
                                <p className="text-[10px] uppercase font-bold text-surface-400 tracking-wider mb-1">Total Paid</p>
                                <p className="text-sm font-black text-success-700">{formatCurrency(app.amountPaid)}</p>
                            </div>
                            <div className="pf-stat-cell">
                                <p className="text-[10px] uppercase font-bold text-surface-400 tracking-wider mb-1">Outstanding</p>
                                <p className="text-sm font-black text-danger-600">{formatCurrency(app.outstandingBalance)}</p>
                            </div>
                            <div className="pf-stat-cell">
                                <p className="text-[10px] uppercase font-bold text-surface-400 tracking-wider mb-1">Monthly</p>
                                <p className="text-sm font-black text-primary-600">{formatCurrency(app.monthlyInstallment)}</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact & Financier Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="pf-section-card p-5"
                    >
                        <h3 className="text-sm font-bold text-surface-800 mb-4 flex items-center gap-2.5">
                            <div className="p-1.5 rounded-lg bg-primary-50">
                                <Phone size={14} className="text-primary-600" />
                            </div>
                            Contact & Financier
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm py-2 px-3 rounded-lg hover:bg-surface-50/80 transition-colors">
                                <span className="text-surface-500 font-medium">Phone</span>
                                <a href={`tel:${app.clientPhone}`} className="text-primary-600 font-semibold hover:underline flex items-center gap-1.5">
                                    <Phone size={12} /> {app.clientPhone}
                                </a>
                            </div>
                            <div className="flex items-center justify-between text-sm py-2 px-3 rounded-lg hover:bg-surface-50/80 transition-colors">
                                <span className="text-surface-500 font-medium">Email</span>
                                <a href={`mailto:${app.clientEmail}`} className="text-primary-600 font-semibold hover:underline flex items-center gap-1.5">
                                    <Mail size={12} /> {app.clientEmail}
                                </a>
                            </div>
                            <div className="flex items-center justify-between text-sm py-2 px-3 rounded-lg hover:bg-surface-50/80 transition-colors">
                                <span className="text-surface-500 font-medium">Financier</span>
                                <span className="font-semibold text-surface-800">{app.financier}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm py-2 px-3 rounded-lg hover:bg-surface-50/80 transition-colors">
                                <span className="text-surface-500 font-medium">Assigned Broker</span>
                                <span className="font-semibold text-surface-800">{app.assignedBroker}</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Key Dates */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="pf-section-card p-5"
                    >
                        <h3 className="text-sm font-bold text-surface-800 mb-4 flex items-center gap-2.5">
                            <div className="p-1.5 rounded-lg bg-primary-50">
                                <CalendarDays size={14} className="text-primary-600" />
                            </div>
                            Key Dates
                        </h3>
                        <div className="space-y-1">
                            <DateRow label="Application Date" value={app.applicationDate} />
                            {app.approvalDate && <DateRow label="Approval Date" value={app.approvalDate} />}
                            {app.disbursementDate && <DateRow label="Disbursement Date" value={app.disbursementDate} />}
                            {app.firstPaymentDate && <DateRow label="First Payment" value={app.firstPaymentDate} />}
                            {app.nextPaymentDate && <DateRow label="Next Payment" value={app.nextPaymentDate} highlight={app.daysOverdue > 0} />}
                            {app.completionDate && <DateRow label="Completed" value={app.completionDate} />}
                        </div>
                    </motion.div>

                    {/* Installment Schedule */}
                    {app.installments.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35 }}
                            className="pf-section-card p-5"
                        >
                            <h3 className="text-sm font-bold text-surface-800 mb-4 flex items-center gap-2.5">
                                <div className="p-1.5 rounded-lg bg-primary-50">
                                    <History size={14} className="text-primary-600" />
                                </div>
                                Installment Schedule
                                <span className="ml-auto text-[10px] font-bold text-surface-400 uppercase tracking-wider">
                                    {app.installments.filter(i => i.status === 'paid').length}/{app.installments.length} paid
                                </span>
                            </h3>
                            <div className="space-y-2">
                                {app.installments.map((inst, idx) => (
                                    <div
                                        key={inst.id}
                                        className="pf-installment-row flex items-center justify-between py-2.5 px-4 rounded-xl text-sm transition-all hover:bg-surface-50/80 border border-transparent hover:border-surface-200/60 group"
                                        style={{ animationDelay: `${idx * 60}ms` }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${
                                                inst.status === 'paid' ? 'bg-success-500' :
                                                inst.status === 'overdue' ? 'bg-danger-500 pf-ring-pulse' :
                                                'bg-surface-300'
                                            }`}>
                                                {inst.status === 'paid' ? <CheckCircle2 size={14} /> : inst.number}
                                            </div>
                                            <span className="font-semibold text-surface-700">Installment #{inst.number}</span>
                                        </div>
                                        <div className="flex items-center gap-5 text-surface-500">
                                            <span className="text-xs font-medium">{formatDate(inst.dueDate)}</span>
                                            <span className="font-bold text-surface-800 w-24 text-right">{formatCurrency(inst.amount)}</span>
                                            <span className={`text-[10px] font-black uppercase tracking-wider w-16 text-right ${
                                                inst.status === 'paid' ? 'text-success-600' :
                                                inst.status === 'overdue' ? 'text-danger-600' :
                                                'text-surface-400'
                                            }`}>
                                                {inst.status === 'paid' ? '✓ Paid' : inst.status === 'overdue' ? 'Overdue' : 'Pending'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Reason & Notes */}
                    {(app.reason || app.notes) && (
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="pf-section-card p-5"
                        >
                            <h3 className="text-sm font-bold text-surface-800 mb-3 flex items-center gap-2.5">
                                <div className="p-1.5 rounded-lg bg-primary-50">
                                    <FileText size={14} className="text-primary-600" />
                                </div>
                                Notes
                            </h3>
                            {app.reason && (
                                <p className="text-sm text-surface-600 mb-1"><span className="font-semibold">Reason:</span> {app.reason}</p>
                            )}
                            {app.notes && (
                                <p className="text-sm text-surface-500 italic">{app.notes}</p>
                            )}
                        </motion.div>
                    )}

                    {/* Action Buttons */}
                    {(app.status === 'active' || app.status === 'submitted' || app.status === 'under_review') && (
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.45 }}
                            className="flex flex-wrap gap-2 pt-4 border-t border-surface-200/60"
                        >
                            <Button
                                variant="primary"
                                leftIcon={<Phone size={16} />}
                                className="rounded-xl"
                                onClick={() => alert(`Calling ${app.clientName} at ${app.clientPhone}`)}
                            >
                                Contact Client
                            </Button>
                            <Button
                                variant="outline"
                                leftIcon={<Send size={16} />}
                                className="rounded-xl"
                                onClick={() => alert(`Sending payment reminder to ${app.clientEmail}`)}
                            >
                                Send Reminder
                            </Button>
                            <Button
                                variant="outline"
                                leftIcon={<Mail size={16} />}
                                className="rounded-xl"
                                onClick={() => alert(`Opening email for ${app.clientEmail}`)}
                            >
                                Email Statement
                            </Button>
                            {app.status === 'active' && (
                                <Button
                                    variant="primary"
                                    className="bg-success-600 hover:bg-success-700 ml-auto rounded-xl shadow-lg shadow-success-600/20"
                                    leftIcon={<CreditCard size={16} />}
                                    onClick={() => alert(`Recording payment for ${app.applicationNumber}`)}
                                >
                                    Record Payment
                                </Button>
                            )}
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>,
        document.body
    );
}

// ─── Helper Components ───

function InfoCard({ label, value, icon, accent = 'primary' }: { label: string; value: string; icon: React.ReactNode; accent?: string }) {
    const accentColors: Record<string, string> = {
        primary: 'bg-primary-50 text-primary-600',
        blue: 'bg-blue-50 text-blue-600',
        success: 'bg-success-50 text-success-600',
        amber: 'bg-amber-50 text-amber-600',
    };
    return (
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/70 border border-surface-100/80 hover:border-surface-200 hover:shadow-sm transition-all group">
            <div className={`p-1.5 rounded-lg ${accentColors[accent] || accentColors.primary} group-hover:scale-110 transition-transform`}>{icon}</div>
            <div>
                <p className="text-[10px] uppercase font-bold text-surface-400 tracking-wider">{label}</p>
                <p className="text-sm font-semibold text-surface-800 capitalize">{value}</p>
            </div>
        </div>
    );
}

function DateRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
    return (
        <div className="flex items-center justify-between text-sm py-2 px-3 rounded-lg hover:bg-surface-50/80 transition-colors">
            <span className="text-surface-500 font-medium">{label}</span>
            <span className={`font-semibold ${highlight ? 'text-danger-600 font-bold' : 'text-surface-700'}`}>{formatDate(value)}</span>
        </div>
    );
}

// ─── Main Page ───
export default function PremiumFinancingPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const tabParam = (searchParams.get('tab') as PipelineTab) || 'all';
    const [activeTab, setActiveTab] = useState<PipelineTab>(tabParam);
    const [financierFilter, setFinancierFilter] = useState<string>('all');
    const [brokerFilter, setBrokerFilter] = useState<string>('all');
    const [selectedApp, setSelectedApp] = useState<PFApplication | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setActiveTab(tabParam);
    }, [tabParam]);

    // Unique brokers
    const brokers = useMemo(() => {
        const set = new Set(mockPFApplications.map(a => a.assignedBroker));
        return Array.from(set).sort();
    }, []);

    // Pipeline tabs with dot-accent colors (distinct from renewals' pill counts)
    const pipelineTabs: { id: PipelineTab; label: string; count: number; dotColor: string; activeColor: string }[] = useMemo(() => [
        { id: 'all', label: 'All', count: pfSummary.total, dotColor: 'bg-surface-400', activeColor: 'border-surface-900' },
        { id: 'pending', label: 'Pending', count: pfSummary.underReview + pfSummary.approved + pfSummary.submitted, dotColor: 'bg-amber-500', activeColor: 'border-amber-500' },
        { id: 'active', label: 'Active', count: pfSummary.active, dotColor: 'bg-primary-500', activeColor: 'border-primary-500' },
        { id: 'completed', label: 'Completed', count: pfSummary.completed, dotColor: 'bg-success-500', activeColor: 'border-success-500' },
        { id: 'defaulted', label: 'Defaulted', count: pfSummary.defaulted, dotColor: 'bg-danger-500', activeColor: 'border-danger-500' },
        { id: 'cancelled', label: 'Cancelled', count: pfSummary.cancelled, dotColor: 'bg-surface-400', activeColor: 'border-surface-500' },
    ], []);

    // Filtered data
    const filteredApps = useMemo(() => {
        let data = [...mockPFApplications];

        switch (activeTab) {
            case 'pending':
                data = data.filter(a => a.status === 'submitted' || a.status === 'under_review' || a.status === 'approved');
                break;
            case 'active':
                data = data.filter(a => a.status === 'active');
                break;
            case 'completed':
                data = data.filter(a => a.status === 'completed');
                break;
            case 'defaulted':
                data = data.filter(a => a.status === 'defaulted');
                break;
            case 'cancelled':
                data = data.filter(a => a.status === 'cancelled');
                break;
        }

        if (financierFilter !== 'all') {
            data = data.filter(a => a.financier === financierFilter);
        }
        if (brokerFilter !== 'all') {
            data = data.filter(a => a.assignedBroker === brokerFilter);
        }

        // Sort: overdue first, then by application date desc
        data.sort((a, b) => {
            if (a.daysOverdue !== b.daysOverdue) return b.daysOverdue - a.daysOverdue;
            return new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime();
        });

        return data;
    }, [activeTab, financierFilter, brokerFilter]);

    const handleTabChange = (tab: PipelineTab) => {
        setActiveTab(tab);
        router.push(`/dashboard/premium-financing?tab=${tab}`, { scroll: false });
    };

    const handleNewApplication = (data: any) => {
        // Integration with NewPFAModal
        console.log('New application submitted:', data);
    };

    // ─── KPI data (no longer a uniform grid — hero + compact blocks) ───
    const collectionPct = pfSummary.collectionRate;
    const circumference = 2 * Math.PI * 40; // radius 40
    const strokeDash = (collectionPct / 100) * circumference;

    return (
        <div className="space-y-6 min-h-screen">
            {/* Header — gradient strip banner (vs renewals' bar + title) */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', damping: 25 }}
                className="pf-modal-header rounded-2xl px-7 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-1">
                        <Wallet size={14} className="text-white/90" />
                        <p className="text-[11px] font-extrabold text-white/90 uppercase tracking-[0.25em]">Premium Financing</p>
                    </div>
                    <h1 className="text-2xl font-black text-white tracking-tight">
                        Financing Dashboard
                    </h1>
                    <p className="text-white/80 text-sm font-medium mt-1">
                        Manage and track all financing applications
                    </p>
                </div>

                <motion.div
                    className="relative z-10"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                >
                    <Button
                        variant="outline"
                        className="bg-white text-surface-900 hover:bg-surface-50 border-none rounded-xl px-7 h-11 font-black shadow-lg"
                        leftIcon={<HandCoins size={18} />}
                        onClick={() => setIsModalOpen(true)}
                    >
                        New Application
                    </Button>
                </motion.div>
            </motion.div>

            {/* Overview — Hero Banner + Compact Stats (distinct from renewals) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-4"
            >
                {/* Hero Stat — dark gradient banner */}
                <div className="lg:col-span-5 pf-modal-header rounded-2xl p-6 flex items-center gap-6 relative overflow-hidden min-h-[180px]">
                    <div className="relative z-10 flex items-center gap-6 w-full">
                        {/* Circular Collection Gauge */}
                        <div className="relative flex-shrink-0">
                            <svg width="100" height="100" viewBox="0 0 100 100" className="-rotate-90">
                                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="8" />
                                <motion.circle
                                    cx="50" cy="50" r="40" fill="none" stroke="#22c55e" strokeWidth="8"
                                    strokeLinecap="round"
                                    strokeDasharray={circumference}
                                    initial={{ strokeDashoffset: circumference }}
                                    animate={{ strokeDashoffset: circumference - strokeDash }}
                                    transition={{ delay: 0.4, duration: 1.5, ease: [0.34, 1.56, 0.64, 1] }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xl font-black text-white">{collectionPct.toFixed(0)}%</span>
                            </div>
                        </div>
                        {/* Hero Text */}
                        <div className="flex-1">
                            <p className="text-[11px] font-extrabold text-white/90 uppercase tracking-[0.25em] mb-1">Total Financed</p>
                            <p className="text-3xl font-black text-white tracking-tighter">{formatCurrency(pfSummary.totalFinanced)}</p>
                            <div className="flex items-center gap-4 mt-3">
                                <span className="text-xs font-bold text-white/80">{pfSummary.active + pfSummary.completed} agreements</span>
                                <span className="text-[11px] font-bold text-success-300 bg-success-500/20 px-2.5 py-0.5 rounded-full">
                                    {collectionPct.toFixed(1)}% collection
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Compact 2×2 Stat Grid */}
                <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {/* Active */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="pf-section-card p-4 flex flex-col justify-between group hover:shadow-md"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
                                <CreditCard size={18} />
                            </div>
                            <span className="text-[11px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{pfSummary.active}</span>
                        </div>
                        <div>
                            <p className="text-[11px] font-extrabold text-surface-500 uppercase tracking-wider">Active</p>
                            <p className="text-sm font-black text-surface-900 tracking-tight mt-0.5">{formatCurrency(pfSummary.totalOutstanding)}</p>
                            <p className="text-[11px] font-medium text-surface-500 mt-1">outstanding</p>
                        </div>
                    </motion.div>

                    {/* Overdue */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="pf-section-card p-4 flex flex-col justify-between group hover:shadow-md"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 rounded-lg bg-danger-500/10 text-danger-600">
                                <AlertTriangle size={18} />
                            </div>
                            {pfSummary.defaulted > 0 && (
                                <span className="text-[11px] font-black text-danger-600 bg-danger-50 px-2 py-0.5 rounded-full animate-pulse">{pfSummary.defaulted}</span>
                            )}
                        </div>
                        <div>
                            <p className="text-[11px] font-extrabold text-surface-500 uppercase tracking-wider">Overdue</p>
                            <p className="text-sm font-black text-danger-700 tracking-tight mt-0.5">{formatCurrency(pfSummary.overdueAmount)}</p>
                            <p className="text-[11px] font-medium text-surface-500 mt-1">{pfSummary.defaulted} defaulted</p>
                        </div>
                    </motion.div>

                    {/* Completed */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="pf-section-card p-4 flex flex-col justify-between group hover:shadow-md"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 rounded-lg bg-success-500/10 text-success-600">
                                <CheckCircle2 size={18} />
                            </div>
                            <span className="text-[11px] font-black text-success-700 bg-success-50 px-2 py-0.5 rounded-full">{pfSummary.completed}</span>
                        </div>
                        <div>
                            <p className="text-[11px] font-extrabold text-surface-500 uppercase tracking-wider">Completed</p>
                            <p className="text-sm font-black text-success-700 tracking-tight mt-0.5">{pfSummary.completed} settled</p>
                            <p className="text-[11px] font-medium text-surface-500 mt-1">fully repaid</p>
                        </div>
                    </motion.div>

                    {/* Pending Review */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="pf-section-card p-4 flex flex-col justify-between group hover:shadow-md"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 rounded-lg bg-warning-500/10 text-warning-600">
                                <Clock size={18} />
                            </div>
                            <span className="text-[11px] font-black text-warning-700 bg-warning-50 px-2 py-0.5 rounded-full">{pfSummary.underReview}</span>
                        </div>
                        <div>
                            <p className="text-[11px] font-extrabold text-surface-500 uppercase tracking-wider">Pending</p>
                            <p className="text-sm font-black text-surface-900 tracking-tight mt-0.5">{pfSummary.underReview + pfSummary.submitted} in queue</p>
                            <p className="text-[11px] font-medium text-surface-500 mt-1">{pfSummary.approved} approved</p>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Pipeline Tabs — underline strip (vs renewals' filled pills) */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="border-b border-surface-200"
            >
                <div className="flex gap-0 overflow-x-auto">
                    {pipelineTabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`relative flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all duration-200 whitespace-nowrap border-b-2 -mb-px ${
                                activeTab === tab.id
                                    ? `${tab.activeColor} text-surface-900`
                                    : 'border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300'
                            }`}
                        >
                            <span className={`w-2 h-2 rounded-full ${activeTab === tab.id ? tab.dotColor : 'bg-surface-300'} transition-colors`} />
                            <span>{tab.label}</span>
                            <span className={`text-[11px] font-black ${
                                activeTab === tab.id ? 'text-surface-900' : 'text-surface-500'
                            }`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Data Table */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
            >
                <DataTable
                    data={filteredApps}
                    columns={[
                        {
                            key: 'applicationNumber',
                            label: 'Application',
                            sortable: true,
                            render: (r) => (
                                <div>
                                    <p className="font-mono font-bold text-surface-800 text-xs tracking-tight">{r.applicationNumber}</p>
                                    <p className="text-[11px] text-surface-400 capitalize mt-0.5">{r.insuranceType.replace(/_/g, ' ')} • {r.coverageType}</p>
                                </div>
                            ),
                        },
                        {
                            key: 'clientName',
                            label: 'Client',
                            sortable: true,
                            render: (r) => (
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 flex-shrink-0">
                                        <User size={14} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-surface-800 text-sm">{r.clientName}</p>
                                        <p className="text-[11px] text-surface-400">{r.clientPhone}</p>
                                    </div>
                                </div>
                            ),
                        },
                        {
                            key: 'financedAmount',
                            label: 'Financed',
                            sortable: true,
                            render: (r) => (
                                <div>
                                    <p className="font-bold text-surface-800">{formatCurrency(r.financedAmount)}</p>
                                    <p className="text-[11px] text-surface-400">of {formatCurrency(r.totalPremium)}</p>
                                </div>
                            ),
                        },
                        {
                            key: 'numberOfInstallments',
                            label: 'Plan',
                            sortable: true,
                            render: (r) => (
                                <div className="text-center">
                                    <p className="font-bold text-surface-800">{r.numberOfInstallments} <span className="text-surface-400 font-medium text-xs">mo</span></p>
                                    <p className="text-[11px] text-surface-400">{formatCurrency(r.monthlyInstallment)}/mo</p>
                                </div>
                            ),
                        },
                        {
                            key: 'installmentsPaid',
                            label: 'Progress',
                            sortable: true,
                            render: (r) => {
                                const pct = r.numberOfInstallments > 0 ? Math.round((r.installmentsPaid / r.numberOfInstallments) * 100) : 0;
                                return (
                                    <div className="min-w-[110px]">
                                        <div className="flex items-center justify-between text-[11px] mb-1.5">
                                            <span className="text-surface-500 font-semibold">{r.installmentsPaid}/{r.numberOfInstallments}</span>
                                            <span className="font-black text-surface-700">{pct}%</span>
                                        </div>
                                        <div className="h-2 bg-surface-100 rounded-full overflow-hidden shadow-inner">
                                            <div
                                                className={`h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden ${
                                                    r.daysOverdue > 0 ? 'bg-danger-500' :
                                                    r.status === 'completed' ? 'bg-success-500' :
                                                    'bg-primary-500'
                                                }`}
                                                style={{ width: `${pct}%` }}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                                            </div>
                                        </div>
                                    </div>
                                );
                            },
                        },
                        {
                            key: 'outstandingBalance',
                            label: 'Balance',
                            sortable: true,
                            render: (r) => (
                                <span className={`font-bold text-sm ${r.outstandingBalance > 0 ? 'text-danger-600' : 'text-success-600'}`}>
                                    {r.outstandingBalance > 0 ? formatCurrency(r.outstandingBalance) : (
                                        <span className="flex items-center gap-1">
                                            <CheckCircle2 size={14} /> Settled
                                        </span>
                                    )}
                                </span>
                            ),
                        },
                        {
                            key: 'status',
                            label: 'Status',
                            sortable: true,
                            render: (r) => (
                                <div className="flex flex-col gap-1.5">
                                    <PFStatusBadge status={r.status} />
                                    {r.daysOverdue > 0 && <OverdueBadge days={r.daysOverdue} />}
                                </div>
                            ),
                        },
                        {
                            key: 'financier',
                            label: 'Financier',
                            sortable: true,
                            render: (r) => <span className="text-sm text-surface-700 font-medium">{r.financier}</span>,
                        },
                        {
                            key: 'id',
                            label: '',
                            render: (r) => (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedApp(r);
                                    }}
                                    className="p-2 rounded-xl hover:bg-primary-50 text-surface-400 hover:text-primary-600 transition-all hover:scale-110"
                                >
                                    <Eye size={16} />
                                </button>
                            ),
                        },
                    ]}
                    searchKeys={['applicationNumber', 'clientName', 'insurerName', 'financier', 'assignedBroker']}
                    onRowClick={(row) => setSelectedApp(row)}
                    className="premium-glass-card"
                    headerActions={
                        <div className="flex items-center gap-2">
                            <CustomSelect
                                label="Financier"
                                options={[
                                    { label: 'All Financiers', value: 'all' },
                                    ...FINANCIERS.map(f => ({ label: f, value: f })),
                                ]}
                                value={financierFilter}
                                onChange={(v) => setFinancierFilter(String(v ?? 'all'))}
                            />
                            <CustomSelect
                                label="Broker"
                                options={[
                                    { label: 'All Brokers', value: 'all' },
                                    ...brokers.map(b => ({ label: b, value: b })),
                                ]}
                                value={brokerFilter}
                                onChange={(v) => setBrokerFilter(String(v ?? 'all'))}
                            />
                        </div>
                    }
                />
            </motion.div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedApp && (
                    <PFDetailModal
                        app={selectedApp}
                        onClose={() => setSelectedApp(null)}
                    />
                )}
            </AnimatePresence>

            {/* New Application Modal */}
            <NewPFAModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleNewApplication}
            />
        </div>
    );
}
