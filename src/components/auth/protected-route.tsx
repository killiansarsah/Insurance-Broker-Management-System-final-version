'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { AppLoader } from '@/components/ui/AppLoader';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // On mount: try silent token refresh (Step 9 spec)
        checkAuth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (mounted && !isLoading && !isAuthenticated) {
            router.push(`/login?returnUrl=${pathname}`);
        }
    }, [isAuthenticated, isLoading, router, pathname, mounted]);

    if (!mounted || isLoading) {
        return (
            <AppLoader message="Verifying session..." isLoading={true} fullScreen={true} />
        );
    }

    if (!isAuthenticated) {
        return (
            <AppLoader message="Signing out..." isLoading={true} fullScreen={true} />
        );
    }

    return <>{children}</>;
}
