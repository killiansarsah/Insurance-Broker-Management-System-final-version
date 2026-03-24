import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { PlatformAuditService } from '../services/platform-audit.service.js';
import type { JobStatus } from '@prisma/client';

@Controller('platform-admin/jobs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('PLATFORM_SUPER_ADMIN', 'SUPER_ADMIN')
export class BackgroundJobsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: PlatformAuditService,
  ) {}

  @Get()
  async getJobs(
    @Query('page') page = '1',
    @Query('limit') limit = '50',
    @Query('status') status?: JobStatus,
    @Query('jobName') jobName?: string,
    @Query('tenantId') tenantId?: string,
  ) {
    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), 100);
    const skip = (pageNum - 1) * limitNum;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (jobName) where.jobName = jobName;
    if (tenantId) where.tenantId = tenantId;

    const [data, total] = await Promise.all([
      this.prisma.backgroundJob.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { enqueuedAt: 'desc' },
        include: { tenant: { select: { name: true } } },
      }),
      this.prisma.backgroundJob.count({ where }),
    ]);

    return {
      data,
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  @Post(':id/retry')
  async retryJob(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const job = await this.prisma.backgroundJob.findUnique({ where: { id } });
    if (!job) throw new HttpException('Job not found', HttpStatus.NOT_FOUND);
    if (job.status !== 'FAILED')
      throw new HttpException(
        'Only failed jobs can be retried',
        HttpStatus.BAD_REQUEST,
      );

    const updatedJob = await this.prisma.backgroundJob.update({
      where: { id },
      data: {
        status: 'QUEUED',
        attempts: 0,
        errorMessage: null,
        nextRetryAt: null,
      },
    });

    await this.audit.log({
      actorId: user.sub,
      actorEmail: user.email,
      actorRole: user.role,
      category: 'SYSTEM',
      action: 'JOB_RETRIED',
      resourceType: 'BackgroundJob',
      resourceId: id,
      description: `Background job manually retried: ${job.jobName}`,
    });

    return { data: updatedJob };
  }

  @Delete(':id/discard')
  async discardJob(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const job = await this.prisma.backgroundJob.findUnique({ where: { id } });
    if (!job) throw new HttpException('Job not found', HttpStatus.NOT_FOUND);

    await this.prisma.backgroundJob.delete({ where: { id } });

    await this.audit.log({
      actorId: user.sub,
      actorEmail: user.email,
      actorRole: user.role,
      category: 'SYSTEM',
      severity: 'WARN',
      action: 'JOB_DISCARDED',
      resourceType: 'BackgroundJob',
      resourceId: id,
      description: `Background job discarded: ${job.jobName}`,
    });

    return { data: { success: true } };
  }
}
