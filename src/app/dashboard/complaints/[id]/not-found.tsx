import Link from 'next/link';
import { MessageSquare, ArrowLeft, Search } from 'lucide-react';

export default function ComplaintNotFound() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="max-w-sm w-full text-center space-y-6">
                <div className="mx-auto w-16 h-16 rounded-full bg-surface-100 flex items-center justify-center">
                    <MessageSquare size={28} className="text-surface-400" />
                </div>
                <div className="space-y-1">
                    <h2 className="text-xl font-bold text-surface-900">Complaint not found</h2>
                    <p className="text-sm text-surface-500">This complaint record doesn't exist or may have been removed.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <Link href="/dashboard/complaints" className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors">
                        <ArrowLeft size={14} /> All Complaints
                    </Link>
                    <Link href="/dashboard/results?q=" className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-surface-200 bg-white text-surface-700 text-sm font-semibold hover:bg-surface-50 transition-colors">
                        <Search size={14} /> Search
                    </Link>
                </div>
            </div>
        </div>
    );
}
