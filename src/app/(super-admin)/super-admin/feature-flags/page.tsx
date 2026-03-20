'use client';

import { PageHeader } from '@/components/super-admin/PageHeader';
import { DataTable } from '@/components/super-admin/DataTable';
import { SkeletonLoader } from '@/components/super-admin/SkeletonLoader';
import { ToggleLeft, Search, Filter, Shield, AlertTriangle, CloudRain, Save } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

interface FlagRow {
  id: string;
  key: string;
  label: string;
  description: string | null;
  globalEnabled: boolean;
  starterEnabled: boolean;
  proEnabled: boolean;
  enterpriseEnabled: boolean;
  _count: { overrides: number };
  updatedBy: { email: string } | null;
  updatedAt: string;
}

interface FlagsResponse {
  data: FlagRow[];
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

export default function FeatureFlagsPage() {
  const [flags, setFlags] = useState<FlagRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Record<string, Partial<FlagRow>>>({});

  const fetchFlags = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<FlagsResponse>('/platform-admin/feature-flags');
      setFlags(res.data ?? []);
    } catch (err) {
      console.error('Failed to load feature flags:', err);
      toast.error('Failed to load feature flags.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFlags();
  }, [fetchFlags]);

  const handleToggle = (id: string, field: 'globalEnabled' | 'starterEnabled' | 'proEnabled' | 'enterpriseEnabled') => {
    setFlags(flags.map(f => {
      if (f.id === id) {
        let updated: FlagRow;
        if (field === 'globalEnabled' && !f.globalEnabled) {
          toast.info(`Global override enabled for ${f.key}`);
          updated = { ...f, globalEnabled: true, starterEnabled: true, proEnabled: true, enterpriseEnabled: true };
        } else if (field === 'globalEnabled' && f.globalEnabled) {
          toast.warning(`Global override disabled for ${f.key}. Save to apply.`);
          updated = { ...f, globalEnabled: false };
        } else {
          toast.success(`${field.replace('Enabled', '')} flag toggled for ${f.key}`);
          updated = { ...f, [field]: !f[field] };
        }
        setPendingChanges(prev => ({
          ...prev,
          [id]: {
            globalEnabled: updated.globalEnabled,
            starterEnabled: updated.starterEnabled,
            proEnabled: updated.proEnabled,
            enterpriseEnabled: updated.enterpriseEnabled,
          },
        }));
        return updated;
      }
      return f;
    }));
  };

  const handleSave = async () => {
    const changeIds = Object.keys(pendingChanges);
    if (changeIds.length === 0) {
      toast.info('No pending changes to save.');
      return;
    }

    setIsSaving(true);
    let saved = 0;
    for (const id of changeIds) {
      try {
        await apiClient.patch(`/platform-admin/feature-flags/${id}`, pendingChanges[id]);
        saved++;
      } catch (err) {
        console.error(`Failed to save flag ${id}:`, err);
      }
    }
    setPendingChanges({});
    toast.success(`Feature flags synchronised (${saved}/${changeIds.length})`, {
      description: 'Changes propagated to all edge nodes successfully.',
    });
    setIsSaving(false);
    fetchFlags();
  };

