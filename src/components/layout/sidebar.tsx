'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    FileText,
    Target,
    Shield,
    MessageSquare,
    FileArchive,
    BarChart3,
    Settings,
    ChevronDown,
    ChevronLeft,
    ShieldCheck,
    AlertTriangle,
    X,
    Calendar,
    Banknote,
    Wallet,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { useUiStore } from '@/stores/ui-store';
import { useState } from 'react';

interface NavItemConfig {
    label: string;
    href: string;
    icon: React.ReactNode;
    children?: { label: string; href: string }[];
}

interface NavSection {
    label: string;
    items: NavItemConfig[];
}

const navigation: NavSection[] = [
    {
        label: 'Overview',
        items: [
            {
                label: 'Dashboard',
                href: '/dashboard',
                icon: <LayoutDashboard size={20} />,
            },
            {
                label: 'Calendar',
                href: '/dashboard/calendar',
                icon: <Calendar size={20} />,
            },
        ],
    },
    {
        label: 'Manage',
        items: [
            {
                label: 'Clients',
                href: '/dashboard/clients',
                icon: <Users size={20} />,
                children: [
                    { label: 'All Clients', href: '/dashboard/clients' },
                    { label: 'New Client', href: '/dashboard/clients/new' },
                ],
            },
            {
                label: 'Policies',
                href: '/dashboard/policies',
                icon: <FileText size={20} />,
                children: [
                    { label: 'All Policies', href: '/dashboard/policies' },
                    { label: 'New Policy', href: '/dashboard/policies/new' },
                    { label: 'Renewals', href: '/dashboard/policies?tab=renewals' },
                ],
            },
            {
                label: 'Leads',
                href: '/dashboard/leads',
                icon: <Target size={20} />,
            },
            {
                label: 'Claims',
                href: '/dashboard/claims',
                icon: <Shield size={20} />,
                children: [
                    { label: 'All Claims', href: '/dashboard/claims' },
                    { label: 'New Claim', href: '/dashboard/claims/new' },
                ],
            },
            {
                label: 'Complaints',
                href: '/dashboard/complaints',
                icon: <AlertTriangle size={20} />,
            },
            {
                label: 'Documents',
                href: '/dashboard/documents',
                icon: <FileArchive size={20} />,
            },
            {
                label: 'Chat',
                href: '/dashboard/chat',
                icon: <MessageSquare size={20} />,
            },
        ],
    },
    {
        label: 'Finance & Insights',
        items: [
            {
                label: 'Commissions',
                href: '/dashboard/commissions',
                icon: <Banknote size={20} />,
            },
            {
                label: 'Finance',
                href: '/dashboard/finance',
                icon: <Wallet size={20} />,
            },
            {
                label: 'Reports',
                href: '/dashboard/reports',
                icon: <BarChart3 size={20} />,
            },
            {
                label: 'Compliance',
                href: '/dashboard/compliance',
                icon: <ShieldCheck size={20} />,
            },
        ],
    },
    {
        label: 'System',
        items: [
            {
                label: 'Settings',
                href: '/dashboard/settings',
                icon: <Settings size={20} />,
                children: [
                    { label: 'General', href: '/dashboard/settings' },
                    { label: 'Users', href: '/dashboard/admin/users' },
                    { label: 'Roles', href: '/dashboard/admin/users?tab=roles' },
                ],
            },
        ],
    },
];

