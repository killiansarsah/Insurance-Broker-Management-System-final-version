# Phase 5: Clients & Carriers/Products

## What This Phase Builds
- Full Client CRUD (44 fields, KYC/AML, beneficiaries, next-of-kin, bank details)
- Carrier/Product management (for SIC admin, read-only for broker-level)
- Search, filter, pagination across all endpoints

## Prerequisites
- Phase 4 ✅ (Users module for createdById references)

## Prompt

Using the existing NestJS project at `ibms-backend/`:

### Part A: Clients Module (`src/clients/`)

1. **`POST /api/v1/clients`** — JWT required, `@Permissions('clients', 'create')`.
   - Body: `CreateClientDto` with ALL fields from the Prisma `Client` model:
     - Required: `clientType` (INDIVIDUAL/CORPORATE), `firstName`, `lastName`, `email`, `phone`
     - Optional: `dateOfBirth`, `ghanaCardNumber`, `tinNumber`, `employer`, `occupation`, `annualIncome` (Decimal), `industry`, `companyName`, `companyRegistration`, `address`, `city`, `region` (Ghana regions enum), `digitalAddress`, `landmark`, `emergencyContactName`, `emergencyContactPhone`, `emergencyContactRelation`, `source` (REFERRAL/WALK_IN/ONLINE/AGENT/PARTNER), `notes`
   - Defaults: `status = PROSPECT`, `kycStatus = PENDING`, `amlStatus = NOT_SCREENED`
   - Auto-set: `tenantId` from JWT, `createdById` from JWT user, `policyCount = 0`, `totalPremium = 0`, `claimCount = 0`
   - Audit log: `client.created`
   - Returns: `ClientResponseDto`

2. **`GET /api/v1/clients`** — JWT required, `@Permissions('clients', 'view')`.
   - ALWAYS filters by `tenantId` from JWT
   - Paginated: `PaginationDto` (page, limit, default 1/20)
   - Searchable: `search` param → firstName, lastName, email, phone, companyName (case-insensitive)
   - Filterable: `clientType`, `status`, `kycStatus`, `amlStatus`, `region`, `source`
   - Sortable: `sortBy` (name, createdAt, totalPremium, policyCount), `sortOrder` (asc/desc)
   - Returns: paginated `ClientResponseDto[]` with totalCount

3. **`GET /api/v1/clients/:id`** — JWT required, `@Permissions('clients', 'view')`.
   - Find by ID AND tenantId
   - Include relations: beneficiaries, nextOfKin, bankDetails, policies (summary only: id, policyNumber, status, type), claims (summary: id, claimNumber, status)
   - Returns: `ClientDetailResponseDto`

4. **`PATCH /api/v1/clients/:id`** — JWT required, `@Permissions('clients', 'edit')`.
   - Partial update, validate each provided field
   - Cannot change tenantId
   - Audit log: `client.updated` with changed fields

5. **`DELETE /api/v1/clients/:id`** — JWT required, `@Permissions('clients', 'delete')`.
   - Soft delete: set `deletedAt = now`
   - Only if client has zero active policies (status = ACTIVE)
   - Audit log: `client.deleted`

6. **`PATCH /api/v1/clients/:id/kyc`** — JWT required, `@Roles('ADMIN', 'TENANT_ADMIN', 'COMPLIANCE_OFFICER')`.
   - Body: `UpdateKycDto` — `kycStatus` (@IsEnum: PENDING/VERIFIED/REJECTED/EXPIRED), `notes` (@IsString @IsOptional)
   - Audit log: `client.kyc.updated`

7. **`PATCH /api/v1/clients/:id/aml`** — JWT required, `@Roles('ADMIN', 'TENANT_ADMIN', 'COMPLIANCE_OFFICER')`.
   - Body: `UpdateAmlDto` — `amlStatus` (@IsEnum: NOT_SCREENED/CLEAR/FLAGGED/BLOCKED), `notes`
   - If BLOCKED: check for active policies, flag them
   - Audit log: `client.aml.updated`

