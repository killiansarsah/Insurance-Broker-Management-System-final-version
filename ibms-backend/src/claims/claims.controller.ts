import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ClaimsService } from './claims.service';
import { CreateClaimDto } from './dto/create-claim.dto';
import { ClaimQueryDto } from './dto/claim-query.dto';
import {
  UpdateClaimDto,
  AcknowledgeClaimDto,
  InvestigateClaimDto,
  ApproveClaimDto,
  RejectClaimDto,
  SettleClaimDto,
  ReopenClaimDto,
  CreateClaimDocumentDto,
} from './dto/claim-actions.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

interface RequestWithUser {
  user: { tenantId: string; sub: string; role: string };
}

@Controller('api/v1/claims')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  @Post()
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  create(@Request() req: RequestWithUser, @Body() dto: CreateClaimDto) {
    return this.claimsService.create(req.user.tenantId, req.user.sub, dto);
  }

  @Get()
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'VIEWER')
  findAll(@Request() req: RequestWithUser, @Query() query: ClaimQueryDto) {
    return this.claimsService.findAll(req.user.tenantId, query);
  }

  @Get(':id')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'VIEWER')
  findOne(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.claimsService.findOne(id, req.user.tenantId);
  }

  @Patch(':id')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  update(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: UpdateClaimDto,
  ) {
    return this.claimsService.update(id, req.user.tenantId, req.user.sub, dto);
  }

  // ─── STATUS TRANSITIONS ────────────────────────────

  @Post(':id/acknowledge')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  acknowledge(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: AcknowledgeClaimDto,
  ) {
    return this.claimsService.acknowledge(
      id,
      req.user.tenantId,
      req.user.sub,
      dto,
    );
  }

  @Post(':id/investigate')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  investigate(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: InvestigateClaimDto,
  ) {
    return this.claimsService.investigate(
      id,
      req.user.tenantId,
      req.user.sub,
      dto,
    );
  }

  @Post(':id/approve')
  @Roles('ADMIN', 'TENANT_ADMIN')
  approve(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: ApproveClaimDto,
  ) {
    return this.claimsService.approve(id, req.user.tenantId, req.user.sub, dto);
  }

  @Post(':id/reject')
  @Roles('ADMIN', 'TENANT_ADMIN')
  reject(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: RejectClaimDto,
  ) {
    return this.claimsService.reject(id, req.user.tenantId, req.user.sub, dto);
  }

  @Post(':id/settle')
  @Roles('ADMIN', 'TENANT_ADMIN')
  settle(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: SettleClaimDto,
  ) {
    return this.claimsService.settle(id, req.user.tenantId, req.user.sub, dto);
  }

  @Post(':id/reopen')
  @Roles('ADMIN', 'TENANT_ADMIN')
  reopen(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: ReopenClaimDto,
  ) {
    return this.claimsService.reopen(id, req.user.tenantId, req.user.sub, dto);
  }

  // ─── DOCUMENTS ─────────────────────────────────────

  @Post(':claimId/documents')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  addDocument(
    @Request() req: RequestWithUser,
    @Param('claimId') claimId: string,
    @Body() dto: CreateClaimDocumentDto,
  ) {
    return this.claimsService.addDocument(
      claimId,
      req.user.tenantId,
      req.user.sub,
      dto,
    );
  }

  @Get(':claimId/documents')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'VIEWER')
  listDocuments(
    @Request() req: RequestWithUser,
    @Param('claimId') claimId: string,
  ) {
    return this.claimsService.listDocuments(claimId, req.user.tenantId);
  }

  @Delete(':claimId/documents/:id')
  @Roles('ADMIN', 'TENANT_ADMIN')
  removeDocument(
    @Request() req: RequestWithUser,
    @Param('claimId') claimId: string,
    @Param('id') id: string,
  ) {
    return this.claimsService.removeDocument(
      claimId,
      id,
      req.user.tenantId,
      req.user.sub,
    );
  }
}
