import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

interface RequestWithUser {
  user: { tenantId: string; sub: string; role: string };
}

@Controller('api/v1/departments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  @Roles('TENANT_ADMIN')
  create(@Request() req: RequestWithUser, @Body() dto: CreateDepartmentDto) {
    return this.departmentsService.create(req.user.tenantId, req.user.sub, dto);
  }

  @Get()
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'VIEWER')
  findAll(@Request() req: RequestWithUser) {
    return this.departmentsService.findAll(req.user.tenantId);
  }

  @Patch(':id')
  @Roles('TENANT_ADMIN')
  update(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: UpdateDepartmentDto,
  ) {
    return this.departmentsService.update(
      id,
      req.user.tenantId,
      req.user.sub,
      dto,
    );
  }

  @Delete(':id')
  @Roles('TENANT_ADMIN')
  remove(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.departmentsService.remove(id, req.user.tenantId, req.user.sub);
  }
}
