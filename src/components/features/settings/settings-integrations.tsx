'use client';

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { cn, formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import {
    Calendar, Table2, Cloud, Mail, Receipt, Landmark, CreditCard,
    Smartphone, MessageCircle, Hash, Check, X, ChevronRight,
    RefreshCw, Settings2, Activity, Zap, Shield, Clock, ExternalLink,
    Upload, FileSpreadsheet, Trash2, Eye, Search, AlertTriangle,
    CheckCircle2, XCircle, Plug, Globe, Key, ArrowRight, Loader2,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/data-display/status-badge';
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

type IntegrationCategory = 'all' | 'productivity' | 'accounting' | 'payment' | 'communication';
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
            icon: <Calendar size={24} />, brandColor: '#4285F4', bgColor: 'bg-blue-50 dark:bg-blue-950/30',
            textColor: 'text-blue-600 dark:text-blue-400', category: 'productivity',
            connected: false, syncFrequency: '1h', syncEvents: [],
            features: ['Auto-create renewal events', 'Sync client meetings', 'Task deadline reminders', 'Two-way sync'],
            scopes: ['View and edit calendar events', 'View calendar settings', 'Create new calendars'],
        },
        {
            id: 'google-sheets', name: 'Google Sheets',
            description: 'Export reports, client lists, and financial data directly to Google Sheets for analysis.',
            icon: <Table2 size={24} />, brandColor: '#0F9D58', bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
            textColor: 'text-emerald-600 dark:text-emerald-400', category: 'productivity',
            connected: false, syncFrequency: '24h', syncEvents: [],
            features: ['Auto-export monthly reports', 'Live client list sync', 'Commission tracking sheets', 'Custom templates'],
            scopes: ['View and manage spreadsheets', 'Create new spreadsheets', 'Access Google Drive files'],
        },
        {
            id: 'google-drive', name: 'Google Drive',
            description: 'Store policy documents, claim photos, and KYC files securely in the cloud.',
            icon: <Cloud size={24} />, brandColor: '#FBBC04', bgColor: 'bg-amber-50 dark:bg-amber-950/30',
            textColor: 'text-amber-600 dark:text-amber-400', category: 'productivity',
            connected: false, syncFrequency: '15m', syncEvents: [],
            features: ['Auto-upload policy documents', 'Claim photo backup', 'KYC file storage', 'Folder organization'],
            scopes: ['View and manage files', 'Create folders', 'Share files with team'],
        },
        {
            id: 'outlook', name: 'Microsoft Outlook',
            description: 'Send policy documents, renewal reminders, and notifications via Outlook email.',
            icon: <Mail size={24} />, brandColor: '#0078D4', bgColor: 'bg-sky-50 dark:bg-sky-950/30',
            textColor: 'text-sky-600 dark:text-sky-400', category: 'communication',
            connected: false, syncFrequency: '1h', syncEvents: [],
            features: ['Send policy docs via email', 'Automated renewal reminders', 'Client notifications', 'Calendar sync'],
            scopes: ['Send mail on your behalf', 'Read your contacts', 'Access your calendar'],
        },
        {
            id: 'quickbooks', name: 'QuickBooks Online',
            description: 'Sync invoices, payments, and client data with QuickBooks for seamless accounting.',
            icon: <Receipt size={24} />, brandColor: '#2CA01C', bgColor: 'bg-green-50 dark:bg-green-950/30',
            textColor: 'text-green-600 dark:text-green-400', category: 'accounting',
            connected: false, syncFrequency: '6h', syncEvents: [],
            features: ['Invoice sync', 'Payment recording', 'Expense tracking', 'Chart of accounts mapping'],
            scopes: ['Read and write accounting data', 'Manage customers', 'View reports'],
        },
        {
            id: 'xero', name: 'Xero',
            description: 'Seamless accounting data synchronization with Xero for financial reporting.',
            icon: <Landmark size={24} />, brandColor: '#13B5EA', bgColor: 'bg-cyan-50 dark:bg-cyan-950/30',
            textColor: 'text-cyan-600 dark:text-cyan-400', category: 'accounting',
            connected: false, syncFrequency: '6h', syncEvents: [],
            features: ['Invoice sync', 'Bank reconciliation', 'Expense claims', 'Financial reports'],
            scopes: ['Read and write accounting data', 'Manage contacts', 'View bank transactions'],
        },
        {
            id: 'paystack', name: 'Paystack',
            description: 'Accept premium payments via Mobile Money, Card, and Bank Transfer in Ghana.',
            icon: <CreditCard size={24} />, brandColor: '#00C3F7', bgColor: 'bg-teal-50 dark:bg-teal-950/30',
            textColor: 'text-teal-600 dark:text-teal-400', category: 'payment',
            connected: false, syncFrequency: 'manual', syncEvents: [], apiKeyRequired: true,
            features: ['Accept Mobile Money', 'Card payments', 'Bank transfers', 'Automatic receipts'],
            scopes: ['Process transactions', 'View payment history', 'Manage customers'],
            webhookUrl: 'https://api.yourdomain.com/webhooks/paystack',
        },
        {
            id: 'mtn-momo', name: 'MTN MoMo',
            description: 'Collect premium payments directly via MTN Mobile Money — Ghana\'s most popular mobile wallet.',
            icon: <Smartphone size={24} />, brandColor: '#FFC300', bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
            textColor: 'text-yellow-600 dark:text-yellow-500', category: 'payment',
            connected: false, syncFrequency: 'manual', syncEvents: [], apiKeyRequired: true,
            features: ['Collect premiums via MoMo', 'Instant payment confirmation', 'SMS receipts', 'Auto-reconciliation'],
            scopes: ['Collection API access', 'Disbursement API access', 'Account balance check'],
        },
        {
            id: 'whatsapp', name: 'WhatsApp Business',
            description: 'Send policy documents, renewal alerts, and claim updates to clients via WhatsApp.',
            icon: <MessageCircle size={24} />, brandColor: '#25D366', bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
            textColor: 'text-emerald-600 dark:text-emerald-400', category: 'communication',
            connected: false, syncFrequency: 'manual', syncEvents: [], apiKeyRequired: true,
            features: ['Send policy documents', 'Renewal alerts', 'Claim status updates', 'Template messages'],
            scopes: ['Send messages', 'Send media files', 'Read message status'],
        },
        {
            id: 'slack', name: 'Slack',
            description: 'Get instant team notifications for new claims, escalations, and important updates.',
            icon: <Hash size={24} />, brandColor: '#4A154B', bgColor: 'bg-purple-50 dark:bg-purple-950/30',
            textColor: 'text-purple-600 dark:text-purple-400', category: 'communication',
            connected: false, syncFrequency: '15m', syncEvents: [],
            features: ['New claim alerts', 'Escalation notifications', 'Daily summary reports', 'Channel routing'],
            scopes: ['Post to channels', 'Read channel info', 'Send direct messages'],
        },
    ];
}

