'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/super-admin/PageHeader';
import { Settings, Save, Shield, Database, Mail, Building2, CreditCard, Lock, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';

const TABS = [
  { id: 'general', label: 'General', icon: Building2 },
  { id: 'nic', label: 'NIC Regulations', icon: Shield },
  { id: 'email', label: 'SMTP & Mail', icon: Mail },
  { id: 'billing', label: 'Billing/Paystack', icon: CreditCard },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'backup', label: 'Backups', icon: Database },
];

export default function GlobalSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Mock global settings state
  const [settings, setSettings] = useState({
    general: {
      platformName: 'IBMS Cloud Platform',
      supportEmail: 'support@ibms.com.gh',
      timezone: 'GMT',
      currency: 'GHS',
      maintenanceMode: false,
    },
    nic: {
      levyRate: '1.5',
      remittancePeriod: 15,
      twoAccountEnforced: true,
      nicGatewayUrl: 'https://api.nicgh.org/v2/broker-sync'
    },
    email: {
      provider: 'Resend',
      fromEmail: 'noreply@ibms.com.gh',
      fromName: 'IBMS System',
      host: 'smtp.resend.com'
    },
    security: {
      sessionTimeout: 60,
      maxFailedAttempts: 5,
      mfaEnforced: true,
    }
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsSaving(false);
    setIsDirty(false);
    toast.success('Configuration saved');
  };

  const updateSetting = (category: keyof typeof settings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category] as any,
        [field]: value
      }
    }));
    setIsDirty(true);
  };

  const getTabIcon = (TabIcon: any, isActive: boolean) => {
    return <TabIcon size={16} className={isActive ? 'text-[#1D9E75]' : 'text-gray-400'} />;
  };

  return (
    <div className="space-y-6 sa-stagger relative pb-24">
      <PageHeader
        title="Platform Configuration"
        subtitle="Manage overarching settings for the multi-tenant architecture."
        icon={Settings}
        breadcrumbs={[
          { label: 'Overview', href: '/super-admin' },
          { label: 'Settings', href: '/super-admin/settings' }
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pt-4">
        
        {/* Vertical Tabs sidebar */}
        <div className="lg:col-span-1 space-y-1">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold tracking-wider transition-all rounded-sm border-l-4
                  ${isActive 
                    ? 'border-[#1D9E75] text-[#0c6a55] bg-white shadow-sm' 
                    : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-white hover:border-gray-200'
                  }`}
              >
                {getTabIcon(tab.icon, isActive)}
                <span className="uppercase text-[11px]">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-[#d4e0dc] rounded-sm p-6 shadow-sm min-h-[500px] sa-reveal">
            
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-sm font-bold font-serif text-[#0c6a55] border-b border-[#d4e0dc] pb-3 mb-6 uppercase tracking-widest">Global Preferences</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Platform Operating Name</label>
                    <input 
                      type="text" 
                      value={settings.general.platformName}
                      onChange={(e) => updateSetting('general', 'platformName', e.target.value)}
                      className="w-full p-2 bg-[#f0f4f3] border-none rounded-sm focus:ring-2 focus:ring-[#1D9E75] focus:outline-none text-gray-900"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">System Support Email</label>
                    <input 
                      type="email" 
                      value={settings.general.supportEmail}
                      onChange={(e) => updateSetting('general', 'supportEmail', e.target.value)}
                      className="w-full p-2 bg-[#f0f4f3] border-none rounded-sm focus:ring-2 focus:ring-[#1D9E75] focus:outline-none text-gray-900"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Default Timezone</label>
                    <select 
                      value={settings.general.timezone}
                      onChange={(e) => updateSetting('general', 'timezone', e.target.value)}
                      className="w-full p-2 bg-[#f0f4f3] border-none rounded-sm focus:ring-2 focus:ring-[#1D9E75] focus:outline-none text-gray-900"
                    >
                      <option value="GMT">Greenwich Mean Time (GMT)</option>
                      <option value="UTC">Coordinated Universal Time (UTC)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Base Currency</label>
                    <select 
                      value={settings.general.currency}
                      onChange={(e) => updateSetting('general', 'currency', e.target.value)}
                      className="w-full p-2 bg-[#f0f4f3] border-none rounded-sm focus:ring-2 focus:ring-[#1D9E75] focus:outline-none text-gray-900"
                    >
                      <option value="GHS">Ghanaian Cedi (GHS)</option>
                      <option value="USD">US Dollar (USD)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-[#d4e0dc]">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${settings.general.maintenanceMode ? 'bg-[#b91c1c]' : 'bg-gray-200'}`}>
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={settings.general.maintenanceMode}
                        onChange={(e) => updateSetting('general', 'maintenanceMode', e.target.checked)}
                      />
                      <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.general.maintenanceMode ? 'translate-x-4' : 'translate-x-0'}`} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">Enable Maintenance Mode</div>
                      <div className="text-xs text-gray-500">Forces all non-super-admins offline and displays a 503 Maintenance page.</div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'nic' && (
              <div className="space-y-6">
                <h3 className="text-sm font-bold font-serif text-[#0c6a55] border-b border-[#d4e0dc] pb-3 mb-6 uppercase tracking-widest">Commission Logic</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Act 1061 Levy Rate (%)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={settings.nic.levyRate}
                      onChange={(e) => updateSetting('nic', 'levyRate', e.target.value)}
                      className="w-full p-2 bg-[#f0f4f3] border-none rounded-sm focus:ring-2 focus:ring-[#1D9E75] focus:outline-none text-gray-900 font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Remittance Period (Days)</label>
                    <input 
                      type="number" 
                      value={settings.nic.remittancePeriod}
                      onChange={(e) => updateSetting('nic', 'remittancePeriod', parseInt(e.target.value))}
                      className="w-full p-2 bg-[#f0f4f3] border-none rounded-sm focus:ring-2 focus:ring-[#1D9E75] focus:outline-none text-gray-900 font-mono"
                    />
                  </div>
                  <div className="col-span-full space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">NIC Sync Webhook Origin</label>
                    <input 
                      type="url" 
                      value={settings.nic.nicGatewayUrl}
                      onChange={(e) => updateSetting('nic', 'nicGatewayUrl', e.target.value)}
                      className="w-full p-2 bg-[#f0f4f3] border-none rounded-sm focus:ring-2 focus:ring-[#1D9E75] focus:outline-none text-gray-900 font-mono"
                    />
                  </div>
                </div>
                
                <div className="pt-6 mt-6 border-t border-[#d4e0dc]">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${settings.nic.twoAccountEnforced ? 'bg-[#1D9E75]' : 'bg-gray-200'}`}>
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={settings.nic.twoAccountEnforced}
                        onChange={(e) => updateSetting('nic', 'twoAccountEnforced', e.target.checked)}
                      />
                      <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.nic.twoAccountEnforced ? 'translate-x-4' : 'translate-x-0'}`} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">Enforce Fiduciary Segregation</div>
                      <div className="text-xs text-gray-500">Requires brokers to specify separate OP and Premium remittance bank accounts.</div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Other tabs omitted for brevity, showing the structure applies. */}
            {!['general', 'nic'].includes(activeTab) && (
               <div className="flex flex-col items-center justify-center p-12 bg-gray-50 border border-dashed border-[#d4e0dc] rounded-sm h-[400px]">
                {getTabIcon(TABS.find(t => t.id === activeTab)?.icon, false)}
                <h3 className="mt-4 text-sm font-bold font-serif text-gray-600 uppercase tracking-widest">
                  {TABS.find(t => t.id === activeTab)?.label} Settings
                </h3>
              </div>
            )}
            
          </div>
        </div>
      </div>

      {/* Sticky Save Bar (Visible when dirty) */}
      <div className={`fixed bottom-0 left-0 right-0 bg-[#021a13] border-t border-[#085041] p-4 flex justify-between items-center z-50 transition-transform duration-300 ${isDirty ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="flex items-center gap-3 text-[#f0f4f3] ml-64 pl-6">
          <div className="w-2 h-2 rounded-full bg-[#ca8a04] animate-pulse" />
          <span className="text-sm font-bold font-mono tracking-widest">UNSAVED CONFIGURATION MUTATIONS</span>
        </div>
        <div className="flex gap-3 pr-6">
          <button 
            type="button"
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#9FE1CB] hover:bg-[#05291e] rounded-sm transition-colors sa-btn-hover border border-[#085041]"
            onClick={() => setIsDirty(false)}
          >
            Discard
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2 text-xs font-bold uppercase tracking-wider text-[#021a13] bg-[#1D9E75] hover:bg-[#3BB58D] rounded-sm transition-colors sa-btn-hover"
          >
            {isSaving ? <RefreshCcw size={14} className="animate-spin" /> : <Save size={14} />} 
            {isSaving ? 'Commiting...' : 'Deploy Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
