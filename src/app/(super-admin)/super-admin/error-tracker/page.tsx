'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/super-admin/PageHeader';
import { DataTable } from '@/components/super-admin/DataTable';
import { SlideDrawer } from '@/components/super-admin/SlideDrawer';
import { StatusPill } from '@/components/super-admin/StatusPill';
import { Bug, Search, Filter, Info, CheckCircle2, RefreshCcw } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

interface ErrorEntry {
  id: string;
  severity: string;
  errorType: string;
  message: string;
  tenantName: string | null;
  occurrences: number;
  lastSeenAt: string;
  status: string;
  resolved: boolean;
  stackTrace: string | null;
}

interface ErrorsResponse {
  data: ErrorEntry[];
  meta?: { total: number; page: number; limit: number };
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

export default function ErrorTrackerPage() {
  const [errors, setErrors] = useState<ErrorEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('unresolved');
  const [selectedError, setSelectedError] = useState<ErrorEntry | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchErrors = useCallback(async () => {
    setLoading(true);
    try {
      // Correct endpoint: /platform-admin/errors (not /platform-admin/error-tracking)
      const res = await apiClient.get<ErrorsResponse>('/platform-admin/errors', {
        search: searchTerm || undefined,
        severity: severityFilter || undefined,
        resolved: statusFilter === 'resolved' ? 'true' : statusFilter === 'unresolved' ? 'false' : undefined,
      });
      setErrors(res.data ?? []);
    } catch (err) {
      console.error('Failed to load errors:', err);
      toast.error('Failed to load error data.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, severityFilter, statusFilter]);

  useEffect(() => {
    fetchErrors();
  }, [fetchErrors]);

  const handleMarkResolved = async (error: ErrorEntry) => {
    setActionLoading(true);
    try {
      await apiClient.patch(`/platform-admin/errors/${error.id}`, { resolved: true });
      setErrors(prev => prev.map(e => e.id === error.id ? { ...e, resolved: true, status: 'resolved' } : e));
      if (selectedError?.id === error.id) {
        setSelectedError({ ...selectedError, resolved: true, status: 'resolved' });
      }
      toast.success('Error marked as resolved.', {
        description: 'Audit record created with your Super Admin ID.',
      });
    } catch (err) {
      toast.error('Failed to resolve error. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignToMe = async (error: ErrorEntry) => {
    setActionLoading(true);
    try {
      await apiClient.patch(`/platform-admin/errors/${error.id}`, { notes: 'Assigned to current admin for investigation.' });
      toast.success('Error assigned to you.', {
        description: 'You will be notified of any recurrences.',
      });
    } catch (err) {
      toast.error('Failed to assign error.');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      header: 'Severity',
      accessorKey: 'severity',
      cell: (row: any) => (
        <StatusPill status={row.severity === 'CRITICAL' ? 'failed' : row.severity === 'HIGH' ? 'warning' : row.severity === 'MEDIUM' ? 'warning' : 'info'} />
      ),
    },
    {
      header: 'Error Type',
      accessorKey: 'errorType',
      cell: (row: any) => (
        <div className="font-mono text-xs text-[#0c6a55] font-bold">{row.errorType}</div>
      ),
    },
    {
      header: 'Message',
      accessorKey: 'message',
      cell: (row: any) => (
        <div className="text-[var(--sa-text-primary)] truncate max-w-[250px]">{row.message}</div>
      ),
    },
    {
      header: 'Tenant',
      accessorKey: 'tenantName',
      cell: (row: any) => (
        <div className="text-xs uppercase tracking-widest text-[var(--sa-text-muted)]">{row.tenantName ?? 'Platform'}</div>
      ),
    },
    {
      header: 'Count',
      accessorKey: 'occurrences',
      cell: (row: any) => (
        <div className="font-mono text-sm text-[var(--sa-text-primary)]">{row.occurrences}</div>
      ),
    },
    {
      header: 'Last Seen',
      accessorKey: 'lastSeenAt',
      cell: (row: any) => (
        <div className="font-mono text-xs text-[var(--sa-text-muted)]">{timeAgo(row.lastSeenAt)}</div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: any) => (
        <span className={`text-[10px] px-2 py-0.5 rounded-sm font-mono tracking-wider uppercase font-bold
          ${row.resolved || row.status === 'resolved' ? 'bg-[#D0F0E4] text-[#0f6e56]' :
            row.status === 'unresolved' ? 'bg-[#fee2e2] text-[#b91c1c]' :
            'bg-[#fef9c3] text-[#a16207]'}`}
        >
          {row.resolved ? 'resolved' : (row.status ?? 'unresolved')}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 sa-stagger">
      <PageHeader
        title="Global Error Tracker"
        subtitle="Platform exception monitoring, stack traces, and resolution management."
        icon={Bug}
        breadcrumbs={[
          { label: 'Overview', href: '/super-admin' },
          { label: 'Error Tracker', href: '/super-admin/error-tracker' }
        ]}
        actions={
          <button
            onClick={fetchErrors}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--sa-text-primary)] bg-[var(--sa-bg-card)] border border-[var(--sa-border)] hover:bg-[var(--sa-bg-page)] rounded-full transition-colors sa-btn-hover"
          >
            <RefreshCcw size={14} /> Refresh
          </button>
        }
      />

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-4 bg-[var(--sa-bg-card)] p-4 rounded-[var(--sa-radius-md)] border border-[var(--sa-border)]">
        <div className="relative flex-1 min-w-[250px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search error messages or trace IDs..."
            className="w-full pl-9 pr-4 py-2 bg-[var(--sa-bg-page)] border-none rounded-full text-sm focus:ring-2 focus:ring-[#1D9E75] focus:outline-none placeholder:text-gray-500 font-mono text-[var(--sa-text-primary)]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--sa-text-primary)] bg-[var(--sa-bg-page)] hover:bg-[var(--sa-border)] rounded-full transition-colors border border-[var(--sa-border)] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]"
        >
          <option value="">Severity: All</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--sa-text-primary)] bg-[var(--sa-bg-page)] hover:bg-[var(--sa-border)] rounded-full transition-colors border border-[var(--sa-border)] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]"
        >
          <option value="unresolved">Status: Unresolved</option>
          <option value="resolved">Status: Resolved</option>
          <option value="">Status: All</option>
        </select>
      </div>

      {/* Error Table */}
      <div className="bg-[var(--sa-bg-card)] rounded-[var(--sa-radius-md)] border border-[var(--sa-border)] shadow-sm overflow-hidden">
        <DataTable
          data={errors as any}
          columns={columns as any}
          loading={loading}
          onRowClick={(row: any) => setSelectedError(row as ErrorEntry)}
        />
      </div>

      {/* Slide Drawer for Error Detail */}
      <SlideDrawer
        isOpen={!!selectedError}
        onClose={() => setSelectedError(null)}
        title={selectedError?.errorType || 'Exception Details'}
      >
        {selectedError && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <StatusPill status={selectedError.severity === 'CRITICAL' ? 'failed' : selectedError.severity === 'HIGH' ? 'warning' : 'info'} />
              <span className="font-mono text-xs font-bold text-[#7a9a8c]">ID: {selectedError.id.slice(0, 12)}...</span>
            </div>

            <div>
              <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#7a9a8c] mb-1">Message</h4>
              <p className="text-sm font-semibold text-[var(--sa-text-primary)] border-l-2 border-[#1D9E75] pl-3 py-1 bg-[var(--sa-bg-card-alt)]">
                {selectedError.message}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#7a9a8c] mb-1">Affected Tenant</h4>
                <p className="text-sm text-[var(--sa-text-primary)]">{selectedError.tenantName ?? 'Platform Core'}</p>
              </div>
              <div>
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#7a9a8c] mb-1">Occurrences</h4>
                <p className="text-sm font-mono text-[var(--sa-text-primary)]">{selectedError.occurrences}</p>
              </div>
            </div>

            {selectedError.stackTrace && (
              <div>
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#7a9a8c] mb-2">Stack Trace</h4>
                <div className="bg-[#021a13] text-[#9FE1CB] p-4 rounded-[var(--sa-radius-md)] font-mono text-xs overflow-x-auto border border-[#085041] max-h-[300px]">
                  <pre>{selectedError.stackTrace}</pre>
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-[var(--sa-border)] flex gap-3">
              {!selectedError.resolved ? (
                <button
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1D9E75] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#0f6e56] transition-colors flex-1 justify-center sa-btn-hover disabled:opacity-50"
                  onClick={() => handleMarkResolved(selectedError)}
                  disabled={actionLoading}
                >
                  <CheckCircle2 size={16} /> Mark Resolved
                </button>
              ) : (
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D0F0E4] text-[#0f6e56] text-xs font-bold uppercase tracking-wider flex-1 justify-center">
                  <CheckCircle2 size={16} /> Resolved
                </div>
              )}
              <button
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[var(--sa-border)] bg-transparent text-[var(--sa-text-primary)] text-xs font-bold uppercase tracking-wider hover:bg-[var(--sa-bg-card-alt)] transition-colors flex-1 justify-center sa-btn-hover disabled:opacity-50"
                onClick={() => handleAssignToMe(selectedError)}
                disabled={actionLoading}
              >
                <Info size={16} /> Assign to me
              </button>
            </div>
          </div>
        )}
      </SlideDrawer>
    </div>
  );
}
