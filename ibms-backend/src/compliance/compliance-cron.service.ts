import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ComplianceCronService {
  private readonly logger = new Logger(ComplianceCronService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  // ─── COMPLAINT 14-DAY NIC ESCALATION ────────────────
  // NIC requires complaints resolved within 14 days or flagged for regulatory escalation
  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async flagOverdueComplaints() {
    this.logger.log('Checking for complaints overdue >14 days...');
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const overdue = await this.prisma.complaint.findMany({
      where: {
        status: { notIn: ['RESOLVED', 'CLOSED'] },
        createdAt: { lt: fourteenDaysAgo },
        isBreached: false,
      },
      select: {
        id: true,
        tenantId: true,
        complaintNumber: true,
        subject: true,
        assignedToId: true,
      },
    });

    if (overdue.length === 0) return;

    // Mark as breached
    await this.prisma.complaint.updateMany({
      where: { id: { in: overdue.map((c) => c.id) } },
      data: { isBreached: true },
    });

    // Notify assigned users + tenant admins
    for (const complaint of overdue) {
      const admins = await this.prisma.user.findMany({
        where: {
          tenantId: complaint.tenantId,
          role: { in: ['ADMIN', 'TENANT_ADMIN'] },
          isActive: true,
        },
        select: { id: true },
      });

      const recipients = new Set<string>(admins.map((a) => a.id));
      if (complaint.assignedToId) recipients.add(complaint.assignedToId);

      for (const userId of recipients) {
        await this.notifications.create(complaint.tenantId, {
          userId,
          title: 'NIC Escalation: Complaint Overdue >14 Days',
          message: `Complaint ${complaint.complaintNumber} "${complaint.subject}" has exceeded the 14-day NIC resolution window and requires immediate escalation.`,
          type: 'COMPLIANCE',
          priority: 'URGENT',
          link: `/dashboard/complaints`,
        });
      }
    }

    this.logger.log(
      `Flagged ${overdue.length} complaints for NIC escalation`,
    );
  }

  // ─── CLAIMS 90-DAY SETTLEMENT SLA ──────────────────
  // NIC Act 1061 requires claim settlement within 90 days
  @Cron(CronExpression.EVERY_DAY_AT_7AM)
  async checkClaims90DaySla() {
    this.logger.log('Checking claims approaching 90-day settlement SLA...');
    const now = new Date();

    // Claims older than 75 days that are still open (15-day warning)
    const warningDate = new Date();
    warningDate.setDate(warningDate.getDate() - 75);

    const overdueDate = new Date();
    overdueDate.setDate(overdueDate.getDate() - 90);

    const atRiskClaims = await this.prisma.claim.findMany({
      where: {
        deletedAt: null,
        status: {
          in: [
            'INTIMATED',
            'REGISTERED',
            'DOCUMENTS_PENDING',
            'UNDER_REVIEW',
            'ASSESSED',
            'APPROVED',
          ],
        },
        createdAt: { lte: warningDate },
      },
      select: {
        id: true,
        tenantId: true,
        claimNumber: true,
        createdAt: true,
        policy: {
          select: {
            brokerId: true,
          },
        },
      },
    });

    for (const claim of atRiskClaims) {
      const ageInDays = Math.floor(
        (now.getTime() - claim.createdAt.getTime()) / (1000 * 60 * 60 * 24),
      );
      const isOverdue = ageInDays >= 90;

      const admins = await this.prisma.user.findMany({
        where: {
          tenantId: claim.tenantId,
          role: { in: ['ADMIN', 'TENANT_ADMIN', 'SENIOR_BROKER'] },
          isActive: true,
        },
        select: { id: true },
      });

      const recipients = new Set<string>(admins.map((a) => a.id));
      if (claim.policy?.brokerId) recipients.add(claim.policy.brokerId);

      for (const userId of recipients) {
        await this.notifications.create(claim.tenantId, {
          userId,
          title: isOverdue
            ? `OVERDUE: Claim ${claim.claimNumber} past 90-day SLA`
            : `WARNING: Claim ${claim.claimNumber} approaching 90-day SLA`,
          message: isOverdue
            ? `Claim ${claim.claimNumber} is ${ageInDays} days old and has breached the NIC 90-day settlement requirement.`
            : `Claim ${claim.claimNumber} is ${ageInDays} days old. Settlement due within ${90 - ageInDays} days per NIC Act 1061.`,
          type: 'COMPLIANCE',
          priority: isOverdue ? 'URGENT' : 'HIGH',
          link: `/dashboard/claims/${claim.id}`,
        });
      }
    }

    this.logger.log(
      `Processed ${atRiskClaims.length} claims for 90-day SLA check`,
    );
  }

  // ─── RENEWAL 30-DAY NOTICE ─────────────────────────
  // Alert brokers when policies are within 30 days of expiry
  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async sendRenewalNotices() {
    this.logger.log('Checking for policies expiring within 30 days...');
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const expiringPolicies = await this.prisma.policy.findMany({
      where: {
        status: 'ACTIVE',
        deletedAt: null,
        expiryDate: { gte: now, lte: thirtyDaysFromNow },
      },
      select: {
        id: true,
        tenantId: true,
        policyNumber: true,
        expiryDate: true,
        brokerId: true,
        client: {
          select: { firstName: true, lastName: true, companyName: true },
        },
      },
    });

    for (const policy of expiringPolicies) {
      const daysLeft = Math.ceil(
        (policy.expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );
      const clientName =
        policy.client?.companyName ||
        `${policy.client?.firstName ?? ''} ${policy.client?.lastName ?? ''}`.trim();

      const admins = await this.prisma.user.findMany({
        where: {
          tenantId: policy.tenantId,
          role: { in: ['ADMIN', 'TENANT_ADMIN'] },
          isActive: true,
        },
        select: { id: true },
      });

      const recipients = new Set<string>(admins.map((a) => a.id));
      if (policy.brokerId) recipients.add(policy.brokerId);

      for (const userId of recipients) {
        await this.notifications.create(policy.tenantId, {
          userId,
          title: `Renewal Due: ${policy.policyNumber}`,
          message: `Policy ${policy.policyNumber} for ${clientName} expires in ${daysLeft} days (${policy.expiryDate.toISOString().slice(0, 10)}). Initiate renewal process.`,
          type: 'RENEWAL',
          priority: daysLeft <= 7 ? 'URGENT' : daysLeft <= 14 ? 'HIGH' : 'MEDIUM',
          link: `/dashboard/renewals`,
        });
      }
    }

    this.logger.log(
      `Sent ${expiringPolicies.length} renewal notices`,
    );
  }

  // ─── BROKER LICENCE EXPIRY ALERTS ────────────────────
  // NIC requires valid operating licence; alert 90/60/30 days before expiry
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async checkBrokerLicenceExpiry() {
    this.logger.log('Checking broker licence expiry dates...');
    const now = new Date();
    const ninetyDays = new Date();
    ninetyDays.setDate(ninetyDays.getDate() + 90);

    const tenants = await this.prisma.tenant.findMany({
      where: {
        nicLicenseExpiry: { lte: ninetyDays, gte: now },
      },
      select: {
        id: true,
        name: true,
        nicLicenseExpiry: true,
      },
    });

    for (const tenant of tenants) {
      const daysLeft = Math.ceil(
        (tenant.nicLicenseExpiry!.getTime() - now.getTime()) /
          (1000 * 60 * 60 * 24),
      );

      let priority: 'URGENT' | 'HIGH' | 'MEDIUM' = 'MEDIUM';
      if (daysLeft <= 30) priority = 'URGENT';
      else if (daysLeft <= 60) priority = 'HIGH';

      const admins = await this.prisma.user.findMany({
        where: {
          tenantId: tenant.id,
          role: { in: ['ADMIN', 'TENANT_ADMIN', 'COMPLIANCE_OFFICER'] },
          isActive: true,
        },
        select: { id: true },
      });

      for (const admin of admins) {
        await this.notifications.create(tenant.id, {
          userId: admin.id,
          title: `NIC Licence Expiry: ${daysLeft} days remaining`,
          message: `${tenant.name}'s NIC operating licence expires on ${tenant.nicLicenseExpiry!.toISOString().slice(0, 10)}. Renewal must be submitted before expiry to avoid regulatory sanctions.`,
          type: 'COMPLIANCE',
          priority,
          link: `/dashboard/compliance`,
        });
      }
    }

    this.logger.log(`Processed ${tenants.length} licence expiry checks`);
  }

  // ─── AML/KYC EXPIRY ALERTS ─────────────────────────
  // Notify compliance team when client KYC is expired or pending >30 days
  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async checkKycExpiry() {
    this.logger.log('Checking for KYC/AML expiry alerts...');
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const clients = await this.prisma.client.findMany({
      where: {
        deletedAt: null,
        OR: [
          { kycStatus: 'EXPIRED' },
          { kycStatus: 'PENDING', createdAt: { lt: thirtyDaysAgo } },
        ],
      },
      select: {
        id: true,
        tenantId: true,
        clientNumber: true,
        firstName: true,
        lastName: true,
        companyName: true,
        kycStatus: true,
      },
    });

    for (const client of clients) {
      const clientName =
        client.companyName ||
        `${client.firstName ?? ''} ${client.lastName ?? ''}`.trim();

      const admins = await this.prisma.user.findMany({
        where: {
          tenantId: client.tenantId,
          role: { in: ['ADMIN', 'TENANT_ADMIN', 'COMPLIANCE_OFFICER'] },
          isActive: true,
        },
        select: { id: true },
      });

      for (const admin of admins) {
        await this.notifications.create(client.tenantId, {
          userId: admin.id,
          title:
            client.kycStatus === 'EXPIRED'
              ? `KYC Expired: ${clientName}`
              : `KYC Overdue: ${clientName}`,
          message:
            client.kycStatus === 'EXPIRED'
              ? `Client ${client.clientNumber} (${clientName}) KYC has expired. Policies may need suspension per NIC AML guidelines.`
              : `Client ${client.clientNumber} (${clientName}) KYC has been pending for over 30 days. Review required.`,
          type: 'COMPLIANCE',
          priority: 'HIGH',
          link: `/dashboard/compliance`,
        });
      }
    }

    this.logger.log(
      `Processed ${clients.length} KYC/AML alerts`,
    );
  }
}
