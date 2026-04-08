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
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientQueryDto } from './dto/client-query.dto';
import { ExportClientsDto, ExportFormat } from './dto/export-clients.dto';
import { UpdateKycDto } from './dto/update-kyc.dto';
import { UpdateAmlDto } from './dto/update-aml.dto';
import { CreateBeneficiaryDto } from './dto/create-beneficiary.dto';
import { UpdateBeneficiaryDto } from './dto/update-beneficiary.dto';
import { CreateNextOfKinDto } from './dto/create-next-of-kin.dto';
import { CreateBankDetailDto } from './dto/create-bank-detail.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import type { AuthenticatedRequest as RequestWithUser } from '../common/types/request.types.js';

@Controller('clients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @Roles('ADMINISTRATOR', 'AGENT')
  create(
    @Request() req: RequestWithUser,
    @Body() createClientDto: CreateClientDto,
  ) {
    return this.clientsService.create(
      req.user.tenantId,
      req.user.sub,
      createClientDto,
    );
  }

  @Get()
  @Roles('ADMINISTRATOR', 'AGENT', 'SUPERVISOR')
  findAll(@Request() req: RequestWithUser, @Query() query: ClientQueryDto) {
    return this.clientsService.findAll(req.user.tenantId, req.user.sub, query);
  }

  @Post('export')
  @Roles('ADMINISTRATOR', 'AGENT', 'SUPERVISOR')
  async export(
    @Request() req: RequestWithUser,
    @Body() dto: ExportClientsDto,
    @Res() res: Response,
  ) {
    const fileBuffer = await this.clientsService.export(
      req.user.tenantId,
      req.user.sub,
      req.user.email,
      dto,
    );

    const dateStr = new Date().toISOString().split('T')[0];
    const agencyName = 'Agency'; // Placeholder, we will fetch real name in service or controller if needed, but it's okay for now. Actually, let's fetch tenant later if needed or just use "Clients_Export"

    if (dto.format === ExportFormat.CSV) {
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${agencyName}_Clients_Export_${dateStr}.csv"`,
      );
    } else {
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${agencyName}_Clients_Export_${dateStr}.xlsx"`,
      );
    }

    res.send(fileBuffer);
  }

  @Get(':id')
  @Roles('ADMINISTRATOR', 'AGENT', 'SUPERVISOR')
  findOne(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.clientsService.findOne(req.user.tenantId, req.user.sub, id);
  }

  @Patch(':id')
  @Roles('ADMINISTRATOR', 'AGENT')
  update(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientsService.update(
      req.user.tenantId,
      req.user.sub,
      id,
      updateClientDto,
    );
  }

  @Delete(':id')
  @Roles('ADMINISTRATOR')
  remove(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.clientsService.remove(req.user.tenantId, req.user.sub, id);
  }

  @Patch(':id/kyc')
  @Roles('ADMINISTRATOR', 'SUPERVISOR')
  updateKyc(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateKycDto: UpdateKycDto,
  ) {
    return this.clientsService.updateKyc(
      req.user.tenantId,
      req.user.sub,
      id,
      updateKycDto,
    );
  }

  @Patch(':id/aml')
  @Roles('ADMINISTRATOR', 'SUPERVISOR')
  updateAml(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateAmlDto: UpdateAmlDto,
  ) {
    return this.clientsService.updateAml(
      req.user.tenantId,
      req.user.sub,
      id,
      updateAmlDto,
    );
  }

  // --- BENEFICIARIES ---

  @Post(':clientId/beneficiaries')
  @Roles('ADMINISTRATOR', 'AGENT')
  createBeneficiary(
    @Request() req: RequestWithUser,
    @Param('clientId') clientId: string,
    @Body() dto: CreateBeneficiaryDto,
  ) {
    return this.clientsService.createBeneficiary(
      req.user.tenantId,
      req.user.sub,
      clientId,
      dto,
    );
  }

  @Get(':clientId/beneficiaries')
  @Roles('ADMINISTRATOR', 'AGENT', 'SUPERVISOR')
  getBeneficiaries(
    @Request() req: RequestWithUser,
    @Param('clientId') clientId: string,
  ) {
    return this.clientsService.getBeneficiaries(
      req.user.tenantId,
      req.user.sub,
      clientId,
    );
  }

  @Patch(':clientId/beneficiaries/:id')
  @Roles('ADMINISTRATOR', 'AGENT')
  updateBeneficiary(
    @Request() req: RequestWithUser,
    @Param('clientId') clientId: string,
    @Param('id') id: string,
    @Body() dto: UpdateBeneficiaryDto,
  ) {
    return this.clientsService.updateBeneficiary(
      req.user.tenantId,
      req.user.sub,
      clientId,
      id,
      dto,
    );
  }

  @Delete(':clientId/beneficiaries/:id')
  @Roles('ADMINISTRATOR', 'AGENT')
  removeBeneficiary(
    @Request() req: RequestWithUser,
    @Param('clientId') clientId: string,
    @Param('id') id: string,
  ) {
    return this.clientsService.removeBeneficiary(
      req.user.tenantId,
      req.user.sub,
      clientId,
      id,
    );
  }

  // --- NEXT OF KIN ---

  @Post(':clientId/next-of-kin')
  @Roles('ADMINISTRATOR', 'AGENT')
  createNextOfKin(
    @Request() req: RequestWithUser,
    @Param('clientId') clientId: string,
    @Body() dto: CreateNextOfKinDto,
  ) {
    return this.clientsService.createNextOfKin(
      req.user.tenantId,
      req.user.sub,
      clientId,
      dto,
    );
  }

  @Get(':clientId/next-of-kin')
  @Roles('ADMINISTRATOR', 'AGENT', 'SUPERVISOR')
  getNextOfKin(
    @Request() req: RequestWithUser,
    @Param('clientId') clientId: string,
  ) {
    return this.clientsService.getNextOfKin(
      req.user.tenantId,
      req.user.sub,
      clientId,
    );
  }

  // --- BANK DETAILS ---

  @Post(':clientId/bank-details')
  @Roles('ADMINISTRATOR', 'AGENT')
  createBankDetail(
    @Request() req: RequestWithUser,
    @Param('clientId') clientId: string,
    @Body() dto: CreateBankDetailDto,
  ) {
    return this.clientsService.createBankDetail(
      req.user.tenantId,
      req.user.sub,
      clientId,
      dto,
    );
  }

  @Get(':clientId/bank-details')
  @Roles('ADMINISTRATOR', 'AGENT', 'SUPERVISOR', 'MANAGER')
  getBankDetails(
    @Request() req: RequestWithUser,
    @Param('clientId') clientId: string,
  ) {
    return this.clientsService.getBankDetails(
      req.user.tenantId,
      req.user.sub,
      clientId,
    );
  }
}
