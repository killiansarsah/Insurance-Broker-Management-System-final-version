'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api-client';

export function BackendConnectionStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        await fetch('http://localhost:3001/api/v1/health');
        setStatus('connected');
        setLastCheck(new Date());
      } catch {
        setStatus('disconnected');
        setLastCheck(new Date());
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border p-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Backend:</span>
          <Badge 
            variant={status === 'connected' ? 'success' : status === 'disconnected' ? 'danger' : 'default'}
          >
            {status === 'connected' ? '✓ Connected' : status === 'disconnected' ? '✗ Disconnected' : '⏳ Checking...'}
          </Badge>
        </div>
        {lastCheck && (
          <div className="text-gray-500 mt-1">
            Last check: {lastCheck.toLocaleTimeString()}
          </div>
        )}
        {status === 'disconnected' && (
          <div className="text-orange-600 mt-1">
            Using mock data
          </div>
        )}
      </div>
    </div>
  );
}