'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function useKycQueue() {
  return useQuery({
    queryKey: ['COMPLIANCE', 'kyc-queue'],
    queryFn: () => apiClient.get('/compliance/kyc-queue'),
  });
}

export function useAmlScreening() {
  return useQuery({
    queryKey: ['COMPLIANCE', 'aml-screening'],
    queryFn: () => apiClient.get('/compliance/aml-screening'),
  });
}

export function useNicDeadlines() {
  return useQuery({
    queryKey: ['COMPLIANCE', 'nic-deadlines'],
    queryFn: () => apiClient.get('/compliance/nic-deadlines'),
  });
}

export function useComplianceSummary() {
  return useQuery({
    queryKey: ['COMPLIANCE', 'summary'],
    queryFn: () => apiClient.get('/compliance/summary'),
  });
}

export function usePepSearch() {
  return useMutation({
    mutationFn: (name: string) =>
      apiClient.post<{ result: 'clean' | 'match'; matches: Array<{ id: string; name: string; clientNumber: string; isPep: boolean; amlRiskLevel: string; source: string }> }>('/compliance/pep-search', { name }),
  });
}
