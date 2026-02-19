'use client';

import { useState } from 'react';
import {
    CreditCard,
    CheckCircle2,
    Calendar,
    Download,
    Banknote,
    Smartphone,
    Building,
    FileCheck,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data-display/data-table';
import { BackButton } from '@/components/ui/back-button';
import { receipts } from '@/mock/finance';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { CustomSelect } from '@/components/ui/select-custom';
import Link from 'next/link';

type Method = 'all' | 'bank_transfer' | 'mobile_money' | 'cash' | 'cheque' | 'card';

const METHOD_LABELS: Record<string, string> = {
    bank_transfer: 'Bank Transfer',
    mobile_money: 'Mobile Money',
    cash: 'Cash',
    cheque: 'Cheque',
    card: 'Card',
};

const METHOD_ICONS: Record<string, React.ReactNode> = {
    bank_transfer: <Building size={12} />,
    mobile_money: <Smartphone size={12} />,
    cash: <Banknote size={12} />,
    cheque: <FileCheck size={12} />,
    card: <CreditCard size={12} />,
};

const METHOD_COLORS: Record<string, string> = {
    bank_transfer: 'bg-primary-100 text-primary-700',
    mobile_money: 'bg-success-100 text-success-700',
    cash: 'bg-amber-100 text-amber-700',
    cheque: 'bg-surface-100 text-surface-700',
    card: 'bg-violet-100 text-violet-700',
};

const totalCollected = receipts.reduce((s, r) => s + r.amount, 0);
const thisMonth = receipts
    .filter(r => new Date(r.dateReceived) >= new Date('2025-02-01'))
    .reduce((s, r) => s + r.amount, 0);
const avgPayment = totalCollected / receipts.length;

// Method breakdown
const methodBreakdown = receipts.reduce((acc, r) => {
    if (!acc[r.paymentMethod]) acc[r.paymentMethod] = 0;
    acc[r.paymentMethod] += r.amount;
    return acc;
}, {} as Record<string, number>);

const KPIS = [
    { label: 'Total Collected', value: formatCurrency(totalCollected), icon: CheckCircle2, color: 'text-success-600', bg: 'bg-success-50' },
    { label: 'This Month', value: formatCurrency(thisMonth), icon: Calendar, color: 'text-primary-600', bg: 'bg-primary-50' },
    { label: 'Avg. Payment', value: formatCurrency(avgPayment), icon: CreditCard, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Total Receipts', value: `${receipts.length} receipts`, icon: FileCheck, color: 'text-violet-600', bg: 'bg-violet-50' },
];

export default function PaymentsPage() {
    const [methodFilter, setMethodFilter] = useState<string>('all');

    const filtered = methodFilter === 'all'
        ? receipts
        : receipts.filter(r => r.paymentMethod === methodFilter);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <BackButton href="/dashboard/finance" />
                    <div>
                        <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Payments</h1>
                        <p className="text-sm text-surface-500 mt-1">Complete record of all premium payments received.</p>
                    </div>
                </div>
                <Button variant="outline" leftIcon={<Download size={16} />}>Export Statement</Button>
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

            {/* Method Breakdown */}
            <Card padding="lg">
                <p className="text-xs font-bold text-surface-500 uppercase tracking-widest mb-4">Payment Method Breakdown</p>
                <div className="flex flex-wrap gap-3">
                    {Object.entries(methodBreakdown).map(([method, total]) => {
                        const pct = Math.round((total / totalCollected) * 100);
                        return (
                            <div
                                key={method}
                                className="flex items-center gap-2 px-3 py-2 rounded-full bg-surface-50 border border-surface-100 cursor-pointer hover:shadow-sm transition-all"
                                onClick={() => setMethodFilter(methodFilter === method ? 'all' : method)}
                            >
                                <span className={cn('flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold', METHOD_COLORS[method])}>
                                    {METHOD_ICONS[method]}
                                    {METHOD_LABELS[method]}
                                </span>
                                <span className="text-sm font-bold text-surface-900 tabular-nums">{formatCurrency(total)}</span>
                                <span className="text-xs text-surface-400">{pct}%</span>
                            </div>
                        );
                    })}
                </div>
            </Card>

            {/* Payments Table */}
            <DataTable
                data={filtered}
                columns={[
                    {
                        key: 'receiptNumber',
                        label: 'Receipt #',
                        sortable: true,
                        render: (r) => <span className="font-mono font-bold text-success-600 text-xs">{r.receiptNumber}</span>,
                    },
                    {
                        key: 'clientName',
                        label: 'Client',
                        sortable: true,
                        render: (r) => (
                            <Link
                                href={`/dashboard/clients/${r.clientId}`}
                                className="text-sm font-medium text-surface-900 hover:text-primary-600 transition-colors hover:underline underline-offset-2"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {r.clientName}
                            </Link>
                        ),
                    },
                    {
                        key: 'policyNumber',
                        label: 'Policy #',
                        sortable: true,
                        render: (r) => r.policyNumber ? (
                            <Link
                                href={`/dashboard/policies/${r.policyId}`}
                                className="text-xs font-mono text-primary-600 hover:underline underline-offset-2"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {r.policyNumber}
                            </Link>
                        ) : <span className="text-surface-400 text-xs">—</span>,
                    },
                    {
                        key: 'invoiceNumber',
                        label: 'Invoice #',
                        sortable: true,
                        render: (r) => r.invoiceNumber ? (
                            <Link
                                href="/dashboard/finance/invoices"
                                className="text-xs font-mono text-surface-600 hover:underline underline-offset-2"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {r.invoiceNumber}
                            </Link>
                        ) : <span className="text-surface-400 text-xs">—</span>,
                    },
                    {
                        key: 'amount',
                        label: 'Amount',
                        sortable: true,
                        render: (r) => <span className="font-bold text-sm tabular-nums text-success-700">+{formatCurrency(r.amount)}</span>,
                    },
                    {
                        key: 'paymentMethod',
                        label: 'Method',
                        sortable: true,
                        render: (r) => (
                            <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold', METHOD_COLORS[r.paymentMethod])}>
                                {METHOD_ICONS[r.paymentMethod]}
                                {METHOD_LABELS[r.paymentMethod]}
                            </span>
                        ),
                    },
                    {
                        key: 'reference',
                        label: 'Reference',
                        sortable: true,
                        render: (r) => <span className="text-xs font-mono text-surface-500">{r.reference}</span>,
                    },
                    {
                        key: 'dateReceived',
                        label: 'Date',
                        sortable: true,
                        render: (r) => <span className="text-xs text-surface-500">{formatDate(r.dateReceived)}</span>,
                    },
                ]}
                searchKeys={['receiptNumber', 'clientName', 'reference', 'policyNumber']}
                headerActions={
                    <CustomSelect
                        label="Payment Method"
                        options={[
                            { label: 'All Methods', value: 'all' },
                            { label: 'Bank Transfer', value: 'bank_transfer' },
                            { label: 'Mobile Money', value: 'mobile_money' },
                            { label: 'Cash', value: 'cash' },
                            { label: 'Cheque', value: 'cheque' },
                            { label: 'Card', value: 'card' },
                        ]}
                        value={methodFilter}
                        onChange={(v) => setMethodFilter(v as string)}
                    />
                }
            />
        </div>
    );
}
