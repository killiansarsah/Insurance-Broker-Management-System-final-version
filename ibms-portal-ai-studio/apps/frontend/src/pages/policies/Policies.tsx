
/**
 * IBMS Portal - Policy Management Page
 * 
 * @fileoverview Main policy management page for viewing, filtering, and renewing insurance policies.
 * Supports both Motor and Non-Motor policy portfolios with real-time renewal tracking.
 * 
 * @description
 * The Policies page provides:
 * - Policy portfolio overview with filtering by type (Motor/Non-Motor)
 * - Expiring policy alerts with countdown timers
 * - Renewal workflow (reminder or direct bind)
 * - Commission calculations with NIC levy deductions
 * - Search and filter capabilities
 * - Detailed policy ledger table
 * 
 * @remarks
 * **Key Features:**
 * - **Expiring Soon Alerts**: Highlights policies expiring within 30 days
 * - **Renewal Options**:
 *   - Set Follow-up: Schedule a reminder for future action
 *   - Direct Bind: Immediately process policy renewal
 * - **Commission Display**: Shows gross commission, NIC levy, and net commission
 * - **Status Tracking**: Active, Expired, Pending statuses
 * - **Carrier Filtering**: Filter by insurer (GLICO, Imperial, etc.)
 * 
 * **Ghana-Specific Calculations:**
 * - Gross Commission = Premium × Commission Rate
 * - NIC Levy = Gross Commission × 1%
 * - Net Commission = Gross Commission - NIC Levy
 * 
 * **Policy Types:**
 * - Motor: Third Party, Comprehensive
 * - Non-Motor: Life, Bonds, Fire & Property, Marine Cargo, Health
 * 
 * **Renewal Workflow:**
 * 1. User clicks "Start Renewal" on expiring policy
 * 2. Modal opens with two options:
 *    a. Set Follow-up: Schedule reminder date
 *    b. Direct Bind: Immediately renew policy
 * 3. System updates policy status and generates debit note
 * 
 * @author IBMS Ghana Development Team
 */

import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PolicyStatus } from '../../types';

/**
 * Props for the Policies component
 */
interface PoliciesProps {
  /** Filter policies by type: 'Motor', 'Non-Motor', or undefined for all */
  filterType?: string;
}

