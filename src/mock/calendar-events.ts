import { addDays, subDays, startOfMonth, endOfMonth, eachDayOfInterval, format } from 'date-fns';

export type CalendarEventType = 'policy' | 'meeting' | 'claim' | 'team';
// Interactivity test
export interface CalendarEvent {

    id: string;
    title: string;
    description: string;
    start: Date;
    end: Date;
    type: CalendarEventType;
    status: 'upcoming' | 'completed' | 'cancelled';
    location?: string;
    attendees?: string[];
}

const today = new Date();

export const mockEvents: CalendarEvent[] = [
    {
        id: '1',
        title: 'Policy Renewal: Ghana Shippers\' Authority',
        description: 'Annual Motor Insurance renewal for LOY/HQ/MOT/MC22/40312.',
        start: addDays(today, 2),
        end: addDays(today, 2),
        type: 'policy',
        status: 'upcoming',
        location: 'Office / Zoom',
    },
    {
        id: '2',
        title: 'Client Meeting: Radiance Petroleum',
        description: 'Consultation for new Fire Insurance policy.',
        start: addDays(today, -1),
        end: addDays(today, -1),
        type: 'meeting',
        status: 'completed',
        location: 'City Cafe',
        attendees: ['Radiance Rep', 'Kofi Asante'],
    },
    {
        id: '3',
        title: 'Claim Follow-up: Loretta Boakye',
        description: 'Review documentation for claim CLM-2023-0006.',
        start: addDays(today, 5),
        end: addDays(today, 5),
        type: 'claim',
        status: 'upcoming',
        location: 'Phone Call',
    },
    {
        id: '4',
        title: 'Team Weekly Scrum',
        description: 'Review weekly targets and operational bottlenecks.',
        start: today,
        end: today,
        type: 'team',
        status: 'upcoming',
        location: 'Conference Room A',
        attendees: ['All Staff'],
    },
    {
        id: '5',
        title: 'Policy Expiry: Ernest Asante Offei',
        description: 'Motor Comprehensive policy expiring in 7 days.',
        start: addDays(today, 7),
        end: addDays(today, 7),
        type: 'policy',
        status: 'upcoming',
    },
];
