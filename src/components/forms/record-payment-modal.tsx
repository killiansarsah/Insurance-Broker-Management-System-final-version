'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { MoMoPaymentForm } from '@/components/forms/momo-payment-form';
import { usePaymentStore } from '@/stores/payment-store';
import { formatCurrency, cn } from '@/lib/utils';
import { toast } from 'sonner';
import { generateReceipt } from '@/lib/generate-receipt';
import type { PaymentMethod, MoMoNetwork, Transaction } from '@/types';
import {
    CreditCard,
    Building,
    Smartphone,
    Banknote,
    FileCheck,
    CheckCircle2,
    Loader2,
} from 'lucide-react';

interface RecordPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    policyId: string;
    policyNumber: string;
    clientId: string;
    clientName: string;
    outstandingBalance: number;
    currency?: string;
}

const PAYMENT_METHODS: { id: PaymentMethod; label: string; icon: React.ReactNode; description: string }[] = [
    { id: 'mobile_money', label: 'Mobile Money', icon: <Smartphone size={20} />, description: 'MTN MoMo, Telecel Cash, AT Money' },
    { id: 'bank_transfer', label: 'Bank Transfer', icon: <Building size={20} />, description: 'Direct bank deposit or transfer' },
    { id: 'cash', label: 'Cash', icon: <Banknote size={20} />, description: 'Cash payment at office' },
    { id: 'cheque', label: 'Cheque', icon: <FileCheck size={20} />, description: 'Bank cheque payment' },
    { id: 'card', label: 'Card', icon: <CreditCard size={20} />, description: 'Visa / Mastercard' },
];

