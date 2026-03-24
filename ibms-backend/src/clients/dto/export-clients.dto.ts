import { IsString, IsEnum, IsOptional, IsObject } from 'class-validator';
import { ClientQueryDto } from './client-query.dto';

export enum ExportType {
  FULL = 'FULL',
  BASIC = 'BASIC',
  KYC = 'KYC',
  FINANCE = 'FINANCE',
  FILTERED = 'FILTERED',
}

export enum ExportFormat {
  XLSX = 'XLSX',
  CSV = 'CSV',
}

export class ExportClientsDto {
  @IsEnum(ExportType)
  exportType: ExportType;

  @IsEnum(ExportFormat)
  format: ExportFormat;

  @IsObject()
  @IsOptional()
  filters?: ClientQueryDto & { startDate?: string; endDate?: string };
}
