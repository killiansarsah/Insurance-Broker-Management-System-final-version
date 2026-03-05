import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class DepartmentsService {
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
        entity: 'Department',
        entityId,
        after: after ? (after as Prisma.InputJsonObject) : undefined,
      },
    });
  }

  async create(tenantId: string, userId: string, dto: CreateDepartmentDto) {
    // Check unique code within tenant
    const existing = await this.prisma.department.findUnique({
      where: { tenantId_code: { tenantId, code: dto.code } },
    });
    if (existing) {
      throw new BadRequestException(
        `Department with code '${dto.code}' already exists`,
      );
    }

    const dept = await this.prisma.department.create({
      data: {
        tenantId,
        name: dto.name,
        code: dto.code,
        description: dto.description,
        headId: dto.headId,
        branchId: dto.branchId,
        color: dto.color,
      },
    });

    await this.logAudit(tenantId, userId, 'department.created', dept.id);
    return dept;
  }

  async findAll(tenantId: string) {
    const depts = await this.prisma.department.findMany({
      where: { tenantId },
      orderBy: { name: 'asc' },
      include: {
        head: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        branch: {
          select: { id: true, name: true },
        },
      },
    });

    // Attach member count per department
    const counts = await Promise.all(
      depts.map((d) =>
        this.prisma.user.count({
          where: { tenantId, departmentId: d.id, deletedAt: null },
        }),
      ),
    );

    return depts.map((d, i) => ({ ...d, memberCount: counts[i] }));
  }

  async update(
    id: string,
    tenantId: string,
    userId: string,
    dto: UpdateDepartmentDto,
  ) {
    const dept = await this.prisma.department.findFirst({
      where: { id, tenantId },
    });
    if (!dept) throw new NotFoundException(`Department ${id} not found`);

    const updated = await this.prisma.department.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        headId: dto.headId,
        branchId: dto.branchId,
        color: dto.color,
      },
    });

    await this.logAudit(tenantId, userId, 'department.updated', id);
    return updated;
  }

  async remove(id: string, tenantId: string, userId: string) {
    const dept = await this.prisma.department.findFirst({
      where: { id, tenantId },
    });
    if (!dept) throw new NotFoundException(`Department ${id} not found`);

    // Spec: only delete if no users assigned
    const memberCount = await this.prisma.user.count({
      where: { tenantId, departmentId: id, deletedAt: null },
    });
    if (memberCount > 0) {
      throw new BadRequestException(
        `Cannot delete department with ${memberCount} assigned member(s). Reassign users first.`,
      );
    }

    await this.prisma.department.delete({ where: { id } });
    await this.logAudit(tenantId, userId, 'department.deleted', id);
    return { deleted: true };
  }
}
