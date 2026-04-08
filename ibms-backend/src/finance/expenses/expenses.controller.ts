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
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto, ImportExpensesDto } from './dto/create-expense.dto';
import { ExpenseQueryDto } from './dto/expense-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

import type { RequestWithUser } from '../../common/types/request.types.js';

@Controller('expenses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @Roles('ADMINISTRATOR', 'AGENT')
  create(@Request() req: RequestWithUser, @Body() dto: CreateExpenseDto) {
    return this.expensesService.create(req.user.tenantId, req.user.sub, dto);
  }

  @Get()
  @Roles('ADMINISTRATOR', 'MANAGER', 'SUPERVISOR')
  findAll(@Request() req: RequestWithUser, @Query() query: ExpenseQueryDto) {
    return this.expensesService.findAll(req.user.tenantId, query);
  }

  @Post(':id/approve')
  @Roles('ADMINISTRATOR', 'MANAGER')
  approve(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.expensesService.approve(id, req.user.tenantId, req.user.sub);
  }

  @Post('import')
  @Roles('ADMINISTRATOR', 'MANAGER')
  bulkImport(@Request() req: RequestWithUser, @Body() dto: ImportExpensesDto) {
    return this.expensesService.bulkImport(
      req.user.tenantId,
      req.user.sub,
      dto,
    );
  }
}
