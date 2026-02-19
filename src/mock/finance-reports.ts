// Finance Reports Mock Data

export interface MonthlyRevenue {
    month: string;
    shortMonth: string;
    premiumCollected: number;
    commissionsEarned: number;
    invoicesIssued: number;
}

export interface AgingBucket {
    label: string;
    days: string;
    amount: number;
    count: number;
    color: string;
}

export interface TopClient {
    clientId: string;
    clientName: string;
    totalPremium: number;
    policyCount: number;
    lastPayment: string;
}

export interface ProductBreakdown {
    product: string;
    premium: number;
    commission: number;
    count: number;
    color: string;
}

export const monthlyRevenue: MonthlyRevenue[] = [
    { month: 'March 2024', shortMonth: 'Mar', premiumCollected: 18500, commissionsEarned: 3145, invoicesIssued: 8 },
    { month: 'April 2024', shortMonth: 'Apr', premiumCollected: 22100, commissionsEarned: 4020, invoicesIssued: 10 },
    { month: 'May 2024', shortMonth: 'May', premiumCollected: 15300, commissionsEarned: 2601, invoicesIssued: 7 },
    { month: 'June 2024', shortMonth: 'Jun', premiumCollected: 31200, commissionsEarned: 5617, invoicesIssued: 12 },
    { month: 'July 2024', shortMonth: 'Jul', premiumCollected: 27800, commissionsEarned: 4726, invoicesIssued: 11 },
    { month: 'August 2024', shortMonth: 'Aug', premiumCollected: 19600, commissionsEarned: 3332, invoicesIssued: 9 },
    { month: 'September 2024', shortMonth: 'Sep', premiumCollected: 34500, commissionsEarned: 6210, invoicesIssued: 14 },
    { month: 'October 2024', shortMonth: 'Oct', premiumCollected: 41000, commissionsEarned: 7380, invoicesIssued: 16 },
    { month: 'November 2024', shortMonth: 'Nov', premiumCollected: 28900, commissionsEarned: 5202, invoicesIssued: 12 },
    { month: 'December 2024', shortMonth: 'Dec', premiumCollected: 52000, commissionsEarned: 9360, invoicesIssued: 20 },
    { month: 'January 2025', shortMonth: 'Jan', premiumCollected: 38400, commissionsEarned: 6912, invoicesIssued: 15 },
    { month: 'February 2025', shortMonth: 'Feb', premiumCollected: 61200, commissionsEarned: 11016, invoicesIssued: 22 },
];

export const agingBuckets: AgingBucket[] = [
    { label: 'Current (0–30 days)', days: '0–30', amount: 28800, count: 4, color: 'bg-success-500' },
    { label: '31–60 days', days: '31–60', amount: 14400, count: 3, color: 'bg-warning-400' },
    { label: '61–90 days', days: '61–90', amount: 5600, count: 2, color: 'bg-warning-600' },
    { label: 'Over 90 days', days: '90+', amount: 2600, count: 2, color: 'bg-danger-500' },
];

export const topClients: TopClient[] = [
    { clientId: 'cli-002', clientName: 'Radiance Petroleum', totalPremium: 480432, policyCount: 3, lastPayment: '2023-01-30' },
    { clientId: 'cli-012', clientName: 'Kofi Asante Holdings', totalPremium: 42000, policyCount: 1, lastPayment: '2025-02-08' },
    { clientId: 'cli-008', clientName: 'EAP Limited', totalPremium: 23660, policyCount: 1, lastPayment: '2024-01-15' },
    { clientId: 'cli-015', clientName: 'Ama Serwaa Foundation', totalPremium: 12000, policyCount: 1, lastPayment: '2025-02-19' },
    { clientId: 'cli-005', clientName: 'Nana Kwadwo Ltd', totalPremium: 15000, policyCount: 2, lastPayment: '2024-02-14' },
];

export const productBreakdown: ProductBreakdown[] = [
    { product: 'Motor Comprehensive', premium: 11730.10, commission: 1935.47, count: 2, color: 'bg-primary-500' },
    { product: 'Bonds / Performance', premium: 480000, commission: 86400, count: 1, color: 'bg-blue-500' },
    { product: 'Group Life', premium: 23660, commission: 4732, count: 1, color: 'bg-emerald-500' },
    { product: 'Marine Cargo', premium: 25000, commission: 2000, count: 1, color: 'bg-cyan-500' },
    { product: 'Life Assurance', premium: 6000, commission: 1080, count: 1, color: 'bg-violet-500' },
    { product: 'Professional Indemnity', premium: 15000, commission: 2250, count: 1, color: 'bg-amber-500' },
    { product: 'Contractors All Risk', premium: 42000, commission: 5040, count: 1, color: 'bg-orange-500' },
    { product: 'Other', premium: 23302.90, commission: 3656.29, count: 6, color: 'bg-surface-400' },
];

export const reportSummary = {
    totalPremiumYTD: monthlyRevenue.slice(-6).reduce((s, m) => s + m.premiumCollected, 0),
    totalCommissionYTD: monthlyRevenue.slice(-6).reduce((s, m) => s + m.commissionsEarned, 0),
    collectionRate: 82, // percentage
    avgDaysToCollect: 18,
    totalOutstanding: agingBuckets.reduce((s, b) => s + b.amount, 0),
    peakMonth: 'February 2025',
};
