'use client';

import { useState } from 'react';
import {
    FileArchive,
    Search,
    Upload,
    Filter,
    Download,
    MoreVertical,
    FileText,
    Image as ImageIcon,
    FileText as PdfIcon,
    Archive
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MOCK_DOCUMENTS } from '@/mock/documents-complaints';
import { formatDate, cn } from '@/lib/utils';
import { UploadDocumentModal } from '@/components/documents/upload-document-modal';
import { CustomSelect } from '@/components/ui/select-custom';
import { toast } from 'sonner';

export default function DocumentsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('all');
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const filteredDocs = MOCK_DOCUMENTS.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = category === 'all' || doc.category === category;
        return matchesSearch && matchesCategory;
    });

    const getIcon = (mimeType: string) => {
        if (mimeType.includes('pdf')) return <PdfIcon className="text-danger-500" size={24} />;
        if (mimeType.includes('image')) return <ImageIcon className="text-primary-500" size={24} />;
        if (mimeType.includes('zip')) return <Archive className="text-accent-500" size={24} />;
        return <FileText className="text-surface-400" size={24} />;
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-surface-900 tracking-tight">Documents</h1>
                    <p className="text-sm text-surface-500 mt-1">Manage KYC, Policy, and Claim-related files.</p>
                </div>
                <Button
                    variant="primary"
                    leftIcon={<Upload size={16} />}
                    onClick={() => setIsUploadModalOpen(true)}
                >
                    Upload New File
                </Button>
            </div>

            <UploadDocumentModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
            />

            {/* Toolbar */}
            <Card padding="md" className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                    <input
                        type="text"
                        placeholder="Search by filename..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <CustomSelect
                        label="Category"
                        options={[
                            { label: 'All Categories', value: 'all' },
                            { label: 'KYC / ID', value: 'kyc' },
                            { label: 'Policy Docs', value: 'policy' },
                            { label: 'Claim Photos', value: 'claims' },
                        ]}
                        value={category}
                        onChange={(v) => setCategory(v as string)}
                        clearable
                    />
                </div>
            </Card>

            {/* Document Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredDocs.map((doc) => (
                    <Card key={doc.id} hover className="group flex flex-col p-4 h-full relative border-surface-200">
                        <div className="flex items-start justify-between">
                            <div className="w-10 h-10 rounded-lg bg-surface-50 flex items-center justify-center p-2 mb-3">
                                {getIcon(doc.mimeType)}
                            </div>
                            <button
                                className="text-surface-400 hover:text-surface-900"
                                onClick={() => toast.info('Document options', { description: `Actions for ${doc.name}` })}
                            >
                                <MoreVertical size={16} />
                            </button>
                        </div>

                        <h3 className="text-sm font-bold text-surface-900 truncate mb-1" title={doc.name}>
                            {doc.name}
                        </h3>
                        <p className="text-[10px] text-surface-500 font-medium uppercase tracking-tight mb-4">
                            {doc.category} • {(doc.sizeBytes / (1024 * 1024)).toFixed(2)} MB
                        </p>

                        <div className="mt-auto pt-3 border-t border-surface-100 flex items-center justify-between">
                            <span className="text-[10px] text-surface-400">{formatDate(doc.createdAt)}</span>
                            <button
                                className="p-1.5 rounded-full hover:bg-surface-50 text-primary-600 transition-colors"
                                onClick={() => toast.success('Download started', { description: doc.name })}
                            >
                                <Download size={16} />
                            </button>
                        </div>
                    </Card>
                ))}
            </div>

            {filteredDocs.length === 0 && (
                <div className="py-20 text-center">
                    <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4 text-surface-400">
                        <FileArchive size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-surface-900">No documents found</h3>
                    <p className="text-sm text-surface-500">Try adjusting your search or filters.</p>
                </div>
            )}
        </div>
    );
}
