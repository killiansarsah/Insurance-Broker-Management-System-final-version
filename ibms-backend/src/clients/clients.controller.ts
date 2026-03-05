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
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientQueryDto } from './dto/client-query.dto';
import { UpdateKycDto } from './dto/update-kyc.dto';
import { UpdateAmlDto } from './dto/update-aml.dto';
import { CreateBeneficiaryDto } from './dto/create-beneficiary.dto';
import { UpdateBeneficiaryDto } from './dto/update-beneficiary.dto';
import { CreateNextOfKinDto } from './dto/create-next-of-kin.dto';
import { CreateBankDetailDto } from './dto/create-bank-detail.dto';
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

@Controller('api/v1/clients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'AGENT')
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
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'AGENT', 'COMPLIANCE_OFFICER')
  findAll(@Request() req: RequestWithUser, @Query() query: ClientQueryDto) {
    return this.clientsService.findAll(req.user.tenantId, query);
  }

  @Get(':id')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'AGENT', 'COMPLIANCE_OFFICER')
  findOne(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.clientsService.findOne(req.user.tenantId, id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
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
  @Roles('ADMIN', 'TENANT_ADMIN')
  remove(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.clientsService.remove(req.user.tenantId, req.user.sub, id);
  }

  @Patch(':id/kyc')
  @Roles('ADMIN', 'TENANT_ADMIN', 'COMPLIANCE_OFFICER')
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
  @Roles('ADMIN', 'TENANT_ADMIN', 'COMPLIANCE_OFFICER')
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
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  createBeneficiary(
    @Request() req: RequestWithUser,
    @Param('clientId') clientId: string,
    @Body() dto: CreateBeneficiaryDto,
  ) {
    return this.clientsService.createBeneficiary(
      req.user.tenantId,
      clientId,
      dto,
    );
  }

  @Get(':clientId/beneficiaries')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'COMPLIANCE_OFFICER')
  getBeneficiaries(
    @Request() req: RequestWithUser,
    @Param('clientId') clientId: string,
  ) {
    return this.clientsService.getBeneficiaries(req.user.tenantId, clientId);
  }

  @Patch(':clientId/beneficiaries/:id')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  updateBeneficiary(
    @Request() req: RequestWithUser,
    @Param('clientId') clientId: string,
    @Param('id') id: string,
    @Body() dto: UpdateBeneficiaryDto,
  ) {
    return this.clientsService.updateBeneficiary(
      req.user.tenantId,
      clientId,
      id,
      dto,
    );
  }

  @Delete(':clientId/beneficiaries/:id')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  removeBeneficiary(
    @Request() req: RequestWithUser,
    @Param('clientId') clientId: string,
    @Param('id') id: string,
  ) {
    return this.clientsService.removeBeneficiary(
      req.user.tenantId,
      clientId,
      id,
    );
  }

  // --- NEXT OF KIN ---

  @Post(':clientId/next-of-kin')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  createNextOfKin(
    @Request() req: RequestWithUser,
    @Param('clientId') clientId: string,
    @Body() dto: CreateNextOfKinDto,
  ) {
    return this.clientsService.createNextOfKin(
      req.user.tenantId,
      clientId,
      dto,
    );
  }

  @Get(':clientId/next-of-kin')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'COMPLIANCE_OFFICER')
  getNextOfKin(
    @Request() req: RequestWithUser,
    @Param('clientId') clientId: string,
  ) {
    return this.clientsService.getNextOfKin(req.user.tenantId, clientId);
  }

  // --- BANK DETAILS ---

  @Post(':clientId/bank-details')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  createBankDetail(
    @Request() req: RequestWithUser,
    @Param('clientId') clientId: string,
    @Body() dto: CreateBankDetailDto,
  ) {
    return this.clientsService.createBankDetail(
      req.user.tenantId,
      clientId,
      dto,
    );
  }

  @Get(':clientId/bank-details')
  @Roles(
    'ADMIN',
    'TENANT_ADMIN',
    'BROKER',
    'COMPLIANCE_OFFICER',
    'FINANCE_MANAGER',
  )
  getBankDetails(
    @Request() req: RequestWithUser,
    @Param('clientId') clientId: string,
  ) {
    return this.clientsService.getBankDetails(req.user.tenantId, clientId);
  }
}
