'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface SystemTaxRule {
    id: string;
    name: string;
    code: string;
    rate: number | string;
    type: 'PERCENTAGE' | 'FLAT_FEE';
    isCascading: boolean;
    calculationOrder: number;
    applicableTo: string[];
    effectiveFrom: string;
    effectiveTo: string | null;
    tenantId: string | null;
    status: 'ACTIVE' | 'ARCHIVED';
}

export function useTaxRules(params?: { status?: string }) {
    return useQuery({
        queryKey: ['super-admin', 'tax-rules', params],
        queryFn: async () => {
            const res = await apiClient.get<{ data: SystemTaxRule[] }>('/platform-admin/tax-rules', params);
            return res.data;
        },
    });
}

export function useCreateTaxRule() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (data: Partial<SystemTaxRule>) => {
            const res = await apiClient.post<{ data: SystemTaxRule }>('/platform-admin/tax-rules', data);
            return res.data;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['super-admin', 'tax-rules'] }),
    });
}

export function useUpdateTaxRule() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<SystemTaxRule> }) => {
            const res = await apiClient.patch<{ data: SystemTaxRule }>(`/platform-admin/tax-rules/${id}`, data);
            return res.data;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['super-admin', 'tax-rules'] }),
    });
}

export function usePreviewTaxCalculation() {
    return useMutation({
        mutationFn: async (data: { insuranceType: string; basePremium: number; effectiveDate?: string }) => {
            const res = await apiClient.get<any>('/platform-admin/tax-rules/preview', data as any);
            return res.data;
        },
    });
}
