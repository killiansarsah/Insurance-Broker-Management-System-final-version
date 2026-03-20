'use client';

import { useState, useCallback } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { SkeletonLoader } from './SkeletonLoader';
import { EmptyState } from './EmptyState';

/**
 * DataTable — Re-usable data table with sorting, pagination, loading skeletons,
 * row hover effects, and staggered row animation.
 */

export interface Column<T> {
  key?: string;
  accessorKey?: string;
  label?: string;
  header?: string;
  sortable?: boolean;
  width?: string | number;
  render?: (row: T, index: number) => React.ReactNode;
  cell?: (row: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  page?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (row: T) => void;
  rowKey?: (row: T) => string;
  skeletonRows?: number;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
  sortKey,
  sortDir,
  onSort,
  page = 1,
  pageSize = 10,
  total,
  onPageChange,
  emptyTitle = 'No data found',
  emptyDescription,
  onRowClick,
  rowKey,
  skeletonRows = 5,
}: DataTableProps<T>) {
  const totalPages = total ? Math.ceil(total / pageSize) : 1;

  const renderSortIcon = useCallback(
    (col: Column<T>) => {
      if (!col.sortable) return null;
      if (sortKey === col.key) {
        return sortDir === 'asc' ? (
          <ChevronUp size={12} style={{ color: 'var(--sa-teal-500)' }} />
        ) : (
          <ChevronDown size={12} style={{ color: 'var(--sa-teal-500)' }} />
        );
      }
      return <ChevronsUpDown size={12} style={{ color: 'var(--sa-text-muted)', opacity: 0.5 }} />;
    },
    [sortKey, sortDir]
  );

  return (
    <div
      style={{
        border: '1px solid var(--sa-border)',
        borderRadius: 'var(--sa-radius-md)',
        overflow: 'hidden',
        backgroundColor: 'var(--sa-bg-card)',
      }}
    >
      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--sa-border)' }}>
              {columns.map((col) => {
                const colKey = col.key || col.accessorKey || '';
                return (
                  <th
                    key={colKey}
                    className={`text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider ${
                      col.sortable ? 'cursor-pointer select-none' : ''
                    }`}
                    style={{
                      color: 'var(--sa-text-muted)',
                      backgroundColor: 'var(--sa-bg-card-alt)',
                      width: col.width,
                      letterSpacing: '0.06em',
                      textAlign: col.align ?? 'left',
                    }}
                    onClick={col.sortable && onSort ? () => onSort(colKey) : undefined}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.label || col.header}
                      {renderSortIcon(col)}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {/* Loading skeleton */}
            {loading &&
              Array.from({ length: skeletonRows }).map((_, i) => (
                <tr
                  key={`skel-${i}`}
                  style={{ borderBottom: '1px solid var(--sa-border)' }}
                >
                  {columns.map((col, j) => (
                    <td key={col.key || col.accessorKey || j} className="px-4 py-3">
                      <SkeletonLoader variant="text" width={`${50 + Math.random() * 40}%`} />
                    </td>
                  ))}
                </tr>
              ))}

            {/* Empty state */}
            {!loading && data.length === 0 && (
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState title={emptyTitle} description={emptyDescription} />
                </td>
              </tr>
            )}

            {/* Data rows */}
            {!loading &&
              data.map((row, i) => (
                <tr
                  key={rowKey ? rowKey(row) : i}
                  className={onRowClick ? 'cursor-pointer' : ''}
                  style={{
                    borderBottom: i < data.length - 1 ? '1px solid var(--sa-border)' : undefined,
                    animation: `sa-row-enter 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 30}ms both`,
                    transition: 'background-color 150ms',
                  }}
                  onClick={() => onRowClick?.(row)}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--sa-bg-card-alt)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = '';
                  }}
                >
                  {columns.map((col, j) => {
                    const colKey = col.key || col.accessorKey || '';
                    const cellContent = col.render 
                      ? col.render(row, i) 
                      : col.cell
                      ? col.cell(row, i)
                      : String(row[colKey as keyof T] ?? '');
                      
                    return (
                      <td
                        key={colKey || j}
                        className="px-4 py-3 text-sm"
                        style={{
                          color: 'var(--sa-text-primary)',
                          textAlign: col.align ?? 'left',
                        }}
                      >
                        {cellContent}
                      </td>
                    );
                  })}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total !== undefined && total > pageSize && (
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ borderTop: '1px solid var(--sa-border)' }}
        >
          <span className="text-xs" style={{ color: 'var(--sa-text-muted)' }}>
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
          </span>

          <div className="flex items-center gap-1">
            <button
              disabled={page <= 1}
              onClick={() => onPageChange?.(page - 1)}
              className="sa-btn-hover p-1.5"
              style={{
                border: '1px solid var(--sa-border)',
                borderRadius: 'var(--sa-radius-md)',
                background: 'transparent',
                cursor: page <= 1 ? 'not-allowed' : 'pointer',
                opacity: page <= 1 ? 0.4 : 1,
                color: 'var(--sa-text-secondary)',
              }}
              aria-label="Previous page"
            >
              <ChevronLeft size={14} />
            </button>

            <span
              className="px-3 py-1 text-xs font-medium"
              style={{
                fontFamily: "'DM Mono', monospace",
                color: 'var(--sa-text-secondary)',
              }}
            >
              {page} / {totalPages}
            </span>

            <button
              disabled={page >= totalPages}
              onClick={() => onPageChange?.(page + 1)}
              className="sa-btn-hover p-1.5"
              style={{
                border: '1px solid var(--sa-border)',
                borderRadius: 'var(--sa-radius-md)',
                background: 'transparent',
                cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                opacity: page >= totalPages ? 0.4 : 1,
                color: 'var(--sa-text-secondary)',
              }}
              aria-label="Next page"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
