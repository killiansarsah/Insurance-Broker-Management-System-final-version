'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/super-admin/PageHeader';
import { DataTable } from '@/components/super-admin/DataTable';
import { SlideDrawer } from '@/components/super-admin/SlideDrawer';
import { StatusPill } from '@/components/super-admin/StatusPill';
import { Bug, Search, Filter, Info, CheckCircle2 } from 'lucide-react';
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
  const [selectedError, setSelectedError] = useState<ErrorEntry | null>(null);

  const fetchErrors = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<ErrorsResponse>('/platform-admin/error-tracking', {
        search: searchTerm || undefined,
      });
      setErrors(res.data ?? []);
    } catch (err) {
      console.error('Failed to load errors:', err);
      toast.error('Failed to load error data.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchErrors();
  }, [fetchErrors]);

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
          ${row.status === 'unresolved' ? 'bg-[#fee2e2] text-[#b91c1c]' : 
            row.status === 'resolved' ? 'bg-[#D0F0E4] text-[#0f6e56]' : 
            'bg-[#fef9c3] text-[#a16207]'}`}
        >
          {row.status}
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
        <button 
          onClick={() => toast.info('Severity filter coming soon.')}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--sa-text-primary)] bg-[var(--sa-bg-page)] hover:bg-[var(--sa-border)] rounded-full transition-colors sa-btn-hover">
          <Filter size={14} /> Severity: All
        </button>
        <button 
          onClick={() => toast.info('Status filter coming soon.')}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--sa-text-primary)] bg-[var(--sa-bg-page)] hover:bg-[var(--sa-border)] rounded-full transition-colors sa-btn-hover">
          <Filter size={14} /> Status: Unresolved
        </button>
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
              <button 
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1D9E75] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#0f6e56] transition-colors flex-1 justify-center sa-btn-hover"
                onClick={() => {
                  setSelectedError({ ...selectedError, status: 'resolved' });
                  toast.success('Error marked as resolved.');
                }}
              >
                <CheckCircle2 size={16} /> Mark Resolved
              </button>
              <button 
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[var(--sa-border)] bg-transparent text-[var(--sa-text-primary)] text-xs font-bold uppercase tracking-wider hover:bg-[var(--sa-bg-card-alt)] transition-colors flex-1 justify-center sa-btn-hover"
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
