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
  async testTriggerReminders(@Query('targetDate') targetDateStr?: string) {
    // If targetDate is provided, we simulate the cron job running on that date
    // and sending reminders for exactly 90, 60, and 30 days ahead of that spoofed date.
    // However, to make testing easy: Let's just find ALL active policies for the tenant 
    // and send a test reminder for the first one we find.
    const policy = await this.renewalsService['prisma'].policy.findFirst({
      where: { status: 'ACTIVE' },
      include: { client: true },
    });

    if (!policy) {
      return { success: false, message: 'No active policies found to test with.' };
    }

    if (!policy.client.email) {
      return { success: false, message: 'Found an active policy but the client has no email address.' };
    }

    const clientName = policy.client.companyName || `${policy.client.firstName} ${policy.client.lastName}`;
    
    // Send a 30-day spoofed reminder for testing
    await this.renewalsService['emailService'].sendPolicyRenewalReminder(
      policy.client.email,
      clientName,
      policy.policyNumber,
      policy.expiryDate,
      30, // days ahead
      Number(policy.premiumAmount),
      policy.insuranceType,
    );

    return { success: true, message: `Sent a test policy reminder to ${policy.client.email} for policy ${policy.policyNumber}` };
  }
}
