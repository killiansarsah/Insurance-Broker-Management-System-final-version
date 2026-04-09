import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { google, calendar_v3 } from 'googleapis';
import { PrismaService } from '../../prisma/prisma.service';
import { GoogleOAuthService } from './google-oauth.service';
import { Prisma, CalendarEventType } from '@prisma/client';

@Injectable()
export class GoogleCalendarService {
  private readonly logger = new Logger(GoogleCalendarService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly googleOAuth: GoogleOAuthService,
  ) {}

  /** Get an authenticated Google Calendar API instance. */
  private async getCalendarApi(
    tenantId: string,
  ): Promise<calendar_v3.Calendar> {
    const auth = await this.googleOAuth.getAuthenticatedClient(
      tenantId,
      'google-calendar',
    );
    return google.calendar({ version: 'v3', auth });
  }

  /**
   * Push Brokerium events to Google Calendar.
   * Creates/updates events that don't yet have a googleEventId, or whose data changed.
   */
  async pushToGoogle(
    tenantId: string,
  ): Promise<{ pushed: number; errors: string[] }> {
    const calendar = await this.getCalendarApi(tenantId);

    // Get all non-cancelled events, with attendees for push
    const events = await this.prisma.calendarEvent.findMany({
      where: {
        tenantId,
        status: { not: 'CANCELLED' },
      },
      include: {
        attendees: {
          include: {
            user: { select: { email: true, firstName: true, lastName: true } },
          },
        },
      },
      orderBy: { startDate: 'asc' },
      take: 200,
    });

    let pushed = 0;
    const errors: string[] = [];

    for (const event of events) {
      try {
        const googleEvent: calendar_v3.Schema$Event = {
          summary: event.title,
          description: event.description ?? undefined,
          location: event.location ?? undefined,
          start: {
            dateTime: event.startDate.toISOString(),
            timeZone: 'UTC',
          },
          end: {
            dateTime: event.endDate.toISOString(),
            timeZone: 'UTC',
          },
          attendees: event.attendees
            .filter((a) => a.user.email)
            .map((a) => ({
              email: a.user.email,
              displayName: `${a.user.firstName} ${a.user.lastName}`.trim(),
            })),
        };

        if (event.googleEventId) {
          // Update existing Google event
          await calendar.events.update({
            calendarId: 'primary',
            eventId: event.googleEventId,
            requestBody: googleEvent,
            sendUpdates: 'none',
          });
        } else {
          // Create new Google event
          const created = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: googleEvent,
            sendUpdates: 'none',
          });

          if (created.data.id) {
            await this.prisma.calendarEvent.update({
              where: { id: event.id },
              data: { googleEventId: created.data.id },
            });
          }
        }
        pushed++;
      } catch (err: any) {
        const msg = `Failed to push event "${event.title}": ${err.message ?? err}`;
        this.logger.warn(msg);
        errors.push(msg);
      }
    }

    // Log sync event
    await this.logSyncEvent(tenantId, 'push', pushed, errors.length);

    return { pushed, errors };
  }

  /**
   * Pull events from Google Calendar into Brokerium.
   * Imports events from the last 30 days to 90 days ahead.
   */
  async pullFromGoogle(
    tenantId: string,
    userId: string,
  ): Promise<{ pulled: number; skipped: number; errors: string[] }> {
    const calendar = await this.getCalendarApi(tenantId);

    const now = new Date();
    const timeMin = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const timeMax = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
      maxResults: 500,
    });

    const googleEvents = response.data.items ?? [];
    let pulled = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const gEvent of googleEvents) {
      if (!gEvent.id || !gEvent.summary) {
        skipped++;
        continue;
      }

      try {
        // Check if already imported
        const existing = await this.prisma.calendarEvent.findFirst({
          where: { tenantId, googleEventId: { equals: gEvent.id } },
        });

        const startDate = new Date(
          gEvent.start?.dateTime ?? gEvent.start?.date ?? now,
        );
        const endDate = new Date(
          gEvent.end?.dateTime ?? gEvent.end?.date ?? startDate,
        );

        if (existing) {
          // Update existing Brokerium event from Google
          await this.prisma.calendarEvent.update({
            where: { id: existing.id },
            data: {
              title: gEvent.summary,
              description: gEvent.description ?? null,
              startDate,
              endDate,
              location: gEvent.location ?? null,
            },
          });
        } else {
          // Create new Brokerium event from Google
          const newEvent = await this.prisma.calendarEvent.create({
            data: {
              tenantId,
              title: gEvent.summary,
              description: gEvent.description ?? null,
              startDate,
              endDate,
              type: this.mapGoogleEventType(gEvent),
              location: gEvent.location ?? null,
              googleEventId: gEvent.id,
              createdById: userId,
            },
          });
          // Add current user as attendee so they can see the event
          await this.prisma.calendarAttendee.create({
            data: {
              eventId: newEvent.id,
              userId,
            },
          });
        }
        pulled++;
      } catch (err: any) {
        const msg = `Failed to pull "${gEvent.summary}": ${err.message ?? err}`;
        this.logger.warn(msg);
        errors.push(msg);
      }
    }

    await this.logSyncEvent(tenantId, 'pull', pulled, errors.length);

    this.logger.log(
      `Pull completed: ${pulled} pulled, ${skipped} skipped, ${errors.length} errors`,
    );
    return { pulled, skipped, errors };
  }

  /**
   * Full bi-directional sync: push local → Google, then pull Google → local.
   */
  async syncAll(
    tenantId: string,
    userId: string,
  ): Promise<{
    push: { pushed: number; errors: string[] };
    pull: { pulled: number; skipped: number; errors: string[] };
  }> {
    const push = await this.pushToGoogle(tenantId);
    const pull = await this.pullFromGoogle(tenantId, userId);
    return { push, pull };
  }

  /**
   * Delete a Google Calendar event when an Brokerium event is cancelled.
   */
  async deleteFromGoogle(
    tenantId: string,
    googleEventId: string,
  ): Promise<void> {
    try {
      const calendar = await this.getCalendarApi(tenantId);
      await calendar.events.delete({
        calendarId: 'primary',
        eventId: googleEventId,
        sendUpdates: 'none',
      });
    } catch (err: any) {
      this.logger.warn(
        `Failed to delete Google event ${googleEventId}: ${err.message}`,
      );
    }
  }

  /** Map a Google event to the closest Brokerium CalendarEventType. */
  private mapGoogleEventType(
    gEvent: calendar_v3.Schema$Event,
  ): CalendarEventType {
    const summary = (gEvent.summary ?? '').toLowerCase();
    if (summary.includes('policy') || summary.includes('renewal'))
      return 'POLICY';
    if (summary.includes('claim')) return 'CLAIM';
    if (summary.includes('team') || summary.includes('standup')) return 'TEAM';
    if (summary.includes('compliance') || summary.includes('audit'))
      return 'COMPLIANCE';
    if (summary.includes('payment') || summary.includes('invoice'))
      return 'PAYMENT';
    return 'MEETING';
  }

  /** Log a sync event on the google-calendar Integration record. */
  private async logSyncEvent(
    tenantId: string,
    direction: 'push' | 'pull',
    count: number,
    errorCount: number,
  ) {
    const integration = await this.prisma.integration.findUnique({
      where: {
        tenantId_serviceKey: { tenantId, serviceKey: 'google-calendar' },
      },
    });
    if (!integration) return;

    const existingEvents = Array.isArray(integration.syncEvents)
      ? (integration.syncEvents as any[])
      : [];

    const syncEvent = {
      id: `evt-${Date.now()}`,
      type: 'sync',
      message: `Calendar ${direction}: ${count} events${errorCount > 0 ? `, ${errorCount} errors` : ''}`,
      timestamp: new Date().toISOString(),
    };

    await this.prisma.integration.update({
      where: {
        tenantId_serviceKey: { tenantId, serviceKey: 'google-calendar' },
      },
      data: {
        lastSyncAt: new Date(),
        syncEvents: [syncEvent, ...existingEvents].slice(
          0,
          20,
        ) as unknown as Prisma.InputJsonValue,
      },
    });
  }
}
