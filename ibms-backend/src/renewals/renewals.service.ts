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
      },
      orderBy: { expiryDate: 'asc' },
    });

    return policies.map((policy) => {
      const daysUntilExpiry = Math.ceil(
        (new Date(policy.expiryDate).getTime() - now.getTime()) /
          (1000 * 60 * 60 * 24),
      );
      return {
        ...policy,
        daysUntilExpiry,
        renewalStatus: daysUntilExpiry <= 30 ? 'URGENT' : 'UPCOMING',
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

        const clientName = policy.client.companyName || 
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
}
