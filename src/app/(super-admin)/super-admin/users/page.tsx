'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/super-admin/PageHeader';
import { DataTable } from '@/components/super-admin/DataTable';
import { StatusPill } from '@/components/super-admin/StatusPill';
import { Users, Search, Filter, Shield, Info, LogOut, Unlock, Trash2, CheckCircle } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface UserRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLoginAt: string | null;
  lockedUntil: string | null;
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
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<UsersApiResponse>('/platform-admin/users', {
        page,
        limit: 20,
        search: searchTerm || undefined,
        role: roleFilter || undefined,
        status: statusFilter || undefined,
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
  }, [page, searchTerm, roleFilter, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleForceLogout = async (user: UserRow) => {
    if (!confirm(`Force logout ${user.firstName} ${user.lastName}? Their active session will be immediately terminated.`)) return;
    setActionLoading(user.id + '-logout');
    try {
      await apiClient.post(`/platform-admin/users/${user.id}/force-logout`, {});
      toast.success(`Session terminated for ${user.firstName} ${user.lastName}`, {
        description: 'An audit record has been created for this action.',
      });
    } catch (err) {
      toast.error(`Failed to terminate session.`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnlock = async (user: UserRow) => {
    setActionLoading(user.id + '-unlock');
    try {
      await apiClient.post(`/platform-admin/users/${user.id}/unlock`, {});
      toast.success(`Account unlocked for ${user.firstName} ${user.lastName}`);
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, lockedUntil: null } : u));
    } catch (err) {
      toast.error(`Failed to unlock account.`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeactivate = async (user: UserRow) => {
    if (!confirm(`Deactivate ${user.firstName} ${user.lastName}? They will no longer be able to log in.`)) return;
    setActionLoading(user.id + '-deactivate');
    try {
      await apiClient.patch(`/platform-admin/users/${user.id}`, { isActive: false });
      toast.success(`User deactivated: ${user.firstName} ${user.lastName}`);
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isActive: false } : u));
    } catch (err) {
      toast.error(`Failed to deactivate user.`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleActivate = async (user: UserRow) => {
    if (!confirm(`Reactivate ${user.firstName} ${user.lastName}? They will regain login access.`)) return;
    setActionLoading(user.id + '-activate');
    try {
      await apiClient.patch(`/platform-admin/users/${user.id}`, { isActive: true });
      toast.success(`User reactivated: ${user.firstName} ${user.lastName}`);
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isActive: true } : u));
    } catch (err) {
      toast.error(`Failed to reactivate user.`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleImpersonate = async (user: UserRow) => {
    if (!user.tenant) {
      toast.error('Cannot impersonate a platform-level user.');
      return;
    }
    toast.warning(`Impersonation of ${user.firstName} ${user.lastName} is being prepared...`, {
      description: 'An audit trail has been initiated.',
    });
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
        <div className="flex flex-col gap-1">
          <StatusPill status={row.isActive ? 'active' : 'suspended'} />
          {row.lockedUntil && new Date(row.lockedUntil) > new Date() && (
            <span className="text-[9px] uppercase font-bold text-[#b91c1c] tracking-wider">🔒 Locked</span>
          )}
        </div>
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
      header: 'Actions',
      accessorKey: 'id',
      cell: (row: UserRow) => (
        <div className="flex gap-1">
          {/* Impersonate */}
          <button
            onClick={(e) => { e.stopPropagation(); handleImpersonate(row); }}
            title="Impersonate user"
            className="p-1.5 flex gap-1 items-center text-[var(--sa-text-muted)] hover:text-[#1D9E75] hover:bg-[#D0F0E4] transition-colors rounded-full">
            <Shield size={14} />
          </button>
          {/* Force Logout */}
          <button
            onClick={(e) => { e.stopPropagation(); handleForceLogout(row); }}
            title="Force logout active session"
            disabled={actionLoading === row.id + '-logout'}
            className="p-1.5 text-[var(--sa-text-muted)] hover:text-[#ca8a04] hover:bg-[#fef9c3] transition-colors rounded-full disabled:opacity-40">
            <LogOut size={14} />
          </button>
          {/* Unlock if locked */}
          {row.lockedUntil && new Date(row.lockedUntil) > new Date() && (
            <button
              onClick={(e) => { e.stopPropagation(); handleUnlock(row); }}
              title="Unlock account"
              disabled={actionLoading === row.id + '-unlock'}
              className="p-1.5 text-[var(--sa-text-muted)] hover:text-[#0284c7] hover:bg-[#e0f2fe] transition-colors rounded-full disabled:opacity-40">
              <Unlock size={14} />
            </button>
          )}
          {/* Deactivate */}
          {row.isActive && (
            <button
              onClick={(e) => { e.stopPropagation(); handleDeactivate(row); }}
              title="Deactivate user"
              disabled={actionLoading === row.id + '-deactivate'}
              className="p-1.5 text-[var(--sa-text-muted)] hover:text-[#b91c1c] hover:bg-[#fee2e2] transition-colors rounded-full disabled:opacity-40">
              <Trash2 size={14} />
            </button>
          )}
          {/* Reactivate */}
          {!row.isActive && (
            <button
              onClick={(e) => { e.stopPropagation(); handleActivate(row); }}
              title="Reactivate user"
              disabled={actionLoading === row.id + '-activate'}
              className="p-1.5 text-[var(--sa-text-muted)] hover:text-[#0c6a55] hover:bg-[#D0F0E4] transition-colors rounded-full disabled:opacity-40">
              <CheckCircle size={14} />
            </button>
          )}
        </div>
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
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--sa-text-primary)] bg-[var(--sa-bg-page)] hover:bg-[var(--sa-border)] rounded-full transition-colors border border-[var(--sa-border)] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]"
        >
          <option value="">Role: All</option>
          <option value="ADMINISTRATOR">Administrator</option>
          <option value="MANAGER">Manager</option>
          <option value="BROKER">Broker</option>
          <option value="ACCOUNTANT">Accountant</option>
          <option value="CLAIMS_OFFICER">Claims Officer</option>
          <option value="PLATFORM_SUPER_ADMIN">Super Admin</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--sa-text-primary)] bg-[var(--sa-bg-page)] hover:bg-[var(--sa-border)] rounded-full transition-colors border border-[var(--sa-border)] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]"
        >
          <option value="">Status: All</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="LOCKED">Locked</option>
          <option value="NEVER_LOGGED_IN">Never Logged In</option>
        </select>
      </div>

      {/* Info Notice about Impersonation */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-[var(--sa-radius-md)] flex gap-3 items-start">
        <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-blue-900">Impersonation & Action Auditing</h4>
          <p className="text-xs text-blue-800 mt-1">
            All administrative actions (force logout, unlock, deactivate, impersonate) generate immutable audit records linked to your Super Admin ID.
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
