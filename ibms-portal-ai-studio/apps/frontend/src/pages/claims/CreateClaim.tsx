
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateClaim: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const steps = [
    { number: 1, label: 'Policy Info' },
    { number: 2, label: 'Incident Details' },
    { number: 3, label: 'Documentation' },
    { number: 4, label: 'Review' }
  ];

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Register New Claim</h1>
        <p className="text-slate-500 font-medium text-lg">Initiate a formal claim request for an active policy holder.</p>
      </div>

      {/* Progress Stepper */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto no-scrollbar">
        {steps.map((s, idx) => (
          <React.Fragment key={s.number}>
            <div className={`flex flex-1 items-center justify-center gap-4 min-w-[160px] p-4 rounded-2xl transition-all ${step === s.number ? 'bg-primary/10 text-primary' : 'text-slate-400'}`}>
              <div className={`size-8 rounded-full flex items-center justify-center text-sm font-black border-2 transition-colors ${
                step > s.number ? 'bg-emerald-500 border-emerald-500 text-white' : 
                step === s.number ? 'border-primary bg-primary text-white' : 'border-slate-200'
              }`}>
                {step > s.number ? <span className="material-symbols-outlined text-lg">check</span> : s.number}
              </div>
              <span className={`text-xs font-black uppercase tracking-[0.2em] whitespace-nowrap ${step === s.number ? 'text-primary' : 'text-slate-500'}`}>{s.label}</span>
            </div>
            {idx < steps.length - 1 && <div className="h-px w-8 bg-slate-100 dark:bg-slate-800 mx-2 hidden md:block" />}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-10 py-8">
              {step === 1 && (
                <div className="flex flex-col gap-8 animate-fadeIn">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Step 1: Locate Policy</h3>
                    <p className="text-slate-500 text-sm font-medium">Select the policy associated with this claim.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Policy Number / Client Name</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                        <input className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold focus:bg-white transition-all" placeholder="Enter policy ID or client name..." />
                      </div>
                    </div>
                    <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 flex items-start gap-4">
                      <div className="size-12 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined">verified</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Active Policy Selected</p>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">MTN Nigeria - POL-1029 (Group Life)</p>
                        <p className="text-[10px] font-black text-primary mt-2 uppercase tracking-widest underline cursor-pointer">View Policy Details</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col gap-8 animate-fadeIn">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Step 2: Incident Details</h3>
                    <p className="text-slate-500 text-sm font-medium">Provide comprehensive details about the occurrence.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Date of Loss</label>
                      <input type="date" className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold focus:bg-white transition-all" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Type of Claim</label>
                      <select className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold focus:bg-white transition-all">
                        <option>Accidental Damage</option>
                        <option>Total Loss / Theft</option>
                        <option>Natural Disaster</option>
                        <option>Third Party Liability</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Incident Description</label>
                      <textarea rows={4} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold focus:bg-white transition-all resize-none" placeholder="Explain what happened in detail..."></textarea>
                    </div>
                  </div>
                </div>
              )}

              {step >= 3 && (
                <div className="flex items-center justify-center py-20 text-center flex-col gap-4 animate-fadeIn">
                  <div className="size-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300">
                    <span className="material-symbols-outlined text-5xl">cloud_upload</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Upload Evidence</h3>
                    <p className="text-slate-500 text-sm font-medium mt-1">Please provide police reports, photos, and estimates.</p>
                  </div>
                  <button className="mt-4 px-8 py-3 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-black uppercase tracking-widest">Select Files</button>
                </div>
              )}
            </div>

            <div className="px-10 py-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 flex items-center justify-between">
              <button 
                onClick={() => step > 1 ? setStep(step - 1) : navigate('/claims')}
                className="h-12 px-8 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-black text-xs uppercase tracking-widest hover:bg-white transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                {step === 1 ? 'Cancel' : 'Back'}
              </button>
              <button 
                onClick={() => step < 4 ? setStep(step + 1) : navigate('/claims')}
                className="h-12 px-10 rounded-xl bg-primary hover:bg-blue-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
              >
                {step === 4 ? 'Submit Claim' : 'Next Step'}
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6 sticky top-28">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 flex flex-col gap-6">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Claim Summary</h3>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-500">Status</span>
                <span className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest">New Draft</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-500">Assigned Adjuster</span>
                <span className="font-black text-slate-900 dark:text-white">Auto-assign</span>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 flex flex-col gap-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estimated Value</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white">GH₵ 0.00</span>
                <span className="text-[10px] font-black text-slate-400 uppercase pb-1 tracking-widest">GHS</span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 italic mt-2">*Calculated after processing Step 2</p>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-3xl border border-amber-100 dark:border-amber-800 flex gap-4">
            <span className="material-symbols-outlined text-amber-600 text-3xl">info</span>
            <div className="flex flex-col gap-1">
              <h4 className="text-xs font-black text-amber-900 dark:text-amber-300 uppercase tracking-tight">Requirement Reminder</h4>
              <p className="text-[10px] font-bold text-amber-800 dark:text-amber-400/80 leading-relaxed uppercase tracking-tight">
                All high-value claims (GH₵ 50k+) require a direct phone interview with the policyholder within 24 hours of filing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateClaim;
