import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { TenantId } from '../common/decorators/tenant-id.decorator';
import { EnhancedEmailService } from './enhanced-email.service';
import { EmailTemplatesService } from './email-templates.service';
import {
  EmailLogQueryDto,
  UpdateEmailPreferencesDto,
} from './dto/email-preferences.dto';
import {
  CreateEmailTemplateDto,
  UpdateEmailTemplateDto,
  EmailTemplateQueryDto,
} from './dto/email-template.dto';

@Controller('admin/email')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMINISTRATOR')
export class EmailAdminController {
  constructor(
    private readonly emailService: EnhancedEmailService,
    private readonly templatesService: EmailTemplatesService,
  ) {}

  // Email Logs Management
  @Get('logs')
  async getEmailLogs(
    @TenantId() tenantId: string,
    @Query() query: EmailLogQueryDto,
  ) {
    const filters = {
      status: query.status,
      templateName: query.templateName,
      recipientEmail: query.recipientEmail,
      dateFrom: query.dateFrom ? new Date(query.dateFrom) : undefined,
      dateTo: query.dateTo ? new Date(query.dateTo) : undefined,
    };

    return this.emailService.getEmailLogs(
      tenantId,
      query.page,
      query.limit,
      filters,
    );
  }

  @Get('queue/status')
  async getQueueStatus(@TenantId() tenantId: string) {
    return this.emailService.getQueueStatus(tenantId);
  }

  @Get('stats')
  async getEmailStats(@TenantId() tenantId: string) {
    // Get email statistics for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const stats = await this.emailService.getEmailLogs(tenantId, 1, 1000, {
      dateFrom: thirtyDaysAgo,
    });

    const totalSent = stats.logs.filter(
      (log: any) => log.status === 'SENT',
    ).length;
    const totalFailed = stats.logs.filter(
      (log: any) => log.status === 'FAILED',
    ).length;
    const successRate =
      totalSent + totalFailed > 0
        ? (totalSent / (totalSent + totalFailed)) * 100
        : 0;

    // Group by template
    const byTemplate = stats.logs.reduce(
      (acc: Record<string, number>, log: any) => {
        acc[log.templateName] = (acc[log.templateName] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalEmails: stats.logs.length,
      totalSent,
      totalFailed,
      successRate: Math.round(successRate * 100) / 100,
      byTemplate,
      queueStatus: await this.emailService.getQueueStatus(tenantId),
    };
  }

  // Email Templates Management
  @Get('templates')
  async getEmailTemplates(
    @TenantId() tenantId: string,
    @Query() query: EmailTemplateQueryDto,
  ) {
    return this.templatesService.findAll(tenantId, query);
  }

  @Get('templates/:id')
  async getEmailTemplate(
    @TenantId() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.templatesService.findOne(tenantId, id);
  }

  @Post('templates')
  async createEmailTemplate(
    @TenantId() tenantId: string,
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateEmailTemplateDto,
  ) {
    return this.templatesService.create(tenantId, userId, dto);
  }

  @Put('templates/:id')
  async updateEmailTemplate(
    @TenantId() tenantId: string,
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateEmailTemplateDto,
  ) {
    return this.templatesService.update(tenantId, id, dto);
  }

  @Delete('templates/:id')
  async deleteEmailTemplate(
    @TenantId() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.templatesService.delete(tenantId, id);
  }

  @Post('templates/:id/test')
  async testEmailTemplate(
    @TenantId() tenantId: string,
    @CurrentUser('email') userEmail: string,
    @Param('id') id: string,
    @Body()
    testData: { recipientEmail?: string; templateData?: Record<string, any> },
  ) {
    // Template testing not available until database migration
    throw new HttpException(
      'Template testing will be available after database migration',
      HttpStatus.NOT_IMPLEMENTED,
    );
  }
}

@Controller('user/email-preferences')
@UseGuards(JwtAuthGuard)
export class EmailPreferencesController {
  constructor(private readonly templatesService: EmailTemplatesService) {}

  @Get()
  async getEmailPreferences(@CurrentUser('sub') userId: string) {
    return this.templatesService.getUserPreferences(userId);
  }

  @Put()
  async updateEmailPreferences(
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdateEmailPreferencesDto,
  ) {
    return this.templatesService.updateUserPreferences(userId, dto);
  }
}
