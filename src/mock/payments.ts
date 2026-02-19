import { Transaction } from '../types';

export const MOCK_TRANSACTIONS: Transaction[] = [
    {
        id: 'tx-001',
        policyId: 'POL-001',
        policyNumber: 'IBMS/MOT/2026/001',
        clientId: 'cli-001',
        clientName: 'Kwame Mensah',
        amount: 1200,
        currency: 'GHS',
        status: 'paid',
        method: 'mobile_money',
        momoNetwork: 'mtn',
        phoneNumber: '+233244123456',
        reference: 'RENEWAL-2026-KM',
        description: 'Premium payment for Motor Comprehensive policy',
        processedAt: '2026-02-10T10:30:00Z',
        createdAt: '2026-02-10T10:25:00Z',
    },
    {
        id: 'tx-002',
        policyId: 'POL-002',
        policyNumber: 'IBMS/LIF/2026/042',
        clientId: 'cli-002',
        clientName: 'Ama Serwaa',
        amount: 500,
        currency: 'GHS',
        status: 'pending',
        method: 'mobile_money',
        momoNetwork: 'telecel',
        phoneNumber: '+233207654321',
        reference: 'LIFE-AUG-23',
        description: 'Monthly premium for Whole Life policy',
        createdAt: '2026-02-14T14:00:00Z',
    }
];
