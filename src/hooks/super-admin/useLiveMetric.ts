'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';

interface UseLiveMetricResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Polls an API endpoint at a set interval. Automatically pauses when
 * the browser tab is hidden (Page Visibility API) and resumes on return.
 */
export function useLiveMetric<T = unknown>(
  endpoint: string,
  intervalMs: number = 30_000
): UseLiveMetricResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const visibleRef = useRef(true);

  const fetchData = useCallback(async () => {
    try {
      const result = await apiClient.get<T>(endpoint);
      setData(result);
      setError(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  // Visibility change handler — pause polling when tab is hidden
  useEffect(() => {
    const handler = () => {
      visibleRef.current = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, []);

  // Initial fetch + polling loop
  useEffect(() => {
    void fetchData();

    timerRef.current = setInterval(() => {
      if (visibleRef.current) void fetchData();
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchData, intervalMs]);

  return { data, loading, error, refresh: fetchData };
}
