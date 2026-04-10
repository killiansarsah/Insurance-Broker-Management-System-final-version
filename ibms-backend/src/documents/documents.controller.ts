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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto, UpdateDocumentDto } from './dto/document.dto';
import { DocumentQueryDto } from './dto/document-query.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import type { RequestWithUser } from '../common/types/request.types.js';

const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/jpg',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

const documentStorage = diskStorage({
  destination: join(process.cwd(), 'uploads'),
  filename: (_req, file, cb) => {
    const uniqueName = `${randomUUID()}${extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

function documentFileFilter(
  _req: any,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) {
  if (!ALLOWED_DOCUMENT_TYPES.includes(file.mimetype)) {
    return cb(
      new BadRequestException(
        'Invalid file type. Only PDF, JPG, PNG, and DOC files are allowed.',
      ),
      false,
    );
  }
  cb(null, true);
}

@Controller('documents')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @Roles('ADMINISTRATOR', 'AGENT')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: documentStorage,
      limits: { fileSize: MAX_FILE_SIZE },
      fileFilter: documentFileFilter,
    }),
  )
  uploadDocument(
    @Request() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');
    
    // Return the generated metadata for the uploaded file
    return {
      name: file.originalname,
      fileUrl: `/uploads/${file.filename}`,
      fileSize: file.size,
      mimeType: file.mimetype,
    };
  }

  @Post()
  @Roles('ADMINISTRATOR', 'AGENT')
  create(@Request() req: RequestWithUser, @Body() dto: CreateDocumentDto) {
    return this.documentsService.create(req.user.tenantId, req.user.sub, dto);
  }

  @Get()
  @Roles('ADMINISTRATOR', 'AGENT')
  findAll(@Request() req: RequestWithUser, @Query() query: DocumentQueryDto) {
    return this.documentsService.findAll(
      req.user.tenantId,
      req.user.sub,
      query,
    );
  }

  @Get(':id')
  @Roles('ADMINISTRATOR', 'AGENT')
  findOne(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.documentsService.findOne(id, req.user.tenantId, req.user.sub);
  }

  @Patch(':id')
  @Roles('ADMINISTRATOR', 'AGENT')
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
  @Roles('ADMINISTRATOR')
  remove(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.documentsService.remove(id, req.user.tenantId, req.user.sub);
  }
}
