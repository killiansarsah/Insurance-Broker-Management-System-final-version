const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const result = await p.user.updateMany({
    where: { email: 'admin@sic.com' },
    data: { twoFactorEnabled: false, twoFactorSecret: null },
  });
  console.log('Reset 2FA:', result);
  await p.$disconnect();
}

main();
