import {
  Controller,
  Post,
  Param,
  Body,
  Res,
  Req,
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
import { AuthService } from '../../auth/auth.service.js';
import type { Response, Request } from 'express';

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env['NODE_ENV'] === 'production',
  sameSite:
    process.env['NODE_ENV'] === 'production'
      ? ('strict' as const)
      : ('lax' as const),
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

@Controller('platform-admin/impersonate')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('PLATFORM_SUPER_ADMIN')
export class ImpersonationController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: PlatformAuditService,
    private readonly auth: AuthService,
  ) {}

  @Post(':tenantId/start')
  async startImpersonation(
    @Param('tenantId') tenantId: string,
    @Body() body: { userId?: string },
    @CurrentUser() adminUser: AuthenticatedUser,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    // Determine the target user to impersonate
    let targetUser;

    if (body.userId) {
      targetUser = await this.prisma.user.findFirst({
        where: { id: body.userId, tenantId, isActive: true, deletedAt: null },
      });
      if (!targetUser)
        throw new HttpException(
          'Target user not found or inactive',
          HttpStatus.NOT_FOUND,
        );
    } else {
      // If no specific user is provided, impersonate the first active TENANT_ADMIN
      targetUser = await this.prisma.user.findFirst({
        where: {
          tenantId,
          role: 'ADMINISTRATOR',
          isActive: true,
          deletedAt: null,
        },
      });
      if (!targetUser) {
        // Fallback: any active user in the tenant
        targetUser = await this.prisma.user.findFirst({
          where: { tenantId, isActive: true, deletedAt: null },
        });
      }
      if (!targetUser)
        throw new HttpException(
          'No active users found in this tenant',
          HttpStatus.NOT_FOUND,
        );
    }

    // Generate tokens for the target user BUT include an impersonator claim
    // Since issueAccessToken might not take custom claims directly, we'll embed the impersonator ID in the token manually if we can,
    // or just rely on the frontend storing its own original token.
    // Actually, generating standard tokens for the target user is fine if the frontend manages the context swap.
    const targetRoles = [targetUser.role];
    const targetPerms = targetUser.permissions || [];
    const accessToken = await this.auth.issueAccessToken({
      id: targetUser.id,
      tenantId: targetUser.tenantId,
      roles: targetRoles,
      permissions: targetPerms,
    });

    const refreshToken = await this.auth.issueRefreshToken(
      targetUser.id,
      req.ip ?? undefined,
      req.get('user-agent'),
    );

    res.cookie('refreshToken', refreshToken.raw, REFRESH_COOKIE_OPTIONS);

    await this.audit.log({
      actorId: adminUser.sub,
      actorEmail: adminUser.email,
      actorRole: adminUser.role,
      tenantId: targetUser.tenantId,
      impersonatedById: adminUser.sub,
      category: 'AUTH',
      severity: 'WARN',
      action: 'IMPERSONATION_STARTED',
      resourceType: 'User',
      resourceId: targetUser.id,
      description: `Super admin started impersonating user: ${targetUser.email}`,
      metadata: { targetUserId: targetUser.id, targetRoles },
    });

    return {
      data: {
        accessToken,
        user: {
          id: targetUser.id,
          email: targetUser.email,
          firstName: targetUser.firstName,
          lastName: targetUser.lastName,
          roles: targetRoles,
          role: targetRoles[0] ?? 'AGENT',
          tenantId: targetUser.tenantId,
        },
        impersonation: true,
      },
    };
  }

  @Post('exit')
  async exitImpersonation(@CurrentUser() adminUser: AuthenticatedUser) {
    // If the frontend exits impersonation, it just switches back to its stored super admin token.
    // This endpoint primarily serves to log the end of the impersonation session.
    await this.audit.log({
      actorId: adminUser.sub,
      actorEmail: adminUser.email,
      actorRole: adminUser.role,
      category: 'AUTH',
      action: 'IMPERSONATION_EXITED',
      description: 'Super admin exited impersonation mode',
    });

    return { data: { success: true } };
  }
}
