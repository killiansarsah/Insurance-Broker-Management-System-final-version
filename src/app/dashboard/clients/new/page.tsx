'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    ArrowLeft,
    ArrowRight,
    Check,
    User,
    MapPin,
    CreditCard,
    FileCheck,
    Building2,
    Users as UsersIcon,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { CustomSelect } from '@/components/ui/select-custom';
import { BackButton } from '@/components/ui/back-button';

const STEPS = [
    { id: 1, label: 'Basic Info', icon: <User size={16} /> },
    { id: 2, label: 'Contact & Family', icon: <MapPin size={16} /> },
    { id: 3, label: 'KYC & Banking', icon: <CreditCard size={16} /> },
    { id: 4, label: 'ID Documents', icon: <FileCheck size={16} /> },
    { id: 5, label: 'Review', icon: <Check size={16} /> },
];

interface FormData {
    type: 'individual' | 'corporate';
    firstName: string;
    lastName: string;
    otherNames: string;
    dateOfBirth: string;
    gender: string;
    occupation: string;
    employerName: string;
    employerAddress: string;
    companyName: string;
    registrationNumber: string;
    tin: string;
    dateOfIncorporation: string;
    industry: string;
    phone: string;
    alternatePhone: string;
    email: string;
    digitalAddress: string;
    postalAddress: string;
    region: string;
    city: string;
    ghanaCardNumber: string;
    nationality: string;
    assignedBrokerId: string;
    sourceOfFunds: string;
    purposeOfRelationship: string;
    expectedVolume: string;
    isPep: boolean;
    bankName: string;
    bankAccountName: string;
    bankAccountNumber: string;
    bankBranch: string;
    nextOfKinName: string;
    nextOfKinRelationship: string;
    nextOfKinPhone: string;
}

const INITIAL_FORM: FormData = {
    type: 'individual',
    firstName: '',
    lastName: '',
    otherNames: '',
    dateOfBirth: '',
    gender: '',
    occupation: '',
    employerName: '',
    employerAddress: '',
    companyName: '',
    registrationNumber: '',
    tin: '',
    dateOfIncorporation: '',
    industry: '',
    phone: '',
    alternatePhone: '',
    email: '',
    digitalAddress: '',
    postalAddress: '',
    region: '',
    city: '',
    ghanaCardNumber: '',
    nationality: 'Ghanaian',
    assignedBrokerId: '',
    sourceOfFunds: '',
    purposeOfRelationship: '',
    expectedVolume: '',
    isPep: false,
    bankName: '',
    bankAccountName: '',
    bankAccountNumber: '',
    bankBranch: '',
    nextOfKinName: '',
    nextOfKinRelationship: '',
    nextOfKinPhone: '',
};

const REGIONS = [
    'Greater Accra', 'Ashanti', 'Western', 'Central', 'Eastern',
    'Northern', 'Volta', 'Bono Ahafo', 'Upper East', 'Upper West',
    'Western North', 'Ahafo', 'Bono East', 'North East', 'Savannah', 'Oti',
];

const INDUSTRIES = [
    'Agriculture', 'Construction', 'Education', 'Finance',
    'Healthcare', 'Manufacturing', 'Mining', 'Oil & Gas',
    'Retail', 'Technology', 'Trading', 'Transport', 'Other',
];

function InputField({
    label,
    required,
    error,
    ...props
}: {
    label: string;
    required?: boolean;
    error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div>
            <label className="block text-xs font-semibold text-surface-600 mb-1.5">
                {label} {required && <span className="text-danger-500">*</span>}
            </label>
            <input
                {...props}
                className={cn(
                    'w-full px-3 py-2.5 text-sm bg-surface-50 border rounded-[var(--radius-md)]',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all',
                    'placeholder:text-surface-400',
                    error ? 'border-danger-400' : 'border-surface-200'
                )}
            />
            {error && <p className="text-xs text-danger-500 mt-1">{error}</p>}
        </div>
    );
}

