'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/super-admin/PageHeader';
import { DataTable } from '@/components/super-admin/DataTable';
import { SlideDrawer } from '@/components/super-admin/SlideDrawer';
import { StatusPill } from '@/components/super-admin/StatusPill';
import { Clock, Search, Filter, Download, FileJson } from 'lucide-react';

const mockLogs = [
  { id: 'evt_99182', ts: '2026-03-19 14:22:01', severity: 'info', category: 'auth', actor: 'ksarsah@ibms.com', role: 'PLATFORM_SUPER_ADMIN', tenant: 'Platform Core', action: 'super_admin.login', resource: 'session', ip: '192.168.1.44', status: 'success' },
  { id: 'evt_99181', ts: '2026-03-19 14:15:33', severity: 'warning', category: 'billing', actor: 'system', role: 'SYSTEM', tenant: 'Apex Secure Solutions', action: 'invoice.payment_failed', resource: 'inv_A4B2', ip: 'internal', status: 'failed' },
  { id: 'evt_99180', ts: '2026-03-19 13:45:10', severity: 'info', category: 'tenant', actor: 'ksarsah@ibms.com', role: 'PLATFORM_SUPER_ADMIN', tenant: 'Platform Core', action: 'tenant.provisioning', resource: 'ten_Vanguard', ip: '192.168.1.44', status: 'success' },
  { id: 'evt_99179', ts: '2026-03-19 11:10:05', severity: 'critical', category: 'security', actor: 'jdoe@vanguard.com', role: 'TENANT_ADMIN', tenant: 'Vanguard Insurance', action: 'policy.bulk_export', resource: 'export_77', ip: '41.215.170.1', status: 'success' },
  { id: 'evt_99178', ts: '2026-03-19 09:05:22', severity: 'info', category: 'system', actor: 'system', role: 'SYSTEM', tenant: 'Platform Core', action: 'job.compliance_check', resource: 'job_441', ip: 'internal', status: 'success' },
];

