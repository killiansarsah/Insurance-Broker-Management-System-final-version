import dynamic from 'next/dynamic';
import { Bell, Search, Menu, CheckCircle2, LogOut, Calculator, Headset, ShieldAlert, User } from 'lucide-react';
import Image from 'next/image';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useUiStore } from '@/stores/ui-store';
import { useAuthStore } from '@/stores/auth-store';
import { useProfileStore } from '@/stores/profile-store';
import { NotificationsPopover } from '@/components/features/notifications';
import { useState } from 'react';
import { useClickOutside } from '@/hooks/use-click-outside';
import { GlobalSearch } from '@/components/features/global-search';
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
    const { sidebarCollapsed, setSidebarMobileOpen, searchOpen, setSearchOpen } = useUiStore();
    const { user, logout } = useAuthStore();
    const avatarUrl = useProfileStore((s) => s.avatarUrl);
    const [profileOpen, setProfileOpen] = useState(false);
    const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
    const [isSignOutOpen, setIsSignOutOpen] = useState(false);

    // Click outside handlers
    const profileRef = useClickOutside<HTMLDivElement>(() => setProfileOpen(false));

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

                {/* Company logo — mobile only (sidebar is hidden on mobile) */}
                <div className="lg:hidden relative w-7 h-7 shrink-0">
                    <Image
                        src="/logo-blue.png"
                        alt="Brokerium Logo"
                        fill
                        className="object-contain"
                        sizes="28px"
                    />
                </div>

                <div className="hidden md:block relative cursor-pointer" onClick={() => setSearchOpen(true)}>
                    <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400"
                    />
                    <div
                        className={cn(
                            'h-9 pl-9 pr-4 w-72 text-sm bg-surface-50 dark:bg-slate-800 border border-surface-200 dark:border-slate-600 dark:text-slate-200',
                            'rounded-[var(--radius-full)]',
                            'flex items-center text-surface-400',
                            'hover:border-primary-500/50 hover:ring-2 hover:ring-primary-500/10',
                            'transition-colors duration-[var(--transition-fast)]'
                        )}
                    >
                        Search clients, policies, claims...
                    </div>
                </div>

                <button
                    onClick={() => setSearchOpen(true)}
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
                <NotificationsPopover />

                {/* Profile */}
                <div className="relative" ref={profileRef}>
                    <button
                        onClick={() => {
                            setProfileOpen(!profileOpen);
                        }}
                        className="flex items-center gap-2.5 p-1.5 pr-3 hover:bg-surface-100 rounded-[var(--radius-full)] cursor-pointer transition-colors"
                    >
                        <Avatar
                            name={user ? `${user.firstName} ${user.lastName}` : 'User'}
                            src={user?.avatarUrl || avatarUrl || undefined}
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
                            <div className="py-2 space-y-1">
                                <button
                                    onClick={() => {
                                        router.push('/dashboard/settings');
                                        setProfileOpen(false);
                                    }}
                                    className="w-full px-5 py-2.5 text-sm text-left text-surface-700 dark:text-slate-300 hover:bg-surface-50 dark:hover:bg-slate-700 cursor-pointer transition-colors font-medium flex items-center gap-3"
                                >
                                    <div className="w-6 h-6 rounded-full bg-surface-100 dark:bg-slate-700 flex items-center justify-center">
                                        <User size={12} className="text-surface-500" />
                                    </div>
                                    My Profile
                                </button>

                                {(user?.role === 'SUPER_ADMIN' || user?.role === 'PLATFORM_SUPER_ADMIN') && (
                                    <button
                                        onClick={() => {
                                            router.push('/super-admin/overview');
                                            setProfileOpen(false);
                                        }}
                                        className="w-full px-5 py-2.5 text-sm text-left text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 cursor-pointer transition-colors font-bold flex items-center gap-3"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                                            <ShieldAlert size={12} className="text-primary-600 dark:text-primary-500" />
                                        </div>
                                        Command Centre
                                    </button>
                                )}
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

            <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />

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
