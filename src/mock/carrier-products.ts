// ─── Carrier Products Mock Data ────────────────────────────────────────────
// Insurance products offered by carriers in Ghana, per NIC-regulated product lines.
// Based on Insurance Act 2021 (Act 1061) product classifications.

export type ProductCategory =
    | 'motor'
    | 'fire'
    | 'marine'
    | 'engineering'
    | 'liability'
    | 'personal_accident'
    | 'agriculture'
    | 'life'
    | 'group_life'
    | 'credit_life'
    | 'health'
    | 'pension'
    | 'funeral'
    | 'micro_insurance'
    | 'investment';

export type ProductStatus = 'active' | 'discontinued';

export interface CarrierProduct {
    id: string;
    carrierId: string;
    name: string;
    category: ProductCategory;
    commissionRate: number;
    minPremium: number;
    /** True = mandated by NIC / Insurance Act 2021 */
    compulsory: boolean;
    description: string;
    status: ProductStatus;
    coverageSummary: string[];
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
    motor: 'Motor',
    fire: 'Fire & Property',
    marine: 'Marine',
    engineering: 'Engineering',
    liability: 'Liability',
    personal_accident: 'Personal Accident',
    agriculture: 'Agriculture',
    life: 'Life',
    group_life: 'Group Life',
    credit_life: 'Credit Life',
    health: 'Health',
    pension: 'Pension',
    funeral: 'Funeral',
    micro_insurance: 'Micro-Insurance',
    investment: 'Investment',
};

export const CATEGORY_COLORS: Record<ProductCategory, string> = {
    motor: 'bg-blue-100 text-blue-700',
    fire: 'bg-orange-100 text-orange-700',
    marine: 'bg-cyan-100 text-cyan-700',
    engineering: 'bg-purple-100 text-purple-700',
    liability: 'bg-rose-100 text-rose-700',
    personal_accident: 'bg-amber-100 text-amber-700',
    agriculture: 'bg-green-100 text-green-700',
    life: 'bg-violet-100 text-violet-700',
    group_life: 'bg-indigo-100 text-indigo-700',
    credit_life: 'bg-pink-100 text-pink-700',
    health: 'bg-teal-100 text-teal-700',
    pension: 'bg-emerald-100 text-emerald-700',
    funeral: 'bg-slate-100 text-slate-700',
    micro_insurance: 'bg-lime-100 text-lime-700',
    investment: 'bg-sky-100 text-sky-700',
};

// ─── Products ───────────────────────────────────────────────────────────────

