'use client';

import { useState, useMemo, useEffect } from 'react';
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
    Car,
    Home,
    Ship,
    Save,
    Flame,
    HeartPulse,
    Activity,
    Briefcase,
    HardHat,
    Plane,
    Leaf,
    HelpCircle
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn, formatCurrency } from '@/lib/utils';
import { useCreatePolicy } from '@/hooks/api/use-policies';
import { useClients } from '@/hooks/api/use-clients';
import { useCarriers } from '@/hooks/api/use-carriers';
import type { InsuranceType, PremiumFrequency } from '@/types';
import { CustomSelect } from '@/components/ui/select-custom';
import { BackButton } from '@/components/ui/back-button';
import { toast } from 'sonner';

const STEPS = [
    { id: 1, label: 'Client Selection', icon: <User size={16} /> },
    { id: 2, label: 'Product & Insurer', icon: <Shield size={16} /> },
    { id: 3, label: 'Coverage Details', icon: <FileText size={16} /> },
    { id: 4, label: 'Premium Calc', icon: <Calculator size={16} /> },
    { id: 5, label: 'Review & Submit', icon: <CheckCircle2 size={16} /> },
];

const INSURANCE_TYPES: { label: string; value: InsuranceType; icon: any; color: string }[] = [
    { label: 'Motor', value: 'MOTOR', icon: <Car size={18} />, color: 'blue' },
    { label: 'Fire / Property', value: 'FIRE', icon: <Flame size={18} />, color: 'orange' },
    { label: 'Marine', value: 'MARINE', icon: <Ship size={18} />, color: 'cyan' },
    { label: 'Health', value: 'HEALTH', icon: <HeartPulse size={18} />, color: 'red' },
    { label: 'Life', value: 'LIFE', icon: <Activity size={18} />, color: 'rose' },
    { label: 'Liability', value: 'LIABILITY', icon: <Briefcase size={18} />, color: 'emerald' },
    { label: 'Engineering', value: 'ENGINEERING', icon: <HardHat size={18} />, color: 'amber' },
    { label: 'Bonds / Guarantees', value: 'BONDS', icon: <Shield size={18} />, color: 'indigo' },
    { label: 'Travel', value: 'TRAVEL', icon: <Plane size={18} />, color: 'purple' },
    { label: 'Agriculture', value: 'AGRICULTURE', icon: <Leaf size={18} />, color: 'green' },
    { label: 'Professional Indemnity', value: 'PROFESSIONAL_INDEMNITY', icon: <Briefcase size={18} />, color: 'slate' },
    { label: 'Oil & Gas', value: 'OIL_GAS', icon: <Flame size={18} />, color: 'yellow' },
    { label: 'Aviation', value: 'AVIATION', icon: <Plane size={18} />, color: 'sky' },
    { label: 'Other', value: 'OTHER', icon: <HelpCircle size={18} />, color: 'surface' },
];

const PREMIUM_FREQUENCIES: { label: string; value: PremiumFrequency }[] = [
    { label: 'Annual (Single)', value: 'ANNUAL' },
    { label: 'Semi-Annual', value: 'SEMI_ANNUAL' },
    { label: 'Quarterly', value: 'QUARTERLY' },
    { label: 'Monthly', value: 'MONTHLY' },
    { label: 'Single Premium', value: 'SINGLE' },
];

const MOTOR_COVER_TYPES = [
    { label: 'Comprehensive', value: 'COMPREHENSIVE' },
    { label: 'Third Party Only', value: 'THIRD_PARTY' },
    { label: 'Third Party Fire & Theft', value: 'THIRD_PARTY_FIRE_THEFT' },
    { label: 'Commercial Vehicle', value: 'COMMERCIAL' },
];

interface FormData {
    clientId: string;
    clientName: string;
    insuranceType: InsuranceType | '';
    insurerName: string;
    inceptionDate: string;
    expiryDate: string;
    policyNumber: string;
    sumInsured: number;
    premiumRate: number;
    premiumAmount: number;
    coverageDetails: string;
    currency: string;
    commissionRate: number;
    premiumFrequency: PremiumFrequency;
    // Motor specific
    motorCoverType: string;
    vehicleRegNumber: string;
    vehicleMake: string;
    vehicleModel: string;
    vehicleYear: string;
    vehicleChassisNumber: string;
    vehicleEngineNumber: string;
    vehicleUsageType: string;
    vehicleEstimatedValue: number;
    // Property specific
    propertyAddress: string;
    propertyType: string;
    // Marine specific
    vesselName: string;
    voyageFrom: string;
    voyageTo: string;
    cargoDescription: string;
}

const todayStr = new Date().toISOString().split('T')[0];
const oneYearLater = (() => { const d = new Date(); d.setFullYear(d.getFullYear() + 1); return d.toISOString().split('T')[0]; })();

