'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, EyeOff, Shield, Mail, Lock, Info, Loader2, Building2, ArrowLeft } from 'lucide-react';

/* ──────────────────────────────────────────────────────────
   Insurance-industry stats for the left-side collage
   ────────────────────────────────────────────────────────── */
const STATS = [
    { value: '97%', text: 'of Ghanaian insurers now use digital platforms for policy management.' },
    { value: '₵24B', text: "gross written premium across Ghana's insurance industry in 2025." },
] as const;

/* Verified Unsplash photo IDs — insurance / professional / Accra office themed */
const IMAGES = [
    { src: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80', alt: 'Professional reviewing documents' },
    { src: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80', alt: 'Business handshake' },
    { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80', alt: 'Team collaboration' },
    { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80', alt: 'Modern office workspace' },
] as const;

/* ──────────────────────────────────────────────────────────
   Props — the parent is responsible for actual auth logic
   ────────────────────────────────────────────────────────── */
export interface TenantOption {
    slug: string;
    name: string;
}

export interface AnimatedSignInProps {
    /** Called with email, password, and optional tenant slug when the form submits */
    onSubmit: (email: string, password: string, tenantSlug?: string) => Promise<TenantOption[] | void>;
    /** External loading state (e.g. from auth store) */
    isLoading?: boolean;
    /** External error message to display */
    error?: string | null;
}

const AnimatedSignIn: React.FC<AnimatedSignInProps> = ({
    onSubmit,
    isLoading = false,
    error = null,
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mounted, setMounted] = useState(false);
    const [formVisible, setFormVisible] = useState(false);

    // Multi-tenant step
    const [tenantOptions, setTenantOptions] = useState<TenantOption[] | null>(null);
    const [selectedTenant, setSelectedTenant] = useState('');

    useEffect(() => {
        setMounted(true);
        const t = setTimeout(() => setFormVisible(true), 200);
        return () => clearTimeout(t);
    }, []);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await onSubmit(email, password);
        if (result && result.length > 0) {
            setTenantOptions(result);
            setSelectedTenant(result[0].slug);
        }
    };

    const handleTenantSelect = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(email, password, selectedTenant);
    };

    const handleBackToLogin = () => {
        setTenantOptions(null);
        setSelectedTenant('');
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen h-screen w-full bg-white dark:bg-slate-900 flex flex-col md:flex-row overflow-hidden">
            {/* ─── Left Collage Panel ──────────────────────────────── */}
            <div className="hidden md:block w-full md:w-3/5 bg-surface-100 p-5 h-full relative">
                        <div className="grid grid-cols-2 grid-rows-3 gap-4 h-full overflow-hidden">
                            {/* Row 1 — image + stat */}
                            <div className="overflow-hidden rounded-xl relative">
                                <Image
                                    src={IMAGES[0].src}
                                    alt={IMAGES[0].alt}
                                    fill
                                    className="object-cover"
                                    sizes="(min-width: 768px) 30vw, 0px"
                                    priority
                                />
                            </div>
                            <div
                                className="rounded-xl flex flex-col justify-center items-center p-6 text-white bg-primary-600"
                                style={{
                                    transform: formVisible ? 'translateY(0)' : 'translateY(20px)',
                                    opacity: formVisible ? 1 : 0,
                                    transition: 'transform 0.6s ease-out 0.2s, opacity 0.6s ease-out 0.2s',
                                }}
                            >
                                <h2 className="text-5xl font-bold mb-2">{STATS[0].value}</h2>
                                <p className="text-center text-sm text-primary-100">{STATS[0].text}</p>
                            </div>

                            {/* Row 2 — image + image */}
                            <div className="overflow-hidden rounded-xl relative">
                                <Image
                                    src={IMAGES[1].src}
                                    alt={IMAGES[1].alt}
                                    fill
                                    className="object-cover"
                                    sizes="(min-width: 768px) 30vw, 0px"
                                    priority
                                />
                            </div>
                            <div className="overflow-hidden rounded-xl relative">
                                <Image
                                    src={IMAGES[2].src}
                                    alt={IMAGES[2].alt}
                                    fill
                                    className="object-cover"
                                    sizes="(min-width: 768px) 30vw, 0px"
                                    loading="lazy"
                                />
                            </div>

                            {/* Row 3 — stat + image */}
                            <div
                                className="rounded-xl flex flex-col justify-center items-center p-6 text-white bg-success-600"
                                style={{
                                    transform: formVisible ? 'translateY(0)' : 'translateY(20px)',
                                    opacity: formVisible ? 1 : 0,
                                    transition: 'transform 0.6s ease-out 0.4s, opacity 0.6s ease-out 0.4s',
                                }}
                            >
                                <h2 className="text-5xl font-bold mb-2">{STATS[1].value}</h2>
                                <p className="text-center text-sm text-white/90">{STATS[1].text}</p>
                            </div>
                            <div className="overflow-hidden rounded-xl relative">
                                <Image
                                    src={IMAGES[3].src}
                                    alt={IMAGES[3].alt}
                                    fill
                                    className="object-cover"
                                    sizes="(min-width: 768px) 30vw, 0px"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ─── Right — Sign-in Form ─────────────────────────────── */}
                    <div className="w-full md:w-2/5 flex flex-col justify-center p-8 md:p-12 bg-white dark:bg-slate-900 text-surface-900 min-h-screen">
                        <div
                            className="max-w-lg mx-auto w-full"
                            style={{
                                transform: formVisible ? 'translateX(0)' : 'translateX(20px)',
                                opacity: formVisible ? 1 : 0,
                                transition: 'transform 0.6s ease-out, opacity 0.6s ease-out',
                            }}
                        >
                            {/* Logo + Header */}
                            <div className="mb-12 text-center">
                                <div className="w-24 h-24 relative mx-auto mb-8 p-2 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 shadow-lg">
                                    <Image
                                        src="/logo.png"
                                        alt="IBMS Logo"
                                        fill
                                        className="object-contain p-2"
                                        priority
                                    />
                                </div>
                                <h1 className="text-3xl font-bold text-surface-900 mb-3 bg-gradient-to-r from-surface-900 to-primary-600 bg-clip-text text-transparent">
                                    Sign in to <span className="text-primary-500">IBMS</span>
                                </h1>
                                <p className="text-base text-surface-500 leading-relaxed">
                                    Welcome back — enter your credentials to access the portal.
                                </p>
                            </div>

                            {/* Form */}
                            {tenantOptions ? (
                                /* ─── Tenant Selection Step ──────────────── */
                                <form onSubmit={handleTenantSelect} className="space-y-6">
                                    <div className="space-y-3">
                                        <button
                                            type="button"
                                            onClick={handleBackToLogin}
                                            className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 transition-colors cursor-pointer"
                                        >
                                            <ArrowLeft size={16} />
                                            Back to login
                                        </button>
                                        <p className="text-sm text-surface-500">
                                            Your email is linked to multiple organizations. Please select one to continue.
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="signin-tenant" className="block text-sm font-semibold text-surface-700">
                                            Organization
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none">
                                                <Building2 size={18} />
                                            </div>
                                            <select
                                                id="signin-tenant"
                                                value={selectedTenant}
                                                onChange={(e) => setSelectedTenant(e.target.value)}
                                                required
                                                className="block w-full rounded-xl border border-surface-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-3 pl-11 pr-4 text-sm text-surface-900 dark:text-slate-200 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 appearance-none cursor-pointer"
                                            >
                                                {tenantOptions.map((t) => (
                                                    <option key={t.slug} value={t.slug}>{t.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Error */}
                                    {error && (
                                        <div className="p-4 rounded-xl bg-danger-50 border border-danger-200 flex items-start gap-3 text-danger-700 text-sm animate-fade-in">
                                            <Info size={18} className="shrink-0 text-danger-500 mt-0.5" />
                                            <p className="font-medium leading-relaxed">{error}</p>
                                        </div>
                                    )}

                                    <button type="submit" disabled={isLoading}
                                        className={`flex w-full justify-center items-center gap-2 rounded-xl py-4 px-4 text-sm font-bold text-white shadow-lg shadow-primary-500/20 transition-all duration-200 ${isLoading ? 'bg-primary-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700 active:scale-[0.98] cursor-pointer'}`}>
                                        {isLoading ? (<><Loader2 size={18} className="animate-spin" />Signing in…</>) : (<><Shield size={18} />Continue</>)}
                                    </button>
                                </form>
                            ) : (
                                /* ─── Main Login Form ────────────────────── */
                                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-surface-100 dark:border-slate-700">
                                    <form onSubmit={handleSignIn} className="space-y-7">
                                        {/* Email Field */}
                                        <div className="space-y-3">
                                            <label htmlFor="signin-email" className="block text-base font-semibold text-surface-700 flex items-center gap-2">
                                                <Mail size={16} className="text-primary-500" />
                                                Work Email
                                            </label>
                                            <div className="relative group">
                                                <input
                                                    type="email"
                                                    id="signin-email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="block w-full rounded-xl border-2 border-surface-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 py-5 px-5 text-base text-surface-900 dark:text-slate-200 placeholder:text-surface-400 dark:placeholder:text-slate-500 outline-none transition-all duration-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:bg-white dark:focus:bg-slate-800 group-hover:border-surface-300 dark:group-hover:border-slate-600"
                                                    placeholder="name@insurance-firm.com"
                                                    required
                                                    autoComplete="email"
                                                />
                                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                            </div>
                                        </div>

                                        {/* Password Field */}
                                        <div className="space-y-3">
                                            <label htmlFor="signin-password" className="block text-base font-semibold text-surface-700 flex items-center gap-2">
                                                <Lock size={16} className="text-primary-500" />
                                                Password
                                            </label>
                                            <div className="relative group">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    id="signin-password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="block w-full rounded-xl border-2 border-surface-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 py-5 px-5 pr-14 text-base text-surface-900 dark:text-slate-200 placeholder:text-surface-400 dark:placeholder:text-slate-500 outline-none transition-all duration-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:bg-white dark:focus:bg-slate-800 group-hover:border-surface-300 dark:group-hover:border-slate-600"
                                                    placeholder="••••••••"
                                                    required
                                                    autoComplete="current-password"
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-primary-500 transition-all duration-200 p-2 rounded-lg hover:bg-primary-50 dark:hover:bg-slate-800 cursor-pointer"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                                >
                                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                </button>
                                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                            </div>
                                        </div>

                                        {/* Remember / Forgot Row */}
                                        <div className="flex items-center justify-between pt-2">
                                            <label className="flex items-center gap-3 cursor-pointer select-none group">
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        className="w-5 h-5 rounded-md border-2 border-surface-300 text-primary-600 focus:ring-primary-500 cursor-pointer accent-primary-600 transition-all duration-200"
                                                    />
                                                </div>
                                                <span className="text-base text-surface-600 group-hover:text-surface-900 transition-colors duration-200">
                                                    Keep me signed in
                                                </span>
                                            </label>
                                            <Link
                                                href="/forgot-password"
                                                className="text-base font-semibold text-primary-600 hover:text-primary-700 transition-all duration-200 hover:underline underline-offset-4"
                                            >
                                                Forgot password?
                                            </Link>
                                        </div>

                                        {/* Error Message */}
                                        {error && (
                                            <div className="p-5 rounded-xl bg-gradient-to-r from-danger-50 to-danger-50/80 border-l-4 border-danger-500 flex items-start gap-3 text-danger-700 text-base animate-fade-in shadow-sm">
                                                <Info size={20} className="shrink-0 text-danger-500 mt-0.5" />
                                                <p className="font-medium leading-relaxed">{error}</p>
                                            </div>
                                        )}

                                        {/* Sign In Button */}
                                        <div className="pt-2">
                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className={`group relative flex w-full justify-center items-center gap-3 rounded-xl py-6 px-6 text-base font-bold text-white shadow-xl transition-all duration-300 overflow-hidden ${isLoading
                                                    ? 'bg-primary-400 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 active:scale-[0.98] cursor-pointer hover:shadow-2xl hover:shadow-primary-500/25'
                                                    }`}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                <div className="relative z-10 flex items-center gap-3">
                                                    {isLoading ? (
                                                        <>
                                                            <Loader2 size={20} className="animate-spin" />
                                                            Signing in…
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Shield size={20} className="group-hover:scale-110 transition-transform duration-200" />
                                                            Sign Into Dashboard
                                                        </>
                                                    )}
                                                </div>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Footer */}
                            <div className="mt-16 text-center">
                                <p className="text-xs text-surface-400 font-medium tracking-wide">
                                    &copy; {new Date().getFullYear()} IBMS Ghana &middot; Platform v1.0
                                </p>
                            </div>
                        </div>
                    </div>
        </div>
    );
};

export { AnimatedSignIn };
