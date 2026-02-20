'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Zap, ShieldCheck, Layers,
    Binary, Fingerprint, Box
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LiquidFilters } from '@/components/ui/liquid-filters';
import { AuroraBlob } from '@/components/ui/aurora-blob';
import { Modal } from '@/components/ui/modal';
import { SettingsDataImport } from '@/components/features/settings/settings-data-import';
import Image from 'next/image';

export default function DataOnboardingPage() {
    const [isWizardOpen, setIsWizardOpen] = useState(false);

    return (
        <div className="relative min-h-[calc(100vh-140px)] overflow-hidden rounded-[48px] bg-[#0a0a0b] text-white">
            <LiquidFilters />

            {/* Background Kinetic Layer */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                <AuroraBlob color="bg-emerald-500/30" size="w-[800px] h-[800px]" x={-200} y={-200} index={0} />
                <AuroraBlob color="bg-primary-600/20" size="w-[900px] h-[900px]" x={500} y={100} index={1} />
                <AuroraBlob color="bg-cyan-400/10" size="w-[600px] h-[600px]" x={100} y={400} index={2} />
            </div>

            {/* Brutalist Watermark */}
            <div className="absolute top-0 right-0 p-12 select-none pointer-events-none">
                <h1 className="text-[20vw] font-black leading-none text-white/[0.03] tracking-tighter italic">
                    INGEST
                </h1>
            </div>

            <div className="relative z-10 p-12 lg:p-20 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-20 h-full">
                {/* Primary Intelligence Section */}
                <div className="space-y-16">
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-3xl"
                        >
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400">System Ready</span>
                        </motion.div>

                        <div style={{ filter: 'url(#liquid-glass)' }}>
                            <motion.h1
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                className="text-[7rem] lg:text-[10rem] font-black leading-[0.85] tracking-tighter"
                            >
                                Data <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-300 to-primary-500">
                                    Inflow
                                </span>
                            </motion.h1>
                        </div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 0.7, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="max-w-2xl text-2xl font-medium leading-relaxed text-surface-200"
                        >
                            The Universal Relational Ingestion Engine is online. Accelerate the transition from legacy silos to a hyper-connected insurance architecture.
                        </motion.p>
                    </div>

                    <div className="flex flex-wrap gap-6 items-center">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                size="lg"
                                className="h-28 px-16 rounded-full bg-white text-black hover:bg-emerald-50 transition-all text-3xl font-black uppercase tracking-widest gap-6 group"
                                onClick={() => setIsWizardOpen(true)}
                            >
                                Start Migration
                                <Zap className="w-10 h-10 text-emerald-500 fill-emerald-500 transition-transform group-hover:rotate-12" />
                            </Button>
                        </motion.div>

                        <div className="flex -space-x-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-14 h-14 rounded-full border-4 border-[#0a0a0b] bg-surface-800 flex items-center justify-center overflow-hidden relative">
                                    <Image src={`https://i.pravatar.cc/150?u=${i}`} alt="user" fill className="object-cover" />
                                </div>
                            ))}
                            <div className="w-14 h-14 rounded-full border-4 border-[#0a0a0b] bg-emerald-500 text-black flex items-center justify-center text-xs font-black relative">
                                +12
                            </div>
                        </div>
                        <span className="text-xs font-bold text-surface-500 uppercase tracking-widest pl-4">Recently Processed</span>
                    </div>

                    {/* Meta Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
                        <StatsCard icon={<Binary className="text-emerald-400" />} label="Avg Extraction" value="98.2%" />
                        <StatsCard icon={<Fingerprint className="text-cyan-400" />} label="Deduplication" value="Active" />
                        <StatsCard icon={<Box className="text-primary-400" />} label="Entity Links" value="Relational" />
                    </div>
                </div>

                {/* Vertical Secondary Info (Asymmetric Tension) */}
                <div className="hidden lg:flex flex-col gap-8 justify-end">
                    <Card className="bg-white/5 border-white/10 backdrop-blur-2xl p-8 rounded-[32px] space-y-6">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <ShieldCheck size={28} />
                        </div>
                        <h3 className="text-xl font-bold italic tracking-tight">Compliance Guard</h3>
                        <p className="text-sm text-surface-400 leading-relaxed">
                            Auto-validated against GIA standards and NIC regulatory frameworks in real-time.
                        </p>
                    </Card>

                    <Card className="bg-white/5 border-white/10 backdrop-blur-2xl p-8 rounded-[32px] space-y-6">
                        <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                            <Layers size={28} />
                        </div>
                        <h3 className="text-xl font-bold italic tracking-tight">Cross-Entity Mapping</h3>
                        <p className="text-sm text-surface-400 leading-relaxed">
                            Flat data is intelligently decomposed into Clients, Policies, and Claims automatically.
                        </p>
                    </Card>
                </div>
            </div>

            {/* Ingestion Wizard Modal */}
            <Modal
                isOpen={isWizardOpen}
                onClose={() => setIsWizardOpen(false)}
                size="2xl"
                className="h-[90vh]"
            >
                <div className="bg-[#0f0f11] h-full p-8 overflow-hidden rounded-[32px]">
                    <SettingsDataImport />
                </div>
            </Modal>
        </div>
    );
}

function StatsCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <Card className="bg-white/[0.03] border-white/5 p-6 rounded-[24px] hover:bg-white/[0.06] transition-colors">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                    {icon}
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-surface-500 italic">{label}</p>
                    <p className="text-2xl font-black tracking-tighter">{value}</p>
                </div>
            </div>
        </Card>
    );
}