const CATEGORY_TABS: { value: IntegrationCategory; label: string; icon: React.ReactNode }[] = [
    { value: 'all', label: 'All', icon: <Globe size={14} /> },
    { value: 'productivity', label: 'Productivity', icon: <Zap size={14} /> },
    { value: 'accounting', label: 'Accounting', icon: <Receipt size={14} /> },
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

/** Merges static service catalog with backend integration records. */
function mergeWithApiData(catalog: IntegrationService[], apiData: any[]): IntegrationService[] {
    const byKey = new Map<string, any>();
    for (const rec of apiData) byKey.set(rec.serviceKey, rec);
    return catalog.map(svc => {
        const db = byKey.get(svc.id);
        if (!db) return svc;
        return {
            ...svc,
            connected: db.connected,
            connectedAt: db.connectedAt,
            connectedEmail: db.connectedEmail,
            syncFrequency: db.syncFrequency || svc.syncFrequency,
            lastSyncAt: db.lastSyncAt,
            syncEvents: Array.isArray(db.syncEvents) ? db.syncEvents : [],
        };
    });
}

// ─── Main Component ─────────────────────────────────────────

export function SettingsIntegrations() {
    // ── API hooks ──
    const { data: apiIntegrations } = useIntegrations();
    const connectMutation = useConnectIntegration();
    const disconnectMutation = useDisconnectIntegration();
    const updateMutation = useUpdateIntegration();
    const syncMutation = useSyncIntegration();
    const googleAuthUrl = useGoogleAuthUrl();
    const calendarSync = useGoogleCalendarSync();
    const sheetsExport = useGoogleSheetsExport();
    const driveMirror = useGoogleDriveMirror();

    // Merge static catalog with API data
    const services = useMemo(() => {
        const catalog = createServices();
        if (!apiIntegrations || !Array.isArray(apiIntegrations)) return catalog;
        return mergeWithApiData(catalog, apiIntegrations);
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

                        // Listen for the callback redirect
                        const checkClosed = setInterval(() => {
                            if (popup?.closed) {
                                clearInterval(checkClosed);
                                // Refetch integrations to check if connection succeeded
                                setTimeout(() => {
                                    setConnectionStep('success');
                                    toast.success(`Connected to ${svc?.name}!`);
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
                    toast.success(`Calendar synced: ${r.push.pushed} pushed, ${r.pull.pulled} pulled`);
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
            { file: selectedFile, dataType: uploadDataType as any },
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
                onError: (error: any) => {
                    clearInterval(interval);
                    setUploadProgress(0);
                    setUploading(false);
                    const msg = error?.response?.data?.message || error?.message || 'Import failed';
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
                                {typeof kpi.value === 'number' && 'total' in kpi ? `${kpi.value}/${(kpi as any).total}` : kpi.value}
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
                            'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap',
                            activeCategory === tab.value
                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                                : 'bg-white dark:bg-slate-900 text-surface-500 hover:text-surface-900 dark:hover:text-white border border-surface-200 dark:border-slate-700 hover:border-primary-300'
                        )}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* ── Integration Cards Grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map(svc => (
                    <div key={svc.id} className="group flex flex-col justify-between gap-5 rounded-2xl border border-surface-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-xl hover:shadow-surface-200/40 dark:hover:shadow-none transition-all duration-300">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                            <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform', svc.bgColor, svc.textColor)}>
                                {svc.icon}
                            </div>
                            {svc.connected && (
                                <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-full">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Connected
                                </span>
                            )}
                        </div>

                        {/* Body */}
                        <div>
                            <h3 className="text-base font-bold text-surface-900 dark:text-white tracking-tight">{svc.name}</h3>
                            <p className="text-surface-500 text-sm mt-1.5 leading-relaxed line-clamp-2">{svc.description}</p>
                        </div>

                        {/* Features */}
                        <div className="flex flex-wrap gap-1.5">
                            {svc.features.slice(0, 3).map(f => (
                                <span key={f} className="text-[10px] font-medium text-surface-500 bg-surface-50 dark:bg-slate-800 px-2 py-1 rounded-md">{f}</span>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="pt-4 border-t border-surface-100 dark:border-slate-800 flex items-center justify-between">
                            {svc.connected ? (
                                <>
                                    <span className="text-[10px] text-surface-400 font-medium truncate max-w-[120px]" title={svc.connectedEmail}>
                                        {svc.connectedEmail}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleSync(svc.id)}
                                            disabled={syncing === svc.id}
                                            className="text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                                        >
                                            <RefreshCw size={12} className={cn(syncing === svc.id && 'animate-spin')} />
                                            Sync
                                        </button>
                                        <button
                                            onClick={() => setConfigId(svc.id)}
                                            className="text-xs font-bold text-surface-500 hover:text-surface-700 transition-colors flex items-center gap-1"
                                        >
                                            <Settings2 size={12} />
                                            Configure
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <button
                                    onClick={() => startConnect(svc.id)}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-primary-600 text-white hover:bg-primary-700 transition-all shadow-sm hover:shadow-md"
                                >
                                    <Plug size={14} /> Connect
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Bulk Data Import ── */}
            <section className="flex flex-col gap-6 mt-4">
                <h2 className="text-xs font-bold text-surface-400 uppercase tracking-widest">Bulk Data Import</h2>
                <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls,.json" className="hidden" onChange={handleInputChange} />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Dropzone */}
                    <div className="lg:col-span-4">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDrop={handleDrop}
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            className={cn(
                                'h-full min-h-[280px] flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl bg-white dark:bg-slate-900 transition-all group cursor-pointer',
                                dragOver ? 'border-primary-400 bg-primary-50/50 dark:bg-primary-900/20 scale-[1.02]' : 'border-surface-200 dark:border-slate-800 hover:bg-surface-50 dark:hover:bg-slate-800 hover:border-surface-300'
                            )}
                        >
                            <div className={cn('p-5 rounded-full mb-4 group-hover:scale-110 transition-transform', dragOver ? 'bg-primary-200' : 'bg-primary-100 dark:bg-primary-900/30')}>
                                <Upload size={32} className={cn(dragOver ? 'text-primary-700' : 'text-primary-600')} />
                            </div>
                            <p className="text-surface-900 dark:text-white text-sm font-bold text-center mb-1">{dragOver ? 'Drop file here' : 'Click to upload'}</p>
                            <p className="text-surface-500 text-[10px] font-medium text-center mb-5 uppercase tracking-wider">CSV, XLSX or JSON — max 10 MB</p>
                            <Button variant="primary" size="sm" leftIcon={<Upload size={14} />} onClick={(e: React.MouseEvent) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                                Browse Files
                            </Button>
                        </div>
                    </div>

                    {/* Recent Imports */}
                    <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-surface-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-surface-100 dark:border-slate-800 flex justify-between items-center bg-surface-50/50 dark:bg-slate-800/30">
                            <h3 className="text-xs font-bold text-surface-900 dark:text-white uppercase tracking-wider">Recent Imports</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-white dark:bg-slate-900 text-surface-400 border-b border-surface-100 dark:border-slate-800">
                                        {['File', 'Date', 'By', 'Status'].map(h => (
                                            <th key={h} className="px-6 py-3 font-bold uppercase tracking-wider text-[10px]">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-surface-100 dark:divide-slate-800">
                                    {recentImports.map((row, i) => (
                                        <tr key={i} className="hover:bg-surface-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-3.5 flex items-center gap-2">
                                                <FileSpreadsheet size={14} className={row.ok ? 'text-emerald-600' : 'text-danger-600'} />
                                                <span className="text-sm font-medium text-surface-900 dark:text-white">{row.name}</span>
                                            </td>
                                            <td className="px-6 py-3.5 text-surface-500 font-mono text-xs">{row.date}</td>
                                            <td className="px-6 py-3.5 text-sm text-surface-500">{row.by}</td>
                                            <td className="px-6 py-3.5">
                                                <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold uppercase', row.ok ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700' : 'bg-danger-100 dark:bg-danger-900/30 text-danger-700')}>{row.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── OAuth Connection Modal ── */}
            {connectingService && connectionStep !== 'idle' && (
                <div className="fixed inset-0 z-[400] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={connectionStep !== 'connecting' ? closeConnect : undefined} />
                    <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-surface-200 dark:border-slate-800 shadow-2xl w-full max-w-md mx-4 animate-fade-in overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-surface-100 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', connectingService.bgColor, connectingService.textColor)}>
                                    {connectingService.icon}
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-surface-900 dark:text-white">Connect {connectingService.name}</h3>
                                    <p className="text-[10px] text-surface-400 font-medium uppercase tracking-wider mt-0.5">
                                        Step {connectionStep === 'signin' ? '1' : connectionStep === 'permissions' ? '2' : '3'} of 3
                                    </p>
                                </div>
                            </div>
                            {connectionStep !== 'connecting' && (
                                <button onClick={closeConnect} className="text-surface-400 hover:text-surface-600 transition-colors p-1 rounded-lg hover:bg-surface-100">
                                    <X size={18} />
                                </button>
                            )}
                        </div>

                        {/* Step Progress */}
                        <div className="flex gap-1 px-6 pt-4">
                            {['signin', 'permissions', 'success'].map((step, i) => (
                                <div key={step} className={cn('h-1 flex-1 rounded-full transition-all duration-500',
                                    (connectionStep === 'connecting' && i < 2) || connectionStep === step || ['signin', 'permissions', 'connecting', 'success'].indexOf(connectionStep) > i
                                        ? 'bg-primary-600' : 'bg-surface-200 dark:bg-slate-700'
                                )} />
                            ))}
                        </div>

                        {/* Step Content */}
                        <div className="px-6 py-6 space-y-5">
                            {connectionStep === 'signin' && (
                                <>
                                    {connectingService.apiKeyRequired ? (
                                        <div className="space-y-4">
                                            <div className="bg-surface-50 dark:bg-slate-800 rounded-xl p-4 border border-surface-100 dark:border-slate-700">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Key size={14} className="text-surface-500" />
                                                    <span className="text-xs font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider">API Credentials</span>
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="API Key / Public Key"
                                                    value={apiKeyInput}
                                                    onChange={e => setApiKeyInput(e.target.value)}
                                                    className="w-full px-3 py-2.5 text-sm border border-surface-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/30 mb-2"
                                                />
                                                <input
                                                    type="password"
                                                    placeholder="Secret Key (optional)"
                                                    value={apiSecretInput}
                                                    onChange={e => setApiSecretInput(e.target.value)}
                                                    className="w-full px-3 py-2.5 text-sm border border-surface-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                                                />
                                            </div>
                                            {connectingService.webhookUrl && (
                                                <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                                                    <p className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-1">Webhook URL</p>
                                                    <code className="text-[11px] text-amber-600 dark:text-amber-300 break-all">{connectingService.webhookUrl}</code>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-4">
                                            <div className={cn('w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4', connectingService.bgColor, connectingService.textColor)}>
                                                {connectingService.icon}
                                            </div>
                                            <p className="text-sm text-surface-600 dark:text-surface-400 mb-2">
                                                Sign in with your <strong>{connectingService.name}</strong> account to continue.
                                            </p>
                                            <p className="text-xs text-surface-400">You&apos;ll be redirected to a secure sign-in page.</p>
                                        </div>
                                    )}
                                </>
                            )}

                            {connectionStep === 'permissions' && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Shield size={14} className="text-primary-600" />
                                        <span className="text-xs font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider">Permissions Required</span>
                                    </div>
                                    <div className="space-y-2">
                                        {connectingService.scopes.map(scope => (
                                            <div key={scope} className="flex items-center gap-3 p-3 rounded-xl bg-surface-50 dark:bg-slate-800 border border-surface-100 dark:border-slate-700">
                                                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                                                <span className="text-sm text-surface-700 dark:text-surface-300">{scope}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-[11px] text-surface-400 flex items-center gap-1.5">
                                        <Shield size={11} /> Your data is encrypted and never shared with third parties.
                                    </p>
                                </div>
                            )}

                            {connectionStep === 'connecting' && (
                                <div className="text-center py-8">
                                    <Loader2 size={40} className="text-primary-600 animate-spin mx-auto mb-4" />
                                    <p className="text-sm font-medium text-surface-700 dark:text-surface-300">Connecting to {connectingService.name}...</p>
                                    <p className="text-xs text-surface-400 mt-1">Establishing secure connection</p>
                                </div>
                            )}

                            {connectionStep === 'success' && (
                                <div className="text-center py-6">
                                    <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
                                        <Check size={32} className="text-emerald-600" />
                                    </div>
                                    <p className="text-lg font-bold text-surface-900 dark:text-white mb-1">Connected!</p>
                                    <p className="text-sm text-surface-500">{connectingService.name} is now active and syncing.</p>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-surface-100 dark:border-slate-800 flex items-center justify-end gap-3 bg-surface-50/50 dark:bg-slate-800/30">
                            {connectionStep === 'success' ? (
                                <Button variant="primary" onClick={closeConnect}>Done</Button>
                            ) : connectionStep !== 'connecting' ? (
                                <>
                                    <Button variant="outline" onClick={closeConnect}>Cancel</Button>
                                    <Button variant="primary" onClick={progressConnect} rightIcon={<ArrowRight size={14} />}>
                                        {connectionStep === 'signin' ? (connectingService.apiKeyRequired ? 'Verify' : 'Sign In') : 'Authorize'}
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
                                                    onSuccess: (r) => toast.success(`Pushed ${r.push.pushed} events, pulled ${r.pull.pulled} events`),
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

            {/* ── Upload Modal ── */}
            {uploadModal && selectedFile && (
                <div className="fixed inset-0 z-[400] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={!uploading ? () => { setUploadModal(false); setSelectedFile(null); setUploadProgress(0); } : undefined} />
                    <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-surface-200 dark:border-slate-800 shadow-2xl w-full max-w-lg mx-4 animate-fade-in overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-surface-100 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="bg-primary-100 dark:bg-primary-900/30 p-2.5 rounded-xl">
                                    <Upload size={18} className="text-primary-600" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-surface-900 dark:text-white">Import Data</h3>
                                    <p className="text-[10px] text-surface-400 font-medium uppercase tracking-wider mt-0.5">Review & upload</p>
                                </div>
                            </div>
                            {!uploading && (
                                <button onClick={() => { setUploadModal(false); setSelectedFile(null); }} className="text-surface-400 hover:text-surface-600 p-1 rounded-lg hover:bg-surface-100">
                                    <X size={18} />
                                </button>
                            )}
                        </div>

                        <div className="px-6 py-5 space-y-5">
                            {/* File info */}
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-50 dark:bg-slate-800 border border-surface-100 dark:border-slate-700">
                                <FileSpreadsheet size={20} className="text-emerald-600 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-surface-900 dark:text-white truncate">{selectedFile.name}</p>
                                    <p className="text-xs text-surface-500 mt-0.5">{formatFileSize(selectedFile.size)}</p>
                                </div>
                            </div>

                            {/* Data type */}
                            <div>
                                <label className="text-[10px] font-bold text-surface-400 uppercase tracking-wider mb-2 block">Import As</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {DATA_TYPES.map(dt => (
                                        <button key={dt.value} onClick={() => !uploading && !importResult && setUploadDataType(dt.value)} disabled={uploading || !!importResult}
                                            className={cn('px-3 py-2 rounded-xl text-xs font-medium border transition-all',
                                                uploadDataType === dt.value ? 'bg-primary-600 text-white border-primary-600' : 'bg-white dark:bg-slate-800 text-surface-600 border-surface-200 dark:border-slate-700 hover:border-primary-300',
                                                dt.value === 'all' && uploadDataType === dt.value && 'bg-amber-600 border-amber-600',
                                            )}>
                                            {dt.label}
                                        </button>
                                    ))}
                                </div>
                                {uploadDataType === 'all' && !importResult && (
                                    <p className="text-[10px] text-amber-600 mt-2 flex items-center gap-1">
                                        <AlertTriangle size={10} /> Auto-detects data types from column headers
                                    </p>
                                )}
                            </div>

                            {/* Progress */}
                            {uploading && !importResult && (
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-xs text-surface-500">{uploadProgress >= 90 ? 'Processing rows...' : 'Uploading file...'}</span>
                                        <span className="text-xs font-bold tabular-nums">{Math.min(100, Math.round(uploadProgress))}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-surface-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className={cn('h-full rounded-full transition-all duration-300', uploadProgress >= 100 ? 'bg-emerald-500' : 'bg-primary-600')} style={{ width: `${Math.min(100, uploadProgress)}%` }} />
                                    </div>
                                </div>
                            )}

                            {/* Import Results */}
                            {importResult && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm font-bold text-emerald-600">
                                        <CheckCircle2 size={16} /> Import Complete
                                    </div>

                                    {'summary' in importResult ? (
                                        // Mixed import results
                                        <div className="space-y-3">
                                            <div className="grid grid-cols-3 gap-2">
                                                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-center">
                                                    <p className="text-lg font-bold text-emerald-600 tabular-nums">{importResult.summary.totalCreated}</p>
                                                    <p className="text-[10px] font-bold text-emerald-600/70 uppercase">Created</p>
                                                </div>
                                                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-center">
                                                    <p className="text-lg font-bold text-amber-600 tabular-nums">{importResult.summary.totalSkipped}</p>
                                                    <p className="text-[10px] font-bold text-amber-600/70 uppercase">Skipped</p>
                                                </div>
                                                <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 text-center">
                                                    <p className="text-lg font-bold text-red-600 tabular-nums">{importResult.summary.totalErrors}</p>
                                                    <p className="text-[10px] font-bold text-red-600/70 uppercase">Errors</p>
                                                </div>
                                            </div>
                                            {importResult.results.map((r: ImportResult, i: number) => (
                                                <div key={i} className="flex items-center justify-between text-xs px-3 py-2 rounded-lg bg-surface-50 dark:bg-slate-800">
                                                    <span className="font-medium text-surface-700 dark:text-surface-300 capitalize">{r.dataType}</span>
                                                    <span className="text-surface-500">{r.created} created, {r.skipped} skipped{r.errors.length > 0 && `, ${r.errors.length} errors`}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        // Single-type import results
                                        <div className="space-y-3">
                                            <div className="grid grid-cols-3 gap-2">
                                                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-center">
                                                    <p className="text-lg font-bold text-emerald-600 tabular-nums">{importResult.created}</p>
                                                    <p className="text-[10px] font-bold text-emerald-600/70 uppercase">Created</p>
                                                </div>
                                                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-center">
                                                    <p className="text-lg font-bold text-amber-600 tabular-nums">{importResult.skipped}</p>
                                                    <p className="text-[10px] font-bold text-amber-600/70 uppercase">Skipped</p>
                                                </div>
                                                <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 text-center">
                                                    <p className="text-lg font-bold text-red-600 tabular-nums">{importResult.errors.length}</p>
                                                    <p className="text-[10px] font-bold text-red-600/70 uppercase">Errors</p>
                                                </div>
                                            </div>
                                            {importResult.errors.length > 0 && (
                                                <div className="max-h-32 overflow-y-auto space-y-1">
                                                    {importResult.errors.slice(0, 10).map((err, i) => (
                                                        <div key={i} className="flex gap-2 text-xs px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400">
                                                            <span className="font-mono shrink-0">Row {err.row}:</span>
                                                            <span className="truncate">{err.message}</span>
                                                        </div>
                                                    ))}
                                                    {importResult.errors.length > 10 && (
                                                        <p className="text-[10px] text-red-500 px-3">...and {importResult.errors.length - 10} more errors</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="px-6 py-4 border-t border-surface-100 dark:border-slate-800 flex justify-end gap-3 bg-surface-50/50 dark:bg-slate-800/30">
                            {importResult ? (
                                <Button variant="primary" onClick={() => { setUploadModal(false); setSelectedFile(null); setImportResult(null); setUploadProgress(0); setUploading(false); }} leftIcon={<Check size={14} />}>
                                    Done
                                </Button>
                            ) : (
                                <>
                                    <Button variant="outline" onClick={() => { setUploadModal(false); setSelectedFile(null); }} disabled={uploading}>Cancel</Button>
                                    <Button variant="primary" onClick={handleUpload} disabled={uploading} leftIcon={uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}>
                                        {uploading ? 'Importing...' : 'Start Import'}
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
