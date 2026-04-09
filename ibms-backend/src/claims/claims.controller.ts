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
import { CreateClaimFollowUpDto } from './dto/claim-follow-up.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import type { RequestWithUser } from '../common/types/request.types.js';

@Controller('claims')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  @Post()
  @Roles('ADMINISTRATOR', 'AGENT')
  create(@Request() req: RequestWithUser, @Body() dto: CreateClaimDto) {
    return this.claimsService.create(req.user.tenantId, req.user.sub, dto);
  }

  @Get('metrics')
  @Roles('ADMINISTRATOR', 'AGENT')
  getMetrics(@Request() req: RequestWithUser) {
    return this.claimsService.getMetrics(req.user.tenantId, req.user.sub);
  }

  @Get()
  @Roles('ADMINISTRATOR', 'AGENT')
  findAll(@Request() req: RequestWithUser, @Query() query: ClaimQueryDto) {
    return this.claimsService.findAll(req.user.tenantId, req.user.sub, query);
  }

  @Get(':id')
  @Roles('ADMINISTRATOR', 'AGENT')
  findOne(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.claimsService.findOne(id, req.user.tenantId, req.user.sub);
  }

  @Patch(':id')
  @Roles('ADMINISTRATOR', 'AGENT')
  update(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: UpdateClaimDto,
  ) {
    return this.claimsService.update(id, req.user.tenantId, req.user.sub, dto);
  }

  // ─── STATUS TRANSITIONS ────────────────────────────

  @Post(':id/acknowledge')
  @Roles('ADMINISTRATOR', 'AGENT')
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
  @Roles('SUPERVISOR')
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
  @Roles('ADMINISTRATOR')
  approve(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: ApproveClaimDto,
  ) {
    return this.claimsService.approve(id, req.user.tenantId, req.user.sub, dto);
  }

  @Post(':id/reject')
  @Roles('ADMINISTRATOR')
  reject(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: RejectClaimDto,
  ) {
    return this.claimsService.reject(id, req.user.tenantId, req.user.sub, dto);
  }

  @Post(':id/settle')
  @Roles('ADMINISTRATOR')
  settle(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: SettleClaimDto,
  ) {
    return this.claimsService.settle(id, req.user.tenantId, req.user.sub, dto);
  }

  @Post(':id/reopen')
  @Roles('ADMINISTRATOR')
  reopen(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: ReopenClaimDto,
  ) {
    return this.claimsService.reopen(id, req.user.tenantId, req.user.sub, dto);
  }

  // ─── DOCUMENTS ─────────────────────────────────────

  @Post(':claimId/documents')
  @Roles('ADMINISTRATOR', 'AGENT')
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
  @Roles('ADMINISTRATOR', 'AGENT')
  listDocuments(
    @Request() req: RequestWithUser,
    @Param('claimId') claimId: string,
  ) {
    return this.claimsService.listDocuments(
      claimId,
      req.user.tenantId,
      req.user.sub,
    );
  }

  @Delete(':claimId/documents/:id')
  @Roles('ADMINISTRATOR')
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

  @Post(':claimId/follow-ups')
  @Roles('ADMINISTRATOR', 'AGENT', 'SUPERVISOR')
  addFollowUp(
    @Request() req: RequestWithUser,
    @Param('claimId') claimId: string,
    @Body() dto: CreateClaimFollowUpDto,
  ) {
    return this.claimsService.addFollowUp(
      claimId,
      req.user.tenantId,
      req.user.sub,
      dto,
    );
  }

  @Get(':claimId/follow-ups')
  @Roles('ADMINISTRATOR', 'AGENT', 'SUPERVISOR')
  listFollowUps(
    @Request() req: RequestWithUser,
    @Param('claimId') claimId: string,
  ) {
    return this.claimsService.listFollowUps(
      claimId,
      req.user.tenantId,
      req.user.sub,
    );
  }
}
