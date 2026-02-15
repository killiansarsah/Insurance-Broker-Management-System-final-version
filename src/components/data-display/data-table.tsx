'use client';

import { useState, useMemo } from 'react';
import {
    ChevronUp,
    ChevronDown,
    ChevronsUpDown,
    ChevronLeft,
    ChevronRight,
    Search,
    Download,
    X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Column<T> {
    key: string;
    label: string;
    sortable?: boolean;
    render?: (row: T) => React.ReactNode;
    className?: string;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    searchable?: boolean;
    searchPlaceholder?: string;
    searchKeys?: string[];
    pageSize?: number;
    onRowClick?: (row: T) => void;
    emptyMessage?: string;
    headerActions?: React.ReactNode;
    className?: string;
}

type SortDirection = 'asc' | 'desc' | null;

export function DataTable<T>({
    data,
    columns,
    searchable = true,
    searchPlaceholder = 'Search…',
    searchKeys,
    pageSize = 10,
    onRowClick,
    emptyMessage = 'No records found',
    headerActions,
    className,
}: DataTableProps<T>) {
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDir, setSortDir] = useState<SortDirection>(null);
    const [page, setPage] = useState(1);

    const filteredData = useMemo(() => {
        if (!search.trim()) return data;
        const term = search.toLowerCase();
        const keys = searchKeys || columns.map((c) => c.key);
        return data.filter((row) =>
            keys.some((key) => {
                const value = (row as Record<string, unknown>)[key];
                if (value == null) return false;
                return String(value).toLowerCase().includes(term);
            })
        );
    }, [data, search, searchKeys, columns]);

    const sortedData = useMemo(() => {
        if (!sortKey || !sortDir) return filteredData;
        return [...filteredData].sort((a, b) => {
            const aVal = (a as Record<string, unknown>)[sortKey];
            const bVal = (b as Record<string, unknown>)[sortKey];
            if (aVal == null && bVal == null) return 0;
            if (aVal == null) return 1;
            if (bVal == null) return -1;
            if (typeof aVal === 'number' && typeof bVal === 'number') {
                return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
            }
            const comparison = String(aVal).localeCompare(String(bVal));
            return sortDir === 'asc' ? comparison : -comparison;
        });
    }, [filteredData, sortKey, sortDir]);

    const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
    const safePage = Math.min(page, totalPages);
    const paginatedData = sortedData.slice(
        (safePage - 1) * pageSize,
        safePage * pageSize
    );

    function handleSort(key: string) {
        if (sortKey === key) {
            if (sortDir === 'asc') setSortDir('desc');
            else if (sortDir === 'desc') {
                setSortKey(null);
                setSortDir(null);
            }
        } else {
            setSortKey(key);
            setSortDir('asc');
        }
        setPage(1);
    }

    function handleExportCSV() {
        const headers = columns.map((c) => c.label).join(',');
        const rows = sortedData.map((row) =>
            columns
                .map((c) => {
                    const val = (row as Record<string, unknown>)[c.key];
                    const str = val == null ? '' : String(val);
                    return str.includes(',') ? `"${str}"` : str;
                })
                .join(',')
        );
        const csv = [headers, ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'export.csv';
        link.click();
        URL.revokeObjectURL(url);
    }

    return (
        <div className={cn('bg-[var(--bg-card)] backdrop-blur-[var(--glass-blur)] rounded-[var(--radius-lg)] border-0 border-[var(--glass-border)] shadow-[var(--glass-shadow)] overflow-hidden', className)}>
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-b border-[var(--glass-border)]">
                {searchable && (
                    <div className="relative flex-1 max-w-sm">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            placeholder={searchPlaceholder}
                            className="w-full pl-9 pr-8 py-2 text-sm bg-[var(--bg-input)] backdrop-blur-sm border border-[var(--glass-border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-surface-400"
                        />
                        {search && (
                            <button
                                onClick={() => {
                                    setSearch('');
                                    setPage(1);
                                }}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 cursor-pointer"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                )}
                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={handleExportCSV}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-surface-600 bg-[var(--bg-input)] border border-[var(--glass-border)] rounded-[var(--radius-md)] hover:bg-surface-100 cursor-pointer transition-colors"
                    >
                        <Download size={14} />
                        Export
                    </button>
                    {headerActions}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-transparent border-b border-[var(--glass-border)]">
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={cn(
                                        'px-5 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider whitespace-nowrap',
                                        col.sortable && 'cursor-pointer select-none hover:text-surface-700 transition-colors',
                                        col.className
                                    )}
                                    onClick={() => col.sortable && handleSort(col.key)}
                                >
                                    <span className="inline-flex items-center gap-1.5">
                                        {col.label}
                                        {col.sortable && (
                                            <span className="inline-flex flex-col">
                                                {sortKey === col.key ? (
                                                    sortDir === 'asc' ? (
                                                        <ChevronUp size={14} className="text-primary-500" />
                                                    ) : (
                                                        <ChevronDown size={14} className="text-primary-500" />
                                                    )
                                                ) : (
                                                    <ChevronsUpDown size={14} className="text-surface-300" />
                                                )}
                                            </span>
                                        )}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--glass-border)]">
                        {paginatedData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-5 py-16 text-center text-surface-400 text-sm"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((row, i) => (
                                <tr
                                    key={i}
                                    onClick={() => onRowClick?.(row)}
                                    className={cn(
                                        'transition-colors hover:bg-[var(--sidebar-hover)]',
                                        onRowClick && 'cursor-pointer'
                                    )}
                                >
                                    {columns.map((col) => (
                                        <td
                                            key={col.key}
                                            className={cn(
                                                'px-5 py-3.5 text-surface-700 whitespace-nowrap',
                                                col.className
                                            )}
                                        >
                                            {col.render
                                                ? col.render(row)
                                                : ((row as Record<string, unknown>)[col.key] as React.ReactNode) ?? '—'}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--glass-border)] bg-transparent">
                <p className="text-xs text-surface-500">
                    Showing{' '}
                    <span className="font-semibold text-surface-700">
                        {sortedData.length === 0 ? 0 : (safePage - 1) * pageSize + 1}
                    </span>
                    {' '}to{' '}
                    <span className="font-semibold text-surface-700">
                        {Math.min(safePage * pageSize, sortedData.length)}
                    </span>
                    {' '}of{' '}
                    <span className="font-semibold text-surface-700">{sortedData.length}</span>
                    {' '}results
                </p>
                <div className="flex items-center gap-1">
                    <button
                        disabled={safePage <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="p-1.5 rounded-[var(--radius-sm)] text-surface-500 hover:bg-[var(--sidebar-hover)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, idx) => {
                        let pageNum: number;
                        if (totalPages <= 5) {
                            pageNum = idx + 1;
                        } else if (safePage <= 3) {
                            pageNum = idx + 1;
                        } else if (safePage >= totalPages - 2) {
                            pageNum = totalPages - 4 + idx;
                        } else {
                            pageNum = safePage - 2 + idx;
                        }
                        return (
                            <button
                                key={pageNum}
                                onClick={() => setPage(pageNum)}
                                className={cn(
                                    'w-8 h-8 rounded-[var(--radius-sm)] text-xs font-medium cursor-pointer transition-colors',
                                    pageNum === safePage
                                        ? 'bg-primary-500 text-white'
                                        : 'text-surface-600 hover:bg-[var(--sidebar-hover)]'
                                )}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                    <button
                        disabled={safePage >= totalPages}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        className="p-1.5 rounded-[var(--radius-sm)] text-surface-500 hover:bg-[var(--sidebar-hover)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
