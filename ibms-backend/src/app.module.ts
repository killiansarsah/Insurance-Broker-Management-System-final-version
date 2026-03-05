import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import configuration from './config/configuration';
import { ScheduleModule } from '@nestjs/schedule';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { InvitationsModule } from './invitations/invitations.module';
import { UsersModule } from './users/users.module';
import { ClientsModule } from './clients/clients.module';
import { CarriersModule } from './carriers/carriers.module';
import { PoliciesModule } from './policies/policies.module';
import { RenewalsModule } from './renewals/renewals.module';

@Module({
  imports: [
    // Task Scheduling
    ScheduleModule.forRoot(),

    // Config — loads and validates env vars
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env',
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env['THROTTLE_TTL'] || '60', 10) * 1000,
        limit: parseInt(process.env['THROTTLE_LIMIT'] || '100', 10),
      },
    ]),

    // Database (global)
    PrismaModule,

    // Auth
    AuthModule,

    // Phase 4: Invitations & Users
    InvitationsModule,
    UsersModule,

    // Phase 5: Clients & Carriers
    ClientsModule,
    CarriersModule,

    // Health check
    HealthModule,

    PoliciesModule,
    RenewalsModule,
  ],
  providers: [
    // Apply rate limiting globally
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
