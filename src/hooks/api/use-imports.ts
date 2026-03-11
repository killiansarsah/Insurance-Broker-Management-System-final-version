'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export type ImportDataType =
  | 'clients'
  | 'policies'
  | 'claims'
  | 'leads'
  | 'invoices'
  | 'commissions'
  | 'all';

export interface ImportResult {
  dataType: string;
  totalRows: number;
  created: number;
  skipped: number;
  errors: Array<{ row: number; field?: string; message: string }>;
}

export interface MixedImportResult {
  summary: {
    totalRows: number;
    totalCreated: number;
    totalSkipped: number;
    totalErrors: number;
  };
  results: ImportResult[];
}

export function useImportFile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      file,
      dataType,
    }: {
      file: File;
      dataType: ImportDataType;
    }) => {
      return apiClient.uploadWithFields<ImportResult | MixedImportResult>(
        '/imports',
        file,
        { dataType },
      );
    },
    onSuccess: () => {
      // Invalidate all data queries so pages refresh with imported data
      qc.invalidateQueries({ queryKey: ['clients'] });
      qc.invalidateQueries({ queryKey: ['policies'] });
      qc.invalidateQueries({ queryKey: ['claims'] });
      qc.invalidateQueries({ queryKey: ['leads'] });
      qc.invalidateQueries({ queryKey: ['invoices'] });
      qc.invalidateQueries({ queryKey: ['commissions'] });
    },
  });
}
