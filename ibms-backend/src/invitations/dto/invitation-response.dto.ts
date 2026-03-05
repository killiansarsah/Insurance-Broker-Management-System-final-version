export class InvitationResponseDto {
  id!: string;
  email!: string;
  role!: string;
  status!: string;
  branchId!: string | null;
  invitedByName!: string;
  expiresAt!: Date;
  acceptedAt!: Date | null;
  createdAt!: Date;
}
