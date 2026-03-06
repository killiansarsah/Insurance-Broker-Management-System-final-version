import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { Claim } from '@/types';

export function useClaims(params?: { status?: string; search?: string }) {
  return useQuery({
    queryKey: ['claims', params],
    queryFn: () => apiClient.get<{ data: Claim[]; total: number }>('/claims', params),
  });
}

export function useClaim(id: string) {
  return useQuery({
    queryKey: ['claims', id],
    queryFn: () => apiClient.get<Claim>(`/claims/${id}`),
    enabled: !!id,
  });
}

export function useCreateClaim() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Claim>) => apiClient.post<Claim>('/claims', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
    },
  });
}

export function useUpdateClaim() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Claim> }) =>
      apiClient.patch<Claim>(`/claims/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
      queryClient.invalidateQueries({ queryKey: ['claims', variables.id] });
    },
  });
}

export function useAcknowledgeClaim() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.post(`/claims/${id}/acknowledge`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
    },
  });
}
