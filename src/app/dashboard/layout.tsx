'use client';

import { useEffect } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { useUiStore } from '@/stores/ui-store';
import { cn } from '@/lib/utils';
import { BackendStatus } from '@/components/dev/backend-status';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { useProfileStore } from '@/stores/profile-store';
import { useTenantSettings, useProfile } from '@/hooks/api/use-settings';

function GlobalHydrator() {
    const { data: tenant } = useTenantSettings();
    const { data: profile } = useProfile();
    const { updateProfile } = useProfileStore();

    useEffect(() => {
        if (tenant) {
            const t = tenant as Record<string, any>;
            let logoUrl = null;
            if (t.logoUrl) {
                const backendBase = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3001';
                logoUrl = t.logoUrl.startsWith('http') ? t.logoUrl : `${backendBase}${t.logoUrl}`;
            }

            updateProfile({
                companyName: t.name || '',
                companyEmail: t.email || '',
                corporatePhone: t.phone || '',
                street: t.street || t.address || '',
                logoUrl,
            });
        }
    }, [tenant, updateProfile]);

    useEffect(() => {
        if (profile) {
            const p = profile as Record<string, any>;
            let avatarUrl = null;
            if (p.avatarUrl) {
                const backendBase = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3001';
                avatarUrl = p.avatarUrl.startsWith('http') ? p.avatarUrl : `${backendBase}${p.avatarUrl}`;
            }
            updateProfile({
                firstName: p.firstName || '',
                lastName: p.lastName || '',
                email: p.email || '',
                phone: p.phone || '',
                bio: p.bio || '',
                jobTitle: p.jobTitle || '',
                location: p.location || '',
                avatarUrl,
            });
        }
    }, [profile, updateProfile]);

    return null;
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { sidebarCollapsed } = useUiStore();

    return (
        <ProtectedRoute>
            <GlobalHydrator />
            <div className="min-h-screen bg-transparent">
                <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary-600 focus:text-white focus:text-sm focus:font-semibold focus:shadow-lg">
                    Skip to main content
                </a>
                <Sidebar />
                <Header />
                <main
                    id="main-content"
                    className={cn(
                        'pt-[var(--header-height)] min-h-screen',
                        'transition-all duration-[var(--transition-slow)]',
                        sidebarCollapsed
                            ? 'lg:pl-[var(--sidebar-collapsed-width)]'
                            : 'lg:pl-[var(--sidebar-width)]'
                    )}
                >
                    <div className="p-4 lg:p-6">
                        <ErrorBoundary>{children}</ErrorBoundary>
                    </div>
                </main>
                <BackendStatus />
                {/* Accessible live region for toast/status announcements */}
                <div
                    id="aria-live-region"
                    role="status"
                    aria-live="polite"
                    aria-atomic="true"
                    className="sr-only"
                />
            </div>
        </ProtectedRoute>
    );
}
