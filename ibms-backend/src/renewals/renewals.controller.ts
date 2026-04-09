import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Query,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RenewalsService } from './renewals.service';
import { RenewPolicyDto } from './dto/renew-policy.dto';
import { BulkRemindDto } from './dto/bulk-remind.dto';
import { BulkAssignDto } from './dto/bulk-assign.dto';
import { UpdateRenewalTemplateDto } from './dto/update-renewal-template.dto';
import { CreateRenewalTemplateDto } from './dto/create-renewal-template.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import type { RequestWithUser } from '../common/types/request.types.js';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class RenewalsController {
  constructor(private readonly renewalsService: RenewalsService) {}

  @Get('renewals/metrics')
  @Roles('ADMINISTRATOR', 'AGENT', 'WORKSPACE_OWNER', 'MANAGER', 'SUPERVISOR')
  getMetrics(@Request() req: RequestWithUser) {
    return this.renewalsService.getMetrics(req.user.tenantId, req.user.sub);
  }

  @Get('renewals')
  @Roles('ADMINISTRATOR', 'AGENT', 'WORKSPACE_OWNER', 'MANAGER', 'SUPERVISOR')
  getUpcoming(
    @Request() req: RequestWithUser,
    @Query('daysAhead') daysAhead?: string,
    @Query('insuranceType') insuranceType?: string,
    @Query('carrierId') carrierId?: string,
  ) {
    return this.renewalsService.getUpcomingRenewals(
      req.user.tenantId,
      req.user.sub,
      daysAhead ? parseInt(daysAhead, 10) : 90,
      { insuranceType, carrierId },
    );
  }

  @Get('renewals/upcoming')
  @Roles('ADMINISTRATOR', 'AGENT', 'WORKSPACE_OWNER', 'MANAGER', 'SUPERVISOR')
  getUpcomingAlias(
    @Request() req: RequestWithUser,
    @Query('daysAhead') daysAhead?: string,
    @Query('insuranceType') insuranceType?: string,
    @Query('carrierId') carrierId?: string,
  ) {
    return this.renewalsService.getUpcomingRenewals(
      req.user.tenantId,
      req.user.sub,
      daysAhead ? parseInt(daysAhead, 10) : 90,
      { insuranceType, carrierId },
    );
  }

  @Get('renewals/lapsed')
  @Roles('ADMINISTRATOR', 'AGENT', 'WORKSPACE_OWNER', 'MANAGER', 'SUPERVISOR')
  getLapsedPolicies(@Request() req: RequestWithUser) {
    return this.renewalsService.getLapsedPolicies(
      req.user.tenantId,
      req.user.sub,
    );
  }

  @Post('policies/:id/renew')
  @Roles('ADMINISTRATOR', 'AGENT', 'WORKSPACE_OWNER', 'MANAGER', 'SUPERVISOR')
  async renew(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: RenewPolicyDto,
  ) {
    const data = await this.renewalsService.renewPolicy(
      id,
      req.user.tenantId,
      req.user.sub,
      dto,
    );
    return { success: true, data };
  }

  @Post('renewals/test-reminders')
  @Roles('ADMINISTRATOR', 'WORKSPACE_OWNER')
  async testTriggerReminders(
    @Request() req: RequestWithUser,
    @Query('overrideEmail') overrideEmail?: string,
  ) {
    return this.renewalsService.sendTestReminder(
      req.user.tenantId,
      overrideEmail,
    );
  }

  @Post('renewals/notify-all')
  @Roles('ADMINISTRATOR', 'WORKSPACE_OWNER')
  async notifyAll(@Request() req: RequestWithUser) {
    const result = await this.renewalsService.notifyAllForTenant(
      req.user.tenantId,
    );
    return {
      success: true,
      message: `Bulk reminders complete: ${result.sent} sent, ${result.skipped} skipped (no email), ${result.failed} failed.`,
      ...result,
    };
  }

  @Post('renewals/bulk-remind')
  @Roles('ADMINISTRATOR', 'WORKSPACE_OWNER', 'MANAGER', 'SUPERVISOR')
  async bulkRemind(
    @Request() req: RequestWithUser,
    @Body() dto: BulkRemindDto,
  ) {
    const result = await this.renewalsService.bulkSendReminders(
      req.user.tenantId,
      dto.policyIds,
      req.user.sub,
    );
    return {
      success: true,
      message: `Bulk action complete: ${result.sent} sent, ${result.skipped} skipped, ${result.failed} failed.`,
      ...result,
    };
  }

  @Post('renewals/bulk-update-status')
  @Roles('ADMINISTRATOR', 'WORKSPACE_OWNER', 'MANAGER', 'SUPERVISOR')
  async bulkUpdateStatus(
    @Request() req: RequestWithUser,
    @Body() dto: { policyIds: string[]; status: string },
  ) {
    const result = await this.renewalsService.bulkUpdateStatus(
      req.user.tenantId,
      dto.policyIds,
      dto.status,
      req.user.sub,
    );
    return {
      success: true,
      message: `Updated status for ${result.count} policies.`,
      ...result,
    };
  }

  @Post('renewals/bulk-assign')
  @Roles('ADMINISTRATOR', 'WORKSPACE_OWNER', 'MANAGER', 'SUPERVISOR')
  async bulkAssign(
    @Request() req: RequestWithUser,
    @Body() dto: BulkAssignDto,
  ) {
    const result = await this.renewalsService.bulkAssignBroker(
      req.user.tenantId,
      dto.policyIds,
      dto.brokerId,
      req.user.sub,
    );
    return {
      success: true,
      message: `Assigned ${result.count} policies successfully.`,
      ...result,
    };
  }

  @Get('renewals/templates')
  @Roles('ADMINISTRATOR', 'WORKSPACE_OWNER')
  async getTemplates(@Request() req: RequestWithUser) {
    return this.renewalsService.getTemplates(req.user.tenantId);
  }

  @Put('renewals/templates/:id')
  @Roles('ADMINISTRATOR', 'WORKSPACE_OWNER')
  async updateTemplate(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: UpdateRenewalTemplateDto,
  ) {
    return this.renewalsService.updateTemplate(req.user.tenantId, id, dto);
  }

  @Get('renewals/report')
  @Roles('ADMINISTRATOR', 'AGENT', 'WORKSPACE_OWNER', 'MANAGER', 'SUPERVISOR')
  async getReport(
    @Request() req: RequestWithUser,
    @Query('days') days?: string,
  ) {
    return this.renewalsService.getRenewalReportForActor(
      req.user.tenantId,
      req.user.sub,
      days ? parseInt(days, 10) : 90,
    );
  }

  @Post('renewals/templates')
  @Roles('ADMINISTRATOR', 'WORKSPACE_OWNER')
  async createTemplate(
    @Request() req: RequestWithUser,
    @Body() dto: CreateRenewalTemplateDto,
  ) {
    return this.renewalsService.createTemplate(req.user.tenantId, dto);
  }
}
