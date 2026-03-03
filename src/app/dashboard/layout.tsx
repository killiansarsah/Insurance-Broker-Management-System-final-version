'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { useUiStore } from '@/stores/ui-store';
import { cn } from '@/lib/utils';

import { ProtectedRoute } from '@/components/auth/protected-route';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { sidebarCollapsed } = useUiStore();

    return (
        <ProtectedRoute>
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
                    <div className="p-4 lg:p-6">{children}</div>
                </main>
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
