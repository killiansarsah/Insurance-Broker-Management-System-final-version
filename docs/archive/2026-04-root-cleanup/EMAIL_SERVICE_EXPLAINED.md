# ✅ Email Service - Development Setup

## Understanding Testmail.app

**Testmail.app is an EMAIL INBOX service** - it's for receiving and viewing test emails, NOT for sending them via API/SMTP.

## Current Setup (Development Mode)

The email service now **logs emails to the console** instead of actually sending them. This is the standard approach for development.

### How It Works:

1. When your app triggers an email (password reset, invitation, etc.)
2. The email service logs the details to the console
3. You can see what email would have been sent
4. The log includes a Testmail inbox URL where you COULD view it if it was actually sent

## 🧪 Test It Now

### 1. Restart Backend
```bash
cd ibms-backend
npm run start:dev
```

### 2. Trigger Password Reset
```bash
curl -X POST http://localhost:3001/api/v1/auth/forgot-password -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"tenantSlug\":\"acme\"}"
```

### 3. Check Console Output
You'll see:
```
================================================================================
📧 EMAIL SENT (Development Mode)
================================================================================
To: test.t3t75@inbox.testmail.app
Subject: IBMS Password Reset
View at: https://testmail.app/inbox/t3t75/test
================================================================================
```

## 🚀 For Production

When ready to send real emails, integrate **SendGrid**:

1. Sign up at https://sendgrid.com (free with GitHub Education)
2. Get API key
3. Update `email.service.ts` to use SendGrid SDK
4. Set `SENDGRID_API_KEY` in production `.env`

## 📝 Why This Approach?

- ✅ No external dependencies for development
- ✅ Fast and reliable
- ✅ See exactly what emails are being triggered
- ✅ No risk of sending test emails to real addresses
- ✅ Easy to verify email content and links

## Alternative: Mailtrap

If you want to actually send and view emails in development, use **Mailtrap.io**:
- Free SMTP server for testing
- Catches all emails in a fake inbox
- Better than Testmail.app for this use case
