'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/super-admin/PageHeader';
import { DataTable } from '@/components/super-admin/DataTable';
import { StatusPill } from '@/components/super-admin/StatusPill';
import { Users, Search, Filter, Shield, Info } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface UserRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLoginAt: string | null;
  tenant: { name: string } | null;
}

interface UsersApiResponse {
  data: UserRow[];
  meta: { total: number; page: number; limit: number };
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return '—';
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

export default function UsersDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<UsersApiResponse>('/platform-admin/users', {
        page,
        limit: 20,
        search: searchTerm || undefined,
      });
      setUsers(res.data);
      if (res.meta) {
        setTotalPages(Math.ceil(res.meta.total / res.meta.limit));
      }
    } catch (err) {
      console.error('Failed to load users:', err);
      toast.error('Failed to load users from the server.');
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleImpersonate = async (user: UserRow) => {
    if (!user.tenant) {
      toast.error('Cannot impersonate a platform-level user.');
      return;
    }
    toast.warning(`Impersonation of ${user.firstName} ${user.lastName} is being prepared...`);
  };

  const columns = [
    {
      header: 'User',
      accessorKey: 'firstName',
      sortable: true,
      cell: (row: UserRow) => (
        <div>
          <div className="font-bold text-[var(--sa-text-primary)]">{row.firstName} {row.lastName}</div>
          <div className="text-xs text-[var(--sa-text-muted)] font-mono mt-0.5">{row.email}</div>
        </div>
      ),
    },
    {
      header: 'Tenant',
      accessorKey: 'tenant',
      sortable: true,
      cell: (row: UserRow) => (
        <div>
          <div className="text-xs font-semibold text-[var(--sa-text-primary)] border-l-2 border-[#1D9E75] pl-2">
            {row.tenant?.name ?? 'Platform'}
          </div>
        </div>
      ),
    },
    {
      header: 'Role',
      accessorKey: 'role',
      sortable: true,
      cell: (row: UserRow) => (
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono tracking-wider uppercase font-bold
          ${row.role.includes('ADMIN') || row.role.includes('SUPER') ? 'bg-[#e0e7ff] text-[#4338ca]' : 
            'bg-[var(--sa-bg-card-alt)] text-[var(--sa-text-secondary)]'}`}
        >
          {row.role.replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'isActive',
      sortable: true,
      cell: (row: UserRow) => (
        <StatusPill status={row.isActive ? 'active' : 'suspended'} />
      ),
    },
    {
      header: 'Last Login',
      accessorKey: 'lastLoginAt',
      sortable: true,
      cell: (row: UserRow) => (
        <span className="font-mono text-xs text-[var(--sa-text-muted)]">{timeAgo(row.lastLoginAt)}</span>
      ),
    },
    {
      header: 'Action',
      accessorKey: 'id',
      cell: (row: UserRow) => (
        <button 
          onClick={(e) => { e.stopPropagation(); handleImpersonate(row); }}
          className="p-1 flex gap-2 items-center text-[var(--sa-text-muted)] hover:text-[var(--sa-text-primary)] transition-colors rounded-full hover:bg-[var(--sa-bg-page)]">
          <span className="text-[10px] font-bold uppercase tracking-wider hidden md:block text-[#1D9E75]">Impersonate</span>
          <Shield size={16} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 sa-stagger">
      <PageHeader
        title="Global User Matrix"
        subtitle="Search and manage compliance across all tenant organizations."
        icon={Users}
        breadcrumbs={[
          { label: 'Overview', href: '/super-admin' },
          { label: 'Users', href: '/super-admin/users' }
        ]}
      />

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-4 bg-[var(--sa-bg-card)] p-4 rounded-[var(--sa-radius-md)] border border-[var(--sa-border)] shadow-sm">
        <div className="relative flex-1 min-w-[250px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search email, name, or role..." 
            className="w-full pl-9 pr-4 py-2 bg-[var(--sa-bg-page)] border-none rounded-full text-sm focus:ring-2 focus:ring-[#1D9E75] focus:outline-none placeholder:text-gray-500 font-mono text-[var(--sa-text-primary)]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => toast.info('Tenant filter coming soon.')}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--sa-text-primary)] bg-[var(--sa-bg-page)] hover:bg-[var(--sa-border)] rounded-full transition-colors sa-btn-hover">
          <Filter size={14} /> Tenant: All
        </button>
        <button 
          onClick={() => toast.info('Role filter coming soon.')}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--sa-text-primary)] bg-[var(--sa-bg-page)] hover:bg-[var(--sa-border)] rounded-full transition-colors sa-btn-hover">
          <Filter size={14} /> Role: All
        </button>
      </div>

      {/* Info Notice about Impersonation */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-[var(--sa-radius-md)] flex gap-3 items-start">
        <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-blue-900">Impersonation Auditing</h4>
          <p className="text-xs text-blue-800 mt-1">
            Logging in as a tenant user will generate an un-alterable audit record tagged with your Super Admin ID.
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[var(--sa-bg-card)] rounded-[var(--sa-radius-md)] border border-[var(--sa-border)] shadow-sm overflow-hidden">
        <DataTable
          data={users as any}
          columns={columns as any}
          loading={loading}
          onRowClick={(row: any) => toast.info(`Viewing details for ${row.firstName} ${row.lastName}`)}
          page={page}
          total={totalPages * 20}
          pageSize={20}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
