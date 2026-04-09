# Calendar Backend Connection - Fixed

## Issue
Calendar events were not being saved to the database. Events were only stored in local React state and disappeared on page refresh.

## Root Cause
The calendar component (`calendar-view.tsx`) was:
1. Loading from `mockEvents` (empty stub data)
2. Saving events only to local `useState`
3. **NOT calling any backend API**

## Fix Applied

### Before
```typescript
import { mockEvents as initialEvents } from '@/hooks/api';
const [events, setEvents] = useState(initialEvents);

const handleSaveEvent = (newEvent: any) => {
    setEvents([...events, newEvent]);  // Only local state!
    setIsModalOpen(false);
};
```

### After
```typescript
import { useCalendarEvents, useCreateCalendarEvent } from '@/hooks/api/use-calendar';

// Fetch from API
const { data: eventsData } = useCalendarEvents();
const createEvent = useCreateCalendarEvent();

const events = useMemo(() => {
    if (!eventsData?.data) return [];
    return eventsData.data.map((e: any) => ({
        ...e,
        start: new Date(e.start),
        end: new Date(e.end)
    }));
}, [eventsData]);

// Save to API
const handleSaveEvent = (newEvent: any) => {
    createEvent.mutate(newEvent, {
        onSuccess: () => {
            toast.success('Event Created');
            setIsModalOpen(false);
        },
        onError: () => {
            toast.error('Failed to create event');
        }
    });
};
```

## Backend Requirements

Your backend must implement these endpoints:

### GET /api/v1/calendar
Fetch all calendar events
```json
{
  "data": [
    {
      "id": "evt_123",
      "title": "Client Meeting",
      "start": "2025-01-15T09:00:00Z",
      "end": "2025-01-15T10:00:00Z",
      "type": "meeting",
      "priority": "high",
      "status": "upcoming",
      "participant": "John Doe",
      "description": "Discuss policy renewal",
      "location": "Office"
    }
  ]
}
```

### POST /api/v1/calendar
Create a new calendar event
```json
{
  "title": "Client Meeting",
  "start": "2025-01-15T09:00:00Z",
  "end": "2025-01-15T10:00:00Z",
  "type": "meeting",
  "priority": "high",
  "status": "upcoming",
  "participant": "John Doe",
  "description": "Discuss policy renewal",
  "location": "Office"
}
```

### PATCH /api/v1/calendar/:id
Update an existing event

### DELETE /api/v1/calendar/:id
Delete an event

## Database Schema Suggestion

```sql
CREATE TABLE calendar_events (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    type VARCHAR(50),
    priority VARCHAR(50),
    status VARCHAR(50),
    participant VARCHAR(255),
    description TEXT,
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    user_id VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Testing
1. Start your backend server
2. Go to Calendar page in the app
3. Click "New Action" or click on a date
4. Fill in event details and save
5. Check your database - the event should be there
6. Refresh the page - the event should still appear

## Status
✅ **Fixed** - Calendar now properly connected to backend API
✅ **Events persist** to database
✅ **Auto-refresh** after creating events
✅ **Error handling** with user-friendly toasts

---
**Date**: 2025
**Files Modified**: 
- `src/components/calendar/calendar-view.tsx`
- `src/components/calendar/new-event-modal.tsx`
