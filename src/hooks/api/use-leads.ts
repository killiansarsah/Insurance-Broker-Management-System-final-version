'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { PaginatedResponse } from '@/types/api';

interface LeadData { id: string; status: string; stage: string;[key: string]: unknown; }

export function useLeads(params?: Record<string, unknown>) {
    return useQuery({
        queryKey: ['leads', params],
        queryFn: () => apiClient.get<PaginatedResponse<LeadData>>('/leads', params),
    });
}

export function useLeadsKanban() {
    return useQuery({
        queryKey: ['leads', 'kanban'],
        queryFn: () => apiClient.get('/leads/kanban'),
    });
}

export function useLead(id: string) {
    return useQuery({
        queryKey: ['leads', id],
        queryFn: () => apiClient.get<LeadData>(`/leads/${id}`),
        enabled: !!id,
    });
}

export function useCreateLead() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: Record<string, unknown>) => apiClient.post<LeadData>('/leads', data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
    });
}

export function useUpdateLead() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
            apiClient.patch<LeadData>(`/leads/${id}`, data),
        onSuccess: (_, vars) => {
            qc.invalidateQueries({ queryKey: ['leads'] });
            qc.invalidateQueries({ queryKey: ['leads', vars.id] });
        },
    });
}

export function useChangeLeadStage() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, stage }: { id: string; stage: string }) =>
            apiClient.patch(`/leads/${id}/stage`, { stage }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
    });
}

export function useConvertLead() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => apiClient.post(`/leads/${id}/convert`),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['leads'] });
            qc.invalidateQueries({ queryKey: ['clients'] });
        },
    });
}
