'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useProfileStore } from '@/stores/profile-store';
import { useTenantSettings, useUpdateTenantSettings, useUploadLogo } from '@/hooks/api/use-settings';
import { toast } from 'sonner';

export function SettingsOrganization() {
    const logoInputRef = useRef<HTMLInputElement>(null);

    const { logoUrl, updateProfile } = useProfileStore();
    const { data: tenant } = useTenantSettings();
    const updateTenantMutation = useUpdateTenantSettings();
    const uploadLogoMutation = useUploadLogo();

    // Local editable copies
    const [lCompanyName, setLCompanyName] = useState('');
    const [lCompanyEmail, setLCompanyEmail] = useState('');
    const [lCorporatePhone, setLCorporatePhone] = useState('');
    const [lNicLicense, setLNicLicense] = useState('');
    const [lStreet, setLStreet] = useState('');

    const [isSaving, setIsSaving] = useState(false);
    const [showToast, setShowToast] = useState(false);

    // Populate local state from API data
    useEffect(() => {
        if (tenant) {
            const t = tenant as Record<string, any>;
            setLCompanyName(t.name || '');
            setLCompanyEmail(t.email || '');
            setLCorporatePhone(t.phone || '');
            setLNicLicense(t.nicLicense || '');
            setLStreet(t.street || t.address || '');
            // Hydrate logo from backend if available
            if (t.logoUrl) {
                const backendBase = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3001';
                const fullUrl = (t.logoUrl as string).startsWith('http')
                    ? (t.logoUrl as string)
                    : `${backendBase}${t.logoUrl}`;
                updateProfile({ logoUrl: fullUrl });
            }
        }
    }, [tenant, updateProfile]);

    const handleSave = () => {
        setIsSaving(true);
        const payload: Record<string, unknown> = {
            name: lCompanyName,
            email: lCompanyEmail,
            phone: lCorporatePhone,
            address: lStreet,
            nicLicense: lNicLicense,
        };
        updateTenantMutation.mutate(payload, {
            onSuccess: () => {
                updateProfile({
                    companyName: lCompanyName, companyEmail: lCompanyEmail,
                    corporatePhone: lCorporatePhone, street: lStreet,
                });
                setIsSaving(false);
                toast.success('Organization Saved', { description: 'Your organization settings have been updated.' });
            },
            onError: () => {
                setIsSaving(false);
                toast.error('Save Failed', { description: 'Could not update organization settings. Please try again.' });
            },
        });
    };

    const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { toast.error('File Too Large', { description: 'Please select an image under 5MB.' }); return; }
        if (!file.type.startsWith('image/')) { toast.error('Invalid File Type', { description: 'Please select an image file.' }); return; }

        uploadLogoMutation.mutate(file, {
            onSuccess: (data: any) => {
                const backendBase = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3001';
                const fullUrl = `${backendBase}${data.logoUrl}`;
                updateProfile({ logoUrl: fullUrl });
                toast.success('Logo Updated', { description: 'Organization logo has been uploaded.' });
            },
            onError: () => {
                toast.error('Upload Failed', { description: 'Could not upload logo. Please try again.' });
            },
        });
    }, [updateProfile, uploadLogoMutation]);

    return (
        <div className="flex flex-col gap-10">
            {/* Save Button Header */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`h-12 px-10 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-primary-500/20 transition-all flex items-center gap-2 ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
                >
                    {isSaving ? <span className="animate-spin material-symbols-outlined text-lg">sync</span> : <span className="material-symbols-outlined text-lg">save</span>}
                    {isSaving ? 'Saving...' : 'Update Profile'}
                </button>
            </div>

            {/* Company Identity */}
            <div className="flex flex-col gap-8">
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-10 flex flex-col md:flex-row items-center gap-10">
                    <div className="relative group">
                        <div className="size-40 rounded-full border-4 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-center overflow-hidden shadow-inner p-4 relative font-black text-3xl text-primary-600">
                            {logoUrl ? (
                                <Image src={logoUrl} alt="Company Logo" width={160} height={160} className="w-full h-full object-contain group-hover:grayscale transition-all duration-500" />
                            ) : (
                                `${lCompanyName.charAt(0)}${lCompanyName.split(/\s+/).slice(1, 2).map(w => w[0]).join('')}`
                            )}
                        </div>
                        <input
                            ref={logoInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleLogoUpload}
                        />
                        <button
                            onClick={() => logoInputRef.current?.click()}
                            className="absolute bottom-2 right-2 size-12 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-95"
                        >
                            <span className="material-symbols-outlined text-2xl">photo_camera</span>
                        </button>
                    </div>
                    <div className="flex flex-col gap-4 text-center md:text-left">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{lCompanyName}</h3>
                            <p className="text-sm font-medium text-slate-500 mt-1 leading-relaxed">
                                {(tenant as any)?.type || 'Licensed Insurance Brokerage Firm'}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                            <Badge variant="success" className="px-4 py-1.5 rounded-lg font-black uppercase text-[10px] tracking-widest bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-800/30">NIC Verified</Badge>
                            <Badge variant="surface" className="px-4 py-1.5 rounded-lg font-black uppercase text-[10px] tracking-widest">Professional Tier</Badge>
                        </div>
                    </div>
                </div>

                {/* Identity Grid */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="px-10 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50">
                        <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Corporate Identity</h3>
                    </div>
                    <div className="p-10 flex flex-col gap-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="md:col-span-2">
                                <OrgInput label="Company Name" value={lCompanyName} onChange={setLCompanyName} />
                            </div>
                            <OrgInput label="Corporate Email Address" value={lCompanyEmail} onChange={setLCompanyEmail} type="email" />
                            <OrgInput label="NIC Registration Number" value={lNicLicense || 'Not registered'} disabled />
                            <OrgInput label="Corporate Phone Number" value={lCorporatePhone} onChange={setLCorporatePhone} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Address */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-10 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50">
                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Office Address</h3>
                </div>
                <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <OrgInput label="Street Address" value={lStreet} onChange={setLStreet} />
                    {/* <OrgInput label="City" value={lCity} onChange={setLCity} />
                    <OrgInput label="Region" value={lRegion} onChange={setLRegion} />
                    <OrgInput label="Digital Address (GPS)" value={lGps} onChange={setLGps} />
                    <div className="md:col-span-2">
                        <OrgInput label="Postal Address" value={lPostal} onChange={setLPostal} />
                    </div> */}
                </div>
            </div>

            {/* Regulatory Compliance Note */}
            <div className="bg-indigo-50 dark:bg-indigo-900/10 p-8 rounded-3xl border border-indigo-100 dark:border-indigo-800 flex items-start gap-6">
                <div className="size-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/20">
                    <span className="material-symbols-outlined text-2xl">verified</span>
                </div>
                <div className="flex flex-col gap-2">
                    <h4 className="text-lg font-black text-indigo-900 dark:text-indigo-300 uppercase tracking-tight">Regulatory Compliance</h4>
                    <p className="text-sm font-medium text-indigo-800/70 dark:text-indigo-200/50 leading-relaxed">
                        Ensure your NIC Registration number is accurate. This identifier is required for regulatory reporting and electronic filings with the National Insurance Commission.
                    </p>
                </div>
            </div>

            {/* Success Toast */}
            {showToast && (
                <div className="fixed bottom-10 right-10 z-[200] animate-fade-in">
                    <div className="bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-slate-700">
                        <span className="material-symbols-outlined font-black text-emerald-500">check_circle</span>
                        <p className="text-sm font-black uppercase tracking-widest">Profile Saved Successfully</p>
                    </div>
                </div>
            )}
        </div>
    );
}

function OrgInput({ label, value, onChange, type = "TEXT", disabled = false, badge }: {
    label: string; value: string; onChange?: (v: string) => void; type?: string; disabled?: boolean; badge?: string;
}) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 ml-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
                {badge && <Badge variant="success" className="text-[8px] px-2 py-0.5 font-black uppercase tracking-widest bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-800/30">{badge}</Badge>}
            </div>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                disabled={disabled}
                className={cn(
                    "h-14 w-full px-5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold outline-none transition-all focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-primary/10 dark:text-white",
                    disabled && "bg-slate-100 dark:bg-slate-900 text-slate-400 cursor-not-allowed opacity-60"
                )}
            />
        </div>
    );
}
