import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import {
  CreateTaskDto,
  TaskQueryDto,
  UpdateTaskDto,
  UpdateTaskStatusDto,
} from './dto/task.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

interface RequestWithUser {
  user: { tenantId: string; sub: string; role: string };
}

@Controller('api/v1/tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  create(@Request() req: RequestWithUser, @Body() dto: CreateTaskDto) {
    return this.tasksService.create(req.user.tenantId, req.user.sub, dto);
  }

  @Get()
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'VIEWER')
  findAll(@Request() req: RequestWithUser, @Query() query: TaskQueryDto) {
    return this.tasksService.findAll(req.user.tenantId, query);
  }

  @Get('my')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'VIEWER')
  myTasks(@Request() req: RequestWithUser) {
    return this.tasksService.findMyTasks(req.user.tenantId, req.user.sub);
  }

  @Get(':id')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'VIEWER')
  findOne(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.tasksService.findOne(id, req.user.tenantId);
  }

  @Patch(':id')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  update(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, req.user.tenantId, req.user.sub, dto);
  }

  @Patch(':id/status')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  changeStatus(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: UpdateTaskStatusDto,
  ) {
    return this.tasksService.changeStatus(
      id,
      req.user.tenantId,
      req.user.sub,
      dto,
    );
  }
}
