'use client';

import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useUiStore } from '@/stores/ui-store';
import { ImpersonationBanner } from '@/components/super-admin/ImpersonationBanner';
import { Bell, Menu, UserCircle, Sun, Moon, Monitor } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { NotificationsPopover } from '@/components/features/notifications';

/**
 * SuperAdminHeader — Top bar for the command centre.
 * Contains breadcrumbs, notifications, and user avatar.
 * Sharp geometry, solid #ffffff background.
 */
export function SuperAdminHeader() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar, currentTheme, setTheme } = useUiStore();

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
        className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 shadow-sm"
        style={{
          height: 'var(--sa-header-height)',
          backgroundColor: 'var(--sa-bg-card)',
          borderBottom: '1px solid var(--sa-border)',
        }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="sm:hidden text-gray-500 hover:text-[var(--sa-teal-500)] transition-colors sa-btn-hover"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>

          {/* Dynamic Route Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-2">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.href} className="flex items-center gap-2 text-sm font-medium font-sans">
                {i > 0 && <span style={{ color: 'var(--sa-text-muted)' }}>/</span>}
                {crumb.isLast ? (
                  <span style={{ color: 'var(--sa-text-primary)' }} aria-current="page">
                    {crumb.label}
                  </span>
                ) : (
                  <Link href={crumb.href} className="hover:underline" style={{ color: 'var(--sa-text-muted)' }}>
                    {crumb.label}
                  </Link>
                )}
              </span>
            ))}
          </nav>
        </div>

        {/* User / Actions */}
        <div className="flex items-center gap-3">
          
          {/* Theme Toggle */}
          <div className="flex bg-[var(--sa-bg-page)] border border-[var(--sa-border)] rounded-full p-0.5">
            <button
              onClick={() => setTheme('light')}
              className={`p-1.5 rounded-full transition-all flex items-center justify-center ${currentTheme === 'light' ? 'bg-[#1D9E75] text-[#021a13] shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              title="Light Mode"
            >
              <Sun size={14} />
            </button>
            <button
              onClick={() => setTheme('system')}
              className={`p-1.5 rounded-full transition-all flex items-center justify-center ${currentTheme === 'system' ? 'bg-[#1D9E75] text-[#021a13] shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              title="System Mode"
            >
              <Monitor size={14} />
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`p-1.5 rounded-full transition-all flex items-center justify-center ${currentTheme === 'dark' ? 'bg-[#1D9E75] text-[#021a13] shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              title="Dark Mode"
            >
              <Moon size={14} />
            </button>
          </div>

          {/* Notifications Integration */}
          <NotificationsPopover />

          {/* Status separator */}
          <div className="w-[1px] h-6 bg-[var(--sa-border)]" />

          {/* Profile Dropdown Trigger (stub) */}
          <button 
            onClick={() => toast.info('Profile settings panel expanding...')}
            className="flex items-center gap-3 text-left hover:bg-[var(--sa-bg-page)] p-1.5 pr-2 rounded-full transition-colors group border border-transparent hover:border-[var(--sa-border)] sa-btn-hover">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-semibold leading-none" style={{ color: 'var(--sa-text-primary)' }}>
                {user?.firstName || 'System'} {user?.lastName || 'Admin'}
              </span>
              <span className="text-[10px] font-mono tracking-widest uppercase mt-1" style={{ color: 'var(--sa-text-secondary)' }}>
                {user?.role?.replace(/_/g, ' ') || 'RESTRICTED'}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#1D9E75] text-[#021a13] flex items-center justify-center shadow-sm">
              <UserCircle size={20} />
            </div>
          </button>
        </div>
      </header>
    </>
  );
}
