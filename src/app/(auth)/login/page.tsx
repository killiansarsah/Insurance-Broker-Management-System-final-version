'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { AnimatedSignIn } from '@/components/ui/sign-in';

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);
    const { login, isLoading } = useAuthStore();
    const router = useRouter();

    const handleSubmit = async (email: string, password: string) => {
        setError(null);
        try {
            await login(email, password);
            router.push('/dashboard');
        } catch {
            setError('Invalid credentials. Hint: use admin@ibms.com / any password');
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
