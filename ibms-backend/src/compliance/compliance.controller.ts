import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ComplianceService } from './compliance.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import type { RequestWithUser } from '../common/types/request.types.js';


@Controller('compliance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Get('kyc-queue')
  @Roles('ADMIN', 'TENANT_ADMIN')
  kycQueue(@Request() req: RequestWithUser) {
    return this.complianceService.kycQueue(req.user.tenantId);
  }

  @Get('aml-screening')
  @Roles('ADMIN', 'TENANT_ADMIN')
  amlScreening(@Request() req: RequestWithUser) {
    return this.complianceService.amlScreening(req.user.tenantId);
  }

  @Get('nic-deadlines')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  nicDeadlines(@Request() req: RequestWithUser) {
    return this.complianceService.nicDeadlines(req.user.tenantId);
  }

  @Get('summary')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'VIEWER')
  summary(@Request() req: RequestWithUser) {
    return this.complianceService.summary(req.user.tenantId);
  }

  @Post('pep-search')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  pepSearch(
    @Request() req: RequestWithUser,
    @Body() body: { name: string },
  ) {
    return this.complianceService.pepSearch(req.user.tenantId, body.name);
  }
}
