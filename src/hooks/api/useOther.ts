import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

// Renewals
export function useRenewals() {
  return useQuery({
    queryKey: ['renewals'],
    queryFn: () => apiClient.get('/renewals'),
  });
}

// Complaints
export function useComplaints() {
  return useQuery({
    queryKey: ['complaints'],
    queryFn: () => apiClient.get('/complaints'),
  });
}

export function useComplaint(id: string) {
  return useQuery({
    queryKey: ['complaints', id],
    queryFn: () => apiClient.get(`/complaints/${id}`),
    enabled: !!id,
  });
}

// Documents
export function useDocuments() {
  return useQuery({
    queryKey: ['documents'],
    queryFn: () => apiClient.get('/documents'),
  });
}

// Tasks
export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: () => apiClient.get('/tasks'),
  });
}

// Calendar
export function useCalendarEvents(params?: { start?: string; end?: string }) {
  return useQuery({
    queryKey: ['calendar', params],
    queryFn: () => apiClient.get('/calendar/events', params),
  });
}

// Notifications
export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => apiClient.get('/notifications'),
  });
}

// Compliance
export function useComplianceSummary() {
  return useQuery({
    queryKey: ['compliance', 'summary'],
    queryFn: () => apiClient.get('/compliance/summary'),
  });
}

// Departments
export function useDepartments() {
  return useQuery({
    queryKey: ['departments'],
    queryFn: () => apiClient.get('/departments'),
  });
}

// Approvals
export function useApprovals() {
  return useQuery({
    queryKey: ['approvals'],
    queryFn: () => apiClient.get('/approvals'),
  });
}
