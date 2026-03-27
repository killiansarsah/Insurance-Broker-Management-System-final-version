'use client';

import { useState } from 'react';
import {
    ArrowUpRight,
    CheckCircle2,
    Clock,
    AlertCircle,
    Download,
    Plus,
    Send,
} from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-display/data-table';
import { StatusBadge } from '@/components/data-display/status-badge';
import { BackButton } from '@/components/ui/back-button';
import { useRemittances, useCreateRemittance, useConfirmRemittance } from '@/hooks/api';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { toast } from 'sonner';

const STATUS_OPTIONS = [
    { label: 'All Statuses', value: 'all' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Partial', value: 'PARTIAL' },
    { label: 'Remitted', value: 'REMITTED' },
];

const COLUMNS = [
    { key: 'remittanceNumber', label: 'Remittance #', sortable: true },
    {
        key: 'carrier', label: 'Carrier', render: (row: Record<string, unknown>) => {
            const carrier = row.carrier as Record<string, unknown> | null;
            return carrier?.name as string ?? '—';
        }
    },
    {
        key: 'POLICY', label: 'Policy', render: (row: Record<string, unknown>) => {
            const policy = row.policy as Record<string, unknown> | null;
            return policy?.policyNumber as string ?? '—';
        }
    },
    { key: 'premiumAmount', label: 'Premium', render: (row: Record<string, unknown>) => formatCurrency(Number(row.premiumAmount)) },
    { key: 'amountRemitted', label: 'Remitted', render: (row: Record<string, unknown>) => formatCurrency(Number(row.amountRemitted)) },
    {
        key: 'status', label: 'Status', render: (row: Record<string, unknown>) => (
            <StatusBadge status={(row.status as string) as 'PENDING' | 'PARTIAL'} />
        )
    },
    { key: 'remittanceDate', label: 'Date', render: (row: Record<string, unknown>) => row.remittanceDate ? formatDate(row.remittanceDate as string) : '—' },
];

export default function RemittancesPage() {
    const [statusFilter, setStatusFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        carrierId: '', policyId: '', premiumAmount: '', amountRemitted: '', paymentMethod: 'BANK_TRANSFER', reference: '', notes: '',
    });

    const params: Record<string, unknown> = { page, limit: 20 };
    if (statusFilter !== 'all') params.status = statusFilter;

    const { data, isLoading } = useRemittances(params);
    const createRemittance = useCreateRemittance();
    const confirmRemittance = useConfirmRemittance();

    const remittances = (data as unknown as Record<string, unknown>)?.data as Record<string, unknown>[] ?? [];
    const meta = (data as unknown as Record<string, unknown>)?.meta as Record<string, unknown> ?? {};
    const aggregates = (data as unknown as Record<string, unknown>)?.aggregates as Record<string, unknown> ?? {};

    const handleConfirm = (remittanceId: string) => {
        confirmRemittance.mutate(
            { id: remittanceId, data: { paymentMethod: 'BANK_TRANSFER' } },
            {
                onSuccess: () => toast.success('Remittance confirmed — linked commissions marked EARNED'),
                onError: () => toast.error('Failed to confirm remittance'),
            }
        );
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createRemittance.mutate(
            {
                carrierId: formData.carrierId,
                policyId: formData.policyId,
                premiumAmount: Number(formData.premiumAmount),
                amountRemitted: Number(formData.amountRemitted),
                paymentMethod: formData.paymentMethod,
                reference: formData.reference || undefined,
                notes: formData.notes || undefined,
            },
            {
                onSuccess: () => {
                    toast.success('Remittance created');
                    setFormData({ carrierId: '', policyId: '', premiumAmount: '', amountRemitted: '', paymentMethod: 'BANK_TRANSFER', reference: '', notes: '' });
                    setShowForm(false);
                },
                onError: () => toast.error('Failed to create remittance'),
            }
        );
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <BackButton href="/dashboard/finance" />
                    <div>
                        <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Premium Remittances</h1>
                        <p className="text-sm text-surface-500 mt-1">Track premium payments to carriers per NIC Act 1061.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" leftIcon={<Download size={16} />} onClick={() => toast.info('Export coming soon')}>
                        Export
                    </Button>
                    <Button variant="primary" leftIcon={<Plus size={16} />} onClick={() => setShowForm(v => !v)}>
                        {showForm ? 'Cancel' : 'New Remittance'}
                    </Button>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card padding="none" className="p-5 flex items-center gap-4">
                    <div className="p-3 rounded-full bg-primary-50 text-primary-600"><ArrowUpRight size={20} /></div>
                    <div>
                        <p className="text-xs font-semibold text-surface-500 uppercase">Total Remitted</p>
                        <p className="text-xl font-bold text-surface-900 tabular-nums">{formatCurrency(Number(aggregates.totalRemitted ?? 0))}</p>
                    </div>
                </Card>
                <Card padding="none" className="p-5 flex items-center gap-4">
                    <div className="p-3 rounded-full bg-warning-50 text-warning-600"><Clock size={20} /></div>
                    <div>
                        <p className="text-xs font-semibold text-surface-500 uppercase">Pending</p>
                        <p className="text-xl font-bold text-surface-900 tabular-nums">{formatCurrency(Number(aggregates.totalPending ?? 0))}</p>
                    </div>
                </Card>
                <Card padding="none" className="p-5 flex items-center gap-4">
                    <div className="p-3 rounded-full bg-success-50 text-success-600"><CheckCircle2 size={20} /></div>
                    <div>
                        <p className="text-xs font-semibold text-surface-500 uppercase">Count</p>
                        <p className="text-xl font-bold text-surface-900 tabular-nums">{Number(meta.total ?? 0)}</p>
                    </div>
                </Card>
            </div>

            {/* Create Form */}
            {showForm ? (
                <Card padding="lg">
                    <CardHeader title="New Remittance" />
                    <form className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleCreate}>
                        <div>
                            <label className="text-xs font-semibold text-surface-500 uppercase">Carrier ID</label>
                            <input className="mt-1 w-full rounded-[var(--radius-md)] border border-surface-300 px-3 py-2 text-sm" placeholder="Carrier UUID" value={formData.carrierId} onChange={e => setFormData(d => ({ ...d, carrierId: e.target.value }))} required />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-surface-500 uppercase">Policy ID</label>
                            <input className="mt-1 w-full rounded-[var(--radius-md)] border border-surface-300 px-3 py-2 text-sm" placeholder="Policy UUID" value={formData.policyId} onChange={e => setFormData(d => ({ ...d, policyId: e.target.value }))} required />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-surface-500 uppercase">Premium Amount</label>
                            <input type="number" step="0.01" className="mt-1 w-full rounded-[var(--radius-md)] border border-surface-300 px-3 py-2 text-sm" value={formData.premiumAmount} onChange={e => setFormData(d => ({ ...d, premiumAmount: e.target.value }))} required />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-surface-500 uppercase">Amount Remitted</label>
                            <input type="number" step="0.01" className="mt-1 w-full rounded-[var(--radius-md)] border border-surface-300 px-3 py-2 text-sm" value={formData.amountRemitted} onChange={e => setFormData(d => ({ ...d, amountRemitted: e.target.value }))} required />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-surface-500 uppercase">Payment Method</label>
                            <select className="mt-1 w-full rounded-[var(--radius-md)] border border-surface-300 px-3 py-2 text-sm bg-white" value={formData.paymentMethod} onChange={e => setFormData(d => ({ ...d, paymentMethod: e.target.value }))}>
                                <option value="BANK_TRANSFER">Bank Transfer</option>
                                <option value="CHEQUE">Cheque</option>
                                <option value="MOBILE_MONEY">Mobile Money</option>
                                <option value="CASH">Cash</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-surface-500 uppercase">Reference</label>
                            <input className="mt-1 w-full rounded-[var(--radius-md)] border border-surface-300 px-3 py-2 text-sm" placeholder="Payment reference" value={formData.reference} onChange={e => setFormData(d => ({ ...d, reference: e.target.value }))} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-xs font-semibold text-surface-500 uppercase">Notes</label>
                            <textarea className="mt-1 w-full rounded-[var(--radius-md)] border border-surface-300 px-3 py-2 text-sm" rows={2} value={formData.notes} onChange={e => setFormData(d => ({ ...d, notes: e.target.value }))} />
                        </div>
                        <div className="md:col-span-2 flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                            <Button type="submit" variant="primary" isLoading={createRemittance.isPending}>Create Remittance</Button>
                        </div>
                    </form>
                </Card>
            ) : null}

            {/* Filters */}
            <div className="flex items-center gap-3">
                {STATUS_OPTIONS.map(opt => (
                    <button
                        key={opt.value}
                        onClick={() => { setStatusFilter(opt.value); setPage(1); }}
                        className={cn(
                            'px-3 py-1.5 rounded-full text-xs font-semibold transition-colors',
                            statusFilter === opt.value
                                ? 'bg-primary-600 text-white'
                                : 'bg-surface-100 dark:bg-slate-800 text-surface-600 dark:text-slate-300 hover:bg-surface-200 dark:hover:bg-slate-700 hover:text-primary-600 dark:hover:text-primary-400'
                        )}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            {/* Table */}
            <Card padding="none">
                <DataTable
                    columns={[
                        ...COLUMNS,
                        {
                            key: 'actions', label: '', render: (row: Record<string, unknown>) => (
                                row.status === 'PENDING' ? (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        leftIcon={<Send size={12} />}
                                        onClick={() => handleConfirm(row.id as string)}
                                        isLoading={confirmRemittance.isPending}
                                    >
                                        Confirm
                                    </Button>
                                ) : null
                            )
                        }
                    ]}
                    data={remittances}
                    emptyMessage="No remittances found"
                />
            </Card>

            {/* Pagination */}
            {meta.totalPages && Number(meta.totalPages) > 1 ? (
                <div className="flex justify-center gap-2">
                    <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
                    <span className="text-sm text-surface-500 self-center">Page {page} of {Number(meta.totalPages)}</span>
                    <Button variant="outline" size="sm" disabled={page >= Number(meta.totalPages)} onClick={() => setPage(p => p + 1)}>Next</Button>
                </div>
            ) : null}
        </div>
    );
}
