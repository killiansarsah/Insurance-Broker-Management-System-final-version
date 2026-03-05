'use client';

import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { apiClient } from '@/lib/api-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';

interface ChatMessageEvent {
    id: string;
    roomId: string;
    senderId: string;
    content: string;
    type: string;
    createdAt: string;
    sender: { id: string; firstName: string; lastName: string; avatarUrl?: string };
}

interface TypingEvent {
    roomId: string;
    userId: string;
    userName: string;
}

export function useChatSocket() {
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        const token = apiClient.getAccessToken();
        if (!token) return;

        const socket = io(`${SOCKET_URL}/chat`, {
            auth: { token },
            transports: ['websocket'],
        });
        socketRef.current = socket;

        return () => {
            socket.disconnect();
        };
    }, []);

    const joinRoom = useCallback((roomId: string) => {
        socketRef.current?.emit('join_room', { roomId });
    }, []);

    const sendMessage = useCallback((roomId: string, content: string, type = 'TEXT') => {
        socketRef.current?.emit('send_message', { roomId, content, type });
    }, []);

    const sendTyping = useCallback((roomId: string) => {
        socketRef.current?.emit('typing', { roomId });
    }, []);

    const markRead = useCallback((roomId: string, messageId: string) => {
        socketRef.current?.emit('mark_read', { roomId, messageId });
    }, []);

    const onNewMessage = useCallback((callback: (msg: ChatMessageEvent) => void) => {
        socketRef.current?.on('new_message', callback);
        return () => {
            socketRef.current?.off('new_message', callback);
        };
    }, []);

    const onTyping = useCallback((callback: (data: TypingEvent) => void) => {
        socketRef.current?.on('user_typing', callback);
        return () => {
            socketRef.current?.off('user_typing', callback);
        };
    }, []);

    const onUserOnline = useCallback((callback: (data: { userId: string }) => void) => {
        socketRef.current?.on('user_online', callback);
        return () => {
            socketRef.current?.off('user_online', callback);
        };
    }, []);

    const onUserOffline = useCallback((callback: (data: { userId: string }) => void) => {
        socketRef.current?.on('user_offline', callback);
        return () => {
            socketRef.current?.off('user_offline', callback);
        };
    }, []);

    return {
        joinRoom,
        sendMessage,
        sendTyping,
        markRead,
        onNewMessage,
        onTyping,
        onUserOnline,
        onUserOffline,
        socket: socketRef.current,
    };
}
