'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { PageHeader } from '@/components/super-admin/PageHeader';
import { DataTable } from '@/components/super-admin/DataTable';
import { StatusPill } from '@/components/super-admin/StatusPill';
import { Building2, Search, Filter, Plus, Eye, MoreHorizontal } from 'lucide-react';

const mockTenants = [
  { id: '1', name: 'Vanguard Insurance Group', code: 'VIG', plan: 'Enterprise', users: 145, policies: 12450, status: 'active', joined: '2023-01-15' },
  { id: '2', name: 'Horizon Brokers Ltd', code: 'HBL', plan: 'Professional', users: 43, policies: 8320, status: 'active', joined: '2023-04-22' },
  { id: '3', name: 'Apex Secure Solutions', code: 'ASS', plan: 'Professional', users: 28, policies: 5100, status: 'active', joined: '2023-08-10' },
  { id: '4', name: 'Meridian Capital', code: 'MER', plan: 'Starter', users: 12, policies: 3200, status: 'trial', joined: '2024-01-05' },
  { id: '5', name: 'Sterling Risk Mgmt', code: 'SRM', plan: 'Starter', users: 5, policies: 2100, status: 'suspended', joined: '2023-11-30' },
];

export default function TenantsDirectoryPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    {
      header: 'Tenant Name',
      accessorKey: 'name',
      sortable: true,
      cell: (row: typeof mockTenants[0]) => (
        <div>
          <div className="font-bold text-gray-900">{row.name}</div>
          <div className="text-[10px] text-[#5DCAA5] font-mono tracking-widest uppercase mt-0.5">Code: {row.code}</div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      cell: (row: typeof mockTenants[0]) => (
        <StatusPill status={row.status} />
      ),
    },
    {
      header: 'Plan',
      accessorKey: 'plan',
      sortable: true,
      cell: (row: typeof mockTenants[0]) => (
        <span className="text-xs font-semibold px-2 py-1 bg-gray-100 rounded-sm text-gray-700">
          {row.plan}
        </span>
      ),
    },
    {
      header: 'Users',
      accessorKey: 'users',
      sortable: true,
      cell: (row: typeof mockTenants[0]) => (
        <span className="font-mono text-sm">{row.users.toLocaleString()}</span>
      ),
    },
    {
      header: 'Policies',
      accessorKey: 'policies',
      sortable: true,
      cell: (row: typeof mockTenants[0]) => (
        <span className="font-mono text-sm">{row.policies.toLocaleString()}</span>
      ),
    },
    {
      header: 'Action',
      accessorKey: 'id',
      cell: () => (
        <button 
          onClick={(e) => { e.stopPropagation(); toast.info('Tenant actions menu opened.'); }}
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
        <button 
          onClick={() => toast.info('Filtering functionality is locked in this demo layer.')}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--sa-text-primary)] bg-[var(--sa-bg-page)] hover:bg-[var(--sa-border)] rounded-full transition-colors sa-btn-hover">
          <Filter size={14} /> Plan: All
        </button>
        <button 
          onClick={() => toast.info('Filtering functionality is locked in this demo layer.')}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--sa-text-primary)] bg-[var(--sa-bg-page)] hover:bg-[var(--sa-border)] rounded-full transition-colors sa-btn-hover">
          <Filter size={14} /> Status: Active
        </button>
      </div>

      {/* Table */}
      <div className="bg-[var(--sa-bg-card)] rounded-[var(--sa-radius-md)] border border-[var(--sa-border)] shadow-sm overflow-hidden">
        <DataTable
          data={mockTenants.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()))}
          columns={columns}
          onRowClick={(row) => router.push(`/super-admin/tenants/${row.id}`)}
        />
      </div>
    </div>
  );
}
