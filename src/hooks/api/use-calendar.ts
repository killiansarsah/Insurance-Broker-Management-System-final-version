'use client';

import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface CalendarEventData { id: string; title: string; start: string; end: string;[key: string]: unknown; }

// Stable default dates — computed once at module load, not on every render
const DEFAULT_FROM = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
const DEFAULT_TO = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

export function useCalendarEvents(params?: Record<string, unknown>) {
    // Backend requires 'from' and 'to' query params; default to a 60-day window
    const queryParams = useMemo(() => ({
        from: DEFAULT_FROM,
        to: DEFAULT_TO,
        ...params,
    }), [params]);

    return useQuery({
        queryKey: ['calendar', queryParams],
        queryFn: () => apiClient.get<CalendarEventData[]>('/calendar/events', queryParams),
        staleTime: 5 * 60 * 1000, // 5 min — avoid rapid refetches
        retry: 1,
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
