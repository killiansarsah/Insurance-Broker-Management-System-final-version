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

interface RequestWithUser {
  user: { tenantId: string; sub: string; role: string };
}

@Controller('api/v1/transactions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  create(@Request() req: RequestWithUser, @Body() dto: CreateTransactionDto) {
    return this.transactionsService.create(
      req.user.tenantId,
      req.user.sub,
      dto,
    );
  }

  @Get()
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'VIEWER')
  findAll(
    @Request() req: RequestWithUser,
    @Query() query: TransactionQueryDto,
  ) {
    return this.transactionsService.findAll(req.user.tenantId, query);
  }

  @Get(':id')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'VIEWER')
  findOne(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.transactionsService.findOne(id, req.user.tenantId);
  }

  @Post(':id/void')
  @Roles('ADMIN', 'TENANT_ADMIN', 'FINANCE_MANAGER')
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
