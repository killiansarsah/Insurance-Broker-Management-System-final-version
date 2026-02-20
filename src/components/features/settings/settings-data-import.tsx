'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Upload, Users, FileText, Shield, LineChart,
    Download, ArrowRight, ArrowLeft, CheckCircle2,
    AlertCircle, XCircle, FileSpreadsheet, Sparkles,
    RotateCcw, Search, Zap, Loader2
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CustomSelect } from '@/components/ui/select-custom';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { ImportEntityType, ImportColumnMapping, ImportValidationError } from '@/types';
import {
    getFieldsForEntity,
    downloadTemplate,
    parseFile,
    detectColumns,
    autoMapColumns,
    validateRow,
    detectDuplicates,
    applyMappings,
} from '@/lib/import-utils';

// ============================================================
// Premium Components & Animations
// ============================================================

const Confetti = () => {
    // Generate static values once outside of render if possible, 
    // or use framer-motion variants that don't depend on re-evaluating randoms during render.
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
            {[...Array(50)].map((unused, i) => (
                <motion.div
                    key={i}
                    initial={{
                        top: -20,
                        left: `${(i * 137) % 100}%`, // Deterministic "random"
                        rotate: 0,
                        scale: 0.5 + ((i * 7) % 5) / 10
                    }}
                    animate={{
                        top: '120%',
                        rotate: 720,
                        left: `${((i * 31) % 50) - 25 + (i * 2)}%`
                    }}
                    transition={{
                        duration: 2 + (i % 3),
                        repeat: Infinity,
                        ease: "linear",
                        delay: i * 0.1
                    }}
                    className={cn(
                        "absolute w-2 h-2 rounded-sm",
                        ["bg-primary-500", "bg-emerald-500", "bg-amber-500", "bg-blue-500", "bg-purple-500"][i % 5]
                    )}
                />
            ))}
        </div>
    );
};

const ScanningAnimation = () => (
    <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <div className="relative">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 rounded-full border-4 border-dashed border-primary-500/30"
            />
            <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 flex items-center justify-center"
            >
                <Search size={32} className="text-primary-600" />
            </motion.div>
            <motion.div
                initial={{ top: '0%' }}
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary-500 to-transparent shadow-[0_0_10px_#4f46e5]"
            />
        </div>
        <div className="text-center">
            <h4 className="text-lg font-bold text-surface-900">Analyzing Data Structure</h4>
            <p className="text-sm text-surface-500">Auto-mapping your columns to IBMS fields...</p>
        </div>
    </div>
);

const FluidProgressBar = ({ step }: { step: number }) => {
    const progress = (step / 4) * 100;
    return (
        <div className="relative w-full h-1.5 bg-surface-100 rounded-full overflow-hidden mb-12">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", stiffness: 50, damping: 20 }}
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-600 to-cyan-500 shadow-[0_0_15px_rgba(79,70,229,0.5)]"
            />
            <motion.div
                animate={{ left: [`${progress - 10}%`, `${progress + 10}%`, `${progress - 10}%`], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-0 -translate-x-1/2 w-8 h-full bg-white/40 blur-sm"
            />
        </div>
    );
};

const GlassCard = ({ children, className, hoverEffect = false }: { children: React.ReactNode; className?: string; hoverEffect?: boolean }) => (
    <Card className={cn(
        "relative overflow-hidden bg-white/[0.03] backdrop-blur-[32px] border-white/10 shadow-2xl transition-all duration-700 rounded-[32px]",
        "ring-1 ring-white/20",
        hoverEffect && "hover:bg-white/[0.08] hover:ring-white/40 hover:shadow-primary-500/10 hover:-translate-y-1",
        className
    )}>
        {/* Animated background highlights */}
        <div className="absolute top-0 right-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-primary-400/30 to-transparent" />
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-primary-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10">
            {children}
        </div>
    </Card>
);

const slideVariants = {
    enter: { opacity: 0, scale: 0.95, filter: 'blur(10px)' },
    center: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, scale: 1.05, filter: 'blur(10px)' },
};

const staggerContainer = {
    animate: { transition: { staggerChildren: 0.05 } }
};

const staggerItem = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 }
};

