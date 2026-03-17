'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface TenantSettings { [key: string]: unknown; }
interface UserProfile { id: string; firstName: string; lastName: string; email: string;[key: string]: unknown; }

export function useTenantSettings() {
    return useQuery({
        queryKey: ['settings', 'tenant'],
        queryFn: () => apiClient.get<TenantSettings>('/settings'),
    });
}

export function useUpdateTenantSettings() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: Record<string, unknown>) => apiClient.patch<TenantSettings>('/settings', data),
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

export function useUploadAvatar() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (file: File) =>
            apiClient.upload<{ id: string; avatarUrl: string }>('/settings/upload-avatar', file),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['settings', 'profile'] }),
    });
}

export function useUploadLogo() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (file: File) =>
            apiClient.upload<{ id: string; logoUrl: string }>('/settings/upload-logo', file),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['settings', 'tenant'] }),
    });
}

// ─── TWO-FACTOR AUTHENTICATION ──────────────────────
export function useGenerate2FASecret() {
    return useMutation({
        mutationFn: () =>
            apiClient.post<{ secret: string; qrCodeDataUrl: string }>('/auth/2fa/generate'),
    });
}

export function useEnable2FA() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (token: string) =>
            apiClient.post<{ message: string }>('/auth/2fa/enable', { token }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['settings', 'profile'] }),
    });
}

export function useDisable2FA() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (token: string) =>
            apiClient.post<{ message: string }>('/auth/2fa/disable', { token }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['settings', 'profile'] }),
    });
}
