import { create } from 'zustand';
import type { Notification, NotificationType } from '@/types';

interface NotificationStore {
    notifications: Notification[];

    // Computed-like getters
    unreadCount: () => number;
    unreadNotifications: () => Notification[];
    activeNotifications: () => Notification[];

    // Actions
    addNotification: (notif: Omit<Notification, 'id' | 'read' | 'archived' | 'createdAt'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    archiveNotification: (id: string) => void;
    deleteNotification: (id: string) => void;
    clearAll: () => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
    notifications: [],

    unreadCount: () => get().notifications.filter((n) => !n.read && !n.archived).length,

    unreadNotifications: () =>
        get()
            .notifications.filter((n) => !n.read && !n.archived)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),

    activeNotifications: () =>
        get()
            .notifications.filter((n) => !n.archived)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),

    addNotification: (notif) => {
        const newNotif: Notification = {
            ...notif,
            id: `notif-${Date.now().toString(36)}`,
            read: false,
            archived: false,
            createdAt: new Date().toISOString(),
        };
        set((state) => ({ notifications: [newNotif, ...state.notifications] }));
    },

    markAsRead: (id) =>
        set((state) => ({
            notifications: state.notifications.map((n) =>
                n.id === id ? { ...n, read: true, readAt: new Date().toISOString() } : n
            ),
        })),

    markAllAsRead: () =>
        set((state) => ({
            notifications: state.notifications.map((n) =>
                !n.read ? { ...n, read: true, readAt: new Date().toISOString() } : n
            ),
        })),

    archiveNotification: (id) =>
        set((state) => ({
            notifications: state.notifications.map((n) =>
                n.id === id ? { ...n, archived: true } : n
            ),
        })),

    deleteNotification: (id) =>
        set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
        })),

    clearAll: () =>
        set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, read: true, archived: true })),
        })),
}));
