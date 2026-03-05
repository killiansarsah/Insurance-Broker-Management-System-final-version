import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateTaskDto,
  TaskQueryDto,
  UpdateTaskDto,
  UpdateTaskStatusDto,
} from './dto/task.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TasksService {
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
        entity: 'Task',
        entityId,
        after: after ? (after as Prisma.InputJsonObject) : undefined,
      },
    });
  }

  async create(tenantId: string, userId: string, dto: CreateTaskDto) {
    const task = await this.prisma.task.create({
      data: {
        tenantId,
        title: dto.title,
        description: dto.description,
        priority: dto.priority,
        status: 'PENDING',
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        assignedToId: dto.assignedToId ?? userId,
        createdById: userId,
        type: dto.type,
        link: dto.link,
      },
    });
    await this.logAudit(tenantId, userId, 'task.created', task.id);
    return task;
  }

  async findAll(tenantId: string, query: TaskQueryDto) {
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

    const where: Prisma.TaskWhereInput = {
      tenantId,
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
        orderBy: { [sortBy === 'createdAt' ? 'createdAt' : sortBy]: sortOrder },
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

  async findOne(id: string, tenantId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id, tenantId },
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
    const task = await this.findOne(id, tenantId);

    const updated = await this.prisma.task.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        priority: dto.priority,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        assignedToId: dto.assignedToId,
      },
    });

    if (dto.assignedToId && dto.assignedToId !== task.assignedToId) {
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
    const task = await this.findOne(id, tenantId);
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
