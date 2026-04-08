export const PERMISSIONS = {
  // Dashboard
  DASHBOARD_MARKETING: 'dashboard.marketing',
  DASHBOARD_GROWTH: 'dashboard.growth',
  DASHBOARD_REVENUE: 'dashboard.revenue',
  DASHBOARD_SALES_TRENDS: 'dashboard.sales_trends',
  DASHBOARD_LEAD_DISTRIBUTION: 'dashboard.lead_distribution',
  DASHBOARD_PRODUCT_DISTRIBUTION: 'dashboard.product_distribution',

  // Leads / CRM
  LEADS_VIEW: 'leads.view',
  LEADS_CREATE: 'leads.create',
  LEADS_EDIT: 'leads.edit',

  // Quotes
  QUOTES_VIEW: 'quotes.view',
  QUOTES_CREATE: 'quotes.create',
  QUOTES_SEND: 'quotes.send',
  QUOTES_ACCEPT: 'quotes.accept',
  QUOTES_DECLINE: 'quotes.decline',

  // Policies
  POLICIES_VIEW: 'policies.view',
  POLICIES_CREATE: 'policies.create',
  POLICIES_EDIT: 'policies.edit',
  POLICIES_CANCEL: 'policies.cancel',
  POLICIES_QA: 'policies.qa',
  POLICIES_APPROVE: 'policies.approve',
  POLICIES_ENDORSE: 'policies.endorse',

  // Claims
  CLAIMS_VIEW: 'claims.view',
  CLAIMS_SUBMIT: 'claims.submit',
  CLAIMS_INVESTIGATE: 'claims.investigate',
  CLAIMS_ASSESS: 'claims.assess',
  CLAIMS_APPROVE: 'claims.approve',
  CLAIMS_REJECT: 'claims.reject',

  // Clients
  CLIENTS_VIEW: 'clients.view',
  CLIENTS_CREATE: 'clients.create',
  CLIENTS_EDIT: 'clients.edit',
  CLIENTS_KYC: 'clients.kyc',

  // Renewals
  RENEWALS_VIEW: 'renewals.view',
  RENEWALS_PROCESS: 'renewals.process',
  RENEWALS_BULK: 'renewals.bulk',

  // Premium Financing
  PREMIUM_FINANCING_VIEW: 'premium_financing.view',
  PREMIUM_FINANCING_CREATE: 'premium_financing.create',
  PREMIUM_FINANCING_MANAGE: 'premium_financing.manage',

  // Payments
  PAYMENTS_VIEW: 'payments.view',
  PAYMENTS_COLLECT: 'payments.collect',
  PAYMENTS_RECONCILE: 'payments.reconcile',
  PAYMENTS_REMIT: 'payments.remit',

  // Commissions
  COMMISSIONS_VIEW: 'commissions.view',
  COMMISSIONS_MANAGE: 'commissions.manage',

  // Invoices
  INVOICES_VIEW: 'invoices.view',
  INVOICES_CREATE: 'invoices.create',
  INVOICES_SEND: 'invoices.send',
  INVOICES_CANCEL: 'invoices.cancel',

  // Reports
  REPORTS_VIEW: 'reports.view',
  REPORTS_FINANCE: 'reports.finance',
  REPORTS_NIC: 'reports.nic',
  REPORTS_EXPORT: 'reports.export',

  // Documents
  DOCUMENTS_VIEW: 'documents.view',
  DOCUMENTS_UPLOAD: 'documents.upload',
  DOCUMENTS_DELETE: 'documents.delete',

  // Complaints
  COMPLAINTS_VIEW: 'complaints.view',
  COMPLAINTS_CREATE: 'complaints.create',
  COMPLAINTS_RESOLVE: 'complaints.resolve',
  COMPLAINTS_ASSIGN: 'complaints.assign',
  COMPLAINTS_ESCALATE: 'complaints.escalate',

  // Tasks
  TASKS_VIEW: 'tasks.view',
  TASKS_CREATE: 'tasks.create',
  TASKS_ASSIGN: 'tasks.assign',

  // Users
  USERS_VIEW: 'users.view',
  USERS_INVITE: 'users.invite',
  USERS_MANAGE: 'users.manage',
  USERS_DEACTIVATE: 'users.deactivate',

  // Settings
  SETTINGS_VIEW: 'settings.view',
  SETTINGS_WORKSPACE: 'settings.workspace',
  SETTINGS_ROLES: 'settings.roles',
  SETTINGS_INTEGRATIONS: 'settings.integrations',

  // Approvals
  APPROVALS_VIEW: 'approvals.view',
  APPROVALS_PROCESS: 'approvals.process',

  // Imports
  IMPORTS_UPLOAD: 'imports.upload',
  IMPORTS_EXECUTE: 'imports.execute',

  // Chat
  CHAT_VIEW: 'chat.view',
  CHAT_SEND: 'chat.send',

  // Compliance
  COMPLIANCE_VIEW: 'compliance.view',
  COMPLIANCE_EDIT: 'compliance.edit',

  // Audit
  AUDIT_VIEW: 'audit.view',
} as const;

export type PermissionString = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
export const ALL_PERMISSIONS = Object.values(PERMISSIONS);
