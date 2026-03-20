'use client';

import { toast } from 'sonner';
import { PageHeader } from '@/components/super-admin/PageHeader';
import { StatCard } from '@/components/super-admin/StatCard';
import { DataTable } from '@/components/super-admin/DataTable';
import { Server, Play, Clock, CheckCircle2, AlertTriangle, XCircle, RotateCcw, Trash2, ListOrdered, Calendar } from 'lucide-react';

const mockJobs = [
  { id: 'job_442', name: 'NIC Sync Webhook', tenant: 'Vanguard Insurance', status: 'queued', priority: 'high', enqueued: '2m ago', duration: '-', attempts: 0 },
  { id: 'job_441', name: 'Process Policy Renewals', tenant: 'Platform Core', status: 'processing', priority: 'critical', enqueued: '5m ago', duration: '3m 12s', attempts: 1 },
  { id: 'job_440', name: 'Daily Backup Sync', tenant: 'Platform Core', status: 'completed', priority: 'normal', enqueued: '1h ago', duration: '45s', attempts: 1 },
  { id: 'job_439', name: 'Generate Revenue Report', tenant: 'System', status: 'failed', priority: 'low', enqueued: '3h ago', duration: '12s', attempts: 3 },
  { id: 'job_438', name: 'Email Broker Dispatch', tenant: 'Apex Secure Solutions', status: 'retrying', priority: 'high', enqueued: '12h ago', duration: '-', attempts: 4 },
];

