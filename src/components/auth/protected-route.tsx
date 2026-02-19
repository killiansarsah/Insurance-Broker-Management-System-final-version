'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { PageLoader } from '@/components/ui';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && !isLoading && !isAuthenticated) {
            router.push(`/login?returnUrl=${pathname}`);
        }
    }, [isAuthenticated, isLoading, router, pathname, mounted]);

    if (!mounted || isLoading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-surface-50">
                <PageLoader message="Verifying session..." />
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}
