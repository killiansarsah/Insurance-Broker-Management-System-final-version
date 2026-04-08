import { getUserRoleLevel } from '../common/constants/role-utils.js';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import {
  CreateTaskDto,
  TaskQueryDto,
  UpdateTaskDto,
  UpdateTaskStatusDto,
} from './dto/task.dto';
import { Prisma } from '@prisma/client';
import {
  ROLE_LEVEL,
} from '../common/constants/role-hierarchy.js';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

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
        entity: 'Task',
        entityId,
        after: after ? (after as Prisma.InputJsonObject) : undefined,
      },
    });
  }

  private async assertTaskWritableByActor(
    tenantId: string,
    userId: string,
    task: { createdById: string; assignedToId: string | null },
  ): Promise<void> {
    const actorLevel = await getUserRoleLevel(this.prisma, userId);
    const supervisorLevel = ROLE_LEVEL['SUPERVISOR'] ?? 4;

    // Supervisory roles can manage tasks tenant-wide.
    if (actorLevel >= supervisorLevel) return;

    // Agent-level users can only manage tasks they created or are assigned.
    if (task.createdById !== userId && task.assignedToId !== userId) {
      throw new BadRequestException(
        'You can only manage tasks you created or are assigned to',
      );
    }
  }

  private async buildTaskScopeWhere(
    tenantId: string,
    userId: string,
  ): Promise<Prisma.TaskWhereInput> {
    const actorLevel = await getUserRoleLevel(this.prisma, userId);
    const supervisorLevel = ROLE_LEVEL['SUPERVISOR'] ?? 4;

    if (actorLevel >= supervisorLevel) {
      return { tenantId };
    }

    return {
      tenantId,
      OR: [{ createdById: userId }, { assignedToId: userId }],
    };
  }

  async create(tenantId: string, userId: string, dto: CreateTaskDto) {
    const actorLevel = await getUserRoleLevel(this.prisma, userId);
    const supervisorLevel = ROLE_LEVEL['SUPERVISOR'] ?? 4;
    const requestedAssigneeId = dto.assignedToId ?? userId;

    if (actorLevel < supervisorLevel && requestedAssigneeId !== userId) {
      throw new BadRequestException(
        'You can only assign tasks to yourself',
      );
    }

    const task = await this.prisma.task.create({
      data: {
        tenantId,
        title: dto.title,
        description: dto.description,
        priority: dto.priority,
        status: 'PENDING',
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        assignedToId: requestedAssigneeId,
        createdById: userId,
        type: dto.type,
        link: dto.link,
      },
      include: {
        assignedTo: {
          select: { firstName: true, lastName: true, email: true },
        },
        createdBy: { select: { firstName: true, lastName: true } },
      },
    });

    if (task.assignedTo?.email && task.dueDate) {
      await this.emailService.sendTaskAssignment(
        task.assignedTo.email,
        task.assignedTo.firstName,
        task.title,
        task.description || '',
        task.dueDate,
        task.priority,
        `${task.createdBy.firstName} ${task.createdBy.lastName}`,
      );
    }

    await this.logAudit(tenantId, userId, 'task.created', task.id);
    return task;
  }

  async findAll(tenantId: string, userId: string, query: TaskQueryDto) {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      priority,
      assignedToId,
      dateFrom,
      dateTo,
      type,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;

    const scopeWhere = await this.buildTaskScopeWhere(tenantId, userId);

    const where: Prisma.TaskWhereInput = {
      ...scopeWhere,
      ...(status && { status }),
      ...(priority && { priority }),
      ...(assignedToId && { assignedToId }),
      ...(type && { type }),
      ...((dateFrom || dateTo) && {
        dueDate: {
          ...(dateFrom && { gte: new Date(dateFrom) }),
          ...(dateTo && { lte: new Date(dateTo) }),
        },
      }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [total, items] = await Promise.all([
      this.prisma.task.count({ where }),
      this.prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [[
            'createdAt',
            'updatedAt',
            'dueDate',
            'title',
            'status',
            'priority',
          ].includes(sortBy)
            ? sortBy
            : 'createdAt']: sortOrder,
        },
        include: {
          assignedTo: {
            select: { id: true, firstName: true, lastName: true },
          },
          createdBy: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      }),
    ]);

    return {
      items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findMyTasks(tenantId: string, userId: string) {
    return this.prisma.task.findMany({
      where: { tenantId, assignedToId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });
  }

  async findOne(id: string, tenantId: string, userId?: string) {
    const scopeWhere = userId
      ? await this.buildTaskScopeWhere(tenantId, userId)
      : ({ tenantId } as Prisma.TaskWhereInput);

    const task = await this.prisma.task.findFirst({
      where: { id, ...scopeWhere },
      include: {
        assignedTo: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        createdBy: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return task;
  }

  async update(
    id: string,
    tenantId: string,
    userId: string,
    dto: UpdateTaskDto,
  ) {
    const task = await this.findOne(id, tenantId, userId);
    await this.assertTaskWritableByActor(tenantId, userId, task);

    const actorLevel = await getUserRoleLevel(this.prisma, userId);
    const supervisorLevel = ROLE_LEVEL['SUPERVISOR'] ?? 4;
    if (
      actorLevel < supervisorLevel &&
      dto.assignedToId !== undefined &&
      dto.assignedToId !== userId
    ) {
      throw new BadRequestException(
        'You can only assign tasks to yourself',
      );
    }

    const updated = await this.prisma.task.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        priority: dto.priority,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        assignedToId: dto.assignedToId,
        ...(dto.isCompleted !== undefined && {
          isCompleted: dto.isCompleted,
          completedAt: dto.isCompleted ? new Date() : null,
          status: dto.isCompleted ? 'REGISTERED' : 'PENDING',
        }),
        ...(dto.status !== undefined && { status: dto.status }),
      },
      include: {
        assignedTo: {
          select: { firstName: true, lastName: true, email: true },
        },
        createdBy: { select: { firstName: true, lastName: true } },
      },
    });

    if (
      dto.assignedToId &&
      dto.assignedToId !== task.assignedToId &&
      updated.assignedTo?.email &&
      updated.dueDate
    ) {
      await this.emailService.sendTaskAssignment(
        updated.assignedTo.email,
        updated.assignedTo.firstName,
        updated.title,
        updated.description || '',
        updated.dueDate,
        updated.priority,
        `${updated.createdBy.firstName} ${updated.createdBy.lastName}`,
      );
      await this.logAudit(tenantId, userId, 'task.reassigned', id, {
        oldAssignee: task.assignedToId,
        newAssignee: dto.assignedToId,
      });
    } else {
      await this.logAudit(tenantId, userId, 'task.updated', id);
    }

    return updated;
  }

  async changeStatus(
    id: string,
    tenantId: string,
    userId: string,
    dto: UpdateTaskStatusDto,
  ) {
    const task = await this.findOne(id, tenantId, userId);
    await this.assertTaskWritableByActor(tenantId, userId, task);

    const oldStatus = task.status;

    const isCompleted = dto.status === 'REGISTERED'; // closest to DONE in schema

    const updated = await this.prisma.task.update({
      where: { id },
      data: {
        status: dto.status,
        isCompleted,
        completedAt: isCompleted ? new Date() : undefined,
      },
    });

    await this.logAudit(tenantId, userId, 'task.status.changed', id, {
      oldStatus,
      newStatus: dto.status,
    });
    return updated;
  }
}
