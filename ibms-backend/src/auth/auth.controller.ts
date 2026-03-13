import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  Get,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { ForgotPasswordDto } from './dto/forgot-password.dto.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';
import { TwoFactorService } from './two-factor.service.js';
import { Public } from '../common/decorators/public.decorator.js';
import { Throttle } from '@nestjs/throttler';
import type { Response, Request } from 'express';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../common/decorators/current-user.decorator.js';

interface CookieRequest extends Request {
  cookies: Record<string, string | undefined>;
}

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env['NODE_ENV'] === 'production',
  sameSite: 'strict' as const,
  path: '/api/v1/auth/refresh',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

@Controller('auth')
export class AuthController {
  constructor(
    private auth: AuthService,
    private twoFactor: TwoFactorService,
  ) {}

  @Public()
  @Throttle({ default: { ttl: 900000, limit: 10 } })
  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const result = await this.auth.login(
      body.email,
      body.password,
      body.tenantSlug,
      req.ip,
      req.get('user-agent'),
    );

    // If tenant selection is required, return tenant list (no tokens)
    if ('requiresTenantSelection' in result) {
      return { requiresTenantSelection: true, tenants: result.tenants };
    }

    // If 2FA is required, return challenge (no tokens)
    if ('requiresTwoFactor' in result) {
      return { requiresTwoFactor: true, userId: result.userId, tenantId: result.tenantId };
    }

    res.cookie('refreshToken', result.refreshRaw, REFRESH_COOKIE_OPTIONS);
    return { accessToken: result.accessToken, user: result.user };
  }

  @Public()
  @Throttle({ default: { ttl: 900000, limit: 10 } })
  @Post('login/2fa')
  @HttpCode(200)
  async loginWith2fa(
    @Body() body: { userId: string; tenantId: string; token: string },
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    // Verify the TOTP token
    const user = await this.auth.getProfile(body.userId);
    if (!user) {
      return { error: 'Invalid credentials' };
    }

    const dbUser = await this.auth['prisma'].user.findUnique({
      where: { id: body.userId },
      select: { twoFactorSecret: true, twoFactorEnabled: true },
    });

    if (!dbUser?.twoFactorEnabled || !dbUser.twoFactorSecret) {
      return { error: 'Invalid credentials' };
    }

    const isValid = this.twoFactor.verifyToken(dbUser.twoFactorSecret, body.token);
    if (!isValid) {
      return { error: 'Invalid verification code' };
    }

    const result = await this.auth.completeTwoFactorLogin(
      body.userId,
      body.tenantId,
      req.ip,
      req.get('user-agent'),
    );

    res.cookie('refreshToken', result.refreshRaw, REFRESH_COOKIE_OPTIONS);
    return { accessToken: result.accessToken, user: result.user };
  }

  @Public()
  @Post('refresh')
  @HttpCode(200)
  async refresh(
    @Req() req: CookieRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const raw = req.cookies['refreshToken'];
    const result = await this.auth.refreshTokens(
      raw,
      req.ip,
      req.get('user-agent'),
    );
    res.cookie('refreshToken', result.refreshRaw, REFRESH_COOKIE_OPTIONS);
    return { accessToken: result.accessToken, user: result.user };
  }

  @Post('logout')
  async logout(
    @Req() req: CookieRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const raw = req.cookies['refreshToken'];
    await this.auth.logout(raw);
    res.clearCookie('refreshToken', { path: '/api/v1/auth/refresh' });
    return { success: true };
  }

  @Get('me')
  async me(@CurrentUser() user: AuthenticatedUser) {
    return this.auth.getProfile(user.sub);
  }

  @Public()
  @Throttle({ default: { ttl: 3600000, limit: 5 } })
  @Post('forgot-password')
  async forgot(@Body() body: ForgotPasswordDto) {
    return this.auth.forgotPassword(body.email, body.tenantSlug);
  }

  @Public()
  @Post('reset-password')
  async reset(
    @Body() body: ResetPasswordDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.auth.resetPassword(body.token, body.newPassword);
    // Clear the old refresh token cookie so stale tokens don't cause
    // immediate logout after the user logs back in with their new password
    res.clearCookie('refreshToken', { path: '/api/v1/auth/refresh' });
    return result;
  }
}
