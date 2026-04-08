import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationQueryDto } from './dto/notification.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import type { RequestWithUser } from '../common/types/request.types.js';

@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @Roles('ADMINISTRATOR', 'AGENT')
  findAll(
    @Request() req: RequestWithUser,
    @Query() query: NotificationQueryDto,
  ) {
    return this.notificationsService.findAll(
      req.user.tenantId,
      req.user.sub,
      query,
    );
  }

  @Get('unread-count')
  @Roles('ADMINISTRATOR', 'AGENT')
  unreadCount(@Request() req: RequestWithUser) {
    return this.notificationsService.unreadCount(
      req.user.tenantId,
      req.user.sub,
    );
  }

  @Patch(':id/read')
  @Roles('ADMINISTRATOR', 'AGENT')
  markRead(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.notificationsService.markRead(
      id,
      req.user.tenantId,
      req.user.sub,
    );
  }

  @Post('mark-all-read')
  @Roles('ADMINISTRATOR', 'AGENT')
  markAllRead(@Request() req: RequestWithUser) {
    return this.notificationsService.markAllRead(
      req.user.tenantId,
      req.user.sub,
    );
  }

  @Delete(':id')
  @Roles('ADMINISTRATOR', 'AGENT')
  remove(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.notificationsService.remove(
      id,
      req.user.tenantId,
      req.user.sub,
    );
  }
}
