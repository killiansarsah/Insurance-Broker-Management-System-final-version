'use client';

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import * as XLSX from 'xlsx';
import {
    DollarSign,
    Download,
    Upload,
    Plus,
    Trash2,
    CheckCircle2,
    Clock,
    XCircle,
    FileText,
    FileSpreadsheet,
    Pencil,
    Save,
    X,
    AlertTriangle,
    ChevronDown,
    Search,
    Paperclip,
    BarChart3,
    Settings2,
    RotateCcw,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/data-display/status-badge';
const ConfirmationModal = dynamic(
    () => import('@/components/ui/confirmation-modal').then(m => ({ default: m.ConfirmationModal })),
    { ssr: false }
);
import { toast } from 'sonner';
import { BackButton } from '@/components/ui/back-button';
import { CustomSelect } from '@/components/ui/select-custom';
import {
    expenses as initialExpenses,
    expenseSummary,
    EXPENSE_CATEGORIES,
    CATEGORY_LABEL,
    DEPARTMENTS,
    type Expense,
    type ExpenseCategory,
    type ExpenseStatus,
    type PaymentMethod,
} from '@/mock/expenses';
import { mockCommissions } from '@/mock/commissions';
import { formatCurrency, formatDate, cn } from '@/lib/utils';

// ─── Helpers ─────────────────────────────────────────────────
const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
    bank_transfer: 'Bank Transfer',
    mobile_money: 'Mobile Money',
    cash: 'Cash',
    cheque: 'Cheque',
    card: 'Card',
};

const STATUS_LABEL: Record<ExpenseStatus, string> = {
    approved: 'Approved',
    pending: 'Pending',
    rejected: 'Rejected',
    draft: 'Draft',
};

const MONTH_NAMES: Record<string, string> = {
    '01': 'JANUARY', '02': 'FEBRUARY', '03': 'MARCH',
    '04': 'APRIL',   '05': 'MAY',      '06': 'JUNE',
    '07': 'JULY',    '08': 'AUGUST',   '09': 'SEPTEMBER',
    '10': 'OCTOBER', '11': 'NOVEMBER', '12': 'DECEMBER',
};

// Exact 16 columns matching the real DEZAG Excel file (in order)
const EXCEL_COLUMNS: { key: ExpenseCategory; header: string }[] = [
    { key: 'fuel_car_maintenance',  header: 'FUEL/CAR MAINTENANCE' },
    { key: 'printing_stationery',   header: 'PRINTING & STATIONERY' },
    { key: 'tele_post',             header: 'TELE & POST' },
    { key: 'utilities',             header: 'UTILITIES(WATER & ECG)' },
    { key: 'levies_licenses',       header: 'LEVIES & LICENSES' },
    { key: 'transport',             header: 'TRANSPORT' },
    { key: 'provisions_toiletries', header: 'PROVISIONS & TOILETRIES' },
    { key: 'allowances',            header: 'ALLOWANCES' },
    { key: 'training',              header: 'COURSES AND TRAINING' },
    { key: 'subscriptions',         header: 'SUBCRIPTIONS' },
    { key: 'miscellaneous',         header: 'MISCELLANEOUS' },
    { key: 'food',                  header: 'FOOD' },
    { key: 'salaries',              header: 'SALARIES AND WAGES' },
    { key: 'ssnit',                 header: 'SSNIT' },
    { key: 'insurance',             header: 'INSURANCE' },
    { key: 'business_prospecting',  header: 'BUSINESS PROSPECTING' },
];

const DEFAULT_COMPANY = 'DEZAG INSURANCE BROKERS';
const DEFAULT_COL_HEADERS = EXCEL_COLUMNS.map(c => c.header);
const LS_COMPANY_KEY = 'ibms_expense_company';
const LS_HEADERS_KEY = 'ibms_expense_col_headers';
const EXCEL_COL_HEADERS = ['DATE', 'DESCRIPTION', 'REF NO', 'COST', ...EXCEL_COLUMNS.map(c => c.header)];
const EXCEL_TOTAL_COLS = EXCEL_COL_HEADERS.length; // 20

