'use client';

import { useState } from 'react';
import {
    User,
    Bell,
    Shield,
    Save,
    Camera,
    Check,
    Lock,
    Smartphone,
    Languages,
    Layout,
    Building2,
    Users,
    FileText,
    Globe,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { SettingsOrganization } from '@/components/features/settings/settings-organization';
import { SettingsUsers } from '@/components/features/settings/settings-users';

import { SettingsTerms } from '@/components/features/settings/settings-terms';


type Tab = 'profile' | 'organization' | 'users' | 'notifications' | 'security' | 'terms';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<Tab>('profile');
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [profileImg, setProfileImg] = useState<string | null>(null);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }, 1200);
    };

    const handleProfileUpload = () => {
        // Simulate file click
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = () => {
            setIsSaving(true);
            setTimeout(() => {
                setProfileImg('https://api.dicebear.com/7.x/avataaars/svg?seed=Kwame');
                setIsSaving(false);
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 2000);
            }, 1000);
        };
        input.click();
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-5xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-surface-900 tracking-tight">Settings</h1>
                    <p className="text-sm text-surface-500 mt-1">Manage your account preferences and system configuration.</p>
                </div>
                <Button
                    variant="primary"
                    leftIcon={showSuccess ? <Check size={16} /> : <Save size={16} />}
                    onClick={handleSave}
                    disabled={isSaving}
                    className="shadow-xl shadow-primary-500/20"
                >
                    {isSaving ? 'Saving...' : showSuccess ? 'Changes Saved' : 'Save Changes'}
                </Button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Navigation Sidebar */}
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
                                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all uppercase tracking-wider",
                                        activeTab === item.id
                                            ? "bg-primary-600 text-white shadow-lg shadow-primary-500/20"
                                            : "text-surface-500 hover:bg-surface-50 hover:text-surface-900"
                                    )}
                                >
                                    <item.icon size={16} />
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    </Card>
                </div>

                {/* Content Area */}
                <div className="flex-1 space-y-6">
                    {activeTab === 'profile' && (
                        <>
                            <Card padding="lg">
                                <h3 className="text-lg font-bold text-surface-900 mb-6 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                                        <User size={18} />
                                    </div>
                                    Profile Information
                                </h3>
                                <div className="flex items-center gap-6 mb-8">
                                    <div className="relative group">
                                        <div className="w-24 h-24 rounded-full bg-surface-100 flex items-center justify-center text-surface-400 border-4 border-white shadow-2xl overflow-hidden ring-1 ring-surface-200">
                                            {profileImg ? (
                                                <img src={profileImg} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <User size={40} className="text-surface-300" />
                                            )}
                                        </div>
                                        <button
                                            onClick={handleProfileUpload}
                                            className="absolute bottom-0 right-0 p-2.5 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-all hover:scale-110 active:scale-95"
                                        >
                                            <Camera size={14} />
                                        </button>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-surface-900">Kwame Asante</h4>
                                        <p className="text-sm text-surface-500 font-medium">Chief Broker • <span className="text-primary-600 font-bold">Asante & Sons Brokerage</span></p>
                                        <div className="mt-3 flex gap-2">
                                            <Badge variant="success" className="px-2 py-0.5 rounded-lg font-bold uppercase text-[10px]">Verified Pro</Badge>
                                            <Badge variant="outline" className="px-2 py-0.5 rounded-lg font-bold uppercase text-[10px] border-surface-200">Standard Tier</Badge>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <SettingInput label="Full Name" defaultValue="Kwame Asante" />
                                    <SettingInput label="Email Address" defaultValue="kwame@asante-brokerage.com" type="email" />
                                    <SettingInput label="Phone Number" defaultValue="+233 24 123 4567" />
                                    <SettingInput label="Broker License #" defaultValue="NIC-BK-2024-889" disabled />
                                </div>
                            </Card>

                            <Card padding="lg">
                                <h3 className="text-lg font-bold text-surface-900 mb-6 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                                        <Layout size={18} />
                                    </div>
                                    Professional Bio
                                </h3>
                                <textarea
                                    className="w-full h-32 px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all placeholder:text-surface-400"
                                    defaultValue="Experienced insurance broker with over 15 years in the Ghanaian market, specializing in corporate risk and motor insurance."
                                    placeholder="Tell others about your professional background..."
                                />
                            </Card>
                        </>
                    )}

                    {activeTab === 'notifications' && (
                        <Card padding="lg">
                            <h3 className="text-lg font-bold text-surface-900 mb-6 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
                                    <Bell size={18} />
                                </div>
                                Notification Channels
                            </h3>
                            <div className="space-y-6">
                                <ToggleRow
                                    icon={<Globe size={18} />}
                                    title="Browser Notifications"
                                    desc="Stay updated with real-time pushes for new claims and leads."
                                    defaultChecked={true}
                                />
                                <ToggleRow
                                    icon={<Bell size={18} />}
                                    title="Mobile App Push"
                                    desc="Receive alerts on your iOS or Android device instantly."
                                    defaultChecked={false}
                                />
                                <ToggleRow
                                    icon={<Languages size={18} />}
                                    title="Email Digests"
                                    desc="Weekly summary of your commissions and performance."
                                    defaultChecked={true}
                                />
                                <div className="pt-4 border-t border-surface-100">
                                    <h4 className="text-sm font-bold text-surface-900 mb-4 uppercase tracking-wider">Alert Categories</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <CheckboxItem label="Policy Renewals" checked />
                                        <CheckboxItem label="Claim Updates" checked />
                                        <CheckboxItem label="Compliance Alerts" checked />
                                        <CheckboxItem label="Finance & Invoices" />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {activeTab === 'security' && (
                        <Card padding="lg">
                            <h3 className="text-lg font-bold text-surface-900 mb-6 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-danger-50 text-danger-600 flex items-center justify-center">
                                    <Shield size={18} />
                                </div>
                                Account Security
                            </h3>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-surface-50 rounded-2xl border border-surface-100">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white rounded-xl shadow-sm border border-surface-100 text-danger-600">
                                            <Lock size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-surface-900">Change Password</p>
                                            <p className="text-xs text-surface-500 font-medium">Last updated 4 months ago</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" className="font-bold uppercase tracking-widest text-[10px]">Update</Button>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-surface-50 rounded-2xl border border-surface-100">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white rounded-xl shadow-sm border border-surface-100 text-primary-600">
                                            <Smartphone size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-surface-900">Two-Factor Auth</p>
                                            <p className="text-xs text-surface-500 font-medium">+233 ••• ••• 4567</p>
                                        </div>
                                    </div>
                                    <Badge variant="success" className="font-bold uppercase text-[9px]">Active</Badge>
                                </div>

                                <div className="pt-4">
                                    <h4 className="text-sm font-bold text-surface-900 mb-4 uppercase tracking-wider">Security Logs</h4>
                                    <div className="space-y-2">
                                        <SecurityLog title="Successful Login" time="Today, 09:42 AM" ip="154.160.22.10" />
                                        <SecurityLog title="API Key Generated" time="Yesterday, 14:15 PM" ip="154.160.22.10" />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {activeTab === 'organization' && <SettingsOrganization />}
                    {activeTab === 'users' && <SettingsUsers />}
                    {activeTab === 'terms' && <SettingsTerms />}
                </div>
            </div>
        </div>
    );
}

function SettingInput({ label, defaultValue, type = "text", disabled = false }: any) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">{label}</label>
            <input
                type={type}
                defaultValue={defaultValue}
                disabled={disabled}
                className={cn(
                    "w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm font-medium outline-none transition-all focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500",
                    disabled && "bg-surface-100 text-surface-400 cursor-not-allowed opacity-60"
                )}
            />
        </div>
    );
}

