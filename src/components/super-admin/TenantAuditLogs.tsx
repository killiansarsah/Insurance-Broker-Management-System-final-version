'use client';

import { useState, useEffect, useCallback } from 'react';
import { DataTable } from '@/components/super-admin/DataTable';
import { StatusPill } from '@/components/super-admin/StatusPill';
import { SkeletonLoader } from '@/components/super-admin/SkeletonLoader';
import { FileJson, Search, Clock, ShieldAlert } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

interface AuditLogEntry {
  id: string;
  createdAt: string;
  severity: string;
  category: string;
  actorEmail: string;
  actorRole: string;
  action: string;
  description: string;
  ipAddress: string | null;
  status: string;
  metadata: any;
}

export function TenantAuditLogs({ tenantId }: { tenantId: string }) {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<any>('/platform-admin/audit-logs', {
        tenantId,
        page,
        limit: 20,
        search: searchTerm || undefined,
      });
      setLogs(res.data ?? []);
      setTotalCount(res.meta?.total ?? 0);
    } catch (err) {
      console.error('Failed to load tenant logs:', err);
      toast.error('Failed to load activity logs.');
    } finally {
      setLoading(false);
    }
  }, [tenantId, page, searchTerm]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const columns = [
    {
      header: 'Time (UTC)',
      accessorKey: 'createdAt',
      cell: (row: AuditLogEntry) => (
        <span className="font-mono text-[10px] text-[var(--sa-text-muted)]">
          {new Date(row.createdAt).toISOString().replace('T', ' ').slice(0, 19)}
        </span>
      ),
    },
    {
      header: 'Actor',
      accessorKey: 'actorEmail',
      cell: (row: AuditLogEntry) => (
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-[var(--sa-text-primary)]">{row.actorEmail ?? 'System'}</span>
          <span className="text-[9px] font-mono tracking-widest uppercase text-[#1D9E75]">{row.actorRole}</span>
        </div>
      ),
    },
    {
      header: 'Event',
      accessorKey: 'action',
      cell: (row: AuditLogEntry) => (
        <span className="font-mono text-[11px] text-[#1D9E75] font-bold tracking-tight">{row.action}</span>
      ),
    },
    {
      header: 'Severity',
      accessorKey: 'severity',
      cell: (row: AuditLogEntry) => (
        <StatusPill status={
          row.severity === 'LOW' ? 'active' : 
          row.severity === 'CRITICAL' ? 'failed' : 'warning'
        } />
      ),
    },
    {
      header: 'Description',
      accessorKey: 'description',
      cell: (row: AuditLogEntry) => (
        <span className="text-[11px] text-[var(--sa-text-muted)] truncate max-w-[200px]">{row.description}</span>
      ),
    },
  ];

  return (
    <div className="space-y-4 sa-reveal">
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-full max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--sa-text-muted)]" />
          <input
            type="text"
            placeholder="Filter current tenant workspace logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[var(--sa-bg-card)] border border-[var(--sa-border)] rounded-full text-xs focus:ring-1 focus:ring-[#1D9E75] focus:outline-none font-mono"
          />
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--sa-text-muted)] uppercase tracking-widest">
          <Clock size={12} />
          {totalCount.toLocaleString()} Entries Locked
        </div>
      </div>

      <div className="bg-[var(--sa-bg-card)] border border-[var(--sa-border)] rounded-[var(--sa-radius-md)] overflow-hidden shadow-sm min-h-[400px]">
        <DataTable
          columns={columns as any}
          data={logs as any}
          loading={loading}
          total={totalCount}
          page={page}
          pageSize={20}
          onPageChange={setPage}
        />
      </div>

      <div className="mt-4 p-4 bg-[#fef2f2] border border-[#fecdd3] rounded-[var(--sa-radius-md)] flex items-start gap-3">
        <ShieldAlert size={16} className="text-[#f43f5e] shrink-0 mt-0.5" />
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#f43f5e] mb-1">Privacy & Isolation Protocol</h4>
          <p className="text-[10px] text-[#991b1b] leading-relaxed">
            This ledger is restricted to actions associated specifically with this tenant ID. Platform-wide operations not explicitly linked to this workspace are automatically pruned from this view for security and compliance clarity.
          </p>
        </div>
      </div>
    </div>
  );
}
