'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
    ChevronUp,
    ChevronDown,
    ChevronsUpDown,
    ChevronLeft,
    ChevronRight,
    Search,
    Download,
    X,
    Inbox,
    FileSpreadsheet,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CustomSelect } from '@/components/ui/select-custom';

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
    emptyMessage?: React.ReactNode;
    headerActions?: React.ReactNode;
    className?: string;
}

type SortDirection = 'asc' | 'desc' | null;

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50];

export function DataTable<T>({
    data,
    columns,
    searchable = true,
    searchPlaceholder = 'Search…',
    searchKeys,
    pageSize: initialPageSize = 10,
    onRowClick,
    emptyMessage = 'No records found',
    headerActions,
    className,
}: DataTableProps<T>) {
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDir, setSortDir] = useState<SortDirection>(null);
    const [page, setPage] = useState(1);
    const [currentPageSize, setCurrentPageSize] = useState(initialPageSize);
    const [searchFocused, setSearchFocused] = useState(false);
    const [searchWidth, setSearchWidth] = useState(180);
    const measureRef = useRef<HTMLSpanElement>(null);

    // Auto-expand search input based on text length
    useEffect(() => {
        const padding = 44 + 40 + 16; // pl-11 + pr-10 + buffer
        const minW = 180;
        const maxW = 480;
        if (measureRef.current) {
            const textW = measureRef.current.offsetWidth;
            const desired = Math.max(minW, Math.min(maxW, textW + padding));
            setSearchWidth(searchFocused && !search ? Math.max(desired, 240) : desired);
        } else {
            setSearchWidth(searchFocused ? 240 : minW);
        }
    }, [search, searchFocused]);
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

    const totalPages = Math.max(1, Math.ceil(sortedData.length / currentPageSize));
    const safePage = Math.min(page, totalPages);
    const paginatedData = sortedData.slice(
        (safePage - 1) * currentPageSize,
        safePage * currentPageSize
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

    function handlePageSizeChange(newSize: number) {
        setCurrentPageSize(newSize);
        setPage(1);
    }

    return (
        <div className={cn(
            'bg-white rounded-xl border border-surface-200/60',
            'shadow-[0_2px_8px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)]',
            'overflow-hidden',
            className
        )}>
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-surface-100 bg-surface-50/30">
                {searchable && (
                    <div
                        className="relative group z-10 transition-all duration-300 ease-out"
                        style={{ width: `${searchWidth}px` }}
                    >
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 transition-all duration-200 group-focus-within:text-primary-500 group-focus-within:scale-110 pointer-events-none" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                            placeholder={searchPlaceholder}
                            style={{ color: '#0f172a', fontSize: '14px' }}
                            className="w-full pl-11 pr-10 py-2.5 bg-white border border-surface-200 rounded-lg caret-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/25 focus:border-primary-400 focus:shadow-[0_0_0_3px_rgba(25,118,210,0.1)] transition-[border,box-shadow] placeholder:text-surface-400"
                        />
                        {search && (
                            <button
                                onClick={() => {
                                    setSearch('');
                                    setPage(1);
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full text-surface-400 hover:text-surface-700 hover:bg-surface-100 cursor-pointer transition-all"
                            >
                                <X size={14} />
                            </button>
                        )}
                        {/* Hidden measurer */}
                        <span
                            ref={measureRef}
                            aria-hidden
                            className="absolute invisible whitespace-pre"
                            style={{ fontSize: '14px', fontFamily: 'inherit' }}
                        >
                            {search || searchPlaceholder}
                        </span>
                    </div>
                )}
                <div className="flex items-center gap-2 shrink-0 ml-auto">
                    <button
                        onClick={handleExportCSV}
                        className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-surface-600 bg-white border border-surface-200 rounded-lg hover:bg-surface-50 hover:border-surface-300 cursor-pointer transition-all duration-200 shadow-sm hover:shadow whitespace-nowrap"
                    >
                        <FileSpreadsheet size={14} />
                        Export CSV
                    </button>
                    {headerActions}
                </div>
            </div>

            {/* Record count bar */}
            <div className="px-5 py-2 bg-surface-50/50 border-b border-surface-100 flex items-center justify-between">
                <p className="text-[11px] font-semibold text-surface-400 uppercase tracking-widest">
                    {sortedData.length} record{sortedData.length !== 1 ? 's' : ''}
                    {search && <span className="text-primary-500 ml-1">matching &ldquo;{search}&rdquo;</span>}
                </p>
                {sortKey && (
                    <button
                        onClick={() => { setSortKey(null); setSortDir(null); }}
                        className="text-[11px] text-primary-500 hover:text-primary-600 font-medium cursor-pointer transition-colors"
                    >
                        Clear sort
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b-2 border-surface-100">
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={cn(
                                        'px-5 py-3.5 text-left text-[11px] font-bold text-surface-400 uppercase tracking-widest whitespace-nowrap bg-white',
                                        col.sortable && 'cursor-pointer select-none group/th transition-colors hover:text-surface-700',
                                        sortKey === col.key && 'text-primary-600 bg-primary-50/40',
                                        col.className
                                    )}
                                    onClick={() => col.sortable && handleSort(col.key)}
                                >
                                    <span className="inline-flex items-center gap-1.5">
                                        {col.label}
                                        {col.sortable && (
                                            <span className="inline-flex flex-col transition-transform group-hover/th:scale-110">
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
                    <tbody>
                        {paginatedData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-5 py-20 text-center"
                                >
                                    {typeof emptyMessage === 'string' ? (
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center">
                                                <Inbox size={32} className="text-surface-300" />
                                            </div>
                                            <div>
                                                <p className="text-base font-semibold text-surface-600">{emptyMessage}</p>
                                                <p className="text-sm text-surface-400 mt-1">Try adjusting your search or filters to find what you&apos;re looking for.</p>
                                            </div>
                                        </div>
                                    ) : (
                                        emptyMessage
                                    )}
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((row, i) => (
                                <tr
                                    key={i}
                                    onClick={() => onRowClick?.(row)}
                                    className={cn(
                                        'border-b border-surface-100/80 transition-all duration-150',
                                        'hover:bg-primary-50/30 hover:shadow-[inset_3px_0_0_0_var(--color-primary-500)]',
                                        onRowClick && 'cursor-pointer',
                                        i % 2 === 1 && 'bg-surface-50/40',
                                        'table-row-enter'
                                    )}
                                    style={{ animationDelay: `${i * 25}ms` }}
                                >
                                    {columns.map((col) => (
                                        <td
                                            key={col.key}
                                            className={cn(
                                                'px-5 py-4 text-surface-700 whitespace-nowrap',
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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 border-t border-surface-100 bg-surface-50/30">
                <div className="flex items-center gap-4">
                    <p className="text-xs text-surface-500">
                        Showing{' '}
                        <span className="font-bold text-surface-800">
                            {sortedData.length === 0 ? 0 : (safePage - 1) * currentPageSize + 1}
                            –
                            {Math.min(safePage * currentPageSize, sortedData.length)}
                        </span>
                        {' '}of{' '}
                        <span className="font-bold text-surface-800">{sortedData.length}</span>
                    </p>
                    <div className="flex items-center gap-2 border-l border-surface-200 pl-4">
                        <label htmlFor="page-size" className="text-xs text-surface-400 font-medium">Rows per page</label>
                        <CustomSelect
                            options={PAGE_SIZE_OPTIONS}
                            value={currentPageSize}
                            onChange={(val) => handlePageSizeChange(Number(val))}
                            className="scale-90 origin-left"
                            position="top"
                            align="right"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-1.5">
                    <button
                        disabled={safePage <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-surface-500 bg-white border border-surface-200 hover:bg-surface-50 hover:border-surface-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all shadow-sm"
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
                                    'w-9 h-9 rounded-lg text-xs font-bold cursor-pointer transition-all duration-200',
                                    pageNum === safePage
                                        ? 'bg-primary-500 text-white shadow-md shadow-primary-500/30 scale-105'
                                        : 'text-surface-600 bg-white border border-surface-200 hover:bg-surface-50 hover:border-surface-300 shadow-sm'
                                )}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                    <button
                        disabled={safePage >= totalPages}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-surface-500 bg-white border border-surface-200 hover:bg-surface-50 hover:border-surface-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all shadow-sm"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
