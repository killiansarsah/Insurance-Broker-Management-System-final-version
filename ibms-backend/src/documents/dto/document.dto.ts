import {
  IsString,
  IsEnum,
  IsOptional,
  IsInt,
  IsUrl,
  IsDateString,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DocumentCategory } from '@prisma/client';

export class CreateDocumentDto {
  @IsString()
  name!: string;

  @IsEnum(DocumentCategory)
  category!: DocumentCategory;

  @IsUrl()
  fileUrl!: string;

  @Type(() => Number)
  @IsInt()
  fileSize!: number;

  @IsString()
  mimeType!: string;

  @IsString()
  @IsOptional()
  linkedEntityType?: string;

  @IsString()
  @IsOptional()
  linkedEntityId?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsDateString()
  @IsOptional()
  expiresAt?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateDocumentDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  notes?: string;

  @IsEnum(DocumentCategory)
  @IsOptional()
  category?: DocumentCategory;
}
