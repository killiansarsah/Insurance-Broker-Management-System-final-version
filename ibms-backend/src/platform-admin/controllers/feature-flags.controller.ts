import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
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

@Controller('platform-admin/feature-flags')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('PLATFORM_SUPER_ADMIN', 'SUPER_ADMIN')
export class FeatureFlagsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: PlatformAuditService,
  ) {}

  @Get()
  async getFlags() {
    const flags = await this.prisma.featureFlag.findMany({
      include: {
        _count: { select: { overrides: true } },
        updatedBy: { select: { email: true } },
      },
      orderBy: { key: 'asc' },
    });
    return { data: flags };
  }

  @Post()
  async createFlag(
    @Body()
    body: {
      key: string;
      label: string;
      description?: string;
      globalEnabled?: boolean;
      starterEnabled?: boolean;
      proEnabled?: boolean;
      enterpriseEnabled?: boolean;
    },
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const existing = await this.prisma.featureFlag.findUnique({
      where: { key: body.key },
    });
    if (existing)
      throw new HttpException('Flag key already exists', HttpStatus.CONFLICT);

    const flag = await this.prisma.featureFlag.create({
      data: { ...body, updatedById: user.sub },
    });

    await this.audit.log({
      actorId: user.sub,
      actorEmail: user.email,
      actorRole: user.role,
      category: 'SYSTEM',
      action: 'FEATURE_FLAG_CREATED',
      resourceType: 'FeatureFlag',
      resourceId: flag.id,
      description: `Feature flag created: ${flag.key}`,
    });

    return { data: flag };
  }

  @Patch(':id')
  async updateFlag(
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const before = await this.prisma.featureFlag.findUnique({ where: { id } });
    if (!before)
      throw new HttpException('Flag not found', HttpStatus.NOT_FOUND);

    const flag = await this.prisma.featureFlag.update({
      where: { id },
      data: { ...body, updatedById: user.sub },
    });

    await this.audit.log({
      actorId: user.sub,
      actorEmail: user.email,
      actorRole: user.role,
      category: 'SYSTEM',
      action: 'FEATURE_FLAG_UPDATED',
      resourceType: 'FeatureFlag',
      resourceId: id,
      description: `Feature flag updated: ${flag.key}`,
    });

    return { data: flag };
  }

  @Delete(':id')
  async deleteFlag(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const flag = await this.prisma.featureFlag.findUnique({ where: { id } });
    if (!flag) throw new HttpException('Flag not found', HttpStatus.NOT_FOUND);

    await this.prisma.featureFlag.delete({ where: { id } });

    await this.audit.log({
      actorId: user.sub,
      actorEmail: user.email,
      actorRole: user.role,
      category: 'SYSTEM',
      severity: 'WARN',
      action: 'FEATURE_FLAG_DELETED',
      resourceType: 'FeatureFlag',
      resourceId: id,
      description: `Feature flag deleted: ${flag.key}`,
    });

    return { data: { success: true } };
  }
}
