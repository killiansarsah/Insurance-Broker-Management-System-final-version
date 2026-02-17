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
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, formatCurrency } from '@/lib/utils';
import { mockClients, getClientDisplayName } from '@/mock/clients';
import { mockPolicies } from '@/mock/policies';

// --- Static Data (Moved outside for stability) ---

const STEPS = [
    { id: 1, label: 'Customer', sub: 'Identify client profile', icon: User },
    { id: 2, label: 'Policy', sub: 'Link active coverage', icon: Shield },
    { id: 3, label: 'Plan', sub: 'Calibrate financing', icon: Zap },
    { id: 4, label: 'Review', sub: 'Final integrity check', icon: Sparkles },
];

const INSTALLMENT_OPTIONS = [
    { id: 'full', label: 'Full Payment', total: 7647, period: 'Upfront', recommended: true },
    { id: '3', label: '3 Months', total: 8215.39, period: 'Short-term' },
    { id: '6', label: '6 Months', total: 8821.71, period: 'Mid-term' },
    { id: '9', label: '9 Months', total: 9465.61, period: 'Extended' },
    { id: '12', label: '12 Months', total: 10146.41, period: 'Full Year' },
];

const CONTAINER_VARIANTS = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    exit: { opacity: 0, transition: { staggerChildren: 0.05, staggerDirection: -1 } }
};

