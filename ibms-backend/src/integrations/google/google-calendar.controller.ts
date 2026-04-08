import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { GoogleCalendarService } from './google-calendar.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import type { RequestWithUser } from '../../common/types/request.types.js';

@Controller('integrations/google-calendar')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GoogleCalendarController {
  constructor(private readonly calendarService: GoogleCalendarService) {}

  @Post('push')
  @Roles('ADMINISTRATOR')
  push(@Request() req: RequestWithUser) {
    return this.calendarService.pushToGoogle(req.user.tenantId);
  }

  @Post('pull')
  @Roles('ADMINISTRATOR')
  pull(@Request() req: RequestWithUser) {
    return this.calendarService.pullFromGoogle(req.user.tenantId, req.user.sub);
  }

  @Post('sync')
  @Roles('ADMINISTRATOR')
  sync(@Request() req: RequestWithUser) {
    return this.calendarService.syncAll(req.user.tenantId, req.user.sub);
  }
}
