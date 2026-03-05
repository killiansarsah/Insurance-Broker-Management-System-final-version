import { PartialType } from '@nestjs/mapped-types';
import { CreateClientDto } from './create-client.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { ClientStatus } from '@prisma/client';

export class UpdateClientDto extends PartialType(CreateClientDto) {
  @IsEnum(ClientStatus)
  @IsOptional()
  status?: ClientStatus;
}
