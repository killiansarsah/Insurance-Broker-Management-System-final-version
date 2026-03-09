'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth-store';
import type { PaginatedResponse } from '@/types/api';

interface TaskData { id: string; title: string; status: string;[key: string]: unknown; }

export function useTasks(params?: Record<string, unknown>) {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    return useQuery({
        queryKey: ['tasks', params],
        queryFn: () => apiClient.get<PaginatedResponse<TaskData>>('/tasks', params),
        enabled: isAuthenticated,
    });
}

export function useMyTasks(params?: Record<string, unknown>) {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    return useQuery({
        queryKey: ['tasks', 'my', params],
        queryFn: () => apiClient.get<TaskData[]>('/tasks/my', params),
        enabled: isAuthenticated,
    });
}

export function useTask(id: string) {
    return useQuery({
        queryKey: ['tasks', id],
        queryFn: () => apiClient.get<TaskData>(`/tasks/${id}`),
        enabled: !!id,
    });
}

export function useCreateTask() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: Record<string, unknown>) => apiClient.post<TaskData>('/tasks', data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
    });
}

export function useUpdateTask() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
            apiClient.patch<TaskData>(`/tasks/${id}`, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
    });
}

export function useChangeTaskStatus() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            apiClient.patch(`/tasks/${id}/status`, { status }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
    });
}
