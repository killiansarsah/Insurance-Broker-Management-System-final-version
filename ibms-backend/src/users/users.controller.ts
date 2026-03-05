import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Param,
  Body,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UserQueryDto } from './dto/user-query.dto.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../common/decorators/current-user.decorator.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { ROLE_LEVEL } from '../common/constants/role-hierarchy.js';

@Controller('users')
export class UsersController {
  constructor(private users: UsersService) { }

  @Get()
  @Roles('TENANT_ADMIN', 'ADMIN')
  async findAll(
    @Query() query: UserQueryDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.users.findAll(user.tenantId, query);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    // Admin+ can view anyone, non-admin can only view self
    const isAdmin = (ROLE_LEVEL[user.role] ?? 0) >= (ROLE_LEVEL['ADMIN'] ?? 0);
    if (!isAdmin && id !== user.sub) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return this.users.findOne(id, user.tenantId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    // Determine target: self or other user
    const isAdmin = (ROLE_LEVEL[user.role] ?? 0) >= (ROLE_LEVEL['ADMIN'] ?? 0);
    const isSelf = id === user.sub;

    // Non-admin can only update themselves
    if (!isAdmin && !isSelf) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return this.users.update(id, user.tenantId, user.sub, user.role, dto);
  }

  @Post(':id/deactivate')
  @Roles('TENANT_ADMIN', 'ADMIN')
  async deactivate(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.users.deactivate(id, user.tenantId, user.sub);
  }

  @Post(':id/reactivate')
  @Roles('TENANT_ADMIN', 'ADMIN')
  async reactivate(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.users.reactivate(id, user.tenantId, user.sub);
  }

  @Delete(':id')
  @Roles('TENANT_ADMIN', 'ADMIN')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.users.softDelete(id, user.tenantId, user.sub);
  }

  @Patch(':id/department')
  @Roles('TENANT_ADMIN', 'ADMIN')
  async assignDepartment(
    @Param('id') id: string,
    @Body() body: { departmentId: string | null },
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.users.assignDepartment(
      id,
      user.tenantId,
      user.sub,
      body.departmentId ?? null,
    );
  }
}
