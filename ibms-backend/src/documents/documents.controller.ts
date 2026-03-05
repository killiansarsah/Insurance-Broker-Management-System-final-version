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
import { DocumentsService } from './documents.service';
import { CreateDocumentDto, UpdateDocumentDto } from './dto/document.dto';
import { DocumentQueryDto } from './dto/document-query.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

interface RequestWithUser {
  user: { tenantId: string; sub: string; role: string };
}

@Controller('api/v1/documents')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  create(@Request() req: RequestWithUser, @Body() dto: CreateDocumentDto) {
    return this.documentsService.create(req.user.tenantId, req.user.sub, dto);
  }

  @Get()
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'VIEWER')
  findAll(@Request() req: RequestWithUser, @Query() query: DocumentQueryDto) {
    return this.documentsService.findAll(req.user.tenantId, query);
  }

  @Get(':id')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'VIEWER')
  findOne(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.documentsService.findOne(id, req.user.tenantId);
  }

  @Patch(':id')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  update(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: UpdateDocumentDto,
  ) {
    return this.documentsService.update(
      id,
      req.user.tenantId,
      req.user.sub,
      dto,
    );
  }

  @Delete(':id')
  @Roles('ADMIN', 'TENANT_ADMIN')
  remove(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.documentsService.remove(id, req.user.tenantId, req.user.sub);
  }
}
