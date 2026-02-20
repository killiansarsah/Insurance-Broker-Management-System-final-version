'use client';

import { useState } from 'react';
import { Building2, Camera, MapPin, Phone, Mail, Hash, Clock, Calendar, Palette } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function SettingsOrganization() {
    const [logoImg, setLogoImg] = useState<string | null>(null);
    const [primaryColor, setPrimaryColor] = useState('#c28532');
    const [accentColor, setAccentColor] = useState('#2563eb');

    const handleLogoUpload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = () => {
            setLogoImg('https://api.dicebear.com/7.x/initials/svg?seed=ASB&backgroundColor=c28532');
        };
        input.click();
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
                            {logoImg ? (
                                <img src={logoImg} alt="Company Logo" className="w-full h-full object-cover" />
                            ) : (
                                <Building2 size={40} className="text-surface-300" />
                            )}
                        </div>
                        <button
                            onClick={handleLogoUpload}
                            className="absolute bottom-0 right-0 p-2.5 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-all hover:scale-110 active:scale-95"
                        >
                            <Camera size={14} />
                        </button>
                    </div>
                    <div className="pt-2">
                        <h4 className="text-xl font-bold text-surface-900">Asante & Sons Brokerage</h4>
                        <p className="text-sm text-surface-500 font-medium mt-1">Licensed Insurance Brokerage Firm</p>
                        <div className="mt-3 flex gap-2">
                            <Badge variant="success" className="px-2 py-0.5 rounded-lg font-bold uppercase text-[10px]">NIC Verified</Badge>
                            <Badge variant="outline" className="px-2 py-0.5 rounded-lg font-bold uppercase text-[10px] border-surface-200">Professional Tier</Badge>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <OrgInput label="Company Name" defaultValue="Asante & Sons Brokerage" icon={<Building2 size={14} />} />
                    <OrgInput label="NIC Registration Number" defaultValue="NIC-BR-2024-0042" icon={<Hash size={14} />} disabled badge="Verified" />
                    <OrgInput label="Company Email" defaultValue="info@asante-brokerage.com" icon={<Mail size={14} />} type="email" />
                    <OrgInput label="Corporate Phone" defaultValue="+233 30 225 1234" icon={<Phone size={14} />} />
                    <OrgInput label="Mobile Number" defaultValue="+233 24 123 4567" icon={<Phone size={14} />} />
                    <OrgInput label="TIN (Tax ID)" defaultValue="C0012345678" icon={<Hash size={14} />} />
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
                    <OrgInput label="Street Address" defaultValue="14 Independence Avenue" />
                    <OrgInput label="City" defaultValue="Accra" />
                    <OrgInput label="Region" defaultValue="Greater Accra" />
                    <OrgInput label="Digital Address (GPS)" defaultValue="GA-125-7894" />
                    <div className="md:col-span-2">
                        <OrgInput label="Postal Address" defaultValue="P.O. Box AN 1234, Accra North" />
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
                    <OrgInput label="Business Hours" defaultValue="08:00 AM – 05:00 PM" icon={<Clock size={14} />} />
                    <OrgInput label="Fiscal Year Start" defaultValue="January 1" icon={<Calendar size={14} />} />
                    <OrgInput label="Default Commission (%)" defaultValue="15" type="number" />
                    <OrgInput label="Premium Grace Period (Days)" defaultValue="30" type="number" />
                </div>
            </Card>

            {/* Numbering & Branding */}
            <Card padding="lg">
                <h3 className="text-lg font-bold text-surface-900 mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                        <Palette size={18} />
                    </div>
                    Branding & Numbering
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Primary Brand Color</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={primaryColor}
                                onChange={(e) => setPrimaryColor(e.target.value)}
                                className="w-10 h-10 rounded-xl border-2 border-surface-200 cursor-pointer"
                            />
                            <input
                                type="text"
                                value={primaryColor}
                                onChange={(e) => setPrimaryColor(e.target.value)}
                                className="flex-1 px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm font-mono font-medium outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Accent Color</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={accentColor}
                                onChange={(e) => setAccentColor(e.target.value)}
                                className="w-10 h-10 rounded-xl border-2 border-surface-200 cursor-pointer"
                            />
                            <input
                                type="text"
                                value={accentColor}
                                onChange={(e) => setAccentColor(e.target.value)}
                                className="flex-1 px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm font-mono font-medium outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all"
                            />
                        </div>
                    </div>
                </div>

                <h4 className="text-sm font-bold text-surface-900 mb-4 uppercase tracking-wider">Document Numbering Prefixes</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <OrgInput label="Policy Number Prefix" defaultValue="ASB-POL-" icon={<Hash size={14} />} />
                    <OrgInput label="Claim Number Prefix" defaultValue="ASB-CLM-" icon={<Hash size={14} />} />
                    <OrgInput label="Client Number Prefix" defaultValue="ASB-CLI-" icon={<Hash size={14} />} />
                    <OrgInput label="Lead Number Prefix" defaultValue="ASB-LED-" icon={<Hash size={14} />} />
                </div>
            </Card>
        </div>
    );
}

function OrgInput({ label, defaultValue, type = "text", disabled = false, icon, badge }: {
    label: string;
    defaultValue: string;
    type?: string;
    disabled?: boolean;
    icon?: React.ReactNode;
    badge?: string;
}) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <label className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">{label}</label>
                {badge && <Badge variant="success" className="text-[8px] px-1.5 py-0 font-black uppercase">{badge}</Badge>}
            </div>
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400">
                        {icon}
                    </div>
                )}
                <input
                    type={type}
                    defaultValue={defaultValue}
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
