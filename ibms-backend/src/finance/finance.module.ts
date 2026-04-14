import { Module, forwardRef } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PoliciesModule } from '../policies/policies.module';
import { InvoicesService } from './invoices/invoices.service';
import { InvoicesController } from './invoices/invoices.controller';
import { TransactionsService } from './transactions/transactions.service';
import { TransactionsController } from './transactions/transactions.controller';
import { CommissionsService } from './commissions/commissions.service';
import { CommissionsController } from './commissions/commissions.controller';
import { ExpensesService } from './expenses/expenses.service';
import { ExpensesController } from './expenses/expenses.controller';
import { PremiumFinancingService } from './premium-financing/premium-financing.service';
import { PremiumFinancingController } from './premium-financing/premium-financing.controller';
import { FinanceDashboardService } from './dashboard/finance-dashboard.service';
import { FinanceDashboardController } from './dashboard/finance-dashboard.controller';
import { RemittancesService } from './remittances/remittances.service';
import { RemittancesController } from './remittances/remittances.controller';

import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, forwardRef(() => PoliciesModule), NotificationsModule],
  controllers: [
    InvoicesController,
    TransactionsController,
    CommissionsController,
    ExpensesController,
    PremiumFinancingController,
    FinanceDashboardController,
    RemittancesController,
  ],
  providers: [
    InvoicesService,
    TransactionsService,
    CommissionsService,
    ExpensesService,
    PremiumFinancingService,
    FinanceDashboardService,
    RemittancesService,
  ],
  exports: [InvoicesService, CommissionsService, RemittancesService],
})
export class FinanceModule {}
