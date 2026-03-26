'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, CheckCircle2, Clock, ChevronRight, Eye } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/card';
import { useClaims } from '@/hooks/api';
import { formatDate, cn } from '@/lib/utils';
import { AppLoader } from '@/components/ui/AppLoader';

type ComplianceStatus = 'BREACHED' | 'AT_RISK' | 'ON_TRACK' | 'MET';

function getDeadlineStatus(deadline?: string, completedDate?: string): ComplianceStatus {
    if (!deadline) return 'ON_TRACK';
    if (completedDate) return 'MET';
    const today = new Date();
    const d = new Date(deadline);
    const daysLeft = Math.ceil((d.getTime() - today.getTime()) / 86_400_000);
    if (d < today) return 'BREACHED';
    if (daysLeft <= 2) return 'AT_RISK';
    return 'ON_TRACK';
}

function StatusPill({ status }: { status: ComplianceStatus }) {
    const map: Record<ComplianceStatus, { label: string; class: string }> = {
        BREACHED: { label: 'BREACHED', class: 'bg-danger-100 text-danger-700 border-danger-200' },
        AT_RISK: { label: 'AT RISK', class: 'bg-warning-100 text-warning-700 border-warning-200' },
        ON_TRACK: { label: 'ON TRACK', class: 'bg-success-100 text-success-700 border-success-200' },
        MET: { label: 'MET', class: 'bg-success-100 text-success-700 border-success-200' },
    };
    const { label, class: cls } = map[status];
    return (
        <span className={cn('text-[10px] font-bold border px-2 py-0.5 rounded-full', cls)}>{label}</span>
    );
}

