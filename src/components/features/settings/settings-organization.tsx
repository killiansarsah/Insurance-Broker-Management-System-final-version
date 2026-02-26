'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useProfileStore } from '@/stores/profile-store';

export function SettingsOrganization() {
    const logoInputRef = useRef<HTMLInputElement>(null);

    const {
        companyName, companyEmail, corporatePhone, mobileNumber, tin,
        street, city, region, gps, postal,
        businessHours, fiscalYear, commission, gracePeriod,
        polPrefix, clmPrefix, cliPrefix, ledPrefix,
        primaryColor, accentColor, logoUrl,
        updateProfile,
    } = useProfileStore();

    // Local editable copies
    const [lCompanyName, setLCompanyName] = useState(companyName);
    const [lCompanyEmail, setLCompanyEmail] = useState(companyEmail);
    const [lCorporatePhone, setLCorporatePhone] = useState(corporatePhone);
    const [lMobileNumber, setLMobileNumber] = useState(mobileNumber);
    const [lTin, setLTin] = useState(tin);
    const [lStreet, setLStreet] = useState(street);
    const [lCity, setLCity] = useState(city);
    const [lRegion, setLRegion] = useState(region);
    const [lGps, setLGps] = useState(gps);
    const [lPostal, setLPostal] = useState(postal);
    const [lBusinessHours, setLBusinessHours] = useState(businessHours);
    const [lFiscalYear, setLFiscalYear] = useState(fiscalYear);
    const [lCommission, setLCommission] = useState(commission);
    const [lGracePeriod, setLGracePeriod] = useState(gracePeriod);
    const [lPolPrefix, setLPolPrefix] = useState(polPrefix);
    const [lClmPrefix, setLClmPrefix] = useState(clmPrefix);
    const [lCliPrefix, setLCliPrefix] = useState(cliPrefix);
    const [lLedPrefix, setLLedPrefix] = useState(ledPrefix);
    const [lPrimaryColor, setLPrimaryColor] = useState(primaryColor);
    const [lAccentColor, setLAccentColor] = useState(accentColor);

    const [isSaving, setIsSaving] = useState(false);
    const [showToast, setShowToast] = useState(false);

    // Apply branding colors as CSS custom properties live
    useEffect(() => {
        document.documentElement.style.setProperty('--brand-primary', lPrimaryColor);
        document.documentElement.style.setProperty('--brand-accent', lAccentColor);
    }, [lPrimaryColor, lAccentColor]);

    const handleSave = () => {
        setIsSaving(true);
        updateProfile({
            companyName: lCompanyName, companyEmail: lCompanyEmail,
            corporatePhone: lCorporatePhone, mobileNumber: lMobileNumber, tin: lTin,
            street: lStreet, city: lCity, region: lRegion, gps: lGps, postal: lPostal,
            businessHours: lBusinessHours, fiscalYear: lFiscalYear,
            commission: lCommission, gracePeriod: lGracePeriod,
            polPrefix: lPolPrefix, clmPrefix: lClmPrefix, cliPrefix: lCliPrefix, ledPrefix: lLedPrefix,
            primaryColor: lPrimaryColor, accentColor: lAccentColor,
        });
        setTimeout(() => {
            setIsSaving(false);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }, 800);
    };

    const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        updateProfile({ logoUrl: url });
    }, [updateProfile]);

    return (
        <div className="flex flex-col gap-10">
            {/* Save Button Header */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`h-12 px-10 rounded-xl bg-primary hover:bg-primary-hover text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 transition-all flex items-center gap-2 ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
                >
                    {isSaving ? <span className="animate-spin material-symbols-outlined text-lg">sync</span> : <span className="material-symbols-outlined text-lg">save</span>}
                    {isSaving ? 'Saving...' : 'Update Profile'}
                </button>
            </div>

            {/* Company Identity */}
            <div className="flex flex-col gap-8">
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-10 flex flex-col md:flex-row items-center gap-10">
                    <div className="relative group">
                        <div className="size-40 rounded-full border-4 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-center overflow-hidden shadow-inner p-4 relative font-black text-3xl text-primary">
                            {logoUrl ? (
                                <img src={logoUrl} alt="Company Logo" className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500" />
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
                            className="absolute bottom-2 right-2 size-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-95"
                        >
                            <span className="material-symbols-outlined text-2xl">photo_camera</span>
                        </button>
                    </div>
                    <div className="flex flex-col gap-4 text-center md:text-left">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{lCompanyName}</h3>
                            <p className="text-sm font-medium text-slate-500 mt-1 leading-relaxed">Licensed Insurance Brokerage Firm</p>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                            <Badge variant="success" className="px-4 py-1.5 rounded-lg font-black uppercase text-[10px] tracking-widest bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-800/30">NIC Verified</Badge>
                            <Badge variant="surface" className="px-4 py-1.5 rounded-lg font-black uppercase text-[10px] tracking-widest">Professional Tier</Badge>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="px-10 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50">
                        <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">General Information</h3>
                    </div>
                    <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="md:col-span-2">
                            <OrgInput label="Company Name" value={lCompanyName} onChange={setLCompanyName} />
                        </div>
                        <OrgInput label="Corporate Email Address" value={lCompanyEmail} onChange={setLCompanyEmail} type="email" />
                        <OrgInput label="NIC Registration Number" value="NIC/BRK/ACC-2024/09921" disabled />
                        <OrgInput label="Corporate Phone Number" value={lCorporatePhone} onChange={setLCorporatePhone} />
                        <OrgInput label="Mobile Phone Number" value={lMobileNumber} onChange={setLMobileNumber} />
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
                    <OrgInput label="City" value={lCity} onChange={setLCity} />
                    <OrgInput label="Region" value={lRegion} onChange={setLRegion} />
                    <OrgInput label="Digital Address (GPS)" value={lGps} onChange={setLGps} />
                    <div className="md:col-span-2">
                        <OrgInput label="Postal Address" value={lPostal} onChange={setLPostal} />
                    </div>
                </div>
            </div>

            {/* Operational & Branding */}
            <div className="flex flex-col gap-8">
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="px-10 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50">
                        <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Operational Settings</h3>
                    </div>
                    <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <OrgInput label="Business Hours" value={lBusinessHours} onChange={setLBusinessHours} />
                        <OrgInput label="Fiscal Year Start" value={lFiscalYear} onChange={setLFiscalYear} />
                        <OrgInput label="Default Commission (%)" value={lCommission} onChange={setLCommission} type="number" />
                        <OrgInput label="Premium Grace Period (Days)" value={lGracePeriod} onChange={setLGracePeriod} type="number" />
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="px-10 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50">
                        <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Branding & Prefixes</h3>
                    </div>
                    <div className="p-10 space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="flex flex-col gap-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Brand Color</label>
                                <div className="flex items-center gap-4">
                                    <div className="size-14 rounded-2xl border-4 border-slate-50 shadow-sm flex-shrink-0" style={{ backgroundColor: lPrimaryColor }} />
                                    <input type="text" value={lPrimaryColor} onChange={(e) => setLPrimaryColor(e.target.value)} className="flex-1 h-14 px-5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold font-mono text-sm outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-primary/10 transition-all dark:text-white" />
                                    <input type="color" value={lPrimaryColor} onChange={(e) => setLPrimaryColor(e.target.value)} className="size-14 rounded-2xl border-2 border-slate-200 cursor-pointer overflow-hidden p-0" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Accent Color</label>
                                <div className="flex items-center gap-4">
                                    <div className="size-14 rounded-2xl border-4 border-slate-50 shadow-sm flex-shrink-0" style={{ backgroundColor: lAccentColor }} />
                                    <input type="text" value={lAccentColor} onChange={(e) => setLAccentColor(e.target.value)} className="flex-1 h-14 px-5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold font-mono text-sm outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-primary/10 transition-all dark:text-white" />
                                    <input type="color" value={lAccentColor} onChange={(e) => setLAccentColor(e.target.value)} className="size-14 rounded-2xl border-2 border-slate-200 cursor-pointer overflow-hidden p-0" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-slate-100 dark:border-slate-800">
                            <OrgInput label="Policy Prefix" value={lPolPrefix} onChange={setLPolPrefix} />
                            <OrgInput label="Claim Prefix" value={lClmPrefix} onChange={setLClmPrefix} />
                            <OrgInput label="Client Prefix" value={lCliPrefix} onChange={setLCliPrefix} />
                            <OrgInput label="Lead Prefix" value={lLedPrefix} onChange={setLLedPrefix} />
                        </div>

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
                    </div>
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

function OrgInput({ label, value, onChange, type = "text", disabled = false, badge }: {
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
