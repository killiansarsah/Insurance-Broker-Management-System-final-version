# RBAC Hardening Tracker

Last updated: 2026-04-03

## Completed
- Platform admin escalation fix and role/guard safety sweep.
- Imports ownership and execution path tightening.
- Complaints service-level ownership and control-action restrictions.
- Claims supervisory protections for assessed transitions.
- Quotes ownership enforcement for agent actions.
- Invoices ownership enforcement via client assignment scope.
- Tasks ownership + reassignment restrictions.
- Approvals list scoping for non-supervisory users.
- Leads visibility/mutation scoping and conversion ownership carry-over.
- Clients visibility/mutation/export/subresource scoping.
- Policies ownership-based write controls.
- Renewals visibility/report/renew action scoping.
- Search global actor-scoped filtering across entities.
- Finance dashboard role tightening to supervisory roles.
- Reports role tightening to supervisory roles.
- Compliance sensitive endpoints role tightening.
- Documents actor-scoped list/detail/update/remove behavior.
- Calendar actor-scoped event reads and detail access.
- Chat participant management role tightening.
- Google integration export/list role tightening.
- Departments listing role tightening.
- Remittances actor-scoped list/detail and aggregate visibility.
- Commissions actor-scoped list and status aggregates.
- Premium financing ownership checks for create/list/detail/pay flows.
- Claims actor-scoped AGENT reads for list/detail/documents/follow-ups.
- Chat participant validation hardened to enforce tenant membership.
- Settings tenant read redaction for non-supervisory users.
- Carriers and carrier products residual review completed (read-safe, write admin-only).
- Transactions actor-scoped AGENT list/detail/ledger-summary visibility and aggregates.
- Expenses list access tightened to supervisory roles due missing ownership metadata.
- Notifications gateway auth handling hardened (robust token extraction + quieter expected unauthenticated disconnect logs).
- Tasks actor-scoped AGENT list/detail reads and scoped mutation lookups.
- Complaints actor-scoped AGENT list/detail reads and scoped overdue aggregates.
- Quotes actor-scoped AGENT list/detail reads with write transitions preserved under scoped access.
- Policies actor-scoped AGENT list/detail reads with scoped list aggregates.
- Invoices actor-scoped AGENT list/detail reads with scoped outstanding/overdue/paid aggregates.

## In Progress
- None.

## Left / To Do
- No remaining items in the current hardening tracker.

## Validation Protocol
- After each patch batch:
  - npm run build
  - targeted diagnostics on edited files
  - targeted grep check for new scope helper usage and call-site wiring

## Exit Criteria
- No AGENT endpoint permits tenant-wide cross-record access unless explicitly intended by policy.
- High-impact bulk/report/integration endpoints are supervisory-role only or actor-scoped.
- Backend build passes after all changes.
