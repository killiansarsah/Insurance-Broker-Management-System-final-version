'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/super-admin/PageHeader';
import { SkeletonLoader } from '@/components/super-admin/SkeletonLoader';
import { Settings, Save, Shield, Database, Mail, Building2, CreditCard, Lock, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

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
  const [loading, setLoading] = useState(true);

  const [settings, setSettings] = useState<Record<string, any>>({
    platformName: 'Brokerium Cloud Platform',
    supportEmail: 'support@brokerium.com',
    timezone: 'GMT',
    currency: 'GHS',
    maintenanceMode: false,
    levyRate: '1.5',
    remittancePeriod: 15,
    twoAccountEnforced: true,
    nicGatewayUrl: 'https://api.nicgh.org/v2/broker-sync',
    emailProvider: 'Resend',
    fromEmail: 'noreply@brokerium.com',
    fromName: 'Brokerium System',
    smtpHost: 'smtp.resend.com',
    sessionTimeout: 60,
    maxFailedAttempts: 5,
    mfaEnforced: true,
  });

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<{ data: Record<string, any> }>('/platform-admin/settings');
      if (res.data && Object.keys(res.data).length > 0) {
        setSettings(prev => ({ ...prev, ...res.data }));
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await apiClient.patch('/platform-admin/settings', settings);
      setIsDirty(false);
      toast.success('Configuration saved and deployed.');
    } catch (err) {
      console.error('Failed to save settings:', err);
      toast.error('Failed to save configuration.');
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const getTabIcon = (TabIcon: any, isActive: boolean) => {
    return <TabIcon size={16} className={isActive ? 'text-[#1D9E75]' : 'text-[var(--sa-text-muted)]'} />;
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
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold tracking-wider transition-all rounded-[var(--sa-radius-md)] border-l-4
                  ${isActive 
                    ? 'border-[#1D9E75] text-[#0c6a55] bg-[var(--sa-bg-card)] shadow-sm' 
                    : 'border-transparent text-[var(--sa-text-muted)] hover:text-[var(--sa-text-primary)] hover:bg-[var(--sa-bg-card)] hover:border-[var(--sa-border)]'
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
          <div className="bg-[var(--sa-bg-card)] border border-[var(--sa-border)] rounded-[var(--sa-radius-md)] p-6 shadow-sm min-h-[500px] sa-reveal">
            
            {loading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => <SkeletonLoader key={i} className="w-full h-12 rounded" />)}
              </div>
            ) : (
              <>
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <h3 className="text-sm font-bold font-serif text-[#0c6a55] border-b border-[var(--sa-border)] pb-3 mb-6 uppercase tracking-widest">Global Preferences</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-[var(--sa-text-muted)]">Platform Operating Name</label>
                        <input 
                          type="text" 
                          value={settings.platformName ?? ''}
                          onChange={(e) => updateSetting('platformName', e.target.value)}
                          className="w-full p-2 bg-[var(--sa-bg-page)] border-none rounded-[var(--sa-radius-md)] focus:ring-2 focus:ring-[#1D9E75] focus:outline-none text-[var(--sa-text-primary)]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-[var(--sa-text-muted)]">System Support Email</label>
                        <input 
                          type="email" 
                          value={settings.supportEmail ?? ''}
                          onChange={(e) => updateSetting('supportEmail', e.target.value)}
                          className="w-full p-2 bg-[var(--sa-bg-page)] border-none rounded-[var(--sa-radius-md)] focus:ring-2 focus:ring-[#1D9E75] focus:outline-none text-[var(--sa-text-primary)]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-[var(--sa-text-muted)]">Default Timezone</label>
                        <select 
                          value={settings.timezone ?? 'GMT'}
                          onChange={(e) => updateSetting('timezone', e.target.value)}
                          className="w-full p-2 bg-[var(--sa-bg-page)] border-none rounded-[var(--sa-radius-md)] focus:ring-2 focus:ring-[#1D9E75] focus:outline-none text-[var(--sa-text-primary)]"
                        >
                          <option value="GMT">Greenwich Mean Time (GMT)</option>
                          <option value="UTC">Coordinated Universal Time (UTC)</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-[var(--sa-text-muted)]">Base Currency</label>
                        <select 
                          value={settings.currency ?? 'GHS'}
                          onChange={(e) => updateSetting('currency', e.target.value)}
                          className="w-full p-2 bg-[var(--sa-bg-page)] border-none rounded-[var(--sa-radius-md)] focus:ring-2 focus:ring-[#1D9E75] focus:outline-none text-[var(--sa-text-primary)]"
                        >
                          <option value="GHS">Ghanaian Cedi (GHS)</option>
                          <option value="USD">US Dollar (USD)</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-[var(--sa-border)]">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <div className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${settings.maintenanceMode ? 'bg-[#b91c1c]' : 'bg-gray-200'}`}>
                          <input 
                            type="checkbox" 
                            className="sr-only" 
                            checked={settings.maintenanceMode ?? false}
                            onChange={(e) => updateSetting('maintenanceMode', e.target.checked)}
                          />
                          <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.maintenanceMode ? 'translate-x-4' : 'translate-x-0'}`} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[var(--sa-text-primary)]">Enable Maintenance Mode</div>
                          <div className="text-xs text-[var(--sa-text-muted)]">Forces all non-super-admins offline and displays a 503 Maintenance page.</div>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {activeTab === 'nic' && (
                  <div className="space-y-6">
                    <h3 className="text-sm font-bold font-serif text-[#0c6a55] border-b border-[var(--sa-border)] pb-3 mb-6 uppercase tracking-widest">Commission Logic</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-[var(--sa-text-muted)]">Act 1061 Levy Rate (%)</label>
                        <input 
                          type="number" 
                          step="0.1"
                          value={settings.levyRate ?? ''}
                          onChange={(e) => updateSetting('levyRate', e.target.value)}
                          className="w-full p-2 bg-[var(--sa-bg-page)] border-none rounded-[var(--sa-radius-md)] focus:ring-2 focus:ring-[#1D9E75] focus:outline-none text-[var(--sa-text-primary)] font-mono"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-[var(--sa-text-muted)]">Remittance Period (Days)</label>
                        <input 
                          type="number" 
                          value={settings.remittancePeriod ?? ''}
                          onChange={(e) => updateSetting('remittancePeriod', parseInt(e.target.value))}
                          className="w-full p-2 bg-[var(--sa-bg-page)] border-none rounded-[var(--sa-radius-md)] focus:ring-2 focus:ring-[#1D9E75] focus:outline-none text-[var(--sa-text-primary)] font-mono"
                        />
                      </div>
                      <div className="col-span-full space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-[var(--sa-text-muted)]">NIC Sync Webhook Origin</label>
                        <input 
                          type="url" 
                          value={settings.nicGatewayUrl ?? ''}
                          onChange={(e) => updateSetting('nicGatewayUrl', e.target.value)}
                          className="w-full p-2 bg-[var(--sa-bg-page)] border-none rounded-[var(--sa-radius-md)] focus:ring-2 focus:ring-[#1D9E75] focus:outline-none text-[var(--sa-text-primary)] font-mono"
                        />
                      </div>
                    </div>
                    
                    <div className="pt-6 mt-6 border-t border-[var(--sa-border)]">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <div className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${settings.twoAccountEnforced ? 'bg-[#1D9E75]' : 'bg-gray-200'}`}>
                          <input 
                            type="checkbox" 
                            className="sr-only" 
                            checked={settings.twoAccountEnforced ?? false}
                            onChange={(e) => updateSetting('twoAccountEnforced', e.target.checked)}
                          />
                          <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.twoAccountEnforced ? 'translate-x-4' : 'translate-x-0'}`} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[var(--sa-text-primary)]">Enforce Fiduciary Segregation</div>
                          <div className="text-xs text-[var(--sa-text-muted)]">Requires brokers to specify separate OP and Premium remittance bank accounts.</div>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {!['general', 'nic'].includes(activeTab) && (
                  <div className="flex flex-col items-center justify-center p-12 bg-[var(--sa-bg-card-alt)] border border-dashed border-[var(--sa-border)] rounded-[var(--sa-radius-md)] h-[400px]">
                    {getTabIcon(TABS.find(t => t.id === activeTab)?.icon, false)}
                    <h3 className="mt-4 text-sm font-bold font-serif text-[var(--sa-text-muted)] uppercase tracking-widest">
                      {TABS.find(t => t.id === activeTab)?.label} Settings
                    </h3>
                    <p className="mt-2 text-xs text-[var(--sa-text-muted)]">Configuration panel coming soon.</p>
                  </div>
                )}
              </>
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
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#9FE1CB] hover:bg-[#05291e] rounded-full transition-colors sa-btn-hover border border-[#085041]"
            onClick={() => { fetchSettings(); setIsDirty(false); }}
          >
            Discard
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2 text-xs font-bold uppercase tracking-wider text-[#021a13] bg-[#1D9E75] hover:bg-[#3BB58D] rounded-full transition-colors sa-btn-hover"
          >
            {isSaving ? <RefreshCcw size={14} className="animate-spin" /> : <Save size={14} />} 
            {isSaving ? 'Committing...' : 'Deploy Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
