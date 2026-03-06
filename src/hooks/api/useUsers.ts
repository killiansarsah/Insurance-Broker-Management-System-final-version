import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => apiClient.get('/users'),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => apiClient.get(`/users/${id}`),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiClient.post('/invitations', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiClient.patch(`/users/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
