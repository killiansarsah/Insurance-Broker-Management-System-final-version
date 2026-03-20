'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TerminalSquare, RefreshCcw, Home } from 'lucide-react';

/**
 * Super Admin Error Boundary.
 * Displays a technical-looking dark teal error page when a component deep in the dashboard crashes.
 */
export default function SuperAdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // We could hook this into a telemetry/logging service if needed
    console.error('[Super Admin Error Threshold Reached]', error);
  }, [error]);

  const router = useRouter();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 font-sans text-gray-900 selection:bg-[#5DCAA5]">
      <div className="max-w-xl w-full">
        {/* Terminal-style Error Banner */}
        <div
          className="rounded-sm overflow-hidden"
          style={{
            border: '1px solid #085041',
            backgroundColor: '#021a13',
            boxShadow: '0 20px 40px rgba(2, 26, 19, 0.2)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3"
            style={{ backgroundColor: '#05291e', borderBottom: '1px solid #085041' }}
          >
            <TerminalSquare size={18} className="text-[#b91c1c]" />
            <h1 className="text-sm font-mono font-bold text-[#f0f4f3] uppercase tracking-wider">
              System Exception Encountered
            </h1>
          </div>

          {/* Body */}
          <div className="p-6">
            <p className="text-[#9FE1CB] font-mono text-sm leading-relaxed mb-4">
              A runtime invariant was violated within the Command Centre module. The interface has halted execution to prevent state corruption.
            </p>

            <div
              className="p-3 rounded-sm mb-6 overflow-x-auto text-xs font-mono font-medium"
              style={{ backgroundColor: 'rgba(185, 28, 28, 0.1)', color: '#fee2e2', border: '1px solid rgba(185, 28, 28, 0.3)' }}
            >
              <div className="text-[#b91c1c] mb-1">ERR_MSG:</div>
              {error.message || 'Unknown exception'}
              {error.digest && (
                <div className="mt-2 text-[#b91c1c]">
                  DIGEST_ID: <span className="text-[#fee2e2]">{error.digest}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={reset}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-sm bg-[#1D9E75] text-[#ffffff] text-xs font-bold uppercase tracking-wider hover:bg-[#3BB58D] hover:shadow-[0_0_12px_rgba(29,158,117,0.4)] transition-all sa-btn-hover"
              >
                <RefreshCcw size={14} />
                Reboot Interface
              </button>
              <button
                onClick={() => router.push('/super-admin')}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-sm border border-[#085041] bg-transparent text-[#9FE1CB] text-xs font-bold uppercase tracking-wider hover:bg-[#05291e] transition-colors sa-btn-hover"
              >
                <Home size={14} />
                Return to Overview
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
