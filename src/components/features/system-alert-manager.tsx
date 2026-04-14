'use client';

import * as React from 'react';
import { useNotificationSocket } from '@/hooks/use-notification-socket';
import { AlertCard } from '@/components/ui/alert-card';
import { Bell } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useMarkNotificationRead, useNotifications } from '@/hooks/api/use-notifications';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const ALERT_SUPPRESSION_KEY = 'system-alerts:suppress-before-ts';

interface SystemAlertNotification {
    id: string;
    title: string;
    message: string;
    type: string;
    createdAt: string;
    link?: string;
    read?: boolean;
}

export function SystemAlertManager() {
    const { onNewNotification } = useNotificationSocket();
    const qc = useQueryClient();
    const router = useRouter();
    const markRead = useMarkNotificationRead();
    
    // Fetch unread high-priority notifications on mount to handle the "login" case
    const { data: notificationsData } = useNotifications({ isRead: false, limit: 10 });
    
    const [activeAlert, setActiveAlert] = React.useState<SystemAlertNotification | null>(null);
    const [isOpen, setIsOpen] = React.useState(false);
    const handledAlertIdsRef = React.useRef<Set<string>>(new Set());
    const [suppressBacklogAlerts, setSuppressBacklogAlerts] = React.useState(false);
    const [suppressedBeforeTs, setSuppressedBeforeTs] = React.useState<number>(0);

    const notifications = React.useMemo<SystemAlertNotification[]>(() => {
        if (Array.isArray(notificationsData)) {
            return notificationsData as unknown as SystemAlertNotification[];
        }

        const candidate = notificationsData as unknown as {
            items?: unknown;
            data?: unknown;
        };

        if (Array.isArray(candidate?.items)) {
            return candidate.items as SystemAlertNotification[];
        }

        if (Array.isArray(candidate?.data)) {
            return candidate.data as SystemAlertNotification[];
        }

        return [];
    }, [notificationsData]);

    React.useEffect(() => {
        if (typeof window === 'undefined') return;
        const savedTs = window.localStorage.getItem(ALERT_SUPPRESSION_KEY);
        if (!savedTs) return;

        const parsedTs = Number(savedTs);
        if (!Number.isNaN(parsedTs) && parsedTs > 0) {
            setSuppressedBeforeTs(parsedTs);
            setSuppressBacklogAlerts(true);
        }
    }, []);

    const isHighPriorityAlert = React.useCallback((notification: SystemAlertNotification) => {
        return (
            notification.type === 'FOLLOWUP' ||
            notification.type === 'APPROVAL' ||
            notification.type === 'FINANCE' ||
            notification.title.startsWith('Task Due:') ||
            notification.title.toLowerCase().includes('approval')
        );
    }, []);

    const acknowledgeAlert = React.useCallback(async (alertId: string) => {
        handledAlertIdsRef.current.add(alertId);
        const nowTs = Date.now();
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(ALERT_SUPPRESSION_KEY, String(nowTs));
        }
        setSuppressedBeforeTs(nowTs);
        setSuppressBacklogAlerts(true);
        setIsOpen(false);
        setActiveAlert(null);
        await markRead.mutateAsync(alertId);
    }, [markRead]);

    // Initial check for sticky alerts
    React.useEffect(() => {
        if (suppressBacklogAlerts) return;

        if (notifications.length > 0) {
            const highPriorityAlert = notifications.find((n) => 
                isHighPriorityAlert(n) &&
                !handledAlertIdsRef.current.has(n.id) &&
                (suppressedBeforeTs === 0 || new Date(n.createdAt).getTime() > suppressedBeforeTs)
            );
            if (highPriorityAlert && !activeAlert) {
                setActiveAlert(highPriorityAlert);
                setIsOpen(true);
            }
        }
    }, [notifications, activeAlert, isHighPriorityAlert, suppressBacklogAlerts, suppressedBeforeTs]);

    React.useEffect(() => {
        const unsub = onNewNotification((notification) => {
            const incomingAlert: SystemAlertNotification = {
                id: notification.id,
                title: notification.title,
                message: notification.message,
                type: notification.type,
                createdAt: notification.createdAt,
                link: notification.link,
            };

            if (isHighPriorityAlert(incomingAlert) && !handledAlertIdsRef.current.has(incomingAlert.id)) {
                setActiveAlert(incomingAlert);
                setIsOpen(true);
                setSuppressBacklogAlerts(false);
                
                qc.invalidateQueries({ queryKey: ['notifications'] });
                qc.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
            }
        });
        return unsub;
    }, [onNewNotification, qc, isHighPriorityAlert]);

    if (!activeAlert) return null;

    return (
        <AlertCard
            isVisible={isOpen}
            title={activeAlert.title.replace('Task Due: ', '')}
            description={activeAlert.message}
            buttonText="Take Action Now"
            onButtonClick={async () => {
                try {
                    await acknowledgeAlert(activeAlert.id);
                    if (activeAlert.link) {
                        router.push(activeAlert.link);
                    } else {
                        router.push('/dashboard/tasks');
                    }
                } catch {
                    handledAlertIdsRef.current.delete(activeAlert.id);
                    toast.error('Unable to acknowledge notification. Please try again.');
                }
            }}
            onDismiss={async () => {
                try {
                    await acknowledgeAlert(activeAlert.id);
                } catch {
                    handledAlertIdsRef.current.delete(activeAlert.id);
                    toast.error('Unable to close notification right now.');
                }
            }}
            icon={<Bell size={24} className="text-white" />}
        />
    );
}

