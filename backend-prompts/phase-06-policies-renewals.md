# Phase 6: Policies & Renewals

## What This Phase Builds
- Full policy lifecycle management (create → bind → active → expired/cancelled/lapsed)
- Multi-type support: Motor (Comprehensive/ThirdParty/ThirdPartyFireTheft), Property, Marine, Life, Health, Travel, Liability, Engineering, Bond, Micro
- Vehicle/property/marine detail sub-models
- Endorsements (policy amendments mid-term)
- Premium installments (payment tracking)
- Policy documents (metadata, not file upload yet)
- Renewal tracking and management

## Prerequisites
- Phase 5 ✅ (Clients + Carriers/Products)

## Prompt

Using the existing NestJS project at `ibms-backend/`:

### Part A: Policies Module (`src/policies/`)

1. **`POST /api/v1/policies`** — JWT required, `@Permissions('policies', 'create')`.
   - Body: `CreatePolicyDto`:
     - Required: `clientId` (@IsUUID), `carrierId` (@IsUUID), `productId` (@IsUUID), `insuranceType` (@IsEnum), `startDate` (@IsDateString), `endDate` (@IsDateString), `premiumAmount` (Decimal), `sumInsured` (Decimal), `paymentFrequency` (@IsEnum: ANNUAL/SEMI_ANNUAL/QUARTERLY/MONTHLY)
     - Optional: `policyNumber` (auto-generate if blank: `POL-{YYYYMMDD}-{5-digit-seq}`), `currency` (default 'GHS'), `commission` (Decimal), `notes`
     - Conditional required:
       - If `insuranceType` starts with `MOTOR_*` → `vehicleDetails` REQUIRED (CreateVehicleDetailsDto)
       - If `insuranceType === PROPERTY_*` → `propertyDetails` REQUIRED
       - If `insuranceType === MARINE_*` → `marineDetails` REQUIRED
   - Defaults: `status = DRAFT`
   - Validate: client belongs to tenant, carrier belongs to tenant, product belongs to carrier
   - Validate: `endDate > startDate`
   - Auto-calculate `commission` if not provided: `premiumAmount × product.commissionRate / 100`
   - Transaction: create policy + sub-details + initial audit log, all in `prisma.$transaction`
   - Audit log: `policy.created`
   - Returns: `PolicyResponseDto`

   **`CreateVehicleDetailsDto`**: registrationNumber, make, model, year (@IsInt @Min(1900)), chassisNumber, engineNumber, color, bodyType, seatingCapacity, usage (PRIVATE/COMMERCIAL/GOVERNMENT)

   **`CreatePropertyDetailsDto`**: propertyType (RESIDENTIAL/COMMERCIAL/INDUSTRIAL), address, constructionType, yearBuilt, numberOfFloors, occupancyType, squareMeters (Decimal)

   **`CreateMarineDetailsDto`**: vesselName, vesselType, imoNumber, grossTonnage (Decimal), voyageFrom, voyageTo, cargoDescription, cargoValue (Decimal)

2. **`GET /api/v1/policies`** — JWT required, `@Permissions('policies', 'view')`.
   - ALWAYS filter by tenantId from JWT
   - Paginated (`PaginationDto`)
   - Searchable: `search` → policyNumber, client.firstName, client.lastName (Prisma relation search)
   - Filterable: `status`, `insuranceType`, `carrierId`, `clientId`, `paymentFrequency`
   - Date range: `startDateFrom`, `startDateTo`, `endDateFrom`, `endDateTo`
   - Sortable: `sortBy` (policyNumber, premiumAmount, startDate, endDate, createdAt), `sortOrder`
   - Include: client (name only), carrier (name only), product (name only)
   - Returns: paginated `PolicySummaryDto[]` with totalCount, totalPremium (sum)

3. **`GET /api/v1/policies/:id`** — JWT required, `@Permissions('policies', 'view')`.
   - Find by ID AND tenantId
   - Include ALL relations: client (full), carrier, product, vehicleDetails, propertyDetails, marineDetails, endorsements, installments, documents, claims (summary)
   - Returns: `PolicyDetailResponseDto`

4. **`PATCH /api/v1/policies/:id`** — JWT required, `@Permissions('policies', 'edit')`.
   - Can update: premiumAmount, sumInsured, endDate, notes, paymentFrequency
   - Cannot change: clientId, carrierId, insuranceType (use endorsement instead)
   - Audit log: `policy.updated` with before/after

