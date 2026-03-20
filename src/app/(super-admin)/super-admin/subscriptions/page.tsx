'use client';

import { toast } from 'sonner';
import { PageHeader } from '@/components/super-admin/PageHeader';
import { StatCard } from '@/components/super-admin/StatCard';
import { DataTable } from '@/components/super-admin/DataTable';
import { StatusPill } from '@/components/super-admin/StatusPill';
import { CreditCard, TrendingUp, AlertCircle, Ban, RefreshCcw, BellRing, Settings } from 'lucide-react';
import { RevenueTrendChart } from '@/components/super-admin/overview-charts/RevenueTrendChart';

const mockSubscriptions = [
  { id: 'sub_1', tenant: 'Vanguard Insurance Group', plan: 'Enterprise', cycle: 'Annual', amount: 150000, nextBilling: '2027-01-15', status: 'active', payment: 'Credit Card' },
  { id: 'sub_2', tenant: 'Horizon Brokers Ltd', plan: 'Professional', cycle: 'Monthly', amount: 2500, nextBilling: '2026-04-22', status: 'active', payment: 'Bank Transfer' },
  { id: 'sub_3', tenant: 'Apex Secure Solutions', plan: 'Professional', cycle: 'Monthly', amount: 2500, nextBilling: '2026-03-10', status: 'overdue', payment: 'Credit Card' },
  { id: 'sub_4', tenant: 'Meridian Capital', plan: 'Starter', cycle: 'Monthly', amount: 800, nextBilling: '2026-04-05', status: 'active', payment: 'Mobile Money' },
  { id: 'sub_5', tenant: 'Sterling Risk Mgmt', plan: 'Starter', cycle: 'Annual', amount: 8500, nextBilling: '2026-11-30', status: 'canceled', payment: 'Bank Transfer' },
];

