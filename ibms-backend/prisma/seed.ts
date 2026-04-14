import {
  PrismaClient,
  TenantPlan,
  CarrierType,
  InsuranceType,
  PolicyType,
  PolicyStatus,
  ClientType,
  ClientStatus,
  KycStatus,
  AmlRiskLevel,
  Gender,
  PremiumFrequency,
  CommissionStatus,
  PaymentMethod,
  PaymentStatus,
  ClaimStatus,
  ComplaintStatus,
  ComplaintPriority,
  LeadStatus,
  LeadPriority,
  LeadSource,
  DocumentCategory,
  NotificationType,
  NotificationPriority,
  TransactionType,
  InvoiceStatus,
  ExpenseStatus,
  ApprovalType,
  ApprovalStatus,
  TaskPriority,
  TaskStatus,
  CalendarEventType,
  CalendarEventStatus,
  MotorCoverType,
  AuditCategory,
  AuditSeverity,
  ServiceHealthStatus,
  IncidentStatus,
  ErrorSeverity,
  JobStatus,
  EmailDeliveryStatus,
  AnnouncementType,
  SubscriptionStatus,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { NIC_LEVY_RATE } from '../src/common/constants/nic.constants';
import { seedRbac, migrateExistingUsersToRbac, LEGACY_ROLE_MAP, DEFAULT_ROLE_PERMISSIONS } from './seed-rbac';

const prisma = new PrismaClient();

// ─── HELPERS ────────────────────────────────────
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}
function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randDec(min: number, max: number, decimals = 2): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}
function daysAgo(d: number): Date {
  const dt = new Date();
  dt.setDate(dt.getDate() - d);
  return dt;
}
function daysFromNow(d: number): Date {
  const dt = new Date();
  dt.setDate(dt.getDate() + d);
  return dt;
}

const ghanaFirstNames = [
  'Kwame', 'Ama', 'Kofi', 'Akua', 'Kwesi', 'Abena', 'Yaw', 'Adjoa',
  'Kojo', 'Efua', 'Nana', 'Akosua', 'Kweku', 'Adwoa', 'Fiifi', 'Afia',
  'Papa', 'Esi', 'Yaa', 'Kobi', 'Maame', 'Kobina', 'Ekua', 'Paa',
  'Serwaa', 'Mensah', 'Ato', 'Araba', 'Kwabena', 'Abenaa',
];
const ghanaLastNames = [
  'Mensah', 'Boateng', 'Adjei', 'Owusu', 'Asante', 'Nkrumah', 'Agyeman',
  'Osei', 'Appiah', 'Bonsu', 'Darko', 'Frimpong', 'Gyasi', 'Kumi',
  'Acheampong', 'Amoah', 'Baidoo', 'Tetteh', 'Quarshie', 'Antwi',
  'Amponsah', 'Adu', 'Yeboah', 'Opoku', 'Manu', 'Sarpong', 'Nyarko',
  'Danquah', 'Obeng', 'Twumasi',
];
const ghanaCompanies = [
  'Golden Star Trading Ltd', 'Accra Auto Parts Co.', 'Ashanti Gold Mining Corp',
  'Cape Coast Fisheries Ltd', 'Tema Port Logistics', 'Kumasi Timber Exports',
  'Volta River Transport', 'Tamale Agri Services', 'East Legon Properties',
  'Osu Night Market Co.', 'Black Star Shipping', 'Adenta Tech Solutions',
  'West Hills Mall Management', 'Northern Shea Butter Ltd', 'Kaneshie Markets Inc',
  'Spintex Road Developers', 'Greater Accra Motors', 'Ho Textiles Manufacturing',
  'Bolgatanga Handicrafts', 'Sekondi Oil Services',
];
const ghanaRegions = ['Greater Accra', 'Ashanti', 'Western', 'Eastern', 'Central', 'Volta', 'Northern', 'Upper East', 'Bono', 'Oti'];
const ghanaCities = ['Accra', 'Kumasi', 'Takoradi', 'Tamale', 'Cape Coast', 'Ho', 'Sunyani', 'Koforidua', 'Bolgatanga', 'Tema'];
const carMakes = ['Toyota', 'Hyundai', 'Nissan', 'Honda', 'Kia', 'Ford', 'Mercedes-Benz', 'BMW', 'Volkswagen', 'Mitsubishi'];
const carModels: Record<string, string[]> = {
  Toyota: ['Corolla', 'Camry', 'RAV4', 'Hilux', 'Land Cruiser'],
  Hyundai: ['Tucson', 'Elantra', 'Accent', 'Sonata', 'Creta'],
  Nissan: ['Almera', 'Patrol', 'Sentra', 'Navara', 'X-Trail'],
  Honda: ['Civic', 'CR-V', 'Fit', 'Accord', 'HR-V'],
  Kia: ['Sportage', 'Rio', 'Sorento', 'Picanto', 'Seltos'],
  Ford: ['Ranger', 'Focus', 'EcoSport', 'Escape', 'Explorer'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'GLC', 'A-Class', 'S-Class'],
  BMW: ['3 Series', '5 Series', 'X3', 'X5', '1 Series'],
  Volkswagen: ['Golf', 'Polo', 'Tiguan', 'Passat', 'T-Cross'],
  Mitsubishi: ['Outlander', 'L200', 'Pajero', 'Eclipse Cross', 'ASX'],
};
const bodyTypes = ['Sedan', 'SUV', 'Pickup', 'Hatchback', 'Van', 'Bus', 'Coupe'];
const colors = ['White', 'Black', 'Silver', 'Blue', 'Red', 'Grey', 'Green', 'Brown'];
const occupations = ['Teacher', 'Engineer', 'Doctor', 'Trader', 'Farmer', 'Lawyer', 'Accountant', 'Nurse', 'Banker', 'Architect', 'Pharmacist', 'Journalist'];
const expenseCategories = ['Office Supplies', 'Travel', 'Marketing', 'IT Equipment', 'Professional Services', 'Rent', 'Utilities', 'Training', 'Entertainment', 'Printing'];
const complaintCategories = ['Service Delay', 'Claim Settlement', 'Premium Dispute', 'Policy Terms', 'Communication', 'Billing Error', 'Agent Conduct', 'Coverage Denial'];

