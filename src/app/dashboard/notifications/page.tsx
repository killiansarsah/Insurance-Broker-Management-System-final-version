'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
    Bell,
    BellOff,
    CheckCircle2,
    Trash2,
    Archive,
    Filter,
    RefreshCw,
    AlertTriangle,
    FileText,
    DollarSign,
    Users,
    Shield,
    Clock,
    Settings,
    ChevronRight,
    Inbox,
    ArrowUpRight,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/data-display/status-badge';
import { useNotificationStore } from '@/stores/notification-store';
import { cn, formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import type { NotificationType, NotificationPriority } from '@/types';

const TYPE_CONFIG: Record<NotificationType, { icon: React.ReactNode; color: string; label: string }> = {
    renewal: { icon: <RefreshCw size={16} />, color: 'bg-primary-50 text-primary-600', label: 'Renewal' },
    claim: { icon: <FileText size={16} />, color: 'bg-warning-50 text-warning-600', label: 'Claim' },
    commission: { icon: <DollarSign size={16} />, color: 'bg-success-50 text-success-600', label: 'Commission' },
    lead: { icon: <Users size={16} />, color: 'bg-accent-50 text-accent-600', label: 'Lead' },
    followup: { icon: <Clock size={16} />, color: 'bg-primary-50 text-primary-600', label: 'Follow-up' },
    compliance: { icon: <Shield size={16} />, color: 'bg-danger-50 text-danger-600', label: 'Compliance' },
    finance: { icon: <DollarSign size={16} />, color: 'bg-warning-50 text-warning-600', label: 'Finance' },
    system: { icon: <Settings size={16} />, color: 'bg-surface-100 text-surface-600', label: 'System' },
    document: { icon: <FileText size={16} />, color: 'bg-accent-50 text-accent-600', label: 'Document' },
    approval: { icon: <CheckCircle2 size={16} />, color: 'bg-primary-50 text-primary-600', label: 'Approval' },
};

const PRIORITY_STYLES: Record<NotificationPriority, string> = {
    urgent: 'border-l-danger-500',
    high: 'border-l-warning-500',
    medium: 'border-l-primary-500',
    low: 'border-l-surface-300',
};

type TabKey = 'all' | 'unread' | 'archived';

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return formatDate(dateStr);
}

