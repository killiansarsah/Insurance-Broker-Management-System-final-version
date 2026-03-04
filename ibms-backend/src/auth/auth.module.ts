import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { PrismaModule } from '../prisma/prisma.module.js';
import { TenantsModule } from '../tenants/tenants.module.js';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService): JwtModuleOptions => {
        const privatePath = config.get<string>('JWT_ACCESS_PRIVATE_KEY_PATH');
        const privateKey = privatePath ? fs.readFileSync(privatePath, 'utf8') : undefined;
        const expiresIn = config.get<string>('JWT_ACCESS_EXPIRY', '15m');

        return {
          privateKey,
          signOptions: {
            algorithm: 'RS256' as const,
            expiresIn: expiresIn as unknown as undefined,
          },
        } as JwtModuleOptions;
      },
      inject: [ConfigService],
    }),
    PrismaModule,
    ConfigModule,
    TenantsModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule { }
