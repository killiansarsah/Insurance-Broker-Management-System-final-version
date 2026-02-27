// Premium Financing Mock Data — Comprehensive PFA records with installment tracking

export type PFStatus = 'submitted' | 'under_review' | 'approved' | 'active' | 'completed' | 'defaulted' | 'cancelled';

export interface PFInstallment {
    id: string;
    number: number;
    dueDate: string;
    amount: number;
    status: 'paid' | 'pending' | 'overdue';
    paidDate?: string;
}

export interface PFApplication {
    id: string;
    applicationNumber: string;
    clientId: string;
    clientName: string;
    clientType: 'individual' | 'corporate';
    clientPhone: string;
    clientEmail: string;

    // Policy
    policyId: string;
    policyNumber: string;
    insurerName: string;
    insuranceType: string;
    coverageType: string;

    // Financial
    totalPremium: number;
    downPaymentPct: number;
    downPayment: number;
    financedAmount: number;
    interestRateMonthly: number;
    totalInterest: number;
    totalRepayment: number;
    monthlyInstallment: number;

    // Plan
    numberOfInstallments: number;
    installmentsPaid: number;
    amountPaid: number;
    outstandingBalance: number;

    // Status
    status: PFStatus;
    daysOverdue: number;

    // Dates
    applicationDate: string;
    approvalDate?: string;
    disbursementDate?: string;
    firstPaymentDate?: string;
    nextPaymentDate?: string;
    completionDate?: string;

    // People
    financier: string;
    assignedBroker: string;

    // Installments
    installments: PFInstallment[];

    // Notes
    reason?: string;
    notes?: string;

    // Audit
    createdAt: string;
    updatedAt: string;
}

// ─── Status Config ───
export const PF_STATUS_CONFIG: Record<PFStatus, { label: string; bg: string; color: string; dot: string }> = {
    submitted:    { label: 'Submitted',    bg: 'bg-blue-50',      color: 'text-blue-700',    dot: 'bg-blue-500' },
    under_review: { label: 'Under Review', bg: 'bg-amber-50',     color: 'text-amber-700',   dot: 'bg-amber-500' },
    approved:     { label: 'Approved',     bg: 'bg-success-50',   color: 'text-success-700',  dot: 'bg-success-500' },
    active:       { label: 'Active',       bg: 'bg-primary-50',   color: 'text-primary-700',  dot: 'bg-primary-500' },
    completed:    { label: 'Completed',    bg: 'bg-success-100',  color: 'text-success-800',  dot: 'bg-success-600' },
    defaulted:    { label: 'Defaulted',    bg: 'bg-danger-50',    color: 'text-danger-700',   dot: 'bg-danger-500' },
    cancelled:    { label: 'Cancelled',    bg: 'bg-surface-100',  color: 'text-surface-600',  dot: 'bg-surface-400' },
};

// ─── Financiers ───
export const FINANCIERS = [
    'Apex Finance Ltd',
    'Premium Plus Finance',
    'Capital Express Finance',
    'Sterling Premium Finance',
];

export const FINANCIER_RATES: Record<string, number> = {
    'Apex Finance Ltd': 2.5,
    'Premium Plus Finance': 2.8,
    'Capital Express Finance': 3.0,
    'Sterling Premium Finance': 2.2,
};

// ─── Helpers ───
function generateInstallments(
    financedAmount: number,
    months: number,
    monthlyAmount: number,
    startDate: string,
    installmentsPaid: number,
    daysOverdue: number,
): PFInstallment[] {
    const start = new Date(startDate);
    const today = new Date('2026-02-27');
    const installments: PFInstallment[] = [];

    for (let i = 1; i <= months; i++) {
        const due = new Date(start);
        due.setMonth(due.getMonth() + i);
        const dueStr = due.toISOString().split('T')[0];

        let status: PFInstallment['status'] = 'pending';
        let paidDate: string | undefined;

        if (i <= installmentsPaid) {
            status = 'paid';
            const pd = new Date(due);
            pd.setDate(pd.getDate() - Math.floor(Math.random() * 3));
            paidDate = pd.toISOString().split('T')[0];
        } else if (due < today && daysOverdue > 0) {
            status = 'overdue';
        }

        installments.push({
            id: `inst-${i}`,
            number: i,
            dueDate: dueStr,
            amount: i === months ? financedAmount - monthlyAmount * (months - 1) : monthlyAmount,
            status,
            paidDate,
        });
    }
    return installments;
}

function computeFinancing(totalPremium: number, downPct: number, months: number, rateMonthly: number) {
    const downPayment = totalPremium * (downPct / 100);
    const financedAmount = totalPremium - downPayment;
    const totalInterest = financedAmount * (rateMonthly / 100) * months;
    const totalRepayment = financedAmount + totalInterest;
    const monthlyInstallment = Math.round((totalRepayment / months) * 100) / 100;
    return { downPayment, financedAmount, totalInterest, totalRepayment, monthlyInstallment };
}

// ─── Mock Data ───
const rawData: Array<{
    clientName: string; clientType: 'individual' | 'corporate'; clientPhone: string; clientEmail: string;
    policyNumber: string; insurerName: string; insuranceType: string; coverageType: string;
    totalPremium: number; downPct: number; months: number; financier: string; broker: string;
    status: PFStatus; installmentsPaid: number; daysOverdue: number;
    applicationDate: string; approvalDate?: string; disbursementDate?: string;
    completionDate?: string; reason?: string; notes?: string;
}> = [
    // ── Active (normal) ──
    {
        clientName: 'Ghana Shippers\' Authority', clientType: 'corporate', clientPhone: '+233201001111', clientEmail: 'info@ghanashippersau.com',
        policyNumber: 'PRI/HQ/FIR/26/00009', insurerName: 'Prime Insurance', insuranceType: 'fire', coverageType: 'Commercial Property',
        totalPremium: 85000, downPct: 20, months: 9, financier: 'Apex Finance Ltd', broker: 'Kofi Asante',
        status: 'active', installmentsPaid: 5, daysOverdue: 0,
        applicationDate: '2025-06-01', approvalDate: '2025-06-05', disbursementDate: '2025-06-08',
        notes: 'Large commercial property financing with quarterly reviews.',
    },
    {
        clientName: 'Radiance Petroleum', clientType: 'corporate', clientPhone: '+233201002222', clientEmail: 'info@radiancepetrole.com',
        policyNumber: 'EIC/HQ/OIL/26/00004', insurerName: 'Enterprise Insurance', insuranceType: 'oil_gas', coverageType: 'Energy Package',
        totalPremium: 220000, downPct: 25, months: 12, financier: 'Premium Plus Finance', broker: 'Abena Nyarko',
        status: 'active', installmentsPaid: 8, daysOverdue: 0,
        applicationDate: '2025-03-10', approvalDate: '2025-03-15', disbursementDate: '2025-03-20',
        notes: 'Energy sector financing. High value agreement.',
    },
    {
        clientName: 'TechVista Solutions', clientType: 'corporate', clientPhone: '+233201005555', clientEmail: 'finance@techvista.com',
        policyNumber: 'SIC/HQ/LIA/26/00012', insurerName: 'SIC Insurance', insuranceType: 'liability', coverageType: 'Professional Indemnity',
        totalPremium: 32000, downPct: 15, months: 6, financier: 'Capital Express Finance', broker: 'John Mensah',
        status: 'active', installmentsPaid: 3, daysOverdue: 0,
        applicationDate: '2025-09-15', approvalDate: '2025-09-19', disbursementDate: '2025-09-22',
    },

    // ── Active (overdue) ──
    {
        clientName: 'Nana Ama Osei', clientType: 'individual', clientPhone: '+233244556677', clientEmail: 'nana.osei@gmail.com',
        policyNumber: 'PRI/HQ/MOT/26/00023', insurerName: 'Prime Insurance', insuranceType: 'motor', coverageType: 'Private Motor Comprehensive',
        totalPremium: 8500, downPct: 20, months: 6, financier: 'Sterling Premium Finance', broker: 'Esi Donkor',
        status: 'active', installmentsPaid: 3, daysOverdue: 15,
        applicationDate: '2025-08-01', approvalDate: '2025-08-03', disbursementDate: '2025-08-05',
        notes: 'Client requested payment extension. Follow up required.',
    },
    {
        clientName: 'Kwame Boateng', clientType: 'individual', clientPhone: '+233200887766', clientEmail: 'k.boateng@outlook.com',
        policyNumber: 'EIC/HQ/MOT/26/00034', insurerName: 'Enterprise Insurance', insuranceType: 'motor', coverageType: 'Third Party Motor',
        totalPremium: 4200, downPct: 20, months: 3, financier: 'Apex Finance Ltd', broker: 'Kofi Asante',
        status: 'active', installmentsPaid: 1, daysOverdue: 8,
        applicationDate: '2025-11-20', approvalDate: '2025-11-22', disbursementDate: '2025-11-25',
        reason: 'Client facing temporary cash flow issues.',
    },

    // ── Under Review ──
    {
        clientName: 'Golden Star Resources', clientType: 'corporate', clientPhone: '+233301009988', clientEmail: 'finance@goldenstar.com.gh',
        policyNumber: 'SIC/HQ/FIR/26/00045', insurerName: 'SIC Insurance', insuranceType: 'fire', coverageType: 'Industrial All Risks',
        totalPremium: 150000, downPct: 25, months: 12, financier: 'Premium Plus Finance', broker: 'Abena Nyarko',
        status: 'under_review', installmentsPaid: 0, daysOverdue: 0,
        applicationDate: '2026-02-15',
        notes: 'Awaiting credit assessment and financier approval.',
    },
    {
        clientName: 'Amoah & Sons Ltd', clientType: 'corporate', clientPhone: '+233209876543', clientEmail: 'accounts@amoahsons.com',
        policyNumber: 'PRI/HQ/LIA/26/00056', insurerName: 'Prime Insurance', insuranceType: 'liability', coverageType: 'Public Liability',
        totalPremium: 42000, downPct: 20, months: 9, financier: 'Apex Finance Ltd', broker: 'Esi Donkor',
        status: 'under_review', installmentsPaid: 0, daysOverdue: 0,
        applicationDate: '2026-02-20',
        reason: 'Renewal financing request.',
    },
    {
        clientName: 'Abena Mensah', clientType: 'individual', clientPhone: '+233244123456', clientEmail: 'a.mensah@yahoo.com',
        policyNumber: 'EIC/HQ/MOT/26/00067', insurerName: 'Enterprise Insurance', insuranceType: 'motor', coverageType: 'Private Motor Comprehensive',
        totalPremium: 6800, downPct: 15, months: 6, financier: 'Sterling Premium Finance', broker: 'John Mensah',
        status: 'under_review', installmentsPaid: 0, daysOverdue: 0,
        applicationDate: '2026-02-22',
    },

    // ── Approved (awaiting disbursement) ──
    {
        clientName: 'ChemGhana Industries', clientType: 'corporate', clientPhone: '+233301112233', clientEmail: 'procurement@chemghana.com',
        policyNumber: 'SIC/HQ/FIR/26/00078', insurerName: 'SIC Insurance', insuranceType: 'fire', coverageType: 'Commercial Property',
        totalPremium: 95000, downPct: 20, months: 12, financier: 'Capital Express Finance', broker: 'Kofi Asante',
        status: 'approved', installmentsPaid: 0, daysOverdue: 0,
        applicationDate: '2026-02-10', approvalDate: '2026-02-18',
        notes: 'Approved. Awaiting client down payment confirmation.',
    },
    {
        clientName: 'Yaa Asantewaa Foundation', clientType: 'corporate', clientPhone: '+233209991122', clientEmail: 'admin@yasantewaa.org',
        policyNumber: 'PRI/HQ/FIR/26/00089', insurerName: 'Prime Insurance', insuranceType: 'fire', coverageType: 'Non-Profit Property',
        totalPremium: 28000, downPct: 15, months: 6, financier: 'Apex Finance Ltd', broker: 'Abena Nyarko',
        status: 'approved', installmentsPaid: 0, daysOverdue: 0,
        applicationDate: '2026-02-05', approvalDate: '2026-02-12',
    },

    // ── Completed ──
    {
        clientName: 'Volta Aluminium Company', clientType: 'corporate', clientPhone: '+233302445566', clientEmail: 'finance@valco.com.gh',
        policyNumber: 'EIC/HQ/FIR/25/00100', insurerName: 'Enterprise Insurance', insuranceType: 'fire', coverageType: 'Industrial All Risks',
        totalPremium: 175000, downPct: 25, months: 9, financier: 'Premium Plus Finance', broker: 'Kofi Asante',
        status: 'completed', installmentsPaid: 9, daysOverdue: 0,
        applicationDate: '2025-01-10', approvalDate: '2025-01-15', disbursementDate: '2025-01-20',
        completionDate: '2025-10-20',
        notes: 'Fully settled. No defaults during term.',
    },
    {
        clientName: 'Accra Mall Ltd', clientType: 'corporate', clientPhone: '+233302778899', clientEmail: 'finance@accramall.com.gh',
        policyNumber: 'SIC/HQ/FIR/25/00111', insurerName: 'SIC Insurance', insuranceType: 'fire', coverageType: 'Commercial Property',
        totalPremium: 62000, downPct: 20, months: 6, financier: 'Apex Finance Ltd', broker: 'Esi Donkor',
        status: 'completed', installmentsPaid: 6, daysOverdue: 0,
        applicationDate: '2025-04-01', approvalDate: '2025-04-05', disbursementDate: '2025-04-10',
        completionDate: '2025-10-10',
    },
    {
        clientName: 'Kofi Appiah', clientType: 'individual', clientPhone: '+233244778899', clientEmail: 'kofi.appiah@gmail.com',
        policyNumber: 'PRI/HQ/MOT/25/00122', insurerName: 'Prime Insurance', insuranceType: 'motor', coverageType: 'Private Motor Comprehensive',
        totalPremium: 5800, downPct: 20, months: 3, financier: 'Sterling Premium Finance', broker: 'John Mensah',
        status: 'completed', installmentsPaid: 3, daysOverdue: 0,
        applicationDate: '2025-07-01', approvalDate: '2025-07-03', disbursementDate: '2025-07-05',
        completionDate: '2025-10-05',
    },

    // ── Defaulted ──
    {
        clientName: 'West Coast Fisheries', clientType: 'corporate', clientPhone: '+233312334455', clientEmail: 'accounts@wcfisheries.com',
        policyNumber: 'EIC/HQ/MAR/25/00133', insurerName: 'Enterprise Insurance', insuranceType: 'marine', coverageType: 'Marine Hull',
        totalPremium: 48000, downPct: 20, months: 9, financier: 'Capital Express Finance', broker: 'Abena Nyarko',
        status: 'defaulted', installmentsPaid: 4, daysOverdue: 62,
        applicationDate: '2025-03-01', approvalDate: '2025-03-05', disbursementDate: '2025-03-10',
        reason: 'Business operations suspended. Unable to meet payment obligations.',
        notes: 'Referred to collections. Legal review in progress.',
    },
    {
        clientName: 'Ama Darko', clientType: 'individual', clientPhone: '+233244667788', clientEmail: 'ama.darko@hotmail.com',
        policyNumber: 'PRI/HQ/MOT/25/00144', insurerName: 'Prime Insurance', insuranceType: 'motor', coverageType: 'Private Motor Comprehensive',
        totalPremium: 7200, downPct: 15, months: 6, financier: 'Apex Finance Ltd', broker: 'Esi Donkor',
        status: 'defaulted', installmentsPaid: 2, daysOverdue: 45,
        applicationDate: '2025-06-01', approvalDate: '2025-06-03', disbursementDate: '2025-06-05',
        reason: 'Missed consecutive payments. No response to contact attempts.',
    },

    // ── Cancelled ──
    {
        clientName: 'Savannah Logistics', clientType: 'corporate', clientPhone: '+233372223344', clientEmail: 'ops@savannahlog.com',
        policyNumber: 'SIC/HQ/MOT/26/00155', insurerName: 'SIC Insurance', insuranceType: 'motor', coverageType: 'Fleet Commercial',
        totalPremium: 55000, downPct: 20, months: 12, financier: 'Premium Plus Finance', broker: 'John Mensah',
        status: 'cancelled', installmentsPaid: 0, daysOverdue: 0,
        applicationDate: '2026-01-15',
        reason: 'Client opted for full payment instead.',
    },

    // ── Submitted ──
    {
        clientName: 'Global Tech Solutions', clientType: 'corporate', clientPhone: '+233301556677', clientEmail: 'finance@globaltech.com.gh',
        policyNumber: 'EIC/HQ/LIA/26/00166', insurerName: 'Enterprise Insurance', insuranceType: 'liability', coverageType: 'Directors & Officers',
        totalPremium: 38000, downPct: 20, months: 9, financier: 'Apex Finance Ltd', broker: 'Kofi Asante',
        status: 'submitted', installmentsPaid: 0, daysOverdue: 0,
        applicationDate: '2026-02-25',
        notes: 'New application. Awaiting initial review.',
    },
    {
        clientName: 'Efua Owusu', clientType: 'individual', clientPhone: '+233244889900', clientEmail: 'efua.owusu@gmail.com',
        policyNumber: 'PRI/HQ/MOT/26/00177', insurerName: 'Prime Insurance', insuranceType: 'motor', coverageType: 'Private Motor Comprehensive',
        totalPremium: 9200, downPct: 15, months: 6, financier: 'Sterling Premium Finance', broker: 'Esi Donkor',
        status: 'submitted', installmentsPaid: 0, daysOverdue: 0,
        applicationDate: '2026-02-26',
    },
];

// ─── Generate Full Mock Applications ───
export const mockPFApplications: PFApplication[] = rawData.map((raw, idx) => {
    const rate = FINANCIER_RATES[raw.financier] ?? 2.5;
    const { downPayment, financedAmount, totalInterest, totalRepayment, monthlyInstallment } = computeFinancing(
        raw.totalPremium, raw.downPct, raw.months, rate
    );

    const amountPaid = raw.installmentsPaid * monthlyInstallment;
    const outstandingBalance = Math.max(0, totalRepayment - amountPaid);

    const firstPaymentDate = raw.disbursementDate ? (() => {
        const d = new Date(raw.disbursementDate);
        d.setMonth(d.getMonth() + 1);
        return d.toISOString().split('T')[0];
    })() : undefined;

    const nextPaymentDate = raw.disbursementDate && raw.status === 'active' ? (() => {
        const d = new Date(raw.disbursementDate);
        d.setMonth(d.getMonth() + raw.installmentsPaid + 1);
        return d.toISOString().split('T')[0];
    })() : undefined;

    const installments = raw.disbursementDate
        ? generateInstallments(financedAmount, raw.months, monthlyInstallment, raw.disbursementDate, raw.installmentsPaid, raw.daysOverdue)
        : [];

    return {
        id: `pfa-${String(idx + 1).padStart(3, '0')}`,
        applicationNumber: `PFA-${String(8800 + idx + 1).padStart(4, '0')}`,
        clientId: `cli-${String(idx + 1).padStart(3, '0')}`,
        clientName: raw.clientName,
        clientType: raw.clientType,
        clientPhone: raw.clientPhone,
        clientEmail: raw.clientEmail,
        policyId: `pol-pf-${String(idx + 1).padStart(3, '0')}`,
        policyNumber: raw.policyNumber,
        insurerName: raw.insurerName,
        insuranceType: raw.insuranceType,
        coverageType: raw.coverageType,
        totalPremium: raw.totalPremium,
        downPaymentPct: raw.downPct,
        downPayment,
        financedAmount,
        interestRateMonthly: rate,
        totalInterest,
        totalRepayment,
        monthlyInstallment,
        numberOfInstallments: raw.months,
        installmentsPaid: raw.installmentsPaid,
        amountPaid,
        outstandingBalance,
        status: raw.status,
        daysOverdue: raw.daysOverdue,
        applicationDate: raw.applicationDate,
        approvalDate: raw.approvalDate,
        disbursementDate: raw.disbursementDate,
        firstPaymentDate,
        nextPaymentDate,
        completionDate: raw.completionDate,
        financier: raw.financier,
        assignedBroker: raw.broker,
        installments,
        reason: raw.reason,
        notes: raw.notes,
        createdAt: raw.applicationDate + 'T09:00:00Z',
        updatedAt: new Date().toISOString(),
    };
});

