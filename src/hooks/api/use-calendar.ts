'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface CalendarEventData { id: string; title: string; start: string; end: string;[key: string]: unknown; }

export function useCalendarEvents(params?: Record<string, unknown>) {
    return useQuery({
        queryKey: ['calendar', params],
        queryFn: () => apiClient.get<CalendarEventData[]>('/calendar/events', params),
    });
}

export function useCalendarEvent(id: string) {
    return useQuery({
        queryKey: ['calendar', id],
        queryFn: () => apiClient.get<CalendarEventData>(`/calendar/events/${id}`),
        enabled: !!id,
    });
}

export function useCreateCalendarEvent() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: Record<string, unknown>) => apiClient.post<CalendarEventData>('/calendar/events', data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['calendar'] }),
    });
}

export function useUpdateCalendarEvent() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
            apiClient.patch<CalendarEventData>(`/calendar/events/${id}`, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['calendar'] }),
    });
}

export function useDeleteCalendarEvent() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => apiClient.delete(`/calendar/events/${id}`),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['calendar'] }),
    });
}
