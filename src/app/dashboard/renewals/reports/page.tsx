'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, AlertTriangle, DollarSign, RefreshCw, Download } from 'lucide-react';

interface RenewalReport {
    totalDue: number;
    totalRenewed: number;
    renewalRate: number;
    atRiskRevenue: number;
    lapsedCount: number;
    upcomingRevenue: number;
    byType: { insuranceType: string; due: number; renewed: number; rate: number }[];
}

function exportToExcel(data: RenewalReport) {
    import('xlsx').then(({ utils, writeFile }) => {
        const wb = utils.book_new();
        // Summary sheet
        const summary = [
            ['Renewal Rate Report'],
            ['Generated:', new Date().toLocaleString()],
            [],
            ['Metric', 'Value'],
            ['Total Policies Due', data.totalDue],
            ['Total Renewed', data.totalRenewed],
            ['Renewal Rate', `${data.renewalRate.toFixed(1)}%`],
            ['At-Risk Revenue (GHS)', data.atRiskRevenue.toLocaleString()],
            ['Upcoming Revenue (GHS)', data.upcomingRevenue.toLocaleString()],
            ['Lapsed Policies', data.lapsedCount],
        ];
        utils.book_append_sheet(wb, utils.aoa_to_sheet(summary), 'Summary');

        // By type sheet
        const byTypeData = [
            ['Insurance Type', 'Policies Due', 'Renewed', 'Renewal Rate %'],
            ...data.byType.map(r => [r.insuranceType, r.due, r.renewed, `${r.rate.toFixed(1)}%`]),
        ];
        utils.book_append_sheet(wb, utils.aoa_to_sheet(byTypeData), 'By Type');
        writeFile(wb, `renewal-report-${new Date().toISOString().slice(0, 10)}.xlsx`);
    });
}

export default function RenewalReportsPage() {
    const [period, setPeriod] = useState<'30' | '60' | '90'>('90');

    const { data, isLoading, refetch } = useQuery<RenewalReport>({
        queryKey: ['renewal-report', period],
        queryFn: () => apiClient.get(`/renewals/report?days=${period}`),
    });

    const kpis = [
        {
            label: 'Renewal Rate',
            value: data ? `${data.renewalRate.toFixed(1)}%` : '—',
            icon: TrendingUp,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            sub: `${data?.totalRenewed ?? 0} / ${data?.totalDue ?? 0} policies`
        },
        {
            label: 'At-Risk Revenue',
            value: data ? `GHS ${data.atRiskRevenue.toLocaleString()}` : '—',
            icon: AlertTriangle,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            sub: `${data?.lapsedCount ?? 0} lapsed policies`
        },
        {
            label: 'Upcoming Revenue',
            value: data ? `GHS ${data.upcomingRevenue.toLocaleString()}` : '—',
            icon: DollarSign,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            sub: `From ${data?.totalDue ?? 0} due policies`
        },
    ];

    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Renewal Reports</h1>
                    <p className="text-slate-500 text-sm mt-1">Performance analytics and revenue at risk tracking.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex bg-surface-100 rounded-lg p-1">
                        {(['30', '60', '90'] as const).map(d => (
                            <button
                                key={d}
                                onClick={() => setPeriod(d)}
                                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${period === d ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                {d} Days
                            </button>
                        ))}
                    </div>
                    <Button variant="outline" onClick={() => refetch()} leftIcon={<RefreshCw size={14} />}>Refresh</Button>
                    {data && <Button onClick={() => exportToExcel(data)} leftIcon={<Download size={14} />}>Export Excel</Button>}
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {kpis.map(kpi => (
                    <Card key={kpi.label} className="p-6 flex items-start gap-4">
                        <div className={`size-12 rounded-xl flex items-center justify-center flex-shrink-0 ${kpi.bg}`}>
                            <kpi.icon className={`size-6 ${kpi.color}`} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-surface-500 uppercase tracking-wide">{kpi.label}</p>
                            <p className="text-2xl font-black text-surface-900 mt-0.5">
                                {isLoading ? <span className="animate-pulse bg-surface-200 rounded h-7 w-24 block" /> : kpi.value}
                            </p>
                            <p className="text-xs text-surface-400 mt-1">{kpi.sub}</p>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Breakdown Table */}
            <Card className="p-6">
                <h2 className="text-base font-bold text-surface-900 mb-4">Renewal Rate by Product Type</h2>
                {isLoading ? (
                    <div className="animate-pulse space-y-3">
                        {[1, 2, 3, 4].map(i => <div key={i} className="h-10 bg-surface-100 rounded" />)}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left border-b border-surface-100">
                                    <th className="pb-3 font-semibold text-surface-500 text-xs uppercase">Product Type</th>
                                    <th className="pb-3 font-semibold text-surface-500 text-xs uppercase text-right">Policies Due</th>
                                    <th className="pb-3 font-semibold text-surface-500 text-xs uppercase text-right">Renewed</th>
                                    <th className="pb-3 font-semibold text-surface-500 text-xs uppercase text-right">Rate</th>
                                    <th className="pb-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-50">
                                {(data?.byType ?? []).map(row => (
                                    <tr key={row.insuranceType} className="hover:bg-surface-50 transition-colors">
                                        <td className="py-3 font-semibold text-surface-900">{row.insuranceType}</td>
                                        <td className="py-3 text-right text-surface-600">{row.due}</td>
                                        <td className="py-3 text-right text-surface-600">{row.renewed}</td>
                                        <td className="py-3 text-right font-bold">
                                            <span className={row.rate >= 75 ? 'text-emerald-600' : row.rate >= 50 ? 'text-amber-600' : 'text-rose-600'}>
                                                {row.rate.toFixed(1)}%
                                            </span>
                                        </td>
                                        <td className="py-3 pl-4 w-32">
                                            <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all ${row.rate >= 75 ? 'bg-emerald-500' : row.rate >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                                    style={{ width: `${Math.min(100, row.rate)}%` }}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {!data?.byType?.length && (
                                    <tr><td colSpan={5} className="py-8 text-center text-surface-400">No renewal data available for this period.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
}