function SelectField({
    label,
    required,
    options,
    error,
    placeholder = 'Select…',
    value,
    onChange,
}: {
    label: string;
    required?: boolean;
    error?: string;
    options: { label: string; value: string }[];
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
    return (
        <div>
            <label className="block text-xs font-semibold text-surface-600 mb-1.5">
                {label} {required && <span className="text-danger-500">*</span>}
            </label>
            <CustomSelect
                placeholder={placeholder}
                options={options}
                value={value ?? ''}
                onChange={(v) => onChange?.({ target: { value: v ?? '' } } as React.ChangeEvent<HTMLSelectElement>)}
            />
            {error && <p className="text-xs text-danger-500 mt-1">{error}</p>}
        </div>
    );
}

export default function NewClientPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [step, setStep] = useState(1);

    // Pre-populate from query params (e.g., from Lead Conversion)
    const [form, setForm] = useState<FormData>(() => {
        const type = searchParams.get('type');
        const firstName = searchParams.get('firstName');
        const lastName = searchParams.get('lastName');
        const email = searchParams.get('email');
        const phone = searchParams.get('phone');
        const companyName = searchParams.get('companyName');

        if (type || firstName || lastName || email || phone || companyName) {
            return {
                ...INITIAL_FORM,
                type: (type === 'corporate' ? 'corporate' : 'individual') as 'individual' | 'corporate',
                firstName: firstName || INITIAL_FORM.firstName,
                lastName: lastName || INITIAL_FORM.lastName,
                email: email || INITIAL_FORM.email,
                phone: phone || INITIAL_FORM.phone,
                companyName: companyName || INITIAL_FORM.companyName,
            };
        }
        return INITIAL_FORM;
    });
    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

    function update(field: keyof FormData, value: string) {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    function validateStep(s: number): boolean {
        const newErrors: Partial<Record<keyof FormData, string>> = {};

        if (s === 1) {
            if (form.type === 'individual') {
                if (!form.firstName.trim()) newErrors.firstName = 'Required';
                if (!form.lastName.trim()) newErrors.lastName = 'Required';
                if (!form.dateOfBirth) newErrors.dateOfBirth = 'Required';
                if (!form.gender) newErrors.gender = 'Required';
                if (!form.occupation.trim()) newErrors.occupation = 'Required';
            } else {
                if (!form.companyName.trim()) newErrors.companyName = 'Required';
                if (!form.registrationNumber.trim()) newErrors.registrationNumber = 'Required';
                if (!form.tin.trim()) newErrors.tin = 'Required';
            }
        }

        if (s === 2) {
            if (!form.phone.trim()) newErrors.phone = 'Required';
            else if (!/^\+233\d{9}$/.test(form.phone.replace(/\s/g, '')))
                newErrors.phone = 'Use format +233XXXXXXXXX';
            if (!form.region) newErrors.region = 'Required';
            if (!form.city.trim()) newErrors.city = 'Required';
            if (!form.nextOfKinName.trim()) newErrors.nextOfKinName = 'Required';
            if (!form.nextOfKinPhone.trim()) newErrors.nextOfKinPhone = 'Required';
        }

        if (s === 3) {
            if (!form.sourceOfFunds) newErrors.sourceOfFunds = 'Required';
            if (!form.purposeOfRelationship) newErrors.purposeOfRelationship = 'Required';
            if (!form.bankAccountNumber.trim()) newErrors.bankAccountNumber = 'Required';
            if (!form.bankName.trim()) newErrors.bankName = 'Required';
        }

        if (s === 4) {
            if (form.type === 'individual' && !form.ghanaCardNumber.trim())
                newErrors.ghanaCardNumber = 'Required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function next() {
        if (validateStep(step)) setStep((s) => Math.min(5, s + 1));
    }

    function prev() {
        setStep((s) => Math.max(1, s - 1));
    }

    function handleSubmit() {
        toast.success('Client Registered', { description: 'New client profile has been created successfully.' });
        router.push('/dashboard/clients');
    }

    const displayName = form.type === 'corporate'
        ? form.companyName
        : `${form.firstName} ${form.lastName}`.trim();

    return (
        <div className="space-y-6 animate-fade-in w-full pb-12" style={{ maxWidth: '56rem' }}>
            {/* Header */}
            <div className="flex items-center gap-3">
                <BackButton href="/dashboard/clients" />
                <div>
                    <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Register New Client</h1>
                    <p className="text-sm text-surface-500">Complete NIC-compliant registration process.</p>
                </div>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center gap-2">
                {STEPS.map((s, i) => (
                    <div key={s.id} className="flex items-center gap-2 flex-1">
                        <button
                            onClick={() => {
                                if (s.id < step) setStep(s.id);
                            }}
                            className={cn(
                                'flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] text-xs font-semibold transition-all w-full',
                                step === s.id
                                    ? 'bg-primary-500 text-white shadow-md'
                                    : step > s.id
                                        ? 'bg-success-50 text-success-700 cursor-pointer hover:bg-success-100'
                                        : 'bg-surface-100 text-surface-400'
                            )}
                        >
                            {step > s.id ? <Check size={14} /> : s.icon}
                            <span className="hidden sm:inline">{s.label}</span>
                            <span className="sm:hidden">{s.id}</span>
                        </button>
                        {i < STEPS.length - 1 && (
                            <div className={cn(
                                'w-6 h-0.5 shrink-0',
                                step > s.id ? 'bg-success-400' : 'bg-surface-200'
                            )} />
                        )}
                    </div>
                ))}
            </div>

            {/* Form Content */}
            <Card padding="lg">
                {/* Type Toggle */}
                {step === 1 && (
                    <div className="mb-6">
                        <label className="block text-xs font-semibold text-surface-600 mb-2">Client Type</label>
                        <div className="flex gap-3">
                            <button
                                onClick={() => update('type', 'individual')}
                                className={cn(
                                    'flex items-center gap-2 px-4 py-3 rounded-[var(--radius-md)] border-2 text-sm font-semibold cursor-pointer transition-all flex-1',
                                    form.type === 'individual'
                                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                                        : 'border-surface-200 text-surface-500 hover:border-surface-300'
                                )}
                            >
                                <UsersIcon size={18} /> Individual
                            </button>
                            <button
                                onClick={() => update('type', 'corporate')}
                                className={cn(
                                    'flex items-center gap-2 px-4 py-3 rounded-[var(--radius-md)] border-2 text-sm font-semibold cursor-pointer transition-all flex-1',
                                    form.type === 'corporate'
                                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                                        : 'border-surface-200 text-surface-500 hover:border-surface-300'
                                )}
                            >
                                <Building2 size={18} /> Corporate
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 1: Personal Info */}
                {step === 1 && form.type === 'individual' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InputField label="First Name" required value={form.firstName} error={errors.firstName}
                            onChange={(e) => update('firstName', e.target.value)} placeholder="e.g. Kwame" />
                        <InputField label="Last Name" required value={form.lastName} error={errors.lastName}
                            onChange={(e) => update('lastName', e.target.value)} placeholder="e.g. Mensah" />
                        <InputField label="Other Names" value={form.otherNames}
                            onChange={(e) => update('otherNames', e.target.value)} placeholder="Middle names" />
                        <InputField label="Date of Birth" required type="date" value={form.dateOfBirth}
                            error={errors.dateOfBirth} onChange={(e) => update('dateOfBirth', e.target.value)} />
                        <SelectField label="Gender" required value={form.gender} error={errors.gender}
                            onChange={(e) => update('gender', e.target.value)}
                            options={[
                                { label: 'Male', value: 'male' },
                                { label: 'Female', value: 'female' },
                                { label: 'Other', value: 'other' },
                            ]} />
                        <InputField label="Nationality" value={form.nationality}
                            onChange={(e) => update('nationality', e.target.value)} />
                        <InputField label="Occupation" required value={form.occupation} error={errors.occupation}
                            onChange={(e) => update('occupation', e.target.value)} placeholder="e.g. Software Engineer" />
                        <InputField label="Employer Name" value={form.employerName}
                            onChange={(e) => update('employerName', e.target.value)} placeholder="e.g. Google Ghana" />
                        <InputField label="Employer Address" value={form.employerAddress}
                            onChange={(e) => update('employerAddress', e.target.value)} placeholder="Employer location" className="sm:col-span-2" />
                    </div>
                )}

                {step === 1 && form.type === 'corporate' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InputField label="Company Name" required value={form.companyName} error={errors.companyName}
                            onChange={(e) => update('companyName', e.target.value)} placeholder="e.g. Asante Holdings Ltd" className="sm:col-span-2" />
                        <InputField label="Registration Number" required value={form.registrationNumber} error={errors.registrationNumber}
                            onChange={(e) => update('registrationNumber', e.target.value)} placeholder="CS-XXXXX-YYYY" />
                        <InputField label="TIN" required value={form.tin} error={errors.tin}
                            onChange={(e) => update('tin', e.target.value)} placeholder="C00XXXXXXXX" />
                        <InputField label="Date of Incorporation" type="date" value={form.dateOfIncorporation}
                            onChange={(e) => update('dateOfIncorporation', e.target.value)} />
                        <SelectField label="Industry" value={form.industry}
                            onChange={(e) => update('industry', e.target.value)}
                            options={INDUSTRIES.map((i) => ({ label: i, value: i.toLowerCase() }))} />
                    </div>
                )}

                {/* Step 2: Contact & Family */}
                {step === 2 && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InputField label="Phone Number" required value={form.phone} error={errors.phone}
                                onChange={(e) => update('phone', e.target.value)} placeholder="+233XXXXXXXXX" />
                            <InputField label="Email" type="email" value={form.email}
                                onChange={(e) => update('email', e.target.value)} placeholder="name@example.com" />
                            <InputField label="Digital Address" value={form.digitalAddress}
                                onChange={(e) => update('digitalAddress', e.target.value)} placeholder="XX-XXX-XXXX" />
                            <SelectField label="Region" required value={form.region} error={errors.region}
                                onChange={(e) => update('region', e.target.value)}
                                options={REGIONS.map((r) => ({ label: r, value: r }))} />
                            <InputField label="City / Town" required value={form.city} error={errors.city}
                                onChange={(e) => update('city', e.target.value)} placeholder="e.g. Accra" className="sm:col-span-2" />
                        </div>

                        <div className="pt-4 border-t border-surface-100">
                            <h3 className="text-sm font-bold text-surface-900 mb-4">Next of Kin / Emergency Contact</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InputField label="Full Name" required value={form.nextOfKinName} error={errors.nextOfKinName}
                                    onChange={(e) => update('nextOfKinName', e.target.value)} placeholder="Next of Kin Name" />
                                <InputField label="Relationship" value={form.nextOfKinRelationship}
                                    onChange={(e) => update('nextOfKinRelationship', e.target.value)} placeholder="e.g. Spouse, Parent" />
                                <InputField label="Phone Number" required value={form.nextOfKinPhone} error={errors.nextOfKinPhone}
                                    onChange={(e) => update('nextOfKinPhone', e.target.value)} placeholder="+233XXXXXXXXX" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: KYC & Banking */}
                {step === 3 && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <SelectField label="Source of Funds" required value={form.sourceOfFunds} error={errors.sourceOfFunds}
                                onChange={(e) => update('sourceOfFunds', e.target.value)}
                                options={[
                                    { label: 'Salary', value: 'salary' },
                                    { label: 'Business Income', value: 'business' },
                                    { label: 'Inheritance', value: 'inheritance' },
                                    { label: 'Investment', value: 'investment' },
                                    { label: 'Other', value: 'other' },
                                ]} />
                            <SelectField label="Purpose of Relationship" required value={form.purposeOfRelationship} error={errors.purposeOfRelationship}
                                onChange={(e) => update('purposeOfRelationship', e.target.value)}
                                options={[
                                    { label: 'Personal Insurance', value: 'personal' },
                                    { label: 'Business Insurance', value: 'business' },
                                    { label: 'Investment', value: 'investment' },
                                ]} />
                            <InputField label="Expected Transaction Volume (Annual)" value={form.expectedVolume}
                                onChange={(e) => update('expectedVolume', e.target.value)} placeholder="e.g. GHS 50,000" />
                            <div className="flex flex-col">
                                <label className="block text-xs font-semibold text-surface-600 mb-1.5">Are you a Politically Exposed Person (PEP)?</label>
                                <div className="flex gap-4 mt-2">
                                    <label className="flex items-center gap-2 text-sm">
                                        <input type="radio" checked={form.isPep} onChange={() => setForm(f => ({ ...f, isPep: true }))} /> Yes
                                    </label>
                                    <label className="flex items-center gap-2 text-sm">
                                        <input type="radio" checked={!form.isPep} onChange={() => setForm(f => ({ ...f, isPep: false }))} /> No
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-surface-100">
                            <h3 className="text-sm font-bold text-surface-900 mb-4">Banking Details (For Claims)</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InputField label="Bank Name" required value={form.bankName} error={errors.bankName}
                                    onChange={(e) => update('bankName', e.target.value)} placeholder="e.g. GCB Bank" />
                                <InputField label="Account Name" required value={form.bankAccountName} error={errors.bankAccountName}
                                    onChange={(e) => update('bankAccountName', e.target.value)} placeholder="Name on Account" />
                                <InputField label="Account Number" required value={form.bankAccountNumber} error={errors.bankAccountNumber}
                                    onChange={(e) => update('bankAccountNumber', e.target.value)} />
                                <InputField label="Branch" value={form.bankBranch}
                                    onChange={(e) => update('bankBranch', e.target.value)} placeholder="Branch Name" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 4: ID Documents */}
                {step === 4 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {form.type === 'individual' && (
                            <InputField label="Ghana Card Number" required value={form.ghanaCardNumber}
                                error={errors.ghanaCardNumber}
                                onChange={(e) => update('ghanaCardNumber', e.target.value)}
                                placeholder="GHA-XXXXXXXXX-X" />
                        )}
                        <div className="sm:col-span-2 space-y-4">
                            <label className="block text-xs font-semibold text-surface-600 mb-1.5">
                                Identification Documents (Mandatory for Compliance)
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="border-2 border-dashed border-surface-300 rounded-[var(--radius-md)] p-4 text-center hover:border-primary-400 transition-colors cursor-pointer">
                                    <CreditCard size={24} className="mx-auto text-surface-300 mb-2" />
                                    <p className="text-xs font-medium text-surface-600">Ghana Card (Front)</p>
                                    <p className="text-[10px] text-surface-400 mt-1">Click to upload</p>
                                </div>
                                <div className="border-2 border-dashed border-surface-300 rounded-[var(--radius-md)] p-4 text-center hover:border-primary-400 transition-colors cursor-pointer">
                                    <CreditCard size={24} className="mx-auto text-surface-300 mb-2" />
                                    <p className="text-xs font-medium text-surface-600">Ghana Card (Back)</p>
                                    <p className="text-[10px] text-surface-400 mt-1">Click to upload</p>
                                </div>
                                <div className="border-2 border-dashed border-surface-300 rounded-[var(--radius-md)] p-4 text-center hover:border-primary-400 transition-colors cursor-pointer">
                                    <User size={24} className="mx-auto text-surface-300 mb-2" />
                                    <p className="text-xs font-medium text-surface-600">Passport Photo</p>
                                    <p className="text-[10px] text-surface-400 mt-1">Click to upload</p>
                                </div>
                                <div className="border-2 border-dashed border-surface-300 rounded-[var(--radius-md)] p-4 text-center hover:border-primary-400 transition-colors cursor-pointer">
                                    <MapPin size={24} className="mx-auto text-surface-300 mb-2" />
                                    <p className="text-xs font-medium text-surface-600">Proof of Address</p>
                                    <p className="text-[10px] text-surface-400 mt-1">Utility Bill/Bank Statement</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 5: Review */}
                {step === 5 && (
                    <div className="space-y-6">
                        <div className="text-center py-4">
                            <div className="w-16 h-16 rounded-full bg-success-50 text-success-600 flex items-center justify-center mx-auto mb-4">
                                <FileCheck size={28} />
                            </div>
                            <h2 className="text-xl font-bold text-surface-900">Review & Submit</h2>
                            <p className="text-sm text-surface-500 mt-1">Check that all details are correct before registering.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-surface-50 rounded-[var(--radius-md)] p-6">
                            <ReviewField label="Client Type" value={form.type === 'corporate' ? 'Corporate' : 'Individual'} />
                            <ReviewField label="Name" value={displayName || '—'} />
                            {form.type === 'individual' && (
                                <>
                                    <ReviewField label="Date of Birth" value={form.dateOfBirth || '—'} />
                                    <ReviewField label="Gender" value={form.gender || '—'} />
                                    <ReviewField label="Occupation" value={form.occupation || '—'} />
                                    <ReviewField label="Ghana Card" value={form.ghanaCardNumber || '—'} />
                                </>
                            )}
                            <ReviewField label="Phone" value={form.phone || '—'} />
                            <ReviewField label="Email" value={form.email || '—'} />
                            <ReviewField label="Region / City" value={`${form.region}, ${form.city}`} />
                            <ReviewField label="Source of Funds" value={form.sourceOfFunds || '—'} />
                            <ReviewField label="Bank" value={`${form.bankName} (${form.bankAccountNumber})`} />
                            <ReviewField label="PEP Status" value={form.isPep ? 'Politically Exposed Person' : 'No'} />
                        </div>
                    </div>
                )}
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    onClick={step === 1 ? () => router.push('/dashboard/clients') : prev}
                    leftIcon={<ArrowLeft size={16} />}
                >
                    {step === 1 ? 'Cancel' : 'Previous'}
                </Button>
                {step < 5 ? (
                    <Button variant="primary" onClick={next} rightIcon={<ArrowRight size={16} />}>
                        Continue
                    </Button>
                ) : (
                    <Button variant="primary" onClick={handleSubmit} leftIcon={<Check size={16} />}>
                        Register Client
                    </Button>
                )}
            </div>
        </div>
    );
}

function ReviewField({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">{label}</p>
            <p className="text-sm font-medium text-surface-800 mt-0.5 capitalize">{value}</p>
        </div>
    );
}
