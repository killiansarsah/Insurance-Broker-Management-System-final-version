import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import {
  UpdateTenantSettingsDto,
  UpdateProfileDto,
  ChangePasswordDto,
} from './dto/settings.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

interface RequestWithUser {
  user: { tenantId: string; sub: string; role: string };
}

@Controller('api/v1/settings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'VIEWER')
  getTenantSettings(@Request() req: RequestWithUser) {
    return this.settingsService.getTenantSettings(req.user.tenantId);
  }

  @Patch()
  @Roles('TENANT_ADMIN')
  updateTenantSettings(
    @Request() req: RequestWithUser,
    @Body() dto: UpdateTenantSettingsDto,
  ) {
    return this.settingsService.updateTenantSettings(
      req.user.tenantId,
      req.user.sub,
      dto,
    );
  }

  @Get('profile')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'VIEWER')
  getProfile(@Request() req: RequestWithUser) {
    return this.settingsService.getProfile(req.user.sub);
  }

  @Patch('profile')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'VIEWER')
  updateProfile(
    @Request() req: RequestWithUser,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.settingsService.updateProfile(req.user.sub, dto);
  }

  @Post('change-password')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'VIEWER')
  changePassword(
    @Request() req: RequestWithUser,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.settingsService.changePassword(
      req.user.tenantId,
      req.user.sub,
      dto,
    );
  }
}
