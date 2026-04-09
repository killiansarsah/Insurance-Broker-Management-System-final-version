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
import { CommissionsService } from './commissions.service';
import { CommissionQueryDto } from './dto/commission-query.dto';
import { ReceiveCommissionDto } from './dto/receive-commission.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

import type { RequestWithUser } from '../../common/types/request.types.js';

@Controller('commissions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CommissionsController {
  constructor(private readonly commissionsService: CommissionsService) {}

  @Get('metrics')
  @Roles('ADMINISTRATOR', 'MANAGER', 'SUPERVISOR', 'AGENT')
  getMetrics(@Request() req: RequestWithUser) {
    return this.commissionsService.getMetrics(req.user.tenantId, req.user.sub);
  }

  @Get()
  @Roles('ADMINISTRATOR', 'AGENT')
  findAll(@Request() req: RequestWithUser, @Query() query: CommissionQueryDto) {
    return this.commissionsService.findAll(req.user.tenantId, req.user.sub, query);
  }

  @Post(':id/receive')
  @Roles('ADMINISTRATOR')
  receive(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: ReceiveCommissionDto,
  ) {
    return this.commissionsService.receive(
      id,
      req.user.tenantId,
      req.user.sub,
      dto,
    );
  }
}
