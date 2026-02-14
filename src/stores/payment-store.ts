'use client';

import { create } from 'zustand';
import { Transaction, PaymentStatus } from '../types';
import { MOCK_TRANSACTIONS } from '../mock/payments';

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
    transactions: MOCK_TRANSACTIONS,
    isProcessing: false,

    addTransaction: (transaction: Transaction) =>
        set((state) => ({ transactions: [transaction, ...state.transactions] })),

    updateTransactionStatus: (id: string, status: PaymentStatus) =>
        set((state) => ({
            transactions: state.transactions.map((tx) =>
                tx.id === id ? { ...tx, status, processedAt: status === 'paid' ? new Date().toISOString() : tx.processedAt } : tx
            ),
        })),

    setProcessing: (processing: boolean) => set({ isProcessing: processing }),

    processMoMoPayment: async (transactionData) => {
        set({ isProcessing: true });

        // Simulate network delay for MoMo processing in Ghana
        await new Promise((resolve) => setTimeout(resolve, 3000));

        const newTransaction: Transaction = {
            ...transactionData,
            id: `tx-${Math.random().toString(36).substr(2, 9)}`,
            status: 'paid', // Simulate success for now
            createdAt: new Date().toISOString(),
            processedAt: new Date().toISOString(),
        };

        set((state) => ({
            transactions: [newTransaction, ...state.transactions],
            isProcessing: false
        }));

        return true;
    },
}));
