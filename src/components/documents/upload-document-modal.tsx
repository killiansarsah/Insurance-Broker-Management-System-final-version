'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { CustomSelect } from '@/components/ui/select-custom';
import {
    Upload,
    FileText,
    X,
    CheckCircle2,
    Users,
    Shield,
    File
} from 'lucide-react';
import { toast } from 'sonner';

interface UploadDocumentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function UploadDocumentModal({ isOpen, onClose }: UploadDocumentModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [category, setCategory] = useState('kyc');
    const [referenceId, setReferenceId] = useState('');
    const [description, setDescription] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) {
            toast.error('File Required', { description: 'Please select a file to upload.' });
            return;
        }

        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        toast.success('Document Uploaded', {
            description: `${file.name} has been securely stored.`,
            icon: <CheckCircle2 className="text-success-500" size={18} />
        });

        // Reset
        setFile(null);
        setReferenceId('');
        setDescription('');
        setIsLoading(false);
        onClose();
    };

    const footer = (
        <div className="flex justify-center gap-3 w-full">
            <button
                type="button"
                onClick={onClose}
                className="py-3 px-8 rounded-[var(--radius-2xl)] bg-surface-100 text-surface-700 font-bold hover:bg-surface-200 transition-all active:scale-95 cursor-pointer text-sm"
            >
                Cancel
            </button>
            <button
                onClick={handleSubmit}
                type="button"
                className="py-3 px-12 rounded-[var(--radius-2xl)] bg-primary-600 text-white font-bold hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20 active:scale-95 cursor-pointer text-sm"
            >
                Upload File
            </button>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Upload Document"
            description="Securely store KYC, Policy, or Claim documents."
            size="xl"
            footer={footer}
            className="overflow-visible"
        >
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* File Drop Zone (Visual) */}
                <div className="border-2 border-dashed border-surface-200 rounded-[var(--radius-xl)] p-8 flex flex-col items-center justify-center bg-white/30 hover:bg-white/50 hover:border-primary-300 transition-all cursor-pointer relative group">
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    {file ? (
                        <div className="flex items-center gap-3 text-primary-700 bg-primary-50 px-6 py-3 rounded-full shadow-sm animate-in fade-in zoom-in-95">
                            <FileText size={20} />
                            <span className="font-bold text-sm truncate max-w-[300px]">{file.name}</span>
                            <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); setFile(null); }}
                                className="p-1.5 hover:bg-primary-100 rounded-full transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="w-16 h-16 rounded-full bg-surface-100 flex items-center justify-center text-surface-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                                <Upload size={32} />
                            </div>
                            <p className="text-base font-bold text-surface-700">Click to browse or drag file here</p>
                            <p className="text-sm text-surface-400 mt-1">PDF, JPG, PNG up to 25MB</p>
                        </>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <File size={12} className="text-primary-500" /> Document Category
                        </label>
                        <CustomSelect
                            options={[
                                { label: 'KYC / Identification', value: 'kyc' },
                                { label: 'Policy Document', value: 'policy' },
                                { label: 'Claim Evidence', value: 'claims' },
                                { label: 'Financial / Receipt', value: 'financial' },
                                { label: 'Legal / Compliance', value: 'legal' },
                            ]}
                            value={category}
                            onChange={(v) => setCategory(v as string)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            {category === 'kyc' ? <Users size={12} className="text-primary-500" /> : <Shield size={12} className="text-primary-500" />}
                            Related Reference ID
                        </label>
                        <input
                            type="text"
                            value={referenceId}
                            onChange={(e) => setReferenceId(e.target.value)}
                            placeholder={category === 'kyc' ? "e.g. Client Name or ID" : "e.g. Policy # or Claim #"}
                            className="w-full px-4 py-3.5 rounded-[var(--radius-lg)] border border-surface-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-semibold text-surface-900 shadow-sm placeholder:text-surface-400 bg-white/50"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <FileText size={12} className="text-surface-400" /> Description (Optional)
                    </label>
                    <textarea
                        rows={2}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Briefly describe the file contents for faster retrieval..."
                        className="w-full px-4 py-3.5 rounded-[var(--radius-lg)] border border-surface-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-medium text-surface-700 bg-white/50 shadow-sm placeholder:text-surface-400 resize-none"
                    />
                </div>
            </form>
        </Modal>
    );
}
