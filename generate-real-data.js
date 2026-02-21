/**
 * generate-real-data.js
 * 
 * Parses the real business Excel file and generates TypeScript mock data files
 * for clients, policies, commissions, finance, and claims.
 * 
 * Usage: node generate-real-data.js
 */

const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

// ============================================================
// CONFIG
// ============================================================
const EXCEL_PATH = path.join(__dirname, 'real data', 'BUSINESS PAGE 2023 (3).xlsx');
const MOCK_DIR = path.join(__dirname, 'src', 'mock');
const BROKERS = [
    { id: 'brk-001', name: 'Esi Donkor' },
    { id: 'brk-002', name: 'Kofi Asante' },
    { id: 'brk-003', name: 'Abena Nyarko' },
];

// Corporate keywords — if client name contains any of these, it's corporate
const CORPORATE_KEYWORDS = [
    'ltd', 'limited', 'authority', 'petroleum', 'agrosciences', 'logistics',
    'broker', 'bank', 'ecobank', 'fidelity', 'zenith', 'republic',
    'trade.com', 'eap', 'capp', 'dates limited', 'rachans', 'euroget',
    'agroterrum', 'tinydavid', 'rs travel', 'dezag', 'baby bundles',
    "maku's blessed", 'hair & care', 'salt to ghana', 'benjamin trade',
];

// Insurance type mapping from Excel's POLICY column to our enum
const INSURANCE_TYPE_MAP = {
    'Motor': 'motor',
    'Fire': 'fire',
    'Life': 'life',
    'Bonds': 'bonds',
    'Accident': 'liability',
    'Travel': 'travel',
};

// ============================================================
// HELPERS
// ============================================================

