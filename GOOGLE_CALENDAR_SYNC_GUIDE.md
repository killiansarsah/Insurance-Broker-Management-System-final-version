# Google Calendar Sync - Troubleshooting Guide

## Issue: Google Calendar Events Not Showing in IBMS

### Root Cause Identified

The calendar events query had an overly restrictive date filter that was excluding events. The backend was filtering for events where BOTH:
- `startDate >= fromDate` AND
- `endDate <= toDate`

This meant only events that started AND ended within the exact date range were shown, missing:
- Events that started before the range but ended within it
- Events that started within the range but ended after it
- Events that spanned the entire range

### Fix Applied

Updated `calendar.service.ts` to use a proper overlapping date range query that includes events if they:
1. Start within the range, OR
2. End within the range, OR
3. Span the entire range

## How to Verify the Fix

### Step 1: Check Google Calendar Connection

1. Navigate to `/dashboard/calendar`
2. Check if the "Connect" button shows "Linked" status
3. If not connected, click "Connect" and authorize Google Calendar access

### Step 2: Sync Google Calendar

1. Click the "Sync" button in the calendar page
2. Wait for the sync to complete (you should see a success toast)
3. The sync performs two operations:
   - **Push**: Sends IBMS events to Google Calendar
   - **Pull**: Imports Google Calendar events to IBMS

### Step 3: Verify Events Are Pulled

After syncing, check:
1. The calendar view should show events from your Google Calendar
2. Events should have proper titles, dates, and times
3. Events are categorized by type (POLICY, CLAIM, MEETING, etc.)

## Event Type Mapping

Google Calendar events are automatically categorized based on their title:

| Title Contains | IBMS Event Type |
|----------------|-----------------|
| "policy" or "renewal" | POLICY |
| "claim" | CLAIM |
| "team" or "standup" | TEAM |
| "compliance" or "audit" | COMPLIANCE |
| "payment" or "invoice" | PAYMENT |
| (default) | MEETING |

## Sync Details

### Pull Configuration
- **Time Range**: Last 30 days to 90 days ahead
- **Max Events**: 500 events per sync
- **Behavior**: 
  - Creates new IBMS events for Google events not yet imported
  - Updates existing IBMS events if they changed in Google
  - Adds you as an attendee to imported events

### Push Configuration
- **Max Events**: 200 events per push
- **Behavior**:
  - Creates new Google events for IBMS events without `googleEventId`
  - Updates existing Google events if IBMS event changed
  - Excludes cancelled events

## Common Issues & Solutions

### Issue 1: "401 Unauthorized" Error

**Cause**: Not logged in or session expired

**Solution**:
1. Log out and log back in
2. Ensure you have TENANT_ADMIN or ADMIN role
3. Check that the backend is running on port 3001

### Issue 2: "Please connect your Google Calendar first"

**Cause**: Google Calendar integration not connected

**Solution**:
1. Click the "Connect" button
2. Authorize Google Calendar access in the popup
3. Wait for the popup to close automatically
4. The status should change to "Linked"

### Issue 3: Events Not Showing After Sync

**Cause**: Date range filter or authentication issue

**Solution**:
1. Check the browser console for errors
2. Verify the date range in the URL query params
3. Try refreshing the page
4. Check if events exist in the database:
   ```sql
   SELECT * FROM calendar_events WHERE "tenantId" = 'your-tenant-id';
   ```

### Issue 4: Sync Button Shows "Syncing" Forever

**Cause**: Backend error or network timeout

**Solution**:
1. Check the backend logs for errors
2. Verify Google OAuth credentials are configured
3. Check that the Google Calendar API is enabled in Google Cloud Console
4. Ensure the OAuth token hasn't expired

## Backend Configuration Required

Ensure these environment variables are set in the backend:

```env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3001/api/v1/integrations/google/callback
```

## Database Schema

Events pulled from Google Calendar are stored with:
- `googleEventId`: The Google Calendar event ID (for sync tracking)
- `tenantId`: Your tenant ID
- `createdById`: The user who performed the sync
- `type`: Auto-categorized based on event title
- `status`: Default is 'SCHEDULED'

## API Endpoints

### Sync Endpoints
- `POST /api/v1/integrations/google-calendar/sync` - Full bi-directional sync
- `POST /api/v1/integrations/google-calendar/push` - Push IBMS → Google
- `POST /api/v1/integrations/google-calendar/pull` - Pull Google → IBMS

### Calendar Endpoints
- `GET /api/v1/calendar/events?from=YYYY-MM-DD&to=YYYY-MM-DD` - Get events
- `POST /api/v1/calendar/events` - Create event
- `PATCH /api/v1/calendar/events/:id` - Update event
- `DELETE /api/v1/calendar/events/:id` - Delete event (marks as CANCELLED)

## Testing the Fix

1. **Create a test event in Google Calendar** with a title like "Test Policy Meeting"
2. **In IBMS**, click "Sync" button
3. **Verify** the event appears in the calendar view
4. **Check** that it's categorized as "POLICY" type (blue color)
5. **Create an event in IBMS** and sync again
6. **Verify** it appears in your Google Calendar

## Next Steps

If events still don't appear after following this guide:

1. Check backend logs for detailed error messages
2. Verify the Google Calendar API quota hasn't been exceeded
3. Ensure the OAuth consent screen is properly configured
4. Check that the user has calendar access permissions
5. Verify the database connection and schema migrations are up to date
