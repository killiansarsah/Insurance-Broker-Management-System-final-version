// Quotes Mock Data — Insurance quotation management
// Each quote can have multiple carrier options for comparison

export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'declined' | 'expired' | 'converted';

export interface QuoteOption {
    id: string;
    carrierName: string;
    carrierId: string;
    premium: number;
    sumInsured: number;
    commissionRate: number;
    commissionAmount: number;
    excessOrDeductible: string;
    coverageNotes: string;
    isRecommended: boolean;
    isSelected: boolean;
}

export interface Quote {
    id: string;
    quoteNumber: string;
    clientId: string;
    clientName: string;
    clientPhone: string;
    clientEmail: string;
    insuranceType: string;
    coverageType: string;
    policyType: 'life' | 'non-life';
    status: QuoteStatus;
    // Details
    riskDescription: string;
    sumInsuredRequested: number;
    currency: string;
    // Options
    options: QuoteOption[];
    selectedOptionId?: string;
    // Dates
    requestDate: string;
    validUntil: string;
    sentDate?: string;
    responseDate?: string;
    convertedPolicyId?: string;
    // Agent
    preparedBy: string;
    preparedById: string;
    // Audit
    createdAt: string;
    updatedAt: string;
}

// ─── Quotes Data ───
export const mockQuotes: Quote[] = [
    {
        id: 'qt-001',
        quoteNumber: 'QT-2026-0001',
        clientId: 'cli-002',
        clientName: 'Radiance Petroleum',
        clientPhone: '+233 20 333 4455',
        clientEmail: 'info@radiancepetrol.com',
        insuranceType: 'fire',
        coverageType: 'Fire & Allied Perils',
        policyType: 'non-life',
        status: 'sent',
        riskDescription: 'Industrial refinery complex — main production facility, storage tanks, and office block at Tema Heavy Industrial Area.',
        sumInsuredRequested: 8000000,
        currency: 'GHS',
        options: [
            { id: 'opt-001a', carrierName: 'Enterprise Insurance', carrierId: 'carrier-enterprise', premium: 96000, sumInsured: 8000000, commissionRate: 17.5, commissionAmount: 16800, excessOrDeductible: 'GHS 5,000 per occurrence', coverageNotes: 'Full fire, lightning, explosion. Excludes riot & strike unless endorsement added.', isRecommended: true, isSelected: false },
            { id: 'opt-001b', carrierName: 'SIC Insurance', carrierId: 'carrier-sic', premium: 102000, sumInsured: 8000000, commissionRate: 15, commissionAmount: 15300, excessOrDeductible: 'GHS 3,000 per occurrence', coverageNotes: 'Comprehensive fire & allied perils including RSMD. Debris removal included.', isRecommended: false, isSelected: false },
            { id: 'opt-001c', carrierName: 'Star Assurance', carrierId: 'carrier-star', premium: 89000, sumInsured: 7500000, commissionRate: 15, commissionAmount: 13350, excessOrDeductible: 'GHS 10,000 per occurrence', coverageNotes: 'Basic fire coverage only. Lower sum insured offered. High excess.', isRecommended: false, isSelected: false },
        ],
        requestDate: '2026-02-20',
        validUntil: '2026-03-20',
        sentDate: '2026-02-22',
        preparedBy: 'Kofi Asante',
        preparedById: 'usr-004',
        createdAt: '2026-02-20T09:00:00Z',
        updatedAt: '2026-02-22T14:30:00Z',
    },
    {
        id: 'qt-002',
        quoteNumber: 'QT-2026-0002',
        clientId: 'cli-005',
        clientName: 'MTN Ghana',
        clientPhone: '+233 24 999 0011',
        clientEmail: 'insurance@mtn.com.gh',
        insuranceType: 'health',
        coverageType: 'Group Health Insurance',
        policyType: 'non-life',
        status: 'accepted',
        riskDescription: 'Group health insurance for 2,500 employees across all MTN Ghana offices. Includes in-patient, out-patient, dental, and optical.',
        sumInsuredRequested: 100000000,
        currency: 'GHS',
        options: [
            { id: 'opt-002a', carrierName: 'Allianz Insurance', carrierId: 'carrier-allianz', premium: 625000, sumInsured: 100000000, commissionRate: 10, commissionAmount: 62500, excessOrDeductible: 'Nil for in-patient, GHS 50 co-pay out-patient', coverageNotes: 'Comprehensive group health. All tiers. Includes wellness programme.', isRecommended: true, isSelected: true },
            { id: 'opt-002b', carrierName: 'Hollard Insurance', carrierId: 'carrier-hollard', premium: 590000, sumInsured: 85000000, commissionRate: 8, commissionAmount: 47200, excessOrDeductible: 'GHS 100 co-pay all visits', coverageNotes: 'Standard group health. Excludes dental & optical for junior staff tier.', isRecommended: false, isSelected: false },
        ],
        requestDate: '2026-02-10',
        validUntil: '2026-03-10',
        sentDate: '2026-02-12',
        responseDate: '2026-02-18',
        selectedOptionId: 'opt-002a',
        preparedBy: 'Abena Nyarko',
        preparedById: 'usr-005',
        createdAt: '2026-02-10T08:00:00Z',
        updatedAt: '2026-02-18T11:00:00Z',
    },
    {
        id: 'qt-003',
        quoteNumber: 'QT-2026-0003',
        clientId: 'cli-001',
        clientName: "Ghana Shippers' Authority",
        clientPhone: '+233 24 456 7890',
        clientEmail: 'contact@ghaships.gov.gh',
        insuranceType: 'marine',
        coverageType: 'Marine Cargo',
        policyType: 'non-life',
        status: 'converted',
        riskDescription: 'Annual marine cargo open cover for all imports/exports. CIF value basis. Worldwide coverage.',
        sumInsuredRequested: 20000000,
        currency: 'GHS',
        options: [
            { id: 'opt-003a', carrierName: 'SIC Insurance', carrierId: 'carrier-sic', premium: 160000, sumInsured: 20000000, commissionRate: 20, commissionAmount: 32000, excessOrDeductible: 'GHS 2,000 per shipment', coverageNotes: 'ICC (A) clause — all risks. Institute cargo clauses. War & SRCC included.', isRecommended: true, isSelected: true },
            { id: 'opt-003b', carrierName: 'Activa International', carrierId: 'carrier-activa', premium: 175000, sumInsured: 20000000, commissionRate: 17.5, commissionAmount: 30625, excessOrDeductible: 'GHS 1,000 per shipment', coverageNotes: 'ICC (A) with lower excess. Includes refrigerated cargo endorsement.', isRecommended: false, isSelected: false },
        ],
        requestDate: '2026-01-15',
        validUntil: '2026-02-15',
        sentDate: '2026-01-17',
        responseDate: '2026-01-22',
        selectedOptionId: 'opt-003a',
        convertedPolicyId: 'pol-050',
        preparedBy: 'Esi Donkor',
        preparedById: 'usr-003',
        createdAt: '2026-01-15T10:00:00Z',
        updatedAt: '2026-01-25T16:00:00Z',
    },
    {
        id: 'qt-004',
        quoteNumber: 'QT-2026-0004',
        clientId: 'cli-008',
        clientName: 'Edmund Nii Lante',
        clientPhone: '+233 26 123 4567',
        clientEmail: 'edmund.niilante@email.com',
        insuranceType: 'motor',
        coverageType: 'Comprehensive Motor',
        policyType: 'non-life',
        status: 'draft',
        riskDescription: 'Toyota Land Cruiser V8 2024, private use. Accra. Parking: secured compound. No claims discount: 20%.',
        sumInsuredRequested: 450000,
        currency: 'GHS',
        options: [
            { id: 'opt-004a', carrierName: 'Loyalty Insurance', carrierId: 'carrier-loyalty', premium: 8100, sumInsured: 450000, commissionRate: 15, commissionAmount: 1215, excessOrDeductible: 'GHS 500 own damage, GHS 200 windscreen', coverageNotes: 'Comprehensive with own damage, third party, theft, fire. 20% NCD applied.', isRecommended: true, isSelected: false },
            { id: 'opt-004b', carrierName: 'Glico General', carrierId: 'carrier-glico', premium: 8550, sumInsured: 450000, commissionRate: 15, commissionAmount: 1282.50, excessOrDeductible: 'GHS 300 own damage, GHS 150 windscreen', coverageNotes: 'Comprehensive motor. Lower excess. Free 24/7 roadside assist. NCD 20%.', isRecommended: false, isSelected: false },
            { id: 'opt-004c', carrierName: 'Enterprise Insurance', carrierId: 'carrier-enterprise', premium: 7800, sumInsured: 420000, commissionRate: 12.5, commissionAmount: 975, excessOrDeductible: 'GHS 700 own damage', coverageNotes: 'Basic comprehensive. Reduced sum insured. Higher excess. Lowest premium.', isRecommended: false, isSelected: false },
        ],
        requestDate: '2026-02-28',
        validUntil: '2026-03-28',
        preparedBy: 'Esi Donkor',
        preparedById: 'usr-003',
        createdAt: '2026-02-28T15:00:00Z',
        updatedAt: '2026-02-28T15:00:00Z',
    },
    {
        id: 'qt-005',
        quoteNumber: 'QT-2026-0005',
        clientId: 'cli-004',
        clientName: 'Ecobank Ghana',
        clientPhone: '+233 27 111 2233',
        clientEmail: 'procurement@ecobank.com',
        insuranceType: 'liability',
        coverageType: 'Professional Indemnity',
        policyType: 'non-life',
        status: 'sent',
        riskDescription: 'Professional indemnity coverage for banking operations. Covers directors & officers, professional negligence, and cyber liability.',
        sumInsuredRequested: 30000000,
        currency: 'GHS',
        options: [
            { id: 'opt-005a', carrierName: 'Allianz Insurance', carrierId: 'carrier-allianz', premium: 285000, sumInsured: 30000000, commissionRate: 12, commissionAmount: 34200, excessOrDeductible: 'GHS 25,000 each and every claim', coverageNotes: 'Full PI with D&O and Cyber extensions. Retroactive date: inception.', isRecommended: true, isSelected: false },
            { id: 'opt-005b', carrierName: 'Enterprise Insurance', carrierId: 'carrier-enterprise', premium: 310000, sumInsured: 30000000, commissionRate: 15, commissionAmount: 46500, excessOrDeductible: 'GHS 15,000 each and every claim', coverageNotes: 'Comprehensive PI. Lower excess. Includes employment practices liability.', isRecommended: false, isSelected: false },
        ],
        requestDate: '2026-02-15',
        validUntil: '2026-03-15',
        sentDate: '2026-02-17',
        preparedBy: 'Kofi Asante',
        preparedById: 'usr-004',
        createdAt: '2026-02-15T11:00:00Z',
        updatedAt: '2026-02-17T09:00:00Z',
    },
    {
        id: 'qt-006',
        quoteNumber: 'QT-2026-0006',
        clientId: 'cli-003',
        clientName: 'Dorcas Amanda Borquaye',
        clientPhone: '+233 55 666 7788',
        clientEmail: 'dorcas.amanda@email.com',
        insuranceType: 'motor',
        coverageType: 'Third Party Motor',
        policyType: 'non-life',
        status: 'declined',
        riskDescription: 'Honda Civic 2021. Third party only. Private use in Accra.',
        sumInsuredRequested: 0,
        currency: 'GHS',
        options: [
            { id: 'opt-006a', carrierName: 'Star Assurance', carrierId: 'carrier-star', premium: 380, sumInsured: 0, commissionRate: 10, commissionAmount: 38, excessOrDeductible: 'N/A — Third Party Only', coverageNotes: 'Statutory third party only. Meets NIC minimum requirements.', isRecommended: true, isSelected: false },
        ],
        requestDate: '2026-02-05',
        validUntil: '2026-03-05',
        sentDate: '2026-02-06',
        responseDate: '2026-02-10',
        preparedBy: 'Esi Donkor',
        preparedById: 'usr-003',
        createdAt: '2026-02-05T13:00:00Z',
        updatedAt: '2026-02-10T10:00:00Z',
    },
    {
        id: 'qt-007',
        quoteNumber: 'QT-2026-0007',
        clientId: 'cli-012',
        clientName: 'Ghana Airports Company',
        clientPhone: '+233 30 277 1234',
        clientEmail: 'procurement@gacl.com.gh',
        insuranceType: 'fire',
        coverageType: 'Property All Risks',
        policyType: 'non-life',
        status: 'sent',
        riskDescription: 'Property all risks for Kotoka International Airport terminal buildings, cargo village, and administration block.',
        sumInsuredRequested: 150000000,
        currency: 'GHS',
        options: [
            { id: 'opt-007a', carrierName: 'SIC Insurance', carrierId: 'carrier-sic', premium: 1200000, sumInsured: 150000000, commissionRate: 15, commissionAmount: 180000, excessOrDeductible: 'GHS 50,000 per occurrence', coverageNotes: 'Property all risks including machinery breakdown, business interruption 12 months. Co-insurance likely required.', isRecommended: true, isSelected: false },
            { id: 'opt-007b', carrierName: 'Enterprise Insurance', carrierId: 'carrier-enterprise', premium: 1350000, sumInsured: 150000000, commissionRate: 12.5, commissionAmount: 168750, excessOrDeductible: 'GHS 25,000 per occurrence', coverageNotes: 'Full property all risks. Lower excess. Includes terrorism cover. Lead insurer offer.', isRecommended: false, isSelected: false },
        ],
        requestDate: '2026-02-25',
        validUntil: '2026-03-25',
        sentDate: '2026-02-27',
        preparedBy: 'Kofi Asante',
        preparedById: 'usr-004',
        createdAt: '2026-02-25T08:30:00Z',
        updatedAt: '2026-02-27T16:00:00Z',
    },
    {
        id: 'qt-008',
        quoteNumber: 'QT-2026-0008',
        clientId: 'cli-010',
        clientName: 'Tema Oil Refinery',
        clientPhone: '+233 30 320 1234',
        clientEmail: 'insurance@tor.com.gh',
        insuranceType: 'engineering',
        coverageType: 'Machinery Breakdown',
        policyType: 'non-life',
        status: 'expired',
        riskDescription: 'Machinery breakdown insurance for main refinery equipment — distillation towers, pumps, compressors, and turbines.',
        sumInsuredRequested: 45000000,
        currency: 'GHS',
        options: [
            { id: 'opt-008a', carrierName: 'Activa International', carrierId: 'carrier-activa', premium: 315000, sumInsured: 45000000, commissionRate: 17.5, commissionAmount: 55125, excessOrDeductible: 'GHS 20,000 each occurrence + 7 day waiting period', coverageNotes: 'Machinery breakdown all risks. Includes expediting expenses and loss of profits (12 months).', isRecommended: true, isSelected: false },
        ],
        requestDate: '2026-01-05',
        validUntil: '2026-02-05',
        sentDate: '2026-01-07',
        preparedBy: 'Abena Nyarko',
        preparedById: 'usr-005',
        createdAt: '2026-01-05T10:00:00Z',
        updatedAt: '2026-02-06T00:00:00Z',
    },
    {
        id: 'qt-009',
        quoteNumber: 'QT-2026-0009',
        clientId: 'cli-040',
        clientName: 'Guinness Ghana Breweries',
        clientPhone: '+233 30 277 5566',
        clientEmail: 'procurement@guinness.com.gh',
        insuranceType: 'liability',
        coverageType: 'Product Liability',
        policyType: 'non-life',
        status: 'sent',
        riskDescription: 'Product liability insurance for beverages manufacturing and distribution. Covers bodily injury and property damage from defective products.',
        sumInsuredRequested: 25000000,
        currency: 'GHS',
        options: [
            { id: 'opt-009a', carrierName: 'Allianz Insurance', carrierId: 'carrier-allianz', premium: 187500, sumInsured: 25000000, commissionRate: 17.5, commissionAmount: 32812.50, excessOrDeductible: 'GHS 10,000 per claim', coverageNotes: 'Product liability with recall expenses extension. Worldwide excl. USA/Canada.', isRecommended: true, isSelected: false },
            { id: 'opt-009b', carrierName: 'Hollard Insurance', carrierId: 'carrier-hollard', premium: 175000, sumInsured: 20000000, commissionRate: 15, commissionAmount: 26250, excessOrDeductible: 'GHS 15,000 per claim', coverageNotes: 'Product liability basic. Lower SI offered. No recall extension.', isRecommended: false, isSelected: false },
        ],
        requestDate: '2026-02-22',
        validUntil: '2026-03-22',
        sentDate: '2026-02-24',
        preparedBy: 'Esi Donkor',
        preparedById: 'usr-003',
        createdAt: '2026-02-22T14:00:00Z',
        updatedAt: '2026-02-24T11:00:00Z',
    },
    {
        id: 'qt-010',
        quoteNumber: 'QT-2026-0010',
        clientId: 'cli-015',
        clientName: 'AngloGold Ashanti',
        clientPhone: '+233 32 204 5678',
        clientEmail: 'insurance@anglogoldashanti.com',
        insuranceType: 'fire',
        coverageType: 'Industrial All Risks',
        policyType: 'non-life',
        status: 'draft',
        riskDescription: 'Industrial all risks for Obuasi Mine surface installations — processing plant, workshops, stores, and accommodation village.',
        sumInsuredRequested: 500000000,
        currency: 'GHS',
        options: [],
        requestDate: '2026-03-01',
        validUntil: '2026-04-01',
        preparedBy: 'Kofi Asante',
        preparedById: 'usr-004',
        createdAt: '2026-03-01T07:00:00Z',
        updatedAt: '2026-03-01T07:00:00Z',
    },
    {
        id: 'qt-011',
        quoteNumber: 'QT-2026-0011',
        clientId: 'cli-044',
        clientName: 'Northern Electricity Distribution',
        clientPhone: '+233 37 202 3456',
        clientEmail: 'procurement@nedco.com.gh',
        insuranceType: 'engineering',
        coverageType: 'Erection All Risks',
        policyType: 'non-life',
        status: 'sent',
        riskDescription: 'Erection all risks for new 161kV substation construction project in Tamale. 18-month project period.',
        sumInsuredRequested: 35000000,
        currency: 'GHS',
        options: [
            { id: 'opt-011a', carrierName: 'SIC Insurance', carrierId: 'carrier-sic', premium: 245000, sumInsured: 35000000, commissionRate: 17.5, commissionAmount: 42875, excessOrDeductible: 'GHS 15,000 + 14 day testing', coverageNotes: 'EAR including testing & commissioning (4 weeks). Maintenance period 12 months at 50% SI.', isRecommended: true, isSelected: false },
            { id: 'opt-011b', carrierName: 'Prime Insurance', carrierId: 'carrier-prime', premium: 262500, sumInsured: 35000000, commissionRate: 15, commissionAmount: 39375, excessOrDeductible: 'GHS 10,000 + 7 day testing', coverageNotes: 'Erection all risks with extended maintenance. Includes third party liability GHS 5M.', isRecommended: false, isSelected: false },
        ],
        requestDate: '2026-02-18',
        validUntil: '2026-03-18',
        sentDate: '2026-02-20',
        preparedBy: 'Abena Nyarko',
        preparedById: 'usr-005',
        createdAt: '2026-02-18T09:00:00Z',
        updatedAt: '2026-02-20T15:00:00Z',
    },
    {
        id: 'qt-012',
        quoteNumber: 'QT-2026-0012',
        clientId: 'cli-042',
        clientName: 'Cocoa Processing Company',
        clientPhone: '+233 30 321 7890',
        clientEmail: 'finance@cpc.com.gh',
        insuranceType: 'motor',
        coverageType: 'Commercial Fleet',
        policyType: 'non-life',
        status: 'accepted',
        riskDescription: 'Commercial fleet comprehensive — 15 delivery trucks, 8 pick-ups, 3 executive vehicles. Tema-based operations.',
        sumInsuredRequested: 4800000,
        currency: 'GHS',
        options: [
            { id: 'opt-012a', carrierName: 'Loyalty Insurance', carrierId: 'carrier-loyalty', premium: 67200, sumInsured: 4800000, commissionRate: 15, commissionAmount: 10080, excessOrDeductible: 'GHS 1,000 per vehicle per claim', coverageNotes: 'Fleet comprehensive 26 vehicles. 10% fleet discount applied. Includes PA driver.', isRecommended: true, isSelected: true },
        ],
        requestDate: '2026-02-12',
        validUntil: '2026-03-12',
        sentDate: '2026-02-14',
        responseDate: '2026-02-20',
        selectedOptionId: 'opt-012a',
        preparedBy: 'Esi Donkor',
        preparedById: 'usr-003',
        createdAt: '2026-02-12T10:00:00Z',
        updatedAt: '2026-02-20T14:00:00Z',
    },
];

