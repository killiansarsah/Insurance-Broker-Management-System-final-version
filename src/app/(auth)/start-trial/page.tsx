'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CheckCircle2, Clock3, ShieldCheck, TrendingUp } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth-store';
import { GradientBackground } from '@/components/ui/gradient-background';
import { LiquidFilters } from '@/components/ui/liquid-filters';

interface StartTrialResponse {
    success: boolean;
    tenantSlug: string;
    email: string;
    trialEndsAt: string;
    message: string;
}

export default function StartTrialPage() {
    const router = useRouter();
    const { login } = useAuthStore();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [form, setForm] = useState({
        companyName: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });

    const onChange = (field: keyof typeof form, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                companyName: form.companyName.trim(),
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                email: form.email.trim(),
                phone: form.phone.trim() || undefined,
                password: form.password,
            };

            const result = await apiClient.post<StartTrialResponse>('/auth/start-trial', payload);

            await login(payload.email, payload.password, result.tenantSlug);
            toast.success('Welcome! Your free trial is active.');
            router.push('/dashboard');
        } catch (err: any) {
            const message = err?.response?.data?.message;
            setError(Array.isArray(message) ? message.join(', ') : (message || 'Could not start trial.'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <GradientBackground overlay={true} overlayOpacity={0.38} enableCenterContent={false} className="p-4 md:p-6 lg:p-8">
            <LiquidFilters />
            <div className="pointer-events-none absolute inset-0 z-[1]">
                <div className="absolute -top-16 left-[8%] h-52 w-52 rounded-full bg-white/20 blur-3xl" style={{ filter: 'url(#liquid-glass-refraction)' }} />
                <div className="absolute bottom-8 right-[10%] h-56 w-56 rounded-full bg-cyan-100/20 blur-3xl" style={{ filter: 'url(#liquid-glass-refraction)' }} />
            </div>
            <div className="relative mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-6 lg:gap-8 items-stretch">
                <section className="relative overflow-hidden rounded-2xl border border-white/45 bg-white/80 backdrop-blur-xl shadow-2xl p-6 md:p-8 flex flex-col before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(140deg,rgba(255,255,255,0.55)_0%,rgba(255,255,255,0.08)_45%,rgba(255,255,255,0.45)_100%)]" style={{ filter: 'url(#liquid-glass)' }}>
                    <div className="inline-flex items-center gap-2 rounded-full border border-success-200 bg-success-50 px-3 py-1 text-xs font-bold text-success-700 w-fit">
                        <CheckCircle2 size={14} />
                        30-day trial, no credit card
                    </div>

                    <h1 className="mt-4 text-3xl md:text-4xl font-black tracking-tight text-surface-900 dark:text-white leading-tight">
                        Launch Your Brokerage Workspace Today
                    </h1>

                    <p className="mt-3 text-surface-600 dark:text-slate-400 max-w-xl">
                        Get policy tracking, renewals pipeline, claims workflow, and NIC-ready reporting in one place.
                    </p>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <div className="rounded-xl border border-white/60 bg-white/65 backdrop-blur-md p-4">
                            <p className="text-[11px] uppercase tracking-wide font-bold text-surface-500">Average Setup Time</p>
                            <p className="mt-1 text-2xl font-black text-surface-900 dark:text-white">2 min</p>
                        </div>
                        <div className="rounded-xl border border-white/60 bg-white/65 backdrop-blur-md p-4">
                            <p className="text-[11px] uppercase tracking-wide font-bold text-surface-500">Trial Length</p>
                            <p className="mt-1 text-2xl font-black text-surface-900 dark:text-white">30 days</p>
                        </div>
                        <div className="rounded-xl border border-white/60 bg-white/65 backdrop-blur-md p-4">
                            <p className="text-[11px] uppercase tracking-wide font-bold text-surface-500">Modules Included</p>
                            <p className="mt-1 text-2xl font-black text-surface-900 dark:text-white">12+</p>
                        </div>
                        <div className="rounded-xl border border-white/60 bg-white/65 backdrop-blur-md p-4">
                            <p className="text-[11px] uppercase tracking-wide font-bold text-surface-500">Data Import</p>
                            <p className="mt-1 text-2xl font-black text-surface-900 dark:text-white">Excel-ready</p>
                        </div>
                    </div>

                    <div className="mt-6 space-y-3 text-sm">
                        <div className="flex items-center gap-2 text-surface-700 dark:text-slate-300">
                            <ShieldCheck size={16} className="text-primary-600" />
                            Tenant-isolated workspace with role-based access
                        </div>
                        <div className="flex items-center gap-2 text-surface-700 dark:text-slate-300">
                            <Clock3 size={16} className="text-primary-600" />
                            Automatic renewal reminders and task scheduling
                        </div>
                        <div className="flex items-center gap-2 text-surface-700 dark:text-slate-300">
                            <TrendingUp size={16} className="text-primary-600" />
                            Real-time dashboard for finance and operations
                        </div>
                    </div>
                </section>

                <section className="relative overflow-hidden rounded-2xl border border-white/45 bg-white/80 backdrop-blur-xl shadow-2xl p-6 md:p-8 before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(160deg,rgba(255,255,255,0.58)_0%,rgba(255,255,255,0.10)_52%,rgba(255,255,255,0.42)_100%)]" style={{ filter: 'url(#liquid-glass)' }}>
                    <h2 className="text-2xl font-black text-surface-900 dark:text-white tracking-tight">Start Your Free Trial</h2>
                    <p className="mt-2 text-surface-600 dark:text-slate-400">Create your workspace and sign in instantly.</p>

                    {error && (
                        <div className="mt-5 rounded-xl border border-danger-200 bg-danger-50 text-danger-700 px-4 py-3 text-sm font-semibold">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold mb-1.5 text-surface-700 dark:text-slate-300">Company Name</label>
                            <input required value={form.companyName} onChange={(e) => onChange('companyName', e.target.value)} className="w-full rounded-xl border border-surface-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3" placeholder="Acme Insurance Brokers" />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-1.5 text-surface-700 dark:text-slate-300">First Name</label>
                            <input required value={form.firstName} onChange={(e) => onChange('firstName', e.target.value)} className="w-full rounded-xl border border-surface-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3" />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-1.5 text-surface-700 dark:text-slate-300">Last Name</label>
                            <input required value={form.lastName} onChange={(e) => onChange('lastName', e.target.value)} className="w-full rounded-xl border border-surface-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3" />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-1.5 text-surface-700 dark:text-slate-300">Work Email</label>
                            <input type="email" required value={form.email} onChange={(e) => onChange('email', e.target.value)} className="w-full rounded-xl border border-surface-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3" placeholder="you@brokerage.com" />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-1.5 text-surface-700 dark:text-slate-300">Phone (optional)</label>
                            <input value={form.phone} onChange={(e) => onChange('phone', e.target.value)} className="w-full rounded-xl border border-surface-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3" placeholder="+233..." />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-1.5 text-surface-700 dark:text-slate-300">Password</label>
                            <input type="password" minLength={8} required value={form.password} onChange={(e) => onChange('password', e.target.value)} className="w-full rounded-xl border border-surface-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3" />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-1.5 text-surface-700 dark:text-slate-300">Confirm Password</label>
                            <input type="password" minLength={8} required value={form.confirmPassword} onChange={(e) => onChange('confirmPassword', e.target.value)} className="w-full rounded-xl border border-surface-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3" />
                        </div>

                        <div className="md:col-span-2 pt-2 flex flex-wrap gap-3">
                            <button type="submit" disabled={isSubmitting} className="px-6 py-3 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 disabled:opacity-60">
                                {isSubmitting ? 'Creating trial workspace...' : 'Start 30-day Free Trial'}
                            </button>
                            <button type="button" onClick={() => router.push('/login')} className="px-6 py-3 rounded-xl border border-surface-300 dark:border-slate-700 text-surface-700 dark:text-slate-300 font-semibold">
                                I already have an account
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </GradientBackground>
    );
}
