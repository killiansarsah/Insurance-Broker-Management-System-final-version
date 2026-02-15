'use client';

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
                children: [
                    { label: 'Active Clients', href: '/dashboard/clients' },
                    { label: 'Add Client', href: '/dashboard/clients/new' },
                ],
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

function GlobalRail() {
    // Simple placeholder actions for now
    const handleSearch = () => alert("Global Search modal would open here");
    const handleNotifications = () => alert("Notifications panel would slide out here");
    const handleQuickAdd = () => alert("Quick Create menu (Quote, Client, Claim) would open here");

    return (
        <div className="w-[48px] h-full flex flex-col items-center py-4 bg-[var(--bg-sidebar)]/80 border-r border-surface-800/50 shrink-0 z-20">
            {/* Logo Icon */}
            <div className="w-8 h-8 rounded-none bg-primary-600 flex items-center justify-center mb-6 text-white font-bold text-xs shadow-none cursor-pointer hover:bg-primary-500 transition-colors">
                IB
            </div>

            {/* Quick Actions (High Frequency) */}
            <div className="flex flex-col gap-3 w-full items-center">
                <button
                    onClick={handleSearch}
                    className="w-8 h-8 flex items-center justify-center text-surface-400 hover:text-white hover:bg-white/10 transition-colors"
                    title="Global Search"
                >
                    <Search size={18} />
                </button>
                <button
                    onClick={handleNotifications}
                    className="w-8 h-8 flex items-center justify-center text-surface-400 hover:text-white hover:bg-white/10 transition-colors relative"
                    title="Notifications"
                >
                    <Bell size={18} />
                    <span className="absolute top-1.5 right-2 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                </button>
                <button
                    onClick={handleQuickAdd}
                    className="w-8 h-8 flex items-center justify-center text-primary-400 hover:text-white hover:bg-primary-500/20 transition-colors"
                    title="Create New..."
                >
                    <Plus size={20} />
                </button>
            </div>

            <div className="flex-1" />

            {/* Bottom Actions */}
            <div className="flex flex-col gap-3 w-full items-center mb-2">
                <button className="w-8 h-8 flex items-center justify-center text-surface-400 hover:text-white hover:bg-white/10 transition-colors" title="Profile">
                    <UserCircle size={20} />
                </button>
            </div>
        </div>
    );
}

