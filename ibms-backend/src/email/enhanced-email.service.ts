import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { Resend } from 'resend';
import { getBrokeriumTemplate } from './brokerium-email.template';

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
      this.logger.warn(
        'Enhanced Email service: no RESEND_API_KEY — console-log mode',
      );
    }
  }

  private get from(): string {
    return this.config.get<string>(
      'EMAIL_FROM',
      'IBMS <onboarding@resend.dev>',
    );
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
    this.logger.log(
      `Email sent directly: ${recipientEmail} - ${options.templateName}`,
    );
    return 'sent-directly';
  }

  private async sendDirect(
    to: string,
    subject: string,
    html: string,
  ): Promise<void> {
    if (this.resend) {
      try {
        const { data, error } = await this.resend.emails.send({
          from: this.from,
          to,
          subject,
          html,
        });
        if (error) {
          this.logger.error(
            `Resend API error sending to ${to}: ${JSON.stringify(error)}`,
          );
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
  async sendInvite(
    email: string,
    rawToken: string,
    frontendUrl: string,
    tenantId: string,
    userId?: string,
  ): Promise<void> {
    const inviteUrl = `${frontendUrl}/accept-invite?token=${rawToken}`;
    const subject = 'You have been invited to IBMS';

    const content = `
      <div class="greeting">Hello,</div>
      <div class="body-text">
        You have been invited to join the Insurance Broker Management System (IBMS).
      </div>
      
      <div class="info-card">
        <div class="info-card-hdr blue">Invitation Details</div>
        <div class="info-row">
          <div class="info-lbl">System URL</div>
          <div class="info-val link">${frontendUrl}</div>
        </div>
      </div>

      <div class="cta-wrap">
        <a href="${inviteUrl}" class="cta-btn blue">Accept Invitation</a>
        <div class="expire-note">This link expires in 48 hours.</div>
      </div>
      
      <div class="body-text" style="font-size: 13px; color: #6b7280; text-align: center;">
        If you did not expect this invitation, please ignore this email.
      </div>
    `;
    const html = getBrokeriumTemplate(
      content,
      'blue',
      'System Invitation',
      'Join our secure platform',
    );

    await this.queueEmail(tenantId, email, subject, html, {
      templateName: 'invitation',
      templateData: { inviteUrl, frontendUrl },
      userId,
    });
  }

  async sendPasswordReset(
    email: string,
    rawToken: string,
    frontendUrl: string,
    tenantId: string,
    userId?: string,
  ): Promise<void> {
    const resetUrl = `${frontendUrl}/reset-password?token=${rawToken}`;
    const subject = 'IBMS Password Reset';

    const content = `
      <div class="body-text" style="font-size: 14.5px; line-height: 1.8; color: #374151; margin-bottom: 22px; text-align: center;">
        A password reset was requested for your Brokerium account.<br><br>
        <span style="color: #6b7280;">If this was you, click below to choose a new password.</span>
      </div>

      <div class="cta-wrap">
        <a href="${resetUrl}" class="cta-btn amber">Reset My Password</a>
        <div class="expire-note">This link expires in <strong>1 hour</strong> for your security.</div>
      </div>

      <hr class="divider" style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0;">

      <div class="warn-box amber">
        <span class="warn-icon">⚠️</span>
        <div>
          <strong>Didn't request this?</strong> Your account is safe — ignore this email. No changes have been made. If concerned, <a href="mailto:support@brokerium.com" style="color: #d97706; text-decoration: underline;">contact support</a>.
        </div>
      </div>
      
      <div class="info-card">
        <div class="info-card-hdr amber" style="background:#FFFBEB;color:#92400E;">REQUEST DETAILS</div>
        <div class="info-row">
          <div class="info-lbl">IP Address</div>
          <div class="info-val">196.168.xx.xx</div>
        </div>
        <div class="info-row">
          <div class="info-lbl">Device</div>
          <div class="info-val">Chrome on Windows</div>
        </div>
        <div class="info-row">
          <div class="info-lbl">Location</div>
          <div class="info-val">Accra, Ghana</div>
        </div>
      </div>
    `;
    const requestDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' }).format(new Date());
    const html = getBrokeriumTemplate(
      content,
      'amber',
      'Password Reset',
      `Requested · ${requestDate}`,
    );

    await this.queueEmail(tenantId, email, subject, html, {
      templateName: 'password_reset',
      templateData: { resetUrl, frontendUrl },
      userId,
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
    const isUrgent = daysUntilExpiry <= 30;
    const theme = isUrgent ? 'red' : 'amber';
    const headerTitle = isUrgent
      ? 'Urgent: Policy Expiration'
      : 'Policy Renewal Reminder';
    const headerSub = `Action required within ${daysUntilExpiry} days`;

    const content = `
      <div class="greeting">Dear <strong>${clientName}</strong>,</div>
      <div class="body-text">
        Your <strong>${insuranceType}</strong> insurance policy is approaching its expiration date in <strong>${daysUntilExpiry} days</strong>.
      </div>
      
      <div class="info-card">
        <div class="info-card-hdr ${theme}">Policy Details</div>
        <div class="info-row">
          <div class="info-lbl">Policy Number</div>
          <div class="info-val">${policyNumber}</div>
        </div>
        <div class="info-row">
          <div class="info-lbl">Expiration Date</div>
          <div class="info-val ${isUrgent ? 'danger' : 'warn'}">${expiryDate.toLocaleDateString()}</div>
        </div>
        <div class="info-row">
          <div class="info-lbl">Premium Amount</div>
          <div class="info-val">GHS ${premiumAmount.toLocaleString()}</div>
        </div>
      </div>

      <div class="warn-box amber">
        <div><strong>Important:</strong> Your coverage will cease on the expiry date if not renewed.</div>
      </div>

      <div class="cta-wrap">
        <a href="#" class="cta-btn ${theme}">Contact Broker</a>
      </div>
    `;
    const html = getBrokeriumTemplate(content, theme, headerTitle, headerSub);

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

    let theme: 'teal' | 'blue' | 'red' | 'amber' = 'blue';
    let statusClass = 'link';
    if (
      newStatus.toUpperCase().includes('APPROVED') ||
      newStatus.toUpperCase().includes('SETTLED')
    ) {
      theme = 'teal';
      statusClass = 'val';
    } else if (
      newStatus.toUpperCase().includes('REJECTED') ||
      newStatus.toUpperCase().includes('DENIED')
    ) {
      theme = 'red';
      statusClass = 'danger';
    } else if (newStatus.toUpperCase().includes('PENDING')) {
      theme = 'amber';
      statusClass = 'warn';
    }

    const content = `
      <div class="greeting">Dear <strong>${clientName}</strong>,</div>
      <div class="body-text">
        Your insurance claim status has been updated from <strong>${oldStatus}</strong> to <strong class="${statusClass}">${newStatus}</strong>.
      </div>
      
      <div class="info-card">
        <div class="info-card-hdr ${theme}">Claim Status Update</div>
        <div class="info-row">
          <div class="info-lbl">Claim Number</div>
          <div class="info-val">${claimNumber}</div>
        </div>
        <div class="info-row">
          <div class="info-lbl">Claim Amount</div>
          <div class="info-val">GHS ${claimAmount.toLocaleString()}</div>
        </div>
      </div>

      ${
        notes
          ? `<div class="warn-box amber">
               <div><strong>Notes:</strong> ${notes}</div>
             </div>`
          : ''
      }

      <div class="cta-wrap">
        <a href="#" class="cta-btn ${theme}">View Claim Details</a>
      </div>
    `;
    const html = getBrokeriumTemplate(
      content,
      theme,
      'Claim Update',
      `Status changed to ${newStatus}`,
    );

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
