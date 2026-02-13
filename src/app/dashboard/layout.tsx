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
            <div className="min-h-screen bg-surface-50">
                <Sidebar />
                <Header />
                <main
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
            </div>
        </ProtectedRoute>
    );
}