function DeadlineCell({ deadline, completedDate }: { deadline?: string; completedDate?: string }) {
    if (!deadline) return <span className="text-surface-400 text-xs">—</span>;
    const today = new Date();
    const d = new Date(deadline);
    const isPast = d < today;
    const daysLeft = Math.ceil((d.getTime() - today.getTime()) / 86_400_000);
    const isDone = !!completedDate;
    return (
        <div>
            <p className={cn('text-xs font-semibold', isDone ? 'text-success-600' : isPast ? 'text-danger-600' : daysLeft <= 2 ? 'text-warning-600' : 'text-surface-700')}>
                {formatDate(deadline)}
            </p>
            <p className={cn('text-[10px] font-bold', isDone ? 'text-success-500' : isPast ? 'text-danger-500 animate-pulse' : daysLeft <= 2 ? 'text-warning-500' : 'text-surface-400')}>
                {isDone ? '✓ Met' : isPast ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d left`}
            </p>
        </div>
    );
}

export default function NicMonitorPage() {
    const router = useRouter();
    const { data: claimsData, isLoading } = useClaims();
    const allClaims: any[] = (claimsData as any)?.items ?? (claimsData as any)?.data ?? (Array.isArray(claimsData) ? claimsData : []);

    const classified = useMemo(() => {
        return allClaims.map((c: any) => {
            const s5 = getDeadlineStatus(c.acknowledgmentDeadline, c.acknowledgmentDate);
            const s30 = getDeadlineStatus(c.processingDeadline, c.settlementDate);
            const worst = [s5, s30].includes('BREACHED') ? 'BREACHED' : [s5, s30].includes('AT_RISK') ? 'AT_RISK' : 'ON_TRACK';
            return { ...c, s5, s30, worst };
        });
    }, [allClaims]);

    const breached = classified.filter(c => c.worst === 'BREACHED');
    const atRisk = classified.filter(c => c.worst === 'AT_RISK');
    const onTrack = classified.filter(c => c.worst === 'ON_TRACK' && !['SETTLED', 'CLOSED', 'REJECTED'].includes(c.status));
    const history = classified.filter(c =>
        ['SETTLED', 'CLOSED', 'REJECTED'].includes(c.status) &&
        [c.s5, c.s30].includes('BREACHED')
    );

    if (isLoading) return <AppLoader message="Loading NIC compliance data..." isLoading={true} />;

    const buckets = [
        {
            title: 'Already Breached',
            subtitle: 'Active NIC compliance violations',
            icon: <AlertTriangle size={18} className="text-danger-600" />,
            bg: 'bg-danger-50 border-danger-200',
            headerBg: 'bg-danger-100',
            claims: breached,
            isEmpty: breached.length === 0,
        },
        {
            title: 'At Risk',
            subtitle: 'Deadline within 2 days — urgent action required',
            icon: <Clock size={18} className="text-warning-600" />,
            bg: 'bg-warning-50 border-warning-200',
            headerBg: 'bg-warning-100',
            claims: atRisk,
            isEmpty: atRisk.length === 0,
        },
        {
            title: 'On Track',
            subtitle: 'Open claims comfortably within deadlines',
            icon: <CheckCircle2 size={18} className="text-success-600" />,
            bg: 'bg-success-50 border-success-200',
            headerBg: 'bg-success-100',
            claims: onTrack,
            isEmpty: onTrack.length === 0,
        },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-surface-900 tracking-tight">NIC Deadline Monitor</h1>
                <p className="text-sm text-surface-500 mt-1">
                    Real-time compliance dashboard — NIC Act 1061 · 5-day acknowledgement rule · 30-day settlement rule
                </p>
            </div>

            {/* Summary KPIs */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Breached', count: breached.length, color: 'text-danger-700', bg: 'bg-danger-50 border-danger-200' },
                    { label: 'At Risk', count: atRisk.length, color: 'text-warning-700', bg: 'bg-warning-50 border-warning-200' },
                    { label: 'On Track', count: onTrack.length, color: 'text-success-700', bg: 'bg-success-50 border-success-200' },
                ].map(k => (
                    <div key={k.label} className={cn('rounded-xl border p-4 text-center', k.bg)}>
                        <p className={cn('text-3xl font-black', k.color)}>{k.count}</p>
                        <p className="text-xs font-bold text-surface-500 uppercase tracking-wide mt-1">{k.label}</p>
                    </div>
                ))}
            </div>

            {/* 3 Buckets */}
            {buckets.map((bucket) => (
                <div key={bucket.title} className={cn('rounded-xl border', bucket.bg)}>
                    <div className={cn('flex items-center justify-between px-4 py-3 rounded-t-xl', bucket.headerBg)}>
                        <div className="flex items-center gap-2">
                            {bucket.icon}
                            <div>
                                <h2 className="text-sm font-bold text-surface-900">{bucket.title}</h2>
                                <p className="text-xs text-surface-500">{bucket.subtitle}</p>
                            </div>
                        </div>
                        <span className="text-lg font-black text-surface-700">{bucket.claims.length}</span>
                    </div>

                    {bucket.isEmpty ? (
                        <p className="text-sm text-surface-400 text-center py-6">No claims in this category</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-surface-200">
                                        {['Claim #', 'Client', 'Filed Date', '5-Day Deadline', '5-Day Status', '30-Day Deadline', '30-Day Status', 'Stage', 'Action'].map(col => (
                                            <th key={col} className="text-left px-4 py-2.5 text-[10px] font-bold text-surface-500 uppercase tracking-wider whitespace-nowrap">{col}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {bucket.claims.map((c: any, i: number) => (
                                        <tr key={c.id as string} className={cn('border-b border-surface-100 hover:bg-white/50 transition-colors cursor-pointer', i % 2 === 0 ? '' : 'bg-white/20')}
                                            onClick={() => router.push(`/dashboard/claims/${c.id as string}`)}>
                                            <td className="px-4 py-3">
                                                <span className="text-[11px] font-mono text-surface-600 bg-surface-100/80 border border-surface-200/50 px-2 py-0.5 rounded-md">
                                                    {c.claimNumber as string}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm font-medium text-surface-800 whitespace-nowrap">{c.clientName as string}</td>
                                            <td className="px-4 py-3 text-xs text-surface-500">{formatDate(c.createdAt as string)}</td>
                                            <td className="px-4 py-3"><DeadlineCell deadline={c.acknowledgmentDeadline} completedDate={c.acknowledgmentDate} /></td>
                                            <td className="px-4 py-3"><StatusPill status={c.s5} /></td>
                                            <td className="px-4 py-3"><DeadlineCell deadline={c.processingDeadline} completedDate={c.settlementDate} /></td>
                                            <td className="px-4 py-3"><StatusPill status={c.s30} /></td>
                                            <td className="px-4 py-3">
                                                <span className="text-xs font-semibold text-surface-600 capitalize">{(c.status as string).replace(/_/g, ' ')}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/claims/${c.id as string}`); }}
                                                    className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-800 font-semibold"
                                                >
                                                    <Eye size={12} /> View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ))}

            {/* Breach History */}
            {history.length > 0 && (
                <div className="rounded-xl border border-surface-200">
                    <div className="px-4 py-3 bg-surface-100 rounded-t-xl flex items-center gap-2">
                        <AlertTriangle size={14} className="text-surface-500" />
                        <h2 className="text-sm font-bold text-surface-700">Breach History Report</h2>
                        <span className="text-xs text-surface-500">— closed/settled claims with NIC deadline breaches</span>
                        <span className="ml-auto text-xs font-bold text-surface-500">{history.length} records</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-surface-200">
                                    {['Claim #', 'Client', 'Filed Date', '5-Day Status', '30-Day Status', 'Final Stage'].map(col => (
                                        <th key={col} className="text-left px-4 py-2.5 text-[10px] font-bold text-surface-500 uppercase tracking-wider whitespace-nowrap">{col}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((c: any) => (
                                    <tr key={c.id as string} className="border-b border-surface-100 hover:bg-surface-50 cursor-pointer"
                                        onClick={() => router.push(`/dashboard/claims/${c.id as string}`)}>
                                        <td className="px-4 py-3">
                                            <span className="text-[11px] font-mono text-surface-500 bg-surface-100/80 border border-surface-200/50 px-2 py-0.5 rounded-md">
                                                {c.claimNumber as string}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-surface-700">{c.clientName as string}</td>
                                        <td className="px-4 py-3 text-xs text-surface-500">{formatDate(c.createdAt as string)}</td>
                                        <td className="px-4 py-3"><StatusPill status={c.s5} /></td>
                                        <td className="px-4 py-3"><StatusPill status={c.s30} /></td>
                                        <td className="px-4 py-3 text-xs font-medium text-surface-600 capitalize">{(c.status as string).replace(/_/g, ' ')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