function NavItem({ item, collapsed }: { item: NavItemConfig; collapsed: boolean }) {
    const pathname = usePathname();
    const [expanded, setExpanded] = useState(false);
    const isActive =
        pathname === item.href ||
        item.children?.some((child) => pathname === child.href);

    const hasChildren = item.children && item.children.length > 0;

    // Collapsed View (Icon Only)
    if (collapsed) {
        return (
            <Link
                href={item.href}
                className={cn(
                    'flex items-center justify-center w-10 h-10 mx-auto rounded-none', // Sharp corners
                    'transition-all duration-200',
                    'hover:bg-white/5',
                    isActive
                        ? 'text-primary-400 bg-primary-500/10 border-l-2 border-primary-500' // Sharp indicator
                        : 'text-surface-400'
                )}
                title={item.label}
            >
                {item.icon}
            </Link>
        );
    }

    // Expanded View (Full Row)
    return (
        <div>
            {hasChildren ? (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className={cn(
                        'flex items-center gap-3 w-full px-3 py-2 rounded-none', // Sharp corners
                        'transition-all duration-200',
                        'text-sm font-medium cursor-pointer group',
                        'border-l-2 border-transparent', // Layout stability for active state
                        isActive
                            ? 'bg-surface-800/50 text-white border-primary-500' // Sharp left border
                            : 'text-surface-400 hover:text-surface-100 hover:bg-white/5'
                    )}
                >
                    <span className={cn("transition-colors", isActive ? "text-primary-400" : "text-surface-400 group-hover:text-surface-300")}>
                        {item.icon}
                    </span>
                    <span className="flex-1 text-left tracking-tight">{item.label}</span>
                    {item.badge && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-primary-600 text-white rounded-none">
                            {item.badge}
                        </span>
                    )}
                    <ChevronDown
                        size={14}
                        className={cn(
                            'transition-transform duration-200 text-surface-500',
                            expanded && 'rotate-180'
                        )}
                    />
                </button>
            ) : (
                <Link
                    href={item.href}
                    className={cn(
                        'flex items-center gap-3 w-full px-3 py-2 rounded-none', // Sharp corners
                        'transition-all duration-200',
                        'text-sm font-medium cursor-pointer group',
                        'border-l-2 border-transparent',
                        isActive
                            ? 'bg-surface-800/50 text-white border-primary-500'
                            : 'text-surface-400 hover:text-surface-100 hover:bg-white/5'
                    )}
                >
                    <span className={cn("transition-colors", isActive ? "text-primary-400" : "text-surface-400 group-hover:text-surface-300")}>
                        {item.icon}
                    </span>
                    <span className="flex-1 text-left tracking-tight">{item.label}</span>
                    {item.badge && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-primary-600 text-white rounded-none">
                            {item.badge}
                        </span>
                    )}
                </Link>
            )}

            {/* Submenu (Tree Line Style) */}
            {hasChildren && expanded && (
                <div className="ml-4 pl-4 border-l border-surface-700/50 space-y-0.5 mt-0.5 mb-1">
                    {item.children!.map((child) => (
                        <Link
                            key={child.label}
                            href={child.href}
                            className={cn(
                                'block px-3 py-1.5 text-xs rounded-none',
                                'transition-colors duration-200',
                                pathname === child.href
                                    ? 'text-white font-medium'
                                    : 'text-surface-500 hover:text-surface-300'
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
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarMobileOpen(false)}
                />
            )}

            <aside
                className={cn(
                    'fixed top-0 left-0 h-full bg-[var(--bg-sidebar)] backdrop-blur-[var(--glass-blur)] z-50',
                    // Using flex-row to accommodate the Double Rail
                    'flex flex-row transition-all duration-300',
                    'border-r border-surface-800/50',
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
                        'h-[var(--header-height)] flex items-center shrink-0 border-b border-surface-800/50',
                        sidebarCollapsed ? 'justify-center' : 'px-4'
                    )}>
                        {sidebarCollapsed ? (
                            <div className="text-primary-500 font-bold">IB</div>
                        ) : (
                            <div>
                                <h2 className="text-surface-100 font-bold text-sm tracking-wide uppercase">Workspace</h2>
                                <p className="text-[10px] text-surface-500">Brokerage & Co.</p>
                            </div>
                        )}

                        {/* Mobile Close */}
                        <button
                            onClick={() => setSidebarMobileOpen(false)}
                            className="ml-auto lg:hidden text-surface-400 hover:text-white"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Scrollable Navigation */}
                    <nav className="flex-1 overflow-y-auto py-4 px-2 custom-scrollbar">
                        {navigation.map((section, sectionIdx) => (
                            <div key={section.label} className={cn(sectionIdx > 0 && 'mt-6')}>
                                {/* Section label */}
                                {sidebarCollapsed ? (
                                    <div className="mx-2 mb-2 border-t border-surface-800" />
                                ) : (
                                    <p className="px-3 mb-2 text-[9px] font-bold uppercase tracking-[0.15em] text-surface-500 select-none">
                                        {section.label}
                                    </p>
                                )}
                                <div className="space-y-0.5">
                                    {section.items.map((item) => (
                                        <NavItem key={item.href} item={item} collapsed={sidebarCollapsed} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </nav>

                    {/* Footer / User / Collapse */}
                    <div className="border-t border-surface-800/50 p-2">
                        <button
                            onClick={toggleSidebar}
                            className={cn(
                                'flex items-center justify-center w-full py-2 rounded-none group', // Sharp
                                'text-surface-500 hover:text-surface-200 hover:bg-white/5',
                                'transition-colors duration-200',
                                'cursor-pointer'
                            )}
                            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        >
                            <ChevronLeft
                                size={16}
                                className={cn(
                                    'transition-transform duration-300',
                                    sidebarCollapsed && 'rotate-180'
                                )}
                            />
                            {!sidebarCollapsed && <span className="ml-2 text-xs font-medium">Collapse View</span>}
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
