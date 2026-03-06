// TEMPORARY STUBS - These exports exist only to prevent build errors
// All files importing these should be migrated to use proper API hooks

import { getClientDisplayName as utilsGetClientDisplayName } from '@/lib/utils';

// Re-export utility function
export const getClientDisplayName = utilsGetClientDisplayName;

// Stub data - empty arrays
export const mockClients: any[] = [];
export const mockPolicies: any[] = [];
export const mockLeads: any[] = [];
export const claims: any[] = [];
export const carriers: any[] = [];
export const carrierProducts: any[] = [];
export const users: any[] = [];
export const invoices: any[] = [];
export const receipts: any[] = [];
export const commissions: any[] = [];
export const mockCommissions: any[] = [];
export const expenses: any[] = [];
export const mockQuotes: any[] = [];
export const mockRenewals: any[] = [];
export const mockPFApplications: any[] = [];
export const mockEvents: any[] = [];
export const MOCK_CHATS: any[] = [];
export const MOCK_MESSAGES: any[] = [];
export const MOCK_COMPLAINTS: any[] = [];
export const MOCK_DOCUMENTS: any[] = [];
export const nonLifeCarriers: any[] = [];
export const lifeCarriers: any[] = [];
export const policies: any[] = [];
export const commissionsByBroker: any[] = [];

// Stub objects
export const financeSummary: any = {};
export const commissionSummary: any = {};
export const quoteSummary: any = {};
export const renewalSummary: any = {};
export const pfSummary: any = {};
export const expenseSummary: any = {};
export const reportSummary: any = {};
export const kpistats: any = {};
export const monthlyRevenue: any[] = [];
export const agingBuckets: any[] = [];
export const topClients: any[] = [];
export const productBreakdown: any[] = [];
export const monthlyData: any[] = [];
export const portfolioMix: any[] = [];

// Stub constants
export const LEAD_STAGES: any[] = [];
export const CATEGORY_LABELS: any = {};
export const CATEGORY_COLORS: any = {};
export const EXPENSE_CATEGORIES: any[] = [];
export const CATEGORY_LABEL: any = {};
export const DEPARTMENTS: any[] = [];
export const QUOTE_STATUS_CONFIG: any = {};
export const URGENCY_CONFIG: any = {};
export const WORKFLOW_STATUS_CONFIG: any = {};
export const LOST_REASON_LABEL: any = {};
export const PF_STATUS_CONFIG: any = {};
export const FINANCIERS: any[] = [];

// Stub functions
export const getClientById = (id: string): any => null;
export const getPoliciesByClientId = (id: string): any[] => [];
export const getLeadById = (id: string): any => null;
export const getCarriersByType = (type: string): any[] => [];
export const getAllCategories = (): any[] => [];
export const getCompulsoryProducts = (): any[] => [];

// Stub types (re-export from types if they exist, otherwise any)
export type Carrier = any;
export type CarrierProduct = any;
export type CarrierType = any;
export type Expense = any;
export type ExpenseCategory = any;
export type ExpenseStatus = any;
export type PaymentMethod = any;
export type Invoice = any;
export type Quote = any;
export type QuoteStatus = any;
export type Renewal = any;
export type RenewalWorkflowStatus = any;
export type UrgencyLevel = any;
export type PFApplication = any;
export type PFStatus = any;
export type ProductCategory = any;
export type CalendarEvent = any;
export type CalendarEventType = any;
export type CalendarEventPriority = any;
