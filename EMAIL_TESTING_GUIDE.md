# 📧 Email Testing Guide - IBMS

## ✅ Setup Complete

Testmail.app is configured and ready to test!

## 🧪 Test 1: Password Reset Email

### Step 1: Trigger the email
```bash
curl -X POST http://localhost:3001/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","tenantSlug":"acme"}'
```

### Step 2: Check backend logs
Look for output like:
```
[EmailService] Email sent to test.t3t75@inbox.testmail.app: IBMS Password Reset
[EmailService] View at: https://testmail.app/inbox/t3t75/test
```

### Step 3: View the email
Open: **https://testmail.app/inbox/t3t75/test**

You should see:
- Subject: "IBMS Password Reset"
- A reset password button/link
- Expiry notice (1 hour)

---

## 🧪 Test 2: User Invitation Email

### Check invitations endpoint
```bash
# First, login to get access token
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","tenantSlug":"acme"}'

# Use the accessToken from response
curl -X POST http://localhost:3001/api/v1/invitations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"email":"invited@example.com","role":"BROKER"}'
```

### View the email
Open: **https://testmail.app/inbox/t3t75/invited**

---

## 📊 What to Verify

### ✅ Email Delivery
- [ ] Email appears in Testmail inbox
- [ ] Subject line is correct
- [ ] HTML formatting looks good
- [ ] Links are properly formatted

### ✅ Backend Logs
- [ ] "Email sent to..." message appears
- [ ] No error messages
- [ ] Correct Testmail URL is logged

### ✅ Email Content
- [ ] Reset/invite link is present
- [ ] Link contains valid token
- [ ] Expiry time is mentioned
- [ ] Branding looks professional

---

## 🔍 Troubleshooting

### Email not appearing?
1. Check backend logs for errors
2. Verify TESTMAIL_API_KEY and TESTMAIL_NAMESPACE in `.env`
3. Ensure backend server is running
4. Check Testmail dashboard: https://testmail.app/

### Backend errors?
```bash
# Restart backend
cd ibms-backend
npm run start:dev
```

### Wrong inbox?
The inbox tag is the part before `@` in the email:
- `test@example.com` → inbox tag is `test`
- View at: `https://testmail.app/inbox/t3t75/test`

---

## 📝 Test Results

Record your test results:

**Password Reset Email:**
- [ ] Email sent successfully
- [ ] Visible in Testmail inbox
- [ ] Reset link works
- [ ] Token is valid

**Invitation Email:**
- [ ] Email sent successfully
- [ ] Visible in Testmail inbox
- [ ] Invitation link works
- [ ] Token is valid

---

## 🎯 Next Steps

Once testing is complete:
1. ✅ Password reset emails working
2. ✅ Invitation emails working
3. 🔜 Add more email templates (policy renewals, claims, etc.)
4. 🔜 Switch to SendGrid for production
