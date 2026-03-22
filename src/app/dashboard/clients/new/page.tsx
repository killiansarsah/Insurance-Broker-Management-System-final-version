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
import { useCreateClient } from '@/hooks/api/use-clients';
import { useCreateDocument } from '@/hooks/api/use-documents';

const STEPS = [
    { id: 1, label: 'Basic Info', icon: <User size={16} /> },
    { id: 2, label: 'Contact & Family', icon: <MapPin size={16} /> },
    { id: 3, label: 'KYC & Banking', icon: <CreditCard size={16} /> },
    { id: 4, label: 'ID Documents', icon: <FileCheck size={16} /> },
    { id: 5, label: 'Review', icon: <Check size={16} /> },
];

interface FormData {
    type: 'INDIVIDUAL' | 'CORPORATE';
    firstName: string;
    lastName: string;
    otherNames: string;
    dateOfBirth: string;
    gender: string;
    maritalStatus: string;
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
    type: 'INDIVIDUAL',
    firstName: '',
    lastName: '',
    otherNames: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
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

const EXPECTED_VOLUMES = [
    'Below GHS 5,000',
    'GHS 5,000 – GHS 20,000',
    'GHS 20,001 – GHS 50,000',
    'GHS 50,001 – GHS 100,000',
    'Above GHS 100,000 (triggers enhanced due diligence automatically)',
];

const BANK_NAMES = [
    'GCB Bank', 'Ecobank Ghana', 'Absa Bank Ghana', 'Stanbic Bank Ghana',
    'Fidelity Bank Ghana', 'Access Bank Ghana', 'Zenith Bank Ghana',
    'CalBank', 'Republic Bank', 'First Atlantic Bank', 'GT Bank Ghana',
    'Standard Chartered', 'Agricultural Development Bank (ADB)',
    'National Investment Bank (NIB)', 'Prudential Bank', 'Others',
];

function InputField({
    label,
    required,
    error,
    success,
    ...props
}: {
    label: string;
    required?: boolean;
    error?: string;
    success?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div className={cn("transition-all duration-300", error && "animate-pulse-lite")}>
            <label className="block text-xs font-semibold text-surface-600 mb-1.5 flex items-center justify-between">
                <span>{label} {required && <span className="text-danger-500">*</span>}</span>
            </label>
            <input
                {...props}
                className={cn(
                    'w-full px-3 py-2.5 text-sm border rounded-[var(--radius-md)]',
                    'focus:outline-none focus:ring-2 transition-all duration-300',
                    'placeholder:text-surface-400',
                    error 
                        ? 'border-danger-500 bg-danger-50/50 text-danger-900 focus:border-danger-500 focus:ring-danger-500/20' 
                        : success
                            ? 'border-success-500 bg-success-50/50 text-success-900 focus:border-success-500 focus:ring-success-500/20'
                            : 'border-surface-200 bg-surface-50 focus:border-primary-500 focus:ring-primary-500/20'
                )}
            />
            {error && <p className="text-xs text-danger-500 mt-1 font-medium animate-in fade-in slide-in-from-top-1">{error}</p>}
            {success && <p className="text-xs text-success-600 mt-1 font-medium animate-in fade-in slide-in-from-top-1">Verified Ghana Card format</p>}
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
        const email = searchParams.get('EMAIL');
        const phone = searchParams.get('PHONE');
        const companyName = searchParams.get('companyName');

        if (type || firstName || lastName || email || phone || companyName) {
            return {
                ...INITIAL_FORM,
                type: (type === 'CORPORATE' ? 'CORPORATE' : 'INDIVIDUAL') as 'INDIVIDUAL' | 'CORPORATE',
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const createClientMutation = useCreateClient();
    const createDocMutation = useCreateDocument();

    const [documents, setDocuments] = useState<Record<string, File>>({});
    const [previews, setPreviews] = useState<Record<string, string>>({});

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        const file = e.target.files?.[0];
        if (file) {
            setDocuments(prev => ({ ...prev, [id]: file }));
            
            // Cleanup old preview URL to prevent memory leaks
            if (previews[id] && previews[id] !== 'PDF_DOC') {
                URL.revokeObjectURL(previews[id]);
            }

            if (file.type.startsWith('image/')) {
                setPreviews(prev => ({ ...prev, [id]: URL.createObjectURL(file) }));
            } else if (file.type === 'application/pdf') {
                setPreviews(prev => ({ ...prev, [id]: 'PDF_DOC' }));
            }
            toast.success(`Document uploaded`, { description: file.name });
        }
    };

    function update(field: keyof FormData, value: string) {
        const val = field === 'ghanaCardNumber' ? value.toUpperCase() : value;
        setForm((prev) => ({ ...prev, [field]: val }));
        
        // Live phone validation requested by user (10 digit standard or +233)
        if (['phone', 'alternatePhone', 'contactPersonPhone', 'nextOfKinPhone'].includes(field)) {
            const clean = val.replace(/[\s\-]/g, '');
            if (clean.length > 0 && clean.length < 10) {
                setErrors((prev) => ({ ...prev, [field]: 'Enter 10 digits (e.g. 054...)' }));
            } else if (clean.length >= 10 && !/^(0\d{9}|\+233\d{9})$/.test(clean)) {
                setErrors((prev) => ({ ...prev, [field]: 'Invalid Ghana format' }));
            } else {
                if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
            }
        } else if (field === 'ghanaCardNumber') {
            if (val.length > 0 && !/^[A-Z]{3}-\d{9}-\d{1}$/.test(val)) {
                setErrors((prev) => ({ ...prev, [field]: 'Format: GHA-XXXXXXXXX-X' }));
            } else {
                if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
            }
        } else {
            if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    }

    function validateStep(s: number): boolean {
        const newErrors: Partial<Record<keyof FormData, string>> = {};

        if (s === 1) {
            if (form.type === 'INDIVIDUAL') {
                if (!form.firstName.trim()) newErrors.firstName = 'Required';
                if (!form.lastName.trim()) newErrors.lastName = 'Required';
                if (!form.dateOfBirth) newErrors.dateOfBirth = 'Required';
                else if (new Date(form.dateOfBirth) > new Date()) newErrors.dateOfBirth = 'Date of birth cannot be in the future';
                if (!form.gender) newErrors.gender = 'Required';
                if (!form.occupation.trim()) newErrors.occupation = 'Required';
            } else {
                if (!form.companyName.trim()) newErrors.companyName = 'Required';
                if (!form.registrationNumber.trim()) newErrors.registrationNumber = 'Required';
                if (!form.tin.trim()) newErrors.tin = 'Required';
            }
        }

        if (s === 2) {
            if (!form.phone?.trim()) newErrors.phone = 'Required';
            else if (!/^(0\d{9}|\+233\d{9})$/.test(form.phone.replace(/\s/g, '')))
                newErrors.phone = 'Use format 0XXXXXXXXX or +233XXXXXXXXX';

            if (form.alternatePhone?.trim() && !/^(0\d{9}|\+233\d{9})$/.test(form.alternatePhone.replace(/\s/g, ''))) {
                newErrors.alternatePhone = 'Invalid format';
            }

            if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                newErrors.email = 'Invalid email format';
            if (!form.region) newErrors.region = 'Required';
            if (!form.city.trim()) newErrors.city = 'Required';
            if (!form.nextOfKinName.trim()) newErrors.nextOfKinName = 'Required';
            if (!form.nextOfKinPhone.trim()) newErrors.nextOfKinPhone = 'Required';
            else if (!/^(0\d{9}|\+233\d{9})$/.test(form.nextOfKinPhone.replace(/\s/g, '')))
                newErrors.nextOfKinPhone = 'Invalid phone number';
        }

        if (s === 3) {
            if (!form.sourceOfFunds) newErrors.sourceOfFunds = 'Required';
            if (!form.purposeOfRelationship) newErrors.purposeOfRelationship = 'Required';
            if (!form.bankAccountNumber.trim()) newErrors.bankAccountNumber = 'Required';
            if (!form.bankName.trim()) newErrors.bankName = 'Required';
        }

        if (s === 4) {
            if (form.type === 'INDIVIDUAL' && !form.ghanaCardNumber.trim())
                newErrors.ghanaCardNumber = 'Required';
            else if (form.type === 'INDIVIDUAL' && form.ghanaCardNumber.trim() && !/^GHA-\d{9}-\d$/.test(form.ghanaCardNumber.trim()))
                newErrors.ghanaCardNumber = 'Use format GHA-XXXXXXXXX-X';
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

    async function handleSubmit() {
        setIsSubmitting(true);
        createClientMutation.mutate(
            {
                type: form.type,
                firstName: form.firstName || undefined,
                lastName: form.lastName || undefined,
                companyName: form.companyName || undefined,
                phone: form.phone,
                alternatePhone: form.alternatePhone || undefined,
                email: form.email || undefined,
                region: form.region || undefined,
                city: form.city || undefined,
                digitalAddress: form.digitalAddress || undefined,
                postalAddress: form.postalAddress || undefined,
                ghanaCardNumber: form.ghanaCardNumber || undefined,
                dateOfBirth: form.dateOfBirth || undefined,
                gender: form.gender || undefined,
                nationality: form.nationality || undefined,
                maritalStatus: form.maritalStatus || undefined,
                occupation: form.occupation || undefined,
                employerName: form.employerName || undefined,
                employerAddress: form.employerAddress || undefined,
                sourceOfFunds: form.sourceOfFunds || undefined,
                purposeOfRelationship: form.purposeOfRelationship || undefined,
                expectedVolume: form.expectedVolume || undefined,
                tin: form.tin || undefined,
                registrationNumber: form.registrationNumber || undefined,
                dateOfIncorporation: form.dateOfIncorporation || undefined,
                industry: form.industry || undefined,
                isPep: form.isPep,
                eddRequired: form.expectedVolume?.includes('Above GHS 100,000') ? true : undefined,
                // Inline next-of-kin
                nextOfKinName: form.nextOfKinName || undefined,
                nextOfKinRelationship: form.nextOfKinRelationship || undefined,
                nextOfKinPhone: form.nextOfKinPhone || undefined,
                // Inline bank details
                bankName: form.bankName || undefined,
                bankAccountName: form.bankAccountName || undefined,
                bankAccountNumber: form.bankAccountNumber || undefined,
                bankBranch: form.bankBranch || undefined,
            },
            {
                onSuccess: async (res: any) => {
                    const clientId = res?.id;
                    if (clientId && Object.keys(documents).length > 0) {
                        // Submit all documents
                        for (const [docId, file] of Object.entries(documents)) {
                            createDocMutation.mutate({
                                name: `${docId} - ${file.name}`,
                                mimeType: file.type || 'application/octet-stream',
                                fileSize: file.size,
                                fileUrl: `https://storage.placeholder.com/${Math.random().toString(36).substring(7)}/${file.name}`,
                                category: 'KYC',
                                linkedEntityType: 'CLIENT',
                                linkedEntityId: clientId
                            });
                        }
                    }
                    setIsSubmitting(false);
                    toast.success('Client Registered', { description: 'New client profile has been created successfully.' });
                    router.push('/dashboard/clients');
                },
                onError: (error: any) => {
                    setIsSubmitting(false);
                    toast.error('Registration Failed', { description: error?.response?.data?.message || 'Could not create client. Please try again.' });
                },
            }
        );
    }

    const displayName = form.type === 'CORPORATE'
        ? form.companyName
        : `${form.firstName} ${form.lastName}`.trim();

    return (
        <div className="space-y-6 animate-fade-in w-full pb-12 max-w-4xl">
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
                                onClick={() => update('type', 'INDIVIDUAL')}
                                className={cn(
                                    'flex items-center gap-2 px-4 py-3 rounded-[var(--radius-md)] border-2 text-sm font-semibold cursor-pointer transition-all flex-1',
                                    form.type === 'INDIVIDUAL'
                                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                                        : 'border-surface-200 text-surface-500 hover:border-surface-300'
                                )}
                            >
                                <UsersIcon size={18} /> Individual
                            </button>
                            <button
                                onClick={() => update('type', 'CORPORATE')}
                                className={cn(
                                    'flex items-center gap-2 px-4 py-3 rounded-[var(--radius-md)] border-2 text-sm font-semibold cursor-pointer transition-all flex-1',
                                    form.type === 'CORPORATE'
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
                {step === 1 && form.type === 'INDIVIDUAL' && (
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
                                { label: 'Male', value: 'MALE' },
                                { label: 'Female', value: 'FEMALE' },
                                { label: 'Other', value: 'OTHER' },
                            ]} />
                        <SelectField label="Nationality" value={form.nationality}
                            onChange={(e) => update('nationality', e.target.value)}
                            options={[
                                { label: 'Ghanaian', value: 'Ghanaian' },
                                { label: 'Nigerian', value: 'Nigerian' },
                                { label: 'British', value: 'British' },
                                { label: 'American', value: 'American' },
                                { label: 'South African', value: 'South African' },
                                { label: 'Other', value: 'Other' },
                            ]} />
                        <SelectField label="Marital Status" value={form.maritalStatus}
                            onChange={(e) => update('maritalStatus', e.target.value)}
                            options={[
                                { label: 'Single', value: 'Single' },
                                { label: 'Married', value: 'Married' },
                                { label: 'Divorced', value: 'Divorced' },
                                { label: 'Widowed', value: 'Widowed' },
                                { label: 'Separated', value: 'Separated' },
                            ]} />
                        <InputField label="Occupation" required value={form.occupation} error={errors.occupation}
                            onChange={(e) => update('occupation', e.target.value)} placeholder="e.g. Software Engineer" />
                        <InputField label="Employer Name" value={form.employerName}
                            onChange={(e) => update('employerName', e.target.value)} placeholder="e.g. Google Ghana" />
                        <InputField label="Employer Address" value={form.employerAddress}
                            onChange={(e) => update('employerAddress', e.target.value)} placeholder="Employer location" className="sm:col-span-2" />
                    </div>
                )}

                {step === 1 && form.type === 'CORPORATE' && (
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
                                onChange={(e) => update('phone', e.target.value)} placeholder="024 123 4567" />
                            <InputField label="Alternate Phone" value={form.alternatePhone} error={errors.alternatePhone}
                                onChange={(e) => update('alternatePhone', e.target.value)} placeholder="024 123 4567" />
                            <InputField label="Email" type="email" value={form.email}
                                onChange={(e) => update('email', e.target.value)} placeholder="name@example.com" />
                            <InputField label="Digital Address" value={form.digitalAddress}
                                onChange={(e) => update('digitalAddress', e.target.value)} placeholder="XX-XXX-XXXX" />
                            <InputField label="Postal Address" value={form.postalAddress}
                                onChange={(e) => update('postalAddress', e.target.value)} placeholder="P.O. Box XXX" />
                            <SelectField label="Region" required value={form.region} error={errors.region}
                                onChange={(e) => update('region', e.target.value)}
                                options={REGIONS.map((r) => ({ label: r, value: r }))} />
                            <InputField label="City / Town" required value={form.city} error={errors.city}
                                onChange={(e) => update('city', e.target.value)} placeholder="e.g. Accra" />
                        </div>

                        <div className="pt-4 border-t border-surface-100">
                            <h3 className="text-sm font-bold text-surface-900 mb-4">Next of Kin / Emergency Contact</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InputField label="Full Name" required value={form.nextOfKinName} error={errors.nextOfKinName}
                                    onChange={(e) => update('nextOfKinName', e.target.value)} placeholder="Next of Kin Name" />
                                <InputField label="Relationship" value={form.nextOfKinRelationship}
                                    onChange={(e) => update('nextOfKinRelationship', e.target.value)} placeholder="e.g. Spouse, Parent" />
                                <InputField label="Phone Number" required value={form.nextOfKinPhone} error={errors.nextOfKinPhone}
                                    onChange={(e) => update('nextOfKinPhone', e.target.value)} placeholder="024 123 4567" />
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
                                    { label: 'Other', value: 'OTHER' },
                                ]} />
                            <SelectField label="Purpose of Relationship" required value={form.purposeOfRelationship} error={errors.purposeOfRelationship}
                                onChange={(e) => update('purposeOfRelationship', e.target.value)}
                                options={[
                                    { label: 'Personal Insurance', value: 'personal' },
                                    { label: 'Business Insurance', value: 'business' },
                                    { label: 'Investment', value: 'investment' },
                                ]} />
                            <SelectField label="Expected Transaction Volume (Annual)" value={form.expectedVolume}
                                onChange={(e) => update('expectedVolume', e.target.value)}
                                options={EXPECTED_VOLUMES.map((v) => ({ label: v, value: v }))} />
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
                                <SelectField label="Bank Name" required value={form.bankName} error={errors.bankName}
                                    onChange={(e) => update('bankName', e.target.value)}
                                    options={BANK_NAMES.map((b) => ({ label: b, value: b }))} />
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
                        {form.type === 'INDIVIDUAL' && (
                            <InputField 
                                label="Ghana Card Number" 
                                required 
                                value={form.ghanaCardNumber || ''}
                                error={errors.ghanaCardNumber}
                                success={form.ghanaCardNumber && /^[A-Z]{3}-\d{9}-\d{1}$/.test(form.ghanaCardNumber) ? true : undefined}
                                onChange={(e) => update('ghanaCardNumber', e.target.value)}
                                placeholder="GHA-123456789-0" 
                            />
                        )}
                        <div className="sm:col-span-2 space-y-4">
                            <label className="block text-xs font-semibold text-surface-600 mb-1.5">
                                Identification Documents (Mandatory for Compliance)
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { id: 'ghanaCardFront', label: 'Ghana Card (Front)', icon: <CreditCard size={24} className="mx-auto mb-2" />, sub: 'Click to upload' },
                                    { id: 'ghanaCardBack', label: 'Ghana Card (Back)', icon: <CreditCard size={24} className="mx-auto mb-2" />, sub: 'Click to upload' },
                                    { id: 'passportPhoto', label: 'Passport Photo', icon: <User size={24} className="mx-auto mb-2" />, sub: 'Click to upload' },
                                    { id: 'proofOfAddress', label: 'Proof of Address', icon: <MapPin size={24} className="mx-auto mb-2" />, sub: 'Utility Bill/Bank Statement' },
                                ].map((doc) => {
                                    const previewUrl = previews[doc.id];
                                    return (
                                        <div key={doc.id} className="relative border-2 border-dashed border-surface-300 rounded-[var(--radius-md)] hover:border-primary-400 transition-colors overflow-hidden bg-surface-50 group flex flex-col items-center justify-center min-h-[140px]">
                                            <input 
                                                type="file" 
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                onChange={(e) => handleFileUpload(e, doc.id)}
                                                title={`Upload ${doc.label}`}
                                            />
                                            {previewUrl ? (
                                                <div className="absolute inset-0 w-full h-full p-2 bg-white flex flex-col items-center justify-center pointer-events-none">
                                                    {previewUrl === 'PDF_DOC' ? (
                                                        <div className="flex flex-col items-center justify-center text-primary-600">
                                                            <FileCheck size={32} className="mb-2" />
                                                            <span className="text-sm font-semibold">PDF Uploaded</span>
                                                        </div>
                                                    ) : (
                                                        <img src={previewUrl} alt={doc.label} className="w-full h-full object-contain rounded-sm" />
                                                    )}
                                                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <FileCheck size={24} className="text-white mb-2" />
                                                        <span className="text-xs font-semibold text-white">Click to Replace</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="p-4 text-center text-surface-400 group-hover:text-primary-500 transition-colors pointer-events-none">
                                                    {doc.icon}
                                                    <p className="text-xs font-medium text-surface-600 group-hover:text-primary-600">{doc.label}</p>
                                                    <p className="text-[10px] opacity-70 mt-1">{doc.sub}</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
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

                        <div className="space-y-6">
                            {/* Basic Info */}
                            <div className="bg-surface-50 rounded-[var(--radius-md)] p-6">
                                <h3 className="text-sm font-bold text-surface-900 mb-4 border-b border-surface-200 pb-2">Basic Info</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <ReviewField label="Client Type" value={form.type === 'CORPORATE' ? 'Corporate' : 'Individual'} />
                                    <ReviewField label="Name" value={displayName || '—'} />
                                    {form.type === 'INDIVIDUAL' ? (
                                        <>
                                            <ReviewField label="Date of Birth" value={form.dateOfBirth || '—'} />
                                            <ReviewField label="Gender" value={form.gender || '—'} />
                                            <ReviewField label="Nationality" value={form.nationality || '—'} />
                                            <ReviewField label="Occupation" value={form.occupation || '—'} />
                                            <ReviewField label="Employer" value={form.employerName || '—'} />
                                        </>
                                    ) : (
                                        <>
                                            <ReviewField label="Registration Number" value={form.registrationNumber || '—'} />
                                            <ReviewField label="TIN" value={form.tin || '—'} />
                                            <ReviewField label="Date of Incorporation" value={form.dateOfIncorporation || '—'} />
                                            <ReviewField label="Industry" value={form.industry || '—'} />
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Contact & Family */}
                            <div className="bg-surface-50 rounded-[var(--radius-md)] p-6">
                                <h3 className="text-sm font-bold text-surface-900 mb-4 border-b border-surface-200 pb-2">Contact & Family</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <ReviewField label="Phone" value={form.phone || '—'} />
                                    <ReviewField label="Email" value={form.email || '—'} />
                                    <ReviewField label="Digital Address" value={form.digitalAddress || '—'} />
                                    <ReviewField label="Region / City" value={`${form.region}, ${form.city}`} />
                                    <ReviewField label="Next of Kin Name" value={form.nextOfKinName || '—'} />
                                    <ReviewField label="Next of Kin Phone" value={form.nextOfKinPhone || '—'} />
                                    <ReviewField label="Next of Kin Relationship" value={form.nextOfKinRelationship || '—'} />
                                </div>
                            </div>

                            {/* KYC & Banking */}
                            <div className="bg-surface-50 rounded-[var(--radius-md)] p-6">
                                <h3 className="text-sm font-bold text-surface-900 mb-4 border-b border-surface-200 pb-2">KYC & Banking</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <ReviewField label="Source of Funds" value={form.sourceOfFunds || '—'} />
                                    <ReviewField label="Purpose of Relationship" value={form.purposeOfRelationship || '—'} />
                                    <ReviewField label="Expected Volume" value={form.expectedVolume || '—'} />
                                    <ReviewField label="PEP Status" value={form.isPep ? 'Politically Exposed Person' : 'No'} />
                                    <ReviewField label="Bank Name" value={form.bankName || '—'} />
                                    <ReviewField label="Account Name" value={form.bankAccountName || '—'} />
                                    <ReviewField label="Account Number" value={form.bankAccountNumber || '—'} />
                                    <ReviewField label="Bank Branch" value={form.bankBranch || '—'} />
                                </div>
                            </div>

                            {/* ID Documents */}
                            <div className="bg-surface-50 rounded-[var(--radius-md)] p-6">
                                <h3 className="text-sm font-bold text-surface-900 mb-4 border-b border-surface-200 pb-2">ID Documents</h3>
                                {form.type === 'INDIVIDUAL' && (
                                    <div className="mb-6">
                                        <ReviewField label="Ghana Card Number" value={form.ghanaCardNumber || '—'} />
                                    </div>
                                )}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {[
                                        { id: 'ghanaCardFront', label: 'Ghana Card (Front)' },
                                        { id: 'ghanaCardBack', label: 'Ghana Card (Back)' },
                                        { id: 'passportPhoto', label: 'Passport Photo' },
                                        { id: 'proofOfAddress', label: 'Proof of Address' },
                                    ].map((doc) => {
                                        const previewUrl = previews[doc.id];
                                        return (
                                            <div key={doc.id}>
                                                <p className="text-[10px] font-semibold text-surface-400 uppercase tracking-wider mb-2">{doc.label}</p>
                                                <div className="h-24 bg-surface-100 rounded-[var(--radius-md)] overflow-hidden border border-surface-200 flex items-center justify-center">
                                                    {previewUrl ? (
                                                        previewUrl === 'PDF_DOC' ? (
                                                            <div className="flex flex-col items-center justify-center text-primary-500">
                                                                <FileCheck size={20} className="mb-1" />
                                                                <span className="text-[10px] font-semibold">PDF</span>
                                                            </div>
                                                        ) : (
                                                            <img src={previewUrl} alt={doc.label} className="w-full h-full object-contain bg-white" />
                                                        )
                                                    ) : (
                                                        <span className="text-xs text-surface-400 font-medium">Not uploaded</span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
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
                    <Button variant="primary" onClick={handleSubmit} leftIcon={<Check size={16} />} isLoading={isSubmitting} disabled={isSubmitting}>
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
            <p className="text-[10px] font-semibold text-surface-400 uppercase tracking-wider">{label}</p>
            <p className="text-sm font-medium text-surface-800 mt-1">{value || '—'}</p>
        </div>
    );
}
