import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { FinanceDashboardService } from './finance-dashboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

interface RequestWithUser {
  user: { tenantId: string; sub: string; role: string };
}

@Controller('api/v1/finance/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FinanceDashboardController {
  constructor(private readonly dashboardService: FinanceDashboardService) {}

  @Get()
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'VIEWER')
  getDashboard(
    @Request() req: RequestWithUser,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.dashboardService.getDashboard(req.user.tenantId, from, to);
  }
}