5. **Policy status transitions:**

   **`POST /api/v1/policies/:id/bind`** — `@Permissions('policies', 'edit')`
   - Only from DRAFT → ACTIVE
   - Sets status = ACTIVE, bindDate = now
   - Creates premium installments based on paymentFrequency
   - Increments client.policyCount, adds to client.totalPremium
   - Audit log: `policy.bound`

   **`POST /api/v1/policies/:id/cancel`** — `@Permissions('policies', 'edit')`
   - Only from ACTIVE → CANCELLED
   - Body: `CancelPolicyDto` — `reason` (@IsString @MinLength(5)), `effectiveDate` (@IsDateString)
   - Decrements client.policyCount
   - Audit log: `policy.cancelled` with reason

   **`POST /api/v1/policies/:id/lapse`** — `@Roles('ADMIN', 'TENANT_ADMIN')`
   - Only from ACTIVE → LAPSED (non-payment)
   - Audit log: `policy.lapsed`

   **`POST /api/v1/policies/:id/reinstate`** — `@Roles('ADMIN', 'TENANT_ADMIN')`
   - Only from LAPSED → ACTIVE
   - Body: `ReinstatePolicyDto` — `reason`
   - Audit log: `policy.reinstated`

6. **Endorsements (`src/policies/endorsements/`):**

   **`POST /api/v1/policies/:policyId/endorsements`** — `@Permissions('policies', 'edit')`
   - Body: `CreateEndorsementDto` — `type` (ADDITION/DELETION/MODIFICATION/CANCELLATION), `description`, `effectiveDate`, `premiumAdjustment` (Decimal, can be negative), `details` (Json)
   - Generates endorsement number: `END-{policyNumber}-{seq}`
   - Status: starts as PENDING, needs approval
   - Audit log: `endorsement.created`

   **`PATCH /api/v1/policies/:policyId/endorsements/:id/approve`** — `@Permissions('policies', 'approve')`
   - Sets status = APPROVED, applies premiumAdjustment to policy.premiumAmount
   - Audit log: `endorsement.approved`

   **`PATCH /api/v1/policies/:policyId/endorsements/:id/reject`** — `@Permissions('policies', 'approve')`
   - Body: `reason`
   - Audit log: `endorsement.rejected`

7. **Premium Installments (auto-created on bind, but also manual):**

   **`GET /api/v1/policies/:policyId/installments`** — list installments
   - Returns: installmentNumber, dueDate, amount, status (PENDING/PAID/OVERDUE/WAIVED), paidDate, paidAmount

   **`PATCH /api/v1/policies/:policyId/installments/:id/pay`** — `@Permissions('finance', 'create')`
   - Body: `PayInstallmentDto` — `paidAmount` (Decimal), `paidDate` (@IsDateString), `paymentMethod` (@IsEnum: BANK_TRANSFER/CHEQUE/CASH/MOBILE_MONEY/CARD), `reference`
   - Sets status = PAID
   - Audit log: `installment.paid`

### Part B: Renewals Module (`src/renewals/`)

1. **`GET /api/v1/renewals`** — JWT required, `@Permissions('policies', 'view')`.
   - Lists policies approaching renewal (endDate within `daysAhead` param, default 90)
   - Filterable: `status` (PENDING/QUOTED/RENEWED/DECLINED/EXPIRED), `insuranceType`, `carrierId`
   - Sorted by endDate ascending (most urgent first)
   - Returns: `RenewalListDto[]` — policy summary + daysUntilExpiry + renewalStatus

2. **`POST /api/v1/policies/:id/renew`** — `@Permissions('policies', 'create')`.
   - Creates a NEW policy from existing one:
     - Same client, carrier, product, insuranceType
     - New startDate = old endDate + 1 day
     - New endDate = startDate + 1 year
     - Body: `RenewPolicyDto` — `premiumAmount` (Decimal, required — may differ from original), `sumInsured` (Decimal @IsOptional), `notes`
   - New policy starts as DRAFT (needs binding)
   - Old policy gets `renewedPolicyId` reference
   - Audit log: `policy.renewed`

3. **Scheduled check (CRON — use `@nestjs/schedule`):**
   - Daily at 00:00: find all ACTIVE policies with endDate < now → set status = EXPIRED
   - Audit log: `policy.expired` for each

## Verification Checklist
- [ ] `npm run build` — zero errors
- [ ] Create MOTOR_COMPREHENSIVE policy with vehicleDetails → success
- [ ] Create MOTOR policy WITHOUT vehicleDetails → validation error
- [ ] Create PROPERTY_ALL_RISK policy with propertyDetails → success
- [ ] Policy number auto-generated in format `POL-YYYYMMDD-XXXXX`
- [ ] `GET /api/v1/policies?search=POL-2025` → finds it
- [ ] Bind draft policy → status ACTIVE, installments created
- [ ] ANNUAL policy → 1 installment, QUARTERLY → 4, MONTHLY → 12
- [ ] Pay installment → status PAID, paidAmount recorded
- [ ] Cancel active policy → status CANCELLED, reason stored
- [ ] Create endorsement → PENDING status
- [ ] Approve endorsement → premium adjusted
- [ ] `GET /api/v1/renewals?daysAhead=90` → shows policies expiring within 90 days
- [ ] Renew policy → new DRAFT policy created, linked to original
- [ ] Tenant isolation: SIC user cannot see Enterprise policies
- [ ] Client validation: cannot create policy for client in different tenant
- [ ] Lapse → reinstate workflow works
- [ ] No `console.log`, no `any` types

After all checks pass, update `CHECKPOINT.md`: mark Phase 6 `[x]`.
