'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface Integration {
    id: string;
    name: string;
    desc: string;
    icon: string;
    color: string;
    connected: boolean;
    type: 'accounting' | 'payment' | 'storage' | 'import';
}

interface ImportRecord {
    name: string;
    date: string;
    by: string;
    status: string;
    ok: boolean;
}

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

export function SettingsIntegrations() {
    const [services, setServices] = useState<Integration[]>([
        { id: 'gcal', name: 'Google Calendar', desc: 'Sync policy renewals and client meetings automatically.', icon: 'calendar_month', color: 'blue', connected: false, type: 'import' },
        { id: 'gsheets', name: 'Google Sheets', desc: 'Export reports directly to your drive for analysis.', icon: 'table_chart', color: 'emerald', connected: false, type: 'import' },
        { id: 'gdrive', name: 'Google Drive', desc: 'Store policy documents and claim photos securely.', icon: 'cloud', color: 'amber', connected: false, type: 'storage' },
        { id: 'quickbooks', name: 'QuickBooks Online', desc: 'Sync invoices, payments, and clients with QuickBooks.', icon: 'receipt_long', color: 'blue', connected: false, type: 'accounting' },
        { id: 'xero', name: 'Xero', desc: 'Seamless accounting data synchronization.', icon: 'account_balance', color: 'blue', connected: false, type: 'accounting' },
        { id: 'paystack', name: 'Paystack', desc: 'Accept payments via Mobile Money and Card.', icon: 'payments', color: 'emerald', connected: false, type: 'payment' },
    ]);

    const [notification, setNotification] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'info' }>({
        show: false,
        message: '',
        type: 'success',
    });

    const [syncing, setSyncing] = useState<string | null>(null);

    // ── Upload state ──
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadModal, setUploadModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadDataType, setUploadDataType] = useState('clients');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [recentImports, setRecentImports] = useState<ImportRecord[]>([
        { name: 'clients_q3_2023.csv', date: 'Oct 24, 2023', by: 'Alex J.', status: 'Success', ok: true },
        { name: 'new_policies_batch_02.xlsx', date: 'Oct 22, 2023', by: 'Sarah K.', status: 'Success', ok: true },
        { name: 'claims_legacy_data.csv', date: 'Oct 20, 2023', by: 'Alex J.', status: 'Failed', ok: false },
    ]);

    const DATA_TYPES = [
        { value: 'clients', label: 'Clients' },
        { value: 'policies', label: 'Policies' },
        { value: 'claims', label: 'Claims' },
        { value: 'invoices', label: 'Invoices' },
        { value: 'leads', label: 'Leads' },
        { value: 'commissions', label: 'Commissions' },
    ];

    const ACCEPTED_TYPES = ['.csv', '.xlsx', '.xls', '.json'];
    const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

    useEffect(() => {
        const stored = localStorage.getItem('ibms_integrations');
        if (stored) {
            try {
                const connected: { provider: string; status: string }[] = JSON.parse(stored);
                setServices(prev => prev.map(s => ({
                    ...s,
                    connected: connected.some(c => c.provider === s.id && c.status === 'active'),
                })));
            } catch { /* ignore corrupt */ }
        }
    }, []);

    const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 4000);
    };

    const handleToggle = (id: string) => {
        const service = services.find(s => s.id === id);
        if (!service) return;

        if (service.connected) {
            // Disconnect
            const stored: { provider: string; status: string }[] = JSON.parse(localStorage.getItem('ibms_integrations') || '[]');
            const updated = stored.filter(i => i.provider !== id);
            localStorage.setItem('ibms_integrations', JSON.stringify(updated));
            setServices(prev => prev.map(s => s.id === id ? { ...s, connected: false } : s));
            showNotification(`${service.name} disconnected`, 'info');
        } else {
            // Connect
            const stored: { provider: string; status: string; connectedAt?: string }[] = JSON.parse(localStorage.getItem('ibms_integrations') || '[]');
            stored.push({ provider: id, status: 'active', connectedAt: new Date().toISOString() });
            localStorage.setItem('ibms_integrations', JSON.stringify(stored));
            setServices(prev => prev.map(s => s.id === id ? { ...s, connected: true } : s));
            showNotification(`Connected to ${service.name} successfully!`, 'success');
        }
    };

    const handleSync = (id: string) => {
        const service = services.find(s => s.id === id);
        if (!service) return;
        setSyncing(id);
        showNotification(`Syncing ${service.name}...`, 'info');
        setTimeout(() => {
            setSyncing(null);
            showNotification(`${service.name} sync completed!`, 'success');
        }, 1500);
    };

    // ── File upload handlers ──
    const validateFile = (file: File): string | null => {
        const ext = '.' + file.name.split('.').pop()?.toLowerCase();
        if (!ACCEPTED_TYPES.includes(ext)) return `Invalid file type. Please upload ${ACCEPTED_TYPES.join(', ')} files.`;
        if (file.size > MAX_SIZE) return `File exceeds 10 MB limit (${formatFileSize(file.size)}).`;
        return null;
    };

    const handleFileSelect = useCallback((file: File) => {
        const error = validateFile(file);
        if (error) {
            showNotification(error, 'error');
            return;
        }
        setSelectedFile(file);
        setUploadDataType('clients');
        setUploadProgress(0);
        setUploading(false);
        setUploadModal(true);
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

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => setDragOver(false);

    const handleUpload = () => {
        if (!selectedFile) return;
        setUploading(true);
        setUploadProgress(0);

        // Simulate upload progress
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + Math.random() * 15 + 5;
            });
        }, 200);

        setTimeout(() => {
            clearInterval(interval);
            setUploadProgress(100);

            setTimeout(() => {
                const newImport: ImportRecord = {
                    name: selectedFile.name,
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    by: 'Current User',
                    status: 'Success',
                    ok: true,
                };
                setRecentImports(prev => [newImport, ...prev]);
                setUploadModal(false);
                setSelectedFile(null);
                setUploading(false);
                setUploadProgress(0);
                showNotification(`${selectedFile.name} imported successfully as ${DATA_TYPES.find(d => d.value === uploadDataType)?.label}!`, 'success');
            }, 500);
        }, 2000);
    };

    const closeUploadModal = () => {
        if (uploading) return;
        setUploadModal(false);
        setSelectedFile(null);
        setUploadProgress(0);
    };

    const colorMap: Record<string, { bg: string; text: string; darkBg: string; darkText: string }> = {
        blue: { bg: 'bg-blue-50', text: 'text-blue-600', darkBg: 'dark:bg-blue-900/20', darkText: 'dark:text-blue-400' },
        emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', darkBg: 'dark:bg-emerald-900/20', darkText: 'dark:text-emerald-400' },
        amber: { bg: 'bg-amber-50', text: 'text-amber-600', darkBg: 'dark:bg-amber-900/20', darkText: 'dark:text-amber-400' },
    };

    return (
        <div className="flex flex-col gap-10">
            {/* ── Toast Notification ── */}
            {notification.show && (
                <div className={cn(
                    "fixed top-6 right-6 z-[300] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border animate-fade-in",
                    notification.type === 'success' && "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/90 dark:border-emerald-700 dark:text-emerald-200",
                    notification.type === 'error' && "bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-900/90 dark:border-rose-700 dark:text-rose-200",
                    notification.type === 'info' && "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/90 dark:border-blue-700 dark:text-blue-200",
                )}>
                    <span className="material-symbols-outlined text-xl">
                        {notification.type === 'success' ? 'check_circle' : notification.type === 'error' ? 'error' : 'info'}
                    </span>
                    <span className="text-sm font-bold">{notification.message}</span>
                </div>
            )}

            {/* ── Section: Available Integrations ── */}
            <section className="flex flex-col gap-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Available Integrations</h2>
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-4 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-800 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                        <span className="material-symbols-outlined text-sm">lock</span>
                        Encrypted Connection
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {services.map(s => {
                        const c = colorMap[s.color] ?? colorMap.blue;
                        return (
                            <div key={s.id} className="group flex flex-col justify-between gap-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 dark:hover:shadow-none transition-all duration-300">
                                {/* Header */}
                                <div className="flex items-start justify-between">
                                    <div className={cn("size-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform", c.bg, c.text, c.darkBg, c.darkText)}>
                                        <span className="material-symbols-outlined text-3xl">{s.icon}</span>
                                    </div>
                                    <button
                                        onClick={() => handleToggle(s.id)}
                                        className={cn(
                                            "relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
                                            s.connected ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"
                                        )}
                                    >
                                        <span className={cn(
                                            "pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out",
                                            s.connected ? "translate-x-5" : "translate-x-0"
                                        )} />
                                    </button>
                                </div>

                                {/* Body */}
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{s.name}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-2 leading-relaxed">{s.desc}</p>
                                </div>

                                {/* Footer */}
                                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                    <span className={cn(
                                        "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest",
                                        s.connected ? "text-emerald-600" : "text-slate-400"
                                    )}>
                                        <span className={cn("size-2 rounded-full", s.connected ? "bg-emerald-500 animate-pulse" : "bg-slate-300")} />
                                        {s.connected ? 'Connected' : 'Disconnected'}
                                    </span>
                                    {s.connected && (
                                        <button
                                            onClick={() => handleSync(s.id)}
                                            disabled={syncing === s.id}
                                            className="text-xs font-black uppercase tracking-widest flex items-center gap-1 text-primary-600 hover:text-primary-700 transition-colors disabled:opacity-50"
                                        >
                                            Sync
                                            <span className={cn("material-symbols-outlined text-lg", syncing === s.id && "animate-spin")}>sync</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ── Section: Bulk Data Import ── */}
            <section className="flex flex-col gap-6">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Bulk Data Import</h2>

                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls,.json"
                    className="hidden"
                    onChange={handleInputChange}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Upload Dropzone */}
                    <div className="lg:col-span-4">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            className={cn(
                                "h-full min-h-[300px] flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-3xl bg-white dark:bg-slate-900 transition-all group cursor-pointer",
                                dragOver
                                    ? "border-primary-400 bg-primary-50/50 dark:bg-primary-900/20 scale-[1.02]"
                                    : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300"
                            )}
                        >
                            <div className={cn(
                                "p-6 rounded-full mb-6 group-hover:scale-110 transition-transform",
                                dragOver ? "bg-primary-200 dark:bg-primary-800/40" : "bg-primary-100 dark:bg-primary-900/30"
                            )}>
                                <span className={cn(
                                    "material-symbols-outlined text-5xl",
                                    dragOver ? "text-primary-700 dark:text-primary-300" : "text-primary-600 dark:text-primary-400"
                                )}>
                                    {dragOver ? 'download' : 'cloud_upload'}
                                </span>
                            </div>
                            <p className="text-slate-900 dark:text-white text-lg font-black text-center mb-1 uppercase tracking-tight">
                                {dragOver ? 'Drop file here' : 'Click to upload'}
                            </p>
                            <p className="text-slate-500 text-[10px] font-bold text-center mb-6 uppercase tracking-widest">
                                {dragOver ? 'Release to select file' : 'or drag and drop — CSV, XLSX or JSON (max 10 MB)'}
                            </p>
                            <button
                                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                                className="bg-primary-600 text-white text-xs font-black uppercase tracking-widest px-8 py-3 rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20"
                            >
                                Browse Files
                            </button>
                        </div>
                    </div>

                    {/* Recent Imports Table */}
                    <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm flex flex-col">
                        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Recent Imports</h3>
                            <button className="text-[10px] font-black uppercase tracking-widest text-primary-600 dark:text-primary-400 hover:underline">View Full Logs</button>
                        </div>
                        <div className="overflow-x-auto no-scrollbar">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-white dark:bg-slate-900 text-slate-400 border-b border-slate-100 dark:border-slate-800">
                                        {['File Name', 'Date', 'Imported By', 'Status', 'Action'].map(h => (
                                            <th key={h} className="px-8 py-4 font-black uppercase tracking-widest text-[10px]">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {recentImports.map((row, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <span className={cn("material-symbols-outlined", row.ok ? "text-emerald-600" : "text-rose-600")}>description</span>
                                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{row.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-slate-500 font-mono text-xs">{row.date}</td>
                                            <td className="px-8 py-5 text-sm font-bold text-slate-500">{row.by}</td>
                                            <td className="px-8 py-5">
                                                <span className={cn(
                                                    "px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest",
                                                    row.ok ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" : "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400"
                                                )}>{row.status}</span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <button className="text-slate-400 hover:text-primary-600 transition-colors">
                                                    <span className="material-symbols-outlined">visibility</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Upload Modal ── */}
            {uploadModal && selectedFile && (
                <div className="fixed inset-0 z-[400] flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
                        onClick={closeUploadModal}
                    />

                    {/* Modal */}
                    <div className="relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg mx-4 animate-fade-in overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="bg-primary-100 dark:bg-primary-900/30 p-2.5 rounded-xl">
                                    <span className="material-symbols-outlined text-primary-600 dark:text-primary-400 text-xl">upload_file</span>
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wide">Import Data</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Review & upload</p>
                                </div>
                            </div>
                            <button
                                onClick={closeUploadModal}
                                disabled={uploading}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors disabled:opacity-30 p-1 rounded-lg hover:bg-slate-100"
                            >
                                <span className="material-symbols-outlined text-xl">close</span>
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-8 py-6 space-y-6">
                            {/* File info */}
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-xl shrink-0">
                                    <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-2xl">description</span>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{selectedFile.name}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        {formatFileSize(selectedFile.size)} &middot; {selectedFile.name.split('.').pop()?.toUpperCase()}
                                    </p>
                                </div>
                                {!uploading && (
                                    <button
                                        onClick={() => { setSelectedFile(null); fileInputRef.current?.click(); }}
                                        className="text-xs font-bold text-primary-600 hover:text-primary-700 uppercase tracking-wider shrink-0"
                                    >
                                        Change
                                    </button>
                                )}
                            </div>

                            {/* Data type selector */}
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                                    Import Data As
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {DATA_TYPES.map(dt => (
                                        <button
                                            key={dt.value}
                                            onClick={() => !uploading && setUploadDataType(dt.value)}
                                            disabled={uploading}
                                            className={cn(
                                                "px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all",
                                                uploadDataType === dt.value
                                                    ? "bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-600/20"
                                                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary-300"
                                            )}
                                        >
                                            {dt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Progress bar (visible during upload) */}
                            {uploading && (
                                <div className="space-y-2 animate-fade-in">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            {uploadProgress >= 100 ? 'Processing...' : 'Uploading...'}
                                        </span>
                                        <span className="text-xs font-bold text-slate-700 tabular-nums">{Math.min(100, Math.round(uploadProgress))}%</span>
                                    </div>
                                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className={cn(
                                                "h-full rounded-full transition-all duration-300",
                                                uploadProgress >= 100 ? "bg-emerald-500" : "bg-primary-600"
                                            )}
                                            style={{ width: `${Math.min(100, uploadProgress)}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-8 py-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 bg-slate-50/50 dark:bg-slate-800/30">
                            <button
                                onClick={closeUploadModal}
                                disabled={uploading}
                                className="px-6 py-2.5 text-xs font-black uppercase tracking-widest text-slate-600 hover:text-slate-800 transition-colors disabled:opacity-30 rounded-xl hover:bg-slate-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={uploading}
                                className="bg-primary-600 text-white text-xs font-black uppercase tracking-widest px-8 py-2.5 rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20 disabled:opacity-60 flex items-center gap-2"
                            >
                                {uploading ? (
                                    <>
                                        <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                                        Importing...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-base">upload</span>
                                        Start Import
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
