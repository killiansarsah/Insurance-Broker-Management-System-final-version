'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { apiClient } from '@/lib/api-client';
import { AnimatedSignIn } from '@/components/ui/sign-in';
import type { TenantOption } from '@/components/ui/sign-in';

function LoginContent() {
    const [error, setError] = useState<string | null>(null);
    const { login, isLoading } = useAuthStore();
    const router = useRouter();
    const searchParams = useSearchParams();

    // If the user lands on the login page with stale persisted auth state,
    // we must NOT blindly redirect them — first verify the session is valid.
    // The safest approach: clear the stale flag so they must re-authenticate.
    useEffect(() => {
        // When the login page mounts, clear any stale isAuthenticated flag.
        // A proper session will be re-established after a successful login.
        useAuthStore.setState({ isAuthenticated: false, user: null, _justLoggedInAt: null });
        apiClient.clearAccessToken();
    }, []);

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
