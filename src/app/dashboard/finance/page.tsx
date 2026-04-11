'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    DollarSign,
    CheckCircle2,
    Clock,
    AlertTriangle,
    Download,
    Plus,
    FileText,
    CreditCard,
    PieChart,
    BarChart3,
    ArrowRight,
    TrendingUp,
    Wallet,
} from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/data-display/status-badge';
import { useFinanceDashboard, useInvoices, useTransactions } from '@/hooks/api/use-finance';
import { useCommissions } from '@/hooks/api/use-finance';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { toast } from 'sonner';
import Link from 'next/link';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const MODULE_CARDS = [
    {
        label: 'Invoices',
        desc: 'Manage premium invoices',
        href: '/dashboard/finance/invoices',
        icon: FileText,
        color: 'text-primary-600',
        bg: 'bg-primary-50',
        border: 'border-primary-100',
    },
    {
        label: 'Payments',
        desc: 'Track all payment receipts',
        href: '/dashboard/finance/payments',
        icon: CreditCard,
        color: 'text-success-600',
        bg: 'bg-success-50',
        border: 'border-success-100',
    },
    {
        label: 'Commissions',
        desc: 'Broker earnings & payouts',
        href: '/dashboard/finance/commissions',
        icon: PieChart,
        color: 'text-amber-600',
        bg: 'bg-amber-50',
        border: 'border-amber-100',
    },
    {
        label: 'Expenses',
        desc: 'Track operating expenses',
        href: '/dashboard/finance/expenses',
        icon: Wallet,
        color: 'text-rose-600',
        bg: 'bg-rose-50',
        border: 'border-rose-100',
    },
    {
        label: 'Remittances',
        desc: 'Premium remittance to carriers',
        href: '/dashboard/finance/remittances',
        icon: DollarSign,
        color: 'text-teal-600',
        bg: 'bg-teal-50',
        border: 'border-teal-100',
    },
    {
        label: 'Reports',
        desc: 'Financial analytics & trends',
        href: '/dashboard/finance/reports',
        icon: BarChart3,
        color: 'text-violet-600',
        bg: 'bg-violet-50',
        border: 'border-violet-100',
    },
];

const STATUS_LABEL: Record<string, string> = {
    paid: 'Paid',
    OUTSTANDING: 'Outstanding',
    overdue: 'Overdue',
    partial: 'Partial',
    CANCELLED: 'Cancelled',
};

