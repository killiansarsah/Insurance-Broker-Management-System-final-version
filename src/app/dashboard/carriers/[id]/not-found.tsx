import Link from 'next/link';
import { Building2 } from 'lucide-react';

export default function CarrierNotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="w-20 h-20 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building2 size={36} className="text-surface-400" />
            </div>
            <h1 className="text-2xl font-bold text-surface-900 mb-2">Carrier Not Found</h1>
            <p className="text-surface-500 mb-6 max-w-sm">
                The carrier you&apos;re looking for doesn&apos;t exist or may have been removed.
            </p>
            <Link
                href="/dashboard/carriers"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors"
            >
                Back to Carriers
            </Link>
        </div>
    );
}
