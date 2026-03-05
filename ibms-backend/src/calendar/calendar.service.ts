import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateCalendarEventDto,
  UpdateCalendarEventDto,
} from './dto/calendar.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CalendarService {
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
        entity: 'CalendarEvent',
        entityId,
        after: after ? (after as Prisma.InputJsonObject) : undefined,
      },
    });
  }

  async create(tenantId: string, userId: string, dto: CreateCalendarEventDto) {
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    if (endDate <= startDate) {
      throw new BadRequestException('endDate must be after startDate');
    }

    const event = await this.prisma.calendarEvent.create({
      data: {
        tenantId,
        title: dto.title,
        description: dto.description,
        startDate,
        endDate,
        type: dto.type,
        location: dto.location,
        createdById: userId,
      },
    });

    // Add creator as attendee
    await this.prisma.calendarAttendee.create({
      data: { eventId: event.id, userId },
    });

    // Add additional attendees
    if (dto.attendeeIds?.length) {
      const attendeeData = dto.attendeeIds
        .filter((id) => id !== userId)
        .map((id) => ({ eventId: event.id, userId: id }));
      if (attendeeData.length) {
        await this.prisma.calendarAttendee.createMany({ data: attendeeData });
      }
    }

    await this.logAudit(tenantId, userId, 'event.created', event.id);
    return this.findOne(event.id, tenantId);
  }

  async findAll(tenantId: string, userId: string, from: string, to: string) {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    const diffDays =
      (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays > 90) {
      throw new BadRequestException('Maximum date range is 90 days');
    }

    return this.prisma.calendarEvent.findMany({
      where: {
        tenantId,
        startDate: { gte: fromDate },
        endDate: { lte: toDate },
        OR: [{ createdById: userId }, { attendees: { some: { userId } } }],
      },
      orderBy: { startDate: 'asc' },
      include: {
        attendees: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        },
        createdBy: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });
  }

  async findOne(id: string, tenantId: string) {
    const event = await this.prisma.calendarEvent.findUnique({
      where: { id, tenantId },
      include: {
        attendees: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        createdBy: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });
    if (!event) throw new NotFoundException(`Event ${id} not found`);
    return event;
  }

  async update(
    id: string,
    tenantId: string,
    userId: string,
    dto: UpdateCalendarEventDto,
  ) {
    const event = await this.findOne(id, tenantId);
    if (event.createdById !== userId) {
      throw new ForbiddenException('Only the creator can edit this event');
    }

    return this.prisma.calendarEvent.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        location: dto.location,
      },
    });
  }

  async remove(id: string, tenantId: string, userId: string) {
    const event = await this.findOne(id, tenantId);
    if (event.createdById !== userId) {
      throw new ForbiddenException('Only the creator can delete this event');
    }

    await this.prisma.calendarEvent.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
    await this.logAudit(tenantId, userId, 'event.deleted', id);
    return { deleted: true };
  }
}
