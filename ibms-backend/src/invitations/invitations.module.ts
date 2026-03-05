import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { InvitationsService } from './invitations.service.js';
import { InvitationsController } from './invitations.controller.js';

@Module({
  imports: [PrismaModule, ConfigModule, AuthModule],
  providers: [InvitationsService],
  controllers: [InvitationsController],
  exports: [InvitationsService],
})
export class InvitationsModule {}
