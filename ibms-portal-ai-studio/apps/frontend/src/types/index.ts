
export enum PolicyStatus {
  Active = 'Active',
  Pending = 'Pending',
  Expired = 'Expired',
  Cancelled = 'Cancelled'
}

export interface Policy {
  id: string;
  policyNo: string;
  insuredName: string;
  insurer: string;
  policyClass: string; // Motor, Life, Bonds
  productType: string; // Comprehensive, Third Party, etc.
  expiryDate: string;
  issueDate: string;
  premium: number;
  rate: number;
  grossComm: number;
  levy: number; // The 8% column
  netComm: number;
  sumInsured: number;
  riskDetail: string; // Vehicle Number / Location
  month: string;
  status: PolicyStatus;
}

export interface Client {
  id: string;
  name: string;
  location: string;
  email: string;
  phone: string;
  totalPremium: number;
  outstanding: number;
  activePolicies: number;
  nextRenewal: string;
  logo: string;
}

export interface Insurer {
  id: string;
  name: string;
  category: 'General' | 'Health' | 'Life' | 'Motor';
  email: string;
  phone: string;
  commissionRate: number;
  policiesManaged: number;
  status: 'Active' | 'Inactive' | 'Pending';
  logo: string;
}

export interface Task {
  id: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  dueTime: string;
  entityName: string;
  entityId: string;
  type: string;
  completed: boolean;
}

export enum LeadStatus {
  New = 'New',
  Contacted = 'Contacted',
  Qualified = 'Qualified',
  InProgress = 'In Progress',
  ClosedWon = 'Closed/Won',
  ClosedLost = 'Closed/Lost'
}

export enum LeadPriority {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low'
}

export enum LeadSource {
  Website = 'Website',
  Referral = 'Referral',
  SocialMedia = 'Social Media',
  PhoneCall = 'Phone Call',
  WalkIn = 'Walk-in',
  Advertisement = 'Advertisement'
}

export interface Lead {
  _id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailAddress: string;
  address?: string;
  leadSource?: string;
  leadStatus: string;
  leadScore?: number;
  typeOfInsurance: string;
  desiredCoverageAmount?: string;
  leadPriority?: string;
  assignedAgent: string;
  createdBy: string;
  createdOn?: string;
  modifiedOn?: string;
}

export interface EmailTemplate {
  _id: string;
  name: string;
  subject?: string;
  html: string;
  design?: string; // JSON string for editor state
  createdBy: string;
  modifiedBy?: string;
  createdOn: string;
  modifiedOn?: string;
}

export enum QuoteStatus {
  New = 'New',
  Contacted = 'Contacted',
  Quoted = 'Quoted',
  FollowUp = 'Follow-up',
  Won = 'Won',
  Lost = 'Lost'
}

export enum QuoteSource {
  Website = 'Website',
  Referral = 'Referral',
  SocialMedia = 'Social Media',
  PhoneCall = 'Phone Call',
  WalkIn = 'Walk-in',
  Email = 'Email',
  Advertisement = 'Advertisement'
}

export interface QuoteActivity {
  date: string;
  action: string;
  user: string;
  details?: string;
}

export interface Quote {
  _id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  source: string;
  phone: string;
  mobileNumber?: string;
  email: string;
  protectionType: string;
  status: QuoteStatus;
  premiumAmount?: number;
  dateCreated: string;
  followUpDate?: string;
  assignedAgent?: string;
  notes?: string;
  createdBy: string;
  modifiedOn?: string;
  
  // Quote Plan
  installmentType?: 'Single' | 'Monthly' | 'Quarterly' | 'Bi-Annual';
  initialDeposit?: number;
  installmentPeriod?: number; // months
  monthlyInstallment?: number;
  
  // Vehicle Info
  vehicleMake?: string;
  vehicleModel?: string;
  registrationNumber?: string;
  yearOfManufacture?: number;
  engineNumber?: string;
  chassisNumber?: string;
  
  // Activity Feed
  activities?: QuoteActivity[];
}


export enum RenewalStatus {
  Pending = 'Pending',
  Contacted = 'Contacted',
  Quoted = 'Quoted',
  Renewed = 'Renewed',
  Lost = 'Lost'
}

export interface Renewal {
  _id: string;
  policyId: string;
  policyNumber: string;
  clientName: string;
  policyType: string;
  insurer: string;
  expiryDate: string;
  daysToExpiry: number;
  currentPremium: number;
  proposedPremium: number;
  status: RenewalStatus;
  contactAttempts: number;
  lastContactDate?: string;
  renewalDate?: string;
  lostReason?: string;
  notes: string;
  assignedAgent: string;
}


export enum ClaimStatus {
  Reported = 'Reported',
  Investigating = 'Investigating',
  Documented = 'Documented',
  Approved = 'Approved',
  Settled = 'Settled',
  Rejected = 'Rejected',
  Disputed = 'Disputed'
}

export interface ClaimDocument {
  type: 'police_report' | 'medical_report' | 'photos' | 'receipts' | 'witness_statement' | 'other';
  fileName: string;
  uploadDate: string;
  uploadedBy: string;
}

export interface ClaimEvent {
  date: string;
  event: string;
  description: string;
  user: string;
}

export interface Claim {
  _id: string;
  claimNumber: string;
  policyId: string;
  policyNumber: string;
  clientName: string;
  policyType: string;
  insurer: string;
  incidentDate: string;
  reportedDate: string;
  claimType: string;
  claimAmount: number;
  approvedAmount?: number;
  status: ClaimStatus;
  adjusterName?: string;
  documents: ClaimDocument[];
  timeline: ClaimEvent[];
  settlementDate?: string;
  notes: string;
  daysOpen: number;
}


export enum CommissionStatus {
  Pending = 'Pending',
  Received = 'Received',
  Overdue = 'Overdue'
}

export interface Commission {
  _id: string;
  policyId: string;
  policyNumber: string;
  clientName: string;
  insurer: string;
  policyType: string;
  grossPremium: number;
  commissionRate: number;
  grossCommission: number;
  nicLevy: number;
  withholdingTax: number;
  netCommission: number;
  status: CommissionStatus;
  dueDate: string;
  receivedDate?: string;
  paymentReference?: string;
  aging: number;
}


export enum ClientSegment {
  Bronze = 'Bronze',
  Silver = 'Silver',
  Gold = 'Gold',
  Platinum = 'Platinum'
}

export interface CommunicationHistory {
  date: string;
  type: 'email' | 'call' | 'meeting' | 'sms';
  subject: string;
  notes: string;
  user: string;
}


export enum ComplianceStatus {
  Compliant = 'Compliant',
  Pending = 'Pending',
  Overdue = 'Overdue'
}

export interface ComplianceItem {
  _id: string;
  requirement: string;
  category: 'NIC Returns' | 'License' | 'Insurance' | 'Training' | 'Financial';
  dueDate: string;
  status: ComplianceStatus;
  lastSubmission?: string;
  nextDeadline: string;
  description: string;
  responsible: string;
}
