import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function setupTestData() {
  console.log('🔍 Checking existing data...\n');

  let tenant = await prisma.tenant.findFirst({
    where: { slug: 'acme' },
  });

  if (!tenant) {
    console.log('Creating test tenant: acme');
    tenant = await prisma.tenant.create({
      data: {
        name: 'ACME Insurance',
        slug: 'acme',
        isActive: true,
      },
    });
  } else {
    console.log('✅ Tenant exists:', tenant.name);
  }

  let user = await prisma.user.findFirst({
    where: {
      tenantId: tenant.id,
      email: 'test@example.com',
    },
  });

  if (!user) {
    console.log('Creating test user: test@example.com');
    const passwordHash = await bcrypt.hash('password123', 12);
    user = await prisma.user.create({
      data: {
        tenantId: tenant.id,
        email: 'test@example.com',
        passwordHash,
        firstName: 'Test',
        lastName: 'User',
        role: 'BROKER',
        isActive: true,
      },
    });
  } else {
    console.log('✅ Test user exists:', user.email);
  }

  console.log('\n📧 Test Email Setup:');
  console.log('-------------------');
  console.log('Email:', user.email);
  console.log('Tenant Slug:', tenant.slug);
  console.log('\n🧪 Test Command:');
  console.log('curl -X POST http://localhost:3001/api/v1/auth/forgot-password -H "Content-Type: application/json" -d "{\\"email\\":\\"test@example.com\\",\\"tenantSlug\\":\\"acme\\"}"');
  console.log('\n📬 View emails at:');
  console.log('https://testmail.app/inbox/t3t75/test');

  await prisma.$disconnect();
}

setupTestData().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
