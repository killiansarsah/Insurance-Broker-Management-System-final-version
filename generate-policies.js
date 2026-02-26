/**
 * Generate enriched mock policies data for IBMS.
 * Run: node generate-policies.js > src/mock/policies.ts
 */

const fs = require('fs');

// ─── Seed helpers ──────────────────────────────────────────────────────────

function seededRand(seed) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}
const rand = seededRand(42424242);
function pick(arr) { return arr[Math.floor(rand() * arr.length)]; }
function pickN(arr, n) {
  const shuffled = [...arr].sort(() => rand() - 0.5);
  return shuffled.slice(0, n);
}
function randBetween(a, b) { return Math.round(a + rand() * (b - a)); }
function randDate(startYear, endYear) {
  const y = randBetween(startYear, endYear);
  const m = randBetween(1, 12);
  const d = randBetween(1, 28);
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}
function addYears(dateStr, years) {
  const d = new Date(dateStr);
  d.setFullYear(d.getFullYear() + years);
  return d.toISOString().split('T')[0];
}
function daysBetween(a, b) {
  return Math.round((new Date(b) - new Date(a)) / 86400000);
}

// ─── Reference data ────────────────────────────────────────────────────────

const clients = [
  { id: 'cli-001', name: "Ghana Shippers' Authority", type: 'corporate' },
  { id: 'cli-002', name: 'Radiance Petroleum', type: 'corporate' },
  { id: 'cli-003', name: 'Dorcas Amanda Borquaye', type: 'individual' },
  { id: 'cli-004', name: 'Takoradi Flour Mills', type: 'corporate' },
  { id: 'cli-005', name: 'Felix Kwame Mensah', type: 'individual' },
  { id: 'cli-006', name: 'Kofi Nti', type: 'individual' },
  { id: 'cli-007', name: 'Kumasi Breweries Limited', type: 'corporate' },
  { id: 'cli-008', name: 'Grace Osei-Bonsu', type: 'individual' },
  { id: 'cli-009', name: 'Accra Mall Limited', type: 'corporate' },
  { id: 'cli-010', name: 'Samuel Adu-Gyamfi', type: 'individual' },
  { id: 'cli-011', name: 'AngloGold Ashanti', type: 'corporate' },
  { id: 'cli-012', name: 'Nana Yaw Asiedu', type: 'individual' },
  { id: 'cli-013', name: 'MTN Ghana Foundation', type: 'corporate' },
  { id: 'cli-014', name: 'Abena Serwaa Poku', type: 'individual' },
  { id: 'cli-015', name: 'Volta River Authority', type: 'corporate' },
  { id: 'cli-016', name: 'Daniel Kwarteng', type: 'individual' },
  { id: 'cli-017', name: 'COCOBOD', type: 'corporate' },
  { id: 'cli-018', name: 'Efua Aidoo', type: 'individual' },
  { id: 'cli-019', name: 'Ghana Ports Authority', type: 'corporate' },
  { id: 'cli-020', name: 'Joseph Amissah', type: 'individual' },
  { id: 'cli-021', name: 'Ecobank Ghana', type: 'corporate' },
  { id: 'cli-022', name: 'Yaa Asantewaa Danso', type: 'individual' },
  { id: 'cli-023', name: 'Aluworks Limited', type: 'corporate' },
  { id: 'cli-024', name: 'Kwesi Boateng', type: 'individual' },
  { id: 'cli-025', name: 'Ghana Water Company', type: 'corporate' },
  { id: 'cli-026', name: 'Millicent Adjei', type: 'individual' },
  { id: 'cli-027', name: 'Graphic Communications Group', type: 'corporate' },
  { id: 'cli-028', name: 'Emmanuel Tetteh', type: 'individual' },
  { id: 'cli-029', name: 'TotalEnergies Ghana', type: 'corporate' },
  { id: 'cli-030', name: 'Akosua Frimpong', type: 'individual' },
  { id: 'cli-031', name: 'Ghana Telecom', type: 'corporate' },
  { id: 'cli-032', name: 'Kofi Annan Memorial Foundation', type: 'corporate' },
  { id: 'cli-033', name: 'Priscilla Owusu', type: 'individual' },
  { id: 'cli-034', name: 'Obaa Yaa Asantewaa Antwi', type: 'individual' },
  { id: 'cli-035', name: 'Tema Oil Refinery', type: 'corporate' },
  { id: 'cli-036', name: 'Isaac Appiah', type: 'individual' },
  { id: 'cli-037', name: 'Golden Star Resources', type: 'corporate' },
  { id: 'cli-038', name: 'Comfort Ansah', type: 'individual' },
  { id: 'cli-039', name: 'University of Ghana', type: 'corporate' },
  { id: 'cli-040', name: 'Robert Quartey', type: 'individual' },
];

