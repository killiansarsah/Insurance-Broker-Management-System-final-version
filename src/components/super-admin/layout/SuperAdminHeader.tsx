'use client';

import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useUiStore } from '@/stores/ui-store';
import { ImpersonationBanner } from '@/components/super-admin/ImpersonationBanner';
import { Bell, Menu, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

/**
 * SuperAdminHeader — Top bar for the command centre.
 * Contains breadcrumbs, notifications, and user avatar.
 * Sharp geometry, solid #ffffff background.
 */
export function SuperAdminHeader() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar } = useUiStore();

  // Simple breadcrumb generator based on route segments
  const pathSegments = pathname.split('/').filter(Boolean);
  
  // Format segments (e.g. "super-admin" -> "Overview")
  const breadcrumbs = pathSegments.map((seg, i) => {
    const isLast = i === pathSegments.length - 1;
    const isFirst = i === 0;

    let label = seg.replace(/-/g, ' ');
    if (isFirst && seg === 'super-admin') label = 'Overview';

    // Capitalise each word
    label = label.replace(/\b\w/g, (char) => char.toUpperCase());

    const href = '/' + pathSegments.slice(0, i + 1).join('/');

    return { label, href, isLast };
  });

  return (
    <>
      <ImpersonationBanner />
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6"
        style={{
          height: 'var(--sa-header-height)',
          backgroundColor: 'var(--sa-bg-card)',
          borderBottom: '1px solid var(--sa-border)',
        }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="sm:hidden text-gray-500 hover:text-gray-900"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>

          {/* Dynamic Route Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-2">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.href} className="flex items-center gap-2 text-sm font-medium font-sans">
                {i > 0 && <span className="text-gray-400">/</span>}
                {crumb.isLast ? (
                  <span className="text-gray-900" aria-current="page">
                    {crumb.label}
                  </span>
                ) : (
                  <Link href={crumb.href} className="text-gray-500 hover:text-gray-900 hover:underline">
                    {crumb.label}
                  </Link>
                )}
              </span>
            ))}
          </nav>
        </div>

        {/* User / Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications Placeholder */}
          <button
            onClick={() => toast.info('You have 0 new notifications.')}
            className="w-8 h-8 flex flex-col items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
            title="Notifications"
          >
            <Bell size={18} />
          </button>

          {/* Status separator */}
          <div className="w-[1px] h-6 bg-gray-200" />

          {/* Profile Dropdown Trigger (stub) */}
          <button 
            onClick={() => toast.info('Profile settings panel expanding...')}
            className="flex items-center gap-2 text-left hover:bg-gray-50 p-1 rounded-xl transition-colors group">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-semibold text-gray-900 leading-none">
                {user?.firstName || 'System'} {user?.lastName || 'Admin'}
              </span>
              <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mt-1">
                {user?.role?.replace(/_/g, ' ') || 'RESTRICTED'}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#1D9E75] text-white flex items-center justify-center shadow-sm">
              <UserCircle size={20} />
            </div>
          </button>
        </div>
      </header>
    </>
  );
}
