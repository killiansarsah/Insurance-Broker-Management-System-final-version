'use client';

import { toast } from 'sonner';
import { PageHeader } from '@/components/super-admin/PageHeader';
import { StatCard } from '@/components/super-admin/StatCard';
import { DataTable } from '@/components/super-admin/DataTable';
import { StatusPill } from '@/components/super-admin/StatusPill';
import { ShieldAlert, FileText, CheckCircle2, AlertTriangle, AlertCircle, FileSearch, Calendar as CalendarIcon, Download, Info } from 'lucide-react';

const mockNICData = [
  { id: 'nic_1', tenant: 'Vanguard Insurance Group', license: 'NIC/BR/001/2026', expiry: '2026-12-31', daysLeft: 651, segregation: true, remittance: 'up-to-date', levy: 'Paid', kyc: 'verified', score: 98 },
  { id: 'nic_2', tenant: 'Horizon Brokers Ltd', license: 'NIC/BR/042/2024', expiry: '2024-11-15', daysLeft: 23, segregation: true, remittance: 'behind', levy: 'Pending', kyc: 'verified', score: 82 },
  { id: 'nic_3', tenant: 'Apex Secure Solutions', license: 'NIC/BR/089/2023', expiry: '2023-12-01', daysLeft: -110, segregation: false, remittance: 'behind', levy: 'Paid', kyc: 'missing', score: 45 },
  { id: 'nic_4', tenant: 'Meridian Capital', license: 'NIC/BR/110/2025', expiry: '2025-06-30', daysLeft: 465, segregation: true, remittance: 'up-to-date', levy: 'Paid', kyc: 'verified', score: 95 },
  { id: 'nic_5', tenant: 'Sterling Risk Mgmt', license: 'NIC/BR/055/2024', expiry: '2024-05-10', daysLeft: -315, segregation: true, remittance: 'up-to-date', levy: 'Pending', kyc: 'verified', score: 70 },
];