// ============================================================
// Main Component
// ============================================================

export function SettingsDataImport() {
    const [step, setStep] = useState(1);
    const [entityType, setEntityType] = useState<ImportEntityType | null>(null);
    const [isScanning, setIsScanning] = useState(false);

    // File state
    const [file, setFile] = useState<File | null>(null);
    const [parsedData, setParsedData] = useState<string[][]>([]);
    const [columns, setColumns] = useState<string[]>([]);
    const [mappings, setMappings] = useState<ImportColumnMapping[]>([]);

    // Import state
    const [isImporting, setIsImporting] = useState(false);
    const [validationErrors, setValidationErrors] = useState<ImportValidationError[]>([]);
    const [duplicateCount, setDuplicateCount] = useState(0);
    const [validRowCount, setValidRowCount] = useState(0);
    const [importComplete, setImportComplete] = useState(false);
    const [importedCount, setImportedCount] = useState(0);
    const [entitiesCreated, setEntitiesCreated] = useState({ clients: 0, policies: 0, claims: 0, leads: 0 });

    const resetWizard = useCallback(() => {
        setStep(1);
        setEntityType(null);
        setFile(null);
        setParsedData([]);
        setColumns([]);
        setMappings([]);
        setValidationErrors([]);
        setDuplicateCount(0);
        setValidRowCount(0);
        setIsScanning(false);
        setImportComplete(false);
        setImportedCount(0);
        setEntitiesCreated({ clients: 0, policies: 0, claims: 0, leads: 0 });
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        try {
            const data = await parseFile(selectedFile);
            setParsedData(data);
            const cols = detectColumns(data);
            setColumns(cols);

            if (entityType) {
                const autoMapped = autoMapColumns(cols, entityType);
                setMappings(autoMapped);
            }

            // Start "Scanning" animation before showing Step 3
            setIsScanning(true);
            setStep(3);
            setTimeout(() => {
                setIsScanning(false);
            }, 2000);
        } catch {
            toast.error('Parse Error');
        }
    };

    const runValidation = useCallback(() => {
        if (!entityType || parsedData.length <= 1) return;
        const mappedRows = applyMappings(parsedData, mappings);
        const allErrors: ImportValidationError[] = [];
        mappedRows.forEach((row, index) => {
            const rowErrors = validateRow(row, entityType, index + 2);
            allErrors.push(...rowErrors);
        });
        const dupes = detectDuplicates(mappedRows, entityType, []);
        const errorRowIndices = new Set(allErrors.map(e => e.row - 2));
        setValidationErrors(allErrors);
        setDuplicateCount(dupes.size);
        setValidRowCount(mappedRows.length - dupes.size - errorRowIndices.size);
    }, [entityType, parsedData, mappings]);

    const handleImport = useCallback(async () => {
        if (!entityType) return;
        setIsImporting(true);
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 2500));

        const mappedRows = applyMappings(parsedData, mappings);
        const dupes = detectDuplicates(mappedRows, entityType, []);
        const successCount = mappedRows.length - dupes.size - validationErrors.length;

        setImportedCount(successCount);

        // Populate entitiesCreated based on type
        if (entityType === 'universal') {
            setEntitiesCreated({
                clients: Math.round(successCount * 0.9), // simulate relational splitting
                policies: successCount,
                claims: 0,
                leads: 0
            });
        } else {
            setEntitiesCreated(prev => ({
                ...prev,
                [entityType]: successCount
            }));
        }

        setImportComplete(true);
        setIsImporting(false);
        toast.success('System Migration Complete', {
            description: `Successfully ingested data for ${successCount} entries.`,
        });
    }, [entityType, parsedData, mappings, validationErrors]);

    // ============================================================
    // Handlers
    // ============================================================

    return (
        <div className="space-y-8 py-2">
            {/* Custom Header */}
            <div className="flex items-center justify-between">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-cyan-500 flex items-center justify-center text-white shadow-xl shadow-primary-500/20">
                            <Zap size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-surface-900 tracking-tight">Data Onboarding</h2>
                            <p className="text-sm text-surface-500 font-medium">Powering your business with historical data.</p>
                        </div>
                    </div>
                </motion.div>
                {step > 1 && !importComplete && (
                    <Button
                        variant="ghost"
                        leftIcon={<RotateCcw size={16} />}
                        onClick={resetWizard}
                        className="rounded-xl hover:bg-surface-100"
                    >
                        Reset Wizard
                    </Button>
                )}
            </div>

            <FluidProgressBar step={step} />

            <AnimatePresence mode="wait">
                {importComplete ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative"
                    >
                        <Confetti />
                        <GlassCard className="text-center py-16">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                                className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-8 shadow-inner"
                            >
                                <CheckCircle2 size={48} className="text-emerald-600" />
                            </motion.div>
                            <h3 className="text-4xl font-black text-surface-900 mb-4 tracking-tight">Mission Accomplished!</h3>
                            <p className="text-lg text-surface-500 max-w-md mx-auto mb-8">
                                We&apos;ve successfully ingested <span className="text-primary-600 font-black">{importedCount}</span> records and created the following entities:
                            </p>
                            <div className="flex flex-wrap justify-center gap-4 mb-12">
                                {Object.entries(entitiesCreated).filter(([, count]) => count > 0).map(([key, count]) => (
                                    <div key={key} className="px-6 py-3 rounded-2xl bg-white/50 border border-white shadow-sm flex items-center gap-3">
                                        <div className={cn(
                                            "w-3 h-3 rounded-full",
                                            key === 'clients' ? "bg-blue-500" :
                                                key === 'policies' ? "bg-emerald-500" :
                                                    key === 'claims' ? "bg-orange-500" : "bg-purple-500"
                                        )} />
                                        <span className="text-sm font-black text-surface-700 uppercase tracking-widest">{count} {key}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-center gap-4">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="px-12 h-14 rounded-2xl shadow-xl shadow-primary-500/30"
                                    onClick={resetWizard}
                                >
                                    Import More
                                </Button>
                            </div>
                        </GlassCard>
                    </motion.div>
                ) : isScanning ? (
                    <motion.div key="scanning" variants={slideVariants} initial="enter" animate="center" exit="exit">
                        <GlassCard>
                            <ScanningAnimation />
                        </GlassCard>
                    </motion.div>
                ) : step === 1 ? (
                    <motion.div key="step1" variants={slideVariants} initial="enter" animate="center" exit="exit">
                        <GlassCard className="p-12">
                            <motion.div
                                variants={staggerContainer}
                                initial="initial"
                                animate="animate"
                                className="space-y-12"
                            >
                                <motion.div variants={staggerItem} className="text-center">
                                    <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.4em] mb-4">
                                        Phase 01 — Selection
                                    </h3>
                                    <h4 className="text-4xl font-black text-white tracking-tight">What are we migrating today?</h4>
                                </motion.div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[
                                        { id: 'universal', label: 'Universal Data', icon: Sparkles, color: 'from-amber-400 to-rose-400', premium: true, desc: 'Clients + Policies + Assets' },
                                        { id: 'clients', label: 'Clients Only', icon: Users, color: 'from-blue-400 to-cyan-400', premium: false, desc: 'Direct client updates' },
                                        { id: 'policies', label: 'Policies Only', icon: FileText, color: 'from-emerald-400 to-teal-400', premium: false, desc: 'Policy-only ingestion' },
                                        { id: 'claims', label: 'Claims', icon: Shield, color: 'from-orange-400 to-amber-400', premium: false, desc: 'Loss & incident history' },
                                        { id: 'leads', label: 'Leads', icon: LineChart, color: 'from-purple-400 to-indigo-400', premium: false, desc: 'Sales pipeline data' },
                                    ].map((item) => (
                                        <motion.button
                                            key={item.id}
                                            variants={staggerItem}
                                            whileHover={{ y: -8, scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setEntityType(item.id as ImportEntityType)}
                                            className={cn(
                                                "relative group p-8 rounded-[32px] border transition-all duration-500 text-left overflow-hidden",
                                                entityType === item.id
                                                    ? "border-primary-400 bg-white/[0.08] shadow-2xl shadow-primary-500/20 ring-4 ring-primary-500/20"
                                                    : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20"
                                            )}
                                        >
                                            <div className={cn(
                                                "absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-40",
                                                item.color
                                            )} />

                                            <div className={cn(
                                                "w-16 h-16 rounded-[20px] flex items-center justify-center text-white shadow-2xl mb-6 bg-gradient-to-br",
                                                item.color
                                            )}>
                                                <item.icon size={32} />
                                            </div>
                                            <h4 className="text-2xl font-black text-white tracking-tight mb-2">{item.label}</h4>
                                            <p className="text-sm text-white/50 font-medium leading-relaxed">{item.desc}</p>

                                            {item.premium && (
                                                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 text-[10px] font-black text-amber-400 uppercase tracking-widest border border-amber-400/20">
                                                    <Zap size={10} className="fill-amber-400" /> Universal Ingest
                                                </div>
                                            )}

                                            {entityType === item.id && (
                                                <motion.div
                                                    layoutId="selected-check"
                                                    className="absolute top-8 right-8 w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white shadow-lg shadow-primary-500/40"
                                                >
                                                    <CheckCircle2 size={18} />
                                                </motion.div>
                                            )}
                                        </motion.button>
                                    ))}
                                </div>

                                <motion.div variants={staggerItem} className="flex flex-col md:flex-row justify-between items-center gap-6 pt-6">
                                    <div className="flex items-center gap-4 text-sm font-bold text-white/40 group">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary-500/50 transition-colors">
                                            <Sparkles size={18} className="text-amber-400" />
                                        </div>
                                        <span>Need a data template?</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="rounded-xl font-black text-primary-400 hover:text-primary-300 hover:bg-white/5 px-4"
                                            leftIcon={<Download size={16} />}
                                            onClick={() => entityType && downloadTemplate(entityType)}
                                            disabled={!entityType}
                                        >
                                            GET CSV TEMPLATE
                                        </Button>
                                    </div>

                                    <Button
                                        variant="primary"
                                        size="lg"
                                        className="px-14 h-18 rounded-[24px] shadow-2xl shadow-primary-500/30 bg-white text-surface-950 hover:bg-surface-50 text-xl font-black uppercase tracking-widest border-none"
                                        rightIcon={<ArrowRight size={24} />}
                                        onClick={() => setStep(2)}
                                        disabled={!entityType}
                                    >
                                        Proceed
                                    </Button>
                                </motion.div>
                            </motion.div>
                        </GlassCard>
                    </motion.div>
                ) : step === 2 ? (
                    <motion.div key="step2" variants={slideVariants} initial="enter" animate="center" exit="exit">
                        <GlassCard>
                            <h3 className="text-xs font-black text-surface-400 uppercase tracking-[0.2em] mb-10 text-center">
                                Phase 02 — Data Ingestion
                            </h3>
                            <div className="relative group">
                                <input
                                    type="file"
                                    accept=".csv,.xlsx,.xls"
                                    onChange={handleFileUpload}
                                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                                />
                                <div className={cn(
                                    "border-3 border-dashed rounded-[2rem] p-20 flex flex-col items-center justify-center transition-all duration-500",
                                    file
                                        ? "border-emerald-400 bg-emerald-50/10"
                                        : "border-surface-200 bg-surface-50/50 group-hover:border-primary-400 group-hover:bg-primary-50/10"
                                )}>
                                    <motion.div
                                        animate={file ? { scale: [1, 1.1, 1] } : {}}
                                        className={cn(
                                            "w-24 h-24 rounded-3xl flex items-center justify-center mb-6 shadow-2xl transition-transform duration-500 group-hover:scale-110",
                                            file ? "bg-emerald-500 text-white" : "bg-white text-surface-400"
                                        )}
                                    >
                                        {file ? <FileSpreadsheet size={40} /> : <Upload size={40} />}
                                    </motion.div>
                                    <p className="text-xl font-black text-surface-900 tracking-tight">
                                        {file ? file.name : "Drop your business sheet here"}
                                    </p>
                                    <p className="text-sm text-surface-500 font-medium mt-2">
                                        Max size: 50MB. Formats: .xlsx, .csv
                                    </p>
                                </div>
                            </div>
                            <div className="flex justify-between mt-10">
                                <Button
                                    variant="ghost"
                                    leftIcon={<ArrowLeft size={16} />}
                                    onClick={() => setStep(1)}
                                    className="rounded-xl"
                                >
                                    Back
                                </Button>
                            </div>
                        </GlassCard>
                    </motion.div>
                ) : step === 3 ? (
                    <motion.div key="step3" variants={slideVariants} initial="enter" animate="center" exit="exit">
                        <GlassCard>
                            <h3 className="text-xs font-black text-surface-400 uppercase tracking-[0.2em] mb-10 text-center">
                                Phase 03 — Intelligence Mapping
                            </h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                <motion.div
                                    variants={staggerContainer}
                                    initial="initial"
                                    animate="animate"
                                    className="space-y-6"
                                >
                                    <motion.div variants={staggerItem} className="p-5 bg-primary-500/10 rounded-3xl border border-primary-500/20 flex items-center gap-4 mb-6 backdrop-blur-xl">
                                        <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/40">
                                            <Sparkles size={20} className="text-white fill-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-white uppercase tracking-widest">Auto-Mapping Active</p>
                                            <p className="text-sm text-white/60 font-medium">
                                                Detected <span className="text-primary-400 font-bold">
                                                    {mappings.filter(m => m.targetField).length} intelligent matches
                                                </span> in your sheet.
                                            </p>
                                        </div>
                                    </motion.div>

                                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-3 custom-scrollbar">
                                        {mappings.map((mapping, idx) => (
                                            <motion.div
                                                variants={staggerItem}
                                                key={`${mapping.sourceColumn}-${idx}`}
                                                className="flex items-center gap-6 p-5 bg-white/[0.03] rounded-[24px] border border-white/10 hover:border-white/30 hover:bg-white/[0.06] transition-all duration-300 shadow-xl"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1.5 font-mono">Input Header</p>
                                                    <p className="text-base font-black text-white truncate">{mapping.sourceColumn}</p>
                                                </div>

                                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                                                    <ArrowRight size={14} className="text-white/20" />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <p className="text-[10px] font-black text-primary-400 uppercase tracking-[0.2em] font-mono">IBMS Target</p>
                                                        {mapping.entityGroup && (
                                                            <span className={cn(
                                                                "text-[9px] font-black uppercase px-2 py-0.5 rounded-full border",
                                                                mapping.entityGroup === 'client' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                                                                    mapping.entityGroup === 'policy' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                                                        "bg-purple-500/10 text-purple-400 border-purple-500/20"
                                                            )}>
                                                                {mapping.entityGroup}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <CustomSelect
                                                        options={[
                                                            { label: '— Skip Column —', value: '' },
                                                            ...getFieldsForEntity(entityType!).map(f => ({
                                                                label: (f as { group?: string }).group ? `[${String((f as { group?: string }).group).toUpperCase()}] ${f.label}` : f.label,
                                                                value: f.key
                                                            }))
                                                        ]}
                                                        value={mapping.targetField}
                                                        onChange={(v) => {
                                                            const newMappings = [...mappings];
                                                            const field = getFieldsForEntity(entityType!).find(f => f.key === v);
                                                            newMappings[idx].targetField = String(v);
                                                            newMappings[idx].entityGroup = (field as { group?: 'client' | 'policy' | 'asset' | 'claim' | 'lead' })?.group;
                                                            setMappings(newMappings);
                                                        }}
                                                    />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                                <div className="space-y-8">
                                    <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-4 font-mono">Live Transformation Stream</h4>
                                    <div className="rounded-[32px] border border-white/10 bg-black/20 overflow-hidden shadow-2xl backdrop-blur-2xl ring-1 ring-white/10">
                                        <div className="p-5 bg-white/[0.02] border-b border-white/10 flex items-center justify-between">
                                            <div className="flex gap-2">
                                                <div className="w-3 h-3 rounded-full bg-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.3)]" />
                                                <div className="w-3 h-3 rounded-full bg-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.3)]" />
                                                <div className="w-3 h-3 rounded-full bg-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                                            </div>
                                            <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] font-mono">IBMS_INGEST_V4_STABLE</div>
                                        </div>
                                        <div className="overflow-x-auto max-h-[350px] custom-scrollbar">
                                            <table className="w-full text-[11px]">
                                                <thead className="bg-white/[0.03] sticky top-0 backdrop-blur-md">
                                                    <tr>
                                                        {columns.slice(0, 4).map(col => (
                                                            <th key={col} className="px-6 py-5 text-left font-black text-white/40 uppercase tracking-widest border-b border-white/5">{col}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/[0.03]">
                                                    {parsedData.slice(1, 15).map((row, i) => (
                                                        <tr key={i} className="hover:bg-white/[0.03] transition-colors group">
                                                            {row.slice(0, 4).map((cell, j) => (
                                                                <td key={j} className="px-6 py-4 font-medium text-white/80 whitespace-nowrap max-w-[150px] truncate group-hover:text-white transition-colors">{cell}</td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="p-6 bg-gradient-to-br from-surface-900 to-surface-800 rounded-3xl text-white shadow-2xl">
                                        <div className="flex items-center justify-between mb-4">
                                            <p className="text-xs font-black tracking-widest text-surface-400 uppercase">Analysis Ready</p>
                                            <CheckCircle2 size={16} className="text-primary-400" />
                                        </div>
                                        <p className="text-xl font-bold leading-tight">Proceed to final verification and system commit.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between mt-12">
                                <Button variant="ghost" className="rounded-xl" leftIcon={<ArrowLeft size={16} />} onClick={() => setStep(2)}>Back</Button>
                                <Button variant="primary" size="lg" className="rounded-2xl px-12 font-black shadow-xl shadow-primary-500/30" rightIcon={<ArrowRight size={18} />} onClick={() => { setStep(4); runValidation(); }}>Finalize Batch</Button>
                            </div>
                        </GlassCard>
                    </motion.div>
                ) : (
                    <motion.div key="step4" variants={slideVariants} initial="enter" animate="center" exit="exit">
                        <GlassCard>
                            <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.4em] mb-12 text-center">
                                Final Phase — System Commit
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                                <motion.div variants={staggerItem} whileHover={{ y: -5 }} className="p-10 rounded-[40px] bg-emerald-500/10 border border-emerald-500/20 text-center backdrop-blur-3xl ring-1 ring-emerald-500/20 shadow-2xl">
                                    <div className="w-16 h-16 bg-emerald-500 text-white rounded-[24px] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/30">
                                        <CheckCircle2 size={32} />
                                    </div>
                                    <p className="text-5xl font-black text-white mb-2 tracking-tighter" style={{ textShadow: '0 0 30px rgba(16, 185, 129, 0.4)' }}>{validRowCount}</p>
                                    <p className="text-xs font-black tracking-[0.3em] uppercase text-emerald-400">Secure Records</p>
                                </motion.div>

                                <motion.div variants={staggerItem} whileHover={{ y: -5 }} className="p-10 rounded-[40px] bg-amber-500/10 border border-amber-500/20 text-center backdrop-blur-3xl ring-1 ring-amber-500/20 shadow-2xl">
                                    <div className="w-16 h-16 bg-amber-500 text-white rounded-[24px] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-500/30">
                                        <RotateCcw size={32} />
                                    </div>
                                    <p className="text-5xl font-black text-white mb-2 tracking-tighter" style={{ textShadow: '0 0 30px rgba(245, 158, 11, 0.4)' }}>{duplicateCount}</p>
                                    <p className="text-xs font-black tracking-[0.3em] uppercase text-amber-400">Duplicates</p>
                                </motion.div>

                                <motion.div variants={staggerItem} whileHover={{ y: -5 }} className="p-10 rounded-[40px] bg-rose-500/10 border border-rose-500/20 text-center backdrop-blur-3xl ring-1 ring-rose-500/20 shadow-2xl">
                                    <div className="w-16 h-16 bg-rose-500 text-white rounded-[24px] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-rose-500/30">
                                        <XCircle size={32} />
                                    </div>
                                    <p className="text-5xl font-black text-white mb-2 tracking-tighter" style={{ textShadow: '0 0 30px rgba(244, 63, 94, 0.4)' }}>{validationErrors.length}</p>
                                    <p className="text-xs font-black tracking-[0.3em] uppercase text-rose-400">Integrity Errors</p>
                                </motion.div>
                            </div>

                            {validationErrors.length > 0 && (
                                <div className="mb-10 animate-fade-in">
                                    <div className="flex items-center justify-between mb-4 px-2">
                                        <div className="flex items-center gap-2">
                                            <AlertCircle size={14} className="text-rose-500" />
                                            <h4 className="text-[10px] font-black text-surface-500 uppercase tracking-widest">Conflicts Detected</h4>
                                        </div>
                                        <Button variant="ghost" size="sm" className="text-rose-600 font-bold" leftIcon={<Download size={12} />}>Audit Faulty Records</Button>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                                        {validationErrors.slice(0, 8).map((err, i) => (
                                            <div key={i} className="p-4 bg-rose-50/50 border border-rose-100 rounded-2xl text-[11px] font-medium text-rose-900 flex items-center gap-3">
                                                <div className="w-6 h-6 rounded-full bg-rose-200/50 flex items-center justify-center shrink-0">!</div>
                                                <p className="truncate">Row {err.row}: <span className="font-black text-rose-600 underline decoration-rose-200">{err.column}</span> is {err.message}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between items-center bg-gradient-to-r from-primary-600 to-indigo-600 p-12 rounded-[40px] text-white shadow-2xl shadow-primary-500/20 overflow-hidden relative border border-white/20">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="absolute -right-20 -bottom-20 opacity-10 blur-xl"
                                >
                                    <Sparkles size={300} />
                                </motion.div>
                                <div className="relative z-10 space-y-2">
                                    <p className="text-4xl font-black tracking-tighter mb-2" style={{ textShadow: '0 0 40px rgba(255,255,255,0.3)' }}>Begin Final Integration</p>
                                    <p className="text-lg font-medium opacity-70 max-w-[450px]">Committing verified structures to the mission-critical database layer.</p>
                                </div>
                                <Button
                                    onClick={handleImport}
                                    disabled={validRowCount === 0 || isImporting}
                                    className="relative z-10 bg-white text-surface-950 hover:bg-surface-50 h-20 px-14 rounded-[28px] text-2xl font-black shadow-2xl transition-all hover:scale-105 hover:shadow-white/20 active:scale-95 uppercase tracking-widest border-none"
                                >
                                    {isImporting ? (
                                        <div className="flex items-center gap-3">
                                            <Loader2 className="animate-spin" size={24} />
                                            <span>INGESTING...</span>
                                        </div>
                                    ) : (
                                        "START"
                                    )}
                                </Button>
                            </div>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0,0,0,0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(0,0,0,0.1);
                }
            `}</style>
        </div>
    );
}
