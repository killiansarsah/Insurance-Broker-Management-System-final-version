'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Upload, Info, FileText,
    CheckCircle2, ArrowRight
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { SettingsDataImport } from '@/components/features/settings/settings-data-import';
import { toast } from 'sonner';

export default function ImportPage() {
    const [isWizardOpen, setIsWizardOpen] = useState(false);

    return (
        <div className="w-full py-12 px-6" style={{ maxWidth: '64rem', margin: '0 auto' }}>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
            >
                {/* Simple Header */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-surface-900 tracking-tight">Data Import</h1>
                    <p className="text-surface-500 text-lg">Upload and migrate your client and policy records into the system.</p>
                </div>

                {/* Main Action Card */}
                <Card padding="none" className="overflow-hidden border-surface-200 shadow-sm bg-background rounded-[32px]">
                    <div className="p-10 border-b border-surface-100 bg-surface-50/30">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                            <div className="w-20 h-20 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                                <Upload size={32} />
                            </div>
                            <div className="flex-1 space-y-2">
                                <h2 className="text-xl font-bold text-surface-900">Launch Import Wizard</h2>
                                <p className="text-surface-500 text-sm leading-relaxed max-w-[600px]">
                                    Our intelligent migration engine supports CSV and Excel files.
                                    Records will be automatically linked and validated against system standards.
                                </p>
                            </div>
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={() => setIsWizardOpen(true)}
                                className="h-14 px-8 font-bold shadow-lg shadow-primary-500/20 rounded-2xl"
                                rightIcon={<ArrowRight size={18} />}
                            >
                                Start Import
                            </Button>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-surface-100">
                        <FeatureItem
                            icon={<FileText className="text-blue-500" />}
                            title="Format Support"
                            desc="Optimized for CSV, XLS, and XLSX standard formats."
                        />
                        <FeatureItem
                            icon={<CheckCircle2 className="text-emerald-500" />}
                            title="Auto-Validation"
                            desc="Real-time data integrity and compliance checks."
                        />
                        <FeatureItem
                            icon={<Info className="text-amber-500" />}
                            title="Help Center"
                            desc="Access templates and migration documentation."
                        />
                    </div>
                </Card>

                {/* Info Alert */}
                <div className="p-4 bg-primary-50/50 border border-primary-100 rounded-2xl flex items-start gap-3">
                    <Info size={18} className="text-primary-600 mt-0.5" />
                    <p className="text-sm text-primary-900/80 leading-relaxed">
                        <strong>Need help getting started?</strong> Download our
                        <button onClick={() => toast.success('Template Downloaded', { description: 'The standard import template (XLSX) is being downloaded.' })} className="text-primary-700 font-bold underline px-1 hover:text-primary-800">standard import template</button>
                        to ensure your data structure matches the system requirements for a seamless migration.
                    </p>
                </div>
            </motion.div>

            {/* Ingestion Wizard Modal */}
            <Modal
                isOpen={isWizardOpen}
                onClose={() => setIsWizardOpen(false)}
                size="full"
                className="h-[95vh] p-0"
            >
                <div className="bg-background h-full rounded-[32px] overflow-hidden">
                    <SettingsDataImport />
                </div>
            </Modal>
        </div>
    );
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode; title: string, desc: string }) {
    return (
        <div className="p-8 space-y-3 hover:bg-surface-50/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-surface-50 flex items-center justify-center">
                {icon}
            </div>
            <h3 className="font-bold text-surface-900 text-sm tracking-tight">{title}</h3>
            <p className="text-xs text-surface-500 leading-relaxed font-medium">{desc}</p>
        </div>
    );
}