function NavItem({ item, collapsed }: { item: NavItemConfig; collapsed: boolean }) {
    const pathname = usePathname();
    const [expanded, setExpanded] = useState(false);
    const isActive =
        pathname === item.href ||
        item.children?.some((child) => pathname === child.href);

    const hasChildren = item.children && item.children.length > 0;

    if (collapsed) {
        return (
            <Link
                href={item.href}
                className={cn(
                    'flex items-center justify-center w-10 h-10 mx-auto rounded-[var(--radius-md)]',
                    'transition-colors duration-[var(--transition-fast)]',
                    isActive
                        ? 'bg-sidebar-active text-white'
                        : 'text-sidebar-text hover:bg-sidebar-hover hover:text-white'
                )}
                title={item.label}
            >
                {item.icon}
            </Link>
        );
    }

    return (
        <div>
            {hasChildren ? (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className={cn(
                        'flex items-center gap-3 w-full px-3 py-2.5 rounded-[var(--radius-md)]',
                        'transition-colors duration-[var(--transition-fast)]',
                        'text-sm font-medium cursor-pointer',
                        isActive
                            ? 'bg-sidebar-active text-white'
                            : 'text-sidebar-text hover:bg-sidebar-hover hover:text-white'
                    )}
                >
                    {item.icon}
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronDown
                        size={16}
                        className={cn(
                            'transition-transform duration-[var(--transition-fast)]',
                            expanded && 'rotate-180'
                        )}
                    />
                </button>
            ) : (
                <Link
                    href={item.href}
                    className={cn(
                        'flex items-center gap-3 w-full px-3 py-2.5 rounded-[var(--radius-md)]',
                        'transition-colors duration-[var(--transition-fast)]',
                        'text-sm font-medium',
                        isActive
                            ? 'bg-sidebar-active text-white'
                            : 'text-sidebar-text hover:bg-sidebar-hover hover:text-white'
                    )}
                >
                    {item.icon}
                    <span>{item.label}</span>
                </Link>
            )}

            {/* Submenu */}
            {hasChildren && expanded && (
                <div className="ml-5 mt-1 pl-4 border-l border-surface-700 space-y-0.5">
                    {item.children!.map((child) => (
                        <Link
                            key={child.label}
                            href={child.href}
                            className={cn(
                                'block px-3 py-2 rounded-[var(--radius-sm)] text-sm',
                                'transition-colors duration-[var(--transition-fast)]',
                                pathname === child.href
                                    ? 'text-white bg-sidebar-hover'
                                    : 'text-sidebar-text hover:text-white hover:bg-sidebar-hover'
                            )}
                        >
                            {child.label}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export function Sidebar() {
    const { sidebarCollapsed, sidebarMobileOpen, toggleSidebar, setSidebarMobileOpen } =
        useUiStore();

    return (
        <>
            {/* Mobile overlay */}
            {sidebarMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarMobileOpen(false)}
                />
            )}

            <aside
                className={cn(
                    'fixed top-0 left-0 h-full bg-sidebar-bg z-50',
                    'flex flex-col transition-all duration-[var(--transition-slow)]',
                    'border-r border-surface-800',
                    // Desktop
                    'hidden lg:flex',
                    sidebarCollapsed
                        ? 'w-[var(--sidebar-collapsed-width)]'
                        : 'w-[var(--sidebar-width)]',
                    // Mobile
                    sidebarMobileOpen && '!flex w-[280px]'
                )}
            >
                {/* Logo area */}
                <div
                    className={cn(
                        'h-[var(--header-height)] flex items-center border-b border-surface-800 shrink-0',
                        sidebarCollapsed ? 'justify-center px-2' : 'px-5'
                    )}
                >
                    {sidebarCollapsed ? (
                        <span className="text-white font-bold text-lg">I</span>
                    ) : (
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-[var(--radius-md)] bg-primary-500 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">IB</span>
                            </div>
                            <div>
                                <h1 className="text-white font-semibold text-sm leading-tight">IBMS</h1>
                                <p className="text-sidebar-text text-[11px] leading-tight">Insurance Broker</p>
                            </div>
                        </div>
                    )}

                    {/* Mobile close */}
                    <button
                        onClick={() => setSidebarMobileOpen(false)}
                        className="ml-auto lg:hidden text-sidebar-text hover:text-white p-1"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 px-3">
                    {navigation.map((section, sectionIdx) => (
                        <div key={section.label} className={cn(sectionIdx > 0 && 'mt-5')}>
                            {/* Section label */}
                            {sidebarCollapsed ? (
                                <div className="mx-2 mb-2 border-t border-surface-700" />
                            ) : (
                                <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-sidebar-text/50 select-none">
                                    {section.label}
                                </p>
                            )}
                            <div className="space-y-1">
                                {section.items.map((item) => (
                                    <NavItem key={item.href} item={item} collapsed={sidebarCollapsed} />
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Collapse toggle (desktop only) */}
                <div className="hidden lg:block border-t border-surface-800 p-3">
                    <button
                        onClick={toggleSidebar}
                        className={cn(
                            'flex items-center justify-center w-full py-2 rounded-[var(--radius-md)]',
                            'text-sidebar-text hover:bg-sidebar-hover hover:text-white',
                            'transition-colors duration-[var(--transition-fast)]',
                            'cursor-pointer'
                        )}
                        title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        <ChevronLeft
                            size={18}
                            className={cn(
                                'transition-transform duration-[var(--transition-fast)]',
                                sidebarCollapsed && 'rotate-180'
                            )}
                        />
                    </button>
                </div>
            </aside>
        </>
    );
}
