import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Claim, ClaimStatus } from '../../types';

const EditClaim: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<Claim>>({
    claimType: 'Accidental Damage',
    incidentDate: '',
    claimAmount: 0,
    notes: '',
    status: ClaimStatus.Reported
  });

  useEffect(() => {
    // Mock fetch existing claim data
    setTimeout(() => {
      setFormData({
        claimNumber: 'GH-CLM-2024-1234',
        clientName: 'Kofi Mensah',
        policyNumber: 'GH-2024-5566',
        policyType: 'Motor - Comprehensive',
        insurer: 'GLICO',
        claimType: 'Accidental Damage',
        incidentDate: '2024-05-15',
        claimAmount: 15500,
        notes: 'Vehicle sustained front-end damage. Repair shop confirmed quote is reasonable.',
        status: ClaimStatus.Investigating
      });
      setLoading(false);
    }, 500);
  }, [id]);

  const handleSave = () => {
    toast.success('Claim updated successfully');
    navigate(`/claims/view/${id}`);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin size-12 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
            <Link to="/claims" className="hover:text-primary transition-all">Claims</Link>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span>Edit Claim</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Update Claim Details</h1>
          <p className="text-slate-500 font-medium text-lg">Modify investigation details and claim particulars for {formData.claimNumber}.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="h-12 px-6 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="h-12 px-8 rounded-xl bg-primary hover:bg-primary-hover text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">save</span>
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Incident Information</h3>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Type of Claim</label>
                <select 
                  className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold focus:bg-white transition-all"
                  value={formData.claimType}
                  onChange={(e) => setFormData({...formData, claimType: e.target.value})}
                >
                  <option>Accidental Damage</option>
                  <option>Theft</option>
                  <option>Fire Damage</option>
                  <option>Water Damage</option>
                  <option>Medical</option>
                  <option>Death Benefit</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Incident Date</label>
                <input 
                  type="date" 
                  className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold focus:bg-white transition-all"
                  value={formData.incidentDate}
                  onChange={(e) => setFormData({...formData, incidentDate: e.target.value})}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Claim Amount (GH₵)</label>
                <input 
                  type="number" 
                  className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold focus:bg-white transition-all"
                  value={formData.claimAmount}
                  onChange={(e) => setFormData({...formData, claimAmount: Number(e.target.value)})}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Process Status</label>
                <select 
                  className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold focus:bg-white transition-all"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as ClaimStatus})}
                >
                  {Object.values(ClaimStatus).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Adjustment Notes</label>
                <textarea 
                  rows={6} 
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold focus:bg-white transition-all resize-none"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Record investigation findings and adjuster remarks..."
                />
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 flex flex-col gap-6">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Policy Context</h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Client</span>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{formData.clientName}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Policy</span>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{formData.policyNumber}</span>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{formData.policyType}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Insurer</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white uppercase">{formData.insurer}</span>
              </div>
            </div>
          </section>

          <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20">
            <span className="material-symbols-outlined text-4xl mb-4">gavel</span>
            <h3 className="text-lg font-black uppercase tracking-tight mb-2">Legal Hold</h3>
            <p className="text-xs font-medium text-blue-100 leading-relaxed uppercase tracking-tight">
              Ensure all adjustments are compliant with the Insurance Act 2021. Misrepresentation of claim status carries regulatory penalties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditClaim;
