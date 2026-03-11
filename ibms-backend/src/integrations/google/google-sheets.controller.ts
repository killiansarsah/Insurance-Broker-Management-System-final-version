import {
  Controller,
  Post,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { GoogleSheetsService } from './google-sheets.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import type { RequestWithUser } from '../../common/types/request.types.js';

@Controller('integrations/google-sheets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GoogleSheetsController {
  constructor(private readonly sheetsService: GoogleSheetsService) {}

  @Post('export')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  export(
    @Request() req: RequestWithUser,
    @Query('type') exportType: 'clients' | 'policies' | 'claims' | 'commissions' | 'financial' | 'renewals',
    @Query('from') dateFrom?: string,
    @Query('to') dateTo?: string,
  ) {
    return this.sheetsService.exportToSheets(
      req.user.tenantId,
      exportType,
      dateFrom,
      dateTo,
    );
  }
}
