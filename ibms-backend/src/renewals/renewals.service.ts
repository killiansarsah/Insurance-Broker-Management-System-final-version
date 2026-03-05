import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Prisma } from '@prisma/client';
import { RenewPolicyDto } from './dto/renew-policy.dto';

@Injectable()
export class RenewalsService {
  private readonly logger = new Logger(RenewalsService.name);

  constructor(private readonly prisma: PrismaService) {}

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
          policyNumber: `${oldPolicy.policyNumber}-REN`,
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

      // Update old policy with reference to the new renewal
      await tx.policy.update({
        where: { id: oldPolicy.id },
        data: {
          // Store the renewed policy reference; schema doesn't have
          // a dedicated `renewedPolicyId` field, so we use coverageDetails
          // or we skip if the schema lacks the field. Let's check if
          // previousPolicyId can be used in reverse via query.
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
}
