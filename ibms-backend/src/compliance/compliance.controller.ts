import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ComplianceService } from './compliance.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

interface RequestWithUser {
  user: { tenantId: string; sub: string; role: string };
}

@Controller('api/v1/compliance')
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
}
