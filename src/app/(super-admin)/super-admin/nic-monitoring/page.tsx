'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/super-admin/PageHeader';
import { StatCard } from '@/components/super-admin/StatCard';
import { DataTable } from '@/components/super-admin/DataTable';
import { StatusPill } from '@/components/super-admin/StatusPill';
import { ShieldAlert, FileText, CheckCircle2, AlertTriangle, AlertCircle, FileSearch, Calendar as CalendarIcon, Download, Info } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useLiveMetric } from '@/hooks/super-admin/useLiveMetric';

interface NicRow {
  id: string;
  tenantName: string;
  nicLicenceNumber: string;
  nicLicenceExpiry: string | null;
  daysLeft: number;
  accountSegregation: boolean;
  remittanceStatus: string;
  levyStatus: string;
  kycStatus: string;
  complianceScore: number;
}

interface NicResponse {
  data: NicRow[];
}

interface NicStats {
  data: {
    fullyCompliant: number;
    totalTenants: number;
    expiringLicences: number;
    expiredLicences: number;
    behindRemittance: number;
  };
}

export default function NICMonitoringPage() {
  const [nicData, setNicData] = useState<NicRow[]>([]);
  const [loading, setLoading] = useState(true);

  const { data: statsResponse, loading: statsLoading } = useLiveMetric<NicStats>('/platform-admin/nic-compliance/stats', 60_000);
  const stats = statsResponse?.data;

  const fetchNicData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<NicResponse>('/platform-admin/nic-compliance');
      setNicData(res.data ?? []);
    } catch (err) {
      console.error('Failed to load NIC data:', err);
      toast.error('Failed to load compliance data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNicData();
  }, [fetchNicData]);

  const columns = [
    {
      header: 'Tenant Name',
      accessorKey: 'tenantName',
      cell: (row: any) => (
        <div className="font-bold text-[var(--sa-text-primary)]">{row.tenantName}</div>
      ),
    },
    {
      header: 'License #',
      accessorKey: 'nicLicenceNumber',
      cell: (row: any) => (
        <span className="font-mono text-xs text-[#0c6a55]">{row.nicLicenceNumber ?? '—'}</span>
      ),
    },
    {
      header: 'Expiry Date',
      accessorKey: 'nicLicenceExpiry',
      cell: (row: any) => {
        const daysLeft = row.daysLeft ?? 0;
        const isExpired = daysLeft < 0;
        const isWarning = daysLeft >= 0 && daysLeft <= 30;
        return (
          <div className="flex flex-col">
            <span className={`font-mono text-xs font-bold ${isExpired ? 'text-[#b91c1c]' : isWarning ? 'text-[#ca8a04]' : 'text-[#1D9E75]'}`}>
              {row.nicLicenceExpiry ? new Date(row.nicLicenceExpiry).toLocaleDateString() : '—'}
            </span>
            <span className={`text-[10px] uppercase font-bold tracking-wider ${isExpired ? 'text-[#b91c1c]' : isWarning ? 'text-[#ca8a04]' : 'text-[var(--sa-text-muted)]'}`}>
              {isExpired ? 'EXPIRED' : `${daysLeft} days`}
            </span>
          </div>
        );
      },
    },
    {
      header: 'Account Seg.',
      accessorKey: 'accountSegregation',
      cell: (row: any) => (
        row.accountSegregation 
          ? <CheckCircle2 size={16} className="text-[#1D9E75] mx-auto" /> 
          : <AlertTriangle size={16} className="text-[#b91c1c] mx-auto" />
      ),
    },
    {
      header: 'Remittance',
      accessorKey: 'remittanceStatus',
      cell: (row: any) => (
        <StatusPill status={row.remittanceStatus === 'up-to-date' || row.remittanceStatus === 'current' ? 'completed' : 'failed'} />
      ),
    },
    {
      header: 'KYC',
      accessorKey: 'kycStatus',
      cell: (row: any) => (
        <StatusPill status={row.kycStatus === 'verified' ? 'active' : 'pending'} />
      ),
    },
    {
      header: 'Score',
      accessorKey: 'complianceScore',
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-[var(--sa-border)] h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-700 ${(row.complianceScore ?? 0) >= 90 ? 'bg-[#1D9E75]' : (row.complianceScore ?? 0) >= 70 ? 'bg-[#ca8a04]' : 'bg-[#b91c1c]'}`} 
              style={{ width: `${row.complianceScore ?? 0}%` }}
            />
          </div>
          <span className="font-mono text-xs text-[var(--sa-text-primary)]">{row.complianceScore ?? 0}</span>
        </div>
      ),
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      cell: () => (
        <button 
          onClick={() => toast.info('Navigating to Audit records')}
          className="text-[10px] font-bold uppercase tracking-wider text-[#1D9E75] hover:text-[#0c6a55] transition-colors sa-btn-hover hover:underline">
          View Audit
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 sa-stagger">
      <PageHeader
        title="NIC Compliance Observatory"
        subtitle="National Insurance Commission regulatory oversight, licensing, and reporting."
        icon={ShieldAlert}
        breadcrumbs={[
          { label: 'Overview', href: '/super-admin' },
          { label: 'Compliance', href: '/super-admin/nic-monitoring' }
        ]}
        actions={
          <button 
            onClick={() => toast.success('Master report generated and sent to downloads.')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#021a13] bg-[#10b981] hover:bg-[#34d399] rounded-full transition-colors sa-btn-hover">
            <Download size={14} /> Generate Master Report
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Fully Compliant" value={stats?.fullyCompliant ?? 0} suffix={`/${stats?.totalTenants ?? 0}`} icon={CheckCircle2} iconColor="#1d9e75" loading={statsLoading} />
        <StatCard label="Licence Expires <30d" value={stats?.expiringLicences ?? 0} icon={AlertTriangle} iconColor="#ca8a04" loading={statsLoading} />
        <StatCard label="Licence Expired" value={stats?.expiredLicences ?? 0} icon={AlertCircle} iconColor="#b91c1c" loading={statsLoading} />
        <StatCard label="Behind on Remittance" value={stats?.behindRemittance ?? 0} icon={FileText} iconColor="#ca8a04" loading={statsLoading} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 pt-4">
        
        {/* Main Table Area */}
        <div className="xl:col-span-3 space-y-6">
          <div className="bg-[var(--sa-bg-card)] rounded-[var(--sa-radius-md)] border border-[var(--sa-border)] shadow-sm overflow-hidden flex flex-col min-h-0">
            <div className="p-4 border-b border-[var(--sa-border)] flex items-center justify-between">
              <h3 className="text-sm font-bold font-serif text-[var(--sa-text-primary)] flex items-center gap-2">
                <FileSearch size={16} /> Registry of Institutions
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <DataTable
                data={nicData as any}
                columns={columns as any}
                loading={loading}
                onRowClick={(row: any) => toast.info(`Viewing compliance history for ${row.tenantName}`)}
              />
            </div>
          </div>
        </div>

        {/* Regulatory Side Panel */}
        <div className="xl:col-span-1 border border-[#085041] rounded-[var(--sa-radius-md)] bg-[#021a13] text-[#f0f4f3] p-5 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-[#9FE1CB] mb-2 border-b border-[#05291e] pb-4">
            <FileText size={20} />
            <h3 className="text-sm font-bold uppercase tracking-widest leading-none">Directive Framework</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <CalendarIcon size={14} className="text-[#5DCAA5]" />
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#7a9a8c]">Monthly Remittance</h4>
              </div>
              <p className="text-xs text-[#d4e0dc] leading-relaxed font-sans">
                Brokers must remit all collected premiums to insurers by the <span className="text-white font-mono bg-[#1D9E75] px-1 rounded-sm">15th</span> of the following month. Violations incur a 5% monthly penalty charge.
              </p>
            </div>
            
            <div className="pt-4 border-t border-[#05291e]">
              <div className="flex items-center gap-2 mb-1.5">
                <ShieldAlert size={14} className="text-[#5DCAA5]" />
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#7a9a8c]">Account Segregation</h4>
              </div>
              <p className="text-xs text-[#d4e0dc] leading-relaxed font-sans">
                Under Section 221 of Act 1061, operating funds <strong className="text-white font-bold">must be strictly segregated</strong> from fiduciary premium accounts.
              </p>
            </div>

            <div className="pt-4 border-t border-[#05291e]">
              <div className="flex items-center gap-2 mb-1.5">
                <AlertTriangle size={14} className="text-[#5DCAA5]" />
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#7a9a8c]">Licence Renewal</h4>
              </div>
              <p className="text-xs text-[#d4e0dc] leading-relaxed font-sans">
                Notice periods begin 90 days prior to expiry. The platform enforces an automatic restriction on new policy generation for entities operating with an expired licence.
              </p>
            </div>
          </div>

          <div className="p-3 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-800/50 rounded-[var(--sa-radius-md)] mt-8 flex items-start gap-3">
            <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />
            <p className="text-[10px] font-mono text-blue-200 uppercase tracking-widest">
              Automated reports are transmitted to the Commission's API Gateway on the 1st of every month.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
