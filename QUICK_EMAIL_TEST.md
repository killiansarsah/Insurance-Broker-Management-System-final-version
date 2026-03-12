# 🧪 Quick Email Test

## ✅ Setup Complete - SMTP Method

The email service now uses Testmail.app's SMTP server.

## 🚀 Test Now

### 1. Restart your backend server
```bash
# Stop the current server (Ctrl+C)
# Then restart:
cd ibms-backend
npm run start:dev
```

### 2. Trigger password reset email
```bash
curl -X POST http://localhost:3001/api/v1/auth/forgot-password -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"tenantSlug\":\"acme\"}"
```

### 3. Check backend logs
Look for:
```
[EmailService] Testmail.app email client initialized
[EmailService] Email sent to test.t3t75@inbox.testmail.app: IBMS Password Reset
[EmailService] View at: https://testmail.app/inbox/t3t75/test
```

### 4. View the email
Open: **https://testmail.app/inbox/t3t75/test**

## 📝 Test Credentials
- Email: `test@example.com`
- Password: `password123`
- Tenant: `acme`

## ⚠️ Important
Make sure to **restart the backend** to load the new email service code!
