'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Save,
    Shield,
    FileText,
    Calendar,
    DollarSign,
    Loader2,
    AlertTriangle,
    CheckCircle2,
    Hash,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BackButton } from '@/components/ui/back-button';
import { AppLoader } from '@/components/ui/AppLoader';
import { StatusBadge } from '@/components/data-display/status-badge';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { usePolicy, useUpdatePolicy } from '@/hooks/api/use-policies';
import { CustomSelect } from '@/components/ui/select-custom';
import { toast } from 'sonner';
import type { PremiumFrequency } from '@/types';

const PREMIUM_FREQUENCIES: { label: string; value: PremiumFrequency }[] = [
    { label: 'Annual (Single)', value: 'ANNUAL' },
    { label: 'Semi-Annual', value: 'SEMI_ANNUAL' },
    { label: 'Quarterly', value: 'QUARTERLY' },
    { label: 'Monthly', value: 'MONTHLY' },
    { label: 'Single Premium', value: 'SINGLE' },
];

interface EditFormState {
    policyNumber: string;
    inceptionDate: string;
    expiryDate: string;
    premiumAmount: number;
    sumInsured: number;
    commissionRate: number;
    premiumFrequency: PremiumFrequency;
    coverageDetails: string;
}

export default function EditPolicyPage() {
    const params = useParams();
    const router = useRouter();
    const policyId = params.id as string;

    const { data: policyRaw, isLoading } = usePolicy(policyId);
    const policy = policyRaw as any;
    const updateMutation = useUpdatePolicy();

    const [form, setForm] = useState<EditFormState | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Populate form when policy loads
    useEffect(() => {
        if (policy && !form) {
            setForm({
                policyNumber: policy.policyNumber || '',
                inceptionDate: policy.inceptionDate?.split('T')[0] || '',
                expiryDate: policy.expiryDate?.split('T')[0] || '',
                premiumAmount: Number(policy.premiumAmount) || 0,
                sumInsured: Number(policy.sumInsured) || 0,
                commissionRate: Number(policy.commissionRate) || 0,
                premiumFrequency: policy.premiumFrequency || 'ANNUAL',
                coverageDetails: policy.coverageDetails || '',
            });
        }
    }, [policy, form]);

    function update<K extends keyof EditFormState>(field: K, value: EditFormState[K]) {
        setForm(prev => {
            if (!prev) return prev;
            const next = { ...prev, [field]: value };
            // Auto-recalculate expiry when inception changes
            if (field === 'inceptionDate' && value) {
                const d = new Date(value as string);
                d.setFullYear(d.getFullYear() + 1);
                next.expiryDate = d.toISOString().split('T')[0];
            }
            return next;
        });
    }

    const commissionAmount = useMemo(() => {
        if (!form) return 0;
        return Math.round((form.premiumAmount * form.commissionRate) / 100);
    }, [form?.premiumAmount, form?.commissionRate]);

    async function handleSave() {
        if (!form || !policyId) return;

        // Basic validation
        if (form.premiumAmount <= 0) {
            toast.error('Premium must be greater than 0');
            return;
        }
        if (form.sumInsured <= 0) {
            toast.error('Sum Insured must be greater than 0');
            return;
        }
        if (form.expiryDate && form.inceptionDate && new Date(form.expiryDate) <= new Date(form.inceptionDate)) {
            toast.error('Expiry date must be after inception date');
            return;
        }

        setIsSaving(true);
        try {
            await updateMutation.mutateAsync({
                id: policyId,
                data: {
                    policyNumber: form.policyNumber || undefined,
                    startDate: form.inceptionDate || undefined,
                    endDate: form.expiryDate || undefined,
                    premiumAmount: form.premiumAmount,
                    sumInsured: form.sumInsured,
                    premiumFrequency: form.premiumFrequency,
                    coverageDetails: form.coverageDetails || undefined,
                    commission: form.commissionRate,
                },
            });
            toast.success('Policy updated successfully', {
                description: `${form.policyNumber || 'Policy'} has been saved.`,
            });
            router.push(`/dashboard/policies/${policyId}`);
        } catch (error: any) {
            toast.error('Failed to update policy', {
                description: error?.response?.data?.message || 'Please try again.',
            });
        } finally {
            setIsSaving(false);
        }
    }

    // ─── Loading State ──────────────────────────────────
    if (isLoading || !form) {
        return <AppLoader message="Loading policy data..." isLoading={true} />;
    }

    if (!policy) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <AlertTriangle size={48} className="text-surface-400" />
                <h2 className="text-xl font-bold text-surface-900">Policy not found</h2>
                <Button variant="primary" onClick={() => router.push('/dashboard/policies')}>
                    Return to Policies
                </Button>
            </div>
        );
    }

    const hasChanges = form.policyNumber !== (policy.policyNumber || '') ||
        form.inceptionDate !== (policy.inceptionDate?.split('T')[0] || '') ||
        form.expiryDate !== (policy.expiryDate?.split('T')[0] || '') ||
        form.premiumAmount !== Number(policy.premiumAmount) ||
        form.sumInsured !== Number(policy.sumInsured) ||
        form.commissionRate !== Number(policy.commissionRate) ||
        form.premiumFrequency !== policy.premiumFrequency ||
        form.coverageDetails !== (policy.coverageDetails || '');

    return (
        <div className="w-full space-y-6 pb-20 animate-fade-in max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <BackButton href={`/dashboard/policies/${policyId}`} />
                    <div>
                        <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Edit Policy</h1>
                        <p className="text-sm text-surface-500 flex items-center gap-2">
                            <span className="font-mono text-primary-600">{policy.policyNumber}</span>
                            <StatusBadge status={policy.status} />
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/dashboard/policies/${policyId}`)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        leftIcon={isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        onClick={handleSave}
                        disabled={isSaving || !hasChanges}
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>

            {/* Change Indicator */}
            {hasChanges && (
                <div className="bg-warning-50 border border-warning-200 rounded-lg px-4 py-2.5 text-sm text-warning-700 font-medium flex items-center gap-2 animate-fade-in">
                    <AlertTriangle size={16} />
                    You have unsaved changes
                </div>
            )}

            {/* ─── Policy Number ────────────────────────────────── */}
            <Card className="p-0 overflow-hidden">
                <div className="bg-surface-50/50 border-b border-surface-100 px-6 py-4">
                    <h3 className="font-semibold text-surface-900 flex items-center gap-2">
                        <Hash size={18} className="text-primary-500" /> Policy Number
                    </h3>
                </div>
                <div className="p-6">
                    <label className="block text-xs font-medium text-surface-600 mb-1.5">
                        Official Policy Number <span className="text-surface-400 font-normal">(from insurer)</span>
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. SIC/MOT/ACC/2025/001234"
                        className="w-full max-w-lg p-2.5 bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 font-mono text-sm transition-all"
                        value={form.policyNumber}
                        onChange={(e) => update('policyNumber', e.target.value)}
                    />
                    <p className="text-[11px] text-surface-400 mt-1.5">This replaces the auto-generated tracking number with the carrier's official policy number.</p>
                </div>
            </Card>

            {/* ─── Coverage Period ──────────────────────────────── */}
            <Card className="p-0 overflow-hidden">
                <div className="bg-surface-50/50 border-b border-surface-100 px-6 py-4">
                    <h3 className="font-semibold text-surface-900 flex items-center gap-2">
                        <Calendar size={18} className="text-accent-500" /> Coverage Period
                    </h3>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg">
                        <div>
                            <label className="block text-xs font-medium text-surface-600 mb-1.5">Inception Date</label>
                            <input
                                type="date"
                                className="w-full p-2.5 bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                                value={form.inceptionDate}
                                onChange={(e) => update('inceptionDate', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-surface-600 mb-1.5">
                                Expiry Date <span className="text-surface-400 font-normal">(auto: +1 year)</span>
                            </label>
                            <input
                                type="date"
                                className="w-full p-2.5 bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                                value={form.expiryDate}
                                onChange={(e) => update('expiryDate', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </Card>

            {/* ─── Financial Details ───────────────────────────── */}
            <Card className="p-0 overflow-hidden">
                <div className="bg-surface-50/50 border-b border-surface-100 px-6 py-4">
                    <h3 className="font-semibold text-surface-900 flex items-center gap-2">
                        <DollarSign size={18} className="text-success-500" /> Financial Details
                    </h3>
                </div>
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg">
                        <div>
                            <label className="block text-xs font-medium text-surface-600 mb-1.5">Sum Insured ({policy.currency || 'GHS'})</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                className="w-full p-2.5 bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all tabular-nums"
                                value={form.sumInsured || ''}
                                onChange={(e) => update('sumInsured', parseFloat(e.target.value) || 0)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-surface-600 mb-1.5">Gross Premium ({policy.currency || 'GHS'})</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                className="w-full p-2.5 bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all tabular-nums"
                                value={form.premiumAmount || ''}
                                onChange={(e) => update('premiumAmount', parseFloat(e.target.value) || 0)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg">
                        <div>
                            <label className="block text-xs font-medium text-surface-600 mb-1.5">Commission Rate (%)</label>
                            <input
                                type="number"
                                min="0"
                                max="50"
                                step="0.5"
                                className="w-full p-2.5 bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all tabular-nums"
                                value={form.commissionRate || ''}
                                onChange={(e) => update('commissionRate', parseFloat(e.target.value) || 0)}
                            />
                            {commissionAmount > 0 && (
                                <p className="text-[11px] text-success-600 mt-1 font-medium">
                                    Commission: {formatCurrency(commissionAmount)}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-surface-600 mb-1.5">Premium Frequency</label>
                            <CustomSelect
                                options={PREMIUM_FREQUENCIES}
                                value={form.premiumFrequency}
                                onChange={(v) => update('premiumFrequency', (v || 'ANNUAL') as PremiumFrequency)}
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>
            </Card>

            {/* ─── Coverage Notes ───────────────────────────────── */}
            <Card className="p-0 overflow-hidden">
                <div className="bg-surface-50/50 border-b border-surface-100 px-6 py-4">
                    <h3 className="font-semibold text-surface-900 flex items-center gap-2">
                        <FileText size={18} className="text-primary-500" /> Coverage Notes
                    </h3>
                </div>
                <div className="p-6">
                    <textarea
                        rows={4}
                        placeholder="Additional coverage details or notes..."
                        className="w-full p-3 bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-sm resize-none transition-all"
                        value={form.coverageDetails}
                        onChange={(e) => update('coverageDetails', e.target.value)}
                    />
                </div>
            </Card>

            {/* ─── Sticky Save Bar ──────────────────────────────── */}
            {hasChanges && (
                <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-surface-200 px-6 py-3 animate-slide-up">
                    <div className="max-w-4xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-warning-700">
                            <AlertTriangle size={16} />
                            <span className="font-medium">Unsaved changes</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/policies/${policyId}`)}>
                                Discard
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                leftIcon={isSaving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                                onClick={handleSave}
                                disabled={isSaving}
                            >
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
