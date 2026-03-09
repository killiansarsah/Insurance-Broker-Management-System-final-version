'use client';

import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth-store';

interface LoginPayload {
    email: string;
    password: string;
    tenantSlug?: string;
}

interface RegisterPayload {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    tenantSlug?: string;
}

interface AcceptInvitePayload {
    token: string;
    firstName: string;
    lastName: string;
    password: string;
}

interface AuthResponse {
    accessToken: string;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
        tenantId: string;
    };
}

export function useLogin() {
    const { login } = useAuthStore.getState();
    return useMutation({
        mutationFn: async (payload: LoginPayload) => {
            await login(payload.email, payload.password, payload.tenantSlug);
        },
    });
}

export function useRegister() {
    return useMutation({
        mutationFn: (data: RegisterPayload) =>
            apiClient.post<AuthResponse>('/auth/register', data),
    });
}

export function useAcceptInvite() {
    return useMutation({
        mutationFn: (data: AcceptInvitePayload) =>
            apiClient.post<AuthResponse>('/invitations/accept', data),
    });
}

export function useRefreshToken() {
    return useMutation({
        mutationFn: () =>
            apiClient.post<{ accessToken: string }>('/auth/refresh'),
    });
}

export function useLogout() {
    const { logout } = useAuthStore.getState();
    return useMutation({
        mutationFn: async () => {
            await logout();
        },
    });
}

export function useValidateInvite(token: string) {
    return useMutation({
        mutationFn: () =>
            apiClient.get<{ email: string; role: string; tenantName: string }>(
                `/invitations/validate/${token}`,
            ),
    });
}
