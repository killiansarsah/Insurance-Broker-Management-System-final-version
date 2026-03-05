'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface DashboardReport { overview: Record<string, unknown>; policyMix: unknown[]; monthlyTrend: unknown[];[key: string]: unknown; }

export function useDashboardReport(params?: Record<string, unknown>) {
    return useQuery({
        queryKey: ['reports', 'dashboard', params],
        queryFn: () => apiClient.get<DashboardReport>('/reports/dashboard', params),
    });
}

export function useProductionReport(params: { from: string; to: string; groupBy?: string }) {
    return useQuery({
        queryKey: ['reports', 'production', params],
        queryFn: () => apiClient.get('/reports/production', params),
        enabled: !!params.from && !!params.to,
    });
}

export function useClaimsReport(params: { from: string; to: string }) {
    return useQuery({
        queryKey: ['reports', 'claims', params],
        queryFn: () => apiClient.get('/reports/claims', params),
        enabled: !!params.from && !!params.to,
    });
}

export function useRenewalsReport(params: { from: string; to: string }) {
    return useQuery({
        queryKey: ['reports', 'renewals', params],
        queryFn: () => apiClient.get('/reports/renewals', params),
        enabled: !!params.from && !!params.to,
    });
}

export function useFinancialReport(params: { from: string; to: string }) {
    return useQuery({
        queryKey: ['reports', 'financial', params],
        queryFn: () => apiClient.get('/reports/financial', params),
        enabled: !!params.from && !!params.to,
    });
}

export function useComplianceReport() {
    return useQuery({
        queryKey: ['reports', 'compliance'],
        queryFn: () => apiClient.get('/reports/compliance'),
    });
}
