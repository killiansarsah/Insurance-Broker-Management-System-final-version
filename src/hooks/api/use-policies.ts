'use client';

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { PaginatedResponse } from '@/types/api';

interface PolicyData {
    id: string;
    policyNumber: string;
    status: string;
    insuranceType: string;
    premiumAmount: number;
    [key: string]: unknown;
}

export function usePolicies(params?: Record<string, unknown>) {
    return useQuery({
        queryKey: ['policies', params],
        queryFn: () => apiClient.get<PaginatedResponse<PolicyData>>('/policies', params),
        placeholderData: keepPreviousData,
    });
}

export function usePolicyMetrics() {
    return useQuery({
        queryKey: ['policies', 'metrics'],
        queryFn: async () => {
            const res = await apiClient.get<any>('/policies/metrics');
            return res;
        },
        staleTime: 30_000,
    });
}


export function usePolicy(id: string) {
    return useQuery({
        queryKey: ['policies', id],
        queryFn: () => apiClient.get<PolicyData>(`/policies/${id}`),
        enabled: !!id,
    });
}

export function useCreatePolicy() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: Record<string, unknown>) => apiClient.post<PolicyData>('/policies', data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['policies'] }),
    });
}

export function useUpdatePolicy() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
            apiClient.patch<PolicyData>(`/policies/${id}`, data),
        onSuccess: (_, vars) => {
            qc.invalidateQueries({ queryKey: ['policies'] });
            qc.invalidateQueries({ queryKey: ['policies', vars.id] });
        },
    });
}

export function useBindPolicy() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => apiClient.post(`/policies/${id}/bind`),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['policies'] }),
    });
}

export function useCancelPolicy() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, reason, effectiveDate }: { id: string; reason: string; effectiveDate: string }) =>
            apiClient.post(`/policies/${id}/cancel`, { reason, effectiveDate }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['policies'] }),
    });
}

export function useLapsePolicy() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => apiClient.post(`/policies/${id}/lapse`),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['policies'] }),
    });
}

export function useReinstatePolicy() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
            apiClient.post(`/policies/${id}/reinstate`, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['policies'] }),
    });
}

export function useCreateEndorsement() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ policyId, data }: { policyId: string; data: Record<string, unknown> }) =>
            apiClient.post(`/policies/${policyId}/endorsements`, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['policies'] }),
    });
}

export function useApproveEndorsement() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ policyId, id }: { policyId: string; id: string }) =>
            apiClient.patch(`/policies/${policyId}/endorsements/${id}/approve`),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['policies'] }),
    });
}

export function useInstallments(policyId: string) {
    return useQuery({
        queryKey: ['policies', policyId, 'installments'],
        queryFn: () => apiClient.get(`/policies/${policyId}/installments`),
        enabled: !!policyId,
    });
}

export function usePayInstallment() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ policyId, id, data }: { policyId: string; id: string; data: Record<string, unknown> }) =>
            apiClient.patch(`/policies/${policyId}/installments/${id}/pay`, data),
        onSuccess: (_, vars) => {
            qc.invalidateQueries({ queryKey: ['policies'] });
            qc.invalidateQueries({ queryKey: ['policies', vars.policyId] });
        },
    });
}
