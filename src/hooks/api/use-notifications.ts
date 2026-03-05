'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface NotificationData { id: string; message: string; read: boolean;[key: string]: unknown; }
interface UnreadCount { count: number; }

export function useNotifications(params?: Record<string, unknown>) {
    return useQuery({
        queryKey: ['notifications', params],
        queryFn: () => apiClient.get<NotificationData[]>('/notifications', params),
    });
}

export function useUnreadNotificationCount() {
    return useQuery({
        queryKey: ['notifications', 'unread-count'],
        queryFn: () => apiClient.get<UnreadCount>('/notifications/unread-count'),
        refetchInterval: 30_000,
    });
}

export function useMarkNotificationRead() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => apiClient.patch(`/notifications/${id}/read`),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['notifications'] });
            qc.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
        },
    });
}

export function useMarkAllNotificationsRead() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: () => apiClient.patch('/notifications/read-all'),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['notifications'] });
            qc.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
        },
    });
}
