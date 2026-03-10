'use client';

import { create } from 'zustand';
import { Transaction, PaymentStatus } from '../types';
import { apiClient } from '@/lib/api-client';

interface PaymentState {
    transactions: Transaction[];
    isProcessing: boolean;

    // Actions
    addTransaction: (transaction: Transaction) => void;
    updateTransactionStatus: (id: string, status: PaymentStatus) => void;
    setProcessing: (processing: boolean) => void;
    processMoMoPayment: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'status'>) => Promise<boolean>;
}

export const usePaymentStore = create<PaymentState>((set, get) => ({
    transactions: [],
    isProcessing: false,

    addTransaction: (transaction: Transaction) =>
        set((state) => ({ transactions: [transaction, ...state.transactions] })),

    updateTransactionStatus: (id: string, status: PaymentStatus) =>
        set((state) => ({
            transactions: state.transactions.map((tx) =>
                tx.id === id ? { ...tx, status, processedAt: status === 'PAID' ? new Date().toISOString() : tx.processedAt } : tx
            ),
        })),

    setProcessing: (processing: boolean) => set({ isProcessing: processing }),

    processMoMoPayment: async (transactionData) => {
        set({ isProcessing: true });

        try {
            const newTransaction = await apiClient.post<Transaction>(
                '/transactions',
                { ...transactionData, paymentMethod: 'MOBILE_MONEY' },
            );

            set((state) => ({
                transactions: [newTransaction, ...state.transactions],
                isProcessing: false,
            }));

            return true;
        } catch {
            set({ isProcessing: false });
            return false;
        }
    },
}));
