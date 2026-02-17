'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    FileText,
    Shield, // Claims
    Briefcase, // My Desk/Tasks
    Building2, // Carriers
    FileBarChart, // Quotes
    Wallet, // Accounting
    PieChart, // Commissions
    LineChart, // Reports & Leads
    Settings,
    ChevronDown,
    ChevronLeft,
    ShieldCheck, // Compliance
    X,
    Calendar,
    Search,
    Bell,
    Plus,
    UserCircle,
    LogOut
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { useUiStore } from '@/stores/ui-store';
import { useState } from 'react';

// --- Types ---

interface NavItemConfig {
    label: string;
    href: string;
    icon: React.ReactNode;
    children?: { label: string; href: string }[];
    badge?: string; // For "Urgent" tasks count
}

interface NavSection {
    label: string;
    items: NavItemConfig[];
}

// --- Navigation Configuration (Broker Command Center) ---

const navigation: NavSection[] = [
    {
        label: 'Main Hub',
        items: [
            {
                label: 'Dashboard',
                href: '/dashboard',
                icon: <LayoutDashboard size={18} />,
            },
            {
                label: 'My Desk',
                href: '/dashboard/tasks',
                icon: <Briefcase size={18} />,
                badge: '5', // Mock urgent tasks
            },
            {
                label: 'Calendar',
                href: '/dashboard/calendar',
                icon: <Calendar size={18} />,
            },
        ],
    },
    {
        label: 'Core Business',
        items: [
            {
                label: 'Clients',
                href: '/dashboard/clients',
                icon: <Users size={18} />,
            },
            {
                label: 'Policies',
                href: '/dashboard/policies',
                icon: <FileText size={18} />,
                children: [
                    { label: 'Active Policies', href: '/dashboard/policies' },
                    { label: 'Renewals', href: '/dashboard/policies?tab=renewals' },
                ],
            },
            {
                label: 'Claims',
                href: '/dashboard/claims',
                icon: <Shield size={18} />,
                children: [
                    { label: 'Open Claims', href: '/dashboard/claims' },
                    { label: 'File New Claim', href: '/dashboard/claims/new' },
                ],
            },
            {
                label: 'Quotes',
                href: '/dashboard/quotes',
                icon: <FileBarChart size={18} />,
                children: [
                    { label: 'Recent Quotes', href: '/dashboard/quotes' },
                    { label: 'Create Measure', href: '/dashboard/quotes/new' },
                ],
            },
        ],
    },
    {
        label: 'Growth & Finance',
        items: [
            {
                label: 'Leads',
                href: '/dashboard/leads',
                icon: <LineChart size={18} />, // Using LineChart as a proxy for growth/leads
            },
            {
                label: 'Accounting',
                href: '/dashboard/finance',
                icon: <Wallet size={18} />,
                children: [
                    { label: 'Invoices', href: '/dashboard/finance/invoices' },
                    { label: 'Payments', href: '/dashboard/finance/payments' },
                ]
            },
            {
                label: 'Commissions',
                href: '/dashboard/commissions',
                icon: <PieChart size={18} />,
            },
        ],
    },
    {
        label: 'Operations',
        items: [
            {
                label: 'Carriers', // New Module
                href: '/dashboard/carriers',
                icon: <Building2 size={18} />,
                children: [
                    { label: 'Carrier List', href: '/dashboard/carriers' },
                    { label: 'Products', href: '/dashboard/carriers/products' },
                ]
            },
            {
                label: 'Team',
                href: '/dashboard/team',
                icon: <UserCircle size={18} />,
            },
            {
                label: 'Compliance',
                href: '/dashboard/compliance',
                icon: <ShieldCheck size={18} />,
            },
            {
                label: 'Settings',
                href: '/dashboard/settings',
                icon: <Settings size={18} />,
            },
        ]
    }
];

// --- Components ---

// --- Utilities ---
const normalizePath = (p: string) => p.replace(/\/$/, "") || "/";

// --- Components ---

