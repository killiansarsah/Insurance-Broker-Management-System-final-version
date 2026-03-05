import { PartialType } from '@nestjs/mapped-types';
import { CreateNextOfKinDto } from './create-next-of-kin.dto';

export class UpdateNextOfKinDto extends PartialType(CreateNextOfKinDto) {}
