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
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { LeadQueryDto, UpdateLeadStageDto } from './dto/lead-query.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

interface RequestWithUser {
  user: { tenantId: string; sub: string; role: string };
}

@Controller('api/v1/leads')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  create(@Request() req: RequestWithUser, @Body() dto: CreateLeadDto) {
    return this.leadsService.create(req.user.tenantId, req.user.sub, dto);
  }

  @Get()
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'VIEWER')
  findAll(@Request() req: RequestWithUser, @Query() query: LeadQueryDto) {
    return this.leadsService.findAll(req.user.tenantId, query);
  }

  @Get('kanban')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'VIEWER')
  kanban(@Request() req: RequestWithUser) {
    return this.leadsService.kanban(req.user.tenantId);
  }

  @Get(':id')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'VIEWER')
  findOne(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.leadsService.findOne(id, req.user.tenantId);
  }

  @Patch(':id')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  update(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: UpdateLeadDto,
  ) {
    return this.leadsService.update(id, req.user.tenantId, req.user.sub, dto);
  }

  @Patch(':id/stage')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  changeStage(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: UpdateLeadStageDto,
  ) {
    return this.leadsService.changeStage(
      id,
      req.user.tenantId,
      req.user.sub,
      dto,
    );
  }

  @Post(':id/convert')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  convert(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.leadsService.convert(id, req.user.tenantId, req.user.sub);
  }
}
