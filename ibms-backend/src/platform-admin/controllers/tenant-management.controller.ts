import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
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

@Controller('platform-admin/tenants')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('PLATFORM_SUPER_ADMIN')
export class TenantManagementController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: PlatformAuditService,
  ) {}

  @Get()
  async findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('plan') plan?: string,
  ) {
    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), 100);
    const skip = (pageNum - 1) * limitNum;

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
        { nicLicense: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (status) where.tenantStatus = status;
    if (plan) where.plan = plan;

    const [data, total] = await Promise.all([
      this.prisma.tenant.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              users: true,
              policies: true,
              clients: true,
              claims: true,
            },
          },
          subscriptions: {
            where: { status: 'ACTIVE' },
            take: 1,
            select: { amountGhs: true, plan: true },
          },
          nicCompliance: {
            select: { complianceScore: true, expiryDate: true },
          },
        },
      }),
      this.prisma.tenant.count({ where }),
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

  @Post()
  async create(
    @Body()
    body: {
      name: string;
      nicLicenseNumber?: string;
      nicExpiryDate?: string;
      subdomain?: string;
      address?: string;
      phone?: string;
      adminFirstName: string;
      adminLastName: string;
      adminEmail: string;
      adminPhone?: string;
      plan: 'BASIC' | 'PROFESSIONAL' | 'ENTERPRISE';
      billingCycle: 'MONTHLY' | 'ANNUAL';
      trialDays?: number;
      timezone?: string;
      currency?: string;
      sendWelcomeEmail?: boolean;
      customOnboardingNotes?: string;
    },
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const existingSlug = await this.prisma.tenant.findUnique({
      where: { slug },
    });
    if (existingSlug)
      throw new HttpException(
        'A tenant with this name already exists',
        HttpStatus.CONFLICT,
      );

    if (body.subdomain) {
      const existingSub = await this.prisma.tenant.findUnique({
        where: { subdomain: body.subdomain },
      });
      if (existingSub)
        throw new HttpException('Subdomain already taken', HttpStatus.CONFLICT);
    }

    const planAmounts = {
      BASIC: 299.0,
      PROFESSIONAL: 599.0,
      ENTERPRISE: 1299.0,
    };
    const amount = planAmounts[body.plan];

    const tenant = await this.prisma.tenant.create({
      data: {
        name: body.name,
        slug,
        subdomain: body.subdomain ?? slug,
        nicLicense: body.nicLicenseNumber ?? null,
        nicLicenseExpiry: body.nicExpiryDate
          ? new Date(body.nicExpiryDate)
          : null,
        plan: body.plan,
        billingCycle: body.billingCycle,
        tenantStatus: body.trialDays ? 'TRIAL' : 'ACTIVE',
        trialEndsAt: body.trialDays
          ? new Date(Date.now() + body.trialDays * 24 * 60 * 60 * 1000)
          : null,
        address: body.address ?? null,
        phone: body.phone ?? null,
        adminEmail: body.adminEmail,
        customOnboardingNotes: body.customOnboardingNotes ?? null,
      },
    });

    // Create admin user for the tenant
    const bcrypt = await import('bcrypt');
    const tempPassword = Math.random().toString(36).slice(-10) + 'A1!';
    const passwordHash = await bcrypt.hash(tempPassword, 12);

    const adminUser = await this.prisma.user.create({
      data: {
        tenantId: tenant.id,
        email: body.adminEmail,
        passwordHash,
        firstName: body.adminFirstName,
        lastName: body.adminLastName,
        phone: body.adminPhone ?? null,
        mustChangePassword: true,
        role: 'ADMINISTRATOR',
        permissions: [],
      },
    });

    // Note: Roles and Permissions are now managed via the flat SystemRole enum and string arrays,
    // so no database entries need to be cloned per tenant.

    // Create subscription
    const now = new Date();
    const periodEnd =
      body.billingCycle === 'ANNUAL'
        ? new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())
        : new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

    await this.prisma.subscription.create({
      data: {
        tenantId: tenant.id,
        plan: body.plan,
        billingCycle: body.billingCycle,
        amountGhs: amount,
        status: body.trialDays ? 'TRIAL' : 'ACTIVE',
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
      },
    });

    // Create NIC compliance record
    await this.prisma.nicCompliance.create({
      data: {
        tenantId: tenant.id,
        licenceNumber: body.nicLicenseNumber ?? null,
        expiryDate: body.nicExpiryDate ? new Date(body.nicExpiryDate) : null,
      },
    });

    await this.audit.log({
      actorId: user.sub,
      actorEmail: user.email,
      actorRole: user.role,
      tenantId: tenant.id,
      tenantName: tenant.name,
      category: 'TENANT',
      action: 'TENANT_CREATED',
      resourceType: 'Tenant',
      resourceId: tenant.id,
      description: `New tenant provisioned: ${tenant.name} on ${body.plan} plan`,
    });

    return { data: { tenant, tempPassword } };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
      include: {
        _count: {
          select: { users: true, policies: true, clients: true, claims: true },
        },
        subscriptions: { orderBy: { createdAt: 'desc' } },
        nicCompliance: true,
      },
    });
    if (!tenant)
      throw new HttpException('Tenant not found', HttpStatus.NOT_FOUND);
    return { data: tenant };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const before = await this.prisma.tenant.findUnique({ where: { id } });
    if (!before)
      throw new HttpException('Tenant not found', HttpStatus.NOT_FOUND);

    const tenant = await this.prisma.tenant.update({
      where: { id },
      data: body,
    });

    await this.audit.log({
      actorId: user.sub,
      actorEmail: user.email,
      actorRole: user.role,
      tenantId: id,
      tenantName: tenant.name,
      category: 'TENANT',
      action: 'TENANT_UPDATED',
      resourceType: 'Tenant',
      resourceId: id,
      description: `Tenant updated: ${tenant.name}`,
      beforeState: before as unknown as Record<string, unknown>,
      afterState: tenant as unknown as Record<string, unknown>,
    });

    return { data: tenant };
  }

  @Post(':id/suspend')
  async suspend(
    @Param('id') id: string,
    @Body() body: { reason: string },
    @CurrentUser() user: AuthenticatedUser,
  ) {
    if (!body.reason)
      throw new HttpException(
        'Reason is required for suspension',
        HttpStatus.BAD_REQUEST,
      );

    const tenant = await this.prisma.tenant.update({
      where: { id },
      data: { tenantStatus: 'SUSPENDED', isActive: false },
    });

    await this.audit.log({
      actorId: user.sub,
      actorEmail: user.email,
      actorRole: user.role,
      tenantId: id,
      tenantName: tenant.name,
      category: 'TENANT',
      severity: 'WARN',
      action: 'TENANT_SUSPENDED',
      resourceType: 'Tenant',
      resourceId: id,
      description: `Tenant suspended: ${tenant.name}. Reason: ${body.reason}`,
      metadata: { reason: body.reason },
    });

    return { data: tenant };
  }

  @Post(':id/activate')
  async activate(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const tenant = await this.prisma.tenant.update({
      where: { id },
      data: { tenantStatus: 'ACTIVE', isActive: true },
    });

    await this.audit.log({
      actorId: user.sub,
      actorEmail: user.email,
      actorRole: user.role,
      tenantId: id,
      tenantName: tenant.name,
      category: 'TENANT',
      action: 'TENANT_ACTIVATED',
      resourceType: 'Tenant',
      resourceId: id,
      description: `Tenant reactivated: ${tenant.name}`,
    });

    return { data: tenant };
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id } });
    if (!tenant)
      throw new HttpException('Tenant not found', HttpStatus.NOT_FOUND);

    await this.prisma.tenant.delete({ where: { id } });

    await this.audit.log({
      actorId: user.sub,
      actorEmail: user.email,
      actorRole: user.role,
      tenantId: id,
      tenantName: tenant.name,
      category: 'TENANT',
      severity: 'CRITICAL',
      action: 'TENANT_DELETED',
      resourceType: 'Tenant',
      resourceId: id,
      description: `Tenant permanently deleted: ${tenant.name}`,
    });

    return { data: { deleted: true } };
  }

  @Get(':id/health')
  async getTenantHealth(@Param('id') id: string) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id } });
    if (!tenant)
      throw new HttpException('Tenant not found', HttpStatus.NOT_FOUND);

    const [
      userCount,
      policyCount,
      claimCount,
      clientCount,
      lastLogin,
      recentErrors,
      lastAuditEvents,
    ] = await Promise.all([
      this.prisma.user.count({ where: { tenantId: id } }),
      this.prisma.policy.count({ where: { tenantId: id } }),
      this.prisma.claim.count({ where: { tenantId: id } }),
      this.prisma.client.count({ where: { tenantId: id } }),
      this.prisma.user.findFirst({
        where: { tenantId: id, lastLoginAt: { not: null } },
        orderBy: { lastLoginAt: 'desc' },
        select: { lastLoginAt: true },
      }),
      this.prisma.errorLog.count({
        where: {
          tenantId: id,
          createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
      }),
      this.prisma.auditLog.findMany({
        where: { tenantId: id },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    const nicCompliance = await this.prisma.nicCompliance.findUnique({
      where: { tenantId: id },
    });

    return {
      data: {
        tenantName: tenant.name,
        userCount,
        policyCount,
        claimCount,
        clientCount,
        storageUsedMb: tenant.storageUsedMb,
        lastUserLogin: lastLogin?.lastLoginAt ?? null,
        recentErrors,
        nicComplianceScore: nicCompliance?.complianceScore ?? 0,
        lastAuditEvents,
      },
    };
  }

  @Post(':id/export')
  async exportData(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id } });
    if (!tenant)
      throw new HttpException('Tenant not found', HttpStatus.NOT_FOUND);

    const [clients, policies, claims] = await Promise.all([
      this.prisma.client.findMany({ where: { tenantId: id } }),
      this.prisma.policy.findMany({ where: { tenantId: id } }),
      this.prisma.claim.findMany({ where: { tenantId: id } }),
    ]);

    await this.audit.log({
      actorId: user.sub,
      actorEmail: user.email,
      actorRole: user.role,
      tenantId: id,
      tenantName: tenant.name,
      category: 'TENANT',
      action: 'TENANT_DATA_EXPORTED',
      resourceType: 'Tenant',
      resourceId: id,
      description: `Data exported for tenant: ${tenant.name}`,
    });

    return { data: { tenant: tenant.name, clients, policies, claims } };
  }
}
