import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
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
import { SettingsService } from './settings.service';
import {
  UpdateTenantSettingsDto,
  UpdateProfileDto,
  ChangePasswordDto,
} from './dto/settings.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import type { RequestWithUser } from '../common/types/request.types.js';

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const imageStorage = diskStorage({
  destination: join(process.cwd(), 'uploads'),
  filename: (_req, file, cb) => {
    const uniqueName = `${randomUUID()}${extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

function imageFileFilter(
  _req: any,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    return cb(
      new BadRequestException(
        'Only image files (JPEG, PNG, GIF, WebP) are allowed',
      ),
      false,
    );
  }
  cb(null, true);
}

@Controller('settings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  /** Public tax config endpoint for premium calculation */
  @Get('tax-config')
  @Roles('ADMINISTRATOR', 'AGENT')
  getTaxConfig(@Query('insuranceType') insuranceType?: string) {
    return this.settingsService.getTaxConfig(insuranceType);
  }

  @Get()
  @Roles('ADMINISTRATOR', 'AGENT')
  getTenantSettings(@Request() req: RequestWithUser) {
    return this.settingsService.getTenantSettings(
      req.user.tenantId,
      req.user.sub,
    );
  }

  @Patch()
  @Roles('ADMINISTRATOR')
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
  @Roles('ADMINISTRATOR', 'AGENT')
  getProfile(@Request() req: RequestWithUser) {
    return this.settingsService.getProfile(req.user.sub);
  }

  @Patch('profile')
  @Roles('ADMINISTRATOR', 'AGENT')
  updateProfile(
    @Request() req: RequestWithUser,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.settingsService.updateProfile(req.user.sub, dto);
  }

  @Post('change-password')
  @Roles('ADMINISTRATOR', 'AGENT')
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

  @Post('upload-avatar')
  @Roles('ADMINISTRATOR', 'AGENT')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: imageStorage,
      limits: { fileSize: MAX_FILE_SIZE },
      fileFilter: imageFileFilter,
    }),
  )
  uploadAvatar(
    @Request() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');
    return this.settingsService.saveAvatarUrl(req.user.sub, file.filename);
  }

  @Post('upload-logo')
  @Roles('ADMINISTRATOR')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: imageStorage,
      limits: { fileSize: MAX_FILE_SIZE },
      fileFilter: imageFileFilter,
    }),
  )
  uploadLogo(
    @Request() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');
    return this.settingsService.saveLogoUrl(
      req.user.tenantId,
      req.user.sub,
      file.filename,
    );
  }
}