const brokers = [
  { id: 'brk-001', name: 'Esi Donkor' },
  { id: 'brk-002', name: 'Kofi Asante' },
  { id: 'brk-003', name: 'Abena Nyarko' },
  { id: 'brk-004', name: 'Kwame Mensah' },
  { id: 'brk-005', name: 'Adjoa Boateng' },
];

const insurers = [
  { id: 'carrier-enterprise', name: 'Enterprise Insurance', short: 'ENTERPRISE' },
  { id: 'carrier-sic', name: 'SIC Insurance', short: 'SIC' },
  { id: 'carrier-star', name: 'Star Assurance', short: 'STAR ASSURANCE' },
  { id: 'carrier-glico-general', name: 'GLICO General', short: 'GLICO GEN' },
  { id: 'carrier-hollard', name: 'Hollard Insurance', short: 'HOLLARD' },
  { id: 'carrier-loyalty', name: 'Loyalty Insurance', short: 'LOYALTY' },
  { id: 'carrier-prime', name: 'Prime Insurance', short: 'PRIME' },
  { id: 'carrier-imperial', name: 'Imperial General Assurance', short: 'IMPERIAL' },
  { id: 'carrier-phoenix', name: 'Phoenix Insurance', short: 'PHOENIX' },
  { id: 'carrier-saham', name: 'Saham Insurance', short: 'SAHAM' },
  { id: 'carrier-donewell', name: 'Donewell Insurance', short: 'DONEWELL' },
  { id: 'carrier-vanguard', name: 'Vanguard Assurance', short: 'VANGUARD' },
  { id: 'carrier-glico-life', name: 'GLICO Life', short: 'GLICO LIFE' },
  { id: 'carrier-starlife', name: 'StarLife Assurance', short: 'STARLIFE' },
  { id: 'carrier-enterprise-life', name: 'Enterprise Life', short: 'ENTERPRISE LIFE' },
  { id: 'carrier-sic-life', name: 'SIC Life', short: 'SIC LIFE' },
  { id: 'carrier-metropolitan', name: 'Metropolitan Insurance', short: 'METROPOLITAN' },
  { id: 'carrier-allianz', name: 'Allianz Insurance', short: 'ALLIANZ' },
  { id: 'carrier-unique', name: 'Unique Insurance', short: 'UNIQUE' },
  { id: 'carrier-regency', name: 'Regency Alliance Insurance', short: 'REGENCY' },
];

