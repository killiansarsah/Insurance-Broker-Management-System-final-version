'use client';

import React, { useState, useRef } from 'react';
import { CalendarView, CalendarViewHandle } from '@/components/calendar/calendar-view';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Calendar as CalendarIcon, Globe, RefreshCw, Plus, CheckCircle2 } from 'lucide-react';
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
        <div className="p-4 md:p-8 space-y-8 min-h-screen bg-surface-50/30">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-2"
            >
                <div className="space-y-1">
                    <h1 className="text-2xl font-black text-surface-900 tracking-tight uppercase flex items-center gap-3">
                        <CalendarIcon className="text-primary-600" size={24} />
                        Broker <span className="opacity-40">Calendar</span>
                    </h1>
                </div>

                {/* Satellite Control Pill */}
                <div className="flex items-center gap-1 p-1 bg-white/60 backdrop-blur-xl border border-surface-200/50 rounded-full shadow-xl shadow-surface-900/5">
                    <div className="flex items-center gap-1 pr-2 border-r border-surface-100/80 mr-1 ml-1">
                        <button
                            onClick={handleConnect}
                            disabled={connectionStatus === 'connecting'}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all",
                                connectionStatus === 'connected'
                                    ? "text-success-600"
                                    : "text-surface-500 hover:text-surface-900 hover:bg-surface-50/50"
                            )}
                        >
                            <Globe size={14} className={cn(connectionStatus === 'connecting' && "animate-spin")} />
                            {connectionStatus === 'disconnected' && "Connect"}
                            {connectionStatus === 'connecting' && "Linking..."}
                            {connectionStatus === 'connected' && "Linked"}
                        </button>

                        <button
                            onClick={handleSync}
                            disabled={isSyncing}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all text-surface-500 hover:text-surface-900 hover:bg-surface-50/50",
                                isSyncing && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            <RefreshCw size={14} className={cn(isSyncing && "animate-spin")} />
                            {isSyncing ? "Syncing" : "Sync"}
                        </button>
                    </div>

                    <button
                        onClick={() => calendarRef.current?.openModal()}
                        className="flex items-center gap-2 px-5 py-2 rounded-full bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-all active:scale-95"
                    >
                        <Plus size={14} strokeWidth={3} />
                        New Action
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
