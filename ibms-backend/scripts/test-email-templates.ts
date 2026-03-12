import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { EmailService } from '../src/email/email.service';

async function testEmailTemplates() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const emailService = app.get(EmailService);

  console.log('🧪 Testing Email Templates\n');
  console.log('=' .repeat(80));

  // Test 1: Policy Renewal Reminder (30 days)
  console.log('\n1️⃣ Testing Policy Renewal Reminder (URGENT - 30 days)...\n');
  await emailService.sendPolicyRenewalReminder(
    'client@example.com',
    'John Doe',
    'POL-20260311-00001-ABC',
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    30,
    5000,
    'MOTOR',
  );

  // Test 2: Policy Renewal Reminder (90 days)
  console.log('\n2️⃣ Testing Policy Renewal Reminder (UPCOMING - 90 days)...\n');
  await emailService.sendPolicyRenewalReminder(
    'client@example.com',
    'ABC Corporation Ltd',
    'POL-20260311-00002-XYZ',
    new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    90,
    25000,
    'FIRE',
  );

  // Test 3: Claim Status Update (Approved)
  console.log('\n3️⃣ Testing Claim Status Update (APPROVED)...\n');
  await emailService.sendClaimStatusUpdate(
    'client@example.com',
    'Jane Smith',
    'CLM-2026-001',
    'UNDER_REVIEW',
    'APPROVED',
    15000,
    'Your claim has been approved. Payment will be processed within 5 business days.',
  );

  // Test 4: Claim Status Update (Rejected)
  console.log('\n4️⃣ Testing Claim Status Update (REJECTED)...\n');
  await emailService.sendClaimStatusUpdate(
    'client@example.com',
    'Bob Johnson',
    'CLM-2026-002',
    'UNDER_REVIEW',
    'REJECTED',
    8000,
    'Claim rejected due to policy exclusions. Please contact your broker for details.',
  );

  // Test 5: Task Assignment
  console.log('\n5️⃣ Testing Task Assignment...\n');
  await emailService.sendTaskAssignment(
    'broker@example.com',
    'Sarah Williams',
    'Follow up on Policy Renewal',
    'Contact client regarding upcoming policy renewal. Discuss coverage options and premium adjustments.',
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    'HIGH',
    'Michael Brown',
  );

  // Test 6: Welcome Email
  console.log('\n6️⃣ Testing Welcome Email...\n');
  await emailService.sendWelcomeEmail(
    'newclient@example.com',
    'David Thompson',
    'Sarah Williams',
    'sarah.williams@broker.com',
    '+233 24 123 4567',
  );

  console.log('\n' + '='.repeat(80));
  console.log('\n✅ All email templates tested successfully!');
  console.log('\n📧 Check your backend console for email logs.');
  console.log('📬 In production, these would be sent via SendGrid.\n');

  await app.close();
}

testEmailTemplates().catch((error) => {
  console.error('Error testing email templates:', error);
  process.exit(1);
});
