// Finance Reports Mock Data — derived from real policy/commission data

import { invoices, receipts } from './finance';
import { mockCommissions } from './commissions';
import { mockPolicies } from './policies';

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

// --- Monthly Revenue (derived from real invoices & commissions) ---
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const monthlyMap: Record<string, { premium: number; commission: number; count: number }> = {};
invoices.forEach(inv => {
    const d = new Date(inv.dateIssued);
    const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`;
    if (!monthlyMap[key]) monthlyMap[key] = { premium: 0, commission: 0, count: 0 };
    monthlyMap[key].premium += inv.amount;
    monthlyMap[key].count += 1;
});
mockCommissions.forEach(c => {
    const d = new Date(c.dateEarned);
    const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`;
    if (!monthlyMap[key]) monthlyMap[key] = { premium: 0, commission: 0, count: 0 };
    monthlyMap[key].commission += c.commissionAmount;
});

export const monthlyRevenue: MonthlyRevenue[] = Object.keys(monthlyMap)
    .sort()
    .map(key => {
        const [year, monthIdx] = key.split('-').map(Number);
        return {
            month: `${monthNames[monthIdx]} ${year}`,
            shortMonth: shortMonths[monthIdx],
            premiumCollected: +monthlyMap[key].premium.toFixed(2),
            commissionsEarned: +monthlyMap[key].commission.toFixed(2),
            invoicesIssued: monthlyMap[key].count,
        };
    });

// --- Aging Buckets (derived from outstanding invoices) ---
const now = new Date('2026-01-15'); // reference date after 2025 data
const outstanding = invoices.filter(i => i.status === 'outstanding' || i.status === 'partial' || i.status === 'overdue');
const buckets = [
    { label: 'Current (0–30 days)', days: '0–30', max: 30, amount: 0, count: 0, color: 'bg-success-500' },
    { label: '31–60 days', days: '31–60', max: 60, amount: 0, count: 0, color: 'bg-warning-400' },
    { label: '61–90 days', days: '61–90', max: 90, amount: 0, count: 0, color: 'bg-warning-600' },
    { label: 'Over 90 days', days: '90+', max: Infinity, amount: 0, count: 0, color: 'bg-danger-500' },
];
outstanding.forEach(inv => {
    const due = new Date(inv.dateDue);
    const daysPast = Math.floor((now.getTime() - due.getTime()) / 86400000);
    const owed = inv.amount - inv.amountPaid;
    if (daysPast <= 30) { buckets[0].amount += owed; buckets[0].count++; }
    else if (daysPast <= 60) { buckets[1].amount += owed; buckets[1].count++; }
    else if (daysPast <= 90) { buckets[2].amount += owed; buckets[2].count++; }
    else { buckets[3].amount += owed; buckets[3].count++; }
});

export const agingBuckets: AgingBucket[] = buckets.map(b => ({
    label: b.label,
    days: b.days,
    amount: +b.amount.toFixed(2),
    count: b.count,
    color: b.color,
}));

// --- Top Clients (derived from real policies) ---
const clientPremMap: Record<string, { name: string; premium: number; count: number; lastPay: string }> = {};
mockPolicies.forEach(p => {
    if (!clientPremMap[p.clientId]) {
        clientPremMap[p.clientId] = { name: p.clientName, premium: 0, count: 0, lastPay: p.inceptionDate };
    }
    clientPremMap[p.clientId].premium += p.premiumAmount;
    clientPremMap[p.clientId].count += 1;
    if (p.inceptionDate > clientPremMap[p.clientId].lastPay) {
        clientPremMap[p.clientId].lastPay = p.inceptionDate;
    }
});

export const topClients: TopClient[] = Object.entries(clientPremMap)
    .sort(([, a], [, b]) => b.premium - a.premium)
    .slice(0, 5)
    .map(([id, data]) => ({
        clientId: id,
        clientName: data.name,
        totalPremium: +data.premium.toFixed(2),
        policyCount: data.count,
        lastPayment: data.lastPay,
    }));

// --- Product Breakdown (derived from real policies & commissions) ---
const productMap: Record<string, { premium: number; commission: number; count: number }> = {};
mockPolicies.forEach(p => {
    const label = p.coverageDetails?.split(' —')[0] || p.insuranceType;
    if (!productMap[label]) productMap[label] = { premium: 0, commission: 0, count: 0 };
    productMap[label].premium += p.premiumAmount;
    productMap[label].commission += p.commissionAmount;
    productMap[label].count += 1;
});

const prodColors = ['bg-primary-500', 'bg-blue-500', 'bg-emerald-500', 'bg-cyan-500', 'bg-violet-500', 'bg-amber-500', 'bg-orange-500', 'bg-surface-400'];

export const productBreakdown: ProductBreakdown[] = Object.entries(productMap)
    .sort(([, a], [, b]) => b.premium - a.premium)
    .slice(0, 8)
    .map(([product, data], i) => ({
        product,
        premium: +data.premium.toFixed(2),
        commission: +data.commission.toFixed(2),
        count: data.count,
        color: prodColors[i] || 'bg-surface-400',
    }));

// --- Report Summary ---
const last6 = monthlyRevenue.slice(-6);
export const reportSummary = {
    totalPremiumYTD: +last6.reduce((s, m) => s + m.premiumCollected, 0).toFixed(2),
    totalCommissionYTD: +last6.reduce((s, m) => s + m.commissionsEarned, 0).toFixed(2),
    collectionRate: invoices.length > 0
        ? +((receipts.length / invoices.length) * 100).toFixed(0)
        : 0,
    avgDaysToCollect: 18,
    totalOutstanding: +agingBuckets.reduce((s, b) => s + b.amount, 0).toFixed(2),
    peakMonth: monthlyRevenue.length > 0
        ? monthlyRevenue.reduce((best, m) => m.premiumCollected > best.premiumCollected ? m : best).month
        : 'N/A',
};
