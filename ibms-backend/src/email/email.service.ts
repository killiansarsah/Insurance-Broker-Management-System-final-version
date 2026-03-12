import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly namespace: string | undefined;

  constructor(private config: ConfigService) {
    this.namespace = this.config.get<string>('TESTMAIL_NAMESPACE');
    this.logger.log('Email service initialized (development mode - console logging)');
  }

  private get from(): string {
    return this.config.get<string>('EMAIL_FROM', 'IBMS <noreply@ibms.app>');
  }

  async sendInvite(email: string, rawToken: string, frontendUrl: string): Promise<void> {
    const inviteUrl = `${frontendUrl}/accept-invite?token=${rawToken}`;
    const subject = 'You have been invited to IBMS';
    const html = `
      <h2>Welcome to IBMS</h2>
      <p>You have been invited to join the Insurance Broker Management System.</p>
      <p><a href="${inviteUrl}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">Accept Invitation</a></p>
      <p>This link expires in 48 hours.</p>
      <p style="color:#6b7280;font-size:12px;">If you did not expect this invitation, please ignore this email.</p>
    `;

    await this.send(email, subject, html, inviteUrl);
  }

  async sendPolicyRenewalReminder(
    email: string,
    clientName: string,
    policyNumber: string,
    expiryDate: Date,
    daysUntilExpiry: number,
    premiumAmount: number,
    insuranceType: string,
  ): Promise<void> {
    const subject = `Policy Renewal Reminder: ${policyNumber} - ${daysUntilExpiry} Days Remaining`;
    const urgency = daysUntilExpiry <= 30 ? 'URGENT' : 'UPCOMING';
    const urgencyColor = daysUntilExpiry <= 30 ? '#dc2626' : '#f59e0b';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: ${urgencyColor}; color: white; padding: 16px; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0;">${urgency}: Policy Renewal Required</h2>
        </div>
        <div style="background: #f9fafb; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px; color: #111827;">Dear ${clientName},</p>
          <p style="color: #374151;">Your ${insuranceType} insurance policy is due for renewal.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${urgencyColor};">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Policy Number:</td>
                <td style="padding: 8px 0; color: #111827; font-weight: bold;">${policyNumber}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Expiry Date:</td>
                <td style="padding: 8px 0; color: #111827;">${expiryDate.toLocaleDateString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Days Remaining:</td>
                <td style="padding: 8px 0; color: ${urgencyColor}; font-weight: bold; font-size: 18px;">${daysUntilExpiry} days</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Premium Amount:</td>
                <td style="padding: 8px 0; color: #111827; font-weight: bold;">GHS ${premiumAmount.toLocaleString()}</td>
              </tr>
            </table>
          </div>

          <p style="color: #374151; margin: 20px 0;">To ensure continuous coverage, please contact your broker to renew your policy before the expiry date.</p>
          
          <div style="background: #fef3c7; border: 1px solid #fbbf24; padding: 12px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e; font-size: 14px;">
              <strong>⚠️ Important:</strong> Your coverage will cease on the expiry date if not renewed. Ensure timely renewal to avoid any gaps in protection.
            </p>
          </div>

          <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">Best regards,<br/>Your Insurance Broker Team</p>
        </div>
      </div>
    `;

    await this.send(email, subject, html);
  }

  async sendClaimStatusUpdate(
    email: string,
    clientName: string,
    claimNumber: string,
    oldStatus: string,
    newStatus: string,
    claimAmount: number,
    notes?: string,
  ): Promise<void> {
    const subject = `Claim Update: ${claimNumber} - Status Changed to ${newStatus}`;
    const statusColor = newStatus === 'APPROVED' ? '#10b981' : newStatus === 'REJECTED' ? '#ef4444' : '#3b82f6';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: ${statusColor}; color: white; padding: 16px; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0;">Claim Status Update</h2>
        </div>
        <div style="background: #f9fafb; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px; color: #111827;">Dear ${clientName},</p>
          <p style="color: #374151;">Your insurance claim status has been updated.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${statusColor};">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Claim Number:</td>
                <td style="padding: 8px 0; color: #111827; font-weight: bold;">${claimNumber}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Previous Status:</td>
                <td style="padding: 8px 0; color: #6b7280;">${oldStatus}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">New Status:</td>
                <td style="padding: 8px 0; color: ${statusColor}; font-weight: bold; font-size: 18px;">${newStatus}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Claim Amount:</td>
                <td style="padding: 8px 0; color: #111827; font-weight: bold;">GHS ${claimAmount.toLocaleString()}</td>
              </tr>
            </table>
          </div>

          ${notes ? `<div style="background: #eff6ff; border: 1px solid #3b82f6; padding: 12px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; color: #1e40af; font-size: 14px;"><strong>Notes:</strong> ${notes}</p>
          </div>` : ''}

          <p style="color: #374151; margin: 20px 0;">If you have any questions about your claim, please contact your broker or claims department.</p>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">Best regards,<br/>Claims Department</p>
        </div>
      </div>
    `;

    await this.send(email, subject, html);
  }

  async sendTaskAssignment(
    email: string,
    assigneeName: string,
    taskTitle: string,
    taskDescription: string,
    dueDate: Date,
    priority: string,
    assignedBy: string,
  ): Promise<void> {
    const subject = `New Task Assigned: ${taskTitle}`;
    const priorityColor = priority === 'HIGH' ? '#dc2626' : priority === 'MEDIUM' ? '#f59e0b' : '#10b981';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #2563eb; color: white; padding: 16px; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0;">📋 New Task Assignment</h2>
        </div>
        <div style="background: #f9fafb; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px; color: #111827;">Hi ${assigneeName},</p>
          <p style="color: #374151;">You have been assigned a new task by ${assignedBy}.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${priorityColor};">
            <h3 style="margin: 0 0 12px 0; color: #111827;">${taskTitle}</h3>
            <p style="color: #6b7280; margin: 12px 0;">${taskDescription}</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Priority:</td>
                <td style="padding: 8px 0; color: ${priorityColor}; font-weight: bold;">${priority}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Due Date:</td>
                <td style="padding: 8px 0; color: #111827;">${dueDate.toLocaleDateString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Assigned By:</td>
                <td style="padding: 8px 0; color: #111827;">${assignedBy}</td>
              </tr>
            </table>
          </div>

          <p style="color: #374151; margin: 20px 0;">Please log in to the IBMS dashboard to view full task details and update progress.</p>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">Best regards,<br/>IBMS Team</p>
        </div>
      </div>
    `;

    await this.send(email, subject, html);
  }

  async sendWelcomeEmail(
    email: string,
    clientName: string,
    brokerName: string,
    brokerEmail: string,
    brokerPhone: string,
  ): Promise<void> {
    const subject = 'Welcome to Our Insurance Services';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #10b981; color: white; padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">🎉 Welcome!</h1>
        </div>
        <div style="background: #f9fafb; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px; color: #111827;">Dear ${clientName},</p>
          <p style="color: #374151; line-height: 1.6;">Welcome to our insurance family! We're thrilled to have you as our client and look forward to protecting what matters most to you.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
            <h3 style="margin: 0 0 16px 0; color: #111827;">Your Dedicated Broker</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Name:</td>
                <td style="padding: 8px 0; color: #111827; font-weight: bold;">${brokerName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Email:</td>
                <td style="padding: 8px 0; color: #2563eb;"><a href="mailto:${brokerEmail}" style="color: #2563eb; text-decoration: none;">${brokerEmail}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Phone:</td>
                <td style="padding: 8px 0; color: #111827;">${brokerPhone}</td>
              </tr>
            </table>
          </div>

          <div style="background: #eff6ff; border: 1px solid #3b82f6; padding: 16px; border-radius: 6px; margin: 20px 0;">
            <h4 style="margin: 0 0 8px 0; color: #1e40af;">What's Next?</h4>
            <ul style="margin: 8px 0; padding-left: 20px; color: #1e40af;">
              <li style="margin: 6px 0;">Review your policy documents</li>
              <li style="margin: 6px 0;">Save your broker's contact information</li>
              <li style="margin: 6px 0;">Reach out with any questions</li>
            </ul>
          </div>

          <p style="color: #374151; margin: 20px 0;">We're here to support you every step of the way. Don't hesitate to reach out if you need anything!</p>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">Warm regards,<br/>Your Insurance Team</p>
        </div>
      </div>
    `;

    await this.send(email, subject, html);
  }

  async sendPasswordReset(email: string, rawToken: string, frontendUrl: string): Promise<void> {
    const resetUrl = `${frontendUrl}/reset-password?token=${rawToken}`;
    const subject = 'IBMS Password Reset';
    const html = `
      <h2>Password Reset</h2>
      <p>A password reset was requested for your account.</p>
      <p><a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">Reset Password</a></p>
      <p>This link expires in 1 hour. If you did not request this, you can safely ignore this email.</p>
    `;

    await this.send(email, subject, html, resetUrl);
  }

  private async send(to: string, subject: string, html: string, resetUrl?: string): Promise<void> {
    const tag = to.split('@')[0];
    const testmailAddress = `${tag}.${this.namespace}@inbox.testmail.app`;
    
    this.logger.log('\n' + '='.repeat(80));
    this.logger.log('📧 EMAIL SENT (Development Mode)');
    this.logger.log('='.repeat(80));
    this.logger.log(`To: ${testmailAddress}`);
    this.logger.log(`Subject: ${subject}`);
    if (resetUrl) {
      this.logger.log(`Reset URL: ${resetUrl}`);
    }
    this.logger.log(`View at: https://testmail.app/inbox/${this.namespace}/${tag}`);
    this.logger.log('='.repeat(80) + '\n');
    
    // In development, just log the email
    // For production, integrate with SendGrid or similar
  }
}
