'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { PaginatedResponse } from '@/types/api';

interface ClaimData {
    id: string;
    claimNumber: string;
    status: string;
    claimAmount: number;
    [key: string]: unknown;
}

export function useClaims(params?: Record<string, unknown>) {
    return useQuery({
        queryKey: ['claims', params],
        queryFn: () => apiClient.get<PaginatedResponse<ClaimData>>('/claims', params),
    });
}

export function useClaim(id: string) {
    return useQuery({
        queryKey: ['claims', id],
        queryFn: () => apiClient.get<ClaimData>(`/claims/${id}`),
        enabled: !!id,
    });
}

export function useCreateClaim() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: Record<string, unknown>) => apiClient.post<ClaimData>('/claims', data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['claims'] }),
    });
}

export function useUpdateClaim() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
            apiClient.patch<ClaimData>(`/claims/${id}`, data),
        onSuccess: (_, vars) => {
            qc.invalidateQueries({ queryKey: ['claims'] });
            qc.invalidateQueries({ queryKey: ['claims', vars.id] });
        },
    });
}

export function useAcknowledgeClaim() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
            apiClient.post(`/claims/${id}/acknowledge`, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['claims'] }),
    });
}

export function useInvestigateClaim() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
            apiClient.post(`/claims/${id}/investigate`, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['claims'] }),
    });
}

export function useApproveClaim() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => apiClient.post(`/claims/${id}/approve`),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['claims'] }),
    });
}

export function useRejectClaim() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, reason }: { id: string; reason: string }) =>
            apiClient.post(`/claims/${id}/reject`, { reason }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['claims'] }),
    });
}

export function useSettleClaim() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
            apiClient.post(`/claims/${id}/settle`, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['claims'] }),
    });
}

export function useReopenClaim() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, reason }: { id: string; reason: string }) =>
            apiClient.post(`/claims/${id}/reopen`, { reason }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['claims'] }),
    });
}

export function useClaimDocuments(claimId: string) {
    return useQuery({
        queryKey: ['claims', claimId, 'documents'],
        queryFn: () => apiClient.get(`/claims/${claimId}/documents`),
        enabled: !!claimId,
    });
}

export function useAddClaimDocument() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ claimId, data }: { claimId: string; data: Record<string, unknown> }) =>
            apiClient.post(`/claims/${claimId}/documents`, data),
        onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ['claims', vars.claimId, 'documents'] }),
    });
}
