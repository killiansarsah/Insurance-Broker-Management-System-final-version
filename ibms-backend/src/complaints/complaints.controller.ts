import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { ComplaintQueryDto } from './dto/complaint-query.dto';
import {
  UpdateComplaintDto,
  AssignComplaintDto,
  EscalateComplaintDto,
  ResolveComplaintDto,
  ReopenComplaintDto,
} from './dto/complaint-actions.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

interface RequestWithUser {
  user: { tenantId: string; sub: string; role: string };
}

@Controller('api/v1')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  // ─── COMPLAINTS CRUD ───────────────────────────────

  @Post('complaints')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  create(@Request() req: RequestWithUser, @Body() dto: CreateComplaintDto) {
    return this.complaintsService.create(req.user.tenantId, req.user.sub, dto);
  }

  @Get('complaints')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'VIEWER')
  findAll(@Request() req: RequestWithUser, @Query() query: ComplaintQueryDto) {
    return this.complaintsService.findAll(req.user.tenantId, query);
  }

  @Get('complaints/:id')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'VIEWER')
  findOne(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.complaintsService.findOne(id, req.user.tenantId);
  }

  @Patch('complaints/:id')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  update(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: UpdateComplaintDto,
  ) {
    return this.complaintsService.update(
      id,
      req.user.tenantId,
      req.user.sub,
      dto,
    );
  }

  // ─── STATUS TRANSITIONS ────────────────────────────

  @Post('complaints/:id/assign')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  assign(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: AssignComplaintDto,
  ) {
    return this.complaintsService.assign(
      id,
      req.user.tenantId,
      req.user.sub,
      dto,
    );
  }

  @Post('complaints/:id/escalate')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  escalate(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: EscalateComplaintDto,
  ) {
    return this.complaintsService.escalate(
      id,
      req.user.tenantId,
      req.user.sub,
      dto,
    );
  }

  @Post('complaints/:id/resolve')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  resolve(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: ResolveComplaintDto,
  ) {
    return this.complaintsService.resolve(
      id,
      req.user.tenantId,
      req.user.sub,
      dto,
    );
  }

  @Post('complaints/:id/reopen')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  reopen(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: ReopenComplaintDto,
  ) {
    return this.complaintsService.reopen(
      id,
      req.user.tenantId,
      req.user.sub,
      dto,
    );
  }

  @Post('complaints/:id/close')
  @Roles('ADMIN', 'TENANT_ADMIN')
  close(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.complaintsService.close(id, req.user.tenantId, req.user.sub);
  }

  // ─── ESCALATIONS DASHBOARD ─────────────────────────

  @Get('escalations')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'VIEWER')
  getEscalations(@Request() req: RequestWithUser) {
    return this.complaintsService.getEscalations(req.user.tenantId);
  }
}
