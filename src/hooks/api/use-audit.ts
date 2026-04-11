'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface AuditQuery {
  page?: number;
  limit?: number;
  action?: string;
  entity?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  hidePlatformActions?: boolean;
}

export function useAuditLog(params?: AuditQuery) {
  return useQuery({
    queryKey: ['audit', params],
    queryFn: () => apiClient.get('/audit', params as Record<string, unknown>),
  });
}
