'use client';

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { AppLoader } from '@/components/ui/AppLoader';
import { useAuthStore } from '@/stores/auth-store';
import type { User } from '@/types';
import { Eye, EyeOff } from 'lucide-react';

type InviteStatus = 'loading' | 'valid' | 'invalid' | 'submitting' | 'success';

interface InviteInfo {
    email: string;
    role: string;
    tenantName: string;
}

function AcceptInviteContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [status, setStatus] = useState<InviteStatus>('loading');
    const [inviteInfo, setInviteInfo] = useState<InviteInfo | null>(null);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: '',
    });

    useEffect(() => {
        if (!token) {
            setStatus('invalid');
            setError('No invitation token provided');
            return;
        }

        apiClient
            .get<InviteInfo>(`/invitations/validate/${token}`)
            .then((data) => {
                setInviteInfo(data);
                setStatus('valid');
            })
            .catch(() => {
                setStatus('invalid');
                setError('This invitation link is invalid, expired, or has already been used.');
            });
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (form.password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setStatus('submitting');
        setError('');

        try {
            const res = await apiClient.post<{ accessToken: string; user: User }>(
                '/invitations/accept',
                {
                    token,
                    firstName: form.firstName,
                    lastName: form.lastName,
                    password: form.password,
                },
            );

            apiClient.setAccessToken(res.accessToken);
            useAuthStore.setState({ user: res.user, isAuthenticated: true });
            setStatus('success');
            router.push('/dashboard');
        } catch {
            setStatus('valid');
            setError('Failed to accept invitation. Please try again.');
        }
    };

    if (status === 'loading') {
        return <AppLoader message="Validating invitation..." isLoading={true} />;
    }

    if (status === 'invalid') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-slate-950 p-4">
                <div className="max-w-md w-full mx-4 p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-xl text-center border border-surface-200 dark:border-slate-800">
                    <span className="material-symbols-outlined text-5xl text-red-500 mb-4">error</span>
                    <h1 className="text-xl font-bold text-surface-900 dark:text-white mb-2">Invalid Invitation</h1>
                    <p className="text-surface-500 dark:text-slate-400 mb-6">{error}</p>
                    <a href="/login" className="text-primary-600 dark:text-primary-400 font-bold hover:underline">Go to Login</a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-slate-950 p-4">
            <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[var(--radius-3xl)] shadow-2xl p-8 border border-surface-200/60 dark:border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary-400 via-primary-500 to-accent-500" />
                <div className="text-center mb-8 mt-2">
                    <h1 className="text-2xl font-black text-surface-900 dark:text-white tracking-tight">Accept Invitation</h1>
                    {inviteInfo && (
                        <p className="text-surface-500 dark:text-slate-400 mt-3 text-sm leading-relaxed max-w-[280px] mx-auto">
                            You've been invited to join <strong className="text-surface-800 dark:text-slate-200">{inviteInfo.tenantName}</strong> as{' '}
                            <strong className="text-primary-600 dark:text-primary-400">{inviteInfo.role}</strong>.
                        </p>
                    )}
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 rounded-xl text-sm font-semibold flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px]">error</span>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-surface-600 dark:text-slate-400 mb-1">
                                First Name
                            </label>
                            <input
                                type="text"
                                required
                                value={form.firstName}
                                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                                className="w-full px-4 py-3 rounded-xl border border-surface-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-surface-900 dark:text-slate-200 outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-semibold"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-surface-600 dark:text-slate-400 mb-1">
                                Last Name
                            </label>
                            <input
                                type="text"
                                required
                                value={form.lastName}
                                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                                className="w-full px-4 py-3 rounded-xl border border-surface-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-surface-900 dark:text-slate-200 outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-semibold"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-surface-600 dark:text-slate-400 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                minLength={8}
                                value={form.password}
                                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                                className="w-full px-4 py-3 rounded-xl border border-surface-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-surface-900 dark:text-slate-200 outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-semibold pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg text-slate-400 hover:text-primary-500 hover:bg-primary-500/5 transition-all"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-surface-600 dark:text-slate-400 mb-1">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                required
                                minLength={8}
                                value={form.confirmPassword}
                                onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                                className="w-full px-4 py-3 rounded-xl border border-surface-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-surface-900 dark:text-slate-200 outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-semibold pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg text-slate-400 hover:text-primary-500 hover:bg-primary-500/5 transition-all"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'submitting'}
                        className="w-full py-3.5 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20 active:scale-95 disabled:opacity-50 mt-6"
                    >
                        {status === 'submitting' ? 'Creating Account...' : 'Accept & Create Account'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function AcceptInvitePage() {
    return (
        <Suspense fallback={<AppLoader message="Loading invitation details..." fullScreen={true} />}>
            <AcceptInviteContent />
        </Suspense>
    );
}
