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
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InvoiceQueryDto } from './dto/invoice-query.dto';
import { UpdateInvoiceDto, CancelInvoiceDto } from './dto/invoice-actions.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

import type { RequestWithUser } from '../../common/types/request.types.js';

@Controller('invoices')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  @Roles('ADMINISTRATOR', 'AGENT')
  create(@Request() req: RequestWithUser, @Body() dto: CreateInvoiceDto) {
    return this.invoicesService.create(req.user.tenantId, req.user.sub, dto);
  }

  @Get()
  @Roles('ADMINISTRATOR', 'AGENT')
  findAll(@Request() req: RequestWithUser, @Query() query: InvoiceQueryDto) {
    return this.invoicesService.findAll(req.user.tenantId, req.user.sub, query);
  }

  @Get(':id')
  @Roles('ADMINISTRATOR', 'AGENT')
  findOne(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.invoicesService.findOne(id, req.user.tenantId, req.user.sub);
  }

  @Patch(':id')
  @Roles('ADMINISTRATOR', 'AGENT')
  update(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: UpdateInvoiceDto,
  ) {
    return this.invoicesService.update(
      id,
      req.user.tenantId,
      req.user.sub,
      dto,
    );
  }

  @Post(':id/send')
  @Roles('ADMINISTRATOR', 'AGENT')
  send(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.invoicesService.send(id, req.user.tenantId, req.user.sub);
  }

  @Post(':id/cancel')
  @Roles('ADMINISTRATOR')
  cancel(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: CancelInvoiceDto,
  ) {
    return this.invoicesService.cancel(
      id,
      req.user.tenantId,
      req.user.sub,
      dto,
    );
  }
}
