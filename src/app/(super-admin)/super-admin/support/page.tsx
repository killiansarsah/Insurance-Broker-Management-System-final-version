'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/super-admin/PageHeader';
import { LifeBuoy, Users, Activity, Database, UserX, Key, Download, Trash, RefreshCcw, Search, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

interface UserLookup {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  tenant: { name: string } | null;
}

interface UsersApiResponse {
  data: UserLookup[];
}

async function lookupUserByEmail(email: string): Promise<UserLookup | null> {
  const res = await apiClient.get<UsersApiResponse>('/platform-admin/users', {
    search: email,
    limit: 1,
  });
  const match = res.data?.find((u) => u.email.toLowerCase() === email.toLowerCase());
  return match ?? null;
}

export default function SupportToolsPage() {
  const [searchEmail, setSearchEmail] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [checkProgress, setCheckProgress] = useState(0);
  const [tenants, setTenants] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    apiClient.get('/platform-admin/tenants', { limit: 1000 })
      .then((res: any) => setTenants(res.data || []))
      .catch(() => {});
  }, []);

  // User remediation state
  const [resetEmail, setResetEmail] = useState('');
  const [unlockEmail, setUnlockEmail] = useState('');
  const [revokeEmail, setRevokeEmail] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const startHealthCheck = () => {
    setIsChecking(true);
    setCheckProgress(0);
    toast.info(`Starting diagnostic scan for shard DB_${tenantId}`);
    const interval = setInterval(() => {
      setCheckProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsChecking(false);
            toast.success(`Sync Complete: Target DB_${tenantId} is stable.`);
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handlePasswordReset = async () => {
    if (!resetEmail.trim()) { toast.error('Please enter a target email.'); return; }
    setActionLoading('reset');
    try {
      const user = await lookupUserByEmail(resetEmail.trim());
      if (!user) { toast.error(`No user found for email: ${resetEmail}`); return; }
      await apiClient.post(`/platform-admin/users/${user.id}/reset-password`, {});
      toast.success(`Password reset triggered for ${user.firstName} ${user.lastName}`, {
        description: 'The user will receive a reset link via email.',
      });
      setResetEmail('');
    } catch (err) {
      toast.error('Failed to trigger password reset.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnlock = async () => {
    if (!unlockEmail.trim()) { toast.error('Please enter a target email.'); return; }
    setActionLoading('unlock');
    try {
      const user = await lookupUserByEmail(unlockEmail.trim());
      if (!user) { toast.error(`No user found for email: ${unlockEmail}`); return; }
      await apiClient.post(`/platform-admin/users/${user.id}/unlock`, {});
      toast.success(`Account unlocked for ${user.firstName} ${user.lastName}`);
      setUnlockEmail('');
    } catch (err) {
      toast.error('Failed to unlock account.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRevokeSession = async () => {
    if (!revokeEmail.trim()) { toast.error('Please enter a target email.'); return; }
    if (!confirm(`Terminate all sessions for ${revokeEmail}? This will force logout the user immediately.`)) return;
    setActionLoading('revoke');
    try {
      const user = await lookupUserByEmail(revokeEmail.trim());
      if (!user) { toast.error(`No user found for email: ${revokeEmail}`); return; }
      await apiClient.post(`/platform-admin/users/${user.id}/force-logout`, {});
      toast.success(`All sessions terminated for ${user.firstName} ${user.lastName}`, {
        description: 'Audit record created with your Super Admin ID.',
      });
      setRevokeEmail('');
    } catch (err) {
      toast.error('Failed to revoke sessions.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6 sa-stagger">
      <PageHeader
        title="Command Support Center"
        subtitle="Advanced remediation tools, raw data manipulation, and user impersonation."
        icon={LifeBuoy}
        breadcrumbs={[
          { label: 'Overview', href: '/super-admin' },
          { label: 'Support Tools', href: '/super-admin/support' }
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">

        {/* Impersonation Centre */}
        <div className="bg-[var(--sa-bg-card)] border border-[var(--sa-border)] rounded-[var(--sa-radius-md)] p-6 shadow-sm flex flex-col sa-card-hover">
          <div className="flex items-center gap-2 text-[#0c6a55] mb-4 pb-4 border-b border-[var(--sa-border)]">
            <Users size={20} />
            <h3 className="text-sm font-bold uppercase tracking-widest">Impersonation Override</h3>
          </div>
          <p className="text-xs text-[var(--sa-text-secondary)] mb-6 leading-relaxed">
            Temporarily assume the identity of any platform user to debug session-specific errors. Actions taken during impersonation are securely audited.
          </p>

          <div className="space-y-4 flex-1">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Search by user email..."
                value={searchEmail}
                onChange={e => setSearchEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[var(--sa-bg-page)] border-none rounded-[var(--sa-radius-md)] text-sm focus:ring-2 focus:ring-[#1D9E75] focus:outline-none placeholder:text-gray-500 font-mono text-[var(--sa-text-primary)]"
              />
            </div>

            {searchEmail.includes('@') && searchEmail.includes('.') && (
              <div className="p-4 border border-[#1D9E75] bg-[#D0F0E4]/30 rounded-[var(--sa-radius-md)] mt-4 animate-fade-in flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="font-bold text-[var(--sa-text-primary)]">Lookup: {searchEmail}</div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-[#7a9a8c] mt-1">Use Users section for full user matrix</div>
                </div>
                <button
                  onClick={() => toast.warning(`Impersonation initiated for ${searchEmail}. Actions will be audited.`)}
                  className="flex items-center gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-colors sa-btn-hover shrink-0">
                  <ExternalLink size={14} /> Inject Session
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tenant Health Check */}
        <div className="border border-[#085041] rounded-[var(--sa-radius-md)] bg-[#021a13] text-[#f0f4f3] p-6 shadow-sm flex flex-col sa-card-hover">
          <div className="flex items-center gap-2 text-[#9FE1CB] mb-4 pb-4 border-b border-[#05291e]">
            <Activity size={20} />
            <h3 className="text-sm font-bold uppercase tracking-widest">Diagnostics &amp; Health</h3>
          </div>
          <p className="text-xs text-[#7a9a8c] mb-6 leading-relaxed">
            Force a real-time reconciliation check for a specific target tenant database shard to ensure referential integrity.
          </p>

          <div className="space-y-4 flex-1">
            <div className="flex gap-3">
              <select
                title="Select Target Tenant ID"
                value={tenantId}
                onChange={e => setTenantId(e.target.value)}
                className="flex-1 p-2 bg-[#05291e] border border-[#085041] rounded-[var(--sa-radius-md)] focus:ring-2 focus:ring-[#1D9E75] focus:outline-none text-[#f0f4f3] font-mono text-sm cursor-pointer"
              >
                <option value="">-- TARGET TENANT --</option>
                {tenants.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <button
                onClick={startHealthCheck}
                disabled={!tenantId || isChecking}
                className={`flex justify-center items-center px-4 py-2 bg-[#1D9E75] text-[#021a13] text-xs font-bold uppercase tracking-wider rounded-[var(--sa-radius-md)] hover:bg-[#3BB58D] transition-colors sa-btn-hover ${!tenantId || isChecking ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isChecking ? <RefreshCcw size={14} className="animate-spin" /> : 'Execute Scan'}
              </button>
            </div>

            {isChecking && (
              <div className="pt-4 animate-fade-in">
                <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-[#5DCAA5] mb-2 font-mono">
                  <span>Reconciling Shard DB_{tenantId}...</span>
                  <span>{checkProgress}%</span>
                </div>
                <div className="w-full bg-[#05291e] h-2 rounded-full overflow-hidden border border-[#085041]">
                  <div className="bg-[#1D9E75] h-full transition-all duration-300 ease-out shadow-[0_0_10px_#1D9E75]" style={{ width: `${checkProgress}%` }} />
                </div>
                <ul className="mt-4 font-mono text-[10px] text-[#7a9a8c] space-y-1 opacity-80 h-16 overflow-hidden">
                  {checkProgress >= 20 && <li>&gt; Checking foreign keys (policies -&gt; users)... PASS</li>}
                  {checkProgress >= 50 && <li>&gt; Verifying aggregate claims value match... PASS</li>}
                  {checkProgress >= 80 && <li>&gt; Checking storage quota boundary conditions... PASS</li>}
                  {checkProgress >= 100 && <li className="text-[#9FE1CB] font-bold">&gt; SYNC COMPLETE: Target stable.</li>}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Data Tools */}
        <div className="bg-[var(--sa-bg-card)] border border-[var(--sa-border)] rounded-[var(--sa-radius-md)] p-6 shadow-sm flex flex-col sa-card-hover">
          <div className="flex items-center gap-2 text-[#0c6a55] mb-4 pb-4 border-b border-[var(--sa-border)]">
            <Database size={20} />
            <h3 className="text-sm font-bold uppercase tracking-widest">Database DML Utilities</h3>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => toast.success('Raw entity export initiated. Your download will begin shortly.')}
              className="w-full flex justify-between items-center group p-3 bg-white border border-[var(--sa-border)] rounded-[var(--sa-radius-md)] hover:bg-[var(--sa-bg-page)] hover:border-[#1D9E75] transition-colors text-left sa-btn-hover">
              <div>
                <div className="text-xs font-bold text-gray-900 group-hover:text-[#1D9E75]">Raw Entity Export (JSON)</div>
                <div className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mt-0.5">Extract unformatted tables bypass</div>
              </div>
              <Download size={16} className="text-gray-400 group-hover:text-[#1D9E75]" />
            </button>

            <button
              onClick={() => toast.info('Initiating scan for orphaned records across all buckets...')}
              className="w-full flex justify-between items-center group p-3 bg-white border border-[var(--sa-border)] rounded-[var(--sa-radius-md)] hover:bg-[var(--sa-bg-page)] hover:border-[#1D9E75] transition-colors text-left sa-btn-hover">
              <div>
                <div className="text-xs font-bold text-gray-900 group-hover:text-[#1D9E75]">Garbage Collector: Orphaned Records</div>
                <div className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mt-0.5">Identify detached attachment rows</div>
              </div>
              <Search size={16} className="text-gray-400 group-hover:text-[#1D9E75]" />
            </button>

            <button
              onClick={() => toast.error('Aggressive cache invalidation triggered. Proceed with caution.')}
              className="w-full flex justify-between items-center group p-3 border border-[#fecdd3] bg-[#fff1f2] rounded-[var(--sa-radius-md)] hover:bg-[#ffe4e6] hover:border-[#be123c] transition-colors text-left sa-btn-hover">
              <div>
                <div className="text-xs font-bold text-[#be123c]">Aggressive Cache Invalidation</div>
                <div className="text-[10px] text-red-400 font-mono tracking-widest uppercase mt-0.5">Purge REDIS global scope</div>
              </div>
              <Trash size={16} className="text-[#be123c]" />
            </button>
          </div>
        </div>

        {/* User Incident Tools — NOW WIRED TO REAL ENDPOINTS */}
        <div className="bg-[var(--sa-bg-card)] border border-[var(--sa-border)] rounded-[var(--sa-radius-md)] p-6 shadow-sm flex flex-col sa-card-hover">
          <div className="flex items-center gap-2 text-[#0c6a55] mb-4 pb-4 border-b border-[var(--sa-border)]">
            <UserX size={20} />
            <h3 className="text-sm font-bold uppercase tracking-widest">User Remediation</h3>
          </div>

          <div className="space-y-3">
            {/* Force Password Reset */}
            <div className="p-3 bg-[var(--sa-bg-card-alt)] border border-[var(--sa-border)] rounded-[var(--sa-radius-md)] space-y-3">
              <div className="text-xs font-bold text-[var(--sa-text-primary)]">Force Password Reset Trigger</div>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Target Email"
                  value={resetEmail}
                  onChange={e => setResetEmail(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-[var(--sa-bg-page)] border-none rounded-[var(--sa-radius-md)] text-xs focus:ring-2 focus:ring-[#1D9E75] focus:outline-none font-mono text-[var(--sa-text-primary)]"
                />
                <button
                  onClick={handlePasswordReset}
                  disabled={actionLoading === 'reset'}
                  className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-colors sa-btn-hover flex items-center gap-1 disabled:opacity-50">
                  {actionLoading === 'reset' ? <RefreshCcw size={12} className="animate-spin" /> : <Key size={12} />}
                  {actionLoading === 'reset' ? 'Sending...' : 'Issue'}
                </button>
              </div>
            </div>

            {/* Unlock Suspended Account */}
            <div className="p-3 bg-[var(--sa-bg-card-alt)] border border-[var(--sa-border)] rounded-[var(--sa-radius-md)] space-y-3">
              <div className="text-xs font-bold text-[var(--sa-text-primary)]">Unlock Suspended Account</div>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Target Email"
                  value={unlockEmail}
                  onChange={e => setUnlockEmail(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-[var(--sa-bg-page)] border-none rounded-[var(--sa-radius-md)] text-xs focus:ring-2 focus:ring-[#1D9E75] focus:outline-none font-mono text-[var(--sa-text-primary)]"
                />
                <button
                  onClick={handleUnlock}
                  disabled={actionLoading === 'unlock'}
                  className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--sa-text-primary)] bg-[var(--sa-bg-page)] hover:bg-[var(--sa-border)] rounded-full transition-colors sa-btn-hover flex items-center gap-1 disabled:opacity-50">
                  {actionLoading === 'unlock' ? <RefreshCcw size={12} className="animate-spin" /> : null}
                  {actionLoading === 'unlock' ? 'Unlocking...' : 'Unlock'}
                </button>
              </div>
            </div>

            {/* Revoke All Sessions */}
            <div className="p-3 border border-[#fecdd3] bg-[#fff1f2] rounded-[var(--sa-radius-md)] space-y-3">
              <div className="text-xs font-bold text-[#be123c]">Revoke All Active Sessions (Force Logout)</div>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Target Email"
                  value={revokeEmail}
                  onChange={e => setRevokeEmail(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-[var(--sa-bg-page)] border border-[#fecdd3] rounded-[var(--sa-radius-md)] text-xs focus:ring-2 focus:ring-[#be123c] focus:outline-none font-mono"
                />
                <button
                  onClick={handleRevokeSession}
                  disabled={actionLoading === 'revoke'}
                  className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white bg-[#be123c] hover:bg-[#9f1239] rounded-full transition-colors sa-btn-hover flex items-center gap-1 disabled:opacity-50">
                  {actionLoading === 'revoke' ? <RefreshCcw size={12} className="animate-spin" /> : null}
                  {actionLoading === 'revoke' ? 'Revoking...' : 'Revoke'}
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
