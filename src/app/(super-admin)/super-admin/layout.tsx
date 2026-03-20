import { Metadata } from 'next';
import { SuperAdminGuard } from '@/components/super-admin/layout/SuperAdminGuard';
import { SuperAdminSidebar } from '@/components/super-admin/layout/SuperAdminSidebar';
import { SuperAdminMain } from '@/components/super-admin/layout/SuperAdminMain';
import { ImpersonationProvider } from '@/contexts/ImpersonationContext';

import '@/styles/super-admin-theme.css';

export const metadata: Metadata = {
  title: 'Platform Command Centre | IBMS',
  description: 'Super administrator dashboard for monitoring IBMS instances, managing tenants, logs, and billing.',
};

/**
 * Super Admin Root Layout
 * Enforces strict role checks and applies the dark teal Command Centre theme.
 */
export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Force the Super Admin theme and disable dark mode variants affecting the SA area implicitly
    <div className="theme-super-admin min-h-screen relative font-sans text-gray-900 bg-[var(--sa-bg-page)] selection:bg-[var(--sa-teal-300)]">
      <ImpersonationProvider>
        <SuperAdminGuard>
          {/* Skip-link for a11y */}
          <a
            href="#sa-main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-[280px] focus:z-[9999] focus:px-4 focus:py-2 focus:rounded-sm focus:bg-[var(--sa-teal-500)] focus:text-white focus:text-sm focus:font-bold focus:shadow-lg"
          >
            Skip to main content
          </a>

          <SuperAdminSidebar />
          <SuperAdminMain>{children}</SuperAdminMain>
        </SuperAdminGuard>
      </ImpersonationProvider>
    </div>
  );
}
