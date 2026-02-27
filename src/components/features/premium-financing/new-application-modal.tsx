'use client';

import { useState, useMemo } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import {
    Search,
    User,
    DollarSign,
    ChevronLeft,
    ChevronRight,
    Check,
    ShieldCheck,
    ArrowRight,
    Mail,
    Zap,
    Sparkles,
    Shield,
    Wallet,
    CalendarDays,
    TrendingUp,
    FileCheck,
    Building2,
    Phone,
    CreditCard,
    BadgeCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, formatCurrency } from '@/lib/utils';
import { mockClients, getClientDisplayName } from '@/mock/clients';
import { mockPolicies } from '@/mock/policies';

// --- Static Data ---

const STEPS = [
    { id: 1, label: 'Customer', sub: 'Select client profile', icon: User },
    { id: 2, label: 'Policy', sub: 'Link active coverage', icon: Shield },
    { id: 3, label: 'Financing Plan', sub: 'Choose payment structure', icon: CreditCard },
    { id: 4, label: 'Review & Submit', sub: 'Confirm application', icon: FileCheck },
];

const INSTALLMENT_OPTIONS = [
    { id: 'full', label: 'Full Payment', total: 7647, period: 'Upfront', recommended: true, interest: 0, monthly: 7647 },
    { id: '3', label: '3 Months', total: 8215.39, period: 'Short-term', interest: 7.43, monthly: 2738.46 },
    { id: '6', label: '6 Months', total: 8821.71, period: 'Mid-term', interest: 15.36, monthly: 1470.29 },
    { id: '9', label: '9 Months', total: 9465.61, period: 'Extended', interest: 23.78, monthly: 1051.73 },
    { id: '12', label: '12 Months', total: 10146.41, period: 'Full Year', interest: 32.69, monthly: 845.53 },
];

const CONTAINER_VARIANTS = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
    exit: { opacity: 0, transition: { staggerChildren: 0.04, staggerDirection: -1 } }
};

const ITEM_VARIANTS = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, damping: 28, stiffness: 350 } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.15 } }
};

// --- Helpers ---
function getInitials(name: string) {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

// --- Component ---

interface NewPFAModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (data: any) => void;
}

