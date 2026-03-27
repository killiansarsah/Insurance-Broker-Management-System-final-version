'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, Plus, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface RenewalTemplate {
    id: string;
    tenantId: string;
    name: string;
    triggerDays: number;
    subject: string;
    htmlContent: string;
    isActive: boolean;
}

const TEMPLATE_VARIABLES = [
    '{{client_first_name}}', '{{policy_number}}', '{{insurance_type}}', 
    '{{expiry_date}}', '{{days_remaining}}', '{{current_premium}}',
    '{{carrier_name}}', '{{vehicle_reg}}', '{{property_address}}',
    '{{officer_name}}', '{{officer_phone}}', '{{agency_name}}',
    '{{agency_nic_number}}', '{{agency_phone}}', '{{agency_email}}'
];

export function SettingsRenewals() {
    const [templates, setTemplates] = useState<RenewalTemplate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTemplateIndex, setActiveTemplateIndex] = useState(0);

    // Fetch templates from API
    useEffect(() => {
        const loadTemplates = async () => {
            setIsLoading(true);
            try {
                const { apiClient } = await import('@/lib/api-client');
                const res = await apiClient.get<RenewalTemplate[]>('/renewals/templates');
                if (res && res.length > 0) {
                    setTemplates(res);
                } else {
                    // Fallback to empty if nothing loaded yet
                    setTemplates([]);
                }
            } catch (err) {
                toast.error('Failed to load renewal email templates.');
            } finally {
                setIsLoading(false);
            }
        };
        loadTemplates();
    }, []);

    const handleSave = async () => {
        try {
            const { apiClient } = await import('@/lib/api-client');
            const active = templates[activeTemplateIndex];
            if (!active) return;
            
            await apiClient.put(`/renewals/templates/${active.id}`, {
                name: active.name,
                triggerDays: active.triggerDays,
                subject: active.subject,
                htmlContent: active.htmlContent,
                isActive: active.isActive
            });
            toast.success('Template saved successfully!');
        } catch (err) {
            toast.error('Failed to save template.');
        }
    };

    if (isLoading) return <div className="animate-pulse space-y-4"><div className="h-64 bg-surface-100 rounded-2xl"></div></div>;

    const activeTemplate = templates[activeTemplateIndex];

    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h2 className="text-xl font-bold text-surface-900">Email Templates</h2>
                    <p className="text-sm text-surface-500">Customize the automated messages sent to clients approaching renewal.</p>
                </div>
                <Button onClick={handleSave} leftIcon={<Save size={16} />}>Save Changes</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1 space-y-2">
                    {templates.map((tpl, idx) => (
                        <div 
                            key={tpl.id}
                            onClick={() => setActiveTemplateIndex(idx)}
                            className={`p-3 rounded-lg cursor-pointer border transition-colors ${activeTemplateIndex === idx ? 'bg-primary-50 border-primary-200 shadow-sm' : 'bg-white border-surface-200 hover:border-primary-300'}`}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <Mail size={14} className={activeTemplateIndex === idx ? 'text-primary-600' : 'text-surface-400'} />
                                <span className={`font-semibold text-sm ${activeTemplateIndex === idx ? 'text-primary-900' : 'text-surface-700'}`}>{tpl.triggerDays} Days</span>
                            </div>
                            <p className="text-xs text-surface-500 truncate">{tpl.name}</p>
                        </div>
                    ))}
                    <Button variant="outline" className="w-full mt-4" leftIcon={<Plus size={16} />}>Add Template</Button>
                </div>

                <div className="md:col-span-3">
                    {activeTemplate && (
                        <Card className="p-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-surface-700 uppercase">Internal Name</label>
                                        <Input 
                                            value={activeTemplate.name} 
                                            onChange={(e) => {
                                                const newTpls = [...templates];
                                                newTpls[activeTemplateIndex].name = e.target.value;
                                                setTemplates(newTpls);
                                            }} 
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-surface-700 uppercase">Trigger (Days Before)</label>
                                        <Input 
                                            type="number"
                                            value={activeTemplate.triggerDays} 
                                            onChange={(e) => {
                                                const newTpls = [...templates];
                                                newTpls[activeTemplateIndex].triggerDays = Number(e.target.value);
                                                setTemplates(newTpls);
                                            }} 
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-surface-700 uppercase">Email Subject</label>
                                    <Input 
                                        value={activeTemplate.subject} 
                                        onChange={(e) => {
                                            const newTpls = [...templates];
                                            newTpls[activeTemplateIndex].subject = e.target.value;
                                            setTemplates(newTpls);
                                        }} 
                                    />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-semibold text-surface-700 uppercase">Email Body</label>
                                    </div>
                                    <textarea 
                                        className="w-full h-64 p-3 rounded-lg border border-surface-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 resize-none text-sm"
                                        value={activeTemplate.htmlContent}
                                        onChange={(e) => {
                                            const newTpls = [...templates];
                                            newTpls[activeTemplateIndex].htmlContent = e.target.value;
                                            setTemplates(newTpls);
                                        }}
                                    />
                                </div>
                            </div>
                            
                            <div className="mt-6 pt-6 border-t border-surface-100">
                                <h4 className="text-xs font-bold text-surface-900 uppercase mb-3">Available Variables</h4>
                                <div className="flex flex-wrap gap-2">
                                    {TEMPLATE_VARIABLES.map(v => (
                                        <span key={v} className="bg-surface-100 text-surface-600 px-2 py-1 rounded text-[10px] font-mono select-all cursor-pointer hover:bg-surface-200">
                                            {v}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