// Type config: [insuranceType, policyType, count, nicClass, coverageTypes, commRange]
const typeConfig = [
  ['motor',     'non-life', 55, 'Motor Vehicle', ['Comprehensive', 'Third Party Only', 'Third Party Fire & Theft', 'Commercial Vehicle'], [12, 18]],
  ['fire',      'non-life', 25, 'Fire & Property',  ['Fire & Allied Perils', 'Homeowners Comprehensive', 'Industrial All Risks', 'Business Interruption'], [15, 20]],
  ['marine',    'non-life', 12, 'Marine & Aviation',    ['Marine Cargo', 'Marine Hull', 'Goods in Transit', 'Freight Liability'], [10, 15]],
  ['health',    'non-life', 14, 'Health',            ['Individual Health', 'Group Health', 'Corporate Health Plan', 'Outpatient Only'], [8, 15]],
  ['liability', 'non-life', 12, 'General Accident',  ['Public Liability', 'Employers Liability', 'Product Liability', 'Professional Indemnity'], [15, 22]],
  ['engineering','non-life', 8, 'Engineering',       ['Contractors All Risks', 'Erection All Risks', 'Machinery Breakdown', 'Electronic Equipment'], [12, 18]],
  ['life',      'life',     15, 'Life',              ['Term Life', 'Whole Life', 'Endowment', 'Credit Life', 'Group Life'], [20, 30]],
  ['bonds',     'non-life',  6, 'Bonds & Guarantees',['Bid Bond', 'Performance Bond', 'Advance Payment Bond', 'Customs Bond'], [5, 10]],
  ['travel',    'non-life',  8, 'Travel',            ['Single Trip', 'Annual Multi-Trip', 'Student Travel', 'Business Travel'], [18, 25]],
  ['agriculture','non-life', 8, 'Agriculture',       ['Crop Insurance', 'Livestock Insurance', 'Poultry Insurance', 'Fisheries Insurance'], [10, 15]],
  ['professional_indemnity','non-life', 8, 'Professional Indemnity', ['Medical Malpractice', 'Legal PI', 'Accountants PI', 'IT Errors & Omissions'], [15, 22]],
  ['oil_gas',   'non-life',  5, 'Energy',            ['Upstream Oil & Gas', 'Downstream Oil & Gas', 'Energy Package', 'Control of Well'], [8, 15]],
  ['aviation',  'non-life',  4, 'Aviation',          ['Aircraft Hull', 'Aviation Liability', 'Passenger Liability', 'Hangar Keepers'], [8, 12]],
  ['other',     'non-life',  5, 'Miscellaneous',     ['Fidelity Guarantee', 'Burglary Insurance', 'Money Insurance', 'All Risks'], [12, 18]],
];

// Status distribution per policy: based on dates + explicit override
const statusWeights = { active: 42, expired: 40, pending: 18, draft: 12, cancelled: 8, lapsed: 8, suspended: 3 };
function pickStatus() {
  const total = Object.values(statusWeights).reduce((a, b) => a + b, 0);
  let r = rand() * total;
  for (const [s, w] of Object.entries(statusWeights)) {
    r -= w;
    if (r <= 0) return s;
  }
  return 'active';
}

const premiumFreqs = ['annual', 'semi_annual', 'quarterly', 'monthly', 'single'];

// Vehicle data
const vehicleMakes = ['Toyota', 'Hyundai', 'Nissan', 'Kia', 'Honda', 'Mercedes-Benz', 'Mitsubishi', 'Suzuki', 'Ford', 'Volkswagen', 'Isuzu', 'MAN', 'DAF'];
const vehicleModels = {
  'Toyota': ['Corolla', 'Hilux', 'Land Cruiser', 'Camry', 'RAV4', 'Yaris', 'Fortuner'],
  'Hyundai': ['Tucson', 'Elantra', 'Accent', 'Santa Fe', 'i10'],
  'Nissan': ['Patrol', 'Navara', 'X-Trail', 'Almera', 'Tiida'],
  'Kia': ['Sportage', 'Rio', 'Sorento', 'Picanto', 'Cerato'],
  'Honda': ['Civic', 'CR-V', 'Accord', 'HR-V', 'Fit'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'GLE', 'Sprinter', 'Actros'],
  'Mitsubishi': ['L200', 'Pajero', 'Outlander', 'Canter'],
  'Suzuki': ['Swift', 'Vitara', 'Alto', 'Jimny'],
  'Ford': ['Ranger', 'Transit', 'EcoSport', 'Escape'],
  'Volkswagen': ['Golf', 'Tiguan', 'Polo', 'Amarok'],
  'Isuzu': ['D-Max', 'NPR', 'FVR'],
  'MAN': ['TGS', 'TGM', 'TGL'],
  'DAF': ['CF', 'XF', 'LF'],
};
const vehicleColors = ['White', 'Black', 'Silver', 'Grey', 'Blue', 'Red', 'Green', 'Maroon', 'Gold'];
const ghRegions = ['GR', 'GW', 'GE', 'GN', 'GT', 'AS', 'BA', 'WR', 'CR', 'NR', 'UE', 'UW'];
function genRegNum() {
  return `${pick(ghRegions)} ${randBetween(1000, 9999)}-${randBetween(20, 26)}`;
}
function genChassisNo() {
  const chars = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789';
  let r = '';
  for (let i = 0; i < 17; i++) r += chars[Math.floor(rand() * chars.length)];
  return r;
}

