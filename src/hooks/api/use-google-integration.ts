'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

// ── Google OAuth ──

export function useGoogleAuthUrl() {
  return useMutation({
    mutationFn: () =>
      apiClient.get<{ url: string }>('/integrations/google/auth-url'),
  });
}

// ── Google Calendar ──

interface CalendarSyncResult {
  push: { pushed: number; errors: string[] };
  pull: { pulled: number; skipped: number; errors: string[] };
}

export function useGoogleCalendarSync() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiClient.post<CalendarSyncResult>('/integrations/google-calendar/sync'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['integrations'] });
      qc.invalidateQueries({ queryKey: ['calendar'] });
    },
  });
}

export function useGoogleCalendarPush() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiClient.post<{ pushed: number; errors: string[] }>('/integrations/google-calendar/push'),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['integrations'] }),
  });
}

export function useGoogleCalendarPull() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiClient.post<{ pulled: number; skipped: number; errors: string[] }>('/integrations/google-calendar/pull'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['integrations'] });
      qc.invalidateQueries({ queryKey: ['calendar'] });
    },
  });
}

// ── Google Sheets ──

interface SheetsExportResult {
  spreadsheetUrl: string;
  spreadsheetId: string;
  rowCount: number;
}

export function useGoogleSheetsExport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: { type: string; from?: string; to?: string }) => {
      const query = new URLSearchParams({ type: params.type });
      if (params.from) query.set('from', params.from);
      if (params.to) query.set('to', params.to);
      return apiClient.post<SheetsExportResult>(
        `/integrations/google-sheets/export?${query.toString()}`,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['integrations'] }),
  });
}

// ── Google Drive ──

interface DriveMirrorResult {
  mirrored: number;
  skipped: number;
  errors: string[];
}

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink: string;
  modifiedTime: string;
}

export function useGoogleDriveMirror() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiClient.post<DriveMirrorResult>('/integrations/google-drive/mirror'),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['integrations'] }),
  });
}
