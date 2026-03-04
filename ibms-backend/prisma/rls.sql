-- ============================================
-- IBMS — Row-Level Security (RLS) Policies
-- Tenant Isolation for Multi-Tenant Architecture
-- ============================================
-- 
-- This file creates RLS policies to enforce tenant isolation
-- at the database level. Apply manually or via a raw migration.
--
-- Usage:
--   psql -U ibms -d ibms -f prisma/rls.sql
--
-- The application must SET app.current_tenant_id = '<uuid>' 
-- on each database session/transaction for RLS to work.
-- ============================================

-- ─── Helper: Set current tenant ID per session ──
-- Call this at the beginning of each request/transaction:
--   SET LOCAL app.current_tenant_id = '<tenant-uuid>';

-- ─── ENABLE RLS ON ALL TENANT-SCOPED TABLES ─────

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE refresh_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_resets ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE carriers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE beneficiaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE next_of_kin ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE marine_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_endorsements ENABLE ROW LEVEL SECURITY;
ALTER TABLE premium_installments ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE claim_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE premium_financing ENABLE ROW LEVEL SECURITY;
ALTER TABLE pf_installments ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

-- ─── RLS POLICIES: tenant_id = current_setting ──
-- Each policy restricts SELECT, INSERT, UPDATE, DELETE
-- to rows matching the current tenant.

-- Tenants (special: match on id, not tenant_id)
CREATE POLICY tenant_isolation ON tenants
  USING (id = current_setting('app.current_tenant_id')::uuid);

-- Standard tenant-scoped tables
CREATE POLICY tenant_isolation ON branches
  USING ("tenantId" = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation ON users
  USING ("tenantId" = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation ON invitations
  USING ("tenantId" = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation ON password_resets
  USING ("tenantId" = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation ON audit_logs
  USING ("tenantId" = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation ON carriers
  USING ("tenantId" = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation ON products
  USING ("tenantId" = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation ON clients
  USING ("tenantId" = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation ON beneficiaries
  USING ("tenantId" = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation ON next_of_kin
  USING ("tenantId" = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation ON bank_details
  USING ("tenantId" = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation ON policies
  USING ("tenantId" = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation ON policy_endorsements
  USING ("tenantId" = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation ON premium_installments
  USING ("tenantId" = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation ON policy_documents
  USING ("tenantId" = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation ON claims
  USING ("tenantId" = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation ON claim_documents
  USING ("tenantId" = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation ON complaints
  USING ("tenantId" = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation ON leads
  USING ("tenantId" = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation ON documents
  USING ("tenantId" = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation ON transactions
  USING ("tenantId" = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation ON invoices
  USING ("tenantId" = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation ON commissions
  USING ("tenantId" = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation ON expenses
  USING ("tenantId" = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation ON premium_financing
  USING ("tenantId" = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation ON pf_installments
  USING ("tenantId" = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation ON chat_rooms
  USING ("tenantId" = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation ON chat_messages
  USING ("tenantId" = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation ON notifications
  USING ("tenantId" = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation ON calendar_events
  USING ("tenantId" = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation ON tasks
  USING ("tenantId" = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation ON approvals
  USING ("tenantId" = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation ON departments
  USING ("tenantId" = current_setting('app.current_tenant_id')::uuid);

-- ─── JOIN TABLES (no tenantId — use sub-query) ──

-- RefreshTokens: via user's tenantId
CREATE POLICY tenant_isolation ON refresh_tokens
  USING (
    "userId" IN (
      SELECT id FROM users 
      WHERE "tenantId" = current_setting('app.current_tenant_id')::uuid
    )
  );

-- VehicleDetails: via policy's tenantId
CREATE POLICY tenant_isolation ON vehicle_details
  USING (
    "policyId" IN (
      SELECT id FROM policies 
      WHERE "tenantId" = current_setting('app.current_tenant_id')::uuid
    )
  );

-- PropertyDetails: via policy's tenantId
CREATE POLICY tenant_isolation ON property_details
  USING (
    "policyId" IN (
      SELECT id FROM policies 
      WHERE "tenantId" = current_setting('app.current_tenant_id')::uuid
    )
  );

-- MarineDetails: via policy's tenantId
CREATE POLICY tenant_isolation ON marine_details
  USING (
    "policyId" IN (
      SELECT id FROM policies 
      WHERE "tenantId" = current_setting('app.current_tenant_id')::uuid
    )
  );

-- ChatParticipants: via room's tenantId
CREATE POLICY tenant_isolation ON chat_participants
  USING (
    "roomId" IN (
      SELECT id FROM chat_rooms 
      WHERE "tenantId" = current_setting('app.current_tenant_id')::uuid
    )
  );

-- CalendarAttendees: via event's tenantId
CREATE POLICY tenant_isolation ON calendar_attendees
  USING (
    "eventId" IN (
      SELECT id FROM calendar_events 
      WHERE "tenantId" = current_setting('app.current_tenant_id')::uuid
    )
  );

-- ─── BYPASS for the application service role ────
-- If your Prisma connection uses a dedicated DB role (e.g., ibms_app),
-- and you want RLS enforced, do NOT grant BYPASSRLS to that role.
-- Instead, always SET app.current_tenant_id before queries.
--
-- For the superuser / migration role, RLS is bypassed by default.
-- ============================================
