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
import { PoliciesService } from './policies.service';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { PolicyQueryDto } from './dto/policy-query.dto';
import { CancelPolicyDto } from './dto/cancel-policy.dto';
import { ReinstatePolicyDto } from './dto/reinstate-policy.dto';
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

@Controller('api/v1/policies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PoliciesController {
  constructor(private readonly policiesService: PoliciesService) {}

  @Post()
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  create(@Request() req: RequestWithUser, @Body() dto: CreatePolicyDto) {
    return this.policiesService.create(req.user.tenantId, req.user.sub, dto);
  }

  @Get()
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'VIEWER')
  findAll(@Request() req: RequestWithUser, @Query() query: PolicyQueryDto) {
    return this.policiesService.findAll(req.user.tenantId, query);
  }

  @Get(':id')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'VIEWER')
  findOne(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.policiesService.findOne(id, req.user.tenantId);
  }

  @Patch(':id')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  update(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: UpdatePolicyDto,
  ) {
    return this.policiesService.update(
      id,
      req.user.tenantId,
      req.user.sub,
      dto,
    );
  }

  @Post(':id/bind')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  bind(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.policiesService.bind(id, req.user.tenantId, req.user.sub);
  }

  @Post(':id/cancel')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  cancel(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: CancelPolicyDto,
  ) {
    return this.policiesService.cancel(
      id,
      req.user.tenantId,
      req.user.sub,
      dto,
    );
  }

  @Post(':id/lapse')
  @Roles('ADMIN', 'TENANT_ADMIN')
  lapse(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.policiesService.lapse(id, req.user.tenantId, req.user.sub);
  }

  @Post(':id/reinstate')
  @Roles('ADMIN', 'TENANT_ADMIN')
  reinstate(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: ReinstatePolicyDto,
  ) {
    return this.policiesService.reinstate(
      id,
      req.user.tenantId,
      req.user.sub,
      dto,
    );
  }
}
