'use client';

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
    Check, X, RefreshCw, Settings2, Zap, Shield, Clock, ExternalLink, Cloud,
    Upload, FileSpreadsheet, CheckCircle2, XCircle, Plug, Globe, ArrowRight, Loader2, AlertTriangle,
    Receipt, CreditCard, MessageCircle
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// ─── Branded Icons ──────────────────────────────────────────

const BrandIcons = {
    GoogleCalendar: () => (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[60%] h-[60%]">
            <rect x="2" y="4" width="20" height="16" rx="3" fill="#4285F4" />
            <path d="M6 4V2M18 4V2" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <path d="M2 10H22" stroke="white" strokeWidth="2" />
            <rect x="6" y="13" width="4" height="4" rx="1" fill="white" />
        </svg>
    ),
    GoogleSheets: () => (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[60%] h-[60%]">
            <rect x="3" y="2" width="18" height="20" rx="3" fill="#0F9D58" />
            <path d="M7 8H17M7 12H17M7 16H13" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <path d="M12 8V18" stroke="white" strokeWidth="2" />
        </svg>
    ),
    GoogleDrive: () => (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[60%] h-[60%]">
            <path d="M8 19L1.5 8H8.5L15 19H8Z" fill="#34A853" />
            <path d="M16 19L22.5 8L15.5 8L9 19H16Z" fill="#FBBC04" />
            <path d="M1.5 8L5 2H19L22.5 8L12 8H1.5Z" fill="#4285F4" />
        </svg>
    ),
    Paystack: () => (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[65%] h-[65%]">
            <path d="M4 6H20M4 12H16M4 18H12" stroke="#00C3F7" strokeWidth="4" strokeLinecap="round" />
        </svg>
    ),
    WhatsApp: () => (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[65%] h-[65%]">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 13.85 2.5 15.58 3.38 17.06L2 22L7.05 20.68C8.52 21.53 10.21 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="#25D366" />
            <path d="M8.5 7.5C8 7.5 7.5 8 7.5 8.5C7.5 10.5 9 14 12.5 15.5C13 15.75 14 16 15 16C15.5 16 16 15.5 16 15C16 14.5 15.75 14.25 15 14C14.25 13.75 14 14 13.75 14.25C13.5 14.5 13 14.5 12.5 14C11.5 13 10.75 12 10.25 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
};
import {
    useIntegrations,
    useConnectIntegration,
    useDisconnectIntegration,
    useUpdateIntegration,
    useSyncIntegration,
} from '@/hooks/api/use-integrations';
import {
    useGoogleAuthUrl,
    useGoogleCalendarSync,
    useGoogleSheetsExport,
    useGoogleDriveMirror,
} from '@/hooks/api/use-google-integration';
import { useImportFile, type ImportResult, type MixedImportResult } from '@/hooks/api/use-imports';

// ─── Types ──────────────────────────────────────────────────

type IntegrationCategory = 'all' | 'productivity' | 'payment' | 'communication';
type SyncFrequency = '15m' | '1h' | '6h' | '24h' | 'manual';
type ConnectionStep = 'idle' | 'signin' | 'permissions' | 'connecting' | 'success';

interface SyncEvent {
    id: string;
    type: 'sync' | 'error' | 'connected' | 'disconnected';
    message: string;
    timestamp: string;
    count?: number;
}

interface IntegrationService {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    brandColor: string;
    bgColor: string;
    textColor: string;
    category: IntegrationCategory;
    connected: boolean;
    connectedAt?: string;
    connectedEmail?: string;
    syncFrequency: SyncFrequency;
    lastSyncAt?: string;
    syncEvents: SyncEvent[];
    features: string[];
    scopes: string[];
    webhookUrl?: string;
    apiKeyRequired?: boolean;
    comingSoon?: boolean;
}

interface ImportRecord {
    name: string;
    date: string;
    by: string;
    status: string;
    ok: boolean;
}

// ─── Service Data ───────────────────────────────────────────

function createServices(): IntegrationService[] {
    return [
        {
            id: 'google-calendar', name: 'Google Calendar',
            description: 'Sync policy renewals, client meetings, and task deadlines automatically to your Google Calendar.',
            icon: <BrandIcons.GoogleCalendar />, brandColor: '#4285F4', bgColor: 'bg-blue-50 dark:bg-blue-950/30',
            textColor: 'text-blue-600 dark:text-blue-400', category: 'productivity',
            connected: false, syncFrequency: '1h', syncEvents: [],
            features: ['Auto-create renewal events', 'Sync client meetings', 'Task deadline reminders', 'Two-way sync'],
            scopes: ['View and edit calendar events', 'View calendar settings', 'Create new calendars'],
        },
        {
            id: 'google-sheets', name: 'Google Sheets',
            description: 'Export reports, client lists, and financial data directly to Google Sheets for analysis.',
            icon: <BrandIcons.GoogleSheets />, brandColor: '#0F9D58', bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
            textColor: 'text-emerald-600 dark:text-emerald-400', category: 'productivity',
            connected: false, syncFrequency: '24h', syncEvents: [],
            features: ['Auto-export monthly reports', 'Live client list sync', 'Commission tracking sheets', 'Custom templates'],
            scopes: ['View and manage spreadsheets', 'Create new spreadsheets', 'Access Google Drive files'],
        },
        {
            id: 'google-drive', name: 'Google Drive',
            description: 'Store policy documents, claim photos, and KYC files securely in the cloud.',
            icon: <BrandIcons.GoogleDrive />, brandColor: '#FBBC04', bgColor: 'bg-amber-50 dark:bg-amber-950/30',
            textColor: 'text-amber-600 dark:text-amber-400', category: 'productivity',
            connected: false, syncFrequency: '15m', syncEvents: [],
            features: ['Auto-upload policy documents', 'Claim photo backup', 'KYC file storage', 'Folder organization'],
            scopes: ['View and manage files', 'Create folders', 'Share files with team'],
        },
        {
            id: 'paystack', name: 'Paystack',
            description: 'Accept premium payments via Mobile Money, Card, and Bank Transfer in Ghana.',
            icon: <BrandIcons.Paystack />, brandColor: '#00C3F7', bgColor: 'bg-teal-50 dark:bg-teal-950/30',
            textColor: 'text-teal-600 dark:text-teal-400', category: 'payment',
            connected: false, syncFrequency: 'manual', syncEvents: [], apiKeyRequired: true, comingSoon: true,
            features: ['Accept Mobile Money', 'Card payments', 'Bank transfers', 'Automatic receipts'],
            scopes: ['Process transactions', 'View payment history', 'Manage customers'],
            webhookUrl: 'https://api.yourdomain.com/webhooks/paystack',
        },
        {
            id: 'whatsapp', name: 'WhatsApp Business',
            description: 'Send policy documents, renewal alerts, and claim updates to clients via WhatsApp.',
            icon: <BrandIcons.WhatsApp />, brandColor: '#25D366', bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
            textColor: 'text-emerald-600 dark:text-emerald-400', category: 'communication',
            connected: false, syncFrequency: 'manual', syncEvents: [], apiKeyRequired: true, comingSoon: true,
            features: ['Send policy documents', 'Renewal alerts', 'Claim status updates', 'Template messages'],
            scopes: ['Send messages', 'Send media files', 'Read message status'],
        },
    ];
}

const CATEGORY_TABS: { value: IntegrationCategory; label: string; icon: React.ReactNode }[] = [
    { value: 'all', label: 'All', icon: <Globe size={14} /> },
    { value: 'productivity', label: 'Productivity', icon: <Zap size={14} /> },
    { value: 'payment', label: 'Payments', icon: <CreditCard size={14} /> },
    { value: 'communication', label: 'Communication', icon: <MessageCircle size={14} /> },
];

const SYNC_OPTIONS: { value: SyncFrequency; label: string }[] = [
    { value: '15m', label: 'Every 15 minutes' },
    { value: '1h', label: 'Every hour' },
    { value: '6h', label: 'Every 6 hours' },
    { value: '24h', label: 'Every 24 hours' },
    { value: 'manual', label: 'Manual only' },
];

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function mergeWithApiData(catalog: IntegrationService[], apiData: { serviceKey?: string; connected?: boolean; connectedAt?: string; connectedEmail?: string; syncFrequency?: string; lastSyncAt?: string; syncEvents?: unknown; }[]): IntegrationService[] {
    const byKey = new Map<string, typeof apiData[0]>();
    for (const rec of apiData) {
        if (typeof rec.serviceKey === 'string') {
            byKey.set(rec.serviceKey, rec);
        }
    }
    return catalog.map(svc => {
        const db = byKey.get(svc.id);
        if (!db) return svc;
        return {
            ...svc,
            connected: !!db.connected,
            connectedAt: typeof db.connectedAt === 'string' ? db.connectedAt : undefined,
            connectedEmail: typeof db.connectedEmail === 'string' ? db.connectedEmail : undefined,
            syncFrequency: (typeof db.syncFrequency === 'string' ? db.syncFrequency : svc.syncFrequency) as SyncFrequency,
            lastSyncAt: typeof db.lastSyncAt === 'string' ? db.lastSyncAt : undefined,
            syncEvents: Array.isArray(db.syncEvents) ? db.syncEvents as SyncEvent[] : [],
        };
    });
}

// ─── Main Component ─────────────────────────────────────────

export function SettingsIntegrations() {
    const searchParams = useSearchParams();
    // ── API hooks ──
    const { data: apiIntegrations } = useIntegrations();
    const connectMutation = useConnectIntegration();
    const disconnectMutation = useDisconnectIntegration();
    const updateMutation = useUpdateIntegration();
    const syncMutation = useSyncIntegration();
    const queryClient = useQueryClient();
    const googleAuthUrl = useGoogleAuthUrl();
    const calendarSync = useGoogleCalendarSync();
    const sheetsExport = useGoogleSheetsExport();
    const driveMirror = useGoogleDriveMirror();

    // Handle OAuth callback (Standard URL params)
    useEffect(() => {
        const handleGoogleResult = (status: string | null, email: string | null, reason: string | null) => {
            if (status === 'success' && email) {
                setConnectionStep('success');
                toast.success('Google Calendar connected!', {
                    description: `Connected as ${email}. Syncing events...`,
                });
                // Trigger initial sync after successful connection
                setTimeout(() => {
                    calendarSync.mutate(undefined, {
                        onSuccess: (r) => {
                            if (r?.push && r?.pull) {
                                toast.success(`Initial sync complete: ${r.push.pushed} pushed, ${r.pull.pulled} pulled`);
                            } else {
                                toast.success('Initial sync complete');
                            }
                            queryClient.invalidateQueries({ queryKey: ['integrations'] });
                        },
                        onError: () => {
                            toast.warning('Connection successful, but initial sync failed. Try manual sync.');
                            queryClient.invalidateQueries({ queryKey: ['integrations'] });
                        },
                    });
                }, 1500);
            } else if (status === 'error') {
                setConnectionStep('idle');
                toast.error('Google connection failed', {
                    description: reason || 'Unknown error occurred',
                });
            }
        };

        // 1. Process URL params if they exist in this window
        // 1. Process URL params if they exist
        const googleStatus = searchParams.get('google');
        const email = searchParams.get('email');
        const reason = searchParams.get('reason');

        if (googleStatus) {
            // Write to local storage for parent window (if we are the popup)
            localStorage.setItem('oauth_callback', JSON.stringify({ googleStatus, email, reason, timestamp: Date.now() }));
            
            // Aggressively attempt to close. 
            // Browsers will ONLY allow this if it's a JS-opened popup.
            // If we are undeniably the popup, the browser kills this window instantly.
            window.close();
            
            // If we are still alive after 300ms, it means we are the MAIN window.
            // (e.g. the redirect happened in the primary tab, or browser blocked window.close)
            setTimeout(() => {
                handleGoogleResult(googleStatus, email, reason);
                // Clean the URL out so refreshing doesn't re-trigger it
                window.history.replaceState({}, '', window.location.pathname);
            }, 300);
            
            return;
        }

        // 2. Listen for messages from the popup window (Method 1)
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === 'OAUTH_CALLBACK') {
                handleGoogleResult(event.data.googleStatus, event.data.email, event.data.reason);
            }
        };

        // 3. Listen for localStorage changes from the popup window (Method 2)
        const handleStorage = (event: StorageEvent) => {
            if (event.key === 'oauth_callback' && event.newValue) {
                try {
                    const data = JSON.parse(event.newValue);
                    handleGoogleResult(data.googleStatus, data.email, data.reason);
                    localStorage.removeItem('oauth_callback');
                } catch (e) {
                    // Ignore parsing error
                }
            }
        };

        window.addEventListener('message', handleMessage);
        window.addEventListener('storage', handleStorage);
        
        return () => {
            window.removeEventListener('message', handleMessage);
            window.removeEventListener('storage', handleStorage);
        };
    }, [searchParams, calendarSync]);

    // Merge static catalog with API data
    const services = useMemo(() => {
        const catalog = createServices();
        if (!apiIntegrations || !Array.isArray(apiIntegrations)) return catalog;
        return mergeWithApiData(catalog, apiIntegrations as Parameters<typeof mergeWithApiData>[1]);
    }, [apiIntegrations]);

    const [activeCategory, setActiveCategory] = useState<IntegrationCategory>('all');
    const [connectingId, setConnectingId] = useState<string | null>(null);
    const [connectionStep, setConnectionStep] = useState<ConnectionStep>('idle');
    const [configId, setConfigId] = useState<string | null>(null);
    const [syncing, setSyncing] = useState<string | null>(null);
    const [apiKeyInput, setApiKeyInput] = useState('');
    const [apiSecretInput, setApiSecretInput] = useState('');
    const [sheetsExportType, setSheetsExportType] = useState<string>('clients');

    // ── Upload state ──
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadModal, setUploadModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadDataType, setUploadDataType] = useState('all');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [recentImports, setRecentImports] = useState<ImportRecord[]>([]);
    const [importResult, setImportResult] = useState<ImportResult | MixedImportResult | null>(null);
    const importMutation = useImportFile();

    const DATA_TYPES = [
        { value: 'all', label: 'Import All' },
        { value: 'clients', label: 'Clients' },
        { value: 'policies', label: 'Policies' },
        { value: 'claims', label: 'Claims' },
        { value: 'invoices', label: 'Invoices' },
        { value: 'leads', label: 'Leads' },
        { value: 'commissions', label: 'Commissions' },
    ];

    const ACCEPTED_TYPES = ['.csv', '.xlsx', '.xls', '.json'];
    const MAX_SIZE = 10 * 1024 * 1024;

    // ── Computed ──
    const filtered = useMemo(() =>
        activeCategory === 'all' ? services : services.filter(s => s.category === activeCategory),
        [services, activeCategory]
    );
    const connectedCount = services.filter(s => s.connected).length;
    const lastSync = services
        .filter(s => s.lastSyncAt)
        .sort((a, b) => (b.lastSyncAt || '').localeCompare(a.lastSyncAt || ''))[0]?.lastSyncAt;
    const activeWebhooks = services.filter(s => s.connected && s.webhookUrl).length;

    const connectingService = services.find(s => s.id === connectingId);
    const configService = services.find(s => s.id === configId);

    // ── Handlers ──
    const startConnect = (id: string) => {
        setConnectingId(id);
        setConnectionStep('signin');
        setApiKeyInput('');
        setApiSecretInput('');
    };

    const progressConnect = () => {
        if (connectionStep === 'signin') {
            const svc = services.find(s => s.id === connectingId);
            if (svc?.apiKeyRequired) {
                if (!apiKeyInput.trim()) { toast.error('API key is required'); return; }
            }
            // For Google services, open real OAuth popup
            const isGoogle = connectingId?.startsWith('google-');
            if (isGoogle) {
                setConnectionStep('connecting');
                googleAuthUrl.mutate(undefined, {
                    onSuccess: (data) => {
                        // Open Google consent in a popup
                        const popup = window.open(data.url, 'google-auth', 'width=500,height=600,left=200,top=100');

                        const checkClosed = setInterval(() => {
                            if (popup?.closed) {
                                clearInterval(checkClosed);
                                // If it's still 'connecting' after 1 second, the user manually aborted it
                                setTimeout(() => {
                                    setConnectionStep(prev => prev === 'connecting' ? 'idle' : prev);
                                }, 1000);
                            }
                        }, 500);
                    },
                    onError: () => {
                        setConnectionStep('signin');
                        toast.error('Failed to start Google sign-in. Check backend configuration.');
                    },
                });
                return;
            }
            setConnectionStep('permissions');
        } else if (connectionStep === 'permissions') {
            setConnectionStep('connecting');
            const svc = services.find(s => s.id === connectingId);
            connectMutation.mutate({
                serviceKey: connectingId!,
                apiKey: apiKeyInput || undefined,
                apiSecret: apiSecretInput || undefined,
                connectedEmail: svc?.apiKeyRequired ? `••••${apiKeyInput.slice(-4)}` : undefined,
            }, {
                onSuccess: () => {
                    setConnectionStep('success');
                    toast.success(`Connected to ${svc?.name}!`);
                },
                onError: () => {
                    setConnectionStep('signin');
                    toast.error('Connection failed. Please try again.');
                },
            });
        }
    };

    const closeConnect = () => {
        setConnectingId(null);
        setConnectionStep('idle');
    };

    const disconnect = (id: string) => {
        const svc = services.find(s => s.id === id);
        disconnectMutation.mutate(id, {
            onSuccess: () => {
                setConfigId(null);
                toast.info(`${svc?.name} disconnected`);
            },
        });
    };

    const handleSync = (id: string) => {
        setSyncing(id);
        const svc = services.find(s => s.id === id);

        // For Google Calendar, use the real bi-directional sync
        if (id === 'google-calendar') {
            toast.info('Syncing Google Calendar...');
            calendarSync.mutate(undefined, {
                onSuccess: (r) => {
                    setSyncing(null);
                    if (r?.push && r?.pull) {
                        toast.success(`Calendar synced: ${r.push.pushed} pushed, ${r.pull.pulled} pulled`);
                    } else {
                        toast.success('Calendar synced');
                    }
                },
                onError: () => {
                    setSyncing(null);
                    toast.error('Calendar sync failed');
                },
            });
            return;
        }

        // For Google Drive, use mirror
        if (id === 'google-drive') {
            toast.info('Mirroring documents to Google Drive...');
            driveMirror.mutate(undefined, {
                onSuccess: (r) => {
                    setSyncing(null);
                    toast.success(`Drive: ${r.mirrored} mirrored, ${r.skipped} skipped`);
                },
                onError: () => {
                    setSyncing(null);
                    toast.error('Drive sync failed');
                },
            });
            return;
        }

        toast.info(`Syncing ${svc?.name}...`);
        syncMutation.mutate(id, {
            onSuccess: () => {
                setSyncing(null);
                toast.success(`${svc?.name} synced successfully`);
            },
            onError: () => {
                setSyncing(null);
                toast.error(`${svc?.name} sync failed`);
            },
        });
    };

    const updateSyncFrequency = (id: string, freq: SyncFrequency) => {
        updateMutation.mutate({ serviceKey: id, syncFrequency: freq }, {
            onSuccess: () => toast.success('Sync frequency updated'),
        });
    };

    // ── Upload handlers ──
    const validateFile = (file: File): string | null => {
        const ext = '.' + file.name.split('.').pop()?.toLowerCase();
        if (!ACCEPTED_TYPES.includes(ext)) return `Invalid file type. Accepted: ${ACCEPTED_TYPES.join(', ')}`;
        if (file.size > MAX_SIZE) return `File exceeds 10 MB (${formatFileSize(file.size)}).`;
        return null;
    };

    const handleFileSelect = useCallback((file: File) => {
        const error = validateFile(file);
        if (error) { toast.error(error); return; }
        setSelectedFile(file);
        setUploadDataType('all');
        setUploadProgress(0);
        setUploading(false);
        setImportResult(null);
        setUploadModal(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFileSelect(file);
        e.target.value = '';
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFileSelect(file);
    }, [handleFileSelect]);

    const handleUpload = () => {
        if (!selectedFile) return;
        setUploading(true);
        setUploadProgress(0);
        setImportResult(null);

        // Simulate progress while the API call is in flight
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 90) { clearInterval(interval); return 90; }
                return prev + Math.random() * 10 + 3;
            });
        }, 300);

        importMutation.mutate(
            { file: selectedFile, dataType: uploadDataType as 'all' | 'clients' | 'policies' | 'claims' | 'invoices' | 'leads' | 'commissions' },
            {
                onSuccess: (result) => {
                    clearInterval(interval);
                    setUploadProgress(100);
                    setImportResult(result);

                    // Determine counts for toast
                    const isMixed = 'summary' in result;
                    const created = isMixed
                        ? (result as MixedImportResult).summary.totalCreated
                        : (result as ImportResult).created;
                    const errors = isMixed
                        ? (result as MixedImportResult).summary.totalErrors
                        : (result as ImportResult).errors.length;

                    const newImport: ImportRecord = {
                        name: selectedFile.name,
                        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                        by: 'Current User',
                        status: errors > 0 ? `${created} created, ${errors} errors` : `${created} created`,
                        ok: errors === 0,
                    };
                    setRecentImports(prev => [newImport, ...prev]);

                    if (errors > 0) {
                        toast.warning(`Imported ${created} records with ${errors} errors`);
                    } else {
                        toast.success(`Successfully imported ${created} records`);
                    }

                    setTimeout(() => {
                        setUploading(false);
                    }, 500);
                },
                onError: (error: unknown) => {
                    clearInterval(interval);
                    setUploadProgress(0);
                    setUploading(false);
                    const msg = (error as { response?: { data?: { message?: string } }, message?: string })?.response?.data?.message || (error as Error)?.message || 'Import failed';
                    const newImport: ImportRecord = {
                        name: selectedFile.name,
                        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                        by: 'Current User',
                        status: 'Failed',
                        ok: false,
                    };
                    setRecentImports(prev => [newImport, ...prev]);
                    toast.error(typeof msg === 'string' ? msg : 'Import failed');
                },
            },
        );
    };

    // ── Render ──
    return (
        <div className="flex flex-col gap-8">
            {/* ── KPI Strip ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Connected', value: connectedCount, total: services.length, icon: <Plug size={18} />, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
                    { label: 'Last Synced', value: lastSync ? new Date(lastSync).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'Never', icon: <RefreshCw size={18} />, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/30' },
                    { label: 'Active Webhooks', value: activeWebhooks, icon: <Zap size={18} />, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/30' },
                    { label: 'Available', value: services.length - connectedCount, icon: <Globe size={18} />, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/30' },
                ].map((kpi, i) => (
                    <Card key={i} padding="none" className="p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className={cn('p-3 rounded-xl shrink-0', kpi.bg, kpi.color)}>{kpi.icon}</div>
                        <div>
                            <p className="text-[10px] font-bold text-surface-500 uppercase tracking-wider">{kpi.label}</p>
                            <p className="text-xl font-bold text-surface-900 dark:text-white mt-0.5 tabular-nums">
                                {typeof kpi.value === 'number' && 'total' in kpi ? `${kpi.value}/${(kpi as {total?: number}).total}` : kpi.value}
                            </p>
                        </div>
                    </Card>
                ))}
            </div>

            {/* ── Category Tabs ── */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {CATEGORY_TABS.map(tab => (
                    <button
                        key={tab.value}
                        onClick={() => setActiveCategory(tab.value)}
                        className={cn(
                            'flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap border-b-2',
                            activeCategory === tab.value
                                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                                : 'border-transparent text-surface-500 hover:text-surface-900 dark:hover:text-white hover:border-surface-300 dark:hover:border-slate-700'
                        )}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* ── Integration Cards Grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map(svc => (
                    <div key={svc.id} className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-surface-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-lg hover:shadow-primary-500/5 transition-all duration-300 min-h-[160px]">
                        
                        {/* Status/Activity strip top */}
                        <div className={cn("absolute top-0 left-0 right-0 h-1 transition-colors z-20", svc.connected ? 'bg-emerald-500' : 'bg-transparent group-hover:bg-primary-300')} />

                        <div className="flex flex-col p-4 gap-3 z-10 flex-1">
                            {/* Header: Icon & Name */}
                            <div className="flex items-start justify-between gap-3">
                                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border border-black/5 dark:border-white/5 shadow-inner', svc.bgColor, svc.textColor)}>
                                    {svc.icon}
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-[9px] font-bold text-surface-400 uppercase tracking-widest text-right">{svc.category}</span>
                                    {svc.connected && (
                                        <div className="flex items-center gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" title="Connected" />
                                            <span className="text-[9px] font-semibold text-emerald-600 uppercase tracking-widest">Active</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Title & Description */}
                            <div className="flex flex-col gap-1 flex-1">
                                <h3 className="text-sm font-bold text-surface-900 dark:text-white tracking-tight leading-tight">{svc.name}</h3>
                                <p className="text-xs text-surface-500 dark:text-surface-400 line-clamp-2 leading-relaxed">{svc.description}</p>
                            </div>
                        </div>

                        {/* Actions block (Bottom) */}
                        <div className="flex items-center border-t border-surface-100 dark:border-slate-800 bg-surface-50/50 dark:bg-slate-800/30 p-3 shrink-0 z-10 transition-colors group-hover:bg-surface-50 dark:group-hover:bg-slate-800">
                            {svc.connected ? (
                                <div className="flex items-center gap-3 w-full justify-between">
                                    <div className="flex flex-col min-w-0 flex-1">
                                        <span className="text-[9px] text-surface-400 font-medium">Synced {svc.lastSyncAt ? new Date(svc.lastSyncAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'never'}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <button
                                            onClick={() => handleSync(svc.id)}
                                            disabled={syncing === svc.id}
                                            className="w-7 h-7 flex items-center justify-center rounded-md bg-white dark:bg-slate-900 border border-surface-200 dark:border-slate-700 text-primary-600 hover:text-white hover:bg-primary-600 hover:border-primary-600 transition-all shadow-sm disabled:opacity-50"
                                            title="Sync Now"
                                        >
                                            <RefreshCw size={12} className={cn(syncing === svc.id && 'animate-spin')} />
                                        </button>
                                        <button
                                            onClick={() => setConfigId(svc.id)}
                                            className="w-7 h-7 flex items-center justify-center rounded-md bg-white dark:bg-slate-900 border border-surface-200 dark:border-slate-700 text-surface-600 dark:text-surface-400 hover:text-surface-900 hover:bg-surface-100 dark:hover:bg-slate-800 hover:border-surface-300 dark:hover:border-slate-600 transition-all shadow-sm"
                                            title="Configure"
                                        >
                                            <Settings2 size={12} />
                                        </button>
                                    </div>
                                </div>
                            ) : svc.comingSoon ? (
                                <div className="w-full flex items-center justify-center gap-2 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-surface-100 dark:bg-slate-800 text-surface-400 dark:text-surface-500 cursor-not-allowed shadow-inner border border-surface-200 dark:border-slate-700">
                                    <Clock size={12} /> Coming Soon
                                </div>
                            ) : (
                                <button
                                    onClick={() => startConnect(svc.id)}
                                    className="w-full flex items-center justify-center gap-2 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-surface-900 dark:bg-white text-white dark:text-slate-900 hover:bg-primary-600 dark:hover:bg-primary-500 hover:text-white transition-colors shadow-sm"
                                >
                                    <Plug size={12} /> Connect
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Premium Bulk Data Import ── */}
            <section id="bulk-import" className="flex flex-col gap-6 mt-8 pt-8 relative">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-surface-200 dark:via-slate-800 to-transparent" />
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400 shadow-inner border border-primary-100 dark:border-primary-800/50">
                            <Upload size={18} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-surface-900 dark:text-white tracking-tight">Bulk Data Import</h2>
                            <p className="text-[13px] text-surface-500">Securely batch import records via CSV, Excel, or JSON.</p>
                        </div>
                    </div>
                </div>
                
                <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls,.json" className="hidden" onChange={handleInputChange} />
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    {/* Interactive Dropzone */}
                    <div className="lg:col-span-5 h-full">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDrop={handleDrop}
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            className={cn(
                                'h-full min-h-[260px] flex flex-col items-center justify-center p-8 rounded-2xl transition-all duration-300 group cursor-pointer border-2 relative overflow-hidden',
                                dragOver 
                                    ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/10 scale-[1.02] shadow-xl shadow-primary-500/10' 
                                    : 'border-dashed border-surface-200 dark:border-slate-700 bg-surface-50/30 dark:bg-slate-900/30 hover:bg-surface-100/50 dark:hover:bg-slate-800/50 hover:border-primary-300 dark:hover:border-primary-800'
                            )}
                        >
                            {/* Animated Background Pattern on Drag */}
                            <div className={cn("absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none", dragOver && "opacity-10")} 
                                 style={{ backgroundImage: 'radial-gradient(circle at center, var(--primary-color) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

                            <div className={cn('relative z-10 p-5 rounded-2xl mb-4 group-hover:-translate-y-2 transition-all duration-300 block', 
                                dragOver ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30 scale-110' : 'bg-white dark:bg-slate-800 border border-surface-200 dark:border-slate-700 shadow-sm text-surface-400 group-hover:text-primary-500 group-hover:border-primary-200 dark:group-hover:border-primary-800')}>
                                <FileSpreadsheet size={32} className={cn(dragOver && 'animate-pulse')} />
                            </div>
                            
                            <h3 className="relative z-10 text-[15px] font-bold text-surface-900 dark:text-white mb-1">
                                {dragOver ? 'Drop files now...' : 'Drag & drop files here'}
                            </h3>
                            <p className="relative z-10 text-[12px] text-surface-500 text-center mb-6 px-4">
                                Supported formats: .CSV, .XLSX, .JSON<br/>Maximum file size: 10MB
                            </p>
                            
                            <Button 
                                variant={dragOver ? 'primary' : 'outline'} 
                                className={cn("relative z-10 rounded-xl px-6 py-2 transition-transform duration-300", dragOver && "scale-105")}
                                onClick={(e: React.MouseEvent) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                            >
                                Browse Computer
                            </Button>
                        </div>
                    </div>

                    {/* Minimal Recent Activity Log */}
                    <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-surface-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col h-full min-h-[260px]">
                        <div className="px-6 py-4 border-b border-surface-100 dark:border-slate-800 flex items-center justify-between bg-surface-50/50 dark:bg-slate-800/30">
                            <h3 className="text-[11px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest flex items-center gap-2">
                                <Clock size={14} /> Recent Imports
                            </h3>
                            {recentImports.length > 0 && <span className="text-[10px] bg-surface-200 dark:bg-slate-700 text-surface-600 dark:text-surface-300 px-2 py-0.5 rounded-full font-bold">{recentImports.length}</span>}
                        </div>
                        
                        <div className="flex-1 overflow-y-auto w-full p-2">
                            {recentImports.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-surface-400 dark:text-surface-500 space-y-3 p-8 text-center opacity-70">
                                    <div className="p-4 rounded-full bg-surface-100 dark:bg-slate-800">
                                        <Upload size={24} className="opacity-50" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-surface-600 dark:text-surface-300">No import history yet</p>
                                        <p className="text-xs mt-1">Files you upload will appear here.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-1 p-2">
                                    {recentImports.map((row, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-slate-800/50 transition-colors group border border-transparent hover:border-surface-100 dark:hover:border-slate-800">
                                            <div className="flex items-center gap-3.5 flex-1 min-w-0">
                                                <div className={cn("p-2 rounded-lg shrink-0 transition-colors", 
                                                    row.ok ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-500 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40" 
                                                           : "bg-danger-50 dark:bg-danger-900/20 text-danger-600 dark:text-danger-500 group-hover:bg-danger-100 dark:group-hover:bg-danger-900/40")}>
                                                    <FileSpreadsheet size={16} />
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-[13px] font-bold text-surface-900 dark:text-white truncate" title={row.name}>{row.name}</span>
                                                    <span className="text-[11px] text-surface-500 flex items-center gap-1.5 mt-0.5">
                                                        <span>{row.date}</span>
                                                        <span className="w-1 h-1 rounded-full bg-surface-300 dark:bg-slate-600" />
                                                        <span className={cn('font-semibold', row.ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-danger-600 dark:text-danger-400')}>
                                                            {row.status}
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="hidden sm:flex shrink-0 pl-4 items-center gap-2">
                                                {row.ok ? (
                                                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                                                        <Check size={10} /> Success
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-danger-50 dark:bg-danger-900/20 border border-danger-100 dark:border-danger-800/50 text-[10px] font-bold text-danger-700 dark:text-danger-400 uppercase tracking-wider">
                                                        <AlertTriangle size={10} /> Failed
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Premium OAuth Connection Modal ── */}
            {connectingService && connectionStep !== 'idle' && (
                <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 sm:p-0">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={connectionStep !== 'connecting' ? closeConnect : undefined} />
                    
                    <div className="relative bg-white dark:bg-slate-900 rounded-3xl border border-surface-200/50 dark:border-slate-800/50 shadow-2xl w-full max-w-[420px] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                        
                        {/* Dynamic Top Glow */}
                        <div className="absolute top-0 left-0 right-0 h-1.5 z-20" style={{ background: `linear-gradient(90deg, transparent, ${connectingService.brandColor}, transparent)` }} />

                        {/* Modal Header */}
                        <div className="flex flex-col px-8 pt-8 pb-6 text-center border-b border-surface-100 dark:border-slate-800/60">
                            {connectionStep !== 'connecting' && (
                                <button onClick={closeConnect} className="absolute top-4 right-4 text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 transition-colors p-2 rounded-full hover:bg-surface-100 dark:hover:bg-slate-800">
                                    <X size={18} />
                                </button>
                            )}
                            
                            <div className="relative mx-auto mb-5">
                                <div className="absolute inset-0 blur-xl opacity-30" style={{ backgroundColor: connectingService.brandColor }} />
                                <div className={cn('relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg border border-black/5 dark:border-white/10', connectingService.bgColor, connectingService.textColor)}>
                                    {connectingService.icon}
                                </div>
                            </div>
                            
                            <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-1 tracking-tight">Connect {connectingService.name}</h3>
                            <p className="text-[13px] text-surface-500 font-medium">
                                {connectionStep === 'signin' ? 'Sign in to authenticate' : connectionStep === 'permissions' ? 'Review required permissions' : 'Establishing secure link'}
                            </p>
                            
                            {/* Minimal Step Trackers */}
                            <div className="flex justify-center gap-1.5 mt-6">
                                {['signin', 'permissions', 'success'].map((step, i) => (
                                    <div key={step} className={cn('h-1.5 rounded-full transition-all duration-500',
                                        (connectionStep === 'connecting' && i < 2) || connectionStep === step || ['signin', 'permissions', 'connecting', 'success'].indexOf(connectionStep) > i
                                            ? 'w-6 bg-primary-600' : 'w-1.5 bg-surface-200 dark:bg-slate-700'
                                    )} />
                                ))}
                            </div>
                        </div>

                        {/* Step Content */}
                        <div className="px-8 py-7 bg-surface-50/30 dark:bg-slate-900/50">
                            {connectionStep === 'signin' && (
                                <div className="animate-in slide-in-from-right-4 fade-in duration-300">
                                    {connectingService.apiKeyRequired ? (
                                        <div className="space-y-4">
                                            <div className="space-y-3">
                                                <label className="text-[11px] font-bold text-surface-500 uppercase tracking-widest block">API Credentials</label>
                                                <input
                                                    type="text"
                                                    placeholder="API Key / Public Key"
                                                    value={apiKeyInput}
                                                    onChange={e => setApiKeyInput(e.target.value)}
                                                    className="w-full px-4 py-3 text-sm border border-surface-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-shadow"
                                                />
                                                <input
                                                    type="password"
                                                    placeholder="Secret Key (optional)"
                                                    value={apiSecretInput}
                                                    onChange={e => setApiSecretInput(e.target.value)}
                                                    className="w-full px-4 py-3 text-sm border border-surface-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-shadow"
                                                />
                                            </div>
                                            {connectingService.webhookUrl && (
                                                <div className="bg-primary-50 dark:bg-primary-900/10 rounded-xl p-4 border border-primary-100 dark:border-primary-900/30 mt-4">
                                                    <p className="text-[11px] font-bold text-primary-700 dark:text-primary-400 mb-1.5 uppercase tracking-wider">Webhook URL Callback</p>
                                                    <code className="text-[12px] bg-white dark:bg-slate-950 px-2.5 py-1.5 rounded-md text-primary-800 dark:text-primary-300 break-all block border border-primary-200 dark:border-primary-800/50">{connectingService.webhookUrl}</code>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <p className="text-[14px] text-surface-600 dark:text-surface-400 leading-relaxed mb-6">
                                                Allow <strong>Brokerium Workspace</strong> to access your <strong>{connectingService.name}</strong> account for seamless data synchronization.
                                            </p>
                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold border border-emerald-100 dark:border-emerald-800">
                                                <Shield size={12} /> Secure OAuth 2.0 Login
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {connectionStep === 'permissions' && (
                                <div className="space-y-4 animate-in slide-in-from-right-4 fade-in duration-300">
                                    <p className="text-[13px] text-surface-600 dark:text-surface-400 text-center mb-5">
                                        <strong>Brokerium Workspace</strong> is requesting the following access:
                                    </p>
                                    <div className="space-y-2.5">
                                        {connectingService.scopes.map((scope, idx) => (
                                            <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-surface-100 dark:border-slate-800 shadow-sm">
                                                <CheckCircle2 size={18} className="text-primary-500 shrink-0 mt-0.5" />
                                                <span className="text-[13px] font-medium text-surface-800 dark:text-surface-200 leading-snug">{scope}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-[11px] text-surface-400 flex items-center justify-center gap-1.5 mt-6 text-center">
                                        <Shield size={12} /> You can revoke access at any time from settings.
                                    </p>
                                </div>
                            )}

                            {connectionStep === 'connecting' && (
                                <div className="text-center py-6 animate-in zoom-in-95 fade-in duration-300">
                                    <div className="relative w-20 h-20 mx-auto mb-6">
                                        <div className="absolute inset-0 border-4 border-primary-100 dark:border-slate-800 rounded-full" />
                                        <div className="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin" />
                                        <div className={cn("absolute inset-0 flex items-center justify-center p-5 rounded-full", connectingService.textColor)}>
                                            {connectingService.icon}
                                        </div>
                                    </div>
                                    <p className="text-[15px] font-bold text-surface-900 dark:text-white">Authorizing...</p>
                                    <p className="text-xs text-surface-500 mt-1.5">Waiting for {connectingService.name}</p>
                                </div>
                            )}

                            {connectionStep === 'success' && (
                                <div className="text-center py-6 animate-in zoom-in-95 fade-in duration-500">
                                    <div className="w-20 h-20 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                                        <Check size={36} className="text-white" />
                                    </div>
                                    <p className="text-2xl font-black tracking-tight text-surface-900 dark:text-white mb-2">Connected Successfully!</p>
                                    <p className="text-[14px] text-surface-500 leading-relaxed max-w-[280px] mx-auto">
                                        <strong>{connectingService.name}</strong> is now securely linked to your workspace.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer Actions */}
                        <div className="px-8 py-5 border-t border-surface-100 dark:border-slate-800/60 bg-white dark:bg-slate-900 flex items-center justify-end gap-3">
                            {connectionStep === 'success' ? (
                                <Button variant="primary" className="w-full py-6 text-[15px] rounded-xl shadow-lg" onClick={closeConnect}>
                                    Return to Settings
                                </Button>
                            ) : connectionStep !== 'connecting' ? (
                                <>
                                    <Button variant="outline" className="flex-1 py-6 rounded-xl border-surface-200 dark:border-slate-700 hover:bg-surface-50" onClick={closeConnect}>
                                        Cancel
                                    </Button>
                                    <Button 
                                        variant="primary" 
                                        className="flex-1 py-6 rounded-xl shadow-md" 
                                        onClick={progressConnect} 
                                        rightIcon={<ArrowRight size={16} />}
                                    >
                                        {connectionStep === 'signin' ? (connectingService.apiKeyRequired ? 'Verify Keys' : 'Continue') : 'Authorize App'}
                                    </Button>
                                </>
                            ) : null}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Configuration Slide-out Panel ── */}
            {configService && (
                <div className="fixed inset-0 z-[400] flex items-end sm:items-center justify-end">
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fade-in" onClick={() => setConfigId(null)} />
                    <div className="relative bg-white dark:bg-slate-900 w-full sm:w-[440px] h-full sm:h-auto sm:max-h-[90vh] overflow-y-auto border-l border-surface-200 dark:border-slate-800 shadow-2xl animate-fade-in sm:rounded-l-2xl">
                        {/* Panel Header */}
                        <div className="sticky top-0 bg-white dark:bg-slate-900 flex items-center justify-between px-6 py-5 border-b border-surface-100 dark:border-slate-800 z-10">
                            <div className="flex items-center gap-3">
                                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', configService.bgColor, configService.textColor)}>
                                    {configService.icon}
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-surface-900 dark:text-white">{configService.name}</h3>
                                    <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Connected</p>
                                </div>
                            </div>
                            <button onClick={() => setConfigId(null)} className="text-surface-400 hover:text-surface-600 p-1 rounded-lg hover:bg-surface-100">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="px-6 py-5 space-y-6">
                            {/* Connected Account */}
                            <div>
                                <label className="text-[10px] font-bold text-surface-400 uppercase tracking-wider mb-2 block">Connected Account</label>
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-50 dark:bg-slate-800 border border-surface-100 dark:border-slate-700">
                                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', configService.bgColor, configService.textColor)}>
                                        {configService.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-surface-900 dark:text-white truncate">{configService.connectedEmail}</p>
                                        <p className="text-[10px] text-surface-400">Connected {configService.connectedAt ? new Date(configService.connectedAt).toLocaleDateString() : ''}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Sync Frequency */}
                            <div>
                                <label className="text-[10px] font-bold text-surface-400 uppercase tracking-wider mb-2 block">Sync Frequency</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {SYNC_OPTIONS.map(opt => (
                                        <button
                                            key={opt.value}
                                            onClick={() => updateSyncFrequency(configService.id, opt.value)}
                                            className={cn(
                                                'px-3 py-2.5 rounded-xl text-xs font-medium border transition-all text-left',
                                                configService.syncFrequency === opt.value
                                                    ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                                                    : 'bg-white dark:bg-slate-800 text-surface-600 dark:text-surface-300 border-surface-200 dark:border-slate-700 hover:border-primary-300'
                                            )}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Last Sync + Manual Sync */}
                            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-50 dark:bg-slate-800 border border-surface-100 dark:border-slate-700">
                                <div>
                                    <p className="text-[10px] font-bold text-surface-400 uppercase tracking-wider">Last Synced</p>
                                    <p className="text-sm font-medium text-surface-900 dark:text-white mt-0.5">
                                        {configService.lastSyncAt ? new Date(configService.lastSyncAt).toLocaleString() : 'Never'}
                                    </p>
                                </div>
                                <Button variant="outline" size="sm" leftIcon={<RefreshCw size={14} className={cn(syncing === configService.id && 'animate-spin')} />}
                                    onClick={() => handleSync(configService.id)} disabled={syncing === configService.id}>
                                    Sync Now
                                </Button>
                            </div>

                            {/* Webhook URL */}
                            {configService.webhookUrl && (
                                <div>
                                    <label className="text-[10px] font-bold text-surface-400 uppercase tracking-wider mb-2 block">Webhook URL</label>
                                    <div className="p-3 rounded-xl bg-surface-50 dark:bg-slate-800 border border-surface-100 dark:border-slate-700">
                                        <code className="text-[11px] text-surface-600 dark:text-surface-300 break-all">{configService.webhookUrl}</code>
                                    </div>
                                </div>
                            )}

                            {/* Google Calendar Actions */}
                            {configService.id === 'google-calendar' && configService.connected && (
                                <div>
                                    <label className="text-[10px] font-bold text-surface-400 uppercase tracking-wider mb-2 block">Calendar Sync</label>
                                    <div className="grid grid-cols-1 gap-2">
                                        <Button variant="outline" size="sm" className="w-full justify-center"
                                            leftIcon={<RefreshCw size={14} className={cn(calendarSync.isPending && 'animate-spin')} />}
                                            onClick={() => {
                                                calendarSync.mutate(undefined, {
                                                    onSuccess: (r) => {
                                                        if (r?.push && r?.pull) {
                                                            toast.success(`Pushed ${r.push.pushed} events, pulled ${r.pull.pulled} events`);
                                                        } else {
                                                            toast.success('Calendar synced');
                                                        }
                                                    },
                                                    onError: () => toast.error('Calendar sync failed'),
                                                });
                                            }}
                                            disabled={calendarSync.isPending}>
                                            {calendarSync.isPending ? 'Syncing...' : 'Full Bi-directional Sync'}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Google Sheets Actions */}
                            {configService.id === 'google-sheets' && configService.connected && (
                                <div>
                                    <label className="text-[10px] font-bold text-surface-400 uppercase tracking-wider mb-2 block">Export to Sheets</label>
                                    <div className="grid grid-cols-3 gap-2 mb-3">
                                        {['clients', 'policies', 'claims', 'commissions', 'financial', 'renewals'].map(t => (
                                            <button key={t} onClick={() => setSheetsExportType(t)}
                                                className={cn('px-2 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all capitalize',
                                                    sheetsExportType === t ? 'bg-primary-600 text-white border-primary-600' : 'bg-white dark:bg-slate-800 text-surface-600 border-surface-200 dark:border-slate-700 hover:border-primary-300'
                                                )}>
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                    <Button variant="outline" size="sm" className="w-full justify-center"
                                        leftIcon={<ExternalLink size={14} />}
                                        onClick={() => {
                                            sheetsExport.mutate({ type: sheetsExportType }, {
                                                onSuccess: (r) => {
                                                    toast.success(`Exported ${r.rowCount} rows to Google Sheets`);
                                                    window.open(r.spreadsheetUrl, '_blank');
                                                },
                                                onError: () => toast.error('Sheets export failed'),
                                            });
                                        }}
                                        disabled={sheetsExport.isPending}>
                                        {sheetsExport.isPending ? 'Exporting...' : `Export ${sheetsExportType}`}
                                    </Button>
                                </div>
                            )}

                            {/* Google Drive Actions */}
                            {configService.id === 'google-drive' && configService.connected && (
                                <div>
                                    <label className="text-[10px] font-bold text-surface-400 uppercase tracking-wider mb-2 block">Drive Mirror</label>
                                    <Button variant="outline" size="sm" className="w-full justify-center"
                                        leftIcon={<Cloud size={14} />}
                                        onClick={() => {
                                            driveMirror.mutate(undefined, {
                                                onSuccess: (r) => toast.success(`Mirrored ${r.mirrored} documents, ${r.skipped} skipped`),
                                                onError: () => toast.error('Drive mirror failed'),
                                            });
                                        }}
                                        disabled={driveMirror.isPending}>
                                        {driveMirror.isPending ? 'Mirroring...' : 'Mirror Documents to Drive'}
                                    </Button>
                                </div>
                            )}

                            {/* Activity Log */}
                            <div>
                                <label className="text-[10px] font-bold text-surface-400 uppercase tracking-wider mb-2 block">Activity Log</label>
                                {configService.syncEvents.length === 0 ? (
                                    <p className="text-xs text-surface-400 py-4 text-center">No activity yet</p>
                                ) : (
                                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                                        {configService.syncEvents.map(evt => (
                                            <div key={evt.id} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-surface-50 dark:bg-slate-800">
                                                {evt.type === 'sync' && <RefreshCw size={12} className="text-blue-500 mt-0.5 shrink-0" />}
                                                {evt.type === 'connected' && <CheckCircle2 size={12} className="text-emerald-500 mt-0.5 shrink-0" />}
                                                {evt.type === 'disconnected' && <XCircle size={12} className="text-danger-500 mt-0.5 shrink-0" />}
                                                {evt.type === 'error' && <AlertTriangle size={12} className="text-amber-500 mt-0.5 shrink-0" />}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-surface-700 dark:text-surface-300">{evt.message}</p>
                                                    <p className="text-[10px] text-surface-400 mt-0.5">{new Date(evt.timestamp).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Disconnect */}
                            <button
                                onClick={() => disconnect(configService.id)}
                                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-danger-600 border border-danger-200 dark:border-danger-800 hover:bg-danger-50 dark:hover:bg-danger-950/30 transition-all"
                            >
                                <XCircle size={14} /> Disconnect Integration
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Premium Upload Modal ── */}
            {uploadModal && selectedFile && (
                <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 sm:p-0">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={!uploading ? () => { setUploadModal(false); setSelectedFile(null); setUploadProgress(0); } : undefined} />
                    
                    <div className="relative bg-white dark:bg-slate-900 rounded-3xl border border-surface-200/50 dark:border-slate-800/50 shadow-2xl w-full max-w-[500px] animate-in fade-in zoom-in-95 duration-300 overflow-hidden">
                        
                        {/* Dynamic Top Glow based on file state */}
                        <div className={cn("absolute top-0 left-0 right-0 h-1.5 z-20 transition-colors duration-500", 
                            importResult ? 'bg-emerald-500' : 'bg-primary-500'
                        )} />

                        {/* Modal Header */}
                        <div className="flex flex-col px-8 pt-8 pb-6 text-center border-b border-surface-100 dark:border-slate-800/60">
                            {!uploading && (
                                <button onClick={() => { setUploadModal(false); setSelectedFile(null); }} className="absolute top-4 right-4 text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 transition-colors p-2 rounded-full hover:bg-surface-100 dark:hover:bg-slate-800">
                                    <X size={18} />
                                </button>
                            )}
                            
                            <div className="relative mx-auto mb-4">
                                <div className={cn("absolute inset-0 blur-xl opacity-30 transition-colors duration-500", importResult ? 'bg-emerald-500' : 'bg-primary-500')} />
                                <div className={cn('relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg border border-black/5 dark:border-white/10 transition-colors duration-500', 
                                    importResult ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400' : 'bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400'
                                )}>
                                    {importResult ? <CheckCircle2 size={32} /> : <Upload size={32} />}
                                </div>
                            </div>
                            
                            <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-1 tracking-tight">
                                {importResult ? 'Import Complete' : 'Import Configuration'}
                            </h3>
                            <p className="text-[13px] text-surface-500 font-medium">
                                {importResult ? 'Your file has been processed successfully' : 'Map your data and review settings before import'}
                            </p>
                        </div>

                        <div className="px-8 py-7 bg-surface-50/30 dark:bg-slate-900/50 space-y-6">
                            
                            {/* Selected File Card */}
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-950 border border-surface-200 dark:border-slate-800 shadow-sm animate-in slide-in-from-bottom-4 fade-in duration-500 delay-100">
                                <div className={cn("p-3 rounded-xl", importResult ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600" : "bg-primary-50 dark:bg-primary-900/20 text-primary-600")}>
                                    <FileSpreadsheet size={24} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[15px] font-bold text-surface-900 dark:text-white truncate" title={selectedFile.name}>{selectedFile.name}</p>
                                    <p className="text-xs text-surface-500 font-medium mt-0.5">{formatFileSize(selectedFile.size)} • {selectedFile.name.split('.').pop()?.toUpperCase()}</p>
                                </div>
                                {importResult && (
                                    <div className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold uppercase tracking-wider shrink-0">
                                        Done
                                    </div>
                                )}
                            </div>

                            {/* Data Type Selection */}
                            {!importResult && (
                                <div className="animate-in slide-in-from-bottom-4 fade-in duration-500 delay-200">
                                    <label className="text-[11px] font-bold text-surface-500 uppercase tracking-widest mb-3 block">Target Destination</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                                        {DATA_TYPES.map(dt => (
                                            <button key={dt.value} onClick={() => !uploading && setUploadDataType(dt.value)} disabled={uploading}
                                                className={cn('px-4 py-3 rounded-xl text-[13px] font-bold transition-all border outline-none text-left flex items-center justify-between group',
                                                    uploadDataType === dt.value 
                                                        ? dt.value === 'all' 
                                                            ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-500/20' 
                                                            : 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-500/20' 
                                                        : 'bg-white dark:bg-slate-950 text-surface-600 dark:text-surface-300 border-surface-200 dark:border-slate-800 hover:border-primary-300 dark:hover:border-primary-700'
                                                )}>
                                                {dt.label}
                                                {uploadDataType === dt.value && <Check strokeWidth={3} size={14} className="opacity-80" />}
                                            </button>
                                        ))}
                                    </div>
                                    {uploadDataType === 'all' && (
                                        <div className="mt-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 flex items-start gap-2.5">
                                            <AlertTriangle size={14} className="text-amber-600 dark:text-amber-500 mt-0.5 shrink-0" />
                                            <p className="text-[12px] text-amber-800 dark:text-amber-400 font-medium leading-snug">
                                                <strong>Smart Routing Active:</strong> Brokerium will automatically detect the data types based on your column headers.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Active Upload Progress */}
                            {uploading && !importResult && (
                                <div className="animate-in zoom-in-95 fade-in duration-300">
                                    <div className="flex justify-between items-end mb-2.5">
                                        <span className="text-[13px] font-medium text-surface-700 dark:text-surface-300 flex items-center gap-2">
                                            <Loader2 size={14} className="animate-spin text-primary-600" />
                                            {uploadProgress >= 90 ? 'Finalizing records...' : 'Encrypting and syncing...'}
                                        </span>
                                        <span className="text-[15px] font-black text-primary-600 dark:text-primary-400 tabular-nums">{Math.min(100, Math.round(uploadProgress))}%</span>
                                    </div>
                                    <div className="w-full h-3 bg-surface-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                                        <div className={cn('h-full rounded-full transition-all duration-300 ease-out', uploadProgress >= 100 ? 'bg-emerald-500' : 'bg-primary-500')} style={{ width: `${Math.min(100, uploadProgress)}%` }}>
                                            <div className="w-full h-full bg-white/20 animate-pulse" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Import Results View */}
                            {importResult && (
                                <div className="space-y-4 animate-in slide-in-from-bottom-4 fade-in duration-500">
                                    
                                    {/* Stat Grid */}
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-900/30 text-center shadow-sm">
                                            <p className="text-3xl font-black text-emerald-600 tabular-nums tracking-tighter">
                                                {'summary' in importResult ? importResult.summary.totalCreated : importResult.created}
                                            </p>
                                            <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-500 uppercase tracking-widest mt-1">Created</p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 dark:bg-amber-950/30 dark:border-amber-900/30 text-center shadow-sm">
                                            <p className="text-3xl font-black text-amber-600 tabular-nums tracking-tighter">
                                                {'summary' in importResult ? importResult.summary.totalSkipped : importResult.skipped}
                                            </p>
                                            <p className="text-[11px] font-bold text-amber-700 dark:text-amber-500 uppercase tracking-widest mt-1">Skipped</p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-red-50 border border-red-100 dark:bg-red-950/30 dark:border-red-900/30 text-center shadow-sm">
                                            <p className="text-3xl font-black text-red-600 tabular-nums tracking-tighter">
                                                {'summary' in importResult ? importResult.summary.totalErrors : importResult.errors.length}
                                            </p>
                                            <p className="text-[11px] font-bold text-red-700 dark:text-red-500 uppercase tracking-widest mt-1">Errors</p>
                                        </div>
                                    </div>

                                    {/* Detailed Breakdown */}
                                    {'summary' in importResult ? (
                                        <div className="space-y-2 mt-2">
                                            <p className="text-[11px] font-bold text-surface-500 uppercase tracking-widest px-2">Data Processed</p>
                                            <div className="bg-white dark:bg-slate-950 border border-surface-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-surface-100 dark:divide-slate-800">
                                                {importResult.results.map((r: ImportResult, i: number) => (
                                                    <div key={i} className="flex items-center justify-between text-[13px] px-4 py-3">
                                                        <span className="font-bold text-surface-900 dark:text-white capitalize flex items-center gap-2">
                                                            <div className="w-2 h-2 rounded-full bg-primary-500" />
                                                            {r.dataType}
                                                        </span>
                                                        <span className="text-surface-500 font-medium">
                                                            <span className="text-emerald-600">+{r.created}</span> / <span className="text-amber-600">{r.skipped} skip</span>{r.errors.length > 0 && <span className="text-red-600"> / {r.errors.length} err</span>}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        importResult.errors.length > 0 && (
                                            <div className="space-y-2 mt-2">
                                                <p className="text-[11px] font-bold text-surface-500 uppercase tracking-widest px-2">Error Log</p>
                                                <div className="bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/30 rounded-xl overflow-y-auto max-h-36 p-1">
                                                    {importResult.errors.slice(0, 50).map((err, i) => (
                                                        <div key={i} className="flex gap-2.5 text-[12px] px-3 py-2 rounded-lg text-red-800 dark:text-red-400 hover:bg-red-100/50 dark:hover:bg-red-900/20 transition-colors">
                                                            <span className="font-mono font-bold shrink-0 opacity-70">Row {err.row}:</span>
                                                            <span className="truncate">{err.message}</span>
                                                        </div>
                                                    ))}
                                                    {importResult.errors.length > 50 && (
                                                        <div className="px-3 py-2 text-[11px] text-red-600 font-bold text-center border-t border-red-200 dark:border-red-900/30">
                                                            ...and {importResult.errors.length - 50} more errors
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer Actions */}
                        <div className="px-8 py-5 border-t border-surface-100 dark:border-slate-800/60 bg-white dark:bg-slate-900 flex items-center justify-end gap-3">
                            {importResult ? (
                                <Button variant="primary" className="w-full py-6 text-[15px] rounded-xl shadow-lg bg-emerald-600 hover:bg-emerald-700 border-emerald-600" onClick={() => { setUploadModal(false); setSelectedFile(null); setImportResult(null); setUploadProgress(0); setUploading(false); }}>
                                    Done
                                </Button>
                            ) : (
                                <>
                                    <Button variant="outline" className="flex-1 py-6 rounded-xl border-surface-200 dark:border-slate-700 hover:bg-surface-50" onClick={() => { setUploadModal(false); setSelectedFile(null); }} disabled={uploading}>
                                        Cancel
                                    </Button>
                                    <Button 
                                        variant="primary" 
                                        className="flex-[2] py-6 rounded-xl shadow-md" 
                                        onClick={handleUpload} 
                                        disabled={uploading} 
                                        leftIcon={uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                                    >
                                        {uploading ? 'Processing Data...' : 'Begin Import'}
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
