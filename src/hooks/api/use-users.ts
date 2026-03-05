'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { PaginatedResponse } from '@/types/api';

interface UserData { id: string; email: string; firstName: string; lastName: string; role: string;[key: string]: unknown; }

export function useUsers(params?: Record<string, unknown>) {
    return useQuery({
        queryKey: ['users', params],
        queryFn: () => apiClient.get<PaginatedResponse<UserData>>('/users', params),
    });
}

export function useUser(id: string) {
    return useQuery({
        queryKey: ['users', id],
        queryFn: () => apiClient.get<UserData>(`/users/${id}`),
        enabled: !!id,
    });
}

export function useUpdateUser() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
            apiClient.patch<UserData>(`/users/${id}`, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
    });
}

export function useDeactivateUser() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => apiClient.post(`/users/${id}/deactivate`),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
    });
}

export function useReactivateUser() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => apiClient.post(`/users/${id}/reactivate`),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
    });
}

export function useAssignDepartment() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, departmentId }: { id: string; departmentId: string | null }) =>
            apiClient.patch(`/users/${id}/department`, { departmentId }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['users'] });
            qc.invalidateQueries({ queryKey: ['departments'] });
        },
    });
}
