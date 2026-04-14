import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TasksReminderService } from './tasks-reminder.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, EmailModule, NotificationsModule],
  controllers: [TasksController],
  providers: [TasksService, TasksReminderService],
  exports: [TasksService],
})
export class TasksModule {}
