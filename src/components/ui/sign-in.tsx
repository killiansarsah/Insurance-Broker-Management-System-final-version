'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, EyeOff, Shield, Mail, Lock, Info, Loader2 } from 'lucide-react';

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
export interface AnimatedSignInProps {
    /** Called with email & password when the form submits */
    onSubmit: (email: string, password: string) => void | Promise<void>;
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

    useEffect(() => {
        setMounted(true);
        const t = setTimeout(() => setFormVisible(true), 200);
        return () => clearTimeout(t);
    }, []);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(email, password);
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen w-full bg-[#edf1f8] flex items-center justify-center p-4 md:p-0">
            <div
                className={`w-full overflow-hidden rounded-2xl bg-white shadow-xl shadow-surface-200 transition-all duration-500 ${
                    formVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
                style={{ maxWidth: '72rem' }}
            >
                <div className="flex flex-col md:flex-row">
                    {/* ─── Left Collage Panel ──────────────────────────────── */}
                    <div className="hidden md:block w-full md:w-3/5 bg-surface-100 p-5">
                        <div className="grid grid-cols-2 grid-rows-3 gap-4 h-full overflow-hidden">
                            {/* Row 1 — image + stat */}
                            <div className="overflow-hidden rounded-xl">
                                <img
                                    src={IMAGES[0].src}
                                    alt={IMAGES[0].alt}
                                    className="w-full h-full object-cover"
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
                            <div className="overflow-hidden rounded-xl">
                                <img
                                    src={IMAGES[1].src}
                                    alt={IMAGES[1].alt}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="overflow-hidden rounded-xl">
                                <img
                                    src={IMAGES[2].src}
                                    alt={IMAGES[2].alt}
                                    className="w-full h-full object-cover"
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
                            <div className="overflow-hidden rounded-xl">
                                <img
                                    src={IMAGES[3].src}
                                    alt={IMAGES[3].alt}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ─── Right — Sign-in Form ─────────────────────────────── */}
                    <div
                        className="w-full md:w-2/5 p-8 md:p-12 bg-white text-surface-900"
                        style={{
                            transform: formVisible ? 'translateX(0)' : 'translateX(20px)',
                            opacity: formVisible ? 1 : 0,
                            transition: 'transform 0.6s ease-out, opacity 0.6s ease-out',
                        }}
                    >
                        {/* Logo + Header */}
                        <div className="mb-8 flex flex-col items-start">
                            <div className="w-16 h-16 relative mb-5">
                                <Image
                                    src="/logo.png"
                                    alt="IBMS Logo"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                            <h1 className="text-2xl font-bold text-surface-900 mb-1">
                                Sign in to <span className="text-primary-500">IBMS</span>
                            </h1>
                            <p className="text-sm text-surface-500">
                                Welcome back — enter your credentials to access the portal.
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSignIn} className="space-y-5">
                            {/* Email */}
                            <div className="space-y-1.5">
                                <label htmlFor="signin-email" className="block text-sm font-semibold text-surface-700">
                                    Work Email
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        id="signin-email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full rounded-xl border border-surface-200 bg-white py-3 pl-11 pr-4 text-sm text-surface-900 placeholder:text-surface-400 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                                        placeholder="name@insurance-firm.com"
                                        required
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5">
                                <label htmlFor="signin-password" className="block text-sm font-semibold text-surface-700">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="signin-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full rounded-xl border border-surface-200 bg-white py-3 pl-11 pr-11 text-sm text-surface-900 placeholder:text-surface-400 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                                        placeholder="••••••••"
                                        required
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors p-1 rounded-full cursor-pointer"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember / Forgot */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer select-none group">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-2 border-surface-300 text-primary-600 focus:ring-primary-500 cursor-pointer accent-primary-600"
                                    />
                                    <span className="text-sm text-surface-600 group-hover:text-surface-900 transition-colors">
                                        Keep me signed in
                                    </span>
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="p-3.5 rounded-xl bg-danger-50 border border-danger-200 flex items-start gap-3 text-danger-700 text-sm animate-fade-in">
                                    <Info size={18} className="shrink-0 text-danger-500 mt-0.5" />
                                    <p className="font-medium leading-relaxed">{error}</p>
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`flex w-full justify-center items-center gap-2 rounded-xl py-3.5 px-4 text-sm font-bold text-white shadow-lg shadow-primary-500/20 transition-all duration-200 cursor-pointer ${
                                    isLoading
                                        ? 'bg-primary-400 cursor-not-allowed'
                                        : 'bg-primary-600 hover:bg-primary-700 active:scale-[0.98]'
                                }`}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Signing in…
                                    </>
                                ) : (
                                    <>
                                        <Shield size={18} />
                                        Sign Into Dashboard
                                    </>
                                )}
                            </button>

                            {/* Divider */}
                            <div className="relative flex items-center py-1">
                                <div className="flex-grow border-t border-surface-200" />
                                <span className="flex-shrink mx-4 text-xs text-surface-400 font-medium">OR</span>
                                <div className="flex-grow border-t border-surface-200" />
                            </div>

                            {/* Google SSO */}
                            <button
                                type="button"
                                className="flex w-full items-center justify-center gap-2.5 rounded-xl py-3 px-4 text-sm font-medium border border-surface-200 bg-white text-surface-700 hover:bg-surface-50 transition-colors cursor-pointer"
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Sign in with Google
                            </button>
                        </form>

                        {/* Demo hint */}
                        <div className="mt-8 pt-6 border-t border-surface-100">
                            <div className="p-3.5 rounded-xl bg-surface-50 border border-surface-200 flex items-start gap-3">
                                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-primary-600 shrink-0 shadow-sm">
                                    <Info size={18} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-surface-900 mb-0.5">Demo Access</p>
                                    <p className="text-xs text-surface-500 leading-relaxed">
                                        Use <code className="bg-white px-1.5 py-0.5 rounded text-primary-700 border border-surface-200 text-[11px]">admin@ibms.com</code> with any password.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <p className="mt-6 text-center text-[11px] text-surface-400 font-medium tracking-wide">
                            &copy; {new Date().getFullYear()} IBMS Ghana &middot; Platform v1.0
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { AnimatedSignIn };
