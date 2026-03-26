'use client';

import { useMemo, useState } from 'react';
import { Download, FileText, AlertTriangle } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useClaims } from '@/hooks/api';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { AppLoader } from '@/components/ui/AppLoader';
import { generateReportPdf } from '@/lib/generate-report-pdf';
import { toast } from 'sonner';
import { format, startOfQuarter, endOfQuarter, subQuarters } from 'date-fns';

// ─── NIC compliance helper ────────────────────────────────────────────────────
function deadlineStatus(deadline?: string, completedDate?: string): 'MET' | 'BREACHED' | 'PENDING' {
    if (!deadline) return 'PENDING';
    if (completedDate) return new Date(completedDate) <= new Date(deadline) ? 'MET' : 'BREACHED';
    return new Date(deadline) < new Date() ? 'BREACHED' : 'PENDING';
}

// ─── CSV export ───────────────────────────────────────────────────────────────
function exportCsv(rows: Record<string, string>[], filename: string) {
    if (rows.length === 0) return toast.error('No data to export');
    const headers = Object.keys(rows[0]);
    const lines = [
        headers.join(','),
        ...rows.map(r => headers.map(h => `"${(r[h] ?? '').replace(/"/g, '""')}"`).join(','))
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Excel file downloaded');
}

// ─── Quarterly shortcuts ──────────────────────────────────────────────────────
function getQuarterRange(offset: number): { from: string; to: string; label: string } {
    const base = offset === 0 ? new Date() : subQuarters(new Date(), offset);
    const from = format(startOfQuarter(base), 'yyyy-MM-dd');
    const to = format(endOfQuarter(base), 'yyyy-MM-dd');
    const quarter = Math.floor(base.getMonth() / 3) + 1;
    const year = base.getFullYear();
    return { from, to, label: `Q${quarter} ${year}` };
}

// ─── StatusPill ───────────────────────────────────────────────────────────────
function CompliancePill({ status }: { status: 'MET' | 'BREACHED' | 'PENDING' }) {
    const map = {
        MET: 'bg-success-100 text-success-700 border-success-200',
        BREACHED: 'bg-danger-100 text-danger-700 border-danger-200',
        PENDING: 'bg-surface-100 text-surface-500 border-surface-200',
    };
    return (
        <span className={cn('text-[10px] font-bold border px-2 py-0.5 rounded-full whitespace-nowrap', map[status])}>
            {status}
        </span>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function NicRegisterPage() {
    const now = new Date();
    const currentQ = getQuarterRange(0);
    const [dateFrom, setDateFrom] = useState(currentQ.from);
    const [dateTo, setDateTo] = useState(currentQ.to);
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');

    const { data: claimsData, isLoading } = useClaims();
    const allClaims: any[] = (claimsData as any)?.items ?? (claimsData as any)?.data ?? (Array.isArray(claimsData) ? claimsData : []);

    // Filter claims by date range (using intimationDate as NIC clock start)
    const filteredClaims = useMemo(() => {
        return allClaims.filter(c => {
            const d = (c.intimationDate || c.createdAt || '') as string;
            if (dateFrom && d < dateFrom) return false;
            if (dateTo && d > dateTo) return false;
            if (statusFilter === 'open' && ['SETTLED', 'CLOSED', 'REJECTED'].includes(c.status as string)) return false;
            if (statusFilter === 'settled' && c.status !== 'SETTLED') return false;
            if (statusFilter === 'breached') {
                const s5 = deadlineStatus(c.acknowledgmentDeadline, c.acknowledgmentDate);
                const s30 = deadlineStatus(c.processingDeadline, c.settlementDate);
                if (s5 !== 'BREACHED' && s30 !== 'BREACHED') return false;
            }
            if (typeFilter !== 'all' && c.insuranceType !== typeFilter) return false;
            return true;
        });
    }, [allClaims, dateFrom, dateTo, statusFilter, typeFilter]);

    // Breach summary
    const breachSummary = useMemo(() => {
        let b5 = 0; let b30 = 0;
        filteredClaims.forEach(c => {
            if (deadlineStatus(c.acknowledgmentDeadline, c.acknowledgmentDate) === 'BREACHED') b5++;
            if (deadlineStatus(c.processingDeadline, c.settlementDate) === 'BREACHED') b30++;
        });
        return { b5, b30, total: filteredClaims.length };
    }, [filteredClaims]);

    // Build rows for table / export
    const rows = useMemo(() => filteredClaims.map(c => {
        const s5 = deadlineStatus(c.acknowledgmentDeadline, c.acknowledgmentDate);
        const s30 = deadlineStatus(c.processingDeadline, c.settlementDate);
        return {
            'Claim Number': (c.claimNumber as string) || '',
            'Policy Number': (c.policyNumber as string) || '',
            'Client Name': (c.clientName as string) || '',
            'Client TIN': (c as any).clientTin || '',
            'Carrier Name': (c as any).insurerName || (c as any).carrierName || '',
            'Insurance Type': (c.insuranceType as string || '').replace(/_/g, ' '),
            'Peril Type': (c as any).perilType || '',
            'Incident Date': c.incidentDate ? formatDate(c.incidentDate as string) : '',
            'Date Intimated': c.intimationDate ? formatDate(c.intimationDate as string) : '',
            'Date Acknowledged': c.acknowledgmentDate ? formatDate(c.acknowledgmentDate as string) : '',
            '5-Day Deadline': c.acknowledgmentDeadline ? formatDate(c.acknowledgmentDeadline as string) : '',
            '5-Day Compliance': s5,
            'Claimed Amount (GHS)': c.claimAmount ? formatCurrency(c.claimAmount as number) : '',
            'Approved Amount (GHS)': c.assessedAmount ? formatCurrency(c.assessedAmount as number) : '',
            'Settlement Date': c.settlementDate ? formatDate(c.settlementDate as string) : '',
            '30-Day Deadline': c.processingDeadline ? formatDate(c.processingDeadline as string) : '',
            '30-Day Compliance': s30,
            'Claim Status': (c.status as string || '').replace(/_/g, ' '),
            'Follow-Up Interactions': String((c as any).followUpCount || 0),
            'Account Officer': (c as any).assignedBrokerName || '',
            // helpers (not shown as columns)
            _id: c.id as string,
            _s5: s5,
            _s30: s30,
        };
    }), [filteredClaims]);

    const DISPLAY_COLUMNS = [
        'Claim Number', 'Policy Number', 'Client Name', 'Client TIN', 'Carrier Name',
        'Insurance Type', 'Peril Type', 'Incident Date', 'Date Intimated', 'Date Acknowledged',
        '5-Day Deadline', '5-Day Compliance', 'Claimed Amount (GHS)', 'Approved Amount (GHS)',
        'Settlement Date', '30-Day Deadline', '30-Day Compliance', 'Claim Status',
        'Follow-Up Interactions', 'Account Officer',
    ];

    function handleExcel() {
        const exportRows = rows.map(r => {
            const o: Record<string, string> = {};
            DISPLAY_COLUMNS.forEach(col => { o[col] = (r as any)[col] ?? ''; });
            return o;
        });
        exportCsv(exportRows, `NIC-Claims-Register-${dateFrom}-to-${dateTo}.csv`);
    }

    function handlePdf() {
        generateReportPdf(`NIC Claims Register — ${dateFrom} to ${dateTo}`, [
            { title: 'Breach Summary', rows: [
                { label: '5-Day Acknowledgement Breaches', value: String(breachSummary.b5) },
                { label: '30-Day Settlement Breaches', value: String(breachSummary.b30) },
                { label: 'Total Claims in Period', value: String(breachSummary.total) },
                { label: 'Period', value: `${dateFrom} — ${dateTo}` },
            ]},
            ...filteredClaims.slice(0, 50).map(c => ({
                title: c.claimNumber as string,
                rows: [
                    { label: 'Client', value: c.clientName as string || '' },
                    { label: 'Policy', value: c.policyNumber as string || '' },
                    { label: 'Status', value: c.status as string || '' },
                    { label: '5-Day Compliance', value: deadlineStatus(c.acknowledgmentDeadline, c.acknowledgmentDate) },
                    { label: '30-Day Compliance', value: deadlineStatus(c.processingDeadline, c.settlementDate) },
                ],
            })),
        ]);
        toast.success('PDF report generated');
    }

    const QUARTERS = [0, 1, 2, 3].map(n => getQuarterRange(n));

    if (isLoading) return <AppLoader message="Loading NIC register data..." isLoading={true} />;

    return (
        <div className="space-y-5 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-surface-900 tracking-tight">NIC Claims Register</h1>
                    <p className="text-sm text-surface-500 mt-1">
                        Statutory quarterly claims report — NIC Act 1061 · Read-only · Cannot be edited after generation
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" leftIcon={<FileText size={14} />} onClick={handlePdf}>Export PDF</Button>
                    <Button variant="primary" size="sm" leftIcon={<Download size={14} />} onClick={handleExcel}>Export Excel</Button>
                </div>
            </div>

            {/* Report Controls */}
            <Card padding="lg">
                <CardHeader title="Report Parameters" />
                <div className="mt-4 flex flex-wrap items-end gap-4">
                    {/* Quarterly shortcuts */}
                    <div>
                        <label className="text-xs font-bold text-surface-500 uppercase block mb-1.5">Quick Select</label>
                        <div className="flex gap-1.5">
                            {QUARTERS.map(q => (
                                <button
                                    key={q.label}
                                    onClick={() => { setDateFrom(q.from); setDateTo(q.to); }}
                                    className={cn(
                                        'px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer',
                                        dateFrom === q.from && dateTo === q.to
                                            ? 'bg-primary-600 text-white border-primary-600'
                                            : 'border-surface-200 text-surface-600 hover:border-primary-300'
                                    )}
                                >
                                    {q.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Date range */}
                    <div>
                        <label className="text-xs font-bold text-surface-500 uppercase block mb-1.5">Date Range (Intimation Date)</label>
                        <div className="flex items-center gap-2">
                            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                                className="text-xs border border-surface-200 rounded-lg px-2 py-1.5 bg-surface-50 text-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-500/30" />
                            <span className="text-surface-400 text-xs">to</span>
                            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                                className="text-xs border border-surface-200 rounded-lg px-2 py-1.5 bg-surface-50 text-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-500/30" />
                        </div>
                    </div>
                    {/* Filters */}
                    <div>
                        <label className="text-xs font-bold text-surface-500 uppercase block mb-1.5">Status</label>
                        <select className="text-xs border border-surface-200 rounded-lg px-3 py-1.5 bg-surface-50 text-surface-700" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                            <option value="all">All Claims</option>
                            <option value="open">Open Only</option>
                            <option value="settled">Settled Only</option>
                            <option value="breached">Breached Deadlines Only</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-surface-500 uppercase block mb-1.5">Insurance Type</label>
                        <select className="text-xs border border-surface-200 rounded-lg px-3 py-1.5 bg-surface-50 text-surface-700" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                            <option value="all">All Lines</option>
                            <option value="MOTOR">Motor</option>
                            <option value="FIRE">Fire</option>
                            <option value="MARINE">Marine</option>
                            <option value="HEALTH">Health</option>
                            <option value="LIFE">Life</option>
                            <option value="TRAVEL">Travel</option>
                        </select>
                    </div>
                </div>
            </Card>

            {/* Breach Summary — always shown first */}
            <div className={cn(
                'rounded-xl border-2 p-4',
                (breachSummary.b5 > 0 || breachSummary.b30 > 0) ? 'border-danger-300 bg-danger-50' : 'border-success-300 bg-success-50'
            )}>
                <div className="flex items-start gap-3">
                    {(breachSummary.b5 > 0 || breachSummary.b30 > 0) ? (
                        <AlertTriangle size={18} className="text-danger-600 mt-0.5 shrink-0" />
                    ) : (
                        <FileText size={18} className="text-success-600 mt-0.5 shrink-0" />
                    )}
                    <div>
                        <p className="text-sm font-bold text-surface-900">Breach Summary — {dateFrom} to {dateTo}</p>
                        <p className="text-xs text-surface-500 mt-0.5">This summary is permanently attached to this report and cannot be removed.</p>
                        <div className="mt-2 flex flex-wrap gap-6">
                            <div>
                                <p className="text-2xl font-black text-danger-700">{breachSummary.b5}</p>
                                <p className="text-[10px] font-bold text-surface-500 uppercase">5-Day Rule Breaches</p>
                            </div>
                            <div>
                                <p className="text-2xl font-black text-danger-700">{breachSummary.b30}</p>
                                <p className="text-[10px] font-bold text-surface-500 uppercase">30-Day Rule Breaches</p>
                            </div>
                            <div>
                                <p className="text-2xl font-black text-surface-700">{breachSummary.total}</p>
                                <p className="text-[10px] font-bold text-surface-500 uppercase">Total Claims</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Register Table (read-only, horizontal scroll) */}
            <div className="rounded-xl border border-surface-200 overflow-x-auto">
                <table className="w-full text-sm min-w-[1400px]">
                    <thead className="bg-surface-50 border-b border-surface-200 sticky top-0">
                        <tr>
                            {DISPLAY_COLUMNS.map(col => (
                                <th key={col} className="text-left px-3 py-2.5 text-[10px] font-bold text-surface-500 uppercase tracking-wider whitespace-nowrap">
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 && (
                            <tr><td colSpan={DISPLAY_COLUMNS.length} className="text-center py-10 text-sm text-surface-400">No claims found for this period and filters.</td></tr>
                        )}
                        {rows.map((row, i) => (
                            <tr key={row._id} className={cn('border-b border-surface-100 hover:bg-surface-50', i % 2 === 0 ? '' : 'bg-surface-50/40')}>
                                {DISPLAY_COLUMNS.map(col => {
                                    const val = (row as any)[col] as string;
                                    const isClaimNum = col === 'Claim Number';
                                    const isPolicyNum = col === 'Policy Number';
                                    const is5Comp = col === '5-Day Compliance';
                                    const is30Comp = col === '30-Day Compliance';
                                    return (
                                        <td key={col} className="px-3 py-2.5 whitespace-nowrap">
                                            {isClaimNum && (
                                                <span className="text-[11px] font-mono text-surface-500 bg-surface-100/80 border border-surface-200/50 px-2 py-0.5 rounded-md">{val}</span>
                                            )}
                                            {isPolicyNum && (
                                                <span className="text-[11px] font-mono text-surface-400 bg-surface-50 border border-surface-200/30 px-2 py-0.5 rounded-md">{val}</span>
                                            )}
                                            {is5Comp && <CompliancePill status={row._s5} />}
                                            {is30Comp && <CompliancePill status={row._s30} />}
                                            {!isClaimNum && !isPolicyNum && !is5Comp && !is30Comp && (
                                                <span className="text-xs text-surface-700">{val || '—'}</span>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <p className="text-xs text-surface-400 text-center pb-4">
                This register is generated directly from live system data. Breach flags are permanent records and cannot be removed. — NIC Act 1061
            </p>
        </div>
    );
}