const INITIAL_FORM: FormData = {
    clientId: '',
    clientName: '',
    insuranceType: '',
    insurerName: '',
    inceptionDate: todayStr,
    expiryDate: oneYearLater,
    policyNumber: '',
    sumInsured: 0,
    premiumRate: 0,
    premiumAmount: 0,
    coverageDetails: '',
    currency: 'GHS',
    commissionRate: 10,
    premiumFrequency: 'ANNUAL',
    motorCoverType: 'COMPREHENSIVE',
    vehicleRegNumber: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    vehicleChassisNumber: '',
    vehicleEngineNumber: '',
    vehicleUsageType: 'private',
    vehicleEstimatedValue: 0,
    propertyAddress: '',
    propertyType: '',
    vesselName: '',
    voyageFrom: '',
    voyageTo: '',
    cargoDescription: '',
};

// Ghana tax calc
function ghTaxBreakdown(premiumAmount: number) {
    const base = Math.round(premiumAmount / 1.20);
    const nhil = Math.round(base * 0.025);
    const getFund = Math.round(base * 0.025);
    const vat = Math.round(base * 0.15);
    return { base, vat, nhil, getFund, total: premiumAmount };
}

// Validation per step
function validateStep(step: number, form: FormData): string | null {
    switch (step) {
        case 1: return form.clientId ? null : 'Please select a client';
        case 2:
            if (!form.insuranceType) return 'Please select an insurance type';
            if (!form.insurerName) return 'Please select an insurer';
            return null;
        case 3:
            if (!form.inceptionDate) return 'Please set inception date';
            if (!form.expiryDate) return 'Please set expiry date';
            if (new Date(form.expiryDate) <= new Date(form.inceptionDate)) return 'Expiry must be after inception';
            if (form.insuranceType === 'MOTOR' && form.vehicleYear) {
                const yr = parseInt(form.vehicleYear, 10);
                if (isNaN(yr) || yr < 1900 || yr > new Date().getFullYear() + 1) return `Vehicle year must be between 1900 and ${new Date().getFullYear() + 1}`;
            }
            return null;
        case 4:
            if (form.sumInsured <= 0) return 'Sum insured must be greater than 0';
            if (form.premiumRate < 0 || form.premiumRate > 100) return 'Premium rate must be between 0 and 100%';
            if (form.premiumAmount <= 0) return 'Premium must be greater than 0';
            if (form.commissionRate < 0 || form.commissionRate > 50) return 'Commission rate must be between 0 and 50%';
            return null;
        default: return null;
    }
}

