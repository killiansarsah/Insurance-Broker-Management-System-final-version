'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CalendarView, CalendarViewHandle } from '@/components/calendar/calendar-view';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Calendar as CalendarIcon, Globe, RefreshCw, Plus, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIntegrations } from '@/hooks/api/use-integrations';
import { useGoogleCalendarSync, useGoogleAuthUrl } from '@/hooks/api/use-google-integration';
import { useQueryClient } from '@tanstack/react-query';

export default function CalendarPage() {
    const [isSyncing, setIsSyncing] = useState(false);
    const calendarRef = useRef<CalendarViewHandle>(null);
    const qc = useQueryClient();
    
    const { data: integrations } = useIntegrations();
    const calendarSync = useGoogleCalendarSync();
    const googleAuthUrl = useGoogleAuthUrl();

    const googleCalendar = Array.isArray(integrations) 
        ? integrations.find((i: any) => i.serviceKey === 'google-calendar')
        : undefined;
    const isConnected = googleCalendar?.connected || false;

    const handleSync = () => {
        if (!isConnected) {
            toast.error('Please connect your Google Calendar first', {
                description: 'Go to Integrations to authorize the connection.',
            });
            return;
        }

        setIsSyncing(true);
        calendarSync.mutate(undefined, {
            onSuccess: (result) => {
                setIsSyncing(false);
                qc.invalidateQueries({ queryKey: ['calendar'] });
                if (result?.push && result?.pull) {
                    toast.success('Calendar synchronized!', {
                        description: `Pushed ${result.push.pushed} events, pulled ${result.pull.pulled} events from Google.`,
                    });
                } else {
                    toast.success('Calendar synchronized!');
                }
            },
            onError: (error: any) => {
                setIsSyncing(false);
                const msg = error?.response?.data?.message || error?.message || 'Failed to sync calendar';
                toast.error(msg);
            },
        });
    };

    const handleConnect = () => {
        if (isConnected) {
            toast.info('Google Calendar is already connected', {
                description: 'You are all set for synchronization.',
            });
            return;
        }

        googleAuthUrl.mutate(undefined, {
            onSuccess: (data) => {
                // Open popup for OAuth
                const popup = window.open(data.url, 'google-auth', 'width=500,height=600,left=200,top=100');
                
                // Listen for message from OAuth callback
                const handleMessage = (event: MessageEvent) => {
                    // Verify origin for security
                    if (event.origin !== window.location.origin) return;
                    
                    if (event.data?.type === 'google-auth-success') {
                        window.removeEventListener('message', handleMessage);
                        qc.invalidateQueries({ queryKey: ['integrations'] });
                        toast.success('Successfully connected to Google Calendar', {
                            description: 'You can now sync your events automatically.',
                            icon: <CheckCircle2 className="text-success-500" size={18} />,
                        });
                    } else if (event.data?.type === 'google-auth-error') {
                        window.removeEventListener('message', handleMessage);
                        toast.error('Failed to connect to Google Calendar', {
                            description: event.data.message || 'Please try again.',
                        });
                    }
                };
                
                window.addEventListener('message', handleMessage);
                
                // Fallback: Check if popup was closed without message (user cancelled)
                const checkInterval = setInterval(() => {
                    try {
                        // Safely check if popup is closed
                        const isClosed = !popup || (popup.closed === true);
                        if (isClosed) {
                            clearInterval(checkInterval);
                            window.removeEventListener('message', handleMessage);
                            // Refresh integrations after popup closes
                            setTimeout(() => {
                                qc.invalidateQueries({ queryKey: ['integrations'] });
                            }, 500);
                        }
                    } catch (e) {
                        // Ignore cross-origin errors when checking popup.closed
                        clearInterval(checkInterval);
                        window.removeEventListener('message', handleMessage);
                    }
                }, 1000);
                
                // Cleanup after 5 minutes
                setTimeout(() => {
                    clearInterval(checkInterval);
                    window.removeEventListener('message', handleMessage);
                }, 300000);
            },
            onError: () => {
                toast.error('Failed to start Google sign-in.');
            },
        });
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
                <div className="flex items-center gap-1 p-1 bg-background/60 backdrop-blur-xl border border-surface-200/50 rounded-full shadow-xl shadow-surface-900/5">
                    <div className="flex items-center gap-1 pr-2 border-r border-surface-100/80 mr-1 ml-1">
                        <button
                            onClick={handleConnect}
                            disabled={googleAuthUrl.isPending}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all",
                                isConnected
                                    ? "text-success-600"
                                    : "text-surface-500 hover:text-surface-900 hover:bg-surface-50/50"
                            )}
                        >
                            <Globe size={14} className={cn(googleAuthUrl.isPending && "animate-spin")} />
                            {!isConnected && !googleAuthUrl.isPending && "Connect"}
                            {googleAuthUrl.isPending && "Linking..."}
                            {isConnected && "Linked"}
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
                        className="flex items-center gap-2 px-5 py-2 rounded-full bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-all active:scale-95 cursor-pointer"
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
