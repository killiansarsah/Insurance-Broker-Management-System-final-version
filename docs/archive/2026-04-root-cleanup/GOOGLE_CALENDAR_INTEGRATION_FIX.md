# Google Calendar Integration - Complete Workflow Fix

## Issues Fixed

### 1. **401 Unauthorized Error on OAuth Callback**
**Problem:** The `/api/v1/integrations/google/callback` endpoint was returning 401 because the global `JwtAuthGuard` was blocking unauthenticated requests from Google's OAuth redirect.

**Solution:** Added `@Public()` decorator to the callback endpoint to bypass JWT authentication.

**File:** `ibms-backend/src/integrations/google/google-oauth.controller.ts`
```typescript
@Get('callback')
@Public()  // Added this decorator
async handleCallback(...)
```

### 2. **Wrong Redirect URL (404 Page Not Found)**
**Problem:** After successful OAuth, the backend was redirecting to `/settings?tab=integrations` which doesn't exist in the frontend routing.

**Solution:** Updated redirect URLs to point to `/dashboard/integrations` which is the actual integrations page.

**File:** `ibms-backend/src/integrations/google/google-oauth.controller.ts`
- Changed: `/settings?tab=integrations` → `/dashboard/integrations`

### 3. **Mock Sync Instead of Real API Integration**
**Problem:** The calendar page had placeholder/mock sync functionality instead of using the real Google Calendar sync API.

**Solution:** Replaced mock implementation with real API calls using the existing hooks.

**File:** `src/app/dashboard/calendar/page.tsx`
- Integrated `useGoogleCalendarSync()` hook
- Integrated `useGoogleAuthUrl()` hook
- Added real connection status check from integrations API
- Removed mock state management

### 4. **No Automatic Initial Sync After Connection**
**Problem:** After connecting Google Calendar via OAuth, users had to manually trigger the first sync to see their events.

**Solution:** Added automatic initial sync trigger after successful OAuth callback.

**File:** `src/components/features/settings/settings-integrations.tsx`
- Added `useSearchParams()` to detect OAuth callback
- Added `useEffect` to handle success/error callbacks
- Automatically triggers `calendarSync.mutate()` after successful connection
- Shows appropriate toast notifications

## Complete Workflow (Now Working)

### 1. **Connection Flow**
```
User clicks "Connect" → 
Backend generates OAuth URL → 
Popup opens Google consent screen → 
User authorizes → 
Google redirects to /api/v1/integrations/google/callback → 
Backend exchanges code for tokens → 
Backend stores credentials in database → 
Backend redirects to /dashboard/integrations?google=success&email=user@gmail.com → 
Frontend detects success parameter → 
Frontend automatically triggers initial sync → 
Events are pulled from Google Calendar into IBMS database
```

### 2. **Sync Flow**
```
Manual Sync:
User clicks "Sync" button → 
Frontend calls /api/v1/integrations/google-calendar/sync → 
Backend performs bi-directional sync:
  - Push: IBMS events → Google Calendar
  - Pull: Google Calendar events → IBMS database → 
Frontend invalidates calendar query → 
Calendar view refreshes with updated events

Automatic Sync (Scheduled):
Cron job runs based on syncFrequency setting → 
GoogleSyncSchedulerService triggers sync → 
Same bi-directional sync process → 
Events stay synchronized
```

### 3. **Event Display Flow**
```
User opens Calendar page → 
Frontend calls /api/v1/calendar/events → 
Backend returns all events from IBMS database (including Google events) → 
Calendar view displays events → 
Events with googleEventId are synced with Google Calendar
```

## Key Components

### Backend
- **GoogleOAuthController**: Handles OAuth flow and callback
- **GoogleOAuthService**: Manages OAuth tokens and authentication
- **GoogleCalendarService**: Handles bi-directional sync (push/pull)
- **GoogleSyncSchedulerService**: Automatic scheduled syncing
- **CalendarController**: CRUD operations for calendar events

### Frontend
- **Calendar Page** (`src/app/dashboard/calendar/page.tsx`): Main calendar view with sync controls
- **Integrations Page** (`src/app/dashboard/integrations/page.tsx`): Connection management
- **SettingsIntegrations Component**: OAuth flow and sync configuration
- **useGoogleCalendarSync Hook**: API calls for calendar sync
- **useCalendarEvents Hook**: Fetches events from IBMS database

## Sync Frequency Options
- **15 minutes**: Real-time sync for active users
- **1 hour**: Default for most users
- **6 hours**: Light sync for less active calendars
- **24 hours**: Daily sync for minimal overhead
- **Manual**: User-triggered only

## Database Schema
```prisma
model Integration {
  id              String   @id @default(cuid())
  tenantId        String
  serviceKey      String   // 'google-calendar', 'google-sheets', 'google-drive'
  connected       Boolean  @default(false)
  connectedAt     DateTime?
  connectedEmail  String?
  lastSyncAt      DateTime?
  syncFrequency   String?  // '15m', '1h', '6h', '24h', 'manual'
  credentials     Json?    // Encrypted OAuth tokens
  syncEvents      Json?    // Activity log
  @@unique([tenantId, serviceKey])
}

model CalendarEvent {
  id            String   @id @default(cuid())
  tenantId      String
  title         String
  description   String?
  startDate     DateTime
  endDate       DateTime
  type          CalendarEventType
  location      String?
  googleEventId String?  // Links to Google Calendar event
  createdById   String
  // ... other fields
}
```

## Testing the Integration

### 1. Connect Google Calendar
1. Go to `/dashboard/integrations`
2. Click "Connect" on Google Calendar card
3. Authorize in popup window
4. Verify success toast and automatic initial sync

### 2. Verify Events Sync
1. Go to `/dashboard/calendar`
2. Check that "Linked" status shows
3. Click "Sync" to manually trigger sync
4. Verify events from Google Calendar appear

### 3. Test Bi-directional Sync
1. Create event in IBMS calendar
2. Click "Sync" - event should appear in Google Calendar
3. Create event in Google Calendar
4. Click "Sync" - event should appear in IBMS calendar

### 4. Check Automatic Sync
1. Set sync frequency in integrations settings
2. Wait for scheduled sync to run
3. Verify lastSyncAt timestamp updates
4. Check activity log for sync events

## Environment Variables Required
```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3001/api/v1/integrations/google/callback

# Frontend URL for OAuth redirects
FRONTEND_URL=http://localhost:3000
```

## Security Features
- OAuth 2.0 with refresh tokens
- Encrypted credential storage
- Tenant-isolated data
- Role-based access control (ADMIN, TENANT_ADMIN only)
- HTTPS required in production

## Future Enhancements
- [ ] Webhook support for real-time Google Calendar updates
- [ ] Selective calendar sync (choose which calendars to sync)
- [ ] Conflict resolution UI for duplicate events
- [ ] Sync status dashboard with detailed logs
- [ ] Bulk event operations (import/export)
