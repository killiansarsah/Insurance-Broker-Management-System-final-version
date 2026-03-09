import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend | null = null;

  constructor(private config: ConfigService) {
    const apiKey = this.config.get<string>('RESEND_API_KEY');
    if (apiKey) {
      this.resend = new Resend(apiKey);
      this.logger.log('Resend email client initialized');
    } else {
      this.logger.warn('RESEND_API_KEY not set — emails will be logged only');
    }
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

    await this.send(email, subject, html);
  }

  private async send(to: string, subject: string, html: string): Promise<void> {
    if (this.resend) {
      try {
        await this.resend.emails.send({
          from: this.from,
          to,
          subject,
          html,
        });
        this.logger.log(`Email sent to ${to}: ${subject}`);
      } catch (err) {
        this.logger.error(`Failed to send email to ${to}`, err);
      }
    } else {
      this.logger.log(`[DEV] Email to ${to}: ${subject} (no email provider configured)`);
    }
  }
}
