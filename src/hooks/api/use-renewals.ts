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
    renewalStatus: 'URGENT' | 'UPCOMING';
    client: {
        id: string;
        companyName: string | null;
        firstName: string;
        lastName: string;
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

export function useRenewPolicy() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: { premiumAmount: number; sumInsured?: number; notes?: string } }) =>
            apiClient.post(`/renewals/${id}/renew`, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['renewals'] });
            qc.invalidateQueries({ queryKey: ['policies'] });
        },
    });
}
