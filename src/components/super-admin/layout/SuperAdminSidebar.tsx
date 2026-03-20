'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  ScrollText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Moon,
  Sun,
} from 'lucide-react';
import { useUiStore } from '@/stores/ui-store';
import { useAuthStore } from '@/stores/auth-store';

/**
 * SuperAdminSidebar — The dark teal command-center navigation rail.
 * Non-glassmorphic, sharp solid blocks.
 */
export function SuperAdminSidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar, currentTheme, setTheme } = useUiStore();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  const navGroups = [
    {
      label: 'Core',
      items: [
        { label: 'Overview', href: '/super-admin/overview', icon: LayoutDashboard },
        { label: 'Tenants', href: '/super-admin/tenants', icon: Building2 },
        { label: 'Users', href: '/super-admin/users', icon: Users },
      ],
    },
    {
      label: 'Revenue & Compliance',
      items: [
        { label: 'Subscriptions', href: '/super-admin/subscriptions', icon: CreditCard },
        { label: 'NIC DB Sync', href: '/super-admin/nic-monitoring', icon: ShieldAlert },
      ],
    },
    {
      label: 'Operations',
      items: [
        { label: 'Support Tools', href: '/super-admin/support', icon: Settings },
        { label: 'Announcements', href: '/super-admin/announcements', icon: Settings },
        { label: 'Feature Flags', href: '/super-admin/feature-flags', icon: Settings },
        { label: 'Platform Settings', href: '/super-admin/settings', icon: Settings },
      ],
    },
    {
      label: 'System Monitoring',
      items: [
        { label: 'Background Jobs', href: '/super-admin/jobs', icon: ScrollText },
        { label: 'Error Tracker', href: '/super-admin/error-tracker', icon: ScrollText },
        { label: 'Audit Logs', href: '/super-admin/audit-logs', icon: ScrollText },
        { label: 'Email Logs', href: '/super-admin/email-logs', icon: ScrollText },
      ],
    },
  ];

  return (
    <aside
      className="fixed top-0 left-0 bottom-0 z-40 flex flex-col transition-all duration-300 border-r select-none"
      style={{
        backgroundColor: 'var(--sa-bg-sidebar)',
        color: 'var(--sa-text-muted)',
        borderColor: 'var(--sa-border)',
        width: sidebarCollapsed ? 'var(--sa-sidebar-collapsed)' : 'var(--sa-sidebar-width)',
        boxShadow: 'var(--sa-shadow-sidebar)',
      }}
    >
      {/* Brand Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 shrink-0 cursor-pointer hover:bg-[var(--sa-sidebar-active-bg)] transition-colors"
        style={{ height: 'var(--sa-header-height)', borderBottom: '1px solid var(--sa-border)' }}
        onClick={() => { window.location.href = '/super-admin/overview' }}
      >
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br from-[var(--sa-teal-400)] to-[var(--sa-teal-700)] shadow-[0_0_12px_rgba(29,158,117,0.4)]">
          <ShieldAlert size={18} style={{ color: 'var(--sa-bg-sidebar)' }} />
        </div>
        {!sidebarCollapsed && (
          <div className="flex flex-col overflow-hidden max-w-[170px] sa-reveal">
            <span className="font-serif font-bold text-lg tracking-tight whitespace-nowrap leading-none pt-1" style={{ color: 'var(--sa-sidebar-text-active)' }}>
              Brokerium
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] mt-1 opacity-70" style={{ color: 'var(--sa-teal-300)' }}>
              Command Centre
            </span>
          </div>
        )}
      </div>

    {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-4">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {!sidebarCollapsed && (
              <div className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--sa-sidebar-text)' }}>
                {group.label}
              </div>
            )}
            {group.items.map((item) => {
              const isActive = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group hover:bg-[var(--sa-bg-sidebar-hover)]"
                  style={{
                    backgroundColor: isActive ? 'var(--sa-sidebar-active-bg)' : 'transparent',
                    color: isActive ? 'var(--sa-sidebar-text-active)' : 'var(--sa-sidebar-text)',
                    boxShadow: isActive ? 'inset 3px 0 0 var(--sa-border-focus)' : 'none',
                  }}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <item.icon
                    size={18}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={isActive ? '' : 'group-hover:scale-110 transition-transform'}
                    style={{ color: isActive ? 'var(--sa-teal-400)' : 'var(--sa-teal-300)' }}
                  />
                  {!sidebarCollapsed && (
                    <span className="font-medium text-sm whitespace-nowrap group-hover:translate-x-1 transition-transform">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer (Collapse & Logout) */}
      <div className="p-3 border-t space-y-2 shrink-0 flex flex-col" style={{ borderColor: 'var(--sa-border)' }}>
        
        {/* Collapse button */}
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-[var(--sa-bg-sidebar-hover)] sa-btn-hover"
          style={{ color: 'var(--sa-sidebar-text)' }}
          title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight size={18} className="mx-auto" /> : <ChevronLeft size={18} />}
          {!sidebarCollapsed && <span className="font-medium text-sm">Collapse Menu</span>}
        </button>
        
        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-red-900/20 hover:text-red-400 sa-btn-hover mt-1"
          style={{ color: 'var(--sa-sidebar-text)' }}
          title={sidebarCollapsed ? 'Logout' : undefined}
        >
          <LogOut size={18} className={sidebarCollapsed ? 'mx-auto' : ''} />
          {!sidebarCollapsed && <span className="font-medium text-sm">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
