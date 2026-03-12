'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface SearchResult {
    id: string;
    type: 'client' | 'policy' | 'claim' | 'lead' | 'quote';
    title: string;
    subtitle: string;
    href: string;
    metadata?: Record<string, unknown>;
}

export function useGlobalSearch(query: string, enabled = true) {
    return useQuery({
        queryKey: ['search', query],
        queryFn: () => apiClient.get<SearchResult[]>('/search', { q: query }),
        enabled: enabled && query.length >= 2,
        staleTime: 30000, // 30 seconds
    });
}

export function useRecentItems() {
    return useQuery({
        queryKey: ['search', 'recent'],
        queryFn: () => apiClient.get<SearchResult[]>('/search/recent'),
        staleTime: 60000, // 1 minute
    });
}
