import { PrismaClient, CarrierType } from '@prisma/client';

const prisma = new PrismaClient();

const carrierData = [
  { name: 'SIC Insurance Company', shortName: 'SIC', slug: 'sic-insurance-carrier', type: CarrierType.NON_LIFE, brandColor: '#1E40AF', website: 'https://sicinsurance.com.gh', licenseNumber: 'NIC/INS/001' },
  { name: 'Enterprise Insurance Company', shortName: 'ENTERPRISE', slug: 'enterprise-insurance-carrier', type: CarrierType.NON_LIFE, brandColor: '#059669', website: 'https://enterpriseinsurance.com.gh', licenseNumber: 'NIC/INS/002' },
  { name: 'Star Assurance Company', shortName: 'STAR', slug: 'star-assurance', type: CarrierType.NON_LIFE, brandColor: '#F59E0B', website: 'https://starassurance.com.gh', licenseNumber: 'NIC/INS/003' },
  { name: 'Glico General Insurance', shortName: 'GLICO', slug: 'glico-general', type: CarrierType.NON_LIFE, brandColor: '#7C3AED', website: 'https://glicogeneral.com.gh', licenseNumber: 'NIC/INS/004' },
  { name: 'Prime Insurance Company', shortName: 'PRIME', slug: 'prime-insurance', type: CarrierType.NON_LIFE, brandColor: '#DC2626', website: 'https://primeinsurance.com.gh', licenseNumber: 'NIC/INS/005' },
  { name: 'Vanguard Assurance', shortName: 'VANGUARD', slug: 'vanguard-assurance', type: CarrierType.NON_LIFE, brandColor: '#0EA5E9', website: 'https://vanguardassurance.com.gh', licenseNumber: 'NIC/INS/006' },
  { name: 'Ghana Union Assurance', shortName: 'GUA', slug: 'gua-life', type: CarrierType.LIFE, brandColor: '#14B8A6', website: 'https://gualife.com.gh', licenseNumber: 'NIC/LIF/001' },
  { name: 'SIC Life Insurance', shortName: 'SICLIFE', slug: 'sic-life', type: CarrierType.LIFE, brandColor: '#1E3A8A', website: 'https://siclife.com.gh', licenseNumber: 'NIC/LIF/002' },
  { name: 'Glico Life Insurance', shortName: 'GLICOLIFE', slug: 'glico-life', type: CarrierType.LIFE, brandColor: '#6D28D9', website: 'https://glicolife.com.gh', licenseNumber: 'NIC/LIF/003' },
  { name: 'Hollard Insurance', shortName: 'HOLLARD', slug: 'hollard-ghana', type: CarrierType.NON_LIFE, brandColor: '#000000', website: 'https://hollard.com.gh', licenseNumber: 'NIC/INS/007' },
];

async function main() {
  const tenants = await prisma.tenant.findMany();
  console.log(`Found ${tenants.length} tenants. Seeding carriers...`);

  for (const tenant of tenants) {
    console.log(`Processing tenant: ${tenant.slug}`);
    for (const carrier of carrierData) {
      await prisma.carrier.upsert({
        where: { 
          tenantId_slug: { 
            tenantId: tenant.id, 
            slug: carrier.slug 
          } 
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
          licenseNumber: carrier.licenseNumber,
          status: 'ACTIVE',
          email: `info@${carrier.slug}.com`,
          phone: '+233302' + Math.floor(100000 + Math.random() * 900000),
          address: 'Accra, Ghana'
        }
      });
    }
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