// ─── Summary KPIs ───
export const pfSummary = (() => {
    const apps = mockPFApplications;
    const total = apps.length;

    const active = apps.filter(a => a.status === 'active').length;
    const underReview = apps.filter(a => a.status === 'under_review').length;
    const approved = apps.filter(a => a.status === 'approved').length;
    const completed = apps.filter(a => a.status === 'completed').length;
    const defaulted = apps.filter(a => a.status === 'defaulted').length;
    const cancelled = apps.filter(a => a.status === 'cancelled').length;
    const submitted = apps.filter(a => a.status === 'submitted').length;

    const activeApps = apps.filter(a => a.status === 'active' || a.status === 'completed');
    const totalFinanced = activeApps.reduce((s, a) => s + a.financedAmount, 0);
    const totalOutstanding = apps.filter(a => a.status === 'active').reduce((s, a) => s + a.outstandingBalance, 0);
    const overdueAmount = apps.filter(a => a.daysOverdue > 0).reduce((s, a) => s + a.outstandingBalance, 0);

    const collectionRate = totalFinanced > 0
        ? (activeApps.reduce((s, a) => s + a.amountPaid, 0) / activeApps.reduce((s, a) => s + a.totalRepayment, 0)) * 100
        : 0;

    return {
        total, active, underReview, approved, completed, defaulted, cancelled, submitted,
        totalFinanced, totalOutstanding, overdueAmount, collectionRate,
    };
})();
