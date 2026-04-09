import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { getBrokeriumTemplate } from './brokerium-email.template';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend | null;

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    const apiKey = this.config.get<string>('RESEND_API_KEY');
    if (apiKey) {
      this.resend = new Resend(apiKey);
      this.logger.log(
        'Email service initialized with Resend (production mode)',
      );
    } else {
      this.resend = null;
      this.logger.warn(
        'RESEND_API_KEY not set — email service running in console-log mode',
      );
    }
  }

  private get from(): string {
    return this.config.get<string>(
      'EMAIL_FROM',
      'Brokerium <onboarding@resend.dev>',
    );
  }

  // ───────────────────────────────────────────────────────
  // Public email methods
  // ───────────────────────────────────────────────────────

  async sendInvite(
    email: string,
    rawToken: string,
    frontendUrl: string,
  ): Promise<void> {
    const inviteUrl = `${frontendUrl}/accept-invite?token=${rawToken}`;
    const subject = 'You have been invited to Brokerium';
    const content = `
      <div class="greeting" style="font-size: 15px; text-align: center; margin-bottom: 12px; color: #4B5563;">
        <span style="font-weight: 600; color: #1F2937;">Admin User</span> has invited you to join the
        <span style="font-weight: 600; color: #1F2937;">Insurance Broker Management System</span> as a team member.
      </div>
      <div class="body-text" style="font-size: 14.5px; text-align: center; color: #6B7280; margin-bottom: 24px; line-height: 1.6;">
        Brokerium helps your team manage policies, clients, premiums, and renewals — all in one place.
      </div>

      <div class="cta-wrap" style="text-align: center; margin-bottom: 24px;">
        <a href="${inviteUrl}" class="cta-btn blue" style="padding: 14px 44px; font-size: 15px; border-radius: 100px; display: inline-block; text-decoration: none; color: white; background: #3B82F6; box-shadow: 0 4px 14px rgba(59,130,246,0.35);">Accept Invitation</a>
        <div class="expire-note" style="margin-top: 12px; font-size: 13px; color: #9CA3AF;">This invitation expires in <strong>48 hours</strong>.</div>
      </div>

      <hr class="divider" style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0;">
      
      <div class="info-card" style="background: #fff; border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
        <div class="info-card-hdr blue" style="background:#EFF6FF; color:#1E40AF; padding: 14px 18px; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;">YOUR ACCOUNT DETAILS</div>
        <div class="info-row" style="padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #F3F4F6;">
          <div class="info-lbl" style="color: #6B7280; font-size: 13.5px;">Organisation</div>
          <div class="info-val" style="font-weight: 500; font-size: 13.5px; color: #1F2937;">SIC Insurance GH</div>
        </div>
        <div class="info-row" style="padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #F3F4F6;">
          <div class="info-lbl" style="color: #6B7280; font-size: 13.5px;">Role Assigned</div>
          <div class="info-val" style="font-weight: 500; font-size: 13.5px; color: #1F2937;">Broker Agent</div>
        </div>
        <div class="info-row" style="padding: 14px 18px; display: flex; align-items: center; justify-content: space-between;">
          <div class="info-lbl" style="color: #6B7280; font-size: 13.5px;">Invited By</div>
          <div class="info-val" style="font-weight: 500; font-size: 13.5px; color: #1F2937;">Admin User</div>
        </div>
      </div>

      <div class="body-text" style="font-size: 13px; color: #9CA3AF; text-align: center;">
        If you didn't expect this invitation, safely ignore this email. The link will expire automatically.
      </div>
    `;
    const html = getBrokeriumTemplate(
      content,
      'blue',
      `You're invited!`,
      'Join your team on Brokerium',
    );

    await this.send(email, subject, html);
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
    const isUrgent = daysUntilExpiry <= 30;
    const theme = isUrgent ? 'red' : 'amber';
    const headerTitle = isUrgent
      ? 'Urgent: Policy Expiration'
      : 'Policy Renewal Reminder';
    const headerSub = `Action required within ${daysUntilExpiry} days`;

    const content = `
      <div class="greeting" style="font-size: 15px; margin-bottom: 12px; color: #4B5563;">Dear <strong>${clientName}</strong>,</div>
      <div class="body-text" style="font-size: 14.5px; line-height: 1.7; color: #4B5563; margin-bottom: 24px;">
        Your <strong>${insuranceType} insurance policy</strong> is approaching its renewal date. To avoid any lapse in coverage, please contact your broker to initiate the renewal process at your earliest convenience.
      </div>
      
      <div class="info-card" style="border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
        <div class="info-card-hdr amber" style="background:#FFFBEB; color:#92400E; padding: 14px 18px; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;">POLICY SUMMARY</div>
        <div class="info-row" style="padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #F3F4F6;">
          <div class="info-lbl" style="color: #6B7280; font-size: 13.5px;">Policy Number</div>
          <div class="info-val" style="font-weight: 500; font-size: 13.5px; color: #1F2937;">${policyNumber}</div>
        </div>
        <div class="info-row" style="padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #F3F4F6;">
          <div class="info-lbl" style="color: #6B7280; font-size: 13.5px;">Policy Class</div>
          <div class="info-val" style="font-weight: 500; font-size: 13.5px; color: #1F2937;">${insuranceType}</div>
        </div>
        <div class="info-row" style="padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #F3F4F6;">
          <div class="info-lbl" style="color: #6B7280; font-size: 13.5px;">Expiry Date</div>
          <div class="info-val" style="font-weight: 500; font-size: 13.5px; color: #1F2937;">${expiryDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
        </div>
        <div class="info-row" style="padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #F3F4F6;">
          <div class="info-lbl" style="color: #6B7280; font-size: 13.5px;">Days Remaining</div>
          <div class="info-val" style="font-weight: 600; font-size: 13.5px; color: #D97706;">${daysUntilExpiry} days remaining</div>
        </div>
        <div class="info-row" style="padding: 14px 18px; display: flex; align-items: center; justify-content: space-between;">
          <div class="info-lbl" style="color: #6B7280; font-size: 13.5px;">Premium Amount</div>
          <div class="info-val" style="font-weight: 500; font-size: 13.5px; color: #1F2937;">GHS ${premiumAmount.toLocaleString()}</div>
        </div>
      </div>

      <div class="warn-box red" style="background:#FEF2F2; border:1px solid #FCA5A5; color:#991B1B; border-radius:12px; padding:15px 18px; font-size:13.5px; line-height:1.65; margin-bottom:22px; display:flex; gap:11px; align-items:flex-start;">
        <span class="warn-icon" style="flex-shrink:0;">⚠️</span>
        <div><strong>Important:</strong> Your coverage ceases on the expiry date if not renewed. Gaps in ${insuranceType.toLowerCase()} insurance can expose your business to significant liability.</div>
      </div>

      <div class="body-text" style="font-size: 14.5px; line-height: 1.7; color: #4B5563; margin-bottom: 28px;">
        Renewal is quick and easy through the Brokerium portal. Please reach out to your broker as soon as possible to ensure continuous, uninterrupted coverage.
      </div>

      <div class="cta-wrap" style="text-align: center;">
        <a href="#" class="cta-btn amber" style="padding: 14px 44px; font-size: 15px; border-radius: 100px; display: inline-block; text-decoration: none; color: white; background: #F59E0B; box-shadow: 0 4px 14px rgba(245,158,11,0.35);">Initiate Renewal Now</a>
      </div>
    `;
    const html = getBrokeriumTemplate(content, theme, headerTitle, headerSub);

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
    const isHigh = priority.toUpperCase() === 'HIGH';
    const badgeClass = isHigh
      ? 'high'
      : priority.toUpperCase() === 'MEDIUM'
        ? 'medium'
        : 'low';
    const theme = isHigh ? 'red' : 'blue';

    const content = `
      <div class="greeting">Hi <strong>${assigneeName}</strong>,</div>
      <div class="body-text">
        You have a new task assigned to you. Please review the details below and update the status in your dashboard once actioned.
      </div>
      
      <div class="task-card ${isHigh ? 'red-accent' : ''}" style="border: 1px solid #E5E7EB; border-radius: 0 14px 14px 0; border-left: 4px solid ${isHigh ? '#EF4444' : '#E5E7EB'}; padding: 20px; margin-bottom: 24px; position: relative; overflow: hidden; background: #fff;">
        <div style="position: absolute; top:0; right: 0; width: 80px; height: 80px; border-radius: 50%; transform: translate(24px, -24px); opacity: ${isHigh ? '0.06' : '0'}; background: #EF4444;"></div>
        <div class="task-title" style="font-size: 16.5px; font-weight: 700; color: #1F2937; margin-bottom: 8px; position: relative; z-index: 1;">${taskTitle}</div>
        <div class="task-desc" style="font-size: 14px; color: #4B5563; line-height: 1.7; margin-bottom: 20px; position: relative; z-index: 1;">${taskDescription}</div>
        <div class="task-meta" style="display: flex; gap: 24px; position: relative; z-index: 1; flex-wrap: wrap;">
          <div class="task-meta-item" style="display: flex; flex-direction: column; gap: 2px;">
            <div class="task-meta-lbl" style="font-size: 10.5px; color: #6B7280; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 4px;">Priority</div>
            <div class="badge ${badgeClass}" style="display: inline-block; padding: 3px 10px; border-radius: 100px; font-size: 11.5px; font-weight: 700; ${isHigh ? 'background: #FEF2F2; color: #EF4444; border: 1px solid #FCA5A5;' : 'background: #FFFBEB; color: #D97706; border: 1px solid #FCD34D;'}">${priority.toUpperCase()}</div>
          </div>
          <div class="task-meta-item" style="display: flex; flex-direction: column; gap: 2px;">
            <div class="task-meta-lbl" style="font-size: 10.5px; color: #6B7280; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 4px;">Due Date</div>
            <div class="task-meta-val" style="font-size: 13.5px; font-weight: 600; color: #1F2937;">${dueDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
          </div>
          <div class="task-meta-item" style="display: flex; flex-direction: column; gap: 2px;">
            <div class="task-meta-lbl" style="font-size: 10.5px; color: #6B7280; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 4px;">Assigned By</div>
            <div class="task-meta-val" style="font-size: 13.5px; font-weight: 600; color: #1F2937;">${assignedBy}</div>
          </div>
        </div>
      </div>

      <div class="cta-wrap" style="text-align: center; margin-top: 30px;">
        <a href="#" class="cta-btn ${theme}" style="padding: 14px 40px; font-size: 15px; border-radius: 100px; display: inline-block; text-decoration: none; color: white; background: #3B82F6; box-shadow: 0 4px 14px rgba(59,130,246,0.35);">View Task in Dashboard</a>
      </div>

      <hr class="divider" style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">

      <div class="body-text" style="font-size: 13.5px; color: #6B7280; text-align: center;">
        Log in to the Brokerium dashboard to view full task details, add notes, and update progress.
      </div>
    `;
    const html = getBrokeriumTemplate(
      content,
      'blue',
      'New Task Assigned',
      `Assigned by ${assignedBy} · ${priority.toUpperCase()} Priority`,
    );

    await this.send(email, subject, html);
  }

  async sendWelcomeEmail(
    email: string,
    clientName: string,
    brokerName: string,
    brokerEmail: string,
    brokerPhone: string,
  ): Promise<void> {
    const subject = 'Welcome to Brokerium';
    const content = `
      <div class="greeting">Dear <strong>${clientName}</strong>,</div>
      <div class="body-text">
        We're delighted to welcome you to Brokerium. You now have a dedicated broker assigned to your account — someone who'll be your personal guide through every policy, claim, and renewal.
      </div>
      
      <div class="info-card">
        <div class="info-card-hdr teal" style="background:#F0FDF4;color:#065F46;">YOUR DEDICATED BROKER</div>
        <div class="info-row">
          <div class="info-lbl">Name</div>
          <div class="info-val">${brokerName}</div>
        </div>
        <div class="info-row">
          <div class="info-lbl">Email</div>
          <div class="info-val link"><a href="mailto:${brokerEmail}" style="color: #3B82F6; text-decoration: none;">${brokerEmail}</a></div>
        </div>
        <div class="info-row">
          <div class="info-lbl">Phone</div>
          <div class="info-val">${brokerPhone}</div>
        </div>
        <div class="info-row">
          <div class="info-lbl">Office Hours</div>
          <div class="info-val">Mon - Fri, 8:00 am - 5:00 pm</div>
        </div>
      </div>

      <div class="next-steps" style="background: #F0FDF4; border: 1px solid #A7F3D0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <div class="next-steps-ttl" style="font-size: 13.5px; font-weight: 700; color: #047857; margin-bottom: 14px; display: flex; align-items: center; gap: 8px;">
          <span style="font-size:16px;">ⓘ</span> What to do next
        </div>
        <div class="step-item" style="display: flex; align-items: flex-start; gap: 12px; font-size: 13.5px; color: #065F46; margin-bottom: 12px;">
          <div class="step-num" style="width: 22px; height: 22px; border-radius: 50%; background: #10B981; color: #fff; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">1</div>
          <div>Log in to your Brokerium portal and complete your profile</div>
        </div>
        <div class="step-item" style="display: flex; align-items: flex-start; gap: 12px; font-size: 13.5px; color: #065F46; margin-bottom: 12px;">
          <div class="step-num" style="width: 22px; height: 22px; border-radius: 50%; background: #10B981; color: #fff; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">2</div>
          <div>Review your policy documents in the Documents section</div>
        </div>
        <div class="step-item" style="display: flex; align-items: flex-start; gap: 12px; font-size: 13.5px; color: #065F46;">
          <div class="step-num" style="width: 22px; height: 22px; border-radius: 50%; background: #10B981; color: #fff; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">3</div>
          <div>Save your broker's contact for quick access anytime</div>
        </div>
      </div>

      <div class="body-text" style="font-size: 14.5px; line-height: 1.8; color: #4B5563;">
        We're here for you every step of the way. Don't hesitate to reach out — your broker is just a message away.
      </div>
    `;
    const html = getBrokeriumTemplate(
      content,
      'teal',
      'Your insurance account is active',
      'Welcome to Brokerium',
    );

    await this.send(email, subject, html);
  }

  async sendPasswordReset(
    email: string,
    rawToken: string,
    frontendUrl: string,
  ): Promise<void> {
    const resetUrl = `${frontendUrl}/reset-password?token=${rawToken}`;
    const subject = 'Brokerium Password Reset';
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

    await this.send(email, subject, html);
  }

  // ───────────────────────────────────────────────────────
  // Core send method — Resend with console fallback
  // ───────────────────────────────────────────────────────

  private async send(to: string, subject: string, html: string): Promise<void> {
    // Production mode — send via Resend
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
          await this.prisma.errorLog.create({
            data: {
              errorType: 'EMAIL_DELIVERY_FAILURE',
              message: `Resend API failed to send to ${to}`,
              stackTrace: JSON.stringify(error),
              severity: 'FATAL',
              requestMethod: 'BACKGROUND_JOB',
              notes: 'Integration Failure: Resend',
            },
          }).catch(dbErr => this.logger.error('Failed to write Email Error to DB', dbErr));
          return;
        }

        this.logger.log(
          `Email sent successfully to ${to} [Resend ID: ${data?.id}]`,
        );
      } catch (err: any) {
        this.logger.error(`Failed to send email to ${to} via Resend`, err);
        await this.prisma.errorLog.create({
          data: {
            errorType: 'EMAIL_SERVICE_EXCEPTION',
            message: `Unexpected exception sending to ${to}: ${err.message || String(err)}`,
            stackTrace: err.stack || String(err),
            severity: 'FATAL',
            requestMethod: 'BACKGROUND_JOB',
            notes: 'Integration Failure: Resend',
          },
        }).catch(dbErr => this.logger.error('Failed to write Email Error to DB', dbErr));
      }
      return;
    }

    // Development fallback — console log
    this.logger.log('\n' + '='.repeat(80));
    this.logger.log('EMAIL (Development Mode — no RESEND_API_KEY set)');
    this.logger.log('='.repeat(80));
    this.logger.log(`From: ${this.from}`);
    this.logger.log(`To: ${to}`);
    this.logger.log(`Subject: ${subject}`);
    this.logger.log('='.repeat(80) + '\n');
  }

  /**
   * Replaces all 15 template variables in a subject/body string with actual data.
   */
  renderTemplate(template: string, vars: Record<string, string>): string {
    return Object.entries(vars).reduce(
      (txt, [key, value]) => txt.replaceAll(`{{${key}}}`, value ?? ''),
      template,
    );
  }

  /**
   * Sends an email built from a DB-stored `RenewalTemplate` record.
   * Accepts pre-resolved variable values — caller is responsible for building the map.
   */
  async sendFromRenewalTemplate(
    toEmail: string,
    templateSubject: string,
    templateBody: string,
    vars: {
      client_first_name: string;
      policy_number: string;
      insurance_type: string;
      expiry_date: string;
      days_remaining: string;
      current_premium: string;
      carrier_name: string;
      vehicle_reg: string;
      property_address: string;
      officer_name: string;
      officer_phone: string;
      agency_name: string;
      agency_nic_number: string;
      agency_phone: string;
      agency_email: string;
    },
  ): Promise<void> {
    const resolvedSubject = this.renderTemplate(
      templateSubject,
      vars as Record<string, string>,
    );
    const resolvedBody = this.renderTemplate(
      templateBody,
      vars as Record<string, string>,
    );

    // Convert plain-text body to simple HTML
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; color: #1f2937;">
        <div style="background: #1e3a5f; color: white; padding: 20px 28px; border-radius: 10px 10px 0 0;">
          <h2 style="margin: 0; font-size: 20px;">${resolvedSubject}</h2>
        </div>
        <div style="background: #f9fafb; padding: 28px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px; white-space: pre-line; line-height: 1.7;">
          ${resolvedBody}
        </div>
        <p style="color: #9ca3af; font-size: 11px; text-align: center; margin-top: 12px;">
          ${vars.agency_name} · NIC Lic: ${vars.agency_nic_number} · ${vars.agency_phone}
        </p>
      </div>
    `;

    await this.send(toEmail, resolvedSubject, html);
  }
}
