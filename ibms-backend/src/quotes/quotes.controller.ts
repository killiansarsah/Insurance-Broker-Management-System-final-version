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
  @Roles('ADMINISTRATOR', 'AGENT', 'MANAGER')
  create(@Request() req: RequestWithUser, @Body() dto: CreateQuoteDto) {
    return this.quotesService.create(req.user.tenantId, req.user.sub, dto);
  }

  @Get()
  @Roles('ADMINISTRATOR', 'AGENT', 'MANAGER')
  findAll(@Request() req: RequestWithUser, @Query() query: QuoteQueryDto) {
    return this.quotesService.findAll(req.user.tenantId, req.user.sub, query);
  }

  @Get(':id')
  @Roles('ADMINISTRATOR', 'AGENT', 'MANAGER')
  findOne(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.quotesService.findOne(id, req.user.tenantId, req.user.sub);
  }

  @Patch(':id')
  @Roles('ADMINISTRATOR', 'AGENT', 'MANAGER')
  update(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: UpdateQuoteDto,
  ) {
    return this.quotesService.update(id, req.user.tenantId, req.user.sub, dto);
  }

  @Post(':id/send')
  @Roles('ADMINISTRATOR', 'AGENT', 'MANAGER')
  send(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.quotesService.send(id, req.user.tenantId, req.user.sub);
  }

  @Post(':id/accept')
  @Roles('ADMINISTRATOR', 'AGENT', 'MANAGER')
  accept(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.quotesService.accept(id, req.user.tenantId, req.user.sub);
  }

  @Post(':id/decline')
  @Roles('ADMINISTRATOR', 'AGENT', 'MANAGER')
  decline(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.quotesService.decline(id, req.user.tenantId, req.user.sub);
  }

  @Delete(':id')
  @Roles('ADMINISTRATOR')
  remove(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.quotesService.remove(id, req.user.tenantId);
  }
}
