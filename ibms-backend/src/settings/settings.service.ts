import { getUserRoleLevel } from '../common/constants/role-utils.js';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import { PrismaService } from '../prisma/prisma.service';
import {
  UpdateTenantSettingsDto,
  UpdateProfileDto,
  ChangePasswordDto,
} from './dto/settings.dto';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { ROLE_LEVEL } from '../common/constants/role-hierarchy.js';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  private async logAudit(
    tenantId: string,
    userId: string,
    action: string,
    entityId: string,
    after: Record<string, unknown> | null = null,
  ) {
    await this.prisma.auditLog.create({
      data: {
        tenantId,
        userId,
        action,
        entity: 'Settings',
        entityId,
        after: after ? (after as Prisma.InputJsonObject) : undefined,
      },
    });
  }

  // ─── TENANT SETTINGS ─────────────────────────────
  async getTenantSettings(tenantId: string, userId: string) {
    const supervisorLevel = ROLE_LEVEL['SUPERVISOR'] ?? 4;

    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: {
        id: true,
        name: true,
        slug: true,
        logoUrl: true,
        primaryColor: true,
        address: true,
        phone: true,
        email: true,
        nicLicense: true,
        plan: true,
        isActive: true,
        createdAt: true,
      },
    });
    if (!tenant) throw new NotFoundException('Tenant not found');

    const actorLevel = await getUserRoleLevel(this.prisma, userId);
    if (actorLevel < supervisorLevel) {
      const { nicLicense, plan, isActive, createdAt, ...redacted } = tenant;
      return redacted;
    }

    return tenant;
  }

  async updateTenantSettings(
    tenantId: string,
    userId: string,
    dto: UpdateTenantSettingsDto,
  ) {
    const updated = await this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        name: dto.name,
        logoUrl: dto.logoUrl,
        address: dto.address,
        phone: dto.phone,
        email: dto.email,
        primaryColor: dto.primaryColor,
        nicLicense: dto.nicLicense,
      },
    });

    await this.logAudit(tenantId, userId, 'settings.updated', tenantId);
    return updated;
  }

  // ─── USER PROFILE ─────────────────────────────────
  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        avatarUrl: true,
        jobTitle: true,
        role: true,
        twoFactorEnabled: true,
        lastLoginAt: true,
        createdAt: true,
        branch: {
          select: { id: true, name: true },
        },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        avatarUrl: dto.avatarUrl,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        avatarUrl: true,
      },
    });
  }

  // ─── CHANGE PASSWORD ──────────────────────────────
  async changePassword(
    tenantId: string,
    userId: string,
    dto: ChangePasswordDto,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, passwordHash: true },
    });
    if (!user) throw new NotFoundException('User not found');

    const isValid = await bcrypt.compare(
      dto.currentPassword,
      user.passwordHash,
    );
    if (!isValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    if (dto.currentPassword === dto.newPassword) {
      throw new BadRequestException(
        'New password must be different from current password',
      );
    }

    const newHash = await bcrypt.hash(dto.newPassword, 12);

    await this.prisma.$transaction([
      // Update password
      this.prisma.user.update({
        where: { id: userId },
        data: { passwordHash: newHash },
      }),
      // Revoke all refresh tokens (force re-login on other devices)
      this.prisma.refreshToken.deleteMany({
        where: { userId },
      }),
    ]);

    await this.logAudit(tenantId, userId, 'user.password.changed', userId);
    return { message: 'Password changed successfully' };
  }

  // ─── FILE UPLOADS ─────────────────────────────────
  async saveAvatarUrl(userId: string, filename: string) {
    // Remove old uploaded file if it was a local upload
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { avatarUrl: true },
    });
    if (user?.avatarUrl?.startsWith('/uploads/')) {
      const oldPath = join(process.cwd(), user.avatarUrl);
      if (existsSync(oldPath)) unlinkSync(oldPath);
    }

    const avatarUrl = `/uploads/${filename}`;
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
      select: { id: true, avatarUrl: true },
    });
    return updated;
  }

  async saveLogoUrl(tenantId: string, userId: string, filename: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { logoUrl: true },
    });
    if (tenant?.logoUrl?.startsWith('/uploads/')) {
      const oldPath = join(process.cwd(), tenant.logoUrl);
      if (existsSync(oldPath)) unlinkSync(oldPath);
    }

    const logoUrl = `/uploads/${filename}`;
    const updated = await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { logoUrl },
    });
    await this.logAudit(tenantId, userId, 'settings.logo.updated', tenantId);
    return { id: updated.id, logoUrl: updated.logoUrl };
  }
}