// Endorsement types
const endorsementTypes = ['addition', 'deletion', 'alteration', 'extension', 'cancellation'];
const endorsementDescs = {
  addition: ['Add additional driver', 'Add new vehicle to fleet', 'Include additional peril', 'Add co-insured party'],
  deletion: ['Remove vehicle from cover', 'Remove named driver', 'Delete optional rider'],
  alteration: ['Change sum insured', 'Update vehicle registration', 'Change coverage area', 'Amend beneficiary details'],
  extension: ['Extend to include windscreen', 'Add riot & strike cover', 'Extend territorial limits', 'Include breakdown assist'],
  cancellation: ['Pro-rata cancellation', 'Short period cancellation'],
};

// Doc types
const docTypes = ['policy_schedule', 'cover_note', 'proposal_form', 'debit_note', 'receipt', 'certificate'];

// Timeline event templates
function genTimeline(status, inception, expiry) {
  const events = [
    { date: inception, event: 'Policy Created', description: 'Policy application submitted and processed', performedBy: 'System' },
    { date: inception, event: 'Cover Note Issued', description: 'Temporary cover note issued pending full documentation', performedBy: 'Underwriting' },
    { date: addDays(inception, randBetween(1, 5)), event: 'Premium Received', description: 'Initial premium payment confirmed', performedBy: 'Accounts' },
    { date: addDays(inception, randBetween(3, 10)), event: 'Policy Schedule Issued', description: 'Full policy documentation generated and dispatched', performedBy: 'Underwriting' },
  ];
  if (status === 'cancelled') {
    const cancelDate = addDays(inception, randBetween(30, 180));
    events.push({ date: cancelDate, event: 'Policy Cancelled', description: 'Policy cancelled as per request', performedBy: 'Admin' });
  }
  if (status === 'lapsed') {
    events.push({ date: addDays(inception, randBetween(60, 200)), event: 'Payment Overdue', description: 'Premium payment past due date', performedBy: 'System' });
    events.push({ date: addDays(inception, randBetween(200, 300)), event: 'Policy Lapsed', description: 'Policy lapsed due to non-payment', performedBy: 'System' });
  }
  return events.map((e, i) => ({ id: `evt-${i + 1}`, ...e }));
}

function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

// ─── Generate policies ─────────────────────────────────────────────────────

const policies = [];
let policyIdx = 0;
const today = '2026-02-26';

