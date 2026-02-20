'use client';

import { useRef, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
    User, Bell, Shield, Save, Camera, Check, Lock,
    Smartphone, Languages, Layout, Building2, Users,
    FileText, Globe, Eye, EyeOff, X
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { SettingsOrganization } from '@/components/features/settings/settings-organization';
import { SettingsUsers } from '@/components/features/settings/settings-users';
import { SettingsTerms } from '@/components/features/settings/settings-terms';
import { useProfileStore } from '@/stores/profile-store';

type Tab = 'profile' | 'organization' | 'users' | 'notifications' | 'security' | 'terms';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<Tab>('profile');
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const profileInputRef = useRef<HTMLInputElement>(null);

    const {
        firstName, lastName, email, phone, bio, avatarUrl,
        updateProfile,
    } = useProfileStore();

    const [localName, setLocalName] = useState(firstName + ' ' + lastName);
    const [localEmail, setLocalEmail] = useState(email);
    const [localPhone, setLocalPhone] = useState(phone);
    const [localBio, setLocalBio] = useState(bio);

    const handleSave = () => {
        setIsSaving(true);
        updateProfile({
            firstName: localName.split(' ')[0] || localName,
            lastName: localName.split(' ').slice(1).join(' ') || lastName,
            email: localEmail,
            phone: localPhone,
            bio: localBio,
        });
        setTimeout(() => {
            setIsSaving(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }, 1000);
    };

    const handleProfileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        updateProfile({ avatarUrl: url });
    }, [updateProfile]);

    return (
        <div className="space-y-6 animate-fade-in max-w-5xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-surface-900 tracking-tight">Settings</h1>
                    <p className="text-sm text-surface-500 mt-1">Manage your account preferences and system configuration.</p>
                </div>
                {activeTab === 'profile' && (
                    <Button
                        variant="primary"
                        leftIcon={showSuccess ? <Check size={16} /> : <Save size={16} />}
                        onClick={handleSave}
                        disabled={isSaving}
                        className="shadow-xl shadow-primary-500/20"
                    >
                        {isSaving ? 'Saving...' : showSuccess ? 'Changes Saved' : 'Save Changes'}
                    </Button>
                )}
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-64 shrink-0">
                    <Card padding="none" className="p-2 border-surface-200 sticky top-24">
                        <nav className="space-y-1">
                            {[
                                { id: 'profile', label: 'My Profile', icon: User },
                                { id: 'organization', label: 'Organization', icon: Building2 },
                                { id: 'users', label: 'Users', icon: Users },
                                { id: 'notifications', label: 'Notifications', icon: Bell },
                                { id: 'security', label: 'Security', icon: Shield },
                                { id: 'terms', label: 'Terms & Conditions', icon: FileText },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id as Tab)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-all",
                                        activeTab === item.id
                                            ? "bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-100"
                                            : "text-surface-600 hover:bg-surface-50 hover:text-surface-900"
                                    )}
                                >
                                    <item.icon size={18} className={cn(activeTab === item.id ? "text-primary-600" : "text-surface-400")} />
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    </Card>
                </div>

                <div className="flex-1 min-w-0 pb-12">
                    {activeTab === 'profile' && (
                        <Card padding="lg" className="border-surface-200">
                            <div className="space-y-8">
                                <h3 className="text-lg font-bold text-surface-900 pb-4 border-b border-surface-100 uppercase tracking-widest text-[11px]">
                                    Profile Information
                                </h3>
                                <div className="flex items-center gap-6 mb-8">
                                    <div className="relative group">
                                        <div className="w-24 h-24 rounded-full bg-surface-100 flex items-center justify-center text-surface-400 border-4 border-white shadow-2xl overflow-hidden ring-1 ring-surface-200 relative">
                                            {avatarUrl ? (
                                                <Image src={avatarUrl} alt="Profile" fill className="object-cover" />
                                            ) : (
                                                <span className="text-3xl font-black text-surface-400">
                                                    {firstName[0]}{lastName[0]}
                                                </span>
                                            )}
                                        </div>
                                        <label className="absolute -bottom-1 -right-1 p-2 bg-white rounded-full shadow-lg border border-surface-100 cursor-pointer hover:bg-surface-50 transition-colors group">
                                            <Camera size={14} className="text-surface-600 group-hover:text-primary-600" />
                                            <input type="file" className="hidden" accept="image/*" onChange={handleProfileUpload} ref={profileInputRef} />
                                        </label>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-surface-900">{firstName} {lastName}</h4>
                                        <p className="text-sm text-surface-500 font-medium">System Administrator</p>
                                        <div className="flex gap-2 mt-2">
                                            <Badge variant="primary" className="text-[9px] font-bold uppercase tracking-wider">Broker Admin</Badge>
                                            <Badge variant="surface" className="text-[9px] font-bold uppercase tracking-wider">Full Access</Badge>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <SettingInput label="Full Name" value={localName} onChange={setLocalName} />
                                    <SettingInput label="Email Address" value={localEmail} onChange={setLocalEmail} />
                                    <SettingInput label="Phone Number" value={localPhone} onChange={setLocalPhone} />
                                    <SettingInput label="Department" value="Corporate Brokerage" disabled />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Biography</label>
                                    <textarea
                                        value={localBio}
                                        onChange={(e) => setLocalBio(e.target.value)}
                                        rows={4}
                                        className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-2xl text-sm font-medium outline-none transition-all focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 min-h-[120px]"
                                    />
                                </div>
                            </div>
                        </Card>
                    )}

                    {activeTab === 'notifications' && (
                        <Card padding="lg" className="border-surface-200">
                            <div className="space-y-8">
                                <h3 className="text-lg font-bold text-surface-900 pb-4 border-b border-surface-100 uppercase tracking-widest text-[11px]">
                                    Notification Channels
                                </h3>
                                <div className="space-y-4">
                                    <ToggleRow icon={<Bell size={20} />} title="Email Notifications" desc="Receive daily summaries and urgent alerts via your registered email." defaultChecked />
                                    <ToggleRow icon={<Smartphone size={20} />} title="Push Notifications" desc="Desktop and mobile push alerts for real-time compliance updates." defaultChecked />
                                    <ToggleRow icon={<Globe size={20} />} title="In-App Activity" desc="Visual indicators for new leads, renewals, and system messages." defaultChecked />
                                </div>

                                <div className="pt-6 border-t border-surface-100">
                                    <h4 className="text-xs font-bold text-surface-900 mb-4 uppercase tracking-wider">Specific Events</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <CheckboxItem label="Policy Renewals" defaultChecked />
                                        <CheckboxItem label="Claim Updates" defaultChecked />
                                        <CheckboxItem label="Compliance Alerts" defaultChecked />
                                        <CheckboxItem label="Finance & Invoices" />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {activeTab === 'security' && <SecurityTab />}
                    {activeTab === 'organization' && <SettingsOrganization />}
                    {activeTab === 'users' && <SettingsUsers />}
                    {activeTab === 'terms' && <SettingsTerms />}
                </div>
            </div>
        </div>
    );
}

