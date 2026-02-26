'use client';

import { useState, useEffect } from 'react';
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

    const colorMap: Record<string, { bg: string; text: string; darkBg: string; darkText: string }> = {
        blue: { bg: 'bg-blue-50', text: 'text-blue-600', darkBg: 'dark:bg-blue-900/20', darkText: 'dark:text-blue-400' },
        emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', darkBg: 'dark:bg-emerald-900/20', darkText: 'dark:text-emerald-400' },
        amber: { bg: 'bg-amber-50', text: 'text-amber-600', darkBg: 'dark:bg-amber-900/20', darkText: 'dark:text-amber-400' },
    };

    const recentImports = [
        { name: 'clients_q3_2023.csv', date: 'Oct 24, 2023', by: 'Alex J.', status: 'Success', ok: true },
        { name: 'new_policies_batch_02.xlsx', date: 'Oct 22, 2023', by: 'Sarah K.', status: 'Success', ok: true },
        { name: 'claims_legacy_data.csv', date: 'Oct 20, 2023', by: 'Alex J.', status: 'Failed', ok: false },
    ];

    return (
        <div className="flex flex-col gap-10">
            {/* ── Toast Notification ── */}
            {notification.show && (
                <div className={cn(
                    "fixed top-6 right-6 z-[60] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border animate-fade-in",
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
                                            s.connected ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"
                                        )}
                                    >
                                        <span className={cn(
                                            "pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
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
                                            className="text-xs font-black uppercase tracking-widest flex items-center gap-1 text-primary hover:text-blue-700 transition-colors disabled:opacity-50"
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

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Upload Dropzone */}
                    <div className="lg:col-span-4">
                        <div className="h-full min-h-[300px] flex flex-col items-center justify-center p-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group cursor-pointer">
                            <div className="bg-primary/10 p-6 rounded-full mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-primary text-5xl">cloud_upload</span>
                            </div>
                            <p className="text-slate-900 dark:text-white text-lg font-black text-center mb-1 uppercase tracking-tight">Click to upload</p>
                            <p className="text-slate-500 text-[10px] font-bold text-center mb-8 uppercase tracking-widest">CSV, XLSX or JSON (max 10 MB)</p>
                            <button
                                onClick={() => showNotification('File upload available in full version', 'info')}
                                className="bg-primary text-white text-xs font-black uppercase tracking-widest px-8 py-3 rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-primary/20"
                            >
                                Browse Files
                            </button>
                        </div>
                    </div>

                    {/* Recent Imports Table */}
                    <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm flex flex-col">
                        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Recent Imports</h3>
                            <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">View Full Logs</button>
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
                                                <button className="text-slate-400 hover:text-primary transition-colors">
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
        </div>
    );
}
