import { PartialType } from '@nestjs/mapped-types';
import { CreateBankDetailDto } from './create-bank-detail.dto';

export class UpdateBankDetailDto extends PartialType(CreateBankDetailDto) {}
