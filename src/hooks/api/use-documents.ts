'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { PaginatedResponse } from '@/types/api';

interface DocumentData { id: string; name: string;[key: string]: unknown; }

export function useDocuments(params?: Record<string, unknown>) {
    return useQuery({
        queryKey: ['documents', params],
        queryFn: () => apiClient.get<PaginatedResponse<DocumentData>>('/documents', params),
    });
}

export function useDocument(id: string) {
    return useQuery({
        queryKey: ['documents', id],
        queryFn: () => apiClient.get<DocumentData>(`/documents/${id}`),
        enabled: !!id,
    });
}

export function useCreateDocument() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: Record<string, unknown>) => apiClient.post<DocumentData>('/documents', data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['documents'] }),
    });
}

export function useUpdateDocument() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
            apiClient.patch<DocumentData>(`/documents/${id}`, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['documents'] }),
    });
}

export function useDeleteDocument() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => apiClient.delete(`/documents/${id}`),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['documents'] }),
    });
}
