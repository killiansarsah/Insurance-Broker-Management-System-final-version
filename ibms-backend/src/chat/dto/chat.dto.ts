import { IsString, IsEnum, IsOptional, IsUUID, IsArray } from 'class-validator';
import { ChatRoomType } from '@prisma/client';

export class CreateChatRoomDto {
  @IsEnum(ChatRoomType)
  type!: ChatRoomType;

  @IsString()
  @IsOptional()
  name?: string;

  @IsArray()
  @IsUUID('4', { each: true })
  participantIds!: string[];
}

export class AddParticipantDto {
  @IsUUID()
  userId!: string;
}
