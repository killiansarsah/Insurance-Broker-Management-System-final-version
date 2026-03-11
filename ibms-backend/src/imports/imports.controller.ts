import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import type { RequestWithUser } from '../common/types/request.types.js';
import { ImportsService } from './imports.service';
import type { ImportDataType } from './dto/import.dto';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

@Controller('imports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ImportsController {
  constructor(private readonly importsService: ImportsService) {}

  @Post()
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_FILE_SIZE },
      fileFilter: (_req, file, cb) => {
        const allowed = [
          'text/csv',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/json',
          'text/plain',
        ];
        if (
          allowed.includes(file.mimetype) ||
          file.originalname.match(/\.(csv|xlsx|xls|json)$/i)
        ) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              'Only CSV, XLSX, and JSON files are accepted',
            ),
            false,
          );
        }
      },
    }),
  )
  async importFile(
    @Request() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
    @Body('dataType') dataType: ImportDataType,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!dataType) {
      throw new BadRequestException(
        'dataType is required (clients, policies, claims, leads, invoices, commissions, or all)',
      );
    }

    return this.importsService.processFile(
      req.user.tenantId,
      req.user.sub,
      file,
      dataType,
    );
  }
}
