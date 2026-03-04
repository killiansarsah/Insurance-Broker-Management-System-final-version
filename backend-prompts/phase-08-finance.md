# Phase 8: Finance Module

## What This Phase Builds
- Invoices (generate for policies, track payment)
- Transactions/Payments (bank, cheque, cash, Mobile Money — MTN/Telecel/AirtelTigo)
- Commissions (earned from carriers, calculated from policies)
- Expenses (manual entry + Excel import)
- Premium financing (installment plans with interest)
- Financial dashboard aggregations

## Prerequisites
- Phase 6 ✅ (Policies — for premium/commission data)

## Prompt

Using the existing NestJS project at `ibms-backend/`:

### Part A: Invoices (`src/finance/invoices/`)

1. **`POST /api/v1/invoices`** — JWT required, `@Permissions('finance', 'create')`.
   - Body: `CreateInvoiceDto`:
     - Required: `clientId` (@IsUUID), `policyId` (@IsUUID @IsOptional), `items` (array of { description: string, quantity: number, unitPrice: Decimal })
     - Optional: `dueDate` (@IsDateString, default now + 30 days), `tax` (Decimal, default 0), `discount` (Decimal, default 0), `notes`
   - Auto-generate: `invoiceNumber` = `INV-{YYYYMMDD}-{5-digit-seq}`
   - Auto-calculate: `subtotal` = sum of (quantity × unitPrice), `totalAmount` = subtotal + tax - discount
   - Defaults: `status = DRAFT`, `currency = GHS`
   - Audit log: `invoice.created`

2. **`GET /api/v1/invoices`** — paginated, filterable: status (DRAFT/SENT/PAID/OVERDUE/CANCELLED/PARTIALLY_PAID), clientId, dateRange, amountRange
   - Returns: summary with `totalOutstanding`, `totalOverdue`, `totalPaid`

3. **`GET /api/v1/invoices/:id`** — full detail with line items, payments, client info

4. **`PATCH /api/v1/invoices/:id`** — edit draft invoices only

5. **Status transitions:**
   - `POST /api/v1/invoices/:id/send` — DRAFT → SENT (marks sentAt = now)
   - `POST /api/v1/invoices/:id/cancel` — DRAFT/SENT → CANCELLED with reason
   - Payment recording moves SENT → PARTIALLY_PAID or PAID (auto-calculated)

6. **CRON job:** Daily at 01:00 — find SENT invoices past dueDate → mark OVERDUE

### Part B: Transactions/Payments (`src/finance/transactions/`)

1. **`POST /api/v1/transactions`** — JWT required, `@Permissions('finance', 'create')`.
   - Body: `CreateTransactionDto`:
     - Required: `type` (@IsEnum: PREMIUM_PAYMENT/COMMISSION_RECEIPT/CLAIM_PAYOUT/REFUND/EXPENSE/OTHER), `amount` (Decimal @IsPositive), `paymentMethod` (@IsEnum: BANK_TRANSFER/CHEQUE/CASH/MOBILE_MONEY_MTN/MOBILE_MONEY_TELECEL/MOBILE_MONEY_AIRTELTIGO/CARD/DIRECT_DEBIT), `date` (@IsDateString)
     - Optional: `clientId`, `policyId`, `invoiceId`, `claimId`, `reference`, `description`, `momoNumber` (required if paymentMethod is MOBILE_MONEY_*), `chequeNumber` (required if CHEQUE), `bankName`, `accountNumber`
   - Auto-generate: `transactionNumber` = `TXN-{YYYYMMDD}-{6-digit-seq}`
   - Defaults: `status = COMPLETED`, `currency = GHS`
   - If `invoiceId` provided: update invoice paidAmount, check if fully paid → update status
   - If `policyId` with PREMIUM_PAYMENT: find matching installment → mark PAID
   - Audit log: `transaction.created`

2. **`GET /api/v1/transactions`** — paginated, filterable by type, paymentMethod, dateRange, clientId, policyId, status
   - Returns summary: `totalInflow` (PREMIUM_PAYMENT + COMMISSION_RECEIPT), `totalOutflow` (CLAIM_PAYOUT + REFUND + EXPENSE)

3. **`GET /api/v1/transactions/:id`** — full detail

4. **`POST /api/v1/transactions/:id/void`** — `@Roles('ADMIN', 'TENANT_ADMIN', 'FINANCE_MANAGER')`
   - COMPLETED → VOIDED with reason
   - Reverses any invoice/installment updates
   - Audit log: `transaction.voided`

### Part C: Commissions (`src/finance/commissions/`)

1. **`GET /api/v1/commissions`** — JWT required, `@Permissions('commissions', 'view')`.
   - Lists commission records: policyId, policyNumber, clientName, carrierName, premiumAmount, commissionRate, commissionAmount, status (PENDING/EARNED/RECEIVED/PAID_OUT), dueDate
   - Filterable: status, carrierId, dateRange, agentId
   - Returns summary: `totalPending`, `totalEarned`, `totalReceived`

2. **`POST /api/v1/commissions/:id/receive`** — `@Permissions('commissions', 'edit')`
   - PENDING/EARNED → RECEIVED (carrier has paid the brokerage)
   - Body: `ReceiveCommissionDto` — `receivedAmount` (Decimal), `receivedDate`, `reference`
   - Creates a transaction record automatically
   - Audit log: `commission.received`

3. **Auto-generation:** When a policy is bound (Phase 6), automatically create a commission record with:
   - `commissionAmount = policy.premiumAmount × product.commissionRate / 100`
   - `status = PENDING`
   - `dueDate = policy.startDate + 30 days` (configurable)