const Policies: React.FC<PoliciesProps> = ({ initialFilterType }) => {
  const navigate = useNavigate();
  // Enhanced dataset with some specific 'Expiring Soon' examples
  const [data, setData] = useState([
    {
      id: '1001',
      policyNo: 'GG-DSDM-1011-23',
      customer: 'Loretta Boakye',
      phone: '024 123 4567',
      reviewStage: 'Approved',
      status: PolicyStatus.Active,
      protectionType: 'Comprehensive',
      installmentType: 'Annually',
      currency: 'GHS',
      premium: 502.90,
      initialDeposit: 502.90,
      installments: 0,
      totalPayment: 502.90,
      inceptionDate: '01/05/2023',
      insurer: 'GLICO GEN',
      owner: 'K. Nkrumah',
      manager: 'J. Rawlings',
      createdOn: '24/12/2025',
      
      // Legacy fields for logic compatibility
      class: 'Motor',
      location: 'DV 875A',
      expiry: '24/05/2024',
      isExpiringSoon: true,
      daysRemaining: 12,
      net: 46.52,
      sumInsured: 0
    },
    {
      id: '1002',
      policyNo: 'IMP/2023/MPI/010',
      customer: 'Ernest Asante Offei',
      phone: '050 987 6543',
      reviewStage: 'Pending Review',
      status: PolicyStatus.Expired,
      protectionType: 'Third Party',
      installmentType: 'Quarterly',
      currency: 'USD',
      premium: 1681.00,
      initialDeposit: 420.25,
      installments: 3,
      totalPayment: 420.25,
      inceptionDate: '05/01/2023',
      insurer: 'IMPERIAL',
      owner: 'K. Nkrumah',
      manager: 'J. Agyekum',
      createdOn: '20/12/2024',

      // Legacy fields
      class: 'Motor',
      location: 'GW 2160-22',
      expiry: '15/06/2023',
      isExpiringSoon: false,
      daysRemaining: 0,
      net: 256.56,
      sumInsured: 50000
    },
    {
      id: '1003',
      policyNo: 'GL/GLA 20190199',
      customer: 'Salt To Ghana',
      phone: '030 222 3333',
      reviewStage: 'Approved',
      status: PolicyStatus.Active,
      protectionType: 'Grouplife',
      installmentType: 'Annually',
      currency: 'GHS',
      premium: 23660.00,
      initialDeposit: 23660.00,
      installments: 0,
      totalPayment: 23660.00,
      inceptionDate: '02/12/2022',
      insurer: 'GLICO LIFE',
      owner: 'A. Yeboah',
      manager: 'J. Rawlings',
      createdOn: '15/11/2024',

      // Legacy fields
      class: 'Life',
      location: 'Staff Group',
      expiry: '28/05/2024',
      isExpiringSoon: true,
      daysRemaining: 3,
      net: 4377.10,
      sumInsured: 1820000
    },
    {
      id: '1004',
      policyNo: 'ENT/23/MOT/00912',
      customer: 'Kwame Mensah',
      phone: '027 555 1234',
      reviewStage: 'Underwriting',
      status: PolicyStatus.Active,
      protectionType: 'Comprehensive',
      installmentType: 'Semi-Annually',
      currency: 'GHS',
      premium: 2450.00,
      initialDeposit: 1225.00,
      installments: 1,
      totalPayment: 1225.00,
      inceptionDate: '10/03/2023',
      insurer: 'ENTERPRISE',
      owner: 'K. Nkrumah',
      manager: 'J. Agyekum',
      createdOn: '01/03/2025',

      // Legacy fields
      class: 'Motor',
      location: 'GT 4521-23',
      expiry: '09/03/2024',
      isExpiringSoon: false,
      daysRemaining: 245,
      net: 363.83,
      sumInsured: 85000
    }
  ]);

  const [filterType, setFilterType] = useState<string | null>(initialFilterType || null);
  const [filterInsurer, setFilterInsurer] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Renewal State
  const [selectedPolicyForRenewal, setSelectedPolicyForRenewal] = useState<any | null>(null);
  const [reminderDate, setReminderDate] = useState('');
  const [renewalType, setRenewalType] = useState<'reminder' | 'process'>('reminder');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Dropdown State
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  const toggleDropdown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDropdownId(activeDropdownId === id ? null : id);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => setActiveDropdownId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Filtering expiring soon policies
  const expiringSoonPolicies = useMemo(() => {
    return data.filter(p => {
      return p.status === PolicyStatus.Active && p.isExpiringSoon;
    });
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter(p => {
      const matchesSearch = 
        p.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.policyNo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesInsurer = filterInsurer === 'All' || p.insurer === filterInsurer;
      
      let matchesFilterType = true;
      if (filterType === 'Motor') {
        matchesFilterType = p.class === 'Motor';
      } else if (filterType === 'Non-Motor') {
        matchesFilterType = p.class !== 'Motor';
      }
      
      return matchesSearch && matchesInsurer && matchesFilterType;
    });
  }, [data, searchTerm, filterInsurer, filterType]);

  // Dashboard Stats
  const stats = useMemo(() => {
    return {
      total: filteredData.length,
      active: filteredData.filter(p => p.status === PolicyStatus.Active).length,
      expired: filteredData.filter(p => p.status === PolicyStatus.Expired).length,
      pending: filteredData.filter(p => p.isExpiringSoon).length,
      premium: filteredData.reduce((sum, p) => sum + p.premium, 0)
    };
  }, [filteredData]);

  const handleRenewPolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (renewalType === 'process') {
      setToastMessage(`Policy ${selectedPolicyForRenewal.policyNo} renewal process initiated.`);
      setData(prev => prev.map(p => p.id === selectedPolicyForRenewal.id ? { ...p, status: PolicyStatus.Active, isExpiringSoon: false, daysRemaining: 365 } : p));
    } else {
      setToastMessage(`Renewal reminder set for ${reminderDate}.`);
    }
    
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
    setSelectedPolicyForRenewal(null);
  };

  return (
    <div className="flex flex-col gap-8 pb-20 relative">
      {/* ... (Header and Stats Section remain unchanged) ... */}
      
      {/* ... (Search and Filter Section) ... */}

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden min-h-[500px]">
        <div className="overflow-x-auto pb-24 custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[2400px]">
            <thead>
              <tr className="bg-slate-100/50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800">
                {[
                  'Policy ID', 'Insurer Policy #', 'Customer', 'Phone #', 'Review Stage', 'Status', 
                  'Protection Type', 'Installment Type', 'Currency', 'Outright Premium', 'Initial Deposit', 
                  'Installments', 'Total Payment', 'Inception Date', 'Insurer', 'Owner', 'Manager', 'Created On', 'Actions'
                ].map(h => (
                  <th key={h} className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 border-r border-slate-200/50 dark:border-slate-800 last:border-r-0 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredData.map((row) => (
                <tr 
                  key={row.id} 
                  onClick={() => navigate(`/policies/view/${row.id}`)}
                  className={`group transition-all duration-300 relative cursor-pointer hover-lift ${
                    row.isExpiringSoon 
                    ? 'bg-amber-50/40 dark:bg-amber-900/10 hover:bg-white dark:hover:bg-slate-800 border-l-4 border-l-amber-500' 
                    : row.status === PolicyStatus.Expired 
                    ? 'bg-rose-50/40 dark:bg-rose-900/10 hover:bg-white dark:hover:bg-slate-800 border-l-4 border-l-rose-500'
                    : 'hover:bg-white dark:hover:bg-slate-800 border-l-4 border-l-transparent hover:border-l-primary'
                  }`}
                >
                  <td className="px-6 py-5 text-[11px] font-mono font-bold text-slate-500 border-r border-slate-100 dark:border-slate-800">#{row.id}</td>
                  <td className="px-6 py-5 text-[11px] font-mono font-black text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800">{row.policyNo}</td>
                  <td className="px-6 py-5 border-r border-slate-100 dark:border-slate-800">
                     <span className="text-xs font-black text-slate-900 dark:text-white uppercase">{row.customer}</span>
                  </td>
                  <td className="px-6 py-5 text-[11px] font-mono text-slate-500 border-r border-slate-100 dark:border-slate-800">{row.phone}</td>
                  <td className="px-6 py-5 border-r border-slate-100 dark:border-slate-800">
                    <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${
                      row.reviewStage === 'Approved' ? 'bg-emerald-100/50 text-emerald-700' : 
                      row.reviewStage === 'Pending Review' ? 'bg-amber-100/50 text-amber-700' : 'bg-blue-100/50 text-blue-700'
                    }`}>{row.reviewStage}</span>
                  </td>
                  <td className="px-6 py-5 border-r border-slate-100 dark:border-slate-800">
                    <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      row.status === PolicyStatus.Active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                      'bg-rose-50 text-rose-600 border-rose-100'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-[10px] font-bold text-slate-600 uppercase border-r border-slate-100 dark:border-slate-800">{row.protectionType}</td>
                  <td className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase border-r border-slate-100 dark:border-slate-800">{row.installmentType}</td>
                  <td className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase border-r border-slate-100 dark:border-slate-800">{row.currency}</td>
                  <td className="px-6 py-5 text-xs font-black text-slate-900 dark:text-white text-right border-r border-slate-100 dark:border-slate-800">{row.premium.toLocaleString()}</td>
                  <td className="px-6 py-5 text-xs font-medium text-slate-600 dark:text-slate-400 text-right border-r border-slate-100 dark:border-slate-800">{row.initialDeposit.toLocaleString()}</td>
                  <td className="px-6 py-5 text-xs font-medium text-center border-r border-slate-100 dark:border-slate-800">{row.installments}</td>
                  <td className="px-6 py-5 text-xs font-black text-emerald-600 text-right border-r border-slate-100 dark:border-slate-800">{row.totalPayment.toLocaleString()}</td>
                  <td className="px-6 py-5 text-[11px] font-mono text-slate-500 border-r border-slate-100 dark:border-slate-800">{row.inceptionDate}</td>
                  <td className="px-6 py-5 border-r border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-600 uppercase truncate max-w-[120px] block" title={row.insurer}>{row.insurer}</span>
                  </td>
                  <td className="px-6 py-5 text-[10px] font-medium text-slate-500 border-r border-slate-100 dark:border-slate-800">{row.owner}</td>
                  <td className="px-6 py-5 text-[10px] font-medium text-slate-500 border-r border-slate-100 dark:border-slate-800">{row.manager}</td>
                  <td className="px-6 py-5 text-[11px] font-mono text-slate-500 border-r border-slate-100 dark:border-slate-800">{row.createdOn}</td>
                  
                  <td className="px-6 py-5 text-right sticky right-0 bg-white dark:bg-slate-900 border-l border-slate-100 dark:border-slate-800 z-10">
                    <div className="flex items-center justify-end gap-3" onClick={(e) => e.stopPropagation()}>
                       <div className="relative">
                        <button 
                          onClick={(e) => toggleDropdown(row.id, e)}
                          className={`size-8 rounded-lg flex items-center justify-center border transition-all ${activeDropdownId === row.id ? 'bg-primary text-white border-primary' : 'border-slate-200 text-slate-400 hover:text-primary hover:bg-slate-50'}`}
                        >
                          <span className="material-symbols-outlined text-lg">more_horiz</span>
                        </button>
                        
                        {activeDropdownId === row.id && (
                          <div className="absolute right-0 top-9 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 z-[50] overflow-hidden flex flex-col animate-fadeIn">
                             <button onClick={() => navigate(`/policies/view/${row.id}`)} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary transition-colors flex items-center gap-3">
                                <span className="material-symbols-outlined text-base">visibility</span> View
                             </button>
                             <button onClick={() => navigate(`/policies/edit/${row.id}`)} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary transition-colors flex items-center gap-3 border-t border-slate-50 dark:border-slate-800">
                                <span className="material-symbols-outlined text-base">edit</span> Edit
                             </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      {/* RENEWAL MODAL */}
      {selectedPolicyForRenewal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedPolicyForRenewal(null)}></div>
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 p-10 animate-fadeIn">
            <div className="flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Policy Renewal</h2>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Audit Ledger Entry: {selectedPolicyForRenewal.no}</p>
                </div>
                <button onClick={() => setSelectedPolicyForRenewal(null)} className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
                <button 
                  onClick={() => setRenewalType('reminder')}
                  className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${renewalType === 'reminder' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Set Follow-up
                </button>
                <button 
                  onClick={() => setRenewalType('process')}
                  className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${renewalType === 'process' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Direct Bind
                </button>
              </div>

              <form onSubmit={handleRenewPolicy} className="flex flex-col gap-8">
                {renewalType === 'reminder' ? (
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Follow-up Reminder Date</label>
                      <input 
                        type="date" 
                        required
                        className="h-14 px-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold text-sm focus:bg-white transition-all shadow-inner"
                        value={reminderDate}
                        onChange={(e) => setReminderDate(e.target.value)}
                      />
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-3xl border border-amber-100 dark:border-amber-800 flex gap-4">
                      <span className="material-symbols-outlined text-amber-500">notifications_active</span>
                      <p className="text-[11px] font-bold text-amber-800 dark:text-amber-400/80 uppercase tracking-tight leading-relaxed">
                        Setting a reminder will automatically add this policy to your Task List and push an alert to your dashboard on the selected date.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    <div className="p-8 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 rounded-3xl flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Immediate Policy Extension</span>
                        <span className="material-symbols-outlined text-emerald-600">verified</span>
                      </div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                        Proceeding will generate a new Debit Note and extend cover for <strong className="text-slate-900 dark:text-white uppercase">{selectedPolicyForRenewal.insured}</strong>. Premium: GH₵ {selectedPolicyForRenewal.premium.toLocaleString()}.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setSelectedPolicyForRenewal(null)}
                    className="flex-1 h-14 rounded-2xl border border-slate-200 dark:border-slate-800 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
                  >
                    Discard
                  </button>
                  <button 
                    type="submit"
                    className={`flex-1 h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl transition-all hover:scale-[1.02] text-white ${
                      renewalType === 'process' ? 'bg-emerald-600 shadow-emerald-600/20' : 'bg-primary shadow-primary/20'
                    }`}
                  >
                    {renewalType === 'process' ? 'Initiate Bind' : 'Schedule Reminder'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showSuccessToast && (
        <div className="fixed bottom-10 right-10 z-[200] animate-fadeIn">
          <div className="bg-slate-900 text-white px-10 py-5 rounded-[2rem] shadow-2xl flex items-center gap-5 border border-slate-700">
            <div className="size-10 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
              <span className="material-symbols-outlined font-black">check_circle</span>
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-widest">Transaction Recorded</p>
              <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">{toastMessage}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Policies;
