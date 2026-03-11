import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, Auth } from 'googleapis';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

/** Scopes needed for Calendar, Sheets, and Drive. */
const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/userinfo.email',
];

interface StoredCredentials {
  access_token: string;
  refresh_token: string;
  expiry_date: number;
  token_type: string;
}

@Injectable()
export class GoogleOAuthService {
  private readonly logger = new Logger(GoogleOAuthService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  /** Create a fresh OAuth2 client. */
  createOAuth2Client(): Auth.OAuth2Client {
    return new google.auth.OAuth2(
      this.config.get<string>('google.clientId'),
      this.config.get<string>('google.clientSecret'),
      this.config.get<string>('google.redirectUri'),
    );
  }

  /** Generate the Google consent URL. */
  getConsentUrl(tenantId: string): string {
    const client = this.createOAuth2Client();
    return client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: GOOGLE_SCOPES,
      state: tenantId,
    });
  }

  /** Exchange an authorization code for tokens and persist them. */
  async handleCallback(code: string, tenantId: string) {
    const client = this.createOAuth2Client();
    const { tokens } = await client.getToken(code);

    if (!tokens.refresh_token) {
      throw new BadRequestException(
        'No refresh token received. Please revoke access and try again.',
      );
    }

    client.setCredentials(tokens);

    // Get connected email
    const oauth2 = google.oauth2({ version: 'v2', auth: client });
    const { data: userInfo } = await oauth2.userinfo.get();

    const credentials: StoredCredentials = {
      access_token: tokens.access_token!,
      refresh_token: tokens.refresh_token,
      expiry_date: tokens.expiry_date ?? Date.now() + 3600_000,
      token_type: tokens.token_type ?? 'Bearer',
    };

    const now = new Date();
    const connectEvent = {
      id: `evt-${Date.now()}`,
      type: 'connected',
      message: 'Google account connected via OAuth2',
      timestamp: now.toISOString(),
    };

    // Upsert integrations for all three Google services
    const serviceKeys = ['google-calendar', 'google-sheets', 'google-drive'];
    for (const serviceKey of serviceKeys) {
      const existing = await this.prisma.integration.findUnique({
        where: { tenantId_serviceKey: { tenantId, serviceKey } },
      });
      const existingEvents = Array.isArray(existing?.syncEvents)
        ? (existing.syncEvents as any[])
        : [];

      await this.prisma.integration.upsert({
        where: { tenantId_serviceKey: { tenantId, serviceKey } },
        create: {
          tenantId,
          serviceKey,
          connected: true,
          connectedAt: now,
          connectedEmail: userInfo.email ?? null,
          lastSyncAt: now,
          credentials: credentials as unknown as Prisma.InputJsonValue,
          syncEvents: [connectEvent] as unknown as Prisma.InputJsonValue,
        },
        update: {
          connected: true,
          connectedAt: now,
          connectedEmail: userInfo.email ?? null,
          lastSyncAt: now,
          credentials: credentials as unknown as Prisma.InputJsonValue,
          syncEvents: [connectEvent, ...existingEvents].slice(
            0,
            20,
          ) as unknown as Prisma.InputJsonValue,
        },
      });
    }

    this.logger.log(
      `Google connected for tenant ${tenantId} (${userInfo.email})`,
    );

    return { email: userInfo.email, serviceKeys };
  }

  /**
   * Get an authenticated OAuth2 client for a tenant.
   * Automatically refreshes expired tokens.
   */
  async getAuthenticatedClient(
    tenantId: string,
    serviceKey = 'google-calendar',
  ): Promise<Auth.OAuth2Client> {
    const integration = await this.prisma.integration.findUnique({
      where: { tenantId_serviceKey: { tenantId, serviceKey } },
    });

    if (!integration?.connected) {
      throw new BadRequestException(
        `Google integration (${serviceKey}) is not connected`,
      );
    }

    const creds = integration.credentials as unknown as StoredCredentials;
    if (!creds?.refresh_token) {
      throw new BadRequestException('No Google credentials found. Please reconnect.');
    }

    const client = this.createOAuth2Client();
    client.setCredentials({
      access_token: creds.access_token,
      refresh_token: creds.refresh_token,
      expiry_date: creds.expiry_date,
      token_type: creds.token_type,
    });

    // Refresh if token is expired or about to expire (5 min buffer)
    if (creds.expiry_date < Date.now() + 300_000) {
      this.logger.debug(`Refreshing Google token for tenant ${tenantId}`);
      const { credentials: newTokens } = await client.refreshAccessToken();

      const updated: StoredCredentials = {
        access_token: newTokens.access_token!,
        refresh_token: newTokens.refresh_token ?? creds.refresh_token,
        expiry_date: newTokens.expiry_date ?? Date.now() + 3600_000,
        token_type: newTokens.token_type ?? 'Bearer',
      };

      // Persist refreshed tokens to all Google service keys
      const allKeys = ['google-calendar', 'google-sheets', 'google-drive'];
      for (const key of allKeys) {
        await this.prisma.integration
          .update({
            where: { tenantId_serviceKey: { tenantId, serviceKey: key } },
            data: {
              credentials: updated as unknown as Prisma.InputJsonValue,
            },
          })
          .catch(() => {
            /* integration may not exist for this key */
          });
      }
    }

    return client;
  }
}
