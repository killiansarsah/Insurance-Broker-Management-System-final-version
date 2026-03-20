import { Activity } from 'lucide-react';
import { LiveDot } from '@/components/super-admin/LiveDot';

const mockActivities = [
  { id: 1, type: 'critical', actor: 'System Auto-Scaling', action: 'Provisioned 3 new worker nodes', tenant: 'Platform Infra', time: '2m ago' },
  { id: 2, type: 'success', actor: 'Vanguard Admin', action: 'Upgraded subscription to Enterprise tier', tenant: 'Vanguard Insurance', time: '14m ago' },
  { id: 3, type: 'info', actor: 'NIC Monitor bot', action: 'Completed daily compliance sweep (0 flags)', tenant: 'All Tenants', time: '1h ago' },
  { id: 4, type: 'warning', actor: 'S3 Storage Watch', action: 'Nearing 80% quota threshold for document storage', tenant: 'Horizon Brokers Ltd', time: '3h ago' },
  { id: 5, type: 'info', actor: 'Super Admin: K. Sarsah', action: 'Triggered global cache invalidation', tenant: 'Platform Core', time: '5h ago' },
];

export function ActivityFeed() {
  return (
    <div 
      className="p-5 flex flex-col sa-card-hover"
      style={{
        backgroundColor: 'var(--sa-bg-card)',
        border: '1px solid var(--sa-border)',
        borderRadius: 'var(--sa-radius-md)',
        height: '100%',
        minHeight: 380,
        boxShadow: 'var(--sa-shadow-card)',
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-bold font-serif text-[var(--sa-text-primary)] mb-1">Live Global Feed</h3>
          <p className="text-xs text-[var(--sa-text-muted)]">Aggregated platform events</p>
        </div>
        <Activity size={24} className="text-[#0ea5e9] opacity-20" />
      </div>

      <div className="flex-1 overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
        <ul className="space-y-4">
          {mockActivities.map((event, idx) => (
            <li 
              key={event.id}
              className="flex items-start gap-4 sa-reveal"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <div className="mt-1 shrink-0">
                <LiveDot 
                  color={
                    event.type === 'success' ? 'green' : 
                    event.type === 'warning' ? 'amber' : 
                    event.type === 'critical' ? 'red' : 'sky'
                  } 
                  size={6} 
                />
              </div>
              <div className="flex-1 min-w-0 font-sans">
                <div className="text-xs font-bold text-gray-900 leading-tight">
                  <span className="text-[#0c6a55]">{event.actor}</span>
                  <span className="mx-1 text-[#d4e0dc]">·</span>
                  <span className="font-mono text-[#7a9a8c]">{event.time}</span>
                </div>
                <p className="text-sm text-gray-700 mt-0.5 leading-snug">
                  {event.action}
                </p>
                <p className="text-[10px] text-[#5DCAA5] font-mono tracking-widest uppercase mt-1">
                  Tenant: {event.tenant}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
