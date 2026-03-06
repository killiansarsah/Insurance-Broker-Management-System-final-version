'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface ChatRoom { id: string; name: string; type: string; unreadCount: number;[key: string]: unknown; }
interface ChatMessage { id: string; content: string; senderId: string;[key: string]: unknown; }

export function useChatRooms() {
    return useQuery({
        queryKey: ['chat', 'rooms'],
        queryFn: () => apiClient.get<ChatRoom[]>('/chat/rooms'),
        refetchInterval: 10_000,
    });
}

export function useChatMessages(roomId: string, params?: Record<string, unknown>) {
    return useQuery({
        queryKey: ['chat', 'messages', roomId, params],
        queryFn: () => apiClient.get<ChatMessage[]>(`/chat/rooms/${roomId}/messages`, params),
        enabled: !!roomId,
    });
}

export function useCreateChatRoom() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: Record<string, unknown>) => apiClient.post<ChatRoom>('/chat/rooms', data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['chat', 'rooms'] }),
    });
}

export function useAddChatParticipant() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ roomId, userId }: { roomId: string; userId: string }) =>
            apiClient.post(`/chat/rooms/${roomId}/participants`, { userId }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['chat'] }),
    });
}

export function useRemoveChatParticipant() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ roomId, userId }: { roomId: string; userId: string }) =>
            apiClient.delete(`/chat/rooms/${roomId}/participants/${userId}`),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['chat'] }),
    });
}

export function useSendChatMessage() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ roomId, data }: { roomId: string; data: Record<string, unknown> }) =>
            apiClient.post<ChatMessage>(`/chat/rooms/${roomId}/messages`, data),
        onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ['chat', 'messages', vars.roomId] }),
    });
}
