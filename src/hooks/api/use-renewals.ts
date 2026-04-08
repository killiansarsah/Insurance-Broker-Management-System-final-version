'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface RenewalPolicy {
    id: string;
    policyNumber: string;
    insuranceType: string;
    policyType: string;
    status: string;
    premiumAmount: number;
    sumInsured: number;
    commissionRate: number;
    commissionAmount: number;
    inceptionDate: string;
    expiryDate: string;
    daysUntilExpiry: number;
    renewalStatus: 'NOT_STARTED' | 'CONTACTED' | 'QUOTE_SENT' | 'NEGOTIATING' | 'CONFIRMED' | 'RENEWED' | 'DECLINED' | null;
    client: {
        id: string;
        companyName: string | null;
        firstName: string;
        lastName: string;
        phone: string | null;
        email: string | null;
    };
    product: { id: string; name: string } | null;
    carrier: { id: string; name: string } | null;
    [key: string]: unknown;
}

export function useRenewals(params?: { daysAhead?: number; insuranceType?: string; carrierId?: string }) {
    return useQuery({
        queryKey: ['renewals', params],
        queryFn: () => apiClient.get<RenewalPolicy[]>('/renewals/upcoming', params),
    });
}

export function useLapsedRenewals() {
    return useQuery({
        queryKey: ['renewals', 'lapsed'],
        queryFn: () => apiClient.get<RenewalPolicy[]>('/renewals/lapsed'),
    });
}

export function useRenewPolicy() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: { premiumAmount: number; sumInsured?: number; notes?: string } }) =>
            apiClient.post(`/policies/${id}/renew`, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['renewals'] });
            qc.invalidateQueries({ queryKey: ['policies'] });
        },
    });
}

export function useRenewalReport(days: number = 90) {
    return useQuery({
        queryKey: ['renewals', 'report', days],
        queryFn: () => apiClient.get<any>('/renewals/report', { days }),
    });
}
