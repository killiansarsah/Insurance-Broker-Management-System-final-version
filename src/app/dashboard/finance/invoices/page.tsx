'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    FileText,
    CheckCircle2,
    Clock,
    AlertTriangle,
    Download,
    Plus,
    XCircle,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-display/data-table';
import { StatusBadge } from '@/components/data-display/status-badge';
import { BackButton } from '@/components/ui/back-button';
import { invoices, financeSummary, Invoice } from '@/mock/finance';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { CustomSelect } from '@/components/ui/select-custom';
import Link from 'next/link';

type InvoiceStatus = 'all' | 'paid' | 'outstanding' | 'overdue' | 'partial' | 'cancelled';

const KPIS = [
    {
        label: 'Total Invoiced',
        value: formatCurrency(invoices.reduce((s, i) => s + i.amount, 0)),
        icon: FileText,
        color: 'text-primary-600',
        bg: 'bg-primary-50',
    },
    {
        label: 'Total Paid',
        value: formatCurrency(invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amountPaid, 0)),
        icon: CheckCircle2,
        color: 'text-success-600',
        bg: 'bg-success-50',
    },
    {
        label: 'Outstanding',
        value: formatCurrency(financeSummary.outstanding),
        icon: Clock,
        color: 'text-warning-600',
        bg: 'bg-warning-50',
    },
    {
        label: 'Overdue',
        value: formatCurrency(financeSummary.overdue),
        icon: AlertTriangle,
        color: 'text-danger-600',
        bg: 'bg-danger-50',
    },
];

const STATUS_OPTIONS = [
    { label: 'All Statuses', value: 'all' },
    { label: 'Paid', value: 'paid' },
    { label: 'Outstanding', value: 'outstanding' },
    { label: 'Overdue', value: 'overdue' },
    { label: 'Partial', value: 'partial' },
    { label: 'Cancelled', value: 'cancelled' },
];

const METHOD_BADGE: Record<string, string> = {
    paid: 'success',
    outstanding: 'warning',
    overdue: 'danger',
    partial: 'warning',
    cancelled: 'surface',
};

export default function InvoicesPage() {
    const router = useRouter();
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const filtered = statusFilter === 'all'
        ? invoices
        : invoices.filter(i => i.status === statusFilter);

    const balance = (inv: Invoice) => inv.amount - inv.amountPaid;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <BackButton href="/dashboard/finance" />
                    <div>
                        <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Invoices</h1>
                        <p className="text-sm text-surface-500 mt-1">Premium invoices linked to policies and clients.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" leftIcon={<Download size={16} />}>Export CSV</Button>
                    <Button variant="primary" leftIcon={<Plus size={16} />}>New Invoice</Button>
                </div>
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {KPIS.map((kpi, i) => (
                    <Card key={i} padding="none" className="p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className={cn('p-3 rounded-full shrink-0', kpi.bg, kpi.color)}>
                            <kpi.icon size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider">{kpi.label}</p>
                            <p className="text-xl font-bold text-surface-900 mt-0.5 tabular-nums">{kpi.value}</p>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Invoice Table */}
            <DataTable
                data={filtered}
                columns={[
                    {
                        key: 'invoiceNumber',
                        label: 'Invoice #',
                        sortable: true,
                        render: (inv) => (
                            <span className="font-mono font-bold text-primary-600 text-xs">{inv.invoiceNumber}</span>
                        ),
                    },
                    {
                        key: 'clientName',
                        label: 'Client',
                        sortable: true,
                        render: (inv) => (
                            <Link
                                href={`/dashboard/clients/${inv.clientId}`}
                                className="text-sm font-medium text-surface-900 hover:text-primary-600 transition-colors underline-offset-2 hover:underline"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {inv.clientName}
                            </Link>
                        ),
                    },
                    {
                        key: 'policyNumber',
                        label: 'Policy #',
                        sortable: true,
                        render: (inv) => (
                            <Link
                                href={`/dashboard/policies/${inv.policyId}`}
                                className="text-xs font-mono text-primary-600 hover:text-primary-800 transition-colors hover:underline underline-offset-2"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {inv.policyNumber}
                            </Link>
                        ),
                    },
                    {
                        key: 'description',
                        label: 'Description',
                        sortable: false,
                        render: (inv) => <span className="text-xs text-surface-600">{inv.description}</span>,
                    },
                    {
                        key: 'amount',
                        label: 'Amount',
                        sortable: true,
                        render: (inv) => <span className="font-bold text-sm tabular-nums">{formatCurrency(inv.amount)}</span>,
                    },
                    {
                        key: 'amountPaid',
                        label: 'Paid',
                        sortable: true,
                        render: (inv) => <span className="text-success-600 font-semibold text-sm tabular-nums">{formatCurrency(inv.amountPaid)}</span>,
                    },
                    {
                        key: 'balance' as any,
                        label: 'Balance',
                        sortable: false,
                        render: (inv) => {
                            const bal = balance(inv);
                            return <span className={cn('font-semibold text-sm tabular-nums', bal > 0 ? 'text-danger-600' : 'text-surface-400')}>{formatCurrency(bal)}</span>;
                        },
                    },
                    {
                        key: 'dateDue',
                        label: 'Due Date',
                        sortable: true,
                        render: (inv) => <span className="text-xs text-surface-500">{formatDate(inv.dateDue)}</span>,
                    },
                    {
                        key: 'status',
                        label: 'Status',
                        sortable: true,
                        render: (inv) => <StatusBadge status={inv.status} />,
                    },
                ]}
                searchKeys={['invoiceNumber', 'clientName', 'policyNumber', 'description']}
                headerActions={
                    <CustomSelect
                        label="Status"
                        options={STATUS_OPTIONS}
                        value={statusFilter}
                        onChange={(v) => setStatusFilter(v as string)}
                    />
                }
            />
        </div>
    );
}
