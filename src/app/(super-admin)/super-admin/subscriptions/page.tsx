'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/super-admin/PageHeader';
import { StatCard } from '@/components/super-admin/StatCard';
import { DataTable } from '@/components/super-admin/DataTable';
import { StatusPill } from '@/components/super-admin/StatusPill';
import { CreditCard, TrendingUp, AlertCircle, Ban, RefreshCcw, BellRing, Settings } from 'lucide-react';
import { RevenueTrendChart } from '@/components/super-admin/overview-charts/RevenueTrendChart';
import { apiClient } from '@/lib/api-client';
import { useLiveMetric } from '@/hooks/super-admin/useLiveMetric';

interface SubscriptionRow {
  id: string;
  tenantName: string;
  plan: string;
  billingCycle: string;
  amountGhs: number;
  nextBillingDate: string | null;
  status: string;
  paymentMethod: string | null;
}

interface SubsApiResponse {
  data: SubscriptionRow[];
  meta?: { total: number; page: number; limit: number };
}

interface BillingStats {
  data: {
    mrr: number;
    overdueBalance: number;
    newRevenue30d: number;
    churnedRevenue: number;
    mrrGrowth: number;
    churnGrowth: number;
  };
}

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState<SubscriptionRow[]>([]);
  const [loading, setLoading] = useState(true);

  const { data: billingStats, loading: statsLoading } = useLiveMetric<BillingStats>('/platform-admin/billing/stats', 60_000);
  const stats = billingStats?.data;

  const fetchSubs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<SubsApiResponse>('/platform-admin/billing/subscriptions');
      setSubs(res.data ?? []);
    } catch (err) {
      console.error('Failed to load subscriptions:', err);
      toast.error('Failed to load subscriptions.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubs();
  }, [fetchSubs]);

  const overdueSubs = subs.filter(s => s.status === 'OVERDUE' || s.status === 'overdue');

  const columns = [
    {
      header: 'Tenant Name',
      accessorKey: 'tenantName',
      cell: (row: any) => (
        <div className="font-bold text-[var(--sa-text-primary)]">{row.tenantName}</div>
      ),
    },
    {
      header: 'Plan',
      accessorKey: 'plan',
      cell: (row: any) => (
        <span className="text-xs font-semibold px-2 py-1 bg-[var(--sa-bg-card-alt)] rounded-sm text-[var(--sa-text-primary)]">
          {row.plan}
        </span>
      ),
    },
    {
      header: 'Cycle',
      accessorKey: 'billingCycle',
      cell: (row: any) => (
        <span className="text-xs text-[var(--sa-text-secondary)]">{row.billingCycle}</span>
      ),
    },
    {
      header: 'Current Rate',
      accessorKey: 'amountGhs',
      cell: (row: any) => (
        <span className="font-mono text-sm text-[#0c6a55]">₵{(row.amountGhs ?? 0).toLocaleString()}</span>
      ),
    },
    {
      header: 'Next Billing',
      accessorKey: 'nextBillingDate',
      cell: (row: any) => (
        <span className="font-mono text-xs text-[var(--sa-text-muted)]">
          {row.nextBillingDate ? new Date(row.nextBillingDate).toLocaleDateString() : '—'}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: any) => (
        <StatusPill status={row.status?.toLowerCase()} />
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
            onClick={() => toast.success('Payment gateway sync triggered.')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--sa-text-primary)] bg-[var(--sa-bg-card)] border border-[var(--sa-border)] hover:bg-[var(--sa-bg-page)] rounded-full transition-colors sa-btn-hover">
            <RefreshCcw size={14} /> Sync Payments
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Monthly Recurring Rev" prefix="₵" value={stats?.mrr ?? 0} formatValue={(v) => (v / 1000).toFixed(1) + 'k'} icon={TrendingUp} iconColor="#1d9e75" loading={statsLoading} />
        <StatCard label="Overdue Balance" prefix="₵" value={stats?.overdueBalance ?? 0} formatValue={(v) => (v / 1000).toFixed(1) + 'k'} icon={AlertCircle} iconColor="#b91c1c" loading={statsLoading} />
        <StatCard label="New Revenue (30d)" prefix="₵" value={stats?.newRevenue30d ?? 0} formatValue={(v) => (v / 1000).toFixed(1) + 'k'} change={stats?.mrrGrowth ?? 0} icon={CreditCard} iconColor="#0369a1" loading={statsLoading} />
        <StatCard label="Churned Revenue" prefix="₵" value={stats?.churnedRevenue ?? 0} formatValue={(v) => (v / 1000).toFixed(1) + 'k'} change={stats?.churnGrowth ?? 0} changeLabel="improvement" icon={Ban} iconColor="#ca8a04" loading={statsLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        
        {/* Left Col: Master Chart */}
        <div className="lg:col-span-2">
          <RevenueTrendChart />
          
          <div className="mt-6 bg-[var(--sa-bg-card)] rounded-[var(--sa-radius-md)] border border-[var(--sa-border)] shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[var(--sa-border)] flex items-center justify-between">
              <h3 className="text-sm font-bold font-serif text-[var(--sa-text-primary)]">Active Subscriptions</h3>
            </div>
            <DataTable
              data={subs as any}
              columns={columns as any}
              loading={loading}
              onRowClick={(row: any) => toast.info(`Viewing billing portal for ${row.tenantName}`)}
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
              {overdueSubs.length === 0 ? (
                <p className="text-sm text-[#be123c]/70">No overdue subscriptions. 🎉</p>
              ) : overdueSubs.map(overdue => (
                <div key={overdue.id} className="bg-white border border-[#fecdd3] rounded-[var(--sa-radius-md)] p-4 text-sm">
                  <div className="font-bold text-gray-900 mb-0.5">{overdue.tenantName}</div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-mono text-[#be123c] font-bold">₵{(overdue.amountGhs ?? 0).toLocaleString()}</span>
                    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Overdue</span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button 
                      onClick={() => toast.success(`Automated reminder dispatched to ${overdue.tenantName}`)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white bg-[#be123c] hover:bg-[#9f1239] rounded-full transition-colors sa-btn-hover">
                      <BellRing size={12} /> Remind
                    </button>
                    <button 
                      onClick={() => toast.error(`Account suspended for ${overdue.tenantName}`)}
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
              <p className="text-xs text-[#7a9a8c]">Manage global plan tiers & features.</p>
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
                    Configure →
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
