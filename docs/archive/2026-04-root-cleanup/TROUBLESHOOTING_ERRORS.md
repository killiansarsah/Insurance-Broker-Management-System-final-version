# Troubleshooting Current Errors

## Errors Fixed

### 1. TypeError: Cannot read properties of undefined (reading 'pushed')
**Status:** ✅ FIXED

**Problem:** The code was trying to access `result.push.pushed` without checking if the response exists.

**Solution:** Added null checks before accessing nested properties:
```typescript
if (result?.push && result?.pull) {
    toast.success(`Pushed ${result.push.pushed} events, pulled ${result.pull.pulled} events`);
} else {
    toast.success('Calendar synchronized!');
}
```

## Errors Remaining

### 2. 401 Unauthorized on `/api/v1/calendar/events` and `/api/v1/integrations`
**Status:** ⚠️ NEEDS ATTENTION

**Problem:** The frontend is making API calls but the user is not authenticated.

**Possible Causes:**
1. User is not logged in
2. JWT token is missing or expired
3. Auth store is not properly initialized

**Solution Steps:**

#### Step 1: Check if user is logged in
Open browser console and check:
```javascript
localStorage.getItem('auth-storage')
```

If null or empty, you need to log in first.

#### Step 2: Log in to the application
1. Go to `/login` page
2. Enter credentials
3. After successful login, JWT token should be stored

#### Step 3: Verify token is being sent
Check Network tab in DevTools:
- Look for `Authorization` header in requests
- Should be: `Authorization: Bearer <your-jwt-token>`

### 3. 500 Internal Server Error on `/api/v1/calendar/events`
**Status:** ⚠️ BACKEND ISSUE

**Problem:** The backend calendar endpoint is throwing an error.

**Possible Causes:**
1. Database connection issue
2. Missing calendar events table
3. Backend service not running properly
4. Error in calendar controller/service code

**Solution Steps:**

#### Step 1: Check backend logs
Look at the backend console for error messages when the request is made.

#### Step 2: Verify database schema
Make sure the `CalendarEvent` table exists:
```bash
cd ibms-backend
npx prisma db push
```

#### Step 3: Check backend is running
```bash
cd ibms-backend
npm run start:dev
```

Should see: `IBMS Backend running on port 3001`

#### Step 4: Test the endpoint directly
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3001/api/v1/calendar/events?from=2026-02-09&to=2026-04-10
```

## Quick Fix Checklist

- [ ] **Login first** - Go to `/login` and authenticate
- [ ] **Check backend is running** - Should be on port 3001
- [ ] **Check database** - Run `npx prisma db push` in backend folder
- [ ] **Clear browser cache** - Sometimes old tokens cause issues
- [ ] **Check environment variables** - Make sure `.env` file has correct values

## Environment Variables Required

### Backend (.env in ibms-backend folder)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/ibms"
JWT_SECRET="your-secret-key-here"
JWT_EXPIRES_IN="7d"
FRONTEND_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:3001/api/v1/integrations/google/callback"
```

### Frontend (.env.local in root folder)
```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

## Testing the Full Flow

### 1. Start Backend
```bash
cd ibms-backend
npm run start:dev
```

### 2. Start Frontend
```bash
cd ..
npm run dev
```

### 3. Login
- Go to http://localhost:3000/login
- Enter credentials
- Should redirect to dashboard

### 4. Test Calendar
- Go to http://localhost:3000/dashboard/calendar
- Should see calendar view (no 401 errors)

### 5. Connect Google Calendar
- Go to http://localhost:3000/dashboard/integrations
- Click "Connect" on Google Calendar
- Authorize in popup
- Should see success message and automatic sync

### 6. Verify Events
- Go back to calendar page
- Click "Sync" button
- Events from Google Calendar should appear

## Common Issues

### Issue: "Failed to load resource: 401 Unauthorized"
**Solution:** You're not logged in. Go to `/login` first.

### Issue: "Failed to load resource: 500 Internal Server Error"
**Solution:** Backend error. Check backend console logs for details.

### Issue: "Cannot read properties of undefined"
**Solution:** Already fixed in the code. Refresh the page.

### Issue: Google OAuth popup closes but nothing happens
**Solution:** 
1. Check backend logs for errors
2. Make sure `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set
3. Verify redirect URI matches in Google Console

### Issue: Events not syncing
**Solution:**
1. Make sure Google Calendar is connected (check integrations page)
2. Click "Sync" button manually
3. Check backend logs for sync errors
4. Verify Google OAuth tokens are valid

## Next Steps

1. **Login to the application** - This will fix the 401 errors
2. **Check backend logs** - This will help diagnose the 500 error
3. **Test the calendar endpoint** - Make sure it works when authenticated
4. **Connect Google Calendar** - Follow the integration flow
5. **Sync events** - Test the bi-directional sync

If issues persist after following these steps, check the backend logs for specific error messages and share them for further debugging.