export default function NotificationsPage() {
    const {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        archiveNotification,
        deleteNotification,
        clearAll,
    } = useNotificationStore();

    const [tab, setTab] = useState<TabKey>('all');
    const [typeFilter, setTypeFilter] = useState<NotificationType | 'all'>('all');

    const filteredNotifs = useMemo(() => {
        let list = [...notifications].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        if (tab === 'unread') list = list.filter((n) => !n.read && !n.archived);
        else if (tab === 'archived') list = list.filter((n) => n.archived);
        else list = list.filter((n) => !n.archived);

        if (typeFilter !== 'all') list = list.filter((n) => n.type === typeFilter);
        return list;
    }, [notifications, tab, typeFilter]);

    const unread = unreadCount();

    const tabs: { key: TabKey; label: string; count?: number }[] = [
        { key: 'all', label: 'All', count: notifications.filter((n) => !n.archived).length },
        { key: 'unread', label: 'Unread', count: unread },
        { key: 'archived', label: 'Archived', count: notifications.filter((n) => n.archived).length },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
                        <Bell size={22} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Notifications</h1>
                        <p className="text-sm text-surface-500">
                            {unread > 0 ? `${unread} unread notification${unread > 1 ? 's' : ''}` : 'All caught up!'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {unread > 0 && (
                        <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<CheckCircle2 size={14} />}
                            onClick={() => {
                                markAllAsRead();
                                toast.success('All notifications marked as read');
                            }}
                        >
                            Mark All Read
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Archive size={14} />}
                        onClick={() => {
                            clearAll();
                            toast.success('All notifications archived');
                        }}
                    >
                        Archive All
                    </Button>
                    <Link href="/dashboard/settings">
                        <Button variant="ghost" size="sm" leftIcon={<Settings size={14} />}>
                            Preferences
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Tabs + Filter */}
            <Card padding="md" className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex gap-1 bg-surface-100 rounded-lg p-1">
                    {tabs.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={cn(
                                'px-4 py-1.5 text-sm font-semibold rounded-md transition-all cursor-pointer',
                                tab === t.key
                                    ? 'bg-white dark:bg-slate-800 text-surface-900 dark:text-white shadow-sm'
                                    : 'text-surface-500 hover:text-surface-700 dark:hover:text-slate-300'
                            )}
                        >
                            {t.label}
                            {t.count !== undefined && t.count > 0 && (
                                <span className={cn(
                                    'ml-1.5 text-xs px-1.5 py-0.5 rounded-full',
                                    tab === t.key ? 'bg-primary-50 text-primary-600' : 'bg-surface-200 text-surface-500'
                                )}>
                                    {t.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2 sm:ml-auto">
                    <Filter size={14} className="text-surface-400" />
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value as NotificationType | 'all')}
                        className="text-sm bg-surface-50 border border-surface-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500/20 cursor-pointer"
                    >
                        <option value="all">All Types</option>
                        {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
                            <option key={key} value={key}>{cfg.label}</option>
                        ))}
                    </select>
                </div>
            </Card>

            {/* Notification List */}
            {filteredNotifs.length > 0 ? (
                <div className="space-y-2">
                    {filteredNotifs.map((notif) => {
                        const cfg = TYPE_CONFIG[notif.type];
                        return (
                            <Card
                                key={notif.id}
                                className={cn(
                                    'border-l-4 transition-all group',
                                    PRIORITY_STYLES[notif.priority],
                                    !notif.read && 'bg-primary-50/20 dark:bg-primary-900/10'
                                )}
                                padding="none"
                            >
                                <div className="flex items-start gap-4 p-4 sm:p-5">
                                    {/* Icon */}
                                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', cfg.color)}>
                                        {cfg.icon}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className={cn(
                                                    'text-sm tracking-tight',
                                                    notif.read ? 'font-medium text-surface-700' : 'font-bold text-surface-900'
                                                )}>
                                                    {notif.title}
                                                </h3>
                                                {!notif.read && (
                                                    <span className="w-2 h-2 rounded-full bg-primary-500 shrink-0" />
                                                )}
                                                {notif.priority === 'urgent' && (
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-danger-600 bg-danger-50 px-2 py-0.5 rounded-full">
                                                        Urgent
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-[11px] text-surface-400 font-medium shrink-0 whitespace-nowrap">
                                                {timeAgo(notif.createdAt)}
                                            </span>
                                        </div>

                                        <p className="text-sm text-surface-500 mt-1 line-clamp-2">{notif.message}</p>

                                        <div className="flex items-center gap-3 mt-3">
                                            <span className={cn(
                                                'text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full',
                                                cfg.color
                                            )}>
                                                {cfg.label}
                                            </span>

                                            {notif.link && (
                                                <Link
                                                    href={notif.link}
                                                    onClick={() => markAsRead(notif.id)}
                                                    className="text-xs text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-0.5"
                                                >
                                                    View <ArrowUpRight size={12} />
                                                </Link>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                        {!notif.read && (
                                            <button
                                                onClick={() => markAsRead(notif.id)}
                                                className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-surface-600 transition-colors"
                                                title="Mark as read"
                                            >
                                                <CheckCircle2 size={14} />
                                            </button>
                                        )}
                                        {!notif.archived && (
                                            <button
                                                onClick={() => {
                                                    archiveNotification(notif.id);
                                                    toast.success('Notification archived');
                                                }}
                                                className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-surface-600 transition-colors"
                                                title="Archive"
                                            >
                                                <Archive size={14} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => {
                                                deleteNotification(notif.id);
                                                toast.success('Notification deleted');
                                            }}
                                            className="p-1.5 rounded-lg hover:bg-danger-50 text-surface-400 hover:text-danger-600 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <Card padding="lg" className="text-center">
                    <div className="flex flex-col items-center gap-4 py-12">
                        <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center">
                            {tab === 'archived' ? (
                                <Archive size={32} className="text-surface-300" />
                            ) : (
                                <BellOff size={32} className="text-surface-300" />
                            )}
                        </div>
                        <div>
                            <p className="font-semibold text-surface-700">
                                {tab === 'archived' ? 'No archived notifications' : 'No notifications'}
                            </p>
                            <p className="text-sm text-surface-400 mt-1">
                                {tab === 'unread'
                                    ? "You're all caught up! No unread notifications."
                                    : tab === 'archived'
                                        ? 'Archived notifications will appear here.'
                                        : 'New notifications will appear here as events occur.'}
                            </p>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
}
