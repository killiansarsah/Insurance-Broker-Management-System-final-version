'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface NotificationTrigger {
    id: string;
    title: string;
    description: string;
    enabled: boolean;
    recipients: string;
    priority: 'High' | 'Medium' | 'Low';
}

export function SettingsCommunications() {
    const [emailToggles, setEmailToggles] = useState<NotificationTrigger[]>([
        {
            id: 'policy-exp',
            title: 'Policy Expirations',
            description: 'Notify brokers 30, 15, and 7 days before a policy expires.',
            enabled: true,
            recipients: 'broker@company.com, admin@company.com',
            priority: 'High'
        },
        {
            id: 'claim-assign',
            title: 'New Claim Assignments',
            description: 'Alert relevant team members when a new claim is assigned to them.',
            enabled: true,
            recipients: 'claims-team@company.com',
            priority: 'High'
        },
        {
            id: 'user-invite',
            title: 'User Invitations',
            description: 'Email new users their login credentials and portal invitation.',
            enabled: true,
            recipients: 'system@company.com',
            priority: 'Medium'
        },
        {
            id: 'payment-rem',
            title: 'Payment Reminders',
            description: 'Send automated payment reminders for outstanding client balances.',
            enabled: false,
            recipients: 'accounts@company.com',
            priority: 'Medium'
        }
    ]);

    const [pushToggles, setPushToggles] = useState([
        { id: 'browser', title: 'Browser Notifications', desc: 'Receive real-time alerts while the portal is open.', enabled: true },
        { id: 'sound', title: 'Sound Effects', desc: 'Play a notification sound for urgent task reminders.', enabled: false },
        { id: 'mobile', title: 'Mobile App Push', desc: 'Receive alerts on the IBMS mobile application.', enabled: true },
        { id: 'desktop', title: 'Desktop Banners', desc: 'Show floating banners on your OS desktop.', enabled: true }
    ]);

    const handleEmailToggle = (id: string) => {
        setEmailToggles(prev => prev.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t));
    };

    const handlePushToggle = (id: string) => {
        setPushToggles(prev => prev.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t));
    };

    const [isSaving, setIsSaving] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }, 1000);
    };

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
                    {isSaving ? 'Saving...' : 'Save Configuration'}
                </button>
            </div>

            {/* Email Notifications Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 flex justify-between items-center">
                            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Email Event Triggers</h3>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Toggle to activate</span>
                        </div>

                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {emailToggles.map((t) => (
                                <div key={t.id} className={cn(
                                    "p-8 flex items-start justify-between gap-6 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/20",
                                    !t.enabled && "opacity-70 grayscale-[0.5]"
                                )}>
                                    <div className="flex flex-col gap-2 flex-1">
                                        <div className="flex items-center gap-3">
                                            <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{t.title}</h4>
                                            <span className={cn(
                                                "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border",
                                                t.priority === 'High' ? "bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:border-red-800/30" :
                                                    t.priority === 'Medium' ? "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800/30" :
                                                        "bg-slate-50 text-slate-500 border-slate-100 dark:bg-slate-800 dark:border-slate-700"
                                            )}>
                                                {t.priority}
                                            </span>
                                        </div>
                                        <p className="text-sm font-medium text-slate-500 leading-relaxed">{t.description}</p>

                                        <div className="mt-4 flex flex-col gap-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Default Recipients</label>
                                            <input
                                                className="w-full h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-sm font-bold text-slate-600 dark:text-slate-300 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                                value={t.recipients}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setEmailToggles(prev => prev.map(item => item.id === t.id ? { ...item, recipients: val } : item));
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="shrink-0 pt-1">
                                        <button
                                            onClick={() => handleEmailToggle(t.id)}
                                            className={cn(
                                                "relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none",
                                                t.enabled ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"
                                            )}
                                        >
                                            <span className={cn(
                                                "pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out",
                                                t.enabled ? "translate-x-6" : "translate-x-0"
                                            )} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Configuration Sidebar */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50">
                            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                                <span className="material-symbols-outlined text-slate-400 text-lg font-light">settings_suggest</span>
                                Global SMTP
                            </h3>
                        </div>
                        <div className="p-6 flex flex-col gap-6">
                            <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-2xl flex items-center gap-4 border border-slate-200 dark:border-slate-700">
                                <span className="material-symbols-outlined text-emerald-500 text-3xl">verified</span>
                                <div>
                                    <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">Status: Active</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Amazon SES Connected</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sender Name</label>
                                    <input className="h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm font-bold focus:bg-white transition-all outline-none dark:text-white" defaultValue="IBMS Portal" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sender Email</label>
                                    <input className="h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm font-bold focus:bg-white transition-all outline-none dark:text-white" defaultValue="no-reply@ibms-portal.com" />
                                </div>
                            </div>

                            <button className="w-full h-11 border border-slate-200 dark:border-slate-800 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-lg">send</span>
                                Send Test Email
                            </button>
                        </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-100 dark:border-blue-800 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-3xl">info</span>
                            <h4 className="text-sm font-black text-slate-900 dark:text-blue-100 uppercase tracking-tight">Admin Note</h4>
                        </div>
                        <p className="text-xs font-bold text-slate-600 dark:text-blue-200/70 leading-relaxed uppercase tracking-tight">
                            Email delivery rates are monitored daily. Ensure your SMTP credentials are valid to prevent notification delays.
                        </p>
                    </div>
                </div>
            </div>

            {/* Push Alerts Section */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Push Alert Channels</h3>
                    <button className="h-10 px-6 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-black text-[10px] uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">notifications_active</span>
                        Test Push Signal
                    </button>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {pushToggles.map((t) => (
                        <div key={t.id} className={cn(
                            "p-8 flex items-center justify-between gap-6 transition-colors",
                            !t.enabled && "opacity-60 grayscale"
                        )}>
                            <div className="flex flex-col gap-1">
                                <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{t.title}</h4>
                                <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-md">{t.desc}</p>
                            </div>
                            <button
                                onClick={() => handlePushToggle(t.id)}
                                className={cn(
                                    "relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none",
                                    t.enabled ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"
                                )}
                            >
                                <span className={cn(
                                    "pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out",
                                    t.enabled ? "translate-x-6" : "translate-x-0"
                                )} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/10 p-8 rounded-3xl border border-amber-100 dark:border-amber-800 flex items-start gap-6">
                <div className="size-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-2xl">error</span>
                </div>
                <div className="flex flex-col gap-2">
                    <h4 className="text-lg font-black text-amber-900 dark:text-amber-300 uppercase tracking-tight">Notification Permissions</h4>
                    <p className="text-sm font-medium text-amber-800/70 dark:text-amber-400/50 leading-relaxed">
                        If you are not receiving browser alerts, please ensure that notifications are permitted in your browser settings for <strong>ibms-portal.africa</strong>.
                    </p>
                </div>
            </div>

            {/* Success Toast */}
            {showToast && (
                <div className="fixed bottom-10 right-10 z-[200] animate-fade-in">
                    <div className="bg-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl shadow-emerald-600/30 flex items-center gap-4">
                        <span className="material-symbols-outlined font-black">check_circle</span>
                        <p className="text-sm font-black uppercase tracking-widest">Configuration Updated Successfully</p>
                    </div>
                </div>
            )}
        </div>
    );
}
