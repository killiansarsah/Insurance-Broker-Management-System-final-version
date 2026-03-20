'use client';

import { Activity } from 'lucide-react';
import { LiveDot } from '@/components/super-admin/LiveDot';
import { useLiveMetric } from '@/hooks/super-admin/useLiveMetric';
import { SkeletonLoader } from '@/components/super-admin/SkeletonLoader';

interface AuditLogEntry {
  id: string;
  actorEmail: string;
  actorRole: string;
  category: string;
  severity: string;
  action: string;
  description: string;
  tenantName: string | null;
  createdAt: string;
  status: string;
}

interface ActivityFeedResponse {
  data: AuditLogEntry[];
}

function timeAgo(dateStr: string): string {
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

function severityToColor(severity: string): 'green' | 'amber' | 'red' | 'sky' {
  switch (severity) {
    case 'CRITICAL': return 'red';
    case 'HIGH': return 'amber';
    case 'MEDIUM': return 'sky';
    default: return 'green';
  }
}

export function ActivityFeed() {
  const { data: response, loading } = useLiveMetric<ActivityFeedResponse>('/platform-admin/overview/activity-feed', 30_000);
  const activities = response?.data ?? [];

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
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <SkeletonLoader key={i} className="w-full h-14 rounded" />
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="flex items-center justify-center h-full text-[var(--sa-text-muted)] text-sm">
            No recent activity yet.
          </div>
        ) : (
          <ul className="space-y-4">
            {activities.map((event, idx) => (
              <li 
                key={event.id}
                className="flex items-start gap-4 sa-reveal"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <div className="mt-1 shrink-0">
                  <LiveDot 
                    color={severityToColor(event.severity)} 
                    size={6} 
                  />
                </div>
                <div className="flex-1 min-w-0 font-sans">
                  <div className="text-xs font-bold text-[var(--sa-text-primary)] leading-tight">
                    <span className="text-[#0c6a55]">{event.actorEmail ?? 'System'}</span>
                    <span className="mx-1 text-[var(--sa-border)]">·</span>
                    <span className="font-mono text-[var(--sa-text-muted)]">{timeAgo(event.createdAt)}</span>
                  </div>
                  <p className="text-sm text-[var(--sa-text-secondary)] mt-0.5 leading-snug">
                    {event.description || event.action}
                  </p>
                  {event.tenantName && (
                    <p className="text-[10px] text-[#5DCAA5] font-mono tracking-widest uppercase mt-1">
                      Tenant: {event.tenantName}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
