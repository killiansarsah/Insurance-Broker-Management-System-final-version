'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    ArrowRight,
    Check,
    User,
    Shield,
    FileText,
    Calculator,
    CreditCard,
    Search,
    CheckCircle2,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn, formatCurrency } from '@/lib/utils';
import { mockClients } from '@/mock/clients';
import type { InsuranceType } from '@/types';
import { CustomSelect } from '@/components/ui/select-custom';
import { BackButton } from '@/components/ui/back-button';

const STEPS = [
    { id: 1, label: 'Client Selection', icon: <User size={16} /> },
    { id: 2, label: 'Product & Insurer', icon: <Shield size={16} /> },
    { id: 3, label: 'Coverage Details', icon: <FileText size={16} /> },
    { id: 4, label: 'Premium Calc', icon: <Calculator size={16} /> },
    { id: 5, label: 'Review', icon: <CheckCircle2 size={16} /> },
];

const INSURANCE_TYPES: { label: string; value: InsuranceType }[] = [
    { label: 'Motor', value: 'motor' },
    { label: 'Fire', value: 'fire' },
    { label: 'Marine', value: 'marine' },
    { label: 'Health', value: 'health' },
    { label: 'Life', value: 'life' },
    { label: 'Liability', value: 'liability' },
    { label: 'Engineering', value: 'engineering' },
    { label: 'Bonds', value: 'bonds' },
    { label: 'Travel', value: 'travel' },
];

interface FormData {
    clientId: string;
    clientName: string;
    insuranceType: InsuranceType | '';
    insurerName: string;
    inceptionDate: string;
    expiryDate: string;
    sumInsured: number;
    premiumRate: number;
    premiumAmount: number;
    coverageDetails: string;
    currency: string;
    commissionRate: number;
}

const INITIAL_FORM: FormData = {
    clientId: '',
    clientName: '',
    insuranceType: '',
    insurerName: '',
    inceptionDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    sumInsured: 0,
    premiumRate: 0,
    premiumAmount: 0,
    coverageDetails: '',
    currency: 'GHS',
    commissionRate: 10,
};

