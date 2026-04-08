import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import type { RequestWithUser } from '../common/types/request.types';

@Controller('search')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @Roles('ADMINISTRATOR', 'AGENT')
  async search(
    @Request() req: RequestWithUser,
    @Query('q') query: string,
    @Query('limit') limit?: string,
  ) {
    return this.searchService.globalSearch(
      req.user.tenantId,
      req.user.sub,
      query,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Get('recent')
  @Roles('ADMINISTRATOR', 'AGENT')
  async getRecent(
    @Request() req: RequestWithUser,
    @Query('limit') limit?: string,
  ) {
    return this.searchService.getRecentItems(
      req.user.tenantId,
      req.user.sub,
      limit ? parseInt(limit, 10) : 5,
    );
  }
}
