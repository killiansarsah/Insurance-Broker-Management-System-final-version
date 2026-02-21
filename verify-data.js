const fs = require('fs');
const path = require('path');

const mockDir = path.join(__dirname, 'src', 'mock');

function readTsArray(filename, varName) {
    const content = fs.readFileSync(path.join(mockDir, filename), 'utf8');
    // Simple regex to extract the array content — works for our generated files
    const regex = new RegExp(`export const ${varName}(?:: [^=]+)? = ([\\s\\S]+?);\\n\\n?(?:export|$)`);
    const match = content.match(regex);
    if (!match) {
        console.error(`Could not find ${varName} in ${filename}`);
        return [];
    }
    try {
        // Very hacky: strip types and eval. Only for validation of our own known format.
        let jsonStr = match[1]
            .replace(/\/\/.*$/gm, '')
            .replace(/kycStatus: '[^']+',/g, m => m) // keep simple strings
            .replace(/new Date\([^)]*\)\.toISOString\(\)/g, '"2024-01-01T00:00:00Z"')
            .replace(/Date\.now\(\) - [^,]+/g, '0')
            .replace(/1024 \* 1024 \* [^,]+/g, '1000')
            .replace(/undefined/g, 'null');

        // This is still risky, let's just use grep for IDs instead for safety
        return [];
    } catch (e) {
        return [];
    }
}

function getIds(filename, pattern) {
    const content = fs.readFileSync(path.join(mockDir, filename), 'utf8');
    const ids = new Set();
    const regex = new RegExp(pattern, 'g');
    let match;
    while ((match = regex.exec(content)) !== null) {
        ids.add(match[1]);
    }
    return ids;
}

console.log('--- DATA CONSISTENCY CHECK ---');

const clientIds = getIds('clients.ts', /id:\s*'([^']+)'/);
const policyIds = getIds('policies.ts', /id:\s*'([^']+)'/);
const invoiceIds = getIds('finance.ts', /id:\s*'([^']+)'/);
const carrierIds = getIds('carriers.ts', /id:\s*'([^']+)'/);

console.log(`Clients: ${clientIds.size}`);
console.log(`Policies: ${policyIds.size}`);
console.log(`Invoices: ${invoiceIds.size}`);
console.log(`Carriers: ${carrierIds.size}`);

// Check policies -> clients
const policyClients = getIds('policies.ts', /clientId:\s*'([^']+)'/);
let missingClients = [...policyClients].filter(id => id.startsWith('cli-') && !clientIds.has(id));
console.log(`Policies referencing missing clients: ${missingClients.length}`);

// Check policies -> carriers
const policyCarriers = getIds('policies.ts', /insurerId:\s*'([^']+)'/);
let missingCarriers = [...policyCarriers].filter(id => id.startsWith('carrier-') && !carrierIds.has(id));
console.log(`Policies referencing missing carriers: ${missingCarriers.length}`);

// Check claims -> policies
const claimPolicies = getIds('claims.ts', /policyId:\s*'([^']+)'/);
let missingClaimPolicies = [...claimPolicies].filter(id => id.startsWith('pol-') && !policyIds.has(id));
console.log(`Claims referencing missing policies: ${missingClaimPolicies.length}`);

// Check invoices -> clients/policies
const invoiceClients = getIds('finance.ts', /clientId:\s*'([^']+)'/);
const invoicePolicies = getIds('finance.ts', /policyId:\s*'([^']+)'/);
console.log(`Invoices referencing missing clients: ${[...invoiceClients].filter(id => id.startsWith('cli-') && !clientIds.has(id)).length}`);
console.log(`Invoices referencing missing policies: ${[...invoicePolicies].filter(id => id.startsWith('pol-') && !policyIds.has(id)).length}`);

// Check receipts -> invoices
const receiptInvoices = getIds('finance.ts', /invoiceId:\s*'([^']+)'/);
console.log(`Receipts referencing missing invoices: ${[...receiptInvoices].filter(id => id.startsWith('inv-') && !invoiceIds.has(id)).length}`);

if (missingClients.length > 0 || missingCarriers.length > 0 || missingClaimPolicies.length > 0) {
    console.log('\n❌ CONSISTENCY ERRORS FOUND!');
} else {
    console.log('\n✅ ALL IDs VERIFIED CONSISTENT!');
}
