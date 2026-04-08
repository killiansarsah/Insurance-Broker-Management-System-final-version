import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { FinanceDashboardService } from './finance-dashboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

import type { RequestWithUser } from '../../common/types/request.types.js';

@Controller('finance/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FinanceDashboardController {
  constructor(private readonly dashboardService: FinanceDashboardService) {}

  @Get()
  @Roles('ADMINISTRATOR', 'WORKSPACE_OWNER', 'MANAGER', 'SUPERVISOR')
  getDashboard(
    @Request() req: RequestWithUser,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.dashboardService.getDashboard(req.user.tenantId, from, to);
  }
}
