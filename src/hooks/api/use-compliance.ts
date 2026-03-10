'use client';

import { useQuery } from '@tanstack/react-query';
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
