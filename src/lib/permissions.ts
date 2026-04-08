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

export type PermissionString = typeof PERMISSIONS[keyof typeof PERMISSIONS];
export const ALL_PERMISSIONS = Object.values(PERMISSIONS);

export const PERMISSION_GROUPS = [
  {
    name: 'Dashboard',
    permissions: [
      { id: PERMISSIONS.DASHBOARD_MARKETING, label: 'Marketing Dashboard' },
      { id: PERMISSIONS.DASHBOARD_GROWTH, label: 'Growth Dashboard' },
      { id: PERMISSIONS.DASHBOARD_REVENUE, label: 'Revenue Dashboard' },
      { id: PERMISSIONS.DASHBOARD_SALES_TRENDS, label: 'Sales Trends' },
      { id: PERMISSIONS.DASHBOARD_LEAD_DISTRIBUTION, label: 'Lead Distribution' },
      { id: PERMISSIONS.DASHBOARD_PRODUCT_DISTRIBUTION, label: 'Product Distribution' }
    ]
  },
  {
    name: 'Clients & CRM',
    permissions: [
      { id: PERMISSIONS.CLIENTS_VIEW, label: 'View Clients' },
      { id: PERMISSIONS.CLIENTS_CREATE, label: 'Create Clients' },
      { id: PERMISSIONS.CLIENTS_EDIT, label: 'Edit Clients' },
      { id: PERMISSIONS.CLIENTS_KYC, label: 'Manage KYC' },
      { id: PERMISSIONS.LEADS_VIEW, label: 'View Leads' },
      { id: PERMISSIONS.LEADS_CREATE, label: 'Create Leads' },
      { id: PERMISSIONS.LEADS_EDIT, label: 'Edit Leads' }
    ]
  },
  {
    name: 'Policies & Quotes',
    permissions: [
      { id: PERMISSIONS.QUOTES_VIEW, label: 'View Quotes' },
      { id: PERMISSIONS.QUOTES_CREATE, label: 'Create Quotes' },
      { id: PERMISSIONS.QUOTES_SEND, label: 'Send Quotes' },
      { id: PERMISSIONS.QUOTES_ACCEPT, label: 'Accept Quotes' },
      { id: PERMISSIONS.QUOTES_DECLINE, label: 'Decline Quotes' },
      { id: PERMISSIONS.POLICIES_VIEW, label: 'View Policies' },
      { id: PERMISSIONS.POLICIES_CREATE, label: 'Create Policies' },
      { id: PERMISSIONS.POLICIES_EDIT, label: 'Edit Policies' },
      { id: PERMISSIONS.POLICIES_CANCEL, label: 'Cancel Policies' },
      { id: PERMISSIONS.POLICIES_QA, label: 'QA Policies' },
      { id: PERMISSIONS.POLICIES_APPROVE, label: 'Approve Policies' },
      { id: PERMISSIONS.POLICIES_ENDORSE, label: 'Endorse Policies' },
      { id: PERMISSIONS.RENEWALS_VIEW, label: 'View Renewals' },
      { id: PERMISSIONS.RENEWALS_PROCESS, label: 'Process Renewals' },
      { id: PERMISSIONS.RENEWALS_BULK, label: 'Bulk Renewals' }
    ]
  },
  {
    name: 'Claims',
    permissions: [
      { id: PERMISSIONS.CLAIMS_VIEW, label: 'View Claims' },
      { id: PERMISSIONS.CLAIMS_SUBMIT, label: 'Submit Claims' },
      { id: PERMISSIONS.CLAIMS_INVESTIGATE, label: 'Investigate Claims' },
      { id: PERMISSIONS.CLAIMS_ASSESS, label: 'Assess Claims' },
      { id: PERMISSIONS.CLAIMS_APPROVE, label: 'Approve Claims' },
      { id: PERMISSIONS.CLAIMS_REJECT, label: 'Reject Claims' }
    ]
  },
  {
    name: 'Finance',
    permissions: [
      { id: PERMISSIONS.INVOICES_VIEW, label: 'View Invoices' },
      { id: PERMISSIONS.INVOICES_CREATE, label: 'Create Invoices' },
      { id: PERMISSIONS.INVOICES_SEND, label: 'Send Invoices' },
      { id: PERMISSIONS.INVOICES_CANCEL, label: 'Cancel Invoices' },
      { id: PERMISSIONS.PAYMENTS_VIEW, label: 'View Payments' },
      { id: PERMISSIONS.PAYMENTS_COLLECT, label: 'Collect Payments' },
      { id: PERMISSIONS.PAYMENTS_RECONCILE, label: 'Reconcile Payments' },
      { id: PERMISSIONS.PAYMENTS_REMIT, label: 'Remit Payments' },
      { id: PERMISSIONS.COMMISSIONS_VIEW, label: 'View Commissions' },
      { id: PERMISSIONS.COMMISSIONS_MANAGE, label: 'Manage Commissions' },
      { id: PERMISSIONS.PREMIUM_FINANCING_VIEW, label: 'View PF' },
      { id: PERMISSIONS.PREMIUM_FINANCING_CREATE, label: 'Create PF' },
      { id: PERMISSIONS.PREMIUM_FINANCING_MANAGE, label: 'Manage PF' }
    ]
  },
  {
    name: 'Documents & Communication',
    permissions: [
      { id: PERMISSIONS.DOCUMENTS_VIEW, label: 'View Documents' },
      { id: PERMISSIONS.DOCUMENTS_UPLOAD, label: 'Upload Documents' },
      { id: PERMISSIONS.DOCUMENTS_DELETE, label: 'Delete Documents' },
      { id: PERMISSIONS.COMPLAINTS_VIEW, label: 'View Complaints' },
      { id: PERMISSIONS.COMPLAINTS_CREATE, label: 'Create Complaints' },
      { id: PERMISSIONS.COMPLAINTS_RESOLVE, label: 'Resolve Complaints' },
      { id: PERMISSIONS.COMPLAINTS_ASSIGN, label: 'Assign Complaints' },
      { id: PERMISSIONS.COMPLAINTS_ESCALATE, label: 'Escalate Complaints' },
      { id: PERMISSIONS.CHAT_VIEW, label: 'View Chat' },
      { id: PERMISSIONS.CHAT_SEND, label: 'Send Messages' }
    ]
  },
  {
    name: 'Management & Admin',
    permissions: [
      { id: PERMISSIONS.USERS_VIEW, label: 'View Users' },
      { id: PERMISSIONS.USERS_INVITE, label: 'Invite Users' },
      { id: PERMISSIONS.USERS_MANAGE, label: 'Manage Users' },
      { id: PERMISSIONS.USERS_DEACTIVATE, label: 'Deactivate Users' },
      { id: PERMISSIONS.REPORTS_VIEW, label: 'View Reports' },
      { id: PERMISSIONS.REPORTS_FINANCE, label: 'Finance Reports' },
      { id: PERMISSIONS.REPORTS_NIC, label: 'NIC Reports' },
      { id: PERMISSIONS.REPORTS_EXPORT, label: 'Export Reports' },
      { id: PERMISSIONS.SETTINGS_VIEW, label: 'View Settings' },
      { id: PERMISSIONS.SETTINGS_WORKSPACE, label: 'Workspace Settings' },
      { id: PERMISSIONS.SETTINGS_ROLES, label: 'Roles Settings' },
      { id: PERMISSIONS.SETTINGS_INTEGRATIONS, label: 'Integrations Settings' },
      { id: PERMISSIONS.COMPLIANCE_VIEW, label: 'View Compliance' },
      { id: PERMISSIONS.COMPLIANCE_EDIT, label: 'Edit Compliance' },
      { id: PERMISSIONS.AUDIT_VIEW, label: 'View Audits' },
      { id: PERMISSIONS.TASKS_VIEW, label: 'View Tasks' },
      { id: PERMISSIONS.TASKS_CREATE, label: 'Create Tasks' },
      { id: PERMISSIONS.TASKS_ASSIGN, label: 'Assign Tasks' },
      { id: PERMISSIONS.APPROVALS_VIEW, label: 'View Approvals' },
      { id: PERMISSIONS.APPROVALS_PROCESS, label: 'Process Approvals' },
      { id: PERMISSIONS.IMPORTS_UPLOAD, label: 'Upload Imports' },
      { id: PERMISSIONS.IMPORTS_EXECUTE, label: 'Execute Imports' }
    ]
  }
];

