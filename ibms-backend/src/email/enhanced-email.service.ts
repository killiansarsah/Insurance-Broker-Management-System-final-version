import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { Resend } from 'resend';

interface EmailPreferences {
  policyRenewal: boolean;
  claimUpdates: boolean;
  taskAssignments: boolean;
  systemNotifications: boolean;
  marketingEmails: boolean;
}

@Injectable()
export class EnhancedEmailService {
  private readonly logger = new Logger(EnhancedEmailService.name);
  private readonly resend: Resend | null;

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    const apiKey = this.config.get<string>('RESEND_API_KEY');
    if (apiKey) {
      this.resend = new Resend(apiKey);
      this.logger.log('Enhanced Email service initialized with Resend');
    } else {
      this.resend = null;
      this.logger.warn('Enhanced Email service: no RESEND_API_KEY — console-log mode');
    }
  }

  private get from(): string {
    return this.config.get<string>('EMAIL_FROM', 'IBMS <onboarding@resend.dev>');
  }

  // Simplified email sending for now
  async queueEmail(
    tenantId: string,
    recipientEmail: string,
    subject: string,
    htmlContent: string,
    options: any,
  ): Promise<string> {
    // For now, send directly until queue is properly set up
    await this.sendDirect(recipientEmail, subject, htmlContent);
    this.logger.log(`Email sent directly: ${recipientEmail} - ${options.templateName}`);
    return 'sent-directly';
  }

  private async sendDirect(to: string, subject: string, html: string): Promise<void> {
    if (this.resend) {
      try {
        const { data, error } = await this.resend.emails.send({
          from: this.from,
          to,
          subject,
          html,
        });
        if (error) {
          this.logger.error(`Resend API error sending to ${to}: ${JSON.stringify(error)}`);
          return;
        }
        this.logger.log(`Email sent to ${to} [Resend ID: ${data?.id}]`);
      } catch (err) {
        this.logger.error(`Failed to send email to ${to} via Resend`, err);
      }
      return;
    }

    // Fallback: console log
    this.logger.log('\n' + '='.repeat(80));
    this.logger.log('EMAIL (Dev Mode — no RESEND_API_KEY)');
    this.logger.log('='.repeat(80));
    this.logger.log(`To: ${to}`);
    this.logger.log(`Subject: ${subject}`);
    this.logger.log('='.repeat(80) + '\n');
  }

  // Backward compatibility methods
  async sendInvite(email: string, rawToken: string, frontendUrl: string, tenantId: string, userId?: string): Promise<void> {
    const inviteUrl = `${frontendUrl}/accept-invite?token=${rawToken}`;
    const subject = 'You have been invited to IBMS';
    const html = `
      <h2>Welcome to IBMS</h2>
      <p>You have been invited to join the Insurance Broker Management System.</p>
      <p><a href="${inviteUrl}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">Accept Invitation</a></p>
      <p>This link expires in 48 hours.</p>
      <p style="color:#6b7280;font-size:12px;">If you did not expect this invitation, please ignore this email.</p>
    `;

    await this.queueEmail(tenantId, email, subject, html, {
      templateName: 'invitation',
      templateData: { inviteUrl, frontendUrl },
      userId,
    });
  }

  async sendPasswordReset(email: string, rawToken: string, frontendUrl: string, tenantId: string, userId?: string): Promise<void> {
    const resetUrl = `${frontendUrl}/reset-password?token=${rawToken}`;
    const subject = 'IBMS Password Reset';
    const html = `
      <h2>Password Reset</h2>
      <p>A password reset was requested for your account.</p>
      <p><a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">Reset Password</a></p>
      <p>This link expires in 1 hour. If you did not request this, you can safely ignore this email.</p>
    `;

    await this.queueEmail(tenantId, email, subject, html, {
      templateName: 'password_reset',
      templateData: { resetUrl, frontendUrl },
      userId,
      priority: 1,
    });
  }

  async sendPolicyRenewalReminder(
    tenantId: string,
    email: string,
    clientName: string,
    policyNumber: string,
    expiryDate: Date,
    daysUntilExpiry: number,
    premiumAmount: number,
    insuranceType: string,
    userId?: string,
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

    await this.queueEmail(tenantId, email, subject, html, {
      templateName: 'policy_renewal',
      templateData: {
        clientName,
        policyNumber,
        expiryDate: expiryDate.toISOString(),
        daysUntilExpiry,
        premiumAmount,
        insuranceType,
      },
      priority: daysUntilExpiry <= 30 ? 2 : 4,
      userId,
    });
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

    await this.queueEmail('tenant-id', email, subject, html, {
      templateName: 'claim_update',
      templateData: {
        clientName,
        claimNumber,
        oldStatus,
        newStatus,
        claimAmount,
        notes,
      },
    });
  }

  // Placeholder methods for admin functionality
  async getEmailLogs(tenantId: string, page = 1, limit = 20, filters?: any) {
    return {
      logs: [],
      meta: { total: 0, page, limit, totalPages: 0 },
    };
  }

  async getQueueStatus(tenantId: string) {
    return {
      queued: 0,
      processing: 0,
      sent: 0,
      failed: 0,
    };
  }
}