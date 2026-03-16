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

export function useDeleteTask() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => apiClient.delete(`/tasks/${id}`),
        onMutate: async (deletedId) => {
            // Cancel any outgoing refetches so they don't overwrite our optimistic update
            await qc.cancelQueries({ queryKey: ['tasks'] });
            
            // Snapshot previous value
            const previousTasks = qc.getQueryData(['tasks']);
            
            // Optimistically update to the new value by removing the task across all queries
            qc.setQueriesData({ queryKey: ['tasks'] }, (old: any) => {
                if (!old) return old;
                // If the cache is a paginated response (has items array)
                if (old.items && Array.isArray(old.items)) {
                    return { ...old, items: old.items.filter((t: any) => t.id !== deletedId) };
                }
                // If the cache is directly an array
                if (Array.isArray(old)) {
                    return old.filter((t: any) => t.id !== deletedId);
                }
                return old;
            });

            return { previousTasks };
        },
        onError: (_err, _deletedId, context) => {
            if (context?.previousTasks) {
                qc.setQueryData(['tasks'], context.previousTasks);
            }
        },
        onSettled: () => {
             qc.invalidateQueries({ queryKey: ['tasks'] });
        },
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
        onMutate: async ({ id, data }) => {
            await qc.cancelQueries({ queryKey: ['tasks'] });
            const previousTasks = qc.getQueryData(['tasks']);
            
            qc.setQueriesData({ queryKey: ['tasks'] }, (old: any) => {
                if (!old) return old;
                if (old.items && Array.isArray(old.items)) {
                    return { ...old, items: old.items.map((t: any) => t.id === id ? { ...t, ...data } : t) };
                }
                if (Array.isArray(old)) {
                    return old.map((t: any) => t.id === id ? { ...t, ...data } : t);
                }
                return old;
            });
            return { previousTasks };
        },
        onError: (_err, _vars, context) => {
            if (context?.previousTasks) {
                qc.setQueryData(['tasks'], context.previousTasks);
            }
        },
        onSettled: () => {
            qc.invalidateQueries({ queryKey: ['tasks'] });
        },
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
