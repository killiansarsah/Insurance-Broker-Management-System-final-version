# Testmail.app Setup for IBMS

## ✅ Configuration Complete

Testmail.app has been successfully integrated into your IBMS backend for development email testing.

### Environment Variables Set
```
TESTMAIL_API_KEY=ea46a1ec-54a8-4232-ad35-1d688cc45ce8
TESTMAIL_NAMESPACE=t3t75
EMAIL_FROM=noreply@ibms.test
```

## 🧪 Testing Email Functionality

### 1. Password Reset Email Test

To test the email service, trigger a password reset:

**API Request:**
```bash
POST http://localhost:3001/api/v1/auth/forgot-password
Content-Type: application/json

{
  "email": "test@example.com",
  "tenantSlug": "your-tenant-slug"
}
```

### 2. View Sent Emails

All emails sent during development will appear in your Testmail inbox:

**Inbox URL Format:**
```
https://testmail.app/inbox/t3t75/{tag}
```

Where `{tag}` is the part before `@` in the recipient email address.

**Example:**
- Email sent to: `test@example.com`
- View at: `https://testmail.app/inbox/t3t75/test`

### 3. Check Backend Logs

When an email is sent, you'll see logs like:
```
[EmailService] Email sent to test.t3t75@inbox.testmail.app: IBMS Password Reset
[EmailService] View at: https://testmail.app/inbox/t3t75/test
```

## 📧 Available Email Templates

Currently implemented:
- ✅ **Password Reset** - `sendPasswordReset()`
- ✅ **User Invitation** - `sendInvite()`

## 🔄 How It Works

1. Your app calls `emailService.sendPasswordReset()` or `emailService.sendInvite()`
2. The service converts the recipient email to a Testmail address:
   - `user@example.com` → `user.t3t75@inbox.testmail.app`
3. Email is sent via Testmail API
4. You can view it at: `https://testmail.app/inbox/t3t75/user`

## 🚀 Next Steps

### For Production
When ready to deploy, switch to SendGrid:
1. Sign up at https://sendgrid.com with GitHub Education
2. Get your SendGrid API key
3. Update `.env`:
   ```
   SENDGRID_API_KEY=SG.your_key_here
   EMAIL_FROM=noreply@yourdomain.com
   ```
4. Update `email.service.ts` to use SendGrid SDK

### Additional Email Features to Implement
- Policy renewal reminders
- Claim status notifications
- Welcome emails for new clients
- Task assignment notifications
- Compliance alerts

## 📝 Notes

- Testmail is for **development only** - it doesn't send real emails
- Perfect for testing email flows without spamming real inboxes
- All emails are stored in your Testmail dashboard
- Free with GitHub Student Developer Pack
