import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { Tenant } from '@prisma/client';

interface CacheEntry {
  value: Tenant | null;
  expiresAt: number;
}

@Injectable()
export class TenantsService {
  private readonly logger = new Logger(TenantsService.name);
  private cache = new Map<string, CacheEntry>();
  private TTL = 5 * 60 * 1000; // 5 minutes

  constructor(private prisma: PrismaService) {}

  private getFromCache(key: string): Tenant | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return entry.value;
  }

  private setCache(key: string, value: Tenant | null): void {
    this.cache.set(key, { value, expiresAt: Date.now() + this.TTL });
  }

  async findBySlug(slug: string) {
    const cacheKey = `slug:${slug}`;
    const cached = this.getFromCache(cacheKey);
    if (cached !== null) return cached;

    const tenant = await this.prisma.tenant.findUnique({ where: { slug } });
    this.setCache(cacheKey, tenant ?? null);
    return tenant;
  }

  async findById(id: string) {
    const cacheKey = `id:${id}`;
    const cached = this.getFromCache(cacheKey);
    if (cached !== null) return cached;

    const tenant = await this.prisma.tenant.findUnique({ where: { id } });
    this.setCache(cacheKey, tenant ?? null);
    return tenant;
  }
}
