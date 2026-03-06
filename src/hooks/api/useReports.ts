import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function useDashboardReport(params?: { startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: ['reports', 'dashboard', params],
    queryFn: () => apiClient.get('/reports/dashboard', params),
  });
}

export function useProductionReport(params?: { startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: ['reports', 'production', params],
    queryFn: () => apiClient.get('/reports/production', params),
  });
}

export function useClaimsReport(params?: { startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: ['reports', 'claims', params],
    queryFn: () => apiClient.get('/reports/claims', params),
  });
}

export function useFinancialReport(params?: { startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: ['reports', 'financial', params],
    queryFn: () => apiClient.get('/reports/financial', params),
  });
}
