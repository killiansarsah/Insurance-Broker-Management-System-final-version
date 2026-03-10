import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateNotificationDto,
  NotificationQueryDto,
} from './dto/notification.dto';
import { Prisma } from '@prisma/client';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: NotificationsGateway,
  ) {}

  // Internal method — called by other modules
  async create(tenantId: string, dto: CreateNotificationDto) {
    const notification = await this.prisma.notification.create({
      data: {
        tenantId,
        userId: dto.userId,
        title: dto.title,
        message: dto.message,
        type: dto.type,
        priority: dto.priority ?? 'MEDIUM',
        link: dto.link,
      },
    });

    // Push to connected user in real-time
    this.gateway.sendToUser(dto.userId, {
      id: notification.id,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      priority: notification.priority,
      link: notification.link ?? undefined,
      createdAt: notification.createdAt,
    });

    return notification;
  }

  async findAll(tenantId: string, userId: string, query: NotificationQueryDto) {
    const { page = 1, limit = 20, type, isRead } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.NotificationWhereInput = {
      tenantId,
      userId,
      archived: false,
      ...(type && { type }),
      ...(isRead !== undefined && { read: isRead }),
    };

    const [total, items] = await Promise.all([
      this.prisma.notification.count({ where }),
      this.prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ read: 'asc' }, { createdAt: 'desc' }],
      }),
    ]);

    return {
      items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async unreadCount(tenantId: string, userId: string) {
    const count = await this.prisma.notification.count({
      where: { tenantId, userId, read: false, archived: false },
    });
    return { count };
  }

  async markRead(id: string, tenantId: string, userId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });
    if (
      !notification ||
      notification.tenantId !== tenantId ||
      notification.userId !== userId
    ) {
      throw new NotFoundException('Notification not found');
    }

    return this.prisma.notification.update({
      where: { id },
      data: { read: true, readAt: new Date() },
    });
  }

  async markAllRead(tenantId: string, userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: { tenantId, userId, read: false },
      data: { read: true, readAt: new Date() },
    });
    return { updated: result.count };
  }

  async remove(id: string, tenantId: string, userId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });
    if (
      !notification ||
      notification.tenantId !== tenantId ||
      notification.userId !== userId
    ) {
      throw new NotFoundException('Notification not found');
    }

    await this.prisma.notification.update({
      where: { id },
      data: { archived: true },
    });
    return { deleted: true };
  }
}
