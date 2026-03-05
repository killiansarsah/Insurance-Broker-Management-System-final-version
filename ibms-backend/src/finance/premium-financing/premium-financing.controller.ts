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
import { PremiumFinancingService } from './premium-financing.service';
import {
  CreatePremiumFinancingDto,
  PfQueryDto,
  PayPfInstallmentDto,
} from './dto/premium-financing.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

interface RequestWithUser {
  user: { tenantId: string; sub: string; role: string };
}

@Controller('api/v1/premium-financing')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PremiumFinancingController {
  constructor(private readonly pfService: PremiumFinancingService) {}

  @Post()
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  create(
    @Request() req: RequestWithUser,
    @Body() dto: CreatePremiumFinancingDto,
  ) {
    return this.pfService.create(req.user.tenantId, req.user.sub, dto);
  }

  @Get()
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'VIEWER')
  findAll(@Request() req: RequestWithUser, @Query() query: PfQueryDto) {
    return this.pfService.findAll(req.user.tenantId, query);
  }

  @Get(':id')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'VIEWER')
  findOne(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.pfService.findOne(id, req.user.tenantId);
  }

  @Post(':id/installments/:installmentId/pay')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  payInstallment(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Param('installmentId') installmentId: string,
    @Body() dto: PayPfInstallmentDto,
  ) {
    return this.pfService.payInstallment(
      id,
      installmentId,
      req.user.tenantId,
      req.user.sub,
      dto,
    );
  }
}
