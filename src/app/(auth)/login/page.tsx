'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { AnimatedSignIn } from '@/components/ui/sign-in';
import type { TenantOption } from '@/components/ui/sign-in';

function LoginContent() {
    const [error, setError] = useState<string | null>(null);
    const { login, isLoading } = useAuthStore();
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSubmit = async (email: string, password: string, tenantSlug?: string): Promise<TenantOption[] | void> => {
        setError(null);
        try {
            const result = await login(email, password, tenantSlug);
            if (result && result.length > 0) {
                // Multiple tenants — return them for the UI to show
                return result;
            }
            // Login succeeded
            const returnUrl = searchParams.get('returnUrl');
            const destination = returnUrl?.startsWith('/') ? returnUrl : '/dashboard';
            router.push(destination);
        } catch {
            setError('Invalid email or password. Please try again.');
        }
    };

    return (
        <AnimatedSignIn
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
        />
    );
}

export default function LoginPage() {
    return (
        <Suspense>
            <LoginContent />
        </Suspense>
    );
}
