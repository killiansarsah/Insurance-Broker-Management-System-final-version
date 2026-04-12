'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Plus, Calculator, Activity, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';
import { useTaxRules, useCreateTaxRule, useUpdateTaxRule, usePreviewTaxCalculation, SystemTaxRule } from '@/hooks/super-admin/useTaxRules';
import { toast } from 'sonner';

export default function TaxRulesPage() {
    const { data: rules = [], isLoading } = useTaxRules();
    const createRule = useCreateTaxRule();
    const updateRule = useUpdateTaxRule();
    const previewCalc = usePreviewTaxCalculation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRule, setEditingRule] = useState<Partial<SystemTaxRule> | null>(null);

    const [previewMode, setPreviewMode] = useState(false);
    const [previewInput, setPreviewInput] = useState({ insuranceType: 'MOTOR', basePremium: 1000 });
    const [previewResult, setPreviewResult] = useState<any>(null);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Convert rate based on percentage text input (e.g., "15" -> 0.15)
        const payload = {
            ...editingRule,
            rate: editingRule?.type === 'PERCENTAGE' && editingRule.rate 
                    ? parseFloat(editingRule.rate.toString()) / 100 
                    : editingRule?.rate,
        };

        if (payload.id) {
            updateRule.mutate({ id: payload.id as string, data: payload }, {
                onSuccess: () => {
                    toast.success('Tax rule updated successfully');
                    setIsModalOpen(false);
                }
            });
        } else {
            createRule.mutate(payload, {
                onSuccess: () => {
                    toast.success('Tax rule created successfully');
                    setIsModalOpen(false);
                }
            });
        }
    };

    const handlePreview = () => {
        previewCalc.mutate(previewInput, {
            onSuccess: (data) => setPreviewResult(data),
            onError: () => toast.error('Failed to calculate premium preview')
        });
    };

    const StatusBadge = ({ effectiveFrom, effectiveTo }: { effectiveFrom: string, effectiveTo: string | null }) => {
        const now = new Date();
        const from = new Date(effectiveFrom);
        const to = effectiveTo ? new Date(effectiveTo) : null;
        
        const isFuture = from > now;
        const isExpired = to && to < now;
        
        if (isExpired) return <span className="px-2 py-1 bg-danger-50 text-danger-600 rounded text-xs font-bold uppercase border border-danger-200">Expired</span>;
        if (isFuture) return <span className="px-2 py-1 bg-warning-50 text-warning-600 rounded text-xs font-bold uppercase border border-warning-200">Scheduled</span>;
        return <span className="px-2 py-1 bg-success-50 text-success-600 rounded text-xs font-bold uppercase border border-success-200">Active</span>;
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto w-full animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-background p-6 rounded-[var(--radius-lg)] border border-surface-200 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary-50 rounded-xl">
                        <ShieldCheck className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Tax & Levy Engine</h1>
                        <p className="text-sm text-surface-500">Manage dynamic tax rules, cascading logic, and compliance rates globally.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setPreviewMode(!previewMode)} leftIcon={<Calculator size={16} />}>
                        Test Calculator
                    </Button>
                    <Button variant="primary" onClick={() => {
                        setEditingRule({ type: 'PERCENTAGE', isCascading: false, status: 'ACTIVE', applicableTo: ['MOTOR', 'FIRE', 'MARINE', 'ENGINEERING', 'GENERAL_ACCIDENT', 'LIABILITY'], calculationOrder: rules.length + 1 });
                        setIsModalOpen(true);
                    }} leftIcon={<Plus size={16} />}>
                        Add Tax Rule
                    </Button>
                </div>
            </div>

            {/* Test Calculator Tool */}
            {previewMode && (
                <div className="bg-primary-50 border border-primary-200 p-6 rounded-2xl animate-in flip-in-y duration-500">
                    <h3 className="font-bold text-primary-900 mb-4 flex items-center gap-2">
                        <Activity size={18} /> Premium Calculation Sandbox
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-primary-700 uppercase tracking-wider">Product Type</label>
                            <select 
                                className="w-full bg-white border border-primary-200 rounded-lg h-10 px-3 text-sm focus:ring-primary-500 focus:border-primary-500"
                                value={previewInput.insuranceType}
                                onChange={(e) => setPreviewInput({ ...previewInput, insuranceType: e.target.value })}
                            >
                                <option value="MOTOR">Motor</option>
                                <option value="FIRE">Fire</option>
                                <option value="MARINE">Marine</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-primary-700 uppercase tracking-wider">Base Premium</label>
                            <input 
                                type="number" 
                                className="w-full bg-white border border-primary-200 rounded-lg h-10 px-3 text-sm focus:ring-primary-500 focus:border-primary-500"
                                value={previewInput.basePremium}
                                onChange={(e) => setPreviewInput({ ...previewInput, basePremium: Number(e.target.value) })}
                            />
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <Button 
                                variant="primary" 
                                className="w-full" 
                                onClick={handlePreview} 
                                isLoading={previewCalc.isPending}
                            >
                                Run Engine Simulation
                            </Button>
                        </div>
                    </div>

                    {previewResult && (
                        <div className="mt-6 bg-white p-6 rounded-xl border border-primary-100 shadow-sm grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[10px] uppercase font-bold text-surface-500 mb-2">Calculation Flow</p>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-sm py-1 border-b border-surface-100">
                                        <span className="text-surface-600">Base Premium</span>
                                        <span className="font-mono">{formatCurrency(previewResult.basePremium)}</span>
                                    </div>
                                    {[...(previewResult.levies || []), ...(previewResult.cascadingTaxes || [])].map((r: any, i: number) => (
                                        <div key={i} className="flex justify-between text-sm py-1 border-b border-surface-100 items-center">
                                            <span className="text-surface-600 flex items-center gap-2">
                                                {r.name}
                                                {r.isCascading && <span className="px-1.5 py-0.5 bg-accent-50 text-accent-700 text-[9px] rounded font-bold uppercase">Cascading</span>}
                                            </span>
                                            <span className="font-mono">{formatCurrency(r.amount)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-primary-900 text-white rounded-xl p-6 flex flex-col justify-center items-center">
                                <p className="text-primary-200 text-sm font-medium">Final Gross Premium</p>
                                <p className="text-4xl font-bold font-mono tracking-tight mt-2">{formatCurrency(previewResult.grossPremium)}</p>
                                <p className="text-xs text-primary-300 mt-2">Total Tax: {formatCurrency(previewResult.totalTax)}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Rules Table */}
            <Card padding="none" className="overflow-hidden border border-surface-200">
                <div className="overflow-x-auto min-w-[800px]">
                    <div className="grid grid-cols-12 gap-4 p-4 bg-surface-50 border-b border-surface-200 text-xs font-bold text-surface-500 uppercase tracking-widest">
                        <div className="col-span-1">Order #</div>
                        <div className="col-span-3">Tax/Levy Name</div>
                        <div className="col-span-2">Rate</div>
                        <div className="col-span-3">Applicability</div>
                        <div className="col-span-2">Effective Date</div>
                        <div className="col-span-1 text-right text-transparent">Action</div>
                    </div>

                    <div className="divide-y divide-surface-100">
                        {isLoading ? (
                            <div className="p-8 text-center text-surface-500">Loading tax rules...</div>
                        ) : rules.length === 0 ? (
                            <div className="p-8 text-center text-surface-500">No tax rules configured. Click 'Add Tax Rule' to establish baseline compliance.</div>
                        ) : rules.map((rule) => (
                            <div key={rule.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-surface-50 transition-colors">
                                <div className="col-span-1 font-mono text-xs font-bold text-surface-400">
                                    {rule.calculationOrder}
                                </div>
                                <div className="col-span-3">
                                    <h4 className="font-bold text-sm text-surface-900">{rule.name} <span className="text-surface-400 font-mono text-[10px] ml-1">{rule.code}</span></h4>
                                    <div className="flex gap-2 mt-1">
                                        <StatusBadge effectiveFrom={rule.effectiveFrom} effectiveTo={rule.effectiveTo} />
                                        {rule.isCascading && <span className="px-1.5 py-0.5 bg-accent-50 text-accent-700 text-[10px] rounded font-bold uppercase">Tax-on-Tax</span>}
                                    </div>
                                </div>
                                <div className="col-span-2 flex items-center gap-2">
                                    <span className="font-mono font-bold bg-surface-100 px-2 py-1 rounded">
                                        {rule.type === 'PERCENTAGE' ? `${(Number(rule.rate) * 100).toFixed(1)}%` : formatCurrency(Number(rule.rate))}
                                    </span>
                                </div>
                                <div className="col-span-3">
                                    <div className="flex flex-wrap gap-1">
                                        {rule.applicableTo?.length === 6 ? (
                                            <span className="text-xs bg-surface-100 text-surface-600 px-2 py-0.5 rounded">All Products</span>
                                        ) : (
                                            (rule.applicableTo || []).map((app) => (
                                                <span key={app} className="text-[10px] bg-primary-50 text-primary-700 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">{app}</span>
                                            ))
                                        )}
                                    </div>
                                </div>
                                <div className="col-span-2 text-xs text-surface-500">
                                    <div>From: <span className="font-medium text-surface-900">{new Date(rule.effectiveFrom).toLocaleDateString()}</span></div>
                                    {rule.effectiveTo && <div>To: <span className="font-medium text-surface-900">{new Date(rule.effectiveTo).toLocaleDateString()}</span></div>}
                                </div>
                                <div className="col-span-1 text-right">
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        className="h-8"
                                        onClick={() => {
                                            setEditingRule({
                                                ...rule,
                                                rate: rule.type === 'PERCENTAGE' ? Number(rule.rate) * 100 : Number(rule.rate)
                                            });
                                            setIsModalOpen(true);
                                        }}
                                    >
                                        Edit
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title={editingRule?.id ? "Update System Tax Rule" : "Create System Tax Rule"}
            >
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-surface-700 uppercase">Rule Name</label>
                            <input 
                                required
                                className="w-full bg-surface-50 border border-surface-200 rounded-lg p-2 text-sm focus:ring-primary-500 focus:border-primary-500 transition-all font-medium"
                                value={editingRule?.name || ''}
                                onChange={(e) => setEditingRule({ ...editingRule, name: e.target.value })}
                                placeholder="e.g. Value Added Tax"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-surface-700 uppercase">Short Code</label>
                            <input 
                                required
                                className="w-full bg-surface-50 border border-surface-200 rounded-lg p-2 text-sm focus:ring-primary-500 focus:border-primary-500 transition-all font-mono"
                                value={editingRule?.code || ''}
                                onChange={(e) => setEditingRule({ ...editingRule, code: e.target.value.toUpperCase() })}
                                placeholder="e.g. VAT"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-surface-700 uppercase">Amount TYPE</label>
                            <select 
                                required
                                className="w-full bg-surface-50 border border-surface-200 rounded-lg p-2 text-sm focus:ring-primary-500"
                                value={editingRule?.type || 'PERCENTAGE'}
                                onChange={(e) => setEditingRule({ ...editingRule, type: e.target.value as any })}
                            >
                                <option value="PERCENTAGE">Percentage (%)</option>
                                <option value="FLAT_FEE">Flat Fee (Fixed)</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-surface-700 uppercase">
                                Rate/Amount {editingRule?.type === 'PERCENTAGE' && '(%)'}
                            </label>
                            <input 
                                required
                                type="number"
                                step="any"
                                className="w-full bg-surface-50 border border-surface-200 rounded-lg p-2 text-sm focus:ring-primary-500 transition-all font-mono"
                                value={editingRule?.rate || ''}
                                onChange={(e) => setEditingRule({ ...editingRule, rate: Number(e.target.value) })}
                                placeholder={editingRule?.type === 'PERCENTAGE' ? "15" : "50"}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 bg-surface-50 p-4 rounded-lg border border-surface-200">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-surface-700 uppercase">Calculation Order</label>
                            <input 
                                required
                                type="number"
                                className="w-full bg-white border border-surface-200 rounded-lg p-2 text-sm"
                                value={editingRule?.calculationOrder || 1}
                                onChange={(e) => setEditingRule({ ...editingRule, calculationOrder: Number(e.target.value) })}
                            />
                            <p className="text-[10px] text-surface-500 mt-1">Lower executes first (e.g. NHIL=1, VAT=2)</p>
                        </div>
                        <div className="space-y-1 flex flex-col justify-center">
                            <label className="flex items-center gap-2 cursor-pointer mt-4">
                                <input 
                                    type="checkbox"
                                    className="rounded border-surface-300 text-accent-600 focus:ring-accent-500"
                                    checked={editingRule?.isCascading || false}
                                    onChange={(e) => setEditingRule({ ...editingRule, isCascading: e.target.checked })}
                                />
                                <span className="text-sm font-semibold text-surface-900 border-b border-dashed border-surface-400">Apply tax recursively (Tax-on-Tax)</span>
                            </label>
                            <p className="text-[10px] text-surface-500 mt-1 ml-6">If true, calculates rate on (Base + Prior Levies).</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-surface-700 uppercase">Effective From</label>
                            <input 
                                required
                                type="date"
                                className="w-full bg-surface-50 border border-surface-200 rounded-lg p-2 text-sm"
                                value={editingRule?.effectiveFrom ? new Date(editingRule.effectiveFrom).toISOString().split('T')[0] : ''}
                                onChange={(e) => setEditingRule({ ...editingRule, effectiveFrom: new Date(e.target.value).toISOString() })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-surface-700 uppercase">Effective To <span className="text-surface-400 lowercase normal-case">(optional)</span></label>
                            <input 
                                type="date"
                                className="w-full bg-surface-50 border border-surface-200 rounded-lg p-2 text-sm"
                                value={editingRule?.effectiveTo ? new Date(editingRule.effectiveTo).toISOString().split('T')[0] : ''}
                                onChange={(e) => setEditingRule({ ...editingRule, effectiveTo: e.target.value ? new Date(e.target.value).toISOString() : null })}
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-surface-200 flex justify-end gap-2">
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="primary" isLoading={createRule.isPending || updateRule.isPending}>Save Tax Engine parameters</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
