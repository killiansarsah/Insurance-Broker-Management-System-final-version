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

interface RequestWithUser {
  user: { tenantId: string; sub: string; role: string };
}

@Controller('api/v1/commissions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CommissionsController {
  constructor(private readonly commissionsService: CommissionsService) {}

  @Get()
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'VIEWER')
  findAll(@Request() req: RequestWithUser, @Query() query: CommissionQueryDto) {
    return this.commissionsService.findAll(req.user.tenantId, query);
  }

  @Post(':id/receive')
  @Roles('ADMIN', 'TENANT_ADMIN')
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