export default function NewPolicyPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [form, setForm] = useState<FormData>(INITIAL_FORM);
    const [clientSearch, setClientSearch] = useState('');

    const filteredClients = clientSearch
        ? mockClients.filter(c =>
            c.firstName?.toLowerCase().includes(clientSearch.toLowerCase()) ||
            c.lastName?.toLowerCase().includes(clientSearch.toLowerCase()) ||
            c.companyName?.toLowerCase().includes(clientSearch.toLowerCase()) ||
            c.clientNumber.toLowerCase().includes(clientSearch.toLowerCase())
        ).slice(0, 5)
        : [];

    function update<K extends keyof FormData>(field: K, value: FormData[K]) {
        setForm(prev => {
            const next = { ...prev, [field]: value };

            // Auto-calc premium if sumInsured or rate changes
            if (field === 'sumInsured' || field === 'premiumRate') {
                const sum = field === 'sumInsured' ? (value as number) : prev.sumInsured;
                const rate = field === 'premiumRate' ? (value as number) : prev.premiumRate;
                next.premiumAmount = (sum * rate) / 100;
            }
            return next;
        });
    }

    function handleNext() {
        if (step < 5) setStep(step + 1);
        else {
            alert('Policy created successfully (mock)!');
            router.push('/dashboard/policies');
        }
    }

    return (
        <div className="w-full space-y-6 animate-fade-in pb-10" style={{ maxWidth: '56rem', margin: '0 auto' }}>
            {/* Header */}
            <div className="flex items-center gap-3">
                <BackButton href="/dashboard/policies" />
                <div>
                    <h1 className="text-2xl font-bold text-surface-900 tracking-tight">New Policy</h1>
                    <p className="text-sm text-surface-500">Create a new insurance policy record.</p>
                </div>
            </div>

            {/* Stepper */}
            <div className="flex items-center justify-between relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-surface-200 -z-10" />
                {STEPS.map((s) => {
                    const isActive = s.id === step;
                    const isCompleted = s.id < step;
                    return (
                        <div key={s.id} className="flex flex-col items-center gap-2 bg-background px-2">
                            <div className={cn(
                                'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2',
                                isActive ? 'border-primary-500 bg-primary-50 text-primary-600' :
                                    isCompleted ? 'border-success-500 bg-success-500 text-white' :
                                        'border-surface-200 bg-surface-50 text-surface-400'
                            )}>
                                {isCompleted ? <Check size={20} /> : s.icon}
                            </div>
                            <span className={cn(
                                'text-xs font-semibold whitespace-nowrap',
                                isActive ? 'text-primary-600' : isCompleted ? 'text-success-600' : 'text-surface-400'
                            )}>
                                {s.label}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Content */}
            <Card padding="lg" className="min-h-[400px]">
                {step === 1 && (
                    <div className="flex flex-col items-center gap-6">
                        <div className="text-center">
                            <h2 className="text-lg font-bold text-surface-900">Select Client</h2>
                            <p className="text-sm text-surface-500">Search for an existing client to link this policy.</p>
                        </div>
                        <div className="relative w-full" style={{ maxWidth: '32rem' }}>
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search client name or ID..."
                                className="w-full pl-10 pr-4 py-3 bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                value={clientSearch}
                                onChange={(e) => setClientSearch(e.target.value)}
                            />
                        </div>
                        <div className="w-full" style={{ maxWidth: '32rem' }}>
                            {filteredClients.map(client => (
                                <button
                                    key={client.id}
                                    onClick={() => {
                                        update('clientId', client.id);
                                        update('clientName', client.companyName || `${client.firstName} ${client.lastName}`);
                                        handleNext();
                                    }}
                                    className="w-full flex items-center justify-between p-3 hover:bg-primary-50 rounded-[var(--radius-md)] border border-transparent hover:border-primary-200 transition-all group text-left"
                                >
                                    <div>
                                        <p className="font-semibold text-surface-900">{client.companyName || `${client.firstName} ${client.lastName}`}</p>
                                        <p className="text-xs text-surface-500">{client.clientNumber} • {client.email}</p>
                                    </div>
                                    <ArrowRight size={16} className="text-surface-300 group-hover:text-primary-500 opacity-0 group-hover:opacity-100 transition-all" />
                                </button>
                            ))}
                            {clientSearch && filteredClients.length === 0 && (
                                <div className="text-center py-8 text-surface-500">
                                    <p>No client found.</p>
                                    <Button variant="outline" size="sm" className="mt-2 text-xs" onClick={() => router.push('/dashboard/clients/new')}>
                                        Create New Client
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h2 className="text-lg font-bold text-surface-900">Coverage Type</h2>
                            <div className="grid grid-cols-2 gap-3">
                                {INSURANCE_TYPES.map(type => (
                                    <button
                                        key={type.value}
                                        onClick={() => update('insuranceType', type.value)}
                                        className={cn(
                                            'p-3 rounded-[var(--radius-md)] border text-left transition-all',
                                            form.insuranceType === type.value
                                                ? 'border-primary-500 bg-primary-50 text-primary-700 font-medium'
                                                : 'border-surface-200 hover:border-primary-200 text-surface-600'
                                        )}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-lg font-bold text-surface-900">Insurer Details</h2>
                            <div>
                                <label className="block text-xs font-medium text-surface-600 mb-1.5">Insurance Company</label>
                                <CustomSelect
                                    placeholder="Select Insurer..."
                                    options={[
                                        { label: 'Enterprise Insurance', value: 'Enterprise Insurance' },
                                        { label: 'SIC Insurance', value: 'SIC Insurance' },
                                        { label: 'Star Assurance', value: 'Star Assurance' },
                                        { label: 'Hollard Insurance', value: 'Hollard Insurance' },
                                        { label: 'Glico General', value: 'Glico General' },
                                    ]}
                                    value={form.insurerName}
                                    onChange={(v) => update('insurerName', v as string)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-surface-600 mb-1.5">Policy Currency</label>
                                <CustomSelect
                                    options={[
                                        { label: 'GHS - Ghanaian Cedi', value: 'GHS' },
                                        { label: 'USD - US Dollar', value: 'USD' },
                                        { label: 'EUR - Euro', value: 'EUR' },
                                    ]}
                                    value={form.currency}
                                    onChange={(v) => update('currency', v as string)}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="flex flex-col gap-6 items-center w-full">
                        <div className="grid grid-cols-2 gap-4 w-full" style={{ maxWidth: '42rem' }}>
                            <div>
                                <label className="block text-xs font-medium text-surface-600 mb-1.5">Inception Date</label>
                                <input
                                    type="date"
                                    className="w-full p-2.5 bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] outline-none focus:border-primary-500"
                                    value={form.inceptionDate}
                                    onChange={(e) => update('inceptionDate', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-surface-600 mb-1.5">Expiry Date</label>
                                <input
                                    type="date"
                                    className="w-full p-2.5 bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] outline-none focus:border-primary-500"
                                    value={form.expiryDate}
                                    onChange={(e) => update('expiryDate', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="w-full" style={{ maxWidth: '42rem' }}>
                            <label className="block text-xs font-medium text-surface-600 mb-1.5">Coverage Description / Risk Details</label>
                            <textarea
                                rows={4}
                                className="w-full p-3 bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] outline-none focus:border-primary-500 resize-none"
                                placeholder="e.g. 2021 Toyota Hilux, Reg: GR-1234-21, Chassis: ..."
                                value={form.coverageDetails}
                                onChange={(e) => update('coverageDetails', e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start w-full" style={{ maxWidth: '48rem', margin: '0 auto' }}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-surface-600 mb-1.5">Sum Insured ({form.currency})</label>
                                <input
                                    type="number"
                                    className="w-full p-2.5 bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] outline-none focus:border-primary-500"
                                    value={form.sumInsured || ''}
                                    onChange={(e) => update('sumInsured', parseFloat(e.target.value))}
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-surface-600 mb-1.5">Premium Rate (%)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="w-full p-2.5 bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] outline-none focus:border-primary-500"
                                    value={form.premiumRate || ''}
                                    onChange={(e) => update('premiumRate', parseFloat(e.target.value))}
                                    placeholder="e.g. 1.5"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-surface-600 mb-1.5">Commission Rate (%)</label>
                                <input
                                    type="number"
                                    step="0.5"
                                    className="w-full p-2.5 bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] outline-none focus:border-primary-500"
                                    value={form.commissionRate || ''}
                                    onChange={(e) => update('commissionRate', parseFloat(e.target.value))}
                                />
                            </div>
                        </div>
                        <div className="bg-surface-50 p-6 rounded-[var(--radius-lg)] space-y-4 border border-surface-200">
                            <h3 className="text-sm font-bold text-surface-900 uppercase tracking-wide">Calculations</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-surface-500">Gross Premium</span>
                                    <span className="font-medium text-surface-900">{formatCurrency(form.premiumAmount, form.currency)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-surface-500">Commission ({form.commissionRate}%)</span>
                                    <span className="font-medium text-success-600">
                                        {formatCurrency((form.premiumAmount * form.commissionRate) / 100, form.currency)}
                                    </span>
                                </div>
                            </div>
                            <div className="pt-3 border-t border-surface-200 text-center">
                                <p className="text-xs text-surface-500">Payable Amount</p>
                                <p className="text-2xl font-bold text-primary-600 mt-1">{formatCurrency(form.premiumAmount, form.currency)}</p>
                            </div>
                        </div>
                    </div>
                )}

                {step === 5 && (
                    <div className="flex flex-col items-center gap-6 text-center w-full" style={{ maxWidth: '36rem', margin: '0 auto' }}>
                        <div className="w-16 h-16 rounded-full bg-success-50 text-success-600 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-surface-900">Ready to Create Policy?</h2>
                        <div className="bg-surface-50 rounded-[var(--radius-md)] p-6 text-left space-y-3 border border-surface-200 w-full">
                            <ReviewRow label="Client" value={form.clientName} />
                            <ReviewRow label="Insurer" value={form.insurerName} />
                            <ReviewRow label="Type" value={form.insuranceType} />
                            <ReviewRow label="Period" value={`${form.inceptionDate} to ${form.expiryDate}`} />
                            <ReviewRow label="Sum Insured" value={formatCurrency(form.sumInsured, form.currency)} />
                            <ReviewRow label="Premium" value={formatCurrency(form.premiumAmount, form.currency)} />
                        </div>
                    </div>
                )}
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    onClick={() => step > 1 ? setStep(step - 1) : router.back()}
                    disabled={step === 1}
                    className={step === 1 ? 'invisible' : ''}
                >
                    Back
                </Button>

                {step < 5 ? (
                    <Button
                        variant="primary"
                        onClick={handleNext}
                        disabled={
                            (step === 1 && !form.clientId) ||
                            (step === 2 && (!form.insuranceType || !form.insurerName))
                        }
                    >
                        Next Step <ArrowRight size={16} className="ml-2" />
                    </Button>
                ) : (
                    <Button variant="primary" onClick={handleNext} className="bg-success-600 hover:bg-success-700 border-success-600">
                        Convert to Policy <Check size={16} className="ml-2" />
                    </Button>
                )}
            </div>
        </div>
    );
}

function ReviewRow({ label, value }: { label: string, value: string | React.ReactNode }) {
    return (
        <div className="flex justify-between items-center text-sm">
            <span className="text-surface-500 font-medium">{label}</span>
            <span className="text-surface-900 font-semibold capitalize">{value}</span>
        </div>
    );
}
