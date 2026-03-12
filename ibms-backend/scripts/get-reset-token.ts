import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getResetToken() {
  const reset = await prisma.passwordReset.findFirst({
    where: {
      email: 'test@example.com',
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!reset) {
    console.log('❌ No valid reset token found');
    process.exit(1);
  }

  console.log('✅ Reset Token Found!\n');
  console.log('Email:', reset.email);
  console.log('Token:', reset.token);
  console.log('Expires:', reset.expiresAt);
  console.log('\n🔗 Reset URL:');
  console.log(`http://localhost:3000/reset-password?token=${reset.token}`);
  console.log('\n📋 Copy this URL and open it in your browser!');

  await prisma.$disconnect();
}

getResetToken();
