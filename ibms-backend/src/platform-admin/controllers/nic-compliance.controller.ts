import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { PlatformAuditService } from '../services/platform-audit.service.js';

@Controller('platform-admin/nic-monitoring')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('PLATFORM_SUPER_ADMIN', 'SUPER_ADMIN')
export class NicComplianceController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: PlatformAuditService,
  ) {}

  @Get()
  async getComplianceRecords(
    @Query('page') page = '1',
    @Query('limit') limit = '50',
    @Query('search') search?: string,
    @Query('failedOnly') failedOnly?: string,
  ) {
    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), 100);
    const skip = (pageNum - 1) * limitNum;

    const where: Record<string, unknown> = {};
    if (search) {
      where.tenant = { name: { contains: search, mode: 'insensitive' } };
    }
    if (failedOnly === 'true') {
      where.complianceScore = { lt: 50 };
    }

    const [data, total] = await Promise.all([
      this.prisma.nicCompliance.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { complianceScore: 'asc' },
        include: {
          tenant: { select: { name: true, adminEmail: true, phone: true } },
        },
      }),
      this.prisma.nicCompliance.count({ where }),
    ]);

    return {
      data,
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  @Patch(':tenantId')
  async updateCompliance(
    @Param('tenantId') tenantId: string,
    @Body()
    body: {
      complianceScore?: number;
      segregationCompliant?: boolean;
      levyStatus?: string;
      kycStatus?: string;
      licenceNumber?: string;
      expiryDate?: string;
    },
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const before = await this.prisma.nicCompliance.findUnique({
      where: { tenantId },
    });
    if (!before)
      throw new HttpException(
        'NIC compliance record not found',
        HttpStatus.NOT_FOUND,
      );

    const record = await this.prisma.nicCompliance.update({
      where: { tenantId },
      data: {
        ...body,
        ...(body.expiryDate && { expiryDate: new Date(body.expiryDate) }),
        lastCheckedAt: new Date(),
      },
    });

    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { name: true },
    });

    await this.audit.log({
      actorId: user.sub,
      actorEmail: user.email,
      actorRole: user.role,
      tenantId,
      category: 'COMPLIANCE',
      action: 'NIC_COMPLIANCE_UPDATED',
      resourceType: 'NicCompliance',
      resourceId: tenantId,
      description: `NIC compliance record updated manually for ${tenant?.name || tenantId}`,
      beforeState: before as unknown as Record<string, unknown>,
      afterState: record as unknown as Record<string, unknown>,
    });

    return { data: record };
  }
}
