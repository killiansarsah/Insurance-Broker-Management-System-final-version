import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards, Request } from '@nestjs/common';
import { CarriersService } from './carriers.service';
import { CreateCarrierDto } from './dto/create-carrier.dto';
import { UpdateCarrierDto } from './dto/update-carrier.dto';
import { CarrierQueryDto } from './dto/carrier-query.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('api/v1/carriers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CarriersController {
    constructor(private readonly carriersService: CarriersService) { }

    @Post()
    @Roles('ADMIN', 'TENANT_ADMIN')
    create(@Request() req: any, @Body() createCarrierDto: CreateCarrierDto) {
        return this.carriersService.create(req.user.tenantId, req.user.sub, createCarrierDto);
    }

    @Get()
    // Any role with dashboard access
    @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'COMPLIANCE_OFFICER', 'FINANCE_MANAGER', 'AGENT', 'UNDERWRITER')
    findAll(@Request() req: any, @Query() query: CarrierQueryDto) {
        return this.carriersService.findAll(req.user.tenantId, query);
    }

    @Get(':id')
    @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'COMPLIANCE_OFFICER', 'FINANCE_MANAGER', 'AGENT', 'UNDERWRITER')
    findOne(@Request() req: any, @Param('id') id: string) {
        return this.carriersService.findOne(req.user.tenantId, id);
    }

    @Patch(':id')
    @Roles('ADMIN', 'TENANT_ADMIN')
    update(@Request() req: any, @Param('id') id: string, @Body() updateCarrierDto: UpdateCarrierDto) {
        return this.carriersService.update(req.user.tenantId, req.user.sub, id, updateCarrierDto);
    }
}
