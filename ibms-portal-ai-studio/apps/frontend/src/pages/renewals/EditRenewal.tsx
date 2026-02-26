
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Renewal, RenewalStatus } from '../../types';

const EditRenewal: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    clientName: '',
    policyType: '',
    insurer: '',
    proposedPremium: 0,
    status: RenewalStatus.Pending,
    notes: '',
    assignedAgent: '',
    contactAttempts: 0,
    lastContactDate: ''
  });

  const [renewal, setRenewal] = useState<Renewal | null>(null);

  useEffect(() => {
    // Generate mock data for demonstration purposes
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
      setFormData({
        clientName: found.clientName,
        policyType: found.policyType,
        insurer: found.insurer,
        proposedPremium: found.proposedPremium,
        status: found.status,
        notes: found.notes,
        assignedAgent: found.assignedAgent,
        contactAttempts: found.contactAttempts,
        lastContactDate: found.lastContactDate || ''
      });
    } else {
      // Fallback dynamic mock
      const dynamicRenewal: Renewal = {
        _id: id || 'REN-UNKNOWN',
        policyId: 'POL-99999',
        policyNumber: 'GH-2024-9999',
        clientName: 'Dynamic Client',
        policyType: 'General Insurance',
        insurer: 'Hollard',
        expiryDate: new Date().toISOString().split('T')[0],
        daysToExpiry: 0,
        currentPremium: 5000,
        proposedPremium: 5500,
        status: RenewalStatus.Pending,
        contactAttempts: 1,
        lastContactDate: new Date().toISOString().split('T')[0],
        notes: 'Fallback mock data.',
        assignedAgent: 'Michael Addo'
      };
      setRenewal(dynamicRenewal);
      setFormData({
        clientName: dynamicRenewal.clientName,
        policyType: dynamicRenewal.policyType,
        insurer: dynamicRenewal.insurer,
        proposedPremium: dynamicRenewal.proposedPremium,
        status: dynamicRenewal.status,
        notes: dynamicRenewal.notes,
        assignedAgent: dynamicRenewal.assignedAgent,
        contactAttempts: dynamicRenewal.contactAttempts,
        lastContactDate: dynamicRenewal.lastContactDate || ''
      });
    }
    setLoading(false);
  }, [id]);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    toast.success('Renewal record updated successfully!');
    navigate(`/renewals/view/${id}`);
  };

  if (loading || !renewal) return null;

  const agents = ['James Mensah', 'Sarah Osei', 'Michael Addo', 'Grace Adu'];
  
  const insurers = ['GLICO', 'Enterprise', 'Hollard', 'Star', 'SIC', 'Allianz', 'Phoenix', 'Old Mutual'];
  
  const policyTypes = [
    'Motor - Comprehensive',
    'Motor - Third Party',
    'Fire & Property',
    'Life Insurance',
    'Health Insurance',
    'Marine Cargo',
    'Professional Indemnity',
    'Public Liability',
    'Travel Insurance'
  ];

  return (
    <div className="flex flex-col gap-8 pb-20 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
             <button onClick={() => navigate(`/renewals/view/${id}`)} className="size-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:bg-slate-50 transition-colors">
                <span className="material-symbols-outlined text-slate-600">arrow_back</span>
             </button>
             <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Edit Renewal</h1>
          </div>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1 ml-14">Ref: #{id}</p>
        </div>
        <div className="flex items-center gap-3">
           <button onClick={() => navigate(`/renewals/view/${id}`)} className="h-12 px-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-900 transition-colors text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">close</span>
              Cancel
           </button>
           <button 
             onClick={handleSave}
             className="h-12 px-8 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all flex items-center gap-2"
           >
             <span className="material-symbols-outlined text-lg">save</span>
             Update Record
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form Column */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Main Info Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-10 shadow-sm">
             <div className="flex flex-col gap-10">
                {/* Core Record Details */}
                <div className="flex flex-col gap-6">
                   <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">person_edit</span>
                      Core Record Details
                   </h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="flex flex-col gap-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Client Name *</label>
                         <input 
                           type="text" 
                           className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold"
                           value={formData.clientName}
                           onChange={(e) => updateField('clientName', e.target.value)}
                         />
                      </div>
                      <div className="flex flex-col gap-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Insurer *</label>
                         <select 
                           className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold text-slate-900 dark:text-white"
                           value={formData.insurer}
                           onChange={(e) => updateField('insurer', e.target.value)}
                         >
                           {insurers.map(insurer => (
                             <option key={insurer} value={insurer}>{insurer}</option>
                           ))}
                         </select>
                      </div>
                      <div className="flex flex-col gap-2 md:col-span-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Policy Type *</label>
                         <select 
                           className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold text-slate-900 dark:text-white"
                           value={formData.policyType}
                           onChange={(e) => updateField('policyType', e.target.value)}
                         >
                           {policyTypes.map(type => (
                             <option key={type} value={type}>{type}</option>
                           ))}
                         </select>
                      </div>
                   </div>
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

                {/* Pipeline & Status */}
                <div className="flex flex-col gap-6">
                   <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">analytics</span>
                      Pipeline Information
                   </h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="flex flex-col gap-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Renewal Status *</label>
                         <select 
                           className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold text-slate-900 dark:text-white"
                           value={formData.status}
                           onChange={(e) => updateField('status', e.target.value as RenewalStatus)}
                         >
                           {Object.values(RenewalStatus).map(status => (
                             <option key={status} value={status}>{status}</option>
                           ))}
                         </select>
                      </div>
                      <div className="flex flex-col gap-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Agent *</label>
                         <select 
                           className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold text-slate-900 dark:text-white"
                           value={formData.assignedAgent}
                           onChange={(e) => updateField('assignedAgent', e.target.value)}
                         >
                           {agents.map(agent => (
                             <option key={agent} value={agent}>{agent}</option>
                           ))}
                         </select>
                      </div>
                   </div>
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

                {/* Financials */}
                <div className="flex flex-col gap-6">
                   <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">payments</span>
                      Premium Particulars
                   </h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="flex flex-col gap-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Proposed Renewal Premium (GH₵) *</label>
                         <input 
                           type="number" 
                           className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-black text-lg text-primary"
                           value={formData.proposedPremium}
                           onChange={(e) => updateField('proposedPremium', Number(e.target.value))}
                         />
                      </div>
                      <div className="flex flex-col gap-2 opacity-60">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Premium (Read Only)</label>
                         <div className="h-14 px-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-800/50 font-bold flex items-center text-slate-500">
                            GH₵ {renewal.currentPremium.toLocaleString()}
                         </div>
                      </div>
                   </div>
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

                {/* Engagement */}
                <div className="flex flex-col gap-6">
                   <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">history</span>
                      Engagement Tracking
                   </h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="flex flex-col gap-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Attempts</label>
                         <input 
                           type="number" 
                           className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold"
                           value={formData.contactAttempts}
                           onChange={(e) => updateField('contactAttempts', Number(e.target.value))}
                         />
                      </div>
                      <div className="flex flex-col gap-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Contact Date</label>
                         <input 
                           type="date" 
                           className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold"
                           value={formData.lastContactDate}
                           onChange={(e) => updateField('lastContactDate', e.target.value)}
                         />
                      </div>
                   </div>
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

                {/* Notes */}
                <div className="flex flex-col gap-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Internal Renewal Notes</label>
                   <textarea 
                     rows={5}
                     className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold resize-none"
                     placeholder="Enter any client feedback or internal updates..."
                     value={formData.notes}
                     onChange={(e) => updateField('notes', e.target.value)}
                   />
                </div>
             </div>
          </div>
        </div>

        {/* Right Info Column */}
        <div className="lg:col-span-4 flex flex-col gap-8">
           <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl flex flex-col gap-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <span className="material-symbols-outlined text-8xl">info</span>
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Context</h3>
              <div className="flex flex-col gap-6 relative z-10">
                 <div className="flex flex-col gap-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Client Name</p>
                    <p className="text-sm font-black text-white uppercase">{formData.clientName}</p>
                 </div>
                 <div className="flex flex-col gap-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Policy Type</p>
                    <p className="text-sm font-black text-white uppercase">{formData.policyType}</p>
                 </div>
                 <div className="flex flex-col gap-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Insurer</p>
                    <p className="text-sm font-black text-white uppercase">{formData.insurer}</p>
                 </div>
                 <div className="flex flex-col gap-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-[#fbbf24]">Expiry Date</p>
                    <p className="text-sm font-black text-[#fbbf24] uppercase">{new Date(renewal.expiryDate).toLocaleDateString()}</p>
                 </div>
              </div>
           </div>

           <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/20 rounded-3xl p-8 flex flex-col gap-4">
              <h4 className="text-[10px] font-black text-amber-900 dark:text-amber-400 uppercase tracking-widest flex items-center gap-2">
                 <span className="material-symbols-outlined text-lg">lightbulb</span>
                 Quick Tip
              </h4>
              <p className="text-xs font-medium text-amber-800/80 dark:text-amber-400/80 leading-relaxed">
                 Updating the <strong>Proposed Premium</strong> will automatically recalculate the variance metrics on the details page. Ensure <strong>Contact Attempts</strong> are updated to reflect manual follow-ups accurately.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default EditRenewal;
