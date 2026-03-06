import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { Client } from '@/types';

export function useClients(params?: { search?: string; type?: string }) {
  return useQuery({
    queryKey: ['clients', params],
    queryFn: () => apiClient.get<{ data: Client[]; total: number }>('/clients', params),
  });
}

export function useClient(id: string) {
  return useQuery({
    queryKey: ['clients', id],
    queryFn: () => apiClient.get<Client>(`/clients/${id}`),
    enabled: !!id,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Client>) => apiClient.post<Client>('/clients', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Client> }) =>
      apiClient.patch<Client>(`/clients/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['clients', variables.id] });
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/clients/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}
