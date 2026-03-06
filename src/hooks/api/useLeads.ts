import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { Lead } from '@/types';

export function useLeads(params?: { stage?: string; search?: string }) {
  return useQuery({
    queryKey: ['leads', params],
    queryFn: () => apiClient.get<{ data: Lead[]; total: number }>('/leads', params),
  });
}

export function useLead(id: string) {
  return useQuery({
    queryKey: ['leads', id],
    queryFn: () => apiClient.get<Lead>(`/leads/${id}`),
    enabled: !!id,
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Lead>) => apiClient.post<Lead>('/leads', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
}

export function useUpdateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Lead> }) =>
      apiClient.patch<Lead>(`/leads/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['leads', variables.id] });
    },
  });
}

export function useConvertLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.post(`/leads/${id}/convert`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}