export default function FinanceOverviewPage() {
    const router = useRouter();
    const { data: dashboardData } = useFinanceDashboard();
    const dashboard = dashboardData as any;
    const { data: invoicesData } = useInvoices();
    const allInvoices: any[] = ((invoicesData as any)?.items ?? (invoicesData as any)?.data ?? (Array.isArray(invoicesData) ? invoicesData : []));
    const { data: transactionsData } = useTransactions();
    const allPayments: any[] = ((transactionsData as any)?.items ?? (transactionsData as any)?.data ?? (Array.isArray(transactionsData) ? transactionsData : []));
    const { data: commissionsData } = useCommissions();
    const allCommissions: any[] = ((commissionsData as any)?.items ?? (commissionsData as any)?.data ?? (Array.isArray(commissionsData) ? commissionsData : []));

    const totalRevenue = dashboard?.totalRevenue ?? allInvoices.reduce((s: number, i: any) => s + (i.amount || 0), 0);
    const collected = dashboard?.collected ?? allInvoices.filter((i: any) => i.status === 'PAID').reduce((s: number, i: any) => s + (i.amount || 0), 0);
    const outstanding = dashboard?.outstanding ?? allInvoices.filter((i: any) => i.status === 'OUTSTANDING').reduce((s: number, i: any) => s + (i.amount || 0), 0);
    const overdue = dashboard?.overdue ?? allInvoices.filter((i: any) => i.status === 'OVERDUE').reduce((s: number, i: any) => s + (i.amount || 0), 0);
    const totalCommissionsEarned = dashboard?.totalCommissionsEarned ?? allCommissions.filter((c: any) => c.status === 'EARNED' || c.status === 'PAID').reduce((s: number, c: any) => s + (c.commissionAmount || 0), 0);

    const recentInvoices = allInvoices.slice(-5).reverse();
    const recentPayments = allPayments.slice(-5).reverse();
    const overdueInvoices = allInvoices.filter((i: any) => i.status === 'OVERDUE');

    const KPI_STATS = [
        { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: TrendingUp, color: 'text-primary-600', bg: 'bg-primary-50' },
        { label: 'Collected', value: formatCurrency(collected), icon: CheckCircle2, color: 'text-success-600', bg: 'bg-success-50' },
        { label: 'Outstanding', value: formatCurrency(outstanding), icon: Clock, color: 'text-warning-600', bg: 'bg-warning-50' },
        { label: 'Overdue', value: formatCurrency(overdue), icon: AlertTriangle, color: 'text-danger-600', bg: 'bg-danger-50' },
        { label: 'Commissions Earned', value: formatCurrency(totalCommissionsEarned), icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-50' },
    ];

    // --- Excel Export ---
    const handleExportExcel = async () => {
        try {
            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'Brokerium IBMS';
            workbook.created = new Date();

            const sheet = workbook.addWorksheet('Finance Overview');

            sheet.columns = [
                { header: 'Metric', key: 'metric', width: 30 },
                { header: 'Value', key: 'value', width: 20 },
            ];

            const headerRow = sheet.getRow(1);
            headerRow.eachCell((cell, colNumber) => {
                cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                // Emerald
                let fillColor = 'FF10B981'; 

                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fillColor } };
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
                cell.border = {
                    top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
                    left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
                    bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } },
                    right: { style: 'thin', color: { argb: 'FFCBD5E1' } },
                };
            });
            headerRow.height = 30;

            const metrics = [
                { metric: 'Total Revenue', value: totalRevenue },
                { metric: 'Collected', value: collected },
                { metric: 'Outstanding', value: outstanding },
                { metric: 'Overdue', value: overdue },
                { metric: 'Commissions Earned', value: totalCommissionsEarned },
            ];

            metrics.forEach((m, index) => {
                const row = sheet.addRow(m);
                row.getCell('value').numFmt = '#,##0.00';

                if (index % 2 === 1) {
                    row.eachCell((cell) => {
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
                    });
                }
                row.eachCell((cell) => {
                    cell.border = {
                        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                        right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                    };
                });
            });

            sheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, `Finance-Overview-${new Date().toISOString().split('T')[0]}.xlsx`);

            toast.success(`Exported Finance Overview to Excel.`);
        } catch (error) {
            console.error('Export failed:', error);
            toast.error('Failed to export finance overview');
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Finance</h1>
                    <p className="text-sm text-surface-500 mt-1">Premium collection, commissions & financial reporting.</p>
                </div>
                <div className="flex gap-3">
                    <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleExportExcel}
                        className="group relative flex items-center gap-2 px-5 py-2.5 text-[10.5px] font-black uppercase tracking-[0.1em] text-surface-600 hover:text-success-600 bg-white dark:bg-slate-900 border border-surface-200 dark:border-slate-700 rounded-full cursor-pointer shadow-sm transition-all duration-300 overflow-hidden"
                    >
                        <span className="absolute inset-0 bg-success-50/50 dark:bg-success-950/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                        <Download 
                            size={14} 
                            className="relative z-10 transition-transform duration-500 group-hover:translate-y-0.5 group-hover:scale-110" 
                        />
                        <span className="relative z-10">Export Excel</span>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => router.push('/dashboard/finance/invoices?new=1')}
                        className="group relative flex items-center gap-2 px-6 py-2.5 text-[10.5px] font-black uppercase tracking-[0.1em] text-white bg-primary-600 hover:bg-primary-700 rounded-full cursor-pointer shadow-md hover:shadow-primary-600/20 transition-all duration-300 overflow-hidden"
                    >
                        <span className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                        <Plus 
                            size={14} 
                            className="relative z-10 stroke-[3px] transition-transform duration-500 group-hover:rotate-90" 
                        />
                        <span className="relative z-10">New Invoice</span>
                    </motion.button>
                </div>
            </div>

            {/* Overdue Alert */}
            {overdueInvoices.length > 0 && (
                <div className="bg-danger-50 border border-danger-200 rounded-[var(--radius-lg)] p-4 flex items-center gap-3">
                    <AlertTriangle className="text-danger-600 shrink-0" size={18} />
                    <div className="flex-1">
                        <p className="text-sm font-bold text-danger-800">{overdueInvoices.length} overdue invoice{overdueInvoices.length > 1 ? 's' : ''} require attention</p>
                        <p className="text-xs text-danger-700 mt-0.5">Total overdue: {formatCurrency(overdue)}</p>
                    </div>
                    <Link href="/dashboard/finance/invoices?status=overdue">
                        <Button variant="outline" size="sm" className="text-danger-700 border-danger-200 hover:bg-danger-100">View Overdue</Button>
                    </Link>
                </div>
            )}

            {/* KPI Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {KPI_STATS.map((stat, i) => (
                    <Card key={i} padding="none" className="p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
                        <div className={cn('p-2.5 rounded-full shrink-0', stat.bg, stat.color)}>
                            <stat.icon size={18} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-bold text-surface-500 uppercase tracking-wider truncate">{stat.label}</p>
                            <p className="text-base font-bold text-surface-900 mt-0.5 tabular-nums">{stat.value}</p>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Module Quick-Access */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {MODULE_CARDS.map((mod) => (
                    <Link key={mod.label} href={mod.href}>
                        <div className={cn(
                            'p-5 rounded-[var(--radius-lg)] border bg-white dark:bg-slate-900 hover:shadow-md transition-all group cursor-pointer',
                            mod.border
                        )}>
                            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', mod.bg, mod.color)}>
                                <mod.icon size={20} />
                            </div>
                            <p className="font-bold text-surface-900 text-sm">{mod.label}</p>
                            <p className="text-xs text-surface-500 mt-0.5">{mod.desc}</p>
                            <div className={cn('flex items-center gap-1 mt-3 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity', mod.color)}>
                                Go to {mod.label} <ArrowRight size={12} />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Two-column: Recent Invoices + Recent Payments */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Invoices */}
                <Card padding="lg">
                    <div className="flex items-center justify-between mb-4">
                        <CardHeader title="Recent Invoices" />
                        <Link href="/dashboard/finance/invoices" className="text-xs text-primary-600 font-semibold hover:underline flex items-center gap-1">
                            View all <ArrowRight size={12} />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {recentInvoices.map((inv) => (
                            <div key={inv.id} className="flex items-center justify-between py-2.5 border-b border-surface-100 last:border-0">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-mono font-bold text-primary-600">{inv.invoiceNumber}</span>
                                        <StatusBadge status={inv.status} />
                                    </div>
                                    <p className="text-xs text-surface-500 mt-0.5">{inv.clientName}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-surface-900 tabular-nums">{formatCurrency(inv.amount)}</p>
                                    <p className="text-[10px] text-surface-400">Due {formatDate(inv.dateDue)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Recent Payments */}
                <Card padding="lg">
                    <div className="flex items-center justify-between mb-4">
                        <CardHeader title="Recent Payments" />
                        <Link href="/dashboard/finance/payments" className="text-xs text-primary-600 font-semibold hover:underline flex items-center gap-1">
                            View all <ArrowRight size={12} />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {recentPayments.map((rec) => (
                            <div key={rec.id} className="flex items-center justify-between py-2.5 border-b border-surface-100 last:border-0">
                                <div>
                                    <span className="text-xs font-mono font-bold text-success-600">{rec.transactionNumber}</span>
                                    <p className="text-xs text-surface-500 mt-0.5">{rec.clientName}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-surface-900 tabular-nums">+{formatCurrency(rec.amount)}</p>
                                    <p className="text-[10px] text-surface-400">{formatDate(rec.processedAt ?? rec.createdAt)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
