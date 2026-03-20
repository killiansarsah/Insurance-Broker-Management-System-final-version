'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/super-admin/PageHeader';
import { StatCard } from '@/components/super-admin/StatCard';
import { DataTable } from '@/components/super-admin/DataTable';
import { Server, Play, Clock, CheckCircle2, AlertTriangle, XCircle, RotateCcw, Trash2, ListOrdered, Calendar } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface JobRow {
  id: string;
  jobName: string;
  status: string;
  priority: string;
  enqueuedAt: string;
  startedAt: string | null;
  completedAt: string | null;
  duration: number | null;
  attempts: number;
  maxAttempts: number;
  errorMessage: string | null;
  tenant: { name: string } | null;
}

interface JobsResponse {
  data: JobRow[];
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

function formatDuration(ms: number | null): string {
  if (!ms) return '—';
  if (ms < 1000) return `${ms}ms`;
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const remainS = s % 60;
  return `${m}m ${remainS}s`;
}

export default function BackgroundJobsPage() {
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<JobsResponse>('/platform-admin/jobs', { page, limit: 50 });
      setJobs(res.data ?? []);
      if (res.meta) setTotalCount(res.meta.total);
    } catch (err) {
      console.error('Failed to load jobs:', err);
      toast.error('Failed to load background jobs.');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleRetry = async (job: JobRow) => {
    try {
      await apiClient.post(`/platform-admin/jobs/${job.id}/retry`, {});
      toast.success(`Retrying ${job.jobName}`);
      fetchJobs();
    } catch (err) {
      toast.error(`Failed to retry ${job.jobName}`);
    }
  };

  const handleDiscard = async (job: JobRow) => {
    try {
      await apiClient.delete(`/platform-admin/jobs/${job.id}/discard`);
      toast.success(`${job.jobName} discarded`);
      setJobs(prev => prev.filter(j => j.id !== job.id));
    } catch (err) {
      toast.error(`Failed to discard ${job.jobName}`);
    }
  };

  const handleRetryAll = async () => {
    const failedJobs = jobs.filter(j => j.status === 'FAILED');
    if (failedJobs.length === 0) { toast.info('No failed jobs to retry.'); return; }
    let retried = 0;
    for (const job of failedJobs) {
      try { await apiClient.post(`/platform-admin/jobs/${job.id}/retry`, {}); retried++; } catch {}
    }
    toast.success(`Retried ${retried} failed job(s).`);
    fetchJobs();
  };

  const queuedCount = jobs.filter(j => j.status === 'QUEUED').length;
  const processingCount = jobs.filter(j => j.status === 'PROCESSING').length;
  const completedCount = jobs.filter(j => j.status === 'COMPLETED').length;
  const failedCount = jobs.filter(j => j.status === 'FAILED').length;

  const columns = [
    {
      header: 'Job ID / Name',
      accessorKey: 'jobName',
      cell: (row: any) => (
        <div>
          <div className="font-bold text-[var(--sa-text-primary)]">{row.jobName}</div>
          <div className="text-[10px] text-[var(--sa-text-muted)] font-mono tracking-widest mt-0.5">{row.id?.slice(0, 12)}...</div>
        </div>
      ),
    },
    {
      header: 'Tenant Scope',
      accessorKey: 'tenant',
      cell: (row: any) => (
        <span className="text-xs text-[var(--sa-text-secondary)]">{row.tenant?.name ?? 'Platform Core'}</span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: any) => (
        <span className={`flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full font-mono tracking-wider uppercase font-bold w-fit
          ${row.status === 'QUEUED' ? 'bg-[#e0f2fe] text-[#0284c7]' : 
            row.status === 'PROCESSING' ? 'bg-[#fef9c3] text-[#ca8a04]' : 
            row.status === 'COMPLETED' ? 'bg-[#D0F0E4] text-[#0f6e56]' : 
            row.status === 'RETRYING' ? 'bg-[#ffedd5] text-[#c2410c]' : 
            'bg-[#fee2e2] text-[#b91c1c]'}`}
        >
          {row.status === 'PROCESSING' && <div className="w-1.5 h-1.5 rounded-full bg-[#ca8a04] animate-pulse" />}
          {row.status}
        </span>
      ),
    },
    {
      header: 'Priority',
      accessorKey: 'priority',
      cell: (row: any) => (
        <span className={`text-[10px] uppercase font-bold tracking-wider ${row.priority === 'CRITICAL' ? 'text-[#b91c1c]' : row.priority === 'HIGH' ? 'text-[#ca8a04]' : 'text-[var(--sa-text-muted)]'}`}>
          {row.priority}
        </span>
      ),
    },
    {
      header: 'Enqueued',
      accessorKey: 'enqueuedAt',
      cell: (row: any) => (
        <span className="font-mono text-xs text-[var(--sa-text-muted)]">{timeAgo(row.enqueuedAt)}</span>
      ),
    },
    {
      header: 'Duration',
      accessorKey: 'duration',
      cell: (row: any) => (
        <span className="font-mono text-xs text-[var(--sa-text-primary)]">{formatDuration(row.duration)}</span>
      ),
    },
    {
      header: 'Attempts',
      accessorKey: 'attempts',
      cell: (row: any) => (
        <span className="font-mono text-xs text-[var(--sa-text-primary)]">{row.attempts}/{row.maxAttempts ?? 3}</span>
      ),
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      cell: (row: any) => (
        <div className="flex gap-2">
          {row.status === 'FAILED' && (
            <button 
              onClick={(e) => { e.stopPropagation(); handleRetry(row); }}
              className="p-1.5 text-[#b91c1c] hover:bg-[#fee2e2] rounded-full transition-colors sa-btn-hover" title="Retry">
              <RotateCcw size={16} />
            </button>
          )}
          {row.status === 'QUEUED' && (
            <button 
              onClick={(e) => { e.stopPropagation(); toast.info(`${row.jobName} prioritized`); }}
              className="p-1.5 text-[#1D9E75] hover:bg-[#D0F0E4] rounded-full transition-colors sa-btn-hover" title="Prioritize">
              <Play size={16} />
            </button>
          )}
          <button 
            onClick={(e) => { e.stopPropagation(); handleDiscard(row); }}
            className="p-1.5 text-[var(--sa-text-muted)] hover:text-[#b91c1c] hover:bg-[#fee2e2] rounded-full transition-colors sa-btn-hover" title="Discard Job">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 sa-stagger">
      <PageHeader
        title="Background Jobs & Queues"
        subtitle="Orchestration queue for workers processing policies, renewals, and system tasks."
        icon={Server}
        breadcrumbs={[
          { label: 'Overview', href: '/super-admin' },
          { label: 'Background Jobs', href: '/super-admin/jobs' }
        ]}
        actions={
          <div className="flex gap-2">
            <button 
              onClick={() => toast.info('Job scheduling interface coming soon.')}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--sa-text-primary)] bg-[var(--sa-bg-card)] border border-[var(--sa-border)] hover:bg-[var(--sa-bg-page)] rounded-full transition-colors sa-btn-hover">
              <Calendar size={14} /> View Schedule
            </button>
            <button 
              onClick={handleRetryAll}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#b91c1c] hover:bg-[#9f1239] rounded-full transition-colors sa-btn-hover">
              <RotateCcw size={14} /> Retry All Failed
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Queued Jobs" value={queuedCount} icon={ListOrdered} iconColor="#0284c7" loading={loading} />
        <StatCard label="Processing" value={processingCount} icon={Play} iconColor="#ca8a04" loading={loading} />
        <StatCard label="Completed (total)" value={completedCount} icon={CheckCircle2} iconColor="#1d9e75" loading={loading} />
        <StatCard label="Failed" value={failedCount} icon={XCircle} iconColor="#b91c1c" loading={loading} />
        <StatCard label="Total Logged" value={totalCount} icon={Clock} iconColor="#7a9a8c" loading={loading} />
      </div>

      <div className="bg-[var(--sa-bg-card)] rounded-[var(--sa-radius-md)] border border-[var(--sa-border)] shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        <DataTable
          data={jobs as any}
          columns={columns as any}
          loading={loading}
          onRowClick={(row: any) => row.errorMessage ? toast.error(row.errorMessage) : toast.info(`Viewing job trace for ${row.jobName}`)}
          page={page}
          total={totalCount}
          pageSize={50}
          onPageChange={setPage}
        />
        
        <div className="p-4 border-t border-[var(--sa-border)] bg-[var(--sa-bg-card-alt)] flex items-center justify-between text-xs text-[var(--sa-text-muted)] font-mono">
          <span>{totalCount} total jobs indexed</span>
          {failedCount > 0 && (
            <div className="flex items-center gap-2 text-[#b91c1c] font-bold uppercase tracking-wide">
              <AlertTriangle size={14} /> {failedCount} Failing Job(s) Detected
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
