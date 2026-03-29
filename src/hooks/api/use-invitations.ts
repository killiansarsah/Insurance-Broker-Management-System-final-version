'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

import { UserRole } from '@/types';

export function useCreateInvitation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: { email: string; role: UserRole; branchId?: string }) =>
            apiClient.post('/invitations', data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
    });
}
