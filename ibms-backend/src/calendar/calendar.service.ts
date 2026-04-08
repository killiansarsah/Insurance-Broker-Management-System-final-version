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
import { ROLE_LEVEL } from '../common/constants/role-hierarchy.js';

@Injectable()
export class CalendarService {
  constructor(private readonly prisma: PrismaService) {}

  private async buildEventScopeWhere(
    tenantId: string,
    userId: string,
  ): Promise<Prisma.CalendarEventWhereInput> {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    const actorLevel = user ? (ROLE_LEVEL[user.role] ?? 0) : 0;
    const supervisorLevel = ROLE_LEVEL['SUPERVISOR'] ?? 4;

    if (actorLevel >= supervisorLevel) {
      return { tenantId };
    }

    return {
      tenantId,
      OR: [{ createdById: userId }, { attendees: { some: { userId } } }],
    };
  }

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
    return this.findOne(event.id, tenantId, userId);
  }

  async findAll(tenantId: string, userId: string, from: string, to: string) {
    try {
      const fromDate = new Date(from);
      const toDate = new Date(to);

      if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
        throw new BadRequestException(
          'Invalid date format. Use ISO 8601 format (YYYY-MM-DD)',
        );
      }

      const diffDays =
        (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays > 90) {
        throw new BadRequestException('Maximum date range is 90 days');
      }

      const scopeWhere = await this.buildEventScopeWhere(tenantId, userId);

      return await this.prisma.calendarEvent.findMany({
        where: {
          ...scopeWhere,
          status: { not: 'CANCELLED' },
          OR: [
            {
              // Events that start within the range
              AND: [
                { startDate: { gte: fromDate } },
                { startDate: { lte: toDate } },
              ],
            },
            {
              // Events that end within the range
              AND: [
                { endDate: { gte: fromDate } },
                { endDate: { lte: toDate } },
              ],
            },
            {
              // Events that span the entire range
              AND: [
                { startDate: { lte: fromDate } },
                { endDate: { gte: toDate } },
              ],
            },
          ],
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
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Calendar findAll error:', error);
      throw new BadRequestException('Failed to fetch calendar events');
    }
  }

  async findOne(id: string, tenantId: string, userId: string) {
    const scopeWhere = await this.buildEventScopeWhere(tenantId, userId);

    const event = await this.prisma.calendarEvent.findFirst({
      where: { id, ...scopeWhere },
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
    const event = await this.findOne(id, tenantId, userId);
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
    const event = await this.findOne(id, tenantId, userId);
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
