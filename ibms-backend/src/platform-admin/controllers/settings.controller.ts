import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { PlatformAuditService } from '../services/platform-audit.service.js';

@Controller('platform-admin/settings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('PLATFORM_SUPER_ADMIN', 'SUPER_ADMIN')
export class SettingsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: PlatformAuditService,
  ) {}

  @Get()
  async getSettings() {
    const settings = await this.prisma.platformSetting.findMany({
      select: {
        key: true,
        value: true,
        updatedAt: true,
        updatedBy: { select: { email: true } },
      },
    });

    // Convert to a kv map
    const data = settings.reduce(
      (acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      },
      {} as Record<string, unknown>,
    );

    return { data };
  }

  @Patch()
  async updateSettings(
    @Body() body: Record<string, unknown>,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const keys = Object.keys(body);

    // Batch upsert settings
    for (const key of keys) {
      await this.prisma.platformSetting.upsert({
        where: { key },
        update: { value: body[key] as any, updatedById: user.sub },
        create: { key, value: body[key] as any, updatedById: user.sub },
      });
    }

    await this.audit.log({
      actorId: user.sub,
      actorEmail: user.email,
      actorRole: user.role,
      category: 'SYSTEM',
      action: 'SETTINGS_UPDATED',
      description: `Platform settings updated: ${keys.join(', ')}`,
      metadata: { keys },
    });

    return { data: { success: true } };
  }
}