// ─── XLSX Export ─────────────────────────────────────────────
function exportToXLSX(data: Expense[], company: string, colHeaders: string[]) {
    const monthMap = new Map<string, Expense[]>();
    data.forEach(e => {
        const key = e.date.slice(0, 7);
        if (!monthMap.has(key)) monthMap.set(key, []);
        monthMap.get(key)!.push(e);
    });

    const wb = XLSX.utils.book_new();
    const expColHeaders = ['DATE', 'DESCRIPTION', 'REF NO', 'COST', ...colHeaders];

    // Monthly expense sheets (JANUARY, FEBRUARY, MARCH …)
    [...monthMap.keys()].sort().forEach(month => {
        const entries = monthMap.get(month)!;
        const [yr, mo] = month.split('-');
        const sheetName = (MONTH_NAMES[mo] || month).slice(0, 31);

        const rows: (string | number)[][] = [
            [`${company}, ${sheetName} ${yr} EXPENSES`],
            expColHeaders,
        ];

        // Data rows — pad up to minimum 18 rows so template looks like original
        const NUM_ROWS = Math.max(18, entries.length);
        for (let i = 0; i < NUM_ROWS; i++) {
            const e = entries[i];
            if (e) {
                rows.push([
                    e.date,
                    e.description,
                    i + 1,
                    e.amount,
                    ...EXCEL_COLUMNS.map(c => c.key === e.category ? e.amount : ''),
                ]);
            } else {
                // blank row with pre-filled REF NO
                rows.push(['', '', i + 1, '', ...EXCEL_COLUMNS.map(() => '')]);
            }
        }

        // Blank separator row
        rows.push(new Array(EXCEL_TOTAL_COLS).fill(''));

        // Totals row
        rows.push([
            '', 'TOTAL', '',
            entries.reduce((s, e) => s + e.amount, 0),
            ...EXCEL_COLUMNS.map(c =>
                entries.filter(e => e.category === c.key).reduce((s, e) => s + e.amount, 0) || ''
            ),
        ]);

        // Blank row then STAFF / DIRECTOR / SSNIT footer labels
        rows.push(new Array(EXCEL_TOTAL_COLS).fill(''));
        rows.push(['STAFF',    ...new Array(EXCEL_TOTAL_COLS - 1).fill('')]);
        rows.push(['DIRECTOR', ...new Array(EXCEL_TOTAL_COLS - 1).fill('')]);
        rows.push(['SSNIT',    ...new Array(EXCEL_TOTAL_COLS - 1).fill('')]);

        const ws = XLSX.utils.aoa_to_sheet(rows);
        ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: EXCEL_TOTAL_COLS - 1 } }];
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
    });

    // COMMISSION sheet
    {
        const commRows: (string | number)[][] = [
            [`${company} - COMMISSIONS`],
            ['DATE', 'CLIENT', 'POLICY NO', 'PRODUCT TYPE', 'INSURER',
             'PREMIUM (GHS)', 'RATE %', 'GROSS COMMISSION (GHS)',
             'NIC LEVY', 'NET COMMISSION (GHS)', 'STATUS'],
        ];
        mockCommissions.forEach(c => {
            commRows.push([
                c.dateEarned, c.clientName, c.policyNumber, c.productType,
                c.insurerName, c.premiumAmount, c.commissionRate,
                c.commissionAmount, c.nicLevy, c.netCommission,
                c.status.toUpperCase(),
            ]);
        });
        const totalGross = mockCommissions.reduce((s, c) => s + c.commissionAmount, 0);
        const totalNic   = mockCommissions.reduce((s, c) => s + c.nicLevy, 0);
        const totalNet   = mockCommissions.reduce((s, c) => s + c.netCommission, 0);
        commRows.push(['', '', '', '', 'TOTAL', '', '', totalGross, totalNic, totalNet, '']);
        const ws = XLSX.utils.aoa_to_sheet(commRows);
        ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 10 } }];
        XLSX.utils.book_append_sheet(wb, ws, 'COMMISSION');
    }

    // OVER RIDER sheet — commission totals grouped by insurer
    {
        const insurerMap = new Map<string, { gross: number; net: number }>();
        mockCommissions.forEach(c => {
            const cur = insurerMap.get(c.insurerName) || { gross: 0, net: 0 };
            insurerMap.set(c.insurerName, {
                gross: cur.gross + c.commissionAmount,
                net:   cur.net   + c.netCommission,
            });
        });
        const orRows: (string | number)[][] = [
            [`${company} - OVER RIDER`],
            ['INSURER', 'AMOUNT GHS', 'NET GHS'],
        ];
        insurerMap.forEach((v, insurer) => orRows.push([insurer, v.gross, v.net]));
        const totalGross = [...insurerMap.values()].reduce((s, v) => s + v.gross, 0);
        const totalNet   = [...insurerMap.values()].reduce((s, v) => s + v.net, 0);
        orRows.push(['TOTAL', totalGross, totalNet]);
        const ws = XLSX.utils.aoa_to_sheet(orRows);
        ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }];
        XLSX.utils.book_append_sheet(wb, ws, 'OVER RIDER');
    }

    // ACCOUNT sheet
    {
        const totalExp  = data.reduce((s, e) => s + e.amount, 0);
        const totalComm = mockCommissions.reduce((s, c) => s + c.netCommission, 0);
        const acRows: (string | number)[][] = [
            [`${company} - ACCOUNT SUMMARY`],
            ['', ''],
            ['Total Commission Earned (GHS)', totalComm],
            ['Total Expenses (GHS)',          totalExp],
            ['Net Balance (GHS)',             totalComm - totalExp],
            ['', ''],
            ['Generated', new Date().toLocaleDateString('en-GB')],
        ];
        const ws = XLSX.utils.aoa_to_sheet(acRows);
        ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }];
        XLSX.utils.book_append_sheet(wb, ws, 'ACCOUNT');
    }

    // BUSINESS TYPE sheet
    {
        const btMap = new Map<string, { count: number; premium: number; commission: number }>();
        mockCommissions.forEach(c => {
            const cur = btMap.get(c.productType) || { count: 0, premium: 0, commission: 0 };
            btMap.set(c.productType, {
                count:      cur.count + 1,
                premium:    cur.premium    + c.premiumAmount,
                commission: cur.commission + c.netCommission,
            });
        });
        const btRows: (string | number)[][] = [
            [`${company} - BUSINESS TYPE`],
            ['PRODUCT TYPE', 'POLICY COUNT', 'TOTAL PREMIUM (GHS)', 'NET COMMISSION (GHS)'],
        ];
        btMap.forEach((v, type) => btRows.push([type, v.count, v.premium, v.commission]));
        const ws = XLSX.utils.aoa_to_sheet(btRows);
        ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }];
        XLSX.utils.book_append_sheet(wb, ws, 'BUSINESS TYPE');
    }

    const year = data[0]?.date.slice(0, 4) || new Date().getFullYear();
    XLSX.writeFile(wb, `DEZAG_Expenses_${year}.xlsx`);
}