### Part D: Expenses (`src/finance/expenses/`)

1. **`POST /api/v1/expenses`** — JWT required, `@Permissions('finance', 'create')`.
   - Body: `CreateExpenseDto`:
     - Required: `category` (@IsEnum: OFFICE_RENT/UTILITIES/SALARIES/TRANSPORT/MARKETING/PROFESSIONAL_FEES/IT_EQUIPMENT/OFFICE_SUPPLIES/INSURANCE/TRAINING/ENTERTAINMENT/MISCELLANEOUS), `amount` (Decimal @IsPositive), `date` (@IsDateString), `description`
     - Optional: `vendor`, `receiptUrl`, `departmentId`, `approvalRequired` (boolean, default false)
   - Defaults: `status = PENDING` if approvalRequired, else `APPROVED`
   - Audit log: `expense.created`

2. **`GET /api/v1/expenses`** — paginated, filterable by category, status, dateRange, departmentId

3. **`POST /api/v1/expenses/:id/approve`** — `@Roles('ADMIN', 'TENANT_ADMIN', 'FINANCE_MANAGER')`
   - PENDING → APPROVED
   - Creates a transaction record (type = EXPENSE)
   - Audit log: `expense.approved`

4. **`POST /api/v1/expenses/import`** — `@Permissions('finance', 'create')`
   - Body: `ImportExpensesDto` — `expenses` (array of CreateExpenseDto)
   - Bulk create (max 100 at a time)
   - Returns: `{ created: number, errors: { row: number, message: string }[] }`

### Part E: Premium Financing (`src/finance/premium-financing/`)

1. **`POST /api/v1/premium-financing`** — JWT required, `@Permissions('finance', 'create')`.
   - Body: `CreatePremiumFinancingDto`:
     - Required: `policyId` (@IsUUID), `clientId` (@IsUUID), `financedAmount` (Decimal), `interestRate` (Decimal, annual %), `numberOfInstallments` (@IsInt @Min(2) @Max(12)), `startDate` (@IsDateString)
   - Auto-generate: `pfNumber` = `PF-{YYYYMMDD}-{4-digit-seq}`
   - Auto-calculate:
     - `totalInterest = financedAmount × interestRate / 100`
     - `totalRepayment = financedAmount + totalInterest`
     - `monthlyInstallment = totalRepayment / numberOfInstallments`
   - Auto-create `PfInstallment` records for each month: installmentNumber, dueDate, amount, status=PENDING
   - Defaults: `status = ACTIVE`
   - Audit log: `premium_financing.created`

2. **`GET /api/v1/premium-financing`** — paginated, filterable: status (ACTIVE/COMPLETED/DEFAULTED/CANCELLED), clientId

3. **`GET /api/v1/premium-financing/:id`** — with installments, client, policy

4. **`POST /api/v1/premium-financing/:id/installments/:installmentId/pay`** — `@Permissions('finance', 'create')`
   - Body: `PayPfInstallmentDto` — `paidAmount`, `paidDate`, `paymentMethod`, `reference`
   - Sets installment status = PAID
   - If all installments paid → premium financing status = COMPLETED
   - Creates transaction record
   - Audit log: `pf.installment.paid`

### Part F: Financial Dashboard (`src/finance/dashboard/`)

**`GET /api/v1/finance/dashboard`** — JWT required, `@Permissions('finance', 'view')`.
Returns aggregated data:
```json
{
  "totalPremiumCollected": "Decimal",
  "totalPremiumOutstanding": "Decimal",
  "totalCommissionsEarned": "Decimal",
  "totalCommissionsPending": "Decimal",
  "totalClaimsPaid": "Decimal",
  "totalExpenses": "Decimal",
  "netIncome": "Decimal",
  "monthlyRevenue": [{ "month": "2025-01", "premium": "Decimal", "commission": "Decimal", "claims": "Decimal", "expenses": "Decimal" }],
  "overdueInvoices": "number",
  "overdueAmount": "Decimal",
  "paymentMethodBreakdown": [{ "method": "string", "count": "number", "total": "Decimal" }]
}
```
- Date range filter: `from`, `to` (default: current fiscal year)
- All amounts in GHS

## Verification Checklist
- [ ] `npm run build` — zero errors
- [ ] Create invoice with 3 line items → subtotal/total calculated correctly
- [ ] Send invoice → status SENT, sentAt set
- [ ] Create PREMIUM_PAYMENT transaction linked to invoice → invoice paidAmount updated
- [ ] Second payment completing the balance → invoice status = PAID
- [ ] Void transaction → invoice paidAmount reversed
- [ ] MoMo payment (MOBILE_MONEY_MTN) requires momoNumber → validated
- [ ] Bind a policy → commission record auto-created with correct amount
- [ ] Receive commission → transaction auto-created
- [ ] Create expense with approvalRequired → status PENDING
- [ ] Approve expense → status APPROVED, transaction created
- [ ] Bulk import 5 expenses → all created
- [ ] Create premium financing → installment schedule generated correctly
- [ ] Pay all PF installments → PF status = COMPLETED
- [ ] `GET /api/v1/finance/dashboard` → all aggregations correct
- [ ] Monthly revenue breakdown returns 12 months
- [ ] Overdue invoice CRON marks correctly
- [ ] Tenant isolation on all endpoints
- [ ] No `console.log`, no `any` types

After all checks pass, update `CHECKPOINT.md`: mark Phase 8 `[x]`.
