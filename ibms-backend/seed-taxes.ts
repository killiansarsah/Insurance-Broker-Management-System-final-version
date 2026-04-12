import { PrismaClient, InsuranceType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding default Ghana Tax Engine rules...');

  const applicableTo = [
    InsuranceType.FIRE,
    InsuranceType.MARINE,
    InsuranceType.ENGINEERING,
    InsuranceType.LIABILITY,
    InsuranceType.BONDS,
    InsuranceType.TRAVEL
  ];

  // Clear existing tax rules to prevent duplicates
  await prisma.systemTaxRule.deleteMany({});

  // Base Levies (Order 1, non-cascading)
  await prisma.systemTaxRule.create({
    data: {
      name: 'National Health Insurance Levy',
      code: 'NHIL',
      rate: 0.025,
      type: 'PERCENTAGE',
      isCascading: false,
      calculationOrder: 1,
      effectiveFrom: new Date('2020-01-01'),
      applicableTo, 
    },
  });

  await prisma.systemTaxRule.create({
    data: {
      name: 'Ghana Education Trust Fund',
      code: 'GETFUND',
      rate: 0.025,
      type: 'PERCENTAGE',
      isCascading: false,
      calculationOrder: 1,
      effectiveFrom: new Date('2020-01-01'),
      applicableTo,
    },
  });

  await prisma.systemTaxRule.create({
    data: {
      name: 'COVID-19 Health Recovery Levy',
      code: 'COVID_LEVY',
      rate: 0.01, // 1%
      type: 'PERCENTAGE',
      isCascading: false,
      calculationOrder: 1,
      effectiveFrom: new Date('2021-05-01'),
      applicableTo,
    },
  });

  // Cascading VAT (Order 2, Tax-on-Tax)
  await prisma.systemTaxRule.create({
    data: {
      name: 'Value Added Tax',
      code: 'VAT',
      rate: 0.15, // 15%
      type: 'PERCENTAGE',
      isCascading: true,
      calculationOrder: 2,
      effectiveFrom: new Date('2020-01-01'),
      applicableTo,
    },
  });

  // Example of a Flat Fee or separate charge (Order 3)
  // await prisma.systemTaxRule.create({
  //   data: {
  //     name: 'NIC Stamp Duty',
  //     code: 'STAMP',
  //     rate: 50.0,
  //     type: 'FLAT_FEE',
  //     isCascading: false,
  //     calculationOrder: 3,
  //     effectiveFrom: new Date(),
  //     applicableTo: ['MOTOR'], // Example of something applying to Motor
  //   },
  // });

  console.log('Successfully seeded default Ghana Tax Rules.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
