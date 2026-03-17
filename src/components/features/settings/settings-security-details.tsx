'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
const ConfirmationModal = dynamic(
    () => import('@/components/ui/confirmation-modal').then(m => ({ default: m.ConfirmationModal })),
    { ssr: false }
);
import { toast } from 'sonner';
import { useChangePassword, useGenerate2FASecret, useEnable2FA, useDisable2FA } from '@/hooks/api/use-settings';
import { useProfile } from '@/hooks/api/use-settings';

export function SettingsSecurityDetails() {
    const [isSavingPw, setIsSavingPw] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // 2FA state
    const [is2faEnabled, setIs2faEnabled] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [twoFaCode, setTwoFaCode] = useState('');
    const [isGenerating2FA, setIsGenerating2FA] = useState(false);
    const [isVerifying2FA, setIsVerifying2FA] = useState(false);
    const [showDisableConfirm, setShowDisableConfirm] = useState(false);
    const [disableCode, setDisableCode] = useState('');

    const { data: profile } = useProfile();
    const changePasswordMutation = useChangePassword();
    const generate2FAMutation = useGenerate2FASecret();
    const enable2FAMutation = useEnable2FA();
    const disable2FAMutation = useDisable2FA();

    // Sync 2FA state from profile
    useEffect(() => {
        if (profile) {
            setIs2faEnabled(!!(profile as any).twoFactorEnabled);
        }
    }, [profile]);

    const handleSavePassword = () => {
        if (!currentPassword.trim()) {
            toast.error('Please enter your current password.');
            return;
        }
        if (password.length < 8) {
            toast.error('New password must be at least 8 characters.');
            return;
        }
        if (!/[A-Z]/.test(password)) {
            toast.error('New password must contain at least one uppercase letter.');
            return;
        }
        if (!/[0-9]/.test(password)) {
            toast.error('New password must contain at least one number.');
            return;
        }
        if (password !== confirmPassword) {
            toast.error('New password and confirmation do not match.');
            return;
        }

        setIsSavingPw(true);
        changePasswordMutation.mutate(
            { currentPassword, newPassword: password, confirmPassword },
            {
                onSuccess: () => {
                    setIsSavingPw(false);
                    setCurrentPassword('');
                    setPassword('');
                    setConfirmPassword('');
                    toast.success('Password Updated', { description: 'Your password has been changed successfully.' });
                },
                onError: (error: any) => {
                    setIsSavingPw(false);
                    const msg = error?.response?.data?.message || 'Could not update password. Please check your current password and try again.';
                    toast.error('Password Update Failed', { description: msg });
                },
            }
        );
    };

    const handleGenerate2FA = () => {
        setIsGenerating2FA(true);
        generate2FAMutation.mutate(undefined, {
            onSuccess: (data: any) => {
                setQrCodeUrl(data.qrCodeDataUrl);
                setIsGenerating2FA(false);
            },
            onError: (error: any) => {
                setIsGenerating2FA(false);
                const msg = error?.response?.data?.message || 'Could not generate 2FA secret.';
                toast.error('2FA Setup Failed', { description: msg });
            },
        });
    };

    const handleEnable2FA = () => {
        if (twoFaCode.length !== 6) {
            toast.error('Invalid Code', { description: 'Please enter a valid 6-digit verification code.' });
            return;
        }
        setIsVerifying2FA(true);
        enable2FAMutation.mutate(twoFaCode, {
            onSuccess: () => {
                setIsVerifying2FA(false);
                setIs2faEnabled(true);
                setQrCodeUrl('');
                setTwoFaCode('');
                toast.success('2FA Enabled', { description: 'Two-factor authentication is now active on your account.' });
            },
            onError: (error: any) => {
                setIsVerifying2FA(false);
                const msg = error?.response?.data?.message || 'Invalid verification code. Please try again.';
                toast.error('Verification Failed', { description: msg });
            },
        });
    };

    const handleDisable2FA = () => {
        if (disableCode.length !== 6) {
            toast.error('Invalid Code', { description: 'Please enter a valid 6-digit code from your authenticator app.' });
            return;
        }
        disable2FAMutation.mutate(disableCode, {
            onSuccess: () => {
                setIs2faEnabled(false);
                setShowDisableConfirm(false);
                setDisableCode('');
                toast.success('2FA Disabled', { description: 'Two-factor authentication has been removed from your account.' });
            },
            onError: (error: any) => {
                const msg = error?.response?.data?.message || 'Invalid code. Please try again.';
                toast.error('Disable Failed', { description: msg });
            },
        });
    };

    const calculateStrength = () => {
        if (password.length === 0) return 0;
        let score = 0;
        if (password.length >= 8) score += 25;
        if (password.length >= 12) score += 25;
        if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 25;
        if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) score += 25;
        return score;
    };

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
                                className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary-500/25 focus:border-primary-400 transition-all text-sm outline-none dark:text-white"
                                placeholder="••••••••"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                                <input
                                    type="password"
                                    className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary-500/25 focus:border-primary-400 transition-all text-sm outline-none dark:text-white"
                                    placeholder="Minimum 8 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Security Strength</span>
                                    <span className={cn(
                                        "text-[9px] font-black uppercase tracking-widest",
                                        calculateStrength() === 100 ? "text-emerald-500" : calculateStrength() >= 50 ? "text-amber-500" : "text-rose-500"
                                    )}>
                                        {calculateStrength() === 100 ? 'Strong' : calculateStrength() >= 50 ? 'Moderate' : calculateStrength() > 0 ? 'Weak' : '—'}
                                    </span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className={cn(
                                            "h-full transition-all duration-500",
                                            calculateStrength() === 100 ? "bg-emerald-500" : calculateStrength() >= 50 ? "bg-amber-500" : "bg-rose-500"
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
                                className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary-500/25 focus:border-primary-400 transition-all text-sm outline-none dark:text-white"
                                placeholder="Re-type new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
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
                                    'At least 8 characters long',
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
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-10 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Two-Factor Authentication</h3>
                        {is2faEnabled && (
                            <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-800">
                                Active
                            </span>
                        )}
                    </div>
                </div>

                <div className="p-10">
                    {is2faEnabled ? (
                        /* 2FA IS ENABLED — show status and disable option */
                        <div className="flex flex-col gap-8">
                            <div className="flex items-start gap-6 p-8 rounded-3xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800">
                                <div className="size-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                                    <span className="material-symbols-outlined text-3xl">verified_user</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h4 className="text-lg font-black text-emerald-900 dark:text-emerald-300 uppercase tracking-tight">2FA is Active</h4>
                                    <p className="text-sm font-medium text-emerald-800/70 dark:text-emerald-200/50 leading-relaxed">
                                        Your account is protected with two-factor authentication via an authenticator app. You will be asked for a verification code when logging in.
                                    </p>
                                </div>
                            </div>

                            {showDisableConfirm ? (
                                <div className="flex flex-col gap-4 p-8 rounded-3xl bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800">
                                    <h4 className="text-sm font-black text-rose-900 dark:text-rose-300 uppercase tracking-tight">Confirm Disable 2FA</h4>
                                    <p className="text-xs font-medium text-rose-800/70 dark:text-rose-200/50">
                                        Enter a 6-digit code from your authenticator app to confirm disabling 2FA.
                                    </p>
                                    <div className="flex gap-3">
                                        <input
                                            value={disableCode}
                                            onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            className="flex-1 h-14 px-5 rounded-2xl border border-rose-200 dark:border-rose-800 bg-white dark:bg-slate-900 font-black text-2xl tracking-[0.5em] text-center focus:ring-4 focus:ring-rose-500/10 transition-all outline-none dark:text-white"
                                            placeholder="000000"
                                        />
                                        <button
                                            onClick={handleDisable2FA}
                                            disabled={disable2FAMutation.isPending}
                                            className="h-14 px-8 rounded-2xl bg-rose-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-rose-500/20 hover:bg-rose-700 transition-all disabled:opacity-50"
                                        >
                                            {disable2FAMutation.isPending ? 'Verifying...' : 'Disable'}
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => { setShowDisableConfirm(false); setDisableCode(''); }}
                                        className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowDisableConfirm(true)}
                                    className="self-start h-11 px-8 rounded-xl border-2 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all"
                                >
                                    Disable Two-Factor Authentication
                                </button>
                            )}
                        </div>
                    ) : (
                        /* 2FA IS NOT ENABLED — show setup flow */
                        <div className="flex flex-col gap-8">
                            <div className="flex items-start justify-between">
                                <div className="flex flex-col gap-2 max-w-lg">
                                    <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Authenticator App</h4>
                                    <p className="text-slate-500 font-medium text-sm leading-relaxed">
                                        Use an app like Google Authenticator or Authy to generate secure verification codes. This adds an extra layer of security to your account.
                                    </p>
                                </div>
                            </div>

                            {qrCodeUrl ? (
                                /* QR code has been generated — show scan + verify */
                                <div className="flex flex-col gap-8 p-8 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                    <div className="flex items-center gap-6">
                                        <div className="size-32 bg-white dark:bg-slate-900 p-2 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={qrCodeUrl} alt="2FA QR Code" className="w-full h-full object-contain" />
                                        </div>
                                        <div className="flex flex-col gap-1 flex-1">
                                            <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest">Step 1 of 2</span>
                                            <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Scan QR Code</h4>
                                            <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-tight">Open your authenticator app and scan this QR code to link your account.</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Step 2: Enter Verification Code</label>
                                        <div className="flex gap-3">
                                            <input
                                                value={twoFaCode}
                                                onChange={(e) => setTwoFaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                className="flex-1 h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-black text-2xl tracking-[0.5em] text-center focus:ring-4 focus:ring-primary-500/10 transition-all outline-none dark:text-white"
                                                placeholder="000000"
                                            />
                                            <button
                                                onClick={handleEnable2FA}
                                                disabled={isVerifying2FA}
                                                className={`h-14 px-8 rounded-2xl bg-primary-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-primary-500/20 transition-all ${isVerifying2FA ? 'opacity-50' : 'hover:bg-primary-700'}`}
                                            >
                                                {isVerifying2FA ? 'Verifying...' : 'Verify & Enable'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* No QR code yet — show setup button */
                                <button
                                    onClick={handleGenerate2FA}
                                    disabled={isGenerating2FA}
                                    className={`self-start h-12 px-10 rounded-xl bg-primary-600 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary-500/20 transition-all flex items-center gap-2 ${isGenerating2FA ? 'opacity-50' : 'hover:bg-primary-700 hover:scale-105 active:scale-95'}`}
                                >
                                    {isGenerating2FA ? (
                                        <span className="animate-spin material-symbols-outlined text-lg">sync</span>
                                    ) : (
                                        <span className="material-symbols-outlined text-lg">qr_code_2</span>
                                    )}
                                    {isGenerating2FA ? 'Generating...' : 'Set Up Two-Factor Authentication'}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Security Info */}
            <div className="bg-amber-50 dark:bg-amber-900/10 p-8 rounded-3xl border border-amber-100 dark:border-amber-800 flex items-start gap-6">
                <div className="size-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-2xl">shield</span>
                </div>
                <div className="flex flex-col gap-2">
                    <h4 className="text-lg font-black text-amber-900 dark:text-amber-300 uppercase tracking-tight">Security Best Practices</h4>
                    <p className="text-sm font-medium text-amber-800/70 dark:text-amber-400/50 leading-relaxed">
                        Enable two-factor authentication for maximum account security. Use a strong, unique password that you don&apos;t reuse across other services. Change your password regularly and never share it with anyone.
                    </p>
                </div>
            </div>
        </div>
    );
}