export const carrierProducts: CarrierProduct[] = [
    // ── Enterprise Insurance ──────────────────────────────────
    {
        id: 'prod-ent-comp-motor',
        carrierId: 'carrier-enterprise',
        name: 'Comprehensive Motor Insurance',
        category: 'motor',
        commissionRate: 15,
        minPremium: 1200,
        compulsory: false,
        description: 'Full coverage motor insurance including own damage, third-party liability, theft, and fire.',
        status: 'active',
        coverageSummary: ['Own damage', 'Third-party liability', 'Theft & fire', 'Windscreen', 'Emergency towing'],
    },
    {
        id: 'prod-ent-tpl-motor',
        carrierId: 'carrier-enterprise',
        name: 'Third Party Motor Insurance',
        category: 'motor',
        commissionRate: 15,
        minPremium: 300,
        compulsory: true,
        description: 'Mandatory minimum motor cover under the Motor Vehicles (Third Party Insurance) Act.',
        status: 'active',
        coverageSummary: ['Third-party bodily injury', 'Third-party property damage'],
    },
    {
        id: 'prod-ent-fire',
        carrierId: 'carrier-enterprise',
        name: 'Fire & Allied Perils',
        category: 'fire',
        commissionRate: 20,
        minPremium: 800,
        compulsory: true,
        description: 'Covers commercial & residential properties against fire and allied perils. Compulsory under Insurance Act 2021 for commercial buildings.',
        status: 'active',
        coverageSummary: ['Fire', 'Lightning', 'Explosion', 'Earthquake damage', 'Storm & flood'],
    },
    {
        id: 'prod-ent-marine',
        carrierId: 'carrier-enterprise',
        name: 'Marine Cargo Insurance',
        category: 'marine',
        commissionRate: 15,
        minPremium: 500,
        compulsory: true,
        description: 'Protection for goods in transit by sea, air, or road. Compulsory for all commercial imports.',
        status: 'active',
        coverageSummary: ['All risk cargo', 'War risk', 'SRCC', 'Theft', 'Contamination'],
    },
    {
        id: 'prod-ent-liability',
        carrierId: 'carrier-enterprise',
        name: 'Public Liability Insurance',
        category: 'liability',
        commissionRate: 20,
        minPremium: 600,
        compulsory: true,
        description: 'Compulsory liability cover for businesses. Covers injury/damage to third parties arising from business operations.',
        status: 'active',
        coverageSummary: ['Bodily injury to third parties', 'Property damage', 'Legal defence costs'],
    },
    {
        id: 'prod-ent-pi',
        carrierId: 'carrier-enterprise',
        name: 'Professional Indemnity',
        category: 'liability',
        commissionRate: 20,
        minPremium: 1000,
        compulsory: true,
        description: 'Mandatory for professionals. Covers against claims of negligence, errors, or omissions in professional services.',
        status: 'active',
        coverageSummary: ['Negligence claims', 'Errors & omissions', 'Legal costs', 'Settlements'],
    },
    {
        id: 'prod-ent-eng',
        carrierId: 'carrier-enterprise',
        name: 'Contractors All Risk (CAR)',
        category: 'engineering',
        commissionRate: 17.5,
        minPremium: 2000,
        compulsory: false,
        description: 'Comprehensive cover for construction projects against accident losses and third-party liability.',
        status: 'active',
        coverageSummary: ['Contract works (material damage)', 'Third party liability', 'Plant & equipment'],
    },
    {
        id: 'prod-ent-pa',
        carrierId: 'carrier-enterprise',
        name: 'Personal Accident Insurance',
        category: 'personal_accident',
        commissionRate: 20,
        minPremium: 250,
        compulsory: false,
        description: 'Pays a lump sum benefit in the event of accidental death or permanent disability.',
        status: 'active',
        coverageSummary: ['Accidental death benefit', 'Permanent disability', 'Temporary disability', 'Medical expenses'],
    },

    // ── SIC Insurance ─────────────────────────────────────────
    {
        id: 'prod-sic-comp-motor',
        carrierId: 'carrier-sic',
        name: 'Comprehensive Motor Insurance',
        category: 'motor',
        commissionRate: 15,
        minPremium: 1100,
        compulsory: false,
        description: 'Full comprehensive motor cover from Ghana\'s leading state insurer.',
        status: 'active',
        coverageSummary: ['Own damage', 'Third-party liability', 'Theft', 'Fire', 'Emergency services'],
    },
    {
        id: 'prod-sic-tpl-motor',
        carrierId: 'carrier-sic',
        name: 'Third Party Motor Insurance',
        category: 'motor',
        commissionRate: 15,
        minPremium: 280,
        compulsory: true,
        description: 'Mandatory minimum motor insurance from SIC.',
        status: 'active',
        coverageSummary: ['Third-party bodily injury', 'Third-party property damage'],
    },
    {
        id: 'prod-sic-fire',
        carrierId: 'carrier-sic',
        name: 'Fire & Allied Perils',
        category: 'fire',
        commissionRate: 20,
        minPremium: 700,
        compulsory: true,
        description: 'Fire insurance for residential and commercial properties.',
        status: 'active',
        coverageSummary: ['Fire', 'Lightning', 'Explosion', 'Riot & strikes', 'Storm & flood'],
    },
    {
        id: 'prod-sic-marine',
        carrierId: 'carrier-sic',
        name: 'Marine Cargo Insurance',
        category: 'marine',
        commissionRate: 15,
        minPremium: 450,
        compulsory: true,
        description: 'Cargo insurance for all imports and exports through Ghana ports.',
        status: 'active',
        coverageSummary: ['All risks', 'War cover', 'General average', 'Theft'],
    },
    {
        id: 'prod-sic-agri',
        carrierId: 'carrier-sic',
        name: 'Agriculture Insurance',
        category: 'agriculture',
        commissionRate: 20,
        minPremium: 400,
        compulsory: false,
        description: 'Protects farmers against crop failure, livestock loss, and weather events.',
        status: 'active',
        coverageSummary: ['Crop failure', 'Livestock death', 'Drought', 'Flood damage', 'Fire on farm'],
    },

    // ── Hollard Insurance ─────────────────────────────────────
    {
        id: 'prod-hollard-comp-motor',
        carrierId: 'carrier-hollard',
        name: 'Comprehensive Motor Insurance',
        category: 'motor',
        commissionRate: 15,
        minPremium: 1300,
        compulsory: false,
        description: 'Hollard\'s flagship comprehensive motor product with 24/7 emergency support.',
        status: 'active',
        coverageSummary: ['Accidental damage', 'Third-party cover', 'Theft', 'Windscreen', 'Courtesy car'],
    },
    {
        id: 'prod-hollard-fire',
        carrierId: 'carrier-hollard',
        name: 'Householders Comprehensive',
        category: 'fire',
        commissionRate: 20,
        minPremium: 600,
        compulsory: false,
        description: 'All-in-one home insurance covering buildings and contents.',
        status: 'active',
        coverageSummary: ['Buildings', 'Contents', 'Burglary', 'Personal liability', 'Emergency assistance'],
    },

    // ── Star Assurance ────────────────────────────────────────
    {
        id: 'prod-star-comp-motor',
        carrierId: 'carrier-star',
        name: 'Comprehensive Motor Insurance',
        category: 'motor',
        commissionRate: 15,
        minPremium: 1200,
        compulsory: false,
        description: 'Comprehensive motor cover from Star Assurance with nationwide branch network support.',
        status: 'active',
        coverageSummary: ['Own damage', 'Third-party liability', 'Theft', 'Fire', 'Flood damage'],
    },
    {
        id: 'prod-star-fire',
        carrierId: 'carrier-star',
        name: 'Fire & Allied Perils',
        category: 'fire',
        commissionRate: 20,
        minPremium: 750,
        compulsory: true,
        description: 'Fire insurance for residential and commercial buildings.',
        status: 'active',
        coverageSummary: ['Fire', 'Lightning', 'Explosion', 'Natural perils'],
    },

    // ── Enterprise Life ────────────────────────────────────────
    {
        id: 'prod-entlife-whole',
        carrierId: 'carrier-enterprise-life',
        name: 'Whole Life Insurance',
        category: 'life',
        commissionRate: 30,
        minPremium: 150,
        compulsory: false,
        description: 'Permanent life cover with a savings and investment component. Pays on death at any age.',
        status: 'active',
        coverageSummary: ['Death benefit', 'Savings growth', 'Optional riders', 'Policy loans'],
    },
    {
        id: 'prod-entlife-endowment',
        carrierId: 'carrier-enterprise-life',
        name: 'Education Endowment Plan',
        category: 'life',
        commissionRate: 30,
        minPremium: 200,
        compulsory: false,
        description: 'Savings plan designed to accumulate funds for children\'s education, maturing at a set date.',
        status: 'active',
        coverageSummary: ['Education fund payout', 'Death benefit', 'Premium waiver on death of parent'],
    },
    {
        id: 'prod-entlife-group',
        carrierId: 'carrier-enterprise-life',
        name: 'Group Life Insurance',
        category: 'group_life',
        commissionRate: 10,
        minPremium: 500,
        compulsory: false,
        description: 'Employer-sponsored group life policy providing death benefits to employees\' beneficiaries.',
        status: 'active',
        coverageSummary: ['Death benefit (multiple of salary)', 'Total permanent disability', 'Funeral grant'],
    },
    {
        id: 'prod-entlife-credit',
        carrierId: 'carrier-enterprise-life',
        name: 'Credit Life Insurance',
        category: 'credit_life',
        commissionRate: 15,
        minPremium: 100,
        compulsory: false,
        description: 'Repays a borrower\'s outstanding loan balance upon death or permanent disability.',
        status: 'active',
        coverageSummary: ['Loan balance repayment on death', 'Total permanent disability cover', 'Retrenchment benefit (optional)'],
    },

    // ── Prudential Life ────────────────────────────────────────
    {
        id: 'prod-pru-family',
        carrierId: 'carrier-prudential',
        name: 'Family Income Protector',
        category: 'life',
        commissionRate: 30,
        minPremium: 120,
        compulsory: false,
        description: 'Provides monthly income to dependants upon death, plus savings payout at maturity.',
        status: 'active',
        coverageSummary: ['Monthly income on death', 'Maturity savings payout', 'Critical illness benefit', 'Accident benefit'],
    },
    {
        id: 'prod-pru-micro',
        carrierId: 'carrier-prudential',
        name: 'Micro Life Insurance',
        category: 'micro_insurance',
        commissionRate: 25,
        minPremium: 20,
        compulsory: false,
        description: 'Affordable life cover accessible via mobile money. Designed for the unbanked population.',
        status: 'active',
        coverageSummary: ['Death benefit', 'Accidental death top-up', 'Hospital cash'],
    },

    // ── Old Mutual ─────────────────────────────────────────────
    {
        id: 'prod-om-term-life',
        carrierId: 'carrier-old-mutual',
        name: 'Term Life Insurance',
        category: 'life',
        commissionRate: 30,
        minPremium: 100,
        compulsory: false,
        description: 'Pure life cover for a fixed term. Pays a lump sum on death within the policy period.',
        status: 'active',
        coverageSummary: ['Death benefit', 'Terminal illness', 'Optional critical illness rider'],
    },
    {
        id: 'prod-om-pension',
        carrierId: 'carrier-old-mutual',
        name: 'Personal Pension Plan',
        category: 'pension',
        commissionRate: 5,
        minPremium: 200,
        compulsory: false,
        description: 'Voluntary 3rd Tier pension plan. Contributions are invested for retirement income.',
        status: 'active',
        coverageSummary: ['Retirement income', 'Death benefit', 'Tax-deductible contributions', 'Flexible withdrawal post-55'],
    },

    // ── GLICO Life ─────────────────────────────────────────────
    {
        id: 'prod-glico-funeral',
        carrierId: 'carrier-glico-life',
        name: 'Funeral Insurance Plan',
        category: 'funeral',
        commissionRate: 25,
        minPremium: 50,
        compulsory: false,
        description: 'Covers funeral expenses for the policyholder and immediate family members.',
        status: 'active',
        coverageSummary: ['Funeral costs up to agreed limit', 'Covers spouse & children', 'Quick payout within 48hrs'],
    },

    // ── GLICO General ─────────────────────────────────────────
    {
        id: 'prod-glico-comp-motor',
        carrierId: 'carrier-glico-general',
        name: 'Comprehensive Motor Insurance',
        category: 'motor',
        commissionRate: 15,
        minPremium: 1250,
        compulsory: false,
        description: 'GLICO\'s comprehensive vehicle cover with 24/7 claims support.',
        status: 'active',
        coverageSummary: ['Own damage', 'Third-party', 'Fire & theft', 'Windscreen', 'Medical expenses'],
    },

    // ── Vanguard Assurance ────────────────────────────────────
    {
        id: 'prod-vanguard-comp-motor',
        carrierId: 'carrier-vanguard',
        name: 'Comprehensive Motor Insurance',
        category: 'motor',
        commissionRate: 15,
        minPremium: 1100,
        compulsory: false,
        description: 'Full motor cover from one of Ghana\'s oldest insurers.',
        status: 'active',
        coverageSummary: ['Accidental damage', 'Third-party liability', 'Theft', 'Fire'],
    },
    {
        id: 'prod-vanguard-fire',
        carrierId: 'carrier-vanguard',
        name: 'Fire & Allied Perils',
        category: 'fire',
        commissionRate: 20,
        minPremium: 700,
        compulsory: true,
        description: 'Property fire insurance for commercial and residential buildings.',
        status: 'active',
        coverageSummary: ['Fire', 'Lightning', 'Explosion', 'Flood & storm'],
    },

    // ── Hollard Life ───────────────────────────────────────────
    {
        id: 'prod-hollife-group',
        carrierId: 'carrier-hollard-life',
        name: 'Group Life Assurance',
        category: 'group_life',
        commissionRate: 10,
        minPremium: 600,
        compulsory: false,
        description: 'Employer-sponsored group life cover with flexible benefit multiples.',
        status: 'active',
        coverageSummary: ['Death in service benefit', 'TPD benefit', 'Funeral assistance'],
    },
    {
        id: 'prod-hollife-credit',
        carrierId: 'carrier-hollard-life',
        name: 'Credit Life Insurance',
        category: 'credit_life',
        commissionRate: 15,
        minPremium: 80,
        compulsory: false,
        description: 'Clears outstanding loan on death or disability of borrower.',
        status: 'active',
        coverageSummary: ['Loan cancellation on death', 'TPD benefit', 'Retrenchment cover (optional)'],
    },

    // ── Phoenix Insurance ──────────────────────────────────────
    {
        id: 'prod-phoenix-comp-motor',
        carrierId: 'carrier-phoenix',
        name: 'Comprehensive Motor Insurance',
        category: 'motor',
        commissionRate: 15,
        minPremium: 1150,
        compulsory: false,
        description: 'Phoenix comprehensive auto coverage with quick claims processing.',
        status: 'active',
        coverageSummary: ['Own damage', 'Third-party', 'Theft', 'Fire', 'Road assistance'],
    },

    // ── SIC Life ────────────────────────────────────────────────
    {
        id: 'prod-siclife-whole',
        carrierId: 'carrier-sic-life',
        name: 'Whole Life Policy',
        category: 'life',
        commissionRate: 30,
        minPremium: 120,
        compulsory: false,
        description: 'Permanent life cover from SIC Life with savings accumulation.',
        status: 'active',
        coverageSummary: ['Lifelong death cover', 'Cash value accumulation', 'Policy loan facility'],
    },
    {
        id: 'prod-siclife-group',
        carrierId: 'carrier-sic-life',
        name: 'Group Life Insurance',
        category: 'group_life',
        commissionRate: 10,
        minPremium: 400,
        compulsory: false,
        description: 'State-backed group life for corporate employers.',
        status: 'active',
        coverageSummary: ['Death benefit', 'TPD', 'Funeral benefit'],
    },

    // ── Allianz Insurance ──────────────────────────────────────
    {
        id: 'prod-allianz-eng',
        carrierId: 'carrier-allianz-general',
        name: 'Erection All Risks (EAR)',
        category: 'engineering',
        commissionRate: 17.5,
        minPremium: 3000,
        compulsory: false,
        description: 'Covers mechanical and electrical plant and machinery during erection.',
        status: 'active',
        coverageSummary: ['Machinery damage during erection', 'Third-party liability', 'Testing period'],
    },
    {
        id: 'prod-allianz-marine',
        carrierId: 'carrier-allianz-general',
        name: 'Marine Hull Insurance',
        category: 'marine',
        commissionRate: 15,
        minPremium: 2500,
        compulsory: false,
        description: 'Protects vessels (boats, ships) against physical loss or damage.',
        status: 'active',
        coverageSummary: ['Total loss', 'Partial loss', 'Collision liability', 'Fire & explosion'],
    },

    // ── GUMA General ──────────────────────────────────────────
    {
        id: 'prod-guma-agri',
        carrierId: 'carrier-guma',
        name: 'Agricultural Insurance',
        category: 'agriculture',
        commissionRate: 20,
        minPremium: 350,
        compulsory: false,
        description: 'Coverage for smallholder and commercial farmers against crop failure and livestock loss.',
        status: 'active',
        coverageSummary: ['Crop failure (drought, flood)', 'Livestock death', 'Fire on farm'],
    },

    // ── Activa International ───────────────────────────────────
    {
        id: 'prod-activa-liability',
        carrierId: 'carrier-activa',
        name: 'Public Liability Insurance',
        category: 'liability',
        commissionRate: 20,
        minPremium: 700,
        compulsory: true,
        description: 'Mandatory liability cover for businesses with Activa\'s international backing.',
        status: 'active',
        coverageSummary: ['Third-party injury', 'Property damage', 'Legal costs'],
    },
    {
        id: 'prod-activa-pi',
        carrierId: 'carrier-activa',
        name: 'Professional Indemnity',
        category: 'liability',
        commissionRate: 20,
        minPremium: 1200,
        compulsory: true,
        description: 'PI cover for professionals operating in Ghana. Compulsory under NIC regulations.',
        status: 'active',
        coverageSummary: ['Negligence', 'Errors & omissions', 'Breach of duty', 'Defence costs'],
    },
];

// ─── Helpers ─────────────────────────────────────────────────────────────

export function getProductsByCarrierId(carrierId: string): CarrierProduct[] {
    return carrierProducts.filter(p => p.carrierId === carrierId);
}

export function getProductsByCategory(category: ProductCategory): CarrierProduct[] {
    return carrierProducts.filter(p => p.category === category);
}

export function getCompulsoryProducts(): CarrierProduct[] {
    return carrierProducts.filter(p => p.compulsory);
}

export function getAllCategories(): ProductCategory[] {
    return [...new Set(carrierProducts.map(p => p.category))];
}
