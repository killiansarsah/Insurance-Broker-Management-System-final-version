import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { IntegrationsService } from './integrations.service';
import {
  ConnectIntegrationDto,
  UpdateIntegrationDto,
} from './dto/integrations.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import type { RequestWithUser } from '../common/types/request.types.js';

@Controller('integrations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class IntegrationsController {
  constructor(private readonly service: IntegrationsService) {}

  /** GET /integrations — list all integrations for tenant */
  @Get()
  @Roles('ADMIN', 'TENANT_ADMIN')
  findAll(@Request() req: RequestWithUser) {
    return this.service.findAll(req.user.tenantId);
  }

  /** GET /integrations/:serviceKey — get single integration */
  @Get(':serviceKey')
  @Roles('ADMIN', 'TENANT_ADMIN')
  findOne(
    @Request() req: RequestWithUser,
    @Param('serviceKey') serviceKey: string,
  ) {
    return this.service.findOne(req.user.tenantId, serviceKey);
  }

  /** POST /integrations/connect — connect an integration */
  @Post('connect')
  @Roles('ADMIN', 'TENANT_ADMIN')
  connect(@Request() req: RequestWithUser, @Body() dto: ConnectIntegrationDto) {
    return this.service.connect(req.user.tenantId, dto);
  }

  /** POST /integrations/disconnect/:serviceKey — disconnect */
  @Post('disconnect/:serviceKey')
  @Roles('ADMIN', 'TENANT_ADMIN')
  disconnect(
    @Request() req: RequestWithUser,
    @Param('serviceKey') serviceKey: string,
  ) {
    return this.service.disconnect(req.user.tenantId, serviceKey);
  }

  /** PATCH /integrations/:serviceKey — update config */
  @Patch(':serviceKey')
  @Roles('ADMIN', 'TENANT_ADMIN')
  update(
    @Request() req: RequestWithUser,
    @Param('serviceKey') serviceKey: string,
    @Body() dto: UpdateIntegrationDto,
  ) {
    return this.service.update(req.user.tenantId, serviceKey, dto);
  }

  /** POST /integrations/:serviceKey/sync — trigger manual sync */
  @Post(':serviceKey/sync')
  @Roles('ADMIN', 'TENANT_ADMIN')
  sync(
    @Request() req: RequestWithUser,
    @Param('serviceKey') serviceKey: string,
  ) {
    return this.service.recordSync(req.user.tenantId, serviceKey);
  }
}
