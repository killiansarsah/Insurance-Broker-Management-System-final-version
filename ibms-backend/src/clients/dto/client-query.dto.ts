import { IsEnum, IsString, IsOptional } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import {
  ClientType,
  ClientStatus,
  KycStatus,
  AmlRiskLevel,
} from '@prisma/client';

export class ClientQueryDto extends PaginationDto {
  @IsEnum(ClientType)
  @IsOptional()
  type?: ClientType;

  @IsEnum(ClientStatus)
  @IsOptional()
  status?: ClientStatus;

  @IsEnum(KycStatus)
  @IsOptional()
  kycStatus?: KycStatus;

  @IsEnum(AmlRiskLevel)
  @IsOptional()
  amlRiskLevel?: AmlRiskLevel;

  @IsString()
  @IsOptional()
  region?: string;
}
