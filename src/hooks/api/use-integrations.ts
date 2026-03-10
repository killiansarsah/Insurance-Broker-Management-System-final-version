'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface IntegrationRecord {
  id: string;
  tenantId: string;
  serviceKey: string;
  connected: boolean;
  connectedAt: string | null;
  connectedEmail: string | null;
  syncFrequency: string;
  lastSyncAt: string | null;
  config: Record<string, unknown>;
  credentials: Record<string, unknown>;
  syncEvents: Array<{
    id: string;
    type: string;
    message: string;
    timestamp: string;
    count?: number;
  }>;
}

export function useIntegrations() {
  return useQuery({
    queryKey: ['integrations'],
    queryFn: () => apiClient.get<IntegrationRecord[]>('/integrations'),
  });
}

export function useIntegration(serviceKey: string) {
  return useQuery({
    queryKey: ['integrations', serviceKey],
    queryFn: () => apiClient.get<IntegrationRecord>(`/integrations/${serviceKey}`),
    enabled: !!serviceKey,
  });
}

export function useConnectIntegration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { serviceKey: string; apiKey?: string; apiSecret?: string; connectedEmail?: string }) =>
      apiClient.post<IntegrationRecord>('/integrations/connect', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['integrations'] }),
  });
}

export function useDisconnectIntegration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (serviceKey: string) =>
      apiClient.post<IntegrationRecord>(`/integrations/disconnect/${serviceKey}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['integrations'] }),
  });
}

export function useUpdateIntegration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ serviceKey, ...data }: { serviceKey: string; syncFrequency?: string; webhookUrl?: string }) =>
      apiClient.patch<IntegrationRecord>(`/integrations/${serviceKey}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['integrations'] }),
  });
}

export function useSyncIntegration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (serviceKey: string) =>
      apiClient.post<IntegrationRecord>(`/integrations/${serviceKey}/sync`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['integrations'] }),
  });
}
