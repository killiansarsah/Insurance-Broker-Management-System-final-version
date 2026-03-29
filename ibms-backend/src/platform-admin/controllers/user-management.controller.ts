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
import * as bcrypt from 'bcrypt';

@Controller('platform-admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('PLATFORM_SUPER_ADMIN', 'SUPER_ADMIN')
export class UserManagementController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: PlatformAuditService,
  ) {}

  @Get()
  async findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('tenantId') tenantId?: string,
    @Query('status') status?: string,
  ) {
    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), 100);
    const skip = (pageNum - 1) * limitNum;

    const where: Record<string, unknown> = { deletedAt: null };
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (role) where.userRoleMappings = { some: { role: { name: role } } };
    if (tenantId) where.tenantId = tenantId;
    if (status === 'ACTIVE') where.isActive = true;
    if (status === 'INACTIVE') where.isActive = false;
    if (status === 'LOCKED') where.lockedUntil = { gt: new Date() };
    if (status === 'NEVER_LOGGED_IN') where.lastLoginAt = null;

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          jobTitle: true,
          isActive: true,
          lastLoginAt: true,
          lockedUntil: true,
          createdAt: true,
          tenantId: true,
          tenant: { select: { name: true } },
          userRoleMappings: { select: { role: { select: { name: true } } } },
        },
      }),
      this.prisma.user.count({ where }),
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
  async createPlatformAdmin(
    @Body()
    body: {
      firstName: string;
      lastName: string;
      email: string;
      role: 'PLATFORM_SUPER_ADMIN' | 'SUPER_ADMIN';
      sendWelcomeEmail?: boolean;
    },
    @CurrentUser() user: AuthenticatedUser,
  ) {
    // Only a PLATFORM_SUPER_ADMIN can create another super admin
    if (user.role !== 'PLATFORM_SUPER_ADMIN') {
      throw new HttpException(
        'Only Platform Super Admins can create new super admin accounts',
        HttpStatus.FORBIDDEN,
      );
    }

    const existingUser = await this.prisma.user.findFirst({
      where: { email: body.email },
    });
    if (existingUser)
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);

    const tempPassword = Math.random().toString(36).slice(-10) + 'A1!';
    const passwordHash = await bcrypt.hash(tempPassword, 12);

    // Platform admins belong to the current platform owner's tenant (or pseudo-tenant)
    // Wait, in this schema, user.tenantId is required. They must belong to a tenant.
    const newUser = await this.prisma.user.create({
      data: {
        tenantId: user.tenantId,
        email: body.email,
        passwordHash,
        firstName: body.firstName,
        lastName: body.lastName,
        mustChangePassword: true,
      },
    });

    // Assign role via UserRoleMapping
    const targetRole = await this.prisma.role.findFirst({
      where: { name: body.role, OR: [{ tenantId: user.tenantId }, { tenantId: null, isSystem: true }] },
    });
    if (targetRole) {
      await this.prisma.userRoleMapping.create({
        data: { userId: newUser.id, roleId: targetRole.id },
      });
    }

    await this.audit.log({
      actorId: user.sub,
      actorEmail: user.email,
      actorRole: user.role,
      category: 'USER',
      action: 'SUPER_ADMIN_CREATED',
      resourceType: 'User',
      resourceId: newUser.id,
      description: `New super admin created: ${newUser.email} (${body.role})`,
    });

    return {
      data: { user: { id: newUser.id, email: newUser.email }, tempPassword },
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { role?: any; isActive?: boolean },
    @CurrentUser() user: AuthenticatedUser,
  ) {
    if (id === user.sub && (body.role || body.isActive !== undefined)) {
      throw new HttpException(
        'You cannot modify your own role or active status',
        HttpStatus.BAD_REQUEST,
      );
    }

    const before = await this.prisma.user.findUnique({ where: { id } });
    if (!before)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { isActive: body.isActive },
      select: { id: true, email: true, isActive: true,
        userRoleMappings: { select: { role: { select: { name: true } } } } },
    });
    const updatedRoles = updatedUser.userRoleMappings.map((m: any) => m.role.name);

    await this.audit.log({
      actorId: user.sub,
      actorEmail: user.email,
      actorRole: user.role,
      tenantId: before.tenantId,
      category: 'USER',
      action: 'USER_UPDATED',
      resourceType: 'User',
      resourceId: id,
      description: `User profile updated: ${updatedUser.email}`,
      beforeState: { isActive: before.isActive },
      afterState: { isActive: updatedUser.isActive },
    });

    return { data: { ...updatedUser, roles: updatedRoles, role: updatedRoles[0] ?? 'AGENT' } };
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    if (id === user.sub)
      throw new HttpException(
        'You cannot delete yourself',
        HttpStatus.BAD_REQUEST,
      );

    const targetUser = await this.prisma.user.findUnique({ where: { id } });
    if (!targetUser)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });

    await this.audit.log({
      actorId: user.sub,
      actorEmail: user.email,
      actorRole: user.role,
      tenantId: targetUser.tenantId,
      category: 'USER',
      severity: 'WARN',
      action: 'USER_DELETED',
      resourceType: 'User',
      resourceId: id,
      description: `User permanently deleted: ${targetUser.email}`,
    });

    return { data: { success: true } };
  }

  @Post(':id/reset-password')
  async resetPassword(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const targetUser = await this.prisma.user.findUnique({ where: { id } });
    if (!targetUser)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const tempPassword = Math.random().toString(36).slice(-10) + 'A1!';
    const passwordHash = await bcrypt.hash(tempPassword, 12);

    await this.prisma.user.update({
      where: { id },
      data: { passwordHash, mustChangePassword: true },
    });

    await this.audit.log({
      actorId: user.sub,
      actorEmail: user.email,
      actorRole: user.role,
      tenantId: targetUser.tenantId,
      category: 'USER',
      action: 'PASSWORD_RESET_FORCED',
      resourceType: 'User',
      resourceId: id,
      description: `Password reset forced by super admin for user: ${targetUser.email}`,
    });

    return { data: { tempPassword } };
  }

  @Post(':id/force-logout')
  async forceLogout(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const targetUser = await this.prisma.user.findUnique({ where: { id } });
    if (!targetUser)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    // Invalidate sessions by deleting refresh tokens and bumping lockedUntil purely for session invalidation (auth layer will reject)
    // Wait, locking the user is too aggressive just for logout. Better to just delete refresh tokens.
    await this.prisma.refreshToken.deleteMany({ where: { userId: id } });

    await this.audit.log({
      actorId: user.sub,
      actorEmail: user.email,
      actorRole: user.role,
      tenantId: targetUser.tenantId,
      category: 'AUTH',
      severity: 'WARN',
      action: 'FORCED_LOGOUT',
      resourceType: 'User',
      resourceId: id,
      description: `User forced to logout by super admin: ${targetUser.email}`,
    });

    return { data: { success: true } };
  }

  @Post(':id/unlock')
  async unlockUser(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const targetUser = await this.prisma.user.findUnique({ where: { id } });
    if (!targetUser)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    await this.prisma.user.update({
      where: { id },
      data: { lockedUntil: null, failedAttempts: 0 },
    });

    await this.audit.log({
      actorId: user.sub,
      actorEmail: user.email,
      actorRole: user.role,
      tenantId: targetUser.tenantId,
      category: 'SECURITY',
      action: 'USER_UNLOCKED',
      resourceType: 'User',
      resourceId: id,
      description: `User account unlocked: ${targetUser.email}`,
    });

    return { data: { success: true } };
  }

  @Get('online')
  async getOnlineUsers() {
    const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);
    const users = await this.prisma.user.findMany({
      where: {
        lastLoginAt: { gte: thirtyMinsAgo },
        isActive: true,
        deletedAt: null,
      },
      orderBy: { lastLoginAt: 'desc' },
      take: 50,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        jobTitle: true,
        tenantId: true,
        lastLoginAt: true,
        tenant: { select: { name: true } },
        userRoleMappings: { select: { role: { select: { name: true } } } },
      },
    });

    return { data: users, meta: { total: users.length } };
  }
}
