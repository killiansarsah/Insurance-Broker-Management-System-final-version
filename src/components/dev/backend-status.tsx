'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { apiClient } from '@/lib/api-client';
import { CheckCircle, XCircle, Loader2, Database, Wifi, WifiOff } from 'lucide-react';

const POLL_INTERVAL = 1_000; // 1 second

interface HealthDetail {
    dbStatus: 'up' | 'down' | 'unknown';
    dbLatency?: number;
    uptime?: number;
}

export function BackendStatus() {
    const [status, setStatus] = useState<'checking' | 'connected' | 'degraded' | 'disconnected'>('checking');
    const [detail, setDetail] = useState<HealthDetail>({ dbStatus: 'unknown' });
    const [apiUrl] = useState(() => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1');
    const [dismissed, setDismissed] = useState(false);
    const [lastChecked, setLastChecked] = useState<Date | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const checkBackend = useCallback(async () => {
        try {
            const data = await apiClient.get<{ status: string; uptime?: number; components?: { database?: { status: string; latencyMs?: number } } }>('/health');
            const dbComp = data?.components?.database;

            setDetail({
                dbStatus: dbComp?.status || 'unknown',
                dbLatency: dbComp?.latencyMs,
                uptime: data?.uptime,
            });

            if (data?.status === 'degraded' || dbComp?.status === 'down') {
                setStatus('degraded');
            } else {
                setStatus('connected');
            }
        } catch {
            setStatus('disconnected');
            setDetail({ dbStatus: 'unknown' });
        }
        setLastChecked(new Date());
    }, []);

    useEffect(() => {
        checkBackend();
        timerRef.current = setInterval(checkBackend, POLL_INTERVAL);
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [checkBackend]);

    // Re-show the indicator when status changes from connected to something else
    const prevStatusRef = useRef(status);
    useEffect(() => {
        if (prevStatusRef.current === 'connected' && status !== 'connected') {
            setDismissed(false);
        }
        prevStatusRef.current = status;
    }, [status]);

    if (dismissed) return null;

    const timeAgo = lastChecked
        ? `Checked ${Math.round((Date.now() - lastChecked.getTime()) / 1000)}s ago`
        : '';

    if (status === 'checking') {
        return (
            <div className="fixed bottom-4 right-4 bg-white border border-surface-200 rounded-lg shadow-lg p-4 flex items-center gap-3 z-50 animate-in fade-in slide-in-from-bottom-2">
                <Loader2 size={20} className="animate-spin text-primary-500" />
                <div>
                    <p className="text-sm font-semibold text-surface-900">Checking Backend...</p>
                    <p className="text-xs text-surface-500">{apiUrl}</p>
                </div>
            </div>
        );
    }

    if (status === 'connected') {
        return (
            <div className="fixed bottom-4 right-4 bg-white border border-success-200 rounded-lg shadow-lg p-4 z-50 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-3">
                    <Wifi size={20} className="text-success-500" />
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-success-900">Backend Connected</p>
                        <div className="flex items-center gap-2 mt-0.5">
                            <Database size={12} className="text-success-500" />
                            <span className="text-xs text-success-600">
                                DB: {detail.dbLatency !== undefined ? `${detail.dbLatency}ms` : 'OK'}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => setDismissed(true)}
                        className="text-surface-400 hover:text-surface-600 text-xs ml-2"
                        aria-label="Dismiss"
                    >
                        ✕
                    </button>
                </div>
            </div>
        );
    }

    if (status === 'degraded') {
        return (
            <div className="fixed bottom-4 right-4 bg-white border border-warning-300 rounded-lg shadow-lg p-4 z-50 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-warning-500" />
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-warning-900">Backend Degraded</p>
                        <div className="flex items-center gap-2 mt-0.5">
                            <Database size={12} className="text-danger-500" />
                            <span className="text-xs text-danger-600">Database is down</span>
                        </div>
                        {timeAgo && <p className="text-[10px] text-surface-400 mt-1">{timeAgo}</p>}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 bg-white border border-danger-200 rounded-lg shadow-lg p-4 z-50 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-3">
                <WifiOff size={20} className="text-danger-500" />
                <div className="flex-1">
                    <p className="text-sm font-semibold text-danger-900">Backend Disconnected</p>
                    <p className="text-xs text-danger-600">Cannot reach {apiUrl}</p>
                    {timeAgo && <p className="text-[10px] text-surface-400 mt-1">{timeAgo}</p>}
                </div>
            </div>
        </div>
    );
}
