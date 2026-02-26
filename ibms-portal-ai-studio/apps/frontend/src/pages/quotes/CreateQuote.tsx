
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuoteSource, QuoteStatus } from '../../types';

const CreateQuote: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    mobileNumber: '',
    email: '',
    source: QuoteSource.Website,
    protectionType: 'Motor - Comprehensive',
    sumInsured: 0,
    rate: 2.5,
    status: QuoteStatus.New,
    followUpDate: '',
    assignedAgent: 'Sarah Adeyemi',
    notes: '',
    // Quote Plan
    installmentType: 'Single' as 'Single' | 'Monthly' | 'Quarterly' | 'Bi-Annual',
    initialDeposit: 0,
    installmentPeriod: 0,
    monthlyInstallment: 0,
    // Vehicle Info
    vehicleMake: '',
    vehicleModel: '',
    registrationNumber: '',
    yearOfManufacture: new Date().getFullYear(),
  });

  const steps = [
    { number: 1, label: 'Contact Info' },
    { number: 2, label: 'Coverage & Plan' },
    { number: 3, label: 'Vehicle Info' },
    { number: 4, label: 'Review' },
  ];

  const netPremium = (formData.sumInsured * formData.rate) / 100;
  const stampDuty = 50;
  const tax = netPremium * 0.075;
  const total = netPremium + tax + stampDuty;

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
    else navigate('/quotes');
  };

  const protectionTypes = [
    'Motor - Comprehensive',
    'Motor - Third Party',
    'Motor - Third Party Fire & Theft',
    'Life Insurance',
    'Health Insurance',
    'Fire - Commercial Property',
    'Fire - Residential Property',
    'Marine Cargo',
    'Professional Indemnity',
    'Public Liability'
  ];

  const agents = ['Sarah Adeyemi', 'John Okafor', 'David Musa', 'Grace Nwosu'];

  return (
    <div className="flex flex-col gap-8 pb-20 max-w-[1400px] mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Create Quote</h1>
        <p className="text-slate-500 font-medium text-lg">Generate a quote for a new insurance lead</p>
      </div>

      <div className="flex w-full items-center justify-between rounded-3xl bg-white dark:bg-slate-900 p-2 border border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
        {steps.map((s, idx) => (
          <React.Fragment key={s.number}>
            <div 
              onClick={() => setCurrentStep(s.number)}
              className={`flex flex-1 min-w-[140px] items-center justify-center gap-3 p-4 rounded-2xl cursor-pointer transition-all ${currentStep === s.number ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>
              <div className={`size-7 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-colors ${
                currentStep > s.number ? 'bg-emerald-500 border-emerald-500 text-white' : 
                currentStep === s.number ? 'bg-white text-primary border-white' : 'border-slate-100 dark:border-slate-800'
              }`}>
                {currentStep > s.number ? <span className="material-symbols-outlined text-sm">check</span> : s.number}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">{s.label}</span>
            </div>
            {idx < steps.length - 1 && <div className="w-px h-6 bg-slate-100 dark:bg-slate-800 hidden md:block"></div>}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-10 shadow-sm animate-fadeIn">
            {currentStep === 1 && (
              <div className="flex flex-col gap-8">
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Personal & Contact Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name *</label>
                      <input className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold" placeholder="John" value={formData.firstName} onChange={(e) => updateField('firstName', e.target.value)} />
                   </div>
                   <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name *</label>
                      <input className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold" placeholder="Mensah" value={formData.lastName} onChange={(e) => updateField('lastName', e.target.value)} />
                   </div>
                   <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Phone</label>
                      <input className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold" placeholder="+233..." value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} />
                   </div>
                   <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile Number *</label>
                      <input className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold" placeholder="+233..." value={formData.mobileNumber} onChange={(e) => updateField('mobileNumber', e.target.value)} />
                   </div>
                   <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address *</label>
                      <input className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold" placeholder="john@example.com" value={formData.email} onChange={(e) => updateField('email', e.target.value)} />
                   </div>
                   <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lead Source</label>
                      <select className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold" value={formData.source} onChange={(e) => updateField('source', e.target.value)}>
                        {Object.values(QuoteSource).map(source => (
                          <option key={source} value={source}>{source}</option>
                        ))}
                      </select>
                   </div>
                   <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Agent</label>
                      <select className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold" value={formData.assignedAgent} onChange={(e) => updateField('assignedAgent', e.target.value)}>
                        {agents.map(agent => (
                          <option key={agent} value={agent}>{agent}</option>
                        ))}
                      </select>
                   </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-8">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Quote Coverage</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Protection Type *</label>
                      <select className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold" value={formData.protectionType} onChange={(e) => updateField('protectionType', e.target.value)}>
                        {protectionTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Follow-up Date</label>
                      <input type="date" className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold" value={formData.followUpDate} onChange={(e) => updateField('followUpDate', e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-800 my-4"></div>

                <div className="flex flex-col gap-8">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Payment Plan</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Installment Type</label>
                      <select className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold" value={formData.installmentType} onChange={(e) => updateField('installmentType', e.target.value)}>
                        <option value="Single">Single Payment</option>
                        <option value="Monthly">Monthly Installments</option>
                        <option value="Quarterly">Quarterly Installments</option>
                        <option value="Bi-Annual">Bi-Annual Installments</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Initial Deposit (GH₵)</label>
                      <input type="number" className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold" value={formData.initialDeposit} onChange={(e) => updateField('initialDeposit', Number(e.target.value))} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Installment Period (Months)</label>
                      <input type="number" className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold" value={formData.installmentPeriod} onChange={(e) => updateField('installmentPeriod', Number(e.target.value))} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Monthly Amount (GH₵)</label>
                      <input type="number" className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold" value={formData.monthlyInstallment} onChange={(e) => updateField('monthlyInstallment', Number(e.target.value))} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="flex flex-col gap-8">
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Vehicle Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vehicle Make</label>
                    <input className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold" value={formData.vehicleMake} onChange={(e) => updateField('vehicleMake', e.target.value)} placeholder="e.g. Toyota" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vehicle Model</label>
                    <input className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold" value={formData.vehicleModel} onChange={(e) => updateField('vehicleModel', e.target.value)} placeholder="e.g. Camry" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Registration Number</label>
                    <input className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold font-mono" value={formData.registrationNumber} onChange={(e) => updateField('registrationNumber', e.target.value)} placeholder="GW-1234-22" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Year of Manufacture</label>
                    <input type="number" className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold" value={formData.yearOfManufacture} onChange={(e) => updateField('yearOfManufacture', Number(e.target.value))} />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="flex flex-col gap-8">
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Review & Notes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sum Insured (GH₵)</label>
                    <input type="number" className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-black text-xl" value={formData.sumInsured} onChange={(e) => updateField('sumInsured', Number(e.target.value))} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Rate (%)</label>
                    <input type="number" step="0.1" className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-black text-xl" value={formData.rate} onChange={(e) => updateField('rate', Number(e.target.value))} />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lead Notes</label>
                    <textarea rows={4} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold resize-none" value={formData.notes} onChange={(e) => updateField('notes', e.target.value)} placeholder="Add any specific details or customer requests here..." />
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-12 pt-6 border-t border-slate-100 dark:border-slate-800">
               <button onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : navigate('/quotes')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
                  <span className="material-symbols-outlined text-lg">arrow_back</span>
                  Back
               </button>
               <button onClick={handleNext} className="h-12 px-10 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
                  {currentStep === 4 ? 'Save Quote' : 'Continue'}
               </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6 sticky top-28">
           <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl flex flex-col gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                 <span className="material-symbols-outlined text-8xl">account_balance_wallet</span>
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Premium Estimate</h3>
              <div className="flex flex-col gap-6 relative z-10">
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Net Premium</span>
                    <span className="text-sm font-black text-white">GH₵ {netPremium.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Tax & Duty</span>
                    <span className="text-sm font-black text-slate-400">GH₵ {(tax + stampDuty).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                 </div>
                 <div className="h-px bg-slate-800 my-1"></div>
                 <div className="flex justify-between items-end pt-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Total Estimate</span>
                    <span className="text-3xl font-black text-primary font-mono tracking-tighter">GH₵ {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                 </div>
              </div>
           </div>

           <div className="p-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-3xl flex gap-4">
              <span className="material-symbols-outlined text-primary text-3xl">info</span>
              <p className="text-[10px] font-bold text-slate-600 dark:text-blue-200 uppercase leading-relaxed tracking-tight italic">
                Quotes are valid for 30 days and subject to underwriter approval. Follow up with leads promptly to increase conversion rates.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CreateQuote;
