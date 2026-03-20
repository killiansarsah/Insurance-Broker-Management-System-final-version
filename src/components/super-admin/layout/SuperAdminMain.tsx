'use client';

import { useUiStore } from '@/stores/ui-store';
import { SuperAdminHeader } from './SuperAdminHeader';

export function SuperAdminMain({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useUiStore();

  return (
    <div
      className="flex flex-col min-h-screen transition-all duration-300"
      style={{
        marginLeft: sidebarCollapsed ? 'var(--sa-sidebar-collapsed)' : 'var(--sa-sidebar-width)',
      }}
    >
      <SuperAdminHeader />
      <main
        id="sa-main-content"
        className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto"
      >
        {children}
      </main>
    </div>
  );
}
