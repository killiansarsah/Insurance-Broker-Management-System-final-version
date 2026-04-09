# Google Calendar Sync - Implementation Guide

## Changes Made

### 1. Calendar Service Query Updated
**File**: `ibms-backend/src/calendar/calendar.service.ts`

**Change**: Added `{ googleEventId: { not: null } }` to the OR condition in the `findAll()` method.

**Before**:
```typescript
OR: [{ createdById: userId }, { attendees: { some: { userId } } }]
```

**After**:
```typescript
OR: [
  { createdById: userId },
  { attendees: { some: { userId } } },
  { googleEventId: { not: null } },
]
```

**Impact**: Now all users in the tenant can see synced Google Calendar events, not just the user who performed the sync.

## Why Google Events Weren't Showing

### Root Cause Chain:

1. **User connects Google Calendar** → OAuth successful, credentials stored
2. **User clicks Sync button** → Frontend calls `/integrations/google-calendar/sync`
3. **Backend receives sync request** → GoogleCalendarService.syncAll() is called
4. **Google Calendar events are pulled** → Events stored in database with `googleEventId`
5. **User views calendar** → Calendar query filters events
6. **❌ Events don't appear** → Query only shows events where user is creator or attendee
   - Synced events have `createdById` = user who synced (not current user)
   - Current user is not an attendee
   - Query doesn't include `googleEventId` condition

### The Fix:

By adding `{ googleEventId: { not: null } }` to the query, we now include all synced Google Calendar events regardless of who created them or who is an attendee.

## Verification Steps

### 1. Check Database
```sql
-- Verify events were synced
SELECT id, title, "startDate", "endDate", "googleEventId", "createdById" 
FROM calendar_events 
WHERE "tenantId" = 'your-tenant-id' 
AND "googleEventId" IS NOT NULL
LIMIT 10;

-- Check integration status
SELECT "serviceKey", connected, "connectedAt", "lastSyncAt", "connectedEmail"
FROM integrations 
WHERE "tenantId" = 'your-tenant-id' 
AND "serviceKey" = 'google-calendar';
```

### 2. Test the Flow

1. **Connect Google Calendar**
   - Navigate to `/dashboard/calendar`
   - Click "Connect" button
   - Authorize Google Calendar access
   - Status should show "Linked"

2. **Create events in Google Calendar**
   - Go to your Google Calendar
   - Create 2-3 test events with titles like:
     - "Test Policy Review"
     - "Test Claim Assessment"
     - "Test Team Meeting"

3. **Sync events**
   - Return to IBMS calendar
   - Click "Sync" button
   - Wait for success message
   - Check backend logs for sync activity

4. **Verify events appear**
   - Calendar should now display the synced events
   - Events should show correct titles, dates, and times
   - Events should be categorized by type (POLICY, CLAIM, TEAM, etc.)

### 3. Check Backend Logs

Look for logs like:
```
[GoogleCalendarService] Pull completed: X pulled, Y skipped, Z errors
[GoogleCalendarService] Synced event: "Test Policy Review"
```

## What Happens During Sync

### Pull Process (Google → IBMS):

1. Fetch events from Google Calendar (last 30 days to 90 days ahead)
2. For each event:
   - Check if already imported (by `googleEventId`)
   - If new: Create calendar event with `googleEventId`
   - If exists: Update event data
3. Add current user as attendee to imported events
4. Log sync event with count

### Push Process (IBMS → Google):

1. Fetch all non-cancelled IBMS events without `googleEventId`
2. For each event:
   - Create new Google Calendar event
   - Store returned `googleEventId` in IBMS
3. Log sync event with count

## Event Type Mapping

When events are pulled from Google Calendar, they're automatically categorized:

| Google Event Title Contains | IBMS Type |
|---------------------------|-----------|
| "policy" or "renewal" | POLICY |
| "claim" | CLAIM |
| "team" or "standup" | TEAM |
| "compliance" or "audit" | COMPLIANCE |
| "payment" or "invoice" | PAYMENT |
| (default) | MEETING |

## Troubleshooting

### Events Still Not Showing?

1. **Check integration is connected**
   ```sql
   SELECT connected, "connectedEmail" FROM integrations 
   WHERE "tenantId" = 'your-tenant-id' AND "serviceKey" = 'google-calendar';
   ```

2. **Check events were synced**
   ```sql
   SELECT COUNT(*) FROM calendar_events 
   WHERE "tenantId" = 'your-tenant-id' AND "googleEventId" IS NOT NULL;
   ```

3. **Check date range**
   - Calendar view shows events from 30 days ago to 90 days ahead
   - Ensure your Google Calendar events fall within this range

4. **Check backend logs**
   - Look for errors in GoogleCalendarService
   - Check if Google API credentials are valid
   - Verify OAuth token hasn't expired

### Sync Button Shows Error?

1. Verify Google Calendar is connected (status = "Linked")
2. Check backend is running on port 3001
3. Check network connectivity
4. Review backend error logs

### Events Appear But With Wrong Data?

1. Check event type mapping (title keywords)
2. Verify date/time conversion is correct
3. Check if event description is being pulled

## Performance Considerations

- Sync pulls up to 500 events per request
- Maximum date range is 90 days
- Synced events are cached for 5 minutes
- Rate limiting: 100 requests per minute

## Security Notes

- Google OAuth tokens are encrypted in database
- Tokens are automatically refreshed when expired
- Only TENANT_ADMIN and ADMIN roles can sync
- Each tenant has isolated credentials

## Next Steps

1. Restart the backend service to apply changes
2. Test the sync flow with actual Google Calendar events
3. Monitor backend logs during sync
4. Verify events appear in calendar view
5. Test with multiple users to ensure visibility

## Support

If events still don't appear after these steps:

1. Check backend logs for specific error messages
2. Verify Google Calendar API is enabled in Google Cloud Console
3. Confirm OAuth credentials are correctly configured
4. Check database for synced events
5. Review the root cause analysis document for additional details
