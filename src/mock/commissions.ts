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
        policyNumber: 'POL-2024-0847',
        clientName: 'Kwame Mensah',
        productType: 'Motor Comprehensive',
        premiumAmount: 4500,
        commissionRate: 15,
        commissionAmount: 675,
        status: 'paid',
        datePolicyIssued: '2024-01-15',
        datePaid: '2024-02-01',
        brokerName: 'Ama Serwaa',
    },
    {
        id: '2',
        policyNumber: 'POL-2024-0852',
        clientName: 'Abena Osei',
        productType: 'Fire & Allied Perils',
        premiumAmount: 12000,
        commissionRate: 12.5,
        commissionAmount: 1500,
        status: 'paid',
        datePolicyIssued: '2024-01-20',
        datePaid: '2024-02-15',
        brokerName: 'Kofi Asante',
    },
    {
        id: '3',
        policyNumber: 'POL-2024-0861',
        clientName: 'Yaw Boateng',
        productType: 'Health Insurance',
        premiumAmount: 3200,
        commissionRate: 10,
        commissionAmount: 320,
        status: 'earned',
        datePolicyIssued: '2024-02-05',
        brokerName: 'Ama Serwaa',
    },
    {
        id: '4',
        policyNumber: 'POL-2024-0870',
        clientName: 'Akosua Darko',
        productType: 'Travel Insurance',
        premiumAmount: 800,
        commissionRate: 20,
        commissionAmount: 160,
        status: 'pending',
        datePolicyIssued: '2024-02-10',
        brokerName: 'Kofi Asante',
    },
    {
        id: '5',
        policyNumber: 'POL-2024-0878',
        clientName: 'Nana Kwadwo Ltd',
        productType: 'Professional Indemnity',
        premiumAmount: 15000,
        commissionRate: 10,
        commissionAmount: 1500,
        status: 'earned',
        datePolicyIssued: '2024-02-12',
        brokerName: 'Ama Serwaa',
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
