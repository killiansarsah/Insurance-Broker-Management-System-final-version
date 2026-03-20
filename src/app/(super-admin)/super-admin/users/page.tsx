'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/super-admin/PageHeader';
import { DataTable } from '@/components/super-admin/DataTable';
import { StatusPill } from '@/components/super-admin/StatusPill';
import { Users, Search, Filter, Shield, Info, MoreHorizontal } from 'lucide-react';

const mockUsers = [
  { id: 'u_1', name: 'Killian Sarsah', email: 'ksarsah@ibms.com', role: 'PLATFORM_SUPER_ADMIN', tenant: 'System Core', status: 'active', lastLogin: '10m ago' },
  { id: 'u_2', name: 'John Doe', email: 'jdoe@vanguard.com', role: 'TENANT_ADMIN', tenant: 'Vanguard Insurance', status: 'active', lastLogin: '2h ago' },
  { id: 'u_3', name: 'Jane Smith', email: 'jsmith@horizon.com', role: 'BROKER', tenant: 'Horizon Brokers Ltd', status: 'suspended', lastLogin: '12d ago' },
  { id: 'u_4', name: 'Michael Lee', email: 'mlee@apex.com', role: 'COMPLIANCE_OFFICER', tenant: 'Apex Secure Solutions', status: 'active', lastLogin: '1d ago' },
  { id: 'u_5', name: 'Sarah Connor', email: 'sconnor@meridian.com', role: 'ADMIN', tenant: 'Meridian Capital', status: 'pending', lastLogin: '-' },
];

export default function UsersDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    {
      header: 'User',
      accessorKey: 'name',
      sortable: true,
      cell: (row: typeof mockUsers[0]) => (
        <div>
          <div className="font-bold text-gray-900">{row.name}</div>
          <div className="text-xs text-gray-500 font-mono mt-0.5">{row.email}</div>
        </div>
      ),
    },
    {
      header: 'Tenant',
      accessorKey: 'tenant',
      sortable: true,
      cell: (row: typeof mockUsers[0]) => (
        <div>
          <div className="text-xs font-semibold text-gray-900 border-l border-[#1D9E75] pl-2">{row.tenant}</div>
        </div>
      ),
    },
    {
      header: 'Role',
      accessorKey: 'role',
      sortable: true,
      cell: (row: typeof mockUsers[0]) => (
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono tracking-wider uppercase font-bold
          ${row.role.includes('ADMIN') ? 'bg-[#e0e7ff] text-[#4338ca]' : 
            'bg-[#f1f5f9] text-[#475569]'}`}
        >
          {row.role.replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      cell: (row: typeof mockUsers[0]) => (
        <StatusPill status={row.status} />
      ),
    },
    {
      header: 'Last Login',
      accessorKey: 'lastLogin',
      sortable: true,
      cell: (row: typeof mockUsers[0]) => (
        <span className="font-mono text-xs text-gray-500">{row.lastLogin}</span>
      ),
    },
    {
      header: 'Action',
      accessorKey: 'id',
      cell: () => (
        <button 
          onClick={(e) => { e.stopPropagation(); toast.warning('Impersonating user...'); }}
          className="p-1 flex gap-2 items-center text-gray-400 hover:text-[#021a13] transition-colors rounded-full hover:bg-[var(--sa-bg-page)]">
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
          onClick={() => toast.info('Advanced filtering unlocked')}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#021a13] bg-[var(--sa-bg-page)] hover:bg-[var(--sa-border)] rounded-full transition-colors sa-btn-hover">
          <Filter size={14} /> Tenant: All
        </button>
        <button 
          onClick={() => toast.info('Advanced filtering unlocked')}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#021a13] bg-[var(--sa-bg-page)] hover:bg-[var(--sa-border)] rounded-full transition-colors sa-btn-hover">
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
      <div className="bg-white rounded-[var(--sa-radius-md)] border border-[#d4e0dc] shadow-sm overflow-hidden">
        <DataTable
          data={mockUsers.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()))}
          columns={columns}
          onRowClick={(row) => toast.info(`Viewing details for ${row.name}`)}
        />
      </div>
    </div>
  );
}