export default function NICMonitoringPage() {
  const columns = [
    {
      header: 'Tenant Name',
      accessorKey: 'tenant',
      cell: (row: typeof mockNICData[0]) => (
        <div className="font-bold text-gray-900">{row.tenant}</div>
      ),
    },
    {
      header: 'License #',
      accessorKey: 'license',
      cell: (row: typeof mockNICData[0]) => (
        <span className="font-mono text-xs text-[#0c6a55]">{row.license}</span>
      ),
    },
    {
      header: 'Expiry Date',
      accessorKey: 'expiry',
      cell: (row: typeof mockNICData[0]) => {
        const isExpired = row.daysLeft < 0;
        const isWarning = row.daysLeft >= 0 && row.daysLeft <= 30;
        return (
          <div className="flex flex-col">
            <span className={`font-mono text-xs font-bold ${isExpired ? 'text-[#b91c1c]' : isWarning ? 'text-[#ca8a04]' : 'text-[#1D9E75]'}`}>
              {row.expiry}
            </span>
            <span className={`text-[10px] uppercase font-bold tracking-wider ${isExpired ? 'text-[#b91c1c]' : isWarning ? 'text-[#ca8a04]' : 'text-gray-500'}`}>
              {isExpired ? 'EXPIRED' : `${row.daysLeft} days`}
            </span>
          </div>
        );
      },
    },
    {
      header: 'Account Seq.',
      accessorKey: 'segregation',
      cell: (row: typeof mockNICData[0]) => (
        row.segregation 
          ? <CheckCircle2 size={16} className="text-[#1D9E75] mx-auto" /> 
          : <AlertTriangle size={16} className="text-[#b91c1c] mx-auto" />
      ),
    },
    {
      header: 'Remittance',
      accessorKey: 'remittance',
      cell: (row: typeof mockNICData[0]) => (
        <StatusPill status={row.remittance === 'up-to-date' ? 'completed' : 'failed'} />
      ),
    },
    {
      header: 'KYC',
      accessorKey: 'kyc',
      cell: (row: typeof mockNICData[0]) => (
        <StatusPill status={row.kyc === 'verified' ? 'active' : 'pending'} />
      ),
    },
    {
      header: 'Score',
      accessorKey: 'score',
      cell: (row: typeof mockNICData[0]) => (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-[#e6ecea] h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full ${row.score >= 90 ? 'bg-[#1D9E75]' : row.score >= 70 ? 'bg-[#ca8a04]' : 'bg-[#b91c1c]'}`} 
              style={{ width: `${row.score}%` }}
            />
          </div>
          <span className="font-mono text-xs">{row.score}</span>
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
        <StatCard label="Fully Compliant" value={138} suffix="/142" icon={CheckCircle2} iconColor="#1d9e75" onClick={() => toast.info('Filtering list to purely compliant instances.')} />
        <StatCard label="Licence Expires <30d" value={18} icon={AlertTriangle} iconColor="#ca8a04" onClick={() => toast.warning('Filtering list to expiring licenses.')} />
        <StatCard label="Licence Expired" value={4} change={1} changeLabel="new today" icon={AlertCircle} iconColor="#b91c1c" onClick={() => toast.error('List filtered to suspended tenants.')} />
        <StatCard label="Behind on Remittance" value={12} icon={FileText} iconColor="#ca8a04" onClick={() => toast.warning('List filtered to un-remitted tenants.')} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 pt-4">
        
        {/* Main Table Area */}
        <div className="xl:col-span-3 space-y-6">
          <div className="bg-[var(--sa-bg-card)] rounded-[var(--sa-radius-md)] border border-[var(--sa-border)] shadow-sm overflow-hidden flex flex-col min-h-0">
            <div className="p-4 border-b border-[var(--sa-border)] flex items-center justify-between">
              <h3 className="text-sm font-bold font-serif text-[var(--sa-text-primary)] flex items-center gap-2">
                <FileSearch size={16} /> Registry of Institutions
              </h3>
              <div className="flex gap-2">
                <select 
                  onChange={(e) => toast.info(`Applied dynamic filter: ${e.target.value}`)}
                  className="text-[10px] font-bold uppercase tracking-wider text-[var(--sa-text-primary)] bg-[var(--sa-bg-page)] border-none rounded-[8px] px-3 py-1.5 outline-none sa-btn-hover cursor-pointer">
                  <option>Filter: Expired</option>
                  <option>Filter: At Risk</option>
                  <option>Filter: Compliant</option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <DataTable
                data={mockNICData}
                columns={columns}
                onRowClick={(row) => toast.info(`Viewing compliance history for ${row.tenant}`)}
              />
            </div>
          </div>
        </div>

        {/* Regulatory Side Panel */}
        <div className="xl:col-span-1 border border-[#085041] rounded-sm bg-[#021a13] text-[#f0f4f3] p-5 shadow-sm space-y-6">
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
                Under Section 221 of Act 1061, operating funds <strong className="text-white font-bold">must be strictly segregated</strong> from fiduciary premium accounts. Automated system flags trigger at 00:00 GMT on violation.
              </p>
            </div>

            <div className="pt-4 border-t border-[#05291e]">
              <div className="flex items-center gap-2 mb-1.5">
                <AlertTriangle size={14} className="text-[#5DCAA5]" />
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#7a9a8c]">Licence Renewal</h4>
              </div>
              <p className="text-xs text-[#d4e0dc] leading-relaxed font-sans">
                Notice periods begin 90 days prior to expiry. The platform enforces an automatic restriction on new policy generation for entities operating with an expired licence (0 days).
              </p>
            </div>
          </div>

          <div className="p-3 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-800/50 rounded-sm mt-8 flex items-start gap-3">
            <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />
            <p className="text-[10px] font-mono text-blue-200 uppercase tracking-widest">
              Automated reports are securely transmitted to the Commission's API Gateway on the 1st of every month.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
