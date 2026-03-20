'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/super-admin/PageHeader';
import { DataTable } from '@/components/super-admin/DataTable';
import { SlideDrawer } from '@/components/super-admin/SlideDrawer';
import { StatusPill } from '@/components/super-admin/StatusPill';
import { Bug, Search, Filter, ShieldAlert, Clock, Info, CheckCircle2 } from 'lucide-react';

const mockErrors = [
  { id: 'err_101', severity: 'critical', type: 'DatabaseError', message: 'Connection timeout acquiring lock', tenant: 'Platform Core', occurrences: 45, lastSeen: '2m ago', status: 'unresolved' },
  { id: 'err_102', severity: 'warning', type: 'NICGatewayError', message: 'Rate limit exceeded on sticker endpoint', tenant: 'Vanguard Insurance', occurrences: 12, lastSeen: '15m ago', status: 'investigating' },
  { id: 'err_103', severity: 'info', type: 'AuthException', message: 'Invalid JWT signature detected', tenant: 'Horizon Brokers', occurrences: 3, lastSeen: '1h ago', status: 'resolved' },
  { id: 'err_104', severity: 'critical', type: 'PaymentGatewayException', message: 'Webhook signature verification failed', tenant: 'Apex Secure', occurrences: 1, lastSeen: '3h ago', status: 'unresolved' },
  { id: 'err_105', severity: 'warning', type: 'StorageQuotaExeption', message: 'Tenant storage exceeding 90% soft limit', tenant: 'Sterling Risk Mgmt', occurrences: 28, lastSeen: '5h ago', status: 'investigating' },
];

export default function ErrorTrackerPage() {
  const [selectedError, setSelectedError] = useState<typeof mockErrors[0] | null>(null);

  const columns = [
    {
      header: 'Severity',
      accessorKey: 'severity',
      cell: (row: typeof mockErrors[0]) => (
        <StatusPill status={row.severity === 'critical' ? 'failed' : row.severity === 'warning' ? 'warning' : 'info'} />
      ),
    },
    {
      header: 'Error Type',
      accessorKey: 'type',
      cell: (row: typeof mockErrors[0]) => (
        <div className="font-mono text-xs text-[#0c6a55] font-bold">{row.type}</div>
      ),
    },
    {
      header: 'Message',
      accessorKey: 'message',
      cell: (row: typeof mockErrors[0]) => (
        <div className="text-gray-900 truncate max-w-[250px]">{row.message}</div>
      ),
    },
    {
      header: 'Tenant',
      accessorKey: 'tenant',
      cell: (row: typeof mockErrors[0]) => (
        <div className="text-xs uppercase tracking-widest text-[#7a9a8c]">{row.tenant}</div>
      ),
    },
    {
      header: 'Count',
      accessorKey: 'occurrences',
      cell: (row: typeof mockErrors[0]) => (
        <div className="font-mono text-sm">{row.occurrences}</div>
      ),
    },
    {
      header: 'Last Seen',
      accessorKey: 'lastSeen',
      cell: (row: typeof mockErrors[0]) => (
        <div className="font-mono text-xs text-gray-500">{row.lastSeen}</div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: typeof mockErrors[0]) => (
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
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-sm border border-[#d4e0dc]">
        <div className="relative flex-1 min-w-[250px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search error messages or trace IDs..." 
            className="w-full pl-9 pr-4 py-2 bg-[#f0f4f3] border-none rounded-sm text-sm focus:ring-2 focus:ring-[#1D9E75] focus:outline-none placeholder:text-gray-500 font-mono"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#021a13] bg-[#f0f4f3] hover:bg-[#d4e0dc] rounded-sm transition-colors sa-btn-hover">
          <Filter size={14} /> Severity: All
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#021a13] bg-[#f0f4f3] hover:bg-[#d4e0dc] rounded-sm transition-colors sa-btn-hover">
          <Filter size={14} /> Status: Unresolved
        </button>
      </div>

      {/* Error Table */}
      <div className="bg-white rounded-sm border border-[#d4e0dc] shadow-sm overflow-hidden">
        <DataTable
          data={mockErrors}
          columns={columns}
          onRowClick={(row) => setSelectedError(row)}
        />
      </div>

      {/* Slide Drawer for Error Detail */}
      <SlideDrawer
        isOpen={!!selectedError}
        onClose={() => setSelectedError(null)}
        title={selectedError?.type || 'Exception Details'}
      >
        {selectedError && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <StatusPill status={selectedError.severity === 'critical' ? 'failed' : selectedError.severity === 'warning' ? 'warning' : 'info'} />
              <span className="font-mono text-xs font-bold text-[#7a9a8c]">ID: {selectedError.id}</span>
            </div>
            
            <div>
              <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#7a9a8c] mb-1">Message</h4>
              <p className="text-sm font-semibold text-gray-900 border-l-2 border-[#1D9E75] pl-3 py-1 bg-[#f0f4f3]">
                {selectedError.message}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#7a9a8c] mb-1">Affected Tenant</h4>
                <p className="text-sm text-gray-900">{selectedError.tenant}</p>
              </div>
              <div>
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#7a9a8c] mb-1">Occurrences</h4>
                <p className="text-sm font-mono text-gray-900">{selectedError.occurrences}</p>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#7a9a8c] mb-2">Stack Trace Preview</h4>
              <div className="bg-[#021a13] text-[#9FE1CB] p-4 rounded-sm font-mono text-xs overflow-x-auto border border-[#085041]">
                {`Exception in thread "main" java.lang.RuntimeException: ${selectedError.message}
    at com.ibms.core.Database.acquireLock(Database.java:142)
    at com.ibms.core.Transaction.begin(Transaction.java:89)
    at com.ibms.api.endpoints.PolicyController.create(PolicyController.java:56)
    ... 14 more`}
              </div>
            </div>

            <div className="pt-6 border-t border-[#d4e0dc] flex gap-3">
              <button 
                className="flex items-center gap-2 px-5 py-2.5 rounded-sm bg-[#1D9E75] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#0f6e56] transition-colors flex-1 justify-center sa-btn-hover"
                onClick={() => setSelectedError({ ...selectedError, status: 'resolved' })}
              >
                <CheckCircle2 size={16} /> Mark Resolved
              </button>
              <button 
                className="flex items-center gap-2 px-5 py-2.5 rounded-sm border border-[#085041] bg-transparent text-[#021a13] text-xs font-bold uppercase tracking-wider hover:bg-[#f0f4f3] transition-colors flex-1 justify-center sa-btn-hover"
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
