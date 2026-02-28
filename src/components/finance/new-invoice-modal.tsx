'use client';

import { useState, useMemo } from 'react';
import { Modal } from '@/components/ui/modal';
import { CustomSelect } from '@/components/ui/select-custom';
import {
    CheckCircle2,
    FileText,
    User,
    Shield,
    DollarSign,
    Calendar,
    Hash,
    AlignLeft,
} from 'lucide-react';
import { toast } from 'sonner';
import { mockClients } from '@/mock/clients';
import { mockPolicies } from '@/mock/policies';

interface NewInvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CURRENCY_OPTIONS = [
    { label: 'GHS — Ghana Cedis', value: 'GHS' },
    { label: 'USD — US Dollar', value: 'USD' },
    { label: 'EUR — Euro', value: 'EUR' },
];

export function NewInvoiceModal({ isOpen, onClose }: NewInvoiceModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [clientId, setClientId] = useState<string | number | null>(null);
    const [policyId, setPolicyId] = useState<string | number | null>(null);
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState<string | number | null>('GHS');
    const [dueDate, setDueDate] = useState('');
    const [description, setDescription] = useState('');

    // Build client options from mock data
    const clientOptions = useMemo(
        () =>
            mockClients
                .filter(c => c.status === 'active')
                .slice(0, 50)
                .map(c => ({
                    label: c.companyName || `${c.firstName ?? ''} ${c.lastName ?? ''}`.trim() || c.clientNumber,
                    value: c.id,
                })),
        []
    );

    // Build policy options filtered by selected client
    const policyOptions = useMemo(() => {
        if (!clientId) return [];
        return mockPolicies
            .filter(p => p.clientId === clientId && (p.status === 'active' || p.status === 'pending'))
            .map(p => ({
                label: `${p.policyNumber} — ${p.insuranceType}`,
                value: p.id,
            }));
    }, [clientId]);

    const selectedClient = useMemo(
        () => mockClients.find(c => c.id === clientId),
        [clientId]
    );
    const selectedPolicy = useMemo(
        () => mockPolicies.find(p => p.id === policyId),
        [policyId]
    );

    const resetForm = () => {
        setClientId(null);
        setPolicyId(null);
        setAmount('');
        setCurrency('GHS');
        setDueDate('');
        setDescription('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!clientId || !amount || !dueDate) return;

        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));

        const invNum = `INV-2026-${String(Math.floor(Math.random() * 9000) + 1000).padStart(3, '0')}`;

        toast.success('Invoice Created', {
            description: `${invNum} for ${selectedClient?.companyName || selectedClient?.clientNumber || 'Client'} — GHS ${parseFloat(amount).toLocaleString()}`,
            icon: <CheckCircle2 className="text-success-500" size={18} />,
        });

        resetForm();
        setIsLoading(false);
        onClose();
    };

    const footer = (
        <div className="flex justify-center gap-3 w-full">
            <button
                type="button"
                onClick={() => { resetForm(); onClose(); }}
                className="py-3 px-8 rounded-[var(--radius-2xl)] bg-surface-100 text-surface-700 font-bold hover:bg-surface-200 transition-all active:scale-95 cursor-pointer text-sm"
            >
                Cancel
            </button>
            <button
                type="button"
                disabled={isLoading || !clientId || !amount || !dueDate}
                onClick={handleSubmit}
                className="py-3 px-12 rounded-[var(--radius-2xl)] bg-primary-600 text-white font-bold hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20 active:scale-95 cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Creating…' : 'Create Invoice'}
            </button>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => { resetForm(); onClose(); }}
            title="Create New Invoice"
            description="Generate a premium invoice linked to a client and policy."
            size="xl"
            footer={footer}
            className="overflow-visible"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Client & Policy Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <User size={12} className="text-primary-500" /> Client *
                        </label>
                        <CustomSelect
                            options={clientOptions}
                            value={clientId}
                            onChange={(v) => { setClientId(v); setPolicyId(null); }}
                            placeholder="Select client…"
                            clearable
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Shield size={12} className="text-primary-500" /> Policy (Optional)
                        </label>
                        <CustomSelect
                            options={policyOptions}
                            value={policyId}
                            onChange={(v) => setPolicyId(v)}
                            placeholder={clientId ? 'Select policy…' : 'Select a client first'}
                            clearable
                        />
                    </div>
                </div>

                {/* Amount & Currency Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <DollarSign size={12} className="text-success-500" /> Amount *
                        </label>
                        <input
                            required
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="e.g. 15000.00"
                            className="w-full px-4 py-3.5 rounded-[var(--radius-lg)] border border-surface-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-bold text-surface-900 bg-white/50 shadow-sm placeholder:text-surface-400 tabular-nums"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Hash size={12} className="text-surface-400" /> Currency
                        </label>
                        <CustomSelect
                            options={CURRENCY_OPTIONS}
                            value={currency}
                            onChange={(v) => setCurrency(v)}
                            placeholder="Select currency"
                        />
                    </div>
                </div>

                {/* Due Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Calendar size={12} className="text-warning-500" /> Due Date *
                        </label>
                        <input
                            required
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full px-4 py-3.5 rounded-[var(--radius-lg)] border border-surface-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-semibold text-surface-700 bg-white/50 shadow-sm"
                        />
                    </div>
                    {selectedPolicy && (
                        <div className="flex items-end pb-1">
                            <div className="bg-primary-50 text-primary-700 rounded-lg px-4 py-3 text-xs font-medium w-full">
                                <p className="font-bold text-primary-800">{selectedPolicy.policyNumber}</p>
                                <p className="mt-0.5 text-primary-600">Premium: GHS {selectedPolicy.premiumAmount?.toLocaleString()}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <AlignLeft size={12} className="text-surface-400" /> Description
                    </label>
                    <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="e.g. Annual premium for Motor Comprehensive — Policy renewal 2026"
                        className="w-full px-4 py-3.5 rounded-[var(--radius-lg)] border border-surface-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-medium text-surface-700 bg-white/50 shadow-sm placeholder:text-surface-400 resize-none"
                    />
                </div>
            </form>
        </Modal>
    );
}
