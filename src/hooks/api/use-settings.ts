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

// ─── TAX CONFIG (Dynamic Tax Engine) ────────────────
export interface TaxRule {
    id: string;
    name: string;
    code: string;
    rate: string; // Decimal comes as string from API
    type: string;
    isCascading: boolean;
    calculationOrder: number;
    applicableTo: string[];
    effectiveFrom: string;
    effectiveTo: string | null;
}

export function useTaxConfig(insuranceType?: string) {
    return useQuery({
        queryKey: ['settings', 'tax-config', insuranceType],
        queryFn: () => apiClient.get<TaxRule[]>(
            `/settings/tax-config${insuranceType ? `?insuranceType=${insuranceType}` : ''}`
        ),
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });
}

/**
 * Calculate tax breakdown on the client side using fetched rules.
 * Mirrors the backend TaxEngineService logic.
 */
export function calculateTaxBreakdown(basePremium: number, rules: TaxRule[]) {
    const levies: { code: string; name: string; rate: number; amount: number }[] = [];
    const cascading: { code: string; name: string; rate: number; amount: number }[] = [];

    // Step 1: Non-cascading levies on base
    for (const rule of rules) {
        if (rule.isCascading) continue;
        const rate = parseFloat(rule.rate);
        const amount = rule.type === 'FLAT_FEE'
            ? rate
            : Math.round(basePremium * rate * 100) / 100;
        levies.push({ code: rule.code, name: rule.name, rate, amount });
    }

    const totalLevies = levies.reduce((sum, l) => sum + l.amount, 0);

    // Step 2: Cascading taxes on (base + levies)
    const cascadingBase = basePremium + totalLevies;
    for (const rule of rules) {
        if (!rule.isCascading) continue;
        const rate = parseFloat(rule.rate);
        const amount = rule.type === 'FLAT_FEE'
            ? rate
            : Math.round(cascadingBase * rate * 100) / 100;
        cascading.push({ code: rule.code, name: rule.name, rate, amount });
    }

    const totalCascading = cascading.reduce((sum, t) => sum + t.amount, 0);
    const totalTax = totalLevies + totalCascading;

    return {
        basePremium,
        levies,
        totalLevies,
        cascading,
        totalCascading,
        totalTax,
        grossPremium: basePremium + totalTax,
    };
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
