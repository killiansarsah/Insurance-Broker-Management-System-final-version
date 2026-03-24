import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Upload, Users, FileText, Shield,
    Download, ArrowRight, ArrowLeft, CheckCircle2,
    AlertCircle, Loader2, Info, Sparkles, Lock
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { CustomSelect } from '@/components/ui/select-custom';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { apiClient } from '@/lib/api-client';
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
        <div className="relative mb-8 w-full max-w-2xl mx-auto px-4">
            {/* Liquid Trail Background */}
            <div className="absolute top-[1.25rem] left-[2.5rem] right-[2.5rem] h-0.5 bg-surface-100/50 rounded-full" />
            <motion.div
                className="absolute top-[1.25rem] left-[2.5rem] h-0.5 bg-primary-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                initial={false}
                animate={{
                    width: `calc(${(step - 1) / (steps.length - 1) * 100}% - 1rem)`
                }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
            />

            <div className="flex items-center justify-between relative z-10">
                {steps.map((label, i) => {
                    const s = i + 1;
                    const isCompleted = step > s;
                    const isActive = step === s;

                    return (
                        <div key={label} className="flex flex-col items-center gap-2 group">
                            <motion.div
                                initial={false}
                                animate={{
                                    scale: isActive ? 1.15 : 1,
                                    backgroundColor: isCompleted ? "rgb(16, 185, 129)" : isActive ? "rgb(59, 130, 246)" : "rgb(255, 255, 255)",
                                    boxShadow: isActive ? "0 0 20px rgba(59, 130, 246, 0.4)" : "0 0 0px transparent",
                                }}
                                className={cn(
                                    "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors duration-300 relative",
                                    isCompleted ? "border-emerald-500" : isActive ? "border-primary-500" : "border-surface-200"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        className="absolute inset-0 rounded-full border-4 border-primary-400/30"
                                        animate={{ scale: [1, 1.4], opacity: [0.8, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    />
                                )}
                                {isCompleted ? (
                                    <CheckCircle2 size={18} className="text-white" />
                                ) : (
                                    <span className={cn(
                                        "text-xs font-black",
                                        isActive ? "text-white" : "text-surface-400"
                                    )}>{s}</span>
                                )}
                            </motion.div>
                            <span className={cn(
                                "text-[10px] uppercase tracking-[0.2em] font-black transition-all",
                                isCompleted ? "text-emerald-600" : isActive ? "text-primary-600" : "text-surface-400"
                            )}>
                                {label}
                            </span>
                        </div>
                    );
                })}
            </div>
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
    const [jobId, setJobId] = useState<string | null>(null);
    const [sampleRow, setSampleRow] = useState<Record<string, string> | null>(null);

    // AI mapping state
    const [aiMappingStats, setAiMappingStats] = useState<{
        total: number; highConfidence: number; mediumConfidence: number;
        lowConfidence: number; unmapped: number; aiAssisted: boolean;
    } | null>(null);
    const [aiPrivacyNote, setAiPrivacyNote] = useState<string>('');
    const [isDetectingMapping, setIsDetectingMapping] = useState(false);
    const [mappingConfidences, setMappingConfidences] = useState<Record<string, 'high' | 'medium' | 'low'>>({});

    // Import state
    const [isImporting, setIsImporting] = useState(false);
    const [validationErrors, setValidationErrors] = useState<ImportValidationError[]>([]);
    const [duplicateCount, setDuplicateCount] = useState(0);
    const [validRowCount, setValidRowCount] = useState(0);
    const [importComplete, setImportComplete] = useState(false);
    const [importedCount, setImportedCount] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const resetWizard = useCallback(() => {
        setStep(1);
        setEntityType(null);
        setFile(null);
        setParsedData([]);
        setColumns([]);
        setMappings([]);
        setJobId(null);
        setSampleRow(null);
        setValidationErrors([]);
        setDuplicateCount(0);
        setValidRowCount(0);
        setIsScanning(false);
        setImportComplete(false);
        setImportedCount(0);
        setAiMappingStats(null);
        setAiPrivacyNote('');
        setIsDetectingMapping(false);
        setMappingConfidences({});
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile || !entityType) return;

        setFile(selectedFile);
        setIsScanning(true);
        try {
            const dataTypeMap: Record<string, string> = {
                universal: 'all',
                clients: 'clients',
                policies: 'policies',
                claims: 'claims',
            };
            const dataType = dataTypeMap[entityType] || 'clients';

            const result = await apiClient.uploadWithFields<any>(
                '/imports/upload',
                selectedFile,
                { dataType },
            );

            setJobId(result.jobId);
            setColumns(result.headers || []);
            setSampleRow(result.sampleRow || null);
            
            // Use basic mapping as baseline first
            if (result.suggestedMapping && result.suggestedMapping.length > 0) {
               const autoMapped: ImportColumnMapping[] = result.suggestedMapping.map((m: any) => ({
                   sourceColumn: m.source,
                   targetField: m.target,
                   isRequired: false,
               }));
               setMappings(autoMapped);
            } else {
               const autoMapped = autoMapColumns(result.headers || [], entityType);
               setMappings(autoMapped);
            }

            setStep(3);

            // Now call AI detect-mapping in the background
            if (result.jobId) {
                setIsDetectingMapping(true);
                try {
                    const aiResult = await apiClient.post<any>(
                        `/imports/${result.jobId}/detect-mapping`,
                        {}
                    );
                    if (aiResult?.success && aiResult.mappings?.length > 0) {
                        // Map AI snake_case keys to frontend camelCase keys
                        const aiKeyToFrontendKey: Record<string, string> = {
                            first_name: 'firstName', last_name: 'lastName', full_name: 'fullName',
                            middle_name: 'middleName', company_name: 'companyName',
                            date_of_birth: 'dateOfBirth', marital_status: 'maritalStatus',
                            ghana_card_number: 'ghanaCardNumber', passport_number: 'passportNumber',
                            drivers_licence: 'driversLicence', phone_primary: 'PHONE',
                            phone_secondary: 'phoneSecondary', whatsapp_number: 'whatsappNumber',
                            digital_address: 'digitalAddress', residential_address: 'residentialAddress',
                            client_type: 'type', aml_risk: 'amlRiskLevel', source_of_funds: 'sourceOfFunds',
                            purpose_of_relationship: 'purposeOfRelationship',
                            expected_annual_volume: 'expectedAnnualVolume', bank_name: 'bankName',
                            account_name: 'accountName', account_number: 'accountNumber',
                            momo_network: 'momoNetwork', momo_number: 'momoNumber',
                            momo_account_name: 'momoAccountName', assigned_officer: 'assignedOfficer',
                            // Direct matches
                            email: 'EMAIL', gender: 'gender', nationality: 'nationality',
                            region: 'region', city: 'city', occupation: 'occupation',
                            employer: 'employer', industry: 'industry', tin: 'tin',
                            ssnit: 'ssnit', pep: 'pep', status: 'status', notes: 'notes',
                            branch: 'branch',
                        };
                        const convertKey = (key: string): string => aiKeyToFrontendKey[key] || key;

                        // Upgrade mappings with AI results
                        const aiMapped: ImportColumnMapping[] = aiResult.mappings.map((m: any) => ({
                            sourceColumn: m.theirColumn,
                            targetField: m.ourField === 'SKIP' ? '' : convertKey(m.ourField),
                            isRequired: false,
                        }));
                        setMappings(aiMapped);

                        // Store confidence levels
                        const confidences: Record<string, 'high' | 'medium' | 'low'> = {};
                        aiResult.mappings.forEach((m: any) => {
                            confidences[m.theirColumn] = m.confidence || 'low';
                        });
                        setMappingConfidences(confidences);

                        setAiMappingStats(aiResult.stats);
                        setAiPrivacyNote(aiResult.privacyNote || '');
                        toast.success('AI Analysis Complete', { description: `${aiResult.stats?.highConfidence || 0} columns mapped with high confidence` });
                    }
                } catch (aiErr) {
                    // AI failed silently — rule-based mappings are already applied
                    console.warn('AI mapping failed, using rule-based fallback:', aiErr);
                } finally {
                    setIsDetectingMapping(false);
                }
            }
        } catch (err: any) {
            const message = err?.response?.data?.message || err?.message || 'Could not process the file via server';
            toast.error(`Upload Failed: ${message}`);
            setFile(null);
        } finally {
            setIsScanning(false);
        }
    };

    const handleDropzoneClick = () => {
        fileInputRef.current?.click();
    };

    const runValidation = useCallback(async () => {
        if (!jobId || mappings.length === 0) return;
        setIsScanning(true);
        try {
            // Convert array mapping to Record<source, target>
            const mappingObj = mappings.reduce((acc, curr) => {
               if (curr.targetField) acc[curr.sourceColumn] = curr.targetField;
               return acc;
            }, {} as Record<string, string>);

            const result = await apiClient.post<{ success: boolean; summary: any }>(
                `/imports/${jobId}/validate`,
                { mapping: mappingObj }
            );

            setValidationErrors(result.summary?.errors ? Array(result.summary.errors).fill({} as any) : []);
            setValidRowCount(result.summary?.valid || 0);
            setDuplicateCount(0); // Backend returns combined errors
            setStep(4);
        } catch (err: any) {
            toast.error('Validation failed on server');
        } finally {
            setIsScanning(false);
        }
    }, [jobId, mappings]);

    const handleImport = useCallback(async () => {
        if (!jobId) return;
        setIsImporting(true);

        try {
            const result = await apiClient.post<any>(
                `/imports/${jobId}/execute`,
                {}
            );

            const created = result?.result?.created ?? result?.result?.summary?.totalCreated ?? 0;
            const errors = result?.result?.errors?.length ?? result?.result?.summary?.totalErrors ?? 0;

            setImportedCount(created);
            setImportComplete(true);

            if (errors > 0) {
                toast.warning(`Import completed with ${errors} error(s). ${created} records created.`);
            } else {
                toast.success(`Import Successful — ${created} records created.`);
            }
        } catch (err: any) {
            const message = err?.response?.data?.message || err?.message || 'Execution failed';
            toast.error(`Execution Failed: ${message}`);
        } finally {
            setIsImporting(false);
        }
    }, [jobId]);

    return (
        <div className="h-full flex flex-col bg-slate-50 relative overflow-hidden">
            {/* Background Liquid Refraction */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 180, 270, 360],
                        x: [0, 100, 0, -100, 0],
                        y: [0, -50, 50, -50, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-primary-200/40 to-blue-300/20 blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [360, 270, 180, 90, 0],
                        x: [0, -100, 0, 100, 0],
                        y: [0, 50, -50, 50, 0]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-emerald-200/30 to-primary-300/30 blur-[120px]"
                />
            </div>

            <div className="shrink-0 border-b border-surface-100/50 p-4 md:px-8 flex items-center justify-between bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl z-20">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
                        <Upload size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">Execution Stage</h2>
                        <p className="text-[10px] text-slate-500 font-bold tracking-[0.2em] mt-1.5 opacity-60">System Ingestion Protocol</p>
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

            <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar-subtle relative z-10 bg-white/10 dark:bg-slate-900/10 backdrop-blur-sm">
                {!importComplete && <StepIndicator step={step} />}

                <AnimatePresence mode="wait">
                    {importComplete ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="max-w-3xl mx-auto text-center py-16 px-8 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[3rem] border border-white/50 shadow-2xl relative overflow-hidden"
                        >
                            {/* Celebration Burst Background */}
                            <motion.div
                                animate={{ scale: [1, 2, 1], opacity: [0.1, 0.2, 0.1] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute inset-0 bg-gradient-radial from-emerald-400/20 to-transparent"
                            />

                            <div className="relative z-10">
                                <motion.div
                                    initial={{ scale: 0.5, rotate: -45 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", damping: 12 }}
                                    className="w-24 h-24 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/30"
                                >
                                    <CheckCircle2 size={48} />
                                </motion.div>
                                <h3 className="text-4xl font-black text-slate-900 mb-4 uppercase tracking-tight">Mission Accomplished</h3>
                                <p className="text-slate-500 mb-10 leading-relaxed font-bold uppercase tracking-widest text-xs opacity-60">
                                    Successfully processed <span className="text-emerald-600 font-black">{importedCount}</span> entities.
                                    The global system database has been updated.
                                </p>

                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="w-full max-w-sm h-16 rounded-2xl font-black uppercase tracking-[0.3em] shadow-2xl shadow-primary-500/20"
                                    onClick={resetWizard}
                                >
                                    Seal Protocol
                                </Button>
                            </div>
                        </motion.div>
                    ) : isScanning ? (
                        <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <MinimalistLoader message="Analyzing your data..." />
                        </motion.div>
                    ) : step === 1 ? (
                        <motion.div key="step1" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="space-y-6 max-w-6xl mx-auto py-2">
                            <div className="text-center space-y-1">
                                <h3 className="text-2xl font-black text-slate-900 leading-tight uppercase tracking-tight">Select Origin Component</h3>
                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Define the database entity structure</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                            "relative p-5 rounded-2xl border-2 text-left transition-all duration-300 flex items-center gap-5 overflow-hidden group",
                                            entityType === item.id
                                                ? "border-primary-600 bg-white dark:bg-slate-800 shadow-xl shadow-primary-500/10 ring-4 ring-primary-500/5 scale-[1.02]"
                                                : "border-white/50 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md hover:border-primary-300 hover:shadow-lg hover:shadow-primary-500/5"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500",
                                            entityType === item.id
                                                ? "bg-primary-600 text-white rotate-[360deg] shadow-lg shadow-primary-500/30"
                                                : "bg-white dark:bg-slate-800 border border-slate-100 text-slate-400 group-hover:scale-110 group-hover:text-primary-500"
                                        )}>
                                            <item.icon size={28} />
                                        </div>
                                        <div className="relative z-10">
                                            <h4 className="font-black text-slate-900 text-base leading-tight uppercase tracking-tight">{item.label}</h4>
                                            <p className="text-[11px] text-slate-500 font-bold leading-relaxed mt-1 opacity-80">{item.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="flex justify-center pt-2">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="px-16 h-14 rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary-500/30 group"
                                    onClick={() => setStep(2)}
                                    disabled={!entityType}
                                    rightIcon={<motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}><ArrowRight size={20} /></motion.div>}
                                >
                                    Proceed to Ingest
                                </Button>
                            </div>
                        </motion.div>
                    ) : step === 2 ? (
                        <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6 max-w-6xl mx-auto py-4">
                            <div className="text-center space-y-1">
                                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Source Acquisition</h3>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest opacity-60">Upload CSV/Excel binary stream</p>
                            </div>

                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                onClick={handleDropzoneClick}
                                className="relative group p-10 md:p-14 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-white/40 dark:bg-slate-800/40 backdrop-blur-md hover:bg-white dark:hover:bg-slate-800 hover:border-primary-400 transition-all duration-500 flex flex-col items-center justify-center gap-6 cursor-pointer overflow-hidden shadow-inner"
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".csv,.xlsx,.xls"
                                    onChange={handleFileUpload}
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                />
                                <div className="w-20 h-20 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 flex items-center justify-center text-slate-400 shadow-xl shadow-slate-200/50 group-hover:rotate-12 transition-all duration-500">
                                    <Upload size={36} className="group-hover:text-primary-600 transition-colors" />
                                </div>
                                <div className="text-center relative z-10">
                                    <p className="font-black text-slate-900 text-lg uppercase tracking-tight">
                                        {file ? file.name : "Initiate Data Flow"}
                                    </p>
                                    <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-[0.2em]">{file ? "Stream Ready" : "Drag Binary into Frame"}</p>
                                </div>
                            </motion.div>

                            <div className="flex items-center gap-6 p-5 bg-white dark:bg-slate-800 shadow-xl shadow-slate-200/50 border border-slate-100 rounded-3xl group">
                                <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 group-hover:scale-110 transition-transform">
                                    <Info size={24} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-1.5">Migration Intelligence</p>
                                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Auto-mapping works best with header-row formatted spreadsheets.</p>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-10 text-[10px] font-black uppercase tracking-widest text-primary-700 bg-white dark:bg-slate-800 border border-primary-100 hover:bg-primary-50 rounded-xl px-5" 
                                    leftIcon={<Download size={14} />} 
                                    onClick={async () => {
                                        try {
                                            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/imports/template/${entityType || 'clients'}`, {
                                                headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
                                            });
                                            if (!response.ok) throw new Error('Download failed');
                                            const blob = await response.blob();
                                            const url = window.URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                                            a.href = url;
                                            a.download = `${entityType || 'import'}_template.xlsx`;
                                            document.body.appendChild(a);
                                            a.click();
                                            window.URL.revokeObjectURL(url);
                                            document.body.removeChild(a);
                                            toast.success('Template Downloaded', { description: 'Import template (XLSX) has been downloaded.' });
                                        } catch (error) {
                                            toast.error('Failed to download template');
                                        }
                                    }}
                                >
                                    Template
                                </Button>
                            </div>

                            <div className="flex justify-between pt-4">
                                <Button variant="ghost" className="rounded-xl font-bold uppercase tracking-widest text-[10px] text-slate-400 hover:text-slate-900" leftIcon={<ArrowLeft size={16} />} onClick={() => setStep(1)}>Revert Stage</Button>
                            </div>
                        </motion.div>
                    ) : step === 3 ? (
                        <motion.div key="step3" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} className="space-y-6 max-w-7xl mx-auto py-2">
                            {/* Privacy Transparency Card */}
                            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/60 flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                                    <Lock size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-black text-emerald-800 uppercase tracking-widest mb-1">Your client data stays on our servers</p>
                                    <p className="text-[11px] text-emerald-700/80 font-medium leading-relaxed">Our AI analyses only the structure of your file — column names and anonymised examples. Your clients' Ghana Card numbers, names, and bank details are never shared externally.</p>
                                    <p className="text-[10px] text-emerald-600/60 font-bold mt-1.5">Compliant with Ghana Data Protection Act 2012 (Act 843) · NIC Act 1061</p>
                                </div>
                            </div>

                            {/* AI Status Bar */}
                            {(isDetectingMapping || aiMappingStats) && (
                                <div className="p-3 rounded-xl bg-white/60 border border-slate-100 flex items-center gap-3">
                                    {isDetectingMapping ? (
                                        <>
                                            <div className="w-6 h-6 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
                                                <Loader2 size={14} className="animate-spin" />
                                            </div>
                                            <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest">AI is analysing your column structure...</span>
                                        </>
                                    ) : aiMappingStats && (
                                        <>
                                            <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                                <Sparkles size={14} />
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-600">
                                                {aiMappingStats.aiAssisted ? 'AI-assisted mapping' : 'Rule-based mapping'} · <span className="text-emerald-600">{aiMappingStats.highConfidence} high</span> · <span className="text-amber-600">{aiMappingStats.mediumConfidence} medium</span> · <span className="text-red-500">{aiMappingStats.lowConfidence} low</span>
                                            </span>
                                        </>
                                    )}
                                </div>
                            )}

                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                                <div className="lg:col-span-3 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Column Mapping</h3>
                                        <Badge variant="surface" className="text-[10px] uppercase tracking-[0.2em] font-black bg-slate-900 text-white px-3 py-1">{columns.length} Columns Detected</Badge>
                                    </div>
                                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar-subtle">
                                        {mappings.map((mapping, idx) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                key={idx}
                                                className={cn(
                                                    "p-5 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/50 rounded-2xl flex items-center gap-6 hover:shadow-xl hover:shadow-slate-200/40 transition-all border-l-4",
                                                    mappingConfidences[mapping.sourceColumn] === 'high' ? 'border-l-emerald-500' :
                                                    mappingConfidences[mapping.sourceColumn] === 'medium' ? 'border-l-amber-400' :
                                                    mappingConfidences[mapping.sourceColumn] === 'low' ? 'border-l-red-400' : 'border-l-slate-200 hover:border-l-primary-500'
                                                )}
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1.5">
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest opacity-60">Source Column</p>
                                                        {mappingConfidences[mapping.sourceColumn] && (
                                                            <span className={cn(
                                                                "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full",
                                                                mappingConfidences[mapping.sourceColumn] === 'high' ? 'bg-emerald-100 text-emerald-700' :
                                                                mappingConfidences[mapping.sourceColumn] === 'medium' ? 'bg-amber-100 text-amber-700' :
                                                                'bg-red-100 text-red-700'
                                                            )}>
                                                                {mappingConfidences[mapping.sourceColumn]}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="font-black text-slate-900 text-sm truncate">{mapping.sourceColumn}</p>
                                                    {sampleRow && mapping.sourceColumn in sampleRow && (
                                                        <p className="text-[10px] text-slate-500 font-medium truncate mt-1.5 italic overflow-hidden w-full opacity-80" title={sampleRow[mapping.sourceColumn]}>Ex: {sampleRow[mapping.sourceColumn]}</p>
                                                    )}
                                                </div>
                                                <div className="shrink-0 relative">
                                                    <motion.div
                                                        animate={{ x: [0, 10, 0], opacity: [0.3, 1, 0.3] }}
                                                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                                        className="text-primary-500"
                                                    >
                                                        <ArrowRight size={20} />
                                                    </motion.div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[9px] font-black text-primary-600 uppercase tracking-widest mb-1.5">Target Parameter</p>
                                                    <CustomSelect
                                                        options={[
                                                            { label: 'Skip Column', value: '' },
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
                                            </motion.div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between pt-2">
                                        <Button variant="ghost" className="rounded-xl font-bold uppercase tracking-widest text-[10px] text-slate-400 hover:text-slate-900" leftIcon={<ArrowLeft size={16} />} onClick={() => setStep(2)}>Revert Stage</Button>
                                    </div>
                                </div>

                                <div className="lg:col-span-2 space-y-4">
                                    <div className="space-y-4">
                                        <div className="p-6 rounded-[2rem] bg-slate-900 text-white shadow-2xl relative overflow-hidden group">
                                            {/* Dynamic Shimmer for Scan */}
                                            <motion.div
                                                animate={{ x: ['-100%', '200%'] }}
                                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
                                            />
                                            <div className="relative z-10 flex items-center justify-between mb-6">
                                                <h4 className="text-xs font-black uppercase tracking-[0.2em] opacity-60">Integrity Scan</h4>
                                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center animate-pulse">
                                                    <Loader2 size={14} className="animate-spin" />
                                                </div>
                                            </div>
                                            <div className="relative z-10 flex items-end justify-between">
                                                <div>
                                                    <p className="text-4xl font-black tracking-tighter mb-1">{validRowCount}</p>
                                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Valid Objects</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xl font-black text-danger-400 tracking-tighter mb-1">{duplicateCount + validationErrors.length}</p>
                                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Anomalies</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-6 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md rounded-[2rem] border border-white/50 space-y-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
                                                    <Info size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Pre-flight check</p>
                                                    <p className="text-[11px] text-slate-500 font-medium">Validating schema compliance.</p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="primary"
                                                className="w-full h-14 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-primary-500/20"
                                                onClick={() => { setStep(4); runValidation(); }}
                                                disabled={validRowCount === 0}
                                            >
                                                Sync Database
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 ml-1">Data Preview</h3>
                                        <div className="border border-white/50 rounded-[2rem] overflow-hidden bg-white/40 dark:bg-slate-800/40 backdrop-blur-md">
                                            <div className="overflow-x-auto max-h-[250px] custom-scrollbar-subtle">
                                                <table className="w-full text-[10px]">
                                                    <thead>
                                                        <tr className="bg-slate-900/5 border-b border-white/50">
                                                            {columns.slice(0, 3).map(col => (
                                                                <th key={col} className="px-4 py-3 text-left font-black text-slate-500 uppercase tracking-widest opacity-60">{col}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-white/30">
                                                        {parsedData.slice(1, 6).map((row, i) => (
                                                            <tr key={i} className="hover:bg-white/40 dark:hover:bg-slate-800/40 transition-colors">
                                                                {row.slice(0, 3).map((cell, j) => (
                                                                    <td key={j} className="px-4 py-3 text-slate-600 font-bold truncate max-w-[100px]">{cell}</td>
                                                                ))}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>

                                    {validationErrors.length > 0 && (
                                        <div className="p-5 bg-danger-500/10 backdrop-blur-md rounded-[2rem] border border-danger-500/20 space-y-4">
                                            <div className="flex items-center gap-3 text-danger-600">
                                                <AlertCircle size={20} />
                                                <h4 className="text-xs font-black uppercase tracking-widest">Schema Violations</h4>
                                            </div>
                                            <div className="space-y-2 max-h-[120px] overflow-y-auto pr-3 custom-scrollbar-subtle">
                                                {validationErrors.map((err, idx) => (
                                                    <div key={idx} className="p-3 bg-white/40 dark:bg-slate-800/40 rounded-xl text-[10px] leading-tight flex gap-3 border border-danger-500/10">
                                                        <span className="font-black text-danger-700 shrink-0">L{err.row}:</span>
                                                        <span className="text-danger-900/80 font-bold">{err.message}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div key="step4" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} className="space-y-8 max-w-6xl mx-auto py-4">
                            <div className="text-center space-y-1">
                                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">System Deployment</h3>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest opacity-60">Final verification & synchronization</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="p-8 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-[2.5rem] border border-white/50 text-center relative overflow-hidden group"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
                                    <p className="text-5xl font-black text-slate-900 tracking-tighter mb-2">{validRowCount}</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Verified Objects</p>
                                    <div className="mt-6 inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[9px] font-black uppercase tracking-widest">
                                        <CheckCircle2 size={12} /> Sync Ready
                                    </div>
                                </motion.div>

                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="p-8 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-[2.5rem] border border-white/50 text-center relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
                                    <p className="text-5xl font-black text-amber-600 tracking-tighter mb-2">{duplicateCount}</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Duplicates Found</p>
                                    <div className="mt-6 inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[9px] font-black uppercase tracking-widest">
                                        Merging Required
                                    </div>
                                </motion.div>

                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="p-8 bg-slate-900 rounded-[2.5rem] text-center relative overflow-hidden"
                                >
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                                        transition={{ repeat: Infinity, duration: 4 }}
                                        className="absolute inset-0 bg-primary-500 rounded-full blur-3xl opacity-10"
                                    />
                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-4 relative z-10">Integration Path</p>
                                    <div className="relative z-10 space-y-1">
                                        <div className="w-12 h-12 rounded-2xl bg-white/10 mx-auto flex items-center justify-center text-primary-400">
                                            <Shield size={24} />
                                        </div>
                                        <p className="text-base font-black text-white uppercase mt-4">Safe Commit</p>
                                    </div>
                                </motion.div>
                            </div>

                            <div className="flex flex-col items-center gap-6 pt-6">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="w-full max-w-md h-16 rounded-[2rem] font-black uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(59,130,246,0.25)] relative overflow-hidden group"
                                    onClick={handleImport}
                                    isLoading={isImporting}
                                >
                                    <span className="relative z-10">Start Integration</span>
                                    <motion.div
                                        animate={{ x: ['-100%', '200%'] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                                    />
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="rounded-xl font-bold uppercase tracking-widest text-[10px] text-slate-400 hover:text-slate-900"
                                    leftIcon={<ArrowLeft size={16} />}
                                    onClick={() => setStep(3)}
                                >
                                    Revert to Mapping
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
