import {
  Injectable,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { parse } from 'csv-parse/sync';
import * as ExcelJS from 'exceljs';
import { Prisma, InsuranceType, PremiumFrequency, LeadSource, LeadPriority, Gender } from '@prisma/client';
import { randomBytes } from 'crypto';
import { NIC_LEVY_RATE } from '../common/constants/nic.constants';
import type { ImportDataType } from './dto/import.dto';

export interface ImportResult {
  dataType: string;
  totalRows: number;
  created: number;
  skipped: number;
  errors: Array<{ row: number; field?: string; message: string }>;
}

export interface MixedImportResult {
  summary: {
    totalRows: number;
    totalCreated: number;
    totalSkipped: number;
    totalErrors: number;
  };
  results: ImportResult[];
}

// ─── Column-name → data-type auto-detection ─────────────────
const TYPE_SIGNALS: Record<string, ImportDataType[]> = {
  // Client signals
  clienttype: ['clients'],
  ghanacard: ['clients'],
  ghanacardnumber: ['clients'],
  digitaladdress: ['clients'],
  occupation: ['clients'],
  ispep: ['clients'],
  tin: ['clients'],

  // Policy signals
  insurancetype: ['policies'],
  premiumamount: ['policies'],
  premium: ['policies'],
  suminsured: ['policies'],
  premiumfrequency: ['policies'],
  policynumber: ['policies'],
  carrierid: ['policies'],

  // Claim signals
  incidentdate: ['claims'],
  claimamount: ['claims'],
  policereportnumber: ['claims'],
  hospitalname: ['claims'],

  // Lead signals
  source: ['leads'],
  priority: ['leads'],
  productinterest: ['leads'],
  estimatedpremium: ['leads'],
  contactname: ['leads'],

  // Invoice signals
  duedate: ['invoices'],
  invoicenumber: ['invoices'],

  // Commission signals
  commissionrate: ['commissions'],
  receivedamount: ['commissions'],
  receiveddate: ['commissions'],
};

@Injectable()
export class ImportsService {
  private readonly logger = new Logger(ImportsService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ─── PUBLIC ENTRY POINT ───────────────────────────────────
  async processFile(
    tenantId: string,
    userId: string,
    file: Express.Multer.File,
    dataType: ImportDataType,
  ): Promise<ImportResult | MixedImportResult> {
    const rows = await this.parseFile(file);

    if (!rows.length) {
      throw new BadRequestException('File contains no data rows');
    }

    if (rows.length > 500) {
      throw new BadRequestException(
        `Maximum 500 rows per import (got ${rows.length}). Split into multiple files.`,
      );
    }

    if (dataType === 'all') {
      return this.importAll(tenantId, userId, rows);
    }

    return this.importRows(tenantId, userId, rows, dataType);
  }

  // ─── FILE PARSING ─────────────────────────────────────────

  private async parseFile(file: Express.Multer.File): Promise<Record<string, string>[]> {
    const ext = file.originalname.split('.').pop()?.toLowerCase();

    if (ext === 'xlsx' || ext === 'xls') {
      return this.parseExcel(file.buffer);
    }

    const content = file.buffer.toString('utf-8');

    if (ext === 'json') {
      return this.parseJson(content);
    }

    // CSV (also handles TSV)
    return this.parseCsv(content);
  }

  private async parseExcel(buffer: Buffer): Promise<Record<string, string>[]> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer as unknown as ArrayBuffer);

    // Use the first worksheet that has data
    let sheet: ExcelJS.Worksheet | undefined;
    workbook.eachSheet((ws) => {
      if (!sheet && ws.rowCount > 1) sheet = ws;
    });

    if (!sheet || sheet.rowCount < 2) {
      throw new BadRequestException('Excel file contains no data. Ensure the first sheet has headers in row 1 and data below.');
    }

    // Row 1 = headers
    const headerRow = sheet.getRow(1);
    const headers: string[] = [];
    headerRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      headers[colNumber - 1] = String(cell.value ?? '').trim();
    });

    const rows: Record<string, string>[] = [];
    for (let r = 2; r <= sheet.rowCount; r++) {
      const row: Record<string, string> = {};
      let hasData = false;
      const excelRow = sheet.getRow(r);
      for (let c = 0; c < headers.length; c++) {
        const cell = excelRow.getCell(c + 1);
        let val = '';
        if (cell.value instanceof Date) {
          val = cell.value.toISOString();
        } else if (cell.value !== null && cell.value !== undefined) {
          val = String(cell.value).trim();
        }
        if (val) hasData = true;
        if (headers[c]) row[headers[c]] = val;
      }
      if (hasData) rows.push(row);
    }

    return rows;
  }

  private parseCsv(content: string): Record<string, string>[] {
    try {
      const records: string[][] = parse(content, {
        columns: false,
        skip_empty_lines: true,
        trim: true,
        relax_column_count: true,
        bom: true,
      });

      if (records.length < 2) return [];

      // First row = headers
      const headers = records[0].map((h) => h.trim());
      const rows: Record<string, string>[] = [];

      for (let i = 1; i < records.length; i++) {
        const row: Record<string, string> = {};
        let hasData = false;
        for (let j = 0; j < headers.length; j++) {
          const val = (records[i][j] || '').trim();
          if (val) hasData = true;
          row[headers[j]] = val;
        }
        if (hasData) rows.push(row);
      }

      return rows;
    } catch {
      throw new BadRequestException(
        'Failed to parse CSV file. Ensure it is a valid CSV with headers in the first row.',
      );
    }
  }

  private parseJson(content: string): Record<string, string>[] {
    try {
      const data = JSON.parse(content);
      const arr = Array.isArray(data) ? data : data.data || data.items || data.records || [data];
      return arr.filter(
        (item: unknown) => item && typeof item === 'object' && !Array.isArray(item),
      );
    } catch {
      throw new BadRequestException('Failed to parse JSON file');
    }
  }

  // ─── "IMPORT ALL" — AUTO-DETECT TYPE PER ROW ─────────────

  private async importAll(
    tenantId: string,
    userId: string,
    rows: Record<string, string>[],
  ): Promise<MixedImportResult> {
    // Detect which types are present from column headers
    const allColumns = new Set<string>();
    for (const row of rows) {
      for (const key of Object.keys(row)) {
        allColumns.add(key.toLowerCase().replace(/[\s_#\-]/g, ''));
      }
    }

    const detectedTypes = this.detectDataTypes(allColumns);

    if (detectedTypes.length === 0) {
      // Default to clients if we can't detect
      detectedTypes.push('clients');
    }

    const results: ImportResult[] = [];
    let totalCreated = 0;
    let totalSkipped = 0;
    let totalErrors = 0;

    // Import in dependency order: clients → policies → claims → invoices → commissions → leads
    const orderedTypes: ImportDataType[] = [
      'clients',
      'policies',
      'claims',
      'invoices',
      'commissions',
      'leads',
    ];

    for (const type of orderedTypes) {
      if (!detectedTypes.includes(type)) continue;
      const result = await this.importRows(tenantId, userId, rows, type);
      results.push(result);
      totalCreated += result.created;
      totalSkipped += result.skipped;
      totalErrors += result.errors.length;
    }

    return {
      summary: {
        totalRows: rows.length,
        totalCreated,
        totalSkipped,
        totalErrors,
      },
      results,
    };
  }

  private detectDataTypes(columns: Set<string>): ImportDataType[] {
    const scores: Record<string, number> = {};

    for (const col of columns) {
      const types = TYPE_SIGNALS[col];
      if (types) {
        for (const t of types) {
          scores[t] = (scores[t] || 0) + 1;
        }
      }
    }

    // Common columns that are in multiple types
    const hasName =
      columns.has('name') ||
      columns.has('firstname') ||
      columns.has('lastname') ||
      columns.has('companyname');
    const hasPhone = columns.has('phone') || columns.has('phonenumber');
    const hasEmail = columns.has('email');
    const hasType = columns.has('type') || columns.has('clienttype');

    if ((hasName || hasPhone) && hasType) {
      scores['clients'] = (scores['clients'] || 0) + 2;
    }

    // Return types with score > 0, sorted by highest first
    return Object.entries(scores)
      .filter(([, v]) => v > 0)
      .sort(([, a], [, b]) => b - a)
      .map(([k]) => k as ImportDataType);
  }

  // ─── IMPORT ROWS BY TYPE ─────────────────────────────────

  private async importRows(
    tenantId: string,
    userId: string,
    rows: Record<string, string>[],
    dataType: ImportDataType,
  ): Promise<ImportResult> {
    const result: ImportResult = {
      dataType,
      totalRows: rows.length,
      created: 0,
      skipped: 0,
      errors: [],
    };

    for (let i = 0; i < rows.length; i++) {
      try {
        const created = await this.importSingleRow(
          tenantId,
          userId,
          rows[i],
          dataType,
          i + 1,
        );
        if (created) {
          result.created++;
        } else {
          result.skipped++;
        }
      } catch (err) {
        result.errors.push({
          row: i + 1,
          message: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    }

    // Log audit
    await this.prisma.auditLog.create({
      data: {
        tenantId,
        userId,
        action: `import.${dataType}`,
        entity: 'Import',
        entityId: `import-${Date.now()}`,
        after: {
          dataType,
          totalRows: result.totalRows,
          created: result.created,
          skipped: result.skipped,
          errorCount: result.errors.length,
        } as unknown as Prisma.InputJsonObject,
      },
    });

    return result;
  }

  // ─── DISPATCH TO ENTITY IMPORTERS ────────────────────────

  private async importSingleRow(
    tenantId: string,
    userId: string,
    row: Record<string, string>,
    dataType: ImportDataType,
    rowNum: number,
  ): Promise<boolean> {
    switch (dataType) {
      case 'clients':
        return this.importClient(tenantId, userId, row, rowNum);
      case 'policies':
        return this.importPolicy(tenantId, userId, row, rowNum);
      case 'claims':
        return this.importClaim(tenantId, userId, row, rowNum);
      case 'leads':
        return this.importLead(tenantId, userId, row, rowNum);
      case 'invoices':
        return this.importInvoice(tenantId, userId, row, rowNum);
      case 'commissions':
        return this.importCommission(tenantId, userId, row, rowNum);
      default:
        return false;
    }
  }

  // ─── COLUMN HELPER ────────────────────────────────────────
  // Normalises column names to match regardless of casing/spacing
  private col(row: Record<string, string>, ...candidates: string[]): string {
    for (const c of candidates) {
      // Exact match (case-insensitive)
      for (const key of Object.keys(row)) {
        if (key.toLowerCase().replace(/[\s_\-#]/g, '') === c.toLowerCase().replace(/[\s_\-#]/g, '')) {
          return row[key]?.trim() || '';
        }
      }
    }
    return '';
  }

  private colNum(row: Record<string, string>, ...candidates: string[]): number | null {
    const val = this.col(row, ...candidates);
    if (!val) return null;
    const n = parseFloat(val.replace(/[₵$,GHS\s]/gi, ''));
    return isNaN(n) ? null : n;
  }

  private colDate(row: Record<string, string>, ...candidates: string[]): string | null {
    const val = this.col(row, ...candidates);
    if (!val) return null;

    // 1. Excel serial date (e.g. 44955)
    if (/^\d{5}$/.test(val.trim())) {
      const serial = parseInt(val.trim());
      const d = new Date(Date.UTC(1899, 11, 30 + serial));
      return isNaN(d.getTime()) ? null : d.toISOString();
    }

    // 2. DD/MM/YYYY or DD/MM/YY (Ghana default format)
    const ddmm = val.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
    if (ddmm) {
      const [, dayStr, monthStr, yearStr] = ddmm;
      const day = parseInt(dayStr);
      const month = parseInt(monthStr);
      const year = yearStr.length === 2 ? 2000 + parseInt(yearStr) : parseInt(yearStr);
      // Treat as DD/MM/YYYY (Ghana convention) — day first
      if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
        const d = new Date(year, month - 1, day);
        return isNaN(d.getTime()) ? null : d.toISOString();
      }
    }

    // 3. ISO or other standard formats
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d.toISOString();
  }

  private colBool(row: Record<string, string>, ...candidates: string[]): boolean {
    const val = this.col(row, ...candidates).toLowerCase();
    return ['true', 'yes', '1', 'y'].includes(val);
  }

  // ─── CLIENT IMPORT ────────────────────────────────────────

  private async importClient(
    tenantId: string,
    userId: string,
    row: Record<string, string>,
    rowNum: number,
  ): Promise<boolean> {
    const name = this.col(row, 'name', 'clientname', 'fullname', 'companyname', 'client', 'insured', 'assured', 'policyholder', 'insuredname');
    const firstName = this.col(row, 'firstname', 'first_name', 'first name');
    const lastName = this.col(row, 'lastname', 'last_name', 'last name', 'surname');
    const phone = this.col(row, 'phone', 'phonenumber', 'phone number', 'mobile', 'tel', 'telephone');
    const email = this.col(row, 'email', 'emailaddress', 'email address');
    const companyName = this.col(row, 'companyname', 'company', 'company name', 'organisation', 'organization');
    const typeRaw = this.col(row, 'type', 'clienttype', 'client type').toUpperCase();

    // Determine type
    let type: 'INDIVIDUAL' | 'CORPORATE' = 'INDIVIDUAL';
    if (typeRaw === 'CORPORATE' || typeRaw === 'COMPANY' || typeRaw === 'BUSINESS') {
      type = 'CORPORATE';
    }

    // Parse name if firstName/lastName not provided
    let finalFirst = firstName;
    let finalLast = lastName;
    let finalCompany = companyName;

    if (type === 'INDIVIDUAL' && !finalFirst && name) {
      const parts = name.split(/\s+/);
      finalFirst = parts[0] || '';
      finalLast = parts.slice(1).join(' ') || '';
    }
    if (type === 'CORPORATE' && !finalCompany && name) {
      finalCompany = name;
    }

    // Validate minimum data
    if (type === 'INDIVIDUAL' && !finalFirst) {
      throw new Error(`Row ${rowNum}: firstName is required for INDIVIDUAL clients`);
    }
    if (type === 'CORPORATE' && !finalCompany) {
      throw new Error(`Row ${rowNum}: companyName is required for CORPORATE clients`);
    }
    if (!phone && !email) {
      throw new Error(`Row ${rowNum}: At least phone or email is required`);
    }

    // Check for duplicate by phone or email
    const existingWhere: Prisma.ClientWhereInput = {
      tenantId,
      deletedAt: null,
      OR: [] as Prisma.ClientWhereInput[],
    };
    if (phone) (existingWhere.OR as Prisma.ClientWhereInput[]).push({ phone });
    if (email) (existingWhere.OR as Prisma.ClientWhereInput[]).push({ email });

    if ((existingWhere.OR as Prisma.ClientWhereInput[]).length > 0) {
      const existing = await this.prisma.client.findFirst({ where: existingWhere });
      if (existing) {
        this.logger.debug(`Row ${rowNum}: Skipped duplicate client (phone/email match)`);
        return false; // skip duplicate
      }
    }

    const clientNumber = await this.generateClientNumber(tenantId);

    await this.prisma.client.create({
      data: {
        tenantId,
        clientNumber,
        type,
        firstName: type === 'INDIVIDUAL' ? finalFirst : null,
        lastName: type === 'INDIVIDUAL' ? finalLast : null,
        companyName: type === 'CORPORATE' ? finalCompany : null,
        phone: phone || 'N/A',
        email: email || null,
        region: this.col(row, 'region', 'state', 'province') || null,
        city: this.col(row, 'city', 'town') || null,
        digitalAddress: this.col(row, 'digitaladdress', 'digital_address', 'digital address', 'gps') || null,
        ghanaCardNumber: this.col(row, 'ghanacard', 'ghanacardnumber', 'ghana_card', 'ghana card number', 'id number') || null,
        dateOfBirth: this.colDate(row, 'dateofbirth', 'dob', 'date_of_birth', 'date of birth', 'birthday')
          ? new Date(this.colDate(row, 'dateofbirth', 'dob', 'date_of_birth', 'date of birth', 'birthday')!)
          : null,
        gender: this.normaliseGender(this.col(row, 'gender', 'sex')),
        occupation: this.col(row, 'occupation', 'job', 'profession') || null,
        tin: this.col(row, 'tin', 'taxid', 'tax_id', 'tax identification') || null,
        registrationNumber: this.col(row, 'registrationnumber', 'registration', 'reg_number', 'regnumber') || null,
        isPep: this.colBool(row, 'ispep', 'pep', 'politically_exposed'),
        eddRequired: this.colBool(row, 'eddrequired', 'edd', 'enhanced_due_diligence'),
      },
    });

    return true;
  }

  // ─── POLICY IMPORT ────────────────────────────────────────

  private async importPolicy(
    tenantId: string,
    userId: string,
    row: Record<string, string>,
    rowNum: number,
  ): Promise<boolean> {
    // Resolve clientId — by client number or name
    const clientRef = this.col(row, 'clientid', 'client', 'clientnumber', 'client_number', 'client number', 'client#');
    const carrierRef = this.col(row, 'carrierid', 'carrier', 'carriername', 'carrier_name', 'carrier name', 'insurer');
    const insuranceType = this.col(row, 'insurancetype', 'insurance_type', 'insurance type', 'type', 'product').toUpperCase();
    const premiumAmount = this.colNum(row, 'premiumamount', 'premium', 'premium_amount', 'premium amount');
    const sumInsured = this.colNum(row, 'suminsured', 'sum_insured', 'sum insured', 'cover', 'coverage');
    const startDate = this.colDate(row, 'startdate', 'start_date', 'start date', 'inception', 'inceptiondate');
    const endDate = this.colDate(row, 'enddate', 'end_date', 'end date', 'expiry', 'expirydate', 'expiry_date');

    if (!clientRef) throw new Error(`Row ${rowNum}: clientId/clientNumber is required`);
    if (!insuranceType) throw new Error(`Row ${rowNum}: insuranceType is required`);
    if (!premiumAmount) throw new Error(`Row ${rowNum}: premiumAmount is required`);

    // Dedup — if a policy number is provided in the import, check for existing
    const sourcePolicyNumber = this.col(row, 'policynumber', 'policy_number', 'policy number', 'policy#', 'policyno');
    if (sourcePolicyNumber) {
      const existing = await this.prisma.policy.findFirst({
        where: { tenantId, policyNumber: sourcePolicyNumber, deletedAt: null },
      });
      if (existing) return false; // skip duplicate
    }

    // Look up client
    const client = await this.prisma.client.findFirst({
      where: {
        tenantId,
        deletedAt: null,
        OR: [
          { id: clientRef },
          { clientNumber: clientRef },
          { companyName: { contains: clientRef, mode: 'insensitive' } },
          { firstName: { contains: clientRef, mode: 'insensitive' } },
        ],
      },
    });
    if (!client) throw new Error(`Row ${rowNum}: Client "${clientRef}" not found`);

    // Look up carrier (optional)
    let carrierId: string | null = null;
    if (carrierRef) {
      const carrier = await this.prisma.carrier.findFirst({
        where: {
          tenantId,
          OR: [
            { id: carrierRef },
            { name: { contains: carrierRef, mode: 'insensitive' } },
          ],
        },
      });
      if (carrier) carrierId = carrier.id;
    }

    // If no carrier found, try to use any existing carrier
    if (!carrierId) {
      const defaultCarrier = await this.prisma.carrier.findFirst({
        where: { tenantId },
      });
      if (!defaultCarrier) throw new Error(`Row ${rowNum}: No carrier found in system`);
      carrierId = defaultCarrier.id;
    }

    const today = new Date();
    const nextYear = new Date(today);
    nextYear.setFullYear(nextYear.getFullYear() + 1);

    const policyNumber = sourcePolicyNumber || await this.generatePolicyNumber(tenantId);
    const insType = this.normaliseInsuranceType(insuranceType) as InsuranceType;
    const policyType = ['LIFE'].includes(insType) ? 'LIFE' : 'NON_LIFE';

    // Commission rate — prefer Product table lookup over imported value
    const importedRate = this.colNum(row, 'commission', 'commissionrate', 'commission_rate');
    let commRate = importedRate ?? 10;
    if (carrierId) {
      const product = await this.prisma.product.findFirst({
        where: { tenantId, carrierId, insuranceType: insType },
        select: { commissionRate: true },
      });
      if (product) {
        commRate = product.commissionRate.toNumber();
      }
    }
    const commAmount = ((premiumAmount ?? 0) * commRate) / 100;

    await this.prisma.policy.create({
      data: {
        tenantId,
        policyNumber,
        clientId: client.id,
        carrierId,
        brokerId: userId,
        insuranceType: insType,
        policyType,
        inceptionDate: startDate ? new Date(startDate) : today,
        expiryDate: endDate ? new Date(endDate) : nextYear,
        premiumAmount: premiumAmount ?? 0,
        sumInsured: sumInsured ?? 0,
        commissionRate: commRate,
        commissionAmount: commAmount,
        premiumFrequency: this.normalisePremiumFrequency(
          this.col(row, 'premiumfrequency', 'frequency', 'payment_frequency', 'paymentfrequency'),
        ) as PremiumFrequency,
        currency: this.col(row, 'currency', 'curr') || 'GHS',
      },
    });

    return true;
  }

  // ─── CLAIM IMPORT ─────────────────────────────────────────

  private async importClaim(
    tenantId: string,
    userId: string,
    row: Record<string, string>,
    rowNum: number,
  ): Promise<boolean> {
    const policyRef = this.col(row, 'policyid', 'policy', 'policynumber', 'policy_number', 'policy number', 'policy#');
    const description = this.col(row, 'description', 'details', 'claim_description', 'claimdescription', 'reason');
    const incidentDate = this.colDate(row, 'incidentdate', 'incident_date', 'incident date', 'date', 'dateofincident');
    const claimAmount = this.colNum(row, 'claimamount', 'claim_amount', 'claim amount', 'amount');

    if (!policyRef) throw new Error(`Row ${rowNum}: policyId/policyNumber is required`);
    if (!description || description.length < 10) {
      throw new Error(`Row ${rowNum}: description is required (at least 10 characters)`);
    }

    const policy = await this.prisma.policy.findFirst({
      where: {
        tenantId,
        OR: [{ id: policyRef }, { policyNumber: policyRef }],
      },
    });
    if (!policy) throw new Error(`Row ${rowNum}: Policy "${policyRef}" not found`);

    const claimNumber = await this.generateClaimNumber(tenantId);

    const incDate = incidentDate ? new Date(incidentDate) : new Date();
    const ackDeadline = new Date(incDate);
    ackDeadline.setDate(ackDeadline.getDate() + 3);
    const procDeadline = new Date(incDate);
    procDeadline.setDate(procDeadline.getDate() + 30);

    await this.prisma.claim.create({
      data: {
        tenantId,
        claimNumber,
        policyId: policy.id,
        clientId: policy.clientId,
        insuranceType: policy.insuranceType,
        incidentDescription: description,
        incidentDate: incDate,
        acknowledgmentDeadline: ackDeadline,
        processingDeadline: procDeadline,
        claimAmount: claimAmount ?? 0,
        incidentLocation: this.col(row, 'location', 'place', 'incident_location') || null,
      },
    });

    return true;
  }

  // ─── LEAD IMPORT ──────────────────────────────────────────

  private async importLead(
    tenantId: string,
    userId: string,
    row: Record<string, string>,
    rowNum: number,
  ): Promise<boolean> {
    const contactName = this.col(row, 'contactname', 'contact_name', 'contact name', 'name', 'fullname', 'leadname');
    const source = this.col(row, 'source', 'leadsource', 'lead_source', 'lead source').toUpperCase();
    const email = this.col(row, 'email', 'emailaddress');
    const phone = this.col(row, 'phone', 'phonenumber', 'mobile');

    if (!contactName) throw new Error(`Row ${rowNum}: contactName is required`);

    // Skip duplicates by name + email
    if (email) {
      const existing = await this.prisma.lead.findFirst({
        where: { tenantId, email, deletedAt: null },
      });
      if (existing) return false;
    }

    const leadNumber = await this.generateLeadNumber(tenantId);

    await this.prisma.lead.create({
      data: {
        tenantId,
        leadNumber,
        contactName,
        source: this.normaliseLeadSource(source) as LeadSource,
        email: email || null,
        phone: phone || null,
        companyName: this.col(row, 'companyname', 'company', 'company_name') || null,
        estimatedPremium: this.colNum(row, 'estimatedpremium', 'estimated_premium', 'estimated premium'),
        priority: this.normaliseLeadPriority(
          this.col(row, 'priority', 'leadpriority'),
        ) as LeadPriority,
        notes: this.col(row, 'notes', 'remarks', 'description') || null,
      },
    });

    return true;
  }

  // ─── INVOICE IMPORT ───────────────────────────────────────

  private async importInvoice(
    tenantId: string,
    userId: string,
    row: Record<string, string>,
    rowNum: number,
  ): Promise<boolean> {
    const clientRef = this.col(row, 'clientid', 'client', 'clientnumber', 'client_number', 'client number');
    const amount = this.colNum(row, 'amount', 'total', 'invoiceamount', 'invoice_amount');

    if (!clientRef) throw new Error(`Row ${rowNum}: clientId/clientNumber is required`);
    if (!amount) throw new Error(`Row ${rowNum}: amount is required`);

    const client = await this.prisma.client.findFirst({
      where: {
        tenantId,
        deletedAt: null,
        OR: [
          { id: clientRef },
          { clientNumber: clientRef },
          { companyName: { contains: clientRef, mode: 'insensitive' } },
        ],
      },
    });
    if (!client) throw new Error(`Row ${rowNum}: Client "${clientRef}" not found`);

    // Optionally link to policy
    let policyId: string | null = null;
    const policyRef = this.col(row, 'policyid', 'policy', 'policynumber');
    if (policyRef) {
      const policy = await this.prisma.policy.findFirst({
        where: {
          tenantId,
          OR: [{ id: policyRef }, { policyNumber: policyRef }],
        },
      });
      if (policy) policyId = policy.id;
    }

    const invoiceNumber = await this.generateInvoiceNumber(tenantId);

    const dueDateVal = this.colDate(row, 'duedate', 'due_date', 'due date', 'datedue', 'date_due');
    const defaultDue = new Date();
    defaultDue.setDate(defaultDue.getDate() + 30);

    await this.prisma.invoice.create({
      data: {
        tenantId,
        invoiceNumber,
        clientId: client.id,
        policyId,
        amount,
        description: this.col(row, 'description', 'details', 'memo') || `Import - ${invoiceNumber}`,
        dateDue: dueDateVal ? new Date(dueDateVal) : defaultDue,
        notes: this.col(row, 'notes', 'remarks') || null,
      },
    });

    return true;
  }

  // ─── COMMISSION IMPORT ────────────────────────────────────

  private async importCommission(
    tenantId: string,
    userId: string,
    row: Record<string, string>,
    rowNum: number,
  ): Promise<boolean> {
    const policyRef = this.col(row, 'policyid', 'policy', 'policynumber', 'policy_number');

    if (!policyRef) throw new Error(`Row ${rowNum}: policyId/policyNumber is required`);

    const policy = await this.prisma.policy.findFirst({
      where: {
        tenantId,
        OR: [{ id: policyRef }, { policyNumber: policyRef }],
      },
      include: { client: true, carrier: true },
    });
    if (!policy) throw new Error(`Row ${rowNum}: Policy "${policyRef}" not found`);

    // Check if commission already exists for this policy
    const existing = await this.prisma.commission.findFirst({
      where: { policyId: policy.id, tenantId },
    });
    if (existing) return false;

    const rate = this.colNum(row, 'commissionrate', 'rate', 'commission_rate', 'commission') ?? 10;
    const premAmt = policy.premiumAmount.toNumber();
    const commissionAmount = (premAmt * rate) / 100;
    const nicLevy = commissionAmount * NIC_LEVY_RATE;
    const netCommission = commissionAmount - nicLevy;

    // Need a brokerId — use the importing user as fallback
    const brokerId = this.col(row, 'brokerid', 'broker', 'broker_id') || userId;

    await this.prisma.commission.create({
      data: {
        tenantId,
        policyId: policy.id,
        clientId: policy.clientId,
        brokerId,
        insurerName: policy.carrier?.name ?? 'Unknown',
        productType: policy.insuranceType,
        premiumAmount: premAmt,
        commissionRate: rate,
        commissionAmount,
        nicLevy,
        netCommission,
      },
    });

    return true;
  }

  // ─── NUMBER GENERATORS ────────────────────────────────────

  private async generateClientNumber(tenantId: string): Promise<string> {
    const count = await this.prisma.client.count({ where: { tenantId } });
    const hex = randomBytes(3).toString('hex').toUpperCase();
    return `CLI-${String(count + 1).padStart(6, '0')}-${hex}`;
  }

  private async generatePolicyNumber(tenantId: string): Promise<string> {
    const count = await this.prisma.policy.count({ where: { tenantId } });
    const hex = randomBytes(2).toString('hex').toUpperCase();
    return `POL-${String(count + 1).padStart(6, '0')}-${hex}`;
  }

  private async generateClaimNumber(tenantId: string): Promise<string> {
    const count = await this.prisma.claim.count({ where: { tenantId } });
    const hex = randomBytes(2).toString('hex').toUpperCase();
    return `CLM-${String(count + 1).padStart(6, '0')}-${hex}`;
  }

  private async generateInvoiceNumber(tenantId: string): Promise<string> {
    const count = await this.prisma.invoice.count({ where: { tenantId } });
    return `INV-${String(count + 1).padStart(6, '0')}`;
  }

  private async generateLeadNumber(tenantId: string): Promise<string> {
    const count = await this.prisma.lead.count({ where: { tenantId } });
    const hex = randomBytes(2).toString('hex').toUpperCase();
    return `LD-${String(count + 1).padStart(6, '0')}-${hex}`;
  }

  // ─── NORMALISATION HELPERS ────────────────────────────────

  private normaliseGender(val: string): Gender | null {
    const v = val.toUpperCase().trim();
    if (['M', 'MALE', 'MAN'].includes(v)) return 'MALE';
    if (['F', 'FEMALE', 'WOMAN'].includes(v)) return 'FEMALE';
    if (v) return 'OTHER';
    return null;
  }

  private normaliseInsuranceType(val: string): string {
    const map: Record<string, string> = {
      MOTOR: 'MOTOR', CAR: 'MOTOR', VEHICLE: 'MOTOR', AUTO: 'MOTOR',
      FIRE: 'FIRE', PROPERTY: 'FIRE', BUILDING: 'FIRE',
      MARINE: 'MARINE', CARGO: 'MARINE', SHIPPING: 'MARINE',
      LIFE: 'LIFE',
      HEALTH: 'HEALTH', MEDICAL: 'HEALTH',
      LIABILITY: 'LIABILITY',
      ENGINEERING: 'ENGINEERING',
      BONDS: 'BONDS', BOND: 'BONDS',
      TRAVEL: 'TRAVEL',
      AGRICULTURE: 'AGRICULTURE', AGRIC: 'AGRICULTURE',
      OIL_GAS: 'OIL_GAS', OILGAS: 'OIL_GAS',
      AVIATION: 'AVIATION',
      PROFESSIONAL_INDEMNITY: 'PROFESSIONAL_INDEMNITY', PI: 'PROFESSIONAL_INDEMNITY',
    };
    return map[val.toUpperCase().replace(/\s+/g, '_')] || 'OTHER';
  }

  private normalisePremiumFrequency(val: string): string {
    const v = val.toUpperCase().trim();
    if (['MONTHLY', 'MONTH', 'M'].includes(v)) return 'MONTHLY';
    if (['QUARTERLY', 'QUARTER', 'Q'].includes(v)) return 'QUARTERLY';
    if (['SEMI_ANNUAL', 'SEMIANNUAL', 'SEMI', 'SA'].includes(v)) return 'SEMI_ANNUAL';
    if (['SINGLE', 'ONE_TIME', 'ONETIME', 'ONCE'].includes(v)) return 'SINGLE';
    return 'ANNUAL';
  }

  private normaliseLeadSource(val: string): string {
    const map: Record<string, string> = {
      REFERRAL: 'REFERRAL', REF: 'REFERRAL', REFERRED: 'REFERRAL',
      WEBSITE: 'WEBSITE', WEB: 'WEBSITE', ONLINE: 'WEBSITE',
      WALK_IN: 'WALK_IN', WALKIN: 'WALK_IN', 'WALK IN': 'WALK_IN',
      PHONE: 'PHONE', CALL: 'PHONE', TELEPHONE: 'PHONE',
      EMAIL: 'EMAIL',
      SOCIAL_MEDIA: 'SOCIAL_MEDIA', SOCIALMEDIA: 'SOCIAL_MEDIA', SOCIAL: 'SOCIAL_MEDIA',
      EVENT: 'EVENT', CONFERENCE: 'EVENT',
      PARTNER: 'PARTNER',
    };
    return map[val.toUpperCase().replace(/\s+/g, '_')] || 'OTHER';
  }

  private normaliseLeadPriority(val: string): string {
    const v = val.toUpperCase().trim();
    if (['HOT', 'HIGH', 'URGENT'].includes(v)) return 'HOT';
    if (['COLD', 'LOW'].includes(v)) return 'COLD';
    return 'WARM';
  }
}
