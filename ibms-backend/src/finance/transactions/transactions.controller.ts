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
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionQueryDto } from './dto/transaction-query.dto';
import { VoidTransactionDto } from './dto/void-transaction.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

import type { RequestWithUser } from '../../common/types/request.types.js';

@Controller('transactions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @Roles('ADMINISTRATOR', 'AGENT')
  create(@Request() req: RequestWithUser, @Body() dto: CreateTransactionDto) {
    return this.transactionsService.create(
      req.user.tenantId,
      req.user.sub,
      dto,
    );
  }

  @Get()
  @Roles('ADMINISTRATOR', 'AGENT')
  findAll(
    @Request() req: RequestWithUser,
    @Query() query: TransactionQueryDto,
  ) {
    return this.transactionsService.findAll(
      req.user.tenantId,
      req.user.sub,
      query,
    );
  }

  @Get('ledger-summary')
  @Roles('ADMINISTRATOR', 'MANAGER', 'AGENT')
  ledgerSummary(@Request() req: RequestWithUser) {
    return this.transactionsService.ledgerSummary(
      req.user.tenantId,
      req.user.sub,
    );
  }

  @Get(':id')
  @Roles('ADMINISTRATOR', 'AGENT')
  findOne(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.transactionsService.findOne(id, req.user.tenantId, req.user.sub);
  }

  @Post(':id/void')
  @Roles('ADMINISTRATOR', 'MANAGER')
  voidTransaction(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: VoidTransactionDto,
  ) {
    return this.transactionsService.void(
      id,
      req.user.tenantId,
      req.user.sub,
      dto,
    );
  }
}