function SettingInput({ label, value, onChange, type = "text", disabled = false }: {
    label: string; value: string; onChange?: (v: string) => void; type?: string; disabled?: boolean;
}) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                disabled={disabled}
                className={cn(
                    "w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm font-medium outline-none transition-all focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500",
                    disabled && "bg-surface-100 text-surface-400 cursor-not-allowed opacity-60"
                )}
            />
        </div>
    );
}

function ToggleRow({ icon, title, desc, defaultChecked }: { icon: React.ReactNode; title: string; desc: string; defaultChecked?: boolean; }) {
    const [checked, setChecked] = useState(defaultChecked ?? false);
    return (
        <div className="flex items-start justify-between p-1">
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-50 flex items-center justify-center text-surface-500 border border-surface-100">{icon}</div>
                <div>
                    <p className="text-sm font-bold text-surface-900">{title}</p>
                    <p className="text-xs text-surface-500 mt-0.5 leading-relaxed">{desc}</p>
                </div>
            </div>
            <button onClick={() => setChecked(!checked)} className={cn("w-11 h-6 rounded-full transition-colors relative flex-shrink-0", checked ? "bg-primary-600" : "bg-surface-200")}>
                <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm", checked ? "left-6" : "left-1")} />
            </button>
        </div>
    );
}

function CheckboxItem({ label, defaultChecked = false }: { label: string; defaultChecked?: boolean; }) {
    const [checked, setChecked] = useState(defaultChecked);
    return (
        <label className="flex items-center gap-3 cursor-pointer group" onClick={() => setChecked(c => !c)}>
            <div className={cn("w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all", checked ? "bg-primary-600 border-primary-600 text-white" : "border-surface-200 bg-white group-hover:border-primary-300")}>
                {checked && <Check size={12} strokeWidth={4} />}
            </div>
            <span className="text-sm font-medium text-surface-700">{label}</span>
        </label>
    );
}

