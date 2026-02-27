// Renewals Mock Data — Derived from real policy data with renewal workflow tracking


export type RenewalWorkflowStatus = 'pending' | 'contacted' | 'quoted' | 'renewed' | 'lost';
export type UrgencyLevel = 'critical' | 'urgent' | 'important' | 'upcoming' | 'safe';
export type LostReason =
    | 'price_too_high'
    | 'switched_competitor'
    | 'no_longer_needs'
    | 'poor_service'
    | 'client_relocated'
    | 'business_closed'
    | 'other';

export interface RenewalReminder {
    id: string;
    type: '90_day' | '60_day' | '30_day' | '14_day' | '7_day' | 'overdue';
    scheduledDate: string;
    sentDate?: string;
    channel: 'email' | 'sms' | 'both';
    status: 'scheduled' | 'sent' | 'failed' | 'skipped';
}

export interface RenewalNote {
    id: string;
    date: string;
    author: string;
    content: string;
    type: 'contact' | 'note' | 'system' | 'escalation';
}

export interface Renewal {
    id: string;
    policyId: string;
    policyNumber: string;
    clientId: string;
    clientName: string;
    clientPhone: string;
    clientEmail: string;
    insuranceType: string;
    policyType: string;
    insurerName: string;
    insurerId: string;
    coverageType?: string;

    // Dates
    inceptionDate: string;
    expiryDate: string;
    daysToExpiry: number;

    // Financial
    currentPremium: number;
    proposedPremium: number;
    sumInsured: number;
    commissionRate: number;
    currency: string;

    // Renewal workflow
    renewalStatus: RenewalWorkflowStatus;
    urgencyLevel: UrgencyLevel;

    // Agent
    assignedAgent: string;
    assignedAgentId: string;
    contactAttempts: number;
    lastContactDate?: string;

    // Lost tracking
    lostReason?: LostReason;
    lostNotes?: string;

    // Reminders
    reminders: RenewalReminder[];
    autoRemindersEnabled: boolean;

    // Notes
    notes: RenewalNote[];

    // Audit
    createdAt: string;
    updatedAt: string;
}

// ─── Helper: Assign urgency level based on days to expiry ───
function getUrgencyLevel(days: number, status: RenewalWorkflowStatus): UrgencyLevel {
    if (status === 'renewed') return 'safe';
    if (status === 'lost') return 'critical';
    if (days < 0) return 'critical';        // overdue
    if (days <= 7) return 'critical';       // 0-7 days
    if (days <= 30) return 'urgent';        // 8-30 days
    if (days <= 60) return 'important';     // 31-60 days
    if (days <= 90) return 'upcoming';      // 61-90 days
    return 'safe';                          // >90 days
}

// ─── Helper: Generate reminders for a renewal ───
function generateReminders(expiryDate: string, daysToExpiry: number): RenewalReminder[] {
    const expiry = new Date(expiryDate);
    const reminders: RenewalReminder[] = [];
    const schedules: { type: RenewalReminder['type']; daysBefore: number }[] = [
        { type: '90_day', daysBefore: 90 },
        { type: '60_day', daysBefore: 60 },
        { type: '30_day', daysBefore: 30 },
        { type: '14_day', daysBefore: 14 },
        { type: '7_day', daysBefore: 7 },
    ];

    schedules.forEach((s, i) => {
        const scheduledDate = new Date(expiry);
        scheduledDate.setDate(scheduledDate.getDate() - s.daysBefore);
        const scheduledStr = scheduledDate.toISOString().slice(0, 10);
        const daysUntilSend = daysToExpiry - s.daysBefore;

        let status: RenewalReminder['status'] = 'scheduled';
        let sentDate: string | undefined;

        if (daysUntilSend < 0) {
            // This reminder date has passed
            status = 'sent';
            sentDate = scheduledStr;
        }

        reminders.push({
            id: `rem-${i}`,
            type: s.type,
            scheduledDate: scheduledStr,
            sentDate,
            channel: s.daysBefore <= 14 ? 'both' : 'email',
            status,
        });
    });

    // Add overdue reminder if overdue
    if (daysToExpiry < 0) {
        reminders.push({
            id: 'rem-overdue',
            type: 'overdue',
            scheduledDate: new Date().toISOString().slice(0, 10),
            sentDate: new Date().toISOString().slice(0, 10),
            channel: 'both',
            status: 'sent',
        });
    }

    return reminders;
}

