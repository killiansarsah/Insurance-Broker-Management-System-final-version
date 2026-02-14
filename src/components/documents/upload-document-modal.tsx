'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
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
        <div className="flex gap-3 w-full">
            <Button variant="ghost" className="flex-1" onClick={onClose} disabled={isLoading}>
                Cancel
            </Button>
            <Button
                variant="primary"
                className="flex-[2]"
                onClick={handleSubmit}
                isLoading={isLoading}
                leftIcon={<Upload size={18} />}
            >
                Upload File
            </Button>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Upload Document"
            description="Securely store KYC, Policy, or Claim documents."
            size="md"
            footer={footer}
            className="min-w-[400px]"
        >
            <form onSubmit={handleSubmit} className="space-y-5">

                {/* File Drop Zone (Visual) */}
                <div className="border-2 border-dashed border-surface-200 rounded-[var(--radius-lg)] p-6 flex flex-col items-center justify-center bg-surface-50/50 hover:bg-surface-50 hover:border-primary-300 transition-all cursor-pointer relative">
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {file ? (
                        <div className="flex items-center gap-3 text-primary-700 bg-primary-50 px-4 py-2 rounded-full">
                            <FileText size={18} />
                            <span className="font-bold text-sm truncate max-w-[200px]">{file.name}</span>
                            <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); setFile(null); }}
                                className="p-1 hover:bg-primary-100 rounded-full"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="w-12 h-12 rounded-full bg-surface-100 flex items-center justify-center text-surface-400 mb-3">
                                <Upload size={24} />
                            </div>
                            <p className="text-sm font-bold text-surface-700">Click to browse or drag file here</p>
                            <p className="text-xs text-surface-400 mt-1">PDF, JPG, PNG up to 25MB</p>
                        </>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-surface-500 uppercase tracking-wider flex items-center gap-2">
                            <File size={12} /> Document Category
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-[var(--radius-md)] border border-surface-200 focus:border-primary-500 outline-none transition-all font-medium text-sm bg-white"
                        >
                            <option value="kyc">KYC / Identification</option>
                            <option value="policy">Policy Document</option>
                            <option value="claims">Claim Evidence</option>
                            <option value="financial">Financial / Receipt</option>
                            <option value="legal">Legal / Compliance</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-surface-500 uppercase tracking-wider flex items-center gap-2">
                            {category === 'kyc' ? <Users size={12} /> : <Shield size={12} />}
                            Related ID (Client/Policy/Claim)
                        </label>
                        <input
                            type="text"
                            value={referenceId}
                            onChange={(e) => setReferenceId(e.target.value)}
                            placeholder={category === 'kyc' ? "e.g. Client Name or ID" : "e.g. Policy # or Claim #"}
                            className="w-full px-3 py-2.5 rounded-[var(--radius-md)] border border-surface-200 focus:border-primary-500 outline-none transition-all font-medium text-sm"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-surface-500 uppercase tracking-wider flex items-center gap-2">
                            <FileText size={12} /> Description (Optional)
                        </label>
                        <textarea
                            rows={2}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Briefly describe the file contents..."
                            className="w-full px-3 py-2.5 rounded-[var(--radius-md)] border border-surface-200 focus:border-primary-500 outline-none transition-all font-medium text-sm resize-none"
                        />
                    </div>
                </div>
            </form>
        </Modal>
    );
}
