import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  ROLE_LEVEL,
  canAssignRole,
} from '../common/constants/role-hierarchy.js';
import { Prisma } from '@prisma/client';
import type { UpdateUserDto } from './dto/update-user.dto.js';
import type { UserQueryDto } from './dto/user-query.dto.js';

interface UserRecord {
  id: string;
  tenantId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: string;
  branchId: string | null;
  avatarUrl: string | null;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  deletedAt: Date | null;
}

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private prisma: PrismaService) {}

  private toResponseDto(user: UserRecord) {
    return {
      id: user.id,
      tenantId: user.tenantId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      branchId: user.branchId,
      avatarUrl: user.avatarUrl,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
    };
  }

  async findAll(tenantId: string, query: UserQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
      tenantId,
      deletedAt: null,
    };

    if (query.role) where['role'] = query.role;
    if (query.isActive !== undefined) where['isActive'] = query.isActive;
    if (query.branchId) where['branchId'] = query.branchId;

    if (query.search) {
      where['OR'] = [
        { firstName: { contains: query.search, mode: 'insensitive' } },
        { lastName: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          tenantId: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          branchId: true,
          avatarUrl: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
          deletedAt: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: items.map((u) => this.toResponseDto(u as UserRecord)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, tenantId: string) {
    const user = (await this.prisma.user.findFirst({
      where: { id, tenantId, deletedAt: null },
      select: {
        id: true,
        tenantId: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        branchId: true,
        avatarUrl: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        deletedAt: true,
      },
    })) as UserRecord | null;

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return this.toResponseDto(user);
  }

  async update(
    id: string,
    tenantId: string,
    currentUserId: string,
    currentUserRole: string,
    dto: UpdateUserDto,
  ) {
    const user = (await this.prisma.user.findFirst({
      where: { id, tenantId, deletedAt: null },
    })) as UserRecord | null;

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isSelf = id === currentUserId;
    const isAdmin =
      (ROLE_LEVEL[currentUserRole] ?? 0) >= (ROLE_LEVEL['ADMIN'] ?? 0);

    // Build update data based on permissions
    const updateData: Record<string, unknown> = {};

    // Self can update: firstName, lastName, phone, avatarUrl
    if (dto.firstName !== undefined) updateData['firstName'] = dto.firstName;
    if (dto.lastName !== undefined) updateData['lastName'] = dto.lastName;
    if (dto.phone !== undefined) updateData['phone'] = dto.phone;
    if (dto.avatarUrl !== undefined) updateData['avatarUrl'] = dto.avatarUrl;

    // Admin+ can also update: role, branchId, isActive
    if (isAdmin) {
      if (dto.role !== undefined) {
        if (!canAssignRole(currentUserRole, dto.role)) {
          throw new HttpException(
            'Cannot assign role higher than your own',
            HttpStatus.FORBIDDEN,
          );
        }
        updateData['role'] = dto.role;
      }
      if (dto.branchId !== undefined) updateData['branchId'] = dto.branchId;
      if (dto.isActive !== undefined) {
        if (isSelf && !dto.isActive) {
          throw new HttpException(
            'Cannot deactivate yourself',
            HttpStatus.BAD_REQUEST,
          );
        }
        updateData['isActive'] = dto.isActive;
      }
    } else if (
      dto.role !== undefined ||
      dto.branchId !== undefined ||
      dto.isActive !== undefined
    ) {
      // Non-admin trying to update admin-only fields
      if (!isSelf) {
        throw new HttpException(
          'Insufficient permissions',
          HttpStatus.FORBIDDEN,
        );
      }
      // Ignore admin-only fields silently for self
    }

    const before = {
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      branchId: user.branchId,
      isActive: user.isActive,
    };

    const updated = (await this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        tenantId: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        branchId: true,
        avatarUrl: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        deletedAt: true,
      },
    })) as UserRecord;

    await this.prisma.auditLog.create({
      data: {
        tenantId,
        userId: currentUserId,
        action: 'user.updated',
        entity: 'user',
        entityId: id,
        before: before as unknown as Prisma.InputJsonValue,
        after: updateData as unknown as Prisma.InputJsonValue,
      },
    });

    return this.toResponseDto(updated);
  }

  async deactivate(id: string, tenantId: string, currentUserId: string) {
    if (id === currentUserId) {
      throw new HttpException(
        'Cannot deactivate yourself',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.prisma.user.findFirst({
      where: { id, tenantId, deletedAt: null },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    await this.prisma.refreshToken.updateMany({
      where: { userId: id },
      data: { revokedAt: new Date() },
    });

    await this.prisma.auditLog.create({
      data: {
        tenantId,
        userId: currentUserId,
        action: 'user.deactivated',
        entity: 'user',
        entityId: id,
      },
    });

    return { success: true };
  }

  async reactivate(id: string, tenantId: string, currentUserId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, tenantId, deletedAt: null },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.user.update({
      where: { id },
      data: { isActive: true },
    });

    await this.prisma.auditLog.create({
      data: {
        tenantId,
        userId: currentUserId,
        action: 'user.reactivated',
        entity: 'user',
        entityId: id,
      },
    });

    return { success: true };
  }

  async softDelete(id: string, tenantId: string, currentUserId: string) {
    if (id === currentUserId) {
      throw new HttpException('Cannot delete yourself', HttpStatus.BAD_REQUEST);
    }

    const user = await this.prisma.user.findFirst({
      where: { id, tenantId, deletedAt: null },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await this.prisma.refreshToken.updateMany({
      where: { userId: id },
      data: { revokedAt: new Date() },
    });

    await this.prisma.auditLog.create({
      data: {
        tenantId,
        userId: currentUserId,
        action: 'user.deleted',
        entity: 'user',
        entityId: id,
      },
    });

    return { success: true };
  }
}
