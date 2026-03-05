import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuditService, AuditQueryDto } from './audit.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

interface RequestWithUser {
  user: { tenantId: string; sub: string; role: string };
}

@Controller('api/v1/audit')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'TENANT_ADMIN')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  findAll(@Request() req: RequestWithUser, @Query() query: AuditQueryDto) {
    return this.auditService.findAll(req.user.tenantId, query);
  }

  @Get('entity/:entityType/:entityId')
  findByEntity(
    @Request() req: RequestWithUser,
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ) {
    return this.auditService.findByEntity(
      req.user.tenantId,
      entityType,
      entityId,
    );
  }
}