// ─── Client contact info (mock) ───
const CLIENT_PHONES: Record<string, string> = {
    'cli-001': '+233 24 456 7890',
    'cli-002': '+233 20 333 4455',
    'cli-003': '+233 55 666 7788',
    'cli-004': '+233 27 111 2233',
    'cli-005': '+233 24 999 0011',
};

const CLIENT_EMAILS: Record<string, string> = {
    'cli-001': 'contact@ghaships.gov.gh',
    'cli-002': 'info@radiancepetrol.com',
    'cli-003': 'admin@stanbicbank.com.gh',
    'cli-004': 'procurement@ecobank.com',
    'cli-005': 'insurance@mtn.com.gh',
};

// ─── Generate renewals ───
function generateRenewals(): Renewal[] {
    const renewals: Renewal[] = [];

    // Manually curate a diverse set of renewals with different statuses & urgency levels
    const manualRenewals: Partial<Renewal>[] = [
        // CRITICAL: Overdue (negative days)
        {
            id: 'ren-001',
            policyNumber: 'LOY/HQ/MOT/MC22/40312',
            clientName: 'Ghana Shippers\' Authority',
            clientId: 'cli-001',
            insurerName: 'Loyalty Insurance',
            insuranceType: 'motor',
            coverageType: 'Comprehensive',
            policyType: 'non-life',
            inceptionDate: '2025-01-15',
            expiryDate: '2026-01-15',
            daysToExpiry: -43,
            currentPremium: 11298.10,
            proposedPremium: 12200,
            sumInsured: 180000,
            commissionRate: 15,
            renewalStatus: 'contacted',
            assignedAgent: 'Esi Donkor',
            assignedAgentId: 'usr-003',
            contactAttempts: 4,
            lastContactDate: '2026-02-20',
            notes: [
                { id: 'n1', date: '2026-02-20', author: 'Esi Donkor', content: 'Client requested 2-week extension to arrange payment. MD is travelling.', type: 'contact' },
                { id: 'n2', date: '2026-02-10', author: 'System', content: 'Overdue reminder sent via email and SMS.', type: 'system' },
                { id: 'n3', date: '2026-01-15', author: 'System', content: 'Policy expired. Renewal pending.', type: 'system' },
            ],
        },
        // CRITICAL: 3 days left
        {
            id: 'ren-002',
            policyNumber: 'GG-DSDM-1010-21-002142',
            clientName: 'Radiance Petroleum',
            clientId: 'cli-002',
            insurerName: 'Glico General',
            insuranceType: 'fire',
            coverageType: 'Fire & Allied Perils',
            policyType: 'non-life',
            inceptionDate: '2025-03-02',
            expiryDate: '2026-03-02',
            daysToExpiry: 3,
            currentPremium: 45000,
            proposedPremium: 48500,
            sumInsured: 5000000,
            commissionRate: 17.5,
            renewalStatus: 'quoted',
            assignedAgent: 'Kofi Asante',
            assignedAgentId: 'usr-004',
            contactAttempts: 3,
            lastContactDate: '2026-02-25',
            notes: [
                { id: 'n1', date: '2026-02-25', author: 'Kofi Asante', content: 'Renewal quote sent. Client reviewing with CFO. Premium increase of 7.8% due to claims history.', type: 'contact' },
                { id: 'n2', date: '2026-02-15', author: 'Kofi Asante', content: 'Called to discuss renewal terms. Requested updated valuation.', type: 'contact' },
            ],
        },
        // CRITICAL: 6 days
        {
            id: 'ren-003',
            policyNumber: 'SIC/ACC/MAR/25/10045',
            clientName: 'Tema Oil Refinery',
            clientId: 'cli-010',
            insurerName: 'SIC Insurance',
            insuranceType: 'marine',
            coverageType: 'Marine Cargo',
            policyType: 'non-life',
            inceptionDate: '2025-03-05',
            expiryDate: '2026-03-05',
            daysToExpiry: 6,
            currentPremium: 78500,
            proposedPremium: 82000,
            sumInsured: 15000000,
            commissionRate: 20,
            renewalStatus: 'contacted',
            assignedAgent: 'Abena Nyarko',
            assignedAgentId: 'usr-005',
            contactAttempts: 2,
            lastContactDate: '2026-02-22',
            notes: [
                { id: 'n1', date: '2026-02-22', author: 'Abena Nyarko', content: 'Client interested in expanding coverage to include transit storage. Awaiting revised quote from underwriter.', type: 'contact' },
            ],
        },
        // URGENT: 12 days
        {
            id: 'ren-004',
            policyNumber: 'ENT/HQ/FIR/25/20189',
            clientName: 'Stanbic Bank Ghana',
            clientId: 'cli-003',
            insurerName: 'Enterprise Insurance',
            insuranceType: 'fire',
            coverageType: 'Property All Risks',
            policyType: 'non-life',
            inceptionDate: '2025-03-11',
            expiryDate: '2026-03-11',
            daysToExpiry: 12,
            currentPremium: 125000,
            proposedPremium: 130000,
            sumInsured: 25000000,
            commissionRate: 15,
            renewalStatus: 'quoted',
            assignedAgent: 'Esi Donkor',
            assignedAgentId: 'usr-003',
            contactAttempts: 3,
            lastContactDate: '2026-02-26',
            notes: [
                { id: 'n1', date: '2026-02-26', author: 'Esi Donkor', content: 'Quote approved by client. Awaiting payment confirmation from treasury.', type: 'contact' },
                { id: 'n2', date: '2026-02-20', author: 'Esi Donkor', content: 'Sent revised quote with 4% increase. Client negotiating.', type: 'contact' },
            ],
        },
        // URGENT: 18 days
        {
            id: 'ren-005',
            policyNumber: 'PRI/KUM/LIF/25/30056',
            clientName: 'Ecobank Ghana',
            clientId: 'cli-004',
            insurerName: 'Prime Insurance',
            insuranceType: 'life',
            coverageType: 'Group Life',
            policyType: 'life',
            inceptionDate: '2025-03-17',
            expiryDate: '2026-03-17',
            daysToExpiry: 18,
            currentPremium: 250000,
            proposedPremium: 265000,
            sumInsured: 50000000,
            commissionRate: 12,
            renewalStatus: 'contacted',
            assignedAgent: 'Kofi Asante',
            assignedAgentId: 'usr-004',
            contactAttempts: 2,
            lastContactDate: '2026-02-24',
            notes: [
                { id: 'n1', date: '2026-02-24', author: 'Kofi Asante', content: 'HR department reviewing updated employee list for headcount adjustment. Expected response by March 3.', type: 'contact' },
            ],
        },
        // URGENT: 25 days
        {
            id: 'ren-006',
            policyNumber: 'ALL/HQ/HLT/25/40200',
            clientName: 'MTN Ghana',
            clientId: 'cli-005',
            insurerName: 'Allianz Insurance',
            insuranceType: 'health',
            coverageType: 'Group Health',
            policyType: 'non-life',
            inceptionDate: '2025-03-24',
            expiryDate: '2026-03-24',
            daysToExpiry: 25,
            currentPremium: 580000,
            proposedPremium: 620000,
            sumInsured: 100000000,
            commissionRate: 10,
            renewalStatus: 'pending',
            assignedAgent: 'Abena Nyarko',
            assignedAgentId: 'usr-005',
            contactAttempts: 1,
            lastContactDate: '2026-02-18',
            notes: [
                { id: 'n1', date: '2026-02-18', author: 'Abena Nyarko', content: 'Initial outreach email sent. Large corporate account — needs early engagement.', type: 'contact' },
            ],
        },
        // IMPORTANT: 35 days
        {
            id: 'ren-007',
            policyNumber: 'STA/ACC/MOT/25/50301',
            clientName: 'Ghana Airports Company',
            clientId: 'cli-012',
            insurerName: 'Star Assurance',
            insuranceType: 'motor',
            coverageType: 'Fleet Comprehensive',
            policyType: 'non-life',
            inceptionDate: '2025-04-03',
            expiryDate: '2026-04-03',
            daysToExpiry: 35,
            currentPremium: 95000,
            proposedPremium: 99000,
            sumInsured: 8500000,
            commissionRate: 15,
            renewalStatus: 'contacted',
            assignedAgent: 'John Mensah',
            assignedAgentId: 'usr-008',
            contactAttempts: 1,
            lastContactDate: '2026-02-20',
            notes: [
                { id: 'n1', date: '2026-02-20', author: 'John Mensah', content: 'Fleet inventory update requested. 3 new vehicles to add to policy.', type: 'contact' },
            ],
        },
        // IMPORTANT: 45 days
        {
            id: 'ren-008',
            policyNumber: 'GLI/HQ/LIA/25/60112',
            clientName: 'Goldfields Ghana',
            clientId: 'cli-015',
            insurerName: 'GLICO General',
            insuranceType: 'liability',
            coverageType: 'Public Liability',
            policyType: 'non-life',
            inceptionDate: '2025-04-13',
            expiryDate: '2026-04-13',
            daysToExpiry: 45,
            currentPremium: 185000,
            proposedPremium: 195000,
            sumInsured: 35000000,
            commissionRate: 17.5,
            renewalStatus: 'pending',
            assignedAgent: 'Esi Donkor',
            assignedAgentId: 'usr-003',
            contactAttempts: 0,
            notes: [],
        },
        // IMPORTANT: 55 days
        {
            id: 'ren-009',
            policyNumber: 'HOL/ACC/FIR/25/70234',
            clientName: 'Accra Mall Ltd',
            clientId: 'cli-018',
            insurerName: 'Hollard Insurance',
            insuranceType: 'fire',
            coverageType: 'Commercial Fire',
            policyType: 'non-life',
            inceptionDate: '2025-04-23',
            expiryDate: '2026-04-23',
            daysToExpiry: 55,
            currentPremium: 68000,
            proposedPremium: 72000,
            sumInsured: 12000000,
            commissionRate: 15,
            renewalStatus: 'contacted',
            assignedAgent: 'Kofi Asante',
            assignedAgentId: 'usr-004',
            contactAttempts: 1,
            lastContactDate: '2026-02-15',
            notes: [
                { id: 'n1', date: '2026-02-15', author: 'Kofi Asante', content: 'Sent initial renewal notification. Property revaluation scheduled for March.', type: 'contact' },
            ],
        },
        // UPCOMING: 65 days
        {
            id: 'ren-010',
            policyNumber: 'MET/HQ/LIF/25/80090',
            clientName: 'University of Ghana',
            clientId: 'cli-020',
            insurerName: 'Metropolitan Insurance',
            insuranceType: 'life',
            coverageType: 'Group Life',
            policyType: 'life',
            inceptionDate: '2025-05-03',
            expiryDate: '2026-05-03',
            daysToExpiry: 65,
            currentPremium: 320000,
            proposedPremium: 340000,
            sumInsured: 80000000,
            commissionRate: 12,
            renewalStatus: 'pending',
            assignedAgent: 'Abena Nyarko',
            assignedAgentId: 'usr-005',
            contactAttempts: 0,
            notes: [],
        },
        // UPCOMING: 73 days
        {
            id: 'ren-011',
            policyNumber: 'PRI/HQ/MOT/25/90100',
            clientName: 'Tullow Oil Ghana',
            clientId: 'cli-022',
            insurerName: 'Prime Insurance',
            insuranceType: 'motor',
            coverageType: 'Fleet Commercial',
            policyType: 'non-life',
            inceptionDate: '2025-05-11',
            expiryDate: '2026-05-11',
            daysToExpiry: 73,
            currentPremium: 142000,
            proposedPremium: 149000,
            sumInsured: 12000000,
            commissionRate: 15,
            renewalStatus: 'pending',
            assignedAgent: 'John Mensah',
            assignedAgentId: 'usr-008',
            contactAttempts: 0,
            notes: [],
        },
        // UPCOMING: 81 days
        {
            id: 'ren-012',
            policyNumber: 'SIC/ACC/MAR/25/10200',
            clientName: 'Volta River Authority',
            clientId: 'cli-025',
            insurerName: 'SIC Insurance',
            insuranceType: 'marine',
            coverageType: 'Inland Marine',
            policyType: 'non-life',
            inceptionDate: '2025-05-19',
            expiryDate: '2026-05-19',
            daysToExpiry: 81,
            currentPremium: 55000,
            proposedPremium: 57500,
            sumInsured: 8000000,
            commissionRate: 20,
            renewalStatus: 'pending',
            assignedAgent: 'Esi Donkor',
            assignedAgentId: 'usr-003',
            contactAttempts: 0,
            notes: [],
        },
        // LOST: Client switched competitor
        {
            id: 'ren-013',
            policyNumber: 'ENT/HQ/MOT/24/11543',
            clientName: 'AngloGold Ashanti',
            clientId: 'cli-028',
            insurerName: 'Enterprise Insurance',
            insuranceType: 'motor',
            coverageType: 'Fleet Comprehensive',
            policyType: 'non-life',
            inceptionDate: '2024-12-01',
            expiryDate: '2025-12-01',
            daysToExpiry: -88,
            currentPremium: 210000,
            proposedPremium: 228000,
            sumInsured: 18000000,
            commissionRate: 15,
            renewalStatus: 'lost',
            lostReason: 'switched_competitor',
            lostNotes: 'Client moved to Broliance Insurance Brokers – quoted 12% lower premium.',
            assignedAgent: 'Kofi Asante',
            assignedAgentId: 'usr-004',
            contactAttempts: 5,
            lastContactDate: '2025-11-28',
            notes: [
                { id: 'n1', date: '2025-11-28', author: 'Kofi Asante', content: 'Client confirmed they are switching brokers. Could not match competitor pricing.', type: 'contact' },
                { id: 'n2', date: '2025-11-25', author: 'Kofi Asante', content: 'Escalated to management. Offered 5% discount but client declined.', type: 'escalation' },
            ],
        },
        // LOST: Price too high
        {
            id: 'ren-014',
            policyNumber: 'STA/KUM/FIR/24/22100',
            clientName: 'Obuasi Municipal Assembly',
            clientId: 'cli-030',
            insurerName: 'Star Assurance',
            insuranceType: 'fire',
            coverageType: 'Fire & Allied Perils',
            policyType: 'non-life',
            inceptionDate: '2025-01-10',
            expiryDate: '2026-01-10',
            daysToExpiry: -48,
            currentPremium: 32000,
            proposedPremium: 38000,
            sumInsured: 5000000,
            commissionRate: 17.5,
            renewalStatus: 'lost',
            lostReason: 'price_too_high',
            lostNotes: 'Client objected to 18.75% premium increase. Municipal budget constraints.',
            assignedAgent: 'John Mensah',
            assignedAgentId: 'usr-008',
            contactAttempts: 3,
            lastContactDate: '2026-01-08',
            notes: [
                { id: 'n1', date: '2026-01-08', author: 'John Mensah', content: 'Client officially declined renewal. Budget not approved for the increase.', type: 'contact' },
            ],
        },
        // RENEWED: Successfully renewed
        {
            id: 'ren-015',
            policyNumber: 'GLI/HQ/MOT/25/33400',
            clientName: 'Vodafone Ghana',
            clientId: 'cli-033',
            insurerName: 'GLICO General',
            insuranceType: 'motor',
            coverageType: 'Fleet Comprehensive',
            policyType: 'non-life',
            inceptionDate: '2025-02-01',
            expiryDate: '2026-02-01',
            daysToExpiry: -26,
            currentPremium: 175000,
            proposedPremium: 182000,
            sumInsured: 15000000,
            commissionRate: 15,
            renewalStatus: 'renewed',
            assignedAgent: 'Esi Donkor',
            assignedAgentId: 'usr-003',
            contactAttempts: 2,
            lastContactDate: '2026-01-28',
            notes: [
                { id: 'n1', date: '2026-01-30', author: 'System', content: 'Renewal processed successfully. New policy PRI/HQ/MOT/26/33401 issued.', type: 'system' },
                { id: 'n2', date: '2026-01-28', author: 'Esi Donkor', content: 'Client confirmed renewal with 4% increase. Payment received.', type: 'contact' },
            ],
        },
        // RENEWED
        {
            id: 'ren-016',
            policyNumber: 'HOL/ACC/HLT/25/44500',
            clientName: 'Ghana Commercial Bank',
            clientId: 'cli-035',
            insurerName: 'Hollard Insurance',
            insuranceType: 'health',
            coverageType: 'Group Health',
            policyType: 'non-life',
            inceptionDate: '2025-02-10',
            expiryDate: '2026-02-10',
            daysToExpiry: -17,
            currentPremium: 420000,
            proposedPremium: 445000,
            sumInsured: 75000000,
            commissionRate: 10,
            renewalStatus: 'renewed',
            assignedAgent: 'Abena Nyarko',
            assignedAgentId: 'usr-005',
            contactAttempts: 3,
            lastContactDate: '2026-02-08',
            notes: [
                { id: 'n1', date: '2026-02-10', author: 'System', content: 'Renewal completed. 850 employees covered under new term.', type: 'system' },
                { id: 'n2', date: '2026-02-08', author: 'Abena Nyarko', content: 'Final headcount confirmed. Payment processed via bank transfer.', type: 'contact' },
            ],
        },
        // RENEWED
        {
            id: 'ren-017',
            policyNumber: 'MET/ACC/LIF/25/55600',
            clientName: 'Newmont Gold',
            clientId: 'cli-037',
            insurerName: 'Metropolitan Insurance',
            insuranceType: 'life',
            coverageType: 'Group Life',
            policyType: 'life',
            inceptionDate: '2025-02-15',
            expiryDate: '2026-02-15',
            daysToExpiry: -12,
            currentPremium: 560000,
            proposedPremium: 580000,
            sumInsured: 120000000,
            commissionRate: 12,
            renewalStatus: 'renewed',
            assignedAgent: 'Kofi Asante',
            assignedAgentId: 'usr-004',
            contactAttempts: 2,
            lastContactDate: '2026-02-12',
            notes: [
                { id: 'n1', date: '2026-02-14', author: 'System', content: 'Renewal completed. Premium adjusted 3.6% upward.', type: 'system' },
            ],
        },
        // URGENT: 28 days — pending
        {
            id: 'ren-018',
            policyNumber: 'ALL/HQ/LIA/25/66700',
            clientName: 'Guinness Ghana Breweries',
            clientId: 'cli-040',
            insurerName: 'Allianz Insurance',
            insuranceType: 'liability',
            coverageType: 'Product Liability',
            policyType: 'non-life',
            inceptionDate: '2025-03-27',
            expiryDate: '2026-03-27',
            daysToExpiry: 28,
            currentPremium: 92000,
            proposedPremium: 97000,
            sumInsured: 20000000,
            commissionRate: 17.5,
            renewalStatus: 'pending',
            assignedAgent: 'Esi Donkor',
            assignedAgentId: 'usr-003',
            contactAttempts: 0,
            notes: [],
        },
        // CRITICAL: 1 day
        {
            id: 'ren-019',
            policyNumber: 'SIC/HQ/MOT/25/77800',
            clientName: 'Cocoa Processing Company',
            clientId: 'cli-042',
            insurerName: 'SIC Insurance',
            insuranceType: 'motor',
            coverageType: 'Commercial Vehicle',
            policyType: 'non-life',
            inceptionDate: '2025-02-28',
            expiryDate: '2026-02-28',
            daysToExpiry: 1,
            currentPremium: 38000,
            proposedPremium: 40500,
            sumInsured: 3200000,
            commissionRate: 15,
            renewalStatus: 'quoted',
            assignedAgent: 'John Mensah',
            assignedAgentId: 'usr-008',
            contactAttempts: 4,
            lastContactDate: '2026-02-27',
            notes: [
                { id: 'n1', date: '2026-02-27', author: 'John Mensah', content: 'URGENT: Client promised payment today. Waiting for mobile money confirmation.', type: 'contact' },
                { id: 'n2', date: '2026-02-26', author: 'John Mensah', content: 'Called procurement officer — payment approved, processing tomorrow.', type: 'contact' },
            ],
        },
        // Overdue: -15 days, contacted
        {
            id: 'ren-020',
            policyNumber: 'PRI/TAM/FIR/25/88900',
            clientName: 'Northern Electricity Distribution',
            clientId: 'cli-044',
            insurerName: 'Prime Insurance',
            insuranceType: 'fire',
            coverageType: 'Fire & Perils',
            policyType: 'non-life',
            inceptionDate: '2025-02-12',
            expiryDate: '2026-02-12',
            daysToExpiry: -15,
            currentPremium: 48000,
            proposedPremium: 52000,
            sumInsured: 8000000,
            commissionRate: 17.5,
            renewalStatus: 'contacted',
            assignedAgent: 'Abena Nyarko',
            assignedAgentId: 'usr-005',
            contactAttempts: 3,
            lastContactDate: '2026-02-25',
            notes: [
                { id: 'n1', date: '2026-02-25', author: 'Abena Nyarko', content: 'Client aware policy has lapsed. Government procurement process delaying payment. Escalated.', type: 'escalation' },
            ],
        },
    ];

    manualRenewals.forEach(mr => {
        const urgency = getUrgencyLevel(mr.daysToExpiry!, mr.renewalStatus!);
        const reminders = generateReminders(mr.expiryDate!, mr.daysToExpiry!);

        renewals.push({
            id: mr.id!,
            policyId: `pol-ren-${mr.id!.split('-')[1]}`,
            policyNumber: mr.policyNumber!,
            clientId: mr.clientId!,
            clientName: mr.clientName!,
            clientPhone: CLIENT_PHONES[mr.clientId!] || `+233 ${20 + Math.floor(Math.random() * 30)} ${String(Math.floor(Math.random() * 900) + 100)} ${String(Math.floor(Math.random() * 9000) + 1000)}`,
            clientEmail: CLIENT_EMAILS[mr.clientId!] || `${mr.clientName!.toLowerCase().replace(/[^a-z]/g, '').slice(0, 10)}@company.com.gh`,
            insuranceType: mr.insuranceType!,
            policyType: mr.policyType!,
            insurerName: mr.insurerName!,
            insurerId: `carrier-${mr.insurerName!.toLowerCase().replace(/\s/g, '-')}`,
            coverageType: mr.coverageType,
            inceptionDate: mr.inceptionDate!,
            expiryDate: mr.expiryDate!,
            daysToExpiry: mr.daysToExpiry!,
            currentPremium: mr.currentPremium!,
            proposedPremium: mr.proposedPremium!,
            sumInsured: mr.sumInsured!,
            commissionRate: mr.commissionRate!,
            currency: 'GHS',
            renewalStatus: mr.renewalStatus!,
            urgencyLevel: urgency,
            assignedAgent: mr.assignedAgent!,
            assignedAgentId: mr.assignedAgentId!,
            contactAttempts: mr.contactAttempts!,
            lastContactDate: mr.lastContactDate,
            lostReason: mr.lostReason as LostReason | undefined,
            lostNotes: mr.lostNotes,
            reminders,
            autoRemindersEnabled: mr.renewalStatus !== 'lost',
            notes: mr.notes as RenewalNote[] || [],
            createdAt: mr.inceptionDate! + 'T10:00:00Z',
            updatedAt: new Date().toISOString(),
        });
    });

    return renewals;
}

