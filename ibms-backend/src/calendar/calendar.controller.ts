import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CalendarService } from './calendar.service';
import {
  CreateCalendarEventDto,
  UpdateCalendarEventDto,
} from './dto/calendar.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

interface RequestWithUser {
  user: { tenantId: string; sub: string; role: string };
}

@Controller('api/v1/calendar/events')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post()
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  create(@Request() req: RequestWithUser, @Body() dto: CreateCalendarEventDto) {
    return this.calendarService.create(req.user.tenantId, req.user.sub, dto);
  }

  @Get()
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'VIEWER')
  findAll(
    @Request() req: RequestWithUser,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.calendarService.findAll(
      req.user.tenantId,
      req.user.sub,
      from,
      to,
    );
  }

  @Get(':id')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'VIEWER')
  findOne(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.calendarService.findOne(id, req.user.tenantId);
  }

  @Patch(':id')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  update(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: UpdateCalendarEventDto,
  ) {
    return this.calendarService.update(
      id,
      req.user.tenantId,
      req.user.sub,
      dto,
    );
  }

  @Delete(':id')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  remove(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.calendarService.remove(id, req.user.tenantId, req.user.sub);
  }
}
