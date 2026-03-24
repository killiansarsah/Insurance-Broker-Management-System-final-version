'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { apiClient } from '@/lib/api-client';
import { CheckCircle, XCircle, Loader2, Database, Wifi, WifiOff } from 'lucide-react';

const POLL_INTERVAL_CONNECTED = 15_000; // 15 seconds when connected
const POLL_INTERVAL_DISCONNECTED = 10_000; // 10 seconds when disconnected

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
                dbStatus: (dbComp?.status as 'up' | 'down' | 'unknown') || 'unknown',
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
    }, [checkBackend]);

    // Adjust poll interval based on connection status
    useEffect(() => {
        const interval = status === 'disconnected' || status === 'checking'
            ? POLL_INTERVAL_DISCONNECTED
            : POLL_INTERVAL_CONNECTED;
        timerRef.current = setInterval(checkBackend, interval);
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [status, checkBackend]);

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
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm border border-surface-200 rounded-full shadow-md px-4 py-2 flex items-center gap-2 z-50 animate-in fade-in slide-in-from-bottom-2">
                <Loader2 size={14} className="animate-spin text-primary-500" />
                <p className="text-xs font-medium text-surface-600">Checking backend...</p>
            </div>
        );
    }

    if (status === 'connected') {
        return (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm border border-success-200 rounded-full shadow-md px-4 py-2 z-50 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-2">
                    <Wifi size={14} className="text-success-500" />
                    <span className="text-xs font-medium text-success-700">Connected</span>
                    <span className="text-[10px] text-success-500">·</span>
                    <Database size={12} className="text-success-500" />
                    <span className="text-[10px] text-success-600">
                        {detail.dbLatency !== undefined ? `${detail.dbLatency}ms` : 'OK'}
                    </span>
                    <button
                        onClick={() => setDismissed(true)}
                        className="text-surface-400 hover:text-surface-600 text-xs ml-1"
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
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm border border-warning-300 rounded-full shadow-md px-4 py-2 z-50 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-warning-500" />
                    <span className="text-xs font-medium text-warning-700">Degraded</span>
                    <span className="text-[10px] text-warning-500">·</span>
                    <Database size={12} className="text-danger-500" />
                    <span className="text-[10px] text-danger-600">DB down</span>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm border border-danger-200 rounded-full shadow-md px-4 py-2 z-50 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2">
                <WifiOff size={14} className="text-danger-500" />
                <span className="text-xs font-medium text-danger-700">Disconnected</span>
                <span className="text-[10px] text-danger-400">· {timeAgo}</span>
            </div>
        </div>
    );
}
