'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { PaginatedResponse } from '@/types/api';

interface RemittanceData {
    id: string;
    remittanceNumber: string;
    carrierId: string;
    policyId: string;
    premiumAmount: number;
    amountRemitted: number;
    status: string;
    remittanceDate?: string;
    paymentMethod?: string;
    reference?: string;
    notes?: string;
    [key: string]: unknown;
}

export function useRemittances(params?: Record<string, unknown>) {
    return useQuery({
        queryKey: ['remittances', params],
        queryFn: () => apiClient.get<PaginatedResponse<RemittanceData>>('/remittances', params),
    });
}

export function useRemittance(id: string) {
    return useQuery({
        queryKey: ['remittances', id],
        queryFn: () => apiClient.get<RemittanceData>(`/remittances/${id}`),
        enabled: !!id,
    });
}

export function useCreateRemittance() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: Record<string, unknown>) =>
            apiClient.post<RemittanceData>('/remittances', data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['remittances'] });
            qc.invalidateQueries({ queryKey: ['commissions'] });
        },
    });
}

export function useConfirmRemittance() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
            apiClient.post<RemittanceData>(`/remittances/${id}/confirm`, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['remittances'] });
            qc.invalidateQueries({ queryKey: ['commissions'] });
        },
    });
}
