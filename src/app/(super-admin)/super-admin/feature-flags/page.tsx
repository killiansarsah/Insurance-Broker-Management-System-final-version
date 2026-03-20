'use client';

import { PageHeader } from '@/components/super-admin/PageHeader';
import { DataTable } from '@/components/super-admin/DataTable';
import { ToggleLeft, Search, Filter, Shield, AlertTriangle, CloudRain, Save } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const initialFlags = [
  { id: 'ff_1', key: 'new_claims_pipeline', label: 'Kanban Claims Pipeline', description: 'Enable the new drag-and-drop kanban view for claims agents.', global: true, starter: true, pro: true, enterprise: true, overrides: 0, changedBy: 'ksarsah@ibms.com', lastChanged: '1d ago' },
  { id: 'ff_2', key: 'ai_document_parser', label: 'AI Document OCR Parser', description: 'Enable automated extraction of policy schedules from PDF uploads.', global: false, starter: false, pro: false, enterprise: true, overrides: 2, changedBy: 'system', lastChanged: '14d ago' },
  { id: 'ff_3', key: 'experimental_whatsapp_bot', label: 'WhatsApp Intake Bot', description: 'Allow clients to submit basic claims via WhatsApp interface. Beta.', global: false, starter: false, pro: true, enterprise: true, overrides: 1, changedBy: 'jdoe@vanguard.com', lastChanged: '2m ago' },
  { id: 'ff_4', key: 'multi_currency_billing', label: 'Multi-Currency Settlement', description: 'Support USD/EUR transactions alongside GHS base.', global: true, starter: false, pro: true, enterprise: true, overrides: 0, changedBy: 'system', lastChanged: '1h ago' },
];

