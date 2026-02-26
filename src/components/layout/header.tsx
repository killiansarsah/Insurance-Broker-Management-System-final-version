import { Bell, Search, Menu, CheckCircle2, Trash2, Calculator, Headset } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useUiStore } from '@/stores/ui-store';
import { useAuthStore } from '@/stores/auth-store';
import { useState } from 'react';
import { useClickOutside } from '@/hooks/use-click-outside';
import { useRouter } from 'next/navigation';
import { CalculatorModal } from '@/components/ui/calculator-modal';

export function Header() {
    const router = useRouter();
    const { sidebarCollapsed, setSidebarMobileOpen } = useUiStore();
    const { user, logout } = useAuthStore();
    const [searchOpen, setSearchOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

    // Click outside handlers
    const profileRef = useClickOutside<HTMLDivElement>(() => setProfileOpen(false));
    const notificationsRef = useClickOutside<HTMLDivElement>(() => setNotificationsOpen(false));

    const [notifications, setNotifications] = useState([
        { id: '1', title: 'Policy renewal due', message: 'POL-2024-001 expires in 7 days', time: '2h ago', read: false, type: 'renewal', link: '/dashboard/policies/POL-2024-001' },
        { id: '2', title: 'New claim registered', message: 'CLM-2024-015 submitted by Kwame Mensah', time: '4h ago', read: false, type: 'claim', link: '/dashboard/claims/clm-084' },
        { id: '3', title: 'Commission paid', message: 'GHS 1,500 commission credited for POL-2024-0852', time: '5h ago', read: false, type: 'commission', link: '/dashboard/commissions' },
        { id: '4', title: 'New lead assigned', message: 'Emmanuel Tetteh — Marine Cargo enquiry', time: '8h ago', read: true, type: 'lead', link: '/dashboard/leads' },
        { id: '5', title: 'Follow-up reminder', message: 'Call Akosua Darko — Travel Insurance', time: '12h ago', read: true, type: 'followup', link: '/dashboard/calendar' },
        { id: '6', title: 'KYC verification', message: 'Client Ama Serwaa requires KYC update', time: '1d ago', read: true, type: 'compliance', link: '/dashboard/clients/CL-001' },
        { id: '7', title: 'Invoice overdue', message: 'INV-2024-004 for Akosua Darko is 4 days overdue', time: '1d ago', read: true, type: 'finance', link: '/dashboard/finance' },
    ]);

    const notifDot: Record<string, string> = {
        renewal: 'bg-warning-500',
        claim: 'bg-danger-500',
        commission: 'bg-success-500',
        lead: 'bg-primary-500',
        followup: 'bg-accent-500',
        compliance: 'bg-surface-500',
        finance: 'bg-warning-600',
    };

    const unreadCount = notifications.filter((n) => !n.read).length;

    const handleNotificationClick = (id: string, link: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
        setNotificationsOpen(false);
        router.push(link);
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    return (
        <header
            className={cn(
                'fixed top-0 right-0 h-[var(--header-height)] z-[200]',
                'bg-[var(--bg-header)] backdrop-blur-[var(--glass-blur)] border-b border-surface-200',
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
                    className="lg:hidden p-2 text-surface-600 hover:bg-surface-100 rounded-[var(--radius-md)] cursor-pointer"
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
                        className={cn(
                            'h-9 pl-9 pr-4 w-72 text-sm bg-surface-50 border border-surface-200',
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
                    onClick={() => alert("Contact Support")}
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
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 w-4 h-4 bg-danger-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {notificationsOpen && (
                        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] border border-surface-200 animate-scale-in overflow-hidden">
                            <div className="px-4 py-3 border-b border-surface-100 flex items-center justify-between">
                                <h3 className="text-sm font-bold text-surface-900">
                                    Notifications
                                </h3>
                                {unreadCount > 0 && (
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
                                            className={cn(
                                                'px-4 py-3 border-b border-surface-50 hover:bg-surface-50 cursor-pointer transition-colors',
                                                !n.read && 'bg-primary-50/30'
                                            )}
                                        >
                                            <div className="flex items-start gap-2">
                                                {!n.read && (
                                                    <span className={cn('w-2 h-2 rounded-full mt-1.5 shrink-0', notifDot[n.type] || 'bg-primary-500')} />
                                                )}
                                                <div className={cn(!n.read ? '' : 'ml-4')}>
                                                    <p className="text-sm font-bold text-surface-900">
                                                        {n.title}
                                                    </p>
                                                    <p className="text-xs text-surface-500 mt-0.5 line-clamp-2">
                                                        {n.message}
                                                    </p>
                                                    <p className="text-[10px] font-medium text-surface-400 mt-1 uppercase tracking-tight">{n.time}</p>
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
                            <div className="px-4 py-2 bg-surface-50 border-t border-surface-100">
                                <button className="w-full text-xs text-center text-primary-600 font-bold hover:text-primary-700 cursor-pointer uppercase tracking-widest py-1">
                                    View All Activity
                                </button>
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
                            <p className="text-sm font-bold text-surface-900 leading-tight">
                                {user ? `${user.firstName} ${user.lastName}` : 'User'}
                            </p>
                            <p className="text-[10px] text-surface-500 font-semibold uppercase leading-tight tracking-wider opacity-60">
                                {user?.role.replace('_', ' ')}
                            </p>
                        </div>
                    </button>

                    {profileOpen && (
                        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] border border-surface-200 animate-scale-in overflow-hidden">
                            <div className="px-5 py-4 bg-surface-50 border-b border-surface-100">
                                <p className="text-sm font-bold text-surface-900 leading-none">
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
                                    className="w-full px-5 py-2.5 text-sm text-left text-surface-700 hover:bg-surface-50 cursor-pointer transition-colors font-medium flex items-center gap-3"
                                >
                                    <Avatar name={user?.firstName || 'U'} size="sm" className="w-6 h-6 text-[10px]" />
                                    My Profile
                                </button>
                                <button
                                    onClick={() => {
                                        router.push('/dashboard/settings');
                                        setProfileOpen(false);
                                    }}
                                    className="w-full px-5 py-2.5 text-sm text-left text-surface-700 hover:bg-surface-50 cursor-pointer transition-colors font-medium flex items-center gap-3"
                                >
                                    <div className="w-6 h-6 rounded-full bg-surface-100 flex items-center justify-center">
                                        <Bell size={12} className="text-surface-500" />
                                    </div>
                                    Preferences
                                </button>
                            </div>
                            <div className="border-t border-surface-100 py-2 bg-surface-50/30">
                                <button
                                    onClick={logout}
                                    className="w-full px-5 py-2.5 text-sm text-left text-danger-600 hover:bg-danger-50 cursor-pointer transition-colors font-bold flex items-center gap-3"
                                >
                                    <div className="w-6 h-6 rounded-full bg-danger-100 flex items-center justify-center">
                                        <Trash2 size={12} className="text-danger-600" />
                                    </div>
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {searchOpen && (
                <div className="absolute left-0 right-0 top-full bg-white border-b border-surface-200 p-3 md:hidden animate-fade-in shadow-lg">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full h-10 px-4 text-sm border border-surface-200 rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                        autoFocus
                    />
                </div>
            )}

            <CalculatorModal
                isOpen={isCalculatorOpen}
                onClose={() => setIsCalculatorOpen(false)}
            />
        </header>
    );
}
