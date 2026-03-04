import { PrismaClient, TenantPlan, UserRole, CarrierType, InsuranceType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Seeding database...\n');

  // ─── Hash password ────────────────────────────
  const passwordHash = await bcrypt.hash('Admin@123', 12);

  // ─── TENANTS ──────────────────────────────────
  const sicTenant = await prisma.tenant.upsert({
    where: { slug: 'sic-insurance' },
    update: {},
    create: {
      name: 'SIC Insurance',
      slug: 'sic-insurance',
      nicLicense: 'NIC/BRK/2024/001',
      plan: TenantPlan.PROFESSIONAL,
      email: 'info@sic-insurance.com',
      phone: '+233302661234',
      address: 'No. 28 Ring Road East, Osu, Accra',
      primaryColor: '#1E40AF',
    },
  });

  const enterpriseTenant = await prisma.tenant.upsert({
    where: { slug: 'enterprise-insurance' },
    update: {},
    create: {
      name: 'Enterprise Insurance',
      slug: 'enterprise-insurance',
      nicLicense: 'NIC/BRK/2024/002',
      plan: TenantPlan.BASIC,
      email: 'info@enterprise-insurance.com',
      phone: '+233302771234',
      address: 'No. 15 Independence Ave, Accra',
      primaryColor: '#059669',
    },
  });

  console.log(`✅ Tenants: ${sicTenant.name}, ${enterpriseTenant.name}`);

  // ─── BRANCHES ─────────────────────────────────
  const branchData = [
    { name: 'Accra Main Branch', code: 'BR-ACC-01', address: 'Ring Road East, Osu, Accra' },
    { name: 'Kumasi Branch', code: 'BR-KUM-01', address: 'Adum, Kumasi' },
    { name: 'Takoradi Branch', code: 'BR-TAK-01', address: 'Market Circle, Takoradi' },
  ];

  for (const tenant of [sicTenant, enterpriseTenant]) {
    for (const branch of branchData) {
      await prisma.branch.upsert({
        where: {
          tenantId_code: { tenantId: tenant.id, code: branch.code },
        },
        update: {},
        create: {
          tenantId: tenant.id,
          name: branch.name,
          code: branch.code,
          address: branch.address,
        },
      });
    }
  }

  console.log('✅ Branches: 3 per tenant (6 total)');

  // ─── Get Accra branch for admin users ─────────
  const sicAccraBranch = await prisma.branch.findFirst({
    where: { tenantId: sicTenant.id, code: 'BR-ACC-01' },
  });
  const enterpriseAccraBranch = await prisma.branch.findFirst({
    where: { tenantId: enterpriseTenant.id, code: 'BR-ACC-01' },
  });

  // ─── ADMIN USERS ──────────────────────────────
  await prisma.user.upsert({
    where: {
      tenantId_email: { tenantId: sicTenant.id, email: 'admin@sic.com' },
    },
    update: {},
    create: {
      tenantId: sicTenant.id,
      email: 'admin@sic.com',
      passwordHash,
      firstName: 'SIC',
      lastName: 'Admin',
      phone: '+233244000001',
      role: UserRole.TENANT_ADMIN,
      branchId: sicAccraBranch?.id,
      isActive: true,
    },
  });

  await prisma.user.upsert({
    where: {
      tenantId_email: { tenantId: enterpriseTenant.id, email: 'admin@enterprise.com' },
    },
    update: {},
    create: {
      tenantId: enterpriseTenant.id,
      email: 'admin@enterprise.com',
      passwordHash,
      firstName: 'Enterprise',
      lastName: 'Admin',
      phone: '+233244000002',
      role: UserRole.TENANT_ADMIN,
      branchId: enterpriseAccraBranch?.id,
      isActive: true,
    },
  });

  console.log('✅ Admin users: admin@sic.com, admin@enterprise.com (password: Admin@123)');

  // ─── CARRIERS ─────────────────────────────────
  const carrierData: Array<{
    name: string;
    shortName: string;
    slug: string;
    type: CarrierType;
    brandColor: string;
    website: string;
  }> = [
    {
      name: 'Prime Insurance Company',
      shortName: 'PRIME',
      slug: 'prime-insurance',
      type: CarrierType.NON_LIFE,
      brandColor: '#DC2626',
      website: 'https://primeinsurance.com.gh',
    },
    {
      name: 'SIC Insurance Company',
      shortName: 'SIC',
      slug: 'sic-insurance-carrier',
      type: CarrierType.NON_LIFE,
      brandColor: '#1E40AF',
      website: 'https://sicinsurance.com.gh',
    },
    {
      name: 'Enterprise Insurance Company',
      shortName: 'ENTERPRISE',
      slug: 'enterprise-insurance-carrier',
      type: CarrierType.NON_LIFE,
      brandColor: '#059669',
      website: 'https://enterpriseinsurance.com.gh',
    },
    {
      name: 'Glico General Insurance',
      shortName: 'GLICO',
      slug: 'glico-general',
      type: CarrierType.NON_LIFE,
      brandColor: '#7C3AED',
      website: 'https://glicogeneral.com.gh',
    },
    {
      name: 'Star Assurance Company',
      shortName: 'STAR',
      slug: 'star-assurance',
      type: CarrierType.NON_LIFE,
      brandColor: '#F59E0B',
      website: 'https://starassurance.com.gh',
    },
  ];

  // 3 products per carrier
  const productTemplates: Array<{
    name: string;
    codeSuffix: string;
    insuranceType: InsuranceType;
    commissionRate: number;
    description: string;
  }> = [
    {
      name: 'Comprehensive Motor Insurance',
      codeSuffix: 'MOT-COMP',
      insuranceType: InsuranceType.MOTOR,
      commissionRate: 15.0,
      description: 'Full comprehensive motor vehicle cover including third party, fire and theft',
    },
    {
      name: 'Fire & Allied Perils',
      codeSuffix: 'FIRE-AP',
      insuranceType: InsuranceType.FIRE,
      commissionRate: 20.0,
      description: 'Protection against fire, lightning, explosion and allied perils',
    },
    {
      name: 'Marine Cargo Insurance',
      codeSuffix: 'MAR-CRG',
      insuranceType: InsuranceType.MARINE,
      commissionRate: 17.5,
      description: 'Coverage for goods in transit by sea, air or land',
    },
  ];

  for (const tenant of [sicTenant, enterpriseTenant]) {
    for (const carrier of carrierData) {
      const createdCarrier = await prisma.carrier.upsert({
        where: {
          tenantId_slug: { tenantId: tenant.id, slug: carrier.slug },
        },
        update: {},
        create: {
          tenantId: tenant.id,
          name: carrier.name,
          shortName: carrier.shortName,
          slug: carrier.slug,
          type: carrier.type,
          brandColor: carrier.brandColor,
          website: carrier.website,
          status: 'active',
        },
      });

      for (const product of productTemplates) {
        const productCode = `${carrier.shortName}-${product.codeSuffix}`;
        await prisma.product.upsert({
          where: {
            tenantId_code: { tenantId: tenant.id, code: productCode },
          },
          update: {},
          create: {
            tenantId: tenant.id,
            carrierId: createdCarrier.id,
            name: `${carrier.shortName} ${product.name}`,
            code: productCode,
            insuranceType: product.insuranceType,
            description: product.description,
            commissionRate: product.commissionRate,
          },
        });
      }
    }
  }

  console.log('✅ Carriers: 5 per tenant (10 total)');
  console.log('✅ Products: 3 per carrier (30 total)');

  // ─── Summary ──────────────────────────────────
  const tenantCount = await prisma.tenant.count();
  const userCount = await prisma.user.count();
  const branchCount = await prisma.branch.count();
  const carrierCount = await prisma.carrier.count();
  const productCount = await prisma.product.count();

  console.log('\n📊 Seed Summary:');
  console.log(`   Tenants:  ${tenantCount}`);
  console.log(`   Users:    ${userCount}`);
  console.log(`   Branches: ${branchCount}`);
  console.log(`   Carriers: ${carrierCount}`);
  console.log(`   Products: ${productCount}`);
  console.log('\n✅ Seeding complete!');
}

main()
  .catch((e: unknown) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
