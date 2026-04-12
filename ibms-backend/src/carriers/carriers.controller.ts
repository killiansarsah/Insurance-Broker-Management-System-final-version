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
  Delete,
} from '@nestjs/common';
import { CarriersService } from './carriers.service';
import { CreateCarrierDto } from './dto/create-carrier.dto';
import { UpdateCarrierDto } from './dto/update-carrier.dto';
import { CarrierQueryDto } from './dto/carrier-query.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import type { RequestWithUser } from '../common/types/request.types.js';

@Controller('carriers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CarriersController {
  constructor(private readonly carriersService: CarriersService) {}

  @Post()
  @Roles('ADMINISTRATOR')
  create(
    @Request() req: RequestWithUser,
    @Body() createCarrierDto: CreateCarrierDto,
  ) {
    return this.carriersService.create(
      req.user.tenantId,
      req.user.sub,
      createCarrierDto,
    );
  }

  @Get()
  // Any role with dashboard access
  @Roles('ADMINISTRATOR', 'AGENT', 'SUPERVISOR', 'MANAGER')
  findAll(@Request() req: RequestWithUser, @Query() query: CarrierQueryDto) {
    return this.carriersService.findAll(req.user.tenantId, query);
  }

  @Get(':id')
  @Roles('ADMINISTRATOR', 'AGENT', 'SUPERVISOR', 'MANAGER')
  findOne(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.carriersService.findOne(req.user.tenantId, id);
  }

  @Patch(':id')
  @Roles('ADMINISTRATOR')
  update(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateCarrierDto: UpdateCarrierDto,
  ) {
    return this.carriersService.update(
      req.user.tenantId,
      req.user.sub,
      id,
      updateCarrierDto,
    );
  }

  @Delete(':id')
  @Roles('ADMINISTRATOR')
  remove(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.carriersService.remove(req.user.tenantId, req.user.sub, id);
  }
}
