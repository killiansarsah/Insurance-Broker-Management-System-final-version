import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RemittancesService } from './remittances.service';
import {
  CreateRemittanceDto,
  RemittanceQueryDto,
  ConfirmRemittanceDto,
} from './dto/remittance.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import type { RequestWithUser } from '../../common/types/request.types.js';

@Controller('remittances')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RemittancesController {
  constructor(private readonly remittancesService: RemittancesService) {}

  @Post()
  @Roles('ADMIN', 'TENANT_ADMIN', 'FINANCE_MANAGER')
  create(@Request() req: RequestWithUser, @Body() dto: CreateRemittanceDto) {
    return this.remittancesService.create(req.user.tenantId, req.user.sub, dto);
  }

  @Get()
  @Roles('ADMIN', 'TENANT_ADMIN', 'FINANCE_MANAGER', 'BROKER', 'VIEWER')
  findAll(@Request() req: RequestWithUser, @Query() query: RemittanceQueryDto) {
    return this.remittancesService.findAll(req.user.tenantId, query);
  }

  @Get(':id')
  @Roles('ADMIN', 'TENANT_ADMIN', 'FINANCE_MANAGER', 'BROKER', 'VIEWER')
  findOne(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.remittancesService.findOne(id, req.user.tenantId);
  }

  @Post(':id/confirm')
  @Roles('ADMIN', 'TENANT_ADMIN', 'FINANCE_MANAGER')
  confirm(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: ConfirmRemittanceDto,
  ) {
    return this.remittancesService.confirm(
      id,
      req.user.tenantId,
      req.user.sub,
      dto,
    );
  }
}
