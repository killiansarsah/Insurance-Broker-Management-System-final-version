import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { GoogleOAuthService } from './google-oauth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import type { RequestWithUser } from '../../common/types/request.types.js';

@Controller('integrations/google')
export class GoogleOAuthController {
  constructor(
    private readonly googleOAuth: GoogleOAuthService,
    private readonly config: ConfigService,
  ) {}

  /** GET /integrations/google/auth-url — returns the Google consent URL */
  @Get('auth-url')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMINISTRATOR')
  getAuthUrl(@Request() req: RequestWithUser) {
    const url = this.googleOAuth.getConsentUrl(req.user.tenantId);
    return { url };
  }

  /**
   * GET /integrations/google/callback — Google redirects here after consent.
   * Exchanges code for tokens, stores them, and redirects to the frontend.
   */
  @Get('callback')
  @Public()
  async handleCallback(
    @Query('code') code: string,
    @Query('state') tenantId: string,
    @Query('error') error: string,
    @Res() res: Response,
  ) {
    const frontendUrl = this.config.get<string>('frontendUrl');

    if (error) {
      return res.redirect(
        `${frontendUrl}/dashboard/integrations?google=error&reason=${encodeURIComponent(error)}`,
      );
    }

    if (!code || !tenantId) {
      throw new BadRequestException('Missing code or state parameter');
    }

    try {
      const result = await this.googleOAuth.handleCallback(code, tenantId);
      return res.redirect(
        `${frontendUrl}/dashboard/integrations?google=success&email=${encodeURIComponent(result.email ?? '')}`,
      );
    } catch (err: any) {
      return res.redirect(
        `${frontendUrl}/dashboard/integrations?google=error&reason=${encodeURIComponent(err.message ?? 'Unknown error')}`,
      );
    }
  }
}
