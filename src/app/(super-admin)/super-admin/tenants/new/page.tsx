'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/super-admin/PageHeader';
import { Building2, UserCircle, CreditCard, Settings, ChevronRight, Check, Activity } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

const STEPS = [
  { id: 1, title: 'Company Details', icon: Building2 },
  { id: 2, title: 'Admin Account', icon: UserCircle },
  { id: 3, title: 'Subscription', icon: CreditCard },
  { id: 4, title: 'Configuration', icon: Settings },
];

export default function ProvisionTenantPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    companyName: '',
    code: '',
    nicLicense: '',
    adminFirstName: '',
    adminLastName: '',
    adminEmail: '',
    plan: 'professional',
    billingCycle: 'annual',
    currency: 'GHS',
  });

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const planMap: Record<string, string> = { starter: 'BASIC', professional: 'PROFESSIONAL', enterprise: 'ENTERPRISE' };
      const cycleMap: Record<string, string> = { monthly: 'MONTHLY', annual: 'ANNUAL' };

      await apiClient.post('/platform-admin/tenants', {
        name: formData.companyName,
        subdomain: formData.code.toLowerCase(),
        nicLicenseNumber: formData.nicLicense || undefined,
        adminFirstName: formData.adminFirstName,
        adminLastName: formData.adminLastName,
        adminEmail: formData.adminEmail,
        plan: planMap[formData.plan] ?? 'PROFESSIONAL',
        billingCycle: cycleMap[formData.billingCycle] ?? 'ANNUAL',
        currency: formData.currency,
        sendWelcomeEmail: true,
      });

      toast.success('Tenant successfully provisioned', {
        description: `${formData.companyName} workspace is ready.`,
      });
      
      router.push('/super-admin/tenants');
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to provision tenant.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sa-stagger">
      <PageHeader
        title="Provision New Tenant"
        subtitle="Set up a new brokerage or agency environment on the IBMS platform."
        icon={Building2}
        breadcrumbs={[
          { label: 'Overview', href: '/super-admin' },
          { label: 'Tenants', href: '/super-admin/tenants' },
          { label: 'New', href: '/super-admin/tenants/new' }
        ]}
      />

      <div className="bg-white rounded-[var(--sa-radius-md)] border border-[#d4e0dc] shadow-sm overflow-hidden">
        {/* Progress Tracker */}
        <div className="flex border-b border-[#d4e0dc] bg-[#f0f4f3]">
          {STEPS.map((step) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;

            return (
              <div
                key={step.id}
                className={`flex-1 flex items-center justify-center p-4 border-b-2 transition-colors ${
                  isActive 
                    ? 'border-[#1D9E75] bg-white text-[#021a13]' 
                    : isCompleted 
                      ? 'border-transparent text-[#1D9E75]' 
                      : 'border-transparent text-gray-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isActive ? 'bg-[#1D9E75] text-white' : 
                    isCompleted ? 'bg-[#D0F0E4] text-[#1D9E75]' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {isCompleted ? <Check size={12} /> : step.id}
                  </div>
                  <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">{step.title}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Wizard Form Area */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 min-h-[400px] flex flex-col">
          <div className="flex-1">
            
            {/* STEP 1: Company Info */}
            {currentStep === 1 && (
              <div className="space-y-6 sa-reveal">
                <div>
                  <h3 className="text-sm font-bold font-serif text-[#0c6a55] mb-1">Entity Details</h3>
                  <p className="text-xs text-[#7a9a8c]">Official registered information for this agency.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Company Name</label>
                    <input 
                      type="text" 
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                      className="w-full p-2 border border-[#d4e0dc] rounded-sm focus:ring-2 focus:ring-[#1D9E75] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Tenant Code (Unique)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-xs">TEN_</span>
                      <input 
                        type="text" 
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        required
                        className="w-full p-2 pl-11 border border-[#d4e0dc] rounded-sm focus:ring-2 focus:ring-[#1D9E75] focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700">NIC License Number</label>
                    <input 
                      type="text" 
                      name="nicLicense"
                      value={formData.nicLicense}
                      onChange={handleChange}
                      required
                      placeholder="e.g. NIC/BR/001/2026"
                      className="w-full p-2 border border-[#d4e0dc] rounded-sm focus:ring-2 focus:ring-[#1D9E75] focus:outline-none font-mono placeholder:font-sans"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Admin Account */}
            {currentStep === 2 && (
              <div className="space-y-6 sa-reveal">
                <div>
                  <h3 className="text-sm font-bold font-serif text-[#0c6a55] mb-1">Primary Administrator</h3>
                  <p className="text-xs text-[#7a9a8c]">This user will hold TENANT_ADMIN privileges.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700">First Name</label>
                    <input 
                      type="text" 
                      name="adminFirstName"
                      value={formData.adminFirstName}
                      onChange={handleChange}
                      required
                      className="w-full p-2 border border-[#d4e0dc] rounded-sm focus:ring-2 focus:ring-[#1D9E75] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Last Name</label>
                    <input 
                      type="text" 
                      name="adminLastName"
                      value={formData.adminLastName}
                      onChange={handleChange}
                      required
                      className="w-full p-2 border border-[#d4e0dc] rounded-sm focus:ring-2 focus:ring-[#1D9E75] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Admin Email</label>
                    <input 
                      type="email" 
                      name="adminEmail"
                      value={formData.adminEmail}
                      onChange={handleChange}
                      required
                      className="w-full p-2 border border-[#d4e0dc] rounded-sm focus:ring-2 focus:ring-[#1D9E75] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Subscription */}
            {currentStep === 3 && (
              <div className="space-y-6 sa-reveal">
                <div>
                  <h3 className="text-sm font-bold font-serif text-[#0c6a55] mb-1">Assign Service Tier</h3>
                  <p className="text-xs text-[#7a9a8c]">Select the appropriate billing and compliance plan.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {['Starter', 'Professional', 'Enterprise'].map((tier) => (
                    <label 
                      key={tier} 
                      className={`cursor-pointer border rounded-sm p-4 hover:border-[#1D9E75] transition-colors relative ${formData.plan === tier.toLowerCase() ? 'border-[#1D9E75] bg-[#f0f4f3]' : 'border-[#d4e0dc]'}`}
                    >
                      <input 
                        type="radio" 
                        name="plan" 
                        value={tier.toLowerCase()} 
                        checked={formData.plan === tier.toLowerCase()}
                        onChange={handleChange}
                        className="sr-only" 
                      />
                      <div className="text-sm font-bold text-gray-900 mb-1">{tier}</div>
                      <div className="text-[10px] text-[#7a9a8c] uppercase tracking-wider mb-3">
                        {tier === 'Starter' ? 'Up to 5 users' : tier === 'Professional' ? 'Up to 50 users' : 'Unlimited users'}
                      </div>
                      <div className="font-mono text-sm text-[#0f6e56]">
                        {tier === 'Starter' ? '₵800/mo' : tier === 'Professional' ? '₵2,500/mo' : 'Custom'}
                      </div>
                      
                      {formData.plan === tier.toLowerCase() && (
                        <div className="absolute top-4 right-4 text-[#1D9E75]">
                          <Check size={16} />
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4: Configuration */}
            {currentStep === 4 && (
              <div className="space-y-6 sa-reveal">
                <div>
                  <h3 className="text-sm font-bold font-serif text-[#0c6a55] mb-1">System Preferences</h3>
                  <p className="text-xs text-[#7a9a8c]">Finalize defaults before provisioning.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Base Currency</label>
                    <select 
                      name="currency" 
                      value={formData.currency}
                      onChange={handleChange}
                      className="w-full p-2 border border-[#d4e0dc] rounded-sm focus:ring-2 focus:ring-[#1D9E75] focus:outline-none"
                    >
                      <option value="GHS">GHS - Ghana Cedi</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                    </select>
                  </div>
                  <div className="space-y-1.5 flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer p-2 w-full">
                      <input type="checkbox" className="rounded text-[#1D9E75] focus:ring-[#1D9E75]" defaultChecked />
                      <span className="text-sm text-gray-700">Send Welcome Email with magic link</span>
                    </label>
                  </div>
                </div>

                <div className="p-4 bg-[#f0f4f3] border border-[#d4e0dc] rounded-sm mt-6">
                  <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#7a9a8c] mb-2">Operation Summary</h4>
                  <ul className="text-sm space-y-1 text-gray-800 font-mono">
                    <li>• Create database schema <span className="text-[#1D9E75]">✔</span></li>
                    <li>• Provision cloud storage isolated bucket <span className="text-[#1D9E75]">✔</span></li>
                    <li>• Seed default roles and NIC mapping <span className="text-[#1D9E75]">✔</span></li>
                    <li>• Initialize administrator account <span className="text-[#1D9E75]">✔</span></li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Footer Navigation */}
          <div className="flex items-center justify-between pt-8 mt-8 border-t border-[#d4e0dc]">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1 || isSubmitting}
              className={`text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full transition-colors ${
                currentStep === 1 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-[#021a13] hover:bg-[#f0f4f3] sa-btn-hover'
              }`}
            >
              Back
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 bg-[#021a13] text-white text-xs font-bold uppercase tracking-wider px-6 py-2 rounded-full sa-btn-hover hover:bg-[#05291e]"
              >
                Continue <ChevronRight size={14} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center gap-2 text-white text-xs font-bold uppercase tracking-wider px-6 py-2 rounded-full sa-btn-hover transition-all ${
                  isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1D9E75] hover:bg-[#0f6e56]'
                }`}
              >
                {isSubmitting ? (
                  <>Processing Layout...</>
                ) : (
                  <>
                    Deploy Tenant <Activity size={14} />
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
