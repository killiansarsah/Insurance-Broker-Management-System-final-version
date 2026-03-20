'use client';

import { toast } from 'sonner';
import { PageHeader } from '@/components/super-admin/PageHeader';
import { StatCard } from '@/components/super-admin/StatCard';
import { LiveDot } from '@/components/super-admin/LiveDot';
import { useLiveMetric } from '@/hooks/super-admin/useLiveMetric';
import { Activity, Database, Server, Mail, Zap, CheckCircle2, AlertTriangle, XCircle, RefreshCcw } from 'lucide-react';

const mockServices = [
  { id: 'api', name: 'Core API Gateway', status: 'healthy', uptime: '99.99%', latency: '45ms', lastChecked: 'Just now', icon: Activity },
  { id: 'db', name: 'PostgreSQL Primary', status: 'healthy', uptime: '100%', latency: '12ms', lastChecked: 'Just now', icon: Database },
  { id: 'redis', name: 'Redis Cache', status: 'degraded', uptime: '99.95%', latency: '150ms', lastChecked: '1m ago', icon: Zap },
  { id: 'workers', name: 'Background Workers', status: 'healthy', uptime: '99.98%', latency: '-', lastChecked: 'Just now', icon: Server },
  { id: 'email', name: 'SMTP Relay', status: 'healthy', uptime: '100%', latency: '120ms', lastChecked: '2m ago', icon: Mail },
];

const mockJobs = [
  { id: 1, name: 'Process Policy Renewals', status: 'running', count: 142, nextRun: 'In 5m' },
  { id: 2, name: 'Daily Backup Sync', status: 'completed', count: 1, nextRun: 'Tomorrow 02:00' },
  { id: 3, name: 'NIC Sync Webhook', status: 'failed', count: 7, nextRun: 'Retrying...' },
];

export default function SystemHealthPage() {
  const { data, loading } = useLiveMetric('/platform-admin/health/detailed', 30000);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle2 className="text-[#1D9E75]" size={16} />;
      case 'degraded': return <AlertTriangle className="text-[#ca8a04]" size={16} />;
      case 'down': return <XCircle className="text-[#b91c1c]" size={16} />;
      default: return <Activity className="text-[#7a9a8c]" size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'green';
      case 'degraded': return 'amber';
      case 'down': return 'red';
      default: return 'sky';
    }
  };

  return (
    <div className="space-y-6 sa-stagger">
      <PageHeader
        title="System Health"
        subtitle="Live infrastructure telemetry, service status, and scheduled jobs."
        icon={Activity}
        breadcrumbs={[
          { label: 'Overview', href: '/super-admin' },
          { label: 'System Health', href: '/super-admin/system-health' }
        ]}
        actions={
          <button 
            onClick={() => toast.success('Telemetry force refreshed.')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--sa-text-primary)] bg-[var(--sa-bg-card)] border border-[var(--sa-border)] hover:bg-[var(--sa-bg-page)] rounded-full transition-colors sa-btn-hover">
            <RefreshCcw size={14} /> Force Refresh
          </button>
        }
      />

      {/* High-level metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Global Uptime" suffix="%" value={99.98} icon={Activity} iconColor="#1D9E75" onClick={() => toast.info('Uptime SLA data opened.')} />
        <StatCard label="Active DB Conns" value={142} change={-12} icon={Database} iconColor="#0369a1" onClick={() => toast.info('Database pool visualization active.')} />
        <StatCard label="Cache Hit Rate" suffix="%" value={88.4} change={-2.1} changeLabel="degraded" icon={Zap} iconColor="#ca8a04" onClick={() => toast.warning('Cache invalidation rates high.')} />
        <StatCard label="Failed Jobs (24h)" value={7} change={7} changeLabel="spike" icon={Server} iconColor="#b91c1c" onClick={() => toast.error('Monitoring job queue backups.')} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        {/* Services Grid */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-bold font-serif text-[#0c6a55] uppercase tracking-widest">Core Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mockServices.map((service, idx) => (
              <div 
                key={service.id}
                className="p-4 rounded-[var(--sa-radius-md)] border border-[#085041] bg-[#021a13] text-[#f0f4f3] sa-card-hover sa-reveal"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-[8px] bg-[#05291e]">
                      <service.icon size={18} className="text-[#5DCAA5]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm tracking-wide">{service.name}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <LiveDot color={getStatusColor(service.status)} size={6} />
                        <span className="text-[10px] uppercase font-mono tracking-widest text-[#7a9a8c]">
                          {service.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  {getStatusIcon(service.status)}
                </div>
                
                <div className="grid grid-cols-3 gap-2 border-t border-[#085041] pt-3 mt-3">
                  <div>
                    <div className="text-[10px] text-[#7a9a8c] uppercase tracking-wider mb-0.5">Uptime</div>
                    <div className="font-mono text-sm">{service.uptime}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#7a9a8c] uppercase tracking-wider mb-0.5">Latency</div>
                    <div className="font-mono text-sm">{service.latency}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#7a9a8c] uppercase tracking-wider mb-0.5">Checked</div>
                    <div className="font-mono text-xs">{service.lastChecked}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Background Jobs */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold font-serif text-[#0c6a55] uppercase tracking-widest">Job Queues</h2>
          <div className="bg-[var(--sa-bg-card)] border border-[var(--sa-border)] rounded-[var(--sa-radius-md)] flex flex-col min-h-0 h-full max-h-[500px]">
            <div className="p-4 border-b border-[var(--sa-border)] flex items-center justify-between">
              <span className="text-sm font-bold text-[var(--sa-text-primary)]">Active Queues</span>
              <span className="text-xs font-mono font-bold bg-[var(--sa-bg-page)] px-2 py-1 rounded-[8px] text-[var(--sa-text-secondary)]">24 items</span>
            </div>
            <div className="overflow-y-auto p-0 hide-scrollbar">
              <ul className="divide-y divide-[var(--sa-bg-page)]">
                {mockJobs.map(job => (
                  <li key={job.id} className="p-4 hover:bg-[var(--sa-bg-page)] transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-sm text-[var(--sa-text-primary)]">{job.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-[8px] font-mono tracking-wider uppercase font-bold
                        ${job.status === 'running' ? 'bg-[#D0F0E4] text-[#0f6e56]' : 
                          job.status === 'failed' ? 'bg-[#fee2e2] text-[#b91c1c]' : 
                          'bg-[#f1f5f9] text-[#475569]'}`}
                      >
                        {job.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 font-mono">
                      <span>Count: {job.count}</span>
                      <span>{job.nextRun}</span>
                    </div>
                    {job.status === 'failed' && (
                      <button 
                        onClick={() => toast.info(`Retrying ${job.name}...`)}
                        className="mt-3 text-xs font-bold text-[#b91c1c] hover:underline uppercase tracking-wider">
                        Retry Failed →
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
