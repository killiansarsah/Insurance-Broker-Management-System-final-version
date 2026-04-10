'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { PageHeader } from '@/components/super-admin/PageHeader';
import { DataTable } from '@/components/super-admin/DataTable';
import { StatusPill } from '@/components/super-admin/StatusPill';
import { Building2, Search, Plus, MoreHorizontal } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface TenantRow {
  id: string;
  name: string;
  nicLicenceNumber: string | null;
  subdomain: string | null;
  tenantStatus: string;
  isActive: boolean;
  adminEmail: string | null;
  storageUsedMb: number;
  createdAt: string;
  _count: { users: number; policies: number };
  subscription: { plan: string; amountGhs: number } | null;
}

interface TenantsApiResponse {
  data: TenantRow[];
  meta: { total: number; page: number; limit: number };
}

export default function TenantsDirectoryPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [tenants, setTenants] = useState<TenantRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTenants = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<TenantsApiResponse>('/platform-admin/tenants', {
        page,
        limit: 20,
        search: searchTerm || undefined,
        plan: planFilter || undefined,
        status: statusFilter || undefined,
      });
      setTenants(res.data);
      if (res.meta) {
        setTotalPages(Math.ceil(res.meta.total / res.meta.limit));
      }
    } catch (err) {
      console.error('Failed to load tenants:', err);
      toast.error('Failed to load tenants from the server.');
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, planFilter, statusFilter]);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  const columns = [
    {
      header: 'Tenant Name',
      accessorKey: 'name',
      sortable: true,
      cell: (row: TenantRow) => (
        <div>
          <div className="font-bold text-[var(--sa-text-primary)]">{row.name}</div>
          <div className="text-[10px] text-[#5DCAA5] font-mono tracking-widest uppercase mt-0.5">
            {row.subdomain ? `${row.subdomain}.brokerium.com` : row.nicLicenceNumber ?? '—'}
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'tenantStatus',
      sortable: true,
      cell: (row: TenantRow) => (
        <StatusPill status={row.tenantStatus?.toLowerCase() ?? (row.isActive ? 'active' : 'suspended')} />
      ),
    },
    {
      header: 'Plan',
      accessorKey: 'subscription',
      sortable: false,
      cell: (row: TenantRow) => (
        <span className="text-xs font-semibold px-2 py-1 bg-[var(--sa-bg-card-alt)] rounded-sm text-[var(--sa-text-primary)]">
          {row.subscription?.plan ?? 'No Plan'}
        </span>
      ),
    },
    {
      header: 'Users',
      accessorKey: '_count.users',
      sortable: true,
      cell: (row: TenantRow) => (
        <span className="font-mono text-sm text-[var(--sa-text-primary)]">{(row._count?.users ?? 0).toLocaleString()}</span>
      ),
    },
    {
      header: 'Policies',
      accessorKey: '_count.policies',
      sortable: true,
      cell: (row: TenantRow) => (
        <span className="font-mono text-sm text-[var(--sa-text-primary)]">{(row._count?.policies ?? 0).toLocaleString()}</span>
      ),
    },
    {
      header: 'Action',
      accessorKey: 'id',
      cell: (row: TenantRow) => (
        <button 
          onClick={(e) => { e.stopPropagation(); router.push(`/super-admin/tenants/${row.id}`); }}
          className="p-1 text-[var(--sa-text-muted)] hover:text-[#0ea5e9] transition-colors rounded-full hover:bg-[var(--sa-bg-page)]">
          <MoreHorizontal size={18} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 sa-stagger">
      <PageHeader
        title="Tenant Directory"
        subtitle="Manage instances, scale limits, and enforce billing for all brokers and agencies."
        icon={Building2}
        breadcrumbs={[
          { label: 'Overview', href: '/super-admin' },
          { label: 'Tenants', href: '/super-admin/tenants' }
        ]}
        actions={
          <button 
            onClick={() => router.push('/super-admin/tenants/new')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#021a13] bg-[#10b981] hover:bg-[#34d399] rounded-full transition-colors sa-btn-hover">
            <Plus size={14} /> Provision Tenant
          </button>
        }
      />

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-4 bg-[var(--sa-bg-card)] p-4 rounded-[var(--sa-radius-md)] border border-[var(--sa-border)] shadow-sm">
        <div className="relative flex-1 min-w-[250px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by tenant name, code, or domain..." 
            className="w-full pl-9 pr-4 py-2 bg-[var(--sa-bg-page)] border-none rounded-full text-sm focus:ring-2 focus:ring-[#10b981] focus:outline-none placeholder:text-gray-500 font-mono text-[var(--sa-text-primary)]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--sa-text-primary)] bg-[var(--sa-bg-page)] hover:bg-[var(--sa-border)] rounded-full transition-colors border border-[var(--sa-border)] focus:outline-none focus:ring-2 focus:ring-[#10b981]"
        >
          <option value="">Plan: All</option>
          <option value="BASIC">Basic</option>
          <option value="PROFESSIONAL">Professional</option>
          <option value="ENTERPRISE">Enterprise</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--sa-text-primary)] bg-[var(--sa-bg-page)] hover:bg-[var(--sa-border)] rounded-full transition-colors border border-[var(--sa-border)] focus:outline-none focus:ring-2 focus:ring-[#10b981]"
        >
          <option value="">Status: All</option>
          <option value="ACTIVE">Active</option>
          <option value="TRIAL">Trial</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="CHURNED">Churned</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[var(--sa-bg-card)] rounded-[var(--sa-radius-md)] border border-[var(--sa-border)] shadow-sm overflow-hidden">
        <DataTable
          data={tenants as any}
          columns={columns as any}
          loading={loading}
          onRowClick={(row: any) => router.push(`/super-admin/tenants/${row.id}`)}
          page={page}
          total={totalPages * 20}
          pageSize={20}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