export default function BackgroundJobsPage() {
  const columns = [
    {
      header: 'Job ID / Name',
      accessorKey: 'name',
      cell: (row: typeof mockJobs[0]) => (
        <div>
          <div className="font-bold text-gray-900">{row.name}</div>
          <div className="text-[10px] text-gray-500 font-mono tracking-widest mt-0.5">{row.id}</div>
        </div>
      ),
    },
    {
      header: 'Tenant Scope',
      accessorKey: 'tenant',
      cell: (row: typeof mockJobs[0]) => (
        <span className="text-xs text-gray-600">{row.tenant}</span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: typeof mockJobs[0]) => (
        <span className={`flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full font-mono tracking-wider uppercase font-bold w-fit
          ${row.status === 'queued' ? 'bg-[#e0f2fe] text-[#0284c7]' : 
            row.status === 'processing' ? 'bg-[#fef9c3] text-[#ca8a04]' : 
            row.status === 'completed' ? 'bg-[#D0F0E4] text-[#0f6e56]' : 
            row.status === 'retrying' ? 'bg-[#ffedd5] text-[#c2410c]' : 
            'bg-[#fee2e2] text-[#b91c1c]'}`}
        >
          {row.status === 'processing' && <div className="w-1.5 h-1.5 rounded-full bg-[#ca8a04] animate-pulse" />}
          {row.status}
        </span>
      ),
    },
    {
      header: 'Priority',
      accessorKey: 'priority',
      cell: (row: typeof mockJobs[0]) => (
        <span className={`text-[10px] uppercase font-bold tracking-wider ${row.priority === 'critical' ? 'text-[#b91c1c]' : row.priority === 'high' ? 'text-[#ca8a04]' : 'text-gray-500'}`}>
          {row.priority}
        </span>
      ),
    },
    {
      header: 'Enqueued',
      accessorKey: 'enqueued',
      cell: (row: typeof mockJobs[0]) => (
        <span className="font-mono text-xs text-gray-500">{row.enqueued}</span>
      ),
    },
    {
      header: 'Duration',
      accessorKey: 'duration',
      cell: (row: typeof mockJobs[0]) => (
        <span className="font-mono text-xs">{row.duration}</span>
      ),
    },
    {
      header: 'Attempts',
      accessorKey: 'attempts',
      cell: (row: typeof mockJobs[0]) => (
        <span className="font-mono text-xs">{row.attempts}</span>
      ),
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      cell: (row: typeof mockJobs[0]) => (
        <div className="flex gap-2">
          {row.status === 'failed' && (
            <button 
              onClick={(e) => { e.stopPropagation(); toast.success(`Retrying ${row.name}`); }}
              className="p-1.5 text-[#b91c1c] hover:bg-[#fee2e2] rounded-full transition-colors sa-btn-hover" title="View Error & Retry">
              <RotateCcw size={16} />
            </button>
          )}
          {row.status === 'queued' && (
            <button 
              onClick={(e) => { e.stopPropagation(); toast.success(`${row.name} prioritized`); }}
              className="p-1.5 text-[#1D9E75] hover:bg-[#D0F0E4] rounded-full transition-colors sa-btn-hover" title="Prioritize">
              <Play size={16} />
            </button>
          )}
          <button 
            onClick={(e) => { e.stopPropagation(); toast.error(`${row.name} discarded`); }}
            className="p-1.5 text-gray-400 hover:text-[#b91c1c] hover:bg-[#fee2e2] rounded-full transition-colors sa-btn-hover" title="Discard Job">
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
        subtitle="Orchestration queue for Redis workers assessing policy processing and tasks."
        icon={Server}
        breadcrumbs={[
          { label: 'Overview', href: '/super-admin' },
          { label: 'Background Jobs', href: '/super-admin/jobs' }
        ]}
        actions={
          <div className="flex gap-2">
            <button 
              onClick={() => toast.info('Job scheduling interface open')}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--sa-text-primary)] bg-[var(--sa-bg-card)] border border-[var(--sa-border)] hover:bg-[var(--sa-bg-page)] rounded-full transition-colors sa-btn-hover">
              <Calendar size={14} /> View Schedule
            </button>
            <button 
              onClick={() => toast.success('Retrying all 12 failed jobs across workers.')}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#b91c1c] hover:bg-[#9f1239] rounded-full transition-colors sa-btn-hover">
              <RotateCcw size={14} /> Retry All Failed
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Queued Jobs" value={14} icon={ListOrdered} iconColor="#0284c7" onClick={() => toast.info('Queued metrics active')} />
        <StatCard label="Processing" value={3} icon={Play} iconColor="#ca8a04" onClick={() => toast.info('Processing job metrics active')} />
        <StatCard label="Completed (24h)" value={4251} icon={CheckCircle2} iconColor="#1d9e75" onClick={() => toast.info('Showing successful telemetry')} />
        <StatCard label="Failed (24h)" value={12} icon={XCircle} iconColor="#b91c1c" onClick={() => toast.error('Showing failed queues first')} />
        <StatCard label="Avg Duration" value={45} suffix="s" icon={Clock} iconColor="#7a9a8c" onClick={() => toast.info('Average processing times metrics')} />
      </div>

      <div className="bg-white rounded-[var(--sa-radius-md)] border border-[#d4e0dc] shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        <div className="p-4 border-b border-[#d4e0dc] flex items-center justify-between">
          <ul className="flex items-center gap-6 text-sm">
            <li className="font-bold text-[#0c6a55] border-b-2 border-[#1D9E75] pb-2 cursor-pointer sa-btn-hover uppercase tracking-widest text-[10px]">Active Queues</li>
            <li className="font-bold text-gray-500 hover:text-gray-900 border-b-2 border-transparent pb-2 cursor-pointer sa-btn-hover uppercase tracking-widest text-[10px]">Completed</li>
            <li className="font-bold text-gray-500 hover:text-gray-900 border-b-2 border-transparent pb-2 cursor-pointer sa-btn-hover uppercase tracking-widest text-[10px]">Dead Letters</li>
          </ul>
        </div>
        
        <DataTable
          data={mockJobs}
          columns={columns}
          onRowClick={(row) => toast.info(`Viewing job trace for ${row.name}`)}
        />
        
        <div className="p-4 border-t border-[#d4e0dc] bg-[#f8faf9] flex items-center justify-between text-xs text-gray-500 font-mono">
          <span>Worker instances: 4/4 online</span>
          <div className="flex items-center gap-2 text-[#b91c1c] font-bold uppercase tracking-wide">
            <AlertTriangle size={14} /> 12 Failing Jobs Detected
          </div>
        </div>
      </div>
    </div>
  );
}
