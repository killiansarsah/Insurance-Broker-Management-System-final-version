import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { google, sheets_v4 } from 'googleapis';
import { PrismaService } from '../../prisma/prisma.service';
import { GoogleOAuthService } from './google-oauth.service';
import { Prisma } from '@prisma/client';

type ExportType =
  | 'clients'
  | 'policies'
  | 'claims'
  | 'commissions'
  | 'financial'
  | 'renewals';

@Injectable()
export class GoogleSheetsService {
  private readonly logger = new Logger(GoogleSheetsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly googleOAuth: GoogleOAuthService,
  ) {}

  private async getSheetsApi(tenantId: string): Promise<sheets_v4.Sheets> {
    const auth = await this.googleOAuth.getAuthenticatedClient(
      tenantId,
      'google-sheets',
    );
    return google.sheets({ version: 'v4', auth });
  }

  /**
   * Export data to a new Google Spreadsheet.
   * Returns the spreadsheet URL.
   */
  async exportToSheets(
    tenantId: string,
    exportType: ExportType,
    dateFrom?: string,
    dateTo?: string,
  ): Promise<{
    spreadsheetUrl: string;
    spreadsheetId: string;
    rowCount: number;
  }> {
    const sheets = await this.getSheetsApi(tenantId);
    const { headers, rows } = await this.getData(
      tenantId,
      exportType,
      dateFrom,
      dateTo,
    );

    const title = `IBMS ${this.capitalize(exportType)} Export — ${new Date().toLocaleDateString()}`;

    // Create spreadsheet
    const spreadsheet = await sheets.spreadsheets.create({
      requestBody: {
        properties: { title },
        sheets: [
          {
            properties: { title: this.capitalize(exportType) },
          },
        ],
      },
    });

    const spreadsheetId = spreadsheet.data.spreadsheetId;

    // Write header + data rows
    const allRows = [headers, ...rows];
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${this.capitalize(exportType)}!A1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: allRows },
    });

    // Bold the header row and auto-resize
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: 0,
                startRowIndex: 0,
                endRowIndex: 1,
              },
              cell: {
                userEnteredFormat: {
                  textFormat: { bold: true },
                  backgroundColor: { red: 0.9, green: 0.9, blue: 0.95 },
                },
              },
              fields: 'userEnteredFormat(textFormat,backgroundColor)',
            },
          },
          {
            autoResizeDimensions: {
              dimensions: {
                sheetId: 0,
                dimension: 'COLUMNS',
                startIndex: 0,
                endIndex: headers.length,
              },
            },
          },
        ],
      },
    });

    const spreadsheetUrl = spreadsheet.data.spreadsheetUrl;

    // Log sync event
    await this.logSyncEvent(tenantId, exportType, rows.length);

    this.logger.log(
      `Exported ${rows.length} ${exportType} rows to Google Sheets for tenant ${tenantId}`,
    );

    return { spreadsheetUrl, spreadsheetId, rowCount: rows.length };
  }

  /** Fetch data for the given export type. */
  private async getData(
    tenantId: string,
    exportType: ExportType,
    dateFrom?: string,
    dateTo?: string,
  ): Promise<{ headers: string[]; rows: (string | number)[][] }> {
    switch (exportType) {
      case 'clients':
        return this.getClientsData(tenantId);
      case 'policies':
        return this.getPoliciesData(tenantId, dateFrom, dateTo);
      case 'claims':
        return this.getClaimsData(tenantId, dateFrom, dateTo);
      case 'commissions':
        return this.getCommissionsData(tenantId, dateFrom, dateTo);
      case 'financial':
        return this.getFinancialData(tenantId, dateFrom, dateTo);
      case 'renewals':
        return this.getRenewalsData(tenantId, dateFrom, dateTo);
      default:
        throw new BadRequestException(`Unknown export type: ${exportType}`);
    }
  }

  private async getClientsData(tenantId: string) {
    const clients = await this.prisma.client.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: 2000,
    });

    const headers = [
      'Name',
      'Email',
      'Phone',
      'Type',
      'Status',
      'KYC Status',
      'Created Date',
    ];

    const rows = clients.map((c) => [
      `${c.firstName ?? ''} ${c.lastName ?? ''}`.trim(),
      c.email ?? '',
      c.phone,
      c.type,
      c.status,
      c.kycStatus,
      c.createdAt.toISOString().split('T')[0],
    ]);

    return { headers, rows };
  }

  private async getPoliciesData(
    tenantId: string,
    dateFrom?: string,
    dateTo?: string,
  ) {
    const where: Prisma.PolicyWhereInput = { tenantId };
    if (dateFrom || dateTo) {
      where.inceptionDate = {};
      if (dateFrom) where.inceptionDate.gte = new Date(dateFrom);
      if (dateTo) where.inceptionDate.lte = new Date(dateTo);
    }

    const policies = await this.prisma.policy.findMany({
      where,
      include: { client: true, carrier: true },
      orderBy: { inceptionDate: 'desc' },
      take: 2000,
    });

    const headers = [
      'Policy Number',
      'Client',
      'Carrier',
      'Insurance Type',
      'Status',
      'Premium',
      'Sum Insured',
      'Inception Date',
      'Expiry Date',
    ];

    const rows = policies.map((p) => [
      p.policyNumber,
      p.client
        ? `${p.client.firstName ?? ''} ${p.client.lastName ?? ''}`.trim()
        : '',
      p.carrier?.name ?? '',
      p.insuranceType,
      p.status,
      Number(p.premiumAmount),
      Number(p.sumInsured),
      p.inceptionDate.toISOString().split('T')[0],
      p.expiryDate.toISOString().split('T')[0],
    ]);

    return { headers, rows };
  }

  private async getClaimsData(
    tenantId: string,
    dateFrom?: string,
    dateTo?: string,
  ) {
    const where: Prisma.ClaimWhereInput = { tenantId };
    if (dateFrom || dateTo) {
      where.intimationDate = {};
      if (dateFrom) where.intimationDate.gte = new Date(dateFrom);
      if (dateTo) where.intimationDate.lte = new Date(dateTo);
    }

    const claims = await this.prisma.claim.findMany({
      where,
      include: { policy: { include: { client: true } } },
      orderBy: { intimationDate: 'desc' },
      take: 2000,
    });

    const headers = [
      'Claim Number',
      'Client',
      'Policy Number',
      'Status',
      'Claim Amount',
      'Settled Amount',
      'Intimation Date',
      'Incident Date',
      'Description',
    ];

    const rows = claims.map((c) => [
      c.claimNumber,
      c.policy?.client
        ? `${c.policy.client.firstName ?? ''} ${c.policy.client.lastName ?? ''}`.trim()
        : '',
      c.policy?.policyNumber ?? '',
      c.status,
      Number(c.claimAmount),
      Number(c.settledAmount ?? 0),
      c.intimationDate.toISOString().split('T')[0],
      c.incidentDate.toISOString().split('T')[0],
      c.incidentDescription ?? '',
    ]);

    return { headers, rows };
  }

  private async getCommissionsData(
    tenantId: string,
    dateFrom?: string,
    dateTo?: string,
  ) {
    const where: Prisma.CommissionWhereInput = { tenantId };
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    const commissions = await this.prisma.commission.findMany({
      where,
      include: { policy: { include: { client: true } } },
      orderBy: { createdAt: 'desc' },
      take: 2000,
    });

    const headers = [
      'Policy Number',
      'Client',
      'Insurer',
      'Commission Rate (%)',
      'Commission Amount',
      'Status',
      'Date Earned',
    ];

    const rows = commissions.map((c) => [
      c.policy?.policyNumber ?? '',
      c.policy?.client
        ? `${c.policy.client.firstName ?? ''} ${c.policy.client.lastName ?? ''}`.trim()
        : '',
      c.insurerName,
      Number(c.commissionRate),
      Number(c.commissionAmount),
      c.status,
      c.dateEarned?.toISOString().split('T')[0] ?? '',
    ]);

    return { headers, rows };
  }

  private async getFinancialData(
    tenantId: string,
    dateFrom?: string,
    dateTo?: string,
  ) {
    const where: Prisma.InvoiceWhereInput = { tenantId };
    if (dateFrom || dateTo) {
      where.dateIssued = {};
      if (dateFrom) where.dateIssued.gte = new Date(dateFrom);
      if (dateTo) where.dateIssued.lte = new Date(dateTo);
    }

    const invoices = await this.prisma.invoice.findMany({
      where,
      include: { client: true },
      orderBy: { dateIssued: 'desc' },
      take: 2000,
    });

    const headers = [
      'Invoice Number',
      'Client',
      'Amount',
      'Amount Paid',
      'Status',
      'Date Issued',
      'Date Due',
    ];

    const rows = invoices.map((inv) => [
      inv.invoiceNumber,
      inv.client
        ? `${inv.client.firstName ?? ''} ${inv.client.lastName ?? ''}`.trim()
        : '',
      Number(inv.amount),
      Number(inv.amountPaid ?? 0),
      inv.status,
      inv.dateIssued.toISOString().split('T')[0],
      inv.dateDue.toISOString().split('T')[0],
    ]);

    return { headers, rows };
  }

  private async getRenewalsData(
    tenantId: string,
    dateFrom?: string,
    dateTo?: string,
  ) {
    const now = new Date();
    const defaultTo = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

    const where: Prisma.PolicyWhereInput = {
      tenantId,
      expiryDate: {
        gte: dateFrom ? new Date(dateFrom) : now,
        lte: dateTo ? new Date(dateTo) : defaultTo,
      },
      status: { in: ['ACTIVE'] },
    };

    const policies = await this.prisma.policy.findMany({
      where,
      include: { client: true, carrier: true },
      orderBy: { expiryDate: 'asc' },
      take: 2000,
    });

    const headers = [
      'Policy Number',
      'Client',
      'Carrier',
      'Insurance Type',
      'Premium',
      'Expiry Date',
      'Days Until Expiry',
      'Status',
    ];

    const rows = policies.map((p) => {
      const daysLeft = Math.ceil(
        (p.expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );
      return [
        p.policyNumber,
        p.client
          ? `${p.client.firstName ?? ''} ${p.client.lastName ?? ''}`.trim()
          : '',
        p.carrier?.name ?? '',
        p.insuranceType,
        Number(p.premiumAmount),
        p.expiryDate.toISOString().split('T')[0],
        daysLeft,
        p.status,
      ];
    });

    return { headers, rows };
  }

  private capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  private async logSyncEvent(
    tenantId: string,
    exportType: string,
    rowCount: number,
  ) {
    const integration = await this.prisma.integration.findUnique({
      where: {
        tenantId_serviceKey: { tenantId, serviceKey: 'google-sheets' },
      },
    });
    if (!integration) return;

    const existingEvents = Array.isArray(integration.syncEvents)
      ? (integration.syncEvents as any[])
      : [];

    const syncEvent = {
      id: `evt-${Date.now()}`,
      type: 'export',
      message: `Exported ${rowCount} ${exportType} rows to Google Sheets`,
      timestamp: new Date().toISOString(),
    };

    await this.prisma.integration.update({
      where: {
        tenantId_serviceKey: { tenantId, serviceKey: 'google-sheets' },
      },
      data: {
        lastSyncAt: new Date(),
        syncEvents: [syncEvent, ...existingEvents].slice(
          0,
          20,
        ) as unknown as Prisma.InputJsonValue,
      },
    });
  }
}
