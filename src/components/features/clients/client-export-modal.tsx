'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CustomSelect } from '@/components/ui/select-custom';
import { FileSpreadsheet, FileText, Download, Filter } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

interface ClientExportModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeFilters: Record<string, any>;
  totalClients: number;
  filteredCount: number;
}

export function ClientExportModal({
  isOpen,
  setIsOpen,
  activeFilters,
  totalClients,
  filteredCount,
}: ClientExportModalProps) {
  const [exportType, setExportType] = useState('FULL');
  const [format] = useState('XLSX');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // If filtered is selected, we use filteredCount, or if date ranges are provided, we estimate or just say "Matches within date range"
  let displayCount = exportType === 'FILTERED' ? filteredCount : totalClients;
  if (startDate || endDate) {
    displayCount = -1; // Unknown until server computes unless we filter locally, but backend will handle it
  }

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const payload: any = {
        exportType,
        format,
        filters: {}
      };

      if (exportType === 'FILTERED') {
        payload.filters = { ...activeFilters };
      }

      if (startDate) payload.filters.startDate = startDate;
      if (endDate) payload.filters.endDate = endDate;

      // Make API call. We expect a blob download.
      // Since apiClient typically expects JSON, we might need a custom fetch for blobs, or apiClient supports it?
      // Wait, apiClient.post might expect JSON. Let's use direct fetch for blob download with auth via apiClient's token if needed, or we just rely on cookies.
      // Let's use fetch directly with the apiClient's interceptor logic, or we can just send standard fetch if there's no auth header needed (cookies).
      // Actually, let's look at how API client is built. But we can just use standard fetch since we know the endpoint /api/proxy/clients/export
      
      const token = apiClient.getAccessToken();
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? `http://${window.location.hostname}:3001/api/v1` : 'http://localhost:3001/api/v1');
      
      const response = await fetch(`${baseUrl}/clients/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'clients_export.xlsx';
      if (contentDisposition && contentDisposition.includes('filename="')) {
         filename = contentDisposition.split('filename="')[1].split('"')[0];
      }

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Export completed successfully');
      setIsOpen(false);
    } catch (error: any) {
      toast.error('Failed to export clients: ' + error.message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-xl top-[5%] translate-y-0 max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 shadow-2xl border-surface-200">
        <DialogHeader>
          <DialogTitle>Export Clients</DialogTitle>
          <DialogDescription>
            Configure your export options below. The generated file will include data based on your selections.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-surface-900">Export Type</h4>
            <div className="space-y-2">
              {[
                { id: 'FULL', label: 'Full Export', desc: 'All client fields including KYC, banking, and policies' },
                { id: 'BASIC', label: 'Basic Export', desc: 'Core contact info, status, and registration date' },
                { id: 'KYC', label: 'KYC Compliance Export', desc: 'Risk levels, PEP status, and verification dates' },
                { id: 'FINANCE', label: 'Finance Export', desc: 'Bank accounts, MoMo numbers, and branch info' },
                { id: 'FILTERED', label: 'Filtered Export', desc: 'Export exactly what is currently filtered on screen' },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    exportType === opt.id ? 'border-primary-500 bg-primary-50/50' : 'border-surface-200 hover:bg-surface-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="exportType"
                    value={opt.id}
                    checked={exportType === opt.id}
                    onChange={(e) => setExportType(e.target.value)}
                    className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-surface-300"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-surface-900">{opt.label}</span>
                    <span className="text-xs text-surface-500">{opt.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>



          <div className="space-y-3">
            <h4 className="text-sm font-medium text-surface-900 flex items-center gap-2">
              <Filter size={14} className="text-surface-400" />
              Date Range (Optional)
            </h4>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <input
                  type="date"
                  className="w-full text-sm border-surface-200 rounded-md focus:ring-primary-500 focus:border-primary-500 h-9"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <span className="text-xs text-surface-400 mt-1 block">From</span>
              </div>
              <div className="flex-1">
                <input
                  type="date"
                  className="w-full text-sm border-surface-200 rounded-md focus:ring-primary-500 focus:border-primary-500 h-9"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <span className="text-xs text-surface-400 mt-1 block">To</span>
              </div>
            </div>
          </div>

          <div className="bg-primary-50 text-primary-700 p-3 rounded-md text-sm flex items-center justify-between">
            <span>
              {displayCount === -1
                ? 'Clients will be filtered by the selected date range'
                : `${displayCount} clients will be exported based on current selection`}
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isExporting}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting} className="gap-2">
            {isExporting ? 'Generating...' : 'Download Export'}
            {!isExporting && <Download size={16} />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
