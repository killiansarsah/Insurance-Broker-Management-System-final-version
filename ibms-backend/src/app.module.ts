import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { CsrfMiddleware } from './common/middleware/csrf.middleware';
import { RequestIdInterceptor } from './common/interceptors/request-id.interceptor';
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
import { ClaimsModule } from './claims/claims.module';
import { ComplaintsModule } from './complaints/complaints.module';
import { FinanceModule } from './finance/finance.module';
import { LeadsModule } from './leads/leads.module';
import { DocumentsModule } from './documents/documents.module';
import { TasksModule } from './tasks/tasks.module';
import { CalendarModule } from './calendar/calendar.module';
import { ApprovalsModule } from './approvals/approvals.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ChatModule } from './chat/chat.module';
import { ReportsModule } from './reports/reports.module';
import { ComplianceModule } from './compliance/compliance.module';
import { AuditModule } from './audit/audit.module';
import { DepartmentsModule } from './departments/departments.module';
import { SettingsModule } from './settings/settings.module';
import { EmailModule } from './email/email.module';
import { QuotesModule } from './quotes/quotes.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { ImportsModule } from './imports/imports.module';

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

    // Structured logging (JSON in production, pretty in development)
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isProduction = config.get<string>('nodeEnv') === 'production';
        return {
          pinoHttp: {
            level: config.get<string>('logLevel', 'info'),
            transport: isProduction
              ? undefined
              : { target: 'pino-pretty', options: { colorize: true, singleLine: true } },
            autoLogging: { ignore: (req: { url?: string }) => req.url === '/api/v1/health' },
          },
        };
      },
    }),

    // Database (global)
    PrismaModule,

    // Email (global)
    EmailModule,

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

    // Phase 6: Policies, Renewals & Quotes
    PoliciesModule,
    RenewalsModule,
    QuotesModule,

    // Phase 7: Claims & Complaints
    ClaimsModule,
    ComplaintsModule,

    // Phase 8: Finance
    FinanceModule,

    // Phase 9: Leads, Documents, Tasks, Calendar, Approvals, Notifications
    LeadsModule,
    DocumentsModule,
    TasksModule,
    CalendarModule,
    ApprovalsModule,
    NotificationsModule,

    // Phase 10: Chat, Reports, Compliance, Audit, Departments, Settings
    ChatModule,
    ReportsModule,
    ComplianceModule,
    AuditModule,
    DepartmentsModule,
    SettingsModule,
    IntegrationsModule,
    ImportsModule,
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
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestIdInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CsrfMiddleware).forRoutes('*');
  }
}
