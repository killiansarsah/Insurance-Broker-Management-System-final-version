export interface Invoice {
    id: string;
    invoiceNumber: string;
    clientName: string;
    policyNumber: string;
    description: string;
    amount: number;
    amountPaid: number;
    status: 'paid' | 'outstanding' | 'overdue' | 'partial';
    dateIssued: string;
    dateDue: string;
    datePaid?: string;
}

export interface PaymentReceipt {
    id: string;
    receiptNumber: string;
    clientName: string;
    amount: number;
    paymentMethod: 'bank_transfer' | 'mobile_money' | 'cash' | 'cheque';
    reference: string;
    dateReceived: string;
}

export const invoices: Invoice[] = [
    {
        id: '1',
        invoiceNumber: 'INV-2023-001',
        clientName: 'Ghana Shippers\' Authority',
        policyNumber: 'LOY/HQ/MOT/MC22/40312',
        description: 'Motor Comprehensive Premium',
        amount: 11298.10,
        amountPaid: 11298.10,
        status: 'paid',
        dateIssued: '2023-01-29',
        dateDue: '2023-02-28',
        datePaid: '2023-02-15',
    },
    {
        id: '2',
        invoiceNumber: 'INV-2023-002',
        clientName: 'Radiance Petroleum',
        policyNumber: 'GG-DSDM-1010-21-002142',
        description: 'Motor Comprehensive Premium',
        amount: 432.00,
        amountPaid: 432.00,
        status: 'paid',
        dateIssued: '2023-01-13',
        dateDue: '2023-02-13',
        datePaid: '2023-01-30',
    },
    {
        id: '3',
        invoiceNumber: 'INV-2024-003',
        clientName: 'Yaw Boateng',
        policyNumber: 'POL-2024-0861',
        description: 'Health Insurance Premium',
        amount: 3200,
        amountPaid: 0,
        status: 'outstanding',
        dateIssued: '2024-02-05',
        dateDue: '2024-03-05',
    },
    {
        id: '4',
        invoiceNumber: 'INV-2024-004',
        clientName: 'Akosua Darko',
        policyNumber: 'POL-2024-0870',
        description: 'Travel Insurance Premium',
        amount: 800,
        amountPaid: 0,
        status: 'overdue',
        dateIssued: '2024-01-10',
        dateDue: '2024-02-10',
    },
    {
        id: '5',
        invoiceNumber: 'INV-2024-005',
        clientName: 'Nana Kwadwo Ltd',
        policyNumber: 'POL-2024-0878',
        description: 'Professional Indemnity Premium',
        amount: 15000,
        amountPaid: 15000,
        status: 'paid',
        dateIssued: '2024-02-12',
        dateDue: '2024-03-12',
        datePaid: '2024-02-14',
    },
    {
        id: '6',
        invoiceNumber: 'INV-2024-006',
        clientName: 'Emmanuel Tetteh',
        policyNumber: 'POL-2024-0890',
        description: 'Marine Cargo Premium',
        amount: 25000,
        amountPaid: 0,
        status: 'outstanding',
        dateIssued: '2024-02-14',
        dateDue: '2024-03-14',
    },
    {
        id: '7',
        invoiceNumber: 'INV-2024-007',
        clientName: 'Grace Mensah',
        policyNumber: 'POL-2024-0895',
        description: 'Life Assurance Premium',
        amount: 6000,
        amountPaid: 6000,
        status: 'paid',
        dateIssued: '2024-01-28',
        dateDue: '2024-02-28',
        datePaid: '2024-02-10',
    },
];

export const receipts: PaymentReceipt[] = [
    { id: '1', receiptNumber: 'REC-2023-001', clientName: 'Ghana Shippers\' Authority', amount: 11298.10, paymentMethod: 'bank_transfer', reference: 'LOY-PAY-001', dateReceived: '2023-02-15' },
    { id: '2', receiptNumber: 'REC-2023-002', clientName: 'Radiance Petroleum', amount: 432.00, paymentMethod: 'mobile_money', reference: 'RAD-PAY-001', dateReceived: '2023-01-30' },
    { id: '3', receiptNumber: 'REC-2023-003', clientName: 'Radiance Petroleum', amount: 480000.00, paymentMethod: 'bank_transfer', reference: 'RAD-PAY-002', dateReceived: '2023-01-25' },
    { id: '4', receiptNumber: 'REC-2024-004', clientName: 'Grace Mensah', amount: 6000, paymentMethod: 'bank_transfer', reference: 'TXN-1092', dateReceived: '2024-02-10' },
];

export const financeSummary = {
    totalRevenue: invoices.reduce((s, inv) => s + inv.amountPaid, 0),
    outstanding: invoices.filter(i => i.status === 'outstanding' || i.status === 'partial').reduce((s, i) => s + (i.amount - i.amountPaid), 0),
    overdue: invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + (i.amount - i.amountPaid), 0),
    collected: receipts.reduce((s, r) => s + r.amount, 0),
};
