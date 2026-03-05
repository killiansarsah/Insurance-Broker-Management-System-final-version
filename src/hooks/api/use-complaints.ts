'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { PaginatedResponse } from '@/types/api';

interface ComplaintData {
    id: string;
    status: string;
    priority: string;
    [key: string]: unknown;
}

export function useComplaints(params?: Record<string, unknown>) {
    return useQuery({
        queryKey: ['complaints', params],
        queryFn: () => apiClient.get<PaginatedResponse<ComplaintData>>('/complaints', params),
    });
}

export function useComplaint(id: string) {
    return useQuery({
        queryKey: ['complaints', id],
        queryFn: () => apiClient.get<ComplaintData>(`/complaints/${id}`),
        enabled: !!id,
    });
}

export function useCreateComplaint() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: Record<string, unknown>) => apiClient.post<ComplaintData>('/complaints', data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['complaints'] }),
    });
}

export function useUpdateComplaint() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
            apiClient.patch<ComplaintData>(`/complaints/${id}`, data),
        onSuccess: (_, vars) => {
            qc.invalidateQueries({ queryKey: ['complaints'] });
            qc.invalidateQueries({ queryKey: ['complaints', vars.id] });
        },
    });
}

export function useAssignComplaint() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, assigneeId }: { id: string; assigneeId: string }) =>
            apiClient.post(`/complaints/${id}/assign`, { assigneeId }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['complaints'] }),
    });
}

export function useEscalateComplaint() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, reason }: { id: string; reason: string }) =>
            apiClient.post(`/complaints/${id}/escalate`, { reason }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['complaints'] }),
    });
}

export function useResolveComplaint() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, resolution }: { id: string; resolution: string }) =>
            apiClient.post(`/complaints/${id}/resolve`, { resolution }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['complaints'] }),
    });
}

export function useCloseComplaint() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => apiClient.post(`/complaints/${id}/close`),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['complaints'] }),
    });
}
