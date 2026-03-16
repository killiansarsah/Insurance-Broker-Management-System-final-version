'use client';

import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { apiClient } from '@/lib/api-client';

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
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        const token = apiClient.getAccessToken();
        if (!token) return;

        const socket = io(`${SOCKET_URL}/notifications`, {
            auth: { token },
            transports: ['websocket'],
        });
        socketRef.current = socket;

        return () => {
            socket.disconnect();
        };
    }, []);

    const onNewNotification = useCallback(
        (callback: (notification: NotificationEvent) => void) => {
            socketRef.current?.on('new_notification', callback);
            return () => {
                socketRef.current?.off('new_notification', callback);
            };
        },
        [],
    );

    return { onNewNotification };
}
