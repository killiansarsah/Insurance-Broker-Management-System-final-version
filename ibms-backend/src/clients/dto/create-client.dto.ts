import {
  IsEnum,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { ClientType, Gender } from '@prisma/client';

export class CreateClientDto {
  @IsEnum(ClientType)
  @IsNotEmpty()
  type!: ClientType;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  companyName?: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsString()
  @IsOptional()
  alternatePhone?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  region?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  digitalAddress?: string;

  @IsString()
  @IsOptional()
  postalAddress?: string;

  @IsString()
  @IsOptional()
  ghanaCardNumber?: string;

  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsString()
  @IsOptional()
  nationality?: string;

  @IsString()
  @IsOptional()
  maritalStatus?: string;

  @IsString()
  @IsOptional()
  occupation?: string;

  @IsString()
  @IsOptional()
  employerName?: string;

  @IsString()
  @IsOptional()
  employerAddress?: string;

  @IsString()
  @IsOptional()
  sourceOfFunds?: string;

  @IsString()
  @IsOptional()
  purposeOfRelationship?: string;

  @IsString()
  @IsOptional()
  expectedVolume?: string;

  @IsString()
  @IsOptional()
  preferredCommunication?: string;

  @IsString()
  @IsOptional()
  tin?: string;

  @IsString()
  @IsOptional()
  registrationNumber?: string;

  @IsDateString()
  @IsOptional()
  dateOfIncorporation?: string;

  @IsString()
  @IsOptional()
  industry?: string;

  @IsString()
  @IsOptional()
  contactPerson?: string;

  @IsString()
  @IsOptional()
  contactPersonPhone?: string;

  @IsBoolean()
  @IsOptional()
  isPep?: boolean;

  @IsBoolean()
  @IsOptional()
  eddRequired?: boolean;

  // Inline next-of-kin (created after client)
  @IsString()
  @IsOptional()
  nextOfKinName?: string;

  @IsString()
  @IsOptional()
  nextOfKinRelationship?: string;

  @IsString()
  @IsOptional()
  nextOfKinPhone?: string;

  @IsString()
  @IsOptional()
  nextOfKinAddress?: string;

  // Inline bank details (created after client)
  @IsString()
  @IsOptional()
  bankName?: string;

  @IsString()
  @IsOptional()
  bankAccountName?: string;

  @IsString()
  @IsOptional()
  bankAccountNumber?: string;

  @IsString()
  @IsOptional()
  bankBranch?: string;
}
