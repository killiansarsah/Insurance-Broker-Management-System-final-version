import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class TasksReminderService {
  private readonly logger = new Logger(TasksReminderService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleTaskReminders() {
    const now = new Date();

    // Find tasks that are due, not completed, and haven't had a reminder sent yet
    const dueTasks = await this.prisma.task.findMany({
      where: {
        dueDate: {
          lte: now,
        },
        status: {
          not: 'REGISTERED', // REGISTERED is the "Done" status in this schema
        },
        reminderSent: false,
        assignedToId: {
          not: null,
        },
      },
      include: {
        assignedTo: true,
      },
    });

    if (dueTasks.length === 0) return;

    this.logger.log(`Found ${dueTasks.length} due tasks for reminders`);

    for (const task of dueTasks) {
      try {
        // Create a system notification
        await this.notificationsService.create(task.tenantId, {
          userId: task.assignedToId!,
          title: 'Task Due: ' + task.title,
          message: `The deadline for your task "${task.title}" has arrived. Please take action.`,
          type: 'FOLLOWUP',
          priority: 'HIGH',
          link: `/dashboard/tasks?id=${task.id}`,
        });

        // Mark reminder as sent
        await this.prisma.task.update({
          where: { id: task.id },
          data: {
            reminderSent: true,
            reminderSentAt: now,
          },
        });

        this.logger.debug(`Sent reminder for task ${task.id} to user ${task.assignedToId}`);
      } catch (error) {
        this.logger.error(`Failed to send reminder for task ${task.id}: ${error.message}`);
      }
    }
  }
}
