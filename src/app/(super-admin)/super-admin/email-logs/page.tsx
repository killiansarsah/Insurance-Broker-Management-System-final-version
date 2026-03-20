'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/super-admin/PageHeader';
import { StatCard } from '@/components/super-admin/StatCard';
import { DataTable } from '@/components/super-admin/DataTable';
import { SlideDrawer } from '@/components/super-admin/SlideDrawer';
import { StatusPill } from '@/components/super-admin/StatusPill';
import { Mail, CheckCircle2, AlertTriangle, XCircle, Search, Filter, RotateCcw, MonitorPlay } from 'lucide-react';

const mockEmails = [
  { id: 'msg_94a2b', sentAt: '2026-03-19 14:22', template: 'Policy Renewal Notice', recipient: 'client@example.com', tenant: 'Vanguard Insurance', subject: 'Your policy expires in 30 days', status: 'delivered', provider: 'resend_wk3' },
  { id: 'msg_94a2c', sentAt: '2026-03-19 14:05', template: 'Admin Invite', recipient: 'newadmin@horizon.com', tenant: 'Horizon Brokers', subject: 'Invitation to IBMS Platform', status: 'bounced', provider: 'resend_mx4' },
  { id: 'msg_94a2d', sentAt: '2026-03-19 13:50', template: 'Payment Receipt', recipient: 'finance@apex.com', tenant: 'Apex Secure', subject: 'Receipt #INV-29402', status: 'delivered', provider: 'resend_bk7' },
  { id: 'msg_94a2e', sentAt: '2026-03-19 11:30', template: 'Weekly Digest', recipient: 'team@vanguard.com', tenant: 'Vanguard Insurance', subject: 'Your IBMS Weekly Summary', status: 'spam', provider: 'resend_wk3' },
  { id: 'msg_94a2f', sentAt: '2026-03-19 09:12', template: 'Password Reset', recipient: 'user@meridian.com', tenant: 'Meridian Capital', subject: 'Action Required: Reset Password', status: 'sent', provider: 'resend_px2' },
];