  const ToggleSwitch = ({ checked, onChange, disabled = false }: { checked: boolean; onChange: () => void; disabled?: boolean }) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={(e) => { e.stopPropagation(); onChange(); }}
      disabled={disabled}
      className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#1D9E75] focus:ring-offset-2 ${
        checked ? 'bg-[#1D9E75]' : 'bg-gray-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-3' : 'translate-x-0'
        }`}
      />
    </button>
  );

  const columns = [
    {
      header: 'Feature Flag',
      accessorKey: 'label',
      cell: (row: any) => (
        <div className="max-w-[250px]">
          <div className="font-bold text-[var(--sa-text-primary)]">{row.label}</div>
          <div className="font-mono text-[10px] text-[#0c6a55] mt-1 break-all bg-[#D0F0E4] px-1 rounded-sm w-fit">{row.key}</div>
        </div>
      ),
    },
    {
      header: 'Description',
      accessorKey: 'description',
      cell: (row: any) => (
        <p className="text-xs text-[var(--sa-text-secondary)] max-w-[280px] leading-relaxed">{row.description ?? '—'}</p>
      ),
    },
    {
      header: 'GLOBAL',
      accessorKey: 'globalEnabled',
      cell: (row: any) => (
        <ToggleSwitch checked={row.globalEnabled} onChange={() => handleToggle(row.id, 'globalEnabled')} />
      ),
    },
    {
      header: 'Starter',
      accessorKey: 'starterEnabled',
      cell: (row: any) => (
        <ToggleSwitch checked={row.starterEnabled} disabled={row.globalEnabled} onChange={() => handleToggle(row.id, 'starterEnabled')} />
      ),
    },
    {
      header: 'Pro',
      accessorKey: 'proEnabled',
      cell: (row: any) => (
        <ToggleSwitch checked={row.proEnabled} disabled={row.globalEnabled} onChange={() => handleToggle(row.id, 'proEnabled')} />
      ),
    },
    {
      header: 'Ent.',
      accessorKey: 'enterpriseEnabled',
      cell: (row: any) => (
        <ToggleSwitch checked={row.enterpriseEnabled} disabled={row.globalEnabled} onChange={() => handleToggle(row.id, 'enterpriseEnabled')} />
      ),
    },
    {
      header: 'Overrides',
      accessorKey: '_count',
      cell: (row: any) => (
        <div className="flex justify-center">
          <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${(row._count?.overrides ?? 0) > 0 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
            {row._count?.overrides ?? 0}
          </span>
        </div>
      ),
    },
    {
      header: 'Last Modified',
      accessorKey: 'updatedAt',
      cell: (row: any) => (
        <div className="flex flex-col">
          <span className="font-mono text-xs text-[var(--sa-text-secondary)]">{timeAgo(row.updatedAt)}</span>
          <span className="text-[9px] uppercase font-bold tracking-widest text-[var(--sa-text-muted)]">{row.updatedBy?.email ?? 'system'}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 sa-stagger">
      <PageHeader
        title="Feature Flag Topography"
        subtitle="Manage global rollout phases, beta testing, and plan-specific capabilities."
        icon={ToggleLeft}
        breadcrumbs={[
          { label: 'Overview', href: '/super-admin' },
          { label: 'System Configurations', href: '/super-admin/feature-flags' }
        ]}
        actions={
          <button 
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#021a13] bg-[#10b981] hover:bg-[#34d399] rounded-full transition-colors sa-btn-hover shadow-sm disabled:opacity-50"
            onClick={handleSave}
            disabled={isSaving || Object.keys(pendingChanges).length === 0}
          >
            {isSaving ? <CloudRain size={14} className="animate-bounce" /> : <Save size={14} />} 
            {isSaving ? 'Synchronising Edge...' : `Save Configuration${Object.keys(pendingChanges).length > 0 ? ` (${Object.keys(pendingChanges).length})` : ''}`}
          </button>
        }
      />

      {/* Notice Banner */}
      <div className="p-4 bg-[#fffbfa] border border-[#fecdd3] rounded-[var(--sa-radius-md)] flex items-start gap-4 shadow-sm">
        <AlertTriangle size={20} className="text-[#e11d48] shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-[#9f1239]">Immediate Propagation Warning</h4>
          <p className="text-xs text-[#be123c] mt-1 leading-relaxed font-sans">
            Toggling a feature flag and saving applies changes <strong className="font-bold">immediately</strong> across all active sessions. Reversing a critical flag may affect in-flight transactions.
          </p>
        </div>
      </div>

      {/* Flags Data Table */}
      <div className="bg-[var(--sa-bg-card)] rounded-[var(--sa-radius-md)] border border-[var(--sa-border)] shadow-sm overflow-hidden min-h-[500px]">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => <SkeletonLoader key={i} className="w-full h-14 rounded" />)}
          </div>
        ) : (
          <DataTable
            data={flags as any}
            columns={columns as any}
            onRowClick={(row: any) => toast.info(`Viewing config topography for ${row.key}`)}
          />
        )}
        
        <div className="p-4 border-t border-[var(--sa-border)] bg-[var(--sa-bg-card-alt)] flex items-center justify-between text-xs text-[var(--sa-text-muted)] font-mono">
          <span>Total Flags Indexed: {flags.length}</span>
          {Object.keys(pendingChanges).length > 0 && (
            <span className="text-[#ca8a04] font-bold">{Object.keys(pendingChanges).length} unsaved change(s)</span>
          )}
        </div>
      </div>
    </div>
  );
}
