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
  BadRequestException,
} from '@nestjs/common';
import { CalendarService } from './calendar.service';
import {
  CreateCalendarEventDto,
  UpdateCalendarEventDto,
} from './dto/calendar.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import type { RequestWithUser } from '../common/types/request.types.js';

@Controller('calendar/events')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post()
  @Roles('ADMINISTRATOR', 'AGENT')
  create(@Request() req: RequestWithUser, @Body() dto: CreateCalendarEventDto) {
    return this.calendarService.create(req.user.tenantId, req.user.sub, dto);
  }

  @Get()
  @Roles('ADMINISTRATOR', 'AGENT')
  findAll(
    @Request() req: RequestWithUser,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    if (!from || !to) {
      throw new BadRequestException(
        'from and to query parameters are required',
      );
    }
    return this.calendarService.findAll(
      req.user.tenantId,
      req.user.sub,
      from,
      to,
    );
  }

  @Get(':id')
  @Roles('ADMINISTRATOR', 'AGENT')
  findOne(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.calendarService.findOne(id, req.user.tenantId, req.user.sub);
  }

  @Patch(':id')
  @Roles('ADMINISTRATOR', 'AGENT')
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
  @Roles('ADMINISTRATOR', 'AGENT')
  remove(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.calendarService.remove(id, req.user.tenantId, req.user.sub);
  }
}
