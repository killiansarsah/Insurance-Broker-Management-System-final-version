import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function useInvoices(params?: { status?: string }) {
  return useQuery({
    queryKey: ['invoices', params],
    queryFn: () => apiClient.get('/invoices', params),
  });
}

export function useTransactions(params?: { type?: string }) {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => apiClient.get('/transactions', params),
  });
}

export function useCommissions() {
  return useQuery({
    queryKey: ['commissions'],
    queryFn: () => apiClient.get('/commissions'),
  });
}

export function useExpenses() {
  return useQuery({
    queryKey: ['expenses'],
    queryFn: () => apiClient.get('/expenses'),
  });
}

export function useFinanceDashboard() {
  return useQuery({
    queryKey: ['finance', 'dashboard'],
    queryFn: () => apiClient.get('/finance/dashboard'),
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiClient.post('/invoices', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiClient.post('/transactions', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}