export const mockRenewals = generateRenewals();

// ─── Summary Calculations ───
export const renewalSummary = (() => {
    const all = mockRenewals;
    const active = all.filter(r => !['renewed', 'lost'].includes(r.renewalStatus));

    const critical = active.filter(r => r.urgencyLevel === 'critical');
    const urgent = active.filter(r => r.urgencyLevel === 'urgent');
    const important = active.filter(r => r.urgencyLevel === 'important');
    const upcoming = active.filter(r => r.urgencyLevel === 'upcoming');

    const renewed = all.filter(r => r.renewalStatus === 'renewed');
    const lost = all.filter(r => r.renewalStatus === 'lost');

    const totalPremiumAtRisk = active.reduce((s, r) => s + r.currentPremium, 0);
    const renewedPremium = renewed.reduce((s, r) => s + r.proposedPremium, 0);
    const lostPremium = lost.reduce((s, r) => s + r.currentPremium, 0);
    const renewalRate = (renewed.length + lost.length) > 0
        ? (renewed.length / (renewed.length + lost.length)) * 100
        : 0;

    // Pipeline buckets
    const overdue = active.filter(r => r.daysToExpiry < 0);
    const next7 = active.filter(r => r.daysToExpiry >= 0 && r.daysToExpiry <= 7);
    const next30 = active.filter(r => r.daysToExpiry >= 0 && r.daysToExpiry <= 30);
    const next60 = active.filter(r => r.daysToExpiry > 30 && r.daysToExpiry <= 60);
    const next90 = active.filter(r => r.daysToExpiry > 60 && r.daysToExpiry <= 90);

    return {
        total: all.length,
        active: active.length,
        critical: critical.length,
        urgent: urgent.length,
        important: important.length,
        upcoming: upcoming.length,
        renewedCount: renewed.length,
        lostCount: lost.length,
        totalPremiumAtRisk,
        renewedPremium,
        lostPremium,
        renewalRate,
        overdue: overdue.length,
        overdueAmount: overdue.reduce((s, r) => s + r.currentPremium, 0),
        next7: next7.length,
        next30: next30.length,
        next60: next60.length,
        next90: next90.length,
        next30Amount: next30.reduce((s, r) => s + r.currentPremium, 0),
        next60Amount: next60.reduce((s, r) => s + r.currentPremium, 0),
        next90Amount: next90.reduce((s, r) => s + r.currentPremium, 0),
    };
})();

