import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

// Renewals
export function useRenewals() {
  return useQuery({
    queryKey: ['renewals'],
    queryFn: () => apiClient.get('/api/v1/renewals'),
  });
}

// Complaints
export function useComplaints() {
  return useQuery({
    queryKey: ['complaints'],
    queryFn: () => apiClient.get('/api/v1/complaints'),
  });
}

export function useComplaint(id: string) {
  return useQuery({
    queryKey: ['complaints', id],
    queryFn: () => apiClient.get(`/api/v1/complaints/${id}`),
    enabled: !!id,
  });
}

// Documents
export function useDocuments() {
  return useQuery({
    queryKey: ['documents'],
    queryFn: () => apiClient.get('/api/v1/documents'),
  });
}

// Tasks
export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: () => apiClient.get('/api/v1/tasks'),
  });
}

// Calendar
export function useCalendarEvents(params?: { start?: string; end?: string }) {
  return useQuery({
    queryKey: ['calendar', params],
    queryFn: () => apiClient.get('/api/v1/calendar/events', params),
  });
}

// Notifications
export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => apiClient.get('/api/v1/notifications'),
  });
}

// Compliance
export function useComplianceSummary() {
  return useQuery({
    queryKey: ['compliance', 'summary'],
    queryFn: () => apiClient.get('/api/v1/compliance/summary'),
  });
}

// Departments
export function useDepartments() {
  return useQuery({
    queryKey: ['departments'],
    queryFn: () => apiClient.get('/api/v1/departments'),
  });
}

// Approvals
export function useApprovals() {
  return useQuery({
    queryKey: ['approvals'],
    queryFn: () => apiClient.get('/api/v1/approvals'),
  });
}
