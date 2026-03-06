import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function useCarriers() {
  return useQuery({
    queryKey: ['carriers'],
    queryFn: () => apiClient.get('/carriers'),
  });
}

export function useCarrier(id: string) {
  return useQuery({
    queryKey: ['carriers', id],
    queryFn: () => apiClient.get(`/carriers/${id}`),
    enabled: !!id,
  });
}

export function useCarrierProducts(carrierId: string) {
  return useQuery({
    queryKey: ['carriers', carrierId, 'products'],
    queryFn: () => apiClient.get(`/carriers/${carrierId}/products`),
    enabled: !!carrierId,
  });
}

export function useCreateCarrier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiClient.post('/carriers', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carriers'] });
    },
  });
}
