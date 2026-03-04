import { Exclude, Expose } from 'class-transformer';

@Expose()
export class UserResponseDto {
  id!: string;
  tenantId!: string;
  email!: string;
  firstName!: string;
  lastName!: string;
  phone!: string;
  role!: string;
  branchId!: string;
  avatarUrl?: string;
  isActive!: boolean;
  lastLoginAt?: Date;
  createdAt!: Date;
}
