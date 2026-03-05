'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface TenantSettings { [key: string]: unknown; }
interface UserProfile { id: string; firstName: string; lastName: string; email: string;[key: string]: unknown; }

export function useTenantSettings() {
    return useQuery({
        queryKey: ['settings', 'tenant'],
        queryFn: () => apiClient.get<TenantSettings>('/settings/tenant'),
    });
}

export function useUpdateTenantSettings() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: Record<string, unknown>) => apiClient.patch<TenantSettings>('/settings/tenant', data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['settings', 'tenant'] }),
    });
}

export function useProfile() {
    return useQuery({
        queryKey: ['settings', 'profile'],
        queryFn: () => apiClient.get<UserProfile>('/settings/profile'),
    });
}

export function useUpdateProfile() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: Record<string, unknown>) => apiClient.patch<UserProfile>('/settings/profile', data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['settings', 'profile'] }),
    });
}

export function useChangePassword() {
    return useMutation({
        mutationFn: (data: { currentPassword: string; newPassword: string; confirmPassword: string }) =>
            apiClient.post('/settings/change-password', data),
    });
}