function GlobalRail() {
    // Simple placeholder actions for now
    const handleSearch = () => alert("Global Search modal would open here");
    const handleNotifications = () => alert("Notifications panel would slide out here");
    const handleQuickAdd = () => alert("Quick Create menu (Quote, Client, Claim) would open here");

    return (
        <div className="w-[48px] h-full flex flex-col items-center py-4 bg-white border-r border-surface-200 shrink-0 z-20">
            {/* Logo Icon */}
            <div className="relative w-8 h-8">
                <Image
                    src="/logo.png"
                    alt="IBMS Logo"
                    fill
                    className="object-contain"
                    sizes="32px"
                />
            </div>

            {/* Quick Actions (High Frequency) */}
            <div className="flex flex-col gap-3 w-full items-center">
                <button
                    onClick={handleSearch}
                    className="w-10 h-10 flex items-center justify-center text-surface-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="Global Search"
                >
                    <Search size={20} />
                </button>
                <button
                    onClick={handleNotifications}
                    className="w-10 h-10 flex items-center justify-center text-surface-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors relative"
                    title="Notifications"
                >
                    <Bell size={20} />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>
                <button
                    onClick={handleQuickAdd}
                    className="w-10 h-10 flex items-center justify-center text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
                    title="Create New..."
                >
                    <Plus size={22} />
                </button>
            </div>

            <div className="flex-1" />

            {/* Bottom Actions */}
            <div className="flex flex-col gap-3 w-full items-center mb-2">
                <button className="w-10 h-10 flex items-center justify-center text-surface-500 hover:text-surface-900 hover:bg-surface-100 rounded-lg transition-colors" title="Profile">
                    <UserCircle size={22} />
                </button>
            </div>
        </div>
    );
}

