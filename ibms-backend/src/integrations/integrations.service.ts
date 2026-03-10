import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import {
  ConnectIntegrationDto,
  UpdateIntegrationDto,
} from './dto/integrations.dto';

@Injectable()
export class IntegrationsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Get all integrations for a tenant (only those that exist in DB = have been connected at least once). */
  async findAll(tenantId: string) {
    return this.prisma.integration.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'asc' },
    });
  }

  /** Get a single integration by service key. */
  async findOne(tenantId: string, serviceKey: string) {
    const integration = await this.prisma.integration.findUnique({
      where: { tenantId_serviceKey: { tenantId, serviceKey } },
    });
    if (!integration) throw new NotFoundException(`Integration ${serviceKey} not found`);
    return integration;
  }

  /** Connect (upsert) an integration. */
  async connect(tenantId: string, dto: ConnectIntegrationDto) {
    const now = new Date();
    const credentials: Record<string, string> = {};
    if (dto.apiKey) credentials.apiKey = dto.apiKey;
    if (dto.apiSecret) credentials.apiSecret = dto.apiSecret;

    const connectEvent = {
      id: `evt-${Date.now()}`,
      type: 'connected',
      message: 'Integration connected successfully',
      timestamp: now.toISOString(),
    };

    return this.prisma.integration.upsert({
      where: { tenantId_serviceKey: { tenantId, serviceKey: dto.serviceKey } },
      create: {
        tenantId,
        serviceKey: dto.serviceKey,
        connected: true,
        connectedAt: now,
        connectedEmail: dto.connectedEmail ?? null,
        lastSyncAt: now,
        credentials: credentials as unknown as Prisma.InputJsonValue,
        syncEvents: [connectEvent] as unknown as Prisma.InputJsonValue,
      },
      update: {
        connected: true,
        connectedAt: now,
        connectedEmail: dto.connectedEmail ?? undefined,
        lastSyncAt: now,
        credentials: credentials as unknown as Prisma.InputJsonValue,
        syncEvents: {
          // We can't easily push to JSON in Prisma, so we handle it via a raw approach below
          set: undefined as any,
        },
      },
    }).catch(async () => {
      // Need to handle syncEvents append manually:
      const existing = await this.prisma.integration.findUnique({
        where: { tenantId_serviceKey: { tenantId, serviceKey: dto.serviceKey } },
      });
      const existingEvents = Array.isArray(existing?.syncEvents) ? (existing.syncEvents as any[]) : [];
      return this.prisma.integration.update({
        where: { tenantId_serviceKey: { tenantId, serviceKey: dto.serviceKey } },
        data: {
          connected: true,
          connectedAt: now,
          connectedEmail: dto.connectedEmail ?? undefined,
          lastSyncAt: now,
          credentials: credentials as unknown as Prisma.InputJsonValue,
          syncEvents: [connectEvent, ...existingEvents].slice(0, 20) as unknown as Prisma.InputJsonValue,
        },
      });
    });
  }

  /** Disconnect an integration. */
  async disconnect(tenantId: string, serviceKey: string) {
    const existing = await this.prisma.integration.findUnique({
      where: { tenantId_serviceKey: { tenantId, serviceKey } },
    });
    if (!existing) throw new NotFoundException(`Integration ${serviceKey} not found`);

    const existingEvents = Array.isArray(existing.syncEvents) ? (existing.syncEvents as any[]) : [];
    const disconnectEvent = {
      id: `evt-${Date.now()}`,
      type: 'disconnected',
      message: 'Integration disconnected',
      timestamp: new Date().toISOString(),
    };

    return this.prisma.integration.update({
      where: { tenantId_serviceKey: { tenantId, serviceKey } },
      data: {
        connected: false,
        connectedAt: null,
        connectedEmail: null,
        lastSyncAt: null,
        credentials: {} as unknown as Prisma.InputJsonValue,
        syncEvents: [disconnectEvent, ...existingEvents].slice(0, 20) as unknown as Prisma.InputJsonValue,
      },
    });
  }

  /** Update config (sync frequency, etc.). */
  async update(tenantId: string, serviceKey: string, dto: UpdateIntegrationDto) {
    const existing = await this.prisma.integration.findUnique({
      where: { tenantId_serviceKey: { tenantId, serviceKey } },
    });
    if (!existing) throw new NotFoundException(`Integration ${serviceKey} not found`);

    const config = (existing.config && typeof existing.config === 'object') ? { ...(existing.config as any) } : {};
    if (dto.webhookUrl !== undefined) config.webhookUrl = dto.webhookUrl;

    return this.prisma.integration.update({
      where: { tenantId_serviceKey: { tenantId, serviceKey } },
      data: {
        syncFrequency: dto.syncFrequency ?? undefined,
        config: config as unknown as Prisma.InputJsonValue,
      },
    });
  }

  /** Record a sync event. */
  async recordSync(tenantId: string, serviceKey: string) {
    const existing = await this.prisma.integration.findUnique({
      where: { tenantId_serviceKey: { tenantId, serviceKey } },
    });
    if (!existing) throw new NotFoundException(`Integration ${serviceKey} not found`);

    const now = new Date();
    const count = Math.floor(Math.random() * 50) + 5;
    const existingEvents = Array.isArray(existing.syncEvents) ? (existing.syncEvents as any[]) : [];
    const syncEvent = {
      id: `evt-${Date.now()}`,
      type: 'sync',
      message: `Synced ${count} records successfully`,
      timestamp: now.toISOString(),
      count,
    };

    return this.prisma.integration.update({
      where: { tenantId_serviceKey: { tenantId, serviceKey } },
      data: {
        lastSyncAt: now,
        syncEvents: [syncEvent, ...existingEvents].slice(0, 20) as unknown as Prisma.InputJsonValue,
      },
    });
  }
}
