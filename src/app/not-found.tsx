import Link from 'next/link';
import { Search, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <html lang="en">
            <body className="min-h-screen bg-surface-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center space-y-8">
                    {/* Large 404 */}
                    <div>
                        <p className="text-9xl font-black text-primary-100 select-none leading-none">404</p>
                        <div className="-mt-6 space-y-2">
                            <h1 className="text-2xl font-bold text-surface-900">Page not found</h1>
                            <p className="text-surface-500 text-sm">
                                The page you're looking for doesn't exist or has been moved.
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
                        >
                            <Home size={16} />
                            Go to Dashboard
                        </Link>
                        <Link
                            href="/dashboard/clients"
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-surface-200 bg-white text-surface-700 text-sm font-semibold hover:bg-surface-50 transition-colors"
                        >
                            <Search size={16} />
                            Browse Clients
                        </Link>
                    </div>

                    <p className="text-xs text-surface-400">IBMS · Insurance Broking Management System</p>
                </div>
            </body>
        </html>
    );
}