8. **Nested resources:**

   **`POST /api/v1/clients/:clientId/beneficiaries`** — create beneficiary
   - Body: `CreateBeneficiaryDto` — name, relationship, percentage (Decimal, sum ≤ 100), phone, email, address
   - Validate: total percentage across all beneficiaries for this client ≤ 100

   **`GET /api/v1/clients/:clientId/beneficiaries`** — list beneficiaries

   **`PATCH /api/v1/clients/:clientId/beneficiaries/:id`** — update beneficiary

   **`DELETE /api/v1/clients/:clientId/beneficiaries/:id`** — remove beneficiary

   **`POST /api/v1/clients/:clientId/next-of-kin`** — create next-of-kin
   - Body: name, relationship, phone, email, address

   **`POST /api/v1/clients/:clientId/bank-details`** — create bank details
   - Body: bankName, accountNumber, accountName, branch, momoProvider (MTN/TELECEL/AIRTELTIGO), momoNumber

### Part B: Carriers Module (`src/carriers/`)

1. **`POST /api/v1/carriers`** — JWT required, `@Roles('TENANT_ADMIN', 'ADMIN')`.
   - Body: `CreateCarrierDto` — name (@IsString @MinLength(2)), code (@IsString @IsOptional), licenseNumber, nicRegistration, email, phone, address, website, logoUrl, status (default ACTIVE), commissionStructure (Json @IsOptional)
   - Unique: name per tenant, code per tenant
   - Audit log: `carrier.created`

2. **`GET /api/v1/carriers`** — JWT required (any role with dashboard).
   - Filterable: `status` (ACTIVE/INACTIVE/SUSPENDED), `search` (name, code)
   - Paginated
   - Returns: `CarrierResponseDto[]` with productCount

3. **`GET /api/v1/carriers/:id`** — JWT required.
   - Include products list
   - Returns: `CarrierDetailResponseDto`

4. **`PATCH /api/v1/carriers/:id`** — JWT required, `@Roles('TENANT_ADMIN', 'ADMIN')`.
   - Audit log: `carrier.updated`

5. **Carrier Products (`src/carriers/products/`):**

   **`POST /api/v1/carriers/:carrierId/products`** — `@Roles('TENANT_ADMIN', 'ADMIN')`
   - Body: `CreateProductDto` — name, code, insuranceType (@IsEnum from Prisma), description, minPremium (Decimal), maxCoverage (Decimal), commissionRate (Decimal), features (Json), exclusions (Json), documents (Json), isActive (default true)
   - Unique: code per carrier per tenant
   - Audit log: `product.created`

   **`GET /api/v1/carriers/:carrierId/products`** — JWT required.
   - Filterable: `insuranceType`, `isActive`, `search`

   **`PATCH /api/v1/carriers/:carrierId/products/:id`** — `@Roles('TENANT_ADMIN', 'ADMIN')`

## Verification Checklist
- [ ] `npm run build` — zero errors
- [ ] Create client (INDIVIDUAL) with all required fields → success
- [ ] Create client (CORPORATE) with companyName → success
- [ ] `GET /api/v1/clients` returns only current-tenant clients (tenant isolation)
- [ ] Search `?search=kwame` → matches firstName
- [ ] Filter `?clientType=CORPORATE&status=ACTIVE` → correct results
- [ ] Sort `?sortBy=totalPremium&sortOrder=desc` → correct order
- [ ] Add 3 beneficiaries totaling 95% → success
- [ ] Add beneficiary with 10% (total would be 105%) → error (exceeds 100%)
- [ ] Create carrier "SIC Insurance" with products → success
- [ ] `GET /api/v1/carriers` with `?search=SIC` → finds it
- [ ] Add product with `insuranceType=MOTOR_COMPREHENSIVE` → success
- [ ] Broker tries `POST /api/v1/carriers` → 403
- [ ] Broker can `GET /api/v1/carriers` → 200 (read allowed)
- [ ] Update KYC status to VERIFIED → audit logged
- [ ] Try to delete client with active policy → error
- [ ] Enterprise user cannot see SIC clients → tenant isolation works
- [ ] No `console.log`, no `any` types, no hardcoded secrets

After all checks pass, update `CHECKPOINT.md`: mark Phase 5 `[x]`.