for (const [insType, polType, count, nicClass, coverageTypes, commRange] of typeConfig) {
  for (let i = 0; i < count; i++) {
    policyIdx++;
    const id = `pol-${String(policyIdx).padStart(3, '0')}`;
    const status = pickStatus();
    const client = pick(clients);
    const broker = pick(brokers);
    const insurer = pick(polType === 'life' ? insurers.filter(ins => ins.short.includes('LIFE') || ins.short === 'ENTERPRISE' || ins.short === 'SIC') : insurers.filter(ins => !ins.short.includes('LIFE') || ins.short === 'GLICO LIFE'));
    const coverageType = pick(coverageTypes);
    const commRate = randBetween(commRange[0], commRange[1]);
    const premFreq = insType === 'travel' || insType === 'bonds' ? 'single' : pick(premiumFreqs);

    // Dates
    let inception, expiry;
    if (status === 'active') {
      inception = randDate(2025, 2025);
      if (new Date(inception) > new Date(today)) inception = `2025-${String(randBetween(1, 12)).padStart(2, '0')}-${String(randBetween(1, 28)).padStart(2, '0')}`;
      expiry = addYears(inception, 1);
    } else if (status === 'expired') {
      inception = randDate(2023, 2024);
      expiry = addYears(inception, 1);
    } else if (status === 'draft' || status === 'pending') {
      inception = randDate(2026, 2026);
      expiry = addYears(inception, 1);
    } else if (status === 'cancelled' || status === 'lapsed') {
      inception = randDate(2024, 2025);
      expiry = addYears(inception, 1);
    } else { // suspended
      inception = randDate(2025, 2025);
      expiry = addYears(inception, 1);
    }

    const daysToExp = status === 'active' ? Math.max(0, daysBetween(today, expiry)) : 0;

    // Financial
    let sumInsured, premium;
    if (insType === 'motor') {
      sumInsured = randBetween(15000, 800000);
      premium = coverageType === 'Third Party Only' ? randBetween(300, 600) : Math.round(sumInsured * (randBetween(30, 60) / 1000));
    } else if (insType === 'fire') {
      sumInsured = randBetween(200000, 10000000);
      premium = Math.round(sumInsured * (randBetween(8, 20) / 10000));
    } else if (insType === 'marine') {
      sumInsured = randBetween(50000, 5000000);
      premium = Math.round(sumInsured * (randBetween(5, 15) / 1000));
    } else if (insType === 'life') {
      sumInsured = randBetween(50000, 2000000);
      premium = Math.round(sumInsured * (randBetween(15, 40) / 1000));
    } else if (insType === 'health') {
      sumInsured = randBetween(10000, 500000);
      premium = randBetween(1200, 15000);
    } else if (insType === 'engineering') {
      sumInsured = randBetween(1000000, 50000000);
      premium = Math.round(sumInsured * (randBetween(3, 8) / 1000));
    } else if (insType === 'bonds') {
      sumInsured = randBetween(100000, 5000000);
      premium = Math.round(sumInsured * (randBetween(10, 25) / 1000));
    } else if (insType === 'travel') {
      sumInsured = randBetween(5000, 100000);
      premium = randBetween(200, 3000);
    } else if (insType === 'oil_gas') {
      sumInsured = randBetween(5000000, 100000000);
      premium = Math.round(sumInsured * (randBetween(2, 5) / 1000));
    } else if (insType === 'aviation') {
      sumInsured = randBetween(2000000, 50000000);
      premium = Math.round(sumInsured * (randBetween(5, 15) / 1000));
    } else {
      sumInsured = randBetween(20000, 2000000);
      premium = Math.round(sumInsured * (randBetween(5, 20) / 1000));
    }

    const commAmount = Math.round(premium * commRate / 100 * 100) / 100;
    const isRenewal = rand() < 0.2 && policyIdx > 30;
    const prevPolId = isRenewal ? `pol-${String(randBetween(1, policyIdx - 1)).padStart(3, '0')}` : undefined;
    const paymentStatus = status === 'lapsed' ? 'overdue' : (status === 'draft' ? 'pending' : (rand() < 0.85 ? 'paid' : 'partial'));
    const commStatus = paymentStatus === 'paid' ? 'paid' : 'pending';

    // Policy number format
    const prefixMap = {
      motor: 'MOT', fire: 'FIR', marine: 'MAR', life: 'LIF', health: 'HLT',
      liability: 'LIA', engineering: 'ENG', bonds: 'BND', travel: 'TRV',
      agriculture: 'AGR', professional_indemnity: 'PI', oil_gas: 'OG', aviation: 'AVN', other: 'MSC'
    };
    const prefix = prefixMap[insType] || 'GEN';
    const insurerCode = insurer.short.substring(0, 3).toUpperCase();
    const yr = inception.substring(2, 4);
    const policyNumber = `${insurerCode}/HQ/${prefix}/${yr}/${String(policyIdx).padStart(5, '0')}`;

    const policy = {
      id,
      policyNumber,
      status,
      insuranceType: insType,
      policyType: polType,
      coverageType,
      nicClassOfBusiness: nicClass,
      productId: `prod-${insType}-${String(i + 1).padStart(2, '0')}`,
      productName: `${coverageType} - ${insurer.name}`,
      clientId: client.id,
      clientName: client.name,
      insurerName: insurer.short,
      insurerId: insurer.id,
      brokerId: broker.id,
      brokerName: broker.name,
      inceptionDate: inception,
      expiryDate: expiry,
      issueDate: status === 'draft' ? '' : inception,
      sumInsured,
      premiumAmount: premium,
      commissionRate: commRate,
      commissionAmount: commAmount,
      commissionStatus: commStatus,
      currency: 'GHS',
      premiumFrequency: premFreq,
      paymentStatus,
      coverageDetails: `${coverageType} — ${nicClass}`,
      isRenewal,
      daysToExpiry: daysToExp,
      createdAt: `${inception}T10:00:00Z`,
      updatedAt: `${inception}T10:00:00Z`,
    };

    // Next premium due date
    if (status === 'active' && premFreq !== 'single') {
      const freqMonths = { monthly: 1, quarterly: 3, semi_annual: 6, annual: 12 };
      const nextD = new Date(inception);
      const months = freqMonths[premFreq];
      while (nextD < new Date(today)) nextD.setMonth(nextD.getMonth() + months);
      policy.nextPremiumDueDate = nextD.toISOString().split('T')[0];
    }

    // Outstanding balance
    if (paymentStatus === 'partial') {
      policy.outstandingBalance = Math.round(premium * (randBetween(20, 60) / 100));
    } else if (paymentStatus === 'overdue') {
      policy.outstandingBalance = premium;
    }

    // Motor-specific vehicle details
    if (insType === 'motor') {
      const make = pick(vehicleMakes);
      const models = vehicleModels[make] || ['Standard'];
      policy.vehicleDetails = {
        registrationNumber: genRegNum(),
        chassisNumber: genChassisNo(),
        make,
        model: pick(models),
        year: randBetween(2015, 2025),
        bodyType: pick(['Sedan', 'SUV', 'Pickup', 'Hatchback', 'Van', 'Truck', 'Bus']),
        color: pick(vehicleColors),
        engineCapacity: `${randBetween(10, 50) * 100}cc`,
        seatingCapacity: randBetween(2, 55),
        usageType: pick(['private', 'commercial', 'government']),
        estimatedValue: sumInsured,
      };
      policy.motorCoverType = coverageType === 'Third Party Only' ? 'third_party' :
        coverageType === 'Third Party Fire & Theft' ? 'third_party_fire_theft' :
        coverageType === 'Commercial Vehicle' ? 'commercial' : 'comprehensive';
    }

    // Fire/Property details
    if (insType === 'fire') {
      policy.propertyDetails = {
        propertyAddress: `${randBetween(1, 200)} ${pick(['Ring Road', 'Oxford Street', 'Cantonments Rd', 'Liberation Rd', 'Castle Rd', 'Airport Residential', 'Spintex Rd', 'East Legon', 'Tema Motorway', 'Madina Highway'])}, ${pick(['Accra', 'Kumasi', 'Tema', 'Takoradi', 'Tamale', 'Cape Coast'])}`,
        propertyType: pick(['residential', 'commercial', 'industrial', 'warehouse']),
        constructionType: pick(['Concrete/Block', 'Steel Frame', 'Timber Frame', 'Mixed']),
        yearBuilt: randBetween(1980, 2024),
        occupancy: pick(['Owner-occupied', 'Tenanted', 'Vacant', 'Mixed use']),
      };
    }

    // Marine details
    if (insType === 'marine') {
      policy.marineDetails = {
        vesselName: pick(['MV Cape Coast', 'MV Tema Star', 'SS Volta', 'MV Gold Coast', 'MSC Accra', 'CMA CGM Elmina']),
        voyageFrom: pick(['Tema Port', 'Takoradi Port', 'Shanghai', 'Rotterdam', 'Hamburg', 'Durban']),
        voyageTo: pick(['Tema Port', 'Takoradi Port', 'Lagos', 'Abidjan', 'Lomé', 'Rotterdam']),
        cargoDescription: pick(['Machinery & Equipment', 'Building Materials', 'Cocoa Beans', 'Petroleum Products', 'Consumer Electronics', 'Agricultural Inputs', 'Vehicles', 'Textile & Garments']),
        cargoValue: sumInsured,
      };
    }

    // Life policy beneficiaries & riders
    if (insType === 'life') {
      const numBen = randBetween(1, 3);
      policy.beneficiaries = [];
      const rels = ['Spouse', 'Child', 'Parent', 'Sibling'];
      let remaining = 100;
      for (let b = 0; b < numBen; b++) {
        const pct = b === numBen - 1 ? remaining : randBetween(20, remaining - (numBen - b - 1) * 10);
        remaining -= pct;
        policy.beneficiaries.push({
          name: pick(['Ama Mensah', 'Kofi Asare', 'Adjoa Boateng', 'Kwaku Frimpong', 'Akosua Dede', 'Yaw Owusu']),
          relationship: pick(rels),
          percentage: pct,
        });
      }
      if (rand() < 0.6) {
        policy.riders = pickN(['Critical Illness Rider', 'Waiver of Premium', 'Accidental Death Benefit', 'Hospital Cash Benefit', 'Disability Income Rider'], randBetween(1, 3));
      }
    }

    // Exclusions
    const exclusionPool = {
      motor: ['Racing or speed testing', 'DUI / driving under influence', 'Use outside Ghana without endorsement', 'Unlicensed driver', 'Consequential loss'],
      fire: ['War and civil commotion', 'Nuclear hazards', 'Gradual deterioration', 'Wilful negligence', 'Unoccupied > 30 days'],
      marine: ['Inherent vice', 'Delay in voyage', 'War risks (unless endorsed)', 'Contraband goods', 'Insufficient packing'],
      life: ['Suicide within 2 years', 'Pre-existing conditions (12 mo)', 'Hazardous sports', 'War or terrorism', 'Self-inflicted injury'],
      health: ['Cosmetic surgery', 'Pre-existing conditions (wait)', 'Experimental treatments', 'Self-inflicted injury', 'Dental (unless endorsed)'],
      default: ['War and terrorism', 'Nuclear contamination', 'Wilful misconduct', 'Consequential loss', 'Wear and tear'],
    };
    policy.exclusions = pickN(exclusionPool[insType] || exclusionPool.default, randBetween(2, 4));

    // Endorsements (30% of active / cancelled policies)
    if ((status === 'active' || status === 'expired') && rand() < 0.3) {
      const numEnd = randBetween(1, 3);
      policy.endorsements = [];
      for (let e = 0; e < numEnd; e++) {
        const eType = pick(endorsementTypes);
        const descs = endorsementDescs[eType];
        policy.endorsements.push({
          id: `end-${policyIdx}-${e + 1}`,
          endorsementNumber: `${policyNumber}/END/${e + 1}`,
          type: eType,
          status: pick(['approved', 'approved', 'pending']),
          effectiveDate: addDays(inception, randBetween(30, 200)),
          description: pick(descs),
          premiumAdjustment: eType === 'deletion' ? -randBetween(50, 500) : (eType === 'cancellation' ? -premium : randBetween(0, 800)),
          createdAt: `${addDays(inception, randBetween(25, 195))}T10:00:00Z`,
        });
      }
    }

    // Documents
    const numDocs = randBetween(2, 5);
    policy.documents = [];
    const selectedDocTypes = pickN(docTypes, numDocs);
    for (let d = 0; d < numDocs; d++) {
      const dType = selectedDocTypes[d];
      const nameMap = {
        policy_schedule: 'Policy Schedule.pdf',
        cover_note: 'Cover Note.pdf',
        proposal_form: 'Proposal Form.pdf',
        debit_note: 'Debit Note.pdf',
        receipt: 'Premium Receipt.pdf',
        certificate: 'Certificate of Insurance.pdf',
      };
      policy.documents.push({
        id: `doc-${policyIdx}-${d + 1}`,
        name: nameMap[dType] || `${dType}.pdf`,
        type: dType,
        uploadedAt: `${addDays(inception, randBetween(0, 14))}T10:00:00Z`,
      });
    }

    // Timeline
    policy.timeline = genTimeline(status, inception, expiry);

    // Installments for non-single premium
    if (premFreq !== 'single' && status !== 'draft') {
      const freqMonths = { monthly: 1, quarterly: 3, semi_annual: 6, annual: 12 };
      const months = freqMonths[premFreq];
      const numInstall = Math.min(12 / months, 4); // max 4 installments shown
      const instAmount = Math.round(premium / numInstall);
      policy.installments = [];
      for (let inst = 0; inst < numInstall; inst++) {
        const dueD = new Date(inception);
        dueD.setMonth(dueD.getMonth() + inst * months);
        const dueDateStr = dueD.toISOString().split('T')[0];
        const isPast = new Date(dueDateStr) < new Date(today);
        let instStatus;
        if (status === 'lapsed' && inst > 0) instStatus = 'overdue';
        else if (isPast && paymentStatus !== 'overdue') instStatus = 'paid';
        else if (!isPast && paymentStatus === 'partial' && inst === 0) instStatus = 'paid';
        else if (!isPast) instStatus = 'pending';
        else instStatus = 'overdue';

        policy.installments.push({
          id: `inst-${policyIdx}-${inst + 1}`,
          dueDate: dueDateStr,
          amount: instAmount,
          status: instStatus,
          ...(instStatus === 'paid' ? { paidDate: addDays(dueDateStr, randBetween(0, 5)), reference: `PAY-${randBetween(100000, 999999)}` } : {}),
        });
      }
    }

    // Cancellation details
    if (status === 'cancelled') {
      const reasons = ['non_payment', 'client_request', 'insurer_request', 'replaced', 'other'];
      policy.cancellationDate = addDays(inception, randBetween(30, 180));
      policy.cancellationReason = pick(reasons);
      policy.cancellationNotes = pick([
        'Client requested cancellation due to sale of vehicle',
        'Premium payment not received after multiple reminders',
        'Policy replaced with competitor product',
        'Client relocated outside coverage area',
        'Insurer declined renewal due to claims history',
      ]);
    }

    // Previous policy ID for renewals
    if (isRenewal) {
      policy.previousPolicyId = prevPolId;
    }

    policies.push(policy);
  }
}

