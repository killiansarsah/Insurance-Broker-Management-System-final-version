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
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import type { RequestWithUser } from '../common/types/request.types.js';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class RenewalsController {
  constructor(private readonly renewalsService: RenewalsService) {}

  @Get('renewals')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'VIEWER')
  getUpcoming(
    @Request() req: RequestWithUser,
    @Query('daysAhead') daysAhead?: string,
    @Query('insuranceType') insuranceType?: string,
    @Query('carrierId') carrierId?: string,
  ) {
    return this.renewalsService.getUpcomingRenewals(
      req.user.tenantId,
      daysAhead ? parseInt(daysAhead, 10) : 90,
      { insuranceType, carrierId },
    );
  }

  @Get('renewals/upcoming')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'VIEWER')
  getUpcomingAlias(
    @Request() req: RequestWithUser,
    @Query('daysAhead') daysAhead?: string,
  ) {
    return this.renewalsService.getUpcomingRenewals(
      req.user.tenantId,
      daysAhead ? parseInt(daysAhead, 10) : 90,
    );
  }

  @Get('renewals/lapsed')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'VIEWER')
  getLapsedPolicies(@Request() req: RequestWithUser) {
    return this.renewalsService.getLapsedPolicies(req.user.tenantId);
  }

  @Post('policies/:id/renew')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  renew(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: RenewPolicyDto,
  ) {
    return this.renewalsService.renewPolicy(
      id,
      req.user.tenantId,
      req.user.sub,
      dto,
    );
  }

  @Post('renewals/test-reminders')
  @Roles('ADMIN', 'TENANT_ADMIN', 'PLATFORM_SUPER_ADMIN')
  async testTriggerReminders(
    @Request() req: RequestWithUser,
    @Query('overrideEmail') overrideEmail?: string,
  ) {
    const tenantId = req.user.tenantId;

    // Find the most urgent policy — prefer near-expiry or overdue ACTIVE policies first
    const policy = await this.renewalsService['prisma'].policy.findFirst({
      where: {
        tenantId,
        status: { in: ['ACTIVE', 'LAPSED', 'EXPIRED'] },
      },
      orderBy: { expiryDate: 'asc' }, // most overdue first
      include: { client: true },
    });

    if (!policy) {
      return { success: false, message: 'No policies found for your tenant.' };
    }

    const destinationEmail = overrideEmail || policy.client.email;

    if (!destinationEmail) {
      return {
        success: false,
        message:
          'No destination email — client has no email address and no override was provided.',
      };
    }

    const clientName =
      policy.client.companyName ||
      `${policy.client.firstName} ${policy.client.lastName}`;
    const now = new Date();
    const daysUntilExpiry = Math.ceil(
      (new Date(policy.expiryDate).getTime() - now.getTime()) /
        (1000 * 60 * 60 * 24),
    );

    await this.renewalsService['emailService'].sendPolicyRenewalReminder(
      destinationEmail,
      clientName,
      policy.policyNumber,
      policy.expiryDate,
      daysUntilExpiry,
      Number(policy.premiumAmount),
      policy.insuranceType,
    );

    return {
      success: true,
      message: `Test reminder sent to ${destinationEmail} for policy ${policy.policyNumber} (${daysUntilExpiry < 0 ? Math.abs(daysUntilExpiry) + ' days overdue' : daysUntilExpiry + ' days remaining'})`,
    };
  }

  @Post('renewals/notify-all')
  @Roles('ADMIN', 'TENANT_ADMIN')
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
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  async bulkRemind(
    @Request() req: RequestWithUser,
    @Body() dto: { policyIds: string[] }
  ) {
    const result = await this.renewalsService.bulkSendReminders(req.user.tenantId, dto.policyIds, req.user.sub);
    return {
      success: true,
      message: `Bulk action complete: ${result.sent} sent, ${result.skipped} skipped, ${result.failed} failed.`,
      ...result,
    };
  }

  @Post('renewals/bulk-assign')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  async bulkAssign(
    @Request() req: RequestWithUser,
    @Body() dto: { policyIds: string[], brokerId: string }
  ) {
    const result = await this.renewalsService.bulkAssignBroker(req.user.tenantId, dto.policyIds, dto.brokerId, req.user.sub);
    return {
      success: true,
      message: `Assigned ${result.count} policies successfully.`,
      ...result,
    };
  }


  @Get('renewals/templates')
  @Roles('ADMIN', 'TENANT_ADMIN')
  async getTemplates(@Request() req: RequestWithUser) {
    return this.renewalsService.getTemplates(req.user.tenantId);
  }

  @Put('renewals/templates/:id')
  @Roles('ADMIN', 'TENANT_ADMIN')
  async updateTemplate(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: any
  ) {
    return this.renewalsService.updateTemplate(req.user.tenantId, id, dto);
  }

  @Get('renewals/report')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  async getReport(
    @Request() req: RequestWithUser,
    @Query('days') days?: string
  ) {
    return this.renewalsService.getRenewalReport(req.user.tenantId, days ? parseInt(days, 10) : 90);
  }
}
