# AGENT Endpoint Matrix (Final)

Last updated: 2026-04-03

## Scope
This matrix summarizes AGENT-accessible modules reviewed during the final hardening wave and the enforced control model.

## Matrix
| Module | AGENT Access | Control Model | Final State |
|---|---|---|---|
| Imports | Limited workflow endpoints | Actor ownership checks on jobs + manager/supervisor-only execute | Hardened |
| Approvals | Read/list and own operations | Service-level requester scope for non-supervisory users | Hardened |
| Policies | CRUD + lifecycle actions | Service-level ownership (policy broker or assigned client) | Hardened |
| Complaints | CRUD + selected actions | Assigned ownership enforcement for AGENT write paths | Hardened |
| Clients | CRUD + subresources | Assigned-client scope across list/detail/export/subresources | Hardened |
| Claims | CRUD + docs + follow-ups | Actor scope helper (assessor / policy broker / assigned client) for reads and subresources | Hardened |
| Tasks | CRUD + status | Created/assigned ownership enforcement + self-assignment limits | Hardened |
| Calendar | Read/detail + limited actions | Actor-scoped visibility (creator/attendee) | Hardened |
| Settings | Tenant/profile reads + profile writes | AGENT-safe reads with tenant metadata redaction for non-supervisory roles | Hardened |
| Leads | CRUD + stage/convert | Assigned-lead ownership and self-assignment constraints | Hardened |
| Search | Global search + recent | Actor-scoped filtering across entities | Hardened |
| Notifications | User notifications | User-bound semantics (own stream/read ops) | Hardened |
| Quotes | CRUD + status transitions | Prepared-by ownership enforced for AGENT write transitions | Hardened |
| Documents | CRUD | Uploaded-by ownership scope for AGENT list/detail/update | Hardened |
| Invoices | CRUD + send | Assigned-client ownership enforcement | Hardened |
| Transactions | CRUD/list/detail/ledger-summary | Actor-scoped list/detail and scoped inflow/outflow/ledger aggregates | Hardened |
| Commissions | List | Actor-scoped dataset and scoped status aggregates | Hardened |
| Remittances | List/detail | Actor-scoped dataset and scoped summary aggregates | Hardened |
| Premium financing | Create/list/detail/pay | Ownership check on create + scoped detail/pay paths | Hardened |
| Carriers / Products | Read-only for AGENT | Reference-data read semantics; writes are admin-only | Reviewed safe |
| Expenses | Create for AGENT, list tightened | List moved to supervisory roles due no ownership metadata | Hardened via role tightening |
| Chat | Room list/messages | Participant-based room scope + tenant validation on participant mutations | Hardened |

## Notable Final Tightenings
- Claims AGENT read surfaces now use shared actor scope in service methods.
- Transactions AGENT list/detail/ledger-summary now exclude tenant-wide financial visibility.
- Expenses list endpoint is supervisory-only until expense ownership metadata exists.
- Chat participant add path now validates user tenant membership.
- Settings tenant read now redacts sensitive fields for non-supervisory users.

## Outstanding Required Work
- None in the current RBAC hardening tracker.

## Optional Follow-up
- Add explicit ownership fields to expenses for future safe AGENT-scoped listing.
- Optional websocket auth UX refinement to reduce invalid token reconnect attempts on the client.
