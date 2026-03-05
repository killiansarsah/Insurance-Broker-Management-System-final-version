'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { PaginatedResponse } from '@/types/api';

interface InvoiceData { id: string; status: string; amount: number;[key: string]: unknown; }
interface TransactionData { id: string; type: string; amount: number;[key: string]: unknown; }
interface CommissionData { id: string; commissionAmount: number;[key: string]: unknown; }
interface ExpenseData { id: string; amount: number; status: string;[key: string]: unknown; }
interface PremiumFinancingData { id: string;[key: string]: unknown; }
interface FinanceDashboardData { [key: string]: unknown; }

// ─── INVOICES ───
export function useInvoices(params?: Record<string, unknown>) {
    return useQuery({
        queryKey: ['invoices', params],
        queryFn: () => apiClient.get<PaginatedResponse<InvoiceData>>('/invoices', params),
    });
}
export function useInvoice(id: string) {
    return useQuery({
        queryKey: ['invoices', id],
        queryFn: () => apiClient.get<InvoiceData>(`/invoices/${id}`),
        enabled: !!id,
    });
}
export function useCreateInvoice() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: Record<string, unknown>) => apiClient.post<InvoiceData>('/invoices', data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }),
    });
}
export function useUpdateInvoice() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
            apiClient.patch<InvoiceData>(`/invoices/${id}`, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }),
    });
}
export function useSendInvoice() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => apiClient.post(`/invoices/${id}/send`),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }),
    });
}
export function useCancelInvoice() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => apiClient.post(`/invoices/${id}/cancel`),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }),
    });
}

// ─── TRANSACTIONS ───
export function useTransactions(params?: Record<string, unknown>) {
    return useQuery({
        queryKey: ['transactions', params],
        queryFn: () => apiClient.get<PaginatedResponse<TransactionData>>('/transactions', params),
    });
}
export function useCreateTransaction() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: Record<string, unknown>) => apiClient.post<TransactionData>('/transactions', data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['transactions'] }),
    });
}

// ─── COMMISSIONS ───
export function useCommissions(params?: Record<string, unknown>) {
    return useQuery({
        queryKey: ['commissions', params],
        queryFn: () => apiClient.get<PaginatedResponse<CommissionData>>('/commissions', params),
    });
}

// ─── EXPENSES ───
export function useExpenses(params?: Record<string, unknown>) {
    return useQuery({
        queryKey: ['expenses', params],
        queryFn: () => apiClient.get<PaginatedResponse<ExpenseData>>('/expenses', params),
    });
}
export function useCreateExpense() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: Record<string, unknown>) => apiClient.post<ExpenseData>('/expenses', data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['expenses'] }),
    });
}
export function useApproveExpense() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => apiClient.patch(`/expenses/${id}/approve`),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['expenses'] }),
    });
}

// ─── PREMIUM FINANCING ───
export function usePremiumFinancing(params?: Record<string, unknown>) {
    return useQuery({
        queryKey: ['premium-financing', params],
        queryFn: () => apiClient.get<PaginatedResponse<PremiumFinancingData>>('/premium-financing', params),
    });
}
export function useCreatePremiumFinancing() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: Record<string, unknown>) => apiClient.post('/premium-financing', data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['premium-financing'] }),
    });
}

// ─── FINANCE DASHBOARD ───
export function useFinanceDashboard(params?: Record<string, unknown>) {
    return useQuery({
        queryKey: ['finance-dashboard', params],
        queryFn: () => apiClient.get<FinanceDashboardData>('/finance/dashboard', params),
    });
}