function ToggleRow({ icon, title, desc, defaultChecked }: any) {
    const [checked, setChecked] = useState(defaultChecked);
    return (
        <div className="flex items-start justify-between p-1">
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-50 flex items-center justify-center text-surface-500 border border-surface-100">
                    {icon}
                </div>
                <div>
                    <p className="text-sm font-bold text-surface-900">{title}</p>
                    <p className="text-xs text-surface-500 mt-0.5 leading-relaxed">{desc}</p>
                </div>
            </div>
            <button
                onClick={() => setChecked(!checked)}
                className={cn(
                    "w-11 h-6 rounded-full transition-colors relative",
                    checked ? "bg-primary-600" : "bg-surface-200"
                )}
            >
                <div className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                    checked ? "left-6" : "left-1"
                )} />
            </button>
        </div>
    );
}

function CheckboxItem({ label, checked = false }: any) {
    return (
        <label className="flex items-center gap-3 cursor-pointer group">
            <div className={cn(
                "w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all",
                checked ? "bg-primary-600 border-primary-600 text-white" : "border-surface-200 bg-white group-hover:border-primary-300"
            )}>
                {checked && <Check size={12} strokeWidth={4} />}
            </div>
            <span className="text-sm font-medium text-surface-700">{label}</span>
        </label>
    );
}

function SecurityLog({ title, time, ip }: any) {
    return (
        <div className="flex items-center justify-between py-3 border-b border-surface-50 last:border-0 px-1">
            <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-success-500 shadow-sm shadow-success-500/50" />
                <div>
                    <p className="text-xs font-bold text-surface-900">{title}</p>
                    <p className="text-[10px] font-medium text-surface-400 mt-0.5 uppercase tracking-tight">{time}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-[10px] font-bold text-surface-500 font-mono tracking-tighter">{ip}</p>
            </div>
        </div>
    );
}

