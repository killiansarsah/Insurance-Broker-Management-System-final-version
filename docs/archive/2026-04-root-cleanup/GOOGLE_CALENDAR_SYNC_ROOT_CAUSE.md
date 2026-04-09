# Google Calendar Sync - Root Cause Analysis & Fix

## Problem Summary
Google Calendar events are not appearing in the IBMS calendar even after:
1. Connecting Google Calendar (OAuth successful)
2. Clicking the Sync button
3. Logging out and back in

## Root Causes Identified

### Issue #1: Sync Endpoint Not Calling Google Calendar Service
**Location**: `ibms-backend/src/integrations/integrations.service.ts` - `recordSync()` method

**Problem**: 
The `recordSync()` method is just recording a FAKE sync event with random data. It's NOT actually calling the Google Calendar service to pull events.

```typescript
// Current implementation (WRONG)
async recordSync(tenantId: string, serviceKey: string) {
    // ... 
    const count = Math.floor(Math.random() * 50) + 5; // FAKE DATA!
    const syncEvent = {
        id: `evt-${Date.now()}`,
        type: 'sync',
        message: `Synced ${count} records successfully`, // FAKE MESSAGE!
        timestamp: now.toISOString(),
        count,
    };
    // Just updates the integration record, doesn't actually sync!
}
```

### Issue #2: Frontend Calling Wrong Endpoint
**Location**: `src/hooks/api/use-google-integration.ts`

**Problem**:
The frontend calls `/integrations/google-calendar/sync` which is correct, but the backend's `IntegrationsController` doesn't have a sync endpoint. The sync endpoint exists in `GoogleCalendarController` but it's not being called.

**Current Flow**:
```
Frontend: POST /integrations/google-calendar/sync
  ↓
Backend: IntegrationsController.sync() 
  ↓
IntegrationsService.recordSync() 
  ↓
❌ STOPS HERE - Just records fake event, doesn't pull from Google
```

**Should Be**:
```
Frontend: POST /integrations/google-calendar/sync
  ↓
Backend: GoogleCalendarController.sync()
  ↓
GoogleCalendarService.syncAll()
  ↓
✅ Pulls events from Google Calendar
✅ Stores them in IBMS database
```

### Issue #3: Calendar Query Filters Events by User
**Location**: `ibms-backend/src/calendar/calendar.service.ts` - `findAll()` method

**Problem**:
The calendar query filters events to only show those where:
- User is the creator (`createdById: userId`), OR
- User is an attendee (`attendees: { some: { userId } }`)

When Google Calendar events are pulled, they're created with `createdById: userId` (the user who performed the sync), but the current user might be different. This causes events to not appear for other users.

## Solution

### Fix #1: Update IntegrationsController to Route to GoogleCalendarController

The sync endpoint should be handled by GoogleCalendarController, not IntegrationsController.

**File**: `ibms-backend/src/integrations/integrations.controller.ts`

Replace the sync method to delegate to GoogleCalendarService:

```typescript
@Post(':serviceKey/sync')
@Roles('ADMIN', 'TENANT_ADMIN')
async sync(@Request() req: RequestWithUser, @Param('serviceKey') serviceKey: string) {
    // Only handle google-calendar sync here
    if (serviceKey === 'google-calendar') {
        // Delegate to GoogleCalendarService
        return this.googleCalendarService.syncAll(req.user.tenantId, req.user.sub);
    }
    
    // For other services, just record the sync event
    return this.service.recordSync(req.user.tenantId, serviceKey);
}
```

But this requires injecting GoogleCalendarService. Better approach: Keep the endpoint in GoogleCalendarController.

### Fix #2: Ensure GoogleCalendarController Sync Endpoint is Accessible

**File**: `ibms-backend/src/integrations/google/google-calendar.controller.ts`

The sync endpoint already exists and is correct:

```typescript
@Post('sync')
@Roles('ADMIN', 'TENANT_ADMIN')
sync(@Request() req: RequestWithUser) {
    return this.calendarService.syncAll(req.user.tenantId, req.user.sub);
}
```

**Issue**: The frontend is calling `/integrations/google-calendar/sync` but the controller is at `@Controller('integrations/google-calendar')`, so the route should be correct.

**Verify**: The route should be: `POST /api/v1/integrations/google-calendar/sync`

### Fix #3: Update Calendar Query to Include All Tenant Events

**File**: `ibms-backend/src/calendar/calendar.service.ts` - `findAll()` method

The current query filters by user. For synced Google Calendar events to be visible to all users in the tenant, we need to include events that:
1. Are created by the current user, OR
2. The current user is an attendee of, OR
3. Are synced from Google Calendar (have `googleEventId`)

```typescript
// Updated query
return await this.prisma.calendarEvent.findMany({
    where: {
        tenantId,
        status: { not: 'CANCELLED' },
        OR: [
            {
                // Events that start within the range
                AND: [
                    { startDate: { gte: fromDate } },
                    { startDate: { lte: toDate } },
                ],
            },
            {
                // Events that end within the range
                AND: [
                    { endDate: { gte: fromDate } },
                    { endDate: { lte: toDate } },
                ],
            },
            {
                // Events that span the entire range
                AND: [
                    { startDate: { lte: fromDate } },
                    { endDate: { gte: toDate } },
                ],
            },
        ],
        AND: [
            {
                OR: [
                    { createdById: userId },
                    { attendees: { some: { userId } } },
                    { googleEventId: { not: null } }, // Include synced Google events
                ],
            },
        ],
    },
    // ... rest of query
});
```

## Implementation Steps

1. **Verify the sync endpoint is being called correctly**
   - Check that frontend calls: `POST /api/v1/integrations/google-calendar/sync`
   - Verify backend receives the request in GoogleCalendarController

2. **Test the Google Calendar pull**
   - Add logging to GoogleCalendarService.pullFromGoogle()
   - Verify events are being fetched from Google API
   - Check that events are being stored in database

3. **Update calendar query to show synced events**
   - Add `googleEventId: { not: null }` to the OR condition
   - This allows all users to see synced Google Calendar events

4. **Test end-to-end**
   - Connect Google Calendar
   - Create events in Google Calendar
   - Click Sync button
   - Verify events appear in IBMS calendar

## Testing Checklist

- [ ] Google Calendar connection successful (status shows "Linked")
- [ ] Sync button triggers without errors
- [ ] Backend logs show events being pulled from Google
- [ ] Database contains new calendar_events with googleEventId
- [ ] Calendar view displays the synced events
- [ ] Events are visible to all users in the tenant
- [ ] Event details (title, date, time) match Google Calendar

## Database Query to Verify

```sql
-- Check if events were synced
SELECT id, title, "startDate", "endDate", "googleEventId", "createdById" 
FROM calendar_events 
WHERE "tenantId" = 'your-tenant-id' 
AND "googleEventId" IS NOT NULL;

-- Check integration status
SELECT "serviceKey", connected, "connectedAt", "lastSyncAt" 
FROM integrations 
WHERE "tenantId" = 'your-tenant-id' 
AND "serviceKey" = 'google-calendar';
```

## Next Steps

1. Verify the sync endpoint routing is correct
2. Add comprehensive logging to GoogleCalendarService
3. Update calendar query to include synced events
4. Test with actual Google Calendar events
5. Monitor backend logs during sync process
