'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, User, Building, Phone, Mail, Tag, Flag, MessageSquare } from 'lucide-react';
import { BackButton } from '@/components/ui/back-button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CustomSelect } from '@/components/ui/select-custom';
import { toast } from 'sonner';

export default function NewLeadPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [productInterest, setProductInterest] = useState<string | null>(null);
    const [priority, setPriority] = useState<string | null>('warm');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        toast.success('Lead Created', {
            description: 'The lead has been successfully added to the pipeline.'
        });

        router.push('/dashboard/leads');
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-4xl mx-auto pb-10">
            {/* Header */}
            <div className="flex items-center gap-4">
                <BackButton onClick={() => router.back()} />
                <div>
                    <h1 className="text-2xl font-bold text-surface-900 tracking-tight">New Lead</h1>
                    <p className="text-sm text-surface-500">Capture information for a potential client.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card padding="none" className="overflow-hidden">
                    <CardHeader title="Lead Details" className="border-b border-surface-100 bg-surface-50/40" />
                    <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Contact Info */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-surface-500 uppercase tracking-wider flex items-center gap-2">
                                <User size={14} /> Contact Name <span className="text-danger-500">*</span>
                            </label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. John Doe"
                                className="w-full px-4 py-3 rounded-[var(--radius-md)] border border-surface-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-surface-500 uppercase tracking-wider flex items-center gap-2">
                                <Building size={14} /> Company (Optional)
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Acme Corp"
                                className="w-full px-4 py-3 rounded-[var(--radius-md)] border border-surface-200 focus:border-primary-500 outline-none transition-all font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-surface-500 uppercase tracking-wider flex items-center gap-2">
                                <Phone size={14} /> Phone Number <span className="text-danger-500">*</span>
                            </label>
                            <input
                                required
                                type="tel"
                                placeholder="+233 XX XXX XXXX"
                                className="w-full px-4 py-3 rounded-[var(--radius-md)] border border-surface-200 focus:border-primary-500 outline-none transition-all font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-surface-500 uppercase tracking-wider flex items-center gap-2">
                                <Mail size={14} /> Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="john@example.com"
                                className="w-full px-4 py-3 rounded-[var(--radius-md)] border border-surface-200 focus:border-primary-500 outline-none transition-all font-medium"
                            />
                        </div>

                    </CardContent>
                </Card>

                <Card padding="none" className="overflow-hidden">
                    <CardHeader title="Interest & Status" className="border-b border-surface-100 bg-surface-50/40" />
                    <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-surface-500 uppercase tracking-wider flex items-center gap-2">
                                <Tag size={14} /> Product Interest
                            </label>
                            <CustomSelect
                                placeholder="Select Product..."
                                options={[
                                    { label: 'Motor Insurance', value: 'motor' },
                                    { label: 'Fire & Allied Perils', value: 'fire' },
                                    { label: 'Life Assurance', value: 'life' },
                                    { label: 'Health / Medical', value: 'medical' },
                                    { label: 'Travel Insurance', value: 'travel' },
                                ]}
                                value={productInterest}
                                onChange={(v) => setProductInterest(v as string | null)}
                                clearable
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-surface-500 uppercase tracking-wider flex items-center gap-2">
                                <Flag size={14} /> Priority Level
                            </label>
                            <CustomSelect
                                options={[
                                    { label: 'Hot (Immediate)', value: 'hot' },
                                    { label: 'Warm (Interested)', value: 'warm' },
                                    { label: 'Cold (Future)', value: 'cold' },
                                ]}
                                value={priority}
                                onChange={(v) => setPriority(v as string | null)}
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-bold text-surface-500 uppercase tracking-wider flex items-center gap-2">
                                <MessageSquare size={14} /> Notes / Initial Requirements
                            </label>
                            <textarea
                                rows={4}
                                placeholder="Enter any initial notes or specific requirements from the lead..."
                                className="w-full px-4 py-3 rounded-[var(--radius-md)] border border-surface-200 focus:border-primary-500 outline-none transition-all font-medium resize-none"
                            />
                        </div>

                    </CardContent>
                </Card>

                <div className="flex items-center justify-end gap-4 pt-4">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => router.back()}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        isLoading={isLoading}
                        leftIcon={<Save size={18} />}
                        className="min-w-[150px]"
                    >
                        Create Lead
                    </Button>
                </div>
            </form>
        </div>
    );
}
