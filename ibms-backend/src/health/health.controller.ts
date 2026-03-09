import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator.js';
import { PrismaService } from '../prisma/prisma.service.js';

interface ComponentHealth {
  status: 'up' | 'down';
  latencyMs?: number;
  error?: string;
}

interface HealthResponse {
  status: 'ok' | 'degraded';
  timestamp: string;
  uptime: number;
  environment: string;
  components: {
    database: ComponentHealth;
  };
}

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  async getHealth(): Promise<HealthResponse> {
    const db = await this.checkDatabase();

    const overall = db.status === 'up' ? 'ok' : 'degraded';

    return {
      status: overall,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env['NODE_ENV'] || 'development',
      components: {
        database: db,
      },
    };
  }

  private async checkDatabase(): Promise<ComponentHealth> {
    const start = Date.now();
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'up', latencyMs: Date.now() - start };
    } catch (err) {
      return {
        status: 'down',
        latencyMs: Date.now() - start,
        error: err instanceof Error ? err.message : 'Unknown error',
      };
    }
  }
}