export default function NewPolicyPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [form, setForm] = useState<FormData>(INITIAL_FORM);
    const [clientSearch, setClientSearch] = useState('');
    const [errors, setErrors] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const createPolicyMutation = useCreatePolicy();

    const { data: clientsData } = useClients();
    const allClients: any[] = (clientsData as any)?.items ?? (clientsData as any)?.data ?? (Array.isArray(clientsData) ? clientsData : []);
    const { data: carriersData } = useCarriers();
    const allCarriers: any[] = Array.isArray(carriersData) ? carriersData : (carriersData as any)?.items ?? (carriersData as any)?.data ?? [];

    // Auto-populate client from URL if 'clientId' is present and we've loaded clients
    useEffect(() => {
        if (typeof window !== 'undefined' && allClients.length > 0 && !form.clientId) {
            const params = new URLSearchParams(window.location.search);
            const urlClientId = params.get('clientId');
            if (urlClientId) {
                const client = allClients.find((c: any) => c.id === urlClientId);
                if (client) {
                    setForm(prev => ({
                        ...prev,
                        clientId: client.id,
                        clientName: client.companyName || `${client.firstName || ''} ${client.lastName || ''}`.trim()
                    }));
                    setStep(2); // Automatically skip the first step since client is selected
                }
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allClients]);

    const INSURER_OPTIONS = useMemo(() =>
        allCarriers
            .filter((c: any) => c.status !== 'INACTIVE') // Just don't include explicit inactive ones, in case they exist
            .map((c: any) => ({ label: c.shortName || c.name, value: c.id }))
            .sort((a: any, b: any) => a.label.localeCompare(b.label)),
        [allCarriers]
    );

    const filteredClients = clientSearch
        ? allClients.filter((c: any) =>
            c.firstName?.toLowerCase().includes(clientSearch.toLowerCase()) ||
            c.lastName?.toLowerCase().includes(clientSearch.toLowerCase()) ||
            c.companyName?.toLowerCase().includes(clientSearch.toLowerCase()) ||
            (c.clientNumber || '').toLowerCase().includes(clientSearch.toLowerCase())
        ).slice(0, 6)
        : [];

    const taxes = useMemo(() => ghTaxBreakdown(form.premiumAmount), [form.premiumAmount]);

    function update<K extends keyof FormData>(field: K, value: FormData[K]) {
        setErrors(null);
        setForm(prev => {
            const next = { ...prev, [field]: value };
            if (field === 'sumInsured' || field === 'premiumRate') {
                const sum = field === 'sumInsured' ? (value as number) : prev.sumInsured;
                const rate = field === 'premiumRate' ? (value as number) : prev.premiumRate;
                next.premiumAmount = Math.round((sum * rate) / 100);
            }
            // Auto-set expiry to 1 year from inception (always recalculate)
            if (field === 'inceptionDate' && value) {
                const d = new Date(value as string);
                d.setFullYear(d.getFullYear() + 1);
                next.expiryDate = d.toISOString().split('T')[0];
            }
            return next;
        });
    }

    function handleNext() {
        if (step < 5) {
            const err = validateStep(step, form);
            if (err) {
                setErrors(err);
                toast.error(err);
                return;
            }
            setErrors(null);
            setStep(step + 1);
        } else {
            const err = validateStep(4, form);
            if (err) { setErrors(err); toast.error(err); return; }
            setIsSubmitting(true);

            const payload: Record<string, unknown> = {
                clientId: form.clientId,
                carrierId: form.insurerName, // now stores carrier UUID
                insuranceType: form.insuranceType,
                startDate: form.inceptionDate,
                endDate: form.expiryDate,
                premiumAmount: form.premiumAmount,
                sumInsured: form.sumInsured,
                premiumFrequency: form.premiumFrequency,
                currency: form.currency,
                commission: form.commissionRate ? (form.premiumAmount * form.commissionRate / 100) : undefined,
                policyNumber: form.policyNumber || undefined,
                coverageDetails: form.coverageDetails || undefined,
            };

            if (form.insuranceType === 'MOTOR') {
                payload.vehicleDetails = {
                    registrationNumber: form.vehicleRegNumber,
                    make: form.vehicleMake,
                    model: form.vehicleModel,
                    year: parseInt(form.vehicleYear) || new Date().getFullYear(),
                    chassisNumber: form.vehicleChassisNumber || undefined,
                    engineNumber: form.vehicleEngineNumber || undefined,
                    usageType: form.vehicleUsageType || undefined,
                    motorCoverType: form.motorCoverType || undefined,
                };
            }
            if (form.insuranceType === 'FIRE') {
                payload.propertyDetails = {
                    address: form.propertyAddress,
                    propertyType: form.propertyType || undefined,
                };
            }
            if (form.insuranceType === 'MARINE') {
                payload.marineDetails = {
                    vesselName: form.vesselName,
                    voyageFrom: form.voyageFrom || undefined,
                    voyageTo: form.voyageTo || undefined,
                    cargoDescription: form.cargoDescription || undefined,
                };
            }

            createPolicyMutation.mutate(payload, {
                onSuccess: () => {
                    setIsSubmitting(false);
                    toast.success(`Policy created for ${form.clientName}`, { description: `${form.insuranceType} / ${form.insurerName}` });
                    router.push('/dashboard/policies');
                },
                onError: (error: any) => {
                    setIsSubmitting(false);
                    toast.error('Policy Creation Failed', { description: error?.response?.data?.message || 'Could not create policy. Please try again.' });
                },
            });
        }
    }

    function handleSaveAsDraft() {
        toast.success('Policy saved as draft', { description: `You can resume editing later` });
        router.push('/dashboard/policies');
    }

    const isMotor = form.insuranceType === 'MOTOR';
    const isProperty = form.insuranceType === 'FIRE';
    const isMarine = form.insuranceType === 'MARINE';
    return (
        <div className="w-full flex flex-col h-[calc(100vh-6.5rem)] animate-fade-in max-w-6xl mx-auto overflow-hidden">
            {/* Header */}
            <div className="flex-none flex items-center justify-between pb-3">
                <div className="flex items-center gap-2">
                    <BackButton href="/dashboard/policies" />
                    <div>
                        <h1 className="text-xl font-bold text-surface-900 tracking-tight">New Policy</h1>
                        <p className="text-xs text-surface-500">Create a new insurance policy record.</p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="shadow-sm border-surface-200 h-8 text-xs"
                    leftIcon={<Save size={12} />}
                    onClick={handleSaveAsDraft}
                    disabled={!form.clientId}
                >
                    Save as Draft
                </Button>
            </div>

            {/* Stepper */}
            <div className="flex-none flex items-center justify-between relative py-1 px-4">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-surface-200 -z-10" />
                {STEPS.map((s) => {
                    const isActive = s.id === step;
                    const isCompleted = s.id < step;
                    return (
                        <div key={s.id} className="flex flex-col items-center gap-1 bg-background px-3">
                            <div className={cn(
                                'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border-2',
                                isActive ? 'border-primary-500 bg-primary-50 text-primary-600 shadow-md shadow-primary-500/10' :
                                    isCompleted ? 'border-success-500 bg-success-500 text-white shadow-sm' :
                                        'border-surface-200 bg-surface-50 text-surface-400'
                            )}>
                                {isCompleted ? <Check size={14} /> : s.icon}
                            </div>
                            <span className={cn(
                                'text-[10px] font-bold uppercase tracking-wider whitespace-nowrap',
                                isActive ? 'text-primary-600' : isCompleted ? 'text-success-600' : 'text-surface-400'
                            )}>
                                {s.label}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Content Container (Non-scrolling by default, fits whole page) */}
            <div className="flex-1 mt-4 overflow-visible">
                <Card padding="md" className="h-full border-surface-200/60 shadow-sm overflow-visible flex flex-col">
                    <div className="flex-1 overflow-visible">
                    {/* ─── Step 1: Client Selection ────────────────────────────────── */}
                {step === 1 && (
                    <div className="flex flex-col items-center gap-6">
                        <div className="text-center">
                            <h2 className="text-lg font-bold text-surface-900">Select Client</h2>
                            <p className="text-sm text-surface-500">Search for an existing client to link this policy.</p>
                        </div>
                        <div className="relative w-full max-w-lg">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search client name or ID..."
                                className="w-full pl-10 pr-4 py-3 bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                value={clientSearch}
                                onChange={(e) => setClientSearch(e.target.value)}
                            />
                        </div>
                        {form.clientId && (
                            <div className="w-full p-3 bg-success-50 border border-success-200 rounded-lg text-sm text-success-700 font-medium text-center max-w-lg">
                                Selected: <strong>{form.clientName}</strong>
                            </div>
                        )}
                        <div className="w-full max-w-lg">
                            {filteredClients.map(client => (
                                <button
                                    key={client.id}
                                    onClick={() => {
                                        update('clientId', client.id);
                                        update('clientName', client.companyName || `${client.firstName} ${client.lastName}`);
                                    }}
                                    className={cn(
                                        "w-full flex items-center justify-between p-3 rounded-[var(--radius-md)] border transition-all group text-left",
                                        form.clientId === client.id
                                            ? 'bg-primary-50 border-primary-300'
                                            : 'border-transparent hover:bg-primary-50 hover:border-primary-200'
                                    )}
                                >
                                    <div>
                                        <p className="font-semibold text-surface-900">{client.companyName || `${client.firstName} ${client.lastName}`}</p>
                                        <p className="text-xs text-surface-500">{client.clientNumber} &middot; {client.email}</p>
                                    </div>
                                    {form.clientId === client.id ? (
                                        <CheckCircle2 size={16} className="text-primary-600" />
                                    ) : (
                                        <ArrowRight size={16} className="text-surface-300 group-hover:text-primary-500 opacity-0 group-hover:opacity-100 transition-all" />
                                    )}
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

                {/* ─── Step 2: Product & Insurer ───────────────────────────────── */}
                {step === 2 && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        <div className="lg:col-span-8 space-y-4">
                            <h2 className="text-lg font-bold text-surface-900">Coverage Type</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {INSURANCE_TYPES.map(type => {
                                    const isSelected = form.insuranceType === type.value;
                                    const colorMap: Record<string, { bg: string, text: string, border: string, iconBg: string }> = {
                                        blue: { bg: 'bg-blue-50/50', text: 'text-blue-700', border: 'border-blue-100', iconBg: 'bg-blue-100 text-blue-600' },
                                        orange: { bg: 'bg-orange-50/50', text: 'text-orange-700', border: 'border-orange-100', iconBg: 'bg-orange-100 text-orange-600' },
                                        cyan: { bg: 'bg-cyan-50/50', text: 'text-cyan-700', border: 'border-cyan-100', iconBg: 'bg-cyan-100 text-cyan-600' },
                                        red: { bg: 'bg-red-50/50', text: 'text-red-700', border: 'border-red-100', iconBg: 'bg-red-100 text-red-600' },
                                        rose: { bg: 'bg-rose-50/50', text: 'text-rose-700', border: 'border-rose-100', iconBg: 'bg-rose-100 text-rose-600' },
                                        emerald: { bg: 'bg-emerald-50/50', text: 'text-emerald-700', border: 'border-emerald-100', iconBg: 'bg-emerald-100 text-emerald-600' },
                                        amber: { bg: 'bg-amber-50/50', text: 'text-amber-700', border: 'border-amber-100', iconBg: 'bg-amber-100 text-amber-600' },
                                        indigo: { bg: 'bg-indigo-50/50', text: 'text-indigo-700', border: 'border-indigo-100', iconBg: 'bg-indigo-100 text-indigo-600' },
                                        purple: { bg: 'bg-purple-50/50', text: 'text-purple-700', border: 'border-purple-100', iconBg: 'bg-purple-100 text-purple-600' },
                                        green: { bg: 'bg-green-50/50', text: 'text-green-700', border: 'border-green-100', iconBg: 'bg-green-100 text-green-600' },
                                        slate: { bg: 'bg-slate-50/50', text: 'text-slate-700', border: 'border-slate-100', iconBg: 'bg-slate-100 text-slate-600' },
                                        yellow: { bg: 'bg-yellow-50/50', text: 'text-yellow-700', border: 'border-yellow-100', iconBg: 'bg-yellow-100 text-yellow-600' },
                                        sky: { bg: 'bg-sky-50/50', text: 'text-sky-700', border: 'border-sky-100', iconBg: 'bg-sky-100 text-sky-600' },
                                        surface: { bg: 'bg-surface-50', text: 'text-surface-700', border: 'border-surface-200', iconBg: 'bg-surface-200 text-surface-500' }
                                    };
                                    const theme = colorMap[type.color] || colorMap.surface;

                                    return (
                                        <button
                                            key={type.value}
                                            onClick={() => update('insuranceType', type.value)}
                                            className={cn(
                                                'p-2.5 rounded-xl border transition-all text-xs flex items-center gap-3 group',
                                                isSelected
                                                    ? `${theme.bg} ${theme.border} ${theme.text} border-2 ring-2 ring-offset-1 ring-primary-500/20 scale-[1.03]`
                                                    : `${theme.bg} ${theme.border} ${theme.text} opacity-70 hover:opacity-100 hover:scale-[1.02]`
                                            )}
                                        >
                                            <div className={cn(
                                                "w-8 h-8 rounded-lg flex items-center justify-center transition-all shrink-0",
                                                isSelected ? 'bg-white shadow-sm' : `${theme.iconBg} shadow-sm`
                                            )}>
                                                {type.icon}
                                            </div>
                                            <span className={cn("flex-1 truncate", isSelected ? 'font-bold' : 'font-semibold')}>{type.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="lg:col-span-4 space-y-4 sticky top-0">
                            <h2 className="text-lg font-bold text-surface-900">Insurer Details</h2>
                            <div>
                                <label className="block text-xs font-medium text-surface-600 mb-1.5">Insurance Company</label>
                                <CustomSelect
                                    placeholder="Select Insurer..."
                                    options={INSURER_OPTIONS}
                                    value={form.insurerName}
                                    onChange={(v) => update('insurerName', String(v || ''))}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-surface-600 mb-1.5">Policy Currency</label>
                                <CustomSelect
                                    options={[
                                        { label: 'GHS - Ghanaian Cedi', value: 'GHS' },
                                        { label: 'USD - US Dollar', value: 'USD' },
                                        { label: 'EUR - Euro', value: 'EUR' },
                                        { label: 'GBP - British Pound', value: 'GBP' },
                                    ]}
                                    value={form.currency}
                                    onChange={(v) => update('currency', String(v || 'GHS'))}
                                    className="w-full"
                                />
                            </div>

                            {/* Motor-specific: Cover type */}
                            {isMotor && (
                                <div>
                                    <label className="block text-xs font-medium text-surface-600 mb-1.5">Motor Cover Type</label>
                                    <CustomSelect
                                        options={MOTOR_COVER_TYPES}
                                        value={form.motorCoverType}
                                        onChange={(v) => update('motorCoverType', String(v || 'COMPREHENSIVE'))}
                                        className="w-full"
                                        position="top"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ─── Step 3: Coverage Details ────────────────────────────────── */}
                {step === 3 && (
                    <div className="flex flex-col gap-6 items-center w-full">
                        {/* Policy Number (Official) */}
                        <div className="w-full max-w-2xl">
                            <label className="block text-xs font-medium text-surface-600 mb-1.5">Official Policy Number <span className="text-surface-400 font-normal">(optional — from insurer)</span></label>
                            <input
                                type="text"
                                placeholder="e.g. SIC/MOT/ACC/2025/001234"
                                className="w-full p-2.5 bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] outline-none focus:border-primary-500 font-mono text-sm"
                                value={form.policyNumber}
                                onChange={(e) => update('policyNumber', e.target.value)}
                            />
                            <p className="text-[11px] text-surface-400 mt-1">Leave blank to auto-generate a tracking number. You can add the official number later via Edit.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
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
                                <label className="block text-xs font-medium text-surface-600 mb-1.5">Expiry Date <span className="text-surface-400 font-normal">(auto: +1 year)</span></label>
                                <input
                                    type="date"
                                    className="w-full p-2.5 bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] outline-none focus:border-primary-500"
                                    value={form.expiryDate}
                                    onChange={(e) => update('expiryDate', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Motor Vehicle Fields */}
                        {isMotor && (
                            <div className="w-full border border-blue-200 rounded-xl p-5 bg-blue-50/30 max-w-2xl">
                                <h3 className="text-sm font-bold text-blue-700 flex items-center gap-2 mb-4">
                                    <Car size={16} /> Vehicle Details
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-surface-600 mb-1">Registration No.</label>
                                        <input type="text" placeholder="e.g. GR-1234-21" className="w-full p-2.5 bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] outline-none focus:border-primary-500 text-sm" value={form.vehicleRegNumber} onChange={(e) => update('vehicleRegNumber', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-surface-600 mb-1">Make</label>
                                        <input type="text" placeholder="e.g. Toyota" className="w-full p-2.5 bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] outline-none focus:border-primary-500 text-sm" value={form.vehicleMake} onChange={(e) => update('vehicleMake', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-surface-600 mb-1">Model</label>
                                        <input type="text" placeholder="e.g. Hilux" className="w-full p-2.5 bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] outline-none focus:border-primary-500 text-sm" value={form.vehicleModel} onChange={(e) => update('vehicleModel', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-surface-600 mb-1">Year</label>
                                        <input type="number" placeholder="2024" className="w-full p-2.5 bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] outline-none focus:border-primary-500 text-sm" value={form.vehicleYear} onChange={(e) => update('vehicleYear', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-surface-600 mb-1">Chassis No.</label>
                                        <input type="text" className="w-full p-2.5 bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] outline-none focus:border-primary-500 text-sm" value={form.vehicleChassisNumber} onChange={(e) => update('vehicleChassisNumber', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-surface-600 mb-1">Engine No.</label>
                                        <input type="text" className="w-full p-2.5 bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] outline-none focus:border-primary-500 text-sm" value={form.vehicleEngineNumber} onChange={(e) => update('vehicleEngineNumber', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-surface-600 mb-1">Usage Type</label>
                                        <CustomSelect
                                            options={[
                                                { label: 'Private', value: 'private' },
                                                { label: 'Commercial', value: 'COMMERCIAL' },
                                                { label: 'Hiring', value: 'hiring' },
                                            ]}
                                            value={form.vehicleUsageType}
                                            onChange={(v) => update('vehicleUsageType', String(v || 'private'))}
                                            className="w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-surface-600 mb-1">Estimated Value (GHS)</label>
                                        <input type="number" placeholder="0" className="w-full p-2.5 bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] outline-none focus:border-primary-500 text-sm" value={form.vehicleEstimatedValue || ''} onChange={(e) => update('vehicleEstimatedValue', parseFloat(e.target.value) || 0)} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Property Fields */}
                        {isProperty && (
                            <div className="w-full border border-orange-200 rounded-xl p-5 bg-orange-50/30 max-w-2xl">
                                <h3 className="text-sm font-bold text-orange-700 flex items-center gap-2 mb-4">
                                    <Home size={16} /> Property Details
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-xs font-medium text-surface-600 mb-1">Property Address</label>
                                        <input type="text" placeholder="e.g. 15 Independence Ave, Accra" className="w-full p-2.5 bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] outline-none focus:border-primary-500 text-sm" value={form.propertyAddress} onChange={(e) => update('propertyAddress', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-surface-600 mb-1">Property Type</label>
                                        <CustomSelect
                                            options={[
                                                { label: 'Residential', value: 'residential' },
                                                { label: 'Commercial', value: 'COMMERCIAL' },
                                                { label: 'Industrial', value: 'industrial' },
                                                { label: 'Warehouse', value: 'warehouse' },
                                            ]}
                                            value={form.propertyType}
                                            onChange={(v) => update('propertyType', String(v || ''))}
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Marine Fields */}
                        {isMarine && (
                            <div className="w-full border border-cyan-200 rounded-xl p-5 bg-cyan-50/30 max-w-2xl">
                                <h3 className="text-sm font-bold text-cyan-700 flex items-center gap-2 mb-4">
                                    <Ship size={16} /> Marine / Cargo Details
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-surface-600 mb-1">Vessel Name</label>
                                        <input type="text" className="w-full p-2.5 bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] outline-none focus:border-primary-500 text-sm" value={form.vesselName} onChange={(e) => update('vesselName', e.target.value)} />
                                    </div>
                                    <div className="col-span-2 grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-surface-600 mb-1">Voyage From</label>
                                            <input type="text" placeholder="e.g. Tema Port" className="w-full p-2.5 bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] outline-none focus:border-primary-500 text-sm" value={form.voyageFrom} onChange={(e) => update('voyageFrom', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-surface-600 mb-1">Voyage To</label>
                                            <input type="text" placeholder="e.g. Rotterdam" className="w-full p-2.5 bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] outline-none focus:border-primary-500 text-sm" value={form.voyageTo} onChange={(e) => update('voyageTo', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs font-medium text-surface-600 mb-1">Cargo Description</label>
                                        <textarea rows={2} className="w-full p-2.5 bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] outline-none focus:border-primary-500 text-sm resize-none" value={form.cargoDescription} onChange={(e) => update('cargoDescription', e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Generic Coverage Description */}
                        <div className="w-full max-w-2xl">
                            <label className="block text-xs font-medium text-surface-600 mb-1.5">Coverage Description / Risk Details</label>
                            <textarea
                                rows={3}
                                className="w-full p-3 bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] outline-none focus:border-primary-500 resize-none"
                                placeholder={isMotor ? "Additional notes about the vehicle / cover..." : "Describe the risk / coverage needed..."}
                                value={form.coverageDetails}
                                onChange={(e) => update('coverageDetails', e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {/* ─── Step 4: Premium Calculation ─────────────────────────────── */}
                {step === 4 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start w-full max-w-3xl mx-auto">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-surface-600 mb-1.5">Sum Insured ({form.currency})</label>
                                <input
                                    type="number"
                                    className="w-full p-2.5 bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] outline-none focus:border-primary-500"
                                    value={form.sumInsured || ''}
                                    onChange={(e) => update('sumInsured', parseFloat(e.target.value) || 0)}
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
                                    onChange={(e) => update('premiumRate', parseFloat(e.target.value) || 0)}
                                    placeholder="e.g. 1.5"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-surface-600 mb-1.5">Or Enter Premium Directly ({form.currency})</label>
                                <input
                                    type="number"
                                    className="w-full p-2.5 bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] outline-none focus:border-primary-500"
                                    value={form.premiumAmount || ''}
                                    onChange={(e) => setForm(prev => ({ ...prev, premiumAmount: parseFloat(e.target.value) || 0 }))}
                                    placeholder="Override calculated premium"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-surface-600 mb-1.5">Commission Rate (%)</label>
                                <input
                                    type="number"
                                    step="0.5"
                                    className="w-full p-2.5 bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] outline-none focus:border-primary-500"
                                    value={form.commissionRate || ''}
                                    onChange={(e) => update('commissionRate', parseFloat(e.target.value) || 0)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-surface-600 mb-1.5">Premium Frequency</label>
                                <CustomSelect
                                    options={PREMIUM_FREQUENCIES}
                                    value={form.premiumFrequency}
                                    onChange={(v) => update('premiumFrequency', (v || 'ANNUAL') as PremiumFrequency)}
                                    className="w-full"
                                    position="top"
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            {/* Ghana Tax Breakdown */}
                            <div className="bg-surface-50 p-6 rounded-[var(--radius-lg)] space-y-4 border border-surface-200">
                                <h3 className="text-sm font-bold text-surface-900 uppercase tracking-wide">Ghana Tax Breakdown</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-surface-500">Base Premium</span>
                                        <span className="font-medium text-surface-900 tabular-nums">{formatCurrency(taxes.base, form.currency)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-surface-500">VAT (15%)</span>
                                        <span className="tabular-nums">{formatCurrency(taxes.vat, form.currency)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-surface-500">NHIL (2.5%)</span>
                                        <span className="tabular-nums">{formatCurrency(taxes.nhil, form.currency)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-surface-500">GETFund (2.5%)</span>
                                        <span className="tabular-nums">{formatCurrency(taxes.getFund, form.currency)}</span>
                                    </div>
                                </div>
                                <div className="pt-3 border-t border-surface-200 text-center">
                                    <p className="text-xs text-surface-500">Total Premium</p>
                                    <p className="text-2xl font-bold text-primary-600 mt-1 tabular-nums">{formatCurrency(taxes.total, form.currency)}</p>
                                </div>
                            </div>

                            {/* Commission Summary */}
                            <div className="bg-success-50/50 p-4 rounded-[var(--radius-lg)] border border-success-200">
                                <div className="flex justify-between text-sm">
                                    <span className="text-surface-600">Commission ({form.commissionRate}%)</span>
                                    <span className="font-bold text-success-600 tabular-nums">
                                        {formatCurrency(Math.round((form.premiumAmount * form.commissionRate) / 100), form.currency)}
                                    </span>
                                </div>
                            </div>

                            {/* Frequency Note */}
                            {form.premiumFrequency !== 'ANNUAL' && form.premiumFrequency !== 'SINGLE' && (
                                <div className="bg-primary-50 p-3 rounded-lg border border-primary-100 text-xs text-primary-700">
                                    Installment amount per {form.premiumFrequency.replace(/_/g, '-')}: ~
                                    <strong>
                                        {formatCurrency(
                                            Math.round(form.premiumAmount / (
                                                form.premiumFrequency === 'MONTHLY' ? 12 :
                                                    form.premiumFrequency === 'QUARTERLY' ? 4 : 2
                                            )),
                                            form.currency
                                        )}
                                    </strong>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ─── Step 5: Review & Submit ─────────────────────────────────── */}
                {step === 5 && (
                    <div className="flex flex-col items-center gap-6 text-center w-full max-w-[40rem] mx-auto">
                        <div className="w-16 h-16 rounded-full bg-success-50 text-success-600 flex items-center justify-center mx-auto mb-2">
                            <CheckCircle2 size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-surface-900">Ready to Create Policy?</h2>
                        <div className="bg-surface-50 rounded-[var(--radius-md)] p-6 text-left space-y-3 border border-surface-200 w-full">
                            <ReviewRow label="Client" value={form.clientName} />
                            <ReviewRow label="Insurer" value={form.insurerName} />
                            <ReviewRow label="Type" value={form.insuranceType.replace(/_/g, ' ')} />
                            <ReviewRow label="Period" value={`${form.inceptionDate} → ${form.expiryDate}`} />
                            <ReviewRow label="Sum Insured" value={formatCurrency(form.sumInsured, form.currency)} />
                            <ReviewRow label="Gross Premium" value={formatCurrency(form.premiumAmount, form.currency)} />
                            <ReviewRow label="Frequency" value={form.premiumFrequency.replace(/_/g, ' ')} />
                            <ReviewRow label="Commission" value={`${form.commissionRate}% = ${formatCurrency(Math.round((form.premiumAmount * form.commissionRate) / 100), form.currency)}`} />

                            {isMotor && form.vehicleRegNumber && (
                                <>
                                    <div className="border-t border-surface-200 my-2" />
                                    <ReviewRow label="Vehicle" value={`${form.vehicleMake} ${form.vehicleModel} (${form.vehicleYear})`} />
                                    <ReviewRow label="Reg. No." value={form.vehicleRegNumber} />
                                    <ReviewRow label="Cover Type" value={form.motorCoverType} />
                                </>
                            )}

                            {isProperty && form.propertyAddress && (
                                <>
                                    <div className="border-t border-surface-200 my-2" />
                                    <ReviewRow label="Property" value={form.propertyAddress} />
                                    <ReviewRow label="Property Type" value={form.propertyType} />
                                </>
                            )}

                            {isMarine && form.vesselName && (
                                <>
                                    <div className="border-t border-surface-200 my-2" />
                                    <ReviewRow label="Vessel" value={form.vesselName} />
                                    <ReviewRow label="Voyage" value={`${form.voyageFrom} → ${form.voyageTo}`} />
                                </>
                            )}
                        </div>

                        {/* Ghana Tax Summary */}
                        <div className="w-full bg-primary-50/50 rounded-lg border border-primary-100 p-4 text-left space-y-1">
                            <p className="text-xs text-primary-700 font-bold uppercase">Ghana Tax Breakdown</p>
                            <div className="grid grid-cols-4 gap-2 text-xs text-primary-600">
                                <span>Base: {formatCurrency(taxes.base)}</span>
                                <span>VAT: {formatCurrency(taxes.vat)}</span>
                                <span>NHIL: {formatCurrency(taxes.nhil)}</span>
                                <span>GETFund: {formatCurrency(taxes.getFund)}</span>
                            </div>
                        </div>
                    </div>
                )}
                    </div>
                </Card>
            </div>

            {/* Fixed Navigation Footer (Compact) */}
            <div className="flex-none flex items-center justify-between pt-3 mt-1 border-t border-surface-200 bg-background/95 backdrop-blur-md pb-1">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setErrors(null); step > 1 ? setStep(step - 1) : router.back(); }}
                    disabled={step === 1}
                    className={cn("shadow-sm bg-white h-9", step === 1 ? 'invisible' : '')}
                >
                    Back
                </Button>

                {step < 5 ? (
                    <Button variant="primary" size="sm" onClick={handleNext} className="shadow-md shadow-primary-500/10 px-8 h-9 font-bold">
                        Next Step <ArrowRight size={14} className="ml-2" />
                    </Button>
                ) : (
                    <div className="flex gap-3">
                        <Button variant="outline" size="sm" onClick={handleSaveAsDraft} leftIcon={<Save size={12} />} className="shadow-sm bg-white h-9">
                            Save as Draft
                        </Button>
                        <Button variant="primary" size="sm" onClick={handleNext} className="bg-success-600 hover:bg-success-700 border-success-600 shadow-md shadow-success-600/10 px-8 h-9 font-bold" isLoading={isSubmitting} disabled={isSubmitting}>
                            Create Policy <Check size={14} className="ml-2" />
                        </Button>
                    </div>
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
