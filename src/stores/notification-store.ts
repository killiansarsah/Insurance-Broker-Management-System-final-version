import { create } from 'zustand';
import type { Notification } from '@/types';
import { apiClient } from '@/lib/api-client';

interface NotificationStore {
    notifications: Notification[];
    loading: boolean;

    // Computed-like getters
    unreadCount: () => number;
    unreadNotifications: () => Notification[];
    activeNotifications: () => Notification[];

    // Actions
    fetchNotifications: () => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    deleteNotification: (id: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
    notifications: [],
    loading: false,

    unreadCount: () => get().notifications.filter((n) => !n.read && !n.archived).length,

    unreadNotifications: () =>
        get()
            .notifications.filter((n) => !n.read && !n.archived)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),

    activeNotifications: () =>
        get()
            .notifications.filter((n) => !n.archived)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),

    fetchNotifications: async () => {
        set({ loading: true });
        try {
            const res = await apiClient.get<any>('/notifications?limit=50');
            set({ notifications: res.data?.items ?? res.data ?? [] });
        } catch {
            // Silently fail — notifications are non-critical
        } finally {
            set({ loading: false });
        }
    },

    markAsRead: async (id) => {
        set((state) => ({
            notifications: state.notifications.map((n) =>
                n.id === id ? { ...n, read: true, readAt: new Date().toISOString() } : n
            ),
        }));
        try {
            await apiClient.patch(`/notifications/${id}/read`);
        } catch {
            // Revert on failure
            get().fetchNotifications();
        }
    },

    markAllAsRead: async () => {
        set((state) => ({
            notifications: state.notifications.map((n) =>
                !n.read ? { ...n, read: true, readAt: new Date().toISOString() } : n
            ),
        }));
        try {
            await apiClient.post('/notifications/mark-all-read');
        } catch {
            get().fetchNotifications();
        }
    },

    deleteNotification: async (id) => {
        const prev = get().notifications;
        set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
        }));
        try {
            await apiClient.delete(`/notifications/${id}`);
        } catch {
            set({ notifications: prev });
        }
    },
}));
