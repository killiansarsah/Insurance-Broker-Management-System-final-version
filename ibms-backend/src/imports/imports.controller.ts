import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Param,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import type { RequestWithUser } from '../common/types/request.types.js';
import { ImportsService } from './imports.service';
import { MappingOrchestratorService } from './services/mapping-orchestrator.service';
import { PrismaService } from '../prisma/prisma.service';
import type { ImportDataType } from './dto/import.dto';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

@Controller('imports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ImportsController {
  constructor(
    private readonly importsService: ImportsService,
    private readonly orchestrator: MappingOrchestratorService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('template/:dataType')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'AGENT')
  async getTemplate(
    @Param('dataType') dataType: ImportDataType,
    @Res() res: any,
  ) {
    const buffer = await this.importsService.generateTemplate(dataType);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${dataType}_import_template.xlsx"`,
    );
    res.send(buffer);
  }

  @Post('upload')
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
  async uploadForMapping(
    @Request() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
    @Body('dataType') dataType: ImportDataType,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');
    if (!dataType) throw new BadRequestException('dataType is required');
    return this.importsService.uploadForMapping(
      req.user.tenantId,
      req.user.sub,
      file,
      dataType,
    );
  }

  @Post(':jobId/detect-mapping')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  async detectMapping(
    @Request() req: RequestWithUser,
    @Param('jobId') jobId: string,
  ) {
    const tenantId = req.user.tenantId;

    // Load the import job and verify ownership
    const job = await this.prisma.importJob.findFirst({
      where: { id: jobId, tenantId },
    });
    if (!job) {
      throw new BadRequestException('Import job not found');
    }

    // Extract headers and sample rows from stored raw file data
    const rawData = job.rawFileData as Record<string, unknown>[] | null;
    if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
      throw new BadRequestException('No file data found for this job');
    }

    const headers = Object.keys(rawData[0]);
    const sampleRows = rawData.slice(0, 3);

    // Run the AI + rule-based orchestrator
    const result = await this.orchestrator.detectMappings(
      headers,
      sampleRows,
      jobId,
      tenantId,
    );

    // Store detected mappings in the database
    await this.prisma.importJob.update({
      where: { id: jobId },
      data: {
        detectedMappings: JSON.parse(JSON.stringify(result.mappings)),
        mappingMethod: result.aiUsed
          ? result.aiCallSucceeded
            ? 'AI_HYBRID'
            : 'RULES'
          : 'RULES',
        status: 'MAPPING',
      },
    });

    // Audit log
    await this.prisma.auditLog.create({
      data: {
        tenantId,
        userId: req.user.sub,
        action: 'import.mapping.detected',
        entity: 'ImportJob',
        entityId: jobId,
        after: {
          columnsTotal: headers.length,
          columnsFromAI: result.columnsFromAI,
          columnsFromRules: result.columnsFromRules,
          unmappedCount: result.unmappedColumns.length,
          aiUsed: result.aiUsed,
          privacyNote: result.privacyNote,
        },
      },
    });

    // Return stats to frontend (never return anonymised rows or raw AI response)
    return {
      success: true,
      mappings: result.mappings,
      stats: {
        total: result.mappings.length,
        highConfidence: result.mappings.filter((m) => m.confidence === 'high').length,
        mediumConfidence: result.mappings.filter((m) => m.confidence === 'medium').length,
        lowConfidence: result.mappings.filter((m) => m.confidence === 'low').length,
        unmapped: result.unmappedColumns.length,
        aiAssisted: result.aiUsed,
      },
      privacyNote: result.privacyNote,
      unmappedColumns: result.unmappedColumns,
      processingTimeMs: result.processingTimeMs,
    };
  }

  @Post(':jobId/validate')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  async validateMapping(
    @Request() req: RequestWithUser,
    @Param('jobId') jobId: string,
    @Body('mapping') mapping: Record<string, string>,
  ) {
    return this.importsService.validateMapping(
      req.user.tenantId,
      jobId,
      mapping,
    );
  }

  @Post(':jobId/execute')
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  async executeImport(
    @Request() req: RequestWithUser,
    @Param('jobId') jobId: string,
  ) {
    return this.importsService.executeImport(
      req.user.tenantId,
      req.user.sub,
      jobId,
    );
  }

  // Legacy direct import endpoint, keeping if needed elsewhere
  @Post()
  @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 },
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
