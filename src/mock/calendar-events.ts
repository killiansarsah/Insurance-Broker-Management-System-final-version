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
        title: 'Policy Renewal: John Doe',
        description: 'Annual Motor Insurance renewal for Silver Package.',
        start: addDays(today, 2),
        end: addDays(today, 2),
        type: 'policy',
        status: 'upcoming',
        location: 'Office / Zoom',
    },
    {
        id: '2',
        title: 'Client Meeting: Jane Smith',
        description: 'Consultation for new Health Insurance policy.',
        start: addDays(today, -1),
        end: addDays(today, -1),
        type: 'meeting',
        status: 'completed',
        location: 'City Cafe',
        attendees: ['Jane Smith', 'Killian Sarsah'],
    },
    {
        id: '3',
        title: 'Claim Follow-up: Bob Winston',
        description: 'Review documentation for claim #CL-9982.',
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
        title: 'Policy Expiry: Sarah Connor',
        description: 'Home Insurance policy expiring in 7 days.',
        start: addDays(today, 7),
        end: addDays(today, 7),
        type: 'policy',
        status: 'upcoming',
    },
    {
        id: '6',
        title: 'Meeting: Tech Partnership',
        description: 'Discuss API integration with external provider.',
        start: addDays(today, 3),
        end: addDays(today, 3),
        type: 'meeting',
        status: 'upcoming',
        location: 'Virtual',
    },
];
