'use client';

import { useEffect, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth-store';

const SOCKET_URL = process.env.NEXT_PUBLIC_WS_URL || (typeof window !== 'undefined' ? `http://${window.location.hostname}:3001` : 'http://localhost:3001');

interface NotificationEvent {
    id: string;
    title: string;
    message: string;
    type: string;
    priority: string;
    link?: string;
    createdAt: string;
}

export function useNotificationSocket() {
    const [socket, setSocket] = useState<Socket | null>(null);
    const accessToken = useAuthStore(state => state.accessToken);

    useEffect(() => {
        const token = accessToken || apiClient.getAccessToken();
        if (!token) return;

        const s = io(`${SOCKET_URL}/notifications`, {
            auth: { token },
            transports: ['websocket'],
        });
        
        s.on('connect', () => console.log('Notification socket connected'));
        s.on('connect_error', (err) => console.error('Notification socket error:', err));
        
        setSocket(s);

        return () => {
            s.disconnect();
            setSocket(null);
        };
    }, [accessToken]);

    const onNewNotification = useCallback(
        (callback: (notification: NotificationEvent) => void) => {
            if (!socket) return () => {};
            socket.on('new_notification', callback);
            return () => {
                socket.off('new_notification', callback);
            };
        },
        [socket],
    );

    return { onNewNotification, isConnected: socket?.connected ?? false };
}
