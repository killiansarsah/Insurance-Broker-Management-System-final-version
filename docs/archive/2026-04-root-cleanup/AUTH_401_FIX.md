# Authentication 401 Error - Quick Fix Guide

## Problem
You're getting `401 Unauthorized` errors on `/api/v1/settings/profile` and other endpoints.

## Root Cause
The JWT access token is not being properly sent with requests after page refresh.

## Solution Steps

### Step 1: Check if Backend is Running
```bash
cd ibms-backend
npm run start:dev
```

Ensure you see:
```
[Nest] INFO [NestApplication] Nest application successfully started
```

### Step 2: Clear Browser Storage
1. Open DevTools (F12)
2. Go to **Application** tab
3. Clear **Session Storage** under `localhost:3000`
4. Clear **Cookies** for `localhost:3001`
5. Refresh the page

### Step 3: Login Again
1. Navigate to `http://localhost:3000/login`
2. Enter credentials
3. Check the Network tab for the login request
4. Verify you receive an `accessToken` in the response

### Step 4: Verify Token is Being Sent
After login, check any API request in Network tab:
- Look for `Authorization` header
- Should be: `Bearer <your-token>`

## Quick Test

Run this in your browser console after logging in:

```javascript
// Check if token is set
console.log('Token:', window.sessionStorage.getItem('ibms-auth'));

// Test API call
fetch('http://localhost:3001/api/v1/settings/profile', {
  credentials: 'include',
  headers: {
    'Authorization': 'Bearer ' + JSON.parse(window.sessionStorage.getItem('ibms-auth') || '{}').state?.user?.token
  }
}).then(r => r.json()).then(console.log);
```

## Common Issues

### Issue 1: Token Not Persisted
**Symptom**: Works after login, fails after refresh

**Fix**: The token should be refreshed automatically. Check backend logs for refresh token errors.

### Issue 2: CORS Issues
**Symptom**: Network errors, CORS policy errors

**Fix**: Ensure backend `.env` has:
```env
CORS_ORIGINS=http://localhost:3000,http://localhost:3002
```

### Issue 3: Expired Refresh Token
**Symptom**: 401 on `/auth/refresh`

**Fix**: 
1. Logout completely
2. Clear all storage
3. Login again

## Backend Verification

Check if the settings endpoint is protected correctly:

```typescript
// ibms-backend/src/settings/settings.controller.ts
@Get('profile')
@Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'VIEWER')  // ✅ Should have this
getProfile(@Request() req: RequestWithUser) {
  return this.settingsService.getProfile(req.user.sub);
}
```

## Debug Mode

Add this to your `api-client.ts` temporarily:

```typescript
this.client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    console.log('🔑 Request:', config.url, 'Token:', this.accessToken ? 'Present' : 'Missing');
    if (this.accessToken) {
        config.headers.Authorization = `Bearer ${this.accessToken}`;
    }
    return config;
});
```

## Still Not Working?

1. **Check Backend Logs**: Look for JWT validation errors
2. **Verify Database**: Ensure refresh tokens exist in the database
3. **Check Token Expiry**: Default is 15 minutes for access tokens
4. **Restart Both Servers**: Sometimes a clean restart helps

## Manual Token Refresh Test

```bash
# Get your refresh token cookie from browser
curl -X POST http://localhost:3001/api/v1/auth/refresh \
  -H "Cookie: refreshToken=<your-refresh-token>" \
  --cookie-jar -
```

Should return:
```json
{
  "accessToken": "eyJhbGc...",
  "user": { ... }
}
```

## Prevention

To avoid this in the future:
1. Always use `withCredentials: true` for API calls
2. Store tokens securely (httpOnly cookies for refresh, memory for access)
3. Implement automatic token refresh before expiry
4. Handle 401 errors gracefully with re-authentication
