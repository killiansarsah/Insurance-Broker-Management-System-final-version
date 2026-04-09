'use client';

import { useState, useMemo, useRef, useEffect, useCallback, memo } from 'react';
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
import { cn, safeCsvCell } from '@/lib/utils';
import { CustomSelect } from '@/components/ui/select-custom';

interface Column<T> {
    key: string;
    label: string;
    sortable?: boolean;
    render?: (row: T) => React.ReactNode;
    exportValue?: (row: T) => any;
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
    exportable?: boolean;
    onExport?: () => void;
    className?: string;

    // Selection Props
    selectable?: boolean;
    selectedRows?: T[];
    onSelectionChange?: (rows: T[]) => void;

    // Server-side pagination props
    serverSide?: boolean;
    totalCount?: number;
    currentPage?: number;
    onPageChange?: (page: number) => void;
    onSearchChange?: (term: string) => void;
    onSortChange?: (key: string, dir: 'asc' | 'desc') => void;
    onPageSizeChange?: (size: number) => void;
    loading?: boolean;
}

type SortDirection = 'asc' | 'desc' | null;

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50];

// Memoized row — prevents re-renders caused by parent state unrelated to row data
// (e.g. search input width animation, focus state, pagination UI changes)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MemoTableRow = memo(function MemoTableRow({ row, columns, index, onRowClick, selectable, isSelected, onToggleSelection }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    row: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columns: Column<any>[];
    index: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onRowClick?: (row: any) => void;
    selectable?: boolean;
    isSelected?: boolean;
    onToggleSelection?: (row: any) => void;
}) {
    return (
        <tr
            onClick={() => onRowClick?.(row)}
            className={cn(
                'border-b border-surface-100/80 dark:border-slate-700/40 transition-all duration-150',
                'hover:bg-primary-50/30 dark:hover:bg-primary-900/20 hover:shadow-[inset_3px_0_0_0_var(--color-primary-500)]',
                onRowClick && 'cursor-pointer',
                index % 2 === 1 && 'bg-surface-50/40 dark:bg-slate-800/40',
                'table-row-enter'
            )}
            style={{ animationDelay: `${index * 25}ms` }}
        >
            {selectable && (
                <td className="px-5 py-4 w-[50px] whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <input 
                        type="checkbox" 
                        aria-label="Select row"
                        className="w-4 h-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500/50 cursor-pointer bg-white dark:bg-slate-800 transition-all checked:bg-primary-600 checked:border-primary-600"
                        checked={isSelected}
                        onChange={(e) => {
                            e.stopPropagation();
                            onToggleSelection?.(row);
                        }}
                    />
                </td>
            )}
            {columns.map((col) => (
                <td
                    key={col.key}
                    className={cn(
                        'px-5 py-4 text-surface-700 dark:text-slate-300 whitespace-nowrap',
                        col.className
                    )}
                >
                    {col.render
                        ? col.render(row)
                        : (row[col.key] as React.ReactNode) ?? '\u2014'}
                </td>
            ))}
        </tr>
    );
});

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
    exportable = true,
    onExport,
    className,
    selectable = false,
    selectedRows = [],
    onSelectionChange,
    serverSide = false,
    totalCount,
    currentPage,
    onPageChange,
    onSearchChange,
    onSortChange,
    onPageSizeChange: onPageSizeChangeProp,
    loading = false,
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
    
    // Debounce timer for remote search
    const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const filteredData = useMemo(() => {
        if (serverSide) return data;
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
    }, [data, search, searchKeys, columns, serverSide]);

    const sortedData = useMemo(() => {
        if (serverSide) return filteredData;
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
    }, [filteredData, sortKey, sortDir, serverSide]);

    // In server-side mode, use external totalCount and currentPage for pagination
    const effectiveTotalItems = serverSide ? (totalCount ?? 0) : sortedData.length;
    const totalPages = Math.max(1, Math.ceil(effectiveTotalItems / currentPageSize));
    const effectivePage = serverSide ? (currentPage ?? 1) : Math.min(page, totalPages);
    const paginatedData = serverSide
        ? data
        : sortedData.slice(
            (effectivePage - 1) * currentPageSize,
            effectivePage * currentPageSize
        );

    const handleSort = useCallback((key: string) => {
        let newDir: SortDirection = 'asc';
        if (sortKey === key) {
            if (sortDir === 'asc') newDir = 'desc';
            else if (sortDir === 'desc') {
                setSortKey(null);
                setSortDir(null);
                if (serverSide && onSortChange) onSortChange(key, 'desc');
                if (serverSide && onPageChange) onPageChange(1);
                else setPage(1);
                return;
            }
        }
        setSortKey(key);
        setSortDir(newDir);
        if (serverSide && onSortChange) onSortChange(key, newDir as 'asc' | 'desc');
        if (serverSide && onPageChange) onPageChange(1);
        else setPage(1);
    }, [sortKey, sortDir, serverSide, onSortChange, onPageChange]);

    const isAllSelected = filteredData.length > 0 && filteredData.every(row => selectedRows?.includes(row));
    const isSomeSelected = filteredData.length > 0 && filteredData.some(row => selectedRows?.includes(row));

    const handleSelectAll = useCallback(() => {
        if (!onSelectionChange) return;
        if (isAllSelected) {
            onSelectionChange([]);
        } else {
            onSelectionChange([...filteredData]);
        }
    }, [isAllSelected, filteredData, onSelectionChange]);

    const handleToggleSelection = useCallback((row: T) => {
        if (!onSelectionChange) return;
        const newArray = selectedRows?.includes(row)
            ? selectedRows.filter(r => r !== row)
            : [...(selectedRows || []), row];
        onSelectionChange(newArray);
    }, [selectedRows, onSelectionChange]);

    const handleExportCSV = useCallback(() => {
        if (onExport) {
            onExport();
            return;
        }
        const headers = columns.map((c) => c.label).join(',');
        const rows = sortedData.map((row) =>
            columns
                .map((c) => {
                    // Check if there is an export value function, otherwise rely on the key
                    if (c.exportValue) return safeCsvCell(c.exportValue(row));
                    const val = (row as Record<string, unknown>)[c.key];
                    return safeCsvCell(val);
                })
                .join(',')
        );
        const csv = [headers, ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Brokerium_Export_${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    }, [columns, sortedData, onExport]);

    const handlePageSizeChange = useCallback((newSize: number) => {
        setCurrentPageSize(newSize);
        if (serverSide) {
            onPageSizeChangeProp?.(newSize);
            onPageChange?.(1);
        } else {
            setPage(1);
        }
    }, [serverSide, onPageSizeChangeProp, onPageChange]);

    return (
        <div className={cn(
            'bg-white dark:bg-slate-900 rounded-xl border border-surface-200/60 dark:border-slate-700/60',
            'shadow-[0_2px_8px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.2)]',
            'overflow-hidden',
            className
        )}>
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-5 py-3 sm:py-4 border-b border-surface-100 dark:border-slate-700/60 bg-surface-50/30 dark:bg-slate-800/30">
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
                                const val = e.target.value;
                                setSearch(val);
                                if (serverSide) {
                                    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
                                    searchTimerRef.current = setTimeout(() => {
                                        onSearchChange?.(val);
                                        onPageChange?.(1);
                                    }, 350);
                                } else {
                                    setPage(1);
                                }
                            }}
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                            placeholder={searchPlaceholder}
                            aria-label={searchPlaceholder}
                            style={{ fontSize: '14px' }}
                            className="w-full pl-11 pr-10 py-2.5 bg-white dark:bg-slate-800 border border-surface-200 dark:border-slate-600 rounded-lg text-surface-900 dark:text-slate-200 caret-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/25 focus:border-primary-400 focus:shadow-[0_0_0_3px_rgba(25,118,210,0.1)] transition-[border,box-shadow] placeholder:text-surface-400 dark:placeholder:text-slate-500"
                        />
                        {search && (
                            <button
                                onClick={() => {
                                    setSearch('');
                                    if (serverSide) {
                                        if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
                                        onSearchChange?.('');
                                        onPageChange?.(1);
                                    } else {
                                        setPage(1);
                                    }
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full text-surface-400 hover:text-surface-700 dark:hover:text-slate-200 hover:bg-surface-100 dark:hover:bg-slate-700 cursor-pointer transition-all"
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
                    {exportable && (
                        <button
                            onClick={handleExportCSV}
                            className="group relative inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-success-700 dark:text-success-400 bg-success-50/50 dark:bg-success-900/10 border border-success-200/50 dark:border-success-800/30 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_6px_16px_-4px_rgba(34,197,94,0.3)] dark:hover:shadow-[0_6px_16px_-4px_rgba(34,197,94,0.15)] hover:-translate-y-0.5 hover:bg-success-50 dark:hover:bg-success-900/30 hover:border-success-300/60 dark:hover:border-success-700/50 whitespace-nowrap"
                        >
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-tr from-success-400/0 via-success-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            
                            <div className="relative flex items-center justify-center z-10 p-0.5 rounded-md text-success-600 dark:text-success-500 transition-colors duration-300">
                                <FileSpreadsheet 
                                    size={15} 
                                    className="transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.15] group-hover:-rotate-6 group-active:scale-95" 
                                />
                            </div>
                            <span className="relative z-10 tracking-wide">Export</span>
                        </button>
                    )}
                    {headerActions}
                </div>
            </div>

            {/* Record count bar */}
            <div className="px-5 py-2 bg-surface-50/50 dark:bg-slate-800/50 border-b border-surface-100 dark:border-slate-700/60 flex items-center justify-between">
                <p className="text-[11px] font-semibold text-surface-400 uppercase tracking-widest">
                    {effectiveTotalItems} record{effectiveTotalItems !== 1 ? 's' : ''}
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
                            {selectable && (
                                <th className="px-5 py-3.5 w-12 text-left bg-white dark:bg-slate-900">
                                    <input 
                                        type="checkbox" 
                                        aria-label="Select all rows"
                                        className="w-4 h-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500/50 cursor-pointer bg-white dark:bg-slate-800 transition-all checked:bg-primary-600 checked:border-primary-600"
                                        checked={isAllSelected}
                                        ref={(input) => {
                                            if (input) {
                                                input.indeterminate = isSomeSelected && !isAllSelected;
                                            }
                                        }}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                            )}
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={cn(
                                        'px-5 py-3.5 text-left text-[11px] font-bold text-surface-400 dark:text-slate-500 uppercase tracking-widest whitespace-nowrap bg-white dark:bg-slate-900',
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
                        {loading ? (
                            <tr>
                                <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-5 py-20 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-8 h-8 border-3 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
                                        <p className="text-sm text-surface-400">Loading records…</p>
                                    </div>
                                </td>
                            </tr>
                        ) : paginatedData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (selectable ? 1 : 0)}
                                    className="px-5 py-20 text-center"
                                >
                                    {typeof emptyMessage === 'string' ? (
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 rounded-2xl bg-surface-100 dark:bg-slate-800 flex items-center justify-center">
                                                <Inbox size={32} className="text-surface-300" />
                                            </div>
                                            <div>
                                                <p className="text-base font-semibold text-surface-600 dark:text-slate-300">{emptyMessage}</p>
                                                <p className="text-sm text-surface-400 dark:text-slate-500 mt-1">Try adjusting your search or filters to find what you&apos;re looking for.</p>
                                            </div>
                                        </div>
                                    ) : (
                                        emptyMessage
                                    )}
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((row, i) => (
                                <MemoTableRow
                                    key={(row as Record<string, unknown>)['id'] as string ?? i}
                                    row={row}
                                    columns={columns}
                                    index={i}
                                    onRowClick={onRowClick}
                                    selectable={selectable}
                                    isSelected={selectedRows?.includes(row)}
                                    onToggleSelection={handleToggleSelection}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 border-t border-surface-100 dark:border-slate-700/60 bg-surface-50/30 dark:bg-slate-800/30">
                <div className="flex items-center gap-4">
                    <p className="text-xs text-surface-500">
                        Showing{' '}
                        <span className="font-bold text-surface-800 dark:text-slate-200">
                            {effectiveTotalItems === 0 ? 0 : (effectivePage - 1) * currentPageSize + 1}
                            –
                            {Math.min(effectivePage * currentPageSize, effectiveTotalItems)}
                        </span>
                        {' '}of{' '}
                        <span className="font-bold text-surface-800 dark:text-slate-200">{effectiveTotalItems}</span>
                    </p>
                    <div className="flex items-center gap-2 border-l border-surface-200 dark:border-slate-700 pl-4">
                        <label htmlFor="page-size" className="text-xs text-surface-400 dark:text-slate-500 font-medium">Rows per page</label>
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
                        disabled={effectivePage <= 1}
                        onClick={() => {
                            if (serverSide) onPageChange?.(effectivePage - 1);
                            else setPage((p) => Math.max(1, p - 1));
                        }}
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-surface-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-surface-200 dark:border-slate-600 hover:bg-surface-50 dark:hover:bg-slate-700 hover:border-surface-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all shadow-sm"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, idx) => {
                        let pageNum: number;
                        if (totalPages <= 5) {
                            pageNum = idx + 1;
                        } else if (effectivePage <= 3) {
                            pageNum = idx + 1;
                        } else if (effectivePage >= totalPages - 2) {
                            pageNum = totalPages - 4 + idx;
                        } else {
                            pageNum = effectivePage - 2 + idx;
                        }
                        return (
                            <button
                                key={pageNum}
                                onClick={() => {
                                    if (serverSide) onPageChange?.(pageNum);
                                    else setPage(pageNum);
                                }}
                                className={cn(
                                    'w-9 h-9 rounded-lg text-xs font-bold cursor-pointer transition-all duration-200',
                                    pageNum === effectivePage
                                        ? 'bg-primary-500 text-white shadow-md shadow-primary-500/30 scale-105'
                                        : 'text-surface-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-surface-200 dark:border-slate-600 hover:bg-surface-50 dark:hover:bg-slate-700 hover:border-surface-300 shadow-sm'
                                )}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                    <button
                        disabled={effectivePage >= totalPages}
                        onClick={() => {
                            if (serverSide) onPageChange?.(effectivePage + 1);
                            else setPage((p) => Math.min(totalPages, p + 1));
                        }}
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-surface-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-surface-200 dark:border-slate-600 hover:bg-surface-50 dark:hover:bg-slate-700 hover:border-surface-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all shadow-sm"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
