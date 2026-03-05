'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { PaginatedResponse } from '@/types/api';

interface CarrierData {
    id: string;
    name: string;
    code: string;
    [key: string]: unknown;
}

interface ProductData {
    id: string;
    name: string;
    carrierId: string;
    [key: string]: unknown;
}

export function useCarriers(params?: Record<string, unknown>) {
    return useQuery({
        queryKey: ['carriers', params],
        queryFn: () => apiClient.get<PaginatedResponse<CarrierData>>('/carriers', params),
    });
}

export function useCarrier(id: string) {
    return useQuery({
        queryKey: ['carriers', id],
        queryFn: () => apiClient.get<CarrierData>(`/carriers/${id}`),
        enabled: !!id,
    });
}

export function useCreateCarrier() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: Record<string, unknown>) => apiClient.post<CarrierData>('/carriers', data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['carriers'] }),
    });
}

export function useUpdateCarrier() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
            apiClient.patch<CarrierData>(`/carriers/${id}`, data),
        onSuccess: (_, vars) => {
            qc.invalidateQueries({ queryKey: ['carriers'] });
            qc.invalidateQueries({ queryKey: ['carriers', vars.id] });
        },
    });
}

export function useCarrierProducts(carrierId: string, params?: Record<string, unknown>) {
    return useQuery({
        queryKey: ['carriers', carrierId, 'products', params],
        queryFn: () => apiClient.get<PaginatedResponse<ProductData>>(`/carriers/${carrierId}/products`, params),
        enabled: !!carrierId,
    });
}

export function useCreateCarrierProduct() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ carrierId, data }: { carrierId: string; data: Record<string, unknown> }) =>
            apiClient.post(`/carriers/${carrierId}/products`, data),
        onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ['carriers', vars.carrierId, 'products'] }),
    });
}

export function useUpdateCarrierProduct() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ carrierId, id, data }: { carrierId: string; id: string; data: Record<string, unknown> }) =>
            apiClient.patch(`/carriers/${carrierId}/products/${id}`, data),
        onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ['carriers', vars.carrierId, 'products'] }),
    });
}
