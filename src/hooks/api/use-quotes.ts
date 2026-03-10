'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface QuoteQuery {
    page?: number;
    limit?: number;
    status?: string;
    insuranceType?: string;
    clientId?: string;
    dateFrom?: string;
    dateTo?: string;
}

export function useQuotes(params?: QuoteQuery) {
    return useQuery({
        queryKey: ['quotes', params],
        queryFn: () => apiClient.get('/quotes', params as Record<string, unknown>),
    });
}

export function useQuote(id: string) {
    return useQuery({
        queryKey: ['quotes', id],
        queryFn: () => apiClient.get(`/quotes/${id}`),
        enabled: !!id,
    });
}

export function useCreateQuote() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: Record<string, unknown>) => apiClient.post('/quotes', data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['quotes'] }),
    });
}

export function useUpdateQuote() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...data }: { id: string; [key: string]: unknown }) =>
            apiClient.patch(`/quotes/${id}`, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['quotes'] }),
    });
}

export function useSendQuote() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => apiClient.post(`/quotes/${id}/send`),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['quotes'] }),
    });
}

export function useAcceptQuote() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => apiClient.post(`/quotes/${id}/accept`),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['quotes'] }),
    });
}

export function useDeclineQuote() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => apiClient.post(`/quotes/${id}/decline`),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['quotes'] }),
    });
}

export function useDeleteQuote() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => apiClient.delete(`/quotes/${id}`),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['quotes'] }),
    });
}