export default function FeatureFlagsPage() {
  const [flags, setFlags] = useState(initialFlags);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = (id: string, field: 'global' | 'starter' | 'pro' | 'enterprise') => {
    setFlags(flags.map(f => {
      if (f.id === id) {
        // If turning on Global, turn all on. If turning off global, user manually adjust others.
        if (field === 'global' && !f.global) {
          toast.info(`Global override enabled for ${f.key}`);
          return { ...f, global: true, starter: true, pro: true, enterprise: true };
        } else if (field === 'global' && f.global) {
          toast.warning(`Global override disabled for ${f.key}. Manual adjustments require save.`);
          return { ...f, global: false };
        }
        toast.success(`${field} flag toggled for ${f.key}`);
        return { ...f, [field]: !f[field] };
      }
      return f;
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 800));
    toast.success('Feature flags synchronised', {
      description: 'Changes propagated to all edge nodes successfully.'
    });
    setIsSaving(false);
  };

  const ToggleSwitch = ({ checked, onChange, disabled = false }: { checked: boolean, onChange: () => void, disabled?: boolean }) => (
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
      cell: (row: typeof initialFlags[0]) => (
        <div className="max-w-[250px]">
          <div className="font-bold text-[var(--sa-text-primary)]">{row.label}</div>
          <div className="font-mono text-[10px] text-[#0c6a55] mt-1 break-all bg-[#D0F0E4] px-1 rounded-sm w-fit">{row.key}</div>
        </div>
      ),
    },
    {
      header: 'Description',
      accessorKey: 'description',
      cell: (row: typeof initialFlags[0]) => (
        <p className="text-xs text-[var(--sa-text-secondary)] max-w-[280px] leading-relaxed">{row.description}</p>
      ),
    },
    {
      header: 'GLOBAL',
      accessorKey: 'global',
      cell: (row: typeof initialFlags[0]) => (
        <ToggleSwitch checked={row.global} onChange={() => handleToggle(row.id, 'global')} />
      ),
    },
    {
      header: 'Starter',
      accessorKey: 'starter',
      cell: (row: typeof initialFlags[0]) => (
        <ToggleSwitch checked={row.starter} disabled={row.global} onChange={() => handleToggle(row.id, 'starter')} />
      ),
    },
    {
      header: 'Pro',
      accessorKey: 'pro',
      cell: (row: typeof initialFlags[0]) => (
        <ToggleSwitch checked={row.pro} disabled={row.global} onChange={() => handleToggle(row.id, 'pro')} />
      ),
    },
    {
      header: 'Ent.',
      accessorKey: 'enterprise',
      cell: (row: typeof initialFlags[0]) => (
        <ToggleSwitch checked={row.enterprise} disabled={row.global} onChange={() => handleToggle(row.id, 'enterprise')} />
      ),
    },
    {
      header: 'Overrides',
      accessorKey: 'overrides',
      cell: (row: typeof initialFlags[0]) => (
        <div className="flex justify-center">
          <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${row.overrides > 0 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
            {row.overrides}
          </span>
        </div>
      ),
    },
    {
      header: 'Last Modified',
      accessorKey: 'lastChanged',
      cell: (row: typeof initialFlags[0]) => (
        <div className="flex flex-col">
          <span className="font-mono text-xs text-[var(--sa-text-secondary)]">{row.lastChanged}</span>
          <span className="text-[9px] uppercase font-bold tracking-widest text-gray-400">{row.changedBy}</span>
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
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#021a13] bg-[#10b981] hover:bg-[#34d399] rounded-full transition-colors sa-btn-hover shadow-sm"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? <CloudRain size={14} className="animate-bounce" /> : <Save size={14} />} 
            {isSaving ? 'Synchronising Edge...' : 'Save Configuration'}
          </button>
        }
      />

      {/* Notice Banner */}
      <div className="p-4 bg-[#fffbfa] border border-[#fecdd3] rounded-[var(--sa-radius-md)] flex items-start gap-4 shadow-sm">
        <AlertTriangle size={20} className="text-[#e11d48] shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-[#9f1239]">Immediate Propagation Warning</h4>
          <p className="text-xs text-[#be123c] mt-1 leading-relaxed font-sans">
            Toggling a feature flag applies changes <strong className="font-bold">immediately</strong> across all active WebSocket sessions and subsequent API calls. Reversing a critical flag may corrupt in-flight transactions depending on the module's idempotency.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-4 bg-[var(--sa-bg-card)] p-4 rounded-[var(--sa-radius-md)] border border-[var(--sa-border)]">
        <div className="relative flex-1 min-w-[250px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search flag key or label..." 
            className="w-full pl-9 pr-4 py-2 bg-[var(--sa-bg-page)] border-none rounded-full text-sm focus:ring-2 focus:ring-[#1D9E75] focus:outline-none placeholder:text-gray-500 font-mono text-[var(--sa-text-primary)]"
          />
        </div>
        <button 
          onClick={() => toast.info('Filtering by plan override metrics')}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--sa-text-primary)] bg-[var(--sa-bg-page)] hover:bg-[var(--sa-border)] rounded-full transition-colors sa-btn-hover">
          <Filter size={14} /> Plan Scope
        </button>
        <button 
          onClick={() => toast.warning('Filtering flags requiring override review')}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--sa-text-primary)] bg-[var(--sa-bg-page)] hover:bg-[var(--sa-border)] rounded-full transition-colors sa-btn-hover">
          <Shield size={14} /> Requires Override
        </button>
      </div>

      {/* Flags Data Table */}
      <div className="bg-[var(--sa-bg-card)] rounded-[var(--sa-radius-md)] border border-[var(--sa-border)] shadow-sm overflow-hidden min-h-[500px]">
        <DataTable
          data={flags}
          columns={columns}
          onRowClick={(row) => toast.info(`Viewing config topography for ${row.key}`)}
        />
        
        <div className="p-4 border-t border-[var(--sa-border)] bg-[var(--sa-bg-page)] flex items-center justify-between text-xs text-gray-500 font-mono">
          <span>Total Flags Indexed: 45</span>
        </div>
      </div>
    </div>
  );
}
