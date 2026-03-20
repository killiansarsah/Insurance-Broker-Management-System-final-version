'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/super-admin/PageHeader';
import { DataTable } from '@/components/super-admin/DataTable';
import { SlideDrawer } from '@/components/super-admin/SlideDrawer';
import { StatusPill } from '@/components/super-admin/StatusPill';
import { Clock, Search, Filter, Download, FileJson } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

interface AuditLogEntry {
  id: string;
  createdAt: string;
  severity: string;
  category: string;
  actorEmail: string;
  actorRole: string;
  tenantName: string | null;
  action: string;
  description: string;
  resourceType: string | null;
  resourceId: string | null;
  ipAddress: string | null;
  status: string;
  metadata: Record<string, unknown> | null;
}

interface AuditLogsResponse {
  data: AuditLogEntry[];
  meta?: { total: number; page: number; limit: number };
}

function formatTimestamp(dateStr: string): string {
  return new Date(dateStr).toISOString().replace('T', ' ').slice(0, 19);
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<AuditLogEntry | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<AuditLogsResponse>('/platform-admin/audit-logs', {
        page,
        limit: 50,
        search: searchTerm || undefined,
      });
      setLogs(res.data ?? []);
      if (res.meta) {
        setTotalPages(Math.ceil(res.meta.total / res.meta.limit));
        setTotalCount(res.meta.total);
      }
    } catch (err) {
      console.error('Failed to load audit logs:', err);
      toast.error('Failed to load audit logs.');
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const columns = [
    {
      header: 'Timestamp (UTC)',
      accessorKey: 'createdAt',
      cell: (row: AuditLogEntry) => (
        <span className="font-mono text-[10px] text-[#0c6a55]">{formatTimestamp(row.createdAt)}</span>
      ),
    },
    {
      header: 'Severity',
      accessorKey: 'severity',
      cell: (row: AuditLogEntry) => (
        <StatusPill status={
          row.severity === 'LOW' ? 'active' : 
          row.severity === 'MEDIUM' ? 'warning' : 
          row.severity === 'HIGH' ? 'warning' :
          row.severity === 'CRITICAL' ? 'failed' : 'active'
        } />
      ),
    },
    {
      header: 'Actor & Role',
      accessorKey: 'actorEmail',
      cell: (row: AuditLogEntry) => (
        <div className="flex flex-col">
          <span className="text-xs font-bold text-[var(--sa-text-primary)]">{row.actorEmail ?? 'system'}</span>
          <span className="text-[9px] font-mono tracking-wider uppercase text-[var(--sa-text-muted)]">{row.actorRole ?? 'SYSTEM'}</span>
        </div>
      ),
    },
    {
      header: 'Tenant Scope',
      accessorKey: 'tenantName',
      cell: (row: AuditLogEntry) => (
        <span className="text-xs text-[var(--sa-text-secondary)]">{row.tenantName ?? 'Platform Core'}</span>
      ),
    },
    {
      header: 'Action / Event Type',
      accessorKey: 'action',
      cell: (row: AuditLogEntry) => (
        <span className="font-mono text-xs text-[#1D9E75] font-bold">{row.action}</span>
      ),
    },
    {
      header: 'Details',
      accessorKey: 'id',
      cell: (row: AuditLogEntry) => (
        <button 
          onClick={(e) => { e.stopPropagation(); setSelectedEvent(row); }}
          className="text-[10px] font-bold uppercase tracking-wider text-[#1D9E75] hover:text-[#0c6a55] transition-colors sa-btn-hover hover:underline flex items-center gap-1">
          <FileJson size={14} /> Payload
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 sa-stagger">
      <PageHeader
        title="Immutable Audit Log"
        subtitle="Global chronological ledger of all actions, errors, and system events."
        icon={Clock}
        breadcrumbs={[
          { label: 'Overview', href: '/super-admin' },
          { label: 'System Logs', href: '/super-admin/audit-logs' }
        ]}
        actions={
          <button 
            onClick={() => toast.info('CSV export coming soon.')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--sa-text-primary)] bg-[var(--sa-bg-card)] border border-[var(--sa-border)] hover:bg-[var(--sa-bg-card-alt)] rounded-full transition-colors sa-btn-hover">
            <Download size={14} /> Export CSV
          </button>
        }
      />

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-4 bg-[var(--sa-bg-card)] p-4 rounded-[var(--sa-radius-md)] border border-[var(--sa-border)]">
        <div className="relative flex-1 min-w-[250px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by action, email, or trace ID..." 
            className="w-full pl-9 pr-4 py-2 bg-[var(--sa-bg-page)] border-none rounded-full text-sm focus:ring-2 focus:ring-[#1D9E75] focus:outline-none placeholder:text-gray-500 font-mono text-[var(--sa-text-primary)]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => toast.info('Severity filter coming soon.')}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--sa-text-primary)] bg-[var(--sa-bg-page)] hover:bg-[var(--sa-border)] rounded-full transition-colors sa-btn-hover">
          <Filter size={14} /> Severity
        </button>
        <button 
          onClick={() => toast.info('Category filter coming soon.')}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--sa-text-primary)] bg-[var(--sa-bg-page)] hover:bg-[var(--sa-border)] rounded-full transition-colors sa-btn-hover">
          <Filter size={14} /> Category
        </button>
      </div>

      {/* Live Tailing Banner */}
      <div className="p-3 bg-[#e0f2fe] border border-[#bae6fd] rounded-[var(--sa-radius-md)] flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 text-[#0369a1]">
          <div className="w-2 h-2 rounded-full bg-[#0ea5e9] animate-pulse" />
          Live tailing active... {totalCount.toLocaleString()} total events indexed.
        </div>
        <button onClick={fetchLogs} className="text-[#0369a1] font-bold uppercase tracking-widest hover:underline sa-btn-hover">
          Refresh
        </button>
      </div>

      {/* Audit Table */}
      <div className="bg-[var(--sa-bg-card)] rounded-[var(--sa-radius-md)] border border-[var(--sa-border)] shadow-sm overflow-hidden min-h-[500px]">
        <DataTable
          data={logs as any}
          columns={columns as any}
          loading={loading}
          onRowClick={(row: any) => setSelectedEvent(row as AuditLogEntry)}
          page={page}
          total={totalCount}
          pageSize={50}
          onPageChange={setPage}
        />
      </div>

      {/* Slide Drawer for Full JSON Payload */}
      <SlideDrawer
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title={`Event Log: ${selectedEvent?.id?.slice(0, 12)}...`}
      >
        {selectedEvent && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-[#05291e] pb-4">
              <StatusPill status={
                selectedEvent.severity === 'LOW' ? 'active' :
                selectedEvent.severity === 'MEDIUM' ? 'warning' :
                selectedEvent.severity === 'CRITICAL' ? 'failed' : 'active'
              } />
              <span className="font-mono text-xs font-bold text-[#7a9a8c]">TS: {formatTimestamp(selectedEvent.createdAt)} UTC</span>
            </div>

            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
              <div>
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#7a9a8c] mb-1">Actor (Email)</h4>
                <p className="text-sm font-semibold text-[var(--sa-text-primary)]">{selectedEvent.actorEmail ?? 'system'}</p>
              </div>
              <div>
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#7a9a8c] mb-1">Role</h4>
                <p className="text-[10px] font-mono tracking-wider uppercase bg-[var(--sa-bg-card-alt)] px-2 py-1 rounded-sm text-[#0c6a55] inline-block">{selectedEvent.actorRole}</p>
              </div>
              <div>
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#7a9a8c] mb-1">IP Address</h4>
                <p className="text-sm font-mono text-[var(--sa-text-primary)]">{selectedEvent.ipAddress ?? 'internal'}</p>
              </div>
              <div>
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#7a9a8c] mb-1">Tenant Scope</h4>
                <p className="text-sm text-[var(--sa-text-primary)]">{selectedEvent.tenantName ?? 'Platform Core'}</p>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#7a9a8c] mb-1">Description</h4>
              <p className="text-sm text-[var(--sa-text-secondary)]">{selectedEvent.description}</p>
            </div>

            <div>
              <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#7a9a8c] mb-2 flex items-center gap-2">
                <FileJson size={14} /> Full Raw Payload
              </h4>
              <div className="bg-[#021a13] text-[#f0f4f3] p-4 rounded-[var(--sa-radius-md)] font-mono text-[11px] overflow-auto border border-[#085041] max-h-[400px]" style={{ scrollbarWidth: 'thin' }}>
                <pre>
{JSON.stringify({
  _id: selectedEvent.id,
  timestamp: selectedEvent.createdAt,
  severity: selectedEvent.severity,
  category: selectedEvent.category,
  event_type: selectedEvent.action,
  status: selectedEvent.status,
  actor: {
    email: selectedEvent.actorEmail,
    role: selectedEvent.actorRole,
  },
  target: {
    resource_type: selectedEvent.resourceType,
    resource_id: selectedEvent.resourceId,
  },
  description: selectedEvent.description,
  metadata: selectedEvent.metadata,
}, null, 2)}
                </pre>
              </div>
            </div>

          </div>
        )}
      </SlideDrawer>
    </div>
  );
}
