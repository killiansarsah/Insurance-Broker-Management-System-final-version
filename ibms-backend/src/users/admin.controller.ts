import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private prisma: PrismaService) {}

  @Get('check-super-admin')
  @Roles('PLATFORM_SUPER_ADMIN')
  async checkSuperAdmin() {
    const count = await this.prisma.user.count({
      where: { userRoleMappings: { some: { role: { name: { in: ['WORKSPACE_OWNER', 'ADMINISTRATOR', 'PLATFORM_SUPER_ADMIN', 'SUPER_ADMIN'] } } } } },
    });

    if (count === 0) {
      throw new HttpException(
        'No super admin configured',
        HttpStatus.NOT_FOUND,
      );
    }

    return { exists: true, count };
  }
}
