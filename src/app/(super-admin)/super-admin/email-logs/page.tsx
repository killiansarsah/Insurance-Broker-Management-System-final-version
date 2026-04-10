'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/super-admin/PageHeader';
import { StatCard } from '@/components/super-admin/StatCard';
import { DataTable } from '@/components/super-admin/DataTable';
import { SlideDrawer } from '@/components/super-admin/SlideDrawer';
import { StatusPill } from '@/components/super-admin/StatusPill';
import { Mail, CheckCircle2, AlertTriangle, XCircle, Search, RotateCcw, MonitorPlay } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

interface EmailLogRow {
  id: string;
  templateName: string | null;
  recipientEmail: string;
  subject: string | null;
  status: string;
  sentAt: string | null;
  createdAt: string;
  provider: string | null;
  tenant: { name: string } | null;
}

interface EmailsResponse {
  data: EmailLogRow[];
  meta?: { total: number; page: number; limit: number };
}

export default function EmailLogsPage() {
  const [emails, setEmails] = useState<EmailLogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [tenantFilter, setTenantFilter] = useState('');
  const [selectedEmail, setSelectedEmail] = useState<EmailLogRow | null>(null);

  const fetchEmails = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, limit: 50 };
      if (searchTerm) params.recipient = searchTerm;
      if (statusFilter) params.status = statusFilter;
      if (tenantFilter) params.tenantId = tenantFilter;
      const res = await apiClient.get<EmailsResponse>('/platform-admin/email-logs', params);
      setEmails(res.data ?? []);
      if (res.meta) setTotalCount(res.meta.total);
    } catch (err) {
      console.error('Failed to load email logs:', err);
      toast.error('Failed to load email logs.');
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, statusFilter, tenantFilter]);

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  const handleResend = async (id: string) => {
    try {
      await apiClient.post(`/platform-admin/email-logs/${id}/resend`, {});
      toast.success('Email queued for resending.');
      fetchEmails();
    } catch (err) {
      toast.error('Failed to resend email.');
    }
  };

  const deliveredCount = emails.filter(e => e.status === 'DELIVERED').length;
  const bouncedCount = emails.filter(e => e.status === 'BOUNCED').length;
  const spamCount = emails.filter(e => e.status === 'SPAM').length;

  const columns = [
    {
      header: 'Timestamp',
      accessorKey: 'sentAt',
      cell: (row: any) => (
        <span className="font-mono text-xs text-[var(--sa-text-muted)]">
          {row.sentAt ? new Date(row.sentAt).toLocaleString() : new Date(row.createdAt).toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Recipient',
      accessorKey: 'recipientEmail',
      cell: (row: any) => (
        <span className="font-bold text-[var(--sa-text-primary)]">{row.recipientEmail}</span>
      ),
    },
    {
      header: 'Tenant Context',
      accessorKey: 'tenant',
      cell: (row: any) => (
        <span className="text-xs text-[var(--sa-text-secondary)]">{row.tenant?.name ?? 'Platform'}</span>
      ),
    },
    {
      header: 'Template / Subject',
      accessorKey: 'subject',
      cell: (row: any) => (
        <div className="flex flex-col">
          <span className="text-xs font-bold text-[#0c6a55]">{row.templateName ?? 'Custom'}</span>
          <span className="text-xs text-[var(--sa-text-muted)] truncate max-w-[200px]">{row.subject ?? '—'}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: any) => (
        <span className={`text-[10px] px-2 py-0.5 rounded-sm font-mono tracking-wider uppercase font-bold
          ${row.status === 'DELIVERED' ? 'bg-[#D0F0E4] text-[#0f6e56]' : 
            row.status === 'SENT' ? 'bg-[#ffedd5] text-[#c2410c]' : 
            row.status === 'SPAM' ? 'bg-[#4c1d95] text-[#ddd6fe]' : 
            'bg-[#fee2e2] text-[#b91c1c]'}`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      cell: (row: any) => (
        <button 
          onClick={(e) => { e.stopPropagation(); setSelectedEmail(row); }}
          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#1D9E75] hover:text-[#0c6a55] transition-colors sa-btn-hover hover:underline">
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
        <StatCard label="Total Logged" value={totalCount} icon={Mail} iconColor="#0369a1" loading={loading} />
        <StatCard label="Delivered" value={deliveredCount} icon={CheckCircle2} iconColor="#1D9E75" loading={loading} />
        <StatCard label="Hard Bounces" value={bouncedCount} icon={AlertTriangle} iconColor="#ca8a04" loading={loading} />
        <StatCard label="Spam Complaints" value={spamCount} icon={XCircle} iconColor="#b91c1c" loading={loading} />
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-4 bg-[var(--sa-bg-card)] p-4 rounded-[var(--sa-radius-md)] border border-[var(--sa-border)]">
        <div className="relative flex-1 min-w-[250px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search email address, subject, or message ID..." 
            className="w-full pl-9 pr-4 py-2 bg-[var(--sa-bg-page)] border-none rounded-full text-sm focus:ring-2 focus:ring-[#1D9E75] focus:outline-none placeholder:text-gray-500 font-mono text-[var(--sa-text-primary)]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--sa-text-primary)] bg-[var(--sa-bg-page)] hover:bg-[var(--sa-border)] rounded-full transition-colors border border-[var(--sa-border)] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]"
        >
          <option value="">Status: All</option>
          <option value="SENT">Sent</option>
          <option value="DELIVERED">Delivered</option>
          <option value="BOUNCED">Bounced</option>
          <option value="FAILED">Failed</option>
          <option value="SPAM">Spam</option>
        </select>
      </div>

      <div className="bg-[var(--sa-bg-card)] rounded-[var(--sa-radius-md)] border border-[var(--sa-border)] shadow-sm overflow-hidden min-h-[500px]">
        <DataTable
          data={emails as any}
          columns={columns as any}
          loading={loading}
          onRowClick={(row: any) => setSelectedEmail(row as EmailLogRow)}
          page={page}
          total={totalCount}
          pageSize={50}
          onPageChange={setPage}
        />
      </div>

      {/* Slide Drawer for Email Inspect */}
      <SlideDrawer
        isOpen={!!selectedEmail}
        onClose={() => setSelectedEmail(null)}
        title={`Message Inspect: ${selectedEmail?.id?.slice(0, 12)}...`}
      >
        {selectedEmail && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-[var(--sa-border)] pb-4">
              <StatusPill status={selectedEmail.status === 'DELIVERED' ? 'completed' : selectedEmail.status === 'SENT' ? 'warning' : 'failed'} />
              <span className="font-mono text-xs font-bold text-[#7a9a8c]">Sent: {selectedEmail.sentAt ? new Date(selectedEmail.sentAt).toLocaleString() : '—'} UTC</span>
            </div>

            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
              <div className="col-span-2">
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#7a9a8c] mb-1">Subject</h4>
                <p className="text-sm font-semibold text-[var(--sa-text-primary)] border-l-2 border-[#1D9E75] pl-3 py-1 bg-[var(--sa-bg-card-alt)]">
                  {selectedEmail.subject ?? '(No subject)'}
                </p>
              </div>
              <div>
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#7a9a8c] mb-1">To</h4>
                <p className="text-sm text-[var(--sa-text-primary)]">{selectedEmail.recipientEmail}</p>
              </div>
              <div>
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#7a9a8c] mb-1">Template</h4>
                <p className="text-[10px] font-mono tracking-wider uppercase bg-[var(--sa-bg-card-alt)] px-2 py-1 rounded-sm text-[#0c6a55] inline-block">{selectedEmail.templateName ?? 'Custom'}</p>
              </div>
              <div>
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#7a9a8c] mb-1">Tenant</h4>
                <p className="text-sm text-[var(--sa-text-primary)]">{selectedEmail.tenant?.name ?? 'Platform'}</p>
              </div>
              <div>
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#7a9a8c] mb-1">Provider</h4>
                <p className="text-sm font-mono text-[var(--sa-text-primary)]">{selectedEmail.provider ?? '—'}</p>
              </div>
            </div>

            <div className="pt-6 border-t border-[var(--sa-border)] flex gap-3">
              <button 
                onClick={() => handleResend(selectedEmail.id)}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#1D9E75] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#0f6e56] transition-colors flex-1 sa-btn-hover">
                <RotateCcw size={16} /> Resend Message
              </button>
            </div>
          </div>
        )}
      </SlideDrawer>
    </div>
  );
}
