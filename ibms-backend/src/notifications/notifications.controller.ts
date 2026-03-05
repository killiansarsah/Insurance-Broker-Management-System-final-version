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

interface RequestWithUser {
  user: { tenantId: string; sub: string; role: string };
}

@Controller('api/v1/notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'VIEWER')
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
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'VIEWER')
  unreadCount(@Request() req: RequestWithUser) {
    return this.notificationsService.unreadCount(
      req.user.tenantId,
      req.user.sub,
    );
  }

  @Patch(':id/read')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'VIEWER')
  markRead(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.notificationsService.markRead(
      id,
      req.user.tenantId,
      req.user.sub,
    );
  }

  @Post('mark-all-read')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'VIEWER')
  markAllRead(@Request() req: RequestWithUser) {
    return this.notificationsService.markAllRead(
      req.user.tenantId,
      req.user.sub,
    );
  }

  @Delete(':id')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'VIEWER')
  remove(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.notificationsService.remove(
      id,
      req.user.tenantId,
      req.user.sub,
    );
  }
}