// ─── CSV Export (wide format matching Excel layout) ──────────
function exportToCSV(data: Expense[], colHeaders: string[]) {
    const headers = ['DATE', 'DESCRIPTION', 'REF NO', 'COST', ...colHeaders];

    let refNo = 1;
    const rows = data.map(e => [
        e.date,
        `"${e.description.replace(/"/g, '""')}"`,
        refNo++,
        e.amount.toFixed(2),
        ...EXCEL_COLUMNS.map(c => c.key === e.category ? e.amount.toFixed(2) : ''),
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DEZAG_Expenses_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

// ─── CSV Import (parse) ─────────────────────────────────────
function parseCSV(text: string): Partial<Expense>[] {
    const lines = text.split('\n').filter(l => l.trim());
    if (lines.length < 2) return [];
    const parsed: Partial<Expense>[] = [];
    // skip header row
    for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].match(/(".*?"|[^,]+)/g)?.map(c => c.replace(/^"|"$/g, '').replace(/""/g, '"')) || [];
        if (cols.length < 8) continue;
        const catEntry = EXPENSE_CATEGORIES.find(c => c.label.toLowerCase() === (cols[2] || '').toLowerCase());
        parsed.push({
            id: `exp-imp-${Date.now()}-${i}`,
            date: cols[0] || new Date().toISOString().slice(0, 10),
            description: cols[1] || '',
            category: catEntry?.value || 'miscellaneous',
            amount: parseFloat(cols[3]) || 0,
            currency: (['GHS', 'USD', 'EUR'].includes(cols[4] || '') ? cols[4] : 'GHS') as Expense['currency'],
            vendor: cols[5] || '',
            reference: cols[6] || '',
            paymentMethod: (Object.entries(PAYMENT_METHOD_LABEL).find(
                ([, v]) => v.toLowerCase() === (cols[7] || '').toLowerCase()
            )?.[0] || 'cash') as PaymentMethod,
            status: 'draft' as ExpenseStatus,
            department: DEPARTMENTS.includes(cols[9] || '') ? cols[9] : 'Administration',
            notes: cols[10] || '',
            receiptAttached: false,
        });
    }
    return parsed;
}

// ─── KPI data ────────────────────────────────────────────────


const STATUS_FILTER_OPTIONS = [
    { label: 'All Statuses', value: 'all' },
    { label: 'Approved', value: 'approved' },
    { label: 'Pending', value: 'pending' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'Draft', value: 'draft' },
];

const CATEGORY_FILTER_OPTIONS = [
    { label: 'All Categories', value: 'all' },
    ...EXPENSE_CATEGORIES.map(c => ({ label: c.label, value: c.value })),
];

const DEPT_FILTER_OPTIONS = [
    { label: 'All Departments', value: 'all' },
    ...DEPARTMENTS.map(d => ({ label: d, value: d })),
];

// ─── Inline cell editor ─────────────────────────────────────
function CellInput({
    value,
    onChange,
    type = 'text',
    className,
}: {
    value: string;
    onChange: (v: string) => void;
    type?: 'text' | 'number' | 'date';
    className?: string;
}) {
    return (
        <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            className={cn(
                'w-full bg-primary-50/60 border border-primary-300 rounded-md px-2 py-1 text-xs',
                'focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400',
                'transition-all',
                className,
            )}
            autoFocus
        />
    );
}

function CellSelect({
    value,
    onChange,
    options,
}: {
    value: string;
    onChange: (v: string) => void;
    options: { value: string; label: string }[];
}) {
    return (
        <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full bg-primary-50/60 border border-primary-300 rounded-md px-1.5 py-1 text-xs
                focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400 transition-all"
        >
            {options.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
            ))}
        </select>
    );
}

