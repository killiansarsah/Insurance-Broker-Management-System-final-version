import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { ROLE_LEVEL } from '../common/constants/role-hierarchy.js';
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
  jobTitle: string | null;
  branchId: string | null;
  avatarUrl: string | null;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  deletedAt: Date | null;
  role: string;
  permissions: string[];
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
      roles: [user.role],
      role: user.role,
      permissions: user.permissions ?? [],
      jobTitle: user.jobTitle,
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
          jobTitle: true,
          branchId: true,
          avatarUrl: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
          deletedAt: true,
          role: true,
          permissions: true,
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
        jobTitle: true,
        branchId: true,
        avatarUrl: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        deletedAt: true,
        role: true,
        permissions: true,
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
      (ROLE_LEVEL[currentUserRole] ?? 0) >= (ROLE_LEVEL['ADMINISTRATOR'] ?? 0);

    const updateData: Record<string, unknown> = {};

    if (dto.firstName !== undefined) updateData['firstName'] = dto.firstName;
    if (dto.lastName !== undefined) updateData['lastName'] = dto.lastName;
    if (dto.phone !== undefined) updateData['phone'] = dto.phone;
    if (dto.avatarUrl !== undefined) updateData['avatarUrl'] = dto.avatarUrl;

    if (isAdmin) {
      if (dto.jobTitle !== undefined) {
        updateData['jobTitle'] = dto.jobTitle;
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
    } else if (dto.branchId !== undefined || dto.isActive !== undefined) {
      if (!isSelf) {
        throw new HttpException(
          'Insufficient permissions',
          HttpStatus.FORBIDDEN,
        );
      }
    }

    const before = {
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      jobTitle: user.jobTitle,
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
        jobTitle: true,
        branchId: true,
        avatarUrl: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        deletedAt: true,
        role: true,
        permissions: true,
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

  async assignDepartment(
    id: string,
    tenantId: string,
    currentUserId: string,
    departmentId: string | null,
  ) {
    const user = await this.prisma.user.findFirst({
      where: { id, tenantId, deletedAt: null },
    });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    if (departmentId) {
      const dept = await this.prisma.department.findFirst({
        where: { id: departmentId, tenantId },
      });
      if (!dept)
        throw new HttpException('Department not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.user.update({
      where: { id },
      data: { departmentId },
    });

    await this.prisma.auditLog.create({
      data: {
        tenantId,
        userId: currentUserId,
        action: departmentId
          ? 'user.department.assigned'
          : 'user.department.removed',
        entity: 'user',
        entityId: id,
        after: { departmentId } as unknown as Prisma.InputJsonValue,
      },
    });

    return { success: true, departmentId };
  }
  async updatePermissions(
    id: string,
    tenantId: string,
    currentUserId: string,
    currentUserRole: string,
    permissions: string[],
  ) {
    const user = await this.prisma.user.findFirst({
      where: { id, tenantId, deletedAt: null },
    });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    // Cannot modify your own permissions
    if (id === currentUserId) {
      throw new HttpException('Cannot modify your own permissions', HttpStatus.BAD_REQUEST);
    }

    // Cannot modify a user with an equal or higher role tier
    const actorLevel = ROLE_LEVEL[currentUserRole] ?? 0;
    const targetLevel = ROLE_LEVEL[user.role] ?? 0;
    if (targetLevel >= actorLevel) {
      throw new HttpException('Cannot modify permissions of a user at your level or above', HttpStatus.FORBIDDEN);
    }

    const before = { permissions: user.permissions };

    const updated = await this.prisma.user.update({
      where: { id },
      data: { permissions },
      select: {
        id: true, tenantId: true, email: true, firstName: true, lastName: true,
        phone: true, jobTitle: true, branchId: true, avatarUrl: true,
        isActive: true, lastLoginAt: true, createdAt: true, deletedAt: true,
        role: true, permissions: true,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        tenantId,
        userId: currentUserId,
        action: 'user.permissions.updated',
        entity: 'user',
        entityId: id,
        before: before as unknown as Prisma.InputJsonValue,
        after: { permissions } as unknown as Prisma.InputJsonValue,
      },
    });

    return this.toResponseDto(updated as UserRecord);
  }

  async changeRole(
    id: string,
    tenantId: string,
    currentUserId: string,
    currentUserRole: string,
    newRole: string,
    resetPermissions?: boolean,
  ) {
    const user = await this.prisma.user.findFirst({
      where: { id, tenantId, deletedAt: null },
    });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    if (id === currentUserId) {
      throw new HttpException('Cannot change your own role', HttpStatus.BAD_REQUEST);
    }

    const actorLevel = ROLE_LEVEL[currentUserRole] ?? 0;
    const targetLevel = ROLE_LEVEL[user.role] ?? 0;
    const newLevel = ROLE_LEVEL[newRole] ?? 0;

    // Cannot modify a user at or above your level
    if (targetLevel >= actorLevel) {
      throw new HttpException('Cannot modify a user at your level or above', HttpStatus.FORBIDDEN);
    }

    // Cannot assign a role at or above your own level
    if (newLevel >= actorLevel) {
      throw new HttpException('Cannot assign a role at or above your own level', HttpStatus.FORBIDDEN);
    }

    // PLATFORM_SUPER_ADMIN can never be assigned via API
    if (newRole === 'PLATFORM_SUPER_ADMIN') {
      throw new HttpException('Cannot assign PLATFORM_SUPER_ADMIN role', HttpStatus.FORBIDDEN);
    }

    const updateData: Record<string, unknown> = { role: newRole };

    if (resetPermissions) {
      // Lazy-import to avoid circular deps
      const { DEFAULT_ROLE_PERMISSIONS } = await import('../common/constants/default-permissions.js');
      updateData['permissions'] = DEFAULT_ROLE_PERMISSIONS[newRole] ?? [];
    }

    const before = { role: user.role, permissions: user.permissions };

    const updated = await this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true, tenantId: true, email: true, firstName: true, lastName: true,
        phone: true, jobTitle: true, branchId: true, avatarUrl: true,
        isActive: true, lastLoginAt: true, createdAt: true, deletedAt: true,
        role: true, permissions: true,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        tenantId,
        userId: currentUserId,
        action: 'user.role.changed',
        entity: 'user',
        entityId: id,
        before: before as unknown as Prisma.InputJsonValue,
        after: updateData as unknown as Prisma.InputJsonValue,
      },
    });

    return this.toResponseDto(updated as UserRecord);
  }
}
