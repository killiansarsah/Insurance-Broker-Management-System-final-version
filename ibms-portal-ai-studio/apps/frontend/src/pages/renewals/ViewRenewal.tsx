import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Renewal, RenewalStatus } from '../../types';
import Iconify from '../../components/ui/Iconify';

const ViewRenewal: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [renewal, setRenewal] = useState<Renewal | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    // Generate mock data for demonstration purposes
    // In a real application, this would be an API call matching the ID
    const mockRenewals: Renewal[] = [
      {
        _id: 'REN-00001',
        policyId: 'POL-00100',
        policyNumber: 'GH-2024-1000',
        clientName: 'Kofi Mensah',
        policyType: 'Motor - Comprehensive',
        insurer: 'GLICO',
        expiryDate: '2024-11-15',
        daysToExpiry: 12,
        currentPremium: 4500,
        proposedPremium: 4800,
        status: RenewalStatus.Contacted,
        contactAttempts: 2,
        lastContactDate: '2024-10-30',
        notes: 'Client is considering the proposed premium increase. Promised to confirm by end of week.',
        assignedAgent: 'James Mensah'
      },
      {
        _id: 'REN-00002',
        policyId: 'POL-00101',
        policyNumber: 'GH-2024-1001',
        clientName: 'Ama Asante',
        policyType: 'Fire & Property',
        insurer: 'Enterprise',
        expiryDate: '2024-12-20',
        daysToExpiry: 47,
        currentPremium: 12000,
        proposedPremium: 12500,
        status: RenewalStatus.Pending,
        contactAttempts: 0,
        notes: '',
        assignedAgent: 'Sarah Osei'
      }
    ];

    const found = mockRenewals.find(r => r._id === id);
    if (found) {
      setRenewal(found);
    } else {
      // Create a dynamic mock if not found in list (simulating backend fetch)
      setRenewal({
        _id: id || 'REN-UNKNOWN',
        policyId: 'POL-99999',
        policyNumber: 'GH-2024-9999',
        clientName: 'Dynamic Client Name',
        policyType: 'Life Insurance',
        insurer: 'Hollard',
        expiryDate: new Date().toISOString().split('T')[0],
        daysToExpiry: 0,
        currentPremium: 5000,
        proposedPremium: 5500,
        status: RenewalStatus.Pending,
        contactAttempts: 1,
        lastContactDate: new Date().toISOString().split('T')[0],
        notes: 'Fetched from database mock.',
        assignedAgent: 'Michael Addo'
      });
    }
  }, [id]);

  if (!renewal) return null;

  const getStatusColor = (status: RenewalStatus) => {
    switch (status) {
      case RenewalStatus.Pending: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
      case RenewalStatus.Contacted: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case RenewalStatus.Quoted: return 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400';
      case RenewalStatus.Renewed: return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400';
      case RenewalStatus.Lost: return 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400';
      default: return 'bg-slate-100 text-slate-500';
    }
  };

  const getUrgencyColor = (days: number) => {
    if (days < 0) return 'text-rose-500';
    if (days <= 7) return 'text-rose-500';
    if (days <= 30) return 'text-amber-500';
    return 'text-slate-500';
  };

  const handleProcessRenewal = () => {
    toast.info('Initializing renewal process...');
    // Real logic would involve opening a multi-step form or dialog
  };

  const handleContactClient = () => {
    toast.info(`Calling ${renewal?.clientName || 'client'}...`);
  };

  const handleSendReminder = () => {
    toast.success(`Renewal reminder sent to ${renewal?.clientName || 'client'} via Email and SMS.`);
  };

  return (
    <div className="flex flex-col gap-8 pb-20 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
             <button onClick={() => navigate('/renewals')} className="size-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:bg-slate-50 transition-colors">
                <span className="material-symbols-outlined text-slate-600">arrow_back</span>
             </button>
             <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Renewal Details</h1>
          </div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest ml-14">Ref: #{renewal._id}</p>
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={() => navigate(`/renewals/edit/${renewal._id}`)}
             className="h-12 px-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
           >
             <span className="material-symbols-outlined text-lg">edit</span>
             Edit
           </button>
           <button 
             onClick={() => setShowHistory(true)}
             className={`h-12 px-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 ${showHistory ? 'ring-2 ring-primary' : ''}`}
           >
             <span className="material-symbols-outlined text-lg">history</span>
             History
           </button>
           <button 
             onClick={handleProcessRenewal}
             className="h-12 px-6 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all flex items-center gap-2"
           >
             <span className="material-symbols-outlined text-lg">refresh</span>
             Process Renewal
           </button>
        </div>
      </div>

      {showHistory && (
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/20 rounded-3xl p-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-amber-900 dark:text-amber-400 uppercase tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined">history</span>
              Renewal History Trace
            </h3>
            <button onClick={() => setShowHistory(false)} className="text-amber-500 hover:text-amber-700">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-white dark:bg-slate-900/50 rounded-2xl border border-amber-100 dark:border-amber-900/10">
              <div className="size-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-sm">check_circle</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">Initial Engagement</p>
                <p className="text-[10px] font-bold text-slate-400">Oct 25, 2024 - Sarah Adeyemi</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Confirmed client intends to renew. Requested quote review.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-white dark:bg-slate-900/50 rounded-2xl border border-amber-100 dark:border-amber-900/10 opacity-60">
              <div className="size-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-sm">mail</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">System Reminder Sent</p>
                <p className="text-[10px] font-bold text-slate-400">Oct 15, 2024 - Auto Agent</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Automated 30-day renewal notification delivered.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Summary Banner */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm overflow-hidden relative">
             <div className="absolute top-0 right-0 p-8">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(renewal.status)}`}>
                  {renewal.status}
                </span>
             </div>
             <div className="flex items-center gap-6">
                <div className="size-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                   <span className="material-symbols-outlined text-4xl font-bold">event_repeat</span>
                </div>
                <div className="flex flex-col gap-1">
                   <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{renewal.clientName}</h2>
                   <div className="flex items-center gap-4">
                      <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">{renewal.policyType}</p>
                      <div className="size-1 rounded-full bg-slate-300"></div>
                      <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">{renewal.insurer}</p>
                   </div>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Policy Information */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm flex flex-col gap-8">
               <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                 <span className="material-symbols-outlined text-primary text-lg">policy</span>
                 Policy Information
               </h3>
               <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Policy Number</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{renewal.policyNumber}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Policy ID</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{renewal.policyId}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Insurance Type</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{renewal.policyType}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Underwriter</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{renewal.insurer}</p>
                  </div>
               </div>
            </div>

            {/* Timeline & Pipeline */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm flex flex-col gap-8">
               <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                 <span className="material-symbols-outlined text-primary text-lg">calendar_today</span>
                 Renewal Timeline
               </h3>
               <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Expiry Date</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{new Date(renewal.expiryDate).toLocaleDateString()}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Urgency</p>
                    <p className={`text-sm font-black uppercase ${getUrgencyColor(renewal.daysToExpiry)}`}>
                       {renewal.daysToExpiry < 0 ? `${Math.abs(renewal.daysToExpiry)} Days Overdue` : `${renewal.daysToExpiry} Days Left`}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Last Contact</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{renewal.lastContactDate || 'Never'}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Contact Attempts</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{renewal.contactAttempts} Times</p>
                  </div>
               </div>
            </div>

            {/* Premium Analytics */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm flex flex-col gap-8 md:col-span-2">
               <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                 <span className="material-symbols-outlined text-primary text-lg">assessment</span>
                 Premium Analytics
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Premium</p>
                     <p className="text-xl font-black text-slate-900 dark:text-white">GH₵ {renewal.currentPremium.toLocaleString()}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                     <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Proposed Renewal</p>
                     <p className="text-xl font-black text-primary">GH₵ {renewal.proposedPremium.toLocaleString()}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Premium Variance</p>
                     <p className={`text-xl font-black ${renewal.proposedPremium > renewal.currentPremium ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {renewal.proposedPremium > renewal.currentPremium ? '+' : ''}
                        {(((renewal.proposedPremium - renewal.currentPremium) / renewal.currentPremium) * 100).toFixed(1)}%
                     </p>
                  </div>
               </div>
            </div>

            {/* Notes & Comments */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm flex flex-col gap-4 md:col-span-2">
               <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                 <span className="material-symbols-outlined text-primary text-lg">notes</span>
                 Renewal Notes
               </h3>
               <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                  {renewal.notes || "No internal notes have been recorded for this renewal yet. Proactive engagement is recommended."}
               </p>
            </div>
          </div>
        </div>

        {/* Right Column - Agent & Actions */}
        <div className="lg:col-span-4 flex flex-col gap-8">
           {/* Quick Stats Summary */}
           <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl flex flex-col gap-8">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">At a Glance</h3>
              <div className="flex flex-col gap-6">
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</span>
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${getStatusColor(renewal.status).replace('bg-', 'bg-opacity-20 bg-')}`}>
                       {renewal.status}
                    </span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Agent</span>
                    <span className="text-sm font-black text-white">{renewal.assignedAgent}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue at Risk</span>
                    <span className="text-sm font-black text-primary font-mono tracking-tight">GH₵ {renewal.currentPremium.toLocaleString()}</span>
                 </div>
                 <div className="h-px bg-slate-800"></div>
                 <div className="flex flex-col gap-3 pt-2">
                    <button 
                      onClick={handleContactClient}
                      className="w-full h-12 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                       <span className="material-symbols-outlined text-lg">call</span>
                       Contact Client Now
                    </button>
                    <button 
                      onClick={handleSendReminder}
                      className="w-full h-12 rounded-xl bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border border-white/10"
                    >
                       <span className="material-symbols-outlined text-lg">mail</span>
                       Send Reminder
                    </button>
                 </div>
              </div>
           </div>

           {/* Internal Checkpoints */}
           <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm flex flex-col gap-6">
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Compliance Status</h3>
              <div className="flex flex-col gap-4">
                 {[
                   { label: 'KYC Validated', status: true },
                   { label: 'Claim History Checked', status: true },
                   { label: 'Discount Approval', status: false },
                   { label: 'Premium Board Approved', status: false }
                 ].map((item, idx) => (
                   <div key={idx} className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{item.label}</span>
                      <span className={`material-symbols-outlined text-lg ${item.status ? 'text-emerald-500' : 'text-slate-300'}`}>
                         {item.status ? 'check_circle' : 'circle'}
                      </span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ViewRenewal;
