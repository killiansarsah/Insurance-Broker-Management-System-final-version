import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { Policy } from '@/types';

export function usePolicies(params?: { status?: string; search?: string }) {
  return useQuery({
    queryKey: ['policies', params],
    queryFn: () => apiClient.get<{ data: Policy[]; total: number }>('/api/v1/policies', params),
  });
}

export function usePolicy(id: string) {
  return useQuery({
    queryKey: ['policies', id],
    queryFn: () => apiClient.get<Policy>(`/api/v1/policies/${id}`),
    enabled: !!id,
  });
}

export function useCreatePolicy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Policy>) => apiClient.post<Policy>('/api/v1/policies', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
    },
  });
}

export function useUpdatePolicy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Policy> }) =>
      apiClient.patch<Policy>(`/api/v1/policies/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
      queryClient.invalidateQueries({ queryKey: ['policies', variables.id] });
    },
  });
}

export function useBindPolicy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.post(`/api/v1/policies/${id}/bind`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
    },
  });
}
