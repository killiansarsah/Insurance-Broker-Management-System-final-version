import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
      ],
    });

    // Soft-delete middleware: filter out deleted records by default
    this.$use(async (params, next) => {
      const modelsWithSoftDelete = [
        'User',
        'Client',
        'Policy',
        'Claim',
        'Lead',
        'Carrier',
      ];

      if (modelsWithSoftDelete.includes(params.model ?? '')) {
        // Override find queries to exclude soft-deleted records
        if (params.action === 'findUnique' || params.action === 'findFirst') {
          params.action = 'findFirst';
          params.args = params.args ?? {};
          if (params.args.where) {
            if (params.args.where.deletedAt === undefined) {
              params.args.where.deletedAt = null;
            }
          } else {
            params.args.where = { deletedAt: null };
          }
        }

        if (params.action === 'findMany') {
          params.args = params.args ?? {};
          if (params.args.where) {
            if (params.args.where.deletedAt === undefined) {
              params.args.where.deletedAt = null;
            }
          } else {
            params.args.where = { deletedAt: null };
          }
        }

        // Override delete to soft-delete
        if (params.action === 'delete') {
          params.action = 'update';
          params.args.data = { deletedAt: new Date() };
        }

        if (params.action === 'deleteMany') {
          params.action = 'updateMany';
          if (params.args.data) {
            params.args.data.deletedAt = new Date();
          } else {
            params.args.data = { deletedAt: new Date() };
          }
        }
      }

      return next(params);
    });
  }

  async onModuleInit(): Promise<void> {
    this.logger.log('Connecting to PostgreSQL...');
    await this.$connect();
    this.logger.log('Connected to PostgreSQL');
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('Disconnecting from PostgreSQL...');
    await this.$disconnect();
    this.logger.log('Disconnected from PostgreSQL');
  }
}
