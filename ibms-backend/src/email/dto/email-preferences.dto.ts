import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateEmailPreferencesDto {
  @IsOptional()
  @IsBoolean()
  policyRenewal?: boolean;

  @IsOptional()
  @IsBoolean()
  claimUpdates?: boolean;

  @IsOptional()
  @IsBoolean()
  taskAssignments?: boolean;

  @IsOptional()
  @IsBoolean()
  systemNotifications?: boolean;

  @IsOptional()
  @IsBoolean()
  marketingEmails?: boolean;
}

export class EmailLogQueryDto {
  @IsOptional()
  page?: number = 1;

  @IsOptional()
  limit?: number = 20;

  @IsOptional()
  status?: string;

  @IsOptional()
  templateName?: string;

  @IsOptional()
  recipientEmail?: string;

  @IsOptional()
  dateFrom?: string;

  @IsOptional()
  dateTo?: string;
}