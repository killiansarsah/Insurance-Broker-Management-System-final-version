'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { useInvoices } from '@/hooks/api/use-finance';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { CustomSelect } from '@/components/ui/select-custom';
const NewInvoiceModal = dynamic(
    () => import('@/components/finance/new-invoice-modal').then(m => ({ default: m.NewInvoiceModal })),
    { ssr: false }
);
import Link from 'next/link';

type InvoiceStatus = 'all' | 'PAID' | 'OUTSTANDING' | 'OVERDUE' | 'PARTIAL' | 'CANCELLED';

const STATUS_OPTIONS = [
    { label: 'All Statuses', value: 'all' },
    { label: 'Paid', value: 'PAID' },
    { label: 'Outstanding', value: 'OUTSTANDING' },
    { label: 'Overdue', value: 'OVERDUE' },
    { label: 'Partial', value: 'PARTIAL' },
    { label: 'Cancelled', value: 'CANCELLED' },
];

const METHOD_BADGE: Record<string, string> = {
    PAID: 'success',
    OUTSTANDING: 'warning',
    OVERDUE: 'danger',
    PARTIAL: 'warning',
    CANCELLED: 'surface',
};

export default function InvoicesPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const statusParam = searchParams.get('status') as InvoiceStatus | null;
    const newParam = searchParams.get('new');
    const [statusFilter, setStatusFilter] = useState<string>(statusParam || 'all');
    const [showNewInvoice, setShowNewInvoice] = useState(newParam === '1');

    const { data: invoicesData } = useInvoices();
    const allInvoices: any[] = ((invoicesData as any)?.items ?? (invoicesData as any)?.data ?? (Array.isArray(invoicesData) ? invoicesData : []));

    const filtered = statusFilter === 'all'
        ? allInvoices
        : allInvoices.filter((i: any) => i.status === statusFilter);

    const balance = (inv: any) => (inv.amount || 0) - (inv.amountPaid || 0);

    const totalInvoiced = allInvoices.reduce((s: number, i: any) => s + (i.amount || 0), 0);
    const totalPaid = allInvoices.reduce((s: number, i: any) => s + (i.amountPaid || 0), 0);
    const outstanding = allInvoices.filter((i: any) => i.status !== 'CANCELLED' && i.status !== 'PAID').reduce((s: number, i: any) => s + balance(i), 0);
    const overdueAmt = allInvoices.filter((i: any) => i.status === 'OVERDUE').reduce((s: number, i: any) => s + balance(i), 0);

    const KPIS = [
        { label: 'Total Invoiced', value: formatCurrency(totalInvoiced), icon: FileText, color: 'text-primary-600', bg: 'bg-primary-50' },
        { label: 'Total Paid', value: formatCurrency(totalPaid), icon: CheckCircle2, color: 'text-success-600', bg: 'bg-success-50' },
        { label: 'Outstanding', value: formatCurrency(outstanding), icon: Clock, color: 'text-warning-600', bg: 'bg-warning-50' },
        { label: 'Overdue', value: formatCurrency(overdueAmt), icon: AlertTriangle, color: 'text-danger-600', bg: 'bg-danger-50' },
    ];

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
                    <Button variant="outline" leftIcon={<Download size={16} />} onClick={async () => {
                        const ExcelJS = await import('exceljs');
                        const { saveAs } = await import('file-saver');
                        const workbook = new ExcelJS.Workbook();
                        const sheet = workbook.addWorksheet('Invoices');

                        sheet.mergeCells('A1:I1');
                        sheet.getCell('A1').value = 'Invoice Report';
                        sheet.getCell('A1').font = { bold: true, size: 14 };
                        sheet.mergeCells('A2:I2');
                        sheet.getCell('A2').value = `Generated: ${new Date().toLocaleString()}`;
                        sheet.getCell('A2').font = { size: 10, color: { argb: 'FF64748B' } };

                        const headers = ['Invoice #', 'Client', 'Policy #', 'Description', 'Amount (GHS)', 'Paid (GHS)', 'Balance (GHS)', 'Due Date', 'Status'];
                        const headerRow = sheet.getRow(4);
                        headerRow.values = headers;
                        headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
                        const headerColors = ['FFEA580C', 'FFEA580C', 'FF1D4ED8', 'FF1D4ED8', 'FF047857', 'FF047857', 'FFBE123C', 'FF4338CA', 'FF0F766E'];
                        headerRow.eachCell((cell: any, colNumber: number) => {
                            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: headerColors[colNumber - 1] || 'FF374151' } };
                            cell.border = { top: { style: 'thin', color: { argb: 'FF1E293B' } }, left: { style: 'thin', color: { argb: 'FF1E293B' } }, bottom: { style: 'thin', color: { argb: 'FF1E293B' } }, right: { style: 'thin', color: { argb: 'FF1E293B' } } };
                            cell.alignment = { vertical: 'middle', horizontal: 'left' };
                        });
                        sheet.views = [{ state: 'frozen', ySplit: 4 }];

                        filtered.forEach((inv: any, i: number) => {
                            const row = sheet.addRow([inv.invoiceNumber, inv.clientName, inv.policyNumber, inv.description, inv.amount, inv.amountPaid, inv.amount - (inv.amountPaid || 0), inv.dateDue, inv.status]);
                            row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: i % 2 === 0 ? 'FFFFFFFF' : 'FFF8FAFC' } };
                            row.eachCell((cell: any) => {
                                cell.border = { top: { style: 'thin', color: { argb: 'FFE2E8F0' } }, left: { style: 'thin', color: { argb: 'FFE2E8F0' } }, bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } }, right: { style: 'thin', color: { argb: 'FFE2E8F0' } } };
                            });
                        });
                        sheet.columns.forEach((col: any) => { col.width = 20; });

                        const buffer = await workbook.xlsx.writeBuffer();
                        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                        saveAs(blob, `invoices-${new Date().toISOString().slice(0, 10)}.xlsx`);
                    }}>Export Excel</Button>
                    <Button variant="primary" leftIcon={<Plus size={16} />} onClick={() => setShowNewInvoice(true)}>New Invoice</Button>
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
                        key: 'id',
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
                searchKeys={['invoiceNumber', 'clientName', 'policyNumber', 'description', 'amount', 'status']}
                emptyMessage="No invoices match the current filters."
                headerActions={
                    <CustomSelect
                        label="Status"
                        options={STATUS_OPTIONS}
                        value={statusFilter}
                        onChange={(v) => setStatusFilter(v as string)}
                    />
                }
            />

            {/* New Invoice Modal */}
            <NewInvoiceModal isOpen={showNewInvoice} onClose={() => setShowNewInvoice(false)} />
        </div>
    );
}
