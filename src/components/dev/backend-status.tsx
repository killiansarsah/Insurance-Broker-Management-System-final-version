'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export function BackendStatus() {
    const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
    const [apiUrl, setApiUrl] = useState('');

    useEffect(() => {
        setApiUrl(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1');
        
        const checkBackend = async () => {
            try {
                await apiClient.get('/health');
                setStatus('connected');
            } catch (error) {
                setStatus('disconnected');
            }
        };

        checkBackend();
    }, []);

    if (status === 'checking') {
        return (
            <div className="fixed bottom-4 right-4 bg-white border border-surface-200 rounded-lg shadow-lg p-4 flex items-center gap-3 z-50">
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
            <div className="fixed bottom-4 right-4 bg-white border border-success-200 rounded-lg shadow-lg p-4 flex items-center gap-3 z-50">
                <CheckCircle size={20} className="text-success-500" />
                <div>
                    <p className="text-sm font-semibold text-success-900">Backend Connected</p>
                    <p className="text-xs text-success-600">{apiUrl}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 bg-white border border-danger-200 rounded-lg shadow-lg p-4 flex items-center gap-3 z-50">
            <XCircle size={20} className="text-danger-500" />
            <div>
                <p className="text-sm font-semibold text-danger-900">Backend Disconnected</p>
                <p className="text-xs text-danger-600">{apiUrl}</p>
            </div>
        </div>
    );
}