export function RecordPaymentModal({
    isOpen,
    onClose,
    policyId,
    policyNumber,
    clientId,
    clientName,
    outstandingBalance,
    currency = 'GHS',
}: RecordPaymentModalProps) {
    const { addTransaction } = usePaymentStore();
    const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);

    const [step, setStep] = useState<'method' | 'details' | 'confirm' | 'success'>('method');
    const [method, setMethod] = useState<PaymentMethod>('mobile_money');
    const [amount, setAmount] = useState(outstandingBalance > 0 ? outstandingBalance.toString() : '');
    const [reference, setReference] = useState('');
    const [description, setDescription] = useState('Premium Payment');
    const [isProcessing, setIsProcessing] = useState(false);

    // MoMo-specific
    const [momoNetwork, setMomoNetwork] = useState<MoMoNetwork>('mtn');
    const [phoneNumber, setPhoneNumber] = useState('');

    // Bank-specific
    const [bankName, setBankName] = useState('');

    // Cheque-specific
    const [chequeNumber, setChequeNumber] = useState('');

    const [errors, setErrors] = useState<Record<string, string>>({});

    const parsedAmount = parseFloat(amount) || 0;

    function resetForm() {
        setStep('method');
        setMethod('mobile_money');
        setAmount(outstandingBalance > 0 ? outstandingBalance.toString() : '');
        setReference('');
        setDescription('Premium Payment');
        setMomoNetwork('mtn');
        setPhoneNumber('');
        setBankName('');
        setChequeNumber('');
        setErrors({});
        setIsProcessing(false);
    }

    function handleClose() {
        resetForm();
        onClose();
    }

    function validateDetails(): boolean {
        const newErrors: Record<string, string> = {};

        if (!amount || parsedAmount <= 0) {
            newErrors.amount = 'Enter a valid amount';
        }
        if (parsedAmount > outstandingBalance * 1.1 && outstandingBalance > 0) {
            newErrors.amount = 'Amount exceeds outstanding balance';
        }

        if (method === 'mobile_money') {
            if (!phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
            else if (!/^0[2-5]\d{8}$/.test(phoneNumber.replace(/\s/g, '')))
                newErrors.phoneNumber = 'Use format 0XX XXX XXXX';
        }

        if (method === 'bank_transfer' && !bankName.trim()) {
            newErrors.bankName = 'Bank name is required';
        }

        if (method === 'cheque' && !chequeNumber.trim()) {
            newErrors.chequeNumber = 'Cheque number is required';
        }

        if (!reference.trim()) {
            newErrors.reference = 'Reference is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit() {
        setIsProcessing(true);

        // Simulate network delay
        await new Promise((r) => setTimeout(r, 2500));

        const txn: Transaction = {
            id: `TXN-${Date.now().toString(36).toUpperCase()}`,
            policyId,
            policyNumber,
            clientId,
            clientName,
            amount: parsedAmount,
            currency,
            status: 'paid',
            method,
            momoNetwork: method === 'mobile_money' ? momoNetwork : undefined,
            phoneNumber: method === 'mobile_money' ? phoneNumber : undefined,
            reference,
            description,
            processedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
        };

        addTransaction(txn);
        setLastTransaction(txn);
        setIsProcessing(false);
        setStep('success');
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Record Payment" size="lg">
            <div className="min-h-[360px] flex flex-col">
                {/* Step Indicator */}
                {step !== 'success' && (
                    <div className="flex items-center gap-2 mb-6 px-1">
                        {(['method', 'details', 'confirm'] as const).map((s, i) => (
                            <div key={s} className="flex items-center gap-2 flex-1">
                                <div className={cn(
                                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors',
                                    step === s ? 'bg-primary-500 text-white' :
                                        (['method', 'details', 'confirm'].indexOf(step) > i)
                                            ? 'bg-success-500 text-white'
                                            : 'bg-surface-100 text-surface-400'
                                )}>
                                    {(['method', 'details', 'confirm'].indexOf(step) > i) ? <CheckCircle2 size={14} /> : i + 1}
                                </div>
                                <span className={cn(
                                    'text-xs font-semibold hidden sm:inline',
                                    step === s ? 'text-surface-900' : 'text-surface-400'
                                )}>
                                    {s === 'method' ? 'Method' : s === 'details' ? 'Details' : 'Confirm'}
                                </span>
                                {i < 2 && <div className="flex-1 h-px bg-surface-200" />}
                            </div>
                        ))}
                    </div>
                )}

                {/* Step 1: Payment Method */}
                {step === 'method' && (
                    <div className="flex-1 space-y-3">
                        <p className="text-sm text-surface-500 mb-4">Select the payment method used by the client.</p>
                        <div className="space-y-2">
                            {PAYMENT_METHODS.map((pm) => (
                                <button
                                    key={pm.id}
                                    type="button"
                                    onClick={() => setMethod(pm.id)}
                                    className={cn(
                                        'w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left',
                                        method === pm.id
                                            ? 'border-primary-500 bg-primary-50/50 ring-1 ring-primary-500/20'
                                            : 'border-surface-200 hover:border-surface-300 hover:bg-surface-50'
                                    )}
                                >
                                    <div className={cn(
                                        'p-2.5 rounded-lg',
                                        method === pm.id ? 'bg-primary-100 text-primary-600' : 'bg-surface-100 text-surface-500'
                                    )}>
                                        {pm.icon}
                                    </div>
                                    <div className="flex-1">
                                        <p className={cn(
                                            'font-semibold text-sm',
                                            method === pm.id ? 'text-primary-700' : 'text-surface-900'
                                        )}>
                                            {pm.label}
                                        </p>
                                        <p className="text-xs text-surface-500">{pm.description}</p>
                                    </div>
                                    <div className={cn(
                                        'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                                        method === pm.id ? 'border-primary-500' : 'border-surface-300'
                                    )}>
                                        {method === pm.id && <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />}
                                    </div>
                                </button>
                            ))}
                        </div>
                        <div className="pt-4 flex justify-end">
                            <Button variant="primary" onClick={() => setStep('details')}>
                                Continue
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 2: Payment Details */}
                {step === 'details' && (
                    <div className="flex-1 space-y-5">
                        {/* Amount */}
                        <div>
                            <label className="block text-xs font-semibold text-surface-600 mb-1.5">
                                Payment Amount ({currency}) <span className="text-danger-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={amount}
                                onChange={(e) => { setAmount(e.target.value); setErrors((p) => ({ ...p, amount: '' })); }}
                                className={cn(
                                    'w-full px-4 py-3 text-lg font-bold rounded-xl border bg-surface-50 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all tabular-nums',
                                    errors.amount ? 'border-danger-400' : 'border-surface-200'
                                )}
                                placeholder="0.00"
                            />
                            {outstandingBalance > 0 && (
                                <p className="text-xs text-surface-500 mt-1">Outstanding: <span className="font-semibold text-danger-600">{formatCurrency(outstandingBalance)}</span></p>
                            )}
                            {errors.amount && <p className="text-xs text-danger-500 mt-1">{errors.amount}</p>}
                        </div>

                        {/* Reference */}
                        <div>
                            <label className="block text-xs font-semibold text-surface-600 mb-1.5">
                                Reference Number <span className="text-danger-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={reference}
                                onChange={(e) => { setReference(e.target.value); setErrors((p) => ({ ...p, reference: '' })); }}
                                className={cn(
                                    'w-full px-4 py-2.5 text-sm rounded-xl border bg-surface-50 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-mono',
                                    errors.reference ? 'border-danger-400' : 'border-surface-200'
                                )}
                                placeholder={method === 'mobile_money' ? 'MOMO-2026-XXX' : method === 'bank_transfer' ? 'BNK-2026-XXX' : 'REF-XXX'}
                            />
                            {errors.reference && <p className="text-xs text-danger-500 mt-1">{errors.reference}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-semibold text-surface-600 mb-1.5">
                                Description
                            </label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-2.5 text-sm rounded-xl border border-surface-200 bg-surface-50 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                                placeholder="Premium Payment"
                            />
                        </div>

                        {/* Method-specific fields */}
                        {method === 'mobile_money' && (
                            <div className="space-y-4 pt-2 border-t border-surface-100">
                                <MoMoPaymentForm
                                    network={momoNetwork}
                                    phoneNumber={phoneNumber}
                                    onNetworkChange={setMomoNetwork}
                                    onPhoneChange={(v) => { setPhoneNumber(v); setErrors((p) => ({ ...p, phoneNumber: '' })); }}
                                />
                                {errors.phoneNumber && <p className="text-xs text-danger-500 -mt-2">{errors.phoneNumber}</p>}
                            </div>
                        )}

                        {method === 'bank_transfer' && (
                            <div>
                                <label className="block text-xs font-semibold text-surface-600 mb-1.5">
                                    Bank Name <span className="text-danger-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={bankName}
                                    onChange={(e) => { setBankName(e.target.value); setErrors((p) => ({ ...p, bankName: '' })); }}
                                    className={cn(
                                        'w-full px-4 py-2.5 text-sm rounded-xl border bg-surface-50 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all',
                                        errors.bankName ? 'border-danger-400' : 'border-surface-200'
                                    )}
                                    placeholder="e.g. GCB Bank, Ecobank, Stanbic"
                                />
                                {errors.bankName && <p className="text-xs text-danger-500 mt-1">{errors.bankName}</p>}
                            </div>
                        )}

                        {method === 'cheque' && (
                            <div>
                                <label className="block text-xs font-semibold text-surface-600 mb-1.5">
                                    Cheque Number <span className="text-danger-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={chequeNumber}
                                    onChange={(e) => { setChequeNumber(e.target.value); setErrors((p) => ({ ...p, chequeNumber: '' })); }}
                                    className={cn(
                                        'w-full px-4 py-2.5 text-sm rounded-xl border bg-surface-50 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-mono',
                                        errors.chequeNumber ? 'border-danger-400' : 'border-surface-200'
                                    )}
                                    placeholder="000000"
                                />
                                {errors.chequeNumber && <p className="text-xs text-danger-500 mt-1">{errors.chequeNumber}</p>}
                            </div>
                        )}

                        <div className="pt-4 flex justify-between">
                            <Button variant="outline" onClick={() => setStep('method')}>Back</Button>
                            <Button variant="primary" onClick={() => {
                                if (validateDetails()) setStep('confirm');
                            }}>Review Payment</Button>
                        </div>
                    </div>
                )}

                {/* Step 3: Confirmation */}
                {step === 'confirm' && (
                    <div className="flex-1 space-y-5">
                        <div className="rounded-2xl border border-surface-200 bg-surface-50/50 p-5 space-y-4">
                            <div className="text-center pb-3 border-b border-surface-200">
                                <p className="text-xs text-surface-500 uppercase tracking-wider font-semibold">Payment Amount</p>
                                <p className="text-3xl font-bold text-surface-900 tabular-nums mt-1">{formatCurrency(parsedAmount)}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-xs text-surface-500">Client</p>
                                    <p className="font-semibold text-surface-900">{clientName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-surface-500">Policy</p>
                                    <p className="font-semibold text-surface-900 font-mono">{policyNumber}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-surface-500">Method</p>
                                    <p className="font-semibold text-surface-900 capitalize">
                                        {PAYMENT_METHODS.find(m => m.id === method)?.label}
                                        {method === 'mobile_money' && ` (${momoNetwork.toUpperCase()})`}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-surface-500">Reference</p>
                                    <p className="font-semibold text-surface-900 font-mono">{reference}</p>
                                </div>
                                {method === 'mobile_money' && (
                                    <div>
                                        <p className="text-xs text-surface-500">Phone</p>
                                        <p className="font-semibold text-surface-900">{phoneNumber}</p>
                                    </div>
                                )}
                                {method === 'bank_transfer' && (
                                    <div>
                                        <p className="text-xs text-surface-500">Bank</p>
                                        <p className="font-semibold text-surface-900">{bankName}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pt-2 flex justify-between">
                            <Button variant="outline" onClick={() => setStep('details')} disabled={isProcessing}>Back</Button>
                            <Button
                                variant="primary"
                                onClick={handleSubmit}
                                isLoading={isProcessing}
                                disabled={isProcessing}
                                className="bg-success-600 hover:bg-success-700 border-success-600"
                            >
                                {isProcessing ? 'Processing...' : 'Confirm Payment'}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 4: Success */}
                {step === 'success' && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-8 space-y-5">
                        <div className="w-16 h-16 rounded-full bg-success-100 flex items-center justify-center">
                            <CheckCircle2 size={32} className="text-success-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-surface-900">Payment Recorded</h3>
                            <p className="text-sm text-surface-500 mt-1">
                                {formatCurrency(parsedAmount)} received from {clientName}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={handleClose}>Close</Button>
                            <Button variant="primary" onClick={() => {
                                if (lastTransaction) generateReceipt(lastTransaction);
                            }}>
                                Download Receipt
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
}
