import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Prisma } from '@prisma/client';
import { RenewPolicyDto } from './dto/renew-policy.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class RenewalsService {
  private readonly logger = new Logger(RenewalsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async getUpcomingRenewals(
    tenantId: string,
    daysAhead = 90,
    filters?: {
      insuranceType?: string;
      carrierId?: string;
    },
  ) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);
    const now = new Date();

    const where: Prisma.PolicyWhereInput = {
      tenantId,
      status: 'ACTIVE',
      expiryDate: { lte: futureDate, gte: now },
      ...(filters?.insuranceType && {
        insuranceType: filters.insuranceType as Prisma.EnumInsuranceTypeFilter,
      }),
      ...(filters?.carrierId && { carrierId: filters.carrierId }),
    };

    const policies = await this.prisma.policy.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            companyName: true,
            firstName: true,
            lastName: true,
          },
        },
        product: { select: { id: true, name: true } },
        carrier: { select: { id: true, name: true } },
        renewalLogs: { orderBy: { createdAt: 'desc' } },
      },
      orderBy: { expiryDate: 'asc' },
    });

    return policies.map((p) => {
      const daysUntilExpiry = Math.ceil(
        (p.expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );
      return {
        ...p,
        daysUntilExpiry,
        urgencyLevel:
          daysUntilExpiry < 0
            ? 'OVERDUE'
            : daysUntilExpiry <= 30
              ? 'URGENT'
              : 'UPCOMING',
      };
    });
  }

  async getLapsedPolicies(tenantId: string) {
    const policies = await this.prisma.policy.findMany({
      where: {
        tenantId,
        status: { in: ['EXPIRED', 'LAPSED'] },
      },
      include: {
        client: {
          select: {
            id: true,
            companyName: true,
            firstName: true,
            lastName: true,
            phone: true,
            email: true,
          },
        },
        product: { select: { id: true, name: true } },
        carrier: { select: { id: true, name: true } },
        renewalLogs: { orderBy: { createdAt: 'desc' } },
      },
      orderBy: { expiryDate: 'desc' },
    });

    return policies.map((p) => {
      const daysSinceExpiry = Math.ceil(
        (new Date().getTime() - p.expiryDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      return {
        ...p,
        daysSinceExpiry,
        isReinstatementEligible: daysSinceExpiry <= 30, // Example: 30 days grace period rule
      };
    });
  }

  async renewPolicy(
    id: string,
    tenantId: string,
    userId: string,
    dto: RenewPolicyDto,
  ) {
    const oldPolicy = await this.prisma.policy.findUnique({
      where: { id, tenantId },
      include: {
        vehicleDetails: true,
        propertyDetails: true,
        marineDetails: true,
      },
    });

    if (!oldPolicy) throw new NotFoundException('Policy not found');
    if (oldPolicy.status !== 'ACTIVE' && oldPolicy.status !== 'LAPSED') {
      throw new BadRequestException(
        'Only ACTIVE or LAPSED policies can be renewed',
      );
    }

    const newStartDate = new Date(oldPolicy.expiryDate);
    newStartDate.setDate(newStartDate.getDate() + 1);
    const newEndDate = new Date(newStartDate);
    newEndDate.setFullYear(newEndDate.getFullYear() + 1);

    return this.prisma.$transaction(async (tx) => {
      const newPolicy = await tx.policy.create({
        data: {
          tenantId,
          clientId: oldPolicy.clientId,
          carrierId: oldPolicy.carrierId,
          productId: oldPolicy.productId,
          brokerId: userId,
          insuranceType: oldPolicy.insuranceType,
          policyType: oldPolicy.policyType,
          policyNumber: `${oldPolicy.policyNumber}-REN-${randomBytes(3).toString('hex').toUpperCase()}`,
          inceptionDate: newStartDate,
          expiryDate: newEndDate,
          sumInsured: dto.sumInsured ?? oldPolicy.sumInsured,
          premiumAmount: dto.premiumAmount,
          premiumFrequency: oldPolicy.premiumFrequency,
          commissionRate: oldPolicy.commissionRate,
          commissionAmount: oldPolicy.commissionAmount,
          currency: oldPolicy.currency,
          status: 'DRAFT',
          isRenewal: true,
          previousPolicyId: oldPolicy.id,
          coverageDetails: dto.notes ?? oldPolicy.coverageDetails,
          vehicleDetails: oldPolicy.vehicleDetails
            ? {
                create: {
                  ...oldPolicy.vehicleDetails,
                  id: undefined,
                  policyId: undefined,
                } as unknown as Prisma.VehicleDetailCreateWithoutPolicyInput,
              }
            : undefined,
          propertyDetails: oldPolicy.propertyDetails
            ? {
                create: {
                  ...oldPolicy.propertyDetails,
                  id: undefined,
                  policyId: undefined,
                } as unknown as Prisma.PropertyDetailCreateWithoutPolicyInput,
              }
            : undefined,
          marineDetails: oldPolicy.marineDetails
            ? {
                create: {
                  ...oldPolicy.marineDetails,
                  id: undefined,
                  policyId: undefined,
                } as unknown as Prisma.MarineDetailCreateWithoutPolicyInput,
              }
            : undefined,
        },
      });

      await tx.auditLog.create({
        data: {
          tenantId,
          userId,
          action: 'policy.renewed',
          entity: 'Policy',
          entityId: newPolicy.id,
          after: {
            originalPolicyId: oldPolicy.id,
            newPolicyId: newPolicy.id,
          } as Prisma.InputJsonObject,
        },
      });

      // Update old policy's renewal status to drop it from the pipeline
      await tx.policy.update({
        where: { id: oldPolicy.id },
        data: { renewalStatus: 'RENEWED' },
      });

      // Insert Renewal Log
      await tx.renewalLog.create({
        data: {
          tenantId,
          policyId: oldPolicy.id,
          logType: 'STATUS_CHANGE',
          title: 'Policy Renewed',
          details: `Draft policy ${newPolicy.policyNumber} generated.`,
          createdBy: userId,
        },
      });

      return newPolicy;
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleExpiringPolicies() {
    this.logger.log('Running daily policy expiration check...');
    const now = new Date();

    // Find all expired policies individually for audit logging
    const expiredPolicies = await this.prisma.policy.findMany({
      where: {
        status: 'ACTIVE',
        expiryDate: { lt: now },
      },
      select: { id: true, tenantId: true },
    });

    if (expiredPolicies.length === 0) return;

    // Bulk update status
    await this.prisma.policy.updateMany({
      where: {
        status: 'ACTIVE',
        expiryDate: { lt: now },
      },
      data: { status: 'EXPIRED' },
    });

    // Create individual audit logs
    await this.prisma.auditLog.createMany({
      data: expiredPolicies.map((p) => ({
        tenantId: p.tenantId,
        action: 'policy.expired',
        entity: 'Policy',
        entityId: p.id,
      })),
    });

    this.logger.log(
      `Marked ${expiredPolicies.length} policies as EXPIRED with audit logs.`,
    );
  }

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async sendRenewalReminders() {
    this.logger.log('Sending policy renewal reminder emails...');
    const now = new Date();

    // Send reminders for policies expiring in 90, 60, and 30 days
    for (const daysAhead of [90, 60, 30]) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + daysAhead);

      // Find policies expiring on this specific day
      const policies = await this.prisma.policy.findMany({
        where: {
          status: 'ACTIVE',
          expiryDate: {
            gte: new Date(targetDate.setHours(0, 0, 0, 0)),
            lt: new Date(targetDate.setHours(23, 59, 59, 999)),
          },
        },
        include: {
          client: {
            select: {
              email: true,
              firstName: true,
              lastName: true,
              companyName: true,
            },
          },
        },
      });

      for (const policy of policies) {
        if (!policy.client.email) continue;

        const clientName =
          policy.client.companyName ||
          `${policy.client.firstName} ${policy.client.lastName}`;

        try {
          await this.emailService.sendPolicyRenewalReminder(
            policy.client.email,
            clientName,
            policy.policyNumber,
            policy.expiryDate,
            daysAhead,
            Number(policy.premiumAmount),
            policy.insuranceType,
          );

          this.logger.log(
            `Sent ${daysAhead}-day renewal reminder for policy ${policy.policyNumber}`,
          );
        } catch (error) {
          this.logger.error(
            `Failed to send renewal reminder for policy ${policy.policyNumber}`,
            error,
          );
        }
      }
    }

    this.logger.log('Renewal reminder emails sent.');
  }

  async notifyAllForTenant(
    tenantId: string,
  ): Promise<{ sent: number; skipped: number; failed: number }> {
    this.logger.log(`Manual bulk notify triggered for tenant ${tenantId}`);
    const now = new Date();
    let sent = 0,
      skipped = 0,
      failed = 0;

    for (const daysAhead of [90, 60, 30]) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + daysAhead);

      const policies = await this.prisma.policy.findMany({
        where: {
          tenantId,
          status: 'ACTIVE',
          expiryDate: {
            gte: new Date(new Date(targetDate).setHours(0, 0, 0, 0)),
            lt: new Date(new Date(targetDate).setHours(23, 59, 59, 999)),
          },
        },
        include: {
          client: {
            select: {
              email: true,
              firstName: true,
              lastName: true,
              companyName: true,
            },
          },
        },
      });

      for (const policy of policies) {
        if (!policy.client.email) {
          skipped++;
          continue;
        }

        const clientName =
          policy.client.companyName ||
          `${policy.client.firstName} ${policy.client.lastName}`;

        try {
          await this.emailService.sendPolicyRenewalReminder(
            policy.client.email,
            clientName,
            policy.policyNumber,
            policy.expiryDate,
            daysAhead,
            Number(policy.premiumAmount),
            policy.insuranceType,
          );
          sent++;
        } catch (error) {
          this.logger.error(
            `Failed to send reminder for ${policy.policyNumber}`,
            error,
          );
          failed++;
        }
      }
    }

    this.logger.log(
      `Bulk notify complete for tenant ${tenantId}: ${sent} sent, ${skipped} skipped, ${failed} failed`,
    );
    return { sent, skipped, failed };
  }

  async bulkSendReminders(tenantId, policyIds, userId) {
    const policies = await this.prisma.policy.findMany({
      where: { tenantId, id: { in: policyIds } },
      include: {
        client: { select: { email: true, firstName: true, lastName: true, companyName: true } },
        carrier: { select: { name: true } },
      },
    });

    const templates = await this.prisma.renewalTemplate.findMany({
      where: { tenantId, isActive: true },
      orderBy: { triggerDays: 'desc' },
    });

    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { name: true, nicLicense: true, phone: true, email: true },
    });

    let sent = 0, skipped = 0, failed = 0;
    const now = new Date();

    for (const policy of policies) {
      if (!policy.client?.email) { skipped++; continue; }

      const daysUntilExpiry = Math.ceil((policy.expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const tpl = templates.find((t) => t.triggerDays >= daysUntilExpiry) ?? templates[templates.length - 1];

      try {
        if (tpl) {
          const vars = {
            client_first_name: policy.client.firstName || policy.client.companyName || 'Valued Client',
            policy_number: policy.policyNumber,
            insurance_type: policy.insuranceType,
            expiry_date: policy.expiryDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            days_remaining: String(Math.max(0, daysUntilExpiry)),
            current_premium: 'GHS ' + Number(policy.premiumAmount).toLocaleString(),
            carrier_name: policy.carrier ? policy.carrier.name : '',
            vehicle_reg: '',
            property_address: '',
            officer_name: '',
            officer_phone: '',
            agency_name: tenant ? tenant.name : '',
            agency_nic_number: tenant ? tenant.nicLicense : '',
            agency_phone: tenant ? tenant.phone : '',
            agency_email: tenant ? tenant.email : '',
          };
          await this.emailService.sendFromRenewalTemplate(policy.client.email, tpl.subject, tpl.htmlContent, vars);
        } else {
          const clientName = policy.client.companyName || policy.client.firstName + ' ' + policy.client.lastName;
          await this.emailService.sendPolicyRenewalReminder(
            policy.client.email,
            clientName,
            policy.policyNumber,
            policy.expiryDate,
            daysUntilExpiry,
            Number(policy.premiumAmount),
            policy.insuranceType,
          );
        }
        sent++;
        await this.prisma.renewalLog.create({
          data: {
            tenantId,
            policyId: policy.id,
            createdBy: userId,
            logType: 'EMAIL_SENT',
            title: 'Bulk Reminder Sent',
            details: 'Manual bulk reminder dispatched to ' + policy.client.email,
          },
        });
      } catch (error) {
        this.logger.error('Failed bulk reminder for ' + policy.policyNumber, error);
        failed++;
      }
    }

    return { sent, skipped, failed };
  }

  async bulkAssignBroker(tenantId, policyIds, brokerId, userId) {
    await this.prisma.policy.updateMany({
      where: { tenantId, id: { in: policyIds } },
      data: { brokerId },
    });
    const logs = policyIds.map((id) => ({
      tenantId, policyId: id, createdBy: userId,
      logType: 'STATUS_CHANGE',
      title: 'Broker Reassigned',
      details: 'Assigned via bulk action',
    }));
    if (logs.length > 0) await this.prisma.renewalLog.createMany({ data: logs });
    return { success: true, count: policyIds.length };
  }

  async bulkUpdateStatus(tenantId, policyIds, status, userId) {
    await this.prisma.policy.updateMany({
      where: { tenantId, id: { in: policyIds } },
      data: { renewalStatus: status },
    });
    const logs = policyIds.map((id) => ({
      tenantId, policyId: id, createdBy: userId,
      logType: 'STATUS_CHANGE',
      title: 'Status Updated',
      details: 'Bulk status update to ' + status,
    }));
    if (logs.length > 0) await this.prisma.renewalLog.createMany({ data: logs });
    return { success: true, count: policyIds.length };
  }

  async getTemplates(tenantId) {
    return this.prisma.renewalTemplate.findMany({
      where: { tenantId },
      orderBy: { triggerDays: 'desc' },
    });
  }

  async updateTemplate(tenantId, id, data) {
    return this.prisma.renewalTemplate.update({
      where: { id, tenantId },
      data,
    });
  }

  async getRenewalReport(tenantId, days = 90) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    const now = new Date();

    const upcoming = await this.prisma.policy.findMany({
      where: { tenantId, status: 'ACTIVE', expiryDate: { gte: now, lte: futureDate } },
      select: { insuranceType: true, premiumAmount: true },
    });

    const pastDue = await this.prisma.policy.findMany({
      where: { tenantId, expiryDate: { gte: cutoff, lt: now } },
      select: { insuranceType: true, premiumAmount: true, status: true, renewalStatus: true },
    });

    const lapsed = await this.prisma.policy.count({ where: { tenantId, status: 'LAPSED' } });
    const totalDue = pastDue.length;
    const totalRenewed = pastDue.filter(p => p.renewalStatus === 'RENEWED').length;
    const renewalRate = totalDue > 0 ? (totalRenewed / totalDue) * 100 : 0;
    const upcomingRevenue = upcoming.reduce((s, p) => s + Number(p.premiumAmount), 0);
    const atRiskRevenue = upcomingRevenue * ((100 - renewalRate) / 100);

    const typeMap = new Map();
    for (const p of pastDue) {
      if (!typeMap.has(p.insuranceType)) typeMap.set(p.insuranceType, { due: 0, renewed: 0 });
      const entry = typeMap.get(p.insuranceType);
      entry.due++;
      if (p.renewalStatus === 'RENEWED') entry.renewed++;
    }
    const byType = [...typeMap.entries()].map(([insuranceType, { due, renewed }]) => ({
      insuranceType,
      due,
      renewed,
      rate: due > 0 ? (renewed / due) * 100 : 0,
    }));

    return { totalDue, totalRenewed, renewalRate, atRiskRevenue, upcomingRevenue, lapsedCount: lapsed, byType };
  }
}
