import {
  IsString,
  IsEnum,
  IsOptional,
  IsUUID,
  IsDateString,
  IsArray,
} from 'class-validator';
import { CalendarEventType } from '@prisma/client';

export class CreateCalendarEventDto {
  @IsString()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @IsEnum(CalendarEventType)
  type!: CalendarEventType;

  @IsString()
  @IsOptional()
  location?: string;

  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  attendeeIds?: string[];
}

export class UpdateCalendarEventDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  location?: string;
}