const ITEM_VARIANTS = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, damping: 25, stiffness: 300 } },
    exit: { opacity: 0, scale: 0.95 }
};

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

    // Calculate current step metadata
    const currentStepData = STEPS[step - 1] || STEPS[0];
    const StepHeaderIcon = currentStepData.icon;

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title=""
            size="2xl"
            className="overflow-hidden bg-white/80 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-white/40"
        >
            <div className="flex flex-col h-full bg-slate-50/30">
                {/* Polished Header */}
                <div className="px-10 pt-10 pb-8 bg-white/60 backdrop-blur-md border-b border-white/20">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                    {StepHeaderIcon && <StepHeaderIcon size={16} />}
                                </div>
                                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em]">Application Flow</p>
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                                {currentStepData.label} <span className="text-slate-300">Phase</span>
                            </h2>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-slate-400 mb-1">{currentStepData.sub}</p>
                            <div className="flex items-center justify-end gap-1 px-4 py-1.5 bg-slate-100 rounded-full border border-slate-200/50">
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Step 0{step}</span>
                                <span className="text-[10px] font-bold text-slate-300 uppercase">/ 04</span>
                            </div>
                        </div>
                    </div>

                    {/* Fluid Step Indicator */}
                    <div className="flex gap-4">
                        {STEPS.map((s) => (
                            <div key={s.id} className="flex-1 space-y-2">
                                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden relative">
                                    <motion.div
                                        initial={false}
                                        animate={{
                                            width: step >= s.id ? '100%' : '0%',
                                            backgroundColor: step === s.id ? '#3b82f6' : step > s.id ? '#0f172a' : '#f1f5f9'
                                        }}
                                        className="h-full relative overflow-hidden"
                                    >
                                        {step === s.id && (
                                            <motion.div
                                                animate={{ x: ['-100%', '100%'] }}
                                                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                                            />
                                        )}
                                    </motion.div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Smooth Content Canvas */}
                <div className="flex-1 min-h-[520px] p-10 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                variants={CONTAINER_VARIANTS}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="space-y-8"
                            >
                                <motion.div variants={ITEM_VARIANTS} className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-transparent blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Identify client..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-16 pr-6 py-5 bg-white border border-slate-200/60 rounded-3xl text-lg font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all shadow-sm"
                                    />
                                </motion.div>

                                <div className="space-y-4">
                                    {filteredClients.map((client) => (
                                        <motion.button
                                            key={client.id}
                                            variants={ITEM_VARIANTS}
                                            whileHover={{ y: -4, scale: 1.01 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => {
                                                setSelectedClient(client);
                                                setStep(2);
                                            }}
                                            className="w-full p-6 flex items-center gap-6 bg-white/60 backdrop-blur-sm border border-white/40 rounded-3xl hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/5 transition-all text-left group relative overflow-hidden"
                                        >
                                            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500 ring-4 ring-slate-50/50">
                                                <User size={24} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h4 className="text-xl font-bold text-slate-900 leading-none">{getClientDisplayName(client)}</h4>
                                                    <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-500 uppercase tracking-widest">{client.type}</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-slate-400">
                                                    <span className="flex items-center gap-2"><Mail size={14} className="opacity-50" /> {client.email}</span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                                                    <span>{client.clientNumber}</span>
                                                </div>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                                                <ArrowRight size={20} />
                                            </div>
                                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                variants={CONTAINER_VARIANTS}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="space-y-8"
                            >
                                <motion.div variants={ITEM_VARIANTS} className="p-8 bg-slate-900 rounded-[2rem] flex items-center justify-between text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] -translate-y-1/2 translate-x-1/2" />
                                    <div className="relative z-10 flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-white ring-8 ring-white/5">
                                            <User size={32} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-2">Authenticated Profile</p>
                                            <p className="text-3xl font-bold tracking-tight">{selectedClient ? getClientDisplayName(selectedClient) : ''}</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        onClick={() => setStep(1)}
                                        className="relative z-10 h-14 w-14 rounded-2xl bg-white/5 hover:bg-white text-slate-400 hover:text-slate-900 transition-all"
                                    >
                                        <ChevronLeft size={24} />
                                    </Button>
                                </motion.div>

                                <div className="space-y-4">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Active Policies Found ({clientPolicies.length})</p>
                                    {clientPolicies.map((policy) => (
                                        <motion.button
                                            key={policy.id}
                                            variants={ITEM_VARIANTS}
                                            whileHover={{ x: 8 }}
                                            onClick={() => {
                                                setSelectedPolicy(policy);
                                                setStep(3);
                                            }}
                                            className="w-full p-6 flex items-center gap-6 bg-white border border-slate-100 rounded-3xl hover:border-blue-500/30 hover:shadow-xl hover:shadow-slate-200/50 transition-all text-left group"
                                        >
                                            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500 shadow-inner">
                                                <ShieldCheck size={28} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-4 mb-2">
                                                    <h4 className="text-xl font-bold text-slate-900">{policy.policyNumber}</h4>
                                                    <span className="px-3 py-1 bg-green-50 rounded-full text-[10px] font-bold text-green-700 uppercase tracking-widest">Nominal</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-slate-400 text-left">
                                                    <span className="font-bold text-slate-900">{policy.insuranceType}</span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                                                    <span>Expires {policy.expiryDate}</span>
                                                </div>
                                            </div>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Zap size={20} className="text-blue-500 animate-pulse" />
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                variants={CONTAINER_VARIANTS}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="space-y-8"
                            >
                                <div className="grid grid-cols-1 gap-4">
                                    {INSTALLMENT_OPTIONS.map((option) => (
                                        <motion.label
                                            key={option.id}
                                            variants={ITEM_VARIANTS}
                                            whileHover={{ scale: 1.01 }}
                                            className={cn(
                                                "relative p-7 border rounded-[2rem] flex items-center justify-between cursor-pointer transition-all duration-500 overflow-hidden",
                                                installments === option.id
                                                    ? "bg-blue-600 border-blue-600 text-white shadow-2xl shadow-blue-600/30 ring-8 ring-blue-50"
                                                    : "bg-white border-slate-100 text-slate-900 hover:border-blue-500/20 shadow-sm"
                                            )}
                                        >
                                            <div className="flex items-center gap-8 relative z-10">
                                                <input
                                                    type="radio"
                                                    name="installments"
                                                    value={option.id}
                                                    checked={installments === option.id}
                                                    onChange={() => setInstallments(option.id)}
                                                    className="hidden"
                                                />
                                                <div className={cn(
                                                    "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500",
                                                    installments === option.id ? "bg-white text-blue-600" : "bg-slate-50 text-slate-400"
                                                )}>
                                                    {option.recommended ? <Zap size={28} /> : <DollarSign size={28} />}
                                                </div>
                                                <div className="text-left">
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <p className="text-xl font-bold tracking-tight">{option.label}</p>
                                                        {option.recommended && (
                                                            <span className={cn(
                                                                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                                                installments === option.id ? "bg-white/20 text-white" : "bg-blue-50 text-blue-600"
                                                            )}>Best Value</span>
                                                        )}
                                                    </div>
                                                    <p className={cn(
                                                        "text-sm font-medium",
                                                        installments === option.id ? "text-blue-100" : "text-slate-400"
                                                    )}>{option.period} Term • No Hidden Fees</p>
                                                </div>
                                            </div>
                                            <div className="text-right relative z-10">
                                                <p className="text-3xl font-black italic tracking-tighter">{formatCurrency(option.total)}</p>
                                                <p className={cn(
                                                    "text-[10px] font-bold uppercase tracking-widest",
                                                    installments === option.id ? "text-blue-200" : "text-slate-300"
                                                )}>Inclusive Rate</p>
                                            </div>
                                            {installments === option.id && (
                                                <motion.div
                                                    layoutId="active-bg"
                                                    className="absolute inset-0 bg-blue-600 opacity-90 -z-0"
                                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                                />
                                            )}
                                        </motion.label>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="step4"
                                variants={CONTAINER_VARIANTS}
                                initial="hidden"
                                animate="visible"
                                className="h-full flex flex-col items-center justify-center text-center space-y-12 py-10"
                            >
                                <motion.div variants={ITEM_VARIANTS} className="relative">
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                        className="absolute -inset-12 bg-blue-500 rounded-full blur-[60px]"
                                    />
                                    <div className="w-32 h-32 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-[0_20px_60px_rgba(15,23,42,0.4)] relative z-10 border-8 border-white">
                                        <Check size={64} strokeWidth={3} />
                                    </div>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                                        className="absolute inset-[-12px] border-2 border-dashed border-slate-200 rounded-full"
                                    />
                                </motion.div>

                                <motion.div variants={ITEM_VARIANTS} className="space-y-4">
                                    <h3 className="text-4xl font-bold text-slate-900 tracking-tighter italic">Calibration Success</h3>
                                    <p className="text-slate-500 max-w-sm mx-auto font-medium leading-relaxed text-center">
                                        Data integrity verified. System ready to broadcast financing request for <span className="text-blue-600 font-bold">{selectedClient ? getClientDisplayName(selectedClient) : 'the client'}</span>.
                                    </p>
                                </motion.div>

                                <motion.div variants={ITEM_VARIANTS} className="w-full max-w-md p-8 bg-white/60 backdrop-blur-md border border-white rounded-[2.5rem] shadow-xl space-y-6 relative group overflow-hidden text-left">
                                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-12 transition-transform">
                                        <Sparkles size={80} className="text-blue-600" />
                                    </div>
                                    <div className="flex justify-between items-center text-sm relative z-10">
                                        <span className="text-slate-400 font-bold uppercase tracking-widest">Total Liquidation</span>
                                        <span className="text-3xl font-black text-slate-900 italic tracking-tighter font-mono">{formatCurrency(selectedOption.total)}</span>
                                    </div>
                                    <div className="h-px bg-slate-100" />
                                    <div className="flex justify-between items-center text-sm relative z-10">
                                        <span className="text-slate-400 font-bold uppercase tracking-widest">Selected Plan</span>
                                        <div className="flex items-center gap-3">
                                            <span className="px-3 py-1 bg-blue-50 rounded-full text-[10px] font-bold text-blue-600 uppercase tracking-widest">{selectedOption.label}</span>
                                            <Zap size={14} className="text-blue-500" />
                                        </div>
                                    </div>
                                    <div className="pt-4 flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-green-600">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span>Security_Seal_Applied</span>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Polished Footer Navigation */}
                <div className="p-10 bg-white/60 backdrop-blur-md border-t border-white/20 flex items-center gap-6">
                    <Button
                        variant="ghost"
                        onClick={() => step > 1 ? setStep(step - 1) : handleClose()}
                        className="h-16 px-10 rounded-2xl font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:bg-slate-100/50 transition-all flex items-center gap-3 italic"
                    >
                        <ChevronLeft size={20} /> {step === 1 ? 'Cancel' : 'Prev_Phase'}
                    </Button>
                    <Button
                        className={cn(
                            "flex-1 h-16 rounded-[1.25rem] text-white transition-all duration-700 font-bold uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-4 italic group",
                            step === 4
                                ? "bg-green-600 hover:bg-green-500 shadow-green-600/20"
                                : "bg-slate-900 hover:bg-slate-800 shadow-slate-900/20"
                        )}
                        disabled={step === 1 && !selectedClient || (step === 2 && !selectedPolicy)}
                        onClick={() => step === 4 ? handleSubmit() : setStep(step + 1)}
                    >
                        {step === 4 ? (
                            <>Confirm_Broadcast <Zap size={20} className="fill-current animate-pulse" /></>
                        ) : (
                            <>Continue_Sequence <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" /></>
                        )}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
