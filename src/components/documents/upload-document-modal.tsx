'use client';

import { useState, useCallback, useRef } from 'react';
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
    File,
    Image as ImageIcon,
    AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface UploadDocumentModalProps {
    isOpen: boolean;
    onClose: () => void;
    /** Pre-set the reference ID (e.g. policy number or claim ID) */
    defaultReferenceId?: string;
    /** Pre-set the category */
    defaultCategory?: string;
}

interface QueuedFile {
    file: File;
    id: string;
    progress: number;
    status: 'pending' | 'uploading' | 'done' | 'error';
}

const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const MAX_SIZE_MB = 25;

function formatBytes(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function getFileIcon(type: string) {
    if (type.includes('pdf')) return <FileText size={18} className="text-danger-500" />;
    if (type.includes('image')) return <ImageIcon size={18} className="text-primary-500" />;
    return <File size={18} className="text-surface-400" />;
}

export function UploadDocumentModal({
    isOpen,
    onClose,
    defaultReferenceId = '',
    defaultCategory = 'kyc',
}: UploadDocumentModalProps) {
    const [files, setFiles] = useState<QueuedFile[]>([]);
    const [category, setCategory] = useState(defaultCategory);
    const [referenceId, setReferenceId] = useState(defaultReferenceId);
    const [description, setDescription] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const validateFile = useCallback((file: File): string | null => {
        if (!ALLOWED_TYPES.includes(file.type)) return `${file.name}: Unsupported format. PDF, JPG, PNG, DOC accepted.`;
        if (file.size > MAX_SIZE_MB * 1024 * 1024) return `${file.name}: Exceeds ${MAX_SIZE_MB}MB limit.`;
        return null;
    }, []);

    const addFiles = useCallback((incoming: FileList | File[]) => {
        const newFiles: QueuedFile[] = [];
        for (const f of Array.from(incoming)) {
            const err = validateFile(f);
            if (err) {
                toast.error('File Rejected', { description: err });
                continue;
            }
            // Skip duplicates
            if (files.some((q) => q.file.name === f.name && q.file.size === f.size)) continue;
            newFiles.push({ file: f, id: `${f.name}-${Date.now()}`, progress: 0, status: 'pending' });
        }
        if (newFiles.length > 0) setFiles((prev) => [...prev, ...newFiles]);
    }, [files, validateFile]);

    const removeFile = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));

    // Drag & Drop handlers
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files);
    }, [addFiles]);

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (files.length === 0) {
            toast.error('No Files', { description: 'Please add at least one file to upload.' });
            return;
        }
        setIsUploading(true);

        // Simulate individual file upload with progress
        for (let i = 0; i < files.length; i++) {
            const f = files[i];
            if (f.status === 'done') continue;
            setFiles((prev) => prev.map((q) => q.id === f.id ? { ...q, status: 'uploading' } : q));

            // Simulate progress in steps
            for (let p = 20; p <= 100; p += 20) {
                await new Promise((r) => setTimeout(r, 250));
                setFiles((prev) => prev.map((q) => q.id === f.id ? { ...q, progress: p } : q));
            }
            setFiles((prev) => prev.map((q) => q.id === f.id ? { ...q, status: 'done', progress: 100 } : q));
        }

        toast.success('Upload Complete', {
            description: `${files.length} file${files.length > 1 ? 's' : ''} uploaded successfully.`,
            icon: <CheckCircle2 className="text-success-500" size={18} />,
        });

        // Reset after short delay
        setTimeout(() => {
            setFiles([]);
            setReferenceId('');
            setDescription('');
            setIsUploading(false);
            onClose();
        }, 600);
    };

    const handleClose = () => {
        if (!isUploading) {
            setFiles([]);
            setReferenceId(defaultReferenceId);
            setDescription('');
            setCategory(defaultCategory);
            onClose();
        }
    };

    const pendingCount = files.filter((f) => f.status !== 'done').length;

    const footer = (
        <div className="flex justify-between items-center w-full">
            <span className="text-xs text-surface-400">
                {files.length > 0 ? `${files.length} file${files.length > 1 ? 's' : ''} selected` : 'No files selected'}
            </span>
            <div className="flex gap-3">
                <Button variant="outline" onClick={handleClose} disabled={isUploading}>
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={files.length === 0 || isUploading}
                    leftIcon={isUploading ? undefined : <Upload size={14} />}
                >
                    {isUploading ? `Uploading${pendingCount > 0 ? ` (${pendingCount})` : ''}...` : 'Upload Files'}
                </Button>
            </div>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Upload Document"
            description="Securely store KYC, Policy, or Claim documents."
            size="xl"
            footer={footer}
        >
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Drag & Drop Zone */}
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                    className={cn(
                        'border-2 border-dashed rounded-[var(--radius-xl)] p-8 flex flex-col items-center justify-center transition-all cursor-pointer relative group',
                        isDragging
                            ? 'border-primary-500 bg-primary-50/50 scale-[1.01]'
                            : 'border-surface-200 bg-white/30 hover:bg-white/50 hover:border-primary-300'
                    )}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        multiple
                        onChange={(e) => {
                            if (e.target.files) addFiles(e.target.files);
                            e.target.value = '';
                        }}
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        className="hidden"
                    />
                    <div className={cn(
                        'w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300',
                        isDragging
                            ? 'bg-primary-100 text-primary-600 scale-110'
                            : 'bg-surface-100 text-surface-400 group-hover:scale-110'
                    )}>
                        <Upload size={32} />
                    </div>
                    <p className="text-base font-bold text-surface-700">
                        {isDragging ? 'Drop files here' : 'Click to browse or drag files here'}
                    </p>
                    <p className="text-sm text-surface-400 mt-1">PDF, JPG, PNG, DOC up to {MAX_SIZE_MB}MB each</p>
                </div>

                {/* File Queue */}
                {files.length > 0 && (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {files.map((qf) => (
                            <div
                                key={qf.id}
                                className={cn(
                                    'flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all',
                                    qf.status === 'done'
                                        ? 'bg-success-50/50 border-success-200'
                                        : qf.status === 'error'
                                            ? 'bg-danger-50/50 border-danger-200'
                                            : 'bg-surface-50/50 border-surface-200'
                                )}
                            >
                                {getFileIcon(qf.file.type)}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-surface-900 truncate">{qf.file.name}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[10px] text-surface-400">{formatBytes(qf.file.size)}</span>
                                        {qf.status === 'uploading' && (
                                            <div className="flex-1 h-1.5 bg-surface-200 rounded-full overflow-hidden max-w-[120px]">
                                                <div
                                                    className="h-full bg-primary-500 rounded-full transition-all duration-300"
                                                    style={{ width: `${qf.progress}%` }}
                                                />
                                            </div>
                                        )}
                                        {qf.status === 'done' && (
                                            <span className="text-[10px] text-success-600 font-bold flex items-center gap-0.5">
                                                <CheckCircle2 size={10} /> Uploaded
                                            </span>
                                        )}
                                        {qf.status === 'error' && (
                                            <span className="text-[10px] text-danger-600 font-bold flex items-center gap-0.5">
                                                <AlertCircle size={10} /> Failed
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {qf.status === 'pending' && (
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); removeFile(qf.id); }}
                                        className="p-1 rounded-full hover:bg-surface-200 text-surface-400 hover:text-surface-600 transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}

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
                            placeholder={category === 'kyc' ? 'e.g. Client Name or ID' : 'e.g. Policy # or Claim #'}
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
