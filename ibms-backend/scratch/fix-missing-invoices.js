const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { randomBytes } = require('crypto');

async function main() {
  const clientId = '255696fb-9893-4090-9580-9423a09a6990';
  
  // Find policies for this client that have NO invoices
  const policies = await prisma.policy.findMany({
    where: { 
      clientId,
      invoices: { none: {} }
    },
    include: {
      client: true
    }
  });

  console.log(`Found ${policies.length} policies without invoices.`);

  for (const pol of policies) {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const count = await prisma.invoice.count({ where: { tenantId: pol.tenantId } });
    const hex = randomBytes(3).toString('hex').toUpperCase();
    const invoiceNumber = `INV-${dateStr}-${String(count + 1).padStart(5, '0')}-${hex}`;

    const inv = await prisma.invoice.create({
      data: {
        tenantId: pol.tenantId,
        invoiceNumber,
        clientId: pol.clientId,
        policyId: pol.id,
        amount: pol.premiumAmount,
        description: `Premium invoice for ${pol.insuranceType} insurance - Policy #${pol.policyNumber} (Retroactive fix)`,
        dateDue: pol.inceptionDate,
        status: 'OUTSTANDING',
        currency: pol.currency || 'GHS',
      }
    });
    console.log(`Created invoice ${inv.invoiceNumber} for policy ${pol.policyNumber}`);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
}).finally(() => prisma.$disconnect());
