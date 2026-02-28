'use client';

import { useState, useRef, useCallback, useMemo } from 'react';
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
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/data-display/status-badge';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
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

// ─── CSV Export ──────────────────────────────────────────────
function exportToCSV(data: Expense[]) {
    const headers = [
        'Date', 'Description', 'Category', 'Amount', 'Currency', 'Vendor',
        'Reference', 'Payment Method', 'Status', 'Department', 'Notes',
    ];
    const rows = data.map(e => [
        e.date,
        `"${e.description.replace(/"/g, '""')}"`,
        CATEGORY_LABEL[e.category],
        e.amount.toFixed(2),
        e.currency,
        `"${e.vendor.replace(/"/g, '""')}"`,
        e.reference,
        PAYMENT_METHOD_LABEL[e.paymentMethod],
        STATUS_LABEL[e.status],
        e.department,
        `"${(e.notes || '').replace(/"/g, '""')}"`,
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses_${new Date().toISOString().slice(0, 10)}.csv`;
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
const KPIS = [
    {
        label: 'Total Expenses',
        value: formatCurrency(expenseSummary.totalExpenses),
        icon: DollarSign,
        color: 'text-primary-600',
        bg: 'bg-primary-50',
    },
    {
        label: 'Approved',
        value: formatCurrency(expenseSummary.approved),
        icon: CheckCircle2,
        color: 'text-success-600',
        bg: 'bg-success-50',
    },
    {
        label: 'Pending',
        value: formatCurrency(expenseSummary.pending),
        icon: Clock,
        color: 'text-warning-600',
        bg: 'bg-warning-50',
    },
    {
        label: 'Rejected',
        value: formatCurrency(expenseSummary.rejected),
        icon: XCircle,
        color: 'text-danger-600',
        bg: 'bg-danger-50',
    },
];

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
                        variant="outline"
                        leftIcon={<Upload size={16} />}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        Import CSV
                    </Button>
                    <Button
                        variant="outline"
                        leftIcon={<Download size={16} />}
                        onClick={() => exportToCSV(filtered)}
                    >
                        Export CSV
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
                                transition-all bg-white placeholder-surface-400"
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

            {/* Spreadsheet Table */}
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
                                                        className="p-1.5 rounded-md bg-success-50 text-success-600 hover:bg-success-100 transition-colors"
                                                        title="Save"
                                                    >
                                                        <Save size={14} />
                                                    </button>
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="p-1.5 rounded-md bg-surface-100 text-surface-500 hover:bg-surface-200 transition-colors"
                                                        title="Cancel"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => startEdit(exp)}
                                                        className="p-1.5 rounded-md hover:bg-primary-50 text-surface-400 hover:text-primary-600 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Pencil size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => setExpDeleteTarget({ type: 'single', id: exp.id })}
                                                        className="p-1.5 rounded-md hover:bg-danger-50 text-surface-400 hover:text-danger-600 transition-colors"
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
        </div>
    );
}
