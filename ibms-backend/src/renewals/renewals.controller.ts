import {
  Controller,
  Get,
  Post,
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
      return { success: false, message: 'No destination email — client has no email address and no override was provided.' };
    }

    const clientName = policy.client.companyName || `${policy.client.firstName} ${policy.client.lastName}`;
    const now = new Date();
    const daysUntilExpiry = Math.ceil(
      (new Date(policy.expiryDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
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
    const result = await this.renewalsService.notifyAllForTenant(req.user.tenantId);
    return {
      success: true,
      message: `Bulk reminders complete: ${result.sent} sent, ${result.skipped} skipped (no email), ${result.failed} failed.`,
      ...result,
    };
  }
}
