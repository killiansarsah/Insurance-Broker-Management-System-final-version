'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { PaginatedResponse } from '@/types/api';

interface ApprovalData { id: string; status: string; type: string;[key: string]: unknown; }

export function useApprovals(params?: Record<string, unknown>) {
    return useQuery({
        queryKey: ['approvals', params],
        queryFn: () => apiClient.get<PaginatedResponse<ApprovalData>>('/approvals', params),
    });
}

export function useMyApprovalRequests(params?: Record<string, unknown>) {
    return useQuery({
        queryKey: ['approvals', 'mine', params],
        queryFn: () => apiClient.get<PaginatedResponse<ApprovalData>>('/approvals/my-requests', params),
    });
}

export function useApproveRequest() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, comment }: { id: string; comment?: string }) =>
            apiClient.patch(`/approvals/${id}/approve`, { comment }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['approvals'] }),
    });
}

export function useRejectRequest() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, reason }: { id: string; reason: string }) =>
            apiClient.patch(`/approvals/${id}/reject`, { reason }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['approvals'] }),
    });
}
