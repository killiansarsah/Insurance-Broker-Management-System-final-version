import { IsString, IsIn, IsOptional } from 'class-validator';

export const IMPORT_DATA_TYPES = [
  'clients',
  'policies',
  'claims',
  'leads',
  'invoices',
  'commissions',
  'all',         // mixed / auto-detect from column headers
] as const;

export type ImportDataType = (typeof IMPORT_DATA_TYPES)[number];

export class ImportFileDto {
  @IsString()
  @IsIn(IMPORT_DATA_TYPES)
  dataType!: ImportDataType;

  @IsOptional()
  @IsString()
  dateFormat?: string; // e.g. 'MM/DD/YYYY', 'DD/MM/YYYY'
}
