import {
  Controller,
  Post,
  Get,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { GoogleDriveService } from './google-drive.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import type { RequestWithUser } from '../../common/types/request.types.js';

@Controller('integrations/google-drive')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GoogleDriveController {
  constructor(private readonly driveService: GoogleDriveService) {}

  @Post('mirror')
  @Roles('ADMIN', 'TENANT_ADMIN')
  mirror(@Request() req: RequestWithUser) {
    return this.driveService.mirrorDocuments(req.user.tenantId);
  }

  @Get('files')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  listFiles(
    @Request() req: RequestWithUser,
    @Query('category') category?: string,
  ) {
    return this.driveService.listDriveFiles(req.user.tenantId, category);
  }
}
