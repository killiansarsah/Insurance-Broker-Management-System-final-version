'use client';

import { useRef, useCallback, useEffect } from 'react';
import { Building2, Camera, MapPin, Phone, Mail, Hash, Clock, Calendar, Palette, Check, Save } from 'lucide-react';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useProfileStore } from '@/stores/profile-store';

export function SettingsOrganization() {
    const logoInputRef = useRef<HTMLInputElement>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

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

    // Apply branding colors as CSS custom properties live
    useEffect(() => {
        document.documentElement.style.setProperty('--brand-primary', lPrimaryColor);
        document.documentElement.style.setProperty('--brand-accent', lAccentColor);
    }, [lPrimaryColor, lAccentColor]);

    const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        updateProfile({ logoUrl: url });
    }, [updateProfile]);

    const handleSave = () => {
        setIsSaving(true);
        updateProfile({
            companyName: lCompanyName,
            companyEmail: lCompanyEmail,
            corporatePhone: lCorporatePhone,
            mobileNumber: lMobileNumber,
            tin: lTin,
            street: lStreet,
            city: lCity,
            region: lRegion,
            gps: lGps,
            postal: lPostal,
            businessHours: lBusinessHours,
            fiscalYear: lFiscalYear,
            commission: lCommission,
            gracePeriod: lGracePeriod,
            polPrefix: lPolPrefix,
            clmPrefix: lClmPrefix,
            cliPrefix: lCliPrefix,
            ledPrefix: lLedPrefix,
            primaryColor: lPrimaryColor,
            accentColor: lAccentColor,
        });
        setTimeout(() => {
            setIsSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }, 1000);
    };

    return (
        <div className="space-y-6">
            {/* Company Identity */}
            <Card padding="lg">
                <h3 className="text-lg font-bold text-surface-900 mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-accent-50 text-accent-600 flex items-center justify-center">
                        <Building2 size={18} />
                    </div>
                    Company Identity
                </h3>

                {/* Logo Upload */}
                <div className="flex items-start gap-6 mb-8">
                    <div className="relative group">
                        <div className="w-28 h-28 rounded-2xl bg-surface-100 flex items-center justify-center text-surface-400 border-4 border-white shadow-2xl overflow-hidden ring-1 ring-surface-200">
                            {logoUrl ? (
                                <img src={logoUrl} alt="Company Logo" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-3xl font-black text-surface-400 text-center leading-tight px-2">
                                    {lCompanyName.split(/\s+/).slice(0, 2).map(w => w[0]).join('')}
                                </span>
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
                            className="absolute bottom-0 right-0 p-2.5 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-all hover:scale-110 active:scale-95"
                        >
                            <Camera size={14} />
                        </button>
                    </div>
                    <div className="pt-2">
                        {/* Company name updates live as you type */}
                        <h4 className="text-xl font-bold text-surface-900">{lCompanyName}</h4>
                        <p className="text-sm text-surface-500 font-medium mt-1">Licensed Insurance Brokerage Firm</p>
                        <div className="mt-3 flex gap-2">
                            <Badge variant="success" className="px-2 py-0.5 rounded-lg font-bold uppercase text-[10px]">NIC Verified</Badge>
                            <Badge variant="outline" className="px-2 py-0.5 rounded-lg font-bold uppercase text-[10px] border-surface-200">Professional Tier</Badge>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <OrgInput label="Company Name" value={lCompanyName} onChange={setLCompanyName} icon={<Building2 size={14} />} />
                    <OrgInput label="NIC Registration Number" value="NIC-BR-2024-0042" icon={<Hash size={14} />} disabled badge="Verified" />
                    <OrgInput label="Company Email" value={lCompanyEmail} onChange={setLCompanyEmail} icon={<Mail size={14} />} type="email" />
                    <OrgInput label="Corporate Phone" value={lCorporatePhone} onChange={setLCorporatePhone} icon={<Phone size={14} />} />
                    <OrgInput label="Mobile Number" value={lMobileNumber} onChange={setLMobileNumber} icon={<Phone size={14} />} />
                    <OrgInput label="TIN (Tax ID)" value={lTin} onChange={setLTin} icon={<Hash size={14} />} />
                </div>
            </Card>

            {/* Address */}
            <Card padding="lg">
                <h3 className="text-lg font-bold text-surface-900 mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                        <MapPin size={18} />
                    </div>
                    Office Address
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <OrgInput label="Street Address" value={lStreet} onChange={setLStreet} />
                    <OrgInput label="City" value={lCity} onChange={setLCity} />
                    <OrgInput label="Region" value={lRegion} onChange={setLRegion} />
                    <OrgInput label="Digital Address (GPS)" value={lGps} onChange={setLGps} />
                    <div className="md:col-span-2">
                        <OrgInput label="Postal Address" value={lPostal} onChange={setLPostal} />
                    </div>
                </div>
            </Card>

            {/* Operational Settings */}
            <Card padding="lg">
                <h3 className="text-lg font-bold text-surface-900 mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-accent-50 text-accent-600 flex items-center justify-center">
                        <Clock size={18} />
                    </div>
                    Operational Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <OrgInput label="Business Hours" value={lBusinessHours} onChange={setLBusinessHours} icon={<Clock size={14} />} />
                    <OrgInput label="Fiscal Year Start" value={lFiscalYear} onChange={setLFiscalYear} icon={<Calendar size={14} />} />
                    <OrgInput label="Default Commission (%)" value={lCommission} onChange={setLCommission} type="number" />
                    <OrgInput label="Premium Grace Period (Days)" value={lGracePeriod} onChange={setLGracePeriod} type="number" />
                </div>
            </Card>

            {/* Numbering & Branding */}
            <Card padding="lg">
                <h3 className="text-lg font-bold text-surface-900 mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                        <Palette size={18} />
                    </div>
                    Branding &amp; Numbering
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Primary Brand Color</label>
                        <div className="flex items-center gap-3">
                            <input type="color" value={lPrimaryColor} onChange={(e) => setLPrimaryColor(e.target.value)} className="w-10 h-10 rounded-xl border-2 border-surface-200 cursor-pointer p-0.5" />
                            <input type="text" value={lPrimaryColor} onChange={(e) => setLPrimaryColor(e.target.value)} className="flex-1 px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm font-mono font-medium outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all" />
                            <div className="w-10 h-10 rounded-xl shadow-inner border border-surface-200 flex-shrink-0" style={{ backgroundColor: lPrimaryColor }} />
                        </div>
                        <p className="text-[10px] text-surface-400 font-medium">Applied as CSS variable across the app</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Accent Color</label>
                        <div className="flex items-center gap-3">
                            <input type="color" value={lAccentColor} onChange={(e) => setLAccentColor(e.target.value)} className="w-10 h-10 rounded-xl border-2 border-surface-200 cursor-pointer p-0.5" />
                            <input type="text" value={lAccentColor} onChange={(e) => setLAccentColor(e.target.value)} className="flex-1 px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm font-mono font-medium outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all" />
                            <div className="w-10 h-10 rounded-xl shadow-inner border border-surface-200 flex-shrink-0" style={{ backgroundColor: lAccentColor }} />
                        </div>
                        <p className="text-[10px] text-surface-400 font-medium">Used for badges, links, and secondary accents</p>
                    </div>
                </div>

                {/* Live preview */}
                <div className="p-4 rounded-2xl border border-surface-100 bg-surface-50/50 mb-6">
                    <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-3">Live Preview</p>
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="px-4 py-2 rounded-xl text-white text-xs font-bold shadow-md" style={{ backgroundColor: lPrimaryColor }}>Primary Button</div>
                        <div className="px-4 py-2 rounded-xl text-white text-xs font-bold shadow-md" style={{ backgroundColor: lAccentColor }}>Accent Button</div>
                        <span className="text-xs font-bold" style={{ color: lPrimaryColor }}>{lCompanyName}</span>
                    </div>
                </div>

                <h4 className="text-sm font-bold text-surface-900 mb-4 uppercase tracking-wider">Document Numbering Prefixes</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <OrgInput label="Policy Number Prefix" value={lPolPrefix} onChange={setLPolPrefix} icon={<Hash size={14} />} />
                    <OrgInput label="Claim Number Prefix" value={lClmPrefix} onChange={setLClmPrefix} icon={<Hash size={14} />} />
                    <OrgInput label="Client Number Prefix" value={lCliPrefix} onChange={setLCliPrefix} icon={<Hash size={14} />} />
                    <OrgInput label="Lead Number Prefix" value={lLedPrefix} onChange={setLLedPrefix} icon={<Hash size={14} />} />
                </div>

                <div className="mt-6 flex justify-end">
                    <Button
                        variant="primary"
                        leftIcon={saved ? <Check size={16} /> : <Save size={16} />}
                        onClick={handleSave}
                        disabled={isSaving}
                        className="shadow-lg shadow-primary-500/20"
                    >
                        {isSaving ? 'Saving...' : saved ? 'Saved!' : 'Save Organization Settings'}
                    </Button>
                </div>
            </Card>
        </div>
    );
}

function OrgInput({ label, value, onChange, type = "text", disabled = false, icon, badge }: {
    label: string; value: string; onChange?: (v: string) => void; type?: string; disabled?: boolean; icon?: React.ReactNode; badge?: string;
}) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <label className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">{label}</label>
                {badge && <Badge variant="success" className="text-[8px] px-1.5 py-0 font-black uppercase">{badge}</Badge>}
            </div>
            <div className="relative">
                {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400">{icon}</div>}
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    disabled={disabled}
                    className={cn(
                        "w-full py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm font-medium outline-none transition-all focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500",
                        icon ? "pl-9 pr-4" : "px-4",
                        disabled && "bg-surface-100 text-surface-400 cursor-not-allowed opacity-60"
                    )}
                />
            </div>
        </div>
    );
}
