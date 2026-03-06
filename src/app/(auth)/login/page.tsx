'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { AnimatedSignIn } from '@/components/ui/sign-in';

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);
    const { login, isLoading } = useAuthStore();
    const router = useRouter();

    const handleSubmit = async (email: string, password: string, tenantSlug: string) => {
        setError(null);
        try {
            await login(email, password, tenantSlug);
            router.push('/dashboard');
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
