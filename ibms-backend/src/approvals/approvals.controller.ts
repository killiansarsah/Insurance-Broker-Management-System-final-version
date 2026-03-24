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
import { ApprovalsService } from './approvals.service';
import {
  CreateApprovalDto,
  ApprovalQueryDto,
  ApprovalDecisionDto,
} from './dto/approval.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import type { RequestWithUser } from '../common/types/request.types.js';

@Controller('approvals')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ApprovalsController {
  constructor(private readonly approvalsService: ApprovalsService) {}

  @Post()
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  create(@Request() req: RequestWithUser, @Body() dto: CreateApprovalDto) {
    return this.approvalsService.create(req.user.tenantId, req.user.sub, dto);
  }

  @Get()
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'VIEWER')
  findAll(@Request() req: RequestWithUser, @Query() query: ApprovalQueryDto) {
    return this.approvalsService.findAll(req.user.tenantId, query);
  }

  @Get('my-requests')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'VIEWER')
  myRequests(@Request() req: RequestWithUser) {
    return this.approvalsService.findMyRequests(
      req.user.tenantId,
      req.user.sub,
    );
  }

  @Post(':id/approve')
  @Roles('ADMIN', 'TENANT_ADMIN')
  approve(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: ApprovalDecisionDto,
  ) {
    return this.approvalsService.approve(
      id,
      req.user.tenantId,
      req.user.sub,
      dto,
    );
  }

  @Post(':id/reject')
  @Roles('ADMIN', 'TENANT_ADMIN')
  reject(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: ApprovalDecisionDto,
  ) {
    return this.approvalsService.reject(
      id,
      req.user.tenantId,
      req.user.sub,
      dto,
    );
  }
}