export default function SubscriptionsPage() {
  const columns = [
    {
      header: 'Tenant Name',
      accessorKey: 'tenant',
      cell: (row: typeof mockSubscriptions[0]) => (
        <div className="font-bold text-gray-900">{row.tenant}</div>
      ),
    },
    {
      header: 'Plan',
      accessorKey: 'plan',
      cell: (row: typeof mockSubscriptions[0]) => (
        <span className="text-xs font-semibold px-2 py-1 bg-gray-100 rounded-sm text-gray-700">
          {row.plan}
        </span>
      ),
    },
    {
      header: 'Cycle',
      accessorKey: 'cycle',
      cell: (row: typeof mockSubscriptions[0]) => (
        <span className="text-xs text-gray-600">{row.cycle}</span>
      ),
    },
    {
      header: 'Current Rate',
      accessorKey: 'amount',
      cell: (row: typeof mockSubscriptions[0]) => (
        <span className="font-mono text-sm text-[#0c6a55]">₵{row.amount.toLocaleString()}</span>
      ),
    },
    {
      header: 'Next Billing',
      accessorKey: 'nextBilling',
      cell: (row: typeof mockSubscriptions[0]) => (
        <span className="font-mono text-xs text-gray-500">{row.nextBilling}</span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: typeof mockSubscriptions[0]) => (
        <StatusPill status={row.status} />
      ),
    },
    {
      header: 'Manage',
      accessorKey: 'id',
      cell: () => (
        <button 
          onClick={() => toast.info('Loading billing profile...')}
          className="text-[10px] font-bold uppercase tracking-wider text-[#1D9E75] hover:text-[#0c6a55] transition-colors sa-btn-hover hover:underline">
          View Billing
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 sa-stagger">
      <PageHeader
        title="Revenue & Subscriptions"
        subtitle="Manage billing cycles, tenant plans, and overdue payments."
        icon={CreditCard}
        breadcrumbs={[
          { label: 'Overview', href: '/super-admin' },
          { label: 'Billing Settings', href: '/super-admin/subscriptions' }
        ]}
        actions={
          <button 
            onClick={() => toast.success('Stripe telemetry synchronized')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--sa-text-primary)] bg-[var(--sa-bg-card)] border border-[var(--sa-border)] hover:bg-[var(--sa-bg-page)] rounded-full transition-colors sa-btn-hover">
            <RefreshCcw size={14} /> Sync Stripe
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Monthly Recurring Rev" prefix="₵" value={84500} formatValue={(v) => (v / 1000).toFixed(1) + 'k'} icon={TrendingUp} iconColor="#1d9e75" onClick={() => toast.info('MRR Chart open')} />
        <StatCard label="Overdue Balance" prefix="₵" value={12450} formatValue={(v) => (v / 1000).toFixed(1) + 'k'} icon={AlertCircle} iconColor="#b91c1c" onClick={() => toast.error('List filtered to overdue payments')} />
        <StatCard label="New Revenue (30d)" prefix="₵" value={4200} formatValue={(v) => (v / 1000).toFixed(1) + 'k'} change={14.1} icon={CreditCard} iconColor="#0369a1" onClick={() => toast.info('View breakdown of 30d revenue expansion')} />
        <StatCard label="Churned Revenue" prefix="₵" value={850} formatValue={(v) => (v / 1000).toFixed(1) + 'k'} change={-2.4} changeLabel="improvement" icon={Ban} iconColor="#ca8a04" onClick={() => toast.info('View contraction metrics')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        
        {/* Left Col: Master Chart */}
        <div className="lg:col-span-2">
          <RevenueTrendChart />
          
          <div className="mt-6 bg-[var(--sa-bg-card)] rounded-[var(--sa-radius-md)] border border-[var(--sa-border)] shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[var(--sa-border)] flex items-center justify-between">
              <h3 className="text-sm font-bold font-serif text-[var(--sa-text-primary)]">Active Subscriptions</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => toast.info('Filter: Active applied')}
                  className="text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:text-[#1D9E75] transition-colors sa-btn-hover hover:underline">
                  Filter Active
                </button>
                <span className="text-gray-300">|</span>
                <button 
                  onClick={() => toast.info('Filter: Overdue applied')}
                  className="text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:text-[#b91c1c] transition-colors sa-btn-hover hover:underline">
                  Filter Overdue
                </button>
              </div>
            </div>
            <DataTable
              data={mockSubscriptions}
              columns={columns}
              onRowClick={(row) => toast.info(`Viewing billing portal for ${row.tenant}`)}
            />
          </div>
        </div>

        {/* Right Col: Priority Action Cards */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#fff1f2] border border-[#fecdd3] rounded-[var(--sa-radius-md)] p-5 sa-card-hover">
            <div className="flex items-center gap-2 text-[#be123c] mb-4">
              <AlertCircle size={20} />
              <h3 className="text-sm font-bold uppercase tracking-widest">Collections Due</h3>
            </div>
            
            <div className="space-y-4">
              {mockSubscriptions.filter(s => s.status === 'overdue').map(overdue => (
                <div key={overdue.id} className="bg-white border border-[#fecdd3] rounded-[var(--sa-radius-md)] p-4 text-sm">
                  <div className="font-bold text-gray-900 mb-0.5">{overdue.tenant}</div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-mono text-[#be123c] font-bold">₵{overdue.amount.toLocaleString()}</span>
                    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">4 Days Late</span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button 
                      onClick={() => toast.success(`Automated reminder dispatched to ${overdue.tenant}`)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white bg-[#be123c] hover:bg-[#9f1239] rounded-full transition-colors sa-btn-hover">
                      <BellRing size={12} /> Remind
                    </button>
                    <button 
                      onClick={() => toast.error(`Account suspended for ${overdue.tenant}`)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#9f1239] bg-transparent border border-[#fecdd3] hover:bg-[#ffe4e6] rounded-full transition-colors sa-btn-hover">
                      Suspend
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#021a13] border border-[#085041] rounded-[var(--sa-radius-md)] p-5 text-[#9FE1CB] sa-card-hover">
            <div className="flex flex-col gap-1 mb-6">
              <div className="flex items-center gap-2 mb-1 text-[#5DCAA5]">
                <Settings size={20} />
                <h3 className="text-sm font-bold uppercase tracking-widest">Plan Config</h3>
              </div>
              <p className="text-xs text-[#7a9a8c]">Manage global plan tiers & features mapped to Stripe products.</p>
            </div>
            
            <div className="space-y-3">
              {['Starter', 'Professional', 'Enterprise'].map(plan => (
                <div key={plan} 
                  onClick={() => toast.info(`Editing ${plan} Config`)}
                  className="p-3 border border-[#05291e] rounded-[var(--sa-radius-md)] hover:bg-[#05291e] transition-colors cursor-pointer group">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm text-[#f0f4f3]">{plan}</span>
                    <span className="font-mono text-xs text-[#5DCAA5]">
                      {plan === 'Starter' ? '₵800' : plan === 'Professional' ? '₵2500' : 'Custom'}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono tracking-widest uppercase text-[#7a9a8c] group-hover:text-[#9FE1CB] transition-colors">
                    {plan === 'Starter' ? '32 Tenants' : plan === 'Professional' ? '88 Tenants' : '22 Tenants'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
