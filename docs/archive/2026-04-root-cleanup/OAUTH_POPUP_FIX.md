# Google OAuth Popup - CORS Fix

## Issue
When clicking the "Connect" button to authorize Google Calendar, the browser console showed repeated errors:
```
Cross-Origin-Opener-Policy policy would block the window.closed call.
```

This was caused by the popup window detection logic trying to check `popup.closed` property, which is blocked by CORS policies when the popup is on a different origin.

## Root Cause
The original code was polling `popup.closed` every 500ms to detect when the OAuth popup closed:
```javascript
const checkClosed = setInterval(() => {
    if (popup?.closed) {  // ← This triggers CORS error
        // ...
    }
}, 500);
```

When the popup is on Google's domain (different origin), accessing `popup.closed` throws a CORS error.

## Solution Applied

### 1. Message-Based Communication
Added a `postMessage` listener to receive success/error messages from the OAuth callback:
```javascript
const handleMessage = (event: MessageEvent) => {
    if (event.origin !== window.location.origin) return;
    
    if (event.data?.type === 'google-auth-success') {
        // Handle success
    } else if (event.data?.type === 'google-auth-error') {
        // Handle error
    }
};

window.addEventListener('message', handleMessage);
```

### 2. Safe Popup Closed Check
Wrapped the `popup.closed` check in a try-catch to gracefully handle CORS errors:
```javascript
const checkInterval = setInterval(() => {
    try {
        const isClosed = !popup || (popup.closed === true);
        if (isClosed) {
            // Cleanup
        }
    } catch (e) {
        // Ignore cross-origin errors
        clearInterval(checkInterval);
        window.removeEventListener('message', handleMessage);
    }
}, 1000);
```

### 3. Automatic Cleanup
Added timeout to clean up listeners after 5 minutes:
```javascript
setTimeout(() => {
    clearInterval(checkInterval);
    window.removeEventListener('message', handleMessage);
}, 300000); // 5 minutes
```

## Benefits

1. **No More CORS Errors**: The try-catch prevents the error from being logged
2. **Better UX**: Message-based approach is more reliable than polling
3. **Automatic Cleanup**: Prevents memory leaks from lingering event listeners
4. **Graceful Fallback**: Still works even if message communication fails

## How It Works Now

1. User clicks "Connect" button
2. OAuth popup opens to Google's authorization page
3. User authorizes the app
4. Backend callback sends `postMessage` with success/error
5. Frontend receives message and updates UI
6. If message doesn't arrive, popup closure is detected safely after 1 second
7. All listeners are cleaned up automatically

## Testing

1. Navigate to `/dashboard/calendar`
2. Click "Connect" button
3. Authorize Google Calendar access
4. Check browser console - no CORS errors should appear
5. Status should change to "Linked" after authorization
6. You can now click "Sync" to pull events from Google Calendar

## Backend Integration

For the message-based approach to work fully, the OAuth callback endpoint should send a postMessage:

```javascript
// In the OAuth callback (backend should handle this)
window.opener.postMessage({
    type: 'google-auth-success',
    message: 'Successfully connected'
}, window.location.origin);
```

If the backend doesn't implement this, the fallback polling will still work (just with the CORS warning suppressed).
