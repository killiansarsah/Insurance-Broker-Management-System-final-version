'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    ArrowRight,
    Check,
    Search,
    FileText,
    AlertTriangle,
    DollarSign,
    Upload,
    Shield
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BackButton } from '@/components/ui/back-button';
import { toast } from 'sonner';
import { cn, formatCurrency } from '@/lib/utils';
import { policies } from '@/mock/policies';
import { Policy } from '@/types';

const STEPS = [
    { id: 1, label: 'Select Policy', icon: <Shield size={16} /> },
    { id: 2, label: 'Incident Details', icon: <AlertTriangle size={16} /> },
    { id: 3, label: 'Loss Estimation', icon: <DollarSign size={16} /> },
    { id: 4, label: 'Review', icon: <FileText size={16} /> },
];

export default function NewClaimPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);

    // Form State
    const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [incidentDate, setIncidentDate] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [estimatedAmount, setEstimatedAmount] = useState('');

    // Filter policies for Step 1
    const filteredPolicies = policies.filter(p =>
        p.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    function next() {
        if (step === 1 && !selectedPolicy) return;
        if (step === 2 && (!incidentDate || !description)) return;
        if (step === 3 && !estimatedAmount) return;
        setStep(s => Math.min(4, s + 1));
    }

    function prev() {
        setStep(s => Math.max(1, s - 1));
    }

    function handleSubmit() {
        toast.success('Claim Submitted', { description: 'Your FNOL claim has been submitted and is now pending review.' });
        router.push('/dashboard/claims');
    }

    return (
        <div className="space-y-6 animate-fade-in w-full" style={{ maxWidth: '56rem' }}>
            {/* Header */}
            <div className="flex items-center gap-3">
                <BackButton href="/dashboard/claims" />
                <div>
                    <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Report New Claim (FNOL)</h1>
                    <p className="text-sm text-surface-500">First Notice of Loss wizard.</p>
                </div>
            </div>

            {/* Steps */}
            <div className="flex items-center gap-2">
                {STEPS.map((s, i) => (
                    <div key={s.id} className="flex items-center gap-2 flex-1">
                        <button
                            className={cn(
                                'flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] text-xs font-semibold transition-all w-full',
                                step === s.id
                                    ? 'bg-primary-500 text-white shadow-md'
                                    : step > s.id
                                        ? 'bg-success-50 text-success-700'
                                        : 'bg-surface-100 text-surface-400'
                            )}
                        >
                            {step > s.id ? <Check size={14} /> : s.icon}
                            <span className="hidden sm:inline">{s.label}</span>
                        </button>
                        {i < STEPS.length - 1 && (
                            <div className={cn(
                                'w-6 h-0.5 shrink-0',
                                step > s.id ? 'bg-success-400' : 'bg-surface-200'
                            )} />
                        )}
                    </div>
                ))}
            </div>

            <Card padding="lg" className="min-h-[400px]">
                {/* Step 1: Policy Selection */}
                {step === 1 && (
                    <div className="space-y-4">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                            <input
                                type="text"
                                placeholder="Search policy number or client name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 text-sm bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                            />
                        </div>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                            {filteredPolicies.slice(0, 5).map((policy: Policy) => (
                                <div
                                    key={policy.id}
                                    onClick={() => setSelectedPolicy(policy)}
                                    className={cn(
                                        "p-4 rounded-[var(--radius-md)] border cursor-pointer transition-all hover:border-primary-300",
                                        selectedPolicy?.id === policy.id ? "border-primary-500 bg-primary-50 ring-1 ring-primary-500" : "border-surface-200 bg-white"
                                    )}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-surface-900">{policy.policyNumber}</p>
                                            <p className="text-sm text-surface-500">{policy.clientName}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-surface-100 text-surface-600">
                                                {policy.insuranceType}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: Incident Details */}
                {step === 2 && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-surface-600 mb-1.5">Incident Date & Time</label>
                            <input
                                type="datetime-local"
                                value={incidentDate}
                                onChange={(e) => setIncidentDate(e.target.value)}
                                className="w-full px-3 py-2.5 text-sm bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-surface-600 mb-1.5">Location</label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Where did it happen?"
                                className="w-full px-3 py-2.5 text-sm bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-surface-600 mb-1.5">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                placeholder="Describe what happened..."
                                className="w-full px-3 py-2.5 text-sm bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none"
                            />
                        </div>
                    </div>
                )}

                {/* Step 3: Loss Estimation */}
                {step === 3 && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-semibold text-surface-600 mb-1.5">Estimated Loss Amount</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 font-semibold">GHS</span>
                                <input
                                    type="number"
                                    value={estimatedAmount}
                                    onChange={(e) => setEstimatedAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full pl-12 pr-4 py-2.5 text-sm bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                />
                            </div>
                        </div>

                        <div className="p-6 border-2 border-dashed border-surface-200 rounded-[var(--radius-md)] text-center">
                            <Upload size={32} className="mx-auto text-surface-300 mb-2" />
                            <p className="text-sm text-surface-500">Upload evidence (Photos, Police Report)</p>
                            <Button variant="outline" size="sm" className="mt-4">Choose Files</Button>
                        </div>
                    </div>
                )}

                {/* Step 4: Review */}
                {step === 4 && selectedPolicy && (
                    <div className="space-y-6">
                        <div className="bg-surface-50 p-4 rounded-[var(--radius-md)] space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-surface-500">Policy</span>
                                <span className="text-sm font-medium text-surface-900">{selectedPolicy.policyNumber}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-surface-500">Insured</span>
                                <span className="text-sm font-medium text-surface-900">{selectedPolicy.clientName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-surface-500">Incident Date</span>
                                <span className="text-sm font-medium text-surface-900">{new Date(incidentDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-surface-500">Est. Loss</span>
                                <span className="text-sm font-bold text-surface-900">{formatCurrency(Number(estimatedAmount))}</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">Description</p>
                            <p className="text-sm text-surface-700">{description}</p>
                        </div>
                    </div>
                )}
            </Card>

            <div className="flex justify-between">
                <Button variant="outline" onClick={step === 1 ? () => router.push('/dashboard/claims') : prev}>
                    {step === 1 ? 'Cancel' : 'Previous'}
                </Button>
                {step < 4 ? (
                    <Button variant="primary" onClick={next} disabled={
                        (step === 1 && !selectedPolicy) ||
                        (step === 2 && (!incidentDate || !description)) ||
                        (step === 3 && !estimatedAmount)
                    }>
                        Continue
                    </Button>
                ) : (
                    <Button variant="primary" onClick={handleSubmit}>
                        Submit Claim
                    </Button>
                )}
            </div>
        </div>
    );
}