function SecurityTab() {
    const [showPasswordPanel, setShowPasswordPanel] = useState(false);
    const [currentPw, setCurrentPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');

    const handleChangePassword = () => {
        setError('');
        if (!currentPw || !newPw || !confirmPw) { setError('All fields are required.'); return; }
        if (newPw.length < 8) { setError('New password must be at least 8 characters.'); return; }
        if (newPw !== confirmPw) { setError('Passwords do not match.'); return; }
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            setSaved(true);
            setCurrentPw(''); setNewPw(''); setConfirmPw('');
            setTimeout(() => { setSaved(false); setShowPasswordPanel(false); }, 2500);
        }, 1200);
    };

    return (
        <Card padding="lg">
            <h3 className="text-lg font-bold text-surface-900 mb-6 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-danger-50 text-danger-600 flex items-center justify-center"><Shield size={18} /></div>
                Account Security
            </h3>
            <div className="space-y-4">
                <div className="p-4 bg-surface-50 rounded-2xl border border-surface-100 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-xl shadow-sm border border-surface-100 text-danger-600"><Lock size={20} /></div>
                            <div>
                                <p className="text-sm font-bold text-surface-900">Change Password</p>
                                <p className="text-xs text-surface-500 font-medium">Last updated 4 months ago</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="font-bold uppercase tracking-widest text-[10px]" onClick={() => { setShowPasswordPanel(p => !p); setError(''); }}>
                            {showPasswordPanel ? 'Cancel' : 'Update'}
                        </Button>
                    </div>
                    {showPasswordPanel && (
                        <div className="pt-2 border-t border-surface-200 space-y-4">
                            {error && <div className="flex items-center gap-2 p-3 bg-danger-50 border border-danger-200 rounded-xl text-danger-700 text-xs font-bold"><X size={14} />{error}</div>}
                            {saved && <div className="flex items-center gap-2 p-3 bg-success-50 border border-success-200 rounded-xl text-success-700 text-xs font-bold"><Check size={14} />Password updated successfully!</div>}
                            <PasswordInput label="Current Password" value={currentPw} onChange={setCurrentPw} show={showCurrent} onToggle={() => setShowCurrent(s => !s)} />
                            <PasswordInput label="New Password" value={newPw} onChange={setNewPw} show={showNew} onToggle={() => setShowNew(s => !s)} hint="Minimum 8 characters" />
                            <PasswordInput label="Confirm New Password" value={confirmPw} onChange={setConfirmPw} show={showNew} onToggle={() => setShowNew(s => !s)} />
                            <Button variant="primary" size="sm" onClick={handleChangePassword} disabled={saving} leftIcon={saved ? <Check size={14} /> : <Lock size={14} />} className="shadow-lg shadow-primary-500/20">
                                {saving ? 'Updating...' : saved ? 'Updated!' : 'Update Password'}
                            </Button>
                        </div>
                    )}
                </div>
                <div className="pt-4">
                    <h4 className="text-sm font-bold text-surface-900 mb-4 uppercase tracking-wider">Security Logs</h4>
                    <div className="space-y-2">
                        <SecurityLog title="Successful Login" time="Today, 09:42 AM" ip="154.160.22.10" />
                        <SecurityLog title="API Key Generated" time="Yesterday, 14:15 PM" ip="154.160.22.10" />
                        <SecurityLog title="Password Changed" time="4 months ago" ip="154.160.12.88" />
                    </div>
                </div>
            </div>
        </Card>
    );
}

function PasswordInput({ label, value, onChange, show, onToggle, hint }: { label: string; value: string; onChange: (v: string) => void; show: boolean; onToggle: () => void; hint?: string; }) {
    return (
        <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">{label}</label>
            <div className="relative">
                <input type={show ? 'text' : 'password'} value={value} onChange={(e) => onChange(e.target.value)} className="w-full pl-4 pr-11 py-2.5 bg-white border border-surface-200 rounded-xl text-sm font-medium outline-none transition-all focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500" placeholder="••••••••" />
                <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors">
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            </div>
            {hint && <p className="text-[10px] text-surface-400 font-medium">{hint}</p>}
        </div>
    );
}

function SecurityLog({ title, time, ip }: { title: string; time: string; ip: string; }) {
    return (
        <div className="flex items-center justify-between py-3 border-b border-surface-50 last:border-0 px-1">
            <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-success-500 shadow-sm shadow-success-500/50" />
                <div>
                    <p className="text-xs font-bold text-surface-900">{title}</p>
                    <p className="text-[10px] font-medium text-surface-400 mt-0.5 uppercase tracking-tight">{time}</p>
                </div>
            </div>
            <p className="text-[10px] font-bold text-surface-500 font-mono tracking-tighter">{ip}</p>
        </div>
    );
}
