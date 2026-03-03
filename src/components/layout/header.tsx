import dynamic from 'next/dynamic';
import { Bell, Search, Menu, CheckCircle2, LogOut, Calculator, Headset, ShieldAlert } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useUiStore } from '@/stores/ui-store';
import { useAuthStore } from '@/stores/auth-store';
import { useNotificationStore } from '@/stores/notification-store';
import { useState } from 'react';
import { useClickOutside } from '@/hooks/use-click-outside';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
const CalculatorModal = dynamic(
    () => import('@/components/ui/calculator-modal').then(m => ({ default: m.CalculatorModal })),
    { ssr: false }
);
const ConfirmationModal = dynamic(
    () => import('@/components/ui/confirmation-modal').then(m => ({ default: m.ConfirmationModal })),
    { ssr: false }
);
import { toast } from 'sonner';

export function Header() {
    const router = useRouter();
    const { sidebarCollapsed, setSidebarMobileOpen } = useUiStore();
    const { user, logout } = useAuthStore();
    const { notifications: allNotifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();
    const [searchOpen, setSearchOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
    const [isSignOutOpen, setIsSignOutOpen] = useState(false);

    // Click outside handlers
    const profileRef = useClickOutside<HTMLDivElement>(() => setProfileOpen(false));
    const notificationsRef = useClickOutside<HTMLDivElement>(() => setNotificationsOpen(false));

    // Show latest 7 non-archived notifications in the dropdown
    const notifications = allNotifications
        .filter((n) => !n.archived)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 7);

    const notifDot: Record<string, string> = {
        renewal: 'bg-warning-500',
        claim: 'bg-danger-500',
        commission: 'bg-success-500',
        lead: 'bg-primary-500',
        followup: 'bg-accent-500',
        compliance: 'bg-surface-500',
        finance: 'bg-warning-600',
        system: 'bg-surface-400',
        document: 'bg-accent-500',
        approval: 'bg-primary-500',
    };

    const unread = unreadCount();

    const handleNotificationClick = (id: string, link?: string) => {
        markAsRead(id);
        setNotificationsOpen(false);
        if (link) router.push(link);
    };

    function timeAgo(dateStr: string): string {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'Just now';
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        const days = Math.floor(hrs / 24);
        return `${days}d ago`;
    }

    return (
        <header
            className={cn(
                'fixed top-0 right-0 h-[var(--header-height)] z-[200]',
                'bg-[var(--bg-header)] backdrop-blur-[var(--glass-blur)] border-b border-surface-200 dark:border-slate-700/60',
                'flex items-center justify-between px-4 lg:px-6',
                'transition-all duration-[var(--transition-slow)]',
                sidebarCollapsed
                    ? 'lg:left-[var(--sidebar-collapsed-width)]'
                    : 'lg:left-[var(--sidebar-width)]',
                'left-0'
            )}
        >
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setSidebarMobileOpen(true)}
                    className="lg:hidden p-2 text-surface-600 dark:text-slate-400 hover:bg-surface-100 dark:hover:bg-slate-800 rounded-[var(--radius-md)] cursor-pointer"
                    aria-label="Open menu"
                >
                    <Menu size={20} />
                </button>

                <div className="hidden md:block relative">
                    <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400"
                    />
                    <input
                        type="text"
                        placeholder="Search clients, policies, claims..."
                        aria-label="Search clients, policies, claims"
                        className={cn(
                            'h-9 pl-9 pr-4 w-72 text-sm bg-surface-50 dark:bg-slate-800 border border-surface-200 dark:border-slate-600 dark:text-slate-200',
                            'rounded-[var(--radius-full)]',
                            'placeholder:text-surface-400',
                            'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
                            'transition-colors duration-[var(--transition-fast)]'
                        )}
                    />
                </div>

                <button
                    onClick={() => setSearchOpen(!searchOpen)}
                    className="md:hidden p-2 text-surface-600 hover:bg-surface-100 rounded-[var(--radius-md)] cursor-pointer"
                >
                    <Search size={20} />
                </button>
            </div>

            <div className="flex items-center gap-2">
                {/* Utilities */}
                <button
                    onClick={() => setIsCalculatorOpen(true)}
                    className="p-2 text-surface-600 hover:bg-surface-100 rounded-[var(--radius-md)] cursor-pointer transition-colors"
                    title="Code Calculator"
                >
                    <Calculator size={20} />
                </button>
                <button
                    onClick={() => toast.info('Contact Support', { description: 'Email support@ibms.africa or call +233-302-123-456 for assistance.' })}
                    className="p-2 text-surface-600 hover:bg-surface-100 rounded-[var(--radius-md)] cursor-pointer transition-colors"
                    title="Contact Support"
                >
                    <Headset size={20} />
                </button>

                {/* Notifications */}
                <div className="relative" ref={notificationsRef}>
                    <button
                        onClick={() => {
                            setNotificationsOpen(!notificationsOpen);
                            setProfileOpen(false);
                        }}
                        className="relative p-2 text-surface-600 hover:bg-surface-100 rounded-[var(--radius-md)] cursor-pointer transition-colors"
                        aria-label="Notifications"
                    >
                        <Bell size={20} />
                        {unread > 0 && (
                            <span className="absolute top-1 right-1 w-4 h-4 bg-danger-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                {unread > 9 ? '9+' : unread}
                            </span>
                        )}
                    </button>

                    {notificationsOpen && (
                        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-800 rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] border border-surface-200 dark:border-slate-700 animate-scale-in overflow-hidden">
                            <div className="px-4 py-3 border-b border-surface-100 dark:border-slate-700 flex items-center justify-between">
                                <h3 className="text-sm font-bold text-surface-900 dark:text-white">
                                    Notifications
                                </h3>
                                {unread > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-[10px] font-bold text-primary-600 hover:text-primary-700 uppercase tracking-wider flex items-center gap-1"
                                    >
                                        <CheckCircle2 size={12} />
                                        Mark all read
                                    </button>
                                )}
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map((n) => (
                                        <div
                                            key={n.id}
                                            onClick={() => handleNotificationClick(n.id, n.link)}
                                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleNotificationClick(n.id, n.link); } }}
                                            role="button"
                                            tabIndex={0}
                                            className={cn(
                                                'px-4 py-3 border-b border-surface-50 dark:border-slate-700/50 hover:bg-surface-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors',
                                                !n.read && 'bg-primary-50/30 dark:bg-primary-900/20'
                                            )}
                                        >
                                            <div className="flex items-start gap-2">
                                                {!n.read && (
                                                    <span className={cn('w-2 h-2 rounded-full mt-1.5 shrink-0', notifDot[n.type] || 'bg-primary-500')} />
                                                )}
                                                <div className={cn(!n.read ? '' : 'ml-4')}>
                                                    <p className="text-sm font-bold text-surface-900 dark:text-white">
                                                        {n.title}
                                                    </p>
                                                    <p className="text-xs text-surface-500 mt-0.5 line-clamp-2">
                                                        {n.message}
                                                    </p>
                                                    <p className="text-[10px] font-medium text-surface-400 mt-1 uppercase tracking-tight">{timeAgo(n.createdAt)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-12 text-center">
                                        <p className="text-xs text-surface-500">No new notifications</p>
                                    </div>
                                )}
                            </div>
                            <div className="px-4 py-2 bg-surface-50 dark:bg-slate-900/50 border-t border-surface-100 dark:border-slate-700">
                                <Link
                                    href="/dashboard/notifications"
                                    onClick={() => setNotificationsOpen(false)}
                                    className="block w-full text-xs text-center text-primary-600 font-bold hover:text-primary-700 cursor-pointer uppercase tracking-widest py-1"
                                >
                                    View All Notifications
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile */}
                <div className="relative" ref={profileRef}>
                    <button
                        onClick={() => {
                            setProfileOpen(!profileOpen);
                            setNotificationsOpen(false);
                        }}
                        className="flex items-center gap-2.5 p-1.5 pr-3 hover:bg-surface-100 rounded-[var(--radius-full)] cursor-pointer transition-colors"
                    >
                        <Avatar
                            name={user ? `${user.firstName} ${user.lastName}` : 'User'}
                            size="sm"
                        />
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-bold text-surface-900 dark:text-white leading-tight">
                                {user ? `${user.firstName} ${user.lastName}` : 'User'}
                            </p>
                            <p className="text-[10px] text-surface-500 font-semibold uppercase leading-tight tracking-wider">
                                {user?.role.replace('_', ' ')}
                            </p>
                        </div>
                    </button>

                    {profileOpen && (
                        <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-800 rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] border border-surface-200 dark:border-slate-700 animate-scale-in overflow-hidden">
                            <div className="px-5 py-4 bg-surface-50 dark:bg-slate-900/50 border-b border-surface-100 dark:border-slate-700">
                                <p className="text-sm font-bold text-surface-900 dark:text-white leading-none">
                                    {user ? `${user.firstName} ${user.lastName}` : 'User'}
                                </p>
                                <p className="text-xs text-surface-500 mt-1.5 opacity-80">{user?.email}</p>
                            </div>
                            <div className="py-2">
                                <button
                                    onClick={() => {
                                        router.push('/dashboard/settings');
                                        setProfileOpen(false);
                                    }}
                                    className="w-full px-5 py-2.5 text-sm text-left text-surface-700 dark:text-slate-300 hover:bg-surface-50 dark:hover:bg-slate-700 cursor-pointer transition-colors font-medium flex items-center gap-3"
                                >
                                    <Avatar name={user?.firstName || 'U'} size="sm" className="w-6 h-6 text-[10px]" />
                                    My Profile
                                </button>
                                <button
                                    onClick={() => {
                                        router.push('/dashboard/settings');
                                        setProfileOpen(false);
                                    }}
                                    className="w-full px-5 py-2.5 text-sm text-left text-surface-700 dark:text-slate-300 hover:bg-surface-50 dark:hover:bg-slate-700 cursor-pointer transition-colors font-medium flex items-center gap-3"
                                >
                                    <div className="w-6 h-6 rounded-full bg-surface-100 flex items-center justify-center">
                                        <Bell size={12} className="text-surface-500" />
                                    </div>
                                    Preferences
                                </button>
                            </div>
                            <div className="border-t border-surface-100 dark:border-slate-700 py-2 bg-surface-50/30 dark:bg-slate-900/30">
                                <button
                                    onClick={() => { setProfileOpen(false); setIsSignOutOpen(true); }}
                                    className="w-full px-5 py-2.5 text-sm text-left text-danger-600 hover:bg-danger-50 cursor-pointer transition-colors font-bold flex items-center gap-3"
                                >
                                    <div className="w-6 h-6 rounded-full bg-danger-100 flex items-center justify-center">
                                        <LogOut size={12} className="text-danger-600" />
                                    </div>
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {searchOpen && (
                <div className="absolute left-0 right-0 top-full bg-white dark:bg-slate-800 border-b border-surface-200 dark:border-slate-700 p-3 md:hidden animate-fade-in shadow-lg">
                    <input
                        type="text"
                        placeholder="Search..."
                        aria-label="Search"
                        className="w-full h-10 px-4 text-sm border border-surface-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                        autoFocus
                    />
                </div>
            )}

            <CalculatorModal
                isOpen={isCalculatorOpen}
                onClose={() => setIsCalculatorOpen(false)}
            />

            <ConfirmationModal
                isOpen={isSignOutOpen}
                onClose={() => setIsSignOutOpen(false)}
                onConfirm={() => {
                    logout();
                    router.push('/login');
                }}
                title="Sign Out?"
                description="You will be logged out of your current session. Any unsaved changes will be lost."
                confirmLabel="Sign Out"
                cancelLabel="Stay Logged In"
                variant="danger"
                icon={<LogOut size={28} />}
            />
        </header>
    );
}
