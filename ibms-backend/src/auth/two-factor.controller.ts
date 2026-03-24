import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { TwoFactorService } from './two-factor.service.js';

interface AuthRequest {
  user: { sub: string; tenantId: string; role: string };
}

@ApiTags('Two-Factor Authentication')
@ApiBearerAuth('JWT-auth')
@Controller('auth/2fa')
@UseGuards(JwtAuthGuard)
export class TwoFactorController {
  constructor(private readonly twoFactor: TwoFactorService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate a new TOTP secret and QR code' })
  async generate(@Request() req: AuthRequest) {
    return this.twoFactor.generateSecret(req.user.sub);
  }

  @Post('enable')
  @HttpCode(200)
  @ApiOperation({ summary: 'Verify TOTP token and enable 2FA' })
  async enable(@Request() req: AuthRequest, @Body() body: { token: string }) {
    return this.twoFactor.enableTwoFactor(req.user.sub, body.token);
  }

  @Post('disable')
  @HttpCode(200)
  @ApiOperation({ summary: 'Disable 2FA (requires valid token)' })
  async disable(@Request() req: AuthRequest, @Body() body: { token: string }) {
    return this.twoFactor.disableTwoFactor(req.user.sub, body.token);
  }
}