// ─── Output TypeScript file ────────────────────────────────────────────────

let output = `import type { Policy } from '@/types';\n\n`;
output += `export const mockPolicies: Policy[] = [\n`;

for (const p of policies) {
  output += `    {\n`;
  for (const [key, val] of Object.entries(p)) {
    if (val === undefined) continue;
    if (key === 'vehicleDetails' || key === 'propertyDetails' || key === 'marineDetails') {
      output += `        ${key}: ${JSON.stringify(val, null, 8).replace(/\n/g, '\n        ')},\n`;
    } else if (key === 'endorsements' || key === 'documents' || key === 'timeline' || key === 'installments' || key === 'beneficiaries') {
      output += `        ${key}: ${JSON.stringify(val, null, 12).replace(/\n/g, '\n        ')},\n`;
    } else if (Array.isArray(val)) {
      output += `        ${key}: ${JSON.stringify(val)},\n`;
    } else if (typeof val === 'string') {
      output += `        ${key}: ${JSON.stringify(val)},\n`;
    } else {
      output += `        ${key}: ${val},\n`;
    }
  }
  output += `    },\n`;
}

output += `];\n\n`;
output += `export function getPolicyById(id: string): Policy | undefined {\n`;
output += `    return mockPolicies.find((p) => p.id === id);\n`;
output += `}\n\n`;
output += `export function getPoliciesByClientId(clientId: string): Policy[] {\n`;
output += `    return mockPolicies.filter((p) => p.clientId === clientId);\n`;
output += `}\n\n`;
output += `export const policies = mockPolicies;\n`;

fs.writeFileSync('src/mock/policies.ts', output, 'utf-8');
console.log(`Generated ${policies.length} policies to src/mock/policies.ts`);

// Stats
const statsByType = {};
const statsByStatus = {};
for (const p of policies) {
  statsByType[p.insuranceType] = (statsByType[p.insuranceType] || 0) + 1;
  statsByStatus[p.status] = (statsByStatus[p.status] || 0) + 1;
}
console.log('\nBy type:', statsByType);
console.log('By status:', statsByStatus);
const withEndorsements = policies.filter(p => p.endorsements && p.endorsements.length > 0).length;
const withRenewals = policies.filter(p => p.isRenewal).length;
const withVehicle = policies.filter(p => p.vehicleDetails).length;
console.log(`Endorsements: ${withEndorsements}, Renewals: ${withRenewals}, Vehicles: ${withVehicle}`);
