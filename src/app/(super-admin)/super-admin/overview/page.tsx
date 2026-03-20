'use client';

import { PageHeader } from '@/components/super-admin/PageHeader';
import { AlertBanner } from '@/components/super-admin/AlertBanner';
import { StatCard } from '@/components/super-admin/StatCard';
import { LiveDot } from '@/components/super-admin/LiveDot';
import { useLiveMetric } from '@/hooks/super-admin/useLiveMetric';
import { TenantGrowthChart } from '@/components/super-admin/overview-charts/TenantGrowthChart';
import { MrrBreakdownChart } from '@/components/super-admin/overview-charts/MrrBreakdownChart';
import { RevenueTrendChart } from '@/components/super-admin/overview-charts/RevenueTrendChart';
import { ApiVolumeChart } from '@/components/super-admin/overview-charts/ApiVolumeChart';
import { TopTenantsTable } from '@/components/super-admin/overview-tables/TopTenantsTable';
import { ActivityFeed } from '@/components/super-admin/overview-tables/ActivityFeed';

import { 
  Building2, 
  Users, 
  CreditCard, 
  ShieldAlert, 
  Activity, 
  Clock, 
  Zap,
  ServerCrash,
  LayoutGrid,
  Plus,
  Download,
  Megaphone,
  Stethoscope,
  ToggleLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function SuperAdminOverviewPage() {
  const router = useRouter();

  // In a real scenario, this hook fetches real data. We use it to simulate loading.
  const { data: systemHealth, loading: healthLoading } = useLiveMetric('/platform-admin/health', 60000);

  const mockSystemStatus = [
    { name: 'API Services', status: 'green' as const },
    { name: 'Database DB-1', status: 'green' as const },
    { name: 'Background Workers', status: 'sky' as const },
    { name: 'Email Broker', status: 'green' as const },
  ];

  return (
    <div className="space-y-6 sa-stagger">
      
      {/* 1. Header & Breadcrumbs */}
      <PageHeader
        title="Command Centre"
        subtitle="Platform-wide telemetry, billing, and operational metrics."
        icon={LayoutGrid}
      />

      {/* 2. Top Alert Strip */}
      <div className="flex flex-col gap-2">

        <AlertBanner 
          severity="critical" 
          message="NIC Compliance Error: 3 tenants have expired licenses and need immediate attention." 
          actionLabel="Review Tenants →" 
          onAction={() => router.push('/super-admin/tenants?filter=expired')}
        />
        <AlertBanner 
          severity="warning" 
          message="Background Jobs: High queue latency detected (avg. 45s wait time)." 
          actionLabel="View Queue →" 
          onAction={() => toast.warning('Queue visibility module requires higher permissions.')}
        />
      </div>

      {/* 3. Live System Status Bar */}
      <div 
        className="flex flex-wrap items-center gap-6 px-4 py-3 text-xs font-mono font-bold tracking-wider sa-card-hover"
        style={{ 
          backgroundColor: 'var(--sa-bg-card-alt)', 
          border: '1px solid var(--sa-border)',
          borderRadius: 'var(--sa-radius-md)',
          color: 'var(--sa-text-muted)' 
        }}
      >
        <span className="uppercase text-[#5DCAA5]">System Status:</span>
        {mockSystemStatus.map((sys, i) => (
          <span key={sys.name} className="flex items-center gap-2">
            {i > 0 && <span className="opacity-30">|</span>}
            <LiveDot color={sys.status} size={6} />
            {sys.name}
          </span>
        ))}
      </div>

      {/* 4. Extreme Asymmetric Business Metrics */}
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
          
          {/* THE GIANT 90: Colorful Ambient Hero */}
          <div className="lg:col-span-9 flex flex-col justify-end p-8 relative overflow-hidden group transition-all duration-500 sa-card-hover" 
               style={{ backgroundColor: 'var(--sa-bg-card)', minHeight: '320px', borderRadius: 'var(--sa-radius-lg)', border: '1px solid var(--sa-border)', boxShadow: 'var(--sa-shadow-card)' }}>
            
            {/* Colorful Ambient Glows inside the Hero (No Purple per Rules) */}
            <div className="absolute top-[-50%] left-[-10%] w-[100%] h-[150%] opacity-15 group-hover:opacity-25 transition-opacity duration-1000 pointer-events-none blur-3xl" style={{ background: 'radial-gradient(circle at top left, #0ea5e9, transparent 60%)' }} />
            <div className="absolute bottom-[-50%] right-[-10%] w-[80%] h-[120%] opacity-15 group-hover:opacity-25 transition-opacity duration-1000 pointer-events-none blur-3xl" style={{ background: 'radial-gradient(circle at bottom right, #f43f5e, transparent 60%)' }} />
            <div className="absolute top-[20%] right-[20%] w-[60%] h-[60%] opacity-5 group-hover:opacity-15 transition-opacity duration-1000 pointer-events-none blur-2xl" style={{ background: 'radial-gradient(circle at center, #f59e0b, transparent 50%)' }} />

            <div className="relative z-10 flex flex-col">
              <span className="text-sm font-bold tracking-wider uppercase text-[var(--sa-text-muted)] mb-4 flex items-center gap-2">
                <Activity size={16} className="text-[#0ea5e9]" /> Live Platform ARR
              </span>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl sm:text-7xl font-bold tracking-tight text-[var(--sa-text-primary)]" style={{ fontFamily: "'DM Mono', monospace" }}>
                  <span className="opacity-50 text-2xl sm:text-4xl relative top-[-1rem] mr-1">₵</span>1.01<span className="text-[#0ea5e9]">M</span>
                </span>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <span className="px-3 py-1.5 text-[11px] font-bold bg-[#10b981]/10 text-[#10b981] rounded-full flex items-center gap-1 border border-[#10b981]/20 uppercase tracking-wider">
                  ▲ +15.2% YoY
                </span>
                <span className="text-xs text-[var(--sa-text-muted)] tracking-wide font-medium flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0ea5e9] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0284c7]"></span>
                  </span>
                  Real-time sync active
                </span>
              </div>
            </div>
          </div>

          {/* THE COMPRESSED 10: Stacked auxiliary data */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <StatCard label="Total Tenants" value={142} change={4.2} changeLabel="this month" icon={Building2} iconColor="#f59e0b" onClick={() => router.push('/super-admin/tenants')} />
            <StatCard label="Platform MRR" prefix="₵" value={84500} formatValue={(v) => (v / 1000).toFixed(1) + 'k'} change={12.4} changeLabel="vs last month" icon={CreditCard} iconColor="#10b981" onClick={() => router.push('/super-admin/subscriptions')} />
            <div className="grid grid-cols-2 gap-4 flex-1">
              <StatCard label="Churn" suffix="%" value={1.2} change={-0.4} icon={Users} iconColor="#0ea5e9" onClick={() => router.push('/super-admin/users')} />
              <StatCard label="Risks" value={7} change={15} icon={ShieldAlert} iconColor="#f43f5e" onClick={() => router.push('/super-admin/nic-monitoring')} />
            </div>
          </div>
          
        </div>
      </section>

      {/* 5. Platform Health (Row 2) */}
      <section>
        <h2 className="text-sm font-bold font-serif text-[#0c6a55] mb-3 uppercase tracking-widest mt-8">Platform Health</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="API Uptime (30d)" suffix="%" value={99.98} icon={Activity} iconColor="#10b981" loading={healthLoading} onClick={() => toast.info('API Telemetry details opening...')} />
          <StatCard label="Avg Response" suffix="ms" value={142} change={-12} changeLabel="improvement" icon={Clock} iconColor="#0ea5e9" loading={healthLoading} onClick={() => toast.info('Performance tracing enabled.')} />
          <StatCard label="Active Sessions" value={2840} change={5.4} icon={Users} iconColor="#f59e0b" loading={healthLoading} onClick={() => toast.info('Session management opens below.')} />
          <StatCard label="Errors (24h)" value={23} change={45} changeLabel="spike" icon={ServerCrash} iconColor="#f43f5e" loading={healthLoading} onClick={() => toast.error('23 critical runtime exceptions listed.')} />
        </div>
      </section>

      {/* 6. Charts Section (Row 1) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        <div className="lg:col-span-2">
          <TenantGrowthChart />
        </div>
        <div className="lg:col-span-1">
          <MrrBreakdownChart />
        </div>
      </section>

      {/* 7. Charts Section (Row 2) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        <RevenueTrendChart />
        <ApiVolumeChart />
      </section>

      {/* 8. Bottom Data Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 pb-12 items-stretch">
        <div className="lg:col-span-2 h-full flex flex-col">
          <TopTenantsTable />
        </div>
        <div className="lg:col-span-1 h-full flex flex-col">
          <ActivityFeed />
        </div>
      </section>

      {/* 9. Quick Actions Fixed Bar (Optional desktop placement) */}
      <section className="fixed bottom-0 left-[var(--sa-sidebar-collapsed)] lg:left-[var(--sa-sidebar-width)] right-0 
        bg-[var(--sa-bg-sidebar)] border-t border-[var(--sa-border)] px-6 py-3 z-20 
        flex items-center gap-4 transition-all duration-[var(--transition-slow)]"
        style={{ boxShadow: 'var(--sa-shadow-sidebar)' }}>
        <h2 className="text-xs font-bold font-serif text-[var(--sa-text-secondary)] uppercase tracking-widest pr-4 border-r border-[var(--sa-border)]">
          Command Actions
        </h2>
        <div className="flex flex-wrap gap-2 overflow-x-auto whitespace-nowrap hide-scrollbar">
          <button 
            onClick={() => router.push('/super-admin/tenants/new')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#021a13] bg-[#10b981] hover:bg-[#34d399] rounded-full transition-colors sa-btn-hover shrink-0">
            <Plus size={14} /> New Tenant
          </button>
          <button 
            onClick={() => toast.success('Platform Report generation started. You will be notified when complete.')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--sa-text-secondary)] bg-transparent border border-[var(--sa-border)] hover:bg-[var(--sa-bg-card-alt)] rounded-full transition-colors sa-btn-hover shrink-0">
            <Download size={14} /> Report
          </button>
          <button 
            onClick={() => toast.info('Global Announcement tool initialized.')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--sa-text-secondary)] bg-transparent border border-[var(--sa-border)] hover:bg-[var(--sa-bg-card-alt)] rounded-full transition-colors sa-btn-hover shrink-0">
            <Megaphone size={14} /> Announce
          </button>
          <button 
             onClick={() => router.push('/super-admin/nic-monitoring')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--sa-text-secondary)] bg-transparent border border-[var(--sa-border)] hover:bg-[var(--sa-bg-card-alt)] rounded-full transition-colors sa-btn-hover shrink-0">
            <Stethoscope size={14} /> Audit
          </button>
          <button 
            onClick={() => router.push('/super-admin/feature-flags')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--sa-text-secondary)] bg-transparent border border-[var(--sa-border)] hover:bg-[var(--sa-bg-card-alt)] rounded-full transition-colors sa-btn-hover shrink-0">
            <ToggleLeft size={14} /> Flags
          </button>
        </div>
      </section>

    </div>
  );
}
