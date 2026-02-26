
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OrganizationSettings: React.FC = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Form State
  const [orgData, setOrgData] = useState({
    name: 'IBMS Insurance Brokers Ltd',
    email: 'info@ibms-brokers.africa',
    corporatePhone: '+233 (0) 30 222 4455',
    mobilePhone: '+233 (0) 55 123 4567',
    nicRegNo: 'NIC/BRK/ACC-2024/09921',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5QgliFfIWUjvvTBYg_19rORMCXfdekHWPYmQHwyIODJrPkPEO8Y2pGjQFUtIih-Qm6d9FCBcH3IPoKEvZ1MSlZP91xIfkrVyZ2vUona-JPWmF2GYXUt5XAmd5ndBX2fkusp3EFjcJ2x3Ln1PVurbhd9J8UBBbMD0vL7X8RrtB-MW9VPlpyzXvDvU7TrtAE5aF0K2jUVygEDMM6_IHGuStAnF2KOPJSOZSNVSCcCG-4kbTrzj9fC4Vffs5EGQ6aIoQ0pa4UAvmc3E'
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/settings')}
            className="size-10 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Organization Profile</h1>
            <p className="text-slate-500 font-medium text-lg mt-1">Global settings for your brokerage firm identity.</p>
          </div>
        </div>
        <button 
          form="org-form"
          type="submit"
          disabled={isSaving}
          className={`h-12 px-10 rounded-xl bg-primary hover:bg-primary-hover text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 transition-all flex items-center gap-2 ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
        >
          {isSaving ? (
            <span className="animate-spin material-symbols-outlined text-lg">sync</span>
          ) : (
            <span className="material-symbols-outlined text-lg">save</span>
          )}
          {isSaving ? 'Saving...' : 'Update Profile'}
        </button>
      </div>

      <form id="org-form" onSubmit={handleSave} className="flex flex-col gap-8">
        {/* Logo Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-10 flex flex-col md:flex-row items-center gap-10">
          <div className="relative group">
            <div className="size-40 rounded-full border-4 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-center overflow-hidden shadow-inner p-4">
              <img 
                src={orgData.logo} 
                alt="Org Logo" 
                className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <button type="button" className="absolute bottom-1 right-1 size-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-95">
              <span className="material-symbols-outlined text-xl">photo_camera</span>
            </button>
          </div>
          <div className="flex flex-col gap-4 text-center md:text-left">
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Organization Logo</h3>
            <p className="text-sm font-medium text-slate-500 max-w-sm leading-relaxed">
              This logo will be visible on all system-generated documents including debit notes, receipts, and reports.
            </p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <button type="button" className="px-5 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors">Upload New</button>
              <button type="button" className="px-5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 transition-colors">Remove</button>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-10 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">General Information</h3>
          </div>
          <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company Name</label>
              <input 
                className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all text-sm dark:text-white"
                value={orgData.name}
                onChange={(e) => setOrgData({...orgData, name: e.target.value})}
                required
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Corporate Email Address</label>
              <input 
                type="email"
                className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all text-sm dark:text-white"
                value={orgData.email}
                onChange={(e) => setOrgData({...orgData, email: e.target.value})}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">NIC Registration Number</label>
              <input 
                className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all text-sm dark:text-white"
                value={orgData.nicRegNo}
                onChange={(e) => setOrgData({...orgData, nicRegNo: e.target.value})}
                required
                placeholder="e.g. NIC/BRK/..."
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Corporate Phone Number</label>
              <input 
                className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all text-sm dark:text-white"
                value={orgData.corporatePhone}
                onChange={(e) => setOrgData({...orgData, corporatePhone: e.target.value})}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile Phone Number</label>
              <input 
                className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all text-sm dark:text-white"
                value={orgData.mobilePhone}
                onChange={(e) => setOrgData({...orgData, mobilePhone: e.target.value})}
                required
              />
            </div>
          </div>
        </div>
      </form>

      <div className="bg-indigo-50 dark:bg-indigo-900/10 p-8 rounded-3xl border border-indigo-100 dark:border-indigo-800 flex items-start gap-6">
        <div className="size-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/20">
          <span className="material-symbols-outlined text-2xl">verified</span>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="text-lg font-black text-indigo-900 dark:text-indigo-300 uppercase tracking-tight">Regulatory Compliance</h4>
          <p className="text-sm font-medium text-indigo-800/70 dark:text-indigo-200/50 leading-relaxed">
            Ensure your NIC Registration number is accurate. This identifier is required for regulatory reporting and electronic filings with the National Insurance Commission.
          </p>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-10 right-10 z-[200] animate-fadeIn">
          <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-slate-800 dark:border-slate-100">
            <span className="material-symbols-outlined font-black text-emerald-500">check_circle</span>
            <p className="text-sm font-black uppercase tracking-widest">Profile Saved Successfully</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationSettings;
