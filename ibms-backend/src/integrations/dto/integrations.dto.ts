import { IsString, IsBoolean, IsOptional, IsIn } from 'class-validator';

const VALID_FREQUENCIES = ['15m', '1h', '6h', '24h', 'manual'] as const;

export class ConnectIntegrationDto {
  @IsString()
  serviceKey!: string;

  @IsOptional()
  @IsString()
  apiKey?: string;

  @IsOptional()
  @IsString()
  apiSecret?: string;

  @IsOptional()
  @IsString()
  connectedEmail?: string;
}

export class UpdateIntegrationDto {
  @IsOptional()
  @IsIn(VALID_FREQUENCIES)
  syncFrequency?: string;

  @IsOptional()
  @IsString()
  webhookUrl?: string;
}

export class DisconnectIntegrationDto {
  @IsString()
  serviceKey!: string;
}
