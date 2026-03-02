import { addDays, subDays, startOfMonth, endOfMonth, eachDayOfInterval, format } from 'date-fns';

export type CalendarEventType = 'policy' | 'meeting' | 'claim' | 'team' | 'compliance' | 'payment';
export type CalendarEventPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface CalendarEvent {

    id: string;
    title: string;
    description: string;
    start: Date;
    end: Date;
    type: CalendarEventType;
    priority: CalendarEventPriority;
    status: 'upcoming' | 'completed' | 'cancelled';
    location?: string;
    attendees?: string[];
}

const today = new Date();

export const mockEvents: CalendarEvent[] = [
    // === POLICY EVENTS ===
    {
        id: '1',
        title: 'Policy Renewal: Ghana Shippers\' Authority',
        description: 'Annual Motor Insurance renewal for LOY/HQ/MOT/MC22/40312.',
        start: addDays(today, 2),
        end: addDays(today, 2),
        type: 'policy',
        priority: 'high',
        status: 'upcoming',
        location: 'Office / Zoom',
    },
    {
        id: '5',
        title: 'Policy Expiry: Ernest Asante Offei',
        description: 'Motor Comprehensive policy expiring in 7 days.',
        start: addDays(today, 7),
        end: addDays(today, 7),
        type: 'policy',
        priority: 'urgent',
        status: 'upcoming',
    },
    {
        id: '10',
        title: 'Cover Note Expiry: Ashfoam Ghana',
        description: 'Temporary cover note for Fire & Property expires — full policy document pending from Star Assurance.',
        start: addDays(today, 4),
        end: addDays(today, 4),
        type: 'policy',
        priority: 'urgent',
        status: 'upcoming',
        location: 'Phone — Star Assurance',
    },
    {
        id: '14',
        title: 'Bulk Renewal: Accra Brewery Fleet',
        description: '23 Motor Comprehensive policies due for renewal. Fleet discount to be re-negotiated with Enterprise Insurance.',
        start: addDays(today, 12),
        end: addDays(today, 12),
        type: 'policy',
        priority: 'high',
        status: 'upcoming',
        location: 'Client Site — Accra Brewery, North Industrial',
    },

    // === MEETING EVENTS ===
    {
        id: '2',
        title: 'Client Meeting: Radiance Petroleum',
        description: 'Consultation for new Fire Insurance policy.',
        start: addDays(today, -1),
        end: addDays(today, -1),
        type: 'meeting',
        priority: 'medium',
        status: 'completed',
        location: 'City Cafe, Oxford Street, Osu',
        attendees: ['Radiance Rep', 'Kofi Asante'],
    },
    {
        id: '8',
        title: 'New Client Onboarding: TechNova Ltd',
        description: 'KYC document collection and risk assessment for Corporate Package (Motor + Fire + Liability).',
        start: addDays(today, 3),
        end: addDays(today, 3),
        type: 'meeting',
        priority: 'high',
        status: 'upcoming',
        location: 'TechNova Office — Airport City',
        attendees: ['CEO TechNova', 'K. Mensah', 'A. Boateng'],
    },
    {
        id: '11',
        title: 'Insurer Meeting: SIC Insurance',
        description: 'Quarterly review meeting with SIC — discuss commission rates, portfolio performance, and new product offerings.',
        start: addDays(today, 9),
        end: addDays(today, 9),
        type: 'meeting',
        priority: 'medium',
        status: 'upcoming',
        location: 'SIC Head Office — Accra Central',
        attendees: ['SIC Relationship Manager', 'Branch Manager'],
    },

    // === CLAIM EVENTS ===
    {
        id: '3',
        title: 'Claim Follow-up: Loretta Boakye',
        description: 'Review documentation for claim CLM-2025-0006.',
        start: addDays(today, 5),
        end: addDays(today, 5),
        type: 'claim',
        priority: 'high',
        status: 'upcoming',
        location: 'Phone Call',
    },
    {
        id: '9',
        title: 'Claim Inspection: Kofi Agyeman Vehicle',
        description: 'Loss adjuster inspection for Motor claim CLM-2026-0042. Client vehicle at AutoFix Garage.',
        start: addDays(today, 1),
        end: addDays(today, 1),
        type: 'claim',
        priority: 'urgent',
        status: 'upcoming',
        location: 'AutoFix Garage — Tema, Community 1',
        attendees: ['Loss Adjuster — Enterprise Insurance', 'K. Mensah'],
    },

    // === TEAM EVENTS ===
    {
        id: '4',
        title: 'Team Weekly Scrum',
        description: 'Review weekly targets and operational bottlenecks.',
        start: today,
        end: today,
        type: 'team',
        priority: 'medium',
        status: 'upcoming',
        location: 'Conference Room A',
        attendees: ['All Staff'],
    },
    {
        id: '15',
        title: 'Staff Training: Anti-Money Laundering',
        description: 'Mandatory AML training session for all brokers — NIC requirement for annual certification.',
        start: addDays(today, 18),
        end: addDays(today, 18),
        type: 'team',
        priority: 'high',
        status: 'upcoming',
        location: 'Conference Room B',
        attendees: ['All Brokers', 'Compliance Officer'],
    },

    // === COMPLIANCE EVENTS ===
    {
        id: '6',
        title: 'NIC Quarterly Return Submission',
        description: 'Submit Q1 2026 regulatory returns to National Insurance Commission — includes premium register, claims register, and commission statements.',
        start: addDays(today, 14),
        end: addDays(today, 14),
        type: 'compliance',
        priority: 'urgent',
        status: 'upcoming',
        location: 'NIC Portal — Online Submission',
    },
    {
        id: '12',
        title: 'KYC Expiry Review',
        description: 'Review 8 client KYC documents expiring this month — Ghana Card verifications and corporate registrations.',
        start: addDays(today, 6),
        end: addDays(today, 6),
        type: 'compliance',
        priority: 'high',
        status: 'upcoming',
        location: 'Office',
    },
    {
        id: '16',
        title: 'Annual Broker License Renewal',
        description: 'Prepare documentation for NIC broker license renewal — financial statements, professional indemnity insurance, and staff certifications.',
        start: addDays(today, 25),
        end: addDays(today, 25),
        type: 'compliance',
        priority: 'urgent',
        status: 'upcoming',
        location: 'NIC Office — Ring Road Central',
    },

    // === PAYMENT EVENTS ===
    {
        id: '7',
        title: 'Premium Collection: Goldfields Ltd',
        description: 'Outstanding premium balance of GHS 45,000 for Professional Indemnity policy. 14 days overdue — escalate to management if unpaid.',
        start: addDays(today, 1),
        end: addDays(today, 1),
        type: 'payment',
        priority: 'urgent',
        status: 'upcoming',
        location: 'Phone / Email Follow-up',
    },
    {
        id: '13',
        title: 'Commission Reconciliation: Hollard',
        description: 'Reconcile Q4 2025 commission statements with Hollard Insurance — GHS 12,300 discrepancy identified.',
        start: addDays(today, 3),
        end: addDays(today, 3),
        type: 'payment',
        priority: 'high',
        status: 'upcoming',
        location: 'Hollard Office — Cantonments',
    },
    {
        id: '17',
        title: 'Premium Remittance to Glico',
        description: 'Transfer collected premiums for 12 Motor policies to Glico General Insurance — deadline per placement agreement.',
        start: addDays(today, 2),
        end: addDays(today, 2),
        type: 'payment',
        priority: 'high',
        status: 'upcoming',
        location: 'Bank Transfer',
    },
];
