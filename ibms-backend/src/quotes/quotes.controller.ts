import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { QuoteQueryDto } from './dto/quote-query.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import type { RequestWithUser } from '../common/types/request.types.js';

@Controller('quotes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post()
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'SENIOR_BROKER')
  create(@Request() req: RequestWithUser, @Body() dto: CreateQuoteDto) {
    return this.quotesService.create(req.user.tenantId, req.user.sub, dto);
  }

  @Get()
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'SENIOR_BROKER', 'VIEWER')
  findAll(@Request() req: RequestWithUser, @Query() query: QuoteQueryDto) {
    return this.quotesService.findAll(req.user.tenantId, query);
  }

  @Get(':id')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'SENIOR_BROKER', 'VIEWER')
  findOne(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.quotesService.findOne(id, req.user.tenantId);
  }

  @Patch(':id')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'SENIOR_BROKER')
  update(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: UpdateQuoteDto,
  ) {
    return this.quotesService.update(id, req.user.tenantId, dto);
  }

  @Post(':id/send')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'SENIOR_BROKER')
  send(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.quotesService.send(id, req.user.tenantId);
  }

  @Post(':id/accept')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'SENIOR_BROKER')
  accept(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.quotesService.accept(id, req.user.tenantId);
  }

  @Post(':id/decline')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'SENIOR_BROKER')
  decline(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.quotesService.decline(id, req.user.tenantId);
  }

  @Delete(':id')
  @Roles('ADMIN', 'TENANT_ADMIN')
  remove(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.quotesService.remove(id, req.user.tenantId);
  }
}