async function main(): Promise<void> {
  console.log('🌱 Seeding database with comprehensive mock data...\n');

  const passwordHash = await bcrypt.hash('Admin@123', 12);

  // ════════════════════════════════════════════════════
  // ─── RBAC: SYSTEM ROLES & PERMISSIONS ──────────────
  // ════════════════════════════════════════════════════
  const { roleMap } = await seedRbac(prisma);

  // ════════════════════════════════════════════════════
  // ─── TENANTS ───────────────────────────────────────
  // ════════════════════════════════════════════════════
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

  // ════════════════════════════════════════════════════
  // ─── BRANCHES ──────────────────────────────────────
  // ════════════════════════════════════════════════════
  const branchData = [
    { name: 'Accra Main Branch', code: 'BR-ACC-01', address: 'Ring Road East, Osu, Accra' },
    { name: 'Kumasi Branch', code: 'BR-KUM-01', address: 'Adum, Kumasi' },
    { name: 'Takoradi Branch', code: 'BR-TAK-01', address: 'Market Circle, Takoradi' },
    { name: 'Tamale Branch', code: 'BR-TAM-01', address: 'Hospital Road, Tamale' },
    { name: 'Cape Coast Branch', code: 'BR-CAP-01', address: 'Commercial Street, Cape Coast' },
  ];

  const branchMap: Record<string, string[]> = {};
  for (const tenant of [sicTenant, enterpriseTenant]) {
    branchMap[tenant.id] = [];
    for (const branch of branchData) {
      const b = await prisma.branch.upsert({
        where: { tenantId_code: { tenantId: tenant.id, code: branch.code } },
        update: {},
        create: { tenantId: tenant.id, name: branch.name, code: branch.code, address: branch.address },
      });
      branchMap[tenant.id].push(b.id);
    }
  }
  console.log('✅ Branches: 5 per tenant');

  // ════════════════════════════════════════════════════
  // ─── DEPARTMENTS ───────────────────────────────────
  // ════════════════════════════════════════════════════
  const departmentData = [
    { name: 'Underwriting', code: 'UW', description: 'Policy underwriting and risk assessment', color: '#3B82F6' },
    { name: 'Claims', code: 'CLM', description: 'Claims processing and settlement', color: '#EF4444' },
    { name: 'Finance', code: 'FIN', description: 'Financial operations and accounting', color: '#10B981' },
    { name: 'Sales & Marketing', code: 'SM', description: 'Sales, marketing and lead generation', color: '#F59E0B' },
    { name: 'Compliance', code: 'COMP', description: 'Regulatory compliance and risk management', color: '#8B5CF6' },
    { name: 'IT', code: 'IT', description: 'Information technology and systems', color: '#06B6D4' },
  ];

  const deptMap: Record<string, string[]> = {};
  for (const tenant of [sicTenant, enterpriseTenant]) {
    deptMap[tenant.id] = [];
    for (const dept of departmentData) {
      const d = await prisma.department.upsert({
        where: { tenantId_code: { tenantId: tenant.id, code: dept.code } },
        update: {},
        create: {
          tenantId: tenant.id,
          name: dept.name,
          code: dept.code,
          description: dept.description,
          color: dept.color,
          branchId: branchMap[tenant.id][0],
        },
      });
      deptMap[tenant.id].push(d.id);
    }
  }
  console.log('✅ Departments: 6 per tenant');

  // ════════════════════════════════════════════════════
  // ─── USERS ─────────────────────────────────────────
  // ════════════════════════════════════════════════════
  const staffRoles: Array<{ legacyRole: string; prefix: string; jobTitle: string }> = [
    { legacyRole: 'TENANT_ADMIN', prefix: 'admin', jobTitle: 'Tenant Administrator' },
    { legacyRole: 'BRANCH_MANAGER', prefix: 'manager', jobTitle: 'Branch Manager' },
    { legacyRole: 'COMPLIANCE_OFFICER', prefix: 'compliance', jobTitle: 'Compliance Officer' },
    { legacyRole: 'FINANCE_MANAGER', prefix: 'finance', jobTitle: 'Finance Manager' },
    { legacyRole: 'SENIOR_BROKER', prefix: 'srbroker', jobTitle: 'Senior Broker' },
    { legacyRole: 'BROKER', prefix: 'broker1', jobTitle: 'Insurance Broker' },
    { legacyRole: 'BROKER', prefix: 'broker2', jobTitle: 'Insurance Broker' },
    { legacyRole: 'BROKER', prefix: 'broker3', jobTitle: 'Insurance Broker' },
    { legacyRole: 'BROKER', prefix: 'broker4', jobTitle: 'Insurance Broker' },
    { legacyRole: 'BROKER', prefix: 'broker5', jobTitle: 'Insurance Broker' },
    { legacyRole: 'UNDERWRITER', prefix: 'underwriter', jobTitle: 'Underwriter' },
    { legacyRole: 'AGENT', prefix: 'agent1', jobTitle: 'Insurance Agent' },
    { legacyRole: 'AGENT', prefix: 'agent2', jobTitle: 'Insurance Agent' },
    { legacyRole: 'DATA_ENTRY', prefix: 'dataentry', jobTitle: 'Data Entry Clerk' },
    { legacyRole: 'VIEWER', prefix: 'viewer', jobTitle: 'Viewer' },
  ];

  const userMap: Record<string, string[]> = {};
  const brokerMap: Record<string, string[]> = {};

  for (const tenant of [sicTenant, enterpriseTenant]) {
    userMap[tenant.id] = [];
    brokerMap[tenant.id] = [];
    const domain = tenant.slug === 'sic-insurance' ? 'sic.com' : 'enterprise.com';

    for (let i = 0; i < staffRoles.length; i++) {
      const s = staffRoles[i];
      const fn = ghanaFirstNames[i % ghanaFirstNames.length];
      const ln = ghanaLastNames[i % ghanaLastNames.length];
      const email = s.prefix === 'admin' ? `admin@${domain}` : `${s.prefix}@${domain}`;

      // Map legacy role string → flat SystemRole enum value
      const newRoleName = (LEGACY_ROLE_MAP[s.legacyRole] || 'AGENT') as any;
      const defaultPerms = DEFAULT_ROLE_PERMISSIONS[newRoleName] ?? [];

      const u = await prisma.user.upsert({
        where: { tenantId_email: { tenantId: tenant.id, email } },
        update: {
          role: newRoleName,
          permissions: defaultPerms,
        },
        create: {
          tenantId: tenant.id,
          email,
          passwordHash,
          firstName: fn,
          lastName: ln,
          phone: `+2332440${String(rand(10000, 99999))}`,
          jobTitle: s.jobTitle,
          branchId: branchMap[tenant.id][i % branchMap[tenant.id].length],
          departmentId: deptMap[tenant.id][i % deptMap[tenant.id].length],
          isActive: true,
          mustChangePassword: s.prefix === 'admin',
          role: newRoleName,
          permissions: defaultPerms,
        },
      });

      userMap[tenant.id].push(u.id);
      if (['BROKER', 'SENIOR_BROKER', 'AGENT'].includes(s.legacyRole)) {
        brokerMap[tenant.id].push(u.id);
      }
    }
  }
  console.log('✅ Users: 15 per tenant (mapped to new 5-tier roles)');

  // ════════════════════════════════════════════════════
  // ─── CARRIERS & PRODUCTS ───────────────────────────
  // ════════════════════════════════════════════════════
  const carrierData: Array<{ name: string; shortName: string; slug: string; type: CarrierType; brandColor: string; website: string; licenseNumber: string; logoUrl: string }> = [
    { name: 'SIC Insurance Company', shortName: 'SIC', slug: 'sic-insurance-carrier', type: CarrierType.NON_LIFE, brandColor: '#1E40AF', website: 'https://sicinsurance.com.gh', licenseNumber: 'NIC/INS/001', logoUrl: '/images/carriers/sic-insurance-plc.png' },
    { name: 'Enterprise Insurance Company', shortName: 'ENTERPRISE', slug: 'enterprise-insurance-carrier', type: CarrierType.NON_LIFE, brandColor: '#059669', website: 'https://enterpriseinsurance.com.gh', licenseNumber: 'NIC/INS/002', logoUrl: '/images/carriers/enterprise-insurance.png' },
    { name: 'Star Assurance Company', shortName: 'STAR', slug: 'star-assurance', type: CarrierType.NON_LIFE, brandColor: '#F59E0B', website: 'https://starassurance.com.gh', licenseNumber: 'NIC/INS/003', logoUrl: '/images/carriers/star-assurance.png' },
    { name: 'Glico General Insurance', shortName: 'GLICO', slug: 'glico-general', type: CarrierType.NON_LIFE, brandColor: '#7C3AED', website: 'https://glicogeneral.com.gh', licenseNumber: 'NIC/INS/004', logoUrl: '/images/carriers/glico-general.jpg' },
    { name: 'Prime Insurance Company', shortName: 'PRIME', slug: 'prime-insurance', type: CarrierType.NON_LIFE, brandColor: '#DC2626', website: 'https://primeinsurance.com.gh', licenseNumber: 'NIC/INS/005', logoUrl: '/images/carriers/prime-insurance.png' },
    { name: 'Vanguard Assurance', shortName: 'VANGUARD', slug: 'vanguard-assurance', type: CarrierType.NON_LIFE, brandColor: '#0EA5E9', website: 'https://vanguardassurance.com.gh', licenseNumber: 'NIC/INS/006', logoUrl: '/images/carriers/vanguard-assurance-company-ltd.png' },
    { name: 'Ghana Union Assurance', shortName: 'GUA', slug: 'gua-life', type: CarrierType.LIFE, brandColor: '#14B8A6', website: 'https://gualife.com.gh', licenseNumber: 'NIC/LIF/001', logoUrl: '/images/carriers/ghana-union-assurance.png' },
    { name: 'SIC Life Insurance', shortName: 'SICLIFE', slug: 'sic-life', type: CarrierType.LIFE, brandColor: '#1E3A8A', website: 'https://siclife.com.gh', licenseNumber: 'NIC/LIF/002', logoUrl: '/images/carriers/siclife.png' },
    { name: 'Glico Life Insurance', shortName: 'GLICOLIFE', slug: 'glico-life', type: CarrierType.LIFE, brandColor: '#6D28D9', website: 'https://glicolife.com.gh', licenseNumber: 'NIC/LIF/003', logoUrl: '/images/carriers/glico-life-insurance-ghana.png' },
    { name: 'Africa Re', shortName: 'AFRICARE', slug: 'africa-re', type: CarrierType.REINSURER, brandColor: '#B45309', website: 'https://africa-re.com', licenseNumber: 'NIC/RE/001', logoUrl: '/images/carriers/ghana-re.png' },
  ];

  const productTemplates: Array<{ name: string; codeSuffix: string; insuranceType: InsuranceType; commissionRate: number; description: string }> = [
    { name: 'Comprehensive Motor', codeSuffix: 'MOT-COMP', insuranceType: InsuranceType.MOTOR, commissionRate: 16.5, description: 'Full comprehensive motor vehicle cover' },
    { name: 'Third Party Fire & Theft Motor', codeSuffix: 'MOT-TPFT', insuranceType: InsuranceType.MOTOR, commissionRate: 13.5, description: 'Third party fire and theft motor cover' },
    { name: 'Third Party Motor', codeSuffix: 'MOT-TP', insuranceType: InsuranceType.MOTOR, commissionRate: 10.0, description: 'Third party only motor cover' },
    { name: 'Fire & Allied Perils', codeSuffix: 'FIRE-AP', insuranceType: InsuranceType.FIRE, commissionRate: 20.0, description: 'Fire, lightning, explosion and allied perils' },
    { name: 'Marine Cargo', codeSuffix: 'MAR-CRG', insuranceType: InsuranceType.MARINE, commissionRate: 20.0, description: 'Coverage for goods in transit by sea' },
    { name: 'Professional Indemnity', codeSuffix: 'PI', insuranceType: InsuranceType.PROFESSIONAL_INDEMNITY, commissionRate: 22.0, description: 'Professional liability coverage' },
    { name: 'Group Health', codeSuffix: 'HLTH-GRP', insuranceType: InsuranceType.HEALTH, commissionRate: 10.0, description: 'Group health insurance for employees' },
    { name: 'Travel Insurance', codeSuffix: 'TRV', insuranceType: InsuranceType.TRAVEL, commissionRate: 22.0, description: 'Travel and accident coverage' },
    { name: 'Engineering All Risk', codeSuffix: 'ENG-AR', insuranceType: InsuranceType.ENGINEERING, commissionRate: 20.0, description: 'All risks engineering cover' },
    { name: 'Bonds', codeSuffix: 'BONDS', insuranceType: InsuranceType.BONDS, commissionRate: 18.0, description: 'Performance, bid and customs bonds' },
    { name: 'Workmen Comp / GPA', codeSuffix: 'WC-GPA', insuranceType: InsuranceType.LIABILITY, commissionRate: 22.0, description: 'Workmen compensation and group personal accident' },
    { name: 'Public Liability', codeSuffix: 'PL', insuranceType: InsuranceType.LIABILITY, commissionRate: 22.0, description: 'Public and general liability cover' },
    { name: 'Goods in Transit', codeSuffix: 'GIT', insuranceType: InsuranceType.MARINE, commissionRate: 20.0, description: 'Inland goods in transit coverage' },
    { name: 'Fidelity Guarantee', codeSuffix: 'FG', insuranceType: InsuranceType.BONDS, commissionRate: 20.0, description: 'Employee dishonesty / fidelity guarantee' },
  ];

  const lifeProductTemplates: Array<{ name: string; codeSuffix: string; insuranceType: InsuranceType; commissionRate: number; description: string }> = [
    { name: 'Term Life', codeSuffix: 'LIFE-TERM', insuranceType: InsuranceType.LIFE, commissionRate: 25.0, description: 'Term life insurance policy' },
    { name: 'Whole Life', codeSuffix: 'LIFE-WHOLE', insuranceType: InsuranceType.LIFE, commissionRate: 30.0, description: 'Whole life insurance with savings' },
    { name: 'Endowment Plan', codeSuffix: 'LIFE-END', insuranceType: InsuranceType.LIFE, commissionRate: 28.0, description: 'Endowment savings and protection' },
    { name: 'Group Life', codeSuffix: 'LIFE-GRP', insuranceType: InsuranceType.LIFE, commissionRate: 20.0, description: 'Group life for corporate clients' },
  ];

  const carrierIdMap: Record<string, Record<string, string>> = {};
  const productIdMap: Record<string, Array<{ id: string; carrierId: string; insuranceType: InsuranceType; commissionRate: number }>> = {};

  for (const tenant of [sicTenant, enterpriseTenant]) {
    carrierIdMap[tenant.id] = {};
    productIdMap[tenant.id] = [];

    for (const carrier of carrierData) {
      const templates = carrier.type === CarrierType.LIFE ? lifeProductTemplates : productTemplates;
      const c = await prisma.carrier.upsert({
        where: { tenantId_slug: { tenantId: tenant.id, slug: carrier.slug } },
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
          logoUrl: carrier.logoUrl,
          status: 'ACTIVE',
          phone: `+23330${rand(1000000, 9999999)}`,
          email: `info@${carrier.slug}.com`,
          contactPerson: `${pick(ghanaFirstNames)} ${pick(ghanaLastNames)}`,
          address: `${rand(1, 100)} ${pick(['Oxford St', 'Independence Ave', 'Kojo Thompson Rd', 'Liberation Rd', 'Ring Road'])}, Accra`,
        },
      });
      carrierIdMap[tenant.id][carrier.slug] = c.id;

      if (carrier.type === CarrierType.REINSURER) continue;

      for (const pt of templates) {
        const code = `${carrier.shortName}-${pt.codeSuffix}`;
        const p = await prisma.product.upsert({
          where: { carrierId_code: { carrierId: c.id, code } },
          update: {},
          create: {
            tenantId: tenant.id,
            carrierId: c.id,
            name: `${carrier.shortName} ${pt.name}`,
            code,
            insuranceType: pt.insuranceType,
            description: pt.description,
            commissionRate: pt.commissionRate,
          },
        });
        productIdMap[tenant.id].push({ id: p.id, carrierId: c.id, insuranceType: pt.insuranceType, commissionRate: pt.commissionRate });
      }
    }
  }
  console.log('✅ Carriers: 10 per tenant (non-life, life, reinsurer)');
  console.log('✅ Products: created for each carrier');

  // ════════════════════════════════════════════════════
  // ─── CLIENTS ───────────────────────────────────────
  // ════════════════════════════════════════════════════
  const clientIds: Record<string, string[]> = {};

  for (const tenant of [sicTenant, enterpriseTenant]) {
    clientIds[tenant.id] = [];

    // 30 individual clients
    for (let i = 0; i < 30; i++) {
      const fn = ghanaFirstNames[i % ghanaFirstNames.length];
      const ln = ghanaLastNames[(i + 7) % ghanaLastNames.length];
      const clientNum = `CLI-IND-${String(i + 1).padStart(4, '0')}`;
      const gender = i % 2 === 0 ? Gender.MALE : Gender.FEMALE;

      const c = await prisma.client.upsert({
        where: { tenantId_clientNumber: { tenantId: tenant.id, clientNumber: clientNum } },
        update: {},
        create: {
          tenantId: tenant.id,
          clientNumber: clientNum,
          type: ClientType.INDIVIDUAL,
          status: pick([ClientStatus.ACTIVE, ClientStatus.ACTIVE, ClientStatus.ACTIVE, ClientStatus.INACTIVE]),
          firstName: fn,
          lastName: ln,
          phone: `+2332${rand(40, 59)}${rand(1000000, 9999999)}`,
          email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@gmail.com`,
          region: pick(ghanaRegions),
          city: pick(ghanaCities),
          digitalAddress: `GA-${rand(100, 999)}-${rand(1000, 9999)}`,
          ghanaCardNumber: `GHA-${rand(100000000, 999999999)}-${rand(1, 9)}`,
          dateOfBirth: new Date(rand(1960, 2000), rand(0, 11), rand(1, 28)),
          gender,
          occupation: pick(occupations),
          kycStatus: pick([KycStatus.VERIFIED, KycStatus.VERIFIED, KycStatus.PENDING, KycStatus.VERIFIED]),
          amlRiskLevel: pick([AmlRiskLevel.LOW, AmlRiskLevel.LOW, AmlRiskLevel.LOW, AmlRiskLevel.MEDIUM]),
          assignedBrokerId: pick(brokerMap[tenant.id]),
        },
      });
      clientIds[tenant.id].push(c.id);

      // Add beneficiary for some clients
      if (i % 3 === 0) {
        await prisma.beneficiary.create({
          data: {
            tenantId: tenant.id,
            clientId: c.id,
            fullName: `${pick(ghanaFirstNames)} ${ln}`,
            relationship: pick(['Spouse', 'Child', 'Parent', 'Sibling']),
            phone: `+2332${rand(40, 59)}${rand(1000000, 9999999)}`,
            percentage: 100,
          },
        });
      }

      // Add bank details for some
      if (i % 4 === 0) {
        await prisma.bankDetail.create({
          data: {
            tenantId: tenant.id,
            clientId: c.id,
            bankName: pick(['GCB Bank', 'Ecobank', 'Standard Chartered', 'Fidelity Bank', 'Stanbic Bank', 'Absa Bank']),
            accountName: `${fn} ${ln}`,
            accountNumber: String(rand(1000000000, 9999999999)),
            branch: pick(['Accra Main', 'Osu', 'Kumasi Adum', 'Tema', 'Takoradi']),
          },
        });
      }
    }

    // 15 corporate clients
    for (let i = 0; i < 15; i++) {
      const compName = ghanaCompanies[i % ghanaCompanies.length];
      const clientNum = `CLI-CORP-${String(i + 1).padStart(4, '0')}`;

      const c = await prisma.client.upsert({
        where: { tenantId_clientNumber: { tenantId: tenant.id, clientNumber: clientNum } },
        update: {},
        create: {
          tenantId: tenant.id,
          clientNumber: clientNum,
          type: ClientType.CORPORATE,
          status: ClientStatus.ACTIVE,
          companyName: compName,
          phone: `+23330${rand(1000000, 9999999)}`,
          email: `info@${compName.toLowerCase().replace(/[^a-z]/g, '').slice(0, 15)}.com.gh`,
          region: pick(ghanaRegions),
          city: pick(ghanaCities),
          digitalAddress: `GA-${rand(100, 999)}-${rand(1000, 9999)}`,
          kycStatus: KycStatus.VERIFIED,
          amlRiskLevel: AmlRiskLevel.LOW,
          assignedBrokerId: pick(brokerMap[tenant.id]),
        },
      });
      clientIds[tenant.id].push(c.id);
    }
  }
  console.log('✅ Clients: 45 per tenant (30 individual + 15 corporate)');

  // ════════════════════════════════════════════════════
  // ─── POLICIES ──────────────────────────────────────
  // ════════════════════════════════════════════════════
  const policyIds: Record<string, Array<{ id: string; clientId: string; carrierId: string; insuranceType: InsuranceType; premium: number; commissionRate: number }>> = {};

  for (const tenant of [sicTenant, enterpriseTenant]) {
    policyIds[tenant.id] = [];
    const products = productIdMap[tenant.id];

    for (let i = 0; i < 60; i++) {
      const policyNum = `POL-${new Date().getFullYear()}-${String(i + 1).padStart(5, '0')}`;
      const product = products[i % products.length];
      const clientId = clientIds[tenant.id][i % clientIds[tenant.id].length];
      const brokerId = pick(brokerMap[tenant.id]);

      const isLife = product.insuranceType === InsuranceType.LIFE;
      const policyType = isLife ? PolicyType.LIFE : PolicyType.NON_LIFE;
      const inception = daysAgo(rand(0, 300));
      const expiry = new Date(inception);
      expiry.setFullYear(expiry.getFullYear() + 1);

      const sumInsured = isLife ? randDec(50000, 500000) : randDec(20000, 2000000);
      const premiumAmount = isLife ? randDec(500, 10000) : randDec(1000, 50000);
      const commRate = product.commissionRate;
      const commAmount = parseFloat((premiumAmount * commRate / 100).toFixed(2));

      const statusOptions: PolicyStatus[] = [
        PolicyStatus.ACTIVE, PolicyStatus.ACTIVE, PolicyStatus.ACTIVE,
        PolicyStatus.ACTIVE, PolicyStatus.EXPIRED, PolicyStatus.PENDING,
        PolicyStatus.DRAFT,
      ];

      const pol = await prisma.policy.upsert({
        where: { tenantId_policyNumber: { tenantId: tenant.id, policyNumber: policyNum } },
        update: {},
        create: {
          tenantId: tenant.id,
          policyNumber: policyNum,
          status: pick(statusOptions),
          insuranceType: product.insuranceType,
          policyType,
          clientId,
          carrierId: product.carrierId,
          productId: product.id,
          brokerId,
          inceptionDate: inception,
          expiryDate: expiry,
          issueDate: inception,
          sumInsured,
          premiumAmount,
          commissionRate: commRate,
          commissionAmount: commAmount,
          commissionStatus: pick([CommissionStatus.PENDING, CommissionStatus.EARNED, CommissionStatus.PAID]),
          premiumFrequency: isLife ? pick([PremiumFrequency.MONTHLY, PremiumFrequency.QUARTERLY, PremiumFrequency.ANNUAL]) : PremiumFrequency.ANNUAL,
          paymentStatus: pick([PaymentStatus.PAID, PaymentStatus.PAID, PaymentStatus.PENDING, PaymentStatus.PARTIAL]),
          coverageDetails: `Standard ${product.insuranceType} coverage with all normal terms and conditions`,
        },
      });

      policyIds[tenant.id].push({
        id: pol.id,
        clientId,
        carrierId: product.carrierId,
        insuranceType: product.insuranceType,
        premium: premiumAmount,
        commissionRate: commRate,
      });

      // Add vehicle details for MOTOR policies
      if (product.insuranceType === InsuranceType.MOTOR) {
        const make = pick(carMakes);
        await prisma.vehicleDetail.upsert({
          where: { policyId: pol.id },
          update: {},
          create: {
            policyId: pol.id,
            registrationNumber: `${pick(['GR', 'GS', 'GT', 'GW', 'GN', 'GE'])}-${rand(1000, 9999)}-${rand(10, 25)}`,
            chassisNumber: `WBA${String(rand(10000000000, 99999999999))}`,
            engineNumber: `N${rand(10, 99)}B${rand(10, 99)}A`,
            make,
            model: pick(carModels[make] || ['Standard']),
            year: rand(2015, 2025),
            bodyType: pick(bodyTypes),
            color: pick(colors),
            seatingCapacity: pick([5, 5, 5, 7, 4, 2]),
            usageType: pick(['Private', 'Commercial', 'Private', 'Private']),
            estimatedValue: sumInsured,
            motorCoverType: pick([MotorCoverType.COMPREHENSIVE, MotorCoverType.COMPREHENSIVE, MotorCoverType.THIRD_PARTY]),
          },
        });
      }

      // Add property details for FIRE policies
      if (product.insuranceType === InsuranceType.FIRE) {
        await prisma.propertyDetail.upsert({
          where: { policyId: pol.id },
          update: {},
          create: {
            policyId: pol.id,
            propertyAddress: `${rand(1, 200)} ${pick(['Oxford St', 'Independence Ave', 'Kojo Thompson Rd', 'Spintex Rd', 'East Legon'])}, ${pick(ghanaCities)}`,
            propertyType: pick(['Residential', 'Commercial', 'Industrial', 'Mixed Use']),
            constructionType: pick(['Concrete', 'Steel Frame', 'Brick', 'Mixed']),
            yearBuilt: rand(1990, 2023),
            estimatedValue: sumInsured,
            occupancyType: pick(['Owner Occupied', 'Tenant', 'Vacant']),
          },
        });
      }

      // Add marine details for MARINE policies
      if (product.insuranceType === InsuranceType.MARINE) {
        await prisma.marineDetail.upsert({
          where: { policyId: pol.id },
          update: {},
          create: {
            policyId: pol.id,
            vesselName: `MV ${pick(['Golden', 'Black', 'Star', 'Cape'])} ${pick(['Star', 'Coast', 'Voyager', 'Merchant'])}`,
            voyageRoute: `${pick(['Tema', 'Takoradi'])} → ${pick(['Rotterdam', 'Hamburg', 'London', 'Lomé', 'Lagos', 'Abidjan'])}`,
            cargoDescription: pick(['General Cargo', 'Cocoa Beans', 'Gold Ore', 'Timber Products', 'Electronics', 'Machinery']),
            cargoValue: sumInsured,
            conveyanceType: pick(['Sea', 'Air', 'Road']),
          },
        });
      }
    }
  }
  console.log('✅ Policies: 60 per tenant with vehicle/property/marine details');

  // ════════════════════════════════════════════════════
  // ─── CLAIMS ────────────────────────────────────────
  // ════════════════════════════════════════════════════
  const claimDescriptions = [
    'Vehicle rear-ended at traffic intersection on Ring Road',
    'Windshield damaged by falling debris during storm',
    'Fire outbreak in warehouse storage area',
    'Water damage from burst pipe in office building',
    'Cargo damaged during sea transit due to rough weather',
    'Vehicle theft from parking lot at night',
    'Collision with another vehicle at roundabout',
    'Property vandalism during civil unrest',
    'Goods lost during inland transit',
    'Fire damage to shop premises from electrical fault',
    'Vehicle flood damage during heavy rains',
    'Break-in and theft of office equipment',
    'Roof collapse due to heavy rainfall',
    'Motor accident on Accra-Kumasi highway',
    'Container damage at Tema port during offloading',
  ];

  for (const tenant of [sicTenant, enterpriseTenant]) {
    const policies = policyIds[tenant.id].filter(p => p.insuranceType !== InsuranceType.LIFE);

    for (let i = 0; i < 25; i++) {
      const pol = policies[i % policies.length];
      const claimNum = `CLM-${new Date().getFullYear()}-${String(i + 1).padStart(5, '0')}`;
      const incidentDate = daysAgo(rand(5, 180));
      const claimAmount = randDec(pol.premium * 0.5, pol.premium * 5);

      const statusOptions: ClaimStatus[] = [
        ClaimStatus.INTIMATED, ClaimStatus.REGISTERED, ClaimStatus.UNDER_REVIEW,
        ClaimStatus.ASSESSED, ClaimStatus.APPROVED, ClaimStatus.SETTLED,
        ClaimStatus.CLOSED, ClaimStatus.REJECTED,
      ];
      const status = pick(statusOptions);

      await prisma.claim.upsert({
        where: { tenantId_claimNumber: { tenantId: tenant.id, claimNumber: claimNum } },
        update: {},
        create: {
          tenantId: tenant.id,
          claimNumber: claimNum,
          status,
          policyId: pol.id,
          insuranceType: pol.insuranceType,
          clientId: pol.clientId,
          incidentDate,
          incidentDescription: pick(claimDescriptions),
          incidentLocation: `${pick(ghanaCities)}, ${pick(ghanaRegions)}`,
          claimAmount,
          intimationDate: new Date(incidentDate.getTime() + rand(1, 5) * 86400000),
          acknowledgmentDeadline: new Date(incidentDate.getTime() + 14 * 86400000),
          processingDeadline: new Date(incidentDate.getTime() + 90 * 86400000),
          assessedAmount: ([ClaimStatus.ASSESSED, ClaimStatus.APPROVED, ClaimStatus.SETTLED, ClaimStatus.CLOSED] as ClaimStatus[]).includes(status) ? claimAmount * 0.85 : undefined,
          settledAmount: ([ClaimStatus.SETTLED, ClaimStatus.CLOSED] as ClaimStatus[]).includes(status) ? claimAmount * 0.8 : undefined,
          settlementDate: status === ClaimStatus.SETTLED || status === ClaimStatus.CLOSED ? daysAgo(rand(1, 30)) : undefined,
          rejectionReason: status === ClaimStatus.REJECTED ? pick(['Insufficient documentation', 'Policy exclusion applies', 'Claim filed outside time limit', 'Fraudulent claim suspected']) : undefined,
          assessorId: pick(userMap[tenant.id]),
        },
      });
    }
  }
  console.log('✅ Claims: 25 per tenant');

  // ════════════════════════════════════════════════════
  // ─── COMPLAINTS ────────────────────────────────────
  // ════════════════════════════════════════════════════
  for (const tenant of [sicTenant, enterpriseTenant]) {
    for (let i = 0; i < 12; i++) {
      const compNum = `CMP-${new Date().getFullYear()}-${String(i + 1).padStart(4, '0')}`;
      const created = daysAgo(rand(1, 90));

      await prisma.complaint.upsert({
        where: { tenantId_complaintNumber: { tenantId: tenant.id, complaintNumber: compNum } },
        update: {},
        create: {
          tenantId: tenant.id,
          complaintNumber: compNum,
          status: pick([ComplaintStatus.REGISTERED, ComplaintStatus.ASSIGNED, ComplaintStatus.UNDER_INVESTIGATION, ComplaintStatus.RESOLVED, ComplaintStatus.CLOSED]),
          priority: pick([ComplaintPriority.LOW, ComplaintPriority.MEDIUM, ComplaintPriority.HIGH, ComplaintPriority.CRITICAL]),
          complainantName: `${pick(ghanaFirstNames)} ${pick(ghanaLastNames)}`,
          complainantPhone: `+2332${rand(40, 59)}${rand(1000000, 9999999)}`,
          complainantEmail: `${pick(ghanaFirstNames).toLowerCase()}@gmail.com`,
          subject: pick([
            'Delayed claim settlement', 'Premium overcharge', 'Poor customer service',
            'Policy cancellation dispute', 'Incorrect policy details', 'Agent misconduct',
            'Renewal terms disagreement', 'Coverage denial dispute',
          ]),
          category: pick(complaintCategories),
          description: 'The complainant has raised concerns regarding the handling of their insurance matter and requests immediate attention and resolution.',
          assignedToId: pick(userMap[tenant.id]),
          slaDeadline: daysFromNow(rand(1, 14)),
          createdAt: created,
        },
      });
    }
  }
  console.log('✅ Complaints: 12 per tenant');

  // ════════════════════════════════════════════════════
  // ─── LEADS ─────────────────────────────────────────
  // ════════════════════════════════════════════════════
  for (const tenant of [sicTenant, enterpriseTenant]) {
    for (let i = 0; i < 20; i++) {
      const leadNum = `LEAD-${String(i + 1).padStart(4, '0')}`;
      const fn = pick(ghanaFirstNames);
      const ln = pick(ghanaLastNames);

      await prisma.lead.upsert({
        where: { tenantId_leadNumber: { tenantId: tenant.id, leadNumber: leadNum } },
        update: {},
        create: {
          tenantId: tenant.id,
          leadNumber: leadNum,
          status: pick([LeadStatus.NEW, LeadStatus.CONTACTED, LeadStatus.QUALIFIED, LeadStatus.QUOTED, LeadStatus.NEGOTIATION, LeadStatus.CONVERTED, LeadStatus.LOST, LeadStatus.NURTURING]),
          priority: pick([LeadPriority.HOT, LeadPriority.WARM, LeadPriority.COLD]),
          source: pick([LeadSource.REFERRAL, LeadSource.WEBSITE, LeadSource.WALK_IN, LeadSource.PHONE, LeadSource.EMAIL, LeadSource.SOCIAL_MEDIA, LeadSource.EVENT]),
          contactName: `${fn} ${ln}`,
          companyName: i % 3 === 0 ? pick(ghanaCompanies) : undefined,
          phone: `+2332${rand(40, 59)}${rand(1000000, 9999999)}`,
          email: `${fn.toLowerCase()}.${ln.toLowerCase()}@gmail.com`,
          productInterest: pickN(['Motor Insurance', 'Fire Insurance', 'Marine Insurance', 'Life Insurance', 'Health Insurance', 'Travel Insurance', 'Engineering Insurance'], rand(1, 3)),
          estimatedPremium: randDec(1000, 50000),
          estimatedCommission: randDec(200, 7500),
          assignedBrokerId: pick(brokerMap[tenant.id]),
          score: rand(10, 95),
          nextFollowUpDate: daysFromNow(rand(1, 30)),
          lastContactDate: daysAgo(rand(0, 14)),
          notes: pick([
            'Interested in comprehensive motor cover for fleet',
            'Requesting quote for fire insurance on new warehouse',
            'Referred by existing client, very promising lead',
            'Needs group health insurance for 50 employees',
            'Looking for competitive marine cargo rates',
            'Met at industry conference, follow up scheduled',
          ]),
        },
      });
    }
  }
  console.log('✅ Leads: 20 per tenant');

  // ════════════════════════════════════════════════════
  // ─── TRANSACTIONS ──────────────────────────────────
  // ════════════════════════════════════════════════════
  for (const tenant of [sicTenant, enterpriseTenant]) {
    const policies = policyIds[tenant.id];

    for (let i = 0; i < 40; i++) {
      const txnNum = `TXN-${new Date().getFullYear()}-${String(i + 1).padStart(5, '0')}`;
      const pol = policies[i % policies.length];
      const txnType = i % 5 === 0 ? TransactionType.COMMISSION : TransactionType.PREMIUM;
      const amount = txnType === TransactionType.COMMISSION
        ? parseFloat((pol.premium * pol.commissionRate / 100).toFixed(2))
        : pol.premium;

      await prisma.transaction.upsert({
        where: { tenantId_transactionNumber: { tenantId: tenant.id, transactionNumber: txnNum } },
        update: {},
        create: {
          tenantId: tenant.id,
          transactionNumber: txnNum,
          type: txnType,
          amount,
          paymentMethod: pick([PaymentMethod.BANK_TRANSFER, PaymentMethod.MOBILE_MONEY, PaymentMethod.CHEQUE, PaymentMethod.CASH, PaymentMethod.CARD]),
          paymentStatus: pick([PaymentStatus.PAID, PaymentStatus.PAID, PaymentStatus.PENDING, PaymentStatus.PARTIAL]),
          momoNetwork: undefined,
          reference: `REF-${rand(100000, 999999)}`,
          clientId: pol.clientId,
          policyId: pol.id,
          processedById: pick(userMap[tenant.id]),
          processedAt: daysAgo(rand(0, 60)),
          notes: `Payment for policy premium / commission`,
          createdAt: daysAgo(rand(0, 90)),
        },
      });
    }
  }
  console.log('✅ Transactions: 40 per tenant');

  // ════════════════════════════════════════════════════
  // ─── INVOICES ──────────────────────────────────────
  // ════════════════════════════════════════════════════
  for (const tenant of [sicTenant, enterpriseTenant]) {
    const policies = policyIds[tenant.id];

    for (let i = 0; i < 30; i++) {
      const invNum = `INV-${new Date().getFullYear()}-${String(i + 1).padStart(5, '0')}`;
      const pol = policies[i % policies.length];
      const amount = pol.premium;
      const status = pick([InvoiceStatus.PAID, InvoiceStatus.OUTSTANDING, InvoiceStatus.PARTIAL, InvoiceStatus.OVERDUE]);

      await prisma.invoice.upsert({
        where: { tenantId_invoiceNumber: { tenantId: tenant.id, invoiceNumber: invNum } },
        update: {},
        create: {
          tenantId: tenant.id,
          invoiceNumber: invNum,
          clientId: pol.clientId,
          policyId: pol.id,
          description: `Premium invoice for policy ${pol.id.slice(0, 8)}`,
          amount,
          amountPaid: status === InvoiceStatus.PAID ? amount : status === InvoiceStatus.PARTIAL ? amount * 0.5 : 0,
          status,
          dateIssued: daysAgo(rand(10, 90)),
          dateDue: daysFromNow(rand(-30, 30)),
          datePaid: status === InvoiceStatus.PAID ? daysAgo(rand(1, 30)) : undefined,
        },
      });
    }
  }
  console.log('✅ Invoices: 30 per tenant');

  // ════════════════════════════════════════════════════
  // ─── COMMISSIONS ───────────────────────────────────
  // ════════════════════════════════════════════════════
  for (const tenant of [sicTenant, enterpriseTenant]) {
    const policies = policyIds[tenant.id];

    for (let i = 0; i < 40; i++) {
      const pol = policies[i % policies.length];
      const carrier = await prisma.carrier.findUnique({ where: { id: pol.carrierId }, select: { name: true } });
      const commAmount = parseFloat((pol.premium * pol.commissionRate / 100).toFixed(2));
      const nicLevy = parseFloat((commAmount * NIC_LEVY_RATE).toFixed(2));
      const status = pick([CommissionStatus.PENDING, CommissionStatus.EARNED, CommissionStatus.PAID, CommissionStatus.PAID]);

      await prisma.commission.create({
        data: {
          tenantId: tenant.id,
          policyId: pol.id,
          clientId: pol.clientId,
          insurerName: carrier?.name || 'Unknown',
          productType: pol.insuranceType,
          premiumAmount: pol.premium,
          commissionRate: pol.commissionRate,
          commissionAmount: commAmount,
          nicLevy,
          netCommission: commAmount - nicLevy,
          status,
          brokerId: pick(brokerMap[tenant.id]),
          dateEarned: status !== CommissionStatus.PENDING ? daysAgo(rand(1, 60)) : undefined,
          datePaid: status === CommissionStatus.PAID ? daysAgo(rand(1, 30)) : undefined,
        },
      });
    }
  }
  console.log('✅ Commissions: 40 per tenant');

  // ════════════════════════════════════════════════════
  // ─── EXPENSES ──────────────────────────────────────
  // ════════════════════════════════════════════════════
  for (const tenant of [sicTenant, enterpriseTenant]) {
    for (let i = 0; i < 20; i++) {
      await prisma.expense.create({
        data: {
          tenantId: tenant.id,
          date: daysAgo(rand(1, 90)),
          description: `${pick(expenseCategories)} - ${pick(['Q1', 'Q2', 'Q3', 'Q4'])} expense`,
          category: pick(expenseCategories),
          amount: randDec(100, 15000),
          vendor: pick(['Papyrus Stationery', 'Melcom Ltd', 'Telefonika', 'MTN Ghana', 'AirtelTigo', 'CompuGhana', 'Maxmart', 'Franko Trading']),
          reference: `EXP-${rand(100000, 999999)}`,
          paymentMethod: pick(['Bank Transfer', 'Cash', 'Mobile Money', 'Cheque']),
          status: pick([ExpenseStatus.APPROVED, ExpenseStatus.PENDING, ExpenseStatus.DRAFT, ExpenseStatus.APPROVED]),
          approvedById: pick(userMap[tenant.id]),
          department: pick(['Underwriting', 'Claims', 'Finance', 'Sales', 'IT', 'Admin']),
          notes: 'Routine operational expense',
        },
      });
    }
  }
  console.log('✅ Expenses: 20 per tenant');

  // ════════════════════════════════════════════════════
  // ─── DOCUMENTS ─────────────────────────────────────
  // ════════════════════════════════════════════════════
  const docNames = [
    'Ghana Card Scan', 'Policy Certificate', 'Vehicle Registration',
    'Claim Form', 'Loss Report', 'Medical Report', 'NIC Compliance Report',
    'Premium Receipt', 'Endorsement Letter', 'KYC Verification Form',
    'Board Resolution', 'Certificate of Incorporation', 'Tax Clearance',
    'Fire Safety Certificate', 'Marine Bill of Lading',
  ];

  for (const tenant of [sicTenant, enterpriseTenant]) {
    for (let i = 0; i < 25; i++) {
      await prisma.document.create({
        data: {
          tenantId: tenant.id,
          name: docNames[i % docNames.length],
          category: pick([DocumentCategory.CLIENT, DocumentCategory.POLICY, DocumentCategory.CLAIM, DocumentCategory.COMPLIANCE, DocumentCategory.KYC]),
          mimeType: pick(['application/pdf', 'image/jpeg', 'image/png', 'application/pdf']),
          sizeBytes: rand(50000, 5000000),
          storagePath: `/documents/${tenant.slug}/${rand(1000, 9999)}.pdf`,
          uploadedById: pick(userMap[tenant.id]),
          version: 1,
        },
      });
    }
  }
  console.log('✅ Documents: 25 per tenant');

  // ════════════════════════════════════════════════════
  // ─── TASKS ─────────────────────────────────────────
  // ════════════════════════════════════════════════════
  const taskTitles = [
    'Follow up on pending claim documents', 'Renew expiring motor policies',
    'Complete KYC verification for new client', 'Process commission payments',
    'Review fire insurance proposal', 'Schedule client meeting in Kumasi',
    'Submit quarterly NIC report', 'Update client contact information',
    'Prepare marine cargo quotation', 'Audit premium collection records',
    'Organize team training session', 'Review complaint resolution',
    'Process policy endorsement request', 'Send renewal reminders',
    'Verify bank details for settlement',
  ];

  for (const tenant of [sicTenant, enterpriseTenant]) {
    for (let i = 0; i < 15; i++) {
      await prisma.task.create({
        data: {
          tenantId: tenant.id,
          title: taskTitles[i],
          description: `Task details: ${taskTitles[i]}. Please complete before the due date.`,
          priority: pick([TaskPriority.HOT, TaskPriority.WARM, TaskPriority.COLD]),
          status: pick([TaskStatus.PENDING, TaskStatus.UNDER_REVIEW, TaskStatus.REGISTERED]),
          dueDate: daysFromNow(rand(1, 30)),
          type: pick(['follow-up', 'renewal', 'compliance', 'admin', 'client-meeting']),
          isCompleted: i > 10,
          assignedToId: pick(userMap[tenant.id]),
          createdById: userMap[tenant.id][0],
          completedAt: i > 10 ? daysAgo(rand(1, 10)) : undefined,
        },
      });
    }
  }
  console.log('✅ Tasks: 15 per tenant');

  // ════════════════════════════════════════════════════
  // ─── NOTIFICATIONS ─────────────────────────────────
  // ════════════════════════════════════════════════════
  for (const tenant of [sicTenant, enterpriseTenant]) {
    // Fetch a sample of actual generated data for this tenant
    const tenantClients = await prisma.client.findMany({ where: { tenantId: tenant.id }, take: 10 });
    const tenantPolicies = await prisma.policy.findMany({ where: { tenantId: tenant.id }, take: 10 });
    const tenantClaims = await prisma.claim.findMany({ where: { tenantId: tenant.id }, take: 10 });

    for (const userId of userMap[tenant.id]) {
      const numNotifs = rand(3, 7);
      for (let i = 0; i < numNotifs; i++) {
        // Pick random real data
        const c = pick(tenantClients);
        const p = pick(tenantPolicies);
        const cl = pick(tenantClaims);
        
        const cName = c?.type === 'INDIVIDUAL' ? `${c.firstName} ${c.lastName}` : c?.companyName || 'Unknown Client';
        const pNum = p?.policyNumber || 'POL-N/A';
        const clNum = cl?.claimNumber || 'CLM-N/A';

        const dynamicTemplates = [
          { title: 'Policy Renewal Due', message: `Motor policy ${pNum} expires in 7 days`, type: NotificationType.RENEWAL },
          { title: 'Claim Update', message: `Claim ${clNum} has been assessed and approved`, type: NotificationType.CLAIM },
          { title: 'Commission Paid', message: `Commission of GHS ${randDec(100, 5000)} has been credited`, type: NotificationType.COMMISSION },
          { title: 'New Lead Assigned', message: `A new hot lead has been assigned to you`, type: NotificationType.LEAD },
          { title: 'Follow-up Reminder', message: `Follow up with ${cName} regarding their insurance quote`, type: NotificationType.FOLLOWUP },
          { title: 'Compliance Alert', message: 'Annual NIC compliance report due in 5 days', type: NotificationType.COMPLIANCE },
          { title: 'Payment Received', message: `Premium payment of GHS ${randDec(1000, 10000)} received from ${cName}`, type: NotificationType.FINANCE },
          { title: 'System Update', message: 'IBMS system maintenance scheduled for this weekend', type: NotificationType.SYSTEM },
          { title: 'Document Expired', message: `KYC document for client ${cName} has expired`, type: NotificationType.DOCUMENT },
          { title: 'Approval Required', message: `Policy endorsement for ${pNum} requires your approval`, type: NotificationType.APPROVAL },
        ];

        const n = pick(dynamicTemplates);

        await prisma.notification.create({
          data: {
            tenantId: tenant.id,
            userId,
            title: n.title,
            message: n.message,
            type: n.type,
            priority: pick([NotificationPriority.LOW, NotificationPriority.MEDIUM, NotificationPriority.HIGH]),
            read: Math.random() > 0.6,
            createdAt: daysAgo(rand(0, 30)),
          },
        });
      }
    }
  }
  console.log('✅ Notifications: 3-7 per user');

  // ════════════════════════════════════════════════════
  // ─── CALENDAR EVENTS ───────────────────────────────
  // ════════════════════════════════════════════════════
  const eventTemplates = [
    { title: 'Client Review Meeting', type: CalendarEventType.MEETING, location: 'Conference Room A' },
    { title: 'Policy Renewal Review', type: CalendarEventType.POLICY, location: 'Office' },
    { title: 'Claims Assessment', type: CalendarEventType.CLAIM, location: 'Claims Department' },
    { title: 'Team Stand-up', type: CalendarEventType.TEAM, location: 'Main Hall' },
    { title: 'NIC Compliance Review', type: CalendarEventType.COMPLIANCE, location: 'Board Room' },
    { title: 'Premium Collection Follow-up', type: CalendarEventType.PAYMENT, location: 'Finance Office' },
    { title: 'Client Visit - Kumasi', type: CalendarEventType.MEETING, location: 'Kumasi Branch' },
    { title: 'Quarterly Performance Review', type: CalendarEventType.TEAM, location: 'Conference Room B' },
    { title: 'Insurance Industry Conference', type: CalendarEventType.MEETING, location: 'Accra International Conference Centre' },
    { title: 'Fire Risk Assessment', type: CalendarEventType.CLAIM, location: 'Client Site' },
  ];

  for (const tenant of [sicTenant, enterpriseTenant]) {
    for (let i = 0; i < 15; i++) {
      const evt = eventTemplates[i % eventTemplates.length];
      const startDate = daysFromNow(rand(-15, 30));
      const endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + rand(1, 4));

      const event = await prisma.calendarEvent.create({
        data: {
          tenantId: tenant.id,
          title: evt.title,
          description: `Scheduled ${evt.title.toLowerCase()} event`,
          startDate,
          endDate,
          type: evt.type,
          status: startDate < new Date() ? CalendarEventStatus.COMPLETED : CalendarEventStatus.UPCOMING,
          location: evt.location,
          createdById: userMap[tenant.id][0],
        },
      });

      // Add 2-4 attendees
      const attendees = pickN(userMap[tenant.id], rand(2, 4));
      for (const userId of attendees) {
        await prisma.calendarAttendee.create({
          data: { eventId: event.id, userId },
        }).catch(() => {});
      }
    }
  }
  console.log('✅ Calendar Events: 15 per tenant');

  // ════════════════════════════════════════════════════
  // ─── APPROVALS ─────────────────────────────────────
  // ════════════════════════════════════════════════════
  for (const tenant of [sicTenant, enterpriseTenant]) {
    const approvalData = [
      { type: ApprovalType.POLICY, subject: 'New motor policy approval - Premium GHS 25,000', amount: 25000 },
      { type: ApprovalType.CLAIM_SETTLEMENT, subject: 'Claim settlement for fire damage - GHS 150,000', amount: 150000 },
      { type: ApprovalType.ENDORSEMENT, subject: 'Policy endorsement - Sum insured increase', amount: 5000 },
      { type: ApprovalType.CANCELLATION, subject: 'Policy cancellation request - Client relocation', amount: undefined },
      { type: ApprovalType.REFUND, subject: 'Premium refund for cancelled policy - GHS 3,500', amount: 3500 },
      { type: ApprovalType.POLICY, subject: 'Marine cargo policy - High value shipment', amount: 80000 },
      { type: ApprovalType.CLAIM_SETTLEMENT, subject: 'Motor accident claim settlement', amount: 45000 },
      { type: ApprovalType.POLICY, subject: 'Group health insurance - 100 employees', amount: 120000 },
    ];

    for (let i = 0; i < approvalData.length; i++) {
      const a = approvalData[i];
      const refNum = `APR-${new Date().getFullYear()}-${String(i + 1).padStart(4, '0')}`;
      const status = pick([ApprovalStatus.PENDING, ApprovalStatus.PENDING, ApprovalStatus.APPROVED, ApprovalStatus.REJECTED]);

      await prisma.approval.upsert({
        where: { tenantId_refNumber: { tenantId: tenant.id, refNumber: refNum } },
        update: {},
        create: {
          tenantId: tenant.id,
          refNumber: refNum,
          type: a.type,
          status,
          priority: pick(['low', 'medium', 'high', 'urgent']),
          subject: a.subject,
          clientName: `${pick(ghanaFirstNames)} ${pick(ghanaLastNames)}`,
          amount: a.amount,
          requestedById: pick(userMap[tenant.id]),
          approvedById: status === ApprovalStatus.APPROVED ? userMap[tenant.id][0] : undefined,
          dueDate: daysFromNow(rand(1, 14)),
          isOverdue: Math.random() > 0.8,
        },
      });
    }
  }
  console.log('✅ Approvals: 8 per tenant');

  // ════════════════════════════════════════════════════
  // ─── AUDIT LOGS ────────────────────────────────────
  // ════════════════════════════════════════════════════
  const auditActions = [
    { action: 'CREATE', entity: 'Policy' }, { action: 'UPDATE', entity: 'Policy' },
    { action: 'CREATE', entity: 'Client' }, { action: 'UPDATE', entity: 'Claim' },
    { action: 'CREATE', entity: 'Claim' }, { action: 'LOGIN', entity: 'User' },
    { action: 'UPDATE', entity: 'Commission' }, { action: 'CREATE', entity: 'Invoice' },
    { action: 'DELETE', entity: 'Document' }, { action: 'UPDATE', entity: 'Lead' },
  ];

  for (const tenant of [sicTenant, enterpriseTenant]) {
    for (let i = 0; i < 30; i++) {
      const audit = auditActions[i % auditActions.length];
      await prisma.auditLog.create({
        data: {
          tenantId: tenant.id,
          userId: pick(userMap[tenant.id]),
          action: audit.action,
          entity: audit.entity,
          ipAddress: `192.168.1.${rand(1, 254)}`,
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0',
          createdAt: daysAgo(rand(0, 60)),
        },
      });
    }
  }
  console.log('✅ Audit Logs: 30 per tenant');

  // ════════════════════════════════════════════════════
  // ─── PLATFORM SUPER ADMIN USER ─────────────────────
  // ════════════════════════════════════════════════════
  const superAdmin = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: sicTenant.id, email: 'superadmin@brokerium.com' } },
    update: {
      role: 'PLATFORM_SUPER_ADMIN' as any,
      permissions: DEFAULT_ROLE_PERMISSIONS['PLATFORM_SUPER_ADMIN'] ?? [],
    },
    create: {
      tenantId: sicTenant.id,
      email: 'superadmin@brokerium.com',
      passwordHash,
      firstName: 'Platform',
      lastName: 'SuperAdmin',
      phone: '+233244000001',
      jobTitle: 'Platform Super Administrator',
      branchId: branchMap[sicTenant.id][0],
      isActive: true,
      mustChangePassword: false,
      role: 'PLATFORM_SUPER_ADMIN' as any,
      permissions: DEFAULT_ROLE_PERMISSIONS['PLATFORM_SUPER_ADMIN'] ?? [],
    },
  });
  console.log('✅ Platform Super Admin: superadmin@brokerium.com / Admin@123');

  // migrateExistingUsersToRbac is deprecated for fresh seeding
  // await migrateExistingUsersToRbac(prisma, roleMap);

  // ════════════════════════════════════════════════════
  // ─── SUBSCRIPTIONS ─────────────────────────────────
  // ════════════════════════════════════════════════════
  const subscriptionData = [
    { tenant: sicTenant, plan: TenantPlan.PROFESSIONAL, amount: 599.00, status: 'ACTIVE' as const, daysBack: 45 },
    { tenant: enterpriseTenant, plan: TenantPlan.BASIC, amount: 199.00, status: 'ACTIVE' as const, daysBack: 120 },
  ];

  const subscriptionMap: Record<string, string> = {};
  for (const sub of subscriptionData) {
    const start = daysAgo(sub.daysBack);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const subscription = await prisma.subscription.create({
      data: {
        tenantId: sub.tenant.id,
        plan: sub.plan,
        billingCycle: 'MONTHLY',
        amountGhs: sub.amount,
        status: sub.status,
        currentPeriodStart: start,
        currentPeriodEnd: end,
      },
    });
    subscriptionMap[sub.tenant.id] = subscription.id;
  }
  console.log('✅ Subscriptions: 1 per tenant');

  // ════════════════════════════════════════════════════
  // ─── PLATFORM PAYMENTS ─────────────────────────────
  // ════════════════════════════════════════════════════
  const paymentStatuses = ['PAID', 'PAID', 'PAID', 'PAID', 'PAID', 'FAILED', 'PENDING'] as const;
  for (const tenant of [sicTenant, enterpriseTenant]) {
    const subId = subscriptionMap[tenant.id];
    const amount = tenant.id === sicTenant.id ? 599.00 : 199.00;

    for (let i = 0; i < 6; i++) {
      const status = paymentStatuses[i % paymentStatuses.length];
      await prisma.platformPayment.create({
        data: {
          tenantId: tenant.id,
          subscriptionId: subId,
          amountGhs: amount,
          status,
          invoiceNumber: `PLAT-INV-${tenant.slug.slice(0, 3).toUpperCase()}-${String(i + 1).padStart(3, '0')}`,
          paystackReference: status === 'PAID' ? `PSK_${rand(100000000, 999999999)}` : null,
          paidAt: status === 'PAID' ? daysAgo(30 * i + rand(0, 5)) : null,
          createdAt: daysAgo(30 * i),
        },
      });
    }
  }
  console.log('✅ Platform Payments: 6 per tenant');

  // ════════════════════════════════════════════════════
  // ─── PLATFORM AUDIT LOGS ───────────────────────────
  // ════════════════════════════════════════════════════
  const platformAuditEntries = [
    { category: 'AUTH' as const, action: 'LOGIN', desc: 'Super admin logged in', severity: 'INFO' as const },
    { category: 'TENANT' as const, action: 'TENANT_CREATED', desc: 'New tenant SIC Insurance provisioned', severity: 'INFO' as const },
    { category: 'TENANT' as const, action: 'TENANT_CREATED', desc: 'New tenant Enterprise Insurance provisioned', severity: 'INFO' as const },
    { category: 'BILLING' as const, action: 'SUBSCRIPTION_UPDATED', desc: 'SIC upgraded to Professional plan', severity: 'INFO' as const },
    { category: 'USER' as const, action: 'USER_UPDATED', desc: 'User role changed: broker to senior broker', severity: 'INFO' as const },
    { category: 'TENANT' as const, action: 'TENANT_SUSPENDED', desc: 'Test tenant suspended for non-payment', severity: 'WARN' as const },
    { category: 'TENANT' as const, action: 'TENANT_ACTIVATED', desc: 'Test tenant reactivated after payment', severity: 'INFO' as const },
    { category: 'AUTH' as const, action: 'IMPERSONATION_STARTED', desc: 'Super admin impersonating SIC admin', severity: 'WARN' as const },
    { category: 'AUTH' as const, action: 'IMPERSONATION_EXITED', desc: 'Impersonation session ended', severity: 'INFO' as const },
    { category: 'SYSTEM' as const, action: 'FEATURE_FLAG_UPDATED', desc: 'Feature flag "ai_claims_assistant" enabled globally', severity: 'INFO' as const },
    { category: 'SYSTEM' as const, action: 'SETTINGS_UPDATED', desc: 'SMTP configuration updated', severity: 'INFO' as const },
    { category: 'SECURITY' as const, action: 'PASSWORD_RESET_FORCED', desc: 'Forced password reset for user kofi@sic.com', severity: 'WARN' as const },
    { category: 'COMPLIANCE' as const, action: 'NIC_COMPLIANCE_UPDATED', desc: 'NIC compliance score updated for SIC Insurance', severity: 'INFO' as const },
    { category: 'SYSTEM' as const, action: 'ANNOUNCEMENT_CREATED', desc: 'Maintenance window broadcast sent', severity: 'INFO' as const },
    { category: 'ERROR' as const, action: 'ERROR_RESOLVED', desc: 'Critical database timeout error resolved', severity: 'WARN' as const },
    { category: 'BILLING' as const, action: 'PAYMENT_FAILED', desc: 'Paystack payment failed for Enterprise Insurance', severity: 'WARN' as const },
    { category: 'USER' as const, action: 'SUPER_ADMIN_CREATED', desc: 'New super admin account created', severity: 'CRITICAL' as const },
    { category: 'SECURITY' as const, action: 'FORCED_LOGOUT', desc: 'User forced logout by super admin', severity: 'WARN' as const },
    { category: 'AUTH' as const, action: 'LOGIN', desc: 'Super admin logged in from new IP', severity: 'INFO' as const },
    { category: 'SYSTEM' as const, action: 'JOB_RETRIED', desc: 'Failed email job manually retried', severity: 'INFO' as const },
  ];

  for (let i = 0; i < platformAuditEntries.length; i++) {
    const entry = platformAuditEntries[i];
    await prisma.platformAuditLog.create({
      data: {
        actorId: superAdmin.id,
        actorEmail: 'superadmin@brokerium.com',
        actorRole: 'PLATFORM_SUPER_ADMIN',
        tenantId: i % 2 === 0 ? sicTenant.id : enterpriseTenant.id,
        tenantName: i % 2 === 0 ? sicTenant.name : enterpriseTenant.name,
        category: entry.category,
        severity: entry.severity,
        action: entry.action,
        description: entry.desc,
        ipAddress: `41.215.${rand(1, 255)}.${rand(1, 255)}`,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        status: 'SUCCESS',
        createdAt: daysAgo(rand(0, 90)),
      },
    });
  }
  console.log('✅ Platform Audit Logs: 20 entries');

  // ════════════════════════════════════════════════════
  // ─── SYSTEM HEALTH CHECKS ─────────────────────────
  // ════════════════════════════════════════════════════
  const services = ['Database', 'Background Jobs', 'Email Service'];
  const healthStatuses = ['HEALTHY', 'HEALTHY', 'HEALTHY', 'HEALTHY', 'HEALTHY', 'DEGRADED', 'DOWN'] as const;

  for (const svc of services) {
    for (let i = 0; i < 30; i++) {
      const status = i < 28 ? 'HEALTHY' : pick([...healthStatuses]);
      await prisma.systemHealthCheck.create({
        data: {
          serviceName: svc,
          status,
          responseTimeMs: status === 'HEALTHY' ? rand(5, 120) : status === 'DEGRADED' ? rand(500, 3000) : 0,
          checkedAt: daysAgo(i),
          errorMessage: status === 'DOWN' ? `${svc} connection refused` : status === 'DEGRADED' ? `${svc} response slow` : null,
        },
      });
    }
  }
  console.log('✅ System Health Checks: 90 entries (30 days × 3 services)');

  // ════════════════════════════════════════════════════
  // ─── INCIDENTS ─────────────────────────────────────
  // ════════════════════════════════════════════════════
  const incidents = [
    { title: 'Database connection pool exhaustion', severity: AuditSeverity.CRITICAL, status: IncidentStatus.RESOLVED, daysBack: 15 },
    { title: 'Email delivery delays (Mailgun outage)', severity: AuditSeverity.WARN, status: IncidentStatus.RESOLVED, daysBack: 30 },
    { title: 'Slow API response times during peak hours', severity: AuditSeverity.WARN, status: IncidentStatus.OPEN, daysBack: 3 },
  ];

  for (const inc of incidents) {
    await prisma.incident.create({
      data: {
        title: inc.title,
        status: inc.status,
        severity: inc.severity,
        affectedServices: inc.title.includes('Database') ? ['Database'] : inc.title.includes('Email') ? ['Email Service'] : ['API Gateway'],
        startedAt: daysAgo(inc.daysBack),
        resolvedAt: inc.status === 'RESOLVED' ? daysAgo(inc.daysBack - 1) : null,
        rootCause: inc.status === 'RESOLVED' ? 'Root cause identified and patched' : null,
        resolutionNotes: inc.status === 'RESOLVED' ? 'Issue resolved. Monitoring for recurrence.' : null,
        createdById: superAdmin.id,
      },
    });
  }
  console.log('✅ Incidents: 3 entries');

  // ════════════════════════════════════════════════════
  // ─── ERROR LOGS ────────────────────────────────────
  // ════════════════════════════════════════════════════
  const errorTemplates = [
    { type: 'PrismaClientKnownRequestError', msg: 'Unique constraint failed on fields: (email)', sev: 'ERROR' as const },
    { type: 'HttpException', msg: 'Unauthorized - Invalid or expired token', sev: 'WARNING' as const },
    { type: 'TypeError', msg: "Cannot read properties of undefined (reading 'id')", sev: 'ERROR' as const },
    { type: 'ConnectionError', msg: 'ECONNREFUSED 127.0.0.1:5432', sev: 'FATAL' as const },
    { type: 'TimeoutError', msg: 'Query timeout after 30000ms', sev: 'ERROR' as const },
    { type: 'ValidationError', msg: 'Invalid enum value for field "status"', sev: 'WARNING' as const },
    { type: 'MailgunError', msg: 'Failed to send email: 550 Mailbox not found', sev: 'ERROR' as const },
    { type: 'PaystackError', msg: 'Card declined: insufficient funds', sev: 'WARNING' as const },
  ];

  for (let i = 0; i < errorTemplates.length; i++) {
    const err = errorTemplates[i];
    const firstSeen = daysAgo(rand(10, 60));
    const resolved = i < 4;
    await prisma.errorLog.create({
      data: {
        errorType: err.type,
        message: err.msg,
        stackTrace: `Error: ${err.msg}\n    at Object.handler (/app/src/controllers/controller.ts:${rand(10, 200)}:${rand(5, 40)})\n    at /app/node_modules/@nestjs/core/router/router-execution-context.js:46:28\n    at processTicksAndRejections (node:internal/process/task_queues:95:5)`,
        severity: err.sev,
        tenantId: i % 2 === 0 ? sicTenant.id : enterpriseTenant.id,
        requestMethod: pick(['GET', 'POST', 'PATCH', 'DELETE']),
        requestUrl: pick(['/api/v1/policies', '/api/v1/claims', '/api/v1/auth/login', '/api/v1/clients', '/api/v1/users']),
        statusCode: err.sev === 'FATAL' ? 500 : err.sev === 'ERROR' ? 400 : 422,
        resolved,
        resolvedAt: resolved ? daysAgo(rand(1, 5)) : null,
        resolvedById: resolved ? superAdmin.id : null,
        notes: resolved ? 'Fixed in latest deployment' : null,
        occurrenceCount: rand(1, 50),
        firstSeenAt: firstSeen,
        lastSeenAt: resolved ? daysAgo(rand(3, 8)) : daysAgo(rand(0, 2)),
      },
    });
  }
  console.log('✅ Error Logs: 8 entries');

  // ════════════════════════════════════════════════════
  // ─── BACKGROUND JOBS ───────────────────────────────
  // ════════════════════════════════════════════════════
  const jobTemplates = [
    { name: 'send-welcome-email', status: 'COMPLETED' as const },
    { name: 'generate-monthly-report', status: 'COMPLETED' as const },
    { name: 'sync-paystack-payments', status: 'COMPLETED' as const },
    { name: 'check-policy-renewals', status: 'COMPLETED' as const },
    { name: 'calculate-commissions', status: 'COMPLETED' as const },
    { name: 'export-tenant-data', status: 'PROCESSING' as const },
    { name: 'send-renewal-reminders', status: 'QUEUED' as const },
    { name: 'nic-compliance-check', status: 'QUEUED' as const },
    { name: 'send-batch-emails', status: 'FAILED' as const },
    { name: 'generate-nic-report', status: 'FAILED' as const },
    { name: 'cleanup-expired-tokens', status: 'COMPLETED' as const },
    { name: 'aggregate-analytics', status: 'RETRYING' as const },
    { name: 'backup-database', status: 'COMPLETED' as const },
    { name: 'send-overdue-payment-notice', status: 'FAILED' as const },
    { name: 'sync-carrier-rates', status: 'COMPLETED' as const },
  ];

  for (let i = 0; i < jobTemplates.length; i++) {
    const job = jobTemplates[i];
    const enqueuedAt = daysAgo(rand(0, 30));
    await prisma.backgroundJob.create({
      data: {
        jobName: job.name,
        tenantId: i % 3 === 0 ? null : i % 2 === 0 ? sicTenant.id : enterpriseTenant.id,
        status: job.status,
        priority: job.name.includes('backup') || job.name.includes('compliance') ? 2 : 0,
        payload: { triggeredBy: 'system', params: { tenantId: sicTenant.id } },
        result: job.status === 'COMPLETED' ? { processed: rand(5, 100), skipped: rand(0, 5) } : null,
        errorMessage: job.status === 'FAILED' ? `Job failed: ${pick(['Connection timeout', 'Rate limit exceeded', 'Invalid payload', 'Service unavailable'])}` : null,
        attempts: job.status === 'FAILED' ? 3 : job.status === 'RETRYING' ? 2 : job.status === 'COMPLETED' ? 1 : 0,
        maxAttempts: 3,
        enqueuedAt,
        startedAt: ['PROCESSING', 'COMPLETED', 'FAILED', 'RETRYING'].includes(job.status) ? new Date(enqueuedAt.getTime() + rand(1000, 30000)) : null,
        completedAt: job.status === 'COMPLETED' ? new Date(enqueuedAt.getTime() + rand(5000, 120000)) : null,
        nextRetryAt: job.status === 'RETRYING' ? daysFromNow(rand(0, 1)) : null,
      },
    });
  }
  console.log('✅ Background Jobs: 15 entries');

  // ════════════════════════════════════════════════════
  // ─── EMAIL LOGS ────────────────────────────────────
  // ════════════════════════════════════════════════════
  const emailTemplateNames = [
    'welcome-tenant', 'password-reset', 'renewal-reminder', 'invoice-generated',
    'claim-status-update', 'payment-receipt', 'overdue-notice', 'policy-issued',
  ];
  const emailStatuses = ['SENT', 'DELIVERED', 'DELIVERED', 'DELIVERED', 'BOUNCED', 'FAILED', 'SPAM'] as const;

  for (let i = 0; i < 10; i++) {
    const template = emailTemplateNames[i % emailTemplateNames.length];
    const status = emailStatuses[i % emailStatuses.length];
    const sentAt = daysAgo(rand(0, 60));

    await prisma.emailLog.create({
      data: {
        templateName: template,
        recipientEmail: `${pick(ghanaFirstNames).toLowerCase()}.${pick(ghanaLastNames).toLowerCase()}@gmail.com`,
        tenantId: i % 2 === 0 ? sicTenant.id : enterpriseTenant.id,
        subject: template.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' '),
        status,
        providerMessageId: status !== 'FAILED' ? `msg_${rand(100000000, 999999999)}` : null,
        sentAt: ['SENT', 'DELIVERED'].includes(status) ? sentAt : null,
        deliveredAt: status === 'DELIVERED' ? new Date(sentAt.getTime() + rand(1000, 60000)) : null,
        createdAt: sentAt,
      },
    });
  }
  console.log('✅ Email Logs: 10 entries');

  // ════════════════════════════════════════════════════
  // ─── ANNOUNCEMENTS ─────────────────────────────────
  // ════════════════════════════════════════════════════
  const announcementData = [
    { title: 'Scheduled Maintenance — March 25, 2026', body: 'The platform will undergo scheduled maintenance from 11 PM to 3 AM WAT. Expect brief downtime. All data is backed up.', type: 'MAINTENANCE' as const },
    { title: 'New Feature: AI Claims Assistant (Beta)', body: 'We are excited to announce the AI Claims Assistant feature in beta. Professional and Enterprise plan tenants can now enable it from their settings.', type: 'INFO' as const },
    { title: 'NIC Compliance Deadline Reminder', body: 'All brokers must submit Q1 2026 levy reports by April 15th. Please ensure your segregation accounts are up to date.', type: 'WARNING' as const },
  ];

  for (const ann of announcementData) {
    await prisma.announcement.create({
      data: {
        title: ann.title,
        body: ann.body,
        type: ann.type,
        targetType: 'ALL',
        delivery: 'BOTH',
        isPinned: ann.type === 'MAINTENANCE',
        sentAt: daysAgo(rand(1, 15)),
        createdById: superAdmin.id,
      },
    });
  }
  console.log('✅ Announcements: 3 entries');

  // ════════════════════════════════════════════════════
  // ─── FEATURE FLAGS ─────────────────────────────────
  // ════════════════════════════════════════════════════
  const featureFlags = [
    { key: 'ai_claims_assistant', label: 'AI Claims Assistant', desc: 'AI-powered claims processing and fraud detection', global: false, starter: false, pro: true, enterprise: true },
    { key: 'two_factor_auth', label: 'Two-Factor Authentication', desc: 'Enforce 2FA for all users', global: true, starter: true, pro: true, enterprise: true },
    { key: 'advanced_reports', label: 'Advanced Reports', desc: 'Custom report builder with drag-and-drop', global: false, starter: false, pro: true, enterprise: true },
    { key: 'api_access', label: 'API Access', desc: 'REST API access for integrations', global: false, starter: false, pro: false, enterprise: true },
    { key: 'bulk_import', label: 'Bulk Import', desc: 'Bulk import clients and policies via CSV', global: true, starter: true, pro: true, enterprise: true },
    { key: 'document_ocr', label: 'Document OCR', desc: 'Optical character recognition for uploaded documents', global: false, starter: false, pro: true, enterprise: true },
    { key: 'custom_branding', label: 'Custom Branding', desc: 'Custom logo, colors, and email templates', global: false, starter: false, pro: true, enterprise: true },
    { key: 'sms_notifications', label: 'SMS Notifications', desc: 'Send SMS notifications to clients and brokers', global: false, starter: false, pro: true, enterprise: true },
    { key: 'multi_branch', label: 'Multi-Branch Support', desc: 'Support for multiple branches per tenant', global: false, starter: false, pro: true, enterprise: true },
    { key: 'chat_support', label: 'In-App Chat', desc: 'Real-time chat between team members', global: true, starter: true, pro: true, enterprise: true },
    { key: 'paystack_integration', label: 'Paystack Integration', desc: 'Online payment collection via Paystack', global: false, starter: false, pro: true, enterprise: true },
    { key: 'dark_mode', label: 'Dark Mode', desc: 'Dark theme for the dashboard', global: true, starter: true, pro: true, enterprise: true },
    { key: 'audit_log_export', label: 'Audit Log Export', desc: 'Export audit logs to CSV/PDF', global: false, starter: false, pro: false, enterprise: true },
    { key: 'compliance_dashboard', label: 'Compliance Dashboard', desc: 'NIC compliance monitoring dashboard', global: false, starter: false, pro: true, enterprise: true },
    { key: 'mobile_app', label: 'Mobile App Access', desc: 'Access via the Brokerium mobile app', global: false, starter: false, pro: false, enterprise: true },
  ];

  for (const flag of featureFlags) {
    await prisma.featureFlag.upsert({
      where: { key: flag.key },
      update: {},
      create: {
        key: flag.key,
        label: flag.label,
        description: flag.desc,
        globalEnabled: flag.global,
        starterEnabled: flag.starter,
        proEnabled: flag.pro,
        enterpriseEnabled: flag.enterprise,
        updatedById: superAdmin.id,
      },
    });
  }
  console.log('✅ Feature Flags: 15 entries');

  // ════════════════════════════════════════════════════
  // ─── PLATFORM SETTINGS ─────────────────────────────
  // ════════════════════════════════════════════════════
  const platformSettings = [
    { key: 'smtp_host', value: 'smtp.mailgun.org' },
    { key: 'smtp_port', value: 587 },
    { key: 'smtp_from_email', value: 'noreply@brokerium.com' },
    { key: 'smtp_from_name', value: 'Brokerium Platform' },
    { key: 'nic_levy_rate', value: 0.01 },
    { key: 'max_tenants', value: 500 },
    { key: 'max_storage_gb_per_tenant', value: 10 },
    { key: 'trial_period_days', value: 14 },
    { key: 'default_plan', value: 'BASIC' },
    { key: 'maintenance_mode', value: false },
    { key: 'platform_version', value: '1.0.0' },
    { key: 'support_email', value: 'support@brokerium.com' },
    { key: 'paystack_public_key', value: 'pk_test_xxxxxxxxxxxxx' },
    { key: 'backup_enabled', value: true },
    { key: 'backup_schedule', value: '0 2 * * *' },
  ];

  for (const setting of platformSettings) {
    await prisma.platformSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: {
        key: setting.key,
        value: setting.value as any,
        updatedById: superAdmin.id,
      },
    });
  }
  console.log('✅ Platform Settings: 15 entries');

  // ════════════════════════════════════════════════════
  // ─── NIC COMPLIANCE ────────────────────────────────
  // ════════════════════════════════════════════════════
  const nicData = [
    { tenant: sicTenant, licence: 'NIC/BRK/2024/001', score: 85, segregation: true, levy: 'CURRENT', kyc: 'VERIFIED' },
    { tenant: enterpriseTenant, licence: 'NIC/BRK/2024/002', score: 62, segregation: false, levy: 'OVERDUE', kyc: 'PENDING' },
  ];

  for (const nic of nicData) {
    await prisma.nicCompliance.upsert({
      where: { tenantId: nic.tenant.id },
      update: {},
      create: {
        tenantId: nic.tenant.id,
        licenceNumber: nic.licence,
        expiryDate: daysFromNow(rand(60, 300)),
        segregationCompliant: nic.segregation,
        lastRemittanceDate: daysAgo(rand(15, 60)),
        nextRemittanceDue: daysFromNow(rand(15, 45)),
        levyStatus: nic.levy,
        kycStatus: nic.kyc,
        complianceScore: nic.score,
        lastCheckedAt: daysAgo(rand(0, 7)),
      },
    });
  }
  console.log('✅ NIC Compliance: 1 per tenant');

  // ════════════════════════════════════════════════════
  // ─── SUMMARY ───────────────────────────────────────
  // ════════════════════════════════════════════════════
  const counts = await Promise.all([
    prisma.tenant.count(),
    prisma.branch.count(),
    prisma.department.count(),
    prisma.user.count(),
    prisma.carrier.count(),
    prisma.product.count(),
    prisma.client.count(),
    prisma.policy.count(),
    prisma.claim.count(),
    prisma.complaint.count(),
    prisma.lead.count(),
    prisma.transaction.count(),
    prisma.invoice.count(),
    prisma.commission.count(),
    prisma.expense.count(),
    prisma.document.count(),
    prisma.task.count(),
    prisma.notification.count(),
    prisma.calendarEvent.count(),
    prisma.approval.count(),
    prisma.auditLog.count(),
    prisma.subscription.count(),
    prisma.platformPayment.count(),
    prisma.platformAuditLog.count(),
    prisma.systemHealthCheck.count(),
    prisma.incident.count(),
    prisma.errorLog.count(),
    prisma.backgroundJob.count(),
    prisma.emailLog.count(),
    prisma.announcement.count(),
    prisma.featureFlag.count(),
    prisma.platformSetting.count(),
    prisma.nicCompliance.count(),
  ]);

  const labels = [
    'Tenants', 'Branches', 'Departments', 'Users', 'Carriers', 'Products',
    'Clients', 'Policies', 'Claims', 'Complaints', 'Leads', 'Transactions',
    'Invoices', 'Commissions', 'Expenses', 'Documents', 'Tasks', 'Notifications',
    'Calendar Events', 'Approvals', 'Audit Logs',
    'Subscriptions', 'Platform Payments', 'Platform Audit Logs',
    'Health Checks', 'Incidents', 'Error Logs', 'Background Jobs',
    'Email Logs', 'Announcements', 'Feature Flags', 'Platform Settings',
    'NIC Compliance',
  ];

  console.log('\n📊 Seed Summary:');
  labels.forEach((label, idx) => {
    console.log(`   ${label.padEnd(22)} ${counts[idx]}`);
  });
  console.log('\n✅ Comprehensive seeding complete!');
  console.log('   Login (Super Admin): superadmin@brokerium.com / Admin@123');
  console.log('   Login (SIC Admin):   admin@sic.com / Admin@123');
  console.log('   Login (Enterprise):  admin@enterprise.com / Admin@123');
}

main()
  .catch((e: unknown) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
