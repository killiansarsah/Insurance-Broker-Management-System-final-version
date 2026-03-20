const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const claims = await prisma.claim.findMany({ take: 1 });
  if (!claims.length) return console.log('No claims');
  const claim = claims[0];
  console.log('Claim:', claim.id);
  try {
    const doc = await prisma.claimDocument.create({
      data: {
        tenantId: claim.tenantId,
        claimId: claim.id,
        name: 'test.pdf',
        type: 'EVIDENCE',
        url: 'blob:localhost/123',
        uploadedBy: claim.clientId
      }
    });
    console.log('Doc attached:', doc.id);
  } catch(e) { console.error('Error:', e); }
}
main().finally(() => prisma.$disconnect());
