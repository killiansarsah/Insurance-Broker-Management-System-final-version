import {
  Controller,
  Get,
  Post,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RenewalsService } from './renewals.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

interface RequestWithUser {
  user: {
    tenantId: string;
    sub: string;
    role: string;
  };
}

@Controller('api/v1/renewals')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RenewalsController {
  constructor(private readonly renewalsService: RenewalsService) {}

  @Get('upcoming')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'VIEWER')
  getUpcoming(@Request() req: RequestWithUser) {
    return this.renewalsService.getUpcomingRenewals(req.user.tenantId);
  }

  @Post(':id/renew')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  renew(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.renewalsService.renewPolicy(
      id,
      req.user.tenantId,
      req.user.sub,
    );
  }
}