// ─── Labels ───
export const URGENCY_CONFIG: Record<UrgencyLevel, { label: string; color: string; bg: string; border: string; dot: string }> = {
    critical: { label: 'Critical', color: 'text-danger-700', bg: 'bg-danger-50', border: 'border-danger-200', dot: 'bg-danger-500' },
    urgent: { label: 'Urgent', color: 'text-warning-700', bg: 'bg-warning-50', border: 'border-warning-200', dot: 'bg-warning-500' },
    important: { label: 'Important', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-500' },
    upcoming: { label: 'Upcoming', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', dot: 'bg-blue-500' },
    safe: { label: 'Completed', color: 'text-success-700', bg: 'bg-success-50', border: 'border-success-200', dot: 'bg-success-500' },
};

export const WORKFLOW_STATUS_CONFIG: Record<RenewalWorkflowStatus, { label: string; color: string; bg: string }> = {
    pending: { label: 'Pending', color: 'text-surface-600', bg: 'bg-surface-100' },
    contacted: { label: 'Contacted', color: 'text-blue-700', bg: 'bg-blue-50' },
    quoted: { label: 'Quoted', color: 'text-amber-700', bg: 'bg-amber-50' },
    renewed: { label: 'Renewed', color: 'text-success-700', bg: 'bg-success-50' },
    lost: { label: 'Lost', color: 'text-danger-700', bg: 'bg-danger-50' },
};

export const LOST_REASON_LABEL: Record<LostReason, string> = {
    price_too_high: 'Price Too High',
    switched_competitor: 'Switched to Competitor',
    no_longer_needs: 'No Longer Needs Coverage',
    poor_service: 'Poor Service',
    client_relocated: 'Client Relocated',
    business_closed: 'Business Closed',
    other: 'Other',
};
