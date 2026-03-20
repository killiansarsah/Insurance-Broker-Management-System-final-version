import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import { AdminController } from './admin.controller.js';

@Module({
  imports: [PrismaModule],
  providers: [UsersService],
  controllers: [UsersController, AdminController],
  exports: [UsersService],
})
export class UsersModule {}
