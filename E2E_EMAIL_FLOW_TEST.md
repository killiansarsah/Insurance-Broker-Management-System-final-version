# 🧪 End-to-End Email Flow Test

## Complete User Journey Testing

### Test 1: Password Reset Flow ✅

**Step 1: User Forgets Password**
1. Open http://localhost:3000/login
2. Click "Forgot password?" link
3. Should navigate to `/forgot-password`

**Step 2: Request Reset**
1. Enter email: `test@example.com`
2. Click "Send Reset Link"
3. Should see success message: "Check your email"

**Step 3: Check Backend Logs**
Look for:
```
================================================================================
📧 EMAIL SENT (Development Mode)
================================================================================
To: test.t3t75@inbox.testmail.app
Subject: IBMS Password Reset
View at: https://testmail.app/inbox/t3t75/test
================================================================================
```

**Step 4: Get Reset Token**
Check database for the reset token:
```sql
SELECT token, email, "expiresAt" 
FROM "PasswordReset" 
WHERE email = 'test@example.com' 
ORDER BY "createdAt" DESC 
LIMIT 1;
```

**Step 5: Use Reset Link**
1. Navigate to: `http://localhost:3000/reset-password?token=YOUR_TOKEN_HERE`
2. Enter new password (min 8 chars, 1 uppercase, 1 number)
3. Confirm password
4. Click "Secure My Account"
5. Should see success message
6. Click "Continue to Login"

**Step 6: Login with New Password**
1. Should be at `/login`
2. Enter email: `test@example.com`
3. Enter your new password
4. Click "Sign Into Dashboard"
5. Should successfully login and redirect to `/dashboard`

---

### Test 2: User Invitation Flow ✅

**Prerequisites:**
- Need ADMIN user to send invitations
- Or use API directly

**Step 1: Send Invitation (via API)**
```bash
# Login as admin first
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123","tenantSlug":"acme"}'

# Use the accessToken from response
curl -X POST http://localhost:3001/api/v1/invitations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"email":"newuser@example.com","role":"BROKER"}'
```

**Step 2: Check Backend Logs**
Look for:
```
================================================================================
📧 EMAIL SENT (Development Mode)
================================================================================
To: newuser.t3t75@inbox.testmail.app
Subject: You have been invited to IBMS
View at: https://testmail.app/inbox/t3t75/newuser
================================================================================
```

**Step 3: Get Invitation Token**
Check database:
```sql
SELECT token, email, role, "expiresAt"
FROM "Invitation"
WHERE email = 'newuser@example.com'
ORDER BY "createdAt" DESC
LIMIT 1;
```

**Step 4: Accept Invitation**
1. Navigate to: `http://localhost:3000/accept-invite?token=YOUR_TOKEN_HERE`
2. Should see invitation details (organization name, role)
3. Fill in:
   - First Name: "New"
   - Last Name: "User"
   - Password: "Password123"
   - Confirm Password: "Password123"
4. Click "Accept & Create Account"
5. Should automatically login and redirect to `/dashboard`

---

## 🎯 Quick Test Commands

### Test Password Reset Email
```bash
curl -X POST http://localhost:3001/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","tenantSlug":"acme"}'
```

### Get Latest Reset Token (PostgreSQL)
```sql
SELECT 
  token,
  email,
  "expiresAt",
  "createdAt"
FROM "PasswordReset"
WHERE email = 'test@example.com'
  AND "usedAt" IS NULL
  AND "expiresAt" > NOW()
ORDER BY "createdAt" DESC
LIMIT 1;
```

### Test Reset Password
```bash
curl -X POST http://localhost:3001/api/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"YOUR_TOKEN_HERE","newPassword":"NewPassword123"}'
```

---

## ✅ Checklist

### Frontend Pages
- [ ] Login page loads
- [ ] "Forgot password?" link works
- [ ] Forgot password page loads
- [ ] Reset password page loads with token
- [ ] Accept invite page loads with token
- [ ] Success messages display correctly
- [ ] Error messages display correctly
- [ ] Navigation works between pages

### Backend API
- [ ] POST /auth/forgot-password returns 201
- [ ] POST /auth/reset-password returns 200
- [ ] POST /invitations/accept returns 200
- [ ] Email service logs to console
- [ ] Tokens stored in database
- [ ] Tokens expire correctly
- [ ] Used tokens can't be reused

### Email Service
- [ ] Email service initializes
- [ ] Password reset emails logged
- [ ] Invitation emails logged
- [ ] Testmail URLs generated correctly
- [ ] Email templates render properly

---

## 🐛 Troubleshooting

### "Invalid or missing reset token"
- Token may have expired (1 hour for password reset)
- Token may have been used already
- Check database for valid tokens

### "Reset failed. The link may have expired"
- Request a new password reset
- Check backend logs for errors

### "This invitation link is invalid"
- Invitation may have expired (48 hours)
- Invitation may have been accepted already
- Check database for valid invitations

### Email not logged in console
- Check backend is running
- Check TESTMAIL_NAMESPACE is set in .env
- Restart backend after .env changes

---

## 📊 Expected Results

All tests should pass with:
- ✅ Emails logged to console
- ✅ Tokens stored in database
- ✅ Frontend pages render correctly
- ✅ User can complete full flow
- ✅ Authentication works after reset/invite
- ✅ No errors in console or logs