function NavItem({ item, collapsed }: { item: NavItemConfig; collapsed: boolean }) {
    const pathname = usePathname();
    const [expanded, setExpanded] = useState(false);

    // Normalize paths to handle trailing slashes for active state
    const normalizedPath = normalizePath(pathname);
    const isActive =
        normalizedPath === normalizePath(item.href) ||
        item.children?.some((child) => normalizedPath === normalizePath(child.href));

    const hasChildren = item.children && item.children.length > 0;

    // Collapsed View (Icon Only)
    if (collapsed) {
        return (
            <Link
                href={item.href}
                className={cn(
                    'flex items-center justify-center w-10 h-10 mx-auto rounded-xl', // Premium soft rounded
                    'transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]', // Smooth bezier
                    'hover:scale-105 active:scale-95', // Micro-interaction
                    isActive
                        ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/20'
                        : 'text-surface-500 hover:bg-surface-50 hover:text-surface-900 mx-2'
                )}
                title={item.label}
            >
                {item.icon}
            </Link>
        );
    }

    // Expanded View (Full Row)
    return (
        <div className="px-2"> {/* Added padding container for floating feel */}
            {hasChildren ? (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className={cn(
                        'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl', // Premium rounded
                        'transition-all duration-200 ease-out',
                        'text-sm font-medium cursor-pointer group',
                        'hover:translate-x-1', // Lateral movement
                        isActive
                            ? 'bg-gradient-to-r from-primary-100/80 to-primary-50/40 text-surface-900 font-bold shadow-sm border border-primary-200/60'
                            : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
                    )}
                >
                    <span className={cn("transition-colors duration-200", isActive ? "text-primary-700" : "text-surface-400 group-hover:text-primary-500")}>
                        {item.icon}
                    </span>
                    <span className="flex-1 text-left tracking-tight">{item.label}</span>
                    {item.badge && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-primary-100 text-primary-700 rounded-md shadow-sm">
                            {item.badge}
                        </span>
                    )}
                    <ChevronDown
                        size={14}
                        className={cn(
                            'transition-transform duration-300 text-surface-400',
                            expanded && 'rotate-180'
                        )}
                    />
                </button>
            ) : (
                <Link
                    href={item.href}
                    className={cn(
                        'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl', // Premium rounded
                        'transition-all duration-300 ease-out',
                        'text-sm font-medium cursor-pointer group',
                        'hover:translate-x-1', // Lateral movement
                        isActive
                            ? 'bg-gradient-to-r from-primary-100/80 to-primary-50/40 border-l-[4px] border-primary-600 text-surface-900 font-bold pl-3.5 shadow-sm'
                            : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900 border-l-[4px] border-transparent'
                    )}
                >
                    <span className={cn("transition-colors duration-200", isActive ? "text-primary-700" : "text-surface-400 group-hover:text-primary-500")}>
                        {item.icon}
                    </span>
                    <span className="flex-1 text-left tracking-tight font-medium">{item.label}</span>
                    {item.badge && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-primary-100 text-primary-700 rounded-md shadow-sm">
                            {item.badge}
                        </span>
                    )}
                </Link>
            )}

            {/* Submenu (Tree Line Style) */}
            {hasChildren && expanded && (
                <div className="ml-4 pl-4 border-l border-surface-200 space-y-1 mt-1 mb-2">
                    {item.children!.map((child) => (
                        <Link
                            key={child.label}
                            href={child.href}
                            className={cn(
                                'block px-3 py-2 text-xs rounded-lg transition-all duration-200',
                                'hover:translate-x-1',
                                pathname === child.href
                                    ? 'text-primary-700 font-semibold bg-primary-50/50'
                                    : 'text-surface-500 hover:text-surface-900 hover:bg-surface-50'
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
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarMobileOpen(false)}
                />
            )}

            <aside
                className={cn(
                    'fixed top-0 left-0 h-full bg-white z-50',
                    // Using flex-row to accommodate the Double Rail
                    'flex flex-row transition-all duration-300 shadow-xl lg:shadow-none border-r border-surface-200',
                    // Desktop
                    'hidden lg:flex',
                    sidebarCollapsed
                        ? 'w-[var(--sidebar-collapsed-width)]'
                        : 'w-[var(--sidebar-width)]',
                    // Mobile
                    sidebarMobileOpen && '!flex w-[280px]'
                )}
            >
                {/* RAIL A: Global Toolbelt (Only visible when expanded or on mobile) */}
                {!sidebarCollapsed && <GlobalRail />}


                {/* RAIL B: Context Navigation */}
                <div className="flex-1 flex flex-col h-full overflow-hidden bg-transparent">

                    {/* Header Area */}
                    <div className={cn(
                        'h-[var(--header-height)] flex items-center shrink-0 border-b border-surface-100',
                        sidebarCollapsed ? 'justify-center' : 'px-6'
                    )}>
                        {sidebarCollapsed ? (
                            <div className="relative w-8 h-8">
                                <Image
                                    src="/logo.png"
                                    alt="IBMS Logo"
                                    fill
                                    className="object-contain"
                                    sizes="32px"
                                />
                            </div>
                        ) : (
                            <div>
                                <h2 className="text-surface-900 font-bold text-base tracking-tight">Dezag Brokers</h2>
                                <p className="text-[11px] text-surface-500 font-medium uppercase tracking-wider">Broker [MID 899597]</p>
                            </div>
                        )}

                        {/* Mobile Close */}
                        <button
                            onClick={() => setSidebarMobileOpen(false)}
                            className="ml-auto lg:hidden text-surface-400 hover:text-surface-900"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Scrollable Navigation */}
                    <nav className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
                        {navigation.map((section, sectionIdx) => (
                            <div key={section.label} className={cn(sectionIdx > 0 && 'mt-8')}>
                                {/* Section label */}
                                {sidebarCollapsed ? (
                                    <div className="mx-2 mb-2 border-t border-surface-200" />
                                ) : (
                                    <p className="px-3 mb-3 text-[11px] font-bold uppercase tracking-widest text-surface-400 select-none">
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

                    {/* Footer / User / Collapse */}
                    <div className="border-t border-surface-200 p-4">
                        <button
                            onClick={toggleSidebar}
                            className={cn(
                                'flex items-center justify-center w-full py-2.5 rounded-lg group', // Soft
                                'text-surface-500 hover:text-surface-900 hover:bg-surface-100',
                                'transition-colors duration-200',
                                'cursor-pointer'
                            )}
                            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        >
                            <ChevronLeft
                                size={18}
                                className={cn(
                                    'transition-transform duration-300',
                                    sidebarCollapsed && 'rotate-180'
                                )}
                            />
                            {!sidebarCollapsed && <span className="ml-2 text-sm font-medium">Collapse View</span>}
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
