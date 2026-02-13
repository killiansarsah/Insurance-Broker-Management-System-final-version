'use client';

import { Bell, Search, Menu } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useUiStore } from '@/stores/ui-store';
import { useAuthStore } from '@/stores/auth-store';
import { useState } from 'react';

export function Header() {
    const { sidebarCollapsed, setSidebarMobileOpen } = useUiStore();
    const { user, logout } = useAuthStore();
    const [searchOpen, setSearchOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    const notifications = [
        { id: '1', title: 'Policy renewal due', message: 'POL-2024-001 expires in 7 days', time: '2h ago', read: false },
        { id: '2', title: 'New claim registered', message: 'CLM-2024-015 submitted by Kwame Mensah', time: '4h ago', read: false },
        { id: '3', title: 'KYC verification', message: 'Client Ama Serwaa requires KYC update', time: '1d ago', read: true },
    ];

    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <header
            className={cn(
                'fixed top-0 right-0 h-[var(--header-height)] z-30',
                'bg-white border-b border-surface-200',
                'flex items-center justify-between px-4 lg:px-6',
                'transition-all duration-[var(--transition-slow)]',
                // Offset by sidebar width
                sidebarCollapsed
                    ? 'lg:left-[var(--sidebar-collapsed-width)]'
                    : 'lg:left-[var(--sidebar-width)]',
                'left-0'
            )}
        >
            {/* Left section */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setSidebarMobileOpen(true)}
                    className="lg:hidden p-2 text-surface-600 hover:bg-surface-100 rounded-[var(--radius-md)] cursor-pointer"
                    aria-label="Open menu"
                >
                    <Menu size={20} />
                </button>

                {/* Search */}
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

                {/* Mobile search toggle */}
                <button
                    onClick={() => setSearchOpen(!searchOpen)}
                    className="md:hidden p-2 text-surface-600 hover:bg-surface-100 rounded-[var(--radius-md)] cursor-pointer"
                >
                    <Search size={20} />
                </button>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-2">
                {/* Notifications */}
                <div className="relative">
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

                    {/* Notifications dropdown */}
                    {notificationsOpen && (
                        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] border border-surface-200 animate-scale-in overflow-hidden">
                            <div className="px-4 py-3 border-b border-surface-100">
                                <h3 className="text-sm font-semibold text-surface-900">
                                    Notifications
                                </h3>
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                                {notifications.map((n) => (
                                    <div
                                        key={n.id}
                                        className={cn(
                                            'px-4 py-3 border-b border-surface-50 hover:bg-surface-50 cursor-pointer transition-colors',
                                            !n.read && 'bg-primary-50/30'
                                        )}
                                    >
                                        <div className="flex items-start gap-2">
                                            {!n.read && (
                                                <span className="w-2 h-2 rounded-full bg-primary-500 mt-1.5 shrink-0" />
                                            )}
                                            <div className={cn(!n.read ? '' : 'ml-4')}>
                                                <p className="text-sm font-medium text-surface-900">
                                                    {n.title}
                                                </p>
                                                <p className="text-xs text-surface-500 mt-0.5">
                                                    {n.message}
                                                </p>
                                                <p className="text-xs text-surface-400 mt-1">{n.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="px-4 py-2 border-t border-surface-100">
                                <button className="text-xs text-primary-500 font-medium hover:text-primary-600 cursor-pointer">
                                    View all notifications
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile */}
                <div className="relative">
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
                            <p className="text-sm font-medium text-surface-900 leading-tight">
                                {user ? `${user.firstName} ${user.lastName}` : 'User'}
                            </p>
                            <p className="text-[11px] text-surface-500 leading-tight capitalize">
                                {user?.role.replace('_', ' ')}
                            </p>
                        </div>
                    </button>

                    {/* Profile dropdown */}
                    {profileOpen && (
                        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] border border-surface-200 animate-scale-in overflow-hidden">
                            <div className="px-4 py-3 border-b border-surface-100">
                                <p className="text-sm font-semibold text-surface-900">
                                    {user ? `${user.firstName} ${user.lastName}` : 'User'}
                                </p>
                                <p className="text-xs text-surface-500">{user?.email}</p>
                            </div>
                            <div className="py-1">
                                <button className="w-full px-4 py-2 text-sm text-left text-surface-700 hover:bg-surface-50 cursor-pointer transition-colors">
                                    My Profile
                                </button>
                                <button className="w-full px-4 py-2 text-sm text-left text-surface-700 hover:bg-surface-50 cursor-pointer transition-colors">
                                    Preferences
                                </button>
                            </div>
                            <div className="border-t border-surface-100 py-1">
                                <button
                                    onClick={logout}
                                    className="w-full px-4 py-2 text-sm text-left text-danger-600 hover:bg-danger-50 cursor-pointer transition-colors"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile search bar */}
            {searchOpen && (
                <div className="absolute left-0 right-0 top-full bg-white border-b border-surface-200 p-3 md:hidden animate-fade-in">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full h-10 px-4 text-sm border border-surface-200 rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                        autoFocus
                    />
                </div>
            )}
        </header>
    );
}
