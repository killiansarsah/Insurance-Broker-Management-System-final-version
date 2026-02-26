
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreatePolicy: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [policyClass, setPolicyClass] = useState<'Motor' | 'Non-Motor'>('Motor');

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Client Category
    customerType: 'Individual' as 'Individual' | 'Company',
    
    // Step 2: Individual Personal Details
    firstName: '',
    lastName: '',
    dob: '',
    gender: 'Male',
    occupation: '',
    
    // Step 3: Contact & KYC
    email: '',
    phone: '',
    altPhone: '',
    address: '',
    digitalAddress: '', // GhanaPost GPS
    origin: '',
    idType: 'Ghana Card', // Ghana Card, Passport, Drivers License, NHIS
    idNumber: '',
    idExpiry: '',

    // Step 4: Asset Details (Motor Specific)
    regNo: '',
    make: '',
    model: '',
    yearOfMake: new Date().getFullYear().toString(),
    chassisNo: '',
    engineNo: '',
    cubicCapacity: '',
    vehicleUsage: 'Private',

    // Step 5: Policy & Financials
    insurer: '',
    coverType: 'Comprehensive',
    startDate: '',
    endDate: '',
    currency: 'GHS', // GHS, USD
    sumInsured: 0,
    rate: 2.5,
    commission: 12.5,
    vat: 7.5,
  });

  const steps = [
    { number: 1, label: 'Client Profile' },
    { number: 2, label: 'KYC & Contact' },
    { number: 3, label: policyClass === 'Motor' ? 'Vehicle Details' : 'Asset Details' },
    { number: 4, label: 'Policy & Ledger' },
    { number: 5, label: 'Review' },
  ];

  const netPremium = (formData.sumInsured * formData.rate) / 100;
  const vatAmount = (netPremium * formData.vat) / 100;
  const stampDuty = formData.currency === 'GHS' ? 50.0 : 5.0;
  const totalPayable = netPremium + vatAmount + stampDuty;
  const commAmount = (netPremium * formData.commission) / 100;

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
    else navigate('/policies');
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
    else navigate('/policies');
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col gap-8 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Create New Policy</h1>
          <p className="text-slate-500 font-medium text-lg">
            {currentStep === 1 && "Define the policy class and client profile type."}
            {currentStep === 2 && "Enter contact details and mandatory identification documents."}
            {currentStep === 3 && `Register ${policyClass === 'Motor' ? 'vehicle' : 'asset'} specifications for the risk.`}
            {currentStep === 4 && "Configure underwriter details, cover period, and currency."}
            {currentStep === 5 && "Verify all entry points before committing to the ledger."}
          </p>
        </div>

        {/* Top Class Switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
           <button 
             onClick={() => { setPolicyClass('Motor'); setCurrentStep(1); }}
             className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${policyClass === 'Motor' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}
           >
             Motor
           </button>
           <button 
             onClick={() => { setPolicyClass('Non-Motor'); setCurrentStep(1); }}
             className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${policyClass === 'Non-Motor' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}
           >
             Non-Motor
           </button>
        </div>
      </div>

      {/* Dynamic Progress Stepper */}
      <div className="flex w-full items-center justify-between rounded-3xl bg-white dark:bg-slate-900 p-2 shadow-sm border border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
        {steps.map((s, i) => (
          <React.Fragment key={s.number}>
            <div className={`flex flex-1 items-center justify-center gap-3 p-4 rounded-2xl transition-all min-w-[150px] ${currentStep === s.number ? 'bg-primary text-white shadow-lg shadow-primary/20' : ''}`}>
              <div className={`size-7 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-colors ${
                currentStep > s.number ? 'bg-emerald-500 border-emerald-500 text-white' : 
                currentStep === s.number ? 'bg-white text-primary border-white' : 
                'border-slate-100 dark:border-slate-800 text-slate-400'
              }`}>
                {currentStep > s.number ? <span className="material-symbols-outlined text-sm">check</span> : s.number}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${currentStep === s.number ? 'text-white' : 'text-slate-400'}`}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && <div className="w-px h-6 bg-slate-100 dark:bg-slate-800 hidden md:block"></div>}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* STEP 1: CLIENT CATEGORY & BASIC INFO */}
          {currentStep === 1 && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 flex flex-col gap-8 shadow-sm">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Preferred Customer Type</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => updateField('customerType', 'Individual')}
                      className={`h-16 rounded-2xl border-2 flex items-center justify-center gap-3 transition-all ${formData.customerType === 'Individual' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 dark:border-slate-800 text-slate-400'}`}
                    >
                      <span className="material-symbols-outlined">person</span>
                      <span className="font-black text-xs uppercase tracking-widest">Individual</span>
                    </button>
                    <button 
                      onClick={() => updateField('customerType', 'Company')}
                      className={`h-16 rounded-2xl border-2 flex items-center justify-center gap-3 transition-all ${formData.customerType === 'Company' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 dark:border-slate-800 text-slate-400'}`}
                    >
                      <span className="material-symbols-outlined">corporate_fare</span>
                      <span className="font-black text-xs uppercase tracking-widest">Company</span>
                    </button>
                  </div>
                </div>

                {formData.customerType === 'Individual' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                      <input 
                        className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold focus:bg-white transition-all text-sm"
                        value={formData.firstName}
                        onChange={(e) => updateField('firstName', e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                      <input 
                        className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold focus:bg-white transition-all text-sm"
                        value={formData.lastName}
                        onChange={(e) => updateField('lastName', e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date of Birth</label>
                      <input 
                        type="date"
                        className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold focus:bg-white transition-all text-sm"
                        value={formData.dob}
                        onChange={(e) => updateField('dob', e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gender</label>
                      <select 
                        className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold focus:bg-white transition-all text-sm"
                        value={formData.gender}
                        onChange={(e) => updateField('gender', e.target.value)}
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Occupation</label>
                      <input 
                        className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold focus:bg-white transition-all text-sm"
                        placeholder="e.g. Software Engineer"
                        value={formData.occupation}
                        onChange={(e) => updateField('occupation', e.target.value)}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-8 pt-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company Registered Name</label>
                      <input 
                        className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold focus:bg-white transition-all text-sm"
                        placeholder="e.g. Dangote Cement Ghana"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: KYC & CONTACT */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-8 animate-fadeIn">
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50">
                  <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Contact Information</h3>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                    <input className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold text-sm" value={formData.email} onChange={(e) => updateField('email', e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Phone Number</label>
                    <input className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold text-sm" value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Alternative Phone Numbers</label>
                    <input className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold text-sm" placeholder="Separated by commas" value={formData.altPhone} onChange={(e) => updateField('altPhone', e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50">
                  <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Address & Identity (KYC)</h3>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Physical Address</label>
                    <input className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold text-sm" value={formData.address} onChange={(e) => updateField('address', e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Digital Address (GPS)</label>
                    <input className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold text-sm" placeholder="e.g. GA-123-4567" value={formData.digitalAddress} onChange={(e) => updateField('digitalAddress', e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nationality / Origin</label>
                    <input className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold text-sm" placeholder="e.g. Ghanaian" value={formData.origin} onChange={(e) => updateField('origin', e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ID Type</label>
                    <select className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold text-sm" value={formData.idType} onChange={(e) => updateField('idType', e.target.value)}>
                      <option>Ghana Card</option>
                      <option>Passport</option>
                      <option>Drivers License</option>
                      <option>Voters ID</option>
                      <option>NHIS Card</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ID Number</label>
                    <input className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold text-sm" placeholder="GHA-1234567-8" value={formData.idNumber} onChange={(e) => updateField('idNumber', e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ID Expiry Date</label>
                    <input type="date" className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold text-sm" value={formData.idExpiry} onChange={(e) => updateField('idExpiry', e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: ASSET DETAILS (VEHICLE) */}
          {currentStep === 3 && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-fadeIn">
              <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50">
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">{policyClass === 'Motor' ? 'Vehicle Specifications' : 'Risk Asset Details'}</h3>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                {policyClass === 'Motor' ? (
                  <>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Registration Number</label>
                      <input className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-black text-sm uppercase" placeholder="e.g. GW 1234-24" value={formData.regNo} onChange={(e) => updateField('regNo', e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vehicle Make</label>
                      <input className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold text-sm" placeholder="e.g. Toyota" value={formData.make} onChange={(e) => updateField('make', e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Model</label>
                      <input className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold text-sm" placeholder="e.g. Hilux" value={formData.model} onChange={(e) => updateField('model', e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Year of Manufacture</label>
                      <input className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold text-sm" value={formData.yearOfMake} onChange={(e) => updateField('yearOfMake', e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Chassis Number</label>
                      <input className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-mono text-sm" value={formData.chassisNo} onChange={(e) => updateField('chassisNo', e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Engine Number</label>
                      <input className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-mono text-sm" value={formData.engineNo} onChange={(e) => updateField('engineNo', e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cubic Capacity (CC)</label>
                      <input className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold text-sm" value={formData.cubicCapacity} onChange={(e) => updateField('cubicCapacity', e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Usage Type</label>
                      <select className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold text-sm" value={formData.vehicleUsage} onChange={(e) => updateField('vehicleUsage', e.target.value)}>
                        <option>Private</option>
                        <option>Commercial / Hire</option>
                        <option>Diplomatic</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <div className="md:col-span-2 flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Risk Description</label>
                      <textarea rows={5} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold focus:bg-white transition-all text-sm" placeholder="Provide full details of the building, bond, or marine cargo..."></textarea>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: POLICY & FINANCIALS */}
          {currentStep === 4 && (
            <div className="flex flex-col gap-8 animate-fadeIn">
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50">
                  <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Insurance Arrangement</h3>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Insurance Company</label>
                    <select className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold text-sm" value={formData.insurer} onChange={(e) => updateField('insurer', e.target.value)}>
                      <option value="">Select Underwriter</option>
                      <option>GLICO GEN</option>
                      <option>Enterprise Insurance</option>
                      <option>SIC Insurance</option>
                      <option>Old Mutual</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cover Type</label>
                    <select className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold text-sm" value={formData.coverType} onChange={(e) => updateField('coverType', e.target.value)}>
                      <option>Comprehensive</option>
                      <option>Third Party Fire & Theft</option>
                      <option>Third Party Only</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Period Start Date</label>
                    <input type="date" className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold text-sm" value={formData.startDate} onChange={(e) => updateField('startDate', e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Period End Date</label>
                    <input type="date" className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold text-sm" value={formData.endDate} onChange={(e) => updateField('endDate', e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 flex justify-between items-center">
                  <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Financial Audit</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Currency</span>
                    <div className="flex bg-slate-200 dark:bg-slate-800 p-0.5 rounded-lg">
                      <button onClick={() => updateField('currency', 'GHS')} className={`px-3 py-1 rounded-md text-[9px] font-black uppercase transition-all ${formData.currency === 'GHS' ? 'bg-white text-primary' : 'text-slate-500'}`}>GHS</button>
                      <button onClick={() => updateField('currency', 'USD')} className={`px-3 py-1 rounded-md text-[9px] font-black uppercase transition-all ${formData.currency === 'USD' ? 'bg-white text-primary' : 'text-slate-500'}`}>USD</button>
                    </div>
                  </div>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sum Insured (Market Value)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black">{formData.currency === 'GHS' ? 'GH₵' : '$'}</span>
                      <input type="number" className="h-14 pl-14 pr-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-black text-sm" value={formData.sumInsured} onChange={(e) => updateField('sumInsured', Number(e.target.value))} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Premium Rate (%)</label>
                    <input type="number" step="0.01" className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-black text-sm" value={formData.rate} onChange={(e) => updateField('rate', Number(e.target.value))} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW */}
          {currentStep === 5 && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-fadeIn">
              <div className="px-10 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50">
                <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Final Review</h3>
              </div>
              <div className="p-10 flex flex-col gap-8">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Insured</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{formData.customerType === 'Individual' ? `${formData.firstName} ${formData.lastName}` : 'Company Client'}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase">ID No.</span>
                    <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">{formData.idNumber || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Policy Class</span>
                    <span className="text-sm font-black text-primary uppercase">{policyClass}</span>
                  </div>
                  {policyClass === 'Motor' && (
                    <>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Reg. Number</span>
                        <span className="text-sm font-black text-slate-900 dark:text-white uppercase">{formData.regNo || 'N/A'}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Make / Model</span>
                        <span className="text-sm font-black text-slate-900 dark:text-white uppercase">{formData.make} {formData.model}</span>
                      </div>
                    </>
                  )}
                </div>
                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                   <p className="text-xs font-bold text-slate-600 dark:text-slate-400 leading-relaxed italic">
                    By clicking "Submit", you confirm that the provided identification matches the policy holder's legal records in accordance with NIC compliance regulations.
                   </p>
                </div>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-between pt-4">
            <button 
              onClick={handleBack}
              className="flex items-center justify-center h-14 px-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              <span className="material-symbols-outlined text-lg mr-2">arrow_back</span>
              {currentStep === 1 ? 'Cancel' : 'Back'}
            </button>
            <button 
              onClick={handleNext}
              className="flex items-center justify-center h-14 px-10 rounded-2xl bg-primary hover:bg-primary-hover text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
            >
              {currentStep === 5 ? 'Confirm & Register' : 'Next Step'}
              <span className="material-symbols-outlined text-lg ml-2">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Floating Summary Bar */}
        <div className="lg:col-span-4 flex flex-col gap-6 sticky top-28">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
            <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50">
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">payments</span>
                Pricing Audit
              </h3>
            </div>
            <div className="p-8 flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-400 uppercase tracking-widest">Net Premium</span>
                  <span className="text-slate-900 dark:text-white">{formData.currency === 'GHS' ? 'GH₵' : '$'} {netPremium.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-400 uppercase tracking-widest">VAT ({formData.vat}%)</span>
                  <span className="text-slate-900 dark:text-white">{formData.currency === 'GHS' ? 'GH₵' : '$'} {vatAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-400 uppercase tracking-widest">Stamp Duty</span>
                  <span className="text-slate-900 dark:text-white">{formData.currency === 'GHS' ? 'GH₵' : '$'} {stampDuty.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
              
              <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-6 border border-primary/20">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Bill</span>
                  <div className="text-right">
                    <span className="block text-3xl font-black text-primary">{formData.currency === 'GHS' ? 'GH₵' : '$'} {totalPayable.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Due immediately</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center px-2 py-3 border-t border-dashed border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Est. Commission</span>
                <span className="text-sm font-black text-emerald-600 tracking-tight">+{formData.currency === 'GHS' ? 'GH₵' : '$'} {commAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 dark:bg-slate-800 p-8 rounded-3xl border border-slate-700 text-white flex flex-col gap-4">
             <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-amber-500">warning</span>
                <h4 className="text-sm font-black uppercase tracking-widest">Regulatory Compliance</h4>
             </div>
             <p className="text-[10px] font-medium text-slate-400 leading-relaxed uppercase tracking-widest">
                All Motor insurance policies are subject to NIC electronic timestamping. Ensure vehicle registration details are accurate to avoid claim rejection.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePolicy;