export default function AuditLogsPage() {
  const [selectedEvent, setSelectedEvent] = useState<typeof mockLogs[0] | null>(null);

  const columns = [
    {
      header: 'Timestamp (UTC)',
      accessorKey: 'ts',
      cell: (row: typeof mockLogs[0]) => (
        <span className="font-mono text-[10px] text-[#0c6a55]">{row.ts}</span>
      ),
    },
    {
      header: 'Severity',
      accessorKey: 'severity',
      cell: (row: typeof mockLogs[0]) => (
        <StatusPill status={row.severity === 'info' ? 'active' : row.severity === 'warning' ? 'warning' : 'failed'} />
      ),
    },
    {
      header: 'Actor & Role',
      accessorKey: 'actor',
      cell: (row: typeof mockLogs[0]) => (
        <div className="flex flex-col">
          <span className="text-xs font-bold text-gray-900">{row.actor}</span>
          <span className="text-[9px] font-mono tracking-wider uppercase text-gray-500">{row.role}</span>
        </div>
      ),
    },
    {
      header: 'Tenant Scope',
      accessorKey: 'tenant',
      cell: (row: typeof mockLogs[0]) => (
        <span className="text-xs text-gray-600">{row.tenant}</span>
      ),
    },
    {
      header: 'Action / Event Type',
      accessorKey: 'action',
      cell: (row: typeof mockLogs[0]) => (
        <span className="font-mono text-xs text-[#1D9E75] font-bold">{row.action}</span>
      ),
    },
    {
      header: 'Target',
      accessorKey: 'resource',
      cell: (row: typeof mockLogs[0]) => (
        <span className="font-mono text-[10px] text-gray-500">{row.resource}</span>
      ),
    },
    {
      header: 'Details',
      accessorKey: 'id',
      cell: () => (
        <button className="text-[10px] font-bold uppercase tracking-wider text-[#1D9E75] hover:text-[#0c6a55] transition-colors sa-btn-hover hover:underline flex items-center gap-1">
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
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#021a13] bg-white border border-[#d4e0dc] hover:bg-[#f0f4f3] rounded-sm transition-colors sa-btn-hover">
            <Download size={14} /> Export CSV
          </button>
        }
      />

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-sm border border-[#d4e0dc]">
        <div className="relative flex-1 min-w-[250px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by action, email, IP address, or trace ID..." 
            className="w-full pl-9 pr-4 py-2 bg-[#f0f4f3] border-none rounded-sm text-sm focus:ring-2 focus:ring-[#1D9E75] focus:outline-none placeholder:text-gray-500 font-mono"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#021a13] bg-[#f0f4f3] hover:bg-[#d4e0dc] rounded-sm transition-colors sa-btn-hover">
          <Filter size={14} /> Severity
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#021a13] bg-[#f0f4f3] hover:bg-[#d4e0dc] rounded-sm transition-colors sa-btn-hover">
          <Filter size={14} /> Category
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#021a13] bg-[#f0f4f3] hover:bg-[#d4e0dc] rounded-sm transition-colors sa-btn-hover">
          <Filter size={14} /> 24 Hours
        </button>
      </div>

      {/* Auto Refresh Toggle Banner */}
      <div className="p-3 bg-[#e0f2fe] border border-[#bae6fd] rounded-sm flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 text-[#0369a1]">
          <div className="w-2 h-2 rounded-full bg-[#0ea5e9] animate-pulse" />
          Live tailing active... 2 new events received since page load.
        </div>
        <button className="text-[#0369a1] font-bold uppercase tracking-widest hover:underline sa-btn-hover">
          Load New Events
        </button>
      </div>

      {/* Audit Table */}
      <div className="bg-white rounded-sm border border-[#d4e0dc] shadow-sm overflow-hidden min-h-[500px]">
        <DataTable
          data={mockLogs}
          columns={columns}
          onRowClick={(row) => setSelectedEvent(row)}
        />
        
        <div className="p-4 border-t border-[#d4e0dc] bg-[#f8faf9] flex items-center justify-between text-xs text-gray-500 font-mono">
          <span>Showing 1-50 of 99,182 entries</span>
          <div className="flex gap-4">
            <button className="hover:text-[#0c6a55] sa-btn-hover disabled:opacity-50">← Prev</button>
            <button className="hover:text-[#0c6a55] sa-btn-hover hover:underline">Next →</button>
          </div>
        </div>
      </div>

      {/* Slide Drawer for Full JSON Payload */}
      <SlideDrawer
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title={`Event Log: ${selectedEvent?.id}`}
      >
        {selectedEvent && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-[#05291e] pb-4">
              <StatusPill status={selectedEvent.severity === 'info' ? 'active' : selectedEvent.severity === 'warning' ? 'warning' : 'failed'} />
              <span className="font-mono text-xs font-bold text-[#7a9a8c]">TS: {selectedEvent.ts} UTC</span>
            </div>

            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
              <div>
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#7a9a8c] mb-1">Actor (Email)</h4>
                <p className="text-sm font-semibold text-gray-900">{selectedEvent.actor}</p>
              </div>
              <div>
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#7a9a8c] mb-1">Role</h4>
                <p className="text-[10px] font-mono tracking-wider uppercase bg-[#f0f4f3] px-2 py-1 rounded-sm text-[#0c6a55] inline-block">{selectedEvent.role}</p>
              </div>
              <div>
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#7a9a8c] mb-1">IP Address</h4>
                <p className="text-sm font-mono text-gray-900">{selectedEvent.ip}</p>
              </div>
              <div>
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#7a9a8c] mb-1">Tenant Scope</h4>
                <p className="text-sm text-gray-900">{selectedEvent.tenant}</p>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#7a9a8c] mb-2 flex items-center gap-2">
                <FileJson size={14} /> Full Raw Payload
              </h4>
              <div className="bg-[#021a13] text-[#f0f4f3] p-4 rounded-sm font-mono text-[11px] overflow-auto border border-[#085041] max-h-[400px]" style={{ scrollbarWidth: 'thin' }}>
                <pre>
{JSON.stringify({
  _id: selectedEvent.id,
  timestamp: selectedEvent.ts,
  severity: selectedEvent.severity,
  category: selectedEvent.category,
  event_type: selectedEvent.action,
  status: selectedEvent.status,
  actor: {
    id: "usr_8239A",
    email: selectedEvent.actor,
    role: selectedEvent.role,
    tenant_id: selectedEvent.tenant === "Platform Core" ? "SYS_00" : "TEN_01"
  },
  request: {
    ip: selectedEvent.ip,
    user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/100.0",
    endpoint: `/api/v1/${selectedEvent.category}/${selectedEvent.action.split('.')[1] || 'action'}`
  },
  target: {
    resource_type: selectedEvent.resource,
    resource_id: '1284A-FC44',
  },
  diff: selectedEvent.action.includes('login') ? null : {
    before: { state: 'unpaid' },
    after: { state: 'failed', reason: 'insufficient_funds' }
  }
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
