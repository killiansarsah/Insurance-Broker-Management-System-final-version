'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

type UserRole = 'ADMIN' | 'TENANT_ADMIN' | 'BROKER' | 'VIEWER';

export function useCreateInvitation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: { email: string; role: UserRole; branchId?: string }) =>
            apiClient.post('/invitations', data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
    });
}