const P = PERMISSIONS;

export const DEFAULT_PERMISSIONS_MAP: Record<string, string[]> = {
  PLATFORM_SUPER_ADMIN: Object.values(P),
  WORKSPACE_OWNER: Object.values(P),
  ADMINISTRATOR: Object.values(P),
  MANAGER: [
    P.DASHBOARD_REVENUE, P.DASHBOARD_SALES_TRENDS,
    P.POLICIES_VIEW, P.POLICIES_CREATE, P.POLICIES_EDIT,
    P.CLAIMS_VIEW, P.CLAIMS_SUBMIT, P.CLAIMS_ASSESS,
    P.CLIENTS_VIEW, P.CLIENTS_CREATE, P.CLIENTS_EDIT, P.CLIENTS_KYC,
    P.RENEWALS_VIEW, P.RENEWALS_PROCESS, P.RENEWALS_BULK,
    P.COMPLAINTS_VIEW, P.COMPLAINTS_CREATE, P.COMPLAINTS_RESOLVE, P.COMPLAINTS_ASSIGN,
    P.REPORTS_VIEW, P.REPORTS_FINANCE, P.REPORTS_EXPORT,
    P.USERS_VIEW, P.USERS_INVITE, P.USERS_MANAGE,
    P.APPROVALS_VIEW, P.APPROVALS_PROCESS,
    P.TASKS_VIEW, P.TASKS_CREATE, P.TASKS_ASSIGN,
    P.DOCUMENTS_VIEW, P.DOCUMENTS_UPLOAD,
    P.INVOICES_VIEW, P.INVOICES_CREATE, P.INVOICES_SEND,
    P.COMMISSIONS_VIEW,
    P.PAYMENTS_VIEW, P.PAYMENTS_COLLECT,
    P.CHAT_VIEW, P.CHAT_SEND,
    P.SETTINGS_VIEW,
    P.LEADS_VIEW, P.LEADS_CREATE, P.LEADS_EDIT,
    P.QUOTES_VIEW, P.QUOTES_CREATE, P.QUOTES_SEND,
  ],
  SUPERVISOR: [
    P.POLICIES_VIEW, P.POLICIES_CREATE, P.POLICIES_EDIT,
    P.CLAIMS_VIEW, P.CLAIMS_SUBMIT,
    P.CLIENTS_VIEW, P.CLIENTS_CREATE, P.CLIENTS_EDIT, P.CLIENTS_KYC,
    P.RENEWALS_VIEW, P.RENEWALS_PROCESS,
    P.COMPLAINTS_VIEW, P.COMPLAINTS_CREATE, P.COMPLAINTS_RESOLVE,
    P.REPORTS_VIEW,
    P.APPROVALS_VIEW,
    P.TASKS_VIEW, P.TASKS_CREATE,
    P.DOCUMENTS_VIEW, P.DOCUMENTS_UPLOAD,
    P.COMPLIANCE_VIEW,
    P.CHAT_VIEW, P.CHAT_SEND,
    P.LEADS_VIEW, P.LEADS_CREATE, P.LEADS_EDIT,
    P.QUOTES_VIEW, P.QUOTES_CREATE,
    P.INVOICES_VIEW,
    P.COMMISSIONS_VIEW,
  ],
  AGENT: [
    P.POLICIES_VIEW, P.POLICIES_CREATE,
    P.CLAIMS_VIEW, P.CLAIMS_SUBMIT,
    P.CLIENTS_VIEW, P.CLIENTS_CREATE,
    P.RENEWALS_VIEW,
    P.COMPLAINTS_VIEW, P.COMPLAINTS_CREATE,
    P.LEADS_VIEW, P.LEADS_CREATE, P.LEADS_EDIT,
    P.QUOTES_VIEW, P.QUOTES_CREATE,
    P.TASKS_VIEW,
    P.DOCUMENTS_VIEW,
    P.CHAT_VIEW, P.CHAT_SEND,
  ],
};
