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
    const [contactName, setContactName] = useState('');
    const [company, setCompany] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [productInterest, setProductInterest] = useState<string | null>(null);
    const [priority, setPriority] = useState<string | null>('warm');
    const [notes, setNotes] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!contactName.trim()) errs.contactName = 'Contact name is required.';
        if (!phone.trim()) errs.phone = 'Phone number is required.';
        else if (!/^\+?[0-9\s\-]{9,15}$/.test(phone.replace(/\s/g, '')))
            errs.phone = 'Please enter a valid phone number.';
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            errs.email = 'Please enter a valid email address.';
        return errs;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) {
            toast.error('Please fix the errors before submitting.');
            return;
        }

        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        toast.success('Lead Created', {
            description: `${contactName} has been added to the pipeline.`
        });

        router.push('/dashboard/leads');
    };

    
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-sm text-surface-500">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in w-full pb-10 max-w-4xl mx-auto">
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
                                value={contactName}
                                onChange={(e) => { setContactName(e.target.value); setErrors(prev => { const { contactName: _, ...rest } = prev; return rest; }); }}
                                placeholder="e.g. John Doe"
                                className="w-full px-4 py-3 rounded-[var(--radius-md)] border border-surface-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-medium"
                            />
                            {errors.contactName && <p className="text-xs text-danger-600 font-medium mt-1">{errors.contactName}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-surface-500 uppercase tracking-wider flex items-center gap-2">
                                <Building size={14} /> Company (Optional)
                            </label>
                            <input
                                type="text"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
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
                                value={phone}
                                onChange={(e) => { setPhone(e.target.value); setErrors(prev => { const { phone: _, ...rest } = prev; return rest; }); }}
                                placeholder="+233 XX XXX XXXX"
                                className="w-full px-4 py-3 rounded-[var(--radius-md)] border border-surface-200 focus:border-primary-500 outline-none transition-all font-medium"
                            />
                            {errors.phone && <p className="text-xs text-danger-600 font-medium mt-1">{errors.phone}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-surface-500 uppercase tracking-wider flex items-center gap-2">
                                <Mail size={14} /> Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setErrors(prev => { const { email: _, ...rest } = prev; return rest; }); }}
                                placeholder="john@example.com"
                                className="w-full px-4 py-3 rounded-[var(--radius-md)] border border-surface-200 focus:border-primary-500 outline-none transition-all font-medium"
                            />
                            {errors.email && <p className="text-xs text-danger-600 font-medium mt-1">{errors.email}</p>}
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
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
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
