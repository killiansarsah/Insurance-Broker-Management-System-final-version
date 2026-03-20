'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/super-admin/PageHeader';
import { StatusPill } from '@/components/super-admin/StatusPill';
import { Building2, Users, Database, CreditCard, ShieldAlert, Activity, ServerCrash, RefreshCcw, Settings, Clock, CheckCircle2 } from 'lucide-react';
import { StatCard } from '@/components/super-admin/StatCard';
import { DataTable } from '@/components/super-admin/DataTable';
import { use } from 'react';
import { toast } from 'sonner';

const TABS = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'users', label: 'User Matrix', icon: Users },
  { id: 'insurance', label: 'Insurance Data', icon: Database },
  { id: 'billing', label: 'Billing/Stripe', icon: CreditCard },
  { id: 'compliance', label: 'NIC Compliance', icon: ShieldAlert },
  { id: 'logs', label: 'Audit Logs', icon: Clock },
  { id: 'health', label: 'Health & Errors', icon: ServerCrash },
];

export default function TenantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const [activeTab, setActiveTab] = useState('overview');

  const mockTenant = {
    id: unwrappedParams.id,
    name: 'Vanguard Insurance Group',
    code: 'VIG',
    plan: 'Enterprise',
    status: 'active',
    joined: 'Jan 15, 2023',
    domain: 'vanguard.ibms.com',
    license: 'NIC/BR/001/2026',
    contact: 'jdoe@vanguard.com'
  };

  const getTabIcon = (TabIcon: any, isActive: boolean) => {
    return <TabIcon size={16} className={isActive ? 'text-[#1D9E75]' : 'text-gray-400'} />;
  };

  return (
    <div className="space-y-6 sa-stagger">
      
      {/* 1. Header with details */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#d4e0dc] pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-[#021a13] rounded-[12px] flex items-center justify-center border border-[#085041]">
              <span className="text-[#9FE1CB] font-serif font-bold text-xl">{mockTenant.code}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold font-serif text-[#0c6a55] leading-tight">
                {mockTenant.name}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <StatusPill status={mockTenant.status} />
                <span className="text-[10px] text-gray-500 font-mono hidden sm:inline">•</span>
                <span className="text-[10px] font-mono tracking-wider uppercase text-gray-500">
                  {mockTenant.domain}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-2 w-full sm:w-auto">
          <button 
            onClick={() => toast.success('Telemetry pulse manually refreshed.')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--sa-text-primary)] bg-[var(--sa-bg-card)] border border-[var(--sa-border)] hover:bg-[var(--sa-bg-page)] rounded-full transition-colors sa-btn-hover">
            <RefreshCcw size={14} /> Refresh Pulse
          </button>
          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              onClick={() => toast.warning('Impersonation token active. Security locks dropping.')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#021a13] bg-[#10b981] hover:bg-[#34d399] rounded-full transition-colors sa-btn-hover">
              <Users size={14} /> Impersonate
            </button>
            <button 
              onClick={() => toast.info('Tenant advanced settings panel locked in this environment.')}
              className="flex items-center justify-center p-2 text-[var(--sa-text-muted)] border border-[var(--sa-border)] hover:bg-[#fef2f2] hover:border-[#fecdd3] hover:text-[#f43f5e] rounded-full transition-colors">
              <Settings size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Horizontal Scrollable Tabs */}
      <div className="flex overflow-x-auto border-b border-[#d4e0dc] hide-scrollbar">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-bold tracking-wider whitespace-nowrap transition-all border-b-2
                ${isActive 
                  ? 'border-[#1D9E75] text-[#0c6a55] bg-[#f8faf9]' 
                  : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-[#f0f4f3]'
                }`}
            >
              {getTabIcon(tab.icon, isActive)}
              <span className="uppercase text-[10px]">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Tab Content Area */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="space-y-6 sa-reveal">
            
            {/* KPI Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Total MRR (30d)" prefix="₵" value={14250} icon={CreditCard} iconColor="#ca8a04" />
              <StatCard label="Active Policies" value={1240} change={3.2} icon={Database} iconColor="#1d9e75" />
              <StatCard label="Provisioned Users" value={45} suffix=" / 50" icon={Users} iconColor="#0369a1" />
              <StatCard label="NIC Risk Score" value={98} suffix="/100" icon={CheckCircle2} iconColor="#1D9E75" />
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-[#d4e0dc] rounded-[var(--sa-radius-md)] p-6 shadow-sm flex flex-col h-full">
                  <h3 className="text-sm font-bold font-serif text-[#0c6a55] mb-4 uppercase tracking-widest">Entity Profile</h3>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Plan</div>
                      <div className="text-sm font-semibold">{mockTenant.plan}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Created On</div>
                      <div className="text-sm font-mono">{mockTenant.joined}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">NIC License</div>
                      <div className="text-sm font-mono text-gray-900 border-b border-[#1d9e75] inline-block">{mockTenant.license}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Primary Admin</div>
                      <div className="text-sm">{mockTenant.contact}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sparklines / Info Box */}
              <div className="lg:col-span-1 border border-[#085041] rounded-[var(--sa-radius-md)] bg-[#021a13] text-[#9fe1cb] p-6 shadow-sm overflow-hidden flex flex-col justify-between sa-card-hover">
                <div>
                  <h3 className="text-sm font-bold font-serif mb-4 uppercase tracking-widest">Storage Telemetry</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-[10px] uppercase tracking-wider mb-1">
                        <span>Database Used</span>
                        <span className="font-mono">74%</span>
                      </div>
                      <div className="w-full bg-[#05291e] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#ca8a04] h-full" style={{ width: '74%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] uppercase tracking-wider mb-1">
                        <span>S3 Archival</span>
                        <span className="font-mono">12%</span>
                      </div>
                      <div className="w-full bg-[#05291e] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#1D9E75] h-full" style={{ width: '12%' }} />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 mt-4 border-t border-[#05291e] text-[10px] font-mono tracking-widest text-[#5dcaa5]">
                  LAST BACKUP: 2 HOURS AGO
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Other Tabs Placeholder */}
        {activeTab !== 'overview' && (
          <div className="flex flex-col items-center justify-center p-12 bg-[var(--sa-bg-card)] border border-dashed border-[var(--sa-border)] rounded-[var(--sa-radius-md)] sa-reveal h-[400px]">
            {getTabIcon(TABS.find(t => t.id === activeTab)?.icon, false)}
            <h3 className="mt-4 text-sm font-bold font-serif text-gray-600 uppercase tracking-widest">
              {TABS.find(t => t.id === activeTab)?.label}
            </h3>
            <p className="mt-2 text-xs text-center text-gray-400 max-w-sm">
              This specialized panel is operating in stealth mode. Telemetry and records associated with this segment are currently sealed or streaming...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
