'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Upload, Users, FileText, Shield,
    Download, ArrowRight, ArrowLeft, CheckCircle2,
    AlertCircle, Loader2, Info
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CustomSelect } from '@/components/ui/select-custom';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { ImportEntityType, ImportColumnMapping, ImportValidationError } from '@/types';
import {
    getFieldsForEntity,
    parseFile,
    detectColumns,
    autoMapColumns,
    validateRow,
    detectDuplicates,
    applyMappings,
} from '@/lib/import-utils';

// ============================================================
// Simplified Components
// ============================================================

const StepIndicator = ({ step }: { step: number }) => {
    const steps = ['Select', 'Upload', 'Map', 'Commit'];
    return (
        <div className="flex items-center justify-between mb-6 w-full max-w-xl mx-auto">
            {steps.map((label, i) => {
                const s = i + 1;
                const isActive = step === s;
                const isCompleted = step > s;
                return (
                    <div key={label} className="flex items-center group">
                        <div className="flex flex-col items-center gap-1.5">
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                                isActive ? "bg-primary-600 text-white shadow-lg shadow-primary-500/20 scale-110" :
                                    isCompleted ? "bg-emerald-100 text-emerald-600" : "bg-surface-100 text-surface-400"
                            )}>
                                {isCompleted ? <CheckCircle2 size={14} /> : s}
                            </div>
                            <span className={cn(
                                "text-[9px] font-bold uppercase tracking-widest transition-colors",
                                isActive ? "text-primary-700" : "text-surface-400"
                            )}>{label}</span>
                        </div>
                        {i < steps.length - 1 && (
                            <div className="w-12 h-px bg-surface-200 mx-3 mt-[-18px]" />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

const MinimalistLoader = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center p-20 space-y-6">
        <div className="relative">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 rounded-full border-2 border-surface-200 border-t-primary-600"
            />
        </div>
        <div className="text-center space-y-1">
            <h4 className="text-lg font-bold text-surface-900">{message}</h4>
            <p className="text-sm text-surface-500">Just a moment please...</p>
        </div>
    </div>
);

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

            setIsScanning(true);
            setStep(3);
            setTimeout(() => {
                setIsScanning(false);
            }, 1500);
        } catch {
            toast.error('Could not process the file');
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
        await new Promise(resolve => setTimeout(resolve, 2000));

        const mappedRows = applyMappings(parsedData, mappings);
        const dupes = detectDuplicates(mappedRows, entityType, []);
        const successCount = mappedRows.length - dupes.size - validationErrors.length;

        setImportedCount(successCount);
        setImportComplete(true);
        setIsImporting(false);
        toast.success('Import Successful');
    }, [entityType, parsedData, mappings, validationErrors]);

    return (
        <div className="h-full flex flex-col bg-white">
            <div className="shrink-0 border-b border-surface-100 p-4 md:px-6 flex items-center justify-between bg-surface-50/50">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white border border-surface-200 flex items-center justify-center text-primary-600 shadow-sm">
                        <Upload size={18} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-surface-900 tracking-tight">Import Wizard</h2>
                        <p className="text-[10px] text-surface-500 font-medium tracking-wide">Step-by-step data migration</p>
                    </div>
                </div>
                {step > 1 && !importComplete && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetWizard}
                        className="h-8 text-[10px] font-bold uppercase tracking-widest text-surface-400 hover:text-danger-600"
                    >
                        Restart
                    </Button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar-subtle">
                {!importComplete && <StepIndicator step={step} />}

                <AnimatePresence mode="wait">
                    {importComplete ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-3xl mx-auto text-center py-12"
                        >
                            <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-8">
                                <CheckCircle2 size={40} className="text-emerald-600" />
                            </div>
                            <h3 className="text-3xl font-bold text-surface-900 mb-4">Import Complete</h3>
                            <p className="text-surface-500 mb-10 leading-relaxed">
                                Successfully processed <span className="text-surface-900 font-bold">{importedCount}</span> records.
                                Your database has been synchronized.
                            </p>

                            <Button
                                variant="primary"
                                size="lg"
                                className="w-full h-14 rounded-2xl font-bold"
                                onClick={resetWizard}
                            >
                                Done & Close
                            </Button>
                        </motion.div>
                    ) : isScanning ? (
                        <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <MinimalistLoader message="Analyzing your data..." />
                        </motion.div>
                    ) : step === 1 ? (
                        <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 max-w-5xl mx-auto">
                            <div className="text-center space-y-1">
                                <h3 className="text-2xl font-bold text-surface-900">Select Entity Type</h3>
                                <p className="text-surface-500 text-sm">What type of records are you uploading?</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {[
                                    { id: 'universal', label: 'Universal Data', icon: Users, desc: 'Clients, Policies and relational links.' },
                                    { id: 'clients', label: 'Clients Only', icon: Users, desc: 'Individual client profiles and KYC.' },
                                    { id: 'policies', label: 'Policies', icon: FileText, desc: 'Insurance policy records and terms.' },
                                    { id: 'claims', label: 'Claims', icon: Shield, desc: 'Claim history and payout data.' },
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setEntityType(item.id as ImportEntityType)}
                                        className={cn(
                                            "p-6 rounded-2xl border-2 text-left transition-all duration-200",
                                            entityType === item.id
                                                ? "border-primary-600 bg-primary-50/30"
                                                : "border-surface-100 hover:border-surface-200 bg-white"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
                                            entityType === item.id ? "bg-primary-600 text-white" : "bg-surface-50 text-surface-400"
                                        )}>
                                            <item.icon size={24} />
                                        </div>
                                        <h4 className="font-bold text-surface-900 mb-1">{item.label}</h4>
                                        <p className="text-xs text-surface-500 leading-relaxed font-medium">{item.desc}</p>
                                    </button>
                                ))}
                            </div>

                            <div className="flex justify-center pt-6">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="px-12 h-14 rounded-2xl font-bold"
                                    onClick={() => setStep(2)}
                                    disabled={!entityType}
                                    rightIcon={<ArrowRight size={18} />}
                                >
                                    Continue
                                </Button>
                            </div>
                        </motion.div>
                    ) : step === 2 ? (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 max-w-4xl mx-auto">
                            <div className="text-center space-y-1">
                                <h3 className="text-2xl font-bold text-surface-900">Upload File</h3>
                                <p className="text-surface-500 text-sm">Provide your data in CSV or Excel format.</p>
                            </div>

                            <div className="relative group p-8 md:p-10 border-2 border-dashed border-surface-200 rounded-[2.5rem] bg-surface-50/50 hover:bg-surface-50 hover:border-primary-400 transition-all duration-300 flex flex-col items-center justify-center gap-4 cursor-pointer">
                                <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                                <div className="w-14 h-14 rounded-2xl bg-white border border-surface-200 flex items-center justify-center text-surface-400 shadow-sm group-hover:scale-110 transition-transform">
                                    <Upload size={28} />
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-surface-900 text-sm">
                                        {file ? file.name : "Click to upload or drag & drop"}
                                    </p>
                                    <p className="text-[10px] text-surface-400 mt-0.5 font-medium italic">CSV or Excel (Max 50MB)</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
                                <Info size={20} className="text-blue-600 shrink-0" />
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-blue-900 mb-0.5">Recommended Practice</p>
                                    <p className="text-xs text-blue-700 leading-relaxed">Ensure your columns have header names for better auto-mapping accuracy.</p>
                                </div>
                                <Button variant="ghost" size="sm" className="text-xs font-bold text-blue-700 bg-white border border-blue-200" leftIcon={<Download size={14} />}>Template</Button>
                            </div>

                            <div className="flex justify-between pt-6">
                                <Button variant="ghost" className="rounded-xl font-bold" leftIcon={<ArrowLeft size={16} />} onClick={() => setStep(1)}>Back</Button>
                            </div>
                        </motion.div>
                    ) : step === 3 ? (
                        <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                                <div className="lg:col-span-3 space-y-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-base font-bold text-surface-900">Column Mapping</h3>
                                        <Badge variant="surface" className="text-[9px] uppercase tracking-widest font-black">{columns.length} Columns Found</Badge>
                                    </div>
                                    <div className="space-y-2 max-h-[450px] overflow-y-auto pr-3 custom-scrollbar-subtle">
                                        {mappings.map((mapping, idx) => (
                                            <div key={idx} className="p-4 bg-white border border-surface-100 rounded-2xl flex items-center gap-6 hover:border-primary-200 transition-colors">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-1">Source Column</p>
                                                    <p className="font-bold text-surface-900 truncate">{mapping.sourceColumn}</p>
                                                </div>
                                                <div className="shrink-0 text-surface-300">
                                                    <ArrowRight size={16} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest mb-1">Target Field</p>
                                                    <CustomSelect
                                                        options={[
                                                            { label: 'Skip', value: '' },
                                                            ...getFieldsForEntity(entityType!).map(f => ({ label: f.label, value: f.key }))
                                                        ]}
                                                        value={mapping.targetField}
                                                        onChange={(v) => {
                                                            const newMappings = [...mappings];
                                                            newMappings[idx].targetField = String(v);
                                                            setMappings(newMappings);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="lg:col-span-2 space-y-6">
                                    <h3 className="text-lg font-bold text-surface-900">Data Preview</h3>
                                    <div className="border border-surface-100 rounded-[2rem] overflow-hidden bg-surface-50/50">
                                        <div className="overflow-x-auto max-h-[450px]">
                                            <table className="w-full text-xs">
                                                <thead>
                                                    <tr className="bg-white border-b border-surface-100">
                                                        {columns.slice(0, 3).map(col => (
                                                            <th key={col} className="px-5 py-4 text-left font-bold text-surface-500 uppercase tracking-widest">{col}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-surface-100/50">
                                                    {parsedData.slice(1, 10).map((row, i) => (
                                                        <tr key={i}>
                                                            {row.slice(0, 3).map((cell, j) => (
                                                                <td key={j} className="px-5 py-4 text-surface-600 font-medium truncate max-w-[120px]">{cell}</td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="p-6 bg-surface-900 rounded-[2rem] text-white">
                                        <div className="flex items-center gap-3 mb-3">
                                            <CheckCircle2 size={20} className="text-emerald-400" />
                                            <p className="font-bold">Schema Validated</p>
                                        </div>
                                        <p className="text-xs text-white/60 leading-relaxed font-medium">Your data structure is compatible with the target system. Proceed to the final verification step.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between pt-10 border-t border-surface-100">
                                <Button variant="ghost" className="rounded-xl font-bold" leftIcon={<ArrowLeft size={16} />} onClick={() => setStep(2)}>Back</Button>
                                <Button variant="primary" size="lg" className="rounded-2xl px-12 font-bold shadow-lg shadow-primary-500/20" rightIcon={<ArrowRight size={18} />} onClick={() => { setStep(4); runValidation(); }}>Verify & Commit</Button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 max-w-6xl mx-auto">
                            <div className="text-center space-y-1">
                                <h3 className="text-2xl font-bold text-surface-900">System Commit</h3>
                                <p className="text-surface-500 text-sm">Review your migration batch before final ingestion.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                <Card padding="md" className="text-center border-surface-100 shadow-sm space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-surface-400">Valid Records</p>
                                    <p className="text-4xl font-black text-emerald-600">{validRowCount}</p>
                                    <p className="text-[9px] font-bold text-emerald-600/60 uppercase">Ready to Import</p>
                                </Card>
                                <Card padding="md" className="text-center border-surface-100 shadow-sm space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-surface-400">Duplicates</p>
                                    <p className="text-4xl font-black text-amber-500">{duplicateCount}</p>
                                    <p className="text-[9px] font-bold text-amber-500/60 uppercase">To be Skipped</p>
                                </Card>
                                <Card padding="md" className="text-center border-surface-100 shadow-sm space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-surface-400">Errors</p>
                                    <p className="text-4xl font-black text-danger-500">{validationErrors.length}</p>
                                    <p className="text-[9px] font-bold text-danger-500/60 uppercase">Require Fix</p>
                                </Card>
                            </div>

                            {validationErrors.length > 0 && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle size={12} className="text-danger-500" />
                                        <h4 className="text-[9px] font-black uppercase tracking-widest text-surface-500">Validation Conflicts</h4>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[150px] overflow-y-auto pr-3 custom-scrollbar-subtle">
                                        {validationErrors.map((err, i) => (
                                            <div key={i} className="p-2.5 bg-danger-50/50 border border-danger-100 rounded-xl text-[10px] font-medium text-danger-900 flex items-center gap-2">
                                                <div className="w-4 h-4 rounded-full bg-danger-100 flex items-center justify-center shrink-0">!</div>
                                                <p className="truncate">Row {err.row}: <span className="font-bold underline">{err.column}</span> {err.message}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-between p-8 bg-surface-50 border border-surface-200 rounded-[2.5rem] mt-6">
                                <div className="space-y-0.5">
                                    <h4 className="text-lg font-bold text-surface-900">Authorize Migration</h4>
                                    <p className="text-[10px] text-surface-500 font-medium">Verify you have the authority to commit these records.</p>
                                </div>
                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="h-14 px-10 rounded-2xl font-bold text-base shadow-xl shadow-primary-500/20"
                                    onClick={handleImport}
                                    disabled={validRowCount === 0 || isImporting}
                                >
                                    {isImporting ? (
                                        <div className="flex items-center gap-3">
                                            <Loader2 className="animate-spin" size={20} />
                                            <span>Processing...</span>
                                        </div>
                                    ) : (
                                        "Start Integration"
                                    )}
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function Badge({ children, className, variant = "primary" }: { children: React.ReactNode; className?: string; variant?: "primary" | "surface" }) {
    return (
        <span className={cn(
            "px-2 py-0.5 rounded-full text-[10px] font-bold border",
            variant === "primary" ? "bg-primary-50 text-primary-600 border-primary-200" : "bg-surface-100 text-surface-600 border-surface-200",
            className
        )}>
            {children}
        </span>
    );
}
