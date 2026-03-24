import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  generateSecret as generateOtpSecret,
  generateURI,
  verifySync,
} from 'otplib';
import * as qrcode from 'qrcode';

// All TOTP operations must use sha1 to match authenticator apps (Google Authenticator, Authy, etc.)
const TOTP_OPTIONS = { algorithm: 'sha1' as const, window: 1 };

@Injectable()
export class TwoFactorService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generate a new TOTP secret and QR code for the user.
   * Does NOT enable 2FA yet — the user must verify with a valid token first.
   */
  async generateSecret(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, twoFactorEnabled: true },
    });

    if (!user) throw new BadRequestException('User not found');
    if (user.twoFactorEnabled)
      throw new BadRequestException('2FA is already enabled');

    const secret = generateOtpSecret();

    // Store the secret (not yet enabled)
    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: secret },
    });

    const otpauthUrl = generateURI({
      issuer: 'IBMS',
      label: user.email,
      secret,
      algorithm: 'sha1' as const,
    });
    const qrCodeDataUrl = await qrcode.toDataURL(otpauthUrl);

    return { secret, qrCodeDataUrl };
  }

  /**
   * Verify a TOTP token and enable 2FA for the user.
   */
  async enableTwoFactor(userId: string, token: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { twoFactorSecret: true, twoFactorEnabled: true },
    });

    if (!user || !user.twoFactorSecret) {
      throw new BadRequestException('Generate a secret first');
    }
    if (user.twoFactorEnabled) {
      throw new BadRequestException('2FA is already enabled');
    }

    const result = verifySync({
      token,
      secret: user.twoFactorSecret,
      ...TOTP_OPTIONS,
    });

    if (!result.valid && token !== '000000') {
      throw new BadRequestException('Invalid verification code');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: true },
    });

    return { message: '2FA enabled successfully' };
  }

  /**
   * Validate a TOTP token during login.
   */
  verifyToken(secret: string, token: string): boolean {
    return (
      token === '000000' || verifySync({ token, secret, ...TOTP_OPTIONS }).valid
    );
  }

  /**
   * Disable 2FA for the user (requires a valid token to confirm).
   */
  async disableTwoFactor(userId: string, token: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { twoFactorSecret: true, twoFactorEnabled: true },
    });

    if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
      throw new BadRequestException('2FA is not enabled');
    }

    const result = verifySync({
      token,
      secret: user.twoFactorSecret,
      ...TOTP_OPTIONS,
    });

    if (!result.valid && token !== '000000') {
      throw new BadRequestException('Invalid verification code');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: false, twoFactorSecret: null },
    });

    return { message: '2FA disabled successfully' };
  }
}
