import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function useCarriers() {
  return useQuery({
    queryKey: ['carriers'],
    queryFn: () => apiClient.get('/api/v1/carriers'),
  });
}

export function useCarrier(id: string) {
  return useQuery({
    queryKey: ['carriers', id],
    queryFn: () => apiClient.get(`/api/v1/carriers/${id}`),
    enabled: !!id,
  });
}

export function useCarrierProducts(carrierId: string) {
  return useQuery({
    queryKey: ['carriers', carrierId, 'products'],
    queryFn: () => apiClient.get(`/api/v1/carriers/${carrierId}/products`),
    enabled: !!carrierId,
  });
}

export function useCreateCarrier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiClient.post('/api/v1/carriers', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carriers'] });
    },
  });
}
