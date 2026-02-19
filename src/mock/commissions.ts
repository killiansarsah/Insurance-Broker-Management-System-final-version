export interface CommissionRecord {
    id: string;
    policyId: string;
    policyNumber: string;
    clientId: string;
    clientName: string;
    productType: string;
    premiumAmount: number;
    commissionRate: number;
    commissionAmount: number;
    status: 'earned' | 'paid' | 'pending' | 'clawback';
    datePolicyIssued: string;
    datePaid?: string;
    brokerName: string;
    currency: 'GHS' | 'USD' | 'EUR';
}

export const commissions: CommissionRecord[] = [
    {
        id: 'com-001',
        policyId: 'pol-001',
        policyNumber: 'LOY/HQ/MOT/MC22/40312',
        clientId: 'cli-001',
        clientName: "Ghana Shippers' Authority",
        productType: 'Motor Comprehensive',
        premiumAmount: 11298.10,
        commissionRate: 16.5,
        commissionAmount: 1864.19,
        status: 'paid',
        datePolicyIssued: '2023-01-29',
        datePaid: '2023-02-15',
        brokerName: 'Esi Donkor',
        currency: 'GHS',
    },
    {
        id: 'com-002',
        policyId: 'pol-002',
        policyNumber: 'GG-DSDM-1010-21-002142',
        clientId: 'cli-002',
        clientName: 'Radiance Petroleum',
        productType: 'Motor Comprehensive',
        premiumAmount: 432.00,
        commissionRate: 16.5,
        commissionAmount: 71.28,
        status: 'paid',
        datePolicyIssued: '2023-01-13',
        datePaid: '2023-01-30',
        brokerName: 'Kofi Asante',
        currency: 'GHS',
    },
    {
        id: 'com-003',
        policyId: 'pol-011',
        policyNumber: 'GG-DSDM-1011-23-006822',
        clientId: 'cli-010',
        clientName: 'Loretta Boakye',
        productType: 'Motor Third Party',
        premiumAmount: 502.90,
        commissionRate: 10,
        commissionAmount: 50.29,
        status: 'earned',
        datePolicyIssued: '2023-05-01',
        brokerName: 'Abena Nyarko',
        currency: 'GHS',
    },
    {
        id: 'com-004',
        policyId: 'pol-008',
        policyNumber: 'GL/GLA 20190199',
        clientId: 'cli-008',
        clientName: 'EAP Limited',
        productType: 'Group Life',
        premiumAmount: 23660.00,
        commissionRate: 20,
        commissionAmount: 4732.00,
        status: 'pending',
        datePolicyIssued: '2022-12-02',
        brokerName: 'Abena Nyarko',
        currency: 'GHS',
    },
    {
        id: 'com-005',
        policyId: 'pol-009',
        policyNumber: 'GG-DSDM-4020-22-000036',
        clientId: 'cli-002',
        clientName: 'Radiance Petroleum',
        productType: 'Bonds',
        premiumAmount: 480000.00,
        commissionRate: 18,
        commissionAmount: 86400.00,
        status: 'earned',
        datePolicyIssued: '2023-01-19',
        brokerName: 'Kofi Asante',
        currency: 'GHS',
    },
    {
        id: 'com-006',
        policyId: 'pol-010',
        policyNumber: 'POL-2024-0401',
        clientId: 'cli-009',
        clientName: 'Adjoa Frimpong',
        productType: 'Motor Third Party',
        premiumAmount: 1800,
        commissionRate: 12,
        commissionAmount: 216,
        status: 'clawback',
        datePolicyIssued: '2023-11-01',
        brokerName: 'Kofi Asante',
        currency: 'GHS',
    },
    {
        id: 'com-007',
        policyId: 'pol-006',
        policyNumber: 'POL-2024-0890',
        clientId: 'cli-006',
        clientName: 'Emmanuel Tetteh',
        productType: 'Marine Cargo',
        premiumAmount: 25000,
        commissionRate: 8,
        commissionAmount: 2000,
        status: 'pending',
        datePolicyIssued: '2024-02-14',
        brokerName: 'Ama Serwaa',
        currency: 'USD',
    },
    {
        id: 'com-008',
        policyId: 'pol-007',
        policyNumber: 'POL-2024-0895',
        clientId: 'cli-007',
        clientName: 'Grace Mensah',
        productType: 'Life Assurance',
        premiumAmount: 6000,
        commissionRate: 18,
        commissionAmount: 1080,
        status: 'paid',
        datePolicyIssued: '2024-01-28',
        datePaid: '2024-02-20',
        brokerName: 'Kofi Asante',
        currency: 'GHS',
    },
    {
        id: 'com-009',
        policyId: 'pol-005',
        policyNumber: 'POL-2024-0878',
        clientId: 'cli-005',
        clientName: 'Nana Kwadwo Ltd',
        productType: 'Professional Indemnity',
        premiumAmount: 15000,
        commissionRate: 15,
        commissionAmount: 2250,
        status: 'paid',
        datePolicyIssued: '2024-02-12',
        datePaid: '2024-02-28',
        brokerName: 'Esi Donkor',
        currency: 'GHS',
    },
    {
        id: 'com-010',
        policyId: 'pol-013',
        policyNumber: 'POL-2025-1205',
        clientId: 'cli-012',
        clientName: 'Kofi Asante Holdings',
        productType: "Contractors All Risk",
        premiumAmount: 42000,
        commissionRate: 12,
        commissionAmount: 5040,
        status: 'paid',
        datePolicyIssued: '2025-02-01',
        datePaid: '2025-02-10',
        brokerName: 'Abena Nyarko',
        currency: 'GHS',
    },
    {
        id: 'com-011',
        policyId: 'pol-012',
        policyNumber: 'POL-2025-1100',
        clientId: 'cli-011',
        clientName: 'Abena Nyarko Enterprises',
        productType: 'Fire & Special Perils',
        premiumAmount: 8500,
        commissionRate: 14,
        commissionAmount: 1190,
        status: 'pending',
        datePolicyIssued: '2025-01-15',
        brokerName: 'Ama Serwaa',
        currency: 'GHS',
    },
    {
        id: 'com-012',
        policyId: 'pol-015',
        policyNumber: 'POL-2025-1422',
        clientId: 'cli-014',
        clientName: 'Ama Serwaa Foundation',
        productType: 'Group Personal Accident',
        premiumAmount: 12000,
        commissionRate: 10,
        commissionAmount: 1200,
        status: 'earned',
        datePolicyIssued: '2025-02-12',
        brokerName: 'Esi Donkor',
        currency: 'GHS',
    },
];

export const commissionSummary = {
    totalEarned: commissions.filter(c => c.status === 'earned' || c.status === 'paid').reduce((s, c) => s + c.commissionAmount, 0),
    totalPaid: commissions.filter(c => c.status === 'paid').reduce((s, c) => s + c.commissionAmount, 0),
    totalPending: commissions.filter(c => c.status === 'pending').reduce((s, c) => s + c.commissionAmount, 0),
    totalClawback: commissions.filter(c => c.status === 'clawback').reduce((s, c) => s + c.commissionAmount, 0),
};

// Derived: commissions grouped by broker
export const commissionsByBroker = commissions.reduce((acc, c) => {
    if (!acc[c.brokerName]) {
        acc[c.brokerName] = { broker: c.brokerName, total: 0, paid: 0, pending: 0, count: 0 };
    }
    acc[c.brokerName].total += c.commissionAmount;
    if (c.status === 'paid') acc[c.brokerName].paid += c.commissionAmount;
    if (c.status === 'pending') acc[c.brokerName].pending += c.commissionAmount;
    acc[c.brokerName].count += 1;
    return acc;
}, {} as Record<string, { broker: string; total: number; paid: number; pending: number; count: number }>);
