import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Tax Rules via Raw SQL...');

  const taxRules = [
    {
      name: 'National Health Insurance Levy',
      code: 'NHIL',
      rate: 0.025,
      type: 'PERCENTAGE',
      isCascading: false,
      calculationOrder: 0,
      applicableTo: ['FIRE', 'MARINE', 'TRAVEL', 'LIABILITY', 'ENGINEERING', 'BONDS', 'AGRICULTURE', 'OIL_GAS', 'AVIATION', 'PROFESSIONAL_INDEMNITY', 'HEALTH', 'OTHER'],
    },
    {
      name: 'GETFund Levy',
      code: 'GETFUND',
      rate: 0.025,
      type: 'PERCENTAGE',
      isCascading: false,
      calculationOrder: 0,
      applicableTo: ['FIRE', 'MARINE', 'TRAVEL', 'LIABILITY', 'ENGINEERING', 'BONDS', 'AGRICULTURE', 'OIL_GAS', 'AVIATION', 'PROFESSIONAL_INDEMNITY', 'HEALTH', 'OTHER'],
    },
    {
      name: 'COVID-19 Health Recovery Levy',
      code: 'COVID19',
      rate: 0.01,
      type: 'PERCENTAGE',
      isCascading: false,
      calculationOrder: 0,
      applicableTo: ['FIRE', 'MARINE', 'TRAVEL', 'LIABILITY', 'ENGINEERING', 'BONDS', 'AGRICULTURE', 'OIL_GAS', 'AVIATION', 'PROFESSIONAL_INDEMNITY', 'HEALTH', 'OTHER'],
    },
    {
      name: 'Value Added Tax',
      code: 'VAT',
      rate: 0.15,
      type: 'PERCENTAGE',
      isCascading: true,
      calculationOrder: 1,
      applicableTo: ['FIRE', 'MARINE', 'TRAVEL', 'LIABILITY', 'ENGINEERING', 'BONDS', 'AGRICULTURE', 'OIL_GAS', 'AVIATION', 'PROFESSIONAL_INDEMNITY', 'HEALTH', 'OTHER'],
    },
    {
      name: 'NIC Levy',
      code: 'NIC_LEVY',
      rate: 0.02,
      type: 'PERCENTAGE',
      isCascading: false,
      calculationOrder: 0,
       applicableTo: ['MOTOR', 'FIRE', 'MARINE', 'TRAVEL', 'LIABILITY', 'ENGINEERING', 'BONDS', 'AGRICULTURE', 'OIL_GAS', 'AVIATION', 'PROFESSIONAL_INDEMNITY', 'HEALTH', 'OTHER'],
    }
  ];

  for (const rule of taxRules) {
    console.log(`Processing ${rule.code}...`);
    // Manual upsert via SQL
    await prisma.$executeRawUnsafe(`
      INSERT INTO system_tax_rules (id, name, code, rate, type,"isCascading", "calculationOrder", "effectiveFrom", "applicableTo", "updatedAt")
      VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW(), $7::"InsuranceType"[], NOW())
      ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        rate = EXCLUDED.rate,
        type = EXCLUDED.type,
        "isCascading" = EXCLUDED."isCascading",
        "calculationOrder" = EXCLUDED."calculationOrder",
        "applicableTo" = EXCLUDED."applicableTo",
        "updatedAt" = NOW()
    `, 
      rule.name, 
      rule.code, 
      rule.rate, 
      rule.type, 
      rule.isCascading, 
      rule.calculationOrder, 
      `{${rule.applicableTo.join(',')}}`
    );
  }

  console.log('✅ Tax Rules Seeded via SQL.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
