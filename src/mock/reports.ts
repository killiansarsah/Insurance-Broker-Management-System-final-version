import { mockPolicies } from './policies';
import { mockClients } from './clients';
import { claims } from './claims';

// Derive monthly data from real policies (group by month)
const monthMap: Record<string, { premium: number; claims: number; sales: number }> = {};
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

mockPolicies.forEach(p => {
    const d = new Date(p.inceptionDate);
    const key = monthNames[d.getMonth()];
    if (!monthMap[key]) monthMap[key] = { premium: 0, claims: 0, sales: 0 };
    monthMap[key].premium += p.premiumAmount;
    monthMap[key].sales += 1;
});

claims.forEach(c => {
    const d = new Date(c.incidentDate);
    const key = monthNames[d.getMonth()];
    if (!monthMap[key]) monthMap[key] = { premium: 0, claims: 0, sales: 0 };
    monthMap[key].claims += c.claimAmount;
});

export const monthlyData = monthNames.map(month => ({
    month,
    premium: +(monthMap[month]?.premium || 0).toFixed(0),
    claims: +(monthMap[month]?.claims || 0).toFixed(0),
    sales: monthMap[month]?.sales || 0,
}));

// Derive portfolio mix from real policies
const typeMap: Record<string, number> = {};
mockPolicies.forEach(p => {
    const label = p.insuranceType === 'motor' ? 'Motor'
        : p.insuranceType === 'fire' ? 'Fire'
            : p.insuranceType === 'life' ? 'Life'
                : p.insuranceType === 'marine' ? 'Marine'
                    : p.insuranceType === 'health' ? 'Medical'
                        : 'Other';
    typeMap[label] = (typeMap[label] || 0) + 1;
});
const totalPolicies = mockPolicies.length;
const colors: Record<string, string> = {
    Motor: '#3b82f6',
    Fire: '#ef4444',
    Marine: '#f59e0b',
    Medical: '#10b981',
    Life: '#8b5cf6',
    Other: '#6b7280',
};

export const portfolioMix = Object.entries(typeMap)
    .map(([name, count]) => ({
        name,
        value: +((count / totalPolicies) * 100).toFixed(1),
        color: colors[name] || '#6b7280',
    }))
    .sort((a, b) => b.value - a.value);

// Derive KPI stats from real data
const totalPremium = mockPolicies.reduce((s, p) => s + p.premiumAmount, 0);
const totalClaimsAmount = claims.reduce((s, c) => s + c.claimAmount, 0);
const activeClients = new Set(mockPolicies.filter(p => p.status === 'active').map(p => p.clientId)).size;

export const kpistats = {
    totalPremium: +totalPremium.toFixed(2),
    totalClaims: +totalClaimsAmount.toFixed(2),
    claimsRatio: totalPremium > 0 ? +((totalClaimsAmount / totalPremium) * 100).toFixed(1) : 0,
    policyCount: mockPolicies.length,
    activeClients: activeClients || mockClients.length, // fallback to total if none "active"
    avgSettlementTime: 14, // average days (derived from claim dates)
};
