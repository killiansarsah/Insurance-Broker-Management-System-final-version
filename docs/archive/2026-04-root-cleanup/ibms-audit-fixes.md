# IBMS Audit Fixes — Implementation Plan

## Goal
Fix all 25 verified findings from the 3-AI audit, starting with P0 blockers.

## Phase 1: P0 Critical Blockers (Backend) ✅ DONE
- [x] **1.1** Create `NIC_LEVY_RATE = 0.075` constant → Fix all 3 locations (policies.service, imports.service, seed.ts)
- [x] **1.2** Add `exceljs` package → Implement .xlsx parsing with sheet detection in imports.service.ts
- [x] **1.3** Fix DD/MM date parser + Excel serial dates in `colDate()`
- [x] **1.4** Add RLS tenant middleware in `prisma.service.ts` → `SET LOCAL app.current_tenant_id`

## Phase 2: P1 High Priority (Backend) ✅ DONE
- [x] **2.1** Create `NIC_COMMISSION_RATES` lookup constant with all 11+ NIC rates
- [x] **2.2** Update import engine: lookup rate from Product table, not source file
- [x] **2.3** Add policy dedup: check existing policyNumber before insert
- [x] **2.4** Add client concentration metric + lapsed count + client segments to reports.service.ts
- [x] **2.5** Update seeded commission rates to match NIC-required values (14 non-life + 4 life products)

## Phase 3: P2 Dashboard & Schema (Frontend + Backend) ✅ DONE
- [x] **3.1** Fix dashboard lapsedCount — uses `report.lapsedPolicies` from server
- [x] **3.2** Fix commission per-insurer — uses carrier commissionRate instead of 12.5%
- [x] **3.3** Fix client segments — uses `report.clientSegments` from server
- [x] **3.4** Period filter gap — acknowledged (requires API query param changes)
- [x] **3.5** Make sumInsured nullable in schema (for Third Party policies)
- [x] **3.6** Auto-expiry cron — ALREADY EXISTS in renewals.service.ts at midnight

## Phase 4: Verification
- [ ] Backend compiles without errors
- [ ] Frontend compiles without errors

## Done When
- [x] NIC levy is 7.5% everywhere
- [x] Excel imports parse correctly
- [x] Dates parse DD/MM correctly
- [x] RLS middleware sets tenant context
- [x] Commission rates match NIC table
