'use client';

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth-store';

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
    const login = useAuthStore((s) => s.login);

    const [status, setStatus] = useState<InviteStatus>('loading');
    const [inviteInfo, setInviteInfo] = useState<InviteInfo | null>(null);
    const [error, setError] = useState('');
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
            const res = await apiClient.post<{ accessToken: string; user: { email: string } }>(
                '/invitations/accept',
                {
                    token,
                    firstName: form.firstName,
                    lastName: form.lastName,
                    password: form.password,
                },
            );

            apiClient.setAccessToken(res.accessToken);
            await login(res.user.email, form.password);
            setStatus('success');
            router.push('/dashboard');
        } catch {
            setStatus('valid');
            setError('Failed to accept invitation. Please try again.');
        }
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-[var(--text-secondary)]">Validating invitation...</p>
                </div>
            </div>
        );
    }

    if (status === 'invalid') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
                <div className="max-w-md w-full mx-4 p-8 bg-[var(--bg-card)] rounded-2xl shadow-xl text-center">
                    <span className="material-symbols-outlined text-5xl text-red-500 mb-4">error</span>
                    <h1 className="text-xl font-bold text-[var(--text-primary)] mb-2">Invalid Invitation</h1>
                    <p className="text-[var(--text-secondary)] mb-6">{error}</p>
                    <a href="/login" className="text-[var(--accent)] hover:underline">Go to Login</a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
            <div className="max-w-md w-full mx-4 p-8 bg-[var(--bg-card)] rounded-2xl shadow-xl">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">Accept Invitation</h1>
                    {inviteInfo && (
                        <p className="text-[var(--text-secondary)] mt-2">
                            You&apos;ve been invited to join <strong>{inviteInfo.tenantName}</strong> as{' '}
                            <strong>{inviteInfo.role}</strong>
                        </p>
                    )}
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                                First Name
                            </label>
                            <input
                                type="text"
                                required
                                value={form.firstName}
                                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                                Last Name
                            </label>
                            <input
                                type="text"
                                required
                                value={form.lastName}
                                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            minLength={8}
                            value={form.password}
                            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                            className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            required
                            minLength={8}
                            value={form.confirmPassword}
                            onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                            className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'submitting'}
                        className="w-full py-3 rounded-lg bg-[var(--accent)] text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
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
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
                    <div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
                </div>
            }
        >
            <AcceptInviteContent />
        </Suspense>
    );
}
