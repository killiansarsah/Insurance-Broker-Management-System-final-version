
import React, { useState } from 'react';

interface Insurer {
  id: string;
  name: string;
  category: string;
  policies: number;
  comm: string;
  status: string;
  logo: string;
}

const Insurers: React.FC = () => {
  const [insurers, setInsurers] = useState<Insurer[]>([
    { id: '1', name: 'Allianz Nigeria', category: 'General', policies: 450, comm: '12.5%', status: 'Active', logo: 'https://logo.clearbit.com/allianz.com' },
    { id: '2', name: 'AXA Mansard', category: 'Health', policies: 320, comm: '15.0%', status: 'Active', logo: 'https://logo.clearbit.com/axa.com' },
    { id: '3', name: 'Leadway Assurance', category: 'Motor', policies: 280, comm: '10.0%', status: 'Active', logo: 'https://logo.clearbit.com/leadway.com' },
    { id: '4', name: 'Old Mutual', category: 'Life', policies: 150, comm: '17.5%', status: 'Active', logo: 'https://logo.clearbit.com/oldmutual.com' },
    { id: '5', name: 'Sanlam Nigeria', category: 'General', policies: 95, comm: '12.5%', status: 'Pending', logo: 'https://logo.clearbit.com/sanlam.com' },
    { id: '6', name: 'Cornerstone Insurance', category: 'General', policies: 185, comm: '11.0%', status: 'Active', logo: 'https://logo.clearbit.com/cornerstone.com.ng' },
  ]);

  const [modalType, setModalType] = useState<'add' | 'edit' | 'view' | null>(null);
  const [selectedInsurer, setSelectedInsurer] = useState<Insurer | null>(null);
  const [newRate, setNewRate] = useState('');
  
  // State for adding new insurer
  const [addFormData, setAddFormData] = useState({
    name: '',
    category: 'General',
    comm: '12.5'
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Operation Successful');

  const handleOpenAdd = () => {
    setAddFormData({ name: '', category: 'General', comm: '12.5' });
    setModalType('add');
  };

  const handleOpenEdit = (insurer: Insurer) => {
    setSelectedInsurer(insurer);
    setNewRate(insurer.comm.replace('%', ''));
    setModalType('edit');
  };

  const handleOpenView = (insurer: Insurer) => {
    setSelectedInsurer(insurer);
    setModalType('view');
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedInsurer(null);
  };

  const handleSaveRate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInsurer) return;
    
    setInsurers(prev => prev.map(ins => 
      ins.id === selectedInsurer.id ? { ...ins, comm: `${newRate}%` } : ins
    ));
    
    setToastMessage(`Commission rate for ${selectedInsurer.name} updated.`);
    triggerToast();
    handleCloseModal();
  };

  const handleRegisterPartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addFormData.name) return;

    const newPartner: Insurer = {
      id: Math.random().toString(36).substr(2, 9),
      name: addFormData.name,
      category: addFormData.category,
      comm: `${addFormData.comm}%`,
      policies: 0,
      status: 'Active',
      logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(addFormData.name)}&background=137fec&color=fff&bold=true`
    };

    setInsurers(prev => [newPartner, ...prev]);
    setToastMessage(`${addFormData.name} registered as a new partner.`);
    triggerToast();
    handleCloseModal();
  };

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="flex flex-col gap-8 pb-12 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Insurer Partnerships</h1>
          <p className="text-slate-500 font-medium mt-1 uppercase tracking-tight text-xs">Manage relationships and commission structures with your insurance carriers.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-black shadow-lg shadow-primary/20 transition-all uppercase tracking-widest hover:scale-[1.02]"
        >
          <span className="material-symbols-outlined text-[20px]">add_business</span>
          Add New Partner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {insurers.map((insurer) => (
          <div key={insurer.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden group hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col h-full hover-lift cursor-pointer">
            <div className="p-8 flex-1">
              <div className="flex items-center gap-4 mb-8">
                <div className="size-14 rounded-xl border border-slate-100 dark:border-slate-700 p-2 flex items-center justify-center bg-white shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <img 
                    src={insurer.logo} 
                    alt={insurer.name} 
                    className="max-w-full max-h-full object-contain" 
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(insurer.name)}&background=137fec&color=fff&bold=true`;
                    }}
                  />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight truncate group-hover:text-primary transition-colors">
                    {insurer.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      insurer.status === 'Active' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' 
                        : 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800'
                    }`}>
                      {insurer.status}
                    </span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {insurer.category}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-50 dark:border-slate-800">
                <div className="flex flex-col gap-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Managed Policies</p>
                  <p className="text-xl font-black text-slate-900 dark:text-white">{insurer.policies}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Commission Rate</p>
                  <p className="text-xl font-black text-primary">{insurer.comm}</p>
                </div>
              </div>
            </div>
            <div className="px-8 py-5 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 border-t border-slate-100 dark:border-slate-800">
              <button 
                onClick={() => handleOpenView(insurer)}
                className="text-[10px] font-black text-slate-500 hover:text-primary uppercase tracking-widest transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">visibility</span>
                View Profile
              </button>
              <button 
                onClick={() => handleOpenEdit(insurer)}
                className="text-[10px] font-black text-slate-500 hover:text-primary uppercase tracking-widest transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
                Edit Rates
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-primary/5 dark:bg-slate-900/50 rounded-3xl border border-primary/10 p-10 flex flex-col lg:flex-row items-center justify-between gap-8 mt-4">
        <div className="flex flex-col gap-2 text-center lg:text-left">
          <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Insurer Compliance</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium max-w-xl">
            All partner insurers are audited quarterly for claim settlement ratios and solvency requirements.
          </p>
        </div>
        <button className="h-12 px-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-black uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined">description</span>
          View Audit Logs
        </button>
      </div>

      {/* Modals */}
      {modalType && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleCloseModal}></div>
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 animate-fadeIn">
            {modalType === 'add' && (
              <form onSubmit={handleRegisterPartner} className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Add Partner</h2>
                  <button type="button" onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Insurer Name</label>
                    <input 
                      required
                      className="h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold focus:bg-white transition-all text-sm" 
                      placeholder="e.g. Mutual Benefits Assurance" 
                      value={addFormData.name}
                      onChange={(e) => setAddFormData({...addFormData, name: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                      <select 
                        className="h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold text-sm"
                        value={addFormData.category}
                        onChange={(e) => setAddFormData({...addFormData, category: e.target.value})}
                      >
                        <option>General</option>
                        <option>Health</option>
                        <option>Life</option>
                        <option>Motor</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Comm. Rate (%)</label>
                      <input 
                        type="number"
                        step="0.1"
                        className="h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold text-sm" 
                        placeholder="12.5" 
                        value={addFormData.comm}
                        onChange={(e) => setAddFormData({...addFormData, comm: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                <button 
                  type="submit"
                  className="h-12 w-full rounded-xl bg-primary hover:bg-primary-hover text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 transition-all mt-2"
                >
                  Register Partner
                </button>
              </form>
            )}

            {modalType === 'edit' && selectedInsurer && (
              <form onSubmit={handleSaveRate} className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Edit Rates</h2>
                  <button type="button" onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
                <div className="flex flex-col gap-4">
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-tight">Updating commission for <span className="text-primary">{selectedInsurer.name}</span></p>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Commission Rate (%)</label>
                    <div className="relative">
                      <input 
                        autoFocus
                        type="number" 
                        step="0.1"
                        className="w-full h-12 px-4 pr-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-black focus:bg-white transition-all text-sm" 
                        value={newRate}
                        onChange={(e) => setNewRate(e.target.value)}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-black">%</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 mt-2">
                  <button type="button" onClick={handleCloseModal} className="flex-1 h-12 rounded-xl border border-slate-200 dark:border-slate-800 font-black text-[10px] uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">Cancel</button>
                  <button type="submit" className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary-hover text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 transition-all">Update Rate</button>
                </div>
              </form>
            )}

            {modalType === 'view' && selectedInsurer && (
              <div className="flex flex-col gap-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Partner Profile</h2>
                  <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
                <div className="flex items-center gap-6 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <img src={selectedInsurer.logo} className="size-20 rounded-xl bg-white p-2 object-contain shadow-sm" alt="" />
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{selectedInsurer.name}</h3>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">{selectedInsurer.category} Division</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col gap-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Claims Ratio</span>
                    <span className="text-lg font-black text-emerald-600">94.2%</span>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col gap-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Payout Turnaround</span>
                    <span className="text-lg font-black text-slate-900 dark:text-white">4.5 Days</span>
                  </div>
                </div>
                <button 
                  onClick={handleCloseModal}
                  className="h-12 w-full rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-black text-[10px] uppercase tracking-widest transition-all"
                >
                  Close Profile
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-10 right-10 z-[200] animate-fadeIn">
          <div className="bg-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl shadow-emerald-600/30 flex items-center gap-4 border border-emerald-500/50">
            <span className="material-symbols-outlined font-black">check_circle</span>
            <div>
              <p className="text-sm font-black uppercase tracking-widest">Success</p>
              <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">{toastMessage}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Insurers;
