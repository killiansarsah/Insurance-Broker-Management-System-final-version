'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { toast } from 'sonner';

export function SettingsSecurityDetails() {
    const [isSavingPw, setIsSavingPw] = useState(false);
    const [showPwToast, setShowPwToast] = useState(false);
    const [password, setPassword] = useState('');
    const [is2faEnabled, setIs2faEnabled] = useState(false);
    const [isSignOutAllOpen, setIsSignOutAllOpen] = useState(false);

    const handleSavePassword = () => {
        setIsSavingPw(true);
        setTimeout(() => {
            setIsSavingPw(false);
            setShowPwToast(true);
            setTimeout(() => setShowPwToast(false), 3000);
        }, 1500);
    };

    const calculateStrength = () => {
        if (password.length === 0) return 0;
        if (password.length < 6) return 33;
        if (password.length < 10) return 66;
        return 100;
    };

    const loginSessions = [
        { device: 'MacBook Pro 14"', browser: 'Chrome', location: 'Accra, Ghana', ip: '197.251.144.102', date: 'Today, 10:45 AM', current: true },
        { device: 'iPhone 15 Pro', browser: 'Mobile Safari', location: 'Accra, Ghana', ip: '197.251.144.102', date: 'Today, 08:22 AM', current: false },
        { device: 'Windows Desktop', browser: 'Edge', location: 'Lagos, Nigeria', ip: '41.218.231.10', date: 'Oct 24, 2024, 04:15 PM', current: false },
        { device: 'iPad Air', browser: 'Safari', location: 'Accra, Ghana', ip: '102.176.1.45', date: 'Oct 22, 2024, 11:30 AM', current: false },
    ];

    return (
        <div className="flex flex-col gap-10">
            {/* Change Password Section */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-10 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50">
                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Credential Management</h3>
                </div>
                <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
                            <input
                                type="password"
                                className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold focus:bg-white transition-all text-sm outline-none dark:text-white"
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                                <input
                                    type="password"
                                    className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold focus:bg-white transition-all text-sm outline-none dark:text-white"
                                    placeholder="Minimum 12 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Security Strength</span>
                                    <span className={cn(
                                        "text-[9px] font-black uppercase tracking-widest",
                                        calculateStrength() === 100 ? "text-emerald-500" : "text-slate-400"
                                    )}>
                                        {calculateStrength() === 100 ? 'Verified Secure' : calculateStrength() === 66 ? 'Moderate' : 'Weak'}
                                    </span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className={cn(
                                            "h-full transition-all duration-500",
                                            calculateStrength() === 100 ? "bg-emerald-500" : calculateStrength() === 66 ? "bg-amber-500" : "bg-rose-500"
                                        )}
                                        style={{ width: `${calculateStrength()}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                            <input
                                type="password"
                                className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold focus:bg-white transition-all text-sm outline-none dark:text-white"
                                placeholder="Re-type new password"
                            />
                        </div>
                        <button
                            onClick={handleSavePassword}
                            disabled={isSavingPw}
                            className={`h-12 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isSavingPw ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-95'}`}
                        >
                            {isSavingPw ? <span className="animate-spin material-symbols-outlined text-lg">sync</span> : <span className="material-symbols-outlined text-lg">verified_user</span>}
                            {isSavingPw ? 'Updating...' : 'Update Credentials'}
                        </button>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="p-8 rounded-3xl bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800 flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-indigo-600 text-3xl">info</span>
                                <h4 className="text-sm font-black text-slate-900 dark:text-indigo-100 uppercase tracking-tight">Password Policy</h4>
                            </div>
                            <ul className="flex flex-col gap-3">
                                {[
                                    'At least 12 characters long',
                                    'Include at least one uppercase letter',
                                    'Include at least one number',
                                    'Include at least one special character'
                                ].map((rule, i) => (
                                    <li key={i} className="flex items-center gap-3 text-[10px] font-bold text-slate-600 dark:text-indigo-200/50 uppercase tracking-widest">
                                        <span className="material-symbols-outlined text-sm text-indigo-400">check_circle</span>
                                        {rule}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Two-Factor Authentication Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 flex flex-col gap-8">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-10 flex flex-col gap-10">
                        <div className="flex items-start justify-between">
                            <div className="flex flex-col gap-2">
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Authenticator App</h3>
                                <p className="text-slate-500 font-medium text-sm leading-relaxed" style={{ maxWidth: '24rem' }}>
                                    Use an app like Google Authenticator or Authy to generate secure verification codes.
                                </p>
                            </div>
                            <button
                                onClick={() => setIs2faEnabled(!is2faEnabled)}
                                className={cn(
                                    "relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none",
                                    is2faEnabled ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"
                                )}
                            >
                                <span className={cn(
                                    "pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out",
                                    is2faEnabled ? "translate-x-6" : "translate-x-0"
                                )} />
                            </button>
                        </div>

                        {is2faEnabled && (
                            <div className="flex flex-col gap-8 p-8 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 animate-fade-in">
                                <div className="flex items-center gap-6">
                                    <div className="size-24 bg-white p-2 rounded-xl shadow-sm border border-slate-200 flex items-center justify-center">
                                        <div className="size-full bg-slate-50 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-4xl text-slate-300">qr_code_2</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1 flex-1">
                                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">Step 1 of 2</span>
                                        <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Scan QR Code</h4>
                                        <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-tight">Open your authenticator app and scan this code to link your account.</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Verification Code</label>
                                    <div className="flex gap-3">
                                        <input className="flex-1 h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-black text-2xl tracking-[0.5em] text-center focus:ring-4 focus:ring-primary/10 transition-all outline-none dark:text-white" placeholder="000000" />
                                        <button className="h-14 px-8 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20">Verify</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-primary/5 dark:bg-slate-900/50 p-8 rounded-3xl border border-primary/20 flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-3xl">verified</span>
                            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Account Recovery</h4>
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase leading-relaxed tracking-tight">
                            Print or securely store your backup codes. These allow you to regain access if you lose your authentication device.
                        </p>
                        <button className="h-11 w-full rounded-xl border-2 border-primary text-primary font-black text-[10px] uppercase tracking-widest hover:bg-primary/5 transition-all">
                            Download Recovery Codes
                        </button>
                    </div>
                </div>
            </div>

            {/* Login History Section */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-10 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Recent Session Activity</h3>
                    <button onClick={() => setIsSignOutAllOpen(true)} className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-600 transition-colors">Sign out all devices</button>
                </div>
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                {['Device & Browser', 'Location', 'IP Address', 'Last Accessed', 'Status'].map(h => (
                                    <th key={h} className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {loginSessions.map((s, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                                <span className="material-symbols-outlined">{s.device.includes('iPhone') || s.device.includes('iPad') ? 'smartphone' : 'laptop'}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{s.device}</span>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.browser}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-bold text-slate-600 dark:text-slate-300">{s.location}</td>
                                    <td className="px-8 py-6 font-mono text-xs text-slate-400">{s.ip}</td>
                                    <td className="px-8 py-6 text-xs font-bold text-slate-500">{s.date}</td>
                                    <td className="px-8 py-6">
                                        {s.current ? (
                                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 text-[9px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-800 animate-pulse">
                                                Active Now
                                            </span>
                                        ) : (
                                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Logged out</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Success Toast */}
            {showPwToast && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] animate-fade-in">
                    <div className="bg-emerald-600 text-white px-10 py-5 rounded-3xl shadow-2xl flex items-center gap-4">
                        <span className="material-symbols-outlined font-black">check_circle</span>
                        <p className="text-sm font-black uppercase tracking-widest">Password Updated Successfully</p>
                    </div>
                </div>
            )}

            <ConfirmationModal
                isOpen={isSignOutAllOpen}
                onClose={() => setIsSignOutAllOpen(false)}
                onConfirm={() => {
                    toast.success('All Other Sessions Terminated', { description: 'You have been signed out of all other devices.' });
                }}
                variant="danger"
                icon="logout"
                title="Sign Out All Devices?"
                description="This will immediately terminate all active sessions except your current one. Anyone using your account on other devices will be logged out."
                confirmLabel="Sign Out All"
            />
        </div>
    );
}
