'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/super-admin/PageHeader';
import { StatCard } from '@/components/super-admin/StatCard';
import { DataTable } from '@/components/super-admin/DataTable';
import { StatusPill } from '@/components/super-admin/StatusPill';
import { SlideDrawer } from '@/components/super-admin/SlideDrawer';
import {
  CreditCard, TrendingUp, AlertCircle, Ban, RefreshCcw,
  BellRing, ExternalLink, Zap, CheckCircle2, Clock
} from 'lucide-react';
import { RevenueTrendChart } from '@/components/super-admin/overview-charts/RevenueTrendChart';
import { apiClient } from '@/lib/api-client';
import { useLiveMetric } from '@/hooks/super-admin/useLiveMetric';

interface SubscriptionRow {
  id: string;
  tenantId: string;
  plan: string;
  billingCycle: string;
  amountGhs: number;
  status: string;
  currentPeriodEnd: string | null;
  tenant: {
    name: string;
    slug: string;
    tenantStatus: string;
    trialEndsAt: string | null;
    adminEmail: string;
  };
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
    activeTrials: number;
    mrrGrowth: number;
    churnGrowth: number;
  };
}

const PLAN_RATES = {
  BASIC: { monthly: 299, annual: 299 * 12 * 0.9 },
  PROFESSIONAL: { monthly: 599, annual: 599 * 12 * 0.9 },
  ENTERPRISE: { monthly: 1299, annual: 1299 * 12 * 0.9 },
};

type TabId = 'active' | 'trials' | 'overdue' | 'all';

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000);
}

function TrialCountdown({ trialEndsAt }: { trialEndsAt: string | null }) {
  const days = daysUntil(trialEndsAt);
  if (days === null) return <span className="text-[var(--sa-text-muted)] text-xs">—</span>;
  if (days <= 0) return <span className="text-[10px] font-bold text-[#b91c1c] uppercase tracking-wider">Expired</span>;
  const color = days <= 5 ? 'text-[#b91c1c]' : days <= 14 ? 'text-[#ca8a04]' : 'text-[#0369a1]';
  return (
    <span className={`font-mono text-xs font-bold ${color} flex items-center gap-1`}>
      <Clock size={12} /> {days}d left
    </span>
  );
}

