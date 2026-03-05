import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

interface RequestWithUser {
  user: { tenantId: string; sub: string; role: string };
}

@Controller('api/v1/reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  dashboard(
    @Request() req: RequestWithUser,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.reportsService.dashboard(req.user.tenantId, from, to);
  }

  @Get('production')
  production(
    @Request() req: RequestWithUser,
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('groupBy') groupBy?: string,
  ) {
    return this.reportsService.production(req.user.tenantId, from, to, groupBy);
  }

  @Get('claims')
  claimsReport(
    @Request() req: RequestWithUser,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.reportsService.claimsReport(req.user.tenantId, from, to);
  }

  @Get('renewals')
  renewalsReport(
    @Request() req: RequestWithUser,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.reportsService.renewalsReport(req.user.tenantId, from, to);
  }

  @Get('financial')
  financialReport(
    @Request() req: RequestWithUser,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.reportsService.financialReport(req.user.tenantId, from, to);
  }

  @Get('compliance')
  complianceReport(@Request() req: RequestWithUser) {
    return this.reportsService.complianceReport(req.user.tenantId);
  }
}
