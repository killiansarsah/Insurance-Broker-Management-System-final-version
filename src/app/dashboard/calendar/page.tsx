'use client';

import React, { useState, useRef } from 'react';
import { CalendarView, CalendarViewHandle } from '@/components/calendar/calendar-view';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { RefreshCw, Globe, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CalendarPage() {
    const [isSyncing, setIsSyncing] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
    const calendarRef = useRef<CalendarViewHandle>(null);

    const handleSync = () => {
        if (connectionStatus !== 'connected') {
            toast.error('Please connect your Google Calendar first', {
                description: 'You need to authorize the connection before syncing.',
            });
            return;
        }

        setIsSyncing(true);
        toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
            loading: 'Syncing with Google Calendar...',
            success: () => {
                setIsSyncing(false);
                return 'Calendar successfully synchronized!';
            },
            error: 'Failed to sync calendar.',
        });
    };

    const handleConnect = () => {
        if (connectionStatus === 'connected') {
            toast.info('Google Calendar is already connected', {
                description: 'You are all set for synchronization.',
            });
            return;
        }

        setConnectionStatus('connecting');

        // Mock OAuth flow
        setTimeout(() => {
            setConnectionStatus('connected');
            toast.success('Successfully connected to Google Calendar', {
                description: 'You can now sync your events automatically.',
                icon: <CheckCircle2 className="text-success-500" size={18} />,
            });
        }, 3500);
    };

    return (
        <div className="p-6 lg:p-10 space-y-8 min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
                <div>
                    <h1 className="text-3xl font-extrabold text-surface-900 tracking-tight">
                        Broker Calendar
                    </h1>
                    <p className="text-surface-500 mt-1">
                        Track policy renewals, client meetings, and claim deadlines.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={handleConnect}
                        disabled={connectionStatus === 'connecting'}
                        className={cn(
                            "flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-lg)] font-bold text-sm shadow-sm transition-all cursor-pointer border",
                            connectionStatus === 'connected'
                                ? "bg-success-50 border-success-200 text-success-700"
                                : "bg-white border-surface-200 text-surface-700 hover:bg-surface-50"
                        )}
                    >
                        <Globe size={18} className={cn(connectionStatus === 'connecting' && "animate-spin")} />
                        {connectionStatus === 'disconnected' && "Connect Google"}
                        {connectionStatus === 'connecting' && "Connecting..."}
                        {connectionStatus === 'connected' && "Connected"}
                    </button>

                    <button
                        onClick={handleSync}
                        disabled={isSyncing}
                        className={cn(
                            "flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-lg)] font-bold text-sm shadow-sm transition-all cursor-pointer border",
                            "bg-white border-surface-200 text-surface-700 hover:bg-surface-50",
                            isSyncing && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        <RefreshCw size={18} className={cn(isSyncing && "animate-spin")} />
                        {isSyncing ? "Syncing..." : "Sync Now"}
                    </button>

                    <button
                        onClick={() => calendarRef.current?.openModal()}
                        className="px-5 py-2.5 rounded-[var(--radius-lg)] bg-primary-600 text-white font-bold text-sm shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-all cursor-pointer"
                    >
                        + New Event
                    </button>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <CalendarView ref={calendarRef} />
            </motion.div>
        </div>
    );
}
