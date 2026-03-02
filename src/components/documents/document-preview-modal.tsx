'use client';

import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import {
    Download,
    ExternalLink,
    FileText,
    Image as ImageIcon,
    Clock,
    User,
    Tag,
    HardDrive,
    History,
} from 'lucide-react';
import { formatDate, cn } from '@/lib/utils';
import type { Document } from '@/types';
import { toast } from 'sonner';

interface DocumentPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    document: Document | null;
}

const categoryLabels: Record<string, string> = {
    kyc: 'KYC / Identification',
    policy: 'Policy Document',
    claim: 'Claim Evidence',
    claims: 'Claim Evidence',
    financial: 'Financial / Receipt',
    legal: 'Legal / Compliance',
};

const categoryColors: Record<string, string> = {
    kyc: 'bg-primary-50 text-primary-700',
    policy: 'bg-accent-50 text-accent-700',
    claim: 'bg-warning-50 text-warning-700',
    claims: 'bg-warning-50 text-warning-700',
    financial: 'bg-success-50 text-success-700',
    legal: 'bg-danger-50 text-danger-700',
};

function formatBytes(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export function DocumentPreviewModal({ isOpen, onClose, document: doc }: DocumentPreviewModalProps) {
    if (!doc) return null;

    const isImage = doc.mimeType.startsWith('image/');
    const isPdf = doc.mimeType.includes('pdf');

    const handleDownload = () => {
        toast.success('Download Started', { description: doc.name });
    };

    const footer = (
        <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-2 text-xs text-surface-400">
                <HardDrive size={12} /> {formatBytes(doc.sizeBytes)}
                <span className="mx-1">·</span>
                <History size={12} /> v{doc.version}
            </div>
            <div className="flex gap-3">
                <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
                <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<Download size={14} />}
                    onClick={handleDownload}
                >
                    Download
                </Button>
            </div>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Document Details"
            size="lg"
            footer={footer}
        >
            <div className="space-y-6">
                {/* Preview Area */}
                <div className="rounded-xl border border-surface-200 bg-surface-50/50 overflow-hidden">
                    {isImage ? (
                        <div className="flex items-center justify-center p-8 bg-[repeating-conic-gradient(#f1f5f9_0%_25%,transparent_0%_50%)] bg-[length:20px_20px]">
                            <div className="max-w-full max-h-[400px] flex items-center justify-center">
                                <div className="w-full max-w-md h-64 bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg flex items-center justify-center">
                                    <ImageIcon size={48} className="text-primary-300" />
                                    <span className="text-primary-500 text-sm font-medium ml-2">Image Preview</span>
                                </div>
                            </div>
                        </div>
                    ) : isPdf ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-4">
                            <div className="w-20 h-24 bg-white dark:bg-slate-800 border border-surface-200 dark:border-slate-700 rounded-lg shadow-sm flex flex-col items-center justify-center">
                                <FileText size={32} className="text-danger-400" />
                                <span className="text-[8px] font-black text-danger-500 uppercase mt-1">PDF</span>
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-semibold text-surface-700">{doc.name}</p>
                                <p className="text-xs text-surface-400 mt-0.5">PDF documents cannot be previewed inline</p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                leftIcon={<ExternalLink size={14} />}
                                onClick={() => toast.info('Would open PDF in new tab')}
                            >
                                Open in New Tab
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 gap-4">
                            <FileText size={48} className="text-surface-300" />
                            <p className="text-sm text-surface-500">Preview not available for this file type</p>
                        </div>
                    )}
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-50/50">
                        <Tag size={16} className="text-surface-400 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Category</p>
                            <span className={cn(
                                'text-xs font-bold px-2 py-0.5 rounded-full inline-block mt-1',
                                categoryColors[doc.category] || 'bg-surface-100 text-surface-600'
                            )}>
                                {categoryLabels[doc.category] || doc.category}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-50/50">
                        <User size={16} className="text-surface-400 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Uploaded By</p>
                            <p className="text-sm font-semibold text-surface-700 mt-0.5">{doc.uploadedByName}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-50/50">
                        <Clock size={16} className="text-surface-400 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Uploaded</p>
                            <p className="text-sm font-semibold text-surface-700 mt-0.5">{formatDate(doc.createdAt)}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-50/50">
                        <History size={16} className="text-surface-400 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Version</p>
                            <p className="text-sm font-semibold text-surface-700 mt-0.5">v{doc.version}</p>
                            {doc.updatedAt !== doc.createdAt && (
                                <p className="text-xs text-surface-400 mt-0.5">Updated {formatDate(doc.updatedAt)}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Expiry Warning */}
                {doc.isExpired && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-danger-50 border border-danger-200">
                        <Clock size={16} className="text-danger-500 shrink-0" />
                        <p className="text-sm text-danger-700 font-medium">
                            This document has expired and may need to be re-uploaded.
                        </p>
                    </div>
                )}
            </div>
        </Modal>
    );
}