// ─── Main component ─────────────────────────────────────────
export default function ExpensesPage() {
    const [expenses, setExpenses] = useState<Expense[]>([...initialExpenses]);
    const [showSummary, setShowSummary] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [deptFilter, setDeptFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editRow, setEditRow] = useState<Partial<Expense>>({});
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [showImportHint, setShowImportHint] = useState(false);
    const [expDeleteTarget, setExpDeleteTarget] = useState<{ type: 'single' | 'bulk'; id?: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ─── Export customization ───
    const [showCustomize, setShowCustomize] = useState(false);
    const [customCompany, setCustomCompany] = useState(DEFAULT_COMPANY);
    const [customHeaders, setCustomHeaders] = useState<string[]>(DEFAULT_COL_HEADERS);
    // draft state inside modal
    const [draftCompany, setDraftCompany] = useState(DEFAULT_COMPANY);
    const [draftHeaders, setDraftHeaders] = useState<string[]>(DEFAULT_COL_HEADERS);

    useEffect(() => {
        const co = localStorage.getItem(LS_COMPANY_KEY);
        const hd = localStorage.getItem(LS_HEADERS_KEY);
        if (co) setCustomCompany(co);
        if (hd) {
            try {
                const parsed = JSON.parse(hd) as string[];
                if (Array.isArray(parsed) && parsed.length === DEFAULT_COL_HEADERS.length)
                    setCustomHeaders(parsed);
            } catch { /* ignore */ }
        }
    }, []);

    const openCustomize = () => {
        setDraftCompany(customCompany);
        setDraftHeaders([...customHeaders]);
        setShowCustomize(true);
    };

    const saveCustomize = () => {
        const co = draftCompany.trim() || DEFAULT_COMPANY;
        const hd = draftHeaders.map(h => h.trim() || DEFAULT_COL_HEADERS[draftHeaders.indexOf(h)]);
        setCustomCompany(co);
        setCustomHeaders(hd);
        localStorage.setItem(LS_COMPANY_KEY, co);
        localStorage.setItem(LS_HEADERS_KEY, JSON.stringify(hd));
        setShowCustomize(false);
        toast.success('Export settings saved');
    };

    const resetCustomize = () => {
        setDraftCompany(DEFAULT_COMPANY);
        setDraftHeaders([...DEFAULT_COL_HEADERS]);
    };
    const summaryMonths = useMemo(() => {
        const keys = new Set(expenses.map(e => e.date.slice(0, 7)));
        return [...keys].sort();
    }, [expenses]);

    const summaryData = useMemo(() => {
        return EXPENSE_CATEGORIES.map(cat => {
            const monthAmounts = summaryMonths.map(m =>
                expenses
                    .filter(e => e.date.slice(0, 7) === m && e.category === cat.value)
                    .reduce((s, e) => s + e.amount, 0)
            );
            const total = monthAmounts.reduce((s, v) => s + v, 0);
            return { cat, monthAmounts, total };
        }).filter(r => r.total > 0);
    }, [expenses, summaryMonths]);

    const summaryGrandTotal = useMemo(() =>
        summaryData.reduce((s, r) => s + r.total, 0)
    , [summaryData]);

    // ─── KPI data ───
    const KPIS = useMemo(() => {
        const currentMonth = new Date().toISOString().slice(0, 7);
        const thisMonthTotal = expenses
            .filter(e => e.date.slice(0, 7) === currentMonth)
            .reduce((s, e) => s + e.amount, 0);
        const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
        const pending = expenses.filter(e => e.status === 'pending').reduce((s, e) => s + e.amount, 0);
        const rejected = expenses.filter(e => e.status === 'rejected').reduce((s, e) => s + e.amount, 0);
        return [
            { label: 'Total Expenses', value: formatCurrency(totalExpenses), icon: DollarSign, color: 'text-primary-600', bg: 'bg-primary-50' },
            { label: 'This Month', value: formatCurrency(thisMonthTotal), icon: CheckCircle2, color: 'text-success-600', bg: 'bg-success-50' },
            { label: 'Pending', value: formatCurrency(pending), icon: Clock, color: 'text-warning-600', bg: 'bg-warning-50' },
            { label: 'Rejected', value: formatCurrency(rejected), icon: XCircle, color: 'text-danger-600', bg: 'bg-danger-50' },
        ];
    }, [expenses]);

    // ─── Filtering ───
    const filtered = useMemo(() => {
        let data = expenses;
        if (statusFilter !== 'all') data = data.filter(e => e.status === statusFilter);
        if (categoryFilter !== 'all') data = data.filter(e => e.category === categoryFilter);
        if (deptFilter !== 'all') data = data.filter(e => e.department === deptFilter);
        if (search.trim()) {
            const term = search.toLowerCase();
            data = data.filter(e =>
                e.description.toLowerCase().includes(term) ||
                e.vendor.toLowerCase().includes(term) ||
                e.reference.toLowerCase().includes(term) ||
                e.department.toLowerCase().includes(term) ||
                CATEGORY_LABEL[e.category].toLowerCase().includes(term)
            );
        }
        return data;
    }, [expenses, statusFilter, categoryFilter, deptFilter, search]);

    // ─── Inline edit ───
    const startEdit = (exp: Expense) => {
        setEditingId(exp.id);
        setEditRow({ ...exp });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditRow({});
    };

    const saveEdit = () => {
        if (!editingId) return;
        setExpenses(prev =>
            prev.map(e => (e.id === editingId ? { ...e, ...editRow } as Expense : e))
        );
        setEditingId(null);
        setEditRow({});
    };

    // ─── Add new row ───
    const addNewRow = () => {
        const newExp: Expense = {
            id: `exp-${Date.now()}`,
            date: new Date().toISOString().slice(0, 10),
            description: '',
            category: 'miscellaneous',
            amount: 0,
            currency: 'GHS',
            vendor: '',
            reference: `EXP-${new Date().getFullYear()}-${String(expenses.length + 1).padStart(3, '0')}`,
            paymentMethod: 'cash',
            status: 'draft',
            department: 'Administration',
            receiptAttached: false,
        };
        setExpenses(prev => [newExp, ...prev]);
        startEdit(newExp);
    };

    // ─── Delete rows ───
    const deleteSelected = () => {
        setExpDeleteTarget({ type: 'bulk' });
    };

    const confirmExpDelete = () => {
        if (!expDeleteTarget) return;
        if (expDeleteTarget.type === 'single' && expDeleteTarget.id) {
            setExpenses(prev => prev.filter(e => e.id !== expDeleteTarget.id));
            setSelectedIds(prev => {
                const next = new Set(prev);
                next.delete(expDeleteTarget.id!);
                return next;
            });
            toast.error('Expense Deleted');
        } else if (expDeleteTarget.type === 'bulk') {
            const count = selectedIds.size;
            setExpenses(prev => prev.filter(e => !selectedIds.has(e.id)));
            setSelectedIds(new Set());
            toast.error(`Deleted ${count} expenses`);
        }
        setExpDeleteTarget(null);
    };

    // ─── Select all ───
    const toggleSelectAll = () => {
        if (selectedIds.size === filtered.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filtered.map(e => e.id)));
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    // ─── Import ───
    const handleImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            const text = evt.target?.result as string;
            const imported = parseCSV(text);
            if (imported.length > 0) {
                const newExpenses = imported.map(imp => ({
                    id: imp.id || `exp-imp-${Date.now()}`,
                    date: imp.date || new Date().toISOString().slice(0, 10),
                    description: imp.description || '',
                    category: imp.category || 'miscellaneous' as ExpenseCategory,
                    amount: imp.amount || 0,
                    currency: imp.currency || 'GHS' as const,
                    vendor: imp.vendor || '',
                    reference: imp.reference || '',
                    paymentMethod: imp.paymentMethod || 'cash' as PaymentMethod,
                    status: 'draft' as ExpenseStatus,
                    department: imp.department || 'Administration',
                    notes: imp.notes || '',
                    receiptAttached: false,
                }));
                setExpenses(prev => [...newExpenses, ...prev]);
                setShowImportHint(true);
                setTimeout(() => setShowImportHint(false), 4000);
            }
        };
        reader.readAsText(file);
        // reset the input
        e.target.value = '';
    }, []);

    // ─── Summary for filtered data ───
    const filteredTotal = filtered.reduce((s, e) => s + e.amount, 0);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Hidden file input for import */}
            <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.txt"
                className="hidden"
                onChange={handleImport}
            />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <BackButton href="/dashboard/finance" />
                    <div>
                        <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Expenses</h1>
                        <p className="text-sm text-surface-500 mt-1">
                            Record, manage, and track operating expenses.
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant={showSummary ? 'primary' : 'outline'}
                        leftIcon={<BarChart3 size={16} />}
                        onClick={() => setShowSummary(v => !v)}
                    >
                        {showSummary ? 'View List' : 'Q Summary'}
                    </Button>
                    <Button
                        variant="outline"
                        leftIcon={<Upload size={16} />}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        Import CSV
                    </Button>
                    <Button
                        variant="outline"
                        leftIcon={<Download size={16} />}
                        onClick={() => exportToCSV(filtered, customHeaders)}
                    >
                        Export CSV
                    </Button>
                    <Button
                        variant="outline"
                        leftIcon={<FileSpreadsheet size={16} />}
                        onClick={() => exportToXLSX(filtered, customCompany, customHeaders)}
                    >
                        Export Excel
                    </Button>
                    <Button
                        variant="outline"
                        leftIcon={<Settings2 size={16} />}
                        onClick={openCustomize}
                        title="Customize export column headers & company name"
                    >
                        Customize
                    </Button>
                    <Button
                        variant="primary"
                        leftIcon={<Plus size={16} />}
                        onClick={addNewRow}
                    >
                        Add Expense
                    </Button>
                </div>
            </div>

            {/* Import success hint */}
            {showImportHint && (
                <div className="bg-success-50 border border-success-200 rounded-[var(--radius-lg)] p-3 flex items-center gap-2 animate-fade-in">
                    <CheckCircle2 className="text-success-600 shrink-0" size={16} />
                    <p className="text-sm text-success-800 font-medium">Expenses imported successfully as drafts. Review and approve them below.</p>
                </div>
            )}

            {/* KPI Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {KPIS.map((stat, i) => (
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

            {/* Filters + Search bar */}
            {!showSummary && (
                <Card padding="none" className="p-4">
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                        {/* Search */}
                        <div className="relative flex-1 min-w-[200px]">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                            <input
                                type="text"
                                placeholder="Search expenses…"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 text-sm border border-surface-200 rounded-lg
                                    focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400
                                    transition-all bg-surface-50 placeholder-surface-400"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <CustomSelect
                                options={STATUS_FILTER_OPTIONS}
                                value={statusFilter}
                                onChange={(v) => setStatusFilter(v as string)}
                            />
                            <CustomSelect
                                options={CATEGORY_FILTER_OPTIONS}
                                value={categoryFilter}
                                onChange={(v) => setCategoryFilter(v as string)}
                            />
                            <CustomSelect
                                options={DEPT_FILTER_OPTIONS}
                                value={deptFilter}
                                onChange={(v) => setDeptFilter(v as string)}
                            />
                        </div>
                    </div>

                    {/* Bulk actions */}
                    {selectedIds.size > 0 && (
                        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-surface-100">
                            <span className="text-xs text-surface-500 font-medium">{selectedIds.size} selected</span>
                            <Button variant="outline" size="sm" leftIcon={<Trash2 size={14} />} onClick={deleteSelected}
                                className="text-danger-600 border-danger-200 hover:bg-danger-50">
                                Delete Selected
                            </Button>
                        </div>
                    )}
                </Card>
            )}

            {/* Quarter Summary View */}
            {showSummary && (
                <Card padding="none" className="overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-surface-100 bg-surface-50">
                        <h3 className="text-sm font-bold text-surface-900">Expense Summary by Category &amp; Month</h3>
                        <span className="text-xs text-surface-500">
                            {summaryMonths.map(m => MONTH_NAMES[m.split('-')[1]] || m).join(' · ')} &nbsp;·&nbsp; {summaryData.length} active categories
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-surface-50 border-b border-surface-200">
                                    <th className="px-4 py-3 text-left text-[10px] font-bold text-surface-500 uppercase tracking-wider min-w-[200px]">Category</th>
                                    {summaryMonths.map(m => (
                                        <th key={m} className="px-3 py-3 text-right text-[10px] font-bold text-surface-500 uppercase tracking-wider w-[140px]">
                                            {MONTH_NAMES[m.split('-')[1]] || m}
                                        </th>
                                    ))}
                                    <th className="px-3 py-3 text-right text-[10px] font-bold text-surface-900 uppercase tracking-wider w-[140px] bg-primary-50">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-100">
                                {summaryData.map(row => (
                                    <tr key={row.cat.value} className="hover:bg-surface-50/80 transition-colors">
                                        <td className="px-4 py-2.5">
                                            <span className="text-xs font-medium text-surface-800">{row.cat.label}</span>
                                        </td>
                                        {row.monthAmounts.map((amt, i) => (
                                            <td key={i} className="px-3 py-2.5 text-right">
                                                {amt > 0
                                                    ? <span className="text-xs tabular-nums text-surface-700">{formatCurrency(amt)}</span>
                                                    : <span className="text-surface-300 text-xs">—</span>
                                                }
                                            </td>
                                        ))}
                                        <td className="px-3 py-2.5 text-right bg-primary-50/40">
                                            <span className="text-xs font-bold tabular-nums text-surface-900">{formatCurrency(row.total)}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="bg-surface-50 border-t-2 border-surface-200">
                                    <td className="px-4 py-3">
                                        <span className="text-xs font-bold text-surface-700 uppercase tracking-wider">Grand Total</span>
                                    </td>
                                    {summaryMonths.map((m, mi) => {
                                        const monthTotal = summaryData.reduce((s, r) => s + (r.monthAmounts[mi] || 0), 0);
                                        return (
                                            <td key={m} className="px-3 py-3 text-right">
                                                <span className="text-xs font-bold tabular-nums text-surface-900">{formatCurrency(monthTotal)}</span>
                                            </td>
                                        );
                                    })}
                                    <td className="px-3 py-3 text-right bg-primary-100/60">
                                        <span className="text-sm font-bold tabular-nums text-primary-700">{formatCurrency(summaryGrandTotal)}</span>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </Card>
            )}

            {/* Spreadsheet Table */}
            {!showSummary && (
            <Card padding="none" className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-surface-50 border-b border-surface-200">
                                <th className="w-10 px-3 py-3">
                                    <input
                                        type="checkbox"
                                        checked={filtered.length > 0 && selectedIds.size === filtered.length}
                                        onChange={toggleSelectAll}
                                        className="rounded border-surface-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                                    />
                                </th>
                                <th className="px-3 py-3 text-left text-[10px] font-bold text-surface-500 uppercase tracking-wider w-[100px]">Date</th>
                                <th className="px-3 py-3 text-left text-[10px] font-bold text-surface-500 uppercase tracking-wider min-w-[240px]">Description</th>
                                <th className="px-3 py-3 text-left text-[10px] font-bold text-surface-500 uppercase tracking-wider w-[150px]">Category</th>
                                <th className="px-3 py-3 text-right text-[10px] font-bold text-surface-500 uppercase tracking-wider w-[110px]">Amount</th>
                                <th className="px-3 py-3 text-left text-[10px] font-bold text-surface-500 uppercase tracking-wider min-w-[150px]">Vendor</th>
                                <th className="px-3 py-3 text-left text-[10px] font-bold text-surface-500 uppercase tracking-wider w-[130px]">Reference</th>
                                <th className="px-3 py-3 text-left text-[10px] font-bold text-surface-500 uppercase tracking-wider w-[120px]">Payment</th>
                                <th className="px-3 py-3 text-left text-[10px] font-bold text-surface-500 uppercase tracking-wider w-[110px]">Department</th>
                                <th className="px-3 py-3 text-center text-[10px] font-bold text-surface-500 uppercase tracking-wider w-[80px]">Status</th>
                                <th className="px-3 py-3 text-center text-[10px] font-bold text-surface-500 uppercase tracking-wider w-[50px]">
                                    <Paperclip size={12} className="mx-auto text-surface-400" />
                                </th>
                                <th className="px-3 py-3 text-center text-[10px] font-bold text-surface-500 uppercase tracking-wider w-[80px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-100">
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={12} className="px-6 py-16 text-center">
                                        <FileSpreadsheet size={36} className="mx-auto text-surface-300 mb-3" />
                                        <p className="text-sm font-medium text-surface-500">No expenses found</p>
                                        <p className="text-xs text-surface-400 mt-1">Add a new expense or import from CSV.</p>
                                    </td>
                                </tr>
                            )}

                            {filtered.map(exp => {
                                const isEditing = editingId === exp.id;
                                const isSelected = selectedIds.has(exp.id);

                                return (
                                    <tr
                                        key={exp.id}
                                        className={cn(
                                            'transition-colors group',
                                            isEditing
                                                ? 'bg-primary-50/40'
                                                : isSelected
                                                    ? 'bg-primary-50/30'
                                                    : 'hover:bg-surface-50/80',
                                        )}
                                    >
                                        {/* Checkbox */}
                                        <td className="px-3 py-2.5">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => toggleSelect(exp.id)}
                                                className="rounded border-surface-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                                            />
                                        </td>

                                        {/* Date */}
                                        <td className="px-3 py-2.5">
                                            {isEditing ? (
                                                <CellInput
                                                    type="date"
                                                    value={editRow.date || ''}
                                                    onChange={v => setEditRow(r => ({ ...r, date: v }))}
                                                />
                                            ) : (
                                                <span className="text-xs text-surface-700 tabular-nums">{formatDate(exp.date)}</span>
                                            )}
                                        </td>

                                        {/* Description */}
                                        <td className="px-3 py-2.5">
                                            {isEditing ? (
                                                <CellInput
                                                    value={editRow.description || ''}
                                                    onChange={v => setEditRow(r => ({ ...r, description: v }))}
                                                />
                                            ) : (
                                                <span className="text-xs font-medium text-surface-800 line-clamp-1">{exp.description}</span>
                                            )}
                                        </td>

                                        {/* Category */}
                                        <td className="px-3 py-2.5">
                                            {isEditing ? (
                                                <CellSelect
                                                    value={editRow.category || 'miscellaneous'}
                                                    onChange={v => setEditRow(r => ({ ...r, category: v as ExpenseCategory }))}
                                                    options={EXPENSE_CATEGORIES}
                                                />
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-surface-100 text-[10px] font-semibold text-surface-600 whitespace-nowrap">
                                                    {CATEGORY_LABEL[exp.category]}
                                                </span>
                                            )}
                                        </td>

                                        {/* Amount */}
                                        <td className="px-3 py-2.5 text-right">
                                            {isEditing ? (
                                                <CellInput
                                                    type="number"
                                                    value={String(editRow.amount || 0)}
                                                    onChange={v => setEditRow(r => ({ ...r, amount: parseFloat(v) || 0 }))}
                                                    className="text-right"
                                                />
                                            ) : (
                                                <span className="text-xs font-bold text-surface-900 tabular-nums">
                                                    {formatCurrency(exp.amount, exp.currency)}
                                                </span>
                                            )}
                                        </td>

                                        {/* Vendor */}
                                        <td className="px-3 py-2.5">
                                            {isEditing ? (
                                                <CellInput
                                                    value={editRow.vendor || ''}
                                                    onChange={v => setEditRow(r => ({ ...r, vendor: v }))}
                                                />
                                            ) : (
                                                <span className="text-xs text-surface-700 line-clamp-1">{exp.vendor}</span>
                                            )}
                                        </td>

                                        {/* Reference */}
                                        <td className="px-3 py-2.5">
                                            {isEditing ? (
                                                <CellInput
                                                    value={editRow.reference || ''}
                                                    onChange={v => setEditRow(r => ({ ...r, reference: v }))}
                                                />
                                            ) : (
                                                <span className="text-xs font-mono text-primary-600">{exp.reference}</span>
                                            )}
                                        </td>

                                        {/* Payment Method */}
                                        <td className="px-3 py-2.5">
                                            {isEditing ? (
                                                <CellSelect
                                                    value={editRow.paymentMethod || 'cash'}
                                                    onChange={v => setEditRow(r => ({ ...r, paymentMethod: v as PaymentMethod }))}
                                                    options={Object.entries(PAYMENT_METHOD_LABEL).map(([v, l]) => ({ value: v, label: l }))}
                                                />
                                            ) : (
                                                <span className="text-xs text-surface-600">{PAYMENT_METHOD_LABEL[exp.paymentMethod]}</span>
                                            )}
                                        </td>

                                        {/* Department */}
                                        <td className="px-3 py-2.5">
                                            {isEditing ? (
                                                <CellSelect
                                                    value={editRow.department || 'Administration'}
                                                    onChange={v => setEditRow(r => ({ ...r, department: v }))}
                                                    options={DEPARTMENTS.map(d => ({ value: d, label: d }))}
                                                />
                                            ) : (
                                                <span className="text-xs text-surface-600">{exp.department}</span>
                                            )}
                                        </td>

                                        {/* Status */}
                                        <td className="px-3 py-2.5 text-center">
                                            {isEditing ? (
                                                <CellSelect
                                                    value={editRow.status || 'draft'}
                                                    onChange={v => setEditRow(r => ({ ...r, status: v as ExpenseStatus }))}
                                                    options={Object.entries(STATUS_LABEL).map(([v, l]) => ({ value: v, label: l }))}
                                                />
                                            ) : (
                                                <StatusBadge status={exp.status} />
                                            )}
                                        </td>

                                        {/* Receipt */}
                                        <td className="px-3 py-2.5 text-center">
                                            {exp.receiptAttached ? (
                                                <Paperclip size={14} className="mx-auto text-success-500" />
                                            ) : (
                                                <span className="text-surface-300">—</span>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-3 py-2.5 text-center">
                                            {isEditing ? (
                                                <div className="flex items-center justify-center gap-1">
                                                    <button
                                                        onClick={saveEdit}
                                                        className="p-1.5 rounded-md bg-success-50 text-success-600 hover:bg-success-100 transition-colors cursor-pointer"
                                                        title="Save"
                                                    >
                                                        <Save size={14} />
                                                    </button>
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="p-1.5 rounded-md bg-surface-100 text-surface-500 hover:bg-surface-200 transition-colors cursor-pointer"
                                                        title="Cancel"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => startEdit(exp)}
                                                        className="p-1.5 rounded-md hover:bg-primary-50 text-surface-400 hover:text-primary-600 transition-colors cursor-pointer"
                                                        title="Edit"
                                                    >
                                                        <Pencil size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => setExpDeleteTarget({ type: 'single', id: exp.id })}
                                                        className="p-1.5 rounded-md hover:bg-danger-50 text-surface-400 hover:text-danger-600 transition-colors cursor-pointer"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>

                        {/* Footer total */}
                        {filtered.length > 0 && (
                            <tfoot>
                                <tr className="bg-surface-50 border-t border-surface-200">
                                    <td colSpan={4} className="px-3 py-3 text-right">
                                        <span className="text-xs font-bold text-surface-500 uppercase tracking-wider">
                                            Total ({filtered.length} entries)
                                        </span>
                                    </td>
                                    <td className="px-3 py-3 text-right">
                                        <span className="text-sm font-bold text-surface-900 tabular-nums">
                                            {formatCurrency(filteredTotal)}
                                        </span>
                                    </td>
                                    <td colSpan={7} />
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </Card>
            )}

            {/* Category Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card padding="lg">
                    <h3 className="text-sm font-bold text-surface-900 mb-4">By Category</h3>
                    <div className="space-y-3">
                        {expenseSummary.byCategory.map(cat => {
                            const pct = Math.round((cat.amount / expenseSummary.totalExpenses) * 100);
                            return (
                                <div key={cat.category}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-medium text-surface-700">{cat.category}</span>
                                        <span className="text-xs font-bold text-surface-900 tabular-nums">{formatCurrency(cat.amount)}</span>
                                    </div>
                                    <div className="w-full h-2 bg-surface-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary-500 rounded-full transition-all"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between mt-0.5">
                                        <span className="text-[10px] text-surface-400">{cat.count} expense{cat.count > 1 ? 's' : ''}</span>
                                        <span className="text-[10px] text-surface-400">{pct}%</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>

                <Card padding="lg">
                    <h3 className="text-sm font-bold text-surface-900 mb-4">By Department</h3>
                    <div className="space-y-3">
                        {expenseSummary.byDepartment.map(dept => {
                            const pct = Math.round((dept.amount / expenseSummary.totalExpenses) * 100);
                            return (
                                <div key={dept.department}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-medium text-surface-700">{dept.department}</span>
                                        <span className="text-xs font-bold text-surface-900 tabular-nums">{formatCurrency(dept.amount)}</span>
                                    </div>
                                    <div className="w-full h-2 bg-surface-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-amber-500 rounded-full transition-all"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between mt-0.5">
                                        <span className="text-[10px] text-surface-400">{dept.count} expense{dept.count > 1 ? 's' : ''}</span>
                                        <span className="text-[10px] text-surface-400">{pct}%</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>

            <ConfirmationModal
                isOpen={expDeleteTarget !== null}
                onClose={() => setExpDeleteTarget(null)}
                onConfirm={confirmExpDelete}
                title={expDeleteTarget?.type === 'bulk' ? `Delete ${selectedIds.size} Expenses?` : 'Delete Expense?'}
                description={expDeleteTarget?.type === 'bulk'
                    ? `You are about to permanently delete ${selectedIds.size} expense records. Financial data cannot be recovered.`
                    : 'This expense record will be permanently deleted. This action cannot be undone.'
                }
                confirmLabel={expDeleteTarget?.type === 'bulk' ? `Delete ${selectedIds.size} Records` : 'Delete Expense'}
                variant="danger"
                icon={<Trash2 size={28} />}
            />

            {/* Customize Export Modal */}
            {showCustomize && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowCustomize(false)} />
                    <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90svh]">
                        {/* Modal header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100">
                            <div>
                                <h2 className="text-base font-bold text-surface-900">Customize Export</h2>
                                <p className="text-xs text-surface-500 mt-0.5">Edit your company name and rename any column header. Changes apply to both CSV and Excel exports and are saved in your browser.</p>
                            </div>
                            <button onClick={() => setShowCustomize(false)} className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-surface-700 transition-colors cursor-pointer">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal body */}
                        <div className="flex-1 overflow-y-auto min-h-0 px-6 py-4 space-y-4">
                            {/* Company name */}
                            <div>
                                <label className="block text-xs font-bold text-surface-700 mb-1.5 uppercase tracking-wider">Company Name</label>
                                <input
                                    type="text"
                                    value={draftCompany}
                                    onChange={e => setDraftCompany(e.target.value)}
                                    placeholder={DEFAULT_COMPANY}
                                    className="w-full px-3 py-2 text-sm border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all"
                                />
                                <p className="text-[10px] text-surface-400 mt-1">Appears in the header row of each exported sheet.</p>
                            </div>

                            {/* Column headers */}
                            <div>
                                <label className="block text-xs font-bold text-surface-700 mb-2 uppercase tracking-wider">Expense Column Headers</label>
                                <div className="space-y-2">
                                    {EXCEL_COLUMNS.map((col, i) => (
                                        <div key={col.key} className="flex items-center gap-2">
                                            <span className="w-5 text-[10px] text-surface-400 text-right shrink-0">{i + 1}</span>
                                            <input
                                                type="text"
                                                value={draftHeaders[i] ?? col.header}
                                                onChange={e => {
                                                    const updated = [...draftHeaders];
                                                    updated[i] = e.target.value;
                                                    setDraftHeaders(updated);
                                                }}
                                                placeholder={col.header}
                                                className="flex-1 px-3 py-1.5 text-xs border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all"
                                            />
                                            {draftHeaders[i] !== DEFAULT_COL_HEADERS[i] && (
                                                <button
                                                    onClick={() => {
                                                        const updated = [...draftHeaders];
                                                        updated[i] = DEFAULT_COL_HEADERS[i];
                                                        setDraftHeaders(updated);
                                                    }}
                                                    className="p-1 text-surface-400 hover:text-surface-700 transition-colors cursor-pointer"
                                                    title="Reset to default"
                                                >
                                                    <RotateCcw size={12} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Modal footer */}
                        <div className="flex items-center justify-between gap-2 px-6 py-4 border-t border-surface-100">
                            <button
                                onClick={resetCustomize}
                                className="flex items-center gap-1.5 text-xs text-surface-500 hover:text-surface-800 transition-colors cursor-pointer"
                            >
                                <RotateCcw size={13} /> Reset all to defaults
                            </button>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => setShowCustomize(false)}>Cancel</Button>
                                <Button variant="primary" leftIcon={<Save size={14} />} onClick={saveCustomize}>Save Changes</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
