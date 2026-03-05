import {
  IsString,
  IsUUID,
  IsEnum,
  IsOptional,
  MinLength,
} from 'class-validator';
import { ComplaintPriority } from '@prisma/client';

export class UpdateComplaintDto {
  @IsString()
  @MinLength(20)
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsEnum(ComplaintPriority)
  @IsOptional()
  priority?: ComplaintPriority;
}

export class AssignComplaintDto {
  @IsUUID()
  assignedToId!: string;
}

export class EscalateComplaintDto {
  @IsString()
  @MinLength(5)
  reason!: string;

  @IsUUID()
  escalatedToId!: string;
}

export class ResolveComplaintDto {
  @IsString()
  @MinLength(10)
  resolution!: string;

  @IsString()
  resolutionCategory!: string;
}

export class ReopenComplaintDto {
  @IsString()
  @MinLength(5)
  reason!: string;
}
