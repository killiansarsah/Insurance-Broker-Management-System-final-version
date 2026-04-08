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
import type { RequestWithUser } from '../common/types/request.types.js';

@Controller('complaints')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  // ─── COMPLAINTS CRUD ───────────────────────────────

  @Post()
  @Roles('ADMINISTRATOR', 'AGENT')
  create(@Request() req: RequestWithUser, @Body() dto: CreateComplaintDto) {
    return this.complaintsService.create(req.user.tenantId, req.user.sub, dto);
  }

  @Get()
  @Roles('ADMINISTRATOR', 'AGENT')
  findAll(@Request() req: RequestWithUser, @Query() query: ComplaintQueryDto) {
    return this.complaintsService.findAll(
      req.user.tenantId,
      req.user.sub,
      query,
    );
  }

  @Get(':id')
  @Roles('ADMINISTRATOR', 'AGENT')
  findOne(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.complaintsService.findOne(id, req.user.tenantId, req.user.sub);
  }

  @Patch(':id')
  @Roles('ADMINISTRATOR', 'AGENT')
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

  @Post(':id/assign')
  @Roles('ADMINISTRATOR', 'MANAGER', 'SUPERVISOR')
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

  @Post(':id/escalate')
  @Roles('ADMINISTRATOR', 'MANAGER', 'SUPERVISOR')
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

  @Post(':id/resolve')
  @Roles('ADMINISTRATOR', 'AGENT')
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

  @Post(':id/reopen')
  @Roles('ADMINISTRATOR', 'MANAGER', 'SUPERVISOR')
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
  @Roles('ADMINISTRATOR')
  close(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.complaintsService.close(id, req.user.tenantId, req.user.sub);
  }

  // ─── ESCALATIONS DASHBOARD ─────────────────────────

  @Get('escalations')
  @Roles('ADMINISTRATOR', 'AGENT')
  getEscalations(@Request() req: RequestWithUser) {
    return this.complaintsService.getEscalations(req.user.tenantId);
  }
}