export default function EmailLogsPage() {
  const [selectedEmail, setSelectedEmail] = useState<typeof mockEmails[0] | null>(null);

  const columns = [
    {
      header: 'Timestamp',
      accessorKey: 'sentAt',
      cell: (row: typeof mockEmails[0]) => (
        <span className="font-mono text-xs text-gray-500">{row.sentAt}</span>
      ),
    },
    {
      header: 'Recipient',
      accessorKey: 'recipient',
      cell: (row: typeof mockEmails[0]) => (
        <span className="font-bold text-gray-900">{row.recipient}</span>
      ),
    },
    {
      header: 'Tenant Context',
      accessorKey: 'tenant',
      cell: (row: typeof mockEmails[0]) => (
        <span className="text-xs text-gray-600">{row.tenant}</span>
      ),
    },
    {
      header: 'Template / Subject',
      accessorKey: 'subject',
      cell: (row: typeof mockEmails[0]) => (
        <div className="flex flex-col">
          <span className="text-xs font-bold text-[#0c6a55]">{row.template}</span>
          <span className="text-xs text-gray-500 truncate max-w-[200px]">{row.subject}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: typeof mockEmails[0]) => (
        <span className={`text-[10px] px-2 py-0.5 rounded-sm font-mono tracking-wider uppercase font-bold
          ${row.status === 'delivered' ? 'bg-[#D0F0E4] text-[#0f6e56]' : 
            row.status === 'sent' ? 'bg-[#ffedd5] text-[#c2410c]' : 
            row.status === 'spam' ? 'bg-[#4c1d95] text-[#ddd6fe]' : 
            'bg-[#fee2e2] text-[#b91c1c]'}`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      cell: () => (
        <button className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#1D9E75] hover:text-[#0c6a55] transition-colors sa-btn-hover hover:underline">
          <MonitorPlay size={14} /> View
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 sa-stagger">
      <PageHeader
        title="Email Delivery Logs"
        subtitle="Global transactional and broadcast mail delivery tracking."
        icon={Mail}
        breadcrumbs={[
          { label: 'Overview', href: '/super-admin' },
          { label: 'System Logs', href: '/super-admin/audit-logs' },
          { label: 'Emails', href: '/super-admin/email-logs' }
        ]}
      />

      {/* Analytics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Global Delivery Rate" suffix="%" value={99.4} icon={CheckCircle2} iconColor="#1D9E75" />
        <StatCard label="Hard Bounces" value={14} change={-2} changeLabel="improvement" icon={AlertTriangle} iconColor="#ca8a04" />
        <StatCard label="Spam Complaints" value={2} change={2} changeLabel="spike" icon={XCircle} iconColor="#b91c1c" />
        <StatCard label="Total Volume (24h)" value={14250} formatValue={(v) => (v / 1000).toFixed(1) + 'k'} icon={Mail} iconColor="#0369a1" />
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-sm border border-[#d4e0dc]">
        <div className="relative flex-1 min-w-[250px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search email address, subject, or message ID..." 
            className="w-full pl-9 pr-4 py-2 bg-[#f0f4f3] border-none rounded-sm text-sm focus:ring-2 focus:ring-[#1D9E75] focus:outline-none placeholder:text-gray-500 font-mono"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#021a13] bg-[#f0f4f3] hover:bg-[#d4e0dc] rounded-sm transition-colors sa-btn-hover">
          <Filter size={14} /> Status: All
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#021a13] bg-[#f0f4f3] hover:bg-[#d4e0dc] rounded-sm transition-colors sa-btn-hover">
          <Filter size={14} /> Tenant: All
        </button>
      </div>

      <div className="bg-white rounded-sm border border-[#d4e0dc] shadow-sm overflow-hidden min-h-[500px]">
        <DataTable
          data={mockEmails}
          columns={columns}
          onRowClick={(row) => setSelectedEmail(row)}
        />
      </div>

      {/* Slide Drawer for Email Inspect */}
      <SlideDrawer
        isOpen={!!selectedEmail}
        onClose={() => setSelectedEmail(null)}
        title={`Message Inspect: ${selectedEmail?.id}`}
      >
        {selectedEmail && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-[#d4e0dc] pb-4">
              <StatusPill status={selectedEmail.status === 'delivered' ? 'completed' : selectedEmail.status === 'sent' ? 'warning' : 'failed'} />
              <span className="font-mono text-xs font-bold text-[#7a9a8c]">Sent: {selectedEmail.sentAt} UTC</span>
            </div>

            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
              <div className="col-span-2">
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#7a9a8c] mb-1">Subject</h4>
                <p className="text-sm font-semibold text-gray-900 border-l-2 border-[#1D9E75] pl-3 py-1 bg-[#f0f4f3]">
                  {selectedEmail.subject}
                </p>
              </div>
              <div>
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#7a9a8c] mb-1">To Prefix</h4>
                <p className="text-sm text-gray-900">{selectedEmail.recipient}</p>
              </div>
              <div>
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#7a9a8c] mb-1">Template Ref</h4>
                <p className="text-[10px] font-mono tracking-wider uppercase bg-[#f0f4f3] px-2 py-1 rounded-sm text-[#0c6a55] inline-block">{selectedEmail.template}</p>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#7a9a8c] mb-2 flex items-center gap-2">
                <MonitorPlay size={14} /> HTML Snippet Preview
              </h4>
              <div className="bg-white p-4 rounded-sm font-sans text-sm border border-[#d4e0dc] min-h-[250px]">
                <p className="mb-4">Hello,</p>
                <p className="mb-4">This is a simulated preview of the email content for <strong>{selectedEmail.subject}</strong>.</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-sm text-xs font-bold uppercase pointer-events-none opacity-50">Call to Action</button>
              </div>
            </div>

            <div className="pt-6 border-t border-[#d4e0dc] flex gap-3">
              <button className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-sm bg-[#1D9E75] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#0f6e56] transition-colors flex-1 sa-btn-hover">
                <RotateCcw size={16} /> Resend Message
              </button>
            </div>
          </div>
        )}
      </SlideDrawer>
    </div>
  );
}