export default function SubscriptionsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('active');
  const [subs, setSubs] = useState<SubscriptionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedSub, setSelectedSub] = useState<SubscriptionRow | null>(null);
  const [convertPlan, setConvertPlan] = useState<'BASIC' | 'PROFESSIONAL' | 'ENTERPRISE'>('PROFESSIONAL');
  const [convertCycle, setConvertCycle] = useState<'MONTHLY' | 'ANNUAL'>('MONTHLY');

  const { data: billingStats, loading: statsLoading } = useLiveMetric<BillingStats>(
    '/platform-admin/billing/stats', 60_000
  );
  const stats = billingStats?.data;

  const statusForTab: Record<TabId, string | undefined> = {
    active: 'ACTIVE',
    trials: 'TRIAL',
    overdue: 'OVERDUE',
    all: undefined,
  };

  const fetchSubs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<SubsApiResponse>('/platform-admin/billing/subscriptions', {
        status: statusForTab[activeTab],
        limit: 50,
      });
      setSubs(res.data ?? []);
    } catch {
      toast.error('Failed to load subscriptions.');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => { fetchSubs(); }, [fetchSubs]);

  const handleSyncPayments = async () => {
    try {
      toast.info('Syncing all subscription statuses...');
      const res = await apiClient.post<{ data: { expiredTrialsMarked: number; overdueActiveMarked: number } }>(
        '/platform-admin/billing/sync', {}
      );
      const { expiredTrialsMarked, overdueActiveMarked } = res.data;
      toast.success('Sync complete.', {
        description: `${expiredTrialsMarked} expired trials and ${overdueActiveMarked} overdue subscriptions updated.`,
      });
      fetchSubs();
    } catch {
      toast.error('Failed to sync payment gateway.');
    }
  };

  const handleRemind = async (sub: SubscriptionRow) => {
    setActionLoading(sub.id + '-remind');
    try {
      await apiClient.post(`/platform-admin/billing/subscriptions/${sub.id}/remind`, {});
      toast.success(`Reminder dispatched to ${sub.tenant.name}`, {
        description: `Sent to ${sub.tenant.adminEmail}`,
      });
    } catch {
      toast.error(`Failed to send reminder.`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSuspend = async (sub: SubscriptionRow) => {
    if (!confirm(`Suspend ${sub.tenant.name}? This will lock all their users out.`)) return;
    setActionLoading(sub.id + '-suspend');
    try {
      await apiClient.post(`/platform-admin/tenants/${sub.tenantId}/suspend`, {
        reason: 'Subscription overdue — suspended by platform admin.',
      });
      toast.success(`${sub.tenant.name} has been suspended.`);
      fetchSubs();
    } catch {
      toast.error(`Failed to suspend tenant.`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleConvertToPaid = async () => {
    if (!selectedSub) return;
    if (!confirm(`Convert ${selectedSub.tenant.name} from TRIAL to paid ${convertPlan} (${convertCycle})? This will activate their account immediately.`)) return;

    setActionLoading(selectedSub.id + '-convert');
    try {
      await apiClient.post(`/platform-admin/billing/subscriptions/${selectedSub.id}/convert`, {
        plan: convertPlan,
        billingCycle: convertCycle,
      });
      toast.success(`${selectedSub.tenant.name} successfully onboarded!`, {
        description: `Account activated on ${convertPlan} ${convertCycle} plan. Audit record created.`,
      });
      setSelectedSub(null);
      fetchSubs();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Conversion failed.');
    } finally {
      setActionLoading(null);
    }
  };

  const TABS: { id: TabId; label: string; badge?: number }[] = [
    { id: 'active', label: 'Active' },
    { id: 'trials', label: 'Trials', badge: stats?.activeTrials },
    { id: 'overdue', label: 'Overdue' },
    { id: 'all', label: 'All' },
  ];

  const columns = [
    {
      header: 'Tenant',
      accessorKey: 'tenant',
      cell: (row: SubscriptionRow) => (
        <div>
          <div className="font-bold text-[var(--sa-text-primary)]">{row.tenant?.name}</div>
          <div className="font-mono text-[10px] text-[#7a9a8c]">{row.tenant?.adminEmail}</div>
        </div>
      ),
    },
    {
      header: 'Plan',
      accessorKey: 'plan',
      cell: (row: SubscriptionRow) => (
        <span className="text-xs font-semibold px-2 py-1 bg-[var(--sa-bg-card-alt)] rounded-sm text-[var(--sa-text-primary)]">
          {row.plan}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: SubscriptionRow) => (
        <div className="flex flex-col gap-1">
          <StatusPill status={row.status?.toLowerCase()} />
          {row.status === 'TRIAL' && (
            <TrialCountdown trialEndsAt={row.tenant?.trialEndsAt ?? null} />
          )}
        </div>
      ),
    },
    {
      header: 'Rate / Period',
      accessorKey: 'amountGhs',
      cell: (row: SubscriptionRow) => (
        <div>
          <span className="font-mono text-sm text-[#0c6a55] font-bold">
            {row.status === 'TRIAL' ? 'Free Trial' : `₵${(row.amountGhs ?? 0).toLocaleString()}`}
          </span>
          {row.currentPeriodEnd && row.status !== 'TRIAL' && (
            <div className="text-[10px] text-[var(--sa-text-muted)] font-mono">
              ends {new Date(row.currentPeriodEnd).toLocaleDateString()}
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      cell: (row: SubscriptionRow) => (
        <div className="flex gap-2">
          {row.status === 'TRIAL' && (
            <button
              onClick={(e) => { e.stopPropagation(); setSelectedSub(row); }}
              className="flex items-center gap-1 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white bg-[#1D9E75] hover:bg-[#0f6e56] rounded-full transition-colors sa-btn-hover"
            >
              <Zap size={11} /> Convert
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); handleRemind(row); }}
            disabled={actionLoading === row.id + '-remind'}
            title="Send reminder"
            className="p-1.5 text-[var(--sa-text-muted)] hover:text-[#ca8a04] hover:bg-[#fef9c3] transition-colors rounded-full disabled:opacity-40"
          >
            <BellRing size={14} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setSelectedSub(row); }}
            title="View billing profile"
            className="p-1.5 text-[var(--sa-text-muted)] hover:text-[#1D9E75] hover:bg-[#D0F0E4] transition-colors rounded-full"
          >
            <ExternalLink size={14} />
          </button>
        </div>
      ),
    },
  ];

  const convertedAmount = PLAN_RATES[convertPlan]?.[convertCycle === 'MONTHLY' ? 'monthly' : 'annual'] ?? 0;

  return (
    <div className="space-y-6 sa-stagger">
      <PageHeader
        title="Revenue & Subscriptions"
        subtitle="Manage billing cycles, tenant plans, trial conversions, and overdue collections."
        icon={CreditCard}
        breadcrumbs={[
          { label: 'Overview', href: '/super-admin' },
          { label: 'Billing', href: '/super-admin/subscriptions' }
        ]}
        actions={
          <button
            onClick={handleSyncPayments}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--sa-text-primary)] bg-[var(--sa-bg-card)] border border-[var(--sa-border)] hover:bg-[var(--sa-bg-page)] rounded-full transition-colors sa-btn-hover"
          >
            <RefreshCcw size={14} /> Sync Statuses
          </button>
        }
      />

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Monthly Recurring Rev" prefix="₵" value={stats?.mrr ?? 0} formatValue={(v) => (v / 1000).toFixed(1) + 'k'} icon={TrendingUp} iconColor="#1d9e75" loading={statsLoading} />
        <StatCard label="Overdue Balance" prefix="₵" value={stats?.overdueBalance ?? 0} formatValue={(v) => (v / 1000).toFixed(1) + 'k'} icon={AlertCircle} iconColor="#b91c1c" loading={statsLoading} />
        <StatCard label="New Revenue (30d)" prefix="₵" value={stats?.newRevenue30d ?? 0} formatValue={(v) => (v / 1000).toFixed(1) + 'k'} icon={CreditCard} iconColor="#0369a1" loading={statsLoading} />
        <StatCard label="Churned Revenue" prefix="₵" value={stats?.churnedRevenue ?? 0} formatValue={(v) => (v / 1000).toFixed(1) + 'k'} icon={Ban} iconColor="#ca8a04" loading={statsLoading} />
        <StatCard label="Active Trials" value={stats?.activeTrials ?? 0} icon={Clock} iconColor="#7c3aed" loading={statsLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Chart + Table */}
        <div className="lg:col-span-2 space-y-6">
          <RevenueTrendChart />

          {/* Tabs */}
          <div className="bg-[var(--sa-bg-card)] rounded-[var(--sa-radius-md)] border border-[var(--sa-border)] shadow-sm overflow-hidden">
            <div className="flex border-b border-[var(--sa-border)]">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 -mb-px ${
                    activeTab === tab.id
                      ? 'border-[#1D9E75] text-[#1D9E75]'
                      : 'border-transparent text-[var(--sa-text-muted)] hover:text-[var(--sa-text-primary)]'
                  }`}
                >
                  {tab.label}
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="bg-[#7c3aed] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Trial info banner */}
            {activeTab === 'trials' && (
              <div className="p-3 bg-[#f5f3ff] border-b border-[#ddd6fe] flex items-start gap-3">
                <Zap size={16} className="text-[#7c3aed] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-[#4c1d95]">Trial Conversion Queue</p>
                  <p className="text-xs text-[#6d28d9] mt-0.5">
                    Tenants below are on a 30-day free trial. Click <strong>Convert</strong> to onboard them onto a paid plan — this activates the tenant, sets billing dates, and generates an audit record.
                  </p>
                </div>
              </div>
            )}

            <DataTable
              data={subs as any}
              columns={columns as any}
              loading={loading}
              onRowClick={(row: any) => setSelectedSub(row as SubscriptionRow)}
            />
          </div>
        </div>

        {/* Right: Overdue + Conversion summary */}
        <div className="space-y-6">
          {/* Overdue Action Panel */}
          <div className="bg-[#fff1f2] border border-[#fecdd3] rounded-[var(--sa-radius-md)] p-5">
            <div className="flex items-center gap-2 text-[#be123c] mb-3">
              <AlertCircle size={18} />
              <h3 className="text-sm font-bold uppercase tracking-widest">Collections Due</h3>
            </div>
            {subs.filter(s => s.status === 'OVERDUE').length === 0 ? (
              <p className="text-sm text-[#be123c]/60 flex items-center gap-2">
                <CheckCircle2 size={16} /> No overdue subscriptions.
              </p>
            ) : (
              <div className="space-y-3">
                {subs.filter(s => s.status === 'OVERDUE').map(sub => (
                  <div key={sub.id} className="bg-white border border-[#fecdd3] rounded-[var(--sa-radius-md)] p-3">
                    <div className="font-bold text-sm text-gray-900">{sub.tenant.name}</div>
                    <div className="font-mono text-[#be123c] font-bold text-sm mt-1">
                      ₵{(sub.amountGhs ?? 0).toLocaleString()}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleRemind(sub)}
                        disabled={actionLoading === sub.id + '-remind'}
                        className="flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white bg-[#be123c] hover:bg-[#9f1239] rounded-full transition-colors disabled:opacity-50"
                      >
                        <BellRing size={11} className="inline mr-1" />
                        {actionLoading === sub.id + '-remind' ? '...' : 'Remind'}
                      </button>
                      <button
                        onClick={() => handleSuspend(sub)}
                        disabled={actionLoading === sub.id + '-suspend'}
                        className="flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#9f1239] border border-[#fecdd3] hover:bg-[#ffe4e6] rounded-full transition-colors disabled:opacity-50"
                      >
                        {actionLoading === sub.id + '-suspend' ? '...' : 'Suspend'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* How Trial Conversion Works */}
          <div className="bg-[#021a13] border border-[#085041] rounded-[var(--sa-radius-md)] p-5 text-[#9FE1CB]">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={18} className="text-[#5DCAA5]" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#5DCAA5]">Trial → Paid Flow</h3>
            </div>
            <ol className="space-y-3 text-xs text-[#7a9a8c]">
              {[
                'Tenant signs up via /start-trial → 30-day TRIAL workspace created.',
                'Super Admin reviews the Trials tab and clicks Convert.',
                'Choose plan tier (Basic / Pro / Enterprise) and billing cycle.',
                'System atomically: activates tenant, sets billing period, clears trialEndsAt.',
                'Audit event TRIAL_CONVERTED logged with full metadata.',
                'Optionally send a Reminder email before conversion.',
              ].map((step, i) => (
                <li key={i} className="flex gap-2">
                  <span className="w-5 h-5 flex-shrink-0 rounded-full bg-[#085041] text-[#5DCAA5] text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Billing Profile + Convert Drawer */}
      <SlideDrawer
        isOpen={!!selectedSub}
        onClose={() => setSelectedSub(null)}
        title={selectedSub ? `${selectedSub.tenant?.name ?? 'Subscription'}` : 'Billing Profile'}
      >
        {selectedSub && (
          <div className="space-y-6">
            {/* Status + Trial badge */}
            <div className="flex items-center gap-3">
              <StatusPill status={selectedSub.status?.toLowerCase()} />
              {selectedSub.status === 'TRIAL' && (
                <TrialCountdown trialEndsAt={selectedSub.tenant?.trialEndsAt ?? null} />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#7a9a8c] mb-1">Current Plan</h4>
                <p className="text-sm font-bold text-[var(--sa-text-primary)]">{selectedSub.plan}</p>
              </div>
              <div>
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#7a9a8c] mb-1">Billing Cycle</h4>
                <p className="text-sm text-[var(--sa-text-primary)]">{selectedSub.billingCycle}</p>
              </div>
              <div>
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#7a9a8c] mb-1">Current Rate</h4>
                <p className="font-mono text-sm font-bold text-[#0c6a55]">
                  {selectedSub.status === 'TRIAL' ? 'Free Trial' : `₵${(selectedSub.amountGhs ?? 0).toLocaleString()}`}
                </p>
              </div>
              <div>
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#7a9a8c] mb-1">Admin Email</h4>
                <p className="font-mono text-xs text-[var(--sa-text-primary)]">{selectedSub.tenant?.adminEmail}</p>
              </div>
            </div>

            {/* Trial Conversion Section */}
            {selectedSub.status === 'TRIAL' && (
              <div className="border border-[#7c3aed]/30 bg-[#f5f3ff] rounded-[var(--sa-radius-md)] p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-[#7c3aed]" />
                  <h4 className="text-sm font-bold text-[#4c1d95] uppercase tracking-wider">Convert to Paid Plan</h4>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#6d28d9] mb-1 block">Plan Tier</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['BASIC', 'PROFESSIONAL', 'ENTERPRISE'] as const).map(plan => (
                        <button
                          key={plan}
                          onClick={() => setConvertPlan(plan)}
                          className={`p-2 rounded-[var(--sa-radius-md)] border text-[10px] font-bold uppercase tracking-wider transition-colors ${
                            convertPlan === plan
                              ? 'border-[#7c3aed] bg-[#7c3aed] text-white'
                              : 'border-[#ddd6fe] text-[#4c1d95] hover:border-[#7c3aed]'
                          }`}
                        >
                          {plan}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#6d28d9] mb-1 block">Billing Cycle</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['MONTHLY', 'ANNUAL'] as const).map(cycle => (
                        <button
                          key={cycle}
                          onClick={() => setConvertCycle(cycle)}
                          className={`p-2 rounded-[var(--sa-radius-md)] border text-[10px] font-bold uppercase tracking-wider transition-colors ${
                            convertCycle === cycle
                              ? 'border-[#7c3aed] bg-[#7c3aed] text-white'
                              : 'border-[#ddd6fe] text-[#4c1d95] hover:border-[#7c3aed]'
                          }`}
                        >
                          {cycle} {cycle === 'ANNUAL' && <span className="text-[8px]">(-10%)</span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-white border border-[#ddd6fe] rounded-[var(--sa-radius-md)] font-mono text-sm text-[#4c1d95] font-bold">
                    ₵{convertedAmount.toFixed(2)} / {convertCycle === 'MONTHLY' ? 'month' : 'year'}
                  </div>
                </div>

                <button
                  onClick={handleConvertToPaid}
                  disabled={!!actionLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#7c3aed] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#6d28d9] transition-colors sa-btn-hover disabled:opacity-50"
                >
                  {actionLoading === selectedSub.id + '-convert'
                    ? <><RefreshCcw size={14} className="animate-spin" /> Activating...</>
                    : <><Zap size={14} /> Activate — Convert Trial to Paid</>
                  }
                </button>
              </div>
            )}

            {/* Actions for non-trial */}
            <div className="border-t border-[var(--sa-border)] pt-4 flex gap-3">
              <button
                onClick={() => handleRemind(selectedSub)}
                disabled={!!actionLoading}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full bg-[var(--sa-bg-card-alt)] border border-[var(--sa-border)] text-xs font-bold uppercase tracking-wider text-[var(--sa-text-primary)] hover:bg-[var(--sa-bg-page)] transition-colors disabled:opacity-50"
              >
                <BellRing size={14} /> Send Reminder
              </button>
              {selectedSub.status === 'OVERDUE' && (
                <button
                  onClick={() => handleSuspend(selectedSub)}
                  disabled={!!actionLoading}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full bg-[#be123c] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#9f1239] transition-colors disabled:opacity-50"
                >
                  Suspend Account
                </button>
              )}
            </div>
          </div>
        )}
      </SlideDrawer>
    </div>
  );
}
