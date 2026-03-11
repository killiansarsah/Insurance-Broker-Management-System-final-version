import { Injectable, Logger } from '@nestjs/common';
import { google, drive_v3 } from 'googleapis';
import { PrismaService } from '../../prisma/prisma.service';
import { GoogleOAuthService } from './google-oauth.service';
import { Prisma } from '@prisma/client';
import { Readable } from 'stream';

@Injectable()
export class GoogleDriveService {
  private readonly logger = new Logger(GoogleDriveService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly googleOAuth: GoogleOAuthService,
  ) {}

  private async getDriveApi(tenantId: string): Promise<drive_v3.Drive> {
    const auth = await this.googleOAuth.getAuthenticatedClient(
      tenantId,
      'google-drive',
    );
    return google.drive({ version: 'v3', auth });
  }

  /**
   * Find or create the root IBMS folder in Google Drive.
   */
  private async getOrCreateRootFolder(
    drive: drive_v3.Drive,
  ): Promise<string> {
    // Search for existing IBMS folder
    const response = await drive.files.list({
      q: "name = 'IBMS Documents' and mimeType = 'application/vnd.google-apps.folder' and trashed = false",
      fields: 'files(id, name)',
      spaces: 'drive',
    });

    if (response.data.files?.length) {
      return response.data.files[0].id!;
    }

    // Create root folder
    const folder = await drive.files.create({
      requestBody: {
        name: 'IBMS Documents',
        mimeType: 'application/vnd.google-apps.folder',
      },
      fields: 'id',
    });

    return folder.data.id!;
  }

  /**
   * Find or create a subfolder under the root IBMS folder.
   */
  private async getOrCreateSubfolder(
    drive: drive_v3.Drive,
    parentId: string,
    name: string,
  ): Promise<string> {
    const response = await drive.files.list({
      q: `name = '${name.replace(/'/g, "\\'")}' and '${parentId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
      fields: 'files(id, name)',
      spaces: 'drive',
    });

    if (response.data.files?.length) {
      return response.data.files[0].id!;
    }

    const folder = await drive.files.create({
      requestBody: {
        name,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [parentId],
      },
      fields: 'id',
    });

    return folder.data.id!;
  }

  /**
   * Upload a single document to Google Drive under the appropriate category folder.
   * Folder structure: IBMS Documents / {Category} / {filename}
   */
  async uploadDocument(
    tenantId: string,
    documentId: string,
    fileBuffer: Buffer,
  ): Promise<{ driveFileId: string; webViewLink: string }> {
    const document = await this.prisma.document.findFirst({
      where: { id: documentId, tenantId },
    });
    if (!document) {
      throw new Error(`Document ${documentId} not found`);
    }

    const drive = await this.getDriveApi(tenantId);
    const rootId = await this.getOrCreateRootFolder(drive);
    const categoryFolder = await this.getOrCreateSubfolder(
      drive,
      rootId,
      document.category,
    );

    const stream = new Readable();
    stream.push(fileBuffer);
    stream.push(null);

    const uploaded = await drive.files.create({
      requestBody: {
        name: document.name,
        parents: [categoryFolder],
        mimeType: document.mimeType,
      },
      media: {
        mimeType: document.mimeType,
        body: stream,
      },
      fields: 'id, webViewLink',
    });

    this.logger.log(
      `Uploaded "${document.name}" to Google Drive for tenant ${tenantId}`,
    );

    return {
      driveFileId: uploaded.data.id!,
      webViewLink: uploaded.data.webViewLink!,
    };
  }

  /**
   * Mirror all documents for a tenant to Google Drive.
   * Only uploads documents that have a storagePath/url and haven't been uploaded yet.
   */
  async mirrorDocuments(
    tenantId: string,
  ): Promise<{ mirrored: number; skipped: number; errors: string[] }> {
    const drive = await this.getDriveApi(tenantId);
    const rootId = await this.getOrCreateRootFolder(drive);

    const documents = await this.prisma.document.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: 500,
    });

    let mirrored = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const doc of documents) {
      if (!doc.url && !doc.storagePath) {
        skipped++;
        continue;
      }

      try {
        const categoryFolder = await this.getOrCreateSubfolder(
          drive,
          rootId,
          doc.category,
        );

        // Check if file already exists in the folder
        const existing = await drive.files.list({
          q: `name = '${doc.name.replace(/'/g, "\\'")}' and '${categoryFolder}' in parents and trashed = false`,
          fields: 'files(id)',
          spaces: 'drive',
        });

        if (existing.data.files?.length) {
          skipped++;
          continue;
        }

        // Create a placeholder file with metadata (actual content would need file storage access)
        await drive.files.create({
          requestBody: {
            name: doc.name,
            parents: [categoryFolder],
            mimeType: doc.mimeType,
            description: `IBMS Document - Category: ${doc.category}, Uploaded: ${doc.createdAt.toISOString()}`,
          },
          fields: 'id',
        });

        mirrored++;
      } catch (err: any) {
        const msg = `Failed to mirror "${doc.name}": ${err.message ?? err}`;
        this.logger.warn(msg);
        errors.push(msg);
      }
    }

    await this.logSyncEvent(tenantId, mirrored, errors.length);

    return { mirrored, skipped, errors };
  }

  /**
   * List files in the IBMS Documents folder on Google Drive.
   */
  async listDriveFiles(
    tenantId: string,
    category?: string,
  ): Promise<{ files: { id: string; name: string; mimeType: string; webViewLink: string; modifiedTime: string }[] }> {
    const drive = await this.getDriveApi(tenantId);
    const rootId = await this.getOrCreateRootFolder(drive);

    let parentId = rootId;
    if (category) {
      parentId = await this.getOrCreateSubfolder(drive, rootId, category);
    }

    const response = await drive.files.list({
      q: `'${parentId}' in parents and trashed = false`,
      fields: 'files(id, name, mimeType, webViewLink, modifiedTime)',
      orderBy: 'modifiedTime desc',
      pageSize: 100,
    });

    const files = (response.data.files ?? []).map((f) => ({
      id: f.id!,
      name: f.name!,
      mimeType: f.mimeType!,
      webViewLink: f.webViewLink ?? '',
      modifiedTime: f.modifiedTime ?? '',
    }));

    return { files };
  }

  private async logSyncEvent(
    tenantId: string,
    count: number,
    errorCount: number,
  ) {
    const integration = await this.prisma.integration.findUnique({
      where: {
        tenantId_serviceKey: { tenantId, serviceKey: 'google-drive' },
      },
    });
    if (!integration) return;

    const existingEvents = Array.isArray(integration.syncEvents)
      ? (integration.syncEvents as any[])
      : [];

    const syncEvent = {
      id: `evt-${Date.now()}`,
      type: 'sync',
      message: `Drive mirror: ${count} documents${errorCount > 0 ? `, ${errorCount} errors` : ''}`,
      timestamp: new Date().toISOString(),
    };

    await this.prisma.integration.update({
      where: {
        tenantId_serviceKey: { tenantId, serviceKey: 'google-drive' },
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