function excelDateToISO(val) {
    if (!val) return null;
    // If it's a number, it's an Excel serial date
    if (typeof val === 'number') {
        // Excel's epoch: Jan 1, 1900 (with the Lotus 1-2-3 bug)
        const epoch = new Date(1899, 11, 30);
        const d = new Date(epoch.getTime() + val * 86400000);
        return d.toISOString().split('T')[0];
    }
    // If it's a string like "29/01/23" or "28/01/24"
    if (typeof val === 'string') {
        const match = val.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
        if (match) {
            let [, day, month, year] = match;
            year = parseInt(year, 10);
            if (year < 100) year += 2000;
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
    }
    return null;
}

function pad(n, len = 3) {
    return String(n).padStart(len, '0');
}

function assignBroker(idx) {
    return BROKERS[idx % BROKERS.length];
}

function isCorporate(name) {
    const lower = name.toLowerCase();
    return CORPORATE_KEYWORDS.some(kw => lower.includes(kw));
}

function splitName(fullName) {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return { firstName: parts[0], lastName: '' };
    return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
}

function escapeTS(str) {
    return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function generateClientNumber(idx) {
    return `CLT-2023-${pad(idx + 1, 4)}`;
}

function daysUntil(dateStr) {
    if (!dateStr) return 0;
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    return Math.ceil(diff / (86400000));
}

// ============================================================
// PARSE EXCEL
// ============================================================
console.log('Reading Excel file...');
const wb = XLSX.readFile(EXCEL_PATH);
const ws = wb.Sheets['TOTAL OF 2023'];
const rawData = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

// Skip header row, filter empty
const rows = rawData.slice(1).filter(r => r[0] && String(r[0]).trim() !== '');
console.log(`Found ${rows.length} data rows`);

// ============================================================
// STEP 1: EXTRACT UNIQUE CLIENTS
// ============================================================
console.log('Extracting clients...');
const clientNameSet = new Set();
const clientMap = new Map(); // name -> client object

rows.forEach(r => {
    let name = String(r[0]).trim();
    // Normalize variant names
    if (name === 'Radiance Petroluem') name = 'Radiance Petroleum';
    if (name === 'MICHAEL GADZE') name = 'Michael Gadze';

    if (!clientNameSet.has(name)) {
        clientNameSet.add(name);
        const idx = clientNameSet.size;
        const broker = assignBroker(idx);
        const corporate = isCorporate(name);
        const { firstName, lastName } = corporate ? { firstName: undefined, lastName: undefined } : splitName(name);

        clientMap.set(name, {
            id: `cli-${pad(idx)}`,
            clientNumber: generateClientNumber(idx - 1),
            type: corporate ? 'corporate' : 'individual',
            status: 'active',
            companyName: corporate ? name : undefined,
            firstName,
            lastName,
            phone: `+23320${pad(1000000 + idx * 1111, 7)}`,
            email: corporate
                ? `info@${name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 15)}.com`
                : `${(firstName || 'user').toLowerCase()}.${(lastName || '').split(' ')[0].toLowerCase()}@email.com`,
            region: 'Greater Accra',
            city: 'Accra',
            kycStatus: 'verified',
            amlRiskLevel: 'low',
            isPep: false,
            eddRequired: false,
            assignedBrokerId: broker.id,
            assignedBrokerName: broker.name,
            totalPolicies: 0,
            totalPremium: 0,
            activePolicies: 0,
            createdAt: '2023-01-01T08:00:00Z',
            updatedAt: '2023-12-31T17:00:00Z',
        });
    }
});

console.log(`Unique clients: ${clientMap.size}`);

// ============================================================
// STEP 2: BUILD POLICIES (deduplicate by policy number)
// ============================================================
console.log('Building policies...');
const policyMap = new Map(); // policyNumber -> policy object
let polIdx = 0;

rows.forEach(r => {
    let clientName = String(r[0]).trim();
    if (clientName === 'Radiance Petroluem') clientName = 'Radiance Petroleum';
    if (clientName === 'MICHAEL GADZE') clientName = 'Michael Gadze';

    const policyNum = String(r[4]).trim();
    if (!policyNum) return; // Skip rows with no policy number

    const client = clientMap.get(clientName);
    if (!client) return;

    const insurerName = String(r[1]).trim();
    const policyCategory = String(r[2]).trim();
    const policyType = String(r[3]).trim();
    const rate = parseFloat(r[5]) || 0;
    const premium = parseFloat(r[6]) || 0;
    const grossComm = parseFloat(r[7]) || 0;
    const inceptionDate = excelDateToISO(r[11]);
    const expiryDate = excelDateToISO(r[12]);
    const vehicleOrLoc = String(r[13]).trim();
    const sumInsured = parseFloat(r[14]) || 0;

    const insuranceType = INSURANCE_TYPE_MAP[policyCategory] || 'motor';

    if (!policyMap.has(policyNum)) {
        polIdx++;
        const broker = assignBroker(polIdx);
        const dte = daysUntil(expiryDate);

        let status = 'active';
        if (dte < 0) status = 'expired';
        else if (dte <= 30) status = 'active'; // expiring soon but still active

        policyMap.set(policyNum, {
            id: `pol-${pad(polIdx)}`,
            policyNumber: policyNum,
            status,
            insuranceType,
            clientId: client.id,
            clientName: client.companyName || `${client.firstName} ${client.lastName}`.trim(),
            insurerName,
            insurerId: `ins-${pad(policyMap.size + 1)}`,
            brokerId: broker.id,
            brokerName: broker.name,
            inceptionDate: inceptionDate || '2023-01-01',
            expiryDate: expiryDate || '2024-01-01',
            issueDate: inceptionDate || '2023-01-01',
            sumInsured,
            premiumAmount: premium,
            commissionRate: +(rate * 100).toFixed(1),
            commissionAmount: +grossComm.toFixed(2),
            currency: 'GHS',
            coverageDetails: `${policyType}${vehicleOrLoc ? ' — ' + vehicleOrLoc : ''}`,
            isRenewal: false,
            daysToExpiry: Math.max(0, dte),
            createdAt: (inceptionDate || '2023-01-01') + 'T10:00:00Z',
            updatedAt: (inceptionDate || '2023-01-01') + 'T10:00:00Z',
        });

        // Update client counts
        client.totalPolicies++;
        client.totalPremium += premium;
        if (status === 'active') client.activePolicies++;
    } else {
        // Same policy number but different vehicle — append vehicle to coverage
        const existing = policyMap.get(policyNum);
        if (vehicleOrLoc && !existing.coverageDetails.includes(vehicleOrLoc)) {
            existing.coverageDetails += `, ${vehicleOrLoc}`;
        }
        // Accumulate premium if it's different sub-lines
        // (Don't add — same policy number means same premium in this dataset)
    }
});

const policies = Array.from(policyMap.values());
console.log(`Unique policies: ${policies.length}`);

// Normalize insurer IDs — map each unique insurer name to a stable ID
const insurerNames = [...new Set(policies.map(p => p.insurerName))];
const insurerIdMap = {};
insurerNames.forEach((name, i) => { insurerIdMap[name] = `ins-${pad(i + 1)}`; });
policies.forEach(p => { p.insurerId = insurerIdMap[p.insurerName]; });

// ============================================================
// STEP 3: DERIVE COMMISSIONS
// ============================================================
console.log('Deriving commissions...');
const commissions = policies.filter(p => p.commissionAmount > 0).map((p, i) => {
    const status = Math.random() > 0.3 ? 'paid' : 'pending';
    return {
        id: `com-${pad(i + 1)}`,
        policyId: p.id,
        policyNumber: p.policyNumber,
        clientId: p.clientId,
        clientName: p.clientName,
        productType: p.coverageDetails.split(' — ')[0] || p.insuranceType,
        premiumAmount: p.premiumAmount,
        commissionRate: p.commissionRate,
        commissionAmount: p.commissionAmount,
        nicLevy: +(p.commissionAmount * 0.075).toFixed(2),
        netCommission: +(p.commissionAmount * 0.925).toFixed(2),
        insurerName: p.insurerName,
        status,
        brokerName: p.brokerName,
        dateEarned: p.inceptionDate,
        datePolicyIssued: p.issueDate,
        datePaid: status === 'paid' ? p.inceptionDate : undefined,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
    };
});

// Build commissionSummary
const totalEarned = commissions.reduce((s, c) => s + c.commissionAmount, 0);
const totalPaid = commissions.filter(c => c.status === 'paid').reduce((s, c) => s + c.commissionAmount, 0);
const totalPending = commissions.filter(c => c.status === 'pending').reduce((s, c) => s + c.commissionAmount, 0);
const commissionSummaryData = {
    totalEarned: +totalEarned.toFixed(2),
    totalPaid: +totalPaid.toFixed(2),
    totalPending: +totalPending.toFixed(2),
    totalClawback: 0,
    avgRate: +(commissions.reduce((s, c) => s + c.commissionRate, 0) / commissions.length).toFixed(1),
    count: commissions.length,
};

// Build commissionsByBroker
const brokerMap = {};
commissions.forEach(c => {
    if (!brokerMap[c.brokerName]) {
        brokerMap[c.brokerName] = { broker: c.brokerName, total: 0, paid: 0, pending: 0, count: 0 };
    }
    brokerMap[c.brokerName].total += c.commissionAmount;
    brokerMap[c.brokerName].count++;
    if (c.status === 'paid') brokerMap[c.brokerName].paid += c.commissionAmount;
    else brokerMap[c.brokerName].pending += c.commissionAmount;
});
// Round values
Object.values(brokerMap).forEach(b => {
    b.total = +b.total.toFixed(2);
    b.paid = +b.paid.toFixed(2);
    b.pending = +b.pending.toFixed(2);
});

// ============================================================
// STEP 4: DERIVE INVOICES & RECEIPTS
// ============================================================
console.log('Deriving finance data...');
const invoices = policies.map((p, i) => {
    const isPaid = Math.random() > 0.25;
    const isOverdue = !isPaid && Math.random() > 0.5;
    return {
        id: `inv-${pad(i + 1)}`,
        invoiceNumber: `INV-2023-${pad(i + 1)}`,
        clientId: p.clientId,
        clientName: p.clientName,
        policyId: p.id,
        policyNumber: p.policyNumber,
        description: `${p.coverageDetails.split(' — ')[0] || p.insuranceType} Premium`,
        amount: p.premiumAmount,
        amountPaid: isPaid ? p.premiumAmount : 0,
        status: isPaid ? 'paid' : (isOverdue ? 'overdue' : 'outstanding'),
        dateIssued: p.inceptionDate,
        dateDue: p.expiryDate,
        datePaid: isPaid ? p.inceptionDate : undefined,
        currency: 'GHS',
    };
});

const receipts = invoices.filter(inv => inv.status === 'paid').map((inv, i) => ({
    id: `rec-${pad(i + 1)}`,
    receiptNumber: `REC-2023-${pad(i + 1)}`,
    invoiceId: inv.id,
    invoiceNumber: inv.invoiceNumber,
    clientId: inv.clientId,
    clientName: inv.clientName,
    policyId: inv.policyId,
    policyNumber: inv.policyNumber,
    amount: inv.amount,
    currency: 'GHS',
    paymentMethod: ['bank_transfer', 'mobile_money', 'cheque'][i % 3],
    reference: `PAY-${pad(i + 1)}-2023`,
    dateReceived: inv.dateIssued,
}));

// ============================================================
// STEP 5: DERIVE CLAIMS (~15% of policies)
// ============================================================
console.log('Generating claims...');
const claimPolicies = policies.filter(() => Math.random() < 0.15);
const claimsData = claimPolicies.map((p, i) => {
    const statuses = ['intimated', 'registered', 'under_review', 'assessed', 'approved', 'settled', 'rejected', 'closed'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const claimAmount = Math.floor(p.premiumAmount * (0.5 + Math.random() * 3));
    const incidentDate = p.inceptionDate;
    const reportDate = new Date(new Date(incidentDate).getTime() + Math.random() * 10 * 86400000).toISOString();

    return {
        id: `CLM-2023-${pad(i + 1, 4)}`,
        policyId: p.id,
        policyNumber: p.policyNumber,
        insuranceType: p.insuranceType,
        clientId: p.clientId,
        clientName: p.clientName,
        claimNumber: `CLM-2023-${pad(i + 1, 4)}`,
        incidentDate,
        incidentDescription: p.insuranceType === 'motor'
            ? 'Vehicle collision — damage to front bumper and bonnet'
            : p.insuranceType === 'fire'
                ? 'Fire outbreak at insured premises — partial damage to structure'
                : p.insuranceType === 'life'
                    ? 'Death benefit claim submitted by beneficiary'
                    : 'General loss reported — assessment pending',
        incidentLocation: 'Accra, Ghana',
        status,
        claimAmount,
        assessedAmount: ['assessed', 'approved', 'settled'].includes(status) ? +(claimAmount * 0.9).toFixed(2) : undefined,
        settledAmount: status === 'settled' ? +(claimAmount * 0.85).toFixed(2) : undefined,
        currency: 'GHS',
        intimationDate: reportDate,
        registrationDate: status !== 'intimated' ? reportDate : undefined,
        acknowledgmentDeadline: new Date(new Date(reportDate).getTime() + 5 * 86400000).toISOString(),
        processingDeadline: new Date(new Date(reportDate).getTime() + 30 * 86400000).toISOString(),
        isOverdue: false,
        createdAt: reportDate,
        updatedAt: reportDate,
    };
});

// ============================================================
// STEP 6: WRITE FILES
// ============================================================
console.log('Writing TypeScript files...');

// --- clients.ts ---
const clientsArr = Array.from(clientMap.values());
let clientsTS = `import { Client } from '@/types';\n\nexport const mockClients: Client[] = [\n`;
clientsArr.forEach(c => {
    clientsTS += `    {\n`;
    clientsTS += `        id: '${c.id}',\n`;
    clientsTS += `        clientNumber: '${c.clientNumber}',\n`;
    clientsTS += `        type: '${c.type}',\n`;
    clientsTS += `        status: '${c.status}',\n`;
    if (c.companyName) clientsTS += `        companyName: '${escapeTS(c.companyName)}',\n`;
    if (c.firstName) clientsTS += `        firstName: '${escapeTS(c.firstName)}',\n`;
    if (c.lastName) clientsTS += `        lastName: '${escapeTS(c.lastName)}',\n`;
    clientsTS += `        phone: '${c.phone}',\n`;
    clientsTS += `        email: '${c.email}',\n`;
    clientsTS += `        region: '${c.region}',\n`;
    clientsTS += `        city: '${c.city}',\n`;
    clientsTS += `        kycStatus: '${c.kycStatus}',\n`;
    clientsTS += `        amlRiskLevel: '${c.amlRiskLevel}',\n`;
    clientsTS += `        isPep: ${c.isPep},\n`;
    clientsTS += `        eddRequired: ${c.eddRequired},\n`;
    clientsTS += `        assignedBrokerId: '${c.assignedBrokerId}',\n`;
    clientsTS += `        assignedBrokerName: '${c.assignedBrokerName}',\n`;
    clientsTS += `        totalPolicies: ${c.totalPolicies},\n`;
    clientsTS += `        totalPremium: ${c.totalPremium},\n`;
    clientsTS += `        activePolicies: ${c.activePolicies},\n`;
    clientsTS += `        createdAt: '${c.createdAt}',\n`;
    clientsTS += `        updatedAt: '${c.updatedAt}',\n`;
    clientsTS += `    },\n`;
});
clientsTS += `];\n\n`;
clientsTS += `export function getClientById(id: string): Client | undefined {\n`;
clientsTS += `    return mockClients.find((c) => c.id === id);\n`;
clientsTS += `}\n\n`;
clientsTS += `export function getClientDisplayName(client: Client): string {\n`;
clientsTS += `    if (client.type === 'corporate') return client.companyName || '';\n`;
clientsTS += `    return \`\${client.firstName || ''} \${client.lastName || ''}\`.trim();\n`;
clientsTS += `}\n`;

fs.writeFileSync(path.join(MOCK_DIR, 'clients.ts'), clientsTS, 'utf8');
console.log(`  clients.ts — ${clientsArr.length} clients`);

// --- policies.ts ---
let policiesTS = `import { Policy } from '@/types';\n\nexport const mockPolicies: Policy[] = [\n`;
policies.forEach(p => {
    policiesTS += `    {\n`;
    policiesTS += `        id: '${p.id}',\n`;
    policiesTS += `        policyNumber: '${escapeTS(p.policyNumber)}',\n`;
    policiesTS += `        status: '${p.status}',\n`;
    policiesTS += `        insuranceType: '${p.insuranceType}',\n`;
    policiesTS += `        clientId: '${p.clientId}',\n`;
    policiesTS += `        clientName: '${escapeTS(p.clientName)}',\n`;
    policiesTS += `        insurerName: '${escapeTS(p.insurerName)}',\n`;
    policiesTS += `        insurerId: '${p.insurerId}',\n`;
    policiesTS += `        brokerId: '${p.brokerId}',\n`;
    policiesTS += `        brokerName: '${p.brokerName}',\n`;
    policiesTS += `        inceptionDate: '${p.inceptionDate}',\n`;
    policiesTS += `        expiryDate: '${p.expiryDate}',\n`;
    policiesTS += `        issueDate: '${p.issueDate}',\n`;
    policiesTS += `        sumInsured: ${p.sumInsured},\n`;
    policiesTS += `        premiumAmount: ${p.premiumAmount},\n`;
    policiesTS += `        commissionRate: ${p.commissionRate},\n`;
    policiesTS += `        commissionAmount: ${p.commissionAmount},\n`;
    policiesTS += `        currency: '${p.currency}',\n`;
    policiesTS += `        coverageDetails: '${escapeTS(p.coverageDetails)}',\n`;
    policiesTS += `        isRenewal: ${p.isRenewal},\n`;
    policiesTS += `        daysToExpiry: ${p.daysToExpiry},\n`;
    policiesTS += `        createdAt: '${p.createdAt}',\n`;
    policiesTS += `        updatedAt: '${p.updatedAt}',\n`;
    policiesTS += `    },\n`;
});
policiesTS += `];\n\n`;
policiesTS += `export function getPolicyById(id: string): Policy | undefined {\n`;
policiesTS += `    return mockPolicies.find((p) => p.id === id);\n`;
policiesTS += `}\n\n`;
policiesTS += `export function getPoliciesByClientId(clientId: string): Policy[] {\n`;
policiesTS += `    return mockPolicies.filter((p) => p.clientId === clientId);\n`;
policiesTS += `}\n\n`;
policiesTS += `export const policies = mockPolicies;\n`;

fs.writeFileSync(path.join(MOCK_DIR, 'policies.ts'), policiesTS, 'utf8');
console.log(`  policies.ts — ${policies.length} policies`);

// --- commissions.ts ---
// Build commission interface inline since it's not in @/types
let commissionsTS = `export interface Commission {\n`;
commissionsTS += `    id: string;\n    policyId: string;\n    policyNumber: string;\n`;
commissionsTS += `    clientId: string;\n    clientName: string;\n    productType: string;\n`;
commissionsTS += `    premiumAmount: number;\n    commissionRate: number;\n    commissionAmount: number;\n`;
commissionsTS += `    nicLevy: number;\n    netCommission: number;\n    insurerName: string;\n`;
commissionsTS += `    status: 'paid' | 'pending' | 'earned' | 'clawback';\n    brokerName: string;\n`;
commissionsTS += `    dateEarned: string;\n    datePolicyIssued: string;\n    datePaid?: string;\n`;
commissionsTS += `    createdAt: string;\n    updatedAt: string;\n}\n\n`;
commissionsTS += `export const mockCommissions: Commission[] = [\n`;
commissions.forEach(c => {
    commissionsTS += `    {\n`;
    commissionsTS += `        id: '${c.id}',\n`;
    commissionsTS += `        policyId: '${c.policyId}',\n`;
    commissionsTS += `        policyNumber: '${escapeTS(c.policyNumber)}',\n`;
    commissionsTS += `        clientId: '${c.clientId}',\n`;
    commissionsTS += `        clientName: '${escapeTS(c.clientName)}',\n`;
    commissionsTS += `        productType: '${escapeTS(c.productType)}',\n`;
    commissionsTS += `        premiumAmount: ${c.premiumAmount},\n`;
    commissionsTS += `        commissionRate: ${c.commissionRate},\n`;
    commissionsTS += `        commissionAmount: ${c.commissionAmount},\n`;
    commissionsTS += `        nicLevy: ${c.nicLevy},\n`;
    commissionsTS += `        netCommission: ${c.netCommission},\n`;
    commissionsTS += `        insurerName: '${escapeTS(c.insurerName)}',\n`;
    commissionsTS += `        status: '${c.status}',\n`;
    commissionsTS += `        brokerName: '${c.brokerName}',\n`;
    commissionsTS += `        dateEarned: '${c.dateEarned}',\n`;
    commissionsTS += `        datePolicyIssued: '${c.datePolicyIssued}',\n`;
    if (c.datePaid) commissionsTS += `        datePaid: '${c.datePaid}',\n`;
    commissionsTS += `        createdAt: '${c.createdAt}',\n`;
    commissionsTS += `        updatedAt: '${c.updatedAt}',\n`;
    commissionsTS += `    },\n`;
});
commissionsTS += `];\n\nexport const commissions = mockCommissions;\n\n`;

// commissionSummary
commissionsTS += `export const commissionSummary = {\n`;
commissionsTS += `    totalEarned: ${commissionSummaryData.totalEarned},\n`;
commissionsTS += `    totalPaid: ${commissionSummaryData.totalPaid},\n`;
commissionsTS += `    totalPending: ${commissionSummaryData.totalPending},\n`;
commissionsTS += `    totalClawback: ${commissionSummaryData.totalClawback},\n`;
commissionsTS += `    avgRate: ${commissionSummaryData.avgRate},\n`;
commissionsTS += `    count: ${commissionSummaryData.count},\n`;
commissionsTS += `};\n\n`;

// commissionsByBroker
commissionsTS += `export const commissionsByBroker: Record<string, { broker: string; total: number; paid: number; pending: number; count: number }> = {\n`;
Object.entries(brokerMap).forEach(([name, b]) => {
    commissionsTS += `    '${escapeTS(name)}': { broker: '${escapeTS(b.broker)}', total: ${b.total}, paid: ${b.paid}, pending: ${b.pending}, count: ${b.count} },\n`;
});
commissionsTS += `};\n`;

fs.writeFileSync(path.join(MOCK_DIR, 'commissions.ts'), commissionsTS, 'utf8');
console.log(`  commissions.ts — ${commissions.length} commissions`);

// --- finance.ts ---
let financeTS = `export interface Invoice {\n`;
financeTS += `    id: string;\n    invoiceNumber: string;\n    clientId: string;\n    clientName: string;\n`;
financeTS += `    policyId: string;\n    policyNumber: string;\n    description: string;\n`;
financeTS += `    amount: number;\n    amountPaid: number;\n`;
financeTS += `    status: 'paid' | 'outstanding' | 'overdue' | 'partial' | 'cancelled';\n`;
financeTS += `    dateIssued: string;\n    dateDue: string;\n    datePaid?: string;\n`;
financeTS += `    currency: 'GHS' | 'USD' | 'EUR';\n    notes?: string;\n}\n\n`;

financeTS += `export interface PaymentReceipt {\n`;
financeTS += `    id: string;\n    receiptNumber: string;\n    invoiceId?: string;\n    invoiceNumber?: string;\n`;
financeTS += `    clientId: string;\n    clientName: string;\n    policyId?: string;\n    policyNumber?: string;\n`;
financeTS += `    amount: number;\n    currency: 'GHS' | 'USD' | 'EUR';\n`;
financeTS += `    paymentMethod: 'bank_transfer' | 'mobile_money' | 'cash' | 'cheque' | 'card';\n`;
financeTS += `    reference: string;\n    dateReceived: string;\n    notes?: string;\n}\n\n`;

financeTS += `export const invoices: Invoice[] = [\n`;
invoices.forEach(inv => {
    financeTS += `    {\n`;
    financeTS += `        id: '${inv.id}',\n`;
    financeTS += `        invoiceNumber: '${inv.invoiceNumber}',\n`;
    financeTS += `        clientId: '${inv.clientId}',\n`;
    financeTS += `        clientName: '${escapeTS(inv.clientName)}',\n`;
    financeTS += `        policyId: '${inv.policyId}',\n`;
    financeTS += `        policyNumber: '${escapeTS(inv.policyNumber)}',\n`;
    financeTS += `        description: '${escapeTS(inv.description)}',\n`;
    financeTS += `        amount: ${inv.amount},\n`;
    financeTS += `        amountPaid: ${inv.amountPaid},\n`;
    financeTS += `        status: '${inv.status}',\n`;
    financeTS += `        dateIssued: '${inv.dateIssued}',\n`;
    financeTS += `        dateDue: '${inv.dateDue}',\n`;
    if (inv.datePaid) financeTS += `        datePaid: '${inv.datePaid}',\n`;
    financeTS += `        currency: '${inv.currency}',\n`;
    financeTS += `    },\n`;
});
financeTS += `];\n\n`;

financeTS += `export const receipts: PaymentReceipt[] = [\n`;
receipts.forEach(rec => {
    financeTS += `    {\n`;
    financeTS += `        id: '${rec.id}',\n`;
    financeTS += `        receiptNumber: '${rec.receiptNumber}',\n`;
    financeTS += `        invoiceId: '${rec.invoiceId}',\n`;
    financeTS += `        invoiceNumber: '${rec.invoiceNumber}',\n`;
    financeTS += `        clientId: '${rec.clientId}',\n`;
    financeTS += `        clientName: '${escapeTS(rec.clientName)}',\n`;
    financeTS += `        policyId: '${rec.policyId}',\n`;
    financeTS += `        policyNumber: '${escapeTS(rec.policyNumber)}',\n`;
    financeTS += `        amount: ${rec.amount},\n`;
    financeTS += `        currency: '${rec.currency}',\n`;
    financeTS += `        paymentMethod: '${rec.paymentMethod}',\n`;
    financeTS += `        reference: '${rec.reference}',\n`;
    financeTS += `        dateReceived: '${rec.dateReceived}',\n`;
    financeTS += `    },\n`;
});
financeTS += `];\n\n`;

financeTS += `export const financeSummary = {\n`;
financeTS += `    totalRevenue: invoices.reduce((s, inv) => s + inv.amount, 0),\n`;
financeTS += `    outstanding: invoices.filter(i => i.status === 'outstanding' || i.status === 'partial').reduce((s, i) => s + (i.amount - i.amountPaid), 0),\n`;
financeTS += `    overdue: invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + (i.amount - i.amountPaid), 0),\n`;
financeTS += `    collected: receipts.reduce((s, r) => s + r.amount, 0),\n`;
financeTS += `    invoiceCount: invoices.length,\n`;
financeTS += `    paidCount: invoices.filter(i => i.status === 'paid').length,\n`;
financeTS += `};\n`;

fs.writeFileSync(path.join(MOCK_DIR, 'finance.ts'), financeTS, 'utf8');
console.log(`  finance.ts — ${invoices.length} invoices, ${receipts.length} receipts`);

// --- claims.ts ---
let claimsTS = `import { Claim } from '@/types';\n\nexport const claims: Claim[] = [\n`;
claimsData.forEach(c => {
    claimsTS += `    {\n`;
    claimsTS += `        id: '${c.id}',\n`;
    claimsTS += `        claimNumber: '${c.claimNumber}',\n`;
    claimsTS += `        status: '${c.status}',\n`;
    claimsTS += `        policyId: '${c.policyId}',\n`;
    claimsTS += `        policyNumber: '${escapeTS(c.policyNumber)}',\n`;
    claimsTS += `        insuranceType: '${c.insuranceType}',\n`;
    claimsTS += `        clientId: '${c.clientId}',\n`;
    claimsTS += `        clientName: '${escapeTS(c.clientName)}',\n`;
    claimsTS += `        incidentDate: '${c.incidentDate}',\n`;
    claimsTS += `        incidentDescription: '${escapeTS(c.incidentDescription)}',\n`;
    claimsTS += `        incidentLocation: '${c.incidentLocation}',\n`;
    claimsTS += `        claimAmount: ${c.claimAmount},\n`;
    if (c.assessedAmount !== undefined) claimsTS += `        assessedAmount: ${c.assessedAmount},\n`;
    if (c.settledAmount !== undefined) claimsTS += `        settledAmount: ${c.settledAmount},\n`;
    claimsTS += `        currency: '${c.currency}',\n`;
    claimsTS += `        intimationDate: '${c.intimationDate}',\n`;
    if (c.registrationDate) claimsTS += `        registrationDate: '${c.registrationDate}',\n`;
    claimsTS += `        acknowledgmentDeadline: '${c.acknowledgmentDeadline}',\n`;
    claimsTS += `        processingDeadline: '${c.processingDeadline}',\n`;
    claimsTS += `        isOverdue: ${c.isOverdue},\n`;
    claimsTS += `        createdAt: '${c.createdAt}',\n`;
    claimsTS += `        updatedAt: '${c.updatedAt}',\n`;
    claimsTS += `    },\n`;
});
claimsTS += `];\n`;

fs.writeFileSync(path.join(MOCK_DIR, 'claims.ts'), claimsTS, 'utf8');
console.log(`  claims.ts — ${claimsData.length} claims`);

// ============================================================
// DONE
// ============================================================
console.log('\n✅ All mock data files generated from real data!');
console.log(`   Clients: ${clientsArr.length}`);
console.log(`   Policies: ${policies.length}`);
console.log(`   Commissions: ${commissions.length}`);
console.log(`   Invoices: ${invoices.length}`);
console.log(`   Receipts: ${receipts.length}`);
console.log(`   Claims: ${claimsData.length}`);