export function NewPFAModal({ isOpen, onClose, onSuccess }: NewPFAModalProps) {
    const [step, setStep] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClient, setSelectedClient] = useState<any>(null);
    const [selectedPolicy, setSelectedPolicy] = useState<any>(null);
    const [installments, setInstallments] = useState('full');

    const filteredClients = useMemo(() => {
        return mockClients.filter(c => {
            const displayName = getClientDisplayName(c);
            return displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.clientNumber.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }, [searchTerm]);

    const clientPolicies = useMemo(() => {
        return selectedClient ? mockPolicies.filter(p => p.clientId === selectedClient.id) : [];
    }, [selectedClient]);

    const selectedOption = useMemo(() =>
        INSTALLMENT_OPTIONS.find(o => o.id === installments) || INSTALLMENT_OPTIONS[0]
        , [installments]);

    const basePremium = 7647;

    const reset = () => {
        setStep(1);
        setSearchTerm('');
        setSelectedClient(null);
        setSelectedPolicy(null);
        setInstallments('full');
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleSubmit = () => {
        onSuccess({
            clientId: selectedClient?.id,
            policyId: selectedPolicy?.id,
            amount: selectedOption.total,
            installments,
            status: 'in_review'
        });
        handleClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title=""
            size="2xl"
            className="overflow-hidden bg-surface-50 rounded-2xl shadow-2xl border border-surface-200/60"
        >
            <div className="flex flex-col h-full">
                {/* ── Dark Gradient Header with Step Stepper ── */}
                <div className="pf-modal-header px-8 pt-7 pb-6 relative overflow-hidden">
                    {/* Header Content */}
                    <div className="relative z-10 flex items-center justify-between mb-6">
                        <div>
                            <div className="flex items-center gap-2 mb-1.5">
                                <Wallet size={14} className="text-white/70" />
                                <p className="text-[10px] font-bold text-white/70 uppercase tracking-[0.25em]">New Financing Application</p>
                            </div>
                            <h2 className="text-xl font-bold text-white tracking-tight">
                                {STEPS[step - 1].label}
                            </h2>
                            <p className="text-white/60 text-xs mt-0.5">{STEPS[step - 1].sub}</p>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
                            <span className="text-xs font-bold text-white">Step {step}</span>
                            <span className="text-xs font-medium text-white/50">of 4</span>
                        </div>
                    </div>

                    {/* Connected Circular Step Indicators */}
                    <div className="relative z-10 flex items-center justify-between">
                        {STEPS.map((s, idx) => {
                            const isCompleted = step > s.id;
                            const isActive = step === s.id;
                            const Icon = s.icon;
                            return (
                                <div key={s.id} className="flex items-center flex-1 last:flex-none">
                                    <div className="flex flex-col items-center gap-1.5">
                                        <motion.div
                                            initial={false}
                                            animate={{
                                                scale: isActive ? 1.1 : 1,
                                                backgroundColor: isCompleted ? '#22c55e' : isActive ? '#ffffff' : 'rgba(255,255,255,0.1)',
                                            }}
                                            className={cn(
                                                "w-9 h-9 rounded-full flex items-center justify-center transition-all border-2",
                                                isCompleted ? 'border-green-400' : isActive ? 'border-white shadow-lg shadow-white/20' : 'border-white/20'
                                            )}
                                        >
                                            {isCompleted ? (
                                                <Check size={16} className="text-white" strokeWidth={3} />
                                            ) : (
                                                <Icon size={14} className={isActive ? 'text-surface-900' : 'text-white/50'} />
                                            )}
                                        </motion.div>
                                        <span className={cn(
                                            "text-[9px] font-bold uppercase tracking-wider whitespace-nowrap",
                                            isCompleted ? 'text-green-400' : isActive ? 'text-white' : 'text-white/40'
                                        )}>
                                            {s.label}
                                        </span>
                                    </div>
                                    {/* Connector line */}
                                    {idx < STEPS.length - 1 && (
                                        <div className="flex-1 mx-2 h-0.5 rounded-full overflow-hidden bg-white/10 mt-[-14px]">
                                            <motion.div
                                                initial={false}
                                                animate={{ width: isCompleted ? '100%' : '0%' }}
                                                transition={{ duration: 0.4, ease: 'easeOut' }}
                                                className="h-full bg-green-400 rounded-full"
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── Content Area ── */}
                <div className="flex-1 min-h-[480px] p-8 overflow-y-auto bg-gradient-to-b from-surface-50 to-white">
                    <AnimatePresence mode="wait">

                        {/* ═══ Step 1: Client Selection ═══ */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                variants={CONTAINER_VARIANTS}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="space-y-5"
                            >
                                {/* Search Bar */}
                                <motion.div variants={ITEM_VARIANTS} className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search by client name or number..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-12 pr-5 py-3.5 bg-white border border-surface-200 rounded-xl text-sm font-medium text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm"
                                    />
                                    {searchTerm && (
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-surface-400 font-medium">
                                            {filteredClients.length} found
                                        </span>
                                    )}
                                </motion.div>

                                {/* Client List */}
                                <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
                                    {filteredClients.map((client) => {
                                        const displayName = getClientDisplayName(client);
                                        return (
                                            <motion.button
                                                key={client.id}
                                                variants={ITEM_VARIANTS}
                                                whileHover={{ x: 4 }}
                                                whileTap={{ scale: 0.99 }}
                                                onClick={() => {
                                                    setSelectedClient(client);
                                                    setStep(2);
                                                }}
                                                className="w-full px-4 py-3.5 flex items-center gap-4 bg-white border border-surface-100 rounded-xl hover:border-primary-300 hover:shadow-md transition-all text-left group"
                                            >
                                                {/* Initials Avatar */}
                                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xs font-bold shrink-0 group-hover:shadow-lg group-hover:shadow-primary-500/20 transition-shadow">
                                                    {getInitials(displayName)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <h4 className="text-sm font-bold text-surface-900 truncate">{displayName}</h4>
                                                        <span className="px-1.5 py-0.5 bg-surface-100 rounded text-[9px] font-bold text-surface-500 uppercase shrink-0">{client.type}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-xs text-surface-400">
                                                        <span className="flex items-center gap-1 truncate">
                                                            <Mail size={11} className="shrink-0" /> {client.email}
                                                        </span>
                                                        <span className="text-surface-300">|</span>
                                                        <span className="shrink-0">{client.clientNumber}</span>
                                                    </div>
                                                </div>
                                                <ArrowRight size={16} className="text-surface-300 group-hover:text-primary-500 transition-colors shrink-0" />
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {/* ═══ Step 2: Policy Selection ═══ */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                variants={CONTAINER_VARIANTS}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="space-y-5"
                            >
                                {/* Selected Client Banner */}
                                <motion.div
                                    variants={ITEM_VARIANTS}
                                    className="p-5 bg-gradient-to-r from-surface-800 to-surface-900 rounded-xl flex items-center justify-between relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-primary-500/10 blur-[60px] -translate-y-1/2 translate-x-1/4" />
                                    <div className="relative z-10 flex items-center gap-4">
                                        <div className="w-11 h-11 rounded-lg bg-white/15 flex items-center justify-center text-white text-sm font-bold">
                                            {selectedClient ? getInitials(getClientDisplayName(selectedClient)) : ''}
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-white/60 uppercase tracking-[0.2em] mb-0.5">Selected Client</p>
                                            <p className="text-lg font-bold text-white tracking-tight">{selectedClient ? getClientDisplayName(selectedClient) : ''}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setStep(1)}
                                        className="relative z-10 text-xs font-semibold text-white/70 hover:text-white px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
                                    >
                                        Change
                                    </button>
                                </motion.div>

                                {/* Policy Count */}
                                <motion.div variants={ITEM_VARIANTS} className="flex items-center gap-2 px-1">
                                    <ShieldCheck size={14} className="text-primary-500" />
                                    <p className="text-xs font-semibold text-surface-500">
                                        {clientPolicies.length} active {clientPolicies.length === 1 ? 'policy' : 'policies'} found
                                    </p>
                                </motion.div>

                                {/* Policy Cards */}
                                <div className="space-y-3">
                                    {clientPolicies.map((policy) => (
                                        <motion.button
                                            key={policy.id}
                                            variants={ITEM_VARIANTS}
                                            whileHover={{ y: -2 }}
                                            onClick={() => {
                                                setSelectedPolicy(policy);
                                                setStep(3);
                                            }}
                                            className="w-full p-5 flex items-center gap-4 bg-white border border-surface-100 rounded-xl hover:border-primary-300 hover:shadow-lg transition-all text-left group"
                                        >
                                            <div className="w-11 h-11 rounded-lg bg-primary-50 flex items-center justify-center text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300 shrink-0">
                                                <ShieldCheck size={22} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h4 className="text-sm font-bold text-surface-900">{policy.policyNumber}</h4>
                                                    <span className="px-2 py-0.5 bg-success-50 rounded text-[9px] font-bold text-success-700 uppercase">Active</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-surface-400">
                                                    <span className="font-semibold text-surface-600">{policy.insuranceType}</span>
                                                    <span className="text-surface-300">|</span>
                                                    <span className="flex items-center gap-1">
                                                        <CalendarDays size={11} /> Exp. {policy.expiryDate}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-1 shrink-0">
                                                <p className="text-sm font-bold text-surface-900">{formatCurrency(policy.premiumAmount)}</p>
                                                <p className="text-[9px] text-surface-400 uppercase">Premium</p>
                                            </div>
                                        </motion.button>
                                    ))}

                                    {clientPolicies.length === 0 && (
                                        <motion.div variants={ITEM_VARIANTS} className="text-center py-12">
                                            <Shield size={40} className="mx-auto text-surface-200 mb-3" />
                                            <p className="text-sm text-surface-400 font-medium">No active policies found for this client</p>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* ═══ Step 3: Financing Plan ═══ */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                variants={CONTAINER_VARIANTS}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="space-y-5"
                            >
                                {/* Plan Header Info */}
                                <motion.div variants={ITEM_VARIANTS} className="flex items-center justify-between bg-primary-50 border border-primary-100 rounded-xl px-5 py-3.5">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp size={16} className="text-primary-600" />
                                        <span className="text-xs font-semibold text-primary-700">Base Premium</span>
                                    </div>
                                    <span className="text-sm font-bold text-primary-900">{formatCurrency(basePremium)}</span>
                                </motion.div>

                                {/* Installment Options */}
                                <div className="space-y-2.5">
                                    {INSTALLMENT_OPTIONS.map((option) => {
                                        const isSelected = installments === option.id;
                                        return (
                                            <motion.label
                                                key={option.id}
                                                variants={ITEM_VARIANTS}
                                                whileHover={{ y: -1 }}
                                                className={cn(
                                                    "relative p-4 border rounded-xl flex items-center gap-4 cursor-pointer transition-all duration-300",
                                                    isSelected
                                                        ? "bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-600/20 ring-2 ring-primary-300"
                                                        : "bg-white border-surface-150 hover:border-primary-200 hover:shadow-sm"
                                                )}
                                            >
                                                <input
                                                    type="radio"
                                                    name="installments"
                                                    value={option.id}
                                                    checked={isSelected}
                                                    onChange={() => setInstallments(option.id)}
                                                    className="hidden"
                                                />
                                                {/* Radio Circle */}
                                                <div className={cn(
                                                    "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                                                    isSelected ? 'border-white bg-white' : 'border-surface-300'
                                                )}>
                                                    {isSelected && (
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            className="w-2.5 h-2.5 rounded-full bg-primary-600"
                                                        />
                                                    )}
                                                </div>

                                                {/* Plan Details */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <p className={cn("text-sm font-bold", isSelected ? 'text-white' : 'text-surface-900')}>{option.label}</p>
                                                        {option.recommended && (
                                                            <span className={cn(
                                                                "px-2 py-0.5 rounded text-[9px] font-bold uppercase",
                                                                isSelected ? "bg-white/20 text-white" : "bg-success-50 text-success-700"
                                                            )}>Best Value</span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <p className={cn("text-xs", isSelected ? "text-white/70" : "text-surface-400")}>
                                                            {option.period}
                                                        </p>
                                                        {option.interest > 0 && (
                                                            <>
                                                                <span className={cn("text-xs", isSelected ? 'text-white/40' : 'text-surface-300')}>|</span>
                                                                <p className={cn("text-xs", isSelected ? "text-white/70" : "text-surface-400")}>
                                                                    {option.interest}% interest
                                                                </p>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Price */}
                                                <div className="text-right shrink-0">
                                                    <p className={cn("text-base font-bold", isSelected ? 'text-white' : 'text-surface-900')}>
                                                        {formatCurrency(option.total)}
                                                    </p>
                                                    {option.id !== 'full' && (
                                                        <p className={cn("text-[10px] font-medium", isSelected ? "text-white/60" : "text-surface-400")}>
                                                            {formatCurrency(option.monthly)}/mo
                                                        </p>
                                                    )}
                                                </div>
                                            </motion.label>
                                        );
                                    })}
                                </div>

                                {/* Cost Comparison Bar */}
                                <motion.div variants={ITEM_VARIANTS} className="bg-surface-50 border border-surface-100 rounded-xl p-4 space-y-2">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[10px] font-bold text-surface-400 uppercase tracking-wider">Cost vs Base Premium</span>
                                        <span className="text-[10px] font-semibold text-surface-500">
                                            {selectedOption.interest > 0 ? `+${selectedOption.interest}%` : 'No markup'}
                                        </span>
                                    </div>
                                    <div className="h-2 rounded-full bg-surface-200 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min((selectedOption.total / 10146.41) * 100, 100)}%` }}
                                            transition={{ duration: 0.5, ease: 'easeOut' }}
                                            className={cn(
                                                "h-full rounded-full",
                                                selectedOption.interest === 0 ? 'bg-success-500' :
                                                    selectedOption.interest < 20 ? 'bg-primary-500' :
                                                        'bg-warning-500'
                                            )}
                                        />
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}

                        {/* ═══ Step 4: Review & Confirm ═══ */}
                        {step === 4 && (
                            <motion.div
                                key="step4"
                                variants={CONTAINER_VARIANTS}
                                initial="hidden"
                                animate="visible"
                                className="space-y-5"
                            >
                                {/* Success Status */}
                                <motion.div
                                    variants={ITEM_VARIANTS}
                                    className="flex items-center gap-3 bg-success-50 border border-success-200 rounded-xl px-5 py-3.5"
                                >
                                    <div className="w-8 h-8 rounded-full bg-success-500 flex items-center justify-center shrink-0">
                                        <Check size={16} className="text-white" strokeWidth={3} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-success-800">Application Ready</p>
                                        <p className="text-xs text-success-600">All required information has been provided</p>
                                    </div>
                                </motion.div>

                                {/* Application Summary Card */}
                                <motion.div variants={ITEM_VARIANTS} className="bg-white border border-surface-100 rounded-xl overflow-hidden">
                                    <div className="px-5 py-3.5 bg-surface-50 border-b border-surface-100">
                                        <p className="text-xs font-bold text-surface-500 uppercase tracking-wider">Application Summary</p>
                                    </div>
                                    <div className="divide-y divide-surface-50">
                                        {/* Client */}
                                        <div className="px-5 py-3.5 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <User size={14} className="text-surface-400" />
                                                <span className="text-xs font-medium text-surface-500">Client</span>
                                            </div>
                                            <span className="text-sm font-bold text-surface-900">
                                                {selectedClient ? getClientDisplayName(selectedClient) : '—'}
                                            </span>
                                        </div>
                                        {/* Policy */}
                                        <div className="px-5 py-3.5 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <ShieldCheck size={14} className="text-surface-400" />
                                                <span className="text-xs font-medium text-surface-500">Policy</span>
                                            </div>
                                            <span className="text-sm font-bold text-surface-900">
                                                {selectedPolicy?.policyNumber ?? '—'}
                                            </span>
                                        </div>
                                        {/* Insurance Type */}
                                        <div className="px-5 py-3.5 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Building2 size={14} className="text-surface-400" />
                                                <span className="text-xs font-medium text-surface-500">Insurance Type</span>
                                            </div>
                                            <span className="text-sm font-semibold text-surface-700">
                                                {selectedPolicy?.insuranceType ?? '—'}
                                            </span>
                                        </div>
                                        {/* Plan */}
                                        <div className="px-5 py-3.5 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <CreditCard size={14} className="text-surface-400" />
                                                <span className="text-xs font-medium text-surface-500">Payment Plan</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-0.5 bg-primary-50 rounded text-[9px] font-bold text-primary-700 uppercase">{selectedOption.label}</span>
                                                {selectedOption.interest > 0 && (
                                                    <span className="text-xs text-surface-400">({selectedOption.interest}% int.)</span>
                                                )}
                                            </div>
                                        </div>
                                        {/* Monthly */}
                                        {selectedOption.id !== 'full' && (
                                            <div className="px-5 py-3.5 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <CalendarDays size={14} className="text-surface-400" />
                                                    <span className="text-xs font-medium text-surface-500">Monthly Installment</span>
                                                </div>
                                                <span className="text-sm font-bold text-surface-900">
                                                    {formatCurrency(selectedOption.monthly)}
                                                </span>
                                            </div>
                                        )}
                                        {/* Total */}
                                        <div className="px-5 py-4 flex items-center justify-between bg-surface-50">
                                            <div className="flex items-center gap-3">
                                                <DollarSign size={14} className="text-primary-600" />
                                                <span className="text-xs font-bold text-surface-700 uppercase tracking-wider">Total Amount</span>
                                            </div>
                                            <span className="text-lg font-black text-primary-700">{formatCurrency(selectedOption.total)}</span>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Verification Badge */}
                                <motion.div
                                    variants={ITEM_VARIANTS}
                                    className="flex items-center justify-center gap-2 py-3"
                                >
                                    <BadgeCheck size={16} className="text-primary-500" />
                                    <span className="text-xs font-semibold text-surface-500">Data verified and ready for submission</span>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* ── Footer Navigation ── */}
                <div className="px-8 py-5 bg-white border-t border-surface-100 flex items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => step > 1 ? setStep(step - 1) : handleClose()}
                        className="h-11 px-6 rounded-xl font-semibold text-surface-500 hover:text-surface-800 hover:bg-surface-50 transition-all flex items-center gap-2"
                    >
                        <ChevronLeft size={16} /> {step === 1 ? 'Cancel' : 'Back'}
                    </Button>
                    <div className="flex-1" />
                    <Button
                        className={cn(
                            "h-11 px-8 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2.5 shadow-md",
                            step === 4
                                ? "bg-success-600 hover:bg-success-500 text-white shadow-success-600/20"
                                : "bg-primary-600 hover:bg-primary-700 text-white shadow-primary-600/20"
                        )}
                        disabled={(step === 1 && !selectedClient) || (step === 2 && !selectedPolicy)}
                        onClick={() => step === 4 ? handleSubmit() : setStep(step + 1)}
                    >
                        {step === 4 ? (
                            <>Submit Application <Check size={16} strokeWidth={3} /></>
                        ) : (
                            <>Continue <ArrowRight size={16} /></>
                        )}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
