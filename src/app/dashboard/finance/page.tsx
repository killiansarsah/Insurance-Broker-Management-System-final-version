'use client';

import { useState } from 'react';
import {
    DollarSign,
    CheckCircle2,
    Clock,
    AlertTriangle,
    Filter,
    Download,
    Plus,
    Receipt,
} from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data-display/data-table';
import { StatusBadge } from '@/components/data-display/status-badge';
import { invoices, receipts, financeSummary } from '@/mock/finance';
import { formatCurrency, formatDate, cn } from '@/lib/utils';

type Tab = 'invoices' | 'receipts';

const STATS = [
    {
        label: 'Total Collected',
        value: formatCurrency(financeSummary.collected),
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
    {
        label: 'Total Revenue',
        value: formatCurrency(financeSummary.totalRevenue),
        icon: DollarSign,
        color: 'text-primary-600',
        bg: 'bg-primary-50',
    },
];

const PAYMENT_LABELS: Record<string, string> = {
    bank_transfer: 'Bank Transfer',
    mobile_money: 'Mobile Money',
    cash: 'Cash',
    cheque: 'Cheque',
};

export default function FinancePage() {
    const [tab, setTab] = useState<Tab>('invoices');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const filteredInvoices = statusFilter === 'all'
        ? invoices
        : invoices.filter(i => i.status === statusFilter);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Finance</h1>
                    <p className="text-sm text-surface-500 mt-1">Manage invoices, payments, and premium collection.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" leftIcon={<Download size={16} />}>Export</Button>
                    <Button variant="primary" leftIcon={<Plus size={16} />}>New Invoice</Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {STATS.map((stat, i) => (
                    <Card key={i} padding="none" className="p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className={cn('p-3 rounded-full', stat.bg, stat.color)}>
                            <stat.icon size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider">{stat.label}</p>
                            <p className="text-xl font-bold text-surface-900 mt-0.5">{stat.value}</p>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Tab Switch */}
            <div className="flex gap-1 bg-surface-100 p-1 rounded-[var(--radius-md)] w-fit">
                <button
                    onClick={() => setTab('invoices')}
                    className={cn(
                        'px-4 py-2 text-sm font-medium rounded-[var(--radius-sm)] transition-all',
                        tab === 'invoices'
                            ? 'bg-white text-surface-900 shadow-sm'
                            : 'text-surface-500 hover:text-surface-700'
                    )}
                >
                    <span className="flex items-center gap-2"><DollarSign size={14} /> Invoices</span>
                </button>
                <button
                    onClick={() => setTab('receipts')}
                    className={cn(
                        'px-4 py-2 text-sm font-medium rounded-[var(--radius-sm)] transition-all',
                        tab === 'receipts'
                            ? 'bg-white text-surface-900 shadow-sm'
                            : 'text-surface-500 hover:text-surface-700'
                    )}
                >
                    <span className="flex items-center gap-2"><Receipt size={14} /> Receipts</span>
                </button>
            </div>

            {/* Invoices Table */}
            {tab === 'invoices' && (
                <DataTable
                    data={filteredInvoices}
                    columns={[
                        {
                            key: 'invoiceNumber',
                            label: 'Invoice #',
                            sortable: true,
                            render: (i) => <span className="font-mono font-medium text-primary-600">{i.invoiceNumber}</span>
                        },
                        { key: 'clientName', label: 'Client', sortable: true },
                        { key: 'policyNumber', label: 'Policy #', sortable: true },
                        { key: 'description', label: 'Description', sortable: false },
                        {
                            key: 'amount',
                            label: 'Amount',
                            sortable: true,
                            render: (i) => <span className="font-bold">{formatCurrency(i.amount)}</span>
                        },
                        {
                            key: 'amountPaid',
                            label: 'Paid',
                            sortable: true,
                            render: (i) => formatCurrency(i.amountPaid)
                        },
                        {
                            key: 'dateDue',
                            label: 'Due Date',
                            sortable: true,
                            render: (i) => formatDate(i.dateDue)
                        },
                        {
                            key: 'status',
                            label: 'Status',
                            sortable: true,
                            render: (i) => <StatusBadge status={i.status} />
                        },
                    ]}
                    searchKeys={['invoiceNumber', 'clientName', 'policyNumber']}
                    headerActions={
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Filter size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-surface-400" />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="pl-8 pr-3 py-2 text-xs font-medium bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 appearance-none cursor-pointer"
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="paid">Paid</option>
                                    <option value="outstanding">Outstanding</option>
                                    <option value="partial">Partial</option>
                                    <option value="overdue">Overdue</option>
                                </select>
                            </div>
                        </div>
                    }
                />
            )}

            {/* Receipts Table */}
            {tab === 'receipts' && (
                <DataTable
                    data={receipts}
                    columns={[
                        {
                            key: 'receiptNumber',
                            label: 'Receipt #',
                            sortable: true,
                            render: (r) => <span className="font-mono font-medium text-primary-600">{r.receiptNumber}</span>
                        },
                        { key: 'clientName', label: 'Client', sortable: true },
                        {
                            key: 'amount',
                            label: 'Amount',
                            sortable: true,
                            render: (r) => <span className="font-bold">{formatCurrency(r.amount)}</span>
                        },
                        {
                            key: 'paymentMethod',
                            label: 'Method',
                            sortable: true,
                            render: (r) => (
                                <Badge variant="outline">{PAYMENT_LABELS[r.paymentMethod] ?? r.paymentMethod}</Badge>
                            )
                        },
                        { key: 'reference', label: 'Reference', sortable: true },
                        {
                            key: 'dateReceived',
                            label: 'Date',
                            sortable: true,
                            render: (r) => formatDate(r.dateReceived)
                        },
                    ]}
                    searchKeys={['receiptNumber', 'clientName', 'reference']}
                />
            )}
        </div>
    );
}
