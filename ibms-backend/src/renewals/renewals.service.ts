import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PoliciesService } from '../policies/policies.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Prisma } from '@prisma/client';

@Injectable()
export class RenewalsService {
  private readonly logger = new Logger(RenewalsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly policiesService: PoliciesService,
  ) {}

  async getUpcomingRenewals(tenantId: string) {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    return this.prisma.policy.findMany({
      where: {
        tenantId,
        status: 'ACTIVE',
        expiryDate: {
          lte: thirtyDaysFromNow,
          gte: new Date(),
        },
      },
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
  }

  async renewPolicy(id: string, tenantId: string, userId: string) {
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
          sumInsured: oldPolicy.sumInsured,
          premiumAmount: oldPolicy.premiumAmount,
          premiumFrequency: oldPolicy.premiumFrequency,
          commissionRate: oldPolicy.commissionRate,
          commissionAmount: oldPolicy.commissionAmount,
          currency: oldPolicy.currency,
          status: 'DRAFT',
          isRenewal: true,
          previousPolicyId: oldPolicy.id,
          coverageDetails: oldPolicy.coverageDetails,
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
          action: 'policy.renewal_created',
          entity: 'Policy',
          entityId: newPolicy.id,
          after: newPolicy as unknown as Prisma.InputJsonObject,
        },
      });

      return newPolicy;
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleExpiringPolicies() {
    this.logger.log('Running daily policy expiration check...');
    const now = new Date();

    const result = await this.prisma.policy.updateMany({
      where: {
        status: 'ACTIVE',
        expiryDate: { lt: now },
      },
      data: { status: 'LAPSED' },
    });

    if (result.count > 0) {
      this.logger.log(`Marked ${result.count} policies as LAPSED.`);
    }
  }
}
