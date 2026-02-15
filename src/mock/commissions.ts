import { formatCurrency } from '@/lib/utils';

export interface CommissionRecord {
    id: string;
    policyNumber: string;
    clientName: string;
    productType: string;
    premiumAmount: number;
    commissionRate: number;
    commissionAmount: number;
    status: 'earned' | 'paid' | 'pending' | 'clawback';
    datePolicyIssued: string;
    datePaid?: string;
    brokerName: string;
}

export const commissions: CommissionRecord[] = [
    {
        id: '1',
        policyNumber: 'LOY/HQ/MOT/MC22/40312',
        clientName: 'Ghana Shippers\' Authority',
        productType: 'Motor Comprehensive',
        premiumAmount: 11298.10,
        commissionRate: 16.5,
        commissionAmount: 1864.19,
        status: 'paid',
        datePolicyIssued: '2023-01-29',
        datePaid: '2023-02-15',
        brokerName: 'Esi Donkor',
    },
    {
        id: '2',
        policyNumber: 'GG-DSDM-1010-21-002142',
        clientName: 'Radiance Petroleum',
        productType: 'Motor Comprehensive',
        premiumAmount: 432.00,
        commissionRate: 16.5,
        commissionAmount: 71.28,
        status: 'paid',
        datePolicyIssued: '2023-01-13',
        datePaid: '2023-01-30',
        brokerName: 'Kofi Asante',
    },
    {
        id: '3',
        policyNumber: 'GG-DSDM-1011-23-006822',
        clientName: 'Loretta Boakye',
        productType: 'Motor Third Party',
        premiumAmount: 502.90,
        commissionRate: 10,
        commissionAmount: 50.29,
        status: 'earned',
        datePolicyIssued: '2023-05-01',
        brokerName: 'Abena Nyarko',
    },
    {
        id: '4',
        policyNumber: 'GL/GLA 20190199',
        clientName: 'EAP Limited',
        productType: 'Group Life',
        premiumAmount: 23660.00,
        commissionRate: 20,
        commissionAmount: 4732.00,
        status: 'pending',
        datePolicyIssued: '2022-12-02',
        brokerName: 'Abena Nyarko',
    },
    {
        id: '5',
        policyNumber: 'GG-DSDM-4020-22-000036',
        clientName: 'Radiance Petroleum',
        productType: 'Bonds',
        premiumAmount: 480000.00,
        commissionRate: 18,
        commissionAmount: 86400.00,
        status: 'earned',
        datePolicyIssued: '2023-01-19',
        brokerName: 'Kofi Asante',
    },
    {
        id: '6',
        policyNumber: 'POL-2024-0401',
        clientName: 'Adjoa Frimpong',
        productType: 'Motor Third Party',
        premiumAmount: 1800,
        commissionRate: 12,
        commissionAmount: 216,
        status: 'clawback',
        datePolicyIssued: '2023-11-01',
        brokerName: 'Kofi Asante',
    },
    {
        id: '7',
        policyNumber: 'POL-2024-0890',
        clientName: 'Emmanuel Tetteh',
        productType: 'Marine Cargo',
        premiumAmount: 25000,
        commissionRate: 8,
        commissionAmount: 2000,
        status: 'pending',
        datePolicyIssued: '2024-02-14',
        brokerName: 'Ama Serwaa',
    },
    {
        id: '8',
        policyNumber: 'POL-2024-0895',
        clientName: 'Grace Mensah',
        productType: 'Life Assurance',
        premiumAmount: 6000,
        commissionRate: 18,
        commissionAmount: 1080,
        status: 'paid',
        datePolicyIssued: '2024-01-28',
        datePaid: '2024-02-20',
        brokerName: 'Kofi Asante',
    },
];

export const commissionSummary = {
    totalEarned: commissions.filter(c => c.status === 'earned' || c.status === 'paid').reduce((s, c) => s + c.commissionAmount, 0),
    totalPaid: commissions.filter(c => c.status === 'paid').reduce((s, c) => s + c.commissionAmount, 0),
    totalPending: commissions.filter(c => c.status === 'pending').reduce((s, c) => s + c.commissionAmount, 0),
    totalClawback: commissions.filter(c => c.status === 'clawback').reduce((s, c) => s + c.commissionAmount, 0),
};
