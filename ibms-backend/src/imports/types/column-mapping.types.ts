/** Column mapping types for the AI-powered import system */

export interface ColumnMapping {
  theirColumn: string;
  ourField: string | 'SKIP';
  confidence: 'high' | 'medium' | 'low';
  reasoning: string;
  dataFormat: string;
  needsSplitting: boolean;
  splitStrategy: string | null;
  transformations: string[];
  warnings: string[];
  sampleValueAnalysis?: string;
  source?: 'ai' | 'rules' | 'manual';
}

export interface GeminiMappingResult {
  success: boolean;
  mappings: ColumnMapping[];
  tokensUsed: number;
  modelUsed: string;
  fallbackUsed: boolean;
  processingTimeMs: number;
}

export interface MappingOrchestratorResult {
  mappings: ColumnMapping[];
  aiUsed: boolean;
  aiCallSucceeded: boolean;
  columnsFromAI: number;
  columnsFromRules: number;
  unmappedColumns: string[];
  processingTimeMs: number;
  privacyNote: string;
}

export interface ValidationIssue {
  field: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  suggestedFix?: string;
}

export interface ValidationRowResult {
  rowNumber: number;
  status: 'ready' | 'warning' | 'error' | 'duplicate';
  mappedData: Record<string, unknown>;
  transformedData: Record<string, unknown>;
  issues: ValidationIssue[];
  existingClient?: {
    id: string;
    clientNumber: string;
    name: string;
    phone: string | null;
    email: string | null;
  };
}

export interface ValidationResult {
  totalRows: number;
  readyToImport: number;
  warningRows: number;
  errorRows: number;
  duplicateRows: number;
  rows: ValidationRowResult[];
}

export enum DataType {
  NAME = 'NAME',
  GHANA_CARD = 'GHANA_CARD',
  PHONE = 'PHONE',
  EMAIL = 'EMAIL',
  DATE = 'DATE',
  TIN = 'TIN',
  ACCOUNT_NUMBER = 'ACCOUNT_NUMBER',
  MOMO_NUMBER = 'MOMO_NUMBER',
  AMOUNT = 'AMOUNT',
  BOOLEAN = 'BOOLEAN',
  GENDER = 'GENDER',
  ADDRESS = 'ADDRESS',
  DIGITAL_ADDRESS = 'DIGITAL_ADDRESS',
  REGION = 'REGION',
  CITY = 'CITY',
  BANK_NAME = 'BANK_NAME',
  CLIENT_TYPE = 'CLIENT_TYPE',
  UNKNOWN = 'UNKNOWN',
}

/** Available target fields for client data mapping */
export const CLIENT_TARGET_FIELDS: Record<
  string,
  { label: string; group: string }
> = {
  first_name: { label: 'First Name', group: 'Personal Identity' },
  middle_name: { label: 'Middle Name', group: 'Personal Identity' },
  last_name: { label: 'Last Name / Surname', group: 'Personal Identity' },
  full_name: { label: 'Full Name (will be split)', group: 'Personal Identity' },
  company_name: { label: 'Company / Business Name', group: 'Personal Identity' },
  date_of_birth: { label: 'Date of Birth', group: 'Personal Identity' },
  gender: { label: 'Gender', group: 'Personal Identity' },
  marital_status: { label: 'Marital Status', group: 'Personal Identity' },
  nationality: { label: 'Nationality', group: 'Personal Identity' },
  ghana_card_number: { label: 'Ghana Card Number', group: 'Personal Identity' },
  passport_number: { label: 'Passport Number', group: 'Personal Identity' },
  drivers_licence: { label: "Driver's Licence", group: 'Personal Identity' },
  tin: { label: 'Tax Identification Number', group: 'Personal Identity' },
  ssnit: { label: 'SSNIT Number', group: 'Personal Identity' },
  phone_primary: { label: 'Phone (Primary)', group: 'Contact' },
  phone_secondary: { label: 'Phone (Secondary)', group: 'Contact' },
  email: { label: 'Email Address', group: 'Contact' },
  whatsapp_number: { label: 'WhatsApp Number', group: 'Contact' },
  digital_address: { label: 'Digital Address (GPS)', group: 'Address' },
  residential_address: { label: 'Residential Address', group: 'Address' },
  city: { label: 'City / Town', group: 'Address' },
  region: { label: 'Region', group: 'Address' },
  occupation: { label: 'Occupation', group: 'Occupation' },
  employer: { label: 'Employer', group: 'Occupation' },
  industry: { label: 'Industry / Sector', group: 'Occupation' },
  aml_risk: { label: 'AML Risk Level', group: 'AML & Compliance' },
  pep: { label: 'Politically Exposed Person', group: 'AML & Compliance' },
  source_of_funds: { label: 'Source of Funds', group: 'AML & Compliance' },
  purpose_of_relationship: { label: 'Purpose of Relationship', group: 'AML & Compliance' },
  expected_annual_volume: { label: 'Expected Annual Volume', group: 'AML & Compliance' },
  bank_name: { label: 'Bank Name', group: 'Banking' },
  account_name: { label: 'Account Name', group: 'Banking' },
  account_number: { label: 'Account Number', group: 'Banking' },
  branch: { label: 'Bank Branch', group: 'Banking' },
  momo_network: { label: 'MoMo Network', group: 'Mobile Money' },
  momo_number: { label: 'MoMo Number', group: 'Mobile Money' },
  momo_account_name: { label: 'MoMo Account Name', group: 'Mobile Money' },
  client_type: { label: 'Client Type', group: 'Other' },
  status: { label: 'Status', group: 'Other' },
  notes: { label: 'Notes / Comments', group: 'Other' },
  assigned_officer: { label: 'Account Officer', group: 'Other' },
  SKIP: { label: 'Skip this column', group: 'Other' },
};