// ─── Summary ───
export const quoteSummary = (() => {
    const all = mockQuotes;
    const drafts = all.filter(q => q.status === 'draft');
    const sent = all.filter(q => q.status === 'sent');
    const accepted = all.filter(q => q.status === 'accepted');
    const declined = all.filter(q => q.status === 'declined');
    const expired = all.filter(q => q.status === 'expired');
    const converted = all.filter(q => q.status === 'converted');

    const totalPremiumQuoted = all.reduce((s, q) => {
        const best = q.options.find(o => o.isRecommended) || q.options[0];
        return s + (best?.premium || 0);
    }, 0);

    const acceptedPremium = [...accepted, ...converted].reduce((s, q) => {
        const sel = q.options.find(o => o.isSelected) || q.options.find(o => o.isRecommended) || q.options[0];
        return s + (sel?.premium || 0);
    }, 0);

    const expectedCommission = [...accepted, ...converted].reduce((s, q) => {
        const sel = q.options.find(o => o.isSelected) || q.options.find(o => o.isRecommended) || q.options[0];
        return s + (sel?.commissionAmount || 0);
    }, 0);

    const conversionRate = (sent.length + accepted.length + declined.length + converted.length) > 0
        ? ((accepted.length + converted.length) / (sent.length + accepted.length + declined.length + converted.length)) * 100
        : 0;

    return {
        total: all.length,
        drafts: drafts.length,
        sent: sent.length,
        accepted: accepted.length,
        declined: declined.length,
        expired: expired.length,
        converted: converted.length,
        totalPremiumQuoted,
        acceptedPremium,
        expectedCommission,
        conversionRate,
    };
})();

// ─── Status Config ───
export const QUOTE_STATUS_CONFIG: Record<QuoteStatus, { label: string; color: string; bg: string; dot: string }> = {
    draft: { label: 'Draft', color: 'text-surface-600', bg: 'bg-surface-100', dot: 'bg-surface-400' },
    sent: { label: 'Sent', color: 'text-blue-700', bg: 'bg-blue-50', dot: 'bg-blue-500' },
    accepted: { label: 'Accepted', color: 'text-success-700', bg: 'bg-success-50', dot: 'bg-success-500' },
    declined: { label: 'Declined', color: 'text-danger-700', bg: 'bg-danger-50', dot: 'bg-danger-500' },
    expired: { label: 'Expired', color: 'text-amber-700', bg: 'bg-amber-50', dot: 'bg-amber-500' },
    converted: { label: 'Converted', color: 'text-primary-700', bg: 'bg-primary-50', dot: 'bg-primary-500' },
};

export function getQuoteById(id: string): Quote | undefined {
    return mockQuotes.find(q => q.id === id);
}
