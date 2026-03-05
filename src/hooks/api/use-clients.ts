'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { PaginatedResponse } from '@/types/api';

interface ClientData {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    type: string;
    kycStatus: string;
    amlRiskLevel: string;
    [key: string]: unknown;
}

export function useClients(params?: Record<string, unknown>) {
    return useQuery({
        queryKey: ['clients', params],
        queryFn: () => apiClient.get<PaginatedResponse<ClientData>>('/clients', params),
    });
}

export function useClient(id: string) {
    return useQuery({
        queryKey: ['clients', id],
        queryFn: () => apiClient.get<ClientData>(`/clients/${id}`),
        enabled: !!id,
    });
}

export function useCreateClient() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: Record<string, unknown>) => apiClient.post<ClientData>('/clients', data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
    });
}

export function useUpdateClient() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
            apiClient.patch<ClientData>(`/clients/${id}`, data),
        onSuccess: (_, vars) => {
            qc.invalidateQueries({ queryKey: ['clients'] });
            qc.invalidateQueries({ queryKey: ['clients', vars.id] });
        },
    });
}

export function useDeleteClient() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => apiClient.delete(`/clients/${id}`),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
    });
}

export function useUpdateKyc() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
            apiClient.patch(`/clients/${id}/kyc`, data),
        onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ['clients', vars.id] }),
    });
}

export function useUpdateAml() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
            apiClient.patch(`/clients/${id}/aml`, data),
        onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ['clients', vars.id] }),
    });
}

export function useBeneficiaries(clientId: string) {
    return useQuery({
        queryKey: ['clients', clientId, 'beneficiaries'],
        queryFn: () => apiClient.get(`/clients/${clientId}/beneficiaries`),
        enabled: !!clientId,
    });
}

export function useNextOfKin(clientId: string) {
    return useQuery({
        queryKey: ['clients', clientId, 'next-of-kin'],
        queryFn: () => apiClient.get(`/clients/${clientId}/next-of-kin`),
        enabled: !!clientId,
    });
}

export function useBankDetails(clientId: string) {
    return useQuery({
        queryKey: ['clients', clientId, 'bank-details'],
        queryFn: () => apiClient.get(`/clients/${clientId}/bank-details`),
        enabled: !!clientId,
    });
}
